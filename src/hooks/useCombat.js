import React from 'react';
import { useCombatState } from './useCombatState'; 
import { calculatePlayerDamage, calculateMonsterAttack } from '../utils/combatUtils';
import { passiveEffects, activeEffects } from '../data/skillEffects';
import { useMonsterAI } from './useMonsterAI';
import { useStatusEffects } from './useStatusEffects';
import { calculateFinalStats } from '../utils/statCalculations';

// ✅ นำเข้า Hook และ Utils ที่แยกออกไป
import { useWorldBossSync } from './useWorldBossSync';
import { calculateNetStats, getAutoPassiveAbilities } from '../utils/combatLogicUtils';
import { useCombatVictory } from './useCombatVictory';

import { ref, update, increment } from "firebase/database";
import { rtdb } from "../firebase"; 

/**
 * Custom Hook สำหรับจัดการระบบต่อสู้ (Combat Logic) - Refactored Version
 */
export function useCombat(player, setPlayer, setLogs, advanceDungeon, exitDungeon, inDungeon, allSkills, mapControls) { 
  
  // 1. ดึง State พื้นฐาน
  const {
    isCombat, setIsCombat, addDamageText, damageTexts, enemy, setEnemy,
    lootResult, setLootResult, turnCount, setTurnCount,
    combatPhase, setCombatPhase, resetCombatState, addSkillText, skillTexts
  } = useCombatState();

  // 2. เรียกใช้ระบบเสริม
  const { getMonsterAction } = useMonsterAI();
  const { activeStatuses, applyStatus, processTurn, clearAllStatuses } = useStatusEffects(setPlayer, setLogs, addDamageText);
  const { currentMap, setCurrentMap, gameState, setGameState, worldEvent } = mapControls || {};

  // 3. 🛡️ เรียกใช้ Victory Logic (จัดการ Loot/Grouping)
  const { processVictory } = useCombatVictory(player, setPlayer, setLogs, setLootResult, setCombatPhase);
  
  const executeVictory = () => {
    // ✅ เช็คก่อนว่าผู้เล่นยังไม่ตายถึงจะชนะได้
    if (player.hp <= 0) return; 
    processVictory(enemy, inDungeon, advanceDungeon, worldEvent);
  };

  // 4. 🐉 เรียกใช้ World Boss Sync (Firebase Real-time)
  useWorldBossSync(isCombat, enemy, setEnemy, combatPhase, executeVictory, setGameState);

  // 5. 🧮 คำนวณ Net Stats (Buff/Debuff) - ใช้สเตตัสสุทธิในการแสดงผลหน้า UI
  const { netAtk, netDef } = calculateNetStats(player, activeStatuses);

  // --- ฟังก์ชัน Action หลัก ---

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

      // ✅ ใช้ Functional Update เพื่อความแม่นยำสูงสุด
      setPlayer(prevPlayer => {
        // 1. คำนวณหาค่าสเตตัสสุทธิใหม่จากฐานข้อมูลล่าสุด
        const finalCalculatedStats = calculateFinalStats(prevPlayer);
        
        // 2. ดึงค่า Max HP ที่รวมโบนัสแล้ว (เช่น 150 หรือ 175)
        const fullVitality = finalCalculatedStats.finalMaxHp;

        console.log(`[System Revive] Hard Reset HP to: ${fullVitality}`);

        return {
          ...prevPlayer,
          // ✅ บังคับเขียนทับด้วยค่า Max HP ที่คำนวณได้เท่านั้น
          hp: fullVitality, 
        };
      });
    }, 1000);
  };

  const startCombat = (monster) => {
    resetCombatState(); 
    setEnemy({ ...monster });
    setIsCombat(true);
    setCombatPhase('PLAYER_TURN'); 
    const msg = monster.isBoss ? `🔥 [BOSS] !!! ${monster.name} !!!` : `🚨 เผชิญหน้ากับ ${monster.name}!`;
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
      setLogs(prev => [`🎉 พิชิตดันเจี้ยนสำเร็จ!`, ...prev].slice(0, 10));
    }
  };

  const lastDamageTime = React.useRef(0);

  // ✅ แก้ไข: handleAttack พร้อมระบบล็อคชื่อกัน undefined
  const handleAttack = (selectedSkill = null) => {
    const now = Date.now();
    if (now - lastDamageTime.current < 250) return; 
    if (combatPhase !== 'PLAYER_TURN' || !enemy || enemy.hp <= 0 || lootResult) return;

    // ✅ ล็อคชื่อไว้ที่ต้นฟังก์ชันเพื่อให้ใน setTimeout เรียกใช้ได้ถูกต้อง
    const playerName = player?.name || "Hero";
    const monsterName = enemy?.name || "Monster";

    processTurn(); 
    if (player.hp <= 0) {
        setCombatPhase('DEFEAT');
        setTimeout(() => handleGameOver(), 800);
        return;
    }

    // กำหนดสกิลที่ใช้
    const currentSkill = selectedSkill || { name: 'Attack', multiplier: 1, element: null };

    setCombatPhase('ENEMY_TURN'); 
    const nextTurnValue = turnCount + 1;
    setTurnCount(nextTurnValue);

    const pSkills = allSkills?.PLAYER_SKILLS || allSkills; 
    const mSkills = allSkills?.MONSTER_SKILLS || [];
    
    const { autoReflect, autoPen } = getAutoPassiveAbilities(player, mSkills, pSkills);

    const playerDmgResult = calculatePlayerDamage(
      player, 
      enemy, 
      pSkills, 
      mSkills, 
      currentSkill, 
      activeStatuses
    );
    
    const playerDmg = playerDmgResult?.total || 1;
    const newMonsterHp = Math.max(0, enemy.hp - playerDmg);

    if (enemy.type === 'WORLD_BOSS') {
      update(ref(rtdb, 'worldEvent'), {
        currentHp: increment(-playerDmg),
        [`damageDealers/${playerName}`]: increment(playerDmg),
        participants: !worldEvent?.damageDealers?.[playerName] ? increment(1) : increment(0)
      });
    }

    const reflectStatus = activeStatuses.find(s => s.type === 'REFLECT_SHIELD' && s.target === 'monster');
    if (reflectStatus && playerDmg > 0) {
      const reflectedToPlayer = Math.ceil(playerDmg * reflectStatus.value);
      setPlayer(prev => ({ ...prev, hp: Math.max(0, prev.hp - reflectedToPlayer) }));
      addDamageText(reflectedToPlayer, 'boss_reflect');
    }

    lastDamageTime.current = now;
    addDamageText(playerDmg, 'monster');
    if (playerDmgResult?.isEffective) addSkillText("SUPER EFFECTIVE!", "text-yellow-400"); 

    setEnemy(prev => ({ ...prev, hp: newMonsterHp }));
    setLogs(prev => [`⚔️ ${playerName} ใช้ ${currentSkill.name} ${playerDmgResult?.isEffective ? '🔥' : ''}: -${playerDmg}`, ...prev].slice(0, 5));

    if (newMonsterHp <= 0) {
      setTimeout(() => { 
        executeVictory(); 
        if (enemy.type === 'WORLD_BOSS' && setGameState) setGameState('MAP_SELECTION');
      }, 450);
      return; 
    }

    // --- Monster Turn Logic ---
    setTimeout(() => {
      if (!isCombat) return;

      const action = getMonsterAction({ ...enemy, hp: newMonsterHp }, activeStatuses);
      
      const monsterAttackResult = calculateMonsterAttack(
        enemy, 
        player, 
        nextTurnValue, 
        pSkills, 
        activeStatuses
      );

      let monsterFinalDmg = monsterAttackResult?.damage || 1;
      let reflectDmg = monsterAttackResult?.reflectDamage || 0; 
      
      let monsterSkillName = "";

      if (action.type === 'boss_skill' || action.type === 'skill') {
        const skill = action.skill;
        monsterSkillName = skill.name || skill.description;
        const multiplier = skill.damageMultiplier || 1.5;
        monsterFinalDmg = Math.ceil(monsterFinalDmg * multiplier);
        
        if (monsterAttackResult?.reflectPercent) {
             reflectDmg = Math.floor(monsterFinalDmg * monsterAttackResult.reflectPercent);
        }

        if (skill.statusEffect) applyStatus(skill.statusEffect, action.type === 'boss_skill' ? 'monster' : 'player');
      }

      player.equippedPassives?.forEach(id => {
        if (passiveEffects[id]) monsterFinalDmg = passiveEffects[id](monsterFinalDmg);
      });

      const baseReflectValue = Math.max(reflectDmg, Math.ceil(monsterFinalDmg * autoReflect));
      let actualReflect = baseReflectValue;

      if (actualReflect <= 0 && (autoReflect > 0 || monsterAttackResult?.reflectPercent > 0) && monsterFinalDmg > 0) {
          actualReflect = 1; 
      }

      if (actualReflect > 0 && monsterFinalDmg > 0) {
        const activeReflectSkill = player.equippedActives
          ?.map(id => pSkills[id])
          .find(s => s && (s.passiveReflect > 0 || s.reflectDamage > 0));
        
        const reflectSourceName = activeReflectSkill ? ` [${activeReflectSkill.name}]` : " [Passive]";

        addDamageText(actualReflect, 'reflect'); 
        setEnemy(prev => {
          if (!prev) return null;
          const nHp = Math.max(0, prev.hp - actualReflect);
          if (nHp <= 0) {
              setTimeout(() => {
                  if (player.hp > 0) executeVictory();
              }, 400);
          }
          return { ...prev, hp: nHp };
        });
        
        setLogs(l => [`🛡️ ${playerName} สะท้อนคืนด้วย${reflectSourceName}: -${actualReflect}`, ...l].slice(0, 5));
      }

      if (monsterSkillName) {
        addSkillText(monsterSkillName);
        setLogs(l => [`🔥 ${monsterName} ใช้: ${monsterSkillName}! ${monsterAttackResult?.isEffective ? '⚠️' : ''} -${monsterFinalDmg} `, ...l].slice(0, 5));
      } else {
        setLogs(prev => [`⚔️ ${monsterName} โจมตี ${playerName} -${monsterFinalDmg} `, ...prev].slice(0, 5));
      }

      const nextHp = Math.max(0, player.hp - monsterFinalDmg);
      addDamageText(monsterFinalDmg, 'player');
      setPlayer(prev => ({ ...prev, hp: nextHp }));
      
      if (nextHp <= 0) {
        setCombatPhase('DEFEAT');
        setTimeout(() => handleGameOver(), 800);
      } else {
        setCombatPhase('PLAYER_TURN');
      }
    }, 500);
  };

  return { 
    isCombat, 
    enemy, 
    lootResult, 
    combatPhase, 
    damageTexts, 
    skillTexts,
    currentMap, 
    gameState, 
    handleSelectMap, 
    setGameState, 
    finalAtk: netAtk, 
    finalDef: netDef,
    startCombat, 
    handleAttack, 
    handleFlee: () => finishCombat(), 
    finishCombat, 
    player 
  };
}