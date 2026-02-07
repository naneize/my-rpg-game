// src/utils/lootUtils.js

/**
 * ฟังก์ชันหลักในการสุ่มไอเทม
 * @param {Array} lootTable - รายการไอเทมดรอปของมอนสเตอร์
 * @param {Object} player - ข้อมูลผู้เล่น (ใช้ค่า Luck)
 * @param {Number} globalDropModifier - ตัวคูณดรอปพิเศษ (ถ้ามี)
 * @param {Number} rankMultiplier - ตัวคูณตามอันดับ World Boss หรือโบนัสอื่นๆ (ถ้ามี)
 */
export const calculateLoot = (lootTable, player, globalDropModifier = 1, rankMultiplier = 1) => {
  const droppedItems = [];
  const logs = [];

  if (!lootTable || !Array.isArray(lootTable) || lootTable.length === 0) {
    return { droppedItems: [], logs: [] };
  }       

  lootTable.forEach(item => {
    // 🍀 1. คำนวณอัตราการดรอป (Chance)
    const luckFactor = 1 + Math.min((player.luck || 0) * 0.01, 0.50);
    const finalDropChance = item.chance * luckFactor * globalDropModifier;

    if (Math.random() <= finalDropChance) {
      // ✨ 2. คำนวณความหายากพิเศษ (Shiny)
      const shinyBase = 0.001;
      const shinyBonus = (player.luck || 0) * 0.00005;
      const finalShinyChance = Math.min(shinyBase + shinyBonus, 0.01);
      const isShiny = Math.random() < finalShinyChance;
      
      const isSkill = !!item.skillId || item.type === 'SKILL';
      const isEquipment = !!item.slot || item.type === 'EQUIPMENT';

      // 🎲 3. ลอจิกสุ่มจำนวน (Amount) พร้อมตัวคูณอันดับ (Rank Multiplier)
      const min = item.minAmount || 1;
      const max = item.maxAmount || 1;
      const baseAmount = Math.floor(Math.random() * (max - min + 1)) + min;
      
      // ✅ [แก้ไขจุดสำคัญ] คูณ rankMultiplier เข้าไปที่นี่เลย เพื่อให้เป็นยอดสุทธิที่แท้จริง
      // ใช้ Math.max(1, ...) เพื่อป้องกันกรณีตัวคูณเป็น 0 แล้วของหาย
      const finalAmount = Math.max(1, Math.floor(baseAmount * rankMultiplier));

      const baseId = item.id || item.itemId || (item.name ? item.name.toLowerCase() : 'unknown');

      const newItem = { 
        ...item, 
        isShiny,
        amount: finalAmount, // ✅ ยอดรวมสุทธิหลังคูณ Rank แล้ว
        itemId: item.itemId || item.id || item.name,
        type: isSkill ? 'SKILL' : (isEquipment ? 'EQUIPMENT' : (item.type || 'MATERIAL')),
        skillId: item.skillId || (isSkill ? item.name : null),
        image: item.image || item.icon || "📦", 
        id: `${baseId}-${crypto.randomUUID()}` 
      };
      
      droppedItems.push(newItem);
      
      const icon = isSkill ? "📜 [SKILL]" : getRarityIcon(item.rarity, isShiny);
      
      // ✅ [แก้ไข] ปรับ Log ให้แสดงจำนวนสุทธิ และลบการ Push ซ้ำออกเพื่อให้ Log สะอาด
      const amountText = finalAmount > 1 ? ` x${finalAmount}` : '';
      const displayName = item.name || baseId.toUpperCase();
      logs.push(`${icon} ได้รับ: ${displayName}${amountText}`);
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