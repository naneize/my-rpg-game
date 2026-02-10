export const worldMaps = [
  {
    id: 'meadow',
    name: "Serene Meadow",
    description: "ทุ่งหญ้าแห่งการเริ่มต้นที่รวบรวมสิ่งมีชีวิตทุกระดับ ตั้งแต่แมลงตัวน้อยไปจนถึงบอสในตำนาน",
    recommendedLevel: 1,
    dungeonChance: 15, // เพิ่มโอกาสเจอดันเจี้ยนเพราะเป็นแมพหลักแมพเดียว
    
    // ✅ รวมมอนสเตอร์ทั้งหมดจาก map1Monsters (รวมทั้งตัวที่เพิ่งสร้างใหม่)
    monsterPool: [
      // --- Tier 1: Starter (Level 1-3) ---
      'bug', 'bug_shiny',
      'capterpillar', 'capterpillar_shiny',
      'meadow_fly', 'meadow_fly_shiny',
      'rock_turtle', 'rock_turtle_shiny',

      // --- Tier 2: Field Dwellers (Level 4-7) ---
      'grasshopper', 'grasshopper_shiny',
      'field_mouse', 'field_mouse_shiny',
      'gale_swift', 'gale_swift_shiny',
      'dew_crab', 'dew_crab_shiny',
      'slime', 'slime_shiny',
      'fire_slime', 'fire_slime_shiny',

      // --- Tier 3: Meadow Guards (Level 8-12) ---
      'plump_rabbit', 'plump_rabbit_shiny',
      'meadow_snake', 'meadow_snake_shiny',
      'flower_sprite', 'flower_sprite_shiny',
      'earth_golem_tiny', 'earth_golem_tiny_shiny',
      'meadow_glider', 'meadow_glider_shiny',
      'honey_wasp', 'honey_wasp_shiny',
      'blue_bird', 'blue_bird_shiny',
      'ember_fox', 'ember_fox_shiny',

      // --- Tier 4: Rare Encounters (Level 13-17) ---
      'mossy_crawler', 'mossy_crawler_shiny',
      'forest_wolf', 'forest_wolf_shiny',
      'shadow_bat', 'shadow_bat_shiny',
      'shroom_spirit', 'shroom_spirit_shiny',

      // --- Tier 5: Elite & Mini-Boss (Level 18-25) ---
      'forest_guardian_bug', 'forest_guardian_bug_shiny',
      'ent_young', 'ent_young_shiny',
      'centaur_scout', 'centaur_scout_shiny',
      
      // 🆕 --- Shadow Stalker Series (Void Reaper Drops) ---
      'shadow_stalker', 'shadow_stalker_shiny',
      'void_eater', 'void_eater_shiny',

      // --- Tier 6: World Bosses (Level 30+) ---
      'meadow_queen_bee',
      'elder_treant',
      'storm_griffin',
      'hydra_spawn'
    ],

    icon: "🌿",
    theme: {
      bg: "from-green-600/20 to-slate-900",
      border: "group-hover:border-green-500",
      text: "text-green-500",
      glow: "bg-green-500/10"
    }
  },
];