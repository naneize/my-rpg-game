import { useCallback } from 'react';

export const useSaveSystem = (player, setPlayer, setLogs) => {
  
  // 💾 1. ฟังก์ชันกด Save เอง (คงเดิม)
  const saveGame = useCallback(() => {
    try {
      const saveData = JSON.stringify(player);
      localStorage.setItem('rpg_game_save_v1', saveData);
      
      if (setLogs) {
        setLogs(prev => [`✨ [SYSTEM] บันทึกข้อมูลเรียบร้อย! (${new Date().toLocaleTimeString()})`, ...prev].slice(0, 15));
      }
      
      return true;
    } catch (err) {
      if (setLogs) setLogs(prev => [`⚠️ [ERROR] บันทึกข้อมูลล้มเหลว!`, ...prev]);
      return false;
    }
  }, [player, setLogs]);

  // 📂 2. ฟังก์ชันโหลดเซฟ (คงเดิม)
  const loadGame = useCallback(() => {
    try {
      const saved = localStorage.getItem('rpg_game_save_v1');
      if (saved) {
        const parsed = JSON.parse(saved);
        setPlayer(prev => ({ ...prev, ...parsed }));
        if (setLogs) setLogs(prev => ["📂 โหลดข้อมูลการเดินทางล่าสุดแล้ว", ...prev].slice(0, 10));
        return true;
      }
      return false;
    } catch (err) {
      console.error("Load Error:", err);
      return false;
    }
  }, [setPlayer, setLogs]);

  // 🗑️ 3. ฟังก์ชันลบเซฟ (ฉบับปรับปรุง: ลบ Confirm ออก)
  const clearSave = useCallback(() => {
    // ✅ ลบ window.confirm ออก เพราะเราถามใน ConfirmModal ไปแล้ว
    localStorage.removeItem('rpg_game_save_v1');
    
    // ✅ ลบ window.location.reload() ออก 
    // เพราะ handleStart ใน App.jsx จะจัดการเปลี่ยน State และ GameState ให้เองแบบลื่นไหล
    console.log("Save data cleared.");
  }, []);

  return { saveGame, loadGame, clearSave };
};