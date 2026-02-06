import React from 'react'; 
import { useCombatState } from './useCombatState'; 
import { calculatePlayerDamage, calculateMonsterAttack } from '../utils/combatUtils';
import { calculateLoot } from '../utils/lootUtils';
import { passiveEffects } from '../data/skillEffects';
import { createDropItem } from '../utils/inventoryUtils';
import { useMonsterAI } from './useMonsterAI';
// ✅ นำเข้า Hook ระบบสถานะผิดปกติ
import { useStatusEffects } from './useStatusEffects';

export function useCombat(player, setPlayer, setLogs, advanceDungeon, exitDungeon, inDungeon, collectionBonuses, mapControls) { 
  
  // ✅ [RULE] เรียก Hook ทั้งหมดไว้ที่ส่วนบนสุด
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

  const { getMonsterAction } = useMonsterAI();
  
  // ✅ เรียกใช้งานระบบ Status Effects (ส่ง activeStatuses ไปให้ AI และคำนวณสเตตัส)
  const { activeStatuses, applyStatus, processTurn, clearAllStatuses } = useStatusEffects(setPlayer, setLogs, addDamageText);

  const { currentMap, setCurrentMap, gameState, setGameState } = mapControls || {};

  // 🛡️ คำนวณสเตตัสสุทธิ (Net Stats) เฉพาะของผู้เล่น
  const getNetStats = () => {
    let atkMod = 0;
    let defMod = 0;

    activeStatuses.forEach(status => {
      // ✅ คำนวณเฉพาะสถานะที่ติดอยู่ที่ 'player'
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

  const handleSelectMap = (map) => {
    if (setCurrentMap) setCurrentMap(map);          
    if (setGameState) setGameState('EXPLORING');   
    setLogs(prev => [`📍 เริ่มการเดินทางสู่: ${map.name}`, ...prev].slice(0, 10));
  };

  const handleGameOver = () => {
  if (exitDungeon) exitDungeon();
  setLogs(prev => ["💀 คุณพ่ายแพ้สลบไป...", ...prev].slice(0, 5));
  
  setTimeout(() => {
    finishCombat();
    setPlayer(prev => {
      // ✅ [FIX] ใช้ค่า finalMaxHp จาก player (ที่รวมโบนัส Collection/อุปกรณ์แล้ว)
      // หากไม่มี finalMaxHp ให้ลองใช้ค่าที่คำนวณจากภายนอกมาแทน
      const recoveredHp = player.finalMaxHp || player.maxHp; 

      return { 
        ...prev, 
        hp: recoveredHp 
      };
    });
  }, 2000);

  };

  const startCombat = (monster) => {
    resetCombatState(); 
    setEnemy({ ...monster });
    setIsCombat(true);
    setCombatPhase('PLAYER_TURN'); 
    
    const shinyTag = monster.isShiny ? "✨ [SHINY] " : "";
    const msg = monster.isBoss ? `🔥 [BOSS] !!! เผชิญหน้ากับ ${monster.name} !!!` : `🚨 ${shinyTag}เผชิญหน้ากับ ${monster.name}!`;
    setLogs(prev => [msg, ...prev].slice(0, 8));
  };

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

  const handleAttack = () => {
    const now = Date.now();
    if (now - lastDamageTime.current < 250) return;
    if (combatPhase !== 'PLAYER_TURN' || !enemy || enemy.hp <= 0 || player.hp <= 0 || lootResult) return;

    // ✅ ประมวลผลสถานะก่อนโจมตี (BURN/RECOVERY)
    processTurn();

    if (player.hp <= 0) {
       setCombatPhase('DEFEAT');
       setTimeout(() => handleGameOver(), 800);
       return;
    }

    const playerWithStats = { ...player, atk: netAtk };
    setCombatPhase('ENEMY_TURN'); 
    
    // ✅ อัปเดตเทิร์นและเก็บไว้ในตัวแปรเพื่อใช้กับ AI มอนสเตอร์
    const nextTurnValue = turnCount + 1;
    setTurnCount(nextTurnValue);

    const playerDmg = calculatePlayerDamage(playerWithStats, enemy);
    const newMonsterHp = Math.max(0, enemy.hp - playerDmg);

    // ✅ [CHECK REFLECT] เช็คเกราะสะท้อนของบอส (target === 'monster')
    const reflectStatus = activeStatuses.find(s => s.type === 'REFLECT_SHIELD' && s.target === 'monster');

    if (reflectStatus && playerDmg > 0) {
      const reflectedToPlayer = Math.ceil(playerDmg * reflectStatus.value);
      setPlayer(prev => ({ ...prev, hp: Math.max(0, prev.hp - reflectedToPlayer) }));
      addDamageText(reflectedToPlayer, 'reflect');
      setLogs(l => [`✨ โดนสะท้อนกลับจากเกล็ดนิล! -${reflectedToPlayer} HP`, ...l].slice(0, 5));
    }

    lastDamageTime.current = now;
    addDamageText(playerDmg, 'monster');
    setEnemy(prev => ({ ...prev, hp: newMonsterHp }));
    setLogs(prev => [`⚔️ โจมตี ${enemy.name} -${playerDmg}`, ...prev].slice(0, 5));

    if (newMonsterHp <= 0) {
      setTimeout(() => { executeVictory(); }, 400);
      return; 
    }

    setTimeout(() => {
      // ✅ ส่งข้อมูลครบถ้วนเพื่อให้ AI ตัดสินใจได้ถูกต้อง
      const action = getMonsterAction({ ...enemy, hp: newMonsterHp }, activeStatuses);
      let monsterFinalDmg = 0;
      let skillName = "";
      let skillDelay = 0;

      if (action.type === 'boss_skill') {
        const skill = action.skill;
        addSkillText(skill.name);
        const rawDmg = enemy.atk * (skill.damageMultiplier || 1);
        monsterFinalDmg = Math.max(1, Math.ceil(rawDmg) - netDef);
        
        setLogs(l => [`🐉 ${skill.message || `${enemy.name} ใช้ทักษะ!`}`, ...l].slice(0, 5));

        if (skill.statusEffect) {
           const effect = skill.statusEffect;
           // 💎 จัดการ Target: เกราะ/บัฟ ลงบอส | ดีบัฟ ลงผู้เล่น
           if (effect.type === 'REFLECT_SHIELD' || effect.type === 'BUFF_DEF' || effect.type === 'BUFF_ATK') {
              applyStatus(effect, 'monster');
              const typeMap = effect.type === 'BUFF_DEF' ? 'buff_def' : (effect.type === 'BUFF_ATK' ? 'buff_atk' : null);
              if (typeMap) addDamageText(effect.value, typeMap);
           } else {
              applyStatus(effect, 'player');
           }
        }
      } 
      // ✅ [FIXED] ปรับจังหวะของมอนสเตอร์ทั่วไปให้รองรับ Status Effect
      else if (action.type === 'skill' && action.skill) {
        const skill = action.skill;
        skillName = skill.name;
        skillDelay = 800; 
        
        const { damage } = calculateMonsterAttack({ ...enemy, hp: newMonsterHp }, nextTurnValue);
        // เพิ่มความแรงสกิลเล็กน้อย (ถ้ามี multiplier)
        const mult = skill.damageMultiplier || 1;
        monsterFinalDmg = Math.max(1, Math.ceil(damage * mult) - netDef);
        
        setLogs(l => [`🔥 ${enemy.name} ใช้: ${skillName}!`, ...l].slice(0, 5));

        // ✅ [ADDED] ทำให้มอนสเตอร์ทั่วไปสามารถติดสถานะ (เช่น Poison/Burn) ใส่ผู้เล่นได้
        if (skill.statusEffect) {
          applyStatus(skill.statusEffect, 'player');
        }
      } 
      else {
        // การโจมตีปกติ
        const { damage } = calculateMonsterAttack({ ...enemy, hp: newMonsterHp }, nextTurnValue);
        monsterFinalDmg = Math.max(1, damage - netDef);
      }

      // ส่วนการแสดงผล Popup และคำนวณสะท้อนดาเมจ (คงเดิม 100%)
      if (skillName) { addSkillText(skillName); }

      // Passive ประมวลผล
      player.equippedPassives?.forEach(skillId => {
        if (passiveEffects[skillId]) { monsterFinalDmg = passiveEffects[skillId](monsterFinalDmg); }
      });

      // ระบบสะท้อนของผู้เล่น (คงเดิม)
      const reflectPercent = player.reflectDamage || 0; 
      if (reflectPercent > 0) {
        const reflectedDamage = Math.ceil(monsterFinalDmg * reflectPercent);
        if (reflectedDamage > 0) {
          const hpAfterReflect = Math.max(0, newMonsterHp - reflectedDamage);
          setEnemy(prev => ({ ...prev, hp: hpAfterReflect }));
          addDamageText(reflectedDamage, 'reflect');
          if (hpAfterReflect <= 0) {
            setTimeout(() => { executeVictory(); }, 400);
            return;
          }
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

  const executeVictory = () => {
    setCombatPhase('VICTORY');
    if (inDungeon && typeof advanceDungeon === 'function') {
      const isBossDefeated = enemy && (enemy.isBoss || enemy.id === inDungeon?.bossId);
      if (!isBossDefeated) { advanceDungeon(); }
    }
    const baseMonsterId = enemy.baseId || enemy.id.replace('_shiny', '');
    const monsterCard = { id: `card-${enemy.id}-${Date.now()}`, monsterId: enemy.id, name: enemy.name, type: 'MONSTER_CARD', rarity: enemy.rarity, isShiny: enemy.isShiny || false };
    const isInDungeon = !!inDungeon; 
    const dungeonDropBonus = isInDungeon ? 1.03 : 1.0;
    const playerCollection = player.collection?.[baseMonsterId] || [];
    const cleanedLootTable = (enemy.lootTable || []).filter(item => {
      if (item.type === 'SKILL' || item.skillId) return !(player.unlockedPassives || []).includes(item.skillId);
      if (item.slot || item.type === 'EQUIPMENT') return true;
      return !playerCollection.includes(item.name);
    });
    const { droppedItems, logs: lootLogs } = calculateLoot(cleanedLootTable, player, dungeonDropBonus);
    const finalProcessedDrops = droppedItems.map(item => {
      if (item.slot || item.type === 'EQUIPMENT') {
        const equipmentId = item.itemId || item.id || item.name;
        const instanceItem = createDropItem(equipmentId);
        return { ...instanceItem, itemId: equipmentId, type: 'EQUIPMENT', rarity: item.rarity || instanceItem.rarity };
      }
      return item; 
    });
    if (lootLogs.length > 0) setLogs(prev => [...lootLogs, ...prev].slice(0, 15));
    const droppedSkill = finalProcessedDrops.find(item => item.type === 'SKILL');
    const filteredItems = finalProcessedDrops.filter(item => item.type !== 'SKILL');
    setLootResult({ items: filteredItems, skill: droppedSkill || null }); 
    setPlayer(prev => {
      const updatedCollection = { ...(prev.collection || {}) };
      if (!updatedCollection[baseMonsterId]) { updatedCollection[baseMonsterId] = []; }
      finalProcessedDrops.forEach(item => {
        if (!(item.slot || item.type === 'EQUIPMENT') && item.type !== 'SKILL' && !updatedCollection[baseMonsterId].includes(item.name)) {
          updatedCollection[baseMonsterId].push(item.name);
        }
      });
      const currentUnlocked = prev.unlockedPassives || [];
      let nextUnlocked = [...currentUnlocked];
      if (droppedSkill?.skillId && !nextUnlocked.includes(droppedSkill.skillId)) { nextUnlocked.push(droppedSkill.skillId); }
      return { ...prev, exp: prev.exp + (enemy.expReward || enemy.exp || 20), inventory: [...(prev.inventory || []), ...finalProcessedDrops, monsterCard], collection: updatedCollection, unlockedPassives: nextUnlocked };
    });
  };

  return { 
    isCombat, enemy, lootResult, monsterSkillUsed, combatPhase, damageTexts, skillTexts,
    currentMap, gameState, handleSelectMap, setGameState, 
    finalAtk: netAtk, 
    finalDef: netDef,
    startCombat, handleAttack, handleFlee: () => finishCombat(), finishCombat,
    player 
  };
}