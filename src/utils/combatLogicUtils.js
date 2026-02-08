/**
 * ⚔️ combatLogicUtils.js
 * รวมฟังก์ชันคำนวณตรรกะการต่อสู้ทั้งหมด: ระบบธาตุ, Synergy, Buff/Debuff
 * อัปเกรด: ระบบ Auto-Passive และ Active-Skill Passive Bonus
 */

// ✅ นำเข้าตัวคำนวณกลางเพื่อความแม่นยำ 100%
import { calculateFinalStats } from './statCalculations';

// ✅ 1. ตารางการแพ้ทางธาตุ (Elemental Matrix) - คงเดิม 100%
export const getElementMultiplier = (attackerElement, defenderElement) => {
  const table = {
    FIRE:   { win: 'WIND',   lose: 'WATER' },
    WIND:   { win: 'EARTH',  lose: 'FIRE' },
    EARTH:  { win: 'POISON', lose: 'WIND' },
    POISON: { win: 'WATER',  lose: 'EARTH' },
    WATER:  { win: 'FIRE',   lose: 'POISON' },
    LIGHT:  { win: 'DARK',   lose: 'LIGHT' },
    DARK:   { win: 'LIGHT',  lose: 'DARK' }
  };

  if (!attackerElement || !defenderElement) return 1.0;
  const atk = attackerElement.toUpperCase();
  const def = defenderElement.toUpperCase();

  if (atk === def) return 0.8; 
  if (table[atk]?.win === def) return 2.0; 
  if (table[atk]?.lose === def) return 0.5; 
  return 1.0; 
};

// ✅ 2. ฟังก์ชันคำนวณแต้ม Synergy (อัปเกรดเป็น Auto-Passive)
// ดึงแต้มธาตุจาก "ทุกใบที่มีในคลัง" + "Active ที่สวมใส่"
export const getSynergyPoints = (player, element, PLAYER_SKILLS, MONSTER_SKILLS) => {
  let totalPoints = 0;
  if (!element) return 0;

  // ก. รวมจาก Active Slots (คงเดิม)
  player.equippedActives?.forEach(id => {
    const skill = PLAYER_SKILLS[id];
    if (skill && skill.element === element) {
      totalPoints += (skill.elementPower || 10);
    }
  });

  // ข. [อัปเกรด] รวมจากคลังพาสซีฟทั้งหมด (Auto-Active Element Power)
  player.unlockedPassives?.forEach(pId => {
    const skill = MONSTER_SKILLS.find(s => s.id === pId);
    if (skill && skill.element === element) {
      totalPoints += (skill.elementPower || 5);
    }
  });

  return totalPoints;
};

// ✅ 3. [แก้ไขจุดบอด] ฟังก์ชันดึงค่าพลังพิเศษออโต้ (Auto-Ability Collector)
// เปลี่ยนมาใช้ calculateFinalStats เพื่อให้ดึงค่า Reflect จากทุกแหล่งได้แม่นยำ
export const getAutoPassiveAbilities = (player, MONSTER_SKILLS = [], PLAYER_SKILLS = {}) => {
  // 🛡️ เรียกใช้ตัวคำนวณสเตตัสสุทธิที่เราสร้างไว้
  const fullStats = calculateFinalStats(player);
  
  const totalReflect = fullStats.bonus.reflect || 0;
  const totalPen = fullStats.bonus.pen || 0;

  // 🚩 Log เพื่อ Debug ใน Console (F12)
  if (totalReflect > 0) {
    console.log("🔍 [Collector Success] Auto-Passive Detected:", {
      reflectPercent: (totalReflect * 100).toFixed(2) + "%",
      armorPen: (totalPen * 100).toFixed(2) + "%"
    });
  }

  return { 
    autoReflect: totalReflect, 
    autoPen: totalPen 
  };
};

// ✅ 4. ฟังก์ชันคำนวณสเตตัสสุทธิ (อัปเกรด: รวม Passive Bonus จากสกิล Active ที่ใส่ด้วย)
export const calculateNetStats = (player, activeStatuses, PLAYER_SKILLS = {}) => {
  let atkMod = 0;
  let defMod = 0;

  // --- [เพิ่มใหม่] ดึงโบนัสพาสซีฟจาก Active Skills ที่สวมใส่อยู่ ---
  player.equippedActives?.forEach(id => {
    const skill = PLAYER_SKILLS[id];
    if (skill) {
      atkMod += (skill.passiveAtkBonus || 0);
      defMod += (skill.passiveDefBonus || 0);
    }
  });
  
  // --- รวมผลจาก Buff/Debuff ในสนาม (คงเดิม) ---
  activeStatuses.forEach(status => {
    if (status.target === 'player' || !status.target) {
      if (status.type === 'BUFF_ATK') atkMod += (status.value || 0);
      if (status.type === 'DEBUFF_ATK') atkMod -= (status.value || 0);
      if (status.type === 'BUFF_DEF') defMod += (status.value || 0);
      if (status.type === 'DEBUFF_DEF') defMod -= (status.value || 0);
    }
  });

  return {
    netAtk: Math.max(1, (player.finalAtk || player.atk) + atkMod),
    netDef: Math.max(0, (player.finalDef || player.def) + defMod)
  };
};

// ✅ 5. ฟังก์ชันคำนวณดาเมจสุดท้าย (อัปเกรด: รองรับ Armor Pen จากคลังออโต้)
export const calculateFinalDamage = (baseAtk, skillMultiplier, synergyPoints, elementMult, options = {}) => {
  const { armorPen = 0, enemyDef = 0 } = options;

  // --- 1. คำนวณระบบเจาะเกราะ (Armor Pen) ---
  const effectiveDef = Math.max(0, enemyDef * (1 - armorPen));

  // --- 2. คำนวณดาเมจกายภาพสุทธิ ---
  let physicalDmg = (baseAtk * skillMultiplier) - effectiveDef;
  physicalDmg = Math.max(1, physicalDmg);
  
  // --- 3. คำนวณดาเมจธาตุ ---
  const elementalBonus = synergyPoints * elementMult; 
  
  const totalDmg = Math.floor(physicalDmg + elementalBonus);

  return {
    total: Math.max(1, totalDmg),
    isEffective: elementMult > 1.0,
    isWeak: elementMult < 1.0
  };
};