import { useEffect } from 'react';
import { titles as allTitles, checkTitleUnlock } from '../data/titles';

// ✅ เพิ่ม gameState เข้ามาใน Parameter
export function useTitleUnlocker(stats, collectionScore, setPlayer, setNewTitlePopup, gameState) {
  useEffect(() => {
    // 🛡️ กั้นไว้: ถ้ายังอยู่หน้า Start Screen หรือยังไม่ได้เริ่มเล่น ไม่ต้องเช็คฉายา
    // วิธีนี้จะช่วยแก้ปัญหา Popup เด้งตั้งแต่หน้าแรกหลังกด F5
    if (gameState === 'START_SCREEN' || !gameState) return;

    allTitles.forEach(title => {
      const isUnlocked = stats.unlockedTitles?.includes(title.id);
      
      // เช็คเงื่อนไขการปลดล็อก
      if (checkTitleUnlock(title.id, stats, collectionScore) && !isUnlocked) {
        setNewTitlePopup(title);
        setPlayer(prev => ({ 
          ...prev, 
          unlockedTitles: [...(prev.unlockedTitles || []), title.id] 
        }));
      }
    });
    
  // ✅ เพิ่ม gameState ใน dependency array เพื่อให้ระบบเริ่มเช็คเมื่อเข้าเกม
  }, [stats.level, stats.totalSteps , stats.monsterKills, collectionScore, stats.unlockedTitles, setPlayer, setNewTitlePopup, gameState]);
}