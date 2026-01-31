export const worldMaps = [
  {
    id: 'meadow',
    name: "Serene Meadow",
    description: "ทุ่งหญ้าเริ่มต้นสำหรับนักผจญภัยมือใหม่ เต็มไปด้วยสไลม์และหนอนตัวจ้อยที่เป็นมิตร... มั้งนะ?",
    recommendedLevel: 1,
    dungeonChance: 10,
    monsterPool: ['capterpillar', 'slime'], 
    icon: "🌿",
    // 🎨 สีเขียวสดใส
    theme: {
      bg: "from-green-600/20 to-slate-900",
      border: "group-hover:border-green-500",
      text: "text-green-500",
      glow: "bg-green-500/10"
    }
  },
  {
    id: 'emerald_valley',
    name: "Emerald Valley",
    description: "หุบเขาลึกที่เริ่มมีสไลม์สายพันธุ์ดุร้ายโผล่ออกมา แสงสีเขียวมรกตที่นี่อาจเป็นกับดัก",
    recommendedLevel: 5,
    dungeonChance: 8,
    monsterPool: ['slime', 'emerald_slime'],
    icon: "⛰️",
    // 🎨 สีเขียวมรกตเข้ม
    theme: {
      bg: "from-emerald-600/20 to-slate-900",
      border: "group-hover:border-emerald-500",
      text: "text-emerald-500",
      glow: "bg-emerald-500/10"
    }
  },
  {
    id: 'whispering_woods',
    name: "Whispering Woods",
    description: "ป่าทึบที่เริ่มมีพวกก๊อบลินมาตั้งรกราก เสียงกระซิบของมันจะล่อลวงคุณไปสู่ความตาย",
    recommendedLevel: 10,
    dungeonChance: 7,
    monsterPool: ['emerald_slime', 'goblin'],
    icon: "🌲",
    // 🎨 สีน้ำเงินอมเขียว (Teal)
    theme: {
      bg: "from-teal-600/20 to-slate-900",
      border: "group-hover:border-teal-500",
      text: "text-teal-500",
      glow: "bg-teal-500/10"
    }
  },
  {
    id: 'goblin_outpost',
    name: "Goblin Outpost",
    description: "ค่ายทหารกองหน้าของเผ่าก๊อบลิน พวกมันเริ่มใช้อาวุธครบมือทั้งธนูและดาบ",
    recommendedLevel: 15,
    dungeonChance: 5,
    monsterPool: ['goblin', 'goblin_archer'],
    icon: "🏹",
    // 🎨 สีส้มแดง
    theme: {
      bg: "from-orange-600/20 to-slate-900",
      border: "group-hover:border-orange-500",
      text: "text-orange-500",
      glow: "bg-orange-500/10"
    }
  },
  {
    id: 'dark_fortress',
    name: "Dark Fortress",
    description: "ปราสาททมิฬที่เป็นฐานบัญชาการใหญ่ ที่นี่คือที่อยู่ของเหล่านักรบก๊อบลินที่แกร่งที่สุด",
    recommendedLevel: 20,
    dungeonChance: 4,
    monsterPool: ['goblin_archer', 'goblin_axe'],
    icon: "🏰",
    // 🎨 สีแดงเลือดหมู
    theme: {
      bg: "from-red-700/30 to-slate-900",
      border: "group-hover:border-red-500",
      text: "text-red-500",
      glow: "bg-red-500/10"
    }
  }
];