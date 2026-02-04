/**
 * Hook สำหรับคำนวณสเตตัสสุทธิของผู้เล่น
 * ✅ เพิ่มพารามิเตอร์ collectionBonuses เพื่อรับค่าจากระบบสมุดภาพ
 */
export const useCharacterStats = (stats, activeTitle, passiveBonuses, collectionBonuses) => {
  const pAtk = passiveBonuses?.atk || 0;
  const pDef = passiveBonuses?.def || 0;
  const pMaxHp = passiveBonuses?.hp || 0; // ✅ เพิ่มบรรทัดดึงค่า HP จาก Passive ค่ะ
  
  // 📦 ดึงค่าโบนัสจากคอลเลคชั่น (ถ้าไม่มีให้เป็น 0)
  const cAtk = collectionBonuses?.atk || 0;
  const cDef = collectionBonuses?.def || 0;
  const cMaxHp = collectionBonuses?.hp || 0;

  const tStats = activeTitle?.bonusStats || {};

  // ⚔️ คำนวณค่าพลังสุทธิ (Final Stats)
  const pHp = passiveBonuses?.hp || 0;
  // ✅ รวม: พื้นฐาน + ฉายา + พาสซีฟ + คอลเลคชั่น
  const finalMaxHp = (stats.maxHp || 0) + (tStats.maxHp || 0) + pMaxHp + cMaxHp; 
  const finalAtk = (stats.atk || 0) + (tStats.atk || 0) + pAtk + cAtk;
  const finalDef = (stats.def || 0) + (tStats.def || 0) + pDef + cDef;

  // ✅ แก้ไขก้อนโบนัสแยกส่วน (นี่คือจุดที่ทำให้เลข + โชว์ในหน้าตัวละครค่ะ)
  const bonusStats = {
    hp: (tStats.maxHp || 0) + pHp + cMaxHp, // ✅ รวมฉายา + พาสซีฟ + คอลเลคชั่น
    atk: (tStats.atk || 0) + pAtk + cAtk, // ✅ รวมฉายา + พาสซีฟ + คอลเลคชั่น
    def: (tStats.def || 0) + pDef + cDef  // ✅ รวมฉายา + พาสซีฟ + คอลเลคชั่น
  };

  // 📊 คำนวณเปอร์เซ็นต์สำหรับ Progress Bar
  // ✅ 2. ใช้ Math.max เพื่อป้องกันเลือดติดลบ และป้องกันการหารด้วย 0
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
    bonusStats, // ✅ 2. ส่งก้อนโบนัสนี้กลับไปให้หน้า CharacterView ด้วยนะ
    hpPercent: Math.min(100, Math.max(0, hpPercent)),
    expPercent: Math.min(100, Math.max(0, Number(expPercent)))
  };
};