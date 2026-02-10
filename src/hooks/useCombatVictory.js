import React from 'react';
import { calculateLoot } from '../utils/lootUtils';
import { createDropItem } from '../utils/inventoryUtils';

/**
 * Hook สำหรับจัดการระบบชัยชนะและการดรอปไอเทม
 */
export function useCombatVictory(player, setPlayer, setLogs, setLootResult, setCombatPhase) {
  
  // 🔒 ตัวล็อคป้องกันการรัน Victory ซ้ำซ้อน (Race Condition)
  // ป้องกันกรณี React Re-render หรือระบบเรียกซ้ำในเสี้ยววินาทีจนของเบิ้ล
  const isProcessing = React.useRef(false);

  const processVictory = (enemy, inDungeon, advanceDungeon, worldEvent) => {
    
    if (isProcessing.current || !enemy) return; // 1. เช็คแค่ว่ากำลังทำอยู่ไหมพอกันเบิ้ล
    

    // 🔑 [Locking] เริ่มกระบวนการชัยชนะและล็อคประตูไว้
    isProcessing.current = true;
    setCombatPhase('VICTORY');

    // 🔍 1. Precise ID Extraction (ดึง ID มอนสเตอร์ให้แม่นยำเพื่อสะสม Mastery)
    const rawId = enemy.baseId || enemy.id || (enemy.name ? enemy.name.toLowerCase().replace(/\s+/g, '_') : 'unknown');
    const baseMonsterId = rawId.replace('_shiny', '');

    console.log("⚔️ VICTORY DEBUG:", { 
      receivedId: enemy.id, 
      finalBaseId: baseMonsterId,
      hasPowerBonus: !!enemy.elementPowerBonus 
    });

    // 🏰 2. Dungeon Advance (ถ้าอยู่ในดันเจี้ยน ให้ขยับชั้นไปต่อ)
    if (inDungeon && typeof advanceDungeon === 'function') {
      const isBossDefeated = enemy && (enemy.isBoss || enemy.id === inDungeon?.bossId);
      if (!isBossDefeated) advanceDungeon();
    }

    // 🃏 3. Monster Card Creation (สร้างการ์ดมอนสเตอร์ดรอป)
    const monsterCard = { 
      id: `card-${baseMonsterId}`, // ✅ ใช้ ID นิ่งๆ 
      instanceId: `card-${baseMonsterId}`,
      name: `${enemy.name} Card`, 
      type: 'MONSTER_CARD', 
      rarity: enemy.rarity || 'Common',
      isShiny: !!enemy.isShiny 
    };
    
    // 🏆 4. World Boss Multiplier (คำนวณตัวคูณของตามอันดับดาเมจ)
    let rankMultiplier = 1;
    if (enemy.type === 'WORLD_BOSS' && worldEvent) {
      const dealers = worldEvent.damageDealers || {};
      const playerName = player.name || 'Anonymous';
      const sorted = Object.entries(dealers).sort(([, a], [, b]) => b - a);
      const myRank = sorted.findIndex(([name]) => name === playerName) + 1;
      rankMultiplier = myRank === 1 ? 5 : (myRank <= 3 ? 3 : (myRank <= 5 ? 2 : 1));
      setLogs(prev => [`🏆 อันดับดาเมจ: #${myRank || 'N/A'} (Loot x${rankMultiplier})`, ...prev]);
    }

    // 🧹 5. Clean Loot Table (กรองสกิลที่ปลดแล้ว หรือไอเทมที่อยู่ใน Collection แล้วออก)
    const cleanedLootTable = (enemy.lootTable || []).filter(item => {
      if (item.type === 'SKILL' || item.skillId) return !(player.unlockedPassives || []).includes(item.skillId);
      const isBasicMaterial = ['scrap', 'shard', 'dust', 'dragon_soul', 'obsidian_scale'].includes(item.id?.toLowerCase());
      if (item.slot || item.type === 'EQUIPMENT' || item.type === 'MATERIAL' || isBasicMaterial) return true;
      return !(player.collection?.[baseMonsterId] || []).includes(item.name);
    });

    // 🎲 6. Calculate Loot (รันระบบสุ่มของกลาง)
    const { droppedItems, logs: lootLogs } = calculateLoot(cleanedLootTable, player, !!inDungeon ? 1.03 : 1.0, rankMultiplier, enemy);
    
    // 🛡️ 7. Grouping Items (คัดกรองไอเทมซ้ำและรักษารหัส Unique)
    const groupedMap = new Map();
    droppedItems.forEach(item => {
      const isEquipment = item.slot || item.type === 'EQUIPMENT';

      if (isEquipment) {
        // 🔒 สำหรับอุปกรณ์: ใช้ ID เต็มๆ (ที่มี uniqueSuffix) เป็น Key 
        // เพื่อป้องกันดาบ 2 เล่มที่รหัสต่างกันถูกมัดรวมกันจนเกิดอาการไฮไลท์คู่
        groupedMap.set(item.id, { ...item });
      } else {
        // สำหรับของทั่วไป (วัสดุ): ให้ Group ตามชื่อ ID (ตัดรหัสสุ่มออก) เพื่อรวมยอด (Stack)
        const rawId = item.id || item.itemId || (typeof item.name === 'string' ? item.name.toLowerCase() : 'unknown');
        const cleanId = rawId.split('-')[0];
        if (groupedMap.has(cleanId)) {
          groupedMap.get(cleanId).amount += (item.amount || 1);
        } else {
          groupedMap.set(cleanId, { ...item, amount: (item.amount || 1) });
        }
      }
    });

    const finalDrops = Array.from(groupedMap.values()).map(item => {
      // ✅ ส่งค่ากลับไปตรงๆ ไม่ต้องสร้าง Instance ทับ เพราะ lootUtils เจนรหัสและสเตตัสมาดีแล้ว
      return item; 
    });

    // 📝 8. Set Logs & Results
    if (lootLogs.length > 0) setLogs(prev => [...lootLogs, ...prev].slice(0, 15));
    const droppedSkill = finalDrops.find(item => item.type === 'SKILL');
    const filteredItems = finalDrops.filter(item => item.type !== 'SKILL');
    
    setLootResult({ items: filteredItems, skill: droppedSkill || null }); 

    // 💾 9. Update Player State (บันทึกทุกอย่างลงตัวละคร)
    setPlayer(prev => {

      const monsterKills = prev.monsterKills || {};
      const unlockedMasteries = prev.unlockedMasteries || [];
      const permanentElementPower = prev.permanentElementPower || { fire: 0, water: 0, earth: 0, wind: 0, light: 0, dark: 0, poison: 0 };
      const collection = prev.collection || {};

      const newKillCount = (monsterKills[baseMonsterId] || 0) + 1;
      const updatedMonsterKills = { ...monsterKills, [baseMonsterId]: newKillCount };

      let updatedPower = { ...permanentElementPower };
      let updatedUnlockedMasteries = [...unlockedMasteries];

      // เช็คการปลดล็อค Mastery (ฆ่าครบ 100 ตัว)
      const MASTERY_TARGET = 100;
      if (newKillCount === MASTERY_TARGET && !updatedUnlockedMasteries.includes(baseMonsterId)) {
        if (enemy.elementPowerBonus) {
          Object.entries(enemy.elementPowerBonus).forEach(([element, power]) => {
            const elKey = element.toLowerCase();
            if (updatedPower.hasOwnProperty(elKey)) updatedPower[elKey] += power;
          });
          updatedUnlockedMasteries.push(baseMonsterId);
          setLogs(prevLogs => [`⭐ MASTERY ACHIEVED: ${enemy.name}!`, `✨ Permanent ${enemy.element || 'Neutral'} Power UP!`, ...prevLogs]);
        }
      }

      const updatedCollection = { ...collection };
      if (!updatedCollection[baseMonsterId]) updatedCollection[baseMonsterId] = [];


      // 🛡️ 2. ระบบกรอง ID (ประกาศ pendingIds ไว้ตรงนี้เพื่อแก้ Error)
      const newMaterials = { ...(prev.materials || { scrap: 0, shard: 0, dust: 0, dragon_soul: 0, obsidian_scale: 0 }) };
      const currentInventoryIds = new Set((prev.inventory || []).map(i => i.instanceId || i.id));
      const pendingIds = new Set();
      const newInventoryItems = [];
      
      // 🛡️ 3. จัดการ Monster Card (ใช้ ID นิ่งๆ เพื่อกันเบิ้ล)
      const monsterCardId = `card-${baseMonsterId}`; // ID คงที่สำหรับมอนแต่ละชนิด
      if (!currentInventoryIds.has(monsterCardId)) {
        newInventoryItems.push({ ...monsterCard, id: monsterCardId });
        pendingIds.add(monsterCardId);
      }

      finalDrops.forEach(item => {
        // 1. อัปเดตสมุดสะสม (อันนี้ทำเหมือนเดิม)
        if (!(item.slot || item.type === 'EQUIPMENT') && item.type !== 'SKILL' && !updatedCollection[baseMonsterId].includes(item.name)) {
          updatedCollection[baseMonsterId].push(item.name);
        }

        // 2. คัดแยกของลงกระเป๋า
        if (item.type === 'MATERIAL' && newMaterials.hasOwnProperty(item.id)) {
          // ✅ พวกวัสดุ/ขยะ ให้ไปที่ materials (ไม่ลง inventory)
          newMaterials[item.id] += item.amount;
        } 
        else if (item.slot || item.type === 'EQUIPMENT') {
          // 🛡️ เช็คเพิ่ม: ถ้าเป็นพวก COLLECTION_ITEM หรือมี Type อื่นที่ไม่ใช่ของสวมใส่ ห้ามเข้ากระเป๋า
          // ตรวจสอบว่าต้องเป็น "อุปกรณ์สวมใส่จริงๆ" เท่านั้น
          if (item.type === 'MONSTER_CARD' || item.type === 'COLLECTION') return; 

          const itemKey = item.instanceId || item.id;
          if (!currentInventoryIds.has(itemKey) && !pendingIds.has(itemKey)) {
            newInventoryItems.push(item);
            pendingIds.add(itemKey); 
          }
        }
        // ❌ ถ้าหลุดจากเงื่อนไขด้านบน (เช่น เป็นของสะสมทั่วไป) มันจะไม่ถูก push ลง newInventoryItems ครับ
      });

      const nextPassives = [...(prev.unlockedPassives || [])];
      if (droppedSkill?.skillId && !nextPassives.includes(droppedSkill.skillId)) {
        nextPassives.push(droppedSkill.skillId);
      }

      const isCardAlreadyIn = currentInventoryIds.has(monsterCard.id);
      const finalNewItemsToAdd = isCardAlreadyIn ? newInventoryItems : [...newInventoryItems, monsterCard];

      return { 
        ...prev, 
        exp: prev.exp + (enemy.expReward || enemy.exp || 20), 
        inventory: [...(prev.inventory || []), ...finalNewItemsToAdd], 
        materials: newMaterials, 
        collection: updatedCollection, 
        unlockedPassives: nextPassives,
        monsterKills: updatedMonsterKills,
        permanentElementPower: updatedPower,
        unlockedMasteries: updatedUnlockedMasteries
      };
    });
  };

  // ✅ ส่งออกทั้งฟังก์ชันทำงาน และตัวล็อค (isProcessing) เพื่อนำไปปลดล็อคใน startCombat
  return { processVictory, isProcessing };
}