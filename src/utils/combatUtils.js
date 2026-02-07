// src/utils/combatUtils.js
import { passiveEffects, activeEffects } from '../data/skillEffects';

/**
 * ⚔️ 1. คำนวณความเสียหายที่ผู้เล่นทำได้ (คงเดิม 100%)
 */
export const calculatePlayerDamage = (player, enemy) => {
  const playerAtk = player.atk || 10;
  const enemyDef = enemy.stats?.def || enemy.def || 0;

  // 📝 LOG 1: ดูว่าฟังก์ชันนี้เห็น ATK ของเราเป็นเท่าไหร่
  console.log(`[Combat] Player ATK: ${playerAtk}, Enemy DEF: ${enemyDef}`);

  // 🚩 1. คำนวณดาเมจพื้นฐาน
  let dmg = playerAtk - enemyDef;

  // 🛡️ 2. ตรวจสอบ Passive ของศัตรู
  if (enemy.skills && Array.isArray(enemy.skills)) {
    enemy.skills.forEach(skill => {
      if (passiveEffects[skill.name]) {
        const oldDmg = dmg;
        dmg = passiveEffects[skill.name](dmg);
        console.log(`[Combat] Skill "${skill.name}" reduced damage from ${oldDmg} to ${dmg}`);
      }
    });
  }

  // 🚩 3. ป้องกันอาการ "ตีไม่เข้า" และคืนค่าสุดท้าย
  const finalResult = Math.floor(Math.max(1, dmg));

  // 📝 LOG 2: ดูผลลัพธ์สุดท้าย
  console.log(`[Combat] Final Calculated Damage: ${finalResult}`);

  return finalResult;
};

/**
 * 🧠 2. คำนวณการโจมตีของมอนสเตอร์ (เพิ่มระบบเจาะเกราะขั้นต่ำ)
 * @param {Object} enemy - ข้อมูลมอนสเตอร์
 * @param {Number} turnCount - รอบการต่อสู้
 * @param {Number} playerDef - ค่า DEF ของผู้เล่น (ส่งมาจาก useCombat)
 */
export const calculateMonsterAttack = (enemy, turnCount, playerDef = 0) => {
  let monsterAtk = enemy.atk;
  let skillUsed = null;
  const hpPercent = enemy.hp / enemy.maxHp;

  // --- Logic การใช้ Skill (คงเดิม 100%) ---
  if (enemy.skills && Array.isArray(enemy.skills) && enemy.skills.length > 0) {
    for (const skill of enemy.skills) {
      if (skill.condition && skill.condition.includes("Special") && hpPercent <= 0.2) {
        monsterAtk = activeEffects[skill.name] ? activeEffects[skill.name](monsterAtk) : monsterAtk * 2;
        skillUsed = skill;
        break;
      } else if (skill.condition && skill.condition.includes("Active")) {
        const isBossTurn = enemy.isBoss && turnCount % 3 === 0;
        const isNormalChance = !enemy.isBoss && Math.random() < 0.30; 
        if (isBossTurn || isNormalChance) {
          monsterAtk = activeEffects[skill.name] ? activeEffects[skill.name](monsterAtk) : Math.floor(monsterAtk * 1.5);
          skillUsed = skill;
          break;
        }
      }
    }
  }

  // 🚩 [ส่วนที่แก้ไข] การคำนวณ Damage จริง
  // 1. คำนวณแบบหักลบปกติ
  const rawDamage = monsterAtk - playerDef;
  
  // 2. คำนวณดาเมจขั้นต่ำ (Minimum 10% ของ ATK มอนสเตอร์) เพื่อไม่ให้ตีเข้าแค่ 1
  const minDamage = Math.floor(monsterAtk * 0.1); 
  
  // 3. เลือกค่าที่มากที่สุดระหว่าง ดาเมจที่ลบแล้ว หรือ ดาเมจขั้นต่ำ 10%
  const finalDamage = Math.max(minDamage, rawDamage, 1);

  console.log(`[Monster Attack] Raw: ${rawDamage}, Min(10%): ${minDamage} -> Final: ${finalDamage}`);

  return { damage: Math.floor(finalDamage), skillUsed };
};