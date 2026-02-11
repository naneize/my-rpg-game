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

  const [attackCombo, setAttackCombo] = useState(0);

  
  // 💨 ข้อมูลสกิลที่มอนสเตอร์เพิ่งใช้ (เอาไว้โชว์ UI)
  const [monsterSkillUsed, setMonsterSkillUsed] = useState(null);
  
  // 🔄 นับรอบการต่อสู้ (เอาไว้เช็คเงื่อนไขใช้สกิลทุกๆ X รอบ)
  const [turnCount, setTurnCount] = useState(0);

  // ⏱️ Phase ของการต่อสู้ (ป้องกันการกดรัวๆ ระหว่าง Animation)
  const [combatPhase, setCombatPhase] = useState('IDLE');

  // 💥 ส่วนที่เก็บตัวเลขความเสียหาย (Damage Texts)
  const [damageTexts, setDamageTexts] = useState([]);

  // ✨ [เพิ่มใหม่] ส่วนที่เก็บข้อความชื่อสกิลมอนสเตอร์ (Skill Floating Texts)
  const [skillTexts, setSkillTexts] = useState([]);

  /**
   * ฟังก์ชันสำหรับสั่งให้เลข Damage เด้ง
   * @param {number} value - จำนวนดาเมจ
   * @param {string} type - 'player', 'monster' หรือ 'reflect'
   */
  const addDamageText = (value, type) => {
    if (value <= 0) return;

    const id = Date.now() + Math.random(); 
    const newText = { id, value, type };
    
    // ✅ ใช้ Functional Update เพื่อลดการทำงานหนักของ CPU บนมือถือ
    setDamageTexts((prev) => [...prev, newText].slice(-10)); // เก็บตัวเลขไว้ไม่เกิน 10 อันพร้อมกันเพื่อกันเครื่องค้าง

    setTimeout(() => {
      setDamageTexts((prev) => prev.filter((t) => t.id !== id));
    }, 600);
  };

  /**
   * ✨ [เพิ่มใหม่] ฟังก์ชันสำหรับสั่งให้ชื่อสกิลเด้งขึ้นบนจอ
   * @param {string} skillName - ชื่อสกิลของมอนสเตอร์
   */
  const addSkillText = (skillName) => {
    if (!skillName) return;

    const id = Date.now() + Math.random();
    const newSkill = { id, name: skillName };

    setSkillTexts((prev) => [...prev, newSkill]);

    // ลบข้อความสกิลออกหลังจาก 1.2 วินาที (นานกว่าดาเมจเล็กน้อยเพื่อให้คนอ่านทัน)
    setTimeout(() => {
      setSkillTexts((prev) => prev.filter((t) => t.id !== id));
    }, 1200);
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
    setDamageTexts([]); 
    setSkillTexts([]); // ✅ ล้างชื่อสกิลที่ค้างอยู่ด้วย
  };

  return {
    isCombat, setIsCombat,
    enemy, setEnemy,
    lootResult, setLootResult,
    monsterSkillUsed, setMonsterSkillUsed,
    turnCount, setTurnCount,
    combatPhase, setCombatPhase,
    attackCombo, setAttackCombo,
    damageTexts,    
    addDamageText, 
    skillTexts,     // 👈 [ส่งออกใหม่] เพื่อให้ UI นำไป Map แสดงผล
    addSkillText,   // 👈 [ส่งออกใหม่] เพื่อให้ useCombat เรียกใช้แทนการเปิด Popup
    resetCombatState
  };
};