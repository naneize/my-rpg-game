import { useState } from 'react';
import { travelEvents } from '../data/events.jsx';
import { monsters } from '../data/monsters/index';
import { dungeons } from '../data/dungeons';

export function useTravel(player, setPlayer, setLogs, startCombat, currentMap) { 
  const [currentEvent, setCurrentEvent] = useState(null);
  const [inDungeon, setInDungeon] = useState(null);

  // ✅ [คงเดิม] สำหรับจัดการแปลงมอนสเตอร์ธรรมดาให้เป็น Shiny
  const applyShinyLogic = (monster) => {
    // ถ้ามอนสเตอร์ที่สุ่มมาได้เป็น Shiny อยู่แล้ว (จาก Pool) ไม่ต้องสุ่มซ้ำจ่ะ
    if (monster.isShiny) return monster;

    const isShiny = Math.random() < 0.03; 
    if (!isShiny) return monster;

    const shinyData = monsters.find(m => m.id === `${monster.id}_shiny`);
    if (shinyData) return { ...shinyData };

    return {
      ...monster,
      isShiny: true,
      hp: Math.floor(monster.hp * 2.5),
      maxHp: Math.floor(monster.maxHp * 2.5),
      atk: Math.floor(monster.atk * 2.5),
      def: Math.floor(monster.def * 2.5),
      exp: Math.floor((monster.exp || 10) * 3),
      gold: Math.floor((monster.gold || 5) * 3),
      name: `✨ ${monster.name} (SHINY)`
    };
  };

  // ✅ [คงเดิม] ระบบดันเจี้ยน
  const advanceDungeon = () => {
    setInDungeon(prev => {
      if (!prev) return null;
      return { ...prev, currentStep: prev.currentStep + 1 };
    });
  };

  const exitDungeon = () => { setInDungeon(null); };

  const handleStep = () => {
    if (currentEvent?.type === 'DUNGEON_FOUND') return;
    setCurrentEvent(null);

    // --- 🏰 CASE 1: ในดันเจี้ยน (คงเดิม 100%) ---
    if (inDungeon) {
      if (inDungeon.currentStep >= inDungeon.steps) {
        const boss = monsters.find(m => m.id === inDungeon.bossId);
        const finalBoss = applyShinyLogic(boss || monsters[0]);
        setLogs(prev => [`👿 ปลายทางของดันเจี้ยน... ${finalBoss.name} ปรากฏตัว!`, ...prev].slice(0, 10));
        startCombat(finalBoss);
      } else {
        const dungeonMonsters = monsters.filter(m => inDungeon.monsterPool.includes(m.id));
        const randomMonster = dungeonMonsters[Math.floor(Math.random() * dungeonMonsters.length)] || monsters[0];
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
      
      // ✅ [แก้ไขให้ตรง Pool] ดึงทุกอย่างที่เธอใส่ไว้ใน monsterPool ของแมพนั้นๆ
      if (currentMap && currentMap.monsterPool) {
        availableMonsters = monsters.filter(m => 
          currentMap.monsterPool.includes(m.id) // 👈 เอาทุกตัวที่อยู่ในลิสต์ ไม่ว่าจะ Boss หรือ Shiny
        );
      }
      
      if (availableMonsters.length === 0) {
        availableMonsters = monsters.filter(m => m.level <= 3 && !m.isBoss && !m.isShiny);
      }

      const randomMonster = availableMonsters[Math.floor(Math.random() * availableMonsters.length)];
      
      if (randomMonster) {
        // ส่งเข้า applyShinyLogic เพื่อสุ่มโอกาส Shiny 1% สำหรับตัวที่ยังไม่เป็น Shiny จ่ะ
        const processedMonster = applyShinyLogic(randomMonster);
        startCombat(processedMonster);
        setLogs(prev => [`⚔️ อันตราย! พบ ${processedMonster.name}`, ...prev].slice(0, 10));
      }
      return;
    }

    // 📍 2.3 อีเวนต์สุ่มทั่วไป (คงเดิม 100%)
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
    currentEvent, handleStep, handleEnterDungeon, setCurrentEvent, 
    inDungeon, advanceDungeon, exitDungeon 
  };
}