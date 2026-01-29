/**
 * 🛡️ getPassiveBonus: คำนวณค่า Bonus รวมจาก Passive Skills (โค้ดเดิมของคุณ)
 */
import { COLLECTION_TITLES } from '../data/collectionTitles';


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

export const getCollectionTitle = (score) => {
  // ค้นหาฉายาแรกที่คะแนนของผู้เล่นถึงเกณฑ์ (เนื่องจากเราเรียงจากมากไปน้อยไว้แล้ว)
  const title = COLLECTION_TITLES.find(t => score >= t.minScore) || COLLECTION_TITLES[COLLECTION_TITLES.length - 1];
  
  return {
    name: title.name,
    color: title.color
  };
};