import React, { useState } from 'react'; 
// --- Import Views ---
import TravelView from '../views/TravelView';
import CombatView from '../views/CombatView';
import CharacterView from '../views/CharacterView';
import CollectionView from '../views/CollectionView';
import DungeonDiscoveryView from '../views/DungeonDiscoveryView';
import PassiveSkillView from '../views/PassiveSkillView';
import InventoryView from '../components/InventoryView';
import CraftingView from '../views/CraftingView';

// --- Import Components ---
import MapSelectionView from '../components/MapSelectionView';
import StartScreen from '../components/StartScreen';

import { BOSS_SKILLS } from '../data/bossSkills';

import { getFullItemInfo } from '../utils/inventoryUtils';

/**
 * Custom Hook สำหรับจัดการการแสดงผลหน้าจอหลัก
 */
export const useViewRenderer = (state) => {
  const {
    activeTab,
    isCombat,
    combatPhase,
    enemy,
    monsterSkillUsed,
    player,
    setPlayer,
    handleAttack,
    damageTexts,
    skillTexts,
    handleFlee,
    lootResult,
    finishCombat,
    inDungeon,
    forceShowColor,
    setLogs,
    logs,
    currentEvent,
    handleEnterDungeon,
    setCurrentEvent,
    handleWalkingStep,
    isWalking,
    walkProgress,
    exitDungeon,
    advanceDungeon,
    collScore,
    passiveBonuses,
    collectionBonuses, 
    collection,           
    gameState,
    currentMap,
    handleSelectMap,
    setGameState,
    worldEvent,
    setWorldEvent,
    startCombat,
    onContinue,
    onStart,            
    playerLevel,
    hasSave, 
    finalAtk, 
    finalDef
  } = state;

  const totalStatsPlayer = player; 

  const renderContent = () => {
    // 🏠 0. หน้าจอเริ่มเกม (คงเดิม)
    if (gameState === 'START_SCREEN') {
      return <StartScreen onStart={onStart} onContinue={onContinue} hasSave={hasSave} />;
    }

    // 📱 1. จัดการ Tab เมนูต่างๆ (คงเดิม)
    if (activeTab === 'CHARACTER') {
      return <CharacterView stats={totalStatsPlayer} setPlayer={setPlayer} collScore={collScore} passiveBonuses={passiveBonuses} collectionBonuses={collectionBonuses} />;
    }
    if (activeTab === 'INVENTORY') {
      return <InventoryView player={totalStatsPlayer} setPlayer={setPlayer} setLogs={setLogs} />;
    }
    if (activeTab === 'COLLECTION') {
      return <CollectionView inventory={player.inventory || []} collection={player.collection || {}} collScore={collScore} />;
    }
    if (activeTab === 'PASSIVESKILL') {
      return <PassiveSkillView player={totalStatsPlayer} setPlayer={setPlayer} />;
    }

    // ⚔️ 2. กรณีอยู่ในสถานะต่อสู้
    if (activeTab === 'TRAVEL' && isCombat) {
      return (
        <div className="flex flex-col h-full items-center justify-between gap-4">
          <div className="flex-1 flex items-center justify-center w-full">
            <CombatView 
              monster={enemy} 
              monsterSkillUsed={monsterSkillUsed} 
              combatPhase={combatPhase} 
              player={totalStatsPlayer} 
              setPlayer={setPlayer} 
              onAttack={handleAttack} 
              onFlee={handleFlee} 
              lootResult={lootResult} 
              onCloseCombat={finishCombat} 
              dungeonContext={inDungeon} 
              forceShowColor={forceShowColor} 
              setLogs={setLogs}
              damageTexts={damageTexts}
              skillTexts={skillTexts}
              collectionBonuses={collectionBonuses} 
              // ✅ [FIXED] เชื่อมต่อสายไฟ: ส่งค่าสเตตัสที่ถูกคำนวณ Buff/Debuff แล้วเข้าไปในหน้าจอต่อสู้
              finalAtk={finalAtk} 
              finalDef={finalDef}
            />
          </div>
        </div>
      );
    }

    // 🗺️ 3. กรณีเลือกแผนที่ (คงเดิม 100%)
    if (activeTab === 'TRAVEL' && (gameState === 'MAP_SELECTION' || !currentMap)) {
      const currentLevel = Number(totalStatsPlayer.level || 0);
      return (
        <MapSelectionView 
          playerLevel={currentLevel}
          worldEvent={worldEvent} 
          onSelectMap={(map) => { handleSelectMap(map); setGameState('PLAYING'); }}
          onChallengeWorldBoss={() => {
            if (!worldEvent || !worldEvent.active) return;
            const bossMonster = {
              id: worldEvent.bossId,
              name: worldEvent.name,
              hp: worldEvent.currentHp,
              maxHp: worldEvent.maxHp,
              atk: 450, 
              def: 300,
              level: 99,
              bossSkills: [
                BOSS_SKILLS.DRAGON_BREATH,
                BOSS_SKILLS.ANCIENT_ROAR,
                BOSS_SKILLS.DARK_METEOR,
                BOSS_SKILLS.OBSIDIAN_SCALE,
                BOSS_SKILLS.VOID_EXECUTION
              ], 
              isBoss: true,
              isFixedStats: true, 
              rarity: 'Mythical',
              image: "/monsters/black_dragon.png", 
              type: 'WORLD_BOSS'
            };
            startCombat(bossMonster);
          }}
        />
      );
    }

    // 🏰 4. กรณีเจอ Dungeon (คงเดิม)
    if (activeTab === 'TRAVEL' && currentEvent?.type === 'DUNGEON_FOUND') {
      return (
        <div className="h-full overflow-y-auto">
          <DungeonDiscoveryView dungeon={currentEvent.data} onEnter={() => handleEnterDungeon(currentEvent.data)} onSkip={() => setCurrentEvent(null)} />
        </div>
      );
    }

    // 🚶 5. หน้าออกเดินทางปกติ (คงเดิม)
    if (activeTab === 'TRAVEL') {
      return (
        <TravelView 
          onStep={handleWalkingStep} 
          isWalking={isWalking} 
          walkProgress={walkProgress} 
          currentEvent={currentEvent} 
          logs={logs} 
          inDungeon={inDungeon} 
          onExitDungeon={exitDungeon} 
          player={totalStatsPlayer} 
          currentMap={currentMap}
          onResetMap={() => setGameState('MAP_SELECTION')}
        />
      );
    }

    if (activeTab === 'CRAFT') {
      return <CraftingView player={totalStatsPlayer} setPlayer={setPlayer} setLogs={setLogs} />;
    } 

    return null;
  };

  const renderMainView = () => (
    <div className="relative h-full w-full">
      {renderContent()}
    </div>
  );

  return { renderMainView };
};