/**
 * Hook สำหรับคำนวณสเตตัสสุทธิของผู้เล่น
 */
export const useCharacterStats = (stats, activeTitle, passiveBonuses) => {
  const pAtk = passiveBonuses?.atk || 0;
  const pDef = passiveBonuses?.def || 0;
  const pMaxHp = passiveBonuses?.hp || 0; // ✅ เพิ่มบรรทัดดึงค่า HP จาก Passive ค่ะ
  const tStats = activeTitle?.bonusStats || {};

 // ⚔️ คำนวณค่าพลังสุทธิ (Final Stats)
  const pHp = passiveBonuses?.hp || 0;
  const finalMaxHp = (stats.maxHp || 0) + (tStats.maxHp || 0) + pMaxHp; // ✅ บวก pMaxHp เข้าไปด้วย
  const finalAtk = (stats.atk || 0) + (tStats.atk || 0) + pAtk;
  const finalDef = (stats.def || 0) + (tStats.def || 0) + pDef;

  // ✅ แก้ไขก้อนโบนัสแยกส่วน (นี่คือจุดที่ทำให้เลข + โชว์ในหน้าตัวละครค่ะ)
  const bonusStats = {
    hp: (tStats.maxHp || 0) + pHp, // ✅ รวมฉายา + พาสซีฟ
    atk: (tStats.atk || 0) + pAtk, // ✅ รวมฉายา + พาสซีฟ
    def: (tStats.def || 0) + pDef  // ✅ รวมฉายา + พาสซีฟ
  };

  // 📊 คำนวณเปอร์เซ็นต์สำหรับ Progress Bar
  // ✅ 2. ใช้ Math.max เพื่อป้องกันเลือดติดลบ และป้องกันการหารด้วย 0
  const currentHp = Math.max(0, stats.hp || 0);
  const hpPercent = (currentHp / (finalMaxHp || 1)) * 100;
  
  const currentExp = Math.max(0, stats.exp || 0);
  const nextExp = Math.max(1, stats.nextLevelExp || 100);
  const expPercent = (currentExp / nextExp) * 100;

  return {
    finalMaxHp,
    finalAtk,
    finalDef,
    bonusStats, // ✅ 2. ส่งก้อนโบนัสนี้กลับไปให้หน้า CharacterView ด้วยนะ
    hpPercent: Math.min(100, Math.max(0, hpPercent)),
    expPercent: Math.min(100, Math.max(0, expPercent))
  };
};