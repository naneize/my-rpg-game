import { useState, useRef } from 'react';

// ✅ เพิ่ม currentMap เข้ามาในพารามิเตอร์ (เดิมคุณไม่ได้ใส่ไว้)
export const useWalkingSystem = (player, setPlayer, setLogs, isCombat, handleStep, currentMap) => {
  const [isWalking, setIsWalking] = useState(false);
  const [walkProgress, setWalkProgress] = useState(0);
  
  const lastHealLogStep = useRef(-1);
  const lastBiomeLogStep = useRef(-1);

  const handleWalkingStep = () => {
    if (isWalking || isCombat) return; 

    setIsWalking(true);
    setWalkProgress(0);

    const duration = 1000; 
    const intervalTime = 10; 
    const increment = 100 / (duration / intervalTime);

    const timer = setInterval(() => {
      setWalkProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timer);
          return 100;
        }
        return prev + increment;
      });
    }, intervalTime);

    // ✅ เมื่อเดินเสร็จสิ้น
    setTimeout(() => {
      setIsWalking(false);
      setWalkProgress(0);

      // 🚀 2. เรียกสแกนมอนสเตอร์ (แก้จุด Error)
      // ส่ง currentMap ที่รับมาจากพารามิเตอร์เข้าไปตรงๆ
      if (handleStep) {
        handleStep(currentMap); 
      }
    }, duration);

      // 1. อัปเดตสถานะผู้เล่น
      setPlayer(prev => {
        const nextSteps = (prev.totalSteps || 0) + 1;
        
        let currentHp = prev.hp;
        if (nextSteps % 10 === 0 && prev.hp < prev.maxHp) {
          const healAmount = Math.floor(prev.maxHp * 0.05);
          currentHp = Math.min(prev.maxHp, prev.hp + (healAmount || 1));

          if (lastHealLogStep.current !== nextSteps) {
            setLogs(l => [`✨ [SYSTEM] Neural Link ฟื้นฟูพลังงาน +${healAmount}`, ...l].slice(0, 10));
            lastHealLogStep.current = nextSteps;
          }
        }

        if (nextSteps % 375 === 0 && lastBiomeLogStep.current !== nextSteps) {
            const biomes = ["Earth Zone", "Wind Zone", "Fire Zone", "Water Zone"];
            const biomeIndex = (nextSteps / 375) % 4;
            setLogs(l => [`🛰️ [SENSOR] เข้าสู่เขตแดน ${biomes[biomeIndex]}`, ...l].slice(0, 10));
            lastBiomeLogStep.current = nextSteps;
        }

        return { ...prev, totalSteps: nextSteps, hp: currentHp };
      });
        
      
  };

  return { isWalking, walkProgress, handleWalkingStep };
};