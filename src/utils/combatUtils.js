// src/utils/combatUtils.js
import { passiveEffects, activeEffects } from '../data/skillEffects';

/**
 * ⚔️ 1. คำนวณความเสียหายที่ผู้เล่นทำได้
 * คำนวณจาก ATK ผู้เล่น - DEF ศัตรู และคำนวณผลของ Passive มอนสเตอร์ (ถ้ามี)
 */
export const calculatePlayerDamage = (player, enemy) => {
  const enemyDef = enemy.stats?.def || enemy.def || 0;
  let dmgBase = player.atk - enemyDef;

  // 🛡️ ตรวจสอบ Passive ของศัตรูผ่านสมุดสูตร (passiveEffects)
  // ถ้ามอนสเตอร์มีสกิลสายป้องกัน ดาเมจที่เราทำได้จะถูกลดทอนลงจ่ะ
  if (enemy.skills && Array.isArray(enemy.skills)) {
    enemy.skills.forEach(skill => {
      if (passiveEffects[skill.name]) {
        dmgBase = passiveEffects[skill.name](dmgBase);
      }
    });
  }

  // คืนค่าอย่างน้อย 1 หน่วย และปัดเศษทิ้ง
  return Math.max(1, Math.floor(dmgBase));
};

/**
 * 🧠 2. คำนวณการโจมตีของมอนสเตอร์ (AI Logic)
 * คืนค่าทั้ง damage และ skillUsed เพื่อนำไปแสดงผล Popup กลางจอ
 */
export const calculateMonsterAttack = (enemy, turnCount) => {
  let monsterAtk = enemy.atk;
  let skillUsed = null;
  const hpPercent = enemy.hp / enemy.maxHp;

  if (enemy.skills && Array.isArray(enemy.skills) && enemy.skills.length > 0) {
    for (const skill of enemy.skills) {
      // 🟢 2.1 เช็คเงื่อนไข Special (ท่าไม้ตายเมื่อเลือดต่ำกว่า 20%)
      if (skill.condition && skill.condition.includes("Special") && hpPercent <= 0.2) {
        // ใช้ Logic จาก activeEffects ถ้าไม่มีให้ใช้ตัวคูณพื้นฐาน x2
        monsterAtk = activeEffects[skill.name] 
          ? activeEffects[skill.name](monsterAtk) 
          : monsterAtk * 2;
        
        skillUsed = skill;
        break; // เลือกท่าไม้ตายแล้วหยุดทันที
      } 
      
      // 🔵 2.2 เช็คเงื่อนไข Active (สุ่มใช้ตามโอกาส หรือรอบของ Boss)
      else if (skill.condition && skill.condition.includes("Active")) {
        // Boss จะใช้สกิลทุกๆ 3 เทิร์น หรือมอนสเตอร์ทั่วไปมีโอกาส 30%
        const isBossTurn = enemy.isBoss && turnCount % 3 === 0;
        const isNormalChance = !enemy.isBoss && Math.random() < 0.30; 
        
        if (isBossTurn || isNormalChance) {
          // ใช้ Logic จาก activeEffects ถ้าไม่มีให้ใช้ตัวคูณพื้นฐาน x1.5
          monsterAtk = activeEffects[skill.name] 
            ? activeEffects[skill.name](monsterAtk) 
            : Math.floor(monsterAtk * 1.5);
          
          skillUsed = skill;
          break; // เลือกใช้สกิลนี้แล้วจบการทำงานในเทิร์นนี้
        }
      }
    }
  }

  // ส่ง damage ที่คำนวณแล้ว (ยังไม่หัก Def ผู้เล่น) และ skillUsed กลับไปให้ useCombat.jsx
  return { damage: Math.floor(monsterAtk), skillUsed };
};