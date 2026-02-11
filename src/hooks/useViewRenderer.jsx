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

export const useViewRenderer = (state) => {
  const [mobileIntelTab, setMobileIntelTab] = useState(null); 

  // ✅ [จุดแก้ไข 1] รวบรวมการดึงค่าจาก state ไว้ที่นี่ที่เดียว เพื่อให้ข้อมูลซิงค์กันทั้งไฟล์
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
    // ดึงค่าสำหรับการจูนธาตุมาไว้ตรงนี้ด้วย
    tuneToElement, tuningEnergy 
  } = state;

  const totalStatsPlayer = player; 

  const renderContent = () => {
    // 🛑 [จุดแก้ไข 2] ลบการประกาศ const { targetElement... } = state ซ้ำซ้อนออก 
    // เพื่อป้องกันตัวแปรทับกันและทำให้ attackCombo หลุดหาย

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

    if (activeTab === 'CHARACTER') {
      return <CharacterView stats={totalStatsPlayer} setPlayer={setPlayer} collScore={collScore} passiveBonuses={passiveBonuses} collectionBonuses={collectionBonuses} />;
    }
    
    if (activeTab === 'INVENTORY') {
      return (
        <InventoryView 
          key={totalStatsPlayer.inventory?.length || 0}
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
    
    if (activeTab === 'PASSIVESKILL') {
      return <PassiveSkillView player={totalStatsPlayer} setPlayer={setPlayer} />;
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

    // ⚔️ Combat Layout
    if (activeTab === 'TRAVEL' && isCombat) {

      console.log("🚀 Renderer Final Dispatch:", state.attackCombo);

      return (
        <div className="relative z-0 w-full h-full flex flex-col lg:flex-row items-stretch bg-slate-950 overflow-hidden">
          <div className="flex-1 lg:flex-[2.5] flex flex-col items-center justify-center relative bg-slate-950/20 lg:border-r border-white/5">
            <CombatView 
              monster={enemy} allSkills={allSkills} monsterSkillUsed={monsterSkillUsed} 
              combatPhase={combatPhase} player={totalStatsPlayer} setPlayer={setPlayer} 
              onAttack={handleAttack} attackCombo={state.attackCombo}  onFlee={handleFlee} lootResult={lootResult} handleUseSkill={handleUseSkill}
              onCloseCombat={finishCombat} dungeonContext={inDungeon} forceShowColor={forceShowColor} 
              playerSkills={playerSkills} setLogs={setLogs} damageTexts={damageTexts} skillTexts={skillTexts}
              collectionBonuses={collectionBonuses} finalAtk={finalAtk} finalDef={finalDef} 
              setLootResult={setLootResult} 
              // ✅ ส่งค่าคอมโบเข้าสู่ UI เพื่อให้หลอดแสดงผล
              
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

          <div className={`hidden lg:flex lg:w-80 lg:flex-col bg-slate-900/40 backdrop-blur-sm border-l border-white/5 p-4 space-y-4 overflow-hidden transition-all duration-300 ${lootResult ? 'opacity-0 pointer-events-none translate-x-full' : 'opacity-100 translate-x-0'}`}>
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
        <div className="h-full w-full overflow-y-auto custom-scrollbar pb-32 touch-pan-y">
          <MapSelectionView 
            playerLevel={currentLevel} worldEvent={worldEvent} respawnTimeLeft={respawnTimeLeft} 
            elementalMastery={totalStatsPlayer.elementalMastery} 
            totalSteps={totalStatsPlayer.totalSteps}

            onSelectMap={(mapSnippet) => {
              if (handleSelectMap) {
                handleSelectMap(mapSnippet); 
                setGameState('PLAYING'); 
              } else {
                console.error("❌ handleSelectMap is missing in useViewRenderer state");
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
        <div className="h-full overflow-y-auto custom-scrollbar">
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
    <div className="relative z-0 h-full w-full overflow-y-auto custom-scrollbar touch-pan-y">
      {renderContent()}
    </div>
  );

  return { renderMainView };
};