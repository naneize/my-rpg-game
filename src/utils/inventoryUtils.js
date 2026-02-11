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
 */
export const getFullItemInfo = (invItem) => {
  if (!invItem) return null;
  
  // 🔍 ค้นหาฐานข้อมูล (รองรับทั้งการใช้ itemId หรือ id ตรงๆ)
  const baseData = EQUIPMENTS.find(e => e.id === (invItem.itemId || invItem.id));
  
  if (!baseData) return invItem;

  // ✅ คำนวณค่าสถานะสุทธิ (Base + Level Upgrade + Random Bonus)
  // อัตราการสเกล: Atk +2/Lv, Def +2/Lv, HP +10/Lv
  const totalAtk = (baseData.atk || 0) + ((invItem.level || 0) * 2) + (invItem.bonusAtk || 0);
  const totalDef = (baseData.def || 0) + ((invItem.level || 0) * 2) + (invItem.bonusDef || 0);
  const totalMaxHp = (baseData.hp || 0) + ((invItem.level || 0) * 10) + (invItem.bonusHp || 0);

  return {
    ...baseData,   
    ...invItem,    
    itemId: invItem.itemId || baseData.id,
    
    // ✅ สเตตัสหลัก (สำหรับการแสดงผลและคำนวณ)
    atk: totalAtk,
    def: totalDef,
    hp: totalMaxHp,
    
    // ✅ ค่า % สุทธิ (Base % + Bonus %)
    atkPercent: (baseData.atkPercent || 0) + (invItem.bonusAtkPercent || 0),
    defPercent: (baseData.defPercent || 0) + (invItem.bonusDefPercent || 0),
    hpPercent: (baseData.hpPercent || 0) + (invItem.bonusHpPercent || 0),
    
    // Alias สำหรับ UI บางจุดที่เรียกใช้ total
    totalAtk: totalAtk,
    totalDef: totalDef,
    totalMaxHp: totalMaxHp
  };
};

/**
 * 🎲 ฟังก์ชันสุ่มดรอปไอเทมใหม่
 */
export const createDropItem = (itemId, playerLuck = 0) => {
  const luckBonus = playerLuck * 0.001; 
  const finalChance = Math.min(0.05 + luckBonus, 0.15); 
  const hasPercentBonus = Math.random() < finalChance;

  return {
    instanceId: generateInstanceId(),
    itemId: itemId,
    level: rollItemLevel(), 
    bonusAtk: Math.floor(Math.random() * 3), 
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

  if (baseData.rarity === 'Uncommon') {
    materialType = 'shard'; 
    amount = Math.floor(Math.random() * 2) + 1;
  } else if (['Rare', 'Epic', 'Legendary'].includes(baseData.rarity)) {
    materialType = 'dust'; 
    amount = 1;
  } else {
    materialType = 'scrap'; 
    amount = Math.floor(Math.random() * 3) + 2;
  }

  const levelBonus = Math.floor((invItem.level || 0) / 5); 
  amount += (materialType === 'dust') ? Math.floor((invItem.level || 0) / 10) : levelBonus;

  return { materialType, amount };
};

/**
 * 🔨 ฟังก์ชันสำหรับการคราฟต์ไอเทม (Crafting)
 * ✅ FIX: ปรับปรุงการตรวจสอบ Slot และรองรับตัวพิมพ์เล็ก/ใหญ่
 */
export const craftItem = (slotType) => {
  if (!slotType) return null;

  // 🛡️ ป้องกัน Case-Sensitive: แปลงเป็นตัวเล็กเพื่อให้ตรงกับดาต้าใน EQUIPMENTS
  const targetSlot = slotType.toLowerCase();

  // 🔍 ค้นหาไอเทมตาม Slot ที่ต้องการ
  const availableBaseItems = EQUIPMENTS.filter(e => e.slot === targetSlot);
  
  // 🚨 หากไม่เจอข้อมูล ให้ลองค้นหาแบบกว้าง (เผื่อเป็นหมวดหมู่อื่น)
  if (availableBaseItems.length === 0) {
    console.error(`Crafting Error: No items found for slot "${targetSlot}"`);
    return null;
  }

  const randomBase = availableBaseItems[Math.floor(Math.random() * availableBaseItems.length)];

  return {
    instanceId: generateInstanceId(),
    itemId: randomBase.id,
    level: 0, // ให้เลเวลไปบวกเพิ่มในหน้า CraftingView แทน
    bonusAtk: Math.floor(Math.random() * 5),
    bonusAtkPercent: Math.random() < 0.1 ? 0.02 : 0, 
    acquiredAt: new Date().toISOString(),
    isCrafted: true 
  };
};