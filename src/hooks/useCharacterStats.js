/**
 * Hook สำหรับคำนวณสเตตัสสุทธิของตัวละคร (Core Stats Only)
 * ลบระบบ Weapon และ Forge ออกเพื่อความคลีนของเครื่องยนต์หลัก
 */
export const useCharacterStats = (stats, activeTitle, passiveBonuses, collectionBonuses) => {

  const base = stats || {};
  
  // 1. 🛡️ โบนัสจากระบบ Passive และ Collection
  const pAtk = passiveBonuses?.atk || 0;
  const pDef = passiveBonuses?.def || 0;
  const pMaxHp = passiveBonuses?.hp || 0;
  const pLuck = passiveBonuses?.luck || 0;

  const cAtk = collectionBonuses?.atk || 0;
  const cDef = collectionBonuses?.def || 0;
  const cMaxHp = collectionBonuses?.hp || 0;
  const cLuck = collectionBonuses?.luck || 0;

  // 🎖️ 2. โบนัสจากฉายา (Titles)
  const tStats = activeTitle?.bonusStats || activeTitle || {};
  const tMaxHp = tStats.maxHp || tStats.hpBonus || 0;
  const tAtk = tStats.atk || tStats.atkBonus || 0;
  const tDef = tStats.def || tStats.defBonus || 0;
  const tLuck = tStats.luck || tStats.luckBonus || 0;

  // ⚔️ 3. คำนวณค่าพลังสุทธิ (Final Calculation)
  // รวมเฉพาะ Base + Title + Passive + Collection
  const finalMaxHp = Math.max(1, (base.maxHp || 0) + tMaxHp + pMaxHp + cMaxHp); 
  const finalAtk = (base.atk || 0) + tAtk + pAtk + cAtk;
  const finalDef = (base.def || 0) + tDef + pDef + cDef;
  const finalLuck = (base.luck || 0) + tLuck + pLuck + cLuck;

  // ✅ 4. ก้อนโบนัสรวมสำหรับแสดงผลเลข (+) ใน UI ของหน้า Character
  const bonusStats = {
    hp: tMaxHp + pMaxHp + cMaxHp,
    atk: tAtk + pAtk + cAtk,
    def: tDef + pDef + cDef,
    luck: tLuck + pLuck + cLuck
  };

  // 📊 5. คำนวณเปอร์เซ็นต์สำหรับ Progress Bars (HP & EXP)
  const currentHp = Math.max(0, base.hp || 0);
  const hpPercent = (currentHp / finalMaxHp) * 100;
  
  const currentExp = Math.max(0, base.exp || 0);
  const nextExp = Math.max(1, base.nextLevelExp || 100);
  const expPercent = Math.floor((currentExp / nextExp) * 100);

  return {
    ...base,
    // อัปเดตค่าสเตตัสหลักด้วยค่าที่คำนวณใหม่
    atk: finalAtk, 
    def: finalDef,
    luck: finalLuck,
    maxHp: finalMaxHp,
    
    // ส่งออกค่า Final แยกเผื่อการเรียกใช้ในจุดอื่น
    finalMaxHp,
    finalAtk,
    finalDef,
    finalLuck,
    bonusStats,
    
    // เปอร์เซ็นต์สำหรับ UI
    hpPercent: Math.min(100, Math.max(0, hpPercent)),
    expPercent: Math.min(100, Math.max(0, expPercent))
  };
};