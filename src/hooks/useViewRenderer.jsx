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
    handleFlee,
    lootResult,
    finishCombat,
    inDungeon,
    setLogs,
    logs,
    currentEvent,
    handleEnterDungeon,
    setCurrentEvent,
    handleWalkingStep,
    isWalking,
    walkProgress,
    exitDungeon,
    collScore,
    passiveBonuses,
    gameState,
    currentMap,
    handleSelectMap,
    setGameState
  } = state;

  const calculateTotalStats = () => {
    // ดึงค่าโบนัสจากฉายา (Title) ที่สวมใส่อยู่
    const titleBonusAtk = player.equippedTitle?.atkBonus || 0;
    const titleBonusDef = player.equippedTitle?.defBonus || 0;
    
    // คืนค่า Object ใหม่ที่มีสเตตัสรวม
    return {
      ...player,
      atk: player.atk + titleBonusAtk,
      def: player.def + titleBonusDef
    };
  };

  const totalStatsPlayer = calculateTotalStats();

  const renderMainView = () => {
    // ⚔️ 1. กรณีอยู่ในสถานะต่อสู้
    if (isCombat) {
      return (
        <div className="flex flex-col h-full items-center justify-between gap-4">
          <div className="flex-1 flex items-center justify-center w-full">
            <CombatView 
              monster={enemy} 
              monsterSkillUsed={monsterSkillUsed} 
              combatPhase={combatPhase} // ✅ [แก้ไข] ส่งต่อค่านี้เพื่อให้ปลดล็อคปุ่มสีเทา
              player={totalStatsPlayer} 
              setPlayer={setPlayer} 
              onAttack={handleAttack} 
              onFlee={handleFlee} 
              lootResult={lootResult} 
              onCloseCombat={finishCombat} 
              dungeonContext={inDungeon} 
              setLogs={setLogs}
              damageTexts={damageTexts}
            />
          </div>
          <LogDisplay logs={logs} />
        </div>
      );
    }

    // 🏰 2. กรณีเจอ Dungeon (ขณะที่อยู่หน้า Travel)
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
          return (
            <MapSelectionView 
              playerLevel={player.level} 
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
        case 'CHARACTER':
    // ✅ ต้องส่ง collScore และ passiveBonuses เข้าไปด้วยแบบนี้ค่ะ!
    return (
      <CharacterView 
        stats={totalStatsPlayer} 
        setPlayer={setPlayer} 
        collScore={collScore} 
        passiveBonuses={passiveBonuses} 
      />
    );
      case 'COLLECTION':
        return <CollectionView inventory={player.inventory || []} collScore={collScore} />;
      case 'PASSIVESKILL':
        return <PassiveSkillView player={totalStatsPlayer} setPlayer={setPlayer} />;
      default:
        return null;
    }
  };

  return { renderMainView };
};