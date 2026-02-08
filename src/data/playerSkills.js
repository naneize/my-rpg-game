// ✅ data/playerSkills.js

export const PLAYER_SKILLS = {
  // ==========================================
  // ⚔️ ATTACK TYPE (STRIKE SLOTS)
  // เน้นทำดาเมจ และให้โบนัส ATK / Crit / Pen
  // ==========================================
  
  fire_blast: {
    id: 'fire_blast',
    name: 'Fire Blast',
    type: 'ATTACK',
    element: 'WATER',
    multiplier: 2.5,
    passiveAtkBonus: 10,  
    passiveCritRate: 0.05, 
    elementPower: 15,
    icon: '🔥',
    description: 'Releases a concentrated burst of flames. Boosts lethality.'
  },

  water_blade: {
    id: 'water_blade',
    name: 'Water Blade',
    type: 'ATTACK',
    element: 'WATER',
    multiplier: 2.1,
    passiveAtkBonus: 5,
    passiveDefBonus: 5,
    elementPower: 12,
    icon: '🌊',
    description: 'A fluid strike that balances offensive and defensive posture.'
  },

  earth_crush: {
    id: 'earth_crush',
    name: 'Earth Crush',
    type: 'ATTACK',
    element: 'EARTH',
    multiplier: 1.8,
    passiveDefBonus: 12,
    passiveMaxHpBonus: 50,
    elementPower: 15,
    icon: '🪨',
    description: 'Smashes the ground with immense force. Significantly hardens armor.'
  },

  wind_vortex: {
    id: 'wind_vortex',
    name: 'Wind Vortex',
    type: 'ATTACK',
    element: 'WIND',
    multiplier: 2.0,
    passiveAtkBonus: 8,
    passivePenBonus: 0.05, 
    elementPower: 12,
    icon: '🌪️',
    description: 'Creates a piercing cyclone. Increases precision and penetration.'
  },

  poison_sting: {
    id: 'poison_sting',
    name: 'Poison Sting',
    type: 'ATTACK',
    element: 'POISON',
    multiplier: 1.6,
    passiveAtkBonus: 15,
    elementPower: 18,
    icon: '🦂',
    description: 'A lethal strike aimed at vitals. Maximizes raw attack power.'
  },

  dark_pulse: {
    id: 'dark_pulse',
    name: 'Dark Pulse',
    type: 'ATTACK',
    element: 'DARK',
    multiplier: 2.8,
    passiveAtkBonus: 20,
    passiveDefBonus: -5, 
    elementPower: 25,
    icon: '🌑',
    description: 'Forbidden energy with massive power, at the cost of durability.'
  },

  // ✨ สกิลใหม่ที่เพิ่มเข้ามา
  thunder_clap: {
    id: 'thunder_clap',
    name: 'Thunder Clap',
    type: 'ATTACK',
    element: 'LIGHT',
    multiplier: 2.4,
    passiveCritRate: 0.10, // 10% Crit
    elementPower: 15,
    icon: '⚡',
    description: 'A blinding strike of electricity. Greatly increases critical potential.'
  },

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
    description: 'Explodes in sub-zero temperatures. Provides chilling defensive layers.'
  },

  // ==========================================
  // 🛡️ SUPPORT/HEAL TYPE (ASSIST SLOTS)
  // เน้นฟื้นฟู ป้องกัน และให้โบนัส HP / DEF / Reflect
  // ==========================================

  holy_shield: {
    id: 'holy_shield',
    name: 'Holy Shield',
    type: 'SUPPORT',
    element: 'LIGHT',
    multiplier: 1.5,
    passiveDefBonus: 15,
    passiveReflect: 0.10, 
    elementPower: 20,
    icon: '🛡️',
    description: 'Creates a sacred barrier. Provides permanent damage reflection.'
  },

  nature_grace: {
    id: 'nature_grace',
    name: 'Nature Grace',
    type: 'HEAL',
    element: 'EARTH',
    multiplier: 1.2,
    passiveMaxHpBonus: 100,
    passiveDefBonus: 5,
    elementPower: 15,
    icon: '🌿',
    description: 'Ancient forest energy that restores health and increases vitality.'
  },

  venom_shroud: {
    id: 'venom_shroud',
    name: 'Venom Shroud',
    type: 'SUPPORT',
    element: 'POISON',
    multiplier: 1.4,
    passiveAtkBonus: 10,
    passiveReflect: 0.05,
    elementPower: 15,
    icon: '🧪',
    description: 'Surrounds the user with toxic gas. Boosts attack and minor reflection.'
  },

  angel_breath: {
    id: 'angel_breath',
    name: 'Angel Breath',
    type: 'HEAL',
    element: 'LIGHT',
    multiplier: 2.0,
    passiveAtkBonus: 5,
    passiveDefBonus: 5,
    elementPower: 25,
    icon: '👼',
    description: 'Divine light that heals wounds and balances core neural stats.'
  },

  abyssal_mirror: {
    id: 'abyssal_mirror',
    name: 'Abyssal Mirror',
    type: 'SUPPORT',
    element: 'DARK',
    multiplier: 1.0,
    passiveReflect: 0.20, // 20% Reflect!!
    passiveMaxHpBonus: -20, // Lowers HP
    elementPower: 30,
    icon: 'ก',
    description: 'Mirror from the void. Reflects massive damage but drains life force.'
  },

  gale_blessing: {
    id: 'gale_blessing',
    name: 'Gale Blessing',
    type: 'SUPPORT',
    element: 'WIND',
    multiplier: 1.3,
    passivePenBonus: 0.08, // 8% Pen
    passiveAtkBonus: 5,
    elementPower: 18,
    icon: '💨',
    description: 'Infuses agility through the wind. Enhances armor-piercing capabilities.'
  }
};