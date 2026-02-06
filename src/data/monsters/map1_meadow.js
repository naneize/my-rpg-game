// src/data/monsters/map1_meadow.js
import { itemMaster } from '../itemData';

const getItemLoot = (itemId, chance) => {
  const baseItem = itemMaster[itemId];
  if (!baseItem) {
    console.warn(`Item ID "${itemId}" not found in itemMaster`);
    return { name: itemId, chance, rarity: "Common", image: "❓" };
  }
  return { 
    ...baseItem, 
    chance,
    type: baseItem.slot ? "EQUIPMENT" : "MATERIAL" 
  };
};

export const map1Monsters = [
  // ================= Tier 1: Level 1 =================
  {
    id: 'bug',
    name: "แมลงตัวน้อย",
    type: "INSECT",
    element: "EARTH",
    area: 'meadow',
    rarity: "Common",
    hp: 30, atk: 6, def: 2, 
    image: "/monsters/red_bug.png",
    skills: [
      { name: "Bite", chance: 0.3, description: "กัดด้วยกรามเล็ก สร้างดาเมจกายภาพ 110%" },
      { name: "Bug Carapace", chance: 1.0, condition: "Passive", description: "ลดความเสียหาย 3 หน่วย" }
    ],
    lootTable: [
      { name: "Bug Carapace Skill", rarity: "Uncommon", skillId: "Bug Carapace", type: "SKILL", chance: 0.03 },
      getItemLoot("wooden_sword", 0.04),
      getItemLoot("ปีกแมลงใส", 0.5),
      getItemLoot("หนวดแมลง", 0.4),
      getItemLoot("เปลือกแมลงเก่า", 0.3),
      getItemLoot("ขาแมลงหัก", 0.2),
      getItemLoot("เศษดินติดปีก", 0.15),
      getItemLoot("ละอองปีกแมลง", 0.1),
      getItemLoot("ปีกแมลงสีรุ้ง", 0.03),
      getItemLoot("ดวงตาแมลง", 0.01)
    ],
    collectionBonus: { def: 3, hp: 10 }
  },

  // ================= Tier 2: Level 1-2 =================
  {
    id: 'capterpillar',
    name: "หนอนน้อยขี้เซา",
    type: "INSECT",
    element: "EARTH",
    area: 'meadow',
    rarity: "Common",
    hp: 50, atk: 8, def: 4, 
    image: "/monsters/little_worm.png",
    skills: [
      { name: "Web Shot", chance: 0.25, description: "พ่นใยสร้างดาเมจ 80% และสโลว์" }
    ],
    lootTable: [
      { name: "Caterpillar Silk Skill", rarity: "Uncommon", skillId: "Caterpillar Silk", type: "SKILL", chance: 0.03 },
      getItemLoot("grass_crown", 0.04),
      getItemLoot("ใบไม้ที่ถูกกัด", 0.5),
      getItemLoot("เกราะนิ่มของหนอน", 0.4),
      getItemLoot("สมุนไพรสีเขียว", 0.3),
      getItemLoot("เศษใบหม่อน", 0.2),
      getItemLoot("น้ำลายเหนียว", 0.15),
      getItemLoot("ก้อนใยไหมขยุกขยิก", 0.1),
      getItemLoot("ใบไม้ประกายเงิน", 0.03),
      getItemLoot("ดักแด้สีเงิน", 0.01)
    ],
    collectionBonus: { hp: 30, def: 1 }
  },

  // ================= Tier 3: Level 2 =================
  {
    id: 'grasshopper',
    name: "ตั๊กแตนพริ้วไหว",
    type: "INSECT",
    element: "WIND",
    area: 'meadow',
    rarity: "Common",
    hp: 45, atk: 14, def: 2, 
    image: "/monsters/grashopper.png",
    skills: [
      { name: "Grasshopper Jump", chance: 0.2, description: "กระโดดถีบสร้างดาเมจ 140%" }
    ],
    lootTable: [
      { name: "Grasshopper Jump Skill", rarity: "Uncommon", skillId: "Grasshopper Jump", type: "SKILL", chance: 0.03 },
      getItemLoot("oak_slingshot", 0.04),
      getItemLoot("ขาตั๊กแตน", 0.5),
      getItemLoot("ขนนกสีคราม", 0.4),
      getItemLoot("ปีกตั๊กแตนสีเขียว", 0.3),
      getItemLoot("ฟางแห้ง", 0.2),
      getItemLoot("เศษกิ่งไม้ทุ่งหญ้า", 0.15),
      getItemLoot("หูแมลงนำโชค", 0.08),
      getItemLoot("ขาตั๊กแตนทองคำ", 0.02),
      getItemLoot("หัวใจนักสู้ทุ่งหญ้า", 0.01)
    ],
    collectionBonus: { luck: 3, atk: 2 }
  },

  // ================= Tier 4: Level 3 =================
  {
    id: 'slime',
    name: "สไลม์ทุ่งหญ้า",
    type: "AMORPHOUS",
    element: "WATER",
    area: 'meadow',
    rarity: "Uncommon",
    hp: 75, atk: 12, def: 6, 
    image: "/monsters/slime.png",
    skills: [
      { name: "Jump Attack", chance: 0.3, description: "กระโดดทับสร้างดาเมจน้ำ 130%" }
    ],
    lootTable: [
      { name: "Slime Recovery Skill", rarity: "Uncommon", skillId: "Slime Recovery", type: "SKILL", chance: 0.04 },
      getItemLoot("iron_shield", 0.03),
      getItemLoot("เมือกเหลว", 0.5),
      getItemLoot("สมุนไพรสีเขียว", 0.4),
      getItemLoot("เศษน้ำแข็งจิ๋ว", 0.3),
      getItemLoot("ฟองอากาศในน้ำ", 0.2),
      getItemLoot("แกนสไลม์ใส", 0.1),
      getItemLoot("เมือกสไลม์เข้มข้น", 0.05),
      getItemLoot("อัญมณีสีฟ้า", 0.02),
      getItemLoot("หัวใจสไลม์", 0.01)
    ],
    collectionBonus: { hp: 100, def: 2 }
  },

  // ================= Tier 4.5: Level 3-4 =================
  {
    id: 'plump_rabbit',
    name: "กระต่ายปุยจอมพลัง",
    type: "BEAST",
    element: "NEUTRAL",
    area: 'meadow',
    rarity: "Uncommon",
    hp: 120, atk: 18, def: 10, 
    image: "/monsters/plump_rabbit.png",
    skills: [
      { name: "Power Kick", chance: 0.25, description: "ดีดขาหลังรุนแรง 150%" }
    ],
    lootTable: [
      { name: "Power Kick Skill", rarity: "Uncommon", skillId: "Power Kick", type: "SKILL", chance: 0.04 },
      getItemLoot("rabbit_vest", 0.03), 
      getItemLoot("clover_pendant", 0.03),
      getItemLoot("ขนกระต่ายนุ่ม", 0.5),
      getItemLoot("หูกระต่ายยาว", 0.4),
      getItemLoot("แครอทป่า", 0.3),
      getItemLoot("พู่ขนกระต่าย", 0.2),
      getItemLoot("ฟางแห้ง", 0.15),
      getItemLoot("แครอทสีทอง", 0.05),
      getItemLoot("ฟันกระต่ายยักษ์", 0.02),
      getItemLoot("ตีนกระต่ายนำโชค", 0.01)
    ],
    collectionBonus: { hp: 150, def: 3 }
  },

  // ================= Tier 5: Level 4 =================
  {
    id: 'flower_sprite',
    name: "ภูตดอกไม้ขี้เล่น",
    type: "PLANT",
    element: "EARTH",
    area: 'meadow',
    rarity: "Uncommon",
    hp: 90, atk: 25, def: 5, 
    image: "/monsters/flower_sprite.png",
    skills: [
      { name: "Floral Beam", chance: 0.3, description: "ยิงลำแสงสร้างดาเมจแสง 140%" }
    ],
    lootTable: [
      { name: "Floral Beam Skill", rarity: "Uncommon", skillId: "Floral Beam", type: "SKILL", chance: 0.04 },
      getItemLoot("clover_pendant", 0.03),
      getItemLoot("กลีบดอกไม้หลากสี", 0.5),
      getItemLoot("สมุนไพรสีเขียว", 0.4),
      getItemLoot("เกสรดอกไม้ป่า", 0.3),
      getItemLoot("น้ำหวานดอกไม้", 0.2),
      getItemLoot("เศษกิ่งไม้ทุ่งหญ้า", 0.15),
      getItemLoot("ก้านดอกไม้เหนียว", 0.08),
      getItemLoot("หยดน้ำค้างนิรันดร์", 0.03),
      getItemLoot("น้ำหอมภูต", 0.01)
    ],
    collectionBonus: { atk: 5, luck: 2 }
  },

  // ================= 🛡️ Tier 6: MINI-BOSS =================
  {
    id: 'forest_guardian_bug',
    name: "🛡️ องครักษ์ด้วงเขี้ยวดาบ",
    type: "INSECT",
    element: "EARTH",
    area: 'meadow',
    rarity: "Epic",
    isMiniBoss: true,
    hp: 450, atk: 35, def: 20, 
    image: "/monsters/forest_guardian_bug.png",
    skills: [
      { name: "Horn Toss", chance: 0.3, description: "งัดเป้าหมายสร้างดาเมจกายภาพ 170%" },
      { name: "Solid Guard", chance: 1.0, condition: "Passive", description: "ลดความเสียหายกายภาพ 15%" }
    ],
    lootTable: [
      { name: "Solid Guard Skill", rarity: "Epic", skillId: "Solid Guard", type: "SKILL", chance: 0.02 },
      getItemLoot("hunters_dagger", 0.05),
      getItemLoot("wind_walker_boots", 0.02),
      getItemLoot("เปลือกด้วงหนา", 0.5),
      getItemLoot("เขาด้วงที่หัก", 0.4),
      getItemLoot("เกราะนิ่มของหนอน", 0.3),
      getItemLoot("เปลือกแมลงเก่า", 0.25),
      getItemLoot("หินลับมีดธรรมชาติ", 0.2),
      getItemLoot("ขนนกสีคราม", 0.1),
      getItemLoot("เขาสีครามขององครักษ์", 0.05),
      getItemLoot("หัวใจด้วงเหล็ก", 0.01)
    ],
    collectionBonus: { def: 10, hp: 100, atk: 5 }
  },

  // ================= Tier 5: WORLD BOSS =================
  {
    id: 'meadow_queen_bee',
    name: "👑 ราชินีผึ้งทองคำ",
    type: "INSECT",
    element: "WIND",
    area: 'meadow',
    rarity: "Legendary",
    isBoss: true,
    hp: 1500, atk: 45, def: 25, 
    image: "/monsters/Queen_bee.png",
    skills: [
      { name: "Royal Stinger", chance: 0.3, description: "ดาเมจสายฟ้า 180% ของ ATK" },
      { name: "Honey Shield", chance: 1.0, condition: "Passive", description: "ลดความเสียหายได้รับลง 12%" }
    ],
    lootTable: [
      { name: "Aura Skill", rarity: "Legendary", skillId: "Aura", type: "SKILL", chance: 0.005 }, 
      getItemLoot("lucky_ring", 0.04),
      getItemLoot("wind_walker_boots", 0.03),
      getItemLoot("ดาบสั้นสังหารยักษ์", 0.03),
      getItemLoot("เศษทองชุบเยลลี่", 0.5),
      getItemLoot("สมุนไพรสีทอง", 0.4),
      getItemLoot("เหล็กในผึ้งทหาร", 0.3),
      getItemLoot("น้ำผึ้งหลวง", 0.2),
      getItemLoot("น้ำผึ้งหยดสุดท้าย", 0.1),
      getItemLoot("เหรียญก๊อบลินทองคำ", 0.05),
      getItemLoot("มงกุฎผึ้งจิ๋ว", 0.02),
      getItemLoot("ปีกนางฟ้าสีทอง", 0.01)
    ],
    collectionBonus: { atk: 15, def: 5, hp: 200 }
  },
];