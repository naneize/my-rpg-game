// src/utils/combatUtils.js
import { passiveEffects, activeEffects } from '../data/skillEffects';

/**
 * ⚔️ 1. คำนวณความเสียหายที่ผู้เล่นทำได้
 * คำนวณจาก ATK ผู้เล่น - DEF ศัตรู และคำนวณผลของ Passive มอนสเตอร์ (ถ้ามี)
 */
export const calculatePlayerDamage = (player, enemy) => {
  const enemyDef = enemy.stats?.def || enemy.def || 0;
  let dmgBase = player.atk - enemyDef;

  // ตรวจสอบ Passive ของศัตรูผ่านสมุดสูตร (passiveEffects)
  if (enemy.skills) {
    enemy.skills.forEach(skill => {
      if (passiveEffects[skill.name]) {
        dmgBase = passiveEffects[skill.name](dmgBase);
      }
    });
  }

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

  if (enemy.skills && enemy.skills.length > 0) {
    for (const skill of enemy.skills) {
      // 🟢 2.1 เช็คเงื่อนไข Special (ท่าไม้ตายเมื่อเลือดต่ำกว่า 20%)
      if (skill.condition.includes("Special") && hpPercent <= 0.2) {
        monsterAtk = activeEffects[skill.name] ? activeEffects[skill.name](monsterAtk) : monsterAtk * 2;
        skillUsed = skill;
        break; // เลือกท่าไม้ตายแล้วหยุดทันที
      } 
      
      // 🔵 2.2 เช็คเงื่อนไข Active (สุ่มใช้ตามโอกาส หรือรอบของ Boss)
      else if (skill.condition.includes("Active")) {
        const isBossTurn = enemy.isBoss && turnCount % 3 === 0;
        const isNormalChance = !enemy.isBoss && Math.random() < 0.35; // โอกาส 35%
        
        if (isBossTurn || isNormalChance) {
          monsterAtk = activeEffects[skill.name] ? activeEffects[skill.name](monsterAtk) : Math.floor(monsterAtk * 1.5);
          skillUsed = skill;
          break; // เลือกใช้สกิลนี้แล้วจบการทำงานในเทิร์นนี้
        }
      }
    }
  }

  // ส่ง damage ที่คำนวณแล้ว และ skillUsed กลับไปให้ useCombat.jsx
  return { damage: Math.floor(monsterAtk), skillUsed };
};