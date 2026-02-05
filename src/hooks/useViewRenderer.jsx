import React from 'react'; 
// --- Import Views ---
import TravelView from '../views/TravelView';
import CombatView from '../views/CombatView';
import CharacterView from '../views/CharacterView';
import CollectionView from '../views/CollectionView';
import DungeonDiscoveryView from '../views/DungeonDiscoveryView';
import PassiveSkillView from '../views/PassiveSkillView';
// --- Import Components ---
import LogDisplay from '../components/LogDisplay';
import MapSelectionView from '../components/MapSelectionView';
import StartScreen from '../components/StartScreen';

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
    onContinue,
    onStart,           
    playerLevel,
    // ✅ รับสถานะว่ามีไฟล์เซฟหรือไม่จาก App.jsx
    hasSave 
  } = state;

  const calculateTotalStats = () => {
    const titleBonusAtk = player.equippedTitle?.atkBonus || 0;
    const titleBonusDef = player.equippedTitle?.defBonus || 0;
    
    return {
      ...player,
      atk: player.atk + titleBonusAtk,
      def: player.def + titleBonusDef
    };
  };

  const totalStatsPlayer = calculateTotalStats();

  const renderMainView = () => {
    // 🏠 0. หน้าจอเริ่มเกม (Start Screen) - Priority สูงสุด
    if (gameState === 'START_SCREEN') {
      return (
        <StartScreen 
          onStart={onStart} 
          onContinue={onContinue}
          hasSave={hasSave} 
        />
      );
    }

    // 📱 1. จัดการ Tab อื่นๆ ที่ไม่ใช่การเดินทาง (Priority รองลงมา)
    // เพื่อให้กด Sidebar เปลี่ยนหน้าได้ทันทีแม้ยังไม่มีแมพ หรืออยู่ในโหมดเลือกแมพ
    if (activeTab === 'CHARACTER') {
      return (
        <CharacterView 
          stats={totalStatsPlayer} 
          setPlayer={setPlayer} 
          collScore={collScore} 
          passiveBonuses={passiveBonuses} 
          collectionBonuses={collectionBonuses} 
        />
      );
    }

    if (activeTab === 'COLLECTION') {
      return (
        <CollectionView 
          inventory={player.inventory || []} 
          collection={collection || {}} 
          collScore={collScore} 
        />
      );
    }

    if (activeTab === 'PASSIVESKILL') {
      return <PassiveSkillView player={totalStatsPlayer} setPlayer={setPlayer} />;
    }

    // ⚔️ 2. กรณีอยู่ในสถานะต่อสู้ (Combat Priority ภายในหน้า TRAVEL)
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
              onStepAdvance={advanceDungeon} 
              dungeonContext={inDungeon} 
              advanceDungeon={advanceDungeon} 
              forceShowColor={forceShowColor} 
              setLogs={setLogs}
              damageTexts={damageTexts}
              skillTexts={skillTexts}
              collectionBonuses={collectionBonuses} 
            />
          </div>
        </div>
      );
    }

    // 🗺️ 3. กรณีเลือกแผนที่ (MAP_SELECTION)
    // แสดงเฉพาะเมื่ออยู่ในหน้า TRAVEL และยังไม่ได้เริ่มเล่นหรือแมพว่าง
    if (activeTab === 'TRAVEL' && (gameState === 'MAP_SELECTION' || !currentMap)) {
      const currentLevel = Number(totalStatsPlayer.level || totalStatsPlayer.Level || playerLevel || 0);

      return (
        <MapSelectionView 
          playerLevel={currentLevel}
          onSelectMap={(map) => {
            handleSelectMap(map);
            setGameState('PLAYING'); 
          }} 
        />
      );
    }

    // 🏰 4. กรณีเจอ Dungeon (เฉพาะตอนอยู่ในหน้า TRAVEL และสถานะคือ PLAYING)
    if (activeTab === 'TRAVEL' && currentEvent?.type === 'DUNGEON_FOUND') {
      return (
        <div className="h-full overflow-y-auto">
          <DungeonDiscoveryView 
            dungeon={currentEvent.data} 
            onEnter={() => handleEnterDungeon(currentEvent.data)} 
            onSkip={() => setCurrentEvent(null)} 
          />
        </div>
      );
    }

    // 🚶 5. หน้าออกเดินทางปกติ (TravelView)
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
          player={player} 
          currentMap={currentMap}
          onResetMap={() => setGameState('MAP_SELECTION')}
        />
      );
    }

    return null;
  };

  return { renderMainView };
};