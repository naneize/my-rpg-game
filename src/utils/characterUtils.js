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
      // ✅ แก้ให้ตรงกับชื่อตัวแปรใน MONSTER_SKILLS ของตัวเอง
      if (skill.bonusAtk) bonus.atk += skill.bonusAtk;
      if (skill.bonusDef) bonus.def += skill.bonusDef;
      if (skill.bonusHp) bonus.hp += skill.bonusHp; // ถ้ามี HP ด้วย
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
 * ฟังก์ชันนี้จำเป็นมากสำหรับหน้า CharacterView.jsx
 */
export const calculateCollectionScore = (inventory) => {
  if (!inventory || !Array.isArray(inventory)) return 0;

  // กำหนดคะแนนตามระดับ Rarity
  const rarityPoints = {
    'Common': 1,
    'Uncommon': 5,
    'Rare': 10,
    'Epic': 15,
    'Legendary': 20
  };

  // รวมคะแนนจากไอเทมทุกชิ้นในกระเป๋า
  return inventory.reduce((total, item) => {
    // หาคะแนนจาก rarity ของไอเทมชิ้นนั้น ถ้าไม่ระบุให้เป็น 0
    const points = rarityPoints[item.rarity] || 0;
    return total + points;
  }, 0);
};

/**
 * 🎖️ getCollectionTitle: คำนวณฉายาตามคะแนนสะสม (โค้ดเดิมของคุณ)
 */
export const getCollectionTitle = (score) => {
  // ค้นหาฉายาแรกที่คะแนนของผู้เล่นถึงเกณฑ์ (เนื่องจากเราเรียงจากมากไปน้อยไว้แล้ว)
  const title = COLLECTION_TITLES.find(t => score >= t.minScore) || COLLECTION_TITLES[COLLECTION_TITLES.length - 1];
  
  return {
    name: title.name,
    color: title.color
  };
};

/**
 * 📦 calculateCollectionBonuses: [ส่วนที่เพิ่มใหม่ล่าสุด]
 * คำนวณสเตตัสโบนัสจากการสะสม Artifact มอนสเตอร์ครบเซต 4 ชิ้น
 * ใช้สำหรับนำไปบวกเพิ่มใน finalStats เพื่อให้ผู้เล่นเก่งขึ้นจริงถาวร
 */
export const calculateCollectionBonuses = (inventory, allMonsters) => {
  const totals = { atk: 0, def: 0, hp: 0, luck: 0 };

  if (!inventory || !allMonsters) return totals;

  allMonsters.forEach(monster => {
    // เช็คว่ามี lootTable และมีโบนัสกำหนดไว้หรือไม่
    if (monster.lootTable && monster.collectionBonus) {
      // ตรวจสอบว่าไอเทมใน inventory ครบตาม lootTable ทุกชิ้นไหม
      const isSetComplete = monster.lootTable.every(loot => 
        inventory.some(invItem => invItem.name === loot.name)
      );

      // ถ้าสะสมครบเซต ให้บวกสเตตัสเพิ่มตามที่มอนสเตอร์ตัวนั้นกำหนด
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