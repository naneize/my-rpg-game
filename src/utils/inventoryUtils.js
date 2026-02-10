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
 * ✅ แก้ไข: อัปเดตให้รองรับการดึงค่า % จาก baseData มาใช้ใน UI และระบบคำนวณ
 * 🛡️ เพิ่มเติม: รักษาค่าพิเศษ (isShiny, slot, type) เพื่อป้องกันไอเทม "เละ" ใน Inventory
 */
export const getFullItemInfo = (invItem) => {
  if (!invItem) return null;
  
  // 🔍 ค้นหาฐานข้อมูล (รองรับทั้งการใช้ itemId หรือ id ตรงๆ)
  const baseData = EQUIPMENTS.find(e => e.id === (invItem.itemId || invItem.id));
  
  // 🛡️ [Security] ถ้าเป็นไอเทมที่ไม่มีในฐานข้อมูล (เช่น ของเสกพิเศษ) 
  // ให้คืนค่าตัวมันเองกลับไป เพื่อไม่ให้ขึ้น Unknown Item
  if (!baseData) return invItem;

  // ✅ คำนวณค่าสถานะสุทธิของไอเทมชิ้นนั้นๆ (Base + Level Upgrade + Random Bonus)
  const totalAtk = (baseData.atk || 0) + ((invItem.level || 0) * 2) + (invItem.bonusAtk || 0);
  const totalDef = (baseData.def || 0) + ((invItem.level || 0) * 2) + (invItem.bonusDef || 0);
  const totalMaxHp = (baseData.hp || 0) + ((invItem.level || 0) * 10) + (invItem.bonusHp || 0);

  return {
    ...baseData,   // ฐานข้อมูล (slot, type, icon, rarity)
    ...invItem,    // ข้อมูลจากตัวไอเทมเอง (instanceId, isShiny, name)
    
    
    
    // เก็บ itemId ไว้เผื่อกรณีต้องดึงข้อมูลจาก EQUIPMENTS อีกครั้ง
    itemId: invItem.itemId || baseData.id,
    
    // ✅ ส่งค่าสุทธิออกไป เพื่อให้ statCalculations และ UI ใช้งานได้ทันที
    atk: totalAtk,
    def: totalDef,
    hp: totalMaxHp,
    
    // ✅ [เพิ่มใหม่] ส่งค่า % สุทธิออกไปด้วย (รวมโบนัสสุ่ม % ถ้ามีในอนาคต)
    atkPercent: (baseData.atkPercent || 0) + (invItem.bonusAtkPercent || 0),
    defPercent: (baseData.defPercent || 0) + (invItem.bonusDefPercent || 0),
    hpPercent: (baseData.hpPercent || 0) + (invItem.bonusHpPercent || 0),
    
    // เก็บชื่อเดิมไว้กันพลาด (ถ้า UI บางจุดเรียกใช้)
    totalAtk: totalAtk,
    totalDef: totalDef,
    totalMaxHp: totalMaxHp
  };
};

/**
 * 🎲 ฟังก์ชันสุ่มดรอปไอเทมใหม่
 * ✅ แก้ไข: เพิ่มการสุ่มโบนัสสเตตัสแบบ % (Rare Option) เข้าไปในไอเทมเกิดใหม่
 */
export const createDropItem = (itemId, playerLuck = 0) => {
  // สุ่มโอกาสได้ Option % พิเศษ (โอกาส 5% ที่จะติดโบนัสเปอร์เซ็นต์มาตั้งแต่ดรอป)
  const luckBonus = playerLuck * 0.001; 
  const finalChance = Math.min(0.05 + luckBonus, 0.15); // Cap สูงสุดที่ 15% กันโกง
  const hasPercentBonus = Math.random() < finalChance;
  

  return {
    instanceId: generateInstanceId(),
    itemId: itemId,
    level: rollItemLevel(), 
    bonusAtk: Math.floor(Math.random() * 3), 
    
    // ✅ [เพิ่มใหม่] เก็บค่าโบนัส % สุ่ม (ถ้าสุ่มติดจะได้ +1% ถึง +2%)
    bonusAtkPercent: hasPercentBonus ? (Math.floor(Math.random() * 5) + 1) / 100 : 0,
    bonusDefPercent: 0,
    bonusHpPercent: 0,
    
    acquiredAt: new Date().toISOString()
  };
};

/**
 * ♻️ ฟังก์ชันสำหรับย่อยไอเทม (Salvage)
 */
export const salvageItem = (invItem) => {
  const baseData = EQUIPMENTS.find(e => e.id === (invItem.itemId || invItem.id));
  if (!baseData) return { materialType: 'scrap', amount: 1 };

  let materialType = 'scrap'; 
  let amount = 0;

  // 1. กำหนดเกรดและจำนวนพื้นฐานตาม Rarity
  if (baseData.rarity === 'Uncommon') {
    materialType = 'shard'; 
    amount = Math.floor(Math.random() * 2) + 1; // 1-2 ชิ้น
  } else if (baseData.rarity === 'Rare' || baseData.rarity === 'Epic' || baseData.rarity === 'Legendary') {
    materialType = 'dust'; 
    amount = 1; // 1 ชิ้นเสมอสำหรับของแรร์
  } else {
    materialType = 'scrap'; 
    amount = Math.floor(Math.random() * 3) + 2; // 2-4 ชิ้นสำหรับของทั่วไป
  }

  // 2. ปรับโบนัสจาก Level ให้เป็นแบบ Scale (ไม่ให้บวกตรงๆ เยอะเกินไป)
  const levelBonus = Math.floor((invItem.level || 0) / 5); 
  
  if (materialType === 'dust') {
    amount += Math.floor((invItem.level || 0) / 10);
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
  if (availableBaseItems.length === 0) return null;
  const randomBase = availableBaseItems[Math.floor(Math.random() * availableBaseItems.length)];

  const craftLevel = Math.random() < 0.1 ? 2 : 1; 

  return {
    instanceId: generateInstanceId(),
    itemId: randomBase.id,
    level: craftLevel,
    bonusAtk: Math.floor(Math.random() * 5),
    
    // ✅ [เพิ่มใหม่] ระบบคราฟต์ก็มีโอกาสสุ่มติดโบนัส % เช่นกัน (โอกาส 10%)
    bonusAtkPercent: Math.random() < 0.1 ? 0.02 : 0, 
    
    acquiredAt: new Date().toISOString(),
    isCrafted: true 
  };
};