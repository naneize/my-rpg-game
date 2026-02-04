import { itemMaster } from '../itemData';

export const map3Monsters = [
  {
    id: 'wild_boar',
    name: "หมูป่าคลั่ง",
    area: 'whispering_woods',
    level: 10,
    rarity: "Uncommon",
    hp: 450, maxHp: 450, atk: 65, def: 40, exp: 380, gold: 80,
    image: "🐗",
    lootTable: [{ name: "งาหมูป่า", rarity: "Uncommon", image: "🦴", chance: 0.3 }],
    collectionBonus: { def: 2 }
  },
  {
    id: 'wild_boar_shiny',
    name: "✨ หมูป่าเหล็กไหล (SHINY)",
    area: 'whispering_woods',
    isShiny: true,
    level: 10,
    rarity: "Rare",
    hp: 1300, maxHp: 1300, atk: 150, def: 100, exp: 900, gold: 300,
    image: "🐗",
    lootTable: [{ name: "งาเหล็กไหล", rarity: "Rare", image: "🦴", chance: 0.4 }],
    collectionBonus: { def: 5 }
  },
  {
    id: 'forest_bat',
    name: "ค้างคาวดูดเลือด",
    area: 'whispering_woods',
    level: 11,
    rarity: "Common",
    hp: 320, maxHp: 320, atk: 75, def: 10, exp: 320, gold: 70,
    image: "🦇",
    lootTable: [{ name: "ปีกค้างคาว", rarity: "Common", image: "🦇", chance: 0.5 }],
    collectionBonus: { hp: 30 }
  },
  {
    id: 'forest_bat_shiny',
    name: "✨ ค้างคาวราตรีสีเลือด (SHINY)",
    area: 'whispering_woods',
    isShiny: true,
    level: 11,
    rarity: "Rare",
    hp: 900, maxHp: 900, atk: 180, def: 30, exp: 800, gold: 250,
    image: "🦇",
    lootTable: [{ name: "ปีกราตรีปีศาจ", rarity: "Rare", image: "🦇", chance: 0.6 }],
    collectionBonus: { hp: 60 }
  },
  {
    id: 'goblin',
    name: "ก๊อบลินป่า",
    area: 'whispering_woods',
    level: 12,
    rarity: "Uncommon",
    hp: 550, maxHp: 550, atk: 55, def: 30, exp: 450, gold: 100,
    image: "/monsters/Goblin.png",
    lootTable: [{ ...itemMaster["เหรียญก๊อบลิน"], image: "🪙", chance: 0.5 }],
    collectionBonus: { atk: 8 }
  },
  {
    id: 'goblin_shiny',
    name: "✨ ก๊อบลินนักรบสีคราม (SHINY)",
    area: 'whispering_woods',
    isShiny: true,
    level: 12,
    rarity: "Rare",
    hp: 1500, maxHp: 1500, atk: 140, def: 80, exp: 1200, gold: 400,
    image: "/monsters/Goblin.png",
    lootTable: [{ name: "เหรียญก๊อบลินโบราณ", rarity: "Rare", image: "🪙", chance: 0.7 }],
    collectionBonus: { atk: 16 }
  },
  {
    id: 'ent_guardian',
    name: "ผู้พิทักษ์พฤกษา",
    area: 'whispering_woods',
    level: 14,
    rarity: "Rare",
    hp: 1200, maxHp: 1200, atk: 90, def: 70, exp: 850, gold: 180,
    image: "🌳",
    lootTable: [{ name: "แกนไม้โบราณ", rarity: "Rare", image: "🪵", chance: 0.3 }],
    collectionBonus: { def: 5 }
  },
  {
    id: 'ent_guardian_shiny',
    name: "✨ พฤกษาทองคำพันปี (SHINY)",
    area: 'whispering_woods',
    isShiny: true,
    level: 14,
    rarity: "Epic",
    hp: 3500, maxHp: 3500, atk: 220, def: 180, exp: 2500, gold: 800,
    image: "🌳",
    lootTable: [{ name: "แกนไม้ทองคำ", rarity: "Epic", image: "🪵", chance: 0.5 }],
    collectionBonus: { def: 10 }
  }
];