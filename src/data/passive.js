export const MONSTER_SKILLS = [
  // ==========================================
  // 🌿 Map 1: Serene Meadow
  // ==========================================
  {
    id: 'Bug Carapace',
    monster: 'Little Bug',
    name: 'Reflective Shell',
    description: 'Reflects 5% damage and increases defense by 2.',
    element: 'EARTH',
    icon: '🪞',
    rarity: 'Common',
    // 🟢 Neural Sync (ต้องใส่ใน Slot)
    sync: {
      atk: 0,
      def: 2,
      maxHp: 10
    },
    // 🔵 Permanent Link (ปลดล็อกแล้วได้เลย)
    perm: {
      reflectDamage: 0.05,
      elementPower: 5
    }
  },
  {
    id: 'Caterpillar Silk',
    monster: 'Sleepy Caterpillar',
    name: 'Sticky Silk Thread',
    description: 'Provides minor boost to defense and health.',
    element: 'EARTH',
    icon: '🧶',
    rarity: 'Common',
    sync: {
      atk: 0,
      def: 2,
      maxHp: 15
    },
    perm: {
      elementPower: 3
    }
  },
  {
    id: 'Slime Recovery',
    monster: 'Meadow Slime',
    name: 'Jelly Regeneration',
    description: 'Flexible body structure increases maximum health.',
    element: 'WATER',
    icon: '🧪',
    rarity: 'Common',
    sync: {
      atk: 0,
      def: 1,
      maxHp: 30
    },
    perm: {
      elementPower: 3
    }
  },
  {
    id: 'Grasshopper Jump',
    monster: 'Agile Grasshopper',
    name: 'Swift Leap',
    description: 'Boosts attack power through high-velocity strikes.',
    element: 'WIND',
    icon: '🦗',
    rarity: 'Uncommon',
    sync: {
      atk: 6,
      def: 0,
      maxHp: 0
    },
    perm: {
      elementPower: 6
    }
  },
  {
    id: 'Acorn Bomb',
    monster: 'Meadow Squirrel',
    name: 'Deadly Acorn',
    description: 'Increases attack power and tactical precision.',
    element: 'WIND',
    icon: '🌰',
    rarity: 'Uncommon',
    sync: {
      atk: 5,
      def: 2,
      maxHp: 0
    },
    perm: {
      elementPower: 6
    }
  },
  {
    id: 'Spore Burst',
    monster: 'Lazy Moss Worm',
    name: 'Nature Spore Shroud',
    description: 'Grants high endurance and vitality like an ancient forest.',
    element: 'EARTH',
    icon: '🍄',
    rarity: 'Rare',
    sync: {
      atk: 4,
      def: 4,
      maxHp: 50
    },
    perm: {
      elementPower: 10
    }
  },
  {
    id: 'Scale Powder',
    monster: 'Windy Butterfly',
    name: 'Lucky Pollen',
    description: 'Butterfly scales provide a slight luck boost.',
    element: 'WIND',
    icon: '🦋',
    rarity: 'Uncommon',
    sync: {
      atk: 0,
      def: 0,
      maxHp: 0
    },
    perm: {
      critRate: 0.02,
      elementPower: 5
    }
  },
  {
    id: 'Power Kick',
    monster: 'Mighty Rabbit',
    name: 'Leporine Instinct',
    description: 'Strong leg power increases health and attack.',
    element: 'EARTH',
    icon: '🐰',
    rarity: 'Uncommon',
    sync: {
      atk: 4,
      def: 0,
      maxHp: 40
    },
    perm: {
      elementPower: 5
    }
  },
  {
    id: 'Floral Beam',
    monster: 'Playful Flower Sprite',
    name: 'Flora Blessing',
    description: 'Harnesses floral energy to boost attack power.',
    element: 'LIGHT',
    icon: '🌸',
    rarity: 'Uncommon',
    sync: {
      atk: 10,
      def: 0,
      maxHp: 0
    },
    perm: {
      elementPower: 8
    }
  },
  {
    id: 'Solid Guard',
    monster: 'Saber Beetle Guardian',
    name: 'Black Beetle Bastion',
    description: 'Heavy armor reduction and high defense boost.',
    element: 'EARTH',
    icon: '🛡️',
    rarity: 'Epic',
    sync: {
      atk: 0,
      def: 15,
      maxHp: 80
    },
    perm: {
      armorPen: 0.05,
      elementPower: 15
    }
  },
  {
    id: 'Aura', 
    monster: 'Golden Queen Bee',
    name: 'Queenly Majesty',
    description: 'The grace of the Golden Queen boosts all parameters.',
    element: 'LIGHT',
    icon: '👑',
    rarity: 'Legendary',
    sync: {
      atk: 20,
      def: 10,
      maxHp: 150
    },
    perm: {
      elementPower: 25
    }
  },

  // ==========================================
  // 🌲 Map 2: Emerald Valley
  // ==========================================
  {
    id: 'Rock Skin',
    monster: 'Stone Bug',
    name: 'Lithic Hide',
    description: 'Body as hard as stone, significantly boosting defense.',
    element: 'EARTH',
    icon: '🪨',
    rarity: 'Uncommon',
    sync: {
      atk: 0,
      def: 10,
      maxHp: 20
    },
    perm: {
      elementPower: 8
    }
  },
  {
    id: 'Wolf Hunter',
    monster: 'Valley Wolf',
    name: 'Hunter Instinct',
    description: 'The fury of the wolf significantly boosts attack.',
    element: 'FIRE',
    icon: '💢',
    rarity: 'Uncommon',
    sync: {
      atk: 18,
      def: 0,
      maxHp: 0
    },
    perm: {
      critRate: 0.05,
      elementPower: 8
    }
  },
  {
    id: 'Regeneration',
    monster: 'Emerald Slime',
    name: 'Emerald Revival',
    description: 'Forest energy continuously restores the body.',
    element: 'POISON',
    icon: '🌱',
    rarity: 'Uncommon',
    sync: {
      atk: 0,
      def: 5,
      maxHp: 120
    },
    perm: {
      elementPower: 8
    }
  },
  {
    id: 'Frost Bite',
    monster: 'Snow Wolf',
    name: 'Frozen Fangs',
    description: 'Chilling frost power for high attack and defense.',
    element: 'WATER',
    icon: '❄️',
    rarity: 'Rare',
    sync: {
      atk: 30,
      def: 8,
      maxHp: 0
    },
    perm: {
      armorPen: 0.08,
      elementPower: 12
    }
  },
  {
    id: 'Royal Aura',
    monster: 'King Slime',
    name: 'Royal Radiance',
    description: 'The Slime King’s presence boosts all stats.',
    element: 'LIGHT',
    icon: '👑',
    rarity: 'Rare',
    sync: {
      atk: 20,
      def: 20,
      maxHp: 200
    },
    perm: {
      elementPower: 15
    }
  },
  {
    id: 'Diamond Armor',
    monster: 'Diamond Bug',
    name: 'Diamond Carapace',
    description: 'An unbreakable shell that reflects light and damage.',
    element: 'LIGHT',
    icon: '💎',
    rarity: 'Epic',
    sync: {
      atk: 10,
      def: 25,
      maxHp: 100
    },
    perm: {
      reflectDamage: 0.10,
      elementPower: 20
    }
  },
  {
    id: 'Emerald Blessing',
    monster: 'Nine-Jewel Slime',
    name: 'Emerald Grace',
    description: 'Sacred energy that pushes the limits of life.',
    element: 'DARK',
    icon: '✨',
    rarity: 'Epic',
    sync: {
      atk: 15,
      def: 15,
      maxHp: 300
    },
    perm: {
      elementPower: 20
    }
  },
  {
    id: 'Golden Touch',
    monster: 'Golden Emperor Slime',
    name: 'Emperor Touch',
    description: 'Legendary power that transforms everything into strength.',
    element: 'DARK',
    icon: '🔱',
    rarity: 'Legendary',
    sync: {
      atk: 60,
      def: 40,
      maxHp: 600
    },
    perm: {
      reflectDamage: 0.15,
      armorPen: 0.15,
      elementPower: 40
    }
  },

  // ==========================================
  // 🌲 Mid-Game: Growth Boosters
  // ==========================================
  {
    id: 'Wolf Pack Tactics',
    monster: 'Alpha Timber Wolf',
    name: 'Alpha Coordination',
    description: 'Increases attack power based on sheer aggression.',
    element: 'FIRE',
    icon: '🐺',
    rarity: 'Rare',
    sync: {
      atk: 15,
      atkPercent: 0.05, // +5% ATK
      maxHp: 50
    },
    perm: {
      elementPower: 12,
      critRate: 0.03
    }
  },
  {
    id: 'Photosynthesis Plus',
    monster: 'Elder Treant',
    name: 'Rooted Vitality',
    description: 'Harnesses sunlight to significantly expand life force.',
    element: 'EARTH',
    icon: '🌳',
    rarity: 'Rare',
    sync: {
      def: 10,
      hpPercent: 0.08, // +8% HP
      maxHp: 100
    },
    perm: {
      elementPower: 15,
      reflectDamage: 0.02
    }
  },
  {
    id: 'Gale Armor',
    monster: 'Storm Griffin',
    name: 'Aero-Shell',
    description: 'Compresses wind around the body to deflect strikes.',
    element: 'WIND',
    icon: '🌀',
    rarity: 'Rare',
    sync: {
      def: 10,
      defPercent: 0.06, // +6% DEF
      maxHp: 40
    },
    perm: {
      elementPower: 15,
      luck: 10
    }
  },

  // ==========================================
  // 🏰 End-Game: Tactical Mastery
  // ==========================================
  {
    id: 'Viper Strike Master',
    monster: 'Abyssal Hydra',
    name: 'Toxic Dominance',
    description: 'Vastly increases offensive capabilities and critical efficiency.',
    element: 'POISON',
    icon: '🐍',
    rarity: 'Epic',
    sync: {
      atkPercent: 0.12, // +12% ATK
      critDamage: 0.10, // +10% Crit DMG
      maxHp: 150
    },
    perm: {
      elementPower: 25,
      armorPen: 0.10
    }
  },
  {
    id: 'Ancient Guard',
    monster: 'Pebble Golem King',
    name: 'Monolith Protocol',
    description: 'Ancient stone technology that makes the user nearly unshakable.',
    element: 'EARTH',
    icon: '🗿',
    rarity: 'Epic',
    sync: {
      defPercent: 0.15, // +15% DEF
      hpPercent: 0.10,  // +10% HP
      def: 30
    },
    perm: {
      elementPower: 30,
      reflectDamage: 0.08
    }
  },
  {
    id: 'Celestial Wisdom',
    monster: 'Moonlight Butterfly',
    name: 'Lunar Synchronization',
    description: 'Increases luck and critical rate through celestial alignment.',
    element: 'LIGHT',
    icon: '🌙',
    rarity: 'Epic',
    sync: {
      atkPercent: 0.08,
      critRate: 0.07,   // +7% Crit Rate
      maxHp: 100
    },
    perm: {
      elementPower: 25,
      luck: 25
    }
  },

  // ==========================================
  // 🌌 God-Tier: Universal Overlord
  // ==========================================
  {
    id: 'Sovereign Presence',
    monster: 'Dragon King Lord',
    name: 'Draconic Singularity',
    description: 'The ultimate power of the Dragon King, scaling all offensive stats.',
    element: 'FIRE',
    icon: '🐲',
    rarity: 'Legendary',
    sync: {
      atkPercent: 0.20, // +20% ATK
      critRate: 0.10,   // +10% Crit Rate
      critDamage: 0.20  // +20% Crit DMG
    },
    perm: {
      elementPower: 50,
      armorPen: 0.20,
      allStatsPercent: 0.05 // +5% All Stats (ถ้า Logic คุณรองรับ)
    }
  },
  {
    id: 'Eternal Core',
    monster: 'Omega Slime God',
    name: 'Infinite Protoplasm',
    description: 'Total control over life energy, granting immense vitality and defense.',
    element: 'WATER',
    icon: '🔮',
    rarity: 'Legendary',
    sync: {
      hpPercent: 0.30,  // +30% HP
      defPercent: 0.20, // +20% DEF
      maxHp: 1000
    },
    perm: {
      elementPower: 50,
      reflectDamage: 0.15,
      hpRegen: 0.05 // ฟื้นฟูเลือด 5% ทุกเทิร์น (ถ้ามีระบบนี้)
    }
  },
  {
    id: 'Void Reaper',
    monster: 'Shadow Stalker Boss',
    name: 'Entropy Drive',
    description: 'Destroys enemy defenses while boosting the user\'s lethality.',
    element: 'DARK',
    icon: '💀',
    rarity: 'Legendary',
    sync: {
      atkPercent: 0.25,
      armorPen: 0.25,
      defPercent: -0.10 // High risk high reward: ลดพลังป้องกันตัวเองลง 10%
    },
    perm: {
      elementPower: 60,
      critDamage: 0.30
    }
  }
];