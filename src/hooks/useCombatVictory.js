import React from 'react';
import { calculateLoot } from '../utils/lootUtils';
// import { createDropItem } from '../utils/inventoryUtils'; // ไม่ได้ใช้ในหน้านี้แล้ว

/**
 * Hook สำหรับจัดการระบบชัยชนะและการดรอปไอเทม - เวอร์ชัน INFINITY MASTERY
 */
export function useCombatVictory(player, setPlayer, setLogs, setLootResult, setCombatPhase) {
  
  const isProcessing = React.useRef(false);

  const processVictory = (enemy, inDungeon, advanceDungeon, worldEvent) => {
    
    if (isProcessing.current || !enemy) return; 

    isProcessing.current = true;
    setCombatPhase('VICTORY');

    const rawId = enemy.baseId || enemy.id || (enemy.name ? enemy.name.toLowerCase().replace(/\s+/g, '_') : 'unknown');
    const baseMonsterId = rawId.replace('_shiny', '');

    // 🏰 Dungeon Advance
    if (inDungeon && typeof advanceDungeon === 'function') {
      const isBossDefeated = enemy && (enemy.isBoss || enemy.id === inDungeon?.bossId);
      if (!isBossDefeated) advanceDungeon();
    }

    // 🃏 Monster Card Creation
    const monsterCard = { 
      id: `card-${baseMonsterId}`, 
      instanceId: `card-${baseMonsterId}`,
      name: `${enemy.name} Card`, 
      type: 'MONSTER_CARD', 
      rarity: enemy.rarity || 'Common',
      isShiny: !!enemy.isShiny 
    };
    
    // 🏆 World Boss Multiplier
    let rankMultiplier = 1;
    if (enemy.type === 'WORLD_BOSS' && worldEvent) {
      const dealers = worldEvent.damageDealers || {};
      const playerName = player.name || 'Anonymous';
      const sorted = Object.entries(dealers).sort(([, a], [, b]) => b - a);
      const myRank = sorted.findIndex(([name]) => name === playerName) + 1;
      rankMultiplier = myRank === 1 ? 5 : (myRank <= 3 ? 3 : (myRank <= 5 ? 2 : 1));
      setLogs(prev => [`🏆 อันดับดาเมจ: #${myRank || 'N/A'} (Loot x${rankMultiplier})`, ...prev]);
    }

    // 🧹 Clean Loot Table
    const cleanedLootTable = (enemy.lootTable || []).filter(item => {
      if (item.type === 'SKILL' || item.skillId) return !(player.unlockedPassives || []).includes(item.skillId);
      const isBasicMaterial = ['scrap', 'shard', 'dust', 'dragon_soul', 'obsidian_scale'].includes(item.id?.toLowerCase());
      if (item.slot || item.type === 'EQUIPMENT' || item.type === 'MATERIAL' || isBasicMaterial) return true;
      return !(player.collection?.[baseMonsterId] || []).includes(item.name);
    });

    const { droppedItems, logs: lootLogs } = calculateLoot(cleanedLootTable, player, !!inDungeon ? 1.03 : 1.0, rankMultiplier, enemy);
    
    const groupedMap = new Map();
    droppedItems.forEach(item => {
      const isEquipment = item.slot || item.type === 'EQUIPMENT';
      if (isEquipment) {
        groupedMap.set(item.id, { ...item });
      } else {
        const rawId = item.id || item.itemId || (typeof item.name === 'string' ? item.name.toLowerCase() : 'unknown');
        const cleanId = rawId.split('-')[0];
        if (groupedMap.has(cleanId)) {
      // ✅ ดึงค่าเดิมออกมา แล้วสร้าง Object ใหม่ที่มี amount เพิ่มขึ้น
      const existing = groupedMap.get(cleanId);
      groupedMap.set(cleanId, { 
        ...existing, 
        amount: (existing.amount || 0) + (item.amount || 1) 
      });
    } else {
      // ✅ สร้าง Object ใหม่ตั้งแต่อันแรก
      groupedMap.set(cleanId, { ...item, amount: (item.amount || 1) });
    }
      }
    });

    const finalDrops = Array.from(groupedMap.values());
    if (lootLogs.length > 0) setLogs(prev => [...lootLogs, ...prev].slice(0, 15));
    const droppedSkill = finalDrops.find(item => item.type === 'SKILL');
    const filteredItems = finalDrops.filter(item => item.type !== 'SKILL');
    
    setLootResult({ items: filteredItems, skill: droppedSkill || null }); 

    // 💾 UPDATE PLAYER STATE (INFINITY LOGIC)
    setPlayer(prev => {
      const element = (enemy.element || 'fire').toLowerCase();
      
      // 1. ดึงข้อมูลระบบ Mastery แบบใหม่ (Infinity)
      const mastery = prev.elementalMastery[element] || { level: 1, kills: 0, totalKills: 0 };
      let newKills = mastery.kills + 1;
      let newLevel = mastery.level;
      let newTotalKills = mastery.totalKills + 1;
      let newPermanentPower = { ...(prev.permanentElementPower || {}) };

      // 🎯 Milestone: อัปเลเวลทุก 100 ตัว
      if (newKills >= 100) {
        newKills = 0;
        newLevel += 1;
        
        // 📈 Infinity Power Formula: เลเวลยิ่งสูง ยิ่งบวกเยอะ
        const powerGain = newLevel * 10; 
        newPermanentPower[element] = (newPermanentPower[element] || 0) + powerGain;

        setLogs(prevLogs => [
          `✨ [SYSTEM] ${element.toUpperCase()} Mastery Reached LV.${newLevel}!`,
          `🔥 Permanent Atk increased by ${powerGain}!`,
          ...prevLogs
        ]);
      }

      // 2. ข้อมูลอื่นๆ (Materials, Collection, Inventory)
      const newMaterials = { ...(prev.materials || {}) };
      const currentInventoryIds = new Set((prev.inventory || []).map(i => i.instanceId || i.id));
      const pendingIds = new Set();
      const newInventoryItems = [];
      const newCollectionCards = [];
      const updatedCollection = { ...prev.collection };
      if (!updatedCollection[baseMonsterId]) updatedCollection[baseMonsterId] = [];

      finalDrops.forEach(item => {

        if (!(item.slot || item.type === 'EQUIPMENT') && item.type !== 'SKILL' && !updatedCollection[baseMonsterId].includes(item.name)) {
          updatedCollection[baseMonsterId].push(item.name);
        }

        const isCollection = item.type === 'MONSTER_CARD' || item.type === 'ARTIFACT';

        if (isCollection) {
          newCollectionCards.push(item); // 👾 โยนเข้าถังของสะสม
          return; // จบงานสำหรับไอเทมชิ้นนี้ ไม่ต้องไปเช็คเงื่อนไขอื่นต่อ
        }

        // จัดการ Materials
        if (item.type === 'MATERIAL' && newMaterials.hasOwnProperty(item.id)) {
          newMaterials[item.id] += (item.amount || 1);


        } 
        // 🛡️ จัดการ Equipment
        if (item.slot || item.type === 'EQUIPMENT') {
          // ถ้าเป็นพวกการ์ดมอนสเตอร์ที่หลุดมาจากการสุ่ม ให้แยกไปถังการ์ด
          if (item.type === 'MONSTER_CARD') {
            newCollectionCards.push(item);
            return;
          }

          // ✅ เพิ่มส่วนนี้: ตรวจสอบและเพิ่มเข้า Inventory ปกติ
          const itemKey = item.instanceId || item.id;
          if (!currentInventoryIds.has(itemKey) && !pendingIds.has(itemKey)) {
            newInventoryItems.push(item);
            pendingIds.add(itemKey); 
          }
        }

        }
      );

      // --- 🃏 จัดการการ์ดมอนสเตอร์ (ครั้งแรกที่ได้รับ) ---
      // เช็คว่าในกระเป๋า (หรือถังการ์ดเดิม) มีการ์ดตัวนี้หรือยัง
      const hasCard = (prev.collectionItems || []).some(c => c.id === `card-${baseMonsterId}`);
      if (!hasCard) {
        newCollectionCards.push(monsterCard);
      }

      // ตรวจสอบการเพิ่ม Card (ครั้งแรกเท่านั้น)
      if (!currentInventoryIds.has(`card-${baseMonsterId}`)) {
        newInventoryItems.push(monsterCard);
      }

      const nextPassives = [...(prev.unlockedPassives || [])];
      if (droppedSkill?.skillId && !nextPassives.includes(droppedSkill.skillId)) {
        nextPassives.push(droppedSkill.skillId);
      }

      return { 
        ...prev, 
        exp: prev.exp + (enemy.expReward || enemy.exp || 20), 

        totalSteps: (prev.totalSteps || 0) + 1, // นับก้าวสะสม

        inventory: [...(prev.inventory || []), ...newInventoryItems], 

        collectionItems: [...(prev.collectionItems || []), ...newCollectionCards],

        materials: newMaterials, 
        collection: updatedCollection, 
        unlockedPassives: nextPassives,
        monsterKills: { ...prev.monsterKills, [baseMonsterId]: (prev.monsterKills[baseMonsterId] || 0) + 1 },
        // ✅ บันทึกค่า Mastery ใหม่
        elementalMastery: {
          ...prev.elementalMastery,
          [element]: { level: newLevel, kills: newKills, totalKills: newTotalKills }
        },
        permanentElementPower: newPermanentPower
      };
    });
  };

  return { processVictory, isProcessing };
}