export const worldMaps = [
  {
    id: 'meadow',
    name: "Serene Meadow",
    description: "ทุ่งหญ้าเริ่มต้นที่แสนสงบ เหมาะสำหรับนักผจญภัยมือใหม่",
    recommendedLevel: 1,
    dungeonChance: 9,
    // ✅ เพิ่มร่าง Shiny ให้ครบทุกตัว (รวมเป็น 8 Species)
    monsterPool: [
      // --- Tier 1-2 ---
      'bug', 'bug_shiny', 
      'capterpillar', 'capterpillar_shiny', 
      
      // --- Tier 2-3 ---
      'grasshopper', 'grasshopper_shiny',
      'meadow_glider','meadow_glider_shiny',
      
      // --- Tier 3-4 ---
      'slime', 'slime_shiny',
      'plump_rabbit', 'plump_rabbit_shiny',
      'mossy_crawler', 'mossy_crawler_shiny',
      
      // --- Tier 4-5 ---
      'flower_sprite', 'flower_sprite_shiny',
      'forest_guardian_bug', 'forest_guardian_bug_shiny', // มินิบอสก็มีร่าง Shiny!
      
      // --- World Boss ---
      'meadow_queen_bee' 
    ],

      // ตั้งค่าธีมสีสำหรับแมพ 1 (ใช้ในหน้าต่อสู้และ Map Selection)
    icon: "🌿",
    theme: {
      bg: "from-green-600/20 to-slate-900",
      border: "group-hover:border-green-500",
      text: "text-green-500",
      glow: "bg-green-500/10"
    }
  },

  //////////////////////////////////////////////
 
];