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
    collectionBonuses, // ✅ รับค่าโบนัสสะสมจาก App.jsx
    collection,        // ✅ รับค่า collection แยกตาม ID จาก App.jsx จ่ะ
    gameState,
    currentMap,
    handleSelectMap,
    setGameState,
    playerLevel 
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

    if (gameState === 'START_SCREEN') {
      return <StartScreen onStart={() => setGameState('MAP_SELECT')} />;
    }
    
    // ⚔️ 1. กรณีอยู่ในสถานะต่อสู้
    if (isCombat) {
      return (
        <div className="flex flex-col h-full items-center justify-between gap-4">
          <div className="flex-1 flex items-center justify-center w-full">
            {/* ✅ [แก้ไขจุดสำคัญ] ส่ง collectionBonuses เข้าไปที่ CombatView ด้วยจ่ะ! */}
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
              advanceDungeon={advanceDungeon} // ✅ 3. ส่งต่อฟังก์ชันเพิ่ม Step เข้าไปจ่ะ
              forceShowColor={forceShowColor} // ✅ 4. ส่งต่อคำสั่ง "ห้ามเทา" เข้าไปจ่
              setLogs={setLogs}
              damageTexts={damageTexts}
              collectionBonuses={collectionBonuses} // 👈 เสียบปลั๊กตรงนี้เพื่อให้ในหน้าสู้ค่าพลังเพิ่มขึ้นจ่ะ
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