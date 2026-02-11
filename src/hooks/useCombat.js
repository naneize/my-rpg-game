import React, { useState, useEffect, useMemo } from 'react';
import { useCombatState } from './useCombatState'; 
import { calculatePlayerDamage, calculateMonsterAttack } from '../utils/combatUtils';
import { passiveEffects, activeEffects } from '../data/skillEffects';
import { useMonsterAI } from './useMonsterAI';
import { useStatusEffects } from './useStatusEffects';
import { calculateFinalStats } from '../utils/statCalculations';

// ✅ Hook และ Utils ที่แยกออกไป
import { useWorldBossSync } from './useWorldBossSync';
import { calculateNetStats, getAutoPassiveAbilities } from '../utils/combatLogicUtils';
import { useCombatVictory } from './useCombatVictory';

import { ref, update, increment } from "firebase/database";
import { rtdb } from "../firebase"; 

/**
 * Custom Hook สำหรับจัดการระบบต่อสู้ (Combat Logic) - Refactored Version
 */
export function useCombat(player, setPlayer, setLogs, advanceDungeon, exitDungeon, inDungeon, allSkills, mapControls) { 
  
  // ---------------------------------------------------------
  // 🛡️ [PHASE 1] DECLARE ALL HOOKS FIRST
  // ---------------------------------------------------------
  
  const {
    isCombat, setIsCombat, addDamageText, damageTexts, enemy, setEnemy,
    lootResult, setLootResult, turnCount, setTurnCount,
    combatPhase, setCombatPhase, resetCombatState, addSkillText, skillTexts,
    attackCombo, setAttackCombo 
  } = useCombatState();

  const { getMonsterAction } = useMonsterAI();
  const { activeStatuses, applyStatus, processTurn, clearAllStatuses } = useStatusEffects(setPlayer, setLogs, addDamageText);
  const { currentMap, setCurrentMap, gameState, setGameState, worldEvent } = mapControls || {};
  const { processVictory, isProcessing } = useCombatVictory(player, setPlayer, setLogs, setLootResult, setCombatPhase);

  // ---------------------------------------------------------
  // ⚙️ [PHASE 2] DECLARE REFS & MEMOS
  // ---------------------------------------------------------

  const isEndingCombat = React.useRef(false);
  const lastDamageTime = React.useRef(0);

  const executeVictory = (manualHp = null) => {
    const currentHp = manualHp !== null ? manualHp : (enemy?.hp || 0);
    console.log("🏆 Victory Check:", { currentHp });

    if (currentHp > 0) return; 

    if (isEndingCombat.current || (isProcessing && isProcessing.current)) {
      console.warn("🔒 Locked! Cannot proceed.");
      return; 
    }
    
    isEndingCombat.current = true; 
    processVictory(enemy, inDungeon, advanceDungeon, worldEvent);
  };

  useWorldBossSync(isCombat, enemy, setEnemy, combatPhase, executeVictory, setGameState);

  const currentFullStats = calculateFinalStats(player);
  const { netAtk, netDef } = calculateNetStats(
    { ...player, finalAtk: currentFullStats.finalAtk, finalDef: currentFullStats.finalDef }, 
    activeStatuses
  );

  // ---------------------------------------------------------
  // ⚔️ [PHASE 3] ACTION FUNCTIONS
  // ---------------------------------------------------------

  const handleSelectMap = (map) => {
    if (setCurrentMap) setCurrentMap(map);          
    if (setGameState) setGameState('EXPLORING');   
    setLogs(prev => [`📍 Destination Set: ${map.name}`, ...prev].slice(0, 10));
  };

  const handleGameOver = () => {
    if (exitDungeon) exitDungeon();
    setLogs(prev => ["💀 You have been defeated.", ...prev].slice(0, 5));

    setTimeout(() => {
      finishCombat();
      setPlayer(prevPlayer => {
        const finalCalculatedStats = calculateFinalStats(prevPlayer);
        const fullVitality = finalCalculatedStats.finalMaxHp;
        return { ...prevPlayer, hp: fullVitality };
      });
    }, 1000);
  };

  const startCombat = (monster) => {
    isEndingCombat.current = false; 
    if (isProcessing) isProcessing.current = false;
    setAttackCombo(0);
    resetCombatState(); 
    setLootResult(null);
    setEnemy({ ...monster });
    setIsCombat(true);
    setCombatPhase('PLAYER_TURN'); 
    const msg = monster.isBoss ? `🔥 [BOSS DETECTED] ! ${monster.name} !!!` : `🚨 Encountered: ${monster.name}!`;
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
      setLogs(prev => [`🎉 Dungeon Clear!`, ...prev].slice(0, 10));
    }
  };

  const handleAttack = (selectedSkill = null) => {
    // 1. ตรวจสอบ Gateway (Hard-Edge Protection)
    const now = Date.now();
    if (now - lastDamageTime.current < 250) return; 
    if (combatPhase !== 'PLAYER_TURN' || !enemy || enemy.hp <= 0 || lootResult) {
      return;
    }

    // 2. กำหนดประเภทการโจมตีและคอมโบ
    const isBasicAttack = !selectedSkill || selectedSkill.name === 'Attack';
    const currentSkill = selectedSkill || { name: 'Attack', multiplier: 1, element: null };
    const isOverloaded = attackCombo >= 5;

    const playerName = player?.name || "Hero";
    const monsterName = enemy?.name || "Monster";
    const gearStats = calculateFinalStats(player);

    const perfectPlayer = { 
      ...player, 
      finalAtk: gearStats.finalAtk, 
      netAtk: netAtk,
      finalDef: gearStats.finalDef 
    };

    processTurn(); 
    if (player.hp <= 0) {
        setCombatPhase('DEFEAT');
        setTimeout(() => handleGameOver(), 800);
        return;
    }

    // 3. จัดการ Multiplier จาก Overload (ใช้สกิลคูณ 2 / ตีธรรมดาคูณ 1)
    let damageMultiplier = 1;
    if (!isBasicAttack && isOverloaded) {
      damageMultiplier = 2;
      setAttackCombo(0); // ใช้สกิล Overload แล้วรีเซ็ตทันที
      addSkillText("NEURAL OVERLOAD!", "text-amber-500");
    }

    setCombatPhase('ENEMY_TURN'); 
    const nextTurnValue = turnCount + 1;
    setTurnCount(nextTurnValue);

    const pSkills = allSkills?.PLAYER_SKILLS || allSkills; 
    const mSkills = allSkills?.MONSTER_SKILLS || [];
    const { autoReflect, autoPen } = getAutoPassiveAbilities(gearStats, mSkills, pSkills);

    // 4. คำนวณดาเมจ
    const playerDmgResult = calculatePlayerDamage(perfectPlayer, enemy, pSkills, mSkills, currentSkill, activeStatuses, autoPen);
    const playerDmg = Math.floor((playerDmgResult?.total || 1) * damageMultiplier);
    const newMonsterHp = Math.max(0, enemy.hp - playerDmg);

    // 5. อัปเดต Combo (เฉพาะการตีธรรมดาอัตโนมัติ)
    if (isBasicAttack) {
      setAttackCombo(prev => {
        const next = Math.min(prev + 1, 5);
        if (next === 5) {
          setLogs(l => [`⚡ [SYSTEM]: NEURAL_OVERLOAD_READY. Execute skill for x2 Damage.`, ...l].slice(0, 10));
          addSkillText("OVERLOAD READY", "text-amber-400");
        }
        return next;
      });
    }

    setEnemy(prev => ({ ...prev, hp: newMonsterHp }));

    if (newMonsterHp <= 0) {
      executeVictory(0); 
      if (enemy.type === 'WORLD_BOSS' && setGameState) setGameState('MAP_SELECTION');
      return; 
    }

    // --- World Boss & Reflect Logic ---
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

    // 🚩 Popup System
    let dmgPopupType = 'monster'; 
    if (playerDmgResult?.isCrit) {
      dmgPopupType = playerDmgResult?.isEffective ? 'super_critical' : 'critical';
    } else {
      if (playerDmgResult?.isEffective) dmgPopupType = 'effective';
      else if (playerDmgResult?.isWeak) dmgPopupType = 'weak';
      else if (currentSkill?.element) dmgPopupType = currentSkill.element.toLowerCase();
    }
    
    addDamageText(playerDmg, dmgPopupType);

    const skillNameForLog = currentSkill?.name || 'attacked';
    const elementIcon = playerDmgResult?.isEffective ? '🔥' : (playerDmgResult?.isWeak ? '❄️' : '');
    const overloadText = damageMultiplier > 1 ? " [OVERLOAD_X2]" : "";

    setLogs(prev => [`⚔️ ${playerName} used ${skillNameForLog}${overloadText} ${elementIcon}: -${playerDmg}`, ...prev].slice(0, 5));

    // --- Monster Turn Logic (Hard-Edge Sync) ---
    setTimeout(() => {
      if (!isCombat || newMonsterHp <= 0) return; 

      const action = getMonsterAction({ ...enemy, hp: newMonsterHp }, activeStatuses);
      const monsterAttackResult = calculateMonsterAttack(enemy, perfectPlayer, nextTurnValue, pSkills, activeStatuses);

      let monsterFinalDmg = monsterAttackResult?.damage || 1;
      let reflectDmg = monsterAttackResult?.reflectDamage || 0; 
      let monsterSkillName = "";
      let monsterSkillElement = null;

      if (action.skill) {
        monsterSkillElement = action.skill.element;
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
      }

      if (!monsterSkillElement && enemy.element) monsterSkillElement = enemy.element;

      player.equippedPassives?.forEach(id => {
        if (passiveEffects[id]) monsterFinalDmg = passiveEffects[id](monsterFinalDmg);
      });

      const baseReflectValue = Math.max(reflectDmg, Math.ceil(monsterFinalDmg * autoReflect));
      let actualReflect = baseReflectValue;
      if (actualReflect <= 0 && (autoReflect > 0 || monsterAttackResult?.reflectPercent > 0) && monsterFinalDmg > 0) actualReflect = 1; 

      if (actualReflect > 0 && monsterFinalDmg > 0) {
        addDamageText(actualReflect, 'reflect'); 
        setEnemy(prev => {
          if (!prev) return null;
          const nHp = Math.max(0, prev.hp - actualReflect);
          if (nHp <= 0 && player.hp > 0) setTimeout(() => executeVictory(0), 100);
          return { ...prev, hp: nHp };
        });
      }

      if (monsterSkillName) {
        addSkillText(monsterSkillName);
        setLogs(l => [`🔥 ${monsterName} cast : ${monsterSkillName}! ${monsterAttackResult?.isEffective ? '⚠️' : ''} -${monsterFinalDmg} `, ...l].slice(0, 5));
      } else {
        setLogs(prev => [`⚔️ ${monsterName} attacked ${playerName} -${monsterFinalDmg} `, ...prev].slice(0, 5));
      }

      const nextHp = Math.max(0, player.hp - monsterFinalDmg);
      addDamageText(monsterFinalDmg, monsterSkillElement ? `${String(monsterSkillElement).toLowerCase()}_hit` : 'player');
      setPlayer(prev => ({ ...prev, hp: nextHp }));
      
      if (nextHp <= 0) {
        setCombatPhase('DEFEAT');
        setTimeout(() => handleGameOver(), 800);
      } else {
        setCombatPhase('PLAYER_TURN');
      }
    }, 600); // ปรับเวลาให้กระชับขึ้นเพื่อรับกับระบบ Auto
  };

  return { 
    isCombat, enemy, lootResult, combatPhase, damageTexts, skillTexts,
    currentMap, gameState, handleSelectMap, attackCombo, setAttackCombo,
    setGameState, finalAtk: netAtk, finalDef: netDef,
    startCombat, handleAttack, handleFlee: () => finishCombat(), 
    finishCombat, player, setCombatPhase
  };
}