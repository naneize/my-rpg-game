// ใน data/playerState.js

export const INITIAL_PLAYER_DATA = {
  // --- 👤 Core Stats ---
  name: 'นักผจญภัย', 
  level: 1,
  hp: 99999,
  maxHp: 99999,
  atk: 999,  // ปรับให้สมดุล (เดี๋ยวไปบวกเพิ่มจากอุปกรณ์เอาครับ)
  def: 999, 
  luck: 5,
  exp: 0,
  nextLevelExp: 100,
  points: 5, // ให้แต้มเริ่มมานิดหน่อยพอให้กดสนุก

  materials: {
    Scrap:  0,     // เศษเหล็ก
    Shard:  0,   // ผลึก
    Dust:   0 // ผงเวทมนตร์
  },

  // --- 🛡️ Equipment (สวมใส่อยู่ - เก็บเป็น instanceId) ---
  equipment: {
    weapon: null,    
    armor: null,     
    accessory: null  
  },

  // --- 🎒 Inventory (คลังเก็บของ - แก้ไขโครงสร้างให้ถูกต้อง) ---
  inventory: [
    { instanceId: 'inst-sword-001', itemId: 'wooden_sword', level: 0, bonusAtk: 2 },
    { instanceId: 'inst-armor-001', itemId: 'rabbit_vest', level: 0},

  ],

  // --- 🏆 Titles & Achievements ---
  activeTitleId: 'none', 
  unlockedTitles: ['none'], 
  totalSteps: 20, // ✅ ตั้งค่าไว้ 20 เพื่อทดสอบการปลดล็อกฉายาทันที

  // --- 👾 Monster & Collection ---
  collection: {}, 
  monsterKills: {}, 

  // --- ✨ Skills & Passives ---
  unlockedPassives: [], 
  equippedPassives: [null, null, null], 

  // --- ⚙️ System States ---
  viewedTutorials: [],
};

export const INITIAL_LOGS = ["🌅 ยินดีต้อนรับสู่การผจญภัยครั้งใหม่!"];