import { useState } from 'react';
import { travelEvents } from '../data/events.jsx';
import { monsters } from '../data/monsters';
import { dungeons } from '../data/dungeons';

export function useTravel(player, setPlayer, setLogs, startCombat, currentMap) { 
  const [currentEvent, setCurrentEvent] = useState(null);
  const [inDungeon, setInDungeon] = useState(null);

  // ✅ [ฟังก์ชันใหม่] สำหรับจัดการแปลงมอนสเตอร์ธรรมดาให้เป็น Shiny
  const applyShinyLogic = (monster) => {
    // ✨ ปรับเหลือ 1% (0.01) ตามที่คุยกันจ่ะ! ยากแต่แรร์สุดๆ
    const isShiny = Math.random() < 1; 
    if (!isShiny) return monster;

    // ค้นหาข้อมูล Shiny แท้ๆ จาก Data (ถ้ามี) เพื่อให้ได้ค่า Bonus ที่ถูกต้อง
    const shinyData = monsters.find(m => m.id === `${monster.id}_shiny`);

    if (shinyData) {
      return { ...shinyData };
    }

    // กรณีสำรอง: ถ้าไม่มี ID_shiny ในฐานข้อมูล ให้ใช้การคำนวณสด
    return {
      ...monster,
      isShiny: true,
      // ⚔️ สเตตัสเพิ่มขึ้น 2.5 เท่า
      hp: Math.floor(monster.hp * 2.5),
      maxHp: Math.floor(monster.hp * 2.5),
      atk: Math.floor(monster.atk * 2.5),
      def: Math.floor(monster.def * 2.5),
      // 💰 รางวัลเพิ่มขึ้น 3 เท่า
      expReward: Math.floor(monster.expReward * 3),
      goldReward: Math.floor(monster.goldReward * 3),
      // ✨ เพิ่มสัญลักษณ์ในชื่อ
      name: `✨ ${monster.name} (SHINY)`
    };
  };

  const advanceDungeon = () => {
    setInDungeon(prev => {
      if (!prev) return null;
      return { ...prev, currentStep: prev.currentStep + 1 };
    });
  };

  const exitDungeon = () => {
    setInDungeon(null);
  };

  const handleStep = () => {
    if (currentEvent?.type === 'DUNGEON_FOUND') return;
    setCurrentEvent(null);

    // --- 🏰 CASE 1: ในดันเจี้ยน ---
    if (inDungeon) {
      if (inDungeon.currentStep >= inDungeon.steps) {
        const boss = monsters.find(m => m.id === inDungeon.bossId);
        const finalBoss = applyShinyLogic(boss);
        setLogs(prev => [`👿 ปลายทางของดันเจี้ยน... ${finalBoss.name} ปรากฏตัว!`, ...prev].slice(0, 10));
        startCombat(finalBoss);
      } else {
        const dungeonMonsters = monsters.filter(m => inDungeon.monsterPool.includes(m.id));
        const randomMonster = dungeonMonsters[Math.floor(Math.random() * dungeonMonsters.length)];
        
        const processedMonster = applyShinyLogic(randomMonster);
        setLogs(prev => [`🔦 สำรวจ${inDungeon.name} (${inDungeon.currentStep}/${inDungeon.steps})`, ...prev].slice(0, 10));
        startCombat(processedMonster);
      }
      return;
    }

    // --- 🌍 CASE 2: เดินข้างนอกปกติ ---
    const rand = Math.random();

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

    // ⚔️ 2.2 สุ่มเจอศัตรู
    if (rand < 0.55) {
      let availableMonsters = [];
      if (currentMap && currentMap.monsterPool) {
        availableMonsters = monsters.filter(m => 
          currentMap.monsterPool.includes(m.id) && !m.isBoss && !m.isShiny // กรองเอาแค่ตัวธรรมดามาสุ่มจ่ะ
        );
      }
      
      if (availableMonsters.length === 0) {
        availableMonsters = monsters.filter(m => m.level <= 3 && !m.isBoss && !m.isShiny);
      }

      const randomMonster = availableMonsters[Math.floor(Math.random() * availableMonsters.length)];
      
      if (randomMonster) {
        const processedMonster = applyShinyLogic(randomMonster);
        startCombat(processedMonster);
        setLogs(prev => [`⚔️ อันตราย! พบ ${processedMonster.name}`, ...prev].slice(0, 10));
      }
      return;
    }

    // 📍 2.3 อีเวนต์สุ่มทั่วไป
    const availableEvents = travelEvents[currentMap?.id] || travelEvents.meadow;
    const randomEvent = availableEvents[Math.floor(Math.random() * availableEvents.length)];

    setCurrentEvent(randomEvent);
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
    exitDungeon 
  };
}