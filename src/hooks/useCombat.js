// src/hooks/useCombat.jsx
import React from 'react'; // ✅ เพิ่มการนำเข้า React เพื่อให้ใช้ React.useRef ได้
import { useCombatState } from './useCombatState'; 
import { calculatePlayerDamage, calculateMonsterAttack } from '../utils/combatUtils';
import { calculateLoot } from '../utils/lootUtils';

// ✅ [เพิ่มใหม่] นำเข้า Logic สำหรับหาค่า Stat สุทธิ (เพื่อเอา DEF+1 มาคำนวณ)
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

  // 🛡️ [ย้ายมาตรงนี้] คำนวณ Stat สุทธิของผู้เล่น ณ ระดับ Hook (เพื่อไม่ให้เกิด Re-render ซ้ำซ้อนในฟังก์ชัน)
  // การคำนวณข้างนอก handleAttack จะช่วยแก้ปัญหา "เลขเด้ง 2 รอบ" ได้จ่ะ
  const activeTitle = allTitles.find(t => t.id === player.activeTitleId) || allTitles[0];
  const passiveBonuses = getPassiveBonus(player.equippedPassives, MONSTER_SKILLS);
  const { finalAtk, finalDef } = useCharacterStats(player, activeTitle, passiveBonuses);

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
    
    setIsCombat(false);
    setEnemy(null);
    setCombatPhase('IDLE'); 

    if (isBossDefeated) {
      exitDungeon(); 
      setLogs(prev => [`🎉 [VICTORY] พิชิตดันเจี้ยนสำเร็จ!`, ...prev]);
    }
  };

  // 🛡️ [เพิ่มใหม่] ตัวแปรอ้างอิงสำหรับจำเวลาล่าสุดที่เลข Damage เด้ง (ป้องกันบั๊กเลขซ้อน)
  const lastDamageTime = React.useRef(0);

  // ==========================================
  // 🥊 4. ATTACK LOGIC (ระบบคำนวณการโจมตี)
  // ==========================================
  const handleAttack = () => {
    
    // ⏱️ [เพิ่มใหม่] ตรวจสอบเวลาปัจจุบัน
    const now = Date.now();
    // ถ้าเพิ่งมีการทำงานไปเมื่อไม่เกิน 100ms ให้หยุดการทำงาน (ป้องกันการเบิ้ลจังหวะ Re-render)
    if (now - lastDamageTime.current < 100) return;

    // 🛡️ เช็คเงื่อนไขพื้นฐาน
    if (combatPhase !== 'PLAYER_TURN' || !enemy || enemy.hp <= 0 || player.hp <= 0 || lootResult) return;

    // ✨ [แก้ไข] ไม่ต้องเรียก useCharacterStats ในนี้แล้ว เพราะเราย้ายไปคำนวณด้านบนเตรียมไว้แล้ว
    const playerWithBonus = { 
      ...player, 
      atk: finalAtk 
    };

    setCombatPhase('ENEMY_TURN'); 
    const currentTurn = turnCount + 1;
    setTurnCount(currentTurn);

    // 🅰️ ผู้เล่นโจมตี
    const playerDmg = calculatePlayerDamage(playerWithBonus, enemy);
    const newMonsterHp = Math.max(0, enemy.hp - playerDmg);

    // 💥 สั่งเด้งเลข Damage (เพิ่มการบันทึก Timestamp เพื่อล็อคจังหวะ)
    lastDamageTime.current = now;
    addDamageText(playerDmg, 'monster');
    
    setEnemy(prev => ({ ...prev, hp: newMonsterHp }));
    setLogs(prev => [`⚔️ โจมตี ${enemy.name} -${playerDmg}`, ...prev].slice(0, 10));

    // --- 🅱️ ตรวจสอบว่ามอนสเตอร์ยังไม่ตายเพื่อตีสวน ---
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

        // 👈 สั่งเด้งเลขบนตัวผู้เล่น
        addDamageText(monsterFinalDmg, 'player');

        setPlayer(prev => ({ ...prev, hp: nextHp }));
        setLogs(l => [`⚠️ ${enemy.name} ตีสวน -${monsterFinalDmg}`, ...l].slice(0, 10));

        if (nextHp <= 0) {
          setCombatPhase('DEFEAT');
          setTimeout(() => handleGameOver(), 1000);
        } else {
          setTimeout(() => {
            setCombatPhase('PLAYER_TURN'); 
          }, skillDelay);
        }
      }, 500);
    } else {
      // 🏆 VICTORY & LOOT - คงเดิม
      setCombatPhase('VICTORY');
      if (advanceDungeon) advanceDungeon();

      const isInDungeon = !!inDungeon; 
      const dungeonDropBonus = isInDungeon ? 1.03 : 1.0;
      
      const { droppedItems, logs: lootLogs } = calculateLoot(enemy.lootTable || [], player, dungeonDropBonus);
      
      if (lootLogs.length > 0) setLogs(prev => [...lootLogs, ...prev].slice(0, 15));
      setLootResult(droppedItems); 

      setPlayer(prev => ({ 
        ...prev, 
        gold: prev.gold + (enemy.gold || 0), 
        exp: prev.exp + (enemy.exp || 20), 
        inventory: [...(prev.inventory || []), ...droppedItems]
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
    startCombat, 
    handleAttack, 
    handleFlee: () => finishCombat(), 
    finishCombat 
  };
}