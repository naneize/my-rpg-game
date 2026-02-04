/**
 * Hook สำหรับคำนวณสเตตัสสุทธิของผู้เล่น
 * ✅ รวม: พื้นฐาน + ฉายา + พาสซีฟ + คอลเลคชั่น
 */
export const useCharacterStats = (stats, activeTitle, passiveBonuses, collectionBonuses) => {
  // 1. 🛡️ ดึงค่าจาก Passive Skills
  const pAtk = passiveBonuses?.atk || 0;
  const pDef = passiveBonuses?.def || 0;
  const pMaxHp = passiveBonuses?.hp || 0;
  const pLuck = passiveBonuses?.luck || 0; // เผื่อมีพาสซีฟบวกดวงจ่ะ

  // 2. 📦 ดึงค่าโบนัสจากคอลเลคชั่น (Collection Set)
  const cAtk = collectionBonuses?.atk || 0;
  const cDef = collectionBonuses?.def || 0;
  const cMaxHp = collectionBonuses?.hp || 0;
  const cLuck = collectionBonuses?.luck || 0; // ✅ สำคัญมากสำหรับมอนสเตอร์สายฟาร์ม

  // 3. 🎖️ ดึงค่าจากฉายา (Active Title)
  const tStats = activeTitle?.bonusStats || {};

  // ⚔️ 4. คำนวณค่าพลังสุทธิ (Final Stats)
  const finalMaxHp = (stats.maxHp || 0) + (tStats.maxHp || 0) + pMaxHp + cMaxHp; 
  const finalAtk = (stats.atk || 0) + (tStats.atk || 0) + pAtk + cAtk;
  const finalDef = (stats.def || 0) + (tStats.def || 0) + pDef + cDef;
  const finalLuck = (stats.luck || 0) + (tStats.luck || 0) + pLuck + cLuck;

  // ✅ 5. ก้อนโบนัสรวมสำหรับแสดงผลเลข (+) ใน CharacterView
  // ก้อนนี้จะบอกผู้เล่นว่า "ค่าที่เพิ่มมาจากพื้นฐาน" มีทั้งหมดเท่าไหร่
  const bonusStats = {
    hp: (tStats.maxHp || 0) + pMaxHp + cMaxHp,
    atk: (tStats.atk || 0) + pAtk + cAtk,
    def: (tStats.def || 0) + pDef + cDef,
    luck: (tStats.luck || 0) + pLuck + cLuck
  };

  // 📊 6. คำนวณเปอร์เซ็นต์สำหรับ Progress Bar (คงเดิม)
  const currentHp = Math.max(0, stats.hp || 0);
  const hpPercent = (currentHp / (finalMaxHp || 1)) * 100;
  
  const currentExp = Math.max(0, stats.exp || 0);
  const nextExp = Math.max(1, stats.nextLevelExp || 100);
  const expPercent = ((currentExp / nextExp) * 100).toFixed(0);

  return {
    ...stats,
    level: stats.level,
    finalMaxHp,
    finalAtk,
    finalDef,
    finalLuck, // ส่งค่า Luck สุทธิกลับไปด้วยจ่ะ
    bonusStats, // ✅ ส่งก้อนโบนัสนี้กลับไปโชว์เลขสีเขียวในหน้าหลัก
    hpPercent: Math.min(100, Math.max(0, hpPercent)),
    expPercent: Math.min(100, Math.max(0, Number(expPercent)))
  };
};