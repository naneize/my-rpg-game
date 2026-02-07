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
import { itemMaster } from '../data/itemData';

// --- Import Components ---
import MapSelectionView from '../components/MapSelectionView';
import StartScreen from '../components/StartScreen';

import { BOSS_SKILLS } from '../data/bossSkills';
import { getFullItemInfo } from '../utils/inventoryUtils';

// ✅ นำเข้า Icon สำหรับ Leaderboard และ UI ใหม่
import { ShieldAlert, Trophy, ScrollText, Activity, X } from 'lucide-react';

/**
 * Custom Hook สำหรับจัดการการแสดงผลหน้าจอหลัก
 */
export const useViewRenderer = (state) => {
  // ✅ 1. ย้าย State มาไว้ที่ Top Level เสมอเพื่อป้องกัน Error Hooks
  const [mobileIntelTab, setMobileIntelTab] = useState(null); 

  const {
    activeTab, isCombat, allSkills, combatPhase, enemy, monsterSkillUsed,
    player, setPlayer, handleAttack, damageTexts, skillTexts, handleFlee,
    lootResult, finishCombat, inDungeon, forceShowColor, setLogs, logs,
    currentEvent, handleEnterDungeon, setCurrentEvent, handleWalkingStep,
    isWalking, walkProgress, exitDungeon, advanceDungeon, collScore,
    passiveBonuses, collectionBonuses, collection, gameState, currentMap,
    handleSelectMap, setGameState, worldEvent, setWorldEvent, startCombat,
    onContinue, onStart, playerLevel, hasSave, finalAtk, finalDef,
    claimMailItems, deleteMail, clearReadMail, redeemGiftCode, wrapItemAsCode,
    originalPlayer,
    respawnTimeLeft 
  } = state;

  const totalStatsPlayer = player; 

  // ✅ [Helper Functions] ฟังก์ชันวาด Ranking
  const renderRanking = () => (
    <div className="bg-amber-950/40 rounded-3xl p-5 border border-amber-500/30 h-full overflow-y-auto custom-scrollbar shadow-inner">
      <div className="flex items-center gap-2 mb-4 border-b border-amber-500/20 pb-2">
        <Trophy size={18} className="text-amber-500 animate-bounce" />
        <h4 className="text-xs font-black text-amber-500 uppercase italic tracking-widest">Live Ranking</h4>
      </div>
      <div className="space-y-2">
        {worldEvent?.damageDealers && Object.entries(worldEvent.damageDealers)
          .sort(([, a], [, b]) => b - a).slice(0, 10) 
          .map(([name, dmg], i) => (
            <div key={i} className={`flex justify-between p-3 rounded-xl ${name === player.name ? 'bg-amber-500/20 border border-amber-500/40' : 'bg-black/40'}`}>
              <span className="text-xs text-white">#{i + 1} {name}</span>
              <span className="text-xs font-mono text-amber-500">{dmg.toLocaleString()}</span>
            </div>
          ))}
      </div>
    </div>
  );

  // ✅ [Helper Functions] ฟังก์ชันวาด Combat Intel
  const renderLogsList = () => (
    <div className="bg-black/40 rounded-3xl p-5 border border-white/5 h-full flex flex-col shadow-inner overflow-hidden">
      <div className="flex items-center gap-2 mb-4 border-b border-white/10 pb-2">
        <ScrollText size={18} className="text-blue-400" />
        <h4 className="text-xs font-black text-white uppercase italic tracking-widest">Combat Intel</h4>
      </div>
      <div className="flex-1 overflow-y-auto space-y-2 custom-scrollbar text-[11px] italic text-slate-400 touch-pan-y">
        {logs.slice(0, 20).map((log, i) => <p key={i} className="border-l-2 border-slate-700 pl-2">{log}</p>)}
      </div>
    </div>
  );

  // ✅ [Helper Functions] ฟังก์ชันวาด Monster Drops (แก้ไขให้ Scroll ได้และโชว์รูป)
  const renderLootTable = () => (
    <div className="bg-black/40 rounded-3xl p-5 border border-white/5 h-full shadow-inner overflow-hidden flex flex-col">
      <div className="flex items-center gap-2 mb-4 border-b border-white/10 pb-2 flex-none">
        <ShieldAlert size={18} className="text-emerald-400" />
        <h4 className="text-xs font-black text-white uppercase italic tracking-widest">Monster Drops</h4>
      </div>
      {/* แก้ไข: เพิ่ม overflow-y-auto และ flex-1 เพื่อให้พื้นที่รายการดรอปเลื่อนได้ */}
      <div className="space-y-2 overflow-y-auto flex-1 pr-2 custom-scrollbar touch-pan-y">
        {enemy?.lootTable?.map((lootItem, idx) => {
          const itemInfo = itemMaster[lootItem.id];

          return (
            <div key={idx} className="flex justify-between items-center bg-white/5 p-3 rounded-xl border border-white/5 shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 flex items-center justify-center bg-black/40 rounded-lg border border-white/5 overflow-hidden shrink-0">
                  {itemInfo?.image && itemInfo.image.startsWith('/') ? (
                    <img 
                      src={itemInfo.image} 
                      alt="" 
                      className="w-full h-full object-contain p-1.5 drop-shadow-[0_0_5px_rgba(255,255,255,0.1)]" 
                    />
                  ) : (
                    <span className="text-sm">{itemInfo?.image || '📦'}</span>
                  )}
                </div>
                
                <div className="flex flex-col">
                  <span className="text-[10px] text-white font-black uppercase italic tracking-wider">
                    {itemInfo?.name || lootItem.id}
                  </span>
                  <span className="text-[8px] text-slate-500 font-bold uppercase">
                    {itemInfo?.rarity || 'Material'}
                  </span>
                </div>
              </div>
              
              <div className="flex flex-col items-end">
                <span className="text-[10px] font-mono text-emerald-400 font-black italic">
                  {(lootItem.chance * 100).toFixed(1)}%
                </span>
                <span className="text-[7px] text-slate-600 font-bold uppercase">Rate</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );

  // 🛠️ ฟังก์ชันย่อยสำหรับวาดเนื้อหาตามเงื่อนไขต่างๆ
  const renderContent = () => {
    if (gameState === 'START_SCREEN') {
      return <StartScreen onStart={onStart} onContinue={onContinue} hasSave={hasSave} />;
    }

    if (activeTab === 'CHARACTER') {
      return <CharacterView stats={totalStatsPlayer} setPlayer={setPlayer} collScore={collScore} passiveBonuses={passiveBonuses} collectionBonuses={collectionBonuses} />;
    }
    
    if (activeTab === 'INVENTORY') {
      return <InventoryView player={totalStatsPlayer} setPlayer={setPlayer} setLogs={setLogs} wrapItemAsCode={wrapItemAsCode} />;
    }

    if (activeTab === 'COLLECTION') {
      return <CollectionView inventory={player.inventory || []} collection={player.collection || {}} collScore={collScore} />;
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

    // ⚔️ 2. กรณีอยู่ในสถานะต่อสู้ (Combat Layout)
    if (activeTab === 'TRAVEL' && isCombat) {
      return (
        <div className="relative z-0 w-full h-full flex flex-col lg:flex-row items-stretch bg-slate-950 overflow-hidden">
          <div className="flex-1 lg:flex-[2.5] flex flex-col items-center justify-center relative bg-slate-950/20 lg:border-r border-white/5">
            <CombatView 
              monster={enemy} allSkills={allSkills} monsterSkillUsed={monsterSkillUsed} 
              combatPhase={combatPhase} player={totalStatsPlayer} setPlayer={setPlayer} 
              onAttack={handleAttack} onFlee={handleFlee} lootResult={lootResult} 
              onCloseCombat={finishCombat} dungeonContext={inDungeon} forceShowColor={forceShowColor} 
              setLogs={setLogs} damageTexts={damageTexts} skillTexts={skillTexts}
              collectionBonuses={collectionBonuses} finalAtk={finalAtk} finalDef={finalDef}
            />
          </div>

          {/* 📱 Mobile Intel Modal UI */}
          {(!lootResult) && (
            <div className="lg:hidden absolute left-4 top-24 flex flex-col gap-4 z-[60]">
               {enemy?.type === 'WORLD_BOSS' && (
                 <button onClick={() => setMobileIntelTab('RANKING')} className="w-11 h-11 rounded-full bg-amber-600 border-2 border-amber-400 shadow-lg flex items-center justify-center text-white active:scale-90 transition-transform"><Trophy size={22}/></button>
               )}
               <button onClick={() => setMobileIntelTab('LOGS')} className="w-11 h-11 rounded-full bg-blue-600 border-2 border-blue-400 shadow-lg flex items-center justify-center text-white active:scale-90 transition-transform"><ScrollText size={22}/></button>
               <button onClick={() => setMobileIntelTab('LOOT')} className="w-11 h-11 rounded-full bg-slate-700 border-2 border-slate-500 shadow-lg flex items-center justify-center text-white active:scale-90 transition-transform"><ShieldAlert size={22}/></button>
            </div>
          )}

          {mobileIntelTab && (
            <div className="lg:hidden fixed inset-0 z-[11000] flex items-center justify-center p-6 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
              <div className="relative w-full max-w-sm max-h-[70vh] flex flex-col animate-in zoom-in-95">
                <button onClick={() => setMobileIntelTab(null)} className="absolute -top-14 right-0 w-12 h-12 bg-red-600 rounded-full flex items-center justify-center text-white shadow-2xl border-2 border-white/20 active:scale-90 z-[11001]"><X size={28}/></button>
                <div className="flex-1 overflow-hidden">
                  {mobileIntelTab === 'RANKING' && renderRanking()}
                  {mobileIntelTab === 'LOGS' && renderLogsList()}
                  {mobileIntelTab === 'LOOT' && renderLootTable()}
                </div>
              </div>
            </div>
          )}

          {/* 💻 Sidebar Layout */}
          <div className={`hidden lg:flex lg:w-80 lg:flex-col bg-slate-900/40 backdrop-blur-sm border-l border-white/5 p-4 space-y-4 overflow-hidden transition-all duration-300 ${lootResult ? 'opacity-0 pointer-events-none translate-x-full' : 'opacity-100 translate-x-0'}`}>
             {isCombat && !lootResult && (
               <>
                 {enemy?.type === 'WORLD_BOSS' && <div className="flex-none">{renderRanking()}</div>}
                 <div className="flex-1 min-h-0">{renderLogsList()}</div>
                 <div className="flex-none h-[35%] min-h-[180px]">{renderLootTable()}</div>
               </>
             )}
          </div>
        </div>
      );
    }

    // 🗺️ 3. กรณีเลือกแผนที่ (Map Selection) - แก้ไขให้เลื่อนได้
    if (activeTab === 'TRAVEL' && (gameState === 'MAP_SELECTION' || !currentMap)) {
      const currentLevel = Number(totalStatsPlayer.level || 0);
      return (
        /* ✅ แก้ไข: หุ้มด้วย div ที่อนุญาตให้ Scroll และมี padding ด้านล่างไม่ให้โดนทับ */
        <div className="h-full w-full overflow-y-auto custom-scrollbar pb-32 touch-pan-y">
          <MapSelectionView 
            playerLevel={currentLevel} worldEvent={worldEvent} respawnTimeLeft={respawnTimeLeft} 
            onSelectMap={(map) => { handleSelectMap(map); setGameState('PLAYING'); }}
            onChallengeWorldBoss={() => {
              if (!worldEvent || !worldEvent.active) return;
              const bossMonster = {
                id: worldEvent.bossId, name: worldEvent.name, hp: worldEvent.currentHp, maxHp: worldEvent.maxHp,
                atk: 150, def: 45, level: 20, isBoss: true, isFixedStats: true, rarity: 'Mythical', image: "/monsters/black_dragon.png", type: 'WORLD_BOSS',
                bossSkills: [BOSS_SKILLS.DRAGON_BREATH, BOSS_SKILLS.ANCIENT_ROAR, BOSS_SKILLS.DARK_METEOR, BOSS_SKILLS.OBSIDIAN_SCALE, BOSS_SKILLS.VOID_EXECUTION], 
                lootTable: [
                  { id: "scrap", chance: 1.0, minAmount: 5, maxAmount: 15 },
                  { id: "shard", chance: 0.7, minAmount: 2, maxAmount: 8 },
                  { id: "dust", chance: 0.4, minAmount: 1, maxAmount: 5 },
                  { id: "dragon_soul", chance: 0.05, minAmount: 1, maxAmount: 1 },
                  { id: "obsidian_scale", chance: 0.2, minAmount: 1, maxAmount: 2 }
                ]
              };
              startCombat(bossMonster);
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
          onStep={handleWalkingStep} isWalking={isWalking} walkProgress={walkProgress} 
          currentEvent={currentEvent} logs={logs} inDungeon={inDungeon} 
          onExitDungeon={exitDungeon} player={totalStatsPlayer} currentMap={currentMap}
          onResetMap={() => setGameState('MAP_SELECTION')}
        />
      );
    }

    if (activeTab === 'CRAFT') {
      return <CraftingView player={totalStatsPlayer} setPlayer={setPlayer} setLogs={setLogs} />;
    } 

    return null;
  }; 

  // แก้ไข: เปลี่ยนจาก overflow-hidden เป็น overflow-y-auto เพื่อให้ Browser เลื่อนได้หากเนื้อหาเกินจอ
  const renderMainView = () => (
    <div className="relative z-0 h-full w-full overflow-y-auto custom-scrollbar touch-pan-y">
      {renderContent()}
    </div>
  );

  return { renderMainView };
};