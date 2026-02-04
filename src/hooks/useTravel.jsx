import { useState } from 'react';
import { travelEvents } from '../data/events.jsx';
import { monsters } from '../data/monsters/index'; 
import { dungeons } from '../data/dungeons';
// ✅ เปลี่ยนมานำเข้า generateFinalMonster แทนจ่ะ
import { generateFinalMonster } from '../utils/monsterUtils';

export function useTravel(player, setPlayer, setLogs, startCombat, currentMap) { 
  const [currentEvent, setCurrentEvent] = useState(null);
  const [inDungeon, setInDungeon] = useState(null);

  // ✅ [คงเดิม] ระบบดันเจี้ยน
  const advanceDungeon = () => {
    setInDungeon(prev => {
      if (!prev) return null;
      return { ...prev, currentStep: prev.currentStep + 1 };
    });
  };

  const exitDungeon = () => { setInDungeon(null); };

  const handleStep = () => {
    if (!currentMap) return;

    if (currentEvent?.type === 'DUNGEON_FOUND') return;
    setCurrentEvent(null);

    // --- 🏰 CASE 1: ในดันเจี้ยน ---
    if (inDungeon) {
      if (inDungeon.currentStep >= inDungeon.steps) {
        const boss = monsters.find(m => m.id === inDungeon.bossId);
        // ✅ 🪄 ปรับพลังบอสให้สมดุลกับเลเวลผู้เล่น + สุ่ม Shiny
        const finalBoss = generateFinalMonster(boss || monsters[0], player, monsters); 
        setLogs(prev => [`👿 ปลายทางของดันเจี้ยน... ${finalBoss.name} ปรากฏตัว!`, ...prev].slice(0, 10));
        startCombat(finalBoss);
      } else {
        const dungeonMonsters = monsters.filter(m => inDungeon.monsterPool.includes(m.id));
        const randomMonster = dungeonMonsters[Math.floor(Math.random() * dungeonMonsters.length)] || monsters[0];
        // ✅ 🪄 ปรับพลังลูกน้องในดันเจี้ยนให้เท่าผู้เล่น
        const processedMonster = generateFinalMonster(randomMonster, player, monsters); 
        setLogs(prev => [`🔦 สำรวจ${inDungeon.name} (${inDungeon.currentStep}/${inDungeon.steps})`, ...prev].slice(0, 10));
        startCombat(processedMonster);
      }
      return;
    }

    // --- 🌍 CASE 2: เดินข้างนอกปกติ ---
    const rand = Math.random();
    
    // ⚔️ 2.1 สุ่มเจอศัตรู
    if (rand < 0.6) {
      let availableMonsters = [];
      
      if (currentMap?.monsterPool) {
        availableMonsters = monsters.filter(m => 
          currentMap.monsterPool.includes(m.id)
        );
      }

      if (availableMonsters.length === 0 && currentMap?.id) {
        availableMonsters = monsters.filter(m => m.area === currentMap.id && !m.isBoss);
      }
  
      if (availableMonsters.length === 0) {
        const targetLevel = currentMap?.recommendedLevel || 1;
        availableMonsters = monsters.filter(m => 
           Math.abs(m.level - targetLevel) <= 2 && !m.isBoss
        );
      }

      console.log(`🗺️ Map: ${currentMap?.id} | Found: ${availableMonsters.length} monsters`);

      const randomMonster = availableMonsters[Math.floor(Math.random() * availableMonsters.length)];
      
      if (randomMonster) {
        // ✅ 🪄 จุดสำคัญ: ส่ง monster และ player เข้าไปปั้น Stat ใหม่ให้สมดุล
        const processedMonster = generateFinalMonster(randomMonster, player, monsters); 
        startCombat(processedMonster);
        setLogs(prev => [`⚔️ อันตราย! พบ ${processedMonster.name}`, ...prev].slice(0, 10));
        return; 
      }
    }

    // 🏰 2.2 สุ่มเจอดันเจี้ยน
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

    // 📍 2.3 อีเวนต์สุ่มทั่วไป
    const availableEvents = travelEvents[currentMap?.id] || travelEvents.meadow;
    const randomEvent = availableEvents[Math.floor(Math.random() * availableEvents.length)];
    if (randomEvent) {
      setCurrentEvent(randomEvent);
      setLogs(prev => [`📍 ${randomEvent.title}`, ...prev].slice(0, 10));
      if (randomEvent.reward) {
        setPlayer(prev => ({ ...prev, gold: prev.gold + randomEvent.reward }));
      }
    }
  };

  const handleEnterDungeon = (dungeonData) => {
    setInDungeon({ ...dungeonData, currentStep: 0 });
    setCurrentEvent(null);
    setLogs(prev => [`🏰 ก้าวเข้าสู่ ${dungeonData.name}...`, ...prev].slice(0, 10));
  };

  return { 
    currentEvent, handleStep, handleEnterDungeon, setCurrentEvent, 
    inDungeon, advanceDungeon, exitDungeon 
  };
}