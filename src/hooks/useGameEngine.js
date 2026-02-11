import { useCombat } from './useCombat';
import { useTravel } from './useTravel';
import { useWalkingSystem } from './useWalkingSystem';
import { useEffect, useCallback } from 'react'; 
import { updateOnlineStatus } from '../firebase';
import { PLAYER_SKILLS } from '../data/playerSkills'; 

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
  saveGame,
  allSkills,
  worldEvent,
  setWorldEvent
}) {
  
  // ✅ 1. Combat Setup
  const combat = useCombat(
    player, 
    setPlayer, 
    setLogs, 
    null, 
    null, 
    null, 
    allSkills, 
    { 
      currentMap, 
      setCurrentMap, 
      gameState, 
      setGameState, 
      worldEvent, 
      setWorldEvent  
    },
    totalStatsPlayer 
  );

  // ⚔️ ระบบการใช้สกิล
  const handleUseSkill = useCallback((skill) => {
    if (!combat.isCombat || combat.combatPhase !== 'PLAYER_TURN' || combat.lootResult) return;

    if (skill.type === 'ATTACK') {
      combat.handleAttack(skill); 
    } 
    else if (skill.type === 'HEAL' || skill.type === 'SUPPORT') {
      const healValue = Math.floor(totalStatsPlayer.def * (skill.multiplier || 1.2));
      
      setPlayer(prev => ({
        ...prev,
        hp: Math.min(totalStatsPlayer.maxHp, prev.hp + healValue)
      }));
      
      setLogs(prev => [`✨ ${player.name} cast ${skill.name} : Recovered +${healValue} HP`, ...prev].slice(0, 10));
      combat.setCombatPhase('ENEMY_TURN'); 
    }
  }, [combat.isCombat, combat.combatPhase, combat.lootResult, totalStatsPlayer, player.name, setPlayer, setLogs, combat]);

  // ✅ 2. Travel & Walking
  const travel = useTravel(
    totalStatsPlayer, 
    setPlayer, 
    setLogs, 
    (monster) => combat.startCombat(monster), 
    currentMap
  );

  const walking = useWalkingSystem(
    totalStatsPlayer, 
    setPlayer, 
    setLogs, 
    combat.isCombat, 
    () => travel.handleStep(currentMap),
    currentMap // ✅ แก้จาก (steps) => ... เป็นเรียกตรงๆ เพราะ useTravel ตัวใหม่ใช้ state ภายใน
  );

  // ✅ 3. Sync Dungeon Logic (ถ้ายังใช้อยู่)
  useEffect(() => {
    if (combat && travel) {
      combat.advanceDungeon = travel.advanceDungeon;
      combat.exitDungeon = travel.exitDungeon;
      combat.inDungeon = travel.inDungeon;
    }
  }, [travel.advanceDungeon, travel.exitDungeon, travel.inDungeon, combat]);

  // ✅ 4. Firebase Status
  useEffect(() => {
    if (player.name?.trim() !== "" && gameState !== 'START_SCREEN') {
      updateOnlineStatus(player.name);
    }
  }, [player.name, gameState]);

  // 🛰️ สรุปค่าที่ส่งกลับออกไปให้ App.jsx
  return {
    ...combat, 
    ...travel, // 📡 ตรงนี้จะส่ง targetElement และ setTargetElement ออกไปโดยอัตโนมัติ
    ...walking,
    handleAttack: combat.handleAttack,
    attackCombo: combat.attackCombo,
    handleUseSkill, 
    playerSkills: PLAYER_SKILLS, 
    
    isCombat: combat.isCombat,
    handleSelectMap: combat.handleSelectMap,
    targetElement: travel.targetElement,
    setTargetElement: travel.setTargetElement
  };
}