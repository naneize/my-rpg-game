// ✅ worldMaps.js (The Complete Serene Meadow Edition)

export const worldMaps = [
  {
    id: 'meadow',
    name: "Serene Meadow",
    description: "ทุ่งหญ้าแห่งการเริ่มต้นที่รวบรวมสิ่งมีชีวิตทุกระดับ ตั้งแต่แมลงตัวน้อยไปจนถึงบอสในตำนาน ครบทุกธาตุและทุกระดับพลัง",
    recommendedLevel: 1,
    dungeonChance: 15, 
    
    // ✅ อัปเดต Pool ให้รองรับไอดีมอนสเตอร์ทั้งหมด (28 ตัวเดิม + ตัวใหม่ที่แม่เพิ่ม)
    monsterPool: [
      // --- 🌍 EARTH ELEMENT ---
      'bug', 'rock_turtle', 'flower_sprite', 'root_strider', 
      'earth_golem_tiny', 'forest_guardian_bug', 'elder_treant', 'world_eater_worm',

      // --- 🌬️ WIND ELEMENT ---
      'meadow_fly', 'grasshopper', 'gale_swift', 'meadow_glider', 
      'cloud_manta', 'centaur_scout', 'meadow_queen_bee', 'storm_griffin', 'cyber_dragon_young',

      // --- 💧 WATER ELEMENT ---
      'slime', 'dew_crab', 'ice_spirit', 'tsunami_eel', 'hydra_spawn',

      // --- 🔥 FIRE ELEMENT ---
      'fire_slime', 'magma_slug', 'ember_fox', 'blaze_hound', 'phoenix_chick',

      // --- ✨ LIGHT ELEMENT ---
      'flower_sprite_light', 'shroom_spirit', 'holy_sentinel',

      // --- 🌑 DARK/NEUTRAL ELEMENT ---
      'meadow_snake', 'field_mouse', 'shadow_bat', 'forest_wolf', 
      'nightmare_shade', 'void_stalker',

      // --- 🔩 STEEL ELEMENT ---
      'iron_wasp', 'cyber_drone', 'shield_titan', 'ancient_golem',

      // --- 🧪 POISON ELEMENT ---
      'plague_rat', 'mossy_crawler', 'venom_weaver'
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