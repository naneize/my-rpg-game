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
    const msg = `🛰️ [SIGNAL] ล็อกสัญญาณธาตุ: ${targetElement}`;
    setLogs(prev => [msg, ...prev].slice(0, 10));
  }, [targetElement]);

  // 🔋 ตรวจสอบเมื่อพลังงานหมด
  useEffect(() => {
    if (tuningEnergy <= 0 && targetElement !== 'ALL') {
      setTargetElement('ALL');
      setLogs(prev => [`⚠️ [SYSTEM] พลังงาน Neural Cell หมดลง... กลับสู่โหมด AUTO`, ...prev].slice(0, 10));
    }
  }, [tuningEnergy, targetElement]);

  // ⚡ ฟังก์ชันจูนเนอร์
  const tuneToElement = (element) => {
    if (element === 'ALL') {
      setTargetElement('ALL');
      setTuningEnergy(0);
      return true;
    }

    const cellId = 'neural_cell'; 
    const inventory = player.inventory || [];
    const cellIndex = inventory.findIndex(item => item.id === cellId);

    if (tuningEnergy > 0) {
      setTargetElement(element);
      return true;
    } else if (cellIndex !== -1 && inventory[cellIndex].count > 0) {
      setPlayer(prev => {
        const newInv = [...prev.inventory];
        newInv[cellIndex] = { ...newInv[cellIndex], count: newInv[cellIndex].count - 1 };
        return { ...prev, inventory: newInv.filter(item => item.count > 0) };
      });
      setTuningEnergy(100); 
      setTargetElement(element);
      return true;
    }
    return false; 
  };

  const handleStep = (mapFromStep) => {
    const activeMap = mapFromStep || currentMap;

    console.log("--- 🛰️ INITIATE STEP SCAN ---");
    if (!activeMap || !activeMap.monsterPool) {
      console.error("❌ [DEBUG] Scan Failed: No Map Data");
      return;
    }

    setCurrentEvent(null); // ล้างค่าเก่า

    // 🔋 จัดการพลังงาน Neural Cell
    if (targetElement !== 'ALL' && tuningEnergy > 0) {
      setTuningEnergy(prev => prev - 1);
    }

    let selectedMonster = null;
    let selectedEvent = null;
    const rand = Math.random();
    const mapPoolIds = activeMap.monsterPool || [];

    // ✅ 2. กรองมอนสเตอร์ที่มีอยู่ในแมพนี้
    const availableInMap = monsters.filter(m => mapPoolIds.includes(m.id));
    
    console.log("📍 Active Map:", activeMap.name);
    console.log("📋 Pool IDs:", mapPoolIds);
    console.log("✅ Monsters Found in DB:", availableInMap.map(m => m.id));

    // ⚔️ 3. Logic การสุ่มมอนสเตอร์ (70%)
    if (rand < 0.7 && availableInMap.length > 0) {
      console.log("🎲 Roll: MONSTER (rand < 0.7)");
      let candidates = [];

      if (targetElement === 'ALL') {
        console.log("📡 Mode: AUTO (Scanning all elements)");
        candidates = availableInMap.filter(m => !m.isBoss);
      } else {
        console.log(`📡 Mode: FIXED (${targetElement})`);
        candidates = availableInMap.filter(m => m.element === targetElement && !m.isBoss);
        
        if (candidates.length === 0) {
          console.warn("⚠️ ไม่พบมอนสเตอร์ตรงธาตุ! ใช้ระบบ Failsafe ดึงมอนสเตอร์ทั่วไป");
          candidates = availableInMap.filter(m => !m.isBoss);
        }
      }

      if (candidates.length > 0) {
        selectedMonster = candidates[Math.floor(Math.random() * candidates.length)];
        console.log("⚔️ Selected:", selectedMonster.name);
      }
    }

    // 🚀 4. ตัดสินผลลัพธ์ (สู้มอนสเตอร์)
    if (selectedMonster) {
      const processedMonster = generateFinalMonster(selectedMonster, player, monsters);
      startCombat(processedMonster);

      // ✅ เพิ่มไอคอนให้ครบ 9 ธาตุตามที่ Rework ไป
      const elementIcons = { 
        FIRE: '🔥', 
        WATER: '💧', 
        EARTH: '🌍', 
        WIND: '🌀', 
        LIGHT: '✨', 
        DARK: '🌑', 
        STEEL: '🔩', 
        POISON: '🧪', 
        NORMAL: '⚔️' 
      };
      const icon = processedMonster.isShiny ? '🌈' : (elementIcons[processedMonster.element] || '👾');
      setLogs(prev => [`${icon} [SCAN] พบ ${processedMonster.name} (LV.${processedMonster.level})`, ...prev].slice(0, 10));
      return; // จบก้าวเดินที่การต่อสู้
    }

    // --- 📍 5. ระบบสุ่ม Event (ถ้าไม่เจอมอนสเตอร์) ---
    console.log("🎲 Roll: EVENT / NOTHING");

    const mapSpecificEvents = travelEvents[activeMap?.id] || [];
    
    let eventPool = Array.isArray(mapSpecificEvents) ? [...mapSpecificEvents] : [];
    
    eventPool.push({
      id: 'scavenged_cell',
      title: "🔋 Scavenged Cell",
      description: "คุณพบ Neural Cell เก่าที่ยังใช้งานได้!",
      rewardItem: { id: 'neural_cell', name: 'Neural Cell', type: 'material', count: 1 }
    });

    if (eventPool.length > 0) {
      selectedEvent = eventPool[Math.floor(Math.random() * eventPool.length)];
    }

    if (selectedEvent) {
      console.log("📍 Event Triggered:", selectedEvent.title);
      setCurrentEvent(selectedEvent);

      if (selectedEvent.reward) {
        setPlayer(prev => ({ ...prev, gold: (prev.gold || 0) + selectedEvent.reward }));
      }

      if (selectedEvent.rewardItem) {
        setPlayer(prev => {
          const inv = [...(prev.inventory || [])];
          const exist = inv.find(i => i.id === selectedEvent.rewardItem.id);
          if (exist) {
            // ✅ แก้ไข Logic การบวกจำนวนให้แม่นยำขึ้น (Failsafe)
            const currentCount = Number(exist.count) || 0;
            const addCount = Number(selectedEvent.rewardItem.count) || 1;
            exist.count = currentCount + addCount;
          } else {
            inv.push({ ...selectedEvent.rewardItem });
          }
          return { ...prev, inventory: inv };
        });
      }
    }
  };

  return { currentEvent, handleStep, setCurrentEvent, targetElement, tuneToElement, tuningEnergy };
}