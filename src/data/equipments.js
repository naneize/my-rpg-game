export const EQUIPMENTS = [
  // --- ⚔️ WEAPON (ดาบและอาวุธโจมตี) ---
  {
    id: 'wooden_sword',
    name: 'ดาบไม้ฝึกหัด',
    slot: 'WEAPON', 
    type: 'EQUIPMENT',
    rarity: 'Common',
    icon: '🗡️', // ดาบไม้พื้นฐาน
    description: 'ดาบไม้ที่ทำจากไม้โอ๊ค แข็งแรงกว่าที่คิด',
    baseAtk: 5,
    baseDef: 0,
    baseHp: 0,
    color: 'text-slate-400',
    glowColor: 'shadow-slate-500/20',
  },
  {
    id: 'oak_slingshot',
    name: 'หนังสติ๊กไม้โอ๊ค',
    slot: 'WEAPON',
    type: 'EQUIPMENT',
    rarity: 'Common',
    icon: '🏹', // ธนู/หนังสติ๊ก
    description: 'อาวุธระยะไกลพื้นฐาน สำหรับไล่นกในทุ่งหญ้า',
    baseAtk: 7,
    baseDef: 0,
    baseHp: 0,
    color: 'text-slate-400',
    glowColor: 'shadow-slate-500/10',
  },
  {
    id: 'hunters_dagger',
    name: 'มีดสั้นนักล่า',
    slot: 'WEAPON',
    type: 'EQUIPMENT',
    rarity: 'Uncommon',
    icon: '⚔️', // ดาบคู่/มีดสั้น
    description: 'มีดเหล็กกะทัดรัด คมกริบและคล่องตัวสูง',
    baseAtk: 12,
    baseDef: 0,
    baseHp: 10,
    color: 'text-emerald-400',
    glowColor: 'shadow-emerald-500/20',
  },

  // --- 🛡️ ARMOR (เกราะและชุดป้องกัน) ---
  {
    id: 'rabbit_vest',
    name: 'เสื้อหนังกระต่าย',
    slot: 'ARMOR',
    type: 'EQUIPMENT',
    rarity: 'Common',
    icon: '🧥', // เสื้อหนัง/เกราะเบา
    description: 'เสื้อหนังแบบบาง ช่วยกันลมและรอยขีดข่วน',
    baseAtk: 0,
    baseDef: 3,
    baseHp: 20,
    color: 'text-slate-400',
    glowColor: 'shadow-slate-500/10',
  },
  {
    id: 'iron_shield',
    name: 'โล่เหล็กผุ',
    slot: 'ARMOR',
    type: 'EQUIPMENT',
    rarity: 'Uncommon',
    icon: '🛡️', // โล่ป้องกัน
    description: 'โล่เหล็กที่มีรอยสนิมเกาะ แต่ยังป้องกันแรงกระแทกได้ดี',
    baseAtk: 0,
    baseDef: 10,
    baseHp: 50,
    color: 'text-emerald-400',
    glowColor: 'shadow-emerald-500/20',
  },
  {
    id: 'wind_walker_boots',
    name: 'รองเท้าลมกรด',
    slot: 'ARMOR',
    type: 'EQUIPMENT',
    rarity: 'Rare',
    icon: '👢', // รองเท้าเกราะ
    description: 'รองเท้าที่ทำจากวัตถุดิบชั้นเลิศ เบาดุจสายลม',
    baseAtk: 5,
    baseDef: 15,
    baseHp: 80,
    color: 'text-blue-400',
    glowColor: 'shadow-blue-500/30',
  },

  // --- 💍 ACCESSORY (เครื่องประดับและอัญมณี) ---
  {
    id: 'grass_crown',
    name: 'มงกุฎดอกหญ้า',
    slot: 'ACCESSORY',
    type: 'EQUIPMENT',
    rarity: 'Common',
    icon: '👑', // มงกุฎ
    description: 'มงกุฎดอกไม้ที่ถักอย่างประณีต ช่วยให้จิตใจเบิกบาน',
    baseAtk: 0,
    baseDef: 1,
    baseHp: 10,
    color: 'text-slate-400',
    glowColor: 'shadow-slate-500/10',
  },
  {
    id: 'clover_pendant',
    name: 'จี้ใบโคลเวอร์',
    slot: 'ACCESSORY',
    type: 'EQUIPMENT',
    rarity: 'Uncommon',
    icon: '🍀', // จี้ใบไม้โชคดี
    description: 'ใบไม้แห่งโชคลาภที่หาได้ยากในทุ่งกว้าง',
    baseAtk: 2,
    baseDef: 2,
    baseHp: 30,
    color: 'text-emerald-400',
    glowColor: 'shadow-emerald-500/20',
  },
  {
    id: 'lucky_ring',
    name: 'แหวนนำโชค',
    slot: 'ACCESSORY',
    type: 'EQUIPMENT',
    rarity: 'Rare',
    icon: '💍', // แหวนอัญมณี
    description: 'แหวนเก่าๆ ที่ว่ากันว่าจะนำพาโชคลาภมาสู่ผู้สวมใส่',
    baseAtk: 3,
    baseDef: 3,
    baseHp: 40,
    color: 'text-blue-400',
    glowColor: 'shadow-blue-500/30',
  }
];