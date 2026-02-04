import { itemMaster } from '../itemData';

export const map2Monsters = [
  // ================= Tier 1: Small Mite =================
  {
    id: 'rock_mite',
    name: "แมลงหินจิ๋ว",
    area: 'emerald_valley',
    level: 6,
    rarity: "Common",
    hp: 140, maxHp: 140, atk: 22, def: 18, exp: 75, gold: 35,
    image: "🪲",
    skills: [
      { name: "Rock Skin", chance: 0.25, condition: "Active", description: "ทำตัวแข็งดั่งหินผา!" }
    ],
    lootTable: [
      { name: "เปลือกหินแข็ง", rarity: "Common", image: "🪨", chance: 0.5 },
      { name: "ผงแร่ซิลิกา", rarity: "Common", image: "🌬️", chance: 0.4 },
      // 🔥 [TEST] ปรับเป็น 1.0 เพื่อทดสอบการแสดงผลคัมภีร์
      { name: "Rock Skin Passive", rarity: "Rare", skillId: "Rock Skin", type: "SKILL", chance: 1.0 },

      { name: "อัญมณีสีเทา", rarity: "Uncommon", image: "🌑", chance: 0.1 }
    ],
    collectionBonus: { def: 2 }
  },
  

  // ================= Tier 2: Emerald Slime =================
  {
    id: 'emerald_slime',
    name: "สไลม์มรกต",
    area: 'emerald_valley',
    level: 8,
    rarity: "Uncommon",
    hp: 260, maxHp: 260, atk: 35, def: 22, exp: 140, gold: 55,
    image: "/monsters/emerald_slime.png",
    skills: [
      { name: "Regeneration", chance: 0.2, condition: "Active", description: "ฟื้นฟูเนื้อเยื่อมรกต!" }
    ],
    lootTable: [
      { name: "หินมรกตดิบ", rarity: "Uncommon", image: "⛰️", chance: 0.4 },
      { name: "เยลลี่สีเขียวเข้ม", rarity: "Uncommon", image: "🍮", chance: 0.5 },
      // 🔥 [TEST] ปรับเป็น 1.0
      { name: "Regeneration Skill", rarity: "Rare", skillId: "Regeneration", type: "SKILL", chance: 1.0 },

      { name: "เมล็ดพันธุ์หุบเขา", rarity: "Rare", image: "🌱", chance: 0.1 }
    ],
    collectionBonus: { def: 4 }
  },



  // ================= Tier 3: Valley Wolf =================
  {
    id: 'valley_wolf',
    name: "หมาป่าหุบเขา",
    area: 'emerald_valley',
    level: 9,
    rarity: "Uncommon",
    hp: 320, maxHp: 320, atk: 52, def: 12, exp: 200, gold: 80,
    image: "🐺",
    skills: [
      { name: "Wolf Hunter", chance: 0.3, condition: "Active", description: "กระโจนกัดอย่างบ้าคลั่ง!" }
    ],
    lootTable: [
      { name: "เขี้ยวหมาป่า", rarity: "Uncommon", image: "🦷", chance: 0.4 },
      { name: "หนังหมาป่าสีเทา", rarity: "Uncommon", image: "🧤", chance: 0.5 },
      // 🔥 [TEST] ปรับเป็น 1.0
      { name: "Wolf Hunter Skill", rarity: "Rare", skillId: "Wolf Hunter", type: "SKILL", chance: 1.0 },

      { name: "สร้อยคอจ่าฝูง", rarity: "Rare", image: "📿", chance: 0.08 }
    ],
    collectionBonus: { atk: 4 }
  },
  

  // ================= Tier 4: Bosses =================
  {
    id: 'King_slime',
    name: "ราชาสไลม์ (Boss)",
    area: 'emerald_valley',
    isBoss: true,
    level: 10,
    rarity: "Rare",
    hp: 650, maxHp: 650, atk: 45, def: 25, exp: 500, gold: 350,
    image: "/monsters/King_slime.png",
    skills: [
      { name: "King Crush", chance: 0.4, condition: "Active", description: "ราชาทับถม!" },
      { name: "Royal Aura", chance: 1.0, condition: "Special", description: "ปลดปล่อยออร่าราชา!" }
    ],
    lootTable: [
      // 🔥 [TEST] ปรับเป็น 1.0
      { name: "Royal Aura Skill", rarity: "Epic", skillId: "Royal Aura", type: "SKILL", chance: 1.0 },

      { name: "แกนกลางราชา", rarity: "Rare", image: "🔮", chance: 0.3 },
      { name: "เจลลี่รอยัล", rarity: "Rare", image: "🍯", chance: 0.5 },
      { name: "คทาสไลม์เก่าแก่", rarity: "Epic", image: "🪄", chance: 0.05 }
    ],
    collectionBonus: { atk: 6 }
  },
  
];