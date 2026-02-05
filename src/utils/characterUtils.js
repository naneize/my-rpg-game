import { COLLECTION_TITLES } from '../data/collectionTitles';

/**
 * 🛡️ getPassiveBonus: คำนวณค่า Bonus รวมจาก Passive Skills
 * ✅ เพิ่มการรองรับ reflectDamage (สะท้อนดาเมจ)
 */


export const getPassiveBonus = (equippedPassives, allSkills) => {
  // เพิ่ม reflectDamage เข้าไปใน object เริ่มต้น
  let bonus = { atk: 0, def: 0, hp: 0, dropRate: 0, reflectDamage: 0 };
  
  if (!equippedPassives || !allSkills) return bonus;

  equippedPassives.forEach(skillId => {
    const skill = allSkills.find(s => s.id === skillId);
    if (skill) {
      if (skill.bonusAtk) bonus.atk += skill.bonusAtk;
      if (skill.bonusDef) bonus.def += skill.bonusDef;
      if (skill.bonusHp) bonus.hp += skill.bonusHp;
      
      // ✅ ดึงค่าสะท้อนดาเมจจากข้อมูลสกิล (เช่น 0.03)
      if (skill.reflectDamage) bonus.reflectDamage += skill.reflectDamage;
    }
  });

  return bonus;
};

/**
 * 📊 calculateBaseStats: คำนวณ Stat พื้นฐานตาม Level (คงเดิม 100%)
 */
export const calculateBaseStats = (player) => {
  const level = player.level || 1;
  return {
    hp: 100 + (level * 10),
    atk: 10 + (level * 2),
    def: 5 + Math.floor(level / 2)
  };
};

/**
 * 🏆 calculateCollectionScore: (คงเดิม 100%)
 */
export const calculateCollectionScore = (inventory) => {
  if (!inventory || !Array.isArray(inventory)) return 0;

  const rarityPoints = {
    'Common': 1,
    'Uncommon': 5,
    'Rare': 10,
    'Epic': 15,
    'Legendary': 20
  };

  return inventory.reduce((total, item) => {
    const points = rarityPoints[item.rarity] || 0;
    return total + points;
  }, 0);
};

/**
 * 🎖️ getCollectionTitle: (คงเดิม 100%)
 */
export const getCollectionTitle = (score) => {
  const title = COLLECTION_TITLES.find(t => score >= t.minScore) || COLLECTION_TITLES[COLLECTION_TITLES.length - 1];
  
  return {
    name: title.name,
    color: title.color
  };
};

/**
 * 📦 calculateCollectionBonuses: คำนวณโบนัสจากการสะสมไอเทมครบเซต (คงเดิม 100%)
 */
export const calculateCollectionBonuses = (collection, allMonsters) => {
  const totals = { atk: 0, def: 0, hp: 0, luck: 0 };

  if (!collection || !allMonsters || !Array.isArray(allMonsters)) return totals;

  allMonsters.forEach(monster => {
    if (monster.lootTable && monster.collectionBonus) {
      const ownedItemsForThisMonster = collection[monster.id] || [];

      const isSetComplete = monster.lootTable.every(loot => 
        ownedItemsForThisMonster.includes(loot.name)
      );

      if (isSetComplete) {
        if (monster.collectionBonus.atk) totals.atk += monster.collectionBonus.atk;
        if (monster.collectionBonus.def) totals.def += monster.collectionBonus.def;
        if (monster.collectionBonus.hp) totals.hp += monster.collectionBonus.hp;
        if (monster.collectionBonus.luck) totals.luck += monster.collectionBonus.luck;
      }
    }
  });

  return totals;
};