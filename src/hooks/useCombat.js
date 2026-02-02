// src/hooks/useCombat.jsx
import React, { useState } from 'react'; // ✅ เพิ่ม useState เพื่อจัดการระบบแผนที่
import { useCombatState } from './useCombatState'; 
import { calculatePlayerDamage, calculateMonsterAttack } from '../utils/combatUtils';
import { calculateLoot } from '../utils/lootUtils';

// ✅ นำเข้า Logic สำหรับหาค่า Stat สุทธิ
import { getPassiveBonus } from '../utils/characterUtils';
import { titles as allTitles } from '../data/titles';
import { MONSTER_SKILLS } from '../data/passive';
import { useCharacterStats } from './useCharacterStats';

/**
 * useCombat: Hook สำหรับควบคุม Flow การต่อสู้ (Refactored Version)
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

  // 🌍 [เพิ่มใหม่] State สำหรับจัดการแผนที่ (หัวใจหลักที่ทำให้กดติด!)
  const [currentMap, setCurrentMap] = useState(null); 
  const [gameState, setGameState] = useState('START_SCREEN'); 

  // 🛡️ คำนวณ Stat สุทธิของผู้เล่น ณ ระดับ Hook
  const activeTitle = allTitles.find(t => t.id === player.activeTitleId) || allTitles[0];
  const passiveBonuses = getPassiveBonus(player.equippedPassives, MONSTER_SKILLS);
  const { finalAtk, finalDef } = useCharacterStats(player, activeTitle, passiveBonuses);

  // ==========================================
  // 🗺️ 1.5 MAP SELECTION LOGIC (เพิ่มใหม่เพื่อรับคำสั่งเลือกแมพ)
  // ==========================================
  const handleSelectMap = (map) => {
    // เช็คเลเวลผู้เล่นตามเงื่อนไขแมพ
    setCurrentMap(map);          // ✅ บันทึกแผนที่ปัจจุบัน
    setGameState('EXPLORING');   // ✅ เปลี่ยนสถานะเพื่อเปลี่ยนหน้าจอ
    setLogs(prev => [`📍 เริ่มการเดินทางสู่: ${map.name}`, ...prev]);
  };

  // ==========================================
  // 💀 2. GAME OVER LOGIC - คงเดิม 100%
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
  // ⚔️ 3. COMBAT FLOW - คงเดิม 100%
  // ==========================================
  const startCombat = (monster) => {
    resetCombatState(); 
    setEnemy({ ...monster });
    setIsCombat(true);
    setCombatPhase('PLAYER_TURN'); 
    
    const msg = monster.isBoss ? `🔥 [BOSS] !!! เผชิญหน้ากับ ${monster.name} !!!` : `🚨 เผชิญหน้ากับ ${monster.name}!`;
    setLogs(prev => [msg, ...prev].slice(0, 10));
  };

  const finishCombat = () => {
    const isBossDefeated = enemy && (enemy.isBoss || enemy.id === inDungeon?.bossId);
    
    // ✅ [จุดแก้ไขสำคัญ] สั่งก้าวเดินในดันเจี้ยนเมื่อกดปิดหน้าต่างสรุปผล (หลังจากชนะมอนสเตอร์ปกติ)
    if (combatPhase === 'VICTORY' && inDungeon && !isBossDefeated) {
      if (typeof advanceDungeon === 'function') {
        advanceDungeon(); 
      }
    }

    setIsCombat(false);
    setEnemy(null);
    setCombatPhase('IDLE'); 
    setLootResult(null); // ✅ อย่าลืมเคลียร์ค่า Loot ด้วยจ่ะ

    if (isBossDefeated) {
      exitDungeon(); 
      setLogs(prev => [`🎉 [VICTORY] พิชิตดันเจี้ยนสำเร็จ!`, ...prev]);
    }
  };

  const lastDamageTime = React.useRef(0);

  // ==========================================
  // 🥊 4. ATTACK LOGIC (ระบบคำนวณการโจมตี) - คงเดิม 100%
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
      // 🚶‍♂️ [ย้ายออก] เราย้าย advanceDungeon() ไปไว้ใน finishCombat() เพื่อให้ Step อัปเดตหลังจากปิดหน้าสรุปของรางวัลจ่ะ
      
      const isInDungeon = !!inDungeon; 
      const dungeonDropBonus = isInDungeon ? 1.03 : 1.0;
      const { droppedItems, logs: lootLogs } = calculateLoot(enemy.lootTable || [], player, dungeonDropBonus);
      if (lootLogs.length > 0) setLogs(prev => [...lootLogs, ...prev].slice(0, 15));
      setLootResult(droppedItems); 
      setPlayer(prev => ({ 
        ...prev, gold: prev.gold + (enemy.gold || 0), 
        exp: prev.exp + (enemy.exp || 20), 
        inventory: [...(prev.inventory || []), ...droppedItems]
      }));
    }
  };

  // ✅ เพิ่มค่า return ใหม่เพื่อให้ App และ Renderer นำไปใช้งานได้จริง
  return { 
    isCombat, 
    enemy, 
    lootResult, 
    monsterSkillUsed, 
    combatPhase,
    damageTexts,
    currentMap,       // 🌍 ส่งออกสถานะแมพ
    gameState,        // 🌍 ส่งออกสถานะหน้าจอ
    handleSelectMap,  // 🌍 ส่งออกฟังก์ชันตอนคลิกเลือกแมพ
    setGameState,     // 🌍 ส่งออกฟังก์ชันเปลี่ยนสถานะ (เผื่อกดย้อนกลับ)
    startCombat, 
    handleAttack, 
    handleFlee: () => finishCombat(), 
    finishCombat 
  };
}