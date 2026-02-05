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
    // ✅ [เพิ่มใหม่] รับค่า skillTexts มาจาก State ที่ส่งมาจาก App.jsx
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
    playerLevel 
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

    if (gameState === 'START_SCREEN') {
      return (
        <StartScreen 
          onStart={onStart} 
          onContinue={onContinue} 
        />
      );
    }

    console.log("Loot in Renderer:", lootResult);
    
    // ⚔️ 1. กรณีอยู่ในสถานะต่อสู้
    if (isCombat) {
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
              // ✅ [เพิ่มใหม่] ส่ง skillTexts เข้าไปที่ CombatView เพื่อให้ชื่อสกิลเด้งโชว์
              skillTexts={skillTexts}
              collectionBonuses={collectionBonuses} 
            />
          </div>
          <LogDisplay logs={logs} />
        </div>
      );
    }

    // 🏰 2. กรณีเจอ Dungeon
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

    // 📱 3. กรณีเปลี่ยน Tab ต่างๆ
    switch (activeTab) {
      case 'TRAVEL':

      if (gameState === 'MAP_SELECT' || !currentMap) {
          const currentLevel = Number(totalStatsPlayer.level || totalStatsPlayer.Level || playerLevel || 0);

          return (
            <MapSelectionView 
              playerLevel={currentLevel}
              onSelectMap={handleSelectMap} 
            />
          );
        }

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
            onResetMap={() => setGameState('MAP_SELECT')}
          />
        );
      case 'CHARACTER':
        return (
          <CharacterView 
            stats={totalStatsPlayer} 
            setPlayer={setPlayer} 
            collScore={collScore} 
            passiveBonuses={passiveBonuses} 
            collectionBonuses={collectionBonuses} 
          />
        );
      case 'COLLECTION':
        return (
          <CollectionView 
            inventory={player.inventory || []} 
            collection={collection || {}} 
            collScore={collScore} 
          />
        );
      case 'PASSIVESKILL':
        return <PassiveSkillView player={totalStatsPlayer} setPlayer={setPlayer} />;
      default:
        return null;
    }
  };

  return { renderMainView };
};