import { itemMaster } from './itemData';

export const monsters = [
  // ==========================================
  // 🌿 MAP 1: SERENE MEADOW
  // ==========================================
  {
    id: 'capterpillar',
    name: "หนอนน้อยขี้เซา",
    type: "caterpillar", 
    level: 1,
    rarity: "Common",
    hp: 30, maxHp: 30, atk: 8, def: 2, exp: 10, gold: 5,
    image: "🐛",
    description: "หนอนที่ใช้เวลาทั้งวันไปกับการงีบหลับบนใบไม้ที่นุ่มที่สุด",
    onDeathHeal: 15,
    lootTable: [
      { ...itemMaster["สมุนไพรสีเขียว"], image: "🌿", chance: 0.5 },
      { ...itemMaster["ขนนกสีคราม"], chance: 0.2 },
      { ...itemMaster["เกราะนิ่มของหนอน"], chance: 0.4 },
      { name: "ใบไม้ที่ถูกกัด", rarity: "Common", image: "🍃", chance: 0.6 }
    ],
    collectionBonus: { hp: 10, description: "HP ถาวร +10" }
  },
  {
    id: 'capterpillar_shiny',
    name: "✨ หนอนน้อยแสงจันทร์ (SHINY)",
    type: "caterpillar", 
    level: 1,
    isShiny: true,
    rarity: "Uncommon",
    hp: 90, maxHp: 90, atk: 20, def: 6, exp: 30, gold: 20,
    image: "🐛",
    description: "หนอนหายากที่อาบแสงจันทร์จนตัวเรืองแสง พลังชีวิตสูงกว่าปกติมาก!",
    // ✅ ปรับโบนัสเป็น x2 (จาก 10 เป็น 20)
    collectionBonus: { hp: 20, description: "HP ถาวร +20 (Shiny Bonus)" }
  },
  {
    id: 'bug',
    name: "แมลงตัวน้อย",
    type: "bug", 
    level: 1,
    rarity: "Common",
    hp: 20, maxHp: 20, atk: 6, def: 1, exp: 7, gold: 5,
    image: "🐞",
    description: "แมลงนำโชคตัวจิ๋วที่มักจะปรากฏตัวในทุ่งหญ้าที่อุดมสมบูรณ์",
    onDeathHeal: 15,
    lootTable: [
      { ...itemMaster["สมุนไพรสีเขียว"], image: "🌿", chance: 0.5 },
      { ...itemMaster["ขาตั๊กแตน"], image: "🦗", chance: 0.3 },
      { ...itemMaster["หูแมลงนำโชค"], chance: 0.1 },
      { name: "ปีกแมลงใส", rarity: "Common", image: "🦋", chance: 0.4 }
    ],
    collectionBonus: { def: 1, description: "DEF ถาวร +1" }
  },
  {
    id: 'bug_shiny',
    name: "✨ แมลงทองนำโชค (SHINY)",
    type: "bug", 
    level: 1,
    isShiny: true,
    rarity: "Rare",
    hp: 60, maxHp: 60, atk: 15, def: 4, exp: 25, gold: 30,
    image: "🐞",
    description: "แมลงสีทองที่นานๆ จะปรากฏตัวสักครั้ง ว่ากันว่าใครพบจะโชคดี!",
    // ✅ ปรับโบนัสเป็น x2 (จาก 1 เป็น 2)
    collectionBonus: { def: 2, description: "DEF ถาวร +2 (Shiny Bonus)" }
  },
  {
    id: 'slime',
    name: "สไลม์ทุ่งหญ้า",
    type: "slime",
    level: 2,
    rarity: "Common",
    hp: 42, maxHp: 42, atk: 10, def: 4, exp: 15, gold: 12,
    image: "/monsters/slime.png", 
    description: "ก้อนเยลลี่สีเขียวที่ดูเหมือนจะกินได้ แต่จริงๆ แล้วมันจ้องจะเขมือบรองเท้าของคุณอยู่!",
    skills: [{ name: "Sticky Slime", condition: "Active", description: "สร้างความเสียหาย 1.2 เท่า" }],
    lootTable: [
      { name: "เมือกเหลว", rarity: "Common", image: "💧", chance: 0.7 },
      { ...itemMaster["เนื้อแห้ง"], chance: 0.2 },
      { ...itemMaster["เมือกสไลม์เข้มข้น"], chance: 0.15 },
      { ...itemMaster["ดวงตาสไลม์"], chance: 0.05 }
    ],
    collectionBonus: { hp: 20, description: "HP ถาวร +20" }
  },
  {
    id: 'slime_shiny',
    name: "✨ กัมมี่สไลม์รุ้ง (SHINY)",
    type: "slime",
    level: 2,
    isShiny: true,
    rarity: "Rare",
    hp: 126, maxHp: 126, atk: 25, def: 10, exp: 50, gold: 50,
    image: "/monsters/slime.png", 
    description: "สไลม์สีรุ้งที่ตัวเหนียวหนึบกว่าปกติ!",
    // ✅ ปรับโบนัสเป็น x2 (จาก 20 เป็น 40)
    collectionBonus: { hp: 40, description: "HP ถาวร +40 (Shiny Bonus)" }
  },
  {
    id: 'King_slime',
    name: "ราชาสไลม์ (Boss)",
    type: "boss_slime",
    level: 5,
    isBoss: true,
    rarity: "Rare",
    hp: 200, maxHp: 200, atk: 18, def: 8, exp: 250, gold: 150,
    image: "/monsters/King_slime.png", 
    description: "เจ้าแห่งสไลม์ทั้งปวง ปกครองทุ่งหญ้าด้วยความนุ่มนิ่มและมงกุฎเยลลี่รสส้ม",
    skills: [{ name: "King Crush", condition: "Active", description: "กระโดดทับแรง 1.5 เท่า" }],
    lootTable: [
      { ...itemMaster["มงกุฎเยลลี่อมตะ"], image: "👑", chance: 0.05 },
      { ...itemMaster["แกนสไลม์ใส"], image: "💎", chance: 0.15 },
      { ...itemMaster["เมือกสไลม์เข้มข้น"], chance: 0.4 },
      { name: "เศษทองชุบเยลลี่", rarity: "Uncommon", image: "✨", chance: 0.3 }
    ],
    collectionBonus: { atk: 5, description: "ATK ถาวร +5" }
  },
  {
    id: 'King_slime_shiny',
    name: "✨ มหาจักรพรรดิสไลม์ทองคำ (SHINY Boss)",
    type: "boss_slime",
    level: 6,
    isBoss: true,
    isShiny: true,
    rarity: "Epic",
    hp: 600, maxHp: 600, atk: 45, def: 20, exp: 1000, gold: 500,
    image: "/monsters/King_slime.png", 
    description: "ราชาสไลม์ระดับตำนานที่ตัวเป็นทองคำบริสุทธิ์ แข็งแกร่งเกินบรรยาย",
    // ✅ ปรับโบนัสเป็น x2 (จาก 5 เป็น 10)
    collectionBonus: { atk: 10, description: "ATK ถาวร +10 (Shiny Bonus)" }
  },

  // ==========================================
  // ⛰️ MAP 2: EMERALD VALLEY
  // ==========================================
  {
    id: 'emerald_slime',
    name: "สไลม์มรกต",
    type: "slime",
    level: 7,
    rarity: "Uncommon",
    hp: 180, maxHp: 180, atk: 25, def: 12, exp: 120, gold: 40,
    image: "/monsters/emerald_slime.png", 
    description: "สไลม์ที่ดูดซับแร่ธาตุจากหุบเขาจนกลายเป็นสีมรกตที่แข็งแกร่ง",
    lootTable: [
      { ...itemMaster["แกนสไลม์ใส"], image: "💎", chance: 0.2 },
      { ...itemMaster["หินมรกตดิบ"], chance: 0.3 },
      { name: "เมือกมรกต", rarity: "Uncommon", image: "🧪", chance: 0.4 },
      { name: "สะเก็ดหินเขียว", rarity: "Common", image: "🪨", chance: 0.5 }
    ],
    collectionBonus: { def: 3, description: "DEF ถาวร +3" }
  },
  {
    id: 'emerald_slime_shiny',
    name: "✨ สไลม์หยกนพเก้า (SHINY)",
    type: "slime",
    level: 7,
    isShiny: true,
    rarity: "Epic",
    hp: 540, maxHp: 540, atk: 70, def: 30, exp: 400, gold: 150,
    image: "/monsters/emerald_slime.png", 
    // ✅ ปรับโบนัสเป็น x2 (จาก 3 เป็น 6)
    collectionBonus: { def: 6, description: "DEF ถาวร +6 (Shiny Bonus)" }
  },

  // ==========================================
  // 🌲 MAP 3: WHISPERING WOODS
  // ==========================================
  {
    id: 'goblin',
    name: "ก๊อบลินป่า",
    type: "goblin",
    level: 12,
    rarity: "Uncommon",
    hp: 550, maxHp: 550, atk: 50, def: 30, exp: 450, gold: 100,
    image: "/monsters/Goblin.png", 
    description: "นักล่าตัวแสบที่มักจะซ่อนตัวอยู่ในเงามืดของป่ากระซิบ",
    lootTable: [
      { ...itemMaster["เหรียญก๊อบลิน"], image: "🪙", chance: 0.5 },
      { ...itemMaster["มีดสั้นสนิมเกรอะ"], chance: 0.15 },
      { ...itemMaster["เศษหน้ากากไม้"], chance: 0.4 },
      { ...itemMaster["เนื้อแห้ง"], chance: 0.3 }
    ],
    collectionBonus: { atk: 8, description: "ATK ถาวร +8" }
  },
  {
    id: 'goblin_shiny',
    name: "✨ ก๊อบลินนักรบสีคราม (SHINY)",
    type: "goblin",
    level: 13,
    isShiny: true,
    rarity: "Rare",
    hp: 1500, maxHp: 1500, atk: 140, def: 80, exp: 1200, gold: 400,
    image: "/monsters/Goblin.png", 
    // ✅ ปรับโบนัสเป็น x2 (จาก 8 เป็น 16)
    collectionBonus: { atk: 16, description: "ATK ถาวร +16 (Shiny Bonus)" }
  },

  // ==========================================
  // 🏹 MAP 4: GOBLIN OUTPOST
  // ==========================================
  {
    id: 'goblin_archer',
    name: "ก๊อบลินนักธนู",
    type: "goblin",
    level: 17,
    rarity: "Rare",
    hp: 900, maxHp: 900, atk: 110, def: 50, exp: 800, gold: 250,
    image: "/monsters/Goblin-archer.png", 
    description: "ผู้คุ้มกันด่านหน้าที่มีสายตาแหลมคมและธนูที่อาบด้วยยาพิษ",
    lootTable: [
      { ...itemMaster["ลูกธนูเคลือบพิษ"], image: "🏹", chance: 0.2 },
      { ...itemMaster["ธนูเหล็กเคลือบพิษ"], chance: 0.05 },
      { ...itemMaster["เหรียญก๊อบลิน"], chance: 0.6 },
      { name: "ขนนกติดหางธนู", rarity: "Common", image: "🪶", chance: 0.4 }
    ],
    collectionBonus: { luck: 2, description: "LUCK ถาวร +2" }
  },
  {
    id: 'goblin_archer_shiny',
    name: "✨ นักแม่นธนูหน้าไม้ทองคำ (SHINY)",
    type: "goblin",
    level: 18,
    isShiny: true,
    rarity: "Epic",
    hp: 2500, maxHp: 2500, atk: 300, def: 120, exp: 2000, gold: 800,
    image: "/monsters/Goblin-archer.png", 
    // ✅ ปรับโบนัสเป็น x2 (จาก 2 เป็น 4)
    collectionBonus: { luck: 4, description: "LUCK ถาวร +4 (Shiny Bonus)" }
  },
  {
    id: 'goblin_king',
    name: "ราชาก๊อบลิน (Boss)",
    type: "boss_goblin",
    level: 20,
    isBoss: true,
    rarity: "Epic",
    hp: 3000, maxHp: 3000, atk: 180, def: 90, exp: 5000, gold: 2000,
    image: "/monsters/King_Goblin.png", 
    description: "ผู้นำเผ่าที่ได้รับพลังจากหน้ากากโบราณ มีพละกำลังมหาศาล",
    lootTable: [
      { ...itemMaster["ชิ้นส่วนหน้ากากก๊อบลิน"], image: "🎭", chance: 0.15 },
      { ...itemMaster["ขวานยักษ์สังหาร"], chance: 0.02 },
      { ...itemMaster["สร้อยคอฟันหมาป่า"], chance: 0.2 },
      { name: "บันทึกราชา", rarity: "Epic", image: "📜", chance: 0.1 }
    ],
    collectionBonus: { atk: 15, description: "ATK ถาวร +15" }
  },
  {
    id: 'goblin_king_shiny',
    name: "✨ ราชาเทพก๊อบลินบรรพกาล (SHINY Boss)",
    type: "boss_goblin",
    level: 22,
    isBoss: true,
    isShiny: true,
    rarity: "Legendary",
    hp: 9000, maxHp: 9000, atk: 500, def: 250, exp: 15000, gold: 7000,
    image: "/monsters/King_Goblin.png", 
    // ✅ ปรับโบนัสเป็น x2 (จาก 15 เป็น 30)
    collectionBonus: { atk: 30, description: "ATK ถาวร +30 (Shiny Bonus)" }
  },

  // ==========================================
  // 🏰 MAP 5: DARK FORTRESS
  // ==========================================
  {
    id: 'dark_knight',
    name: "อัศวินทมิฬ",
    type: "undead",
    level: 22,
    rarity: "Epic",
    hp: 2200, maxHp: 2200, atk: 250, def: 120, exp: 3500, gold: 800,
    image: "👤",
    description: "อดีตวีรบุรุษที่ลืมวิธีถอดชุดเกราะ จนสุดท้ายก็กลายเป็นส่วนหนึ่งของมันไปตลอดกาล",
    skills: [{ name: "Dark Slash", condition: "Active", description: "โจมตีทะลุพลังป้องกัน 20%" }],
    lootTable: [
      { name: "เศษเกราะทมิฬ", rarity: "Epic", image: "🛡️", chance: 0.15 },
      { ...itemMaster["เศษผ้าพันแผลเน่า"], chance: 0.4 },
      { ...itemMaster["นิ้วกระดูก"], chance: 0.3 },
      { ...itemMaster["น้ำมันตะเกียงมืด"], chance: 0.1 }
    ],
    collectionBonus: { def: 10, description: "DEF ถาวร +10" }
  },
  {
    id: 'dark_knight_shiny',
    name: "✨ อัศวินโลกันตร์ศักดิ์สิทธิ์ (SHINY)",
    type: "undead",
    level: 24,
    isShiny: true,
    rarity: "Legendary",
    hp: 6000, maxHp: 6000, atk: 700, def: 350, exp: 10000, gold: 3000,
    image: "👤",
    // ✅ ปรับโบนัสเป็น x2 (จาก 10 เป็น 20)
    collectionBonus: { def: 20, description: "DEF ถาวร +20 (Shiny Bonus)" }
  }
];