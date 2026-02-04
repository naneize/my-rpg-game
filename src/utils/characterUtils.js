import { COLLECTION_TITLES } from '../data/collectionTitles';

/**
 * 🛡️ getPassiveBonus: คำนวณค่า Bonus รวมจาก Passive Skills (โค้ดเดิมของคุณ)
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
 * 📊 calculateBaseStats: คำนวณ Stat พื้นฐานตาม Level (โค้ดเดิมของคุณ)
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
 * 🏆 calculateCollectionScore: [เพิ่มใหม่เพื่อแก้ Error]
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
 * 🎖️ getCollectionTitle: คำนวณฉายาตามคะแนนสะสม (โค้ดเดิมของคุณ)
 */
export const getCollectionTitle = (score) => {
  const title = COLLECTION_TITLES.find(t => score >= t.minScore) || COLLECTION_TITLES[COLLECTION_TITLES.length - 1];
  
  return {
    name: title.name,
    color: title.color
  };
};

/**
 * 📦 calculateCollectionBonuses: [ส่วนที่เพิ่มใหม่ล่าสุด]
 * คำนวณสเตตัสโบนัสจากการสะสม Artifact มอนสเตอร์ครบเซต 4 ชิ้น
 * ✅ ปรับสมดุลใหม่: ถ้ามีการ์ด Shiny ของมอนสเตอร์ตัวนั้น สเตตัสโบนัสจะคูณ 2 เท่า!
 */
export const calculateCollectionBonuses = (inventory, allMonsters) => {
  const totals = { atk: 0, def: 0, hp: 0, luck: 0 };

  if (!inventory || !allMonsters) return totals;

  allMonsters.forEach(monster => {
    // เช็คว่ามี lootTable และมีโบนัสกำหนดไว้หรือไม่
    if (monster.lootTable && monster.collectionBonus) {
      
      // 1. ตรวจสอบว่าไอเทมใน inventory ครบตาม lootTable ทุกชิ้นไหม (Artifact Set)
      const isSetComplete = monster.lootTable.every(loot => 
        inventory.some(invItem => invItem.name === loot.name)
      );

      // 2. ตรวจสอบว่ามีการ์ด Shiny ของมอนสเตอร์ตัวนี้อยู่ในกระเป๋าไหม
      const hasShinyCard = inventory.some(item => 
        item.type === 'MONSTER_CARD' && 
        item.monsterId === monster.id && 
        item.isShiny === true
      );

      // 3. ถ้าสะสม Artifact ครบเซต ให้บวกสเตตัส
      if (isSetComplete) {
        // ✨ ปรับลดเหลือคูณ 2 เท่า เพื่อให้เกมไม่ขาดสมดุลจนเกินไปจ่ะ
        const multiplier = hasShinyCard ? 2 : 1;

        if (monster.collectionBonus.atk) totals.atk += (monster.collectionBonus.atk * multiplier);
        if (monster.collectionBonus.def) totals.def += (monster.collectionBonus.def * multiplier);
        if (monster.collectionBonus.hp) totals.hp += (monster.collectionBonus.hp * multiplier);
        if (monster.collectionBonus.luck) totals.luck += (monster.collectionBonus.luck * multiplier);
      }
    }
  });

  return totals;
};