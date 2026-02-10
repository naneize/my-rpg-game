import { COLLECTION_TITLES } from '../data/collectionTitles';

/**
 * 🛡️ getPassiveBonus: คำนวณค่า Bonus รวมจาก Passive Skills
 * ✅ เพิ่มการรองรับ reflectDamage (สะท้อนดาเมจ)
 * ✅ แก้ไขให้รองรับทั้ง bonusHp และ bonusMaxHp
 */
export const getPassiveBonus = (equippedPassives, allSkills) => {
  // เพิ่ม reflectDamage เข้าไปใน object เริ่มต้น
  let bonus = { atk: 0, def: 0, hp: 0, dropRate: 0, reflectDamage: 0 };

  const skillsList = Array.isArray(allSkills) ? allSkills : Object.values(allSkills || {});
  
  if (!equippedPassives || !skillsList || skillsList.length === 0) {
    return bonus;
  }

  equippedPassives.forEach(skillId => {
    // เปลี่ยนจาก allSkills มาใช้ skillsList ที่เราเตรียมไว้
    const skill = skillsList.find(s => s.id === skillId);
    if (skill) {
      if (skill.bonusAtk) bonus.atk += skill.bonusAtk;
      if (skill.bonusDef) bonus.def += skill.bonusDef;
      
      // ✅ แก้ไขจุดนี้: ให้บวกได้ทั้งกรณีที่ตั้งชื่อ key ว่า bonusHp หรือ bonusMaxHp
      const hpValue = skill.bonusHp || skill.bonusMaxHp || 0;
      bonus.hp += hpValue;

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
  // ดักจับเลเวล ถ้าไม่มีให้เป็น 1
  const level = player?.level || 1; 

  return {
    // Level 1: 100 + (0) = 100
    // Level 2: 100 + (10) = 110
    hp: 100 + ((level - 1) * 10), 
    atk: 10 + ((level - 1) * 2),
    def: 5 + Math.floor((level - 1) / 2)
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