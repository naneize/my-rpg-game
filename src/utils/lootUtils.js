// ✅ เพิ่มการนำเข้าฟังก์ชันสร้างไอเทมจาก inventoryUtils
import { createDropItem } from './inventoryUtils';

/**
 * ฟังก์ชันหลักในการสุ่มไอเทม
 * @param {Array} lootTable - รายการไอเทมดรอปของมอนสเตอร์
 * @param {Object} player - ข้อมูลผู้เล่น (ใช้ค่า Luck)
 * @param {Number} globalDropModifier - ตัวคูณดรอปพิเศษ (ถ้ามี)
 * @param {Number} rankMultiplier - ตัวคูณตามอันดับ World Boss หรือโบนัสอื่นๆ (ถ้ามี)
 * @param {Object} monster - ข้อมูลมอนสเตอร์ (ใช้เช็คสถานะ Shiny) // ✅ [เพิ่มใหม่]
 */
export const calculateLoot = (lootTable, player, globalDropModifier = 1, rankMultiplier = 1, monster = {}) => {
  const droppedItems = []; 
  const logs = [];






  if (!lootTable || !Array.isArray(lootTable) || lootTable.length === 0) {
    // แก้ไข: แม้ไม่มี lootTable แต่ถ้ามีของ God Cheat ก็ต้องส่งของ God ออกไป
    return { droppedItems, logs }; 
  }      

  lootTable.forEach(item => {
    // 🍀 1. คำนวณอัตราการดรอป (Chance) แบบ Curve (Diminishing Returns)
    // สูตร: 1 + (luck / (luck + 100)) 
    // Luck 0   -> คูณ 1.0 (เท่าเดิม)
    // Luck 50  -> คูณ 1.33 (เพิ่ม 33%)
    // Luck 100 -> คูณ 1.50 (เพิ่ม 50%)
    // Luck 999 -> จะเข้าใกล้ 2.0 (เพิ่ม 100%) แต่ไม่มีทางเกินนี้
    const luck = player.luck || 0;
    const luckFactor = 1 + (luck / (luck + 100)); 
    
    const finalDropChance = item.chance * luckFactor * globalDropModifier;

    if (Math.random() <= finalDropChance) {

      const isSkill = !!item.skillId || item.type === 'SKILL';
   
      // ✨ 2. คำนวณความหายากพิเศษ (Shiny)
      // ✅ [แก้ไข] เพิ่ม Shiny Synergy: ถ้ามอนสเตอร์เป็น Shiny โอกาสได้ไอเทม Shiny จะเริ่มที่ 10%
      const isMonsterShiny = monster.isShiny || false;
      const shinyBase = isMonsterShiny ? 0.10 : 0.001; 
      const shinyBonus = luck * 0.00005;
      
      // ✅ [แก้ไข] ปรับ Cap ตามสถานะมอนสเตอร์ (มอนปกติ 1%, มอนทอง 30%)
      const shinyCap = isMonsterShiny ? 0.30 : 0.01;
      const finalShinyChance = Math.min(shinyBase + shinyBonus, shinyCap);
      const isShiny = Math.random() < finalShinyChance;
      
      // ✅ ปรับปรุง: อุปกรณ์ต้องมี Slot เท่านั้น (ป้องกันเศษมอนสเตอร์ที่มี type เป็นอุปกรณ์แต่ไม่มี slot)
      const validSlots = ['WEAPON', 'ARMOR', 'ACCESSORY', 'BOOTS', 'HELMET'];
      const isEquipment = (item.type === 'EQUIPMENT' || !!item.slot) && validSlots.includes(item.slot);

      // 🎲 3. ลอจิกสุ่มจำนวน (Amount) พร้อมตัวคูณอันดับ (Rank Multiplier)
      const min = item.minAmount || 1;
      const max = item.maxAmount || 1;
      const baseAmount = Math.floor(Math.random() * (max - min + 1)) + min;
      
      // ✅ [แก้ไขจุดสำคัญ] คูณ rankMultiplier เข้าไปที่นี่เลย เพื่อให้เป็นยอดสุทธิที่แท้จริง
      const finalAmount = Math.max(1, Math.floor(baseAmount * rankMultiplier));

      const baseId = item.id || item.itemId || (item.name ? item.name.toLowerCase() : 'unknown');

      // 🛠️ [ส่วนที่เพิ่มเข้าไป] หากเป็นอุปกรณ์ ให้สร้างข้อมูล Instance (ID, Bonus Stats, %)
      let instanceData = {};
      
      if (isEquipment) {
        // ✅ [ปรับปรุง] ส่งค่า luck เข้าไปใน createDropItem เพื่อช่วยสุ่มโบนัส %
        instanceData = createDropItem(item.itemId || item.id || baseId, luck);
        
        // ถ้าดรอปได้ Shiny ให้บวกพลังเพิ่มเข้าไปในสเตตัสสุ่มทันที
        if (isShiny) {
          instanceData.bonusAtk = (instanceData.bonusAtk || 0) + 15;
          instanceData.bonusAtkPercent = (instanceData.bonusAtkPercent || 0) + 0.05;
        }
      }

      const newItem = { 
        ...item, 
        ...instanceData, // ✅ นำข้อมูลสุ่ม (instanceId, bonusAtk, %) มาใส่ในไอเทม
        isShiny,
        amount: finalAmount, // ✅ ยอดรวมสุทธิหลังคูณ Rank แล้ว
        itemId: item.itemId || item.id || item.name,
        type: isSkill ? 'SKILL' : (isEquipment ? 'EQUIPMENT' : 'MATERIAL'),
        skillId: item.skillId || (isSkill ? item.name : null),
        image: item.image || item.icon || "📦", 
        id: instanceData.instanceId || baseId 
      };

      console.log(`📦 [DROP] ${newItem.name} Generated ID: %c${newItem.id}`, "color: #60a5fa; font-weight: bold");
      
      droppedItems.push(newItem);
      
      const icon = isSkill ? "📜 [SKILL]" : getRarityIcon(item.rarity, isShiny);
      
      // ✅ [แก้ไข] ปรับ Log ให้แสดงจำนวนสุทธิ และลบการ Push ซ้ำออกเพื่อให้ Log สะอาด
      const amountText = finalAmount > 1 ? ` x${finalAmount}` : '';
      const displayName = item.name || baseId.toUpperCase();
      
      // เพิ่มข้อความบอกความพิเศษถ้าเป็นของเทพ
      let extraLog = "";
      if (newItem.level > 0) extraLog += ` (+${newItem.level})`;
      if (isShiny) extraLog += " [SHINY!]";

      logs.push(`${icon} ได้รับ: ${displayName}${extraLog}${amountText}`);
    }
  });

  return { 
    items: droppedItems, // ✨ เปลี่ยนจาก droppedItems เป็น items
    droppedItems: droppedItems, // กันเหนียวเผื่อที่อื่นใช้ชื่อนี้
    logs: logs 
  };;
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