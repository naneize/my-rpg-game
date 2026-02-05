// src/data/monsters/map1_meadow.js
import { itemMaster } from '../itemData';

// ฟังก์ชันช่วยดึงข้อมูลไอเทมจาก itemMaster เพื่อลดความซ้ำซ้อน
const getItemLoot = (itemId, chance) => {
  const baseItem = itemMaster[itemId];
  if (!baseItem) {
    console.warn(`Item ID "${itemId}" not found in itemMaster`);
    return { name: itemId, chance, rarity: "Common", image: "❓" };
  }
  return { 
    ...baseItem, 
    chance,
    type: "MATERIAL" // ระบุว่าเป็นไอเทมวัตถุดิบ
  };
};

export const map1Monsters = [
  // ================= Tier 1: Level 1 =================
  {
    id: 'bug',
    name: "แมลงตัวน้อย",
    area: 'meadow',
    rarity: "Common",
    hp: 30, atk: 6, def: 2, 
    image: "/monsters/red_bug.png",
    skills: [{ name: "Bite", chance: 0.3, condition: "Active", description: "แมลงน้อยกัดเจ็บนะ!" }],
    lootTable: [
      { name: "Bug Carapace Skill", rarity: "Uncommon", skillId: "Bug Carapace", type: "SKILL", chance: 1 }, 
      // --- Items 4 ชิ้นจาก itemMaster ---
      getItemLoot("ปีกแมลงใส", 0.6),
      getItemLoot("หนวดแมลง", 0.5),
      getItemLoot("ปีกแมลงสีรุ้ง", 0.05), // Rare Item
      getItemLoot("ขนนกสีคราม", 0.4)
    ],
    collectionBonus: { def: 1 }
  },

  // ================= Tier 2: Level 1-2 =================
  {
    id: 'capterpillar',
    name: "หนอนน้อยขี้เซา",
    area: 'meadow',
    rarity: "Common",
    hp: 50, atk: 8, def: 4, 
    image: "/monsters/little_worm.png",
    skills: [{ name: "Web Shot", chance: 0.25, condition: "Active", description: "พ่นใยให้ศัตรูช้าลง!" }],
    lootTable: [
      { name: "Caterpillar Silk Skill", rarity: "Uncommon", skillId: "Caterpillar Silk", type: "SKILL", chance: 0.1 },
      // --- Items 4 ชิ้นจาก itemMaster ---
      getItemLoot("ใบไม้ที่ถูกกัด", 0.7),
      getItemLoot("เกราะนิ่มของหนอน", 0.5),
      getItemLoot("สมุนไพรสีเขียว", 0.4),
      getItemLoot("ใบไม้ประกายเงิน", 0.1) // Uncommon Item
    ],
    collectionBonus: { hp: 15 }
  },

  // ================= Tier 3: Level 2 =================
  {
    id: 'grasshopper',
    name: "ตั๊กแตนพริ้วไหว",
    area: 'meadow',
    rarity: "Common",
    hp: 45, atk: 14, def: 2, 
    image: "/monsters/grashopper.png",
    skills: [{ name: "Grasshopper Jump", chance: 0.2, condition: "Active", description: "กระโดดถีบเต็มแรง!" }],
    lootTable: [
      { name: "Grasshopper Jump Skill", rarity: "Uncommon", skillId: "Grasshopper Jump", type: "SKILL", chance: 0.1 },
      // --- Items 4 ชิ้นจาก itemMaster ---
      getItemLoot("ขาตั๊กแตน", 0.6),
      getItemLoot("ขนนกสีคราม", 0.5),
      getItemLoot("หูแมลงนำโชค", 0.2),
      getItemLoot("ขาตั๊กแตนทองคำ", 0.02) // Rare Item
    ],
    collectionBonus: { luck: 1 }
  },

  // ================= Tier 4: Level 3 =================
  {
    id: 'slime',
    name: "สไลม์ทุ่งหญ้า",
    area: 'meadow',
    rarity: "Uncommon",
    hp: 75, atk: 12, def: 6, 
    image: "/monsters/slime.png",
    skills: [{ name: "Jump Attack", chance: 0.3, condition: "Active", description: "กระโดดทับด้วยน้ำหนักตัว!" }],
    lootTable: [
      { name: "Slime Recovery Skill", rarity: "Uncommon", skillId: "Slime Recovery", type: "SKILL", chance: 0.1 },
      // --- Items 4 ชิ้นจาก itemMaster ---
      getItemLoot("เมือกเหลว", 0.7),
      getItemLoot("แกนสไลม์ใส", 0.2),
      getItemLoot("สมุนไพรสีเขียว", 0.5),
      getItemLoot("เมือกสไลม์เข้มข้น", 0.3)
    ],
    collectionBonus: { hp: 25 }
  },

  // ================= Tier 5: WORLD BOSS =================
  {
    id: 'meadow_queen_bee',
    name: "👑 ราชินีผึ้งทองคำ",
    area: 'meadow',
    rarity: "Legendary",
    isBoss: true,
    hp: 1500, maxHp: 1500, atk: 45, def: 25, exp: 500, gold: 300,
    image: "/monsters/Queen_bee.png",
    skills: [
      { name: "Royal Stinger", chance: 0.3, condition: "Active", description: "เหล็กในพิษแห่งราชวงศ์!" },
      { name: "Bee Swarm", chance: 1.0, condition: "Special", description: "เรียกกองทัพผึ้งมารุมล้อม!" }
    ],
    lootTable: [
      { name: "Aura Skill", rarity: "Legendary", skillId: "Aura", type: "SKILL", chance: 0.01 }, 
      // --- Items 4 ชิ้นจาก itemMaster ---
      getItemLoot("เหรียญก๊อบลินทองคำ", 0.1), // สมมติว่าราชินีสะสมเหรียญทอง
      getItemLoot("ดาบสั้นสังหารยักษ์", 0.05),
      getItemLoot("เศษทองชุบเยลลี่", 0.4),
      getItemLoot("สมุนไพรสีทอง", 0.3)
    ],
    collectionBonus: { atk: 10, luck: 2 } 
  },
];