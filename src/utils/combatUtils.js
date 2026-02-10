import { passiveEffects, activeEffects } from '../data/skillEffects';

import { 
  getElementMultiplier, 
  getSynergyPoints, 
  calculateNetStats, 
  calculateFinalDamage 
} from './combatLogicUtils';

/**
 * ⚔️ 1. คำนวณความเสียหายที่ผู้เล่นทำได้ (เวอร์ชัน Deep Breakdown Log + Critical Hit)
 */
export const calculatePlayerDamage = (player, enemy, PLAYER_SKILLS, MONSTER_SKILLS, currentSkill, activeStatuses = []) => {
  
  // ==========================================
  // 1. เตรียมข้อมูลสเตตัสพื้นฐาน และอุปกรณ์
  // ==========================================
  const baseAtk = player.atk || 0; 
  const finalAtkFromGear = player.finalAtk || player.displayAtk || baseAtk; 
  const gearBonus = finalAtkFromGear - baseAtk;

  // ==========================================
  // 2. คำนวณพลังสุทธิ (ดึงค่าคริติคอลออกมาด้วย)
  // ==========================================
  const { netAtk, atkMod, critRate, critDamage } = calculateNetStats(player, activeStatuses, PLAYER_SKILLS);

  // ==========================================
  // 3. วิเคราะห์มัลติพลายเออร์ และโบนัสธาตุ
  // ==========================================
  const skillMult = currentSkill?.multiplier || 1;
  const skillElement = currentSkill?.element || null;
  const elementMult = getElementMultiplier(skillElement, enemy.element);
  const enemyDef = enemy.stats?.def || enemy.def || 0;

  // ==========================================
  // 4. คำนวณแต้ม Synergy (Mastery + Element Power)
  // ==========================================
  let synergyPoints = getSynergyPoints(player, skillElement, PLAYER_SKILLS, MONSTER_SKILLS);

  if (currentSkill && currentSkill.elementPower) {
    synergyPoints += currentSkill.elementPower;
  }

  // ==========================================
  // 5. ประมวลผลดาเมจพื้นฐาน (ก่อนคิดคริ)
  // ==========================================
  const result = calculateFinalDamage(
    netAtk, 
    skillMult, 
    synergyPoints, 
    elementMult,
    { 
      enemyDef: enemyDef, 
      armorPen: player.armorPen || 0 
    }
  );

  // ==========================================
  // 🚩 [CRITICAL LOGIC] ระบบสุ่มคริติคอล
  // ==========================================
  const isCrit = Math.random() < critRate; 
  const finalDamage = isCrit ? Math.floor(result.total * critDamage) : result.total;

  // ==========================================
  // 📊 [DISPLAY LOG] แสดงผล Breakdown แบบจัดเต็ม
  // ==========================================
  console.log("%c--- ⚔️ DAMAGE SOURCE BREAKDOWN ---", "color: #00efff; font-weight: bold; font-size: 12px;");

  console.table({
    "01. [Base] พลังพื้นฐาน (Level/Point)": { Amount: baseAtk, Description: "พลังโจมตีตัวเปล่า" },
    "02. [Gear] โบนัสอุปกรณ์": { 
        Amount: gearBonus, 
        Description: gearBonus > 0 ? `+${gearBonus} (ตรวจสอบจากอุปกรณ์สำเร็จ)` : "⚠️ ไม่พบโบนัส" 
    },
    "03. [Passive/Buff] พาสซีฟและบัฟ": { 
        Amount: atkMod, 
        Description: `+${atkMod} (พาสซีฟจากสกิลและสถานะบัฟ)` 
    }, 
    "04. [Net ATK] พลังโจมตีรวมสุทธิ": { Amount: netAtk, Description: "พลังโจมตีทั้งหมดก่อนใช้สกิล" },
    "--------------------": { Amount: "---", Description: "--------------------" },
    "05. [Multiplier] ตัวคูณสกิล": { Amount: `${skillMult}x`, Description: `ท่าโจมตี: ${currentSkill?.name || 'Normal'}` },
    "06. [Synergy] แต้มโบนัสคงที่": { Amount: `+${synergyPoints}`, Description: "Synergy จากธาตุและ Mastery" },
    "07. [Defense] พลังป้องกันศัตรู": { Amount: `-${enemyDef}`, Description: `หักลบค่า DEF ของ ${enemy.name}` },
    "08. [Element] ผลธาตุชนะทาง": { Amount: `${elementMult}x`, Description: elementMult > 1 ? "🔥 EFFECTIVE (ชนะทาง)" : (elementMult < 1 ? "❄️ WEAK (แพ้ทาง)" : "ปกติ") },
    
    // แสดงสถิติคริติคอลในตาราง
    "09. [Critical] คริติคอล": { 
        Amount: isCrit ? `${critDamage}x` : "0x", 
        Description: isCrit ? `🔥 CRITICAL HIT! (${(critRate * 100).toFixed(0)}% Chance)` : `Normal Hit (${(critRate * 100).toFixed(0)}% Chance)` 
    }
  });

  // 🚩 แก้ไขจุดที่ผิด: เปลี่ยนจาก finalLogLogColor เป็น finalLogColor
  const finalLogColor = isCrit ? "#ffcc00" : "#ff0000";
  const critSuffix = isCrit ? " (CRITICAL!)" : "";
  
  console.log(`%c🎯 FINAL DAMAGE: ${finalDamage}${critSuffix}`, `color: ${finalLogColor}; font-weight: bold; font-size: 16px; text-shadow: 1px 1px 2px black;`);

  return {
    ...result,
    total: finalDamage,
    isCrit: isCrit
  }; 
};

/**
 * 🧠 2. คำนวณการโจมตีของมอนสเตอร์ (คงเดิม 100%)
 */
export const calculateMonsterAttack = (enemy, player, turnCount, PLAYER_SKILLS, activeStatuses = []) => {
  let monsterAtk = enemy.atk;
  let skillUsed = null;
  const hpPercent = enemy.hp / enemy.maxHp;

  if (enemy.skills && Array.isArray(enemy.skills) && enemy.skills.length > 0) {
    for (const skill of enemy.skills) {
      if (skill.condition?.includes("Special") && hpPercent <= 0.2) {
        monsterAtk = activeEffects[skill.name] ? activeEffects[skill.name](monsterAtk) : monsterAtk * 2;
        skillUsed = skill;
        break;
      } else if (skill.condition?.includes("Active")) {
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

  const { netDef } = calculateNetStats(player, activeStatuses, PLAYER_SKILLS);
  
  const playerPrimarySkillId = player.equippedActives?.[0];
  const playerElement = PLAYER_SKILLS[playerPrimarySkillId]?.element || null;
  const elementMult = getElementMultiplier(enemy.element, playerElement);

  const rawDamage = (monsterAtk * elementMult) - netDef;
  const minDamage = Math.floor(monsterAtk * 0.1); 
  const finalDamage = Math.max(minDamage, rawDamage, 1);

  console.log(`%c🛡️ PLAYER DEFENSE CHECK: ${netDef} (Total Def Including Gear)`, "color: #3b82f6; font-weight: bold;");
  console.log(`[Monster Attack] ${enemy.name} Atk: ${monsterAtk} vs Your Def: ${netDef} | Multiplier: ${elementMult}x -> Final Damage: ${finalDamage}`);

  return { 
    damage: Math.floor(finalDamage), 
    skillUsed,
    isEffective: elementMult > 1.0 
  };
};