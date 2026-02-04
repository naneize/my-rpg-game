import React, { useState } from 'react'; 
import { useCombatState } from './useCombatState'; 
import { calculatePlayerDamage, calculateMonsterAttack } from '../utils/combatUtils';
import { calculateLoot } from '../utils/lootUtils';

// ✅ นำเข้า Logic สำหรับหาค่า Stat สุทธิ
import { getPassiveBonus } from '../utils/characterUtils';
import { titles as allTitles } from '../data/titles';
import { MONSTER_SKILLS } from '../data/passive';
import { useCharacterStats } from './useCharacterStats';

/**
 * useCombat: Hook สำหรับควบคุม Flow การต่อสู้ (อัปเดตระบบ Monster Collection)
 */
export function useCombat(player, setPlayer, setLogs, advanceDungeon, exitDungeon, inDungeon) { 
  
  // ==========================================
  // 💾 1. STATE MANAGEMENT (ดึงมาจาก useCombatState)
  // ==========================================
  const {
    isCombat, setIsCombat,
    addDamageText,
    damageTexts,
    enemy, setEnemy,
    lootResult, setLootResult,
    monsterSkillUsed, setMonsterSkillUsed,
    turnCount, setTurnCount,
    combatPhase, setCombatPhase, 
    resetCombatState
  } = useCombatState();

  // 🌍 State สำหรับจัดการแผนที่
  const [currentMap, setCurrentMap] = useState(null); 
  const [gameState, setGameState] = useState('START_SCREEN'); 

  // 🛡️ คำนวณ Stat สุทธิของผู้เล่น
  const activeTitle = allTitles.find(t => t.id === player.activeTitleId) || allTitles[0];
  const passiveBonuses = getPassiveBonus(player.equippedPassives, MONSTER_SKILLS);
  const { finalAtk, finalDef } = useCharacterStats(player, activeTitle, passiveBonuses);

  // ==========================================
  // 🗺️ 1.5 MAP SELECTION LOGIC
  // ==========================================
  const handleSelectMap = (map) => {
    setCurrentMap(map);          
    setGameState('EXPLORING');   
    setLogs(prev => [`📍 เริ่มการเดินทางสู่: ${map.name}`, ...prev]);
  };

  // ==========================================
  // 💀 2. GAME OVER LOGIC
  // ==========================================
  const handleGameOver = () => {
    if (exitDungeon) exitDungeon();
    setLogs(prev => ["💀 คุณพ่ายแพ้สลบไป...", ...prev].slice(0, 10));
    setTimeout(() => {
      finishCombat();
      setPlayer(prev => ({ ...prev, hp: prev.maxHp }));
    }, 2000);
  };

  // ==========================================
  // ⚔️ 3. COMBAT FLOW
  // ==========================================
  const startCombat = (monster) => {
    resetCombatState(); 
    setEnemy({ ...monster });
    setIsCombat(true);
    setCombatPhase('PLAYER_TURN'); 
    
    // ✅ เพิ่มการเช็คสถานะ Shiny เพื่อโชว์ Log พิเศษ
    const shinyTag = monster.isShiny ? "✨ [SHINY] " : "";
    const msg = monster.isBoss ? `🔥 [BOSS] !!! เผชิญหน้ากับ ${monster.name} !!!` : `🚨 ${shinyTag}เผชิญหน้ากับ ${monster.name}!`;
    setLogs(prev => [msg, ...prev].slice(0, 10));
  };

  const finishCombat = () => {
    const isBossDefeated = enemy && (enemy.isBoss || enemy.id === inDungeon?.bossId);
    
    if (combatPhase === 'VICTORY' && inDungeon && !isBossDefeated) {
      if (typeof advanceDungeon === 'function') {
        advanceDungeon(); 
      }
    }

    setIsCombat(false);
    setEnemy(null);
    setCombatPhase('IDLE'); 
    setLootResult(null); 

    if (isBossDefeated) {
      exitDungeon(); 
      setLogs(prev => [`🎉 [VICTORY] พิชิตดันเจี้ยนสำเร็จ!`, ...prev]);
    }
  };

  const lastDamageTime = React.useRef(0);

  // ==========================================
  // 🥊 4. ATTACK LOGIC
  // ==========================================
  const handleAttack = () => {
    const now = Date.now();
    if (now - lastDamageTime.current < 100) return;
    if (combatPhase !== 'PLAYER_TURN' || !enemy || enemy.hp <= 0 || player.hp <= 0 || lootResult) return;

    const playerWithBonus = { ...player, atk: finalAtk };
    setCombatPhase('ENEMY_TURN'); 
    const currentTurn = turnCount + 1;
    setTurnCount(currentTurn);

    const playerDmg = calculatePlayerDamage(playerWithBonus, enemy);
    const newMonsterHp = Math.max(0, enemy.hp - playerDmg);

    lastDamageTime.current = now;
    addDamageText(playerDmg, 'monster');
    setEnemy(prev => ({ ...prev, hp: newMonsterHp }));
    setLogs(prev => [`⚔️ โจมตี ${enemy.name} -${playerDmg}`, ...prev].slice(0, 10));

    if (newMonsterHp > 0) {
      setTimeout(() => {
        const { damage, skillUsed } = calculateMonsterAttack({ ...enemy, hp: newMonsterHp }, currentTurn);
        const skillDelay = skillUsed ? 1000 : 0;
        if (skillUsed) {
          setMonsterSkillUsed(skillUsed);
          setLogs(l => [`🔥 ${enemy.name} ใช้สกิล: ${skillUsed.name}!`, ...l]);
          setTimeout(() => setMonsterSkillUsed(null), skillDelay);
        }
        const monsterFinalDmg = Math.max(1, damage - finalDef);
        const nextHp = Math.max(0, player.hp - monsterFinalDmg);
        addDamageText(monsterFinalDmg, 'player');
        setPlayer(prev => ({ ...prev, hp: nextHp }));
        setLogs(l => [`⚠️ ${enemy.name} ตีสวน -${monsterFinalDmg}`, ...l].slice(0, 10));
        if (nextHp <= 0) {
          setCombatPhase('DEFEAT');
          setTimeout(() => handleGameOver(), 1000);
        } else {
          setTimeout(() => { setCombatPhase('PLAYER_TURN'); }, skillDelay);
        }
      }, 500);
    } else {
      setCombatPhase('VICTORY');
      
      // ✅ [ปรับปรุง] Logic การปลดล็อก Monster Collection Card ให้บันทึกตามตัวที่เจอจริง
      const monsterCard = {
        id: `card-${enemy.id}-${Date.now()}`,
        monsterId: enemy.id, // เชื่อมกับ ID ใน CollectionView
        name: enemy.name,
        type: 'MONSTER_CARD', // ระบุประเภทเพื่อให้ Collection กรองถูก
        rarity: enemy.rarity,
        // ✅ เปลี่ยนจากการสุ่ม 5% เป็นการดึงค่าจากตัวมอนสเตอร์ที่สู้ด้วยจริงๆ
        isShiny: enemy.isShiny || false 
      };

      const isInDungeon = !!inDungeon; 
      const dungeonDropBonus = isInDungeon ? 1.03 : 1.0;
      const { droppedItems, logs: lootLogs } = calculateLoot(enemy.lootTable || [], player, dungeonDropBonus);
      
      if (lootLogs.length > 0) setLogs(prev => [...lootLogs, ...prev].slice(0, 15));
      
      // ✨ เพิ่มข้อความพิเศษถ้าชนะ Shiny
      if (enemy.isShiny) {
        setLogs(prev => [`✨ [RARE] คุณพิชิต Shiny ${enemy.name} และได้รับบันทึกพิเศษ!`, ...prev]);
      }

      setLootResult(droppedItems); 

      setPlayer(prev => ({ 
        ...prev, 
        // ✅ รับ Gold และ Exp ตามสเตตัสของตัวที่สู้ (ซึ่งคูณมาแล้วถ้าเป็น Shiny)
        gold: prev.gold + (enemy.goldReward || enemy.gold || 0), 
        exp: prev.exp + (enemy.expReward || enemy.exp || 20), 
        // ✅ เก็บทั้งไอเทมดรอปธรรมดา และการ์ดมอนสเตอร์ลงในกระเป๋า
        inventory: [...(prev.inventory || []), ...droppedItems, monsterCard]
      }));
    }
  };

  return { 
    isCombat, 
    enemy, 
    lootResult, 
    monsterSkillUsed, 
    combatPhase,
    damageTexts,
    currentMap,      
    gameState,        
    handleSelectMap,  
    setGameState,     
    startCombat, 
    handleAttack, 
    handleFlee: () => finishCombat(), 
    finishCombat 
  };
}