import { itemMaster } from '../itemData';

export const map6Monsters = [
  {
    id: 'fire_elemental',
    name: "ภูตไฟผลาญ",
    area: 'ruin_temple',
    level: 25,
    rarity: "Epic",
    hp: 3800, maxHp: 3800, atk: 550, def: 120, exp: 6500, gold: 1200,
    image: "🔥",
    lootTable: [{ name: "เชื้อไฟไร้ดับ", rarity: "Epic", image: "🕯️", chance: 0.4 }],
    collectionBonus: { atk: 20 }
  },
  {
    id: 'fire_elemental_shiny',
    name: "✨ จอมเวทย์เพลิงนิรันดร์ (SHINY)",
    area: 'ruin_temple',
    isShiny: true,
    level: 25,
    rarity: "Legendary",
    hp: 11000, maxHp: 11000, atk: 1300, def: 350, exp: 20000, gold: 5000,
    image: "🔥",
    lootTable: [{ name: "มหาเชื้อเพลิงศักดิ์สิทธิ์", rarity: "Legendary", image: "🕯️", chance: 0.5 }],
    collectionBonus: { atk: 45 }
  },
  {
    id: 'magma_slug',
    name: "ทากแมกมา",
    area: 'ruin_temple',
    level: 25,
    rarity: "Uncommon",
    hp: 4500, maxHp: 4500, atk: 350, def: 400, exp: 5500, gold: 800,
    image: "🐌",
    lootTable: [{ name: "เมือกเดือด", rarity: "Uncommon", image: "🧪", chance: 0.7 }],
    collectionBonus: { def: 12 }
  },
  {
    id: 'magma_slug_shiny',
    name: "✨ ทากลาวาแก้วผลึก (SHINY)",
    area: 'ruin_temple',
    isShiny: true,
    level: 25,
    rarity: "Epic",
    hp: 12000, maxHp: 12000, atk: 800, def: 1000, exp: 15000, gold: 4000,
    image: "🐌",
    lootTable: [{ name: "เมือกลาวาสกัด", rarity: "Epic", image: "🧪", chance: 0.8 }],
    collectionBonus: { def: 25 }
  },
  {
    id: 'lava_golem',
    name: "โกเลมลาวา",
    area: 'ruin_temple',
    level: 26,
    rarity: "Epic",
    hp: 5000, maxHp: 5000, atk: 450, def: 300, exp: 8000, gold: 1500,
    image: "🌋",
    lootTable: [{ name: "แกนกลางโกเลม", rarity: "Legendary", image: "🧡", chance: 0.1 }],
    collectionBonus: { hp: 100 }
  },
  {
    id: 'lava_golem_shiny',
    name: "✨ มหาโกเลมผลึกสุริยะ (SHINY)",
    area: 'ruin_temple',
    isShiny: true,
    level: 26,
    rarity: "Legendary",
    hp: 15000, maxHp: 15000, atk: 1200, def: 800, exp: 25000, gold: 6000,
    image: "🌋",
    lootTable: [{ name: "ผลึกสุริยะบริสุทธิ์", rarity: "Legendary", image: "💎", chance: 0.4 }],
    collectionBonus: { hp: 250 }
  },
  {
    id: 'obsidian_hound',
    name: "สุนัขเฝ้านรก",
    area: 'ruin_temple',
    level: 27,
    rarity: "Rare",
    hp: 6000, maxHp: 6000, atk: 600, def: 250, exp: 9500, gold: 2000,
    image: "🐕",
    lootTable: [{ name: "เขี้ยวออบซิเดียน", rarity: "Rare", image: "🦷", chance: 0.3 }],
    collectionBonus: { luck: 10 }
  },
  {
    id: 'obsidian_hound_shiny',
    name: "✨ เซอร์เบอรัสโลกันตร์ (SHINY)",
    area: 'ruin_temple',
    isShiny: true,
    level: 27,
    rarity: "Legendary",
    hp: 18000, maxHp: 18000, atk: 1500, def: 600, exp: 30000, gold: 8000,
    image: "🐕",
    lootTable: [{ name: "เขี้ยวอเวจี", rarity: "Legendary", image: "🦷", chance: 0.4 }],
    collectionBonus: { luck: 25 }
  },
  {
    id: 'phoenix_boss',
    name: "ฟีนิกซ์นิรันดร์กาล (Boss)",
    area: 'ruin_temple',
    isBoss: true,
    level: 29,
    rarity: "Legendary",
    hp: 15000, maxHp: 15000, atk: 900, def: 500, exp: 50000, gold: 10000,
    image: "🦅",
    lootTable: [{ name: "ขนนกอมตะ", rarity: "Legendary", image: "🪶", chance: 0.2 }],
    collectionBonus: { atk: 50 }
  },
  {
    id: 'phoenix_boss_shiny',
    name: "✨ มหาเทพอวตารฟีนิกซ์ทองคำ (SHINY Boss)",
    area: 'ruin_temple',
    isBoss: true,
    isShiny: true,
    level: 30,
    rarity: "Legendary",
    hp: 50000, maxHp: 50000, atk: 2500, def: 1200, exp: 150000, gold: 50000,
    image: "🦅",
    lootTable: [{ name: "ขนทองคำเทพอวตาร", rarity: "Legendary", image: "🪶", chance: 0.4 }],
    collectionBonus: { atk: 150 }
  }
];