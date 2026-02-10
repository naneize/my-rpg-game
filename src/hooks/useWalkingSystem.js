import { useState, useRef } from 'react';

export const useWalkingSystem = (player, setPlayer, setLogs, isCombat, handleStep) => {
  const [isWalking, setIsWalking] = useState(false);
  const [walkProgress, setWalkProgress] = useState(0);
  
  // 🛡️ ระบบ Lock ป้องกัน Log ซ้ำ
  const lastHealLogStep = useRef(-1);

  const handleWalkingStep = () => {
    // 🛑 ป้องกันการเดินซ้อนกัน หรือเดินขณะสู้ หรือกำลังประมวลผล Event
    if (isWalking || isCombat) return; 

    setIsWalking(true);
    setWalkProgress(0);

    const duration = 1000; 
    const intervalTime = 10; 
    const increment = 100 / (duration / intervalTime);

    // ⏳ Animation Progress Bar (วิ่งปี๊ดๆ 1 วินาที)
    const timer = setInterval(() => {
      setWalkProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timer);
          return 100;
        }
        return prev + increment;
      });
    }, intervalTime);

    // ✅ เมื่อเดินเสร็จสิ้น (1 วินาที)
    setTimeout(() => {
      setIsWalking(false);
      setWalkProgress(0);

      // 1. อัปเดตสถานะผู้เล่น (ก้าวเดิน และ ฟื้นฟูพื้นฐาน)
      setPlayer(prev => {
        const nextSteps = (prev.totalSteps || 0) + 1;
        
        // 🧬 ฟื้นฟู HP ทุกๆ 10 ก้าว (ระบบออโต้รีเจนพื้นฐานของโลก Sector-01)
        let currentHp = prev.hp;
        if (nextSteps % 10 === 0 && prev.hp < prev.maxHp) {
          const healAmount = Math.floor(prev.maxHp * 0.05); // ฟื้น 5% ของ MaxHP
          currentHp = Math.min(prev.maxHp, prev.hp + (healAmount || 1));

          if (lastHealLogStep.current !== nextSteps) {
            setLogs(l => [`✨ [SYSTEM] Neural Link ฟื้นฟูพลังงาน +${healAmount}`, ...l].slice(0, 10));
            lastHealLogStep.current = nextSteps;
          }
        }

        return {
          ...prev,
          totalSteps: nextSteps,
          hp: currentHp
        };
      });
        
      // 🚀 2. สั่งสุ่ม Event/Monster (ตัวนี้จะไปเรียก handleStep ใน useTravel)
      if (handleStep) {
        handleStep(); 
      }
    }, duration);
  };

  return { isWalking, walkProgress, handleWalkingStep };
};