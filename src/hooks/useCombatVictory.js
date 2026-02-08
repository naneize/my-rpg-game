import { calculateLoot } from '../utils/lootUtils';
import { createDropItem } from '../utils/inventoryUtils';

export function useCombatVictory(player, setPlayer, setLogs, setLootResult, setCombatPhase) {
  const processVictory = (enemy, inDungeon, advanceDungeon, worldEvent) => {
    setCombatPhase('VICTORY');

    // 🔍 1. Precise ID Extraction (แก้จุดที่ฆ่าแล้วไม่นับ)
    // เช็คทุกช่องทาง: baseId > id > name (ทำเป็น id format)
    const rawId = enemy.baseId || enemy.id || (enemy.name ? enemy.name.toLowerCase().replace(/\s+/g, '_') : 'unknown');
    const baseMonsterId = rawId.replace('_shiny', '');

    console.log("⚔️ VICTORY DEBUG:", { 
      receivedId: enemy.id, 
      finalBaseId: baseMonsterId,
      hasPowerBonus: !!enemy.elementPowerBonus 
    });

    if (inDungeon && typeof advanceDungeon === 'function') {
      const isBossDefeated = enemy && (enemy.isBoss || enemy.id === inDungeon?.bossId);
      if (!isBossDefeated) advanceDungeon();
    }

    const monsterCard = { 
      id: `card-${enemy.id || baseMonsterId}-${Date.now()}`, 
      monsterId: enemy.id || baseMonsterId, 
      name: enemy.name, 
      type: 'MONSTER_CARD', 
      rarity: enemy.rarity, 
      isShiny: enemy.isShiny || false 
    };
    
    let rankMultiplier = 1;
    if (enemy.type === 'WORLD_BOSS' && worldEvent) {
      const dealers = worldEvent.damageDealers || {};
      const playerName = player.name || 'Anonymous';
      const sorted = Object.entries(dealers).sort(([, a], [, b]) => b - a);
      const myRank = sorted.findIndex(([name]) => name === playerName) + 1;
      rankMultiplier = myRank === 1 ? 5 : (myRank <= 3 ? 3 : (myRank <= 5 ? 2 : 1));
      setLogs(prev => [`🏆 อันดับดาเมจ: #${myRank || 'N/A'} (Loot x${rankMultiplier})`, ...prev]);
    }

    const cleanedLootTable = (enemy.lootTable || []).filter(item => {
      if (item.type === 'SKILL' || item.skillId) return !(player.unlockedPassives || []).includes(item.skillId);
      const isBasicMaterial = ['scrap', 'shard', 'dust', 'dragon_soul', 'obsidian_scale'].includes(item.id?.toLowerCase());
      if (item.slot || item.type === 'EQUIPMENT' || item.type === 'MATERIAL' || isBasicMaterial) return true;
      return !(player.collection?.[baseMonsterId] || []).includes(item.name);
    });

    const { droppedItems, logs: lootLogs } = calculateLoot(cleanedLootTable, player, !!inDungeon ? 1.03 : 1.0, rankMultiplier);
    
    const groupedMap = new Map();
    droppedItems.forEach(item => {
      const rawId = item.id || item.itemId || (typeof item.name === 'string' ? item.name.toLowerCase() : 'unknown');
      const cleanId = rawId.split('-')[0];
      if (groupedMap.has(cleanId)) {
        groupedMap.get(cleanId).amount += (item.amount || 1);
      } else {
        groupedMap.set(cleanId, { ...item, id: cleanId, amount: (item.amount || 1) });
      }
    });

    const finalDrops = Array.from(groupedMap.values()).map(item => {
      if (item.slot || item.type === 'EQUIPMENT') {
        const instance = createDropItem(item.id);
        return { ...instance, id: item.id, itemId: item.id, amount: item.amount };
      }
      return item;
    });

    if (lootLogs.length > 0) setLogs(prev => [...lootLogs, ...prev].slice(0, 15));
    const droppedSkill = finalDrops.find(item => item.type === 'SKILL');
    const filteredItems = finalDrops.filter(item => item.type !== 'SKILL');
    
    setLootResult({ items: filteredItems, skill: droppedSkill || null }); 

    setPlayer(prev => {
      // 🛡️ Safety Initialization
      const monsterKills = prev.monsterKills || {};
      const unlockedMasteries = prev.unlockedMasteries || [];
      const permanentElementPower = prev.permanentElementPower || { fire: 0, water: 0, earth: 0, wind: 0, light: 0, dark: 0, poison: 0 };
      const collection = prev.collection || {};

      // 1. Updated Kill Count
      const newKillCount = (monsterKills[baseMonsterId] || 0) + 1;
      const updatedMonsterKills = { ...monsterKills, [baseMonsterId]: newKillCount };

      // 2. Mastery Milestone Check
      let updatedPower = { ...permanentElementPower };
      let updatedUnlockedMasteries = [...unlockedMasteries];

      const MASTERY_TARGET = 100;
      if (newKillCount === MASTERY_TARGET && !updatedUnlockedMasteries.includes(baseMonsterId)) {
        if (enemy.elementPowerBonus) {
          Object.entries(enemy.elementPowerBonus).forEach(([element, power]) => {
            const elKey = element.toLowerCase();
            if (updatedPower.hasOwnProperty(elKey)) {
              updatedPower[elKey] += power;
            }
          });
          updatedUnlockedMasteries.push(baseMonsterId);
          setLogs(prevLogs => [`⭐ MASTERY ACHIEVED: ${enemy.name}!`, `✨ Permanent ${enemy.element || 'Neutral'} Power UP!`, ...prevLogs]);
        }
      }

      // 3. Collection & Materials
      const updatedCollection = { ...collection };
      if (!updatedCollection[baseMonsterId]) updatedCollection[baseMonsterId] = [];
      
      const newMaterials = { ...(prev.materials || { scrap: 0, shard: 0, dust: 0, dragon_soul: 0, obsidian_scale: 0 }) };
      const newInventoryItems = [];

      finalDrops.forEach(item => {
        if (!(item.slot || item.type === 'EQUIPMENT') && item.type !== 'SKILL' && !updatedCollection[baseMonsterId].includes(item.name)) {
          updatedCollection[baseMonsterId].push(item.name);
        }
        if (item.type === 'MATERIAL' && newMaterials.hasOwnProperty(item.id)) {
          newMaterials[item.id] += item.amount;
        } else if (item.type !== 'SKILL') {
          newInventoryItems.push(item);
        }
      });

      const nextPassives = [...(prev.unlockedPassives || [])];
      if (droppedSkill?.skillId && !nextPassives.includes(droppedSkill.skillId)) {
        nextPassives.push(droppedSkill.skillId);
      }

      // ✅ Final Return Object
      return { 
        ...prev, 
        exp: prev.exp + (enemy.expReward || enemy.exp || 20), 
        inventory: [...(prev.inventory || []), ...newInventoryItems, monsterCard], 
        materials: newMaterials, 
        collection: updatedCollection, 
        unlockedPassives: nextPassives,
        monsterKills: updatedMonsterKills, // อัปเดตตัวเลขฆ่า
        permanentElementPower: updatedPower, // อัปเดตพลังธาตุ
        unlockedMasteries: updatedUnlockedMasteries // บันทึกประวัติ Mastery
      };
    });
  };

  return { processVictory };
}