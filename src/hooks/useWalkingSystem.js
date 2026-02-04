import { useState, useRef } from 'react';

export const useWalkingSystem = (player, setPlayer, setLogs, isCombat, handleStep) => {
  const [isWalking, setIsWalking] = useState(false);
  const [walkProgress, setWalkProgress] = useState(0);
  
  // 🛡️ ระบบ Lock ป้องกัน Log ฟื้นเลือดซ้ำ
  const lastHealLogStep = useRef(-1);

  const handleWalkingStep = () => {
    // 🛑 ป้องกันการเดินซ้อนกัน หรือเดินขณะสู้
    if (isWalking || isCombat) return; 

    // 🔍 Debug: เช็คว่ามีฟังก์ชัน handleStep ส่งมาจริงไหม
    if (typeof handleStep !== 'function') {
      console.error("❌ Error: useWalkingSystem ไม่ได้รับฟังก์ชัน handleStep จ่ะ!");
    }

    setIsWalking(true);
    setWalkProgress(0);

    const duration = 1000; 
    const intervalTime = 10; 
    const increment = 100 / (duration / intervalTime);

    // ⏳ เริ่ม Animation Progress Bar
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

      setPlayer(prev => {
        const nextSteps = (prev.totalSteps || 0) + 1;
        let currentHp = prev.hp;

        // 🕵️ Logic ฟื้นฟู HP (Passive จากฉายา)
        if (nextSteps % 5 === 0 && prev.activeTitleId === 'novice_adventurer') {
          const healAmount = 5;
          currentHp = Math.min(prev.maxHp, prev.hp + healAmount);

          if (lastHealLogStep.current !== nextSteps) {
            setLogs(l => [`✨ พลังใจฮึดสู้! ฟื้นฟู HP +${healAmount}`, ...l]);
            lastHealLogStep.current = nextSteps;
          }
        }

        return {
          ...prev,
          totalSteps: nextSteps,
          hp: currentHp
        };
      });
        
      // 🚀 สั่งสุ่ม Event/Monster
      // ใส่การเช็คให้ชัวร์ก่อนเรียกใช้จ่ะ
      if (handleStep) {
        console.log("🚶‍♂️ Walking finished! Triggering handleStep...");
        handleStep(); 
      }
    }, duration);
  };

  return { isWalking, walkProgress, handleWalkingStep };
};