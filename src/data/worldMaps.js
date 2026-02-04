export const worldMaps = [
  {
    id: 'meadow',
    name: "Serene Meadow",
    description: "ทุ่งหญ้าเริ่มต้นที่แสนสงบ เหมาะสำหรับนักผจญภัยมือใหม่",
    recommendedLevel: 1,
    dungeonChance: 9,
    // ✅ เพิ่มร่าง Shiny ให้ครบทุกตัว (รวมเป็น 8 Species)
    monsterPool: [
      'caterpillar', 'caterpillar_shiny', 
      'bug', 'bug_shiny', 
      'grasshopper', 'grasshopper_shiny', 
      'slime', 'slime_shiny',
      'meadow_queen_bee'
    ], 
    icon: "🌿",
    theme: {
      bg: "from-green-600/20 to-slate-900",
      border: "group-hover:border-green-500",
      text: "text-green-500",
      glow: "bg-green-500/10"
    }
  },

  //////////////////////////////////////////////
  
  {
    id: 'emerald_valley',
    name: "Emerald Valley",
    description: "หุบเขามรกตที่เริ่มมีสไลม์ดุร้ายและทางเดินที่ลาดชันขึ้น",
    recommendedLevel: 5,
    dungeonChance: 8,
    // ✅ เพิ่มร่าง Shiny ให้ครบทุกตัว (รวมเป็น 8 Species)
    monsterPool: [
      'King_slime', 'King_slime_shiny', 
      'rock_mite', 'rock_mite_shiny', 
      'emerald_slime', 'emerald_slime_shiny', 
      'valley_wolf', 'valley_wolf_shiny'
    ],
    icon: "⛰️",
    theme: {
      bg: "from-emerald-600/20 to-slate-900",
      border: "group-hover:border-emerald-500",
      text: "text-emerald-500",
      glow: "bg-emerald-500/10"
    }
  },

  //////////////////////////////////////////////

  {
    id: 'whispering_woods',
    name: "Whispering Woods",
    description: "ป่าแห่งเสียงกระซิบ ระวังฝีเท้าของคุณให้ดี มีบางอย่างจ้องมองอยู่",
    recommendedLevel: 10,
    dungeonChance: 7,
    // ✅ เพิ่มร่าง Shiny ให้ครบทุกตัว (รวมเป็น 8 Species)
    monsterPool: [
      'wild_boar', 'wild_boar_shiny', 
      'forest_bat', 'forest_bat_shiny', 
      'goblin', 'goblin_shiny', 
      'ent_guardian', 'ent_guardian_shiny'
    ],
    icon: "🌲",
    theme: {
      bg: "from-amber-600/20 to-slate-900",
      border: "group-hover:border-amber-500",
      text: "text-amber-500",
      glow: "bg-amber-500/10"
    }
  },

  //////////////////////////////////////////////

  {
    id: 'goblin_outpost',
    name: "Goblin Outpost",
    description: "หน้าด่านของพวกก๊อบลิน พวกมันเริ่มใช้อาวุธครบมือและโจมตีเป็นระบบ",
    recommendedLevel: 15,
    dungeonChance: 6,
    // ✅ เพิ่มร่าง Shiny ให้ครบทุกตัว (รวมเป็น 8 Species)
    monsterPool: [
      'goblin_shaman', 'goblin_shaman_shiny', 
      'goblin_archer', 'goblin_archer_shiny', 
      'elite_goblin', 'elite_goblin_shiny', 
      'goblin_king', 'goblin_king_shiny'
    ],
    icon: "🏹",
    theme: {
      bg: "from-orange-600/20 to-slate-900",
      border: "group-hover:border-orange-500",
      text: "text-orange-500",
      glow: "bg-orange-500/10"
    }
  },

  //////////////////////////////////////////////

  {
    id: 'dark_fortress',
    name: "Dark Fortress",
    description: "ปราสาททมิฬที่รวบรวมเหล่านักรบที่แกร่งที่สุดไว้ภายใน",
    recommendedLevel: 20,
    dungeonChance: 5,
    // ✅ เพิ่มร่าง Shiny ให้ครบทุกตัว (รวมเป็น 8 Species)
    monsterPool: [
      'skeleton_soldier', 'skeleton_soldier_shiny', 
      'haunted_armor', 'haunted_armor_shiny', 
      'dark_knight', 'dark_knight_shiny', 
      'gargoyle', 'gargoyle_shiny'
    ],
    icon: "🏰",
    theme: {
      bg: "from-rose-700/30 to-slate-900",
      border: "group-hover:border-rose-500",
      text: "text-rose-500",
      glow: "bg-rose-500/10"
    }
  },

  //////////////////////////////////////////////
  {
    id: 'ruin_temple',
    name: "Ruin Temple",
    description: "ซากวิหารโบราณที่เต็มไปด้วยพลังลึกลับและมอนสเตอร์ระดับสูง",
    recommendedLevel: 25,
    dungeonChance: 4,
    // ✅ เพิ่มร่าง Shiny ให้ครบทุกตัว (รวมเป็น 10 Species)
    monsterPool: [
      'fire_elemental', 'fire_elemental_shiny', 
      'magma_slug', 'magma_slug_shiny', 
      'lava_golem', 'lava_golem_shiny', 
      'obsidian_hound', 'obsidian_hound_shiny', 
      'phoenix_boss', 'phoenix_boss_shiny'
    ],
    icon: "🏛️",
    theme: {
      bg: "from-violet-700/30 to-slate-900",
      border: "group-hover:border-violet-500",
      text: "text-violet-500",
      glow: "bg-violet-500/10"
    }
  }
];