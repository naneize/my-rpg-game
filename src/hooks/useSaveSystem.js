import { useCallback } from 'react';

export const useSaveSystem = (player, setPlayer, setLogs) => {
  
  const SAVE_KEY = 'rpg_game_save_v1'; // ตั้งเป็นค่ากลางเพื่อกันพิมพ์ผิด

  // 💾 1. ฟังก์ชันกด Save เอง (ปรับปรุงให้ดึงค่าล่าสุดชัวร์ๆ)
  const saveGame = useCallback(() => {
    try {
      // ตรวจสอบเบื้องต้นว่ามีข้อมูลที่ควรเซฟไหม
      if (!player || !player.name) return false;

      const saveData = JSON.stringify(player);
      localStorage.setItem(SAVE_KEY, saveData);
      
      if (setLogs) {
        setLogs(prev => [`✨ [SYSTEM] บันทึกข้อมูลเรียบร้อย! (${new Date().toLocaleTimeString()})`, ...prev].slice(0, 15));
      }
      
      console.log("💾 ข้อมูลถูกเขียนลง LocalStorage แล้ว");
      return true;
    } catch (err) {
      console.error("Save Error:", err);
      if (setLogs) setLogs(prev => [`⚠️ [ERROR] บันทึกข้อมูลล้มเหลว!`, ...prev]);
      return false;
    }
  }, [player, setLogs]); // บันทึกใหม่ทุกครั้งที่ player เปลี่ยน

  // 📂 2. ฟังก์ชันโหลดเซฟ (ปรับปรุงการ Set State ให้คลีนขึ้น)
  const loadGame = useCallback(() => {
    try {
      const saved = localStorage.getItem(SAVE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        
        // ✅ แก้ไข: Merge ข้อมูลเดิมเข้ากับโครงสร้างล่าสุด เพื่อป้องกันบั๊กเวลาเราแก้โค้ดเพิ่ม
        setPlayer(prev => ({
          ...prev,    // เอาโครงสร้างปัจจุบัน (ที่มีระบบอาวุธ)
          ...parsed,  // เอาข้อมูลจากเซฟมาทับ (ชื่อ, เลเวล, ของ)
        })); 
        
        if (setLogs) setLogs(prev => ["📂 โหลดข้อมูลการเดินทางล่าสุดแล้ว", ...prev].slice(0, 10));
        return true;
      }
      return false;
    } catch (err) {
      console.error("Load Error:", err);
      return false;
    }
  }, [setPlayer, setLogs]);

  // 🗑️ 3. ฟังก์ชันลบเซฟ (คงเดิมตามที่คุณปรับปรุง)
  const clearSave = useCallback(() => {
    localStorage.removeItem(SAVE_KEY);
    console.log("Save data cleared.");
  }, []);

  return { saveGame, loadGame, clearSave };
};