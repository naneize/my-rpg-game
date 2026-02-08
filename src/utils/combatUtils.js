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
  // 1. คำนวณสเตตัสสุทธิ (หักลบ Buff/Debuff ในสนาม)
  const { netAtk } = calculateNetStats(player, activeStatuses);
  const enemyDef = enemy.stats?.def || enemy.def || 0;

  // 2. ดาเมจกายภาพพื้นฐาน (หักลบเกราะ + เช็ค Passive มอนสเตอร์)
  let basePhysicalDmg = netAtk - enemyDef;
  if (enemy.skills && Array.isArray(enemy.skills)) {
    enemy.skills.forEach(skill => {
      if (passiveEffects[skill.name]) {
        basePhysicalDmg = passiveEffects[skill.name](basePhysicalDmg);
      }
    });
  }

  // 3. คำนวณระบบธาตุ & Synergy
  const skillElement = currentSkill?.element || null;
  const elementMult = getElementMultiplier(skillElement, enemy.element);
  const synergyPoints = getSynergyPoints(player, skillElement, PLAYER_SKILLS, MONSTER_SKILLS);

  // 4. ใช้สูตรคำนวณดาเมจสุดท้ายจาก Logic Central
  const result = calculateFinalDamage(
    Math.max(1, basePhysicalDmg), 
    currentSkill?.multiplier || 1, 
    synergyPoints, 
    elementMult
  );

  console.log(`[Combat] Skill: ${currentSkill?.name}, Synergy: ${synergyPoints}, Mult: ${elementMult}x -> Final: ${result.total}`);

  return result; // คืนค่า { total, isEffective, isWeak }
};

/**
 * 🧠 2. คำนวณการโจมตีของมอนสเตอร์ (อัปเกรดระบบแพ้ธาตุตัวละคร)
 */
export const calculateMonsterAttack = (enemy, player, turnCount, PLAYER_SKILLS, activeStatuses = []) => {
  let monsterAtk = enemy.atk;
  let skillUsed = null;
  const hpPercent = enemy.hp / enemy.maxHp;

  // --- Logic การใช้ Skill ของมอนสเตอร์ (เดิม) ---
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

  // 1. คำนวณสเตตัสสุทธิของผู้เล่น (เช็คบัฟป้องกัน)
  const { netDef } = calculateNetStats(player, activeStatuses);

  // 2. ระบบธาตุ (มอนสเตอร์ตีเราแรงขึ้นถ้าเราถือสกิลธาตุที่แพ้ทางมัน)
  // เช็คธาตุจากสกิลที่ผู้เล่นสวมใส่อยู่ในช่องแรก (STRIKE)
  const playerPrimarySkillId = player.equippedActives?.[0];
  const playerElement = PLAYER_SKILLS[playerPrimarySkillId]?.element || null;
  const elementMult = getElementMultiplier(enemy.element, playerElement);

  // 3. คำนวณ Damage จริง
  const rawDamage = (monsterAtk * elementMult) - netDef;
  const minDamage = Math.floor(monsterAtk * 0.1); // ดาเมจขั้นต่ำ 10%
  const finalDamage = Math.max(minDamage, rawDamage, 1);

  console.log(`[Monster Attack] Element: ${enemy.element} vs Player: ${playerElement} (${elementMult}x) -> Final: ${finalDamage}`);

  return { 
    damage: Math.floor(finalDamage), 
    skillUsed,
    isEffective: elementMult > 1.0 
  };
};