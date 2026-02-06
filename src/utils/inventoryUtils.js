import { EQUIPMENTS } from '../data/equipments';

/**
 * 🛠️ ฟังก์ชันสร้างรหัสสุ่ม (Instance ID) ให้กับไอเทมชิ้นใหม่
 */
export const generateInstanceId = () => {
  return `inst-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`;
};

/**
 * 🗡️ ฟังก์ชันดึงข้อมูลไอเทมแบบเต็ม (Join ข้อมูล Base + Instance)
 * ใช้สำหรับแสดงผลในหน้า CharacterView หรือ Inventory
 */
export const getFullItemInfo = (invItem) => {
  const baseData = EQUIPMENTS.find(e => e.id === invItem.itemId);
  if (!baseData) return null;

  return {
    ...baseData,   // ข้อมูลคงที่จาก EQUIPMENTS.js (ชื่อ, ไอคอน, slot)
    ...invItem,    // ข้อมูลเฉพาะตัวจาก Inventory (instanceId, level, bonusAtk)
    // ✅ คำนวณพลังรวม (ตัวอย่าง: พลังพื้นฐาน + พลังตีบวก + พลังสุ่ม)
    totalAtk: (baseData.baseAtk || 0) + (invItem.level * 2) + (invItem.bonusAtk || 0),
    totalDef: (baseData.baseDef || 0) + (invItem.level * 2) + (invItem.bonusDef || 0),
    totalMaxHp: (baseData.baseHp || 0) + (invItem.level * 10) + (invItem.bonusHp || 0),
  };
};

/**
 * 🎲 ฟังก์ชันสุ่มดรอปไอเทมใหม่ (เอาไว้ใช้ในหน้าเดินสำรวจ)
 */
export const createDropItem = (itemId) => {
  return {
    instanceId: generateInstanceId(),
    itemId: itemId,
    level: 0,
    bonusAtk: Math.floor(Math.random() * 3), // สุ่มโบนัส 0-2
    acquiredAt: new Date().toISOString()
  };
};