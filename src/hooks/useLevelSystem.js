import { useEffect, useRef } from 'react';
// ✅ ไม่จำเป็นต้องใช้ calculateFinalStats แล้วถ้าเราจะเด้งแค่ Base HP
// import { calculateFinalStats } from '../utils/statCalculations'; 

export const useLevelSystem = (player, setPlayer, setLogs) => {
  // 🛡️ ใช้ useRef เพื่อจำเลเวลล่าสุดที่แจ้งเตือนไป เพื่อกัน Log ซ้ำ
  const lastLoggedLevel = useRef(player.level);

  useEffect(() => {
    const currentGoal = player.nextLevelExp || 100;
    
    // 1. คำนวณ % ปัจจุบัน (เพื่อให้หลอดขยับตอนได้ EXP ปกติ)
    const currentPercent = Math.min(Math.max((player.exp / currentGoal) * 100, 0), 100);
    
    // ปรับปรุงการเช็คเพื่ออัปเดตเปอร์เซ็นต์ (ใส่ Math.floor เพื่อให้เลขสวยไม่แกว่ง)
    if (Math.abs(player.expPercent - currentPercent) > 0.1) {
       const roundedPercent = Math.floor(currentPercent);
       setPlayer(prev => ({ ...prev, expPercent: roundedPercent }));
    }

    if (player.exp < currentGoal) return;

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

      // 💉 คำนวณ MaxHP ใหม่ (ค่าพลังกายดิบ/Base)
      const newBaseMaxHp = prev.maxHp + (levelCount * 20);
      
      // 📊 คำนวณ % EXP ใหม่ให้แม่นยำหลังเลเวลอัป (ปัดเศษให้เรียบร้อย)
      const newPercent = Math.floor((tempExp / tempMaxExp) * 100);

      return {
        ...prev,
        level: tempLevel,
        exp: tempExp,
        nextLevelExp: tempMaxExp,
        expPercent: newPercent,
        points: (prev.points || 0) + pointsToAdd,
        maxHp: newBaseMaxHp,
        // ✅ [สเน่ห์ของเกม] เติมเลือดให้เท่ากับเลือดพื้นฐานใหม่ (Base HP)
        // ถ้าผู้เล่นมีโบนัสจากชุดหรือสกิล หลอดเลือดจะแหว่งนิดๆ ดูสมจริงและเป็นธรรมชาติครับ
        hp: newBaseMaxHp 
      };
    });
  }, [player.exp, player.nextLevelExp, setPlayer, setLogs]); // ทำงานทุกครั้งที่ค่า Exp เปลี่ยนแปลง
};