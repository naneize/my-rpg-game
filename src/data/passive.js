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
  }
];