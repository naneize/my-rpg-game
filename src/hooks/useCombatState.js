import { useState } from 'react';

/**
 * useCombatState: จัดเก็บและจัดการสถานะ (State) ทั้งหมดของการต่อสู้
 */
export const useCombatState = () => {
  // ⚔️ สถานะหลัก: กำลังต่อสู้อยู่หรือไม่
  const [isCombat, setIsCombat] = useState(false);
  
  // 👾 ข้อมูลศัตรูที่กำลังเผชิญหน้า
  const [enemy, setEnemy] = useState(null);
  
  // 🎁 ผลลัพธ์ไอเทมดรอปหลังชนะ
  const [lootResult, setLootResult] = useState(null);
  
  // 💨 ข้อมูลสกิลที่มอนสเตอร์เพิ่งใช้ (เอาไว้โชว์ UI)
  const [monsterSkillUsed, setMonsterSkillUsed] = useState(null);
  
  // 🔄 นับรอบการต่อสู้ (เอาไว้เช็คเงื่อนไขใช้สกิลทุกๆ X รอบ)
  const [turnCount, setTurnCount] = useState(0);

  // ⏱️ Phase ของการต่อสู้ (ป้องกันการกดรัวๆ ระหว่าง Animation)
  // 'IDLE', 'PLAYER_TURN', 'ENEMY_TURN', 'VICTORY', 'DEFEAT'
  const [combatPhase, setCombatPhase] = useState('IDLE');

  /**
   * ฟังก์ชัน Reset State ทั้งหมดเมื่อจบการต่อสู้
   */
  const resetCombatState = () => {
    setIsCombat(false);
    setEnemy(null);
    setLootResult(null);
    setMonsterSkillUsed(null);
    setTurnCount(0);
    setCombatPhase('IDLE');
  };

  return {
    isCombat, setIsCombat,
    enemy, setEnemy,
    lootResult, setLootResult,
    monsterSkillUsed, setMonsterSkillUsed,
    turnCount, setTurnCount,
    combatPhase, setCombatPhase,
    resetCombatState
  };
};