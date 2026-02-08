import { EQUIPMENTS } from '../data/equipments';

/**
 * 🛠️ ฟังก์ชันสร้างรหัสสุ่ม (Instance ID)
 */
export const generateInstanceId = () => {
  return `inst-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`;
};

/**
 * 🎲 ฟังก์ชันสุ่มเลเวลไอเทม (Lucky Drop)
 */
export const rollItemLevel = () => {
  const roll = Math.random();
  if (roll < 0.02) return 2; // 2% -> +2
  if (roll < 0.12) return 1; // 10% -> +1
  return 0; 
};

/**
 * 🗡️ ฟังก์ชันดึงข้อมูลไอเทมแบบเต็ม (Join ข้อมูล Base + Instance)
 * ✅ แก้ไข: อัปเดตการดึงค่าจาก baseAtk -> atk และรวมค่าสถานะให้ถูกต้อง
 */
export const getFullItemInfo = (invItem) => {
  if (!invItem) return null;
  const baseData = EQUIPMENTS.find(e => e.id === invItem.itemId);
  if (!baseData) return null;

  // ✅ คำนวณค่าสถานะสุทธิของไอเทมชิ้นนั้นๆ (Base + Level Upgrade + Random Bonus)
  const totalAtk = (baseData.atk || 0) + (invItem.level * 2) + (invItem.bonusAtk || 0);
  const totalDef = (baseData.def || 0) + (invItem.level * 2) + (invItem.bonusDef || 0);
  const totalMaxHp = (baseData.hp || 0) + (invItem.level * 10) + (invItem.bonusHp || 0);

  return {
    ...baseData,   
    ...invItem,    
    id: invItem.itemId, // เพื่อความเข้ากันได้ของระบบ Inventory
    
    // ✅ ส่งค่าสุทธิออกไป เพื่อให้ statCalculations และ UI ใช้งานได้ทันที
    atk: totalAtk,
    def: totalDef,
    hp: totalMaxHp,
    
    // เก็บชื่อเดิมไว้กันพลาด (ถ้า UI บางจุดเรียกใช้)
    totalAtk: totalAtk,
    totalDef: totalDef,
    totalMaxHp: totalMaxHp
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
 * ♻️ ฟังก์ชันสำหรับย่อยไอเทม (Salvage)
 */
export const salvageItem = (invItem) => {
  const baseData = EQUIPMENTS.find(e => e.id === invItem.itemId);
  if (!baseData) return null;

  let materialType = 'scrap'; 
  let amount = 0;

  // 1. กำหนดเกรดและจำนวนพื้นฐานตาม Rarity
  if (baseData.rarity === 'Uncommon') {
    materialType = 'shard'; 
    amount = Math.floor(Math.random() * 2) + 1; // 1-2 ชิ้น
  } else if (baseData.rarity === 'Rare' || baseData.rarity === 'Epic') {
    materialType = 'dust'; 
    amount = 1; // 1 ชิ้นเสมอสำหรับของแรร์
  } else {
    materialType = 'scrap'; 
    amount = Math.floor(Math.random() * 3) + 2; // 2-4 ชิ้นสำหรับของทั่วไป
  }

  // 2. ปรับโบนัสจาก Level ให้เป็นแบบ Scale (ไม่ให้บวกตรงๆ เยอะเกินไป)
  // แทนที่จะบวก 50 ให้ใช้หาร เพื่อให้ของเลเวลสูงมีค่า แต่ไม่โกง
  const levelBonus = Math.floor(invItem.level / 5); 
  
  // ถ้าเป็น Dust ให้โบนัสเลเวลน้อยลง (เช่น ทุก 10 เลเวลได้เพิ่ม 1)
  if (materialType === 'dust') {
    amount += Math.floor(invItem.level / 10);
  } else {
    amount += levelBonus;
  }

  return { materialType, amount };
};

/**
 * 🔨 ฟังก์ชันสำหรับการคราฟต์ไอเทม (Crafting)
 */
export const craftItem = (slotType) => {
  const availableBaseItems = EQUIPMENTS.filter(e => e.slot === slotType);
  const randomBase = availableBaseItems[Math.floor(Math.random() * availableBaseItems.length)];

  const craftLevel = Math.random() < 0.1 ? 2 : 1; 

  return {
    instanceId: generateInstanceId(),
    itemId: randomBase.id,
    level: craftLevel,
    bonusAtk: Math.floor(Math.random() * 5),
    acquiredAt: new Date().toISOString(),
    isCrafted: true 
  };
};