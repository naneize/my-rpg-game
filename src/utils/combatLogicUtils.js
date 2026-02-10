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

// ✅ 2. ฟังก์ชันคำนวณแต้ม Synergy (ดึงแต้มจากพาสซีฟถาวร และสกิลที่สวมใส่)
export const getSynergyPoints = (player, element, PLAYER_SKILLS, MONSTER_SKILLS) => {
  let totalPoints = 0;
  if (!element) return 0;
  const targetEl = element.toLowerCase();

  // 1. 🔥 [ดึงค่าถาวร] วิ่งหาจากพาสซีฟของมอนสเตอร์ที่ปลดล็อกแล้ว (Perm Stats)
  player.unlockedPassives?.forEach(id => {
    const s = MONSTER_SKILLS.find(item => item.id === id);
    if (s && s.perm && s.element?.toLowerCase() === targetEl) {
      totalPoints += (s.perm.elementPower || 0);
    }
  });

  // 2. ⚡ [ดึงจากสกิลที่ใส่] รวมจากช่อง Active Slots ที่ธาตุตรงกัน
  player.equippedActives?.forEach(id => {
    const s = PLAYER_SKILLS[id];
    if (s && s.element?.toLowerCase() === targetEl) {
      totalPoints += (s.elementPower || 0);
    }
  });

  return totalPoints;
};

// ✅ 3. ฟังก์ชันดึงค่าพลังพิเศษ (เช่น สะท้อนดาเมจ, เจาะเกราะ) จาก StatCalculations
export const getAutoPassiveAbilities = (player, MONSTER_SKILLS = [], PLAYER_SKILLS = {}) => {
  const fullStats = calculateFinalStats(player);
  const totalReflect = fullStats.bonus.reflect || 0;
  const totalPen = fullStats.bonus.pen || 0;

  return { 
    autoReflect: totalReflect, 
    autoPen: totalPen 
  };
};

// ✅ 4. ฟังก์ชันคำนวณสเตตัสสุทธิ (เพิ่ม Logic การดึงค่า Critical Rate/Damage)
export const calculateNetStats = (player, activeStatuses, PLAYER_SKILLS = {}) => {
  let atkMod = 0;
  let defMod = 0;

  // [NEW] เตรียมค่า Critical พื้นฐาน (ถ้าในตัว player ไม่มี ให้ใช้ค่า Default 5% / 150%)
  let totalCritRate = player.critRate || 0.05;
  let totalCritDamage = player.critDamage || 1.5;

  const baseForNet = player.finalAtk || player.atk;

  /**
   * 🛠️ ฟังก์ชันภายในสำหรับดึงโบนัสจาก Object Skill 
   * รองรับทั้งการหาด้วย Key ตรงๆ และการหาจาก Property .id ภายใน
   */
  const getBonus = (id) => {
    if (!id) return { atk: 0, def: 0, critRate: 0 };
    let skill = PLAYER_SKILLS[id];

    if (!skill) {
      skill = Object.values(PLAYER_SKILLS).find(s => s.id === id);
    }

    if (skill) {
      // แสดง Log เมื่อค้นพบสกิล เพื่อ Debug การดึงค่าพาสซีฟ
      if (skill.sync) console.log(`✅ เจอสกิล ${skill.name}! โบนัส ATK: ${skill.sync.atk}`);
      
      return {
        atk: skill.sync?.atk || 0,
        def: skill.sync?.def || 0,
        critRate: skill.passiveCritRate || 0 // ดึงค่าโอกาสคริ (เช่น จาก Volt Step)
      };
    }
    return { atk: 0, def: 0, critRate: 0 };
  };

  // ⚔️ [ส่วนที่ 1] ดึงโบนัสจากช่อง Active (เช่น Volt Step)
  player.equippedActives?.forEach(id => {
    const bonus = getBonus(id);
    atkMod += bonus.atk;
    defMod += bonus.def;
    totalCritRate += bonus.critRate; // สะสมโอกาสคริจากสกิลกดใช้
  });

  // 🛡️ [ส่วนที่ 2] ดึงโบนัสจากช่อง Passive (เช่น Flora Blessing)
  player.equippedPassives?.forEach(id => {
    const bonus = getBonus(id);
    atkMod += bonus.atk;
    defMod += bonus.def;
    totalCritRate += bonus.critRate; // สะสมโอกาสคริจากสกิลติดตัว
  });
  
  // 🧪 [ส่วนที่ 3] รวมผลจาก Status Buffs/Debuffs ที่กำลังแสดงผล
  activeStatuses.forEach(status => {
    if (status.target === 'player' || !status.target) {
      if (status.type === 'BUFF_ATK') atkMod += (status.value || 0);
      if (status.type === 'DEBUFF_ATK') atkMod -= (status.value || 0);
      if (status.type === 'BUFF_DEF') defMod += (status.value || 0);
      if (status.type === 'DEBUFF_DEF') defMod -= (status.value || 0);
    }
  });

  // คืนค่าพลังสุทธิ และค่า Modifiers สำหรับทำ Log
  return {
    netAtk: Math.max(1, baseForNet + atkMod),
    netDef: Math.max(0, (player.finalDef || player.def) + defMod),
    atkMod: atkMod, 
    defMod: defMod,
    critRate: totalCritRate,    // [NEW] ส่งค่าโอกาสคริรวมออกไป
    critDamage: totalCritDamage // [NEW] ส่งค่าความแรงคริรวมออกไป
  };
};

// ✅ 5. ฟังก์ชันคำนวณดาเมจสุดท้าย (เวอร์ชันจัดเต็ม: บอกสถานะธาตุ + รองรับ UI)
export const calculateFinalDamage = (atk, skillMultiplier, synergyPoints, elementMult, options = {}) => {
  const { armorPen = 0, enemyDef = 0 } = options;

  // --- [LOGIC การคำนวณหลัก] ---
  const effectiveDef = Math.max(0, enemyDef * (1 - armorPen));
  const rawPower = atk * skillMultiplier;
  const physicalPart = rawPower - effectiveDef;
  
  // สูตรคำนวณดาเมจสุทธิ (พลังโจมตี + แต้ม Synergy) * ตัวคูณธาตุ
  const totalDmg = Math.floor((physicalPart + synergyPoints) * elementMult);

  // --- [การวิเคราะห์สถานะธาตุเพื่อ LOG & UI] ---
  let elementStatus = "NORMAL";
  let logColor = "#00ebff"; // สีฟ้าปกติ
  let popupType = "monster"; // default สำหรับ DamageNumber component
  
  if (elementMult > 1.0) {
    elementStatus = "🔥 EFFECTIVE (ชนะทาง)";
    logColor = "#ffcc00"; // สีทอง
    popupType = "effective";
  } else if (elementMult < 1.0) {
    elementStatus = "❄️ WEAK (แพ้ทาง)";
    logColor = "#ff4d4d"; // สีแดงหม่น
    popupType = "weak";
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
    popupType: popupType, 
    statusText: elementStatus
  };
};