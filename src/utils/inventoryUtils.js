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
 * ✅ FIX: เพิ่มการอัปเดต State ผู้เล่นและลบไอเทมออกจาก Inventory
 */
export const salvageItem = (invItem, setPlayer, setLogs) => {
  const baseData = EQUIPMENTS.find(e => e.id === (invItem.itemId || invItem.id));
  if (!baseData) return;

  let materialType = 'scrap'; 
  let amount = 0;

  // 1. คำนวณประเภทวัตถุดิบ
  if (baseData.rarity === 'Uncommon') {
    materialType = 'shards'; // ปรับชื่อให้ตรงกับ state (shards)
    amount = Math.floor(Math.random() * 2) + 1;
  } else if (['Rare', 'Epic', 'Legendary'].includes(baseData.rarity)) {
    materialType = 'dust'; 
    amount = 1;
  } else {
    materialType = 'scrap'; 
    amount = Math.floor(Math.random() * 3) + 2;
  }

  // 2. โบนัสตามเลเวล
  const levelBonus = Math.floor((invItem.level || 0) / 5); 
  amount += (materialType === 'dust') ? Math.floor((invItem.level || 0) / 10) : levelBonus;

  // 3. 🛠️ อัปเดต State ผู้เล่น (ลบของ + เพิ่มทรัพยากร)
  setPlayer(prev => ({
    ...prev,
    // ลบไอเทมชิ้นนี้ออกจากกระเป๋า
    inventory: prev.inventory.filter(item => item.instanceId !== invItem.instanceId),
    // เพิ่มทรัพยากรตามประเภทที่ได้ (เช่น prev.shards + amount)
    [materialType]: (prev[materialType] || 0) + amount
  }));

  // 4. บันทึก Log
  if (setLogs) {
    setLogs(prev => [`> TERMINATED: ${baseData.name} (Gained ${amount} ${materialType})`, ...prev].slice(0, 50));
  }
};

/**
 * 🔨 ฟังก์ชันสำหรับการคราฟต์ไอเทม (Crafting)
 * ✅ FIX: ปรับปรุงการตรวจสอบ Slot และรองรับตัวพิมพ์เล็ก/ใหญ่
 */
/**
 * 🔨 ฟังก์ชันสำหรับการคราฟต์ไอเทม (Crafting)
 * ✅ FIX: ส่งข้อมูล BaseData กลับไปครบถ้วน และเพิ่มระบบสุ่ม Rarity ตาม Tier
 */
export const craftItem = (slotType, tier = 'BASIC') => {
  if (!slotType) return null;

  const targetSlot = slotType.toLowerCase();

  // 🔍 กรองไอเทมตาม Slot
  let availableBaseItems = EQUIPMENTS.filter(e => e.slot === targetSlot);
  
  if (availableBaseItems.length === 0) {
    console.error(`Crafting Error: No items found for slot "${targetSlot}"`);
    return null;
  }

  // 🎲 ระบบสุ่มไอเทมจากฐานข้อมูล
  const randomBase = availableBaseItems[Math.floor(Math.random() * availableBaseItems.length)];

  // 🏆 ระบบกำหนด Rarity พื้นฐานตาม Tier (เพื่อให้หน้า View คำนวณ Multiplier ถูกต้อง)
  let rarityRoll = 'Common';
  const roll = Math.random();

  if (tier === 'MASTER') {
    // Master: มีโอกาสได้ของดีสูงขึ้น (Rare 20%, Epic 40%, Legendary 40%)
    rarityRoll = roll < 0.4 ? 'Legendary' : (roll < 0.8 ? 'Epic' : 'Rare');
  } else if (tier === 'ELITE') {
    // Elite: (Uncommon 30%, Rare 40%, Epic 30%)
    rarityRoll = roll < 0.3 ? 'Epic' : (roll < 0.7 ? 'Rare' : 'Uncommon');
  } else {
    // Basic: (Common 70%, Uncommon 20%, Rare 10%)
    rarityRoll = roll < 0.1 ? 'Rare' : (roll < 0.3 ? 'Uncommon' : 'Common');
  }

  // ✅ ส่ง Object กลับไปแบบเต็ม (รวมร่าง Base Data + Instance Data)
  return {
    ...randomBase, // 🛡️ ต้องมีจุดนี้! เพื่อส่งค่า atk, def, hp, rarity ดั้งเดิมไปด้วย
    instanceId: generateInstanceId(),
    itemId: randomBase.id,
    rarity: rarityRoll, // ใช้ Rarity ที่สุ่มได้ใหม่ตาม Tier
    level: 0,
    bonusAtk: Math.floor(Math.random() * 5),
    bonusAtkPercent: Math.random() < 0.1 ? 0.02 : 0, 
    acquiredAt: new Date().toISOString(),
    isCrafted: true 
  };
};