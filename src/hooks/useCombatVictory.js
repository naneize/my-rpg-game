import React from 'react';
import { calculateLoot } from '../utils/lootUtils';

/**
 * Hook สำหรับจัดการระบบชัยชนะและการดรอปไอเทม - เวอร์ชัน INFINITY MASTERY + Damage Analytics
 */
export function useCombatVictory(player, setPlayer, setLogs, setLootResult, setCombatPhase) {
  
  const isProcessing = React.useRef(false);

  // ✅ เพิ่ม analytics = {} เพื่อรับค่าดาเมจสะสมจาก useCombat
  const processVictory = (enemy, inDungeon, advanceDungeon, worldEvent, analytics = {}) => {
    
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
          const existing = groupedMap.get(cleanId);
          groupedMap.set(cleanId, { 
            ...existing, 
            amount: (existing.amount || 0) + (item.amount || 1) 
          });
        } else {
          groupedMap.set(cleanId, { ...item, amount: (item.amount || 1) });
        }
      }
    });

    const finalDrops = Array.from(groupedMap.values());
    if (lootLogs.length > 0) setLogs(prev => [...lootLogs, ...prev].slice(0, 15));
    const droppedSkill = finalDrops.find(item => item.type === 'SKILL');
    const filteredItems = finalDrops.filter(item => item.type !== 'SKILL');
    
    // ✅ อัปเดต: ส่งข้อมูลดาเมจเข้าไปใน Loot Result เพื่อให้ Modal นำไปแสดงผล
    setLootResult({ 
      items: filteredItems, 
      skill: droppedSkill || null,
      totalDamageDealt: analytics.totalDamageDealt || 0,
      attackDamageDealt: analytics.attackDamageDealt || 0,
      skillDamageDealt: analytics.skillDamageDealt || 0
    }); 

    // 💾 UPDATE PLAYER STATE (INFINITY LOGIC)
    setPlayer(prev => {
      const element = (enemy.element || 'fire').toLowerCase();
      
      const mastery = prev.elementalMastery[element] || { level: 1, kills: 0, totalKills: 0 };
      let newKills = mastery.kills + 1;
      let newLevel = mastery.level;
      let newTotalKills = mastery.totalKills + 1;
      let newPermanentPower = { ...(prev.permanentElementPower || {}) };

      if (newKills >= 100) {
        newKills = 0;
        newLevel += 1;
        const powerGain = newLevel * 10; 
        newPermanentPower[element] = (newPermanentPower[element] || 0) + powerGain;

        setLogs(prevLogs => [
          `✨ [SYSTEM] ${element.toUpperCase()} Mastery Reached LV.${newLevel}!`,
          `🔥 Permanent Atk increased by ${powerGain}!`,
          ...prevLogs
        ]);
      }

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
          newCollectionCards.push(item); 
          return; 
        }

        if (item.type === 'MATERIAL' && newMaterials.hasOwnProperty(item.id)) {
          newMaterials[item.id] += (item.amount || 1);
        } 
        
        if (item.slot || item.type === 'EQUIPMENT') {
          if (item.type === 'MONSTER_CARD') {
            newCollectionCards.push(item);
            return;
          }
          const itemKey = item.instanceId || item.id;
          if (!currentInventoryIds.has(itemKey) && !pendingIds.has(itemKey)) {
            newInventoryItems.push(item);
            pendingIds.add(itemKey); 
          }
        }
      });

      const hasCard = (prev.collectionItems || []).some(c => c.id === `card-${baseMonsterId}`);
      if (!hasCard) {
        newCollectionCards.push(monsterCard);
      }

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
        totalSteps: (prev.totalSteps || 0) + 1,
        inventory: [...(prev.inventory || []), ...newInventoryItems], 
        collectionItems: [...(prev.collectionItems || []), ...newCollectionCards],
        materials: newMaterials, 
        collection: updatedCollection, 
        unlockedPassives: nextPassives,
        monsterKills: { ...prev.monsterKills, [baseMonsterId]: (prev.monsterKills[baseMonsterId] || 0) + 1 },
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