import { calculateFinalStats } from './statCalculations';
import { MONSTER_SKILLS } from '../data/passive'; 
import { PLAYER_SKILLS } from '../data/playerSkills'; 

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

// ✅ 2. ฟังก์ชันคำนวณแต้ม Synergy (ดึงแต้มจากพาสซีฟถาวร และสกิลที่สวมใส่)
  export const getSynergyPoints = (player, element) => {  let totalPoints = 0;
  if (!element) return 0;
  const targetEl = element.toLowerCase();

  player.unlockedPassives?.forEach(id => {
    const s = MONSTER_SKILLS.find(item => item.id === id);
    if (s && s.perm && s.element?.toLowerCase() === targetEl) {
      totalPoints += (s.perm.elementPower || 0);
    }
  });

  player.equippedActives?.forEach(id => {
    const s = PLAYER_SKILLS[id];
    if (s && s.element?.toLowerCase() === targetEl) {
      totalPoints += (s.elementPower || 0);
    }
  });

  return totalPoints;
};

// ✅ 3. ฟังก์ชันดึงค่าพลังพิเศษ
  export const getAutoPassiveAbilities = (player) => {
  const fullStats = calculateFinalStats(player);
  const totalReflect = fullStats.bonus.reflect || 0;
  const totalPen = fullStats.bonus.pen || 0;

  return { 
    autoReflect: totalReflect, 
    autoPen: totalPen 
  };
};

// ✅ 4. ฟังก์ชันคำนวณสเตตัสสุทธิ
export const calculateNetStats = (player, activeStatuses) => {  
  
  let atkMod = 0;
  let defMod = 0;

  let totalCritRate = player.critRate || 0.05;
  let totalCritDamage = player.critDamage || 1.5;

  const baseForNet = player.finalAtk || player.atk;

  const getBonus = (id) => {
    if (!id) return { atk: 0, def: 0, critRate: 0 };
    let skill = PLAYER_SKILLS[id];
    if (!skill) {
      skill = Object.values(PLAYER_SKILLS).find(s => s.id === id);
    }
    if (skill) {
      return {
        atk: skill.sync?.atk || 0,
        def: skill.sync?.def || 0,
        critRate: skill.passiveCritRate || 0 
      };
    }
    return { atk: 0, def: 0, critRate: 0 };
  };

  player.equippedActives?.forEach(id => {
    const bonus = getBonus(id);
    atkMod += bonus.atk;
    defMod += bonus.def;
    totalCritRate += bonus.critRate;
  });

  player.equippedPassives?.forEach(id => {
    const bonus = getBonus(id);
    atkMod += bonus.atk;
    defMod += bonus.def;
    totalCritRate += bonus.critRate;
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
    netAtk: Math.max(1, baseForNet + atkMod),
    netDef: Math.max(0, (player.finalDef || player.def) + defMod),
    atkMod: atkMod, 
    defMod: defMod,
    critRate: totalCritRate, 
    critDamage: totalCritDamage 
  };
};

// ✅ 5. ฟังก์ชันคำนวณดาเมจสุดท้าย (ปรับปรุงสูตรลดทอน DEF สำหรับ Big Numbers)
export const calculateFinalDamage = (atk, skillMultiplier, synergyPoints, elementMult, options = {}) => {
  const { armorPen = 0, enemyDef = 0 } = options;

  // --- [NEW LOGIC: PERCENTAGE DEFENSE REDUCTION] ---
  // แทนที่จะเอา ATK - DEF ตรงๆ เราจะใช้สูตรที่ทำให้ตีเข้าเสมอ
  // เจาะเกราะ (Armor Pen) จะลดค่า DEF ของศัตรูลงก่อนคำนวณ
  const effectiveDef = Math.max(0, enemyDef * (1 - armorPen));
  
  // สูตร: Damage = Raw_Damage * (ฐานพลังป้องกัน / (ฐานพลังป้องกัน + DEF))
  // เลข 500 คือจุดที่ DEF 500 จะลดดาเมจได้ 50% (ปรับเพิ่มได้ถ้าอยากให้ถึกขึ้น)
  const defMitigation = 500 / (500 + effectiveDef);
  
  const rawPower = atk * skillMultiplier;
  const physicalPart = rawPower * defMitigation; 
  
  // รวมดาเมจทั้งหมด: (ดาเมจกายภาพ + Synergy) * ตัวคูณธาตุ
  const totalDmg = Math.floor((physicalPart + synergyPoints) * elementMult);

  // --- [ANALYSIS FOR UI] ---
  let elementStatus = "NORMAL";
  let logColor = "#00ebff"; 
  let popupType = "monster"; 
  
  if (elementMult > 1.0) {
    elementStatus = "🔥 EFFECTIVE";
    logColor = "#ffcc00"; 
    popupType = "effective";
  } else if (elementMult < 1.0) {
    elementStatus = "❄️ WEAK";
    logColor = "#ff4d4d"; 
    popupType = "weak";
  }

  console.log(`%c⚔️ DAMAGE: ${totalDmg}`, `color: ${logColor}; font-weight: bold;`);

  return {
    total: Math.max(1, totalDmg),
    isEffective: elementMult > 1.0,
    isWeak: elementMult < 1.0,
    popupType: popupType, 
    statusText: elementStatus
  };
};