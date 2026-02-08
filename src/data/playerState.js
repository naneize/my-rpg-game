// ใน data/playerState.js

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
  collection: {}, 
  monsterKills: {}, 

  // --- ✨ Skills & Passives ---
  // ✅ ID remains the same for logic, but labels in UI will be English
  unlockedPassives: ['Bug Carapace', 'Caterpillar Silk', 'Grasshopper Jump'], 


  unlockedActives: [
  'fire_blast', 
  'water_blade', 
  'earth_crush', 
  'wind_vortex', 
  'poison_sting', 
  'dark_pulse', 
  'holy_shield', 
  'nature_grace', 
  'venom_shroud', 
  'angel_breath'
],

  // ✅ Test Skill Slots
  equippedPassives: ['Bug Carapace', 'Caterpillar Silk', 'Grasshopper Jump'], 
  equippedActives: ['fire_blast', 'holy_shield'],

  // --- ⚙️ System States ---
  viewedTutorials: [],
};

export const INITIAL_LOGS = ["🌅 Welcome to your new adventure!"];