export const worldMaps = [
  {
    id: 'meadow',
    name: "Serene Meadow",
    description: "ทุ่งหญ้าเริ่มต้นที่แสนสงบ เหมาะสำหรับนักผจญภัยมือใหม่",
    recommendedLevel: 1,
    dungeonChance: 9,
    monsterPool: ['capterpillar', 'slime', 'grasshopper'], 
    icon: "🌿",
    // 🟢 สีเขียว: ปลอดภัย สดใส
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
    description: "หุบเขามรกตที่เริ่มมีสไลม์ดุร้ายและทางเดินที่ลาดชันขึ้น",
    recommendedLevel: 5,
    dungeonChance: 8,
    monsterPool: ['slime', 'emerald_slime'],
    icon: "⛰️",
    // 💹 สีเขียวมรกต: เริ่มมีความลึกลับ
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
    description: "ป่าแห่งเสียงกระซิบ ระวังฝีเท้าของคุณให้ดี มีบางอย่างจ้องมองอยู่",
    recommendedLevel: 10,
    dungeonChance: 7,
    monsterPool: ['emerald_slime', 'goblin'],
    icon: "🌲",
    // 🟡 สีเหลือง/ทอง: การแจ้งเตือนและความระมัดระวัง
    theme: {
      bg: "from-amber-600/20 to-slate-900",
      border: "group-hover:border-amber-500",
      text: "text-amber-500",
      glow: "bg-amber-500/10"
    }
  },
  {
    id: 'goblin_outpost',
    name: "Goblin Outpost",
    description: "หน้าด่านของพวกก๊อบลิน พวกมันเริ่มใช้อาวุธครบมือและโจมตีเป็นระบบ",
    recommendedLevel: 15,
    dungeonChance: 6,
    monsterPool: ['goblin', 'goblin_archer'],
    icon: "🏹",
    // 🟠 สีส้ม: สัญญาณอันตรายและการปะทะ
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
    description: "ปราสาททมิฬที่รวบรวมเหล่านักรบที่แกร่งที่สุดไว้ภายใน",
    recommendedLevel: 20,
    dungeonChance: 5,
    monsterPool: ['goblin_archer', 'goblin_axe'],
    icon: "🏰",
    // 🔴 สีแดงเข้ม: เขตอันตราย (คนละโทนกับสี Danger ของระบบ)
    theme: {
      bg: "from-rose-700/30 to-slate-900",
      border: "group-hover:border-rose-500",
      text: "text-rose-500",
      glow: "bg-rose-500/10"
    }
  },
  {
    id: 'ruin_temple',
    name: "Ruin Temple",
    description: "ซากวิหารโบราณที่เต็มไปด้วยพลังลึกลับและมอนสเตอร์ระดับสูง",
    recommendedLevel: 25,
    dungeonChance: 4,
    monsterPool: ['goblin_archer', 'goblin_axe'],
    icon: "🏛️",
    // 🟣 สีม่วง: ความลึกลับและพลังที่น่าเกรงขาม (End Game)
    theme: {
      bg: "from-violet-700/30 to-slate-900",
      border: "group-hover:border-violet-500",
      text: "text-violet-500",
      glow: "bg-violet-500/10"
    }
  }
];