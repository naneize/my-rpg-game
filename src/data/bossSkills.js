// 📍 src/data/bossSkills.js
export const BOSS_SKILLS = {
  // 1. Primary Attack (Damage + DOT)
  DRAGON_BREATH: {
    id: 'dragon_breath',
    name: "Inferno Dragon Breath",
    description: "Unleashes a torrent of black flames, inflicting BURN status which reduces HP every turn.",
    damageMultiplier: 2.5,
    statusEffect: { type: 'BURN', duration: 3, damagePerTurn: 50 },
    message: "The Dragon King exhales pitch-black flames, incinerating everything in its path!"
  },

  // 2. Debuff Skill
  ANCIENT_ROAR: {
    id: 'ancient_roar',
    name: "Ancient Primal Roar",
    description: "A terrifying roar that causes enemies to tremble, significantly reducing the player's Defense.",
    statusEffect: { type: 'DEBUFF_DEF', value: 50, duration: 3 }, 
    damageMultiplier: 1.2, 
    message: "A deafening roar shatters your resolve! Your Defense has been drastically weakened!"
  },

  // 3. Defense / Counter Skill
  OBSIDIAN_SCALE: {
    id: 'obsidian_scale',
    name: "Obsidian Spiked Scales",
    description: "The dragon's scales stand on end, reflecting 25% of all incoming damage back to the attacker.",
    statusEffect: { type: 'REFLECT_SHIELD', value: 0.25, duration: 3 }, 
    message: "The Dragon spreads its razor-sharp scales! Attacking it will result in heavy reflected damage!"
  },

  // 4. Heavy AoE Damage
  DARK_METEOR: {
    id: 'dark_meteor',
    name: "Cataclysmic Dark Meteor",
    description: "Summons corrupted celestial fragments to crush the enemy.",
    damageMultiplier: 4.0,
    message: "The sky fractures as a giant meteor plunges toward you with unavoidable force!"
  },

  // 5. Ultimate Skill (Trigger when HP < 30%)
  VOID_EXECUTION: {
    id: 'void_execution',
    name: "World Ender: Void Execution",
    description: "Gathers immense dark energy for a final, devastating strike (True Damage).",
    damageMultiplier: 6.0,
    isUltimate: true,
    message: "The Dragon King gathers a sphere of absolute darkness... This is your end!"
  }
};