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

  // 💥 ส่วนที่เพิ่มใหม่: สถานะสำหรับตัวเลขความเสียหาย
  // เราเก็บเป็น Array เพื่อให้เด้งพร้อมกันหลายตัวได้ (เช่น ถ้าอนาคตมีระบบตีเบิ้ล)
  const [damageTexts, setDamageTexts] = useState([]);

  /**
   * ฟังก์ชันสำหรับสั่งให้เลข Damage เด้ง
   * @param {number} value - จำนวนดาเมจ
   * @param {string} type - 'player' (เด้งบนตัวเรา) หรือ 'monster' (เด้งบนตัวศัตรู)
   */
  const addDamageText = (value, type) => {
    const id = Date.now() + Math.random(); // สร้าง ID เฉพาะตัว
    const newText = { id, value, type };
    
    setDamageTexts((prev) => [...prev, newText]);

    // ลบตัวเลขออกหลังจาก Animation จบ (เช่น 800ms)
    setTimeout(() => {
      setDamageTexts((prev) => prev.filter((t) => t.id !== id));
    }, 600);
  };

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
    setDamageTexts([]); // ✅ อย่าลืมล้างเลขดาเมจที่ค้างอยู่ด้วยนะจ๊ะ
  };

  return {
    isCombat, setIsCombat,
    enemy, setEnemy,
    lootResult, setLootResult,
    monsterSkillUsed, setMonsterSkillUsed,
    turnCount, setTurnCount,
    combatPhase, setCombatPhase,
    damageTexts,    // 👈 ส่งออกไปให้ UI ใช้
    addDamageText, // 👈 ส่งออกไปให้ useCombat เรียกใช้
    resetCombatState
  };
};