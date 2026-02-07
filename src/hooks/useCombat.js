import React from 'react';
import { useCombatState } from './useCombatState'; 
import { calculatePlayerDamage, calculateMonsterAttack } from '../utils/combatUtils';
import { passiveEffects, activeEffects } from '../data/skillEffects';
import { useMonsterAI } from './useMonsterAI';
import { useStatusEffects } from './useStatusEffects';

// ✅ นำเข้า Hook และ Utils ที่แยกออกไป
import { useWorldBossSync } from './useWorldBossSync';
import { calculateNetStats } from '../utils/combatLogicUtils';
import { useCombatVictory } from './useCombatVictory';

import { ref, update, increment } from "firebase/database";
import { db } from "../firebase"; 

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
    processVictory(enemy, inDungeon, advanceDungeon, worldEvent);
  };

  // 4. 🐉 เรียกใช้ World Boss Sync (Firebase Real-time)
  useWorldBossSync(isCombat, enemy, setEnemy, combatPhase, executeVictory, setGameState);

  // 5. 🧮 คำนวณ Net Stats (Buff/Debuff)
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
      setPlayer(prev => ({ ...prev, hp: player.finalMaxHp || player.maxHp }));
    }, 2000);
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

    const playerDmg = calculatePlayerDamage(playerWithStats, enemy);
    const newMonsterHp = Math.max(0, enemy.hp - playerDmg);

    // Sync ดาเมจ World Boss ลง Firebase
    if (enemy.type === 'WORLD_BOSS') {
      const playerName = player.name || 'Anonymous';
      update(ref(db, 'worldEvent'), {
        currentHp: increment(-playerDmg),
        [`damageDealers/${playerName}`]: increment(playerDmg),
        participants: !worldEvent?.damageDealers?.[playerName] ? increment(1) : increment(0)
      });
    }

    // Reflect Logic
    const reflectStatus = activeStatuses.find(s => s.type === 'REFLECT_SHIELD' && s.target === 'monster');
    if (reflectStatus && playerDmg > 0) {
      const reflectedToPlayer = Math.ceil(playerDmg * reflectStatus.value);
      setPlayer(prev => ({ ...prev, hp: Math.max(0, prev.hp - reflectedToPlayer) }));
      addDamageText(reflectedToPlayer, 'boss_reflect');
    }

    lastDamageTime.current = now;
    addDamageText(playerDmg, 'monster');
    setEnemy(prev => ({ ...prev, hp: newMonsterHp }));

    setLogs(prev => [`⚔️ โจมตี ${enemy.name} -${playerDmg}`, ...prev].slice(0, 5));

    if (newMonsterHp <= 0) {
      setTimeout(() => { 
        executeVictory(); 
        if (enemy.type === 'WORLD_BOSS' && setGameState) setGameState('MAP_SELECTION');
      }, 450);
      return; 
    }

    // --- Monster Turn Logic ---
    setTimeout(() => {
      const action = getMonsterAction({ ...enemy, hp: newMonsterHp }, activeStatuses);
      let monsterFinalDmg = 0;
      let skillName = "";
      let skillDelay = 0;

      if (action.type === 'boss_skill' || action.type === 'skill') {
        const skill = action.skill;
        skillName = skill.name || skill.description;
        const multiplier = skill.damageMultiplier || 1.5;
        const calculatedAtk = (activeEffects && activeEffects[skillName]) 
            ? activeEffects[skillName](enemy.atk) 
            : Math.ceil(enemy.atk * multiplier);
        
        const { damage } = calculateMonsterAttack({ ...enemy, atk: calculatedAtk }, nextTurnValue, netDef);
        monsterFinalDmg = damage;
        if (skill.statusEffect) applyStatus(skill.statusEffect, action.type === 'boss_skill' ? 'monster' : 'player');
      } else {
        const { damage } = calculateMonsterAttack({ ...enemy, hp: newMonsterHp }, nextTurnValue, netDef);
        monsterFinalDmg = damage;
      }

      if (skillName) {
        addSkillText(skillName);
    // ✅ ใส่สำหรับกรณีบอสใช้สกิล
          setLogs(l => [`🔥 ${enemy.name} ใช้: ${skillName}! -${monsterFinalDmg} `, ...l].slice(0, 5));
} else {
    // ✅ ใส่สำหรับการโจมตีปกติ
          setLogs(prev => [`⚔️ ${enemy.name} โจมตี -${monsterFinalDmg} `, ...prev].slice(0, 5));
}

      

      // Passive Player Damage Reduction & Reflect
      player.equippedPassives?.forEach(id => {
        if (passiveEffects[id]) monsterFinalDmg = passiveEffects[id](monsterFinalDmg);
      });

      // Reflection from unlocked passives
      const skillsArray = Array.isArray(allSkills) ? allSkills : Object.values(allSkills || {});
      let reflectPct = 0;
      (player.unlockedPassives || []).forEach(pId => {
        const found = skillsArray.find(s => s?.id?.trim() === pId.trim());
        if (found?.reflectDamage) reflectPct += found.reflectDamage;
      });

      if (reflectPct > 0 && monsterFinalDmg > 0) {
        const amt = Math.ceil(monsterFinalDmg * reflectPct);
        addDamageText(amt, 'reflect'); 
        setEnemy(prev => {
          const nHp = Math.max(0, (prev?.hp || 0) - amt);
          if (nHp <= 0) setTimeout(() => executeVictory(), 400);
          return prev ? { ...prev, hp: nHp } : null;
        });

        setLogs(l => [`🛡️ สะท้อนคืน! -${amt} `, ...l].slice(0, 5))
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