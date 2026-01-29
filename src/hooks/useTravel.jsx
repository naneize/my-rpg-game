import { useState } from 'react';
import { travelEvents } from '../data/events.jsx';
import { monsters } from '../data/monsters';
import { dungeons } from '../data/dungeons';

export function useTravel(player, setPlayer, setLogs, startCombat) {
  const [currentEvent, setCurrentEvent] = useState(null);
  const [inDungeon, setInDungeon] = useState(null);

  // ✅ ฟังก์ชันสำหรับเพิ่มก้าว (เรียกจาก useCombat เมื่อชนะ)
  const advanceDungeon = () => {
    setInDungeon(prev => {
      if (!prev) return null;
      return { ...prev, currentStep: prev.currentStep + 1 };
    });
  };

  // ✅ เพิ่มฟังก์ชันใหม่: สำหรับออกจากดันเจี้ยน (เรียกจาก useCombat เมื่อตาย)
  const exitDungeon = () => {
    setInDungeon(null);
  };

  const handleStep = () => {
    if (currentEvent?.type === 'DUNGEON_FOUND') return;
    setCurrentEvent(null);

    // --- 🏰 CASE 1: ถ้ากำลังอยู่ในดันเจี้ยน ---
    if (inDungeon) {
      if (inDungeon.currentStep >= inDungeon.steps) {
        const boss = monsters.find(m => m.id === inDungeon.bossId);
        setLogs(prev => [`👿 ปลายทางของดันเจี้ยน... ${boss.name} ปรากฏตัว!`, ...prev].slice(0, 10));
        startCombat(boss);
      } else {
        const dungeonMonsters = monsters.filter(m => inDungeon.monsterPool.includes(m.id));
        const randomMonster = dungeonMonsters[Math.floor(Math.random() * dungeonMonsters.length)];
        
        setLogs(prev => [`🔦 สำรวจ${inDungeon.name} (${inDungeon.currentStep}/${inDungeon.steps})`, ...prev].slice(0, 10));
        startCombat(randomMonster);
      }
      return;
    }

    // --- 🌍 CASE 2: เดินข้างนอกปกติ ---
    const rand = Math.random();

    if (rand < 0.15) {
      const randomDungeon = dungeons[Math.floor(Math.random() * dungeons.length)];
      if (player.level >= randomDungeon.minLevel) {
        setCurrentEvent({ type: 'DUNGEON_FOUND', data: randomDungeon });
        return;
      }
    }

    if (rand < 0.45) {
      const normalMonsters = monsters.filter(m => !m.isBoss);
      const randomMonster = normalMonsters[Math.floor(Math.random() * normalMonsters.length)];
      startCombat(randomMonster);
      setLogs(prev => [`⚔️ อันตราย! พบ ${randomMonster.name}`, ...prev].slice(0, 10));
      return;
    }

    const randomEvent = travelEvents[Math.floor(Math.random() * travelEvents.length)];
    setCurrentEvent(randomEvent)
    setLogs(prev => [`📍 ${randomEvent.title}`, ...prev].slice(0, 10));

    if (randomEvent.reward) {
      setPlayer(prev => ({ ...prev, gold: prev.gold + randomEvent.reward }));
    }
  };

  const handleEnterDungeon = (dungeonData) => {
    setInDungeon({ ...dungeonData, currentStep: 0 });
    setCurrentEvent(null);
    setLogs(prev => [`🏰 ก้าวเข้าสู่ ${dungeonData.name}...`, ...prev].slice(0, 10));
  };

  return { 
    currentEvent, 
    handleStep, 
    handleEnterDungeon, 
    setCurrentEvent, 
    inDungeon,
    advanceDungeon,
    exitDungeon // 👈 ✅ ส่งฟังก์ชันนี้ออกไป
  };
}