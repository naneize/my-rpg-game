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

  /**
   * ✅ แก้ไข: ปรับปรุงการคำนวณสเตตัสให้รวมโบนัสทั้งหมด
   * ดึงค่าจาก Passive และ Collection ให้ตรงกับชื่อ Key ล่าสุด (hp, atk, def)
   */
  const calculateTotalStats = () => {
    // 1. ดึงโบนัสจากฉายา (Title) - ตรวจสอบ Key ให้ตรงกับโครงสร้าง Title ของคุณ
    const titleBonusAtk = player.equippedTitle?.atkBonus || player.equippedTitle?.bonusStats?.atk || 0;
    const titleBonusDef = player.equippedTitle?.defBonus || player.equippedTitle?.bonusStats?.def || 0;
    const titleBonusHp = player.equippedTitle?.hpBonus || player.equippedTitle?.bonusStats?.maxHp || 0;

    // 2. ดึงโบนัสจาก Passive Skills (ดึงค่า hp ตรงๆ จากที่แก้ใน utils)
    const passiveAtk = passiveBonuses?.atk || 0;
    const passiveDef = passiveBonuses?.def || 0;
    const passiveHp = passiveBonuses?.hp || 0;

    // 3. ดึงโบนัสจาก Collection (สะสมไอเทมครบเซ็ต)
    const collectionAtk = collectionBonuses?.atk || 0;
    const collectionDef = collectionBonuses?.def || 0;
    const collectionHp = collectionBonuses?.hp || collectionBonuses?.maxHp || 0;

    // 4. รวมพลังทั้งหมด
    const finalMaxHp = player.maxHp + titleBonusHp + passiveHp + collectionHp;

    return {
      ...player,
      maxHp: finalMaxHp,
      atk: player.atk + titleBonusAtk + passiveAtk + collectionAtk,
      def: player.def + titleBonusDef + passiveDef + collectionDef,
      // ✅ ป้องกันเลือดปัจจุบันเกินเลือดสูงสุด (เช่น ตอนถอดสกิลเพิ่มเลือดออก)
      hp: Math.min(player.hp, finalMaxHp)
    };
  };

  // ✅ ตัวแปรเดียวที่ใช้ส่งให้ทุก View เพื่อความแม่นยำ 100%
  const totalStatsPlayer = calculateTotalStats();

  const renderMainView = () => {
    // 🏠 0. หน้าจอเริ่มเกม (Start Screen)
    if (gameState === 'START_SCREEN') {
      return (
        <StartScreen 
          onStart={onStart} 
          onContinue={onContinue}
          hasSave={hasSave} 
        />
      );
    }

    // 📱 1. จัดการ Tab อื่นๆ
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
            />
          </div>
        </div>
      );
    }

    // 🗺️ 3. กรณีเลือกแผนที่
    if (activeTab === 'TRAVEL' && (gameState === 'MAP_SELECTION' || !currentMap)) {
      const currentLevel = Number(totalStatsPlayer.level || playerLevel || 0);

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

    // 🏰 4. กรณีเจอ Dungeon
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
          player={totalStatsPlayer} 
          currentMap={currentMap}
          onResetMap={() => setGameState('MAP_SELECTION')}
        />
      );
    }

    return null;
  };

  return { renderMainView };
};