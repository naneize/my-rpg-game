/**
 * ✅ ฟังก์ชันคำนวณสเตตัสสุทธิ (Final Stats)
 * รวมผลจาก Base Stats + อุปกรณ์สวมใส่ + โบนัสเปอร์เซ็นต์
 * ปรับปรุงให้รองรับค่าพลังพิเศษ (Reflect/Pen) เพื่อแก้ Error ในระบบต่อสู้
 */
export const calculateFinalStats = (player) => {
  if (!player) return {};

  // 1. ตั้งค่าพื้นฐาน (Base)
  let baseAtk = player.atk || 0;
  let baseDef = player.def || 0;
  let baseMaxHp = player.maxHp || 100;
  
  // 🟢 ค่าเริ่มต้นสำหรับ Critical
  let totalCritRate = player.critRate || 0.05; 
  let totalCritDamage = player.critDamage || 1.5;

  // 2. ตัวแปรสำหรับเก็บยอดบวก (Flat) และ ยอดคูณ (Percent)
  let flatAtk = 0;
  let percentAtk = 0;
  let flatDef = 0;
  let percentDef = 0;
  let flatHp = 0;
  let percentHp = 0;

  // 🛡️ เพิ่มตัวแปรเก็บค่าพลังพิเศษ
  let totalReflect = 0;
  let totalPen = 0;

  // 3. วนลูปเช็คอุปกรณ์สวมใส่
  if (player.equipment && typeof player.equipment === 'object') {
    Object.keys(player.equipment).forEach(slot => {
      const item = player.equipment[slot];
      
      if (item && typeof item === 'object') {
        // บวกค่าพลังดิบ
        flatAtk += Number(item.atk || 0);
        flatDef += Number(item.def || 0);
        flatHp += Number(item.hp || 0);
        
        // บวกค่าเปอร์เซ็นต์
        percentAtk += Number(item.atkPercent || 0);
        percentDef += Number(item.defPercent || 0);
        percentHp += Number(item.hpPercent || 0);

        // ✅ รวมค่า Critical
        if (item.critRate) totalCritRate += Number(item.critRate);
        if (item.critDamage) totalCritDamage += Number(item.critDamage);

        // ✅ รวมค่าพลังพิเศษ (Reflect / Armor Pen)
        if (item.reflect) totalReflect += Number(item.reflect);
        if (item.pen) totalPen += Number(item.pen);
      }
    });
  }

  // 4. สูตรคำนวณสุทธิ
  const finalAtk = Math.floor((baseAtk + flatAtk) * (1 + percentAtk));
  const finalDef = Math.floor((baseDef + flatDef) * (1 + percentDef));
  const finalMaxHp = Math.floor((baseMaxHp + flatHp) * (1 + percentHp));

  // 5. ส่งค่ากลับออกไป (เพิ่มโครงสร้าง bonus เพื่อแก้ Error 'reflect')
  return {
    ...player, 
    finalAtk,
    finalDef,
    finalMaxHp,
    critRate: totalCritRate,
    critDamage: totalCritDamage,
    
    // ✅ จุดสำคัญ: ส่งโครงสร้างที่ระบบต่อสู้ต้องการ
    bonus: {
      reflect: totalReflect,
      pen: totalPen
    },
    
    displayBonus: {
      atk: finalAtk - baseAtk,
      def: finalDef - baseDef,
      hp: finalMaxHp - baseMaxHp,
      atkPercent: percentAtk,
      defPercent: percentDef,
      hpPercent: percentHp
    }
  };
};