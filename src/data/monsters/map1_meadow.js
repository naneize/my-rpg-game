import { itemMaster } from '../itemData';

export const map1Monsters = [
  // ================= Tier 1: Level 1 =================
  {
    id: 'bug',
    name: "แมลงตัวน้อย",
    area: 'meadow',
    type: "bug",
    rarity: "Common",
    hp: 30, atk: 6, def: 2, 
    image: "/monsters/red_bug.png",
    skills: [
      { name: "Bite", chance: 0.3, condition: "Active", description: "แมลงน้อยกัดเจ็บนะ!" } // ✅ ตรงกับ activeEffects
    ],
    lootTable: [
      { name: "Bug Carapace Skill", rarity: "Uncommon", skillId: "Bug Carapace", type: "SKILL", chance: 0.1 }, // ✅ ตรงกับ passive.js
      
      { name: "ปีกแมลงใส", rarity: "Common", image: "🦋", chance: 0.6 },
      { name: "หนวดแมลง", rarity: "Common", image: "📡", chance: 0.5 }
    ],
    collectionBonus: { def: 1 }
  },

  // ================= Tier 2: Level 1-2 =================
  {
    id: 'capterpillar',
    name: "หนอนน้อยขี้เซา",
    area: 'meadow',
    type: "caterpillar",
    rarity: "Common",
    hp: 50, atk: 8, def: 4, 
    image: "/monsters/little_worm.png",
    skills: [
      { name: "Web Shot", chance: 0.25, condition: "Active", description: "พ่นใยให้ศัตรูช้าลง!" } // ✅ ตรงกับ activeEffects
    ],
    lootTable: [
      { name: "Caterpillar Silk Skill", rarity: "Uncommon", skillId: "Caterpillar Silk", type: "SKILL", chance: 0.1 }, // ✅ ตรงกับ passive.js
     
      { name: "ใบไม้ที่ถูกกัด", rarity: "Common", image: "🍃", chance: 0.6 },
      { name: "ใยไหมนุ่มนิ่ม", rarity: "Common", image: "🧶", chance: 0.4 }
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
    skills: [
      { name: "Grasshopper Jump", chance: 0.2, condition: "Active", description: "กระโดดถีบเต็มแรง!" } // ✅ ตรงกับ activeEffects
    ],
    lootTable: [
      { name: "Grasshopper Jump Skill", rarity: "Uncommon", skillId: "Grasshopper Jump", type: "SKILL", chance: 0.1 }, // ✅ ตรงกับ passive.js
      
      { name: "ขาตั๊กแตน", rarity: "Common", image: "🍗", chance: 0.6 },
      { name: "หญ้าแห้งชั้นดี", rarity: "Common", image: "🌾", chance: 0.5 }
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
    skills: [
      { name: "Jump Attack", chance: 0.3, condition: "Active", description: "กระโดดทับด้วยน้ำหนักตัว!" } // ✅ ตรงกับ activeEffects
    ],
    lootTable: [
      { name: "Slime Recovery Skill", rarity: "Uncommon", skillId: "Slime Recovery", type: "SKILL", chance: 0.1 }, // ✅ ตรงกับ passive.js
     
      { name: "เมือกเหลว", rarity: "Common", image: "💧", chance: 0.7 },
      { name: "แกนกลางสไลม์", rarity: "Uncommon", image: "🔮", chance: 0.1 }
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
    isFixedStats: true, 
    hp: 1500, maxHp: 1500, atk: 45, def: 25, exp: 500, gold: 300,
    image: "/monsters/Queen_bee.png",
    skills: [
      { name: "Royal Stinger", chance: 0.3, condition: "Active", description: "เหล็กในพิษแห่งราชวงศ์!" }, // ✅ ตรงกับ activeEffects
      { name: "Bee Swarm", chance: 1.0, condition: "Special", description: "เรียกกองทัพผึ้งมารุมล้อม!" } // ✅ ตรงกับ specialEffects
    ],
    lootTable: [
      // เปลี่ยนจาก "Aura Skill" เป็น "Royal Aura" ให้ตรงกับ passive.js จ่ะ
      { name: "Royal Aura Skill", rarity: "Legendary", skillId: "Royal Aura", type: "SKILL", chance: 0.01 }, 

      { name: "เหล็กในราชินี", rarity: "Legendary", image: "🗡️", chance: 0.1 },
      { name: "น้ำผึ้งพันปี", rarity: "Epic", image: "🍯", chance: 0.3 },
      { name: "ปีกผึ้งทองคำ", rarity: "Rare", image: "✨", chance: 0.5 },
      { name: "ขนผึ้งทองคำ", rarity: "Rare", image: "✨", chance: 0.5 }
    ],
    collectionBonus: { atk: 10, luck: 2 } 
  },
];