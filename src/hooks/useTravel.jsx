import { useState, useEffect } from 'react';
import { travelEvents } from '../data/events.jsx';
import { monsters } from '../data/monsters/index'; 
import { generateFinalMonster } from '../utils/monsterUtils';

export function useTravel(player, setPlayer, setLogs, startCombat, currentMap) { 
  const [currentEvent, setCurrentEvent] = useState(null);
  const [targetElement, setTargetElement] = useState('ALL');
  const [tuningEnergy, setTuningEnergy] = useState(0);

  // 🛰️ ระบบ Log แจ้งเตือนเวลาเปลี่ยนคลื่นสัญญาณ
  useEffect(() => {
    if (targetElement === 'ALL') return;
    
    const trollMsgs = [
      `🛰️ [SIGNAL] ล็อคคลื่นความถี่ ${targetElement}... หวังว่าคุณจะเตรียมคอร์มาแก้นะ`,
      `🛰️ [SYSTEM] แฮ็กระบบนิเวศสำเร็จ! มอนสเตอร์ธาตุ ${targetElement} กำลังโดนล่อมาหาคุณ`,
      `🛰️ [NEURAL] กำลังค้นหาพิกัดธาตุ ${targetElement}... (อาจเจอตัวกวนๆ ปนมาด้วยนะ)`
    ];
    const msg = trollMsgs[Math.floor(Math.random() * trollMsgs.length)];
    setLogs(prev => [msg, ...prev].slice(0, 10));
  }, [targetElement, setLogs]);

  // 🔋 ตรวจสอบเมื่อพลังงานหมด
  useEffect(() => {
    if (tuningEnergy <= 0 && targetElement !== 'ALL') {
      setTargetElement('ALL');
      setLogs(prev => [`⚠️ [SYSTEM] พลังงาน Neural Cell หมดลง... กลับสู่โหมด Dynamic`, ...prev].slice(0, 10));
    }
  }, [tuningEnergy, targetElement, setLogs]);

  // ⚡ ฟังก์ชันจูนเนอร์ (แก้ไขเพื่อรองรับการแจ้งเตือน)
  const tuneToElement = (element) => {
    if (element === 'ALL') {
      setTargetElement('ALL');
      setTuningEnergy(0);
      return true;
    }

    const cellId = 'neural_cell'; 
    const hasCell = (player.inventory || []).find(item => item.id === cellId && (item.count || 0) > 0);

    // ✅ กรณีที่ 1: มีพลังงานเหลืออยู่แล้ว (เปลี่ยนธาตุได้เลย)
    if (tuningEnergy > 0) {
      setTargetElement(element);
      return true;
    } 
    // ✅ กรณีที่ 2: พลังงานหมด แต่มี Neural Cell ในตัว (หักไอเทมและเติม 100 ก้าว)
    else if (hasCell) {
      setPlayer(prev => ({
        ...prev,
        inventory: prev.inventory.map(item => 
          item.id === cellId ? { ...item, count: (item.count || 1) - 1 } : item
        ).filter(item => (item.count === undefined || item.count > 0))
      }));
      setTuningEnergy(100); // 🔥 ปรับเป็น 100 ก้าว
      setTargetElement(element);
      setLogs(prev => [`🔋 [CELL USED] ติดตั้งถ่านใหม่! ล็อกสัญญาณ ${element} ได้ 100 ก้าว`, ...prev].slice(0, 10));
      return true;
    } 
    // ❌ กรณีที่ 3: พลังงานหมดและไม่มีไอเทม (คืนค่า false เพื่อแจ้งเตือนที่หน้าจอ)
    else {
      setLogs(prev => [`🚨 [ERROR] พลังงานไม่พอ! ต้องการ Neural Cell 1 ก้อน`, ...prev].slice(0, 10));
      return false; 
    }
  };

  const handleStep = () => {
    if (!currentMap) return;
    setCurrentEvent(null);

    // 🔋 หักพลังงานจูนเนอร์
    if (targetElement !== 'ALL' && tuningEnergy > 0) {
      setTuningEnergy(prev => prev - 1);
    }

    const loopStep = (player?.totalSteps || 0) % 1500;
    let autoBiomeElement = 'EARTH'; 
    if (loopStep > 500 && loopStep <= 1000) autoBiomeElement = 'FIRE';
    if (loopStep > 1000) autoBiomeElement = 'WATER';

    const rand = Math.random();
    
    if (rand < 0.7) {
      let pool = monsters.filter(m => !m.isBoss);
      const activeFilter = targetElement === 'ALL' ? autoBiomeElement : targetElement;
      let finalCandidates = pool.filter(m => m.element === activeFilter);

      if (finalCandidates.length === 0) finalCandidates = pool;

      const randomMonster = finalCandidates[Math.floor(Math.random() * finalCandidates.length)];
      
      if (randomMonster) {
        const processedMonster = generateFinalMonster(randomMonster, player, monsters); 
        startCombat(processedMonster);

        const elementIcons = { FIRE: '🔥', WATER: '💧', EARTH: '🌿', WIND: '🌀', NORMAL: '⚔️' };
        const icon = elementIcons[processedMonster.element] || '👾';
        
        setLogs(prev => [`${icon} [SCAN] ตรวจพบพลังงานธาตุ ${processedMonster.element}: ${processedMonster.name}`, ...prev].slice(0, 10));
        return; 
      }
    }

    const availableEvents = travelEvents.meadow || [];
    let randomEvent = availableEvents[Math.floor(Math.random() * availableEvents.length)];
    
    if (targetElement === 'ALL' && Math.random() < 0.15) {
      randomEvent = {
        title: "🔋 Scavenged Cell",
        description: "คุณพบ Neural Cell เก่าที่ยังใช้งานได้ตกอยู่ในพงหญ้า!",
        rewardItem: { id: 'neural_cell', name: 'Neural Cell', type: 'material', count: 1 }
      };
    }

    if (randomEvent) {
      setCurrentEvent(randomEvent);
      setLogs(prev => [`📍 [LOG] ${randomEvent.title}`, ...prev].slice(0, 10));
      
      if (randomEvent.reward) {
        setPlayer(prev => ({ ...prev, gold: (prev.gold || 0) + randomEvent.reward }));
      }

      if (randomEvent.rewardItem) {
        setPlayer(prev => {
          const inv = [...(prev.inventory || [])];
          const exist = inv.find(i => i.id === randomEvent.rewardItem.id);
          if (exist) {
            exist.count = (exist.count || 1) + (randomEvent.rewardItem.count || 1);
          } else {
            inv.push({ ...randomEvent.rewardItem });
          }
          return { ...prev, inventory: inv };
        });
      }
    }
  };

  return { 
    currentEvent, 
    handleStep, 
    setCurrentEvent,
    targetElement,
    tuneToElement, 
    tuningEnergy   
  };
}