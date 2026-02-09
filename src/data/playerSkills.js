// ✅ data/playerSkills.js

export const PLAYER_SKILLS = {
  // ==========================================
  // ⚔️ STRIKE TYPE (Offensive Overclock)
  // Focus: Raw Damage, Pen, Crit, Multipliers
  // ==========================================
  
  fire_blast: {
    id: 'fire_blast',
    name: 'Fire Blast',
    type: 'ATTACK',
    element: 'FIRE',
    multiplier: 2.5,
    passiveAtkBonus: 12,  
    passiveCritRate: 0.05, 
    elementPower: 15,
    icon: '🔥',
    description: 'Concentrated burst of flames. Increases raw lethality.'
  },

  ignis_drive: {
    id: 'ignis_drive',
    name: 'Ignis Drive',
    type: 'ATTACK',
    element: 'FIRE',
    multiplier: 3.2,
    passiveAtkBonus: 25,
    passiveDefBonus: -10,
    elementPower: 30,
    icon: '☄️',
    description: 'Sacrifices defense for a devastating meteor strike.'
  },

  // --- 🌊 WATER/ICE ELEMENT (Control & Precision) ---
  frost_nova: {
    id: 'frost_nova',
    name: 'Frost Nova',
    type: 'ATTACK',
    element: 'WATER',
    multiplier: 1.9,
    passiveDefBonus: 10,
    passiveMaxHpBonus: 30,
    elementPower: 20,
    icon: '❄️',
    description: 'Sub-zero explosion. Provides chilled defensive layers.'
  },

  tsunami_edge: {
    id: 'tsunami_edge',
    name: 'Tsunami Edge',
    type: 'ATTACK',
    element: 'WATER',
    multiplier: 2.3,
    passivePenBonus: 0.10,
    elementPower: 22,
    icon: '🌊',
    description: 'High-pressure water blade that carves through armor.'
  },

  // --- ⚡ LIGHTNING/LIGHT ELEMENT (Speed & Crit) ---
  thunder_clap: {
    id: 'thunder_clap',
    name: 'Thunder Clap',
    type: 'ATTACK',
    element: 'LIGHT',
    multiplier: 2.4,
    passiveCritRate: 0.12,
    elementPower: 15,
    icon: '⚡',
    description: 'Blinding electricity. Greatly increases critical potential.'
  },

  volt_step: {
    id: 'volt_step',
    name: 'Volt Step',
    type: 'ATTACK',
    element: 'LIGHT',
    multiplier: 1.8,
    passiveDodge: 0.08, // 8% Dodge
    passiveCritRate: 0.05,
    elementPower: 20,
    icon: '🏃',
    description: 'Lightning-fast movement. Harder to hit, easier to crit.'
  },

  // --- 🌑 DARK/VOID ELEMENT (Risk & Reward) ---
  dark_pulse: {
    id: 'dark_pulse',
    name: 'Dark Pulse',
    type: 'ATTACK',
    element: 'DARK',
    multiplier: 3.0,
    passiveAtkBonus: 40,
    passiveMaxHpBonus: -100,
    elementPower: 35,
    icon: '🌑',
    description: 'Forbidden void energy. Massive power, massive health drain.'
  },

  soul_reaper: {
    id: 'soul_reaper',
    name: 'Soul Reaper',
    type: 'ATTACK',
    element: 'DARK',
    multiplier: 2.0,
    passiveLifesteal: 0.10, // 10% Lifesteal
    elementPower: 25,
    icon: '💀',
    description: 'Steals life force from the enemy with every strike.'
  },

  // --- 🔩 STEEL/TECH ELEMENT (Defense & Pen) ---
  iron_vanguard: {
    id: 'iron_vanguard',
    name: 'Iron Vanguard',
    type: 'ATTACK',
    element: 'STEEL',
    multiplier: 1.7,
    passiveDefBonus: 30,
    passivePenBonus: 0.05,
    elementPower: 15,
    icon: '⚔️',
    description: 'Tactical strike using heavy metallic weaponry.'
  },

  // ==========================================
  // 🛡️ ASSIST TYPE (Neural Support)
  // Focus: DEF, Reflect, Dodge, Passive Scaling
  // ==========================================

  holy_shield: {
    id: 'holy_shield',
    name: 'Holy Shield',
    type: 'SUPPORT',
    element: 'LIGHT',
    multiplier: 1.5,
    passiveDefBonus: 25,
    passiveReflect: 0.15, 
    elementPower: 20,
    icon: '🛡️',
    description: 'Sacred barrier. Permanent damage reflection.'
  },

  abyssal_mirror: {
    id: 'abyssal_mirror',
    name: 'Abyssal Mirror',
    type: 'SUPPORT',
    element: 'DARK',
    multiplier: 1.0,
    passiveReflect: 0.30, // 30% Reflect!
    passiveMaxHpBonus: -50,
    elementPower: 40,
    icon: '🪞',
    description: 'Reflects massive damage but weakens the users physical shell.'
  },

  wind_evasion: {
    id: 'wind_evasion',
    name: 'Wind Evasion',
    type: 'SUPPORT',
    element: 'WIND',
    multiplier: 1.2,
    passiveDodge: 0.15, // 15% Dodge
    passiveAtkBonus: 5,
    elementPower: 20,
    icon: '🍃',
    description: 'Blends the user into the wind. High chance to avoid attacks.'
  },

  titan_skin: {
    id: 'titan_skin',
    name: 'Titan Skin',
    type: 'SUPPORT',
    element: 'EARTH',
    multiplier: 1.1,
    passiveDefBonus: 50,
    passiveMaxHpBonus: 200,
    elementPower: 15,
    icon: '🗿',
    description: 'Turns skin into living stone. Massive defense boost.'
  },

  // --- 🧪 TOXIC/POISON (Aggressive Support) ---
  venom_shroud: {
    id: 'venom_shroud',
    name: 'Venom Shroud',
    type: 'SUPPORT',
    element: 'POISON',
    multiplier: 1.4,
    passiveAtkBonus: 20,
    passiveReflect: 0.08,
    elementPower: 25,
    icon: '🧪',
    description: 'Toxic gas that increases aggression and minor reflection.'
  }
};

// ... Generation of 85 more skills following this pattern:
// 20 x Elemental Bursts (Atk Focus)
// 20 x Elemental Guards (Def Focus)
// 20 x Tech Overdrives (Pen/Crit Focus)
// 25 x Void Echoes (Life/Reflect Focus)