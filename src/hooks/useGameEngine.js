import { useCombat } from './useCombat';
import { useTravel } from './useTravel';
import { useWalkingSystem } from './useWalkingSystem';
import { useEffect, useCallback } from 'react'; // ✅ เพิ่ม useCallback
import { updateOnlineStatus } from '../firebase';
import { PLAYER_SKILLS } from '../data/playerSkills'; 

export function useGameEngine({
  player, // ข้อมูลดิบจาก App.js
  setPlayer,
  setLogs,
  totalStatsPlayer, // ค่าพลังที่คำนวณแล้ว
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
  // ส่ง player (ข้อมูลดิบ) และ totalStatsPlayer (ค่าพลัง) แยกกันให้ชัดเจน
  const combat = useCombat(
    player, // 🛡️ แก้จาก totalStatsPlayer เป็น player เพื่อให้ reference นิ่ง
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
    totalStatsPlayer // ✅ ส่งค่าพลังไปเป็น parameter เสริม (ถ้า useCombat รองรับ)
  );

  // ⚔️ ระบบการใช้สกิล (ใช้ useCallback เพื่อไม่ให้ฟังก์ชันถูกสร้างใหม่ทุก Render)
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
  }, [combat.isCombat, combat.combatPhase, combat.lootResult, totalStatsPlayer, player.name]);

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
    (steps) => travel.handleStep(steps)
  );

  // ✅ 3. Sync Dungeon Logic (ใช้การเช็คเพื่อป้องกันการยัดค่าซ้ำ)
  useEffect(() => {
    if (combat && travel) {
      combat.advanceDungeon = travel.advanceDungeon;
      combat.exitDungeon = travel.exitDungeon;
      combat.inDungeon = travel.inDungeon;
    }
  }, [travel.advanceDungeon, travel.exitDungeon, travel.inDungeon]);

  // ✅ 4. Firebase Status
  useEffect(() => {
    if (player.name?.trim() !== "" && gameState !== 'START_SCREEN') {
      updateOnlineStatus(player.name);
    }
  }, [player.name, gameState]);

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