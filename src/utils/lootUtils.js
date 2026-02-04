// src/utils/lootUtils.js

/**
 * ฟังก์ชันหลักในการสุ่มไอเทม
 * @param {Array} lootTable - รายการไอเทมดรอปของมอนสเตอร์
 * @param {Object} player - ข้อมูลผู้เล่น (ใช้ค่า Luck)
 * @param {Number} globalDropModifier - ตัวคูณดรอปพิเศษ (ถ้ามี)
 */
export const calculateLoot = (lootTable, player, globalDropModifier = 1) => {
  const droppedItems = [];
  const logs = [];

  if (!lootTable || !Array.isArray(lootTable) || lootTable.length === 0) {
    return { droppedItems: [], logs: [] };
  }       

  lootTable.forEach(item => {
    // 🍀 คำนวณค่า Luck: จำกัดเพดานโบนัสที่ 50%
    const luckFactor = 1 + Math.min((player.luck || 0) * 0.01, 0.50);
    const finalDropChance = item.chance * luckFactor * globalDropModifier;

    if (Math.random() <= finalDropChance) {
      // ✨ คำนวณโอกาสเกิด Shiny (ไอเทมเรืองแสง)
      const shinyBase = 0.001;
      const shinyBonus = (player.luck || 0) * 0.00005;
      const finalShinyChance = Math.min(shinyBase + shinyBonus, 0.01);

      const isShiny = Math.random() < finalShinyChance;
      
      const newItem = { 
        ...item, 
          isShiny, 
        // ✅ ต้องมั่นใจว่าส่งภาพไอเทมไปด้วย
        image: item.image || item.icon || "📦", 
        id: `${item.name}-${crypto.randomUUID()}` 
      };
      
      droppedItems.push(newItem);
      
      // 📝 สร้างข้อความ Log พร้อมไอคอนตามความหายาก
      const icon = getRarityIcon(item.rarity, isShiny);
      logs.push(`${icon} ได้รับไอเทม: ${item.name}`);
    }
  });

  return { droppedItems, logs };
};

// ฟังก์ชันช่วยจัดการไอคอน
const getRarityIcon = (rarity, isShiny) => {
  if (isShiny) return "✨💎 [SHINY]";
  switch (rarity) {
    case "Legendary": return "🟠 [LEGENDARY]";
    case "Epic":      return "🟣 [EPIC]";
    case "Rare":      return "🔵 [RARE]";
    case "Uncommon":  return "🟢 [UNCOMMON]";
    default:          return "⚪";
  }
};