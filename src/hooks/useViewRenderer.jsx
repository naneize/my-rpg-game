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

// --- Import Components ---
import MapSelectionView from '../components/MapSelectionView';
import StartScreen from '../components/StartScreen';

import { BOSS_SKILLS } from '../data/bossSkills';
import { getFullItemInfo } from '../utils/inventoryUtils';

// ✅ นำเข้า Icon สำหรับ Leaderboard และ UI ใหม่
import { ShieldAlert, Trophy, ScrollText, Activity } from 'lucide-react';

/**
 * Custom Hook สำหรับจัดการการแสดงผลหน้าจอหลัก
 */
export const useViewRenderer = (state) => {
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
    respawnTimeLeft // ✅ เพิ่มการรับค่าเวลานับถอยหลังจาก App.js
  } = state;

  const totalStatsPlayer = player; 

  // 🛠️ ฟังก์ชันย่อยสำหรับวาดเนื้อหาตามเงื่อนไขต่างๆ
  const renderContent = () => {
    // 🏠 0. หน้าจอเริ่มเกม
    if (gameState === 'START_SCREEN') {
      return <StartScreen onStart={onStart} onContinue={onContinue} hasSave={hasSave} />;
    }

    // 📱 1. จัดการ Tab เมนูต่างๆ (Character, Inventory, Collection, Skill, Mail)
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
        /* ✅ แก้ไข: เพิ่ม h-full overflow-y-auto เพื่อให้มือถือเลื่อนดู Ranking ได้ */
        <div className="w-full h-full flex flex-col lg:flex-row items-stretch overflow-y-auto lg:overflow-hidden bg-slate-950">
          
          {/* 👾 ส่วนกลาง: หน้าจอการต่อสู้หลัก */}
          {/* ✅ แก้ไข: ปรับ min-h ให้แสดงผลชัดเจนบนมือถือ */}
          <div className="w-full lg:flex-[2.5] min-h-[500px] lg:h-full flex flex-col items-center justify-center relative border-b lg:border-r border-white/5 bg-slate-950/20">
            <CombatView 
              monster={enemy} 
              allSkills={allSkills}
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
              finalAtk={finalAtk} 
              finalDef={finalDef}
            />
          </div>

          {/* 📊 ส่วนขวา: Intelligence Panel (Leaderboard & Logs) */}
          {/* ✅ แก้ไข: นำ hidden ออก และปรับขนาดให้พอดีมือถือ (ไหลต่อท้าย) */}
          <div className="w-full lg:flex-1 flex flex-col h-auto lg:h-full bg-slate-900/40 backdrop-blur-sm border-t lg:border-t-0 lg:border-l border-white/5 p-4 space-y-4 pb-20 lg:pb-4">
            
            {/* 🏆 [LIVE RANKING] แสดงเฉพาะตอนสู้ World Boss เท่านั้น */}
            {enemy?.type === 'WORLD_BOSS' && worldEvent?.damageDealers && (
              <div className="bg-amber-950/20 rounded-3xl p-4 border border-amber-500/20 shadow-inner animate-in fade-in slide-in-from-right-5">
                <div className="flex items-center justify-between mb-3 border-b border-amber-500/20 pb-2">
                  <div className="flex items-center gap-2">
                    <Trophy size={14} className="text-amber-500 animate-bounce" />
                    <h4 className="text-[10px] font-black text-amber-500 uppercase italic tracking-widest">Live Ranking</h4>
                  </div>
                  <div className="flex items-center gap-1">
                    <Activity size={10} className="text-amber-500/50" />
                    <span className="text-[8px] font-black text-amber-500/50 uppercase">Realtime</span>
                  </div>
                </div>
                
                <div className="space-y-1.5">
                  {Object.entries(worldEvent.damageDealers)
                    .sort(([, a], [, b]) => b - a) 
                    .slice(0, 5) 
                    .map(([name, dmg], i) => {
                      const isMe = name === player.name;
                      return (
                        <div key={i} className={`flex justify-between items-center p-2 rounded-xl transition-all ${isMe ? 'bg-amber-500/20 border border-amber-500/30' : 'bg-black/20 border border-white/5'}`}>
                          <div className="flex items-center gap-2 overflow-hidden">
                            <span className={`text-[10px] font-black italic ${i === 0 ? 'text-amber-400' : 'text-slate-500'}`}>#{i + 1}</span>
                            <span className={`text-[10px] font-bold truncate ${isMe ? 'text-amber-400' : 'text-slate-300'}`}>{name}</span>
                          </div>
                          <span className="text-[10px] font-mono font-black text-amber-500">
                            {dmg >= 1000 ? `${(dmg / 1000).toFixed(1)}K` : dmg}
                          </span>
                        </div>
                      );
                    })}
                </div>
                <p className="mt-2 text-[7px] text-center text-amber-500/40 font-black uppercase italic">🏆 Top 1 Gets x5 Materials Bonus!</p>
              </div>
            )}

            {/* 🎯 ส่วนที่ 1: Combat Logs (ประวัติการต่อสู้) */}
            <div className="bg-black/40 rounded-3xl p-4 border border-white/5 flex-1 min-h-[150px] flex flex-col overflow-hidden shadow-inner">
              <div className="flex items-center gap-2 mb-3 border-b border-white/10 pb-2">
                <ScrollText size={14} className="text-blue-400" />
                <h4 className="text-[10px] font-black text-white uppercase italic tracking-widest">Combat Intel</h4>
              </div>
              <div className="flex-1 overflow-y-auto space-y-2 pr-1 no-scrollbar text-[10px]">
                {logs.slice(0, 8).map((log, i) => (
                  <p key={i} className="text-slate-400 leading-tight italic border-l-2 border-slate-700 pl-2 py-0.5">
                    {log}
                  </p>
                ))}
              </div>
            </div>

            {/* 💎 ส่วนที่ 2: Possible Loot (รายการไอเทมที่มีโอกาสดรอป) */}
            <div className="bg-black/40 rounded-3xl p-4 border border-white/5 min-h-[200px] lg:h-[40%] flex flex-col shadow-inner">
              <div className="flex items-center gap-2 mb-3 border-b border-white/10 pb-2">
                <Trophy size={14} className="text-amber-500" />
                <h4 className="text-[10px] font-black text-white uppercase italic tracking-widest">Possible Loot</h4>
              </div>
              
              <div className="flex-1 overflow-y-auto pr-1 no-scrollbar space-y-2">
                {enemy && enemy.lootTable && enemy.lootTable.length > 0 ? (
                  enemy.lootTable.map((item, idx) => {
                    const itemName = item.name || item.id || "Unknown Item";
                    const itemRarity = item.rarity || "Common";
                    const dropChance = item.chance || 0;

                    return (
                      <div key={idx} className="flex items-center justify-between bg-white/5 p-2 rounded-xl border border-white/5 hover:bg-white/10 transition-colors">
                        <div className="flex flex-col">
                          <span className="text-[10px] font-bold text-white leading-none">
                            {item.type === 'SKILL' ? `📜 ${itemName}` : itemName}
                          </span>
                          <span className={`text-[7px] font-black uppercase italic mt-1 ${
                            itemRarity === 'Legendary' || itemRarity === 'Mythical' ? 'text-amber-500 animate-pulse' : 
                            itemRarity === 'Epic' ? 'text-purple-400' :
                            itemRarity === 'Rare' ? 'text-blue-400' : 
                            itemRarity === 'Uncommon' ? 'text-emerald-400' : 'text-slate-500'
                          }`}>
                            {itemRarity}
                          </span>
                        </div>
                        <div className="text-right">
                          <span className="text-[9px] font-mono font-bold text-emerald-400/80">
                            {(dropChance * 100).toFixed(dropChance < 0.01 ? 2 : 1)}%
                          </span>
                          {item.minAmount && (
                            <div className="text-[7px] text-slate-500 font-bold uppercase italic">x{item.minAmount}-{item.maxAmount}</div>
                          )}
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="flex flex-col items-center justify-center h-full opacity-40">
                    <ShieldAlert size={20} className="text-slate-600 mb-1" />
                    <p className="text-[8px] font-bold uppercase italic">No loot data</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      );
    }

    // 🗺️ 3. กรณีเลือกแผนที่ (Map Selection)
    if (activeTab === 'TRAVEL' && (gameState === 'MAP_SELECTION' || !currentMap)) {
      const currentLevel = Number(totalStatsPlayer.level || 0);
      return (
        <MapSelectionView 
          playerLevel={currentLevel}
          worldEvent={worldEvent} 
          respawnTimeLeft={respawnTimeLeft} // ✅ ส่งเวลานับถอยหลังต่อไปยังหน้าจอเลือกแผนที่
          onSelectMap={(map) => { handleSelectMap(map); setGameState('PLAYING'); }}
          onChallengeWorldBoss={() => {
            if (!worldEvent || !worldEvent.active) return;
            const bossMonster = {
              id: worldEvent.bossId,
              name: worldEvent.name,
              hp: worldEvent.currentHp,
              maxHp: worldEvent.maxHp,
              atk: 150, 
              def: 45,
              level: 20,
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
              type: 'WORLD_BOSS',
              lootTable: [
                { name: "Scrap", rarity: "Common", type: "MATERIAL", chance: 1.0, minAmount: 5, maxAmount: 15 },
                { name: "Shard", rarity: "Uncommon", type: "MATERIAL", chance: 0.7, minAmount: 2, maxAmount: 8 },
                { name: "Dust", rarity: "Rare", type: "MATERIAL", chance: 0.4, minAmount: 1, maxAmount: 5 },
                { name: "dragon_soul", rarity: "Legendary", type: "MATERIAL", chance: 0.05, minAmount: 1, maxAmount: 1 },
                { name: "obsidian_scale", rarity: "Epic", type: "MATERIAL", chance: 0.2, minAmount: 1, maxAmount: 2 }
              ]
            };
            startCombat(bossMonster);
          }}
        />
      );
    }

    // 🏰 4. กรณีเจอ Dungeon (Discovery)
    if (activeTab === 'TRAVEL' && currentEvent?.type === 'DUNGEON_FOUND') {
      return (
        <div className="h-full overflow-y-auto">
          <DungeonDiscoveryView dungeon={currentEvent.data} onEnter={() => handleEnterDungeon(currentEvent.data)} onSkip={() => setCurrentEvent(null)} />
        </div>
      );
    }

    // 🚶 5. หน้าออกเดินทางปกติ (Travel View)
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
  }; // สิ้นสุด renderContent

  // 🖼️ ฟังก์ชันหลักสำหรับ Render
  const renderMainView = () => (
    <div className="relative h-full w-full">
      {renderContent()}
    </div>
  );

  return { renderMainView };
};