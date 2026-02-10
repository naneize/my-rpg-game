// ✅ เพิ่มการนำเข้าฟังก์ชันสร้างไอเทมจาก inventoryUtils
import { createDropItem } from './inventoryUtils';

/**
 * ฟังก์ชันหลักในการสุ่มไอเทม
 */
export const calculateLoot = (lootTable, player, globalDropModifier = 1, rankMultiplier = 1, monster = {}) => {
  const droppedItems = []; 
  const logs = [];

  if (!lootTable || !Array.isArray(lootTable) || lootTable.length === 0) {
    return { droppedItems, logs }; 
  }       

  lootTable.forEach(item => {
    // 🍀 1. คำนวณอัตราการดรอป (Chance) แบบ Curve
    const luck = player.luck || 0;
    const luckFactor = 1 + (luck / (luck + 100)); 
    const finalDropChance = item.chance * luckFactor * globalDropModifier;

    if (Math.random() <= finalDropChance) {
      const isSkill = !!item.skillId || item.type === 'SKILL';
   
      // ✨ 2. คำนวณความหายากพิเศษ (Shiny)
      const isMonsterShiny = monster.isShiny || false;
      const shinyBase = isMonsterShiny ? 0.15 : 0.001; // ปรับมอนทองดรอปของทองง่ายขึ้นเป็น 15%
      const shinyBonus = luck * 0.0001; // ปรับให้ Luck ส่งผลต่อของ Shiny มากขึ้น 2 เท่า
      
      const shinyCap = isMonsterShiny ? 0.40 : 0.02; // มอนทองเพดาน 40%, มอนปกติเพดาน 2%
      const finalShinyChance = Math.min(shinyBase + shinyBonus, shinyCap);
      const isShiny = Math.random() < finalShinyChance;
      
      const validSlots = ['WEAPON', 'ARMOR', 'ACCESSORY', 'BOOTS', 'HELMET'];
      const isEquipment = (item.type === 'EQUIPMENT' || !!item.slot) && validSlots.includes(item.slot);

      // 🎲 3. ลอจิกสุ่มจำนวน (Amount)
      const min = item.minAmount || 1;
      const max = item.maxAmount || 1;
      const baseAmount = Math.floor(Math.random() * (max - min + 1)) + min;
      const finalAmount = Math.max(1, Math.floor(baseAmount * rankMultiplier));

      const baseId = item.id || item.itemId || (item.name ? item.name.toLowerCase() : 'unknown');

      const isCard = item.type === 'MONSTER_CARD' || item.itemId?.includes('_card');

      let instanceData = {};
      if (isEquipment) {
        instanceData = createDropItem(item.itemId || item.id || baseId, luck);
        
        // 🔥 [ADJUSTED] ถ้าได้ของ Shiny ต้องบวกพลังให้เบิ้มตามสเกล ATK 150+
        if (isShiny) {
          instanceData.bonusAtk = (instanceData.bonusAtk || 0) + 120; // เพิ่มจาก 15 เป็น 120
          instanceData.bonusAtkPercent = (instanceData.bonusAtkPercent || 0) + 0.10; // เพิ่มจาก 5% เป็น 10%
        }
      }

        const newItem = { 
        ...item, 
        ...instanceData, 
        isShiny,
        amount: finalAmount, 
        itemId: item.itemId || item.id || item.name,
        type: isSkill ? 'SKILL' : (isCard ? 'MONSTER_CARD' : (isEquipment ? 'EQUIPMENT' : 'MATERIAL')),
        skillId: item.skillId || (isSkill ? item.name : null),
        image: item.image || item.icon || "📦", 
        id: instanceData.instanceId || baseId 
      };

      droppedItems.push(newItem);
      
      const icon = isSkill ? "📜 [SKILL]" : getRarityIcon(item.rarity, isShiny);
      const amountText = finalAmount > 1 ? ` x${finalAmount}` : '';
      const displayName = item.name || baseId.toUpperCase();
      
      let extraLog = "";
      if (newItem.level > 0) extraLog += ` (+${newItem.level})`;
      if (isShiny) extraLog += " [SHINY!]";

      logs.push(`${icon} ได้รับ: ${displayName}${extraLog}${amountText}`);
    }
  });

  return { 
    items: droppedItems,
    droppedItems: droppedItems,
    logs: logs 
  };
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