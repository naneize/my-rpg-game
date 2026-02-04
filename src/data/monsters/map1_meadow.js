import { itemMaster } from '../itemData';

export const map1Monsters = [
  // ================= Tier 1: Level 1 (มอนสเตอร์หัดเดิน) =================
  {
    id: 'bug',
    name: "แมลงตัวน้อย",
    area: 'meadow',
    type: "bug",
    level: 1,
    rarity: "Common",
    hp: 25, maxHp: 25, atk: 6, def: 1, exp: 8, gold: 5,
    icon: "🐞",
    lootTable: [
      { name: "ปีกแมลงใส", rarity: "Common", image: "🦋", chance: 0.6 },
      { name: "หนวดแมลง", rarity: "Common", image: "📡", chance: 0.5 },
      { name: "เศษเปลือกแข็ง", rarity: "Common", image: "🐚", chance: 0.4 },
      { name: "ผงเกสรดอกไม้", rarity: "Common", image: "🌼", chance: 0.2 }
    ],
    collectionBonus: { def: 1 }
  },
  {
    id: 'bug_shiny',
    name: "✨ แมลงทองนำโชค (SHINY)",
    area: 'meadow',
    type: "bug",
    level: 1,
    isShiny: true,
    rarity: "Rare",
    hp: 75, maxHp: 75, atk: 14, def: 5, exp: 40, gold: 50,
    icon: "🐞",
    lootTable: [
      { name: "ปีกแมลงสีรุ้ง", rarity: "Rare", image: "🌈", chance: 0.5 },
      { name: "เข็มกลัดทองคำ", rarity: "Rare", image: "🏅", chance: 0.3 },
      { name: "อัญมณีสีชาด", rarity: "Rare", image: "💎", chance: 0.1 },
      { name: "โชคในขวดโหล", rarity: "Epic", image: "🏺", chance: 0.05 }
    ],
    collectionBonus: { def: 3 }
  },

  // ================= Tier 2: Level 1-2 (เริ่มมีความท้าทาย) =================
  {
    id: 'capterpillar',
    name: "หนอนน้อยขี้เซา",
    area: 'meadow',
    type: "caterpillar",
    level: 1,
    rarity: "Common",
    hp: 40, maxHp: 40, atk: 9, def: 3, exp: 12, gold: 8,
    icon: "🐛",
    lootTable: [
      { ...itemMaster["สมุนไพรสีเขียว"], image: "🌿", chance: 0.5 },
      { name: "ใบไม้ที่ถูกกัด", rarity: "Common", image: "🍃", chance: 0.6 },
      { name: "ใยไหมนุ่มนิ่ม", rarity: "Common", image: "🧶", chance: 0.4 },
      { name: "ดักแด้ขนาดเล็ก", rarity: "Common", image: "🥥", chance: 0.1 }
    ],
    collectionBonus: { hp: 15 }
  },
  {
    id: 'capterpillar_shiny',
    name: "✨ หนอนน้อยแสงจันทร์ (SHINY)",
    area: 'meadow',
    type: "caterpillar",
    level: 1,
    isShiny: true,
    rarity: "Uncommon",
    hp: 120, maxHp: 120, atk: 18, def: 8, exp: 60, gold: 80,
    icon: "🐛",
    lootTable: [
      { name: "สมุนไพรเงาจันทร์", rarity: "Uncommon", image: "🌙", chance: 0.5 },
      { name: "ใบไม้ประกายเงิน", rarity: "Uncommon", image: "✨", chance: 0.4 },
      { name: "เส้นไหมจันทรา", rarity: "Rare", image: "🧵", chance: 0.2 },
      { name: "น้ำค้างพันปี", rarity: "Rare", image: "💧", chance: 0.08 }
    ],
    collectionBonus: { hp: 30 }
  },

  // ================= Tier 3: Level 2 (ตัวทำดาเมจ) =================
  {
    id: 'grasshopper',
    name: "ตั๊กแตนพริ้วไหว",
    area: 'meadow',
    level: 2,
    rarity: "Common",
    hp: 55, maxHp: 55, atk: 13, def: 2, exp: 18, gold: 15,
    icon: "🦗",
    lootTable: [
      { name: "ขาตั๊กแตน", rarity: "Common", image: "🍗", chance: 0.6 },
      { name: "ปีกบางใส", rarity: "Common", image: "💸", chance: 0.4 },
      { name: "หญ้าแห้งชั้นดี", rarity: "Common", image: "🌾", chance: 0.5 },
      { name: "ฟันเฟืองธรรมชาติ", rarity: "Uncommon", image: "⚙️", chance: 0.1 }
    ],
    collectionBonus: { luck: 1 }
  },
  {
    id: 'grasshopper_shiny',
    name: "✨ ตั๊กแตนหยกมรกต (SHINY)",
    area: 'meadow',
    level: 2,
    isShiny: true,
    rarity: "Rare",
    hp: 160, maxHp: 160, atk: 26, def: 12, exp: 85, gold: 120,
    icon: "🦗",
    lootTable: [
      { name: "ขาทองคำเขียว", rarity: "Rare", image: "🦵", chance: 0.4 },
      { name: "ปีกหยกมรกต", rarity: "Rare", image: "🎐", chance: 0.3 },
      { name: "หญ้าเซียน", rarity: "Rare", image: "🎍", chance: 0.2 },
      { name: "หัวใจพงไพร", rarity: "Epic", image: "💚", chance: 0.05 }
    ],
    collectionBonus: { luck: 3 }
  },

  // ================= Tier 4: Level 3 (บอสประจำทุ่งหญ้า) =================
  {
    id: 'slime',
    name: "สไลม์ทุ่งหญ้า",
    area: 'meadow',
    level: 3,
    rarity: "Common",
    hp: 85, maxHp: 85, atk: 15, def: 5, exp: 25, gold: 20,
    image: "/monsters/slime.png",
    lootTable: [
      { name: "เมือกเหลว", rarity: "Common", image: "💧", chance: 0.7 },
      { name: "เยลลี่สีเขียว", rarity: "Common", image: "🍮", chance: 0.5 },
      { name: "หินใสขุ่น", rarity: "Common", image: "🪨", chance: 0.3 },
      { name: "แกนกลางสไลม์", rarity: "Uncommon", image: "🔮", chance: 0.1 }
    ],
    collectionBonus: { hp: 25 }
  },
  {
    id: 'slime_shiny',
    name: "✨ กัมมี่สไลม์รุ้ง (SHINY)",
    area: 'meadow',
    level: 3,
    isShiny: true,
    rarity: "Rare",
    hp: 250, maxHp: 250, atk: 32, def: 18, exp: 150, gold: 250,
    image: "/monsters/slime.png",
    lootTable: [
      { name: "เมือกสายรุ้ง", rarity: "Rare", image: "🌈", chance: 0.6 },
      { name: "เจลลี่รสน้ำผึ้ง", rarity: "Rare", image: "🍯", chance: 0.4 },
      { name: "คริสตัลเหลว", rarity: "Rare", image: "🧪", chance: 0.2 },
      { name: "หยาดน้ำตาพระเจ้า", rarity: "Legendary", image: "✨", chance: 0.02 }
    ],
    collectionBonus: { hp: 50 }
  }
];