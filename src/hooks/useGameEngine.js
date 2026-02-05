// ✅ 1. การ Import (คงเดิมไว้)
import { useCombat } from './useCombat';
import { useTravel } from './useTravel';
import { useWalkingSystem } from './useWalkingSystem';
import { useEffect } from 'react';
import { updateOnlineStatus } from '../firebase';

export function useGameEngine({
  player,
  setPlayer,
  setLogs,
  totalStatsPlayer,
  collectionBonuses,
  gameState,
  setGameState,
  currentMap,
  setCurrentMap,
  saveGame
}) {
  
  // ✅ 2. Combat
  const combat = useCombat(
    totalStatsPlayer, 
    setPlayer, 
    setLogs, 
    null, 
    null, 
    null, 
    collectionBonuses, 
    { currentMap, setCurrentMap, gameState, setGameState }
  );

  // ✅ 3. Travel
  const travel = useTravel(
    totalStatsPlayer, 
    setPlayer, 
    setLogs, 
    (monster) => combat.startCombat(monster), 
    currentMap
  );

  // ✅ 4. Walking
  const walking = useWalkingSystem(
    totalStatsPlayer, 
    setPlayer, 
    setLogs, 
    combat.isCombat, 
    (steps) => travel.handleStep(steps)
  );

  // ✅ 5. ลิงก์ระบบ Dungeon (คงไว้เพื่อความต่อเนื่องของเกม)
  useEffect(() => {
    combat.advanceDungeon = travel.advanceDungeon;
    combat.exitDungeon = travel.exitDungeon;
    combat.inDungeon = travel.inDungeon;
  }, [travel.advanceDungeon, travel.exitDungeon, travel.inDungeon]);

  // ✅ 6. Firebase Status
  useEffect(() => {
    if (player.name?.trim() !== "" && gameState !== 'START_SCREEN') {
      updateOnlineStatus(player.name);
    }
  }, [player.name, gameState]);

  // 🚫 ลบ handleForge ออกไปแล้ว

  // ✅ 7. การ Return (ส่งเฉพาะระบบหลักออกไป)
  return {
    ...combat, 
    ...travel, 
    ...walking,
    isCombat: combat.isCombat,
    handleSelectMap: combat.handleSelectMap 
  };
}