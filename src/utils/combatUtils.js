// src/utils/combatUtils.js
import { passiveEffects, activeEffects } from '../data/skillEffects';

/**
 * ⚔️ 1. คำนวณความเสียหายที่ผู้เล่นทำได้ (ฉบับเพิ่ม Log ตรวจสอบ)
 */
export const calculatePlayerDamage = (player, enemy) => {
  const playerAtk = player.atk || 10;
  const enemyDef = enemy.stats?.def || enemy.def || 0;

  // 📝 LOG 1: ดูว่าฟังก์ชันนี้เห็น ATK ของเราเป็นเท่าไหร่ (ควรเป็น 25)
  console.log(`[Combat] Player ATK: ${playerAtk}, Enemy DEF: ${enemyDef}`);

  // 🚩 1. คำนวณดาเมจพื้นฐาน (25 - enemyDef)
  // ใช้ตัวแปรเดียว (dmg) เพื่อให้ค่าไหลต่อเนื่อง
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

  // 📝 LOG 2: ดูผลลัพธ์สุดท้ายก่อนส่งไปแสดงผลบนหัวมอนสเตอร์
  console.log(`[Combat] Final Calculated Damage: ${finalResult}`);

  return finalResult;
};

/**
 * 🧠 2. คำนวณการโจมตีของมอนสเตอร์ (AI Logic) - คงเดิม 100%
 */
export const calculateMonsterAttack = (enemy, turnCount) => {
  let monsterAtk = enemy.atk;
  let skillUsed = null;
  const hpPercent = enemy.hp / enemy.maxHp;

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
  return { damage: Math.floor(monsterAtk), skillUsed };
};