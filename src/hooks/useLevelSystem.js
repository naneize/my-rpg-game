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
      let levelCount = 0;

      // 🔄 Logic การเลเวลอัป (รองรับกรณี Exp กระโดดข้ามหลายเลเวล)
      while (tempExp >= tempMaxExp) {
        tempExp -= tempMaxExp;
        tempLevel += 1;
        levelCount += 1;
        // สูตรเพิ่มความยากของ Exp เลเวลถัดไป
        tempMaxExp = Math.floor(tempMaxExp * 1.5);
      }

      // 📜 พ่น Log แจ้งเตือนเมื่อเลเวลอัปจริงเท่านั้น (ปรับข้อความให้เข้ากับระบบ Auto)
      if (tempLevel > lastLoggedLevel.current) {
        setLogs(l => [`🎊 เลเวลอัปเป็น ${tempLevel}! พลังโจมตีและป้องกันเพิ่มขึ้นมหาศาล!`, ...l]);
        lastLoggedLevel.current = tempLevel;
      }

      /**
       * 🚀 [HIGH-IMPACT AUTO GROWTH]
       * ปรับตัวเลขให้ "เบิ้ม" ล้อไปกับสเกลมอนสเตอร์ใหม่
       * ทุก 1 เลเวลที่อัป: HP +250, ATK +45, DEF +20
       */
      const newBaseMaxHp = (prev.maxHp || 1000) + (levelCount * 250);
      const newBaseAtk = (prev.atk || 150) + (levelCount * 45);
      const newBaseDef = (prev.def || 80) + (levelCount * 20);
      const newBaseLuck = (prev.luck || 10) + (levelCount * 2);
      
      
      // 📊 คำนวณ % EXP ใหม่ให้แม่นยำหลังเลเวลอัป (ปัดเศษให้เรียบร้อย)
      const newPercent = Math.floor((tempExp / tempMaxExp) * 100);

      return {
        ...prev,
        level: tempLevel,
        exp: tempExp,
        nextLevelExp: tempMaxExp,
        luck: newBaseLuck,
        expPercent: newPercent,
        // ✅ คงตัวแปร points ไว้กันพัง แต่เปลี่ยนไปเพิ่มสเตตัสหลักโดยตรงแทน
        points: (prev.points || 0), 
        atk: newBaseAtk,
        def: newBaseDef,
        maxHp: newBaseMaxHp,
        // ✅ เติมเลือดให้เต็มตาม Base HP ใหม่
        hp: newBaseMaxHp 
      };
    });
  }, [player.exp, player.nextLevelExp, setPlayer, setLogs]); // ทำงานทุกครั้งที่ค่า Exp เปลี่ยนแปลง
};