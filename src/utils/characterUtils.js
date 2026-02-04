import { COLLECTION_TITLES } from '../data/collectionTitles';

/**
 * 🛡️ getPassiveBonus: คำนวณค่า Bonus รวมจาก Passive Skills (คงเดิม 100%)
 */
export const getPassiveBonus = (equippedPassives, allSkills) => {
  let bonus = { atk: 0, def: 0, hp: 0, dropRate: 0 };
  
  if (!equippedPassives || !allSkills) return bonus;

  equippedPassives.forEach(skillId => {
    const skill = allSkills.find(s => s.id === skillId);
    if (skill) {
      if (skill.bonusAtk) bonus.atk += skill.bonusAtk;
      if (skill.bonusDef) bonus.def += skill.bonusDef;
      if (skill.bonusHp) bonus.hp += skill.bonusHp;
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
 * 📦 calculateCollectionBonuses: คำนวณโบนัสจากการสะสมไอเทมครบเซต
 * ✅ แก้ไขเพื่อให้เช็คข้อมูลจาก collection object ได้แม่นยำ
 */
export const calculateCollectionBonuses = (collection, allMonsters) => {
  const totals = { atk: 0, def: 0, hp: 0, luck: 0 };

  // ตรวจสอบความพร้อมของข้อมูล ถ้าไม่มีข้อมูลให้คืนค่า 0 ทันที
  if (!collection || !allMonsters || !Array.isArray(allMonsters)) return totals;

  allMonsters.forEach(monster => {
    // ตรวจสอบว่ามอนสเตอร์มี LootTable และมีค่าโบนัสระบุไว้
    if (monster.lootTable && monster.collectionBonus) {
      
      // 1. ดึงรายการไอเทมที่สะสมได้ "เฉพาะจาก ID มอนสเตอร์ตัวนี้"
      // ข้อมูลในถัง collection จะถูกเก็บในรูปแบบ { monster_id: ["item1", "item2"] }
      const ownedItemsForThisMonster = collection[monster.id] || [];

      // 2. ตรวจสอบว่าไอเทมที่ต้องการใน lootTable มีอยู่ใน ownedItems หรือไม่
      // ใช้ .every เพื่อให้มั่นใจว่าต้องมี "ครบทุกชิ้น" ถึงจะได้โบนัส
      const isSetComplete = monster.lootTable.every(loot => 
        ownedItemsForThisMonster.includes(loot.name)
      );

      // 3. ถ้าสะสมครบเซต ให้บวกสเตตัสเข้ากับผลรวมทั้งหมด
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