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

  // 🤖 [AUTO COMBAT SYSTEM] - ปรับความเร็วใหม่ตามคำสั่งแม่ครับ
  useEffect(() => {
    let autoAttackTimer;

    if (
      combat.isCombat && 
      combat.combatPhase === 'PLAYER_TURN' && 
      !combat.lootResult && 
      combat.enemy?.hp > 0 &&
      gameState === 'PLAYING'
    ) {
      // ⚡ ความเร็วใหม่:
      // ถ้าเข้าคอมแบทครั้งแรก (attackCombo === 0) รอ 0.5 วิ (500ms)
      // ถ้าเป็นการสลับเทิร์นตีปกติ รอ 0.6 วิ (600ms)
      const delay = combat.attackCombo === 0 ? 500 : 600;

      autoAttackTimer = setTimeout(() => {
        combat.handleAttack();
      }, delay);
    }

    return () => clearTimeout(autoAttackTimer);
  }, [combat.isCombat, combat.combatPhase, combat.lootResult, combat.enemy?.hp, gameState, combat.handleAttack, combat.attackCombo]);

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
    currentMap
  );

  // ✅ 3. Sync Dungeon Logic
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
    ...travel, 
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