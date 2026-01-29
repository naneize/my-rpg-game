// src/hooks/useCombat.jsx
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
    enemy, setEnemy,
    lootResult, setLootResult,
    monsterSkillUsed, setMonsterSkillUsed,
    turnCount, setTurnCount,
    combatPhase, setCombatPhase, 
    resetCombatState
  } = useCombatState();

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

  // ==========================================
  // 🥊 4. ATTACK LOGIC (ระบบคำนวณการโจมตี)
  // ==========================================
  const handleAttack = () => {
    // 🛡️ เช็คเงื่อนไขพื้นฐาน (ไม่มีคำว่า isInputLocked แล้วเพื่อแก้ ReferenceError)
    if (combatPhase !== 'PLAYER_TURN' || !enemy || enemy.hp <= 0 || player.hp <= 0 || lootResult) return;

    // ✅ [เพิ่มใหม่] คำนวณ Stat สุทธิของผู้เล่น ณ ขณะนั้น
    const activeTitle = allTitles.find(t => t.id === player.activeTitleId) || allTitles[0];
    const passiveBonuses = getPassiveBonus(player.equippedPassives, MONSTER_SKILLS);
    const { finalAtk, finalDef } = useCharacterStats(player, activeTitle, passiveBonuses);

    const playerWithBonus = { 
      ...player, 
      atk: finalAtk 
    };

    setCombatPhase('ENEMY_TURN'); 
    const currentTurn = turnCount + 1;
    setTurnCount(currentTurn);

    // 🅰️ ผู้เล่นโจมตี (เรียกใช้ Utility เดิม)
    const playerDmg = calculatePlayerDamage(playerWithBonus, enemy);
    const newMonsterHp = Math.max(0, enemy.hp - playerDmg);
    
    setEnemy(prev => ({ ...prev, hp: newMonsterHp }));
    setLogs(prev => [`⚔️ โจมตี ${enemy.name} -${playerDmg}`, ...prev].slice(0, 10));

    // --- 🅱️ ตรวจสอบว่ามอนสเตอร์ยังไม่ตายเพื่อตีสวน ---
    if (newMonsterHp > 0) {
      setTimeout(() => {
        const { damage, skillUsed } = calculateMonsterAttack({ ...enemy, hp: newMonsterHp }, currentTurn);

        // ✅ [แก้ไข] กำหนดเวลาหน่วง 1000ms เมื่อมีสกิล เพื่อให้ Popup แสดงผลทัน
        const skillDelay = skillUsed ? 1000 : 0;

        if (skillUsed) {
          setMonsterSkillUsed(skillUsed);
          setLogs(l => [`🔥 ${enemy.name} ใช้สกิล: ${skillUsed.name}!`, ...l]);
          // เคลียร์สถานะสกิลตามเวลาที่กำหนด
          setTimeout(() => setMonsterSkillUsed(null), skillDelay);
        }

        const monsterFinalDmg = Math.max(1, damage - finalDef);
        const nextHp = Math.max(0, player.hp - monsterFinalDmg);

        setPlayer(prev => ({ ...prev, hp: nextHp }));
        setLogs(l => [`⚠️ ${enemy.name} ตีสวน -${monsterFinalDmg}`, ...l].slice(0, 10));

        if (nextHp <= 0) {
          setCombatPhase('DEFEAT');
          setTimeout(() => handleGameOver(), 1000);
        } else {
          // ✅ [แก้ไข] คืนเทิร์นให้ผู้เล่นหลังจากที่ Popup หายไปแล้วเท่านั้น เพื่อปลดล็อคปุ่มสีเทา
          setTimeout(() => {
            setCombatPhase('PLAYER_TURN'); 
          }, skillDelay);
        }
      }, 500);
    } else {
      // ==========================================
      // 🏆 5. VICTORY & LOOT - คงเดิม 100%
      // ==========================================
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
    startCombat, 
    handleAttack, 
    handleFlee: () => finishCombat(), 
    finishCombat 
  };
}