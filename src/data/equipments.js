export const EQUIPMENTS = [
  // --- ⚔️ WEAPON (Offensive Armaments) ---

  
  {
    id: 'wooden_sword',
    name: 'Novice Wooden Sword',
    slot: 'WEAPON', 
    type: 'EQUIPMENT',
    rarity: 'Common',
    icon: '🗡️',
    description: 'A practice sword carved from oak. Sturdier than it looks.',
    atk: 5,   // ✅ แก้จาก atk
    def: 0,   // ✅ แก้จาก def
    hp: 0,    // ✅ แก้จาก hp
    atkPercent: 0, // เริ่มต้นยังไม่มีโบนัส % สำหรับ Common
    color: 'text-slate-400',
    glowColor: 'shadow-slate-500/20',
  },
  {
    id: 'oak_slingshot',
    name: 'Oak Wood Slingshot',
    slot: 'WEAPON',
    type: 'EQUIPMENT',
    rarity: 'Common',
    icon: '🏹',
    description: 'A basic ranged weapon, perfect for scaring off meadow birds.',
    atk: 7,
    def: 0,
    hp: 0,
    atkPercent: 0,
    color: 'text-slate-400',
    glowColor: 'shadow-slate-500/10',
  },
  {
    id: 'hunters_dagger',
    name: "Hunter's Dagger",
    slot: 'WEAPON',
    type: 'EQUIPMENT',
    rarity: 'Uncommon',
    icon: '⚔️',
    description: 'A compact steel blade. Sharp, lightweight, and highly mobile.',
    atk: 12,
    def: 0,
    hp: 10,
    atkPercent: 0.02, // +2% ATK (เริ่มเห็นผลเมื่อ ATK สูงขึ้น)
    color: 'text-emerald-400',
    glowColor: 'shadow-emerald-500/20',
  },

  // --- 🛡️ ARMOR (Defensive Gear) ---
  {
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
    color: 'text-slate-400',
    glowColor: 'shadow-slate-500/10',
  },
  {
    id: 'iron_shield',
    name: 'Rusty Iron Shield',
    slot: 'ARMOR',
    type: 'EQUIPMENT',
    rarity: 'Uncommon',
    icon: '🛡️',
    description: 'An old iron shield covered in rust, yet still capable of blocking heavy impacts.',
    atk: 0,
    def: 10,
    hp: 50,
    defPercent: 0.03, // +3% DEF
    color: 'text-emerald-400',
    glowColor: 'shadow-emerald-500/20',
  },
  {
    id: 'wind_walker_boots',
    name: 'Wind Walker Boots',
    slot: 'ARMOR',
    type: 'EQUIPMENT',
    rarity: 'Rare',
    icon: '👢',
    description: 'Boots crafted from premium materials. Light as a summer breeze.',
    atk: 5,
    def: 15,
    hp: 80,
    defPercent: 0.05, // +5% DEF
    hpPercent: 0.02,  // +2% HP
    color: 'text-blue-400',
    glowColor: 'shadow-blue-500/30',
  },

  // --- 💍 ACCESSORY (Trinkets & Jewels) ---
  {
    id: 'grass_crown',
    name: 'Meadow Flower Crown',
    slot: 'ACCESSORY',
    type: 'EQUIPMENT',
    rarity: 'Common',
    icon: '👑',
    description: 'A delicately woven floral crown that brings peace of mind.',
    atk: 0,
    def: 1,
    hp: 10,
    color: 'text-slate-400',
    glowColor: 'shadow-slate-500/10',
  },
  {
    id: 'clover_pendant',
    name: 'Clover Pendant',
    slot: 'ACCESSORY',
    type: 'EQUIPMENT',
    rarity: 'Uncommon',
    icon: '🍀',
    description: 'A rare four-leaf clover preserved in a pendant. Believed to bring luck.',
    atk: 2,
    def: 2,
    hp: 30,
    hpPercent: 0.01, // +1% HP
    color: 'text-emerald-400',
    glowColor: 'shadow-emerald-500/20',
  },
  {
    id: 'lucky_ring',
    name: 'Ring of Fortune',
    slot: 'ACCESSORY',
    type: 'EQUIPMENT',
    rarity: 'Rare',
    icon: '💍',
    description: 'An antique ring said to guide its wearer toward hidden riches.',
    atk: 3,
    def: 3,
    hp: 40,
    luckBonus: 5,   // ค่าพิเศษสำหรับแหวนนำโชค
    color: 'text-blue-400',
    glowColor: 'shadow-blue-500/30',
  },

  {
    id: 'elven_longbow',
    name: 'Elven Heritage Longbow',
    slot: 'WEAPON', rarity: 'Rare', icon: '🏹',
    description: 'A bow that whispers the wind’s secrets with every arrow.',
    type: 'EQUIPMENT',
    atk: 25, def: 0, hp: 0,
    atkPercent: 0.08, // +8% ATK (ระดับ Rare เริ่มเห็นผลชัดเจน)
    color: 'text-blue-400', glowColor: 'shadow-blue-500/30',
  },
  
  {
    id: 'poison_ivy_blade',
    name: 'Poison Ivy Blade',
    slot: 'WEAPON', rarity: 'Rare', icon: '🗡️',
    description: 'Coated in forest toxins. One cut is all it takes.',
    type: 'EQUIPMENT',
    atk: 30, def: 0, hp: 20,
    atkPercent: 10, // +10% ATK
    color: 'text-blue-400', glowColor: 'shadow-blue-500/30',
  },

  // --- 🛡️ NEW ARMOR (Scorched Peaks) ---
  {
    id: 'magma_plate',
    name: 'Magma Forged Plate',
    slot: 'ARMOR', rarity: 'Epic', icon: '🛡️',
    description: 'Heavy armor forged in the heart of a volcano.',
    type: 'EQUIPMENT',
    atk: 10, def: 50, hp: 450,
    defPercent: 0.12, // +12% DEF (ระดับ Epic พลังป้องกันมหาศาล)
    hpPercent: 0.08,  // +8% HP
    color: 'text-purple-400', glowColor: 'shadow-purple-500/40',
  },

  // --- 👑 LEGENDARY (Neural Void) ---
  {
    id: 'infinite_step_core',
    name: 'INFINITE_STEP Core',
    slot: 'ACCESSORY', rarity: 'Legendary', icon: '🌀',
    description: 'The ultimate neural link. You feel the universe in your steps.',
    type: 'EQUIPMENT',
    atk: 100, def: 100, hp: 2500,
    atkPercent: 0.25, // +25% ATK (ระดับตำนานต้องคูณดาเมจหนักๆ)
    defPercent: 0.25, // +25% DEF
    hpPercent: 0.25,  // +25% HP
    color: 'text-orange-500', glowColor: 'shadow-orange-500/60',
  },



  // --- 👑 LEGENDARY (Neural Void - TEST SET) ---
// ชุดอุปกรณ์ระดับสูงสำหรับทดสอบระบบ Scaling ในเลเวล 99

  {
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
    id: 'abyssal_eye_pendant',
    name: 'ABYSSAL EYE PENDANT',
    slot: 'ACCESSORY', rarity: 'Legendary', icon: '👁️',
    description: 'It watches the weaknesses of your enemies.',
    type: 'EQUIPMENT',
    hp: 1500,
    critRate: 0.15, // +15% Crit Rate
    critDamage: 0.50, // +50% Crit Damage
    color: 'text-cyan-400', glowColor: 'shadow-cyan-400/60',
  },
  {
    id: 'dragon_scale_belt',
    name: 'DRAGON SCALE BELT',
    slot: 'BELT', rarity: 'Legendary', icon: '🎗️',
    description: 'Impenetrable defense with a touch of lethal precision.',
    type: 'EQUIPMENT',
    def: 250,
    defPercent: 0.30,
    critRate: 0.10, // +10% Crit Rate
    color: 'text-red-500', glowColor: 'shadow-red-500/60',
  }
];