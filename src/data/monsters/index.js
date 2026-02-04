// --- 📥 Import มอนสเตอร์แยกตามแมพ ---
import { map1Monsters } from './map1_meadow';
import { map2Monsters } from './map2_valley';
import { map3Monsters } from './map3_woods';
import { map4Monsters } from './map4_outpost';
import { map5Monsters } from './map5_fortress';
import { map6Monsters } from './map6_core';

/**
 * 🐉 Master Monster List
 * รวมมอนสเตอร์ทั้งหมดจากทุกแมพเข้าด้วยกันเป็น Array เดียว
 * เพื่อให้ระบบใช้สุ่มมอนสเตอร์และแสดงในสมุดภาพ (Archive)
 */
export const monsters = [
  ...map1Monsters,
  ...map2Monsters,
  ...map3Monsters,
  ...map4Monsters,
  ...map5Monsters,
  ...map6Monsters,
];

// --- 💡 Tips การใช้งาน ---
// เวลาจะเรียกใช้ในไฟล์อื่น ให้ import { monsters } from '../data/monsters'; 
// (ถ้าโฟลเดอร์มี index.js มันจะหาเจอเองอัตโนมัติจ่ะ)