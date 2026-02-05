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
    type: "BEAST",
    element: "EARTH",
    rarity: "Common",
    hp: 30, atk: 6, def: 2, 
    image: "/monsters/red_bug.png",
    skills: [
      { 
        name: "Bite", 
        chance: 0.3, 
        condition: "Active", 
        description: "ใช้กรามเล็กๆ กัดอย่างแรง สร้างความเสียหายกายภาพ 110% ของ ATK" 
      },
      {
        name: "Bug Carapace",
        chance: 1.0,
        condition: "Passive",
        description: "กระดองแข็งลดความเสียหายที่ได้รับลง 3 หน่วย"
      }
    ],
    lootTable: [
      { name: "Bug Carapace Skill", rarity: "Uncommon", skillId: "Bug Carapace", type: "SKILL", chance: 0.01 }, 
      // --- เพิ่มไอเทมเป็น 8 ชิ้น ---
      getItemLoot("ปีกแมลงใส", 0.6),
      getItemLoot("หนวดแมลง", 0.5),
      getItemLoot("ขนนกสีคราม", 0.4),
      getItemLoot("เปลือกแมลงเก่า", 0.35),
      getItemLoot("ขาแมลงหัก", 0.3),
      getItemLoot("เศษดินติดปีก", 0.25),
      getItemLoot("ปีกแมลงสีรุ้ง", 0.05), // Rare
      getItemLoot("ดวงตาแมลง", 0.02)      // Very Rare
    ],
    collectionBonus: { def: 3, hp: 10 } // ✅ ปรับสเตตัสเพิ่มขึ้น
  },

  // ================= Tier 2: Level 1-2 =================
  {
    id: 'capterpillar',
    name: "หนอนน้อยขี้เซา",
    area: 'meadow',
    type: "INSECT",
    element: "WIND",
    rarity: "Common",
    hp: 50, atk: 8, def: 4, 
    image: "/monsters/little_worm.png",
    skills: [
      { 
        name: "Web Shot", 
        chance: 0.25, 
        condition: "Active", 
        description: "พ่นใยเหนียวใส่เป้าหมาย สร้างดาเมจ 80% และทำให้ศัตรูช้าลง" 
      },
      {
        name: "Caterpillar Silk",
        chance: 1.0,
        condition: "Passive",
        description: "ใยไหมนุ่มนวลช่วยลดทอนความเสียหายที่ได้รับลง 5%"
      }
    ],
    lootTable: [
      { name: "Caterpillar Silk Skill", rarity: "Uncommon", skillId: "Caterpillar Silk", type: "SKILL", chance: 0.01 },
      // --- เพิ่มไอเทมเป็น 8 ชิ้น ---
      getItemLoot("ใบไม้ที่ถูกกัด", 0.7),
      getItemLoot("เกราะนิ่มของหนอน", 0.5),
      getItemLoot("สมุนไพรสีเขียว", 0.4),
      getItemLoot("ก้อนใยไหมขยุกขยิก", 0.35),
      getItemLoot("เศษใบหม่อน", 0.3),
      getItemLoot("น้ำลายเหนียว", 0.25),
      getItemLoot("ใบไม้ประกายเงิน", 0.1),  // Uncommon
      getItemLoot("ดักแด้สีเงิน", 0.03)     // Rare
    ],
    collectionBonus: { hp: 30, def: 1 } // ✅ ปรับสเตตัสเพิ่มขึ้น
  },

  // ================= Tier 3: Level 2 =================
  {
    id: 'grasshopper',
    name: "ตั๊กแตนพริ้วไหว",
    area: 'meadow',
    type: "INSECT",
    element: "WIND",
    rarity: "Common",
    hp: 45, atk: 14, def: 2, 
    image: "/monsters/grashopper.png",
    skills: [
      { 
        name: "Grasshopper Jump", 
        chance: 0.2, 
        condition: "Active", 
        description: "กระโดดถีบกลางอากาศ สร้างความเสียหายกายภาพ 140% ของ ATK" 
      }
    ],
    lootTable: [
      { name: "Grasshopper Jump Skill", rarity: "Uncommon", skillId: "Grasshopper Jump", type: "SKILL", chance: 0.01 },
      // --- เพิ่มไอเทมเป็น 8 ชิ้น ---
      getItemLoot("ขาตั๊กแตน", 0.6),
      getItemLoot("ขนนกสีคราม", 0.5),
      getItemLoot("หูแมลงนำโชค", 0.2),
      getItemLoot("ปีกตั๊กแตนสีเขียว", 0.4),
      getItemLoot("ฟางแห้ง", 0.35),
      getItemLoot("เศษกิ่งไม้ทุ่งหญ้า", 0.3),
      getItemLoot("ขาตั๊กแตนทองคำ", 0.02), // Rare
      getItemLoot("หัวใจนักสู้ทุ่งหญ้า", 0.01) // Very Rare
    ],
    collectionBonus: { luck: 3, atk: 2 } // ✅ ปรับสเตตัสเพิ่มขึ้น
  },

  // ================= Tier 4: Level 3 =================
  {
    id: 'slime',
    name: "สไลม์ทุ่งหญ้า",
    area: 'meadow',
    type: "SLIME",
    element: "WATER",
    rarity: "Uncommon",
    hp: 75, atk: 12, def: 6, 
    image: "/monsters/slime.png",
    skills: [
      { 
        name: "Jump Attack", 
        chance: 0.3, 
        condition: "Active", 
        description: "กระโดดทับด้วยตัวที่ยืดหยุ่น สร้างดาเมจน้ำ 130% ของ ATK" 
      },
      {
        name: "Slime Recovery",
        chance: 1.0,
        condition: "Passive",
        description: "ร่างกายยืดหยุ่นพิเศษ ลดความเสียหายที่ได้รับลง 10%"
      }
    ],
    lootTable: [
      { name: "Slime Recovery Skill", rarity: "Uncommon", skillId: "Slime Recovery", type: "SKILL", chance: 0.01 },
      // --- เพิ่มไอเทมเป็น 8 ชิ้น ---
      getItemLoot("เมือกเหลว", 0.7),
      getItemLoot("สมุนไพรสีเขียว", 0.5),
      getItemLoot("เศษน้ำแข็งจิ๋ว", 0.4),
      getItemLoot("ฟองอากาศในน้ำ", 0.35),
      getItemLoot("แกนสไลม์ใส", 0.2),      // Uncommon
      getItemLoot("เมือกสไลม์เข้มข้น", 0.15), // Uncommon
      getItemLoot("อัญมณีสีฟ้า", 0.05),     // Rare
      getItemLoot("หัวใจสไลม์", 0.01)      // Legendary
    ],
    collectionBonus: { hp: 100, def: 2 } // ✅ ปรับสเตตัสเพิ่มขึ้น
  },

  // ================= Tier 5: WORLD BOSS =================
  {
    id: 'meadow_queen_bee',
    name: "👑 ราชินีผึ้งทองคำ",
    area: 'meadow',
    type: "BOSS",
    element: "LIGHT",
    rarity: "Legendary",
    isFixedStats: true,
    isBoss: true,
    hp: 1500, maxHp: 1500, atk: 45, def: 25, exp: 500, gold: 300,
    image: "/monsters/Queen_bee.png",
    skills: [
      { 
        name: "Royal Stinger", 
        chance: 0.3, 
        condition: "Active", 
        description: "แทงด้วยเหล็กในทองคำ สร้างดาเมจสายฟ้า 180% ของ ATK" 
      },
      { 
        name: "Bee Swarm", 
        chance: 1.0, 
        condition: "Special", 
        description: "เรียกฝูงผึ้งมารุมล้อมเมื่อวิกฤต สร้างดาเมจมหาศาล 250%" 
      },
      {
        name: "Honey Shield",
        chance: 1.0,
        condition: "Passive",
        description: "เกราะน้ำผึ้งศักดิ์สิทธิ์ ลดความเสียหายที่ได้รับลง 12%"
      }
    ],
    lootTable: [
      { name: "Aura Skill", rarity: "Legendary", skillId: "Aura", type: "SKILL", chance: 0.005 }, 
      // --- เพิ่มไอเทมเป็น 8 ชิ้น ---
      getItemLoot("เศษทองชุบเยลลี่", 0.4),
      getItemLoot("สมุนไพรสีทอง", 0.3),
      getItemLoot("เหล็กในผึ้งทหาร", 0.25),
      getItemLoot("น้ำผึ้งหลวง", 0.2),
      getItemLoot("เหรียญก๊อบลินทองคำ", 0.1), // Rare
      getItemLoot("ดาบสั้นสังหารยักษ์", 0.05), // Rare
      getItemLoot("มงกุฎผึ้งจิ๋ว", 0.02),      // Legendary
      getItemLoot("ปีกนางฟ้าสีทอง", 0.01)     // Legendary
    ],
    collectionBonus: { atk: 15, luck: 5, hp: 200 } // ✅ โบนัสระดับบอส
  },
];