/**
 * ⚔️ combatLogicUtils.js
 * รวมฟังก์ชันคำนวณตรรกะการต่อสู้ทั้งหมด: ระบบธาตุ, Synergy, Buff/Debuff
 * อัปเกรด: ระบบ Auto-Passive และ Active-Skill Passive Bonus + Elemental UI Support
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

// ✅ 2. ฟังก์ชันคำนวณแต้ม Synergy (แก้ไข: เพิ่มการดึงแต้มถาวร FIRE +15)
export const getSynergyPoints = (player, element, PLAYER_SKILLS, MONSTER_SKILLS) => {
  let totalPoints = 0;
  if (!element) return 0;
  const targetEl = element.toLowerCase();

  // 1. 🔥 [ดึงค่าถาวร] วิ่งหาจากของที่ปลดล็อกแล้ว (Logic เดียวกับหน้า UI)
  player.unlockedPassives?.forEach(id => {
    const s = MONSTER_SKILLS.find(item => item.id === id);
    if (s && s.perm && s.element?.toLowerCase() === targetEl) {
      totalPoints += (s.perm.elementPower || 0);
    }
  });

  // 2. ⚡ [ดึงจากสกิลที่ใส่] รวมจากช่อง Active Slots (Neural Sync)
  player.equippedActives?.forEach(id => {
    const s = PLAYER_SKILLS[id];
    if (s && s.element?.toLowerCase() === targetEl) {
      totalPoints += (s.elementPower || 0);
    }
  });

  return totalPoints;
};

// ✅ 3. [แก้ไขจุดบอด] ฟังก์ชันดึงค่าพลังพิเศษออโต้ (คงเดิม 100%)
export const getAutoPassiveAbilities = (player, MONSTER_SKILLS = [], PLAYER_SKILLS = {}) => {
  const fullStats = calculateFinalStats(player);
  const totalReflect = fullStats.bonus.reflect || 0;
  const totalPen = fullStats.bonus.pen || 0;

  return { 
    autoReflect: totalReflect, 
    autoPen: totalPen 
  };
};

// ✅ 4. ฟังก์ชันคำนวณสเตตัสสุทธิ (คงเดิม 100%)
export const calculateNetStats = (player, activeStatuses, PLAYER_SKILLS = {}) => {
  let atkMod = 0;
  let defMod = 0;

  player.equippedActives?.forEach(id => {
    const skill = PLAYER_SKILLS[id];
    if (skill) {
      atkMod += (skill.passiveAtkBonus || 0);
      defMod += (skill.passiveDefBonus || 0);
    }
  });
  
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

// ✅ 5. ฟังก์ชันคำนวณดาเมจสุดท้าย (เวอร์ชันจัดเต็ม: บอกสถานะธาตุ + รองรับ UI)
export const calculateFinalDamage = (atk, skillMultiplier, synergyPoints, elementMult, options = {}) => {
  const { armorPen = 0, enemyDef = 0 } = options;

  // --- [LOGIC การคำนวณหลัก] ---
  const effectiveDef = Math.max(0, enemyDef * (1 - armorPen));
  const rawPower = atk * skillMultiplier;
  const physicalPart = rawPower - effectiveDef;
  
  // สูตรแบบทวีคูณ (Multiplicative)
  const totalDmg = Math.floor((physicalPart + synergyPoints) * elementMult);

  // --- [🚩 การวิเคราะห์สถานะธาตุเพื่อ LOG & UI] ---
  let elementStatus = "NORMAL";
  let logColor = "#00ebff"; // สีฟ้าปกติ
  let popupType = "monster"; // default type สำหรับ DamageNumber component
  
  if (elementMult > 1.0) {
    elementStatus = "🔥 EFFECTIVE (ชนะทาง)";
    logColor = "#ffcc00"; // สีทอง
    popupType = "effective"; // ส่งให้ UI แสดงสีทอง/ตัวใหญ่
  } else if (elementMult < 1.0) {
    elementStatus = "❄️ WEAK (แพ้ทาง)";
    logColor = "#ff4d4d"; // สีแดงหม่น
    popupType = "weak"; // ส่งให้ UI แสดงสีเทา/ตัวเล็ก
  }

  // --- [CONSOLE DEBUG TABLE] ---
  console.log(`%c⚔️ COMBAT REPORT: ${elementStatus}`, `color: ${logColor}; font-weight: bold; font-size: 14px; text-shadow: 1px 1px 2px black;`);
  console.table({
    "Player ATK": atk,
    "Skill Multiplier": skillMultiplier + "x",
    "Physical Net (Raw-Def)": physicalPart.toFixed(2),
    "Synergy Bonus (+Pts)": synergyPoints,
    "Elemental Multiplier": elementMult + "x",
    "Combat Status": elementStatus,
    "--- FINAL DAMAGE ---": Math.max(1, totalDmg)
  });

  // --- [RETURN DATA] ---
  return {
    total: Math.max(1, totalDmg),
    isEffective: elementMult > 1.0,
    isWeak: elementMult < 1.0,
    popupType: popupType, // ✅ เพิ่มค่านี้เพื่อให้ CombatView ส่งต่อให้ DamageNumber ได้ทันที
    statusText: elementStatus
  };
};