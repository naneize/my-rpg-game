import React, { useState } from 'react'; 
import { useCombatState } from './useCombatState'; 
import { calculatePlayerDamage, calculateMonsterAttack } from '../utils/combatUtils';
import { calculateLoot } from '../utils/lootUtils';
import { getPassiveBonus } from '../utils/characterUtils';
import { titles as allTitles } from '../data/titles';
import { MONSTER_SKILLS } from '../data/passive';
import { useCharacterStats } from './useCharacterStats';
import { activeEffects, passiveEffects } from '../data/skillEffects';

export function useCombat(player, setPlayer, setLogs, advanceDungeon, exitDungeon, inDungeon, collectionBonuses, mapControls) { 
  
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

  const { currentMap, setCurrentMap, gameState, setGameState } = mapControls || {};

  const activeTitle = allTitles.find(t => t.id === player.activeTitleId) || allTitles[0];
  const passiveBonuses = getPassiveBonus(player.equippedPassives, MONSTER_SKILLS);
  const { finalAtk, finalDef } = useCharacterStats(player, activeTitle, passiveBonuses, collectionBonuses);

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
      setPlayer(prev => ({ ...prev, hp: prev.maxHp }));
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
    setIsCombat(false);
    setEnemy(null);
    setCombatPhase('IDLE'); 
    setLootResult(null); 

    if (isBossDefeated) {
      exitDungeon(); 
      setLogs(prev => [`🎉 [VICTORY] พิชิตดันเจี้ยนสำเร็จ!`, ...prev].slice(0, 10));
    }
  };

  const lastDamageTime = React.useRef(0);

  const handleAttack = () => {
    const now = Date.now();
    // ✅ ปรับ Delay เป็น 250ms เพื่อให้มือถือประมวลผลทันและ UI ไม่ค้าง
    if (now - lastDamageTime.current < 250) return;
    if (combatPhase !== 'PLAYER_TURN' || !enemy || enemy.hp <= 0 || player.hp <= 0 || lootResult) return;

    let attackValue = finalAtk;
    player.equippedPassives?.forEach(skillId => {
      if (activeEffects[skillId]) {
        attackValue = activeEffects[skillId](attackValue);
      }
    });

    const playerWithBonus = { ...player, atk: attackValue };
    setCombatPhase('ENEMY_TURN'); 
    const currentTurn = turnCount + 1;
    setTurnCount(currentTurn);

    // ⚔️ 1. ผู้เล่นโจมตี
    const playerDmg = calculatePlayerDamage(playerWithBonus, enemy);
    const newMonsterHp = Math.max(0, enemy.hp - playerDmg);

    lastDamageTime.current = now;
    addDamageText(playerDmg, 'monster');
    setEnemy(prev => ({ ...prev, hp: newMonsterHp }));
    
    // ✅ ลดจำนวน Log ระหว่างสู้เพื่อ Performance
    setLogs(prev => [`⚔️ โจมตี ${enemy.name} -${playerDmg}`, ...prev].slice(0, 5));

    if (newMonsterHp <= 0) {
      setTimeout(() => {
        executeVictory(); 
      }, 400);
      return; 
    }

    // ⚔️ 3. มอนสเตอร์โจมตีสวน
    setTimeout(() => {
      const { damage, skillUsed } = calculateMonsterAttack({ ...enemy, hp: newMonsterHp }, currentTurn);
      const skillDelay = skillUsed ? 800 : 0;

      if (skillUsed) {
        addSkillText(skillUsed.name); 
        setLogs(l => [`🔥 ${enemy.name} ใช้: ${skillUsed.name}!`, ...l].slice(0, 5));
      }

      let monsterFinalDmg = Math.max(1, damage - finalDef);
      player.equippedPassives?.forEach(skillId => {
        if (passiveEffects[skillId]) {
          monsterFinalDmg = passiveEffects[skillId](monsterFinalDmg);
        }
      });

      // 🛡️ 4. ระบบสะท้อนความเสียหาย
      const reflectPercent = passiveBonuses?.reflectDamage || 0;
      let hpAfterReflect = newMonsterHp;

      if (reflectPercent > 0) {
        const reflectedDamage = Math.ceil(monsterFinalDmg * reflectPercent);
        
        if (reflectedDamage > 0) {
          hpAfterReflect = Math.max(0, newMonsterHp - reflectedDamage);
          setEnemy(prev => ({ ...prev, hp: hpAfterReflect }));
          addDamageText(reflectedDamage, 'reflect');
          // ✅ รวม Log สะท้อน
          setLogs(l => [`✨ สะท้อนคืน -${reflectedDamage}`, ...l].slice(0, 5));

          if (hpAfterReflect <= 0) {
            setTimeout(() => { executeVictory(); }, 400);
            return;
          }
        }
      }

      // 🩸 5. หักเลือดผู้เล่น
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
      if (!isBossDefeated) {
         advanceDungeon(); 
      }
    }
    
    const monsterCard = {
      id: `card-${enemy.id}-${Date.now()}`,
      monsterId: enemy.id, 
      name: enemy.name,
      type: 'MONSTER_CARD', 
      rarity: enemy.rarity,
      isShiny: enemy.isShiny || false 
    };

    const isInDungeon = !!inDungeon; 
    const dungeonDropBonus = isInDungeon ? 1.03 : 1.0;

    const playerCollection = player.collection?.[enemy.id] || [];
    const cleanedLootTable = (enemy.lootTable || []).filter(item => {
      if (item.type === 'SKILL' || item.skillId) {
        return !(player.unlockedPassives || []).includes(item.skillId);
      }
      return !playerCollection.includes(item.name);
    });

    const { droppedItems, logs: lootLogs } = calculateLoot(cleanedLootTable, player, dungeonDropBonus);
    
    // ✅ เคลียร์ Log เก่าทิ้งเมื่อชนะ เพื่อเตรียมรับรางวัล
    if (lootLogs.length > 0) setLogs(prev => [...lootLogs, ...prev].slice(0, 15));
    
    if (enemy.isShiny) {
      setLogs(prev => [`✨ [RARE] คุณพิชิต Shiny ${enemy.name}!`, ...prev].slice(0, 10));
    }

    const droppedSkill = droppedItems.find(item => item.type === 'SKILL');
    const filteredItems = droppedItems.filter(item => item.type !== 'SKILL');
    
    setLootResult({
      items: filteredItems, 
      skill: droppedSkill || null 
    }); 

    setPlayer(prev => {
      const updatedCollection = { ...(prev.collection || {}) };
      const mId = enemy.id;

      if (!updatedCollection[mId]) {
        updatedCollection[mId] = [];
      }

      droppedItems.forEach(item => {
        if (item.type !== 'SKILL' && !updatedCollection[mId].includes(item.name)) {
          updatedCollection[mId].push(item.name);
        }
      });

      const monsterLootRequirement = (enemy.lootTable || []).filter(l => l.type !== 'SKILL');
      const isNowComplete = monsterLootRequirement.every(l => updatedCollection[mId].includes(l.name));
      
      if (isNowComplete && monsterLootRequirement.length > 0) {
        setLogs(l => [`🏆 สะสมไอเทมของ ${enemy.name} ครบแล้ว!`, ...l].slice(0, 10));
      }

      const currentUnlocked = prev.unlockedPassives || [];
      let nextUnlocked = [...currentUnlocked];
      
      if (droppedSkill && droppedSkill.skillId) {
        if (!nextUnlocked.includes(droppedSkill.skillId)) {
          nextUnlocked.push(droppedSkill.skillId);
        }
      }

      return { 
        ...prev, 
        exp: prev.exp + (enemy.expReward || enemy.exp || 20), 
        inventory: [...(prev.inventory || []), ...droppedItems, monsterCard],
        collection: updatedCollection,
        unlockedPassives: nextUnlocked 
      };
    });
  };

  return { 
    isCombat, enemy, lootResult, monsterSkillUsed, combatPhase, damageTexts,
    skillTexts,
    currentMap, gameState, handleSelectMap, setGameState,      
    startCombat, handleAttack, handleFlee: () => finishCombat(), finishCombat 
  };
}