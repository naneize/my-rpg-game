import { useCombat } from './useCombat';
import { useTravel } from './useTravel';
import { useWalkingSystem } from './useWalkingSystem';
import { useEffect } from 'react';
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
    totalStatsPlayer, 
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
    }
  );

  // ⚔️ [Refactored] ระบบการใช้สกิลของผู้เล่น (ไม่มี MP)
  const handleUseSkill = (skill) => {
    // 1. Validation: เช็คสถานะการต่อสู้
    if (!combat.isCombat || combat.combatPhase !== 'PLAYER_TURN' || combat.lootResult) return;

    // 2. แยกการทำงานตามประเภทสกิล
    if (skill.type === 'ATTACK') {
      // ✅ ส่งสกิลไปให้ useCombat จัดการ (คำนวณธาตุ/Synergy อัตโนมัติ)
      combat.handleAttack(skill); 
    } 
    else if (skill.type === 'HEAL' || skill.type === 'SUPPORT') {
      // คำนวณผลการฮีลโดยใช้ค่า Net Def (รวมบัฟป้องกันในสนามแล้ว)
      const healValue = Math.floor(combat.finalDef * (skill.multiplier || 1.2));
      
      setPlayer(prev => ({
        ...prev,
        hp: Math.min(totalStatsPlayer.maxHp, prev.hp + healValue)
      }));
      
      setLogs(prev => [`✨ ${player.name} ใช้ ${skill.name} ฟื้นฟู +${healValue} HP`, ...prev].slice(0, 10));
      
      // ฮีลแล้วจบเทิร์นผู้เล่นทันที
      combat.setCombatPhase('ENEMY_TURN'); 
    }
  };

  // ✅ 2. Travel & Walking (คงเดิม)
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
    (steps) => travel.handleStep(steps)
  );

  // ✅ 3. Sync Dungeon Logic
  useEffect(() => {
    combat.advanceDungeon = travel.advanceDungeon;
    combat.exitDungeon = travel.exitDungeon;
    combat.inDungeon = travel.inDungeon;
  }, [travel.advanceDungeon, travel.exitDungeon, travel.inDungeon]);

  // ✅ 4. Firebase Status
  useEffect(() => {
    if (player.name?.trim() !== "" && gameState !== 'START_SCREEN') {
      updateOnlineStatus(player.name);
    }
  }, [player.name, gameState]);

  // ✅ 5. Return ทุกอย่างที่จำเป็น
  return {
    ...combat, 
    ...travel, 
    ...walking,
    handleUseSkill, 
    playerSkills: PLAYER_SKILLS, 
    isCombat: combat.isCombat,
    handleSelectMap: combat.handleSelectMap 
  };
}