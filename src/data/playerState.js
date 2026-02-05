// ✅ ลบ import จาก playerStats ออกไปเลยถ้าต้องการตัดภาระไฟล์อื่น
// import { initialStats } from './playerStats'; 

export const INITIAL_PLAYER_DATA = {
  // --- Core Stats ---
  name: '', 
  level: 1,
  hp: 100,
  maxHp: 100,
  atk: 10,
  def: 5,
  luck: 5,
  exp: 0,
  nextLevelExp: 100,
  points: 0,

  // --- Systems ---
  activeTitleId: 'none', 
  unlockedTitles: ['none'], 
  totalSteps: 0,
  inventory: [],
  collection: {}, // คลังสะสมมอนสเตอร์
  viewedTutorials: [],
  
  // ✅ ลบ equippedWeapon และ inbox ออกไปแล้วตามที่คุณต้องการ
};

export const INITIAL_LOGS = ["🌅 ยินดีต้อนรับสู่การผจญภัยครั้งใหม่!"];