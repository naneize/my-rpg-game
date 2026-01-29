import { useEffect, useRef } from 'react';

export const useLevelSystem = (player, setPlayer, setLogs) => {
  // 🛡️ ใช้ useRef เพื่อจำเลเวลล่าสุดที่แจ้งเตือนไป เพื่อกัน Log ซ้ำ
  const lastLoggedLevel = useRef(player.level);

  useEffect(() => {
    const nextExpGoal = player.nextLevelExp || 100;

    // ถ้า Exp ยังไม่ถึงเป้า ไม่ต้องทำอะไร
    if (player.exp < nextExpGoal) return;

    setPlayer(prev => {
      // ตรวจสอบซ้ำอีกครั้งภายใน setPlayer เพื่อความแม่นยำของ State
      if (prev.exp < (prev.nextLevelExp || 100)) return prev;

      let tempExp = prev.exp;
      let tempLevel = prev.level;
      let tempMaxExp = prev.nextLevelExp || 100;
      let pointsToAdd = 0;
      let levelCount = 0;

      // 🔄 Logic การเลเวลอัป (รองรับกรณี Exp กระโดดข้ามหลายเลเวล)
      while (tempExp >= tempMaxExp) {
        tempExp -= tempMaxExp;
        tempLevel += 1;
        levelCount += 1;
        pointsToAdd += 5;
        // สูตรเพิ่มความยากของ Exp เลเวลถัดไป
        tempMaxExp = Math.floor(tempMaxExp * 1.5);
      }

      // 📜 พ่น Log แจ้งเตือนเมื่อเลเวลอัปจริงเท่านั้น
      if (tempLevel > lastLoggedLevel.current) {
        setLogs(l => [`🎊 เลเวลอัปเป็น ${tempLevel}! (ได้รับแต้ม +${pointsToAdd})`, ...l]);
        lastLoggedLevel.current = tempLevel;
      }

      return {
        ...prev,
        level: tempLevel,
        exp: tempExp,
        nextLevelExp: tempMaxExp,
        points: (prev.points || 0) + pointsToAdd,
        maxHp: prev.maxHp + (levelCount * 20),
        hp: prev.maxHp + (levelCount * 20) // ฟื้นเลือดให้เต็มเมื่อเลเวลอัป
      };
    });
  }, [player.exp, setPlayer, setLogs]); // ทำงานทุกครั้งที่ค่า Exp เปลี่ยนแปลง
};