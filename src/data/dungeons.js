export const dungeons = [
  {
    id: 'goblin_cave',
    name: "ถ้ำก๊อบลินทมิฬ",
    description: "ถ้ำที่เต็มไปด้วยกลิ่นอับและเสียงหัวเราะแหลมสูง มอนสเตอร์ในนี้ดรอปทองเยอะเป็นพิเศษ",
    minLevel: 6,
    maxLevel: 12,
    steps: 7, // จำนวนครั้งที่ต้องเดินในดันเจี้ยนถึงจะจบ
    difficulty: "Easy",
    themeColor: "from-stone-950 via-orange-950/40 to-stone-900", // พื้นหลังหินมืดไล่เฉดส้มอิฐจางๆ
    borderColor: "border-orange-700/50",                        // ขอบสีส้มอิฐเข้มๆ เหมือนเหล็กสนิมหรือคบไฟ
    accentColor: "bg-orange-600",                               // ปุ่มกดสีส้มคบไฟ สว่างเด่นออกมา
    monsterPool: ['goblin', 'goblin_archer', 'goblin_axe'], // มอนสเตอร์ที่จะสุ่มเจอในนี้
    bossId: 'goblin_king', // บอสที่จะเจอใน Step สุดท้าย
    specialLootChance: 0.03, // โอกาสดรอปของดีขึ้น 5%
  },

    {
    id: 'slime_cave',
    name: "ถ้ำสไลม์",
    description: "ถ้ำที่เต็มไปด้วยเมือกของสไลม์",
    minLevel: 1,
    maxLevel: 5,
    steps: 5, // จำนวนครั้งที่ต้องเดินในดันเจี้ยนถึงจะจบ
    difficulty: "Easy",
    themeColor: "from-slate-950 to-emerald-950", // สีพื้นหลังเฉพาะดันเจี้ยน
    borderColor: "border-emerald-500/50",         // ✅ สีขอบเขียวมรกต
    accentColor: "bg-emerald-600",               // ✅ สีปุ่มเขียว
    monsterPool: ['slime','emerald_slime'], // มอนสเตอร์ที่จะสุ่มเจอในนี้
    bossId: 'King_slime', // บอสที่จะเจอใน Step สุดท้าย
    specialLootChance: 0.03, // โอกาสดรอปของดีขึ้น 5%
  },



];