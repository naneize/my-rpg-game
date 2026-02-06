import { EQUIPMENTS } from '../data/equipments';

/**
 * 🛠️ ฟังก์ชันสร้างรหัสสุ่ม (Instance ID) ให้กับไอเทมชิ้นใหม่
 */
export const generateInstanceId = () => {
  return `inst-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`;
};

/**
 * 🎲 [NEW] ฟังก์ชันสุ่มเลเวลไอเทม (Lucky Drop)
 * โอกาส: +0 (88%), +1 (10%), +2 (2%)
 */
export const rollItemLevel = () => {
  const roll = Math.random();
  if (roll < 0.02) return 2; // 2% โอกาสได้ +2
  if (roll < 0.12) return 1; // 10% โอกาสได้ +1 (0.02 + 0.10)
  return 0; // ที่เหลือได้ +0
};

/**
 * 🗡️ ฟังก์ชันดึงข้อมูลไอเทมแบบเต็ม (Join ข้อมูล Base + Instance)
 * ✅ แก้ไข: บังคับให้มีฟิลด์ id เพื่อให้ระบบ Inventory/Wrap ทำงานได้แม่นยำขึ้น
 */
export const getFullItemInfo = (invItem) => {
  if (!invItem) return null;
  const baseData = EQUIPMENTS.find(e => e.id === invItem.itemId);
  if (!baseData) return null;

  return {
    ...baseData,   
    ...invItem,    
    // ✅ เพิ่ม id ให้เท่ากับ itemId เพื่อให้ฟังก์ชันหักของใน App.js ค้นหาเจอทั้ง 2 ชื่อ
    id: invItem.itemId, 
    totalAtk: (baseData.baseAtk || 0) + (invItem.level * 2) + (invItem.bonusAtk || 0),
    totalDef: (baseData.baseDef || 0) + (invItem.level * 2) + (invItem.bonusDef || 0),
    totalMaxHp: (baseData.baseHp || 0) + (invItem.level * 10) + (invItem.bonusHp || 0),
  };
};

/**
 * 🎲 ฟังก์ชันสุ่มดรอปไอเทมใหม่
 */
export const createDropItem = (itemId) => {
  return {
    instanceId: generateInstanceId(),
    itemId: itemId,
    level: rollItemLevel(), 
    bonusAtk: Math.floor(Math.random() * 3), 
    acquiredAt: new Date().toISOString()
  };
};

/**
 * ♻️ [NEW] ฟังก์ชันสำหรับย่อยไอเทม (Salvage)
 * คืนค่าเป็นวัตถุดิบตามระดับความหายากของไอเทม
 */
export const salvageItem = (invItem) => {
  const baseData = EQUIPMENTS.find(e => e.id === invItem.itemId);
  if (!baseData) return null;

  let materialType = 'scrap'; // เศษเหล็ก/ไม้ (Common)
  let amount = Math.floor(Math.random() * 3) + 1; // สุ่ม 1-3 ชิ้น

  if (baseData.rarity === 'Uncommon') {
    materialType = 'shard'; // ชิ้นส่วนผลึก
    amount = Math.floor(Math.random() * 2) + 1;
  } else if (baseData.rarity === 'Rare' || baseData.rarity === 'Epic') {
    materialType = 'dust'; // ผงเวทมนตร์
    amount = 1;
  }

  // โบนัสพิเศษถ้าไอเทมมี Level (+1 หรือ +2) จะได้วัตถุดิบเพิ่ม
  if (invItem.level > 0) amount += invItem.level;

  return { materialType, amount };
};

/**
 * 🔨 [NEW] ฟังก์ชันสำหรับการคราฟต์ไอเทม (Crafting)
 * สุ่มไอเทมจากหมวดหมู่ที่ระบุ โดยมีโอกาส High-Roll (ได้สเตตัสดีกว่าดรอปปกติ)
 */
export const craftItem = (slotType) => {
  // กรองไอเทมตาม Slot (WEAPON, ARMOR, ACCESSORY)
  const availableBaseItems = EQUIPMENTS.filter(e => e.slot === slotType);
  const randomBase = availableBaseItems[Math.floor(Math.random() * availableBaseItems.length)];

  // Logic: ของคราฟต์จะไม่มีทางได้ Level 0 (เริ่มที่ +1 ขึ้นไป)
  const craftLevel = Math.random() < 0.1 ? 2 : 1; 

  return {
    instanceId: generateInstanceId(),
    itemId: randomBase.id,
    level: craftLevel,
    bonusAtk: Math.floor(Math.random() * 5), // คราฟต์สุ่มโบนัสได้สูงกว่า (0-4)
    acquiredAt: new Date().toISOString(),
    isCrafted: true // ระบุว่าเป็นของที่คราฟต์มา
  };
};