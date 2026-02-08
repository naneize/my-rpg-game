import { EQUIPMENTS } from '../data/equipments';
import { getFullItemInfo } from '../utils/inventoryUtils';

export const useCharacterStats = (stats, activeTitle, passiveBonuses, collectionBonuses) => {
  const base = stats || {};
  
  // ⚔️ 0. คำนวณโบนัสจากอุปกรณ์ (Gear Stats)
  const equippedItems = Object.values(base.equipment || {})
    .map(instanceId => base.inventory?.find(inv => inv.instanceId === instanceId))
    .filter(Boolean)
    .map(invItem => getFullItemInfo(invItem));

  // ✅ แก้ไข: inventoryUtils คืนค่ามาในชื่อ atk, def, hp (ที่เราแก้ไปล่าสุด)
  const gearAtk = equippedItems.reduce((sum, item) => sum + (item.atk || 0), 0);
  const gearDef = equippedItems.reduce((sum, item) => sum + (item.def || 0), 0);
  const gearMaxHp = equippedItems.reduce((sum, item) => sum + (item.hp || 0), 0);

  // 🛡️ 1. โบนัสจากระบบ Passive และ Collection
  // ✅ ต้องเช็คชื่อ Key ให้ตรงกับใน MONSTER_SKILLS (ถ้าคุณใช้ชื่อ hp ก็ต้องเป็น .hp)
  const pAtk = passiveBonuses?.atk || 0;
  const pDef = passiveBonuses?.def || 0;
  const pMaxHp = passiveBonuses?.hp || 0; // มั่นใจว่าใน data/passive.js ใช้ key ว่า hp
  const pLuck = passiveBonuses?.luck || 0;

  const cAtk = collectionBonuses?.atk || 0;
  const cDef = collectionBonuses?.def || 0;
  const cMaxHp = collectionBonuses?.hp || 0;
  const cLuck = collectionBonuses?.luck || 0;

  // 🎖️ 2. โบนัสจากฉายา (Titles)
  const tStats = activeTitle?.bonusStats || activeTitle || {};
  const tMaxHp = tStats.hp || tStats.maxHp || 0; // เช็คทั้ง hp และ maxHp
  const tAtk = tStats.atk || 0;
  const tDef = tStats.def || 0;
  const tLuck = tStats.luck || 0;

  // ⚔️ 3. คำนวณค่าพลังสุทธิ (Final Calculation)
  const finalMaxHp = (base.maxHp || 0) + tMaxHp + pMaxHp + cMaxHp + gearMaxHp; 
  const finalAtk = (base.atk || 0) + tAtk + pAtk + cAtk + gearAtk;
  const finalDef = (base.def || 0) + tDef + pDef + cDef + gearDef;
  const finalLuck = (base.luck || 0) + tLuck + pLuck + cLuck;

  // ✅ 4. ก้อนโบนัสรวมสำหรับแสดงผลเลข (+)
  const bonusStats = {
    hp: tMaxHp + pMaxHp + cMaxHp + gearMaxHp,
    atk: tAtk + pAtk + cAtk + gearAtk,
    def: tDef + pDef + cDef + gearDef,
    luck: tLuck + pLuck + cLuck
  };

  // 📊 5. คำนวณเปอร์เซ็นต์ (คำนวณสด)
  const currentHp = Math.max(0, base.hp || 0);
  const hpPercent = (currentHp / finalMaxHp) * 100;
  
  const currentExp = Math.max(0, base.exp || 0);
  const nextExp = Math.max(1, base.nextLevelExp || 100);
  const expPercent = Math.floor((currentExp / nextExp) * 100);

  return {
    ...base,
    // ส่งค่าที่คำนวณได้จริงออกไป
    maxHp: finalMaxHp, 
    atk: finalAtk,
    def: finalDef,
    luck: finalLuck,
    
    // ไว้ใช้สำหรับหน้า UI
    finalMaxHp,
    finalAtk,
    finalDef,
    bonusStats,
    
    hpPercent: Math.min(100, Math.max(0, hpPercent)),
    expPercent: Math.min(100, Math.max(0, expPercent))
  };
};