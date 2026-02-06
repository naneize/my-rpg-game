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
    // 🍀 คำนวณค่า Luck
    const luckFactor = 1 + Math.min((player.luck || 0) * 0.01, 0.50);
    const finalDropChance = item.chance * luckFactor * globalDropModifier;

    if (Math.random() <= finalDropChance) {
      // ✨ คำนวณ Shiny
      const shinyBase = 0.001;
      const shinyBonus = (player.luck || 0) * 0.00005;
      const finalShinyChance = Math.min(shinyBase + shinyBonus, 0.01);
      const isShiny = Math.random() < finalShinyChance;
      
      // 📜 [จุดสำคัญ] ตรวจสอบความเป็นสกิล
      const isSkill = !!item.skillId || item.type === 'SKILL';
      // ⚔️ [เพิ่มเติม] ตรวจสอบความเป็นอุปกรณ์ (เช็คจาก slot หรือ type ที่ส่งมา)
      const isEquipment = !!item.slot || item.type === 'EQUIPMENT';

      const newItem = { 
        ...item, 
        isShiny, 
        // ✅ [เพิ่มใหม่] เก็บชื่อไอเทมเดิมไว้เป็น itemId เพื่อให้ Modal ไปดึงข้อมูลจาก EQUIPMENTS ได้ถูกต้อง
        itemId: item.itemId || item.id || item.name,
        // ✅ [แก้ไข] รักษา Type EQUIPMENT ไว้ และถ้าเป็นของสะสมทั่วไปให้ใช้ MATERIAL
        type: isSkill ? 'SKILL' : (isEquipment ? 'EQUIPMENT' : (item.type || 'MATERIAL')),
        skillId: item.skillId || (isSkill ? item.name : null),
        image: item.image || item.icon || "📦", 
        id: `${item.name}-${crypto.randomUUID()}` 
      };
      
      droppedItems.push(newItem);
      
      const icon = isSkill ? "📜 [SKILL]" : getRarityIcon(item.rarity, isShiny);
      logs.push(`${icon} ได้รับ: ${item.name}`);
    }
  });

  return { droppedItems, logs };
};

// getRarityIcon (คงเดิม)
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