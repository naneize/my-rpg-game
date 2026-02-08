import { passiveEffects, activeEffects } from '../data/skillEffects';
// 🔗 นำเข้าฟังก์ชันจากไฟล์ตรรกะใหม่เพื่อให้ Sync กัน
import { 
  getElementMultiplier, 
  getSynergyPoints, 
  calculateNetStats, 
  calculateFinalDamage 
} from './combatLogicUtils';

/**
 * ⚔️ 1. คำนวณความเสียหายที่ผู้เล่นทำได้ (อัปเกรดระบบธาตุ & Synergy)
 */
export const calculatePlayerDamage = (player, enemy, PLAYER_SKILLS, MONSTER_SKILLS, currentSkill, activeStatuses = []) => {
  // 1. คำนวณสเตตัสสุทธิ
  const { netAtk } = calculateNetStats(player, activeStatuses, PLAYER_SKILLS);
  const enemyDef = enemy.stats?.def || enemy.def || 0;

  // 2. เช็ค Passive มอนสเตอร์ที่อาจมีผลกับพลังโจมตีก่อนคำนวณ
  let modifiedAtk = netAtk;
  if (enemy.skills && Array.isArray(enemy.skills)) {
    enemy.skills.forEach(skill => {
      if (passiveEffects[skill.name]) {
        modifiedAtk = passiveEffects[skill.name](modifiedAtk);
      }
    });
  }

  // 3. คำนวณระบบธาตุ & Synergy 
  const skillElement = currentSkill?.element || null;
  const elementMult = getElementMultiplier(skillElement, enemy.element);
  
  // ดึงแต้ม Synergy จาก Mastery และสกิลอื่นๆ ในคลัง
  let synergyPoints = getSynergyPoints(player, skillElement, PLAYER_SKILLS, MONSTER_SKILLS);

  // 🚩 [จุดที่แก้] ถ้าสกิลปัจจุบัน (currentSkill) มีแต้มธาตุ (elementPower) ให้บวกเข้าไปด้วยทันที!
  if (currentSkill && currentSkill.elementPower) {
    synergyPoints += currentSkill.elementPower;
  }

  // 4. ใช้สูตรคำนวณดาเมจสุดท้าย
  const result = calculateFinalDamage(
    modifiedAtk, 
    currentSkill?.multiplier || 1, 
    synergyPoints, 
    elementMult,
    { 
      enemyDef: enemyDef, 
      armorPen: player.armorPen || 0 
    }
  );

  // 🚩 Log ยืนยันค่า Synergy ที่ใช้จริง
  console.log(`[Combat Internal] Element: ${skillElement}, Synergy Used: ${synergyPoints}, Final Dmg: ${result.total}`);

  return result; 
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

  console.log(`[Monster Attack] Element: ${enemy.element} vs Player: ${playerElement} (${elementMult}x) -> Final: ${finalDamage}`);

  return { 
    damage: Math.floor(finalDamage), 
    skillUsed,
    isEffective: elementMult > 1.0 
  };
};