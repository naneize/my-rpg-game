import { itemMaster } from '../itemData';

export const map5Monsters = [
  {
    id: 'skeleton_soldier',
    name: "ทหารโครงกระดูก",
    area: 'dark_fortress',
    level: 20,
    rarity: "Uncommon",
    hp: 1800, maxHp: 1800, atk: 210, def: 90, exp: 2200, gold: 500,
    image: "💀",
    lootTable: [{ name: "ดาบหัก", rarity: "Uncommon", image: "🗡️", chance: 0.5 }],
    collectionBonus: { atk: 5 }
  },
  {
    id: 'skeleton_soldier_shiny',
    name: "✨ อัศวินโครงกระดูกนิลกาฬ (SHINY)",
    area: 'dark_fortress',
    isShiny: true,
    level: 20,
    rarity: "Epic",
    hp: 5400, maxHp: 5400, atk: 550, def: 250, exp: 6000, gold: 2000,
    image: "💀",
    lootTable: [{ name: "ดาบโบราณนิลกาฬ", rarity: "Epic", image: "🗡️", chance: 0.6 }],
    collectionBonus: { atk: 12 }
  },
  {
    id: 'haunted_armor',
    name: "เกราะวิญญาณหลอน",
    area: 'dark_fortress',
    level: 21,
    rarity: "Rare",
    hp: 3500, maxHp: 3500, atk: 180, def: 200, exp: 3000, gold: 700,
    image: "🧥",
    lootTable: [{ name: "วิญญาณในขวดแก้ว", rarity: "Rare", image: "🏺", chance: 0.1 }],
    collectionBonus: { def: 15 }
  },
  {
    id: 'haunted_armor_shiny',
    name: "✨ มหาเกราะวิญญาณคลั่ง (SHINY)",
    area: 'dark_fortress',
    isShiny: true,
    level: 21,
    rarity: "Legendary",
    hp: 9000, maxHp: 9000, atk: 450, def: 550, exp: 8000, gold: 3000,
    image: "🧥",
    lootTable: [{ name: "ดวงวิญญาณราชัน", rarity: "Legendary", image: "🏺", chance: 0.2 }],
    collectionBonus: { def: 30 }
  },
  {
    id: 'dark_knight',
    name: "อัศวินทมิฬ",
    area: 'dark_fortress',
    level: 22,
    rarity: "Epic",
    hp: 2800, maxHp: 2800, atk: 280, def: 140, exp: 3500, gold: 800,
    image: "👤",
    lootTable: [{ name: "เศษเกราะทมิฬ", rarity: "Epic", image: "🛡️", chance: 0.15 }],
    collectionBonus: { def: 10 }
  },
  {
    id: 'dark_knight_shiny',
    name: "✨ อัศวินโลกันตร์ศักดิ์สิทธิ์ (SHINY)",
    area: 'dark_fortress',
    isShiny: true,
    level: 22,
    rarity: "Legendary",
    hp: 8500, maxHp: 8500, atk: 750, def: 400, exp: 12000, gold: 3500,
    image: "👤",
    lootTable: [{ name: "เกราะมหาอัศวินศักดิ์สิทธิ์", rarity: "Legendary", image: "🛡️", chance: 0.3 }],
    collectionBonus: { def: 20 }
  },
  {
    id: 'gargoyle',
    name: "การ์กอยล์หิน",
    area: 'dark_fortress',
    level: 23,
    rarity: "Rare",
    hp: 4200, maxHp: 4200, atk: 320, def: 180, exp: 4500, gold: 1200,
    image: "🦇",
    lootTable: [{ name: "กรงเล็บหิน", rarity: "Rare", image: "💅", chance: 0.3 }],
    collectionBonus: { atk: 10 }
  },
  {
    id: 'gargoyle_shiny',
    name: "✨ การ์กอยล์ทองคำโบราณ (SHINY)",
    area: 'dark_fortress',
    isShiny: true,
    level: 23,
    rarity: "Legendary",
    hp: 12000, maxHp: 12000, atk: 850, def: 500, exp: 15000, gold: 5000,
    image: "🦇",
    lootTable: [{ name: "กรงเล็บทองคำ", rarity: "Legendary", image: "💅", chance: 0.4 }],
    collectionBonus: { atk: 25 }
  }
];