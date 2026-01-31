import { useState } from 'react';
import { travelEvents } from '../data/events.jsx';
import { monsters } from '../data/monsters';
import { dungeons } from '../data/dungeons';

/**
 * useTravel: จัดการการเดินสำรวจ (ฉบับอัปเดตระบบสุ่มตามธีมแผนที่)
 */
export function useTravel(player, setPlayer, setLogs, startCombat, currentMap) { 
  const [currentEvent, setCurrentEvent] = useState(null);
  const [inDungeon, setInDungeon] = useState(null);

  // ✅ ฟังก์ชันสำหรับเพิ่มก้าว (เรียกจาก useCombat เมื่อชนะ) - คงเดิม 100%
  const advanceDungeon = () => {
    setInDungeon(prev => {
      if (!prev) return null;
      return { ...prev, currentStep: prev.currentStep + 1 };
    });
  };

  // ✅ ฟังก์ชันสำหรับออกจากดันเจี้ยน (เรียกจาก useCombat เมื่อตาย) - คงเดิม 100%
  const exitDungeon = () => {
    setInDungeon(null);
  };

  const handleStep = () => {
    if (currentEvent?.type === 'DUNGEON_FOUND') return;
    setCurrentEvent(null);

    // --- 🏰 CASE 1: ถ้ากำลังอยู่ในดันเจี้ยน (คงเดิม 100%) ---
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

    // 🏆 2.1 [ปรับปรุง] สุ่มเจอดันเจี้ยนตามโอกาสของแผนที่ (Dungeon Discovery)
    const mapDungeonChance = (currentMap?.dungeonChance || 15) / 100; 

    if (rand < mapDungeonChance) {
      const availableDungeons = dungeons.filter(d => player.level >= d.minLevel);
      
      if (availableDungeons.length > 0) {
        const randomDungeon = availableDungeons[Math.floor(Math.random() * availableDungeons.length)];
        setCurrentEvent({ type: 'DUNGEON_FOUND', data: randomDungeon });
        setLogs(prev => [`🏰 [DISCOVERY] คุณพบร่องรอยของดันเจี้ยนใน${currentMap?.name || 'ดินแดนนี้'}!`, ...prev].slice(0, 10));
        return;
      }
    }

    // ⚔️ 2.2 จังหวะสุ่มเจอศัตรู (แก้ไขเพื่อให้สุ่มตามแผนที่ปัจจุบัน)
    if (rand < 0.55) {
      let availableMonsters;

      if (currentMap && currentMap.monsterPool && currentMap.monsterPool.length > 0) {
        availableMonsters = monsters.filter(m => 
          currentMap.monsterPool.includes(m.id) && !m.isBoss
        );
      } 
      
      if (!availableMonsters || availableMonsters.length === 0) {
        availableMonsters = monsters.filter(m => !m.isBoss);
      }

      const randomMonster = availableMonsters[Math.floor(Math.random() * availableMonsters.length)];
      
      startCombat(randomMonster);
      setLogs(prev => [`⚔️ อันตราย! พบ ${randomMonster.name}`, ...prev].slice(0, 10));
      return;
    }

    // 📍 2.3 [อัปเดตใหม่] เจออีเวนต์สุ่มทั่วไปตามธีมแมพ
    // ✅ ดึงลิสต์เหตุการณ์เฉพาะของแผนที่นั้นๆ (ถ้าหาไม่เจอจะถอยไปใช้ meadow)
    const availableEvents = travelEvents[currentMap?.id] || travelEvents.meadow;
    
    // ✅ สุ่มเลือกมา 1 อย่างจากลิสต์ที่ดึงมา
    const randomEvent = availableEvents[Math.floor(Math.random() * availableEvents.length)];

    setCurrentEvent(randomEvent);
    setLogs(prev => [`📍 ${randomEvent.title}`, ...prev].slice(0, 10));

    if (randomEvent.reward) {
      setPlayer(prev => ({ ...prev, gold: prev.gold + randomEvent.reward }));
    }
  };

  // ✅ ฟังก์ชันเข้าดันเจี้ยน - คงเดิม 100%
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
    exitDungeon 
  };
}