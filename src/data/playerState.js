// ใน data/playerState.js

export const INITIAL_PLAYER_DATA = {
  // --- 👤 Core Stats ---
  name: 'นักผจญภัย', 
  level: 1,
  hp: 100,
  maxHp: 100,
  atk: 10,  // ปรับให้สมดุล (เดี๋ยวไปบวกเพิ่มจากอุปกรณ์เอาครับ)
  def: 5, 
  luck: 5,
  exp: 0,
  nextLevelExp: 100,
  points: 5, // ให้แต้มเริ่มมานิดหน่อยพอให้กดสนุก

  // --- 🛡️ Equipment (สวมใส่อยู่ - เก็บเป็น instanceId) ---
  equipment: {
    weapon: null,    
    armor: null,     
    accessory: null  
  },

  // --- 🎒 Inventory (คลังเก็บของ - ต้องมี instanceId ทุกชิ้น) ---
  inventory: [
    { 
      instanceId: 'inst-sword-001', 
      itemId: 'wooden_sword', 
      level: 0, 
      bonusAtk: 2 
    },
    { 
      instanceId: 'inst-shield-001', 
      itemId: 'iron_shield', 
      level: 0, 
      bonusDef: 0 
    },
    { 
      instanceId: 'inst-sword-002', 
      itemId: 'wooden_sword', 
      level: 1, // เล่มนี้ตีบวกมาให้แล้ว 1 ระดับ
      bonusAtk: 0 
    },
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