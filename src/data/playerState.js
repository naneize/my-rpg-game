
const generateId = () => Math.random().toString(36).slice(2, 11);


export const INITIAL_PLAYER_DATA = {


  
  // --- 👤 Core Stats ---
  name: 'Adventurer', 
  level: 1,
  hp: 1000,
  maxHp: 1000,
  atk: 150,   
  def: 80, 
  luck: 15,
  critRate: 0.05,
  critDamage: 1.5,
  exp: 0,
  nextLevelExp: 100,
  points: 5, 

  // --- 💎 Elemental Mastery (Infinite Version!) ---
  // เก็บเลเวลและจำนวนการฆ่าสะสมแยกตามธาตุ พลังจะเพิ่มขึ้นตาม Level ที่สูงขึ้นเรื่อยๆ
  elementalMastery: {
    fire: { level: 1, kills: 0, totalKills: 0 },
    water: { level: 1, kills: 0, totalKills: 0 },
    earth: { level: 1, kills: 0, totalKills: 0 },
    wind: { level: 1, kills: 0, totalKills: 0 },
    light: { level: 1, kills: 0, totalKills: 0 },
    dark: { level: 1, kills: 0, totalKills: 0 },
    poison: { level: 1, kills: 0, totalKills: 0 }
  },

  // เก็บแต้มพลังสุทธิที่คำนวณจากระดับ Mastery (ใช้บวกสเตตัสตรงๆ)
  permanentElementPower: {
    fire: 0, water: 0, earth: 0, wind: 0, light: 0, dark: 0, poison: 0
  },

  materials: {
    scrap: 9999,
    shard: 9999,
    dust: 9999,
    dragon_soul:0,
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

  // --- 🛡️ Equipment Slots ---
  // ต้องมี Slot เหล่านี้เพื่อให้ตรงกับ Gear Fusion Matrix ในหน้า CharacterView

    equipment: {
    weapon: null,
    armor: null,     
    accessory: null,
    belt: null,
    trinket: null,
  },

  inventory: [
    {
      instanceId: `item_${generateId()}`,
       id: 'void_reaver_blade',
    name: 'VOID REAVER BLADE',
    slot: 'WEAPON', rarity: 'Legendary', icon: '⚔️',
    description: 'A blade that tears through the fabric of reality. Crits are inevitable.',
    type: 'EQUIPMENT',
    atk: 500, // พลังโจมตีดิบหลักร้อย
    atkPercent: 0.50, // +50% ATK (เบิ้มๆ)
    critRate: 0.25, // +25% Crit Rate (แรงมาก)
    critDamage: 1.00, // +100% Crit Damage (ดาเมจคริ x2)
    color: 'text-purple-500', glowColor: 'shadow-purple-500/60',
    },
    {
      instanceId: `item_${generateId()}`,
      id: 'rabbit_vest',
      name: 'Rabbit Leather Vest',
      slot: 'ARMOR',
      type: 'EQUIPMENT',
      rarity: 'Common',
      icon: '🧥',
      description: 'A light leather vest that protects against wind and minor scratches.',
      atk: 0,
      def: 3,
      hp: 20,
      hpPercent: 0,
      level: 0,
      color: 'text-slate-400',
      glowColor: 'shadow-slate-500/10',
    }
  ],
  

  // --- 🏆 Progress ---
  totalSteps: 0, 
  activeTitleId: 'none', 
  unlockedTitles: ['none'], 

  monsterKills: {},    // [Stat] เก็บจำนวนที่ฆ่า: { 'slime': 50 }
  collection: {},      // [Gallery] เก็บประวัติการได้รับ: { 'void_blade': true }
  collectionItems: [], // [Storage] เก็บการ์ด/ของสะสมที่เป็น "ชิ้น": [ { id: 'card_01', name: 'Slime Card', amount: 5 } ]

  // --- ✨ Skills & Passives ---
  unlockedPassives: [], 
  unlockedActives: ['plasma_bolt','ember_strike'],

  // ✅ Skill Slots
  equippedPassives: [null, null, null], 
  equippedActives: [],

  // --- ⚙️ System States ---
  viewedTutorials: [],
};

export const INITIAL_LOGS = ["🌅 Welcome to your new adventure!"];