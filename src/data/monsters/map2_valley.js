import { itemMaster } from '../itemData';

export const map2Monsters = [
  // ================= Tier 1: Small Mite (พวกถึกทน) =================
  {
    id: 'rock_mite',
    name: "แมลงหินจิ๋ว",
    area: 'emerald_valley',
    level: 6,
    rarity: "Common",
    hp: 140, maxHp: 140, atk: 22, def: 18, exp: 75, gold: 35,
    image: "🪲",
    lootTable: [
      { name: "เปลือกหินแข็ง", rarity: "Common", image: "🪨", chance: 0.5 },
      { name: "ผงแร่ซิลิกา", rarity: "Common", image: "🌬️", chance: 0.4 },
      { name: "ขาแมลงลับคม", rarity: "Common", image: "🔪", chance: 0.3 },
      { name: "อัญมณีสีเทา", rarity: "Uncommon", image: "🌑", chance: 0.1 }
    ],
    collectionBonus: { def: 2 }
  },
  {
    id: 'rock_mite_shiny',
    name: "✨ แมลงเพชรเจียระไน (SHINY)",
    area: 'emerald_valley',
    isShiny: true,
    level: 6,
    rarity: "Epic",
    hp: 450, maxHp: 450, atk: 48, def: 45, exp: 280, gold: 150,
    image: "🪲",
    lootTable: [
      { name: "เปลือกเพชรดิบ", rarity: "Epic", image: "💎", chance: 0.4 },
      { name: "ประกายดาวตก", rarity: "Epic", image: "🌠", chance: 0.3 },
      { name: "ผลึกควอตซ์ใส", rarity: "Rare", image: "🔮", chance: 0.2 },
      { name: "หัวใจพสุธา", rarity: "Legendary", image: "🌍", chance: 0.05 }
    ],
    collectionBonus: { def: 5 }
  },

  // ================= Tier 2: Emerald Slime (สมดุล) =================
  {
    id: 'emerald_slime',
    name: "สไลม์มรกต",
    area: 'emerald_valley',
    level: 8,
    rarity: "Uncommon",
    hp: 260, maxHp: 260, atk: 35, def: 22, exp: 140, gold: 55,
    image: "/monsters/emerald_slime.png",
    lootTable: [
      { name: "หินมรกตดิบ", rarity: "Uncommon", image: "⛰️", chance: 0.4 },
      { name: "เยลลี่สีเขียวเข้ม", rarity: "Uncommon", image: "🍮", chance: 0.5 },
      { name: "เมือกสกัดเข้มข้น", rarity: "Uncommon", image: "🧪", chance: 0.3 },
      { name: "เมล็ดพันธุ์หุบเขา", rarity: "Rare", image: "🌱", chance: 0.1 }
    ],
    collectionBonus: { def: 4 }
  },
  {
    id: 'emerald_slime_shiny',
    name: "✨ สไลม์หยกนพเก้า (SHINY)",
    area: 'emerald_valley',
    isShiny: true,
    level: 8,
    rarity: "Epic",
    hp: 850, maxHp: 850, atk: 72, def: 55, exp: 450, gold: 300,
    image: "/monsters/emerald_slime.png",
    lootTable: [
      { name: "หินมรกตสกัดบริสุทธิ์", rarity: "Legendary", image: "💎", chance: 0.5 },
      { name: "หยกจักรพรรดิ", rarity: "Epic", image: "⛩️", chance: 0.3 },
      { name: "น้ำตาสไลม์สีทอง", rarity: "Epic", image: "💧", chance: 0.2 },
      { name: "คัมภีร์ลับมรกต", rarity: "Legendary", image: "📜", chance: 0.03 }
    ],
    collectionBonus: { def: 8 }
  },

  // ================= Tier 3: Valley Wolf (สาย Atk แรงทะลุ Def) =================
  {
    id: 'valley_wolf',
    name: "หมาป่าหุบเขา",
    area: 'emerald_valley',
    level: 9,
    rarity: "Uncommon",
    hp: 320, maxHp: 320, atk: 52, def: 12, exp: 200, gold: 80,
    image: "🐺",
    lootTable: [
      { name: "เขี้ยวหมาป่า", rarity: "Uncommon", image: "🦷", chance: 0.4 },
      { name: "หนังหมาป่าสีเทา", rarity: "Uncommon", image: "🧤", chance: 0.5 },
      { name: "เล็บเท้าแหลมคม", rarity: "Uncommon", image: "🐾", chance: 0.3 },
      { name: "สร้อยคอจ่าฝูง", rarity: "Rare", image: "📿", chance: 0.08 }
    ],
    collectionBonus: { atk: 4 }
  },
  {
    id: 'valley_wolf_shiny',
    name: "✨ หมาป่าหิมะพันปี (SHINY)",
    area: 'emerald_valley',
    isShiny: true,
    level: 9,
    rarity: "Rare",
    hp: 1100, maxHp: 1100, atk: 125, def: 35, exp: 650, gold: 450,
    image: "🐺",
    lootTable: [
      { name: "เขี้ยวเหมันต์", rarity: "Rare", image: "❄️", chance: 0.5 },
      { name: "หนังหมาป่าสีเงิน", rarity: "Rare", image: "🧥", chance: 0.4 },
      { name: "ลมหายใจเยือกแข็ง", rarity: "Epic", image: "🌫️", chance: 0.2 },
      { name: "วิญญาณหมาป่าหิมะ", rarity: "Legendary", image: "👻", chance: 0.04 }
    ],
    collectionBonus: { atk: 8 }
  },

  // ================= Tier 4: The Bosses =================
  {
    id: 'King_slime',
    name: "ราชาสไลม์ (Boss)",
    area: 'emerald_valley',
    isBoss: true,
    level: 10,
    rarity: "Rare",
    hp: 650, maxHp: 650, atk: 45, def: 25, exp: 500, gold: 350,
    image: "/monsters/King_slime.png",
    lootTable: [
      { ...itemMaster["มงกุฎเยลลี่อมตะ"], image: "👑", chance: 0.05 },
      { name: "แกนกลางราชา", rarity: "Rare", image: "🔮", chance: 0.3 },
      { name: "เจลลี่รอยัล", rarity: "Rare", image: "🍯", chance: 0.5 },
      { name: "คทาสไลม์เก่าแก่", rarity: "Epic", image: "🪄", chance: 0.05 }
    ],
    collectionBonus: { atk: 6 }
  },
  {
    id: 'King_slime_shiny',
    name: "✨ มหาจักรพรรดิสไลม์ทองคำ (SHINY Boss)",
    area: 'emerald_valley',
    isBoss: true,
    isShiny: true,
    level: 12,
    rarity: "Epic",
    hp: 2200, maxHp: 2200, atk: 140, def: 85, exp: 2500, gold: 1500,
    image: "/monsters/King_slime.png",
    lootTable: [
      { name: "มงกุฎทองคำจักรพรรดิ", rarity: "Legendary", image: "👑", chance: 0.1 },
      { name: "ทองคำเหลวบริสุทธิ์", rarity: "Epic", image: "🧪", chance: 0.4 },
      { name: "เหรียญกษาปณ์โบราณ", rarity: "Epic", image: "🪙", chance: 0.6 },
      { name: "หัวใจทองคำนพเก้า", rarity: "Legendary", image: "❤️", chance: 0.02 }
    ],
    collectionBonus: { atk: 15 }
  }
];