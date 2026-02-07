import React, { useEffect } from 'react'; // ✅ เพิ่ม useEffect
import { useCombatState } from './useCombatState'; 
import { calculatePlayerDamage, calculateMonsterAttack } from '../utils/combatUtils';
import { calculateLoot } from '../utils/lootUtils';
import { passiveEffects } from '../data/skillEffects';
import { createDropItem } from '../utils/inventoryUtils';
import { useMonsterAI } from './useMonsterAI';
import { useStatusEffects } from './useStatusEffects';
import { activeEffects } from '../data/skillEffects';
import { getPassiveBonus } from '../utils/characterUtils';

// ✅ นำเข้า Firebase
import { ref, update, increment, onValue } from "firebase/database"; // ✅ เพิ่ม onValue
import { db } from "../firebase"; 

/**
 * Custom Hook สำหรับจัดการระบบต่อสู้ (Combat Logic)
 */
export function useCombat(player, setPlayer, setLogs, advanceDungeon, exitDungeon, inDungeon, allSkills, mapControls) { 
  
  // ดึง State พื้นฐานของการต่อสู้มาจาก useCombatState
  const {
    isCombat, setIsCombat,
    addDamageText,
    damageTexts,
    enemy, setEnemy,
    lootResult, setLootResult,
    monsterSkillUsed, setMonsterSkillUsed,
    turnCount, setTurnCount,
    combatPhase, setCombatPhase, 
    resetCombatState,
    addSkillText,
    skillTexts
  } = useCombatState();

  // เรียกใช้ระบบ AI มอนสเตอร์ และระบบ Status Effect (Buff/Debuff)
  const { getMonsterAction } = useMonsterAI();
  const { activeStatuses, applyStatus, processTurn, clearAllStatuses } = useStatusEffects(setPlayer, setLogs, addDamageText);
  
  // ✅ ดึง worldEvent ออกมาจาก mapControls
  const { currentMap, setCurrentMap, gameState, setGameState, worldEvent } = mapControls || {};

  // --- [NEW] Real-time HP & Victory Synchronization ---
  useEffect(() => {
    // 🐉 ตรวจสอบเฉพาะตอนกำลังสู้ World Boss
    if (isCombat && enemy?.type === 'WORLD_BOSS') {
      const bossRef = ref(db, 'worldEvent');
      
      const unsubscribe = onValue(bossRef, (snapshot) => {
        const data = snapshot.val();
        if (data) {
          // 1. อัปเดตเลือดในเครื่องให้ตรงกับ Server (กรณีคนอื่นช่วยตี)
          setEnemy(prev => {
            if (!prev) return null;
            // ป้องกันการอัปเดตถ้า HP ตรงกันอยู่แล้วเพื่อลด Re-render
            if (prev.hp === data.currentHp) return prev;
            return { ...prev, hp: data.currentHp };
          });

          // 2. ถ้าบอสพ่ายแพ้ในเซิร์ฟเวอร์แล้ว (HP หมด หรือ Active เป็น false)
          if ((data.currentHp <= 0 || data.active === false) && combatPhase !== 'VICTORY' && combatPhase !== 'IDLE') {
            console.log("📢 World Boss Defeated by global players!");
            executeVictory();
            if (setGameState) setGameState('MAP_SELECTION');
          }
        }
      });

      return () => unsubscribe();
    }
  }, [isCombat, enemy?.type, combatPhase]); // Dependencies สำหรับการ Sync

  /**
   * คำนวณค่า Atk และ Def สุทธิหลังจากคำนวณ Buff/Debuff แล้ว
   */
  const getNetStats = () => {
    let atkMod = 0;
    let defMod = 0;
    activeStatuses.forEach(status => {
      if (status.target === 'player' || !status.target) {
        if (status.type === 'BUFF_ATK') atkMod += (status.value || 0);
        if (status.type === 'DEBUFF_ATK') atkMod -= (status.value || 0);
        if (status.type === 'BUFF_DEF') defMod += (status.value || 0);
        if (status.type === 'DEBUFF_DEF') defMod -= (status.value || 0);
      }
    });
    return {
      netAtk: Math.max(1, (player.finalAtk || player.atk) + atkMod),
      netDef: Math.max(0, (player.finalDef || player.def) + defMod)
    };
  };

  const { netAtk, netDef } = getNetStats();

  /**
   * จัดการการเลือกแผนที่และเริ่มการสำรวจ
   */
  const handleSelectMap = (map) => {
    if (setCurrentMap) setCurrentMap(map);          
    if (setGameState) setGameState('EXPLORING');   
    setLogs(prev => [`📍 เริ่มการเดินทางสู่: ${map.name}`, ...prev].slice(0, 10));
  };

  /**
   * จัดการกรณีผู้เล่นพ่ายแพ้ (HP <= 0)
   */
  const handleGameOver = () => {
    if (exitDungeon) exitDungeon();
    setLogs(prev => ["💀 คุณพ่ายแพ้สลบไป...", ...prev].slice(0, 5));
    setTimeout(() => {
      finishCombat();
      setPlayer(prev => {
        const recoveredHp = player.finalMaxHp || player.maxHp; 
        return { ...prev, hp: recoveredHp };
      });
    }, 2000);
  };

  /**
   * ฟังก์ชันสำหรับเริ่มการต่อสู้กับมอนสเตอร์
   */
  const startCombat = (monster) => {
    resetCombatState(); 
    setEnemy({ ...monster });
    setIsCombat(true);
    setCombatPhase('PLAYER_TURN'); 
    const shinyTag = monster.isShiny ? "✨ [SHINY] " : "";
    const msg = monster.isBoss ? `🔥 [BOSS] !!! เผชิญหน้ากับ ${monster.name} !!!` : `🚨 ${shinyTag}เผชิญหน้ากับ ${monster.name}!`;
    setLogs(prev => [msg, ...prev].slice(0, 8));
  };

  /**
   * จบการต่อสู้และล้างสถานะต่างๆ
   */
  const finishCombat = () => {
    const isBossDefeated = enemy && (enemy.isBoss || enemy.id === inDungeon?.bossId);
    clearAllStatuses();
    setIsCombat(false);
    setEnemy(null);
    setCombatPhase('IDLE'); 
    setLootResult(null); 
    if (isBossDefeated && typeof exitDungeon === 'function') {
      exitDungeon(); 
      setLogs(prev => [`🎉 [VICTORY] พิชิตดันเจี้ยนสำเร็จ!`, ...prev].slice(0, 10));
    }
  };

  const lastDamageTime = React.useRef(0);

  /**
   * ลอจิกหลักเมื่อผู้เล่นกดปุ่มโจมตี
   */
  const handleAttack = () => {
    const now = Date.now();
    if (now - lastDamageTime.current < 250) return; 
    if (combatPhase !== 'PLAYER_TURN' || !enemy || enemy.hp <= 0 || player.hp <= 0 || lootResult) return;

    processTurn(); 
    if (player.hp <= 0) {
        setCombatPhase('DEFEAT');
        setTimeout(() => handleGameOver(), 800);
        return;
    }

    const playerWithStats = { ...player, atk: netAtk };
    setCombatPhase('ENEMY_TURN'); 
    const nextTurnValue = turnCount + 1;
    setTurnCount(nextTurnValue);

    // คำนวณดาเมจที่ผู้เล่นทำได้
    const playerDmg = calculatePlayerDamage(playerWithStats, enemy);
    const newMonsterHp = Math.max(0, enemy.hp - playerDmg);

    // ✅ [NEW] อัปเดตข้อมูล World Boss ไปยัง Server
    if (enemy.type === 'WORLD_BOSS') {
      const playerName = player.name || 'Anonymous';
      const bossRef = ref(db, 'worldEvent');
      const isNewParticipant = !worldEvent?.damageDealers?.[playerName];

      update(bossRef, {
        currentHp: increment(-playerDmg),
        [`damageDealers/${playerName}`]: increment(playerDmg),
        participants: isNewParticipant ? increment(1) : increment(0)
      });
    }

    // ลอจิกสะท้อนดาเมจของมอนสเตอร์ (ถ้ามี)
    const reflectStatus = activeStatuses.find(s => s.type === 'REFLECT_SHIELD' && s.target === 'monster');
    if (reflectStatus && playerDmg > 0) {
      const reflectedToPlayer = Math.ceil(playerDmg * reflectStatus.value);
      setPlayer(prev => ({ ...prev, hp: Math.max(0, prev.hp - reflectedToPlayer) }));
      addDamageText(reflectedToPlayer, 'boss_reflect');
      setLogs(l => [`✨ โดนสะท้อนกลับจากเกล็ดนิล! -${reflectedToPlayer} HP`, ...l].slice(0, 5));
    }

    lastDamageTime.current = now;
    addDamageText(playerDmg, 'monster');
    setEnemy(prev => ({ ...prev, hp: newMonsterHp }));
    setLogs(prev => [`⚔️ โจมตี ${enemy.name} -${playerDmg}`, ...prev].slice(0, 5));

    // ตรวจสอบว่ามอนสเตอร์ตายหรือไม่
    if (newMonsterHp <= 0) {
      if (enemy.type === 'WORLD_BOSS') {
        setTimeout(() => { 
          executeVictory(); 
          if (setGameState) setGameState('MAP_SELECTION');
        }, 500);
      } else {
        setTimeout(() => { executeVictory(); }, 400);
      }
      return; 
    }

    // --- ส่วนของเทิร์นมอนสเตอร์ ---
    setTimeout(() => {
      const action = getMonsterAction({ ...enemy, hp: newMonsterHp }, activeStatuses);
      let monsterFinalDmg = 0;
      let skillName = "";
      let skillDelay = 0;

      if (action.type === 'boss_skill') {
        const skill = action.skill;
        skillName = skill.name || skill.description || "ทักษะบอส";
        // 1. คำนวณพลังโจมตีที่รวมตัวคูณสกิลแล้ว
        const rawDmg = Math.ceil(enemy.atk * (skill.damageMultiplier || 1));
        
        // 2. ✅ ส่งเข้า calculateMonsterAttack เพื่อใช้โลจิค Min Damage 10%
        const { damage } = calculateMonsterAttack({ ...enemy, atk: rawDmg }, nextTurnValue, netDef);
        monsterFinalDmg = damage;

        setLogs(l => [`🐉 ${enemy.name} ใช้: ${skillName} -${monsterFinalDmg} HP`, ...l].slice(0, 5));


        if (skill.statusEffect) {
           const effect = skill.statusEffect;
           if (effect.type === 'REFLECT_SHIELD' || effect.type === 'BUFF_DEF' || effect.type === 'BUFF_ATK') {
             applyStatus(effect, 'monster');
             const typeMap = effect.type === 'BUFF_DEF' ? 'buff_def' : (effect.type === 'BUFF_ATK' ? 'buff_atk' : null);
             if (typeMap) addDamageText(effect.value, typeMap);
           } else {
             applyStatus(effect, 'player');
           }
        }
      } 
      else if (action.type === 'skill' && action.skill) {
        const skill = action.skill;
        skillName = skill.name;
        skillDelay = 800; 
        const baseAtk = enemy.atk; 
        let calculatedAtk = baseAtk;
        if (activeEffects && activeEffects[skillName]) {
          calculatedAtk = activeEffects[skillName](baseAtk);
        } else {
          const multiplier = skill.damageMultiplier || 1.5; 
          calculatedAtk = Math.ceil(baseAtk * multiplier);
        }
        
        // 3. ✅ ส่งเข้า calculateMonsterAttack เพื่อให้สกิลแรงขึ้นจริงตามสัดส่วน Min Damage
        const { damage } = calculateMonsterAttack({ ...enemy, atk: calculatedAtk }, nextTurnValue, netDef);
        monsterFinalDmg = damage;

        setLogs(l => [`🔥 ${enemy.name} ใช้: ${skillName}! -${monsterFinalDmg} `, ...l].slice(0, 5));
        if (skill.statusEffect) {
          applyStatus(skill.statusEffect, 'player');
        }
      }
      else {
        // การโจมตีปกติ
        const { damage } = calculateMonsterAttack({ ...enemy, hp: newMonsterHp }, nextTurnValue, netDef);
        monsterFinalDmg = damage;

        setLogs(prev => [`⚔️ ${enemy.name} โจมตี -${monsterFinalDmg} `, ...prev].slice(0, 5));
      }

      if (skillName) { addSkillText(skillName); }

      // คำนวณลดดาเมจจาก Passive Skill ของผู้เล่น
      player.equippedPassives?.forEach(skillId => {
        if (passiveEffects[skillId]) { monsterFinalDmg = passiveEffects[skillId](monsterFinalDmg); }
      });
      
      // ลอจิกสะท้อนดาเมจคืนให้มอนสเตอร์ (จาก Passive)
      const currentPassives = player.unlockedPassives || [];
      const skillsArray = Array.isArray(allSkills) ? allSkills : Object.values(allSkills || {});
      let currentReflectPercent = 0;

      currentPassives.forEach(pId => {
        const foundSkill = skillsArray.find(s => s && s.id && s.id.trim() === pId.trim());
        if (foundSkill && foundSkill.reflectDamage) {
          currentReflectPercent += foundSkill.reflectDamage;
        }
      });

      if (currentReflectPercent > 0 && monsterFinalDmg > 0) {
        const reflectedAmount = Math.ceil(monsterFinalDmg * currentReflectPercent);
        if (reflectedAmount > 0) {
          addDamageText(reflectedAmount, 'reflect'); 
          setEnemy(prev => {
            if (!prev) return null;
            const nextHp = Math.max(0, prev.hp - reflectedAmount);
            if (nextHp <= 0) setTimeout(() => executeVictory(), 400);
            return { ...prev, hp: nextHp };
          });
          setLogs(l => [`🛡️ สะท้อนคืน! -${reflectedAmount} HP`, ...l].slice(0, 5));
        }
      }

      const nextHp = Math.max(0, player.hp - monsterFinalDmg);
      addDamageText(monsterFinalDmg, 'player');
      setPlayer(prev => ({ ...prev, hp: nextHp }));
      
      if (nextHp <= 0) {
        setCombatPhase('DEFEAT');
        setTimeout(() => handleGameOver(), 800);
      } else {
        setTimeout(() => { setCombatPhase('PLAYER_TURN'); }, skillDelay || 400);
      }
    }, 500);
  };

  /**
   * ประมวลผลเมื่อชนะการต่อสู้ (สุ่มของดรอป, อัปเดต Collection, บวก Exp)
   */
  const executeVictory = () => {
    setCombatPhase('VICTORY');

    if (inDungeon && typeof advanceDungeon === 'function') {
      const isBossDefeated = enemy && (enemy.isBoss || enemy.id === inDungeon?.bossId);
      if (!isBossDefeated) { advanceDungeon(); }
    }

    const baseMonsterId = enemy.baseId || enemy.id.replace('_shiny', '');
    const monsterCard = { id: `card-${enemy.id}-${Date.now()}`, monsterId: enemy.id, name: enemy.name, type: 'MONSTER_CARD', rarity: enemy.rarity, isShiny: enemy.isShiny || false };
    
    let rankMultiplier = 1;
    if (enemy.type === 'WORLD_BOSS' && worldEvent) {
      const dealers = worldEvent.damageDealers || {};
      const playerName = player.name || 'Anonymous';
      const sorted = Object.entries(dealers).sort(([, a], [, b]) => b - a);
      const myRank = sorted.findIndex(([name]) => name === playerName) + 1;
      rankMultiplier = myRank === 1 ? 5 : (myRank <= 3 ? 3 : (myRank <= 5 ? 2 : 1));
      setLogs(prev => [`🏆 อันดับดาเมจ: #${myRank || 'N/A'} (Loot x${rankMultiplier})`, ...prev]);
    }

    const cleanedLootTable = (enemy.lootTable || []).filter(item => {
  // 1. ถ้าเป็นสกิล
  if (item.type === 'SKILL' || item.skillId) return !(player.unlockedPassives || []).includes(item.skillId);
  
  // 2. ถ้าเป็นอุปกรณ์ หรือ วัสดุ (เพิ่มการเช็คชื่อไอเทมพื้นฐานเข้าไปด้วย)
  const isBasicMaterial = ['scrap', 'shard', 'dust', 'dragon_soul', 'obsidian_scale'].includes(item.id?.toLowerCase());
  
  if (item.slot || item.type === 'EQUIPMENT' || item.type === 'MATERIAL' || isBasicMaterial) {
    return true; 
  }

  // 3. ถ้าเป็นของสะสม (พวกนี้จะได้ครั้งเดียวแล้วหายไปจากตารางดรอป)
  return !(player.collection?.[baseMonsterId] || []).includes(item.name);
});

    // 1. สุ่มไอเทมจาก calculateLoot
    const { droppedItems, logs: lootLogs } = calculateLoot(cleanedLootTable, player, !!inDungeon ? 1.03 : 1.0, rankMultiplier);
    
    // 2. 📦 รวมยอดไอเทมที่ซ้ำกันให้เป็นก้อนเดียว (Grouping)
    const groupedMap = new Map();
    droppedItems.forEach(item => {
      const rawId = item.id || item.itemId || (typeof item.name === 'string' ? item.name.toLowerCase() : 'unknown');
      const cleanId = rawId.split('-')[0]; // เช่น 'scrap'

      if (groupedMap.has(cleanId)) {
        groupedMap.get(cleanId).amount += (item.amount || 1);
      } else {
        groupedMap.set(cleanId, { ...item, id: cleanId, amount: (item.amount || 1) });
      }
    });

    // 3. เตรียมไอเทมสำหรับโชว์และบันทึก
    const finalDrops = Array.from(groupedMap.values()).map(item => {
      if (item.slot || item.type === 'EQUIPMENT') {
        const instance = createDropItem(item.id);
        return { ...instance, id: item.id, itemId: item.id, amount: item.amount };
      }
      return item;
    });

    if (lootLogs.length > 0) setLogs(prev => [...lootLogs, ...prev].slice(0, 15));
    
    const droppedSkill = finalDrops.find(item => item.type === 'SKILL');
    const filteredItems = finalDrops.filter(item => item.type !== 'SKILL');
    
    // ✅ ส่งยอดรวมไปที่หน้า Victory (โชว์ 10 ก็คือ 10)
    setLootResult({ items: filteredItems, skill: droppedSkill || null }); 

    setPlayer(prev => {
      const updatedCollection = { ...(prev.collection || {}) };
      if (!updatedCollection[baseMonsterId]) updatedCollection[baseMonsterId] = [];

      const newMaterials = { ...(prev.materials || { scrap: 0, shard: 0, dust: 0, dragon_soul: 0, obsidian_scale: 0 }) };
      const newInventoryItems = [];

      // ✅ ใช้ข้อมูลชุดเดียวกับที่โชว์หน้า Victory มาบันทึก
      finalDrops.forEach(item => {
        if (!(item.slot || item.type === 'EQUIPMENT') && item.type !== 'SKILL' && !updatedCollection[baseMonsterId].includes(item.name)) {
          updatedCollection[baseMonsterId].push(item.name);
        }

        if (item.type === 'MATERIAL') {
          if (newMaterials.hasOwnProperty(item.id)) {
            // ✅ บันทึกยอดที่รวมมาแล้ว (ไม่ต้องบวกเพิ่มทีละ 1 แล้ว)
            newMaterials[item.id] += item.amount;
          } else {
            newInventoryItems.push(item);
          }
        } else if (item.type !== 'SKILL') {
          newInventoryItems.push(item);
        }
      });

      const nextUnlocked = [...(prev.unlockedPassives || [])];
      if (droppedSkill?.skillId && !nextUnlocked.includes(droppedSkill.skillId)) nextUnlocked.push(droppedSkill.skillId);

      return { 
        ...prev, 
        exp: prev.exp + (enemy.expReward || enemy.exp || 20), 
        inventory: [...(prev.inventory || []), ...newInventoryItems, monsterCard], 
        materials: newMaterials, 
        collection: updatedCollection, 
        unlockedPassives: nextUnlocked 
      };
    });
  };

  // ส่งค่าต่างๆ ออกไปใช้งานที่ Component
  return { 
    isCombat, enemy, lootResult, monsterSkillUsed, combatPhase, damageTexts, skillTexts,
    currentMap, gameState, handleSelectMap, setGameState, 
    finalAtk: netAtk, 
    finalDef: netDef,
    startCombat, handleAttack, handleFlee: () => finishCombat(), finishCombat,
    player 
  };
}