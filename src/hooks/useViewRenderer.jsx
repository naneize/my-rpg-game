import React, { useState, useEffect, useMemo } from 'react'; 
// --- Import Views ---
import TravelView from '../views/TravelView';
import CombatView from '../views/CombatView';
import CharacterView from '../views/CharacterView';
import CollectionView from '../views/CollectionView';
import DungeonDiscoveryView from '../views/DungeonDiscoveryView';
import PassiveSkillView from '../views/PassiveSkillView';
import InventoryView from '../components/InventoryView';
import CraftingView from '../views/CraftingView';
import MailView from '../components/MailView'; 
import MarketBoardView from '../views/MarketBoardView';

// --- Import Refactored Components & Data ---
import { CombatSidebarIntel } from '../components/combat/CombatSidebarIntel';
import { MobileIntelModal } from '../components/combat/MobileIntelModal';
import { MobileIntelButtons } from '../components/combat/MobileIntelButtons';
import { WORLD_BOSS_DATA } from '../data/monsters/worldBoss';

// --- Import Components ---
import MapSelectionView from '../components/MapSelectionView';
import StartScreen from '../components/StartScreen';

// ✅ Import ไฟล์รวมร่างใหม่
import UnifiedCharacterHub from '../views/UnifiedCharacterHub';

export const useViewRenderer = (state) => {
  const [mobileIntelTab, setMobileIntelTab] = useState(null); 

  // ✅ [STRICT SYNC] ดึงค่าจาก state ทั้งหมดโดยไม่เปลี่ยนชื่อตัวแปร
  const {
    activeTab, isCombat, allSkills, combatPhase, enemy, monsterSkillUsed,
    player, setPlayer, handleAttack, damageTexts, skillTexts, handleFlee,
    lootResult, finishCombat, inDungeon, handleUseSkill, playerSkills,  
    forceShowColor, setLogs, logs, setLootResult, targetElement, setTargetElement,
    currentEvent, handleEnterDungeon, setCurrentEvent, handleWalkingStep,
    isWalking, walkProgress, exitDungeon, attackCombo, 
    listings, onPostListing, onContactSeller, onBuyItem,

    collScore, passiveBonuses, collectionBonuses, gameState, currentMap,
    handleSelectMap, setGameState, worldEvent, startCombat,
    onContinue, onStart, hasSave, finalAtk, finalDef,
    claimMailItems, deleteMail, clearReadMail, redeemGiftCode, wrapItemAsCode,
    originalPlayer, respawnTimeLeft,
    tuneToElement, tuningEnergy 
  } = state;

  const totalStatsPlayer = player; 

  const renderContent = () => {
    if (gameState === 'START_SCREEN') {
      return <StartScreen onStart={onStart} onContinue={onContinue} hasSave={hasSave} />;
    }

    if (activeTab === 'MARKET') {
      return (
        <MarketBoardView 
          listings={listings} 
          onPostListing={onPostListing} 
          onContactSeller={onContactSeller || ((post) => console.log("Contact:", post))} 
          onBuyItem={onBuyItem}
        />
      );
    }

    // ✅ ปรับ CHARACTER ให้ใช้หน้า Unified และโชว์หน้า GEAR เป็นหลัก
    if (activeTab === 'CHARACTER') {
      return (
        <UnifiedCharacterHub 
          player={totalStatsPlayer} 
          setPlayer={setPlayer} 
          setLogs={setLogs} 
        />
      );
    }
    
    // ✅ ปรับ INVENTORY ให้ใช้หน้า Unified (เพราะมี Inventory ในตัวแล้ว)
    if (activeTab === 'INVENTORY') {
      return (
        <UnifiedCharacterHub 
          player={totalStatsPlayer} 
          setPlayer={setPlayer} 
          setLogs={setLogs}
          wrapItemAsCode={wrapItemAsCode}
        />
      );
    }

    if (activeTab === 'COLLECTION') {
      return (
        <CollectionView 
          player={totalStatsPlayer} 
          inventory={player.inventory || []} 
          collection={player.collection || {}} 
          collScore={collScore} 
        />
      );
    }
    
    // ✅ ปรับ PASSIVESKILL ให้ใช้หน้า Unified และโชว์หน้า NEURAL (สกิล) เป็นหลัก
    if (activeTab === 'PASSIVESKILL') {
      return (
        <UnifiedCharacterHub 
          player={totalStatsPlayer} 
          setPlayer={setPlayer} 
          setLogs={setLogs}
        />
      );
    }

    if (activeTab === 'MAIL') {
      return (
        <MailView 
          player={originalPlayer || totalStatsPlayer} 
          claimMailItems={claimMailItems} 
          deleteMail={deleteMail} 
          clearReadMail={clearReadMail}
          redeemGiftCode={redeemGiftCode}
        />
      );
    }

    // ⚔️ Combat Layout (Hard-Edge Edition)
    if (activeTab === 'TRAVEL' && isCombat) {
      return (
        <div className="relative z-0 w-full h-full flex flex-col lg:flex-row items-stretch bg-[#020617] overflow-hidden font-mono">
          <div className="flex-1 lg:flex-[2.5] flex flex-col items-center justify-center relative bg-black/40 lg:border-r-2 border-white/5">
            {/* Status Indicator Bar */}
            <div className={`absolute top-0 left-0 right-0 h-1 z-50 transition-colors duration-500 ${combatPhase === 'PLAYER_TURN' ? 'bg-blue-500' : 'bg-red-500'}`} />
            
            <CombatView 
              monster={enemy} 
              allSkills={allSkills} 
              monsterSkillUsed={monsterSkillUsed} 
              combatPhase={combatPhase} 
              player={totalStatsPlayer} 
              setPlayer={setPlayer} 
              onAttack={handleAttack} 
              attackCombo={attackCombo} // ✅ ส่ง Combo สดๆ จาก state
              onFlee={handleFlee} 
              lootResult={lootResult} 
              handleUseSkill={handleUseSkill}
              onCloseCombat={finishCombat} 
              dungeonContext={inDungeon} 
              forceShowColor={forceShowColor} 
              playerSkills={playerSkills} 
              setLogs={setLogs} 
              damageTexts={damageTexts} 
              skillTexts={skillTexts}
              collectionBonuses={collectionBonuses} 
              finalAtk={finalAtk} 
              finalDef={finalDef} 
              setLootResult={setLootResult} 
            />
          </div>

          {!lootResult && (
            <MobileIntelButtons 
              enemy={enemy} 
              onTabClick={(tab) => setMobileIntelTab(tab)} 
            />
          )}

          <MobileIntelModal 
            tab={mobileIntelTab} 
            onClose={() => setMobileIntelTab(null)}
            worldEvent={worldEvent}
            logs={logs}
            enemy={enemy}
            player={totalStatsPlayer}
          />

          <div className={`hidden lg:flex lg:w-80 lg:flex-col bg-[#020617]/80 backdrop-blur-xl border-l-2 border-white/5 p-5 space-y-4 overflow-hidden transition-all duration-500 ${lootResult ? 'opacity-0 translate-x-full' : 'opacity-100 translate-x-0'}`}>
             {isCombat && !lootResult && (
               <>
                 {enemy?.type === 'WORLD_BOSS' && (
                    <div className="flex-none">
                        <CombatSidebarIntel type="RANKING" worldEvent={worldEvent} player={totalStatsPlayer} />
                    </div>
                 )}
                 <div className="flex-1 min-h-0">
                    <CombatSidebarIntel type="LOGS" logs={logs} />
                 </div>
                 <div className="flex-none h-[35%] min-h-[180px]">
                    <CombatSidebarIntel type="LOOT" enemy={enemy} />
                 </div>
               </>
             )}
          </div>
        </div>
      );
    }

    // 🗺️ Map Selection
    if (activeTab === 'TRAVEL' && (gameState === 'MAP_SELECTION' || !currentMap)) {
      const currentLevel = Number(totalStatsPlayer.level || 0);
      return (
        <div className="h-full w-full overflow-y-auto custom-scrollbar pb-32 touch-pan-y bg-[#020617]">
          <MapSelectionView 
            playerLevel={currentLevel} worldEvent={worldEvent} respawnTimeLeft={respawnTimeLeft} 
            elementalMastery={totalStatsPlayer.elementalMastery} 
            totalSteps={totalStatsPlayer.totalSteps}
            onSelectMap={(mapSnippet) => {
              if (handleSelectMap) {
                handleSelectMap(mapSnippet); 
                setGameState('PLAYING'); 
              }
            }}
            onChallengeWorldBoss={() => {
              if (!worldEvent || !worldEvent.active) return;
              startCombat({
                ...WORLD_BOSS_DATA,
                hp: worldEvent.currentHp,
                maxHp: worldEvent.maxHp
              });
            }}
          />
        </div>
      );
    }

    if (activeTab === 'TRAVEL' && currentEvent?.type === 'DUNGEON_FOUND') {
      return (
        <div className="h-full overflow-y-auto custom-scrollbar bg-[#020617]">
          <DungeonDiscoveryView dungeon={currentEvent.data} onEnter={() => handleEnterDungeon(currentEvent.data)} onSkip={() => setCurrentEvent(null)} />
        </div>
      );
    }

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
          targetElement={targetElement}
          tuneToElement={tuneToElement}
          tuningEnergy={tuningEnergy}
          onBack={() => setGameState('MAP_SELECTION')}
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
    <div className="relative z-0 h-full w-full overflow-y-auto custom-scrollbar touch-pan-y bg-[#020617]">
      {renderContent()}
    </div>
  );

  return { renderMainView };
};