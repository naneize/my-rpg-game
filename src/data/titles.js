// src/data/titles.js

export const titles = [
  {
    id: 'none',
    name: "No Title", 
    description: "Begin your journey and fulfill hidden conditions to unlock your first title!",
    bonusStats: {},
    unlockRequirement: "-",
    rarity: "Common"
  },
  {
    id: 'novice_adventurer',
    name: "Novice Adventurer",
    description: "Restores +5 HP every 5 steps (MaxHP +5)", 
    bonusStats: { maxHp: 5, regenPerSteps: 5 },
    // 🔍 Hint: Walk 20 steps (Logic check is steps >= 5 for testing/initial balance)
    unlockRequirement: "👣 'A journey of a thousand miles begins with enough frequent steps...'",
    rarity: "Common" 
  },
  {
    id: 'bug_crusher',
    name: "🐞 Insect Specialist",
    description: "Insect shells have hardened your resolve (DEF +5)",
    bonusStats: { def: 5 },
    // 🔍 Hint: Collect 8 insect items
    unlockRequirement: "📦 'Collect eight remains of tiny warriors to forge a new defense...'",
    rarity: "Uncommon"
  },
  {
    id: 'slime_slayer',
    name: "Slime Slayer",
    description: "Viscosity cannot slow you down (ATK +3, HP +20)",
    bonusStats: { atk: 3, maxHp: 20 },
    // 🔍 Hint: Kill 30 slimes
    unlockRequirement: "💧 'When the blue jelly is quelled thirty times, the bounce will no longer hinder you...'", 
    rarity: "Uncommon"
  },
  {
    id: 'bee_royal_guard',
    name: "🐝 Hive Conqueror",
    description: "The Queen's aura makes you formidable (ATK +8, LUCK +2)",
    bonusStats: { atk: 8, luck: 2 },
    // 🔍 Hint: Defeat Queen Bee 5 times
    unlockRequirement: "👑 'Clip the wings of the matriarch five times to prove who is the true king...'",
    rarity: "Rare"
  },
  {
    id: 'meadow_master',
    name: "🎒 Meadow Master",
    description: "You are the true sovereign of these lands (All Stats +5)",
    bonusStats: { atk: 5, def: 5, maxHp: 20, luck: 5 },
    // 🔍 Hint: 100% Completion of Meadow
    unlockRequirement: "🌟 'When every secret of the grass is revealed and every treasure is claimed...'",
    rarity: "Legendary"
  },
  {
    id: 'butterfly_chaser',
    name: "🦋 Sky-Wing Chaser",
    description: "The flutter of butterflies brings fortune (LUCK +8)",
    bonusStats: { luck: 8 },
    // 🔍 Hint: Kill 20 butterflies
    unlockRequirement: "✨ 'Capture twenty winged spirits, and their dust shall bring you luck...'",
    rarity: "Uncommon"
  },
  {
    id: 'carrot_thief',
    name: "🥕 Carrot Thief",
    description: "The leg power of rabbits grants vitality (MaxHP +50)",
    bonusStats: { maxHp: 50 },
    // 🔍 Hint: Collect 10 carrots or kill 15 rabbits
    unlockRequirement: "🐾 'Follow fifteen pairs of long-eared tracks to gain a life of longevity...'",
    rarity: "Uncommon"
  },
  {
    id: 'sprite_friend',
    name: "🌸 Sprite Ally",
    description: "The blessing of flower spirits increases attack (ATK +10)",
    bonusStats: { atk: 10 },
    // 🔍 Hint: Collect 8 sprite items
    unlockRequirement: "✨ 'Gather eight gifts from the woodland spirits to receive their blessing...'",
    rarity: "Rare"
  },
  {
    id: 'guardian_breaker',
    name: "🛡️ Fortress Breaker",
    description: "You have passed the test of the Mini-Boss (DEF +15, MaxHP +30)",
    bonusStats: { def: 15, maxHp: 30 },
    // 🔍 Hint: Defeat Beetle Mini-Boss 3 times
    unlockRequirement: "⚔️ 'Overthrow the mighty guardian three times to prove the strength of your arm...'",
    rarity: "Epic"
  }
];

// ✅ Logic Check Function (Remaining 100% original logic)
export const checkTitleUnlock = (titleId, stats, collection) => {
  const steps = stats?.totalSteps || 0;
  const kills = stats?.monsterKills || {};

  switch (titleId) {
    case 'novice_adventurer': return steps >= 5; 
    case 'bug_crusher': return (collection?.['bug']?.length >= 8);
    case 'slime_slayer': return (kills?.['slime'] >= 30);
    case 'bee_royal_guard': return (kills?.['meadow_queen_bee'] >= 5);
    
    // ✅ New Conditions
    case 'butterfly_chaser': return (kills?.['meadow_butterfly'] >= 20);
    case 'carrot_thief': return (kills?.['plump_rabbit'] >= 15);
    case 'sprite_friend': return (collection?.['flower_sprite']?.length >= 8);
    case 'guardian_breaker': return (kills?.['forest_guardian_bug'] >= 3);

    case 'meadow_master':
      const meadowIds = [
        'bug', 'capterpillar', 'grasshopper', 'slime', 
        'meadow_butterfly', 'plump_rabbit', 'flower_sprite', 
        'forest_guardian_bug', 'meadow_queen_bee'
      ];
      return meadowIds.every(id => collection?.[id]?.length >= 8);
      
    default: return false;
  }
};