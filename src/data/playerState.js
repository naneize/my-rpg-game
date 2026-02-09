// ✅ data/playerState.js

export const INITIAL_PLAYER_DATA = {
  // --- 👤 Core Stats ---
  name: 'Adventurer', 
  level: 1,
  hp: 100,
  maxHp: 100,
  atk: 10,  
  def: 5, 
  luck: 5,
  exp: 0,
  nextLevelExp: 100,
  points: 5, 

  // --- 💎 Elemental Mastery (New!) ---
  // เก็บแต้มพลังธาตุถาวรที่ได้จากการฟาร์มมอนสเตอร์ (Mastery Milestones)
  permanentElementPower: {
    fire: 0,
    water: 0,
    earth: 0,
    wind: 0,
    light: 0,
    dark: 0,
    poison: 0
  },

  // เก็บ ID มอนสเตอร์ที่ปลดล็อก Mastery ครบตามเป้าแล้ว เพื่อกันการแจกแต้มซ้ำ
  unlockedMasteries: [], 

  materials: {
    scrap: 0,
    shard: 0,
    dust: 0,
    dragon_soul: 0,
    obsidian_scale: 0
  },

  // --- 📬 Mailbox ---
  mailbox: [
    {
      id: 'welcome-mail',
      sender: 'System',
      title: 'Welcome Gift for Adventurer! 🎁',
      content: 'Welcome! We have sent you some starting materials to try out the Forge system. Enjoy your journey!',
      items: [
        { id: 'scrap', name: 'Scrap', amount: 10, type: 'MATERIAL' },
        { id: 'shard', name: 'Shard', amount: 5, type: 'MATERIAL' }
      ],
      isRead: false,
      isClaimed: false,
      sentAt: new Date().toLocaleDateString()
    }
  ],

  // --- 🛡️ Equipment ---
  equipment: {
    weapon: null,    
    armor: null,     
    accessory: null  
  },

  // --- 🎒 Inventory ---
  inventory: [
    { instanceId: 'inst-sword-001', itemId: 'wooden_sword', level: 0, bonusAtk: 2 },
    { instanceId: 'inst-armor-001', itemId: 'rabbit_vest', level: 0},
  ],

  // --- 🏆 Titles & Achievements ---
  activeTitleId: 'none', 
  unlockedTitles: ['none'], 
  totalSteps: 0, 

  // --- 👾 Monster & Collection ---
  collection: {},      // เก็บว่าสะสม Item Drops ครบหรือยัง
  monsterKills: {},    // เก็บจำนวนตัวที่ฆ่าไป { 'bug': 120, 'slime': 50 }

  // --- ✨ Skills & Passives ---
  unlockedPassives: [], 

  unlockedActives: [],

  // ✅ Test Skill Slots
  equippedPassives: [null, null, null], 
  equippedActives: [null, null],

  // --- ⚙️ System States ---
  viewedTutorials: [],
};

export const INITIAL_LOGS = ["🌅 Welcome to your new adventure!"];