import { itemMaster } from '../itemData';

export const map4Monsters = [
  {
    id: 'goblin_shaman',
    name: "ก๊อบลินหมอผี",
    area: 'goblin_outpost',
    level: 16,
    rarity: "Rare",
    hp: 800, maxHp: 800, atk: 150, def: 30, exp: 900, gold: 300,
    image: "🧙‍♂️",
    lootTable: [{ name: "ไม้เท้าหัวกะโหลก", rarity: "Rare", image: "🪄", chance: 0.2 }],
    collectionBonus: { luck: 3 }
  },
  {
    id: 'goblin_shaman_shiny',
    name: "✨ ก๊อบลินจอมขมังเวทย์ (SHINY)",
    area: 'goblin_outpost',
    isShiny: true,
    level: 16,
    rarity: "Epic",
    hp: 2400, maxHp: 2400, atk: 350, def: 80, exp: 2500, gold: 1000,
    image: "🧙‍♂️",
    lootTable: [{ name: "ไม้เท้าหัวกะโหลกทมิฬ", rarity: "Epic", image: "🪄", chance: 0.4 }],
    collectionBonus: { luck: 6 }
  },
  {
    id: 'goblin_archer',
    name: "ก๊อบลินนักธนู",
    area: 'goblin_outpost',
    level: 17,
    rarity: "Rare",
    hp: 950, maxHp: 950, atk: 115, def: 55, exp: 800, gold: 250,
    image: "/monsters/Goblin-archer.png",
    lootTable: [{ ...itemMaster["ลูกธนูเคลือบพิษ"], image: "🏹", chance: 0.2 }],
    collectionBonus: { luck: 2 }
  },
  {
    id: 'goblin_archer_shiny',
    name: "✨ นักแม่นธนูหน้าไม้ทองคำ (SHINY)",
    area: 'goblin_outpost',
    isShiny: true,
    level: 17,
    rarity: "Epic",
    hp: 2800, maxHp: 2800, atk: 320, def: 130, exp: 2200, gold: 900,
    image: "/monsters/Goblin-archer.png",
    lootTable: [{ name: "หน้าไม้ทองคำบรรพกาล", rarity: "Legendary", image: "🏹", chance: 0.15 }],
    collectionBonus: { luck: 4 }
  },
  {
    id: 'elite_goblin',
    name: "หน่วยรบก๊อบลิน",
    area: 'goblin_outpost',
    level: 18,
    rarity: "Uncommon",
    hp: 1400, maxHp: 1400, atk: 130, def: 85, exp: 1100, gold: 400,
    image: "🛡️",
    lootTable: [{ name: "โล่ไม้ผุกร่อน", rarity: "Uncommon", image: "🛡️", chance: 0.5 }],
    collectionBonus: { def: 4 }
  },
  {
    id: 'elite_goblin_shiny',
    name: "✨ อัศวินก๊อบลินเกราะเพชร (SHINY)",
    area: 'goblin_outpost',
    isShiny: true,
    level: 18,
    rarity: "Epic",
    hp: 4200, maxHp: 4200, atk: 350, def: 250, exp: 3500, gold: 1500,
    image: "🛡️",
    lootTable: [{ name: "โล่เพชรสะท้อนแสง", rarity: "Epic", image: "🛡️", chance: 0.6 }],
    collectionBonus: { def: 10 }
  },
  {
    id: 'goblin_king',
    name: "ราชาก๊อบลิน (Boss)",
    area: 'goblin_outpost',
    isBoss: true,
    level: 19,
    rarity: "Epic",
    hp: 3500, maxHp: 3500, atk: 200, def: 100, exp: 5000, gold: 2000,
    image: "/monsters/King_Goblin.png",
    lootTable: [{ ...itemMaster["ขวานยักษ์สังหาร"], image: "🪓", chance: 0.02 }],
    collectionBonus: { atk: 15 }
  },
  {
    id: 'goblin_king_shiny',
    name: "✨ ราชาเทพก๊อบลินบรรพกาล (SHINY Boss)",
    area: 'goblin_outpost',
    isBoss: true,
    isShiny: true,
    level: 20,
    rarity: "Legendary",
    hp: 10500, maxHp: 10500, atk: 600, def: 300, exp: 15000, gold: 7000,
    image: "/monsters/King_Goblin.png",
    lootTable: [{ name: "มหาขวานทลายปฐพี", rarity: "Legendary", image: "🪓", chance: 0.05 }],
    collectionBonus: { atk: 30 }
  }
];