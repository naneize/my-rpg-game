import { itemMaster } from './itemData';

export const monsters = [
  // ==========================================
  // 🌿 MAP 1: SERENE MEADOW (LV. 1 - 5)
  // [เป้าหมาย: ให้ผู้เล่นฟาร์มเพื่อเพิ่ม HP และหาของ]
  // ==========================================
  {
    id: 'capterpillar',
    name: "หนอนน้อยขี้เซา",
    type: "caterpillar", 
    level: 1,
    hp: 30, maxHp: 30, atk: 8, def: 2, exp: 10, gold: 5,
    emoji: "🐛",
    onDeathHeal: 15, // ช่วยประคองผู้เล่นใหม่
    lootTable: [{ ...itemMaster["สมุนไพรสีเขียว"], chance: 0.5 }]
  },
  {
    id: 'slime',
    name: "สไลม์ทุ่งหญ้า",
    type: "slime",
    level: 3,
    hp: 60, maxHp: 60, atk: 12, def: 5, exp: 25, gold: 12,
    image: "/monsters/slime.png",
    skills: [{ name: "Sticky Slime", condition: "Active", description: "สร้างความเสียหาย 1.2 เท่า" }],
    lootTable: [{ name: "เมือกเหลว", rarity: "Common", chance: 0.7 }]
  },
  {
    id: 'King_slime',
    name: "ราชาสไลม์ (Boss)",
    type: "boss_slime",
    level: 5,
    isBoss: true,
    hp: 200, maxHp: 200, atk: 18, def: 8, exp: 250, gold: 150,
    image: "/monsters/King_slime.png",
    skills: [{ name: "King Crush", condition: "Active", description: "กระโดดทับแรง 1.5 เท่า" }],
    lootTable: [{ ...itemMaster["มงกุฎเยลลี่อมตะ"], chance: 0.05 }]
  },

  // ==========================================
  // ⛰️ MAP 2: EMERALD VALLEY (LV. 5 - 10)
  // [เป้าหมาย: เริ่มยากขึ้น ATK มอนสเตอร์จะเริ่มทะลุ DEF พื้นฐาน]
  // ==========================================
  {
    id: 'emerald_slime',
    name: "สไลม์มรกต",
    type: "slime",
    level: 7,
    hp: 180, maxHp: 180, atk: 25, def: 12, exp: 120, gold: 40,
    image: "/monsters/emerald_slime.png",
    lootTable: [{ name: "แกนสไลม์ใส", rarity: "Uncommon", chance: 0.2 }]
  },
  {
    id: 'stone_beetle',
    name: "ด้วงศิลา",
    type: "insect",
    level: 9,
    hp: 300, maxHp: 300, atk: 32, def: 25, exp: 200, gold: 60,
    emoji: "🪲",
    skills: [{ name: "Hard Shell", condition: "Passive", description: "ลดความเสียหายกายภาพ 10%" }]
  },

  // ==========================================
  // 🌲 MAP 3: WHISPERING WOODS (LV. 10 - 15)
  // ==========================================
  {
    id: 'goblin',
    name: "ก๊อบลินป่า",
    type: "goblin",
    level: 12,
    hp: 550, maxHp: 550, atk: 50, def: 30, exp: 450, gold: 100,
    image: "/monsters/Goblin.png",
    lootTable: [{ ...itemMaster["เหรียญก๊อบลิน"], chance: 0.5 }]
  },

  // ==========================================
  // 🏹 MAP 4: GOBLIN OUTPOST (LV. 15 - 20)
  // ==========================================
  {
    id: 'goblin_archer',
    name: "ก๊อบลินนักธนู",
    type: "goblin",
    level: 17,
    hp: 900, maxHp: 900, atk: 110, def: 50, exp: 800, gold: 250,
    image: "/monsters/Goblin-archer.png",
    lootTable: [{ ...itemMaster["ลูกธนูเคลือบพิษ"], chance: 0.2 }]
  },
  {
    id: 'goblin_king',
    name: "ราชาก๊อบลิน (Boss)",
    type: "boss_goblin",
    level: 20,
    isBoss: true,
    hp: 3000, maxHp: 3000, atk: 180, def: 90, exp: 5000, gold: 2000,
    image: "/monsters/King_Goblin.png",
    lootTable: [{ ...itemMaster["หน้ากากหัวหน้าเผ่า"], chance: 0.1 }]
  },

  // ==========================================
  // 🏰 MAP 5: DARK FORTRESS (LV. 20 - 24+)
  // [จุดวัดใจ: ถ้าเลเวล 1 เดินมาที่นี่ จะโดนตบ 1-2 ทีตายทันที]
  // ==========================================
  {
    id: 'dark_knight',
    name: "อัศวินทมิฬ",
    type: "undead",
    level: 22,
    hp: 2200, maxHp: 2200, atk: 250, def: 120, exp: 3500, gold: 800,
    emoji: "👤",
    skills: [{ name: "Dark Slash", condition: "Active", description: "โจมตีทะลุพลังป้องกัน 20%" }]
  },
  {
    id: 'fortress_guardian',
    name: "ผู้เฝ้าประตูปราสาท",
    type: "golem",
    level: 24,
    hp: 4000, maxHp: 4000, atk: 350, def: 180, exp: 6000, gold: 1500,
    emoji: "🗿"
  }
];