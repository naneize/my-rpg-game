import React, { useState, useEffect, useMemo } from 'react'; 
import { ShoppingBag, MessageSquare, PlusCircle, Tag, Search, Clock, Package, User, Save, BookOpen, Mail, Settings, Terminal, AlertCircle, CheckCircle2, Activity, Cpu } from 'lucide-react';

// ---------------------------------------------------------------------------------
// 📦 COMPONENTS
// ---------------------------------------------------------------------------------
import Sidebar from './components/Sidebar';
import WorldChat from './components/WorldChat';
import ConfirmModal from './components/ConfirmModal'; 
import GameLayout from './components/layout/GameLayout';
import MarketPostModal from './components/MarketPostModal'; 

// ---------------------------------------------------------------------------------
// 🛠️ UTILS & DATA
// ---------------------------------------------------------------------------------
import { calculateCollectionScore, getPassiveBonus, calculateCollectionBonuses } from './utils/characterUtils';
import { MONSTER_SKILLS } from './data/passive';
import { monsters } from './data/monsters/index'; 
import { worldMaps } from './data/worldMaps';
import { INITIAL_PLAYER_DATA, INITIAL_LOGS } from './data/playerState';

// ---------------------------------------------------------------------------------
// 🛠️ HOOKS 
// ---------------------------------------------------------------------------------
import { useCharacterStats } from './hooks/useCharacterStats'; 
import { useSaveSystem } from './hooks/useSaveSystem'; 
import { useGameEngine } from './hooks/useGameEngine'; 
import { useViewRenderer } from './hooks/useViewRenderer.jsx';
import { useLevelSystem } from './hooks/useLevelSystem';
import { useMailSystem } from './hooks/useMailSystem';
import { useWorldEventSystem } from './hooks/useWorldEventSystem';
import { useMobileChat } from './hooks/useMobileChat';
import { useMarketSystem } from './hooks/useMarketSystem'; 

// ---------------------------------------------------------------------------------
// 🛣️ ROUTER IMPORTS
// ---------------------------------------------------------------------------------
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage'; 

export default function App() {
  // -------------------------------------------------------------------------------
  // 💾 1. STATE MANAGEMENT
  // -------------------------------------------------------------------------------
  const [activeTab, setActiveTab] = useState('TRAVEL');
  const [logs, setLogs] = useState(INITIAL_LOGS);
  const [gameState, setGameState] = useState('START_SCREEN');
  const [currentMap, setCurrentMap] = useState(null);
  const [player, setPlayer] = useState(INITIAL_PLAYER_DATA);

  React.useEffect(() => {
    setPlayer(prev => {
      if (!prev) return prev;
      const seenIds = new Set();
      const getUniqueItem = (item) => {
        if (!item) return null;
        const id = item.instanceId || item.id;
        if (seenIds.has(id)) return null; 
        seenIds.add(id);
        return item;
      };
      const newEquipment = {};
      if (prev.equipment) {
        Object.keys(prev.equipment).forEach(slot => {
          newEquipment[slot] = getUniqueItem(prev.equipment[slot]);
        });
      }
      const newInventory = (prev.inventory || []).filter(item => {
        const id = item.instanceId || item.id;
        if (seenIds.has(id)) return false;
        seenIds.add(id);
        return true;
      });
      return { 
        ...prev, 
        equipment: newEquipment, 
        inventory: newInventory 
      };
    });
  }, []);

  const [newTitlePopup, setNewTitlePopup] = useState(null);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [pendingName, setPendingName] = useState('');
  const [showSaveToast, setShowSaveToast] = useState(false);
  const [hasSave, setHasSave] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [pendingBuyItem, setPendingBuyItem] = useState(null);
  const [showPostModal, setShowPostModal] = useState(false);

  // -------------------------------------------------------------------------------
  // ✨ 2. NOTIFICATION SYSTEM
  // -------------------------------------------------------------------------------
  const [gameToast, setGameToast] = useState({ show: false, message: '', type: 'info' });
  
  const triggerToast = (message, type = 'info') => {
    setGameToast({ show: true, message, type });
    setTimeout(() => setGameToast(prev => ({ ...prev, show: false })), 3000);
  };

  // -------------------------------------------------------------------------------
  // ⚔️ 3. CORE SYSTEMS (Hooks)
  // -------------------------------------------------------------------------------
  const { saveGame, loadGame, clearSave } = useSaveSystem(player, setPlayer, setLogs);
  const { listings, postListing, buyItem } = useMarketSystem(player, setPlayer);
  const { worldEvent, setWorldEvent, respawnTimeLeft, broadcast } = useWorldEventSystem();
  const { claimMailItems, deleteMail, clearReadMail, redeemGiftCode, wrapItemAsCode } = useMailSystem(player, setPlayer, setLogs);
  const { chatPos, unreadChatCount, setUnreadChatCount, showMobileChat, setShowMobileChat, handleChatTouchStart, handleChatTouchMove, handleChatTouchEnd } = useMobileChat();

  // -------------------------------------------------------------------------------
  // 💎 4. CALCULATION SYSTEM (Memoized)
  // -------------------------------------------------------------------------------
  const passiveBonuses = useMemo(() => getPassiveBonus(player.equippedPassives, MONSTER_SKILLS), [player.equippedPassives]);
  const collectionBonuses = useMemo(() => calculateCollectionBonuses(player.collection, monsters), [player.collection]);
  const collScore = useMemo(() => calculateCollectionScore(player.inventory), [player.inventory]);
  const totalStatsPlayer = useCharacterStats(player,passiveBonuses, collectionBonuses);

  // -------------------------------------------------------------------------------
  // ⚙️ 5. GAME ENGINE
  // -------------------------------------------------------------------------------
  const engine = useGameEngine({
    player, setPlayer, setLogs, totalStatsPlayer, collectionBonuses, gameState, setGameState, currentMap, setCurrentMap, saveGame, collection: player.collection, worldEvent, setWorldEvent, allSkills: MONSTER_SKILLS,
    mapControls: { currentMap, setCurrentMap, gameState, setGameState, worldEvent, setWorldEvent }
  });

  const { attackCombo } = engine;

  // -------------------------------------------------------------------------------
  // 📈 6. PROGRESSION SYSTEMS
  // -------------------------------------------------------------------------------
  useLevelSystem(player, setPlayer, setLogs);

  useEffect(() => {
    if (player.level > 1 && player.hp < totalStatsPlayer.maxHp) { 
      setPlayer(prev => ({ ...prev, hp: totalStatsPlayer.maxHp }));
    }
  }, [player.level]);

  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleSelectMap = (mapSnippet) => {
    const fullMap = worldMaps.find(m => m.id === mapSnippet.id);
    if (fullMap) {
      setCurrentMap(fullMap);
      setGameState('PLAYING');
      setActiveTab('TRAVEL');
      setLogs(prev => [`🛰️ Connection Established: ${fullMap.name}`, ...prev].slice(0, 10));
    }
  };

  // -------------------------------------------------------------------------------
  // 📝 7. HANDLERS
  // -------------------------------------------------------------------------------
  const handleManualSave = () => { 
    if (saveGame()) { 
      setHasSave(true); 
      setShowSaveToast(true); 
      setTimeout(() => setShowSaveToast(false), 2000); 
    } 
  };

  const handleConfirmPost = async (sellerName, itemId, want, desc) => {
    const result = await postListing(sellerName, itemId, want, desc);
    if (result.success) {
      setPlayer(prev => {
        const isMaterial = prev.materials && prev.materials[itemId] !== undefined;
        if (isMaterial) {
          return { ...prev, materials: { ...prev.materials, [itemId]: Math.max(0, prev.materials[itemId] - 1) } };
        } else {
          return { ...prev, inventory: prev.inventory.map(item => (item.id === itemId || item.itemId === itemId) ? { ...item, count: Math.max(0, (item.count || 1) - 1) } : item ).filter(item => (item.count === undefined || item.count > 0)) };
        }
      });
      triggerToast("Item listed on Market!", "success");
      setLogs(prev => [`📢 Listed ${itemId} for sale!`, ...prev].slice(0, 10));
      setShowPostModal(false);
      setTimeout(() => saveGame(), 500);
    } else {
      triggerToast("Failed to post listing", "error");
    }
  };

  const triggerNewGame = (name) => { setPendingName(name); setIsConfirmOpen(true); };

  const handleStartNewGame = () => {
    setPlayer({ ...INITIAL_PLAYER_DATA, name: pendingName, hp: totalStatsPlayer.maxHp });
    setHasSave(false); 
    setCurrentMap(null); 
    setGameState('MAP_SELECTION'); 
    setIsConfirmOpen(false); 
    setActiveTab('TRAVEL');
    setLogs(["🌅 Welcome to your new adventure!", "📍 Please select a map to start your journey."]);
  };

  useEffect(() => {
    const savedData = localStorage.getItem('rpg_game_save_v1');
    if (savedData && savedData !== "null") setHasSave(true);
  }, []);

  // -------------------------------------------------------------------------------
  // 🖼️ 8. RENDERER LINK
  // -------------------------------------------------------------------------------
  const { renderMainView } = useViewRenderer({
    ...engine, activeTab, logs, originalPlayer: player, attackCombo: attackCombo, handleAttack: engine.handleAttack, player: player, setPlayer, setLogs, collScore, passiveBonuses, collectionBonuses, targetElement: engine.targetElement, tuneToElement: engine.tuneToElement, tuningEnergy: engine.tuningEnergy, monsters, allSkills: MONSTER_SKILLS, gameState, currentMap: currentMap, handleSelectMap: handleSelectMap, elementalMastery: player.elementalMastery, claimMailItems, deleteMail, clearReadMail, redeemGiftCode, wrapItemAsCode, setGameState, saveGame: handleManualSave, clearSave, hasSave, worldEvent, setWorldEvent, respawnTimeLeft, listings, onPostListing: () => setShowPostModal(true), onBuyItem: (post) => setPendingBuyItem(post), onContactSeller: (post) => { if (isMobile) { setShowMobileChat(true); setUnreadChatCount(0); } triggerToast(`Connecting to ${post.sellerName}...`, "info"); }, onStart: triggerNewGame,
    onContinue: () => {
      const loaded = loadGame();
      if (loaded) {
        if (loaded.currentMap) setCurrentMap(loaded.currentMap);
        setGameState(loaded.currentMap ? 'PLAYING' : 'MAP_SELECTION');
        setActiveTab('TRAVEL');
      }
    }
  });

  // -------------------------------------------------------------------------------
  // 🏁 9. FINAL RETURN (UI LAYOUT)
  // -------------------------------------------------------------------------------
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/play" element={
          <GameLayout 
            showUI={gameState !== 'START_SCREEN'} 
            onOpenSidebar={() => setIsSidebarOpen(true)}
            saveGame={handleManualSave}
            hasNotification={player.mailbox?.some(m => !m.isRead) || player.points > 0}
            overlays={<>
              {/* --- 🛰️ System Broadcast (Hard-Edge Banner) --- */}
              {broadcast.show && (
                <div className="fixed top-0 left-0 right-0 z-[1000000] flex justify-center pointer-events-none animate-in slide-in-from-top-full duration-700 font-mono">
                  <div className="bg-[#020617]/95 border-b-2 border-amber-500 shadow-[0_10px_30px_rgba(0,0,0,0.8)] w-full max-w-4xl p-4 text-center relative">
                    <div className="absolute top-0 left-0 w-2 h-full bg-amber-500" />
                    <div className="absolute top-0 right-0 w-2 h-full bg-amber-500" />
                    <div className="flex flex-col items-center gap-1">
                      <span className="text-[8px] font-black text-amber-500 uppercase tracking-[0.5em] italic">Priority_Signal_Incoming</span>
                      <h2 className="text-sm md:text-lg font-black text-white uppercase italic tracking-tighter">{broadcast.message}</h2>
                    </div>
                  </div>
                </div>
              )}

              {/* --- 🔔 Game Toasts (Tactical HUD Alert) --- */}
              {gameToast.show && (
                <div className="fixed top-20 left-1/2 -translate-x-1/2 z-[300000] animate-in zoom-in-95 duration-300 pointer-events-none font-mono">
                  <div className={`px-6 py-3 rounded-none border-2 shadow-2xl flex items-center gap-3 backdrop-blur-xl ${
                    gameToast.type === 'error' ? 'bg-red-950/90 border-red-500 text-red-200' : 'bg-emerald-950/90 border-emerald-500 text-emerald-200'
                  }`}>
                    {gameToast.type === 'error' ? <AlertCircle size={18} className="animate-pulse" /> : <CheckCircle2 size={18} className="animate-bounce" />}
                    <span className="text-[10px] font-black uppercase italic tracking-[0.2em] leading-none">{gameToast.message}</span>
                  </div>
                </div>
              )}

              {/* --- 🛡️ Market & Trading Modals (Hard-Edge) --- */}
              {showPostModal && (
                <MarketPostModal inventory={player.inventory} onConfirm={handleConfirmPost} onClose={() => setShowPostModal(false)} player={player} />
              )}

              {/* --- 💳 Authorize Purchase Modal (Tactical Frame) --- */}
              {pendingBuyItem && (
                <div className="fixed inset-0 z-[2000000] flex items-center justify-center p-4 font-mono">
                  <div className="absolute inset-0 bg-black/95 backdrop-blur-md" onClick={() => setPendingBuyItem(null)} />
                  <div className="relative z-10 w-full max-w-sm border-2 border-emerald-500 bg-slate-950 p-1 rounded-none shadow-[0_0_40px_rgba(16,185,129,0.2)] animate-in zoom-in-95">
                    <ConfirmModal 
                      isOpen={!!pendingBuyItem} onClose={() => setPendingBuyItem(null)} 
                      onConfirm={async () => {
                        const itemToBuy = pendingBuyItem;
                        setPendingBuyItem(null);
                        const res = await buyItem(itemToBuy);
                        if (res?.success) {
                          triggerToast(`Purchased ${itemToBuy.itemId}!`, "success");
                          setLogs(prev => [`🛒 Purchased ${itemToBuy.itemId} from Market`, ...prev].slice(0, 10));
                          setTimeout(() => saveGame(), 500);
                        } else { triggerToast(res?.message || "Purchase failed", "error"); }
                      }} 
                      title="AUTHORIZE_PURCHASE" 
                      message={`Confirm credit sync for ${pendingBuyItem.itemId}?`} 
                    />
                  </div>
                </div>
              )}

              {/* --- ⚠️ System Data Purge Modal (Danger Alert) --- */}
              {isConfirmOpen && (
                <div className="fixed inset-0 z-[50001] flex items-center justify-center p-4 font-mono">
                  <div className="absolute inset-0 bg-black/95 backdrop-blur-xl" onClick={() => setIsConfirmOpen(false)} />
                  <div className="relative z-10 w-full max-w-sm border-2 border-red-600 bg-slate-950 p-1 rounded-none shadow-[0_0_50px_rgba(220,38,38,0.2)] animate-in slide-in-from-bottom-5">
                    <ConfirmModal isOpen={isConfirmOpen} onClose={() => setIsConfirmOpen(false)} onConfirm={handleStartNewGame} title="SYSTEM_DATA_PURGE" message="Erase local identity and wipe all progress data?" />
                  </div>
                </div>
              )}
                
              {/* --- 💾 Save Status Toast (Tactical Status Bar) --- */}
              {showSaveToast && (
                <div className="fixed top-6 right-6 z-[400000] animate-in slide-in-from-right-full duration-500 font-mono">
                  <div className="bg-black border-2 border-emerald-500 text-emerald-500 px-5 py-3 rounded-none shadow-[0_0_20px_rgba(16,185,129,0.2)] flex items-center gap-4 relative overflow-hidden">
                    <div className="absolute left-0 top-0 h-full w-1 bg-emerald-500 animate-pulse" />
                    <Save size={16} />
                    <div className="flex flex-col">
                      <span className="text-[10px] font-black uppercase italic tracking-[0.2em] leading-none">Data_Secured</span>
                      <span className="text-[7px] opacity-40 uppercase mt-1">Sync_Complete_v4.2</span>
                    </div>
                  </div>
                </div>
              )}

              {/* --- 💬 Floating Comms Button (Hard-Edge Comms) --- */}
              {gameState !== 'START_SCREEN' && isMobile && !showMobileChat && (
                <button 
                  style={{ left: `${chatPos.x}px`, top: `${chatPos.y}px`, touchAction: 'none' }}
                  className="fixed z-[3000000] bg-slate-900 text-amber-500 p-4 rounded-none shadow-[4px_4px_0_rgba(245,158,11,0.5)] border-2 border-amber-500 active:scale-90 active:shadow-none pointer-events-auto transition-all group overflow-hidden font-mono"
                  onTouchStart={handleChatTouchStart} 
                  onTouchMove={handleChatTouchMove} 
                  onTouchEnd={() => handleChatTouchEnd(() => setUnreadChatCount(0))} 
                  onClick={(e) => { e.stopPropagation(); setShowMobileChat(true); }} 
                >
                  <div className="absolute top-0 left-0 w-1.5 h-1.5 bg-amber-500" />
                  <MessageSquare size={24} strokeWidth={2.5} className="relative z-10" />
                  {unreadChatCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-600 text-white text-[10px] w-7 h-7 rounded-none flex flex-col items-center justify-center border-2 border-slate-950 font-black animate-in zoom-in shadow-lg">
                      <span className="leading-none">{unreadChatCount}</span>
                      <span className="text-[5px] opacity-60 font-black">MSG</span>
                    </span>
                  )}
                </button>
              )}
            </>}
            sidebar={gameState !== 'START_SCREEN' && (
              <Sidebar activeTab={activeTab} setActiveTab={(t) => { setActiveTab(t); setIsSidebarOpen(false); }} isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} isMobile={isMobile} player={totalStatsPlayer} />
            )}
            worldChat={gameState !== 'START_SCREEN' && (
              <div className={showMobileChat ? 'fixed inset-0 z-[999999] flex bg-slate-950/95' : 'hidden md:flex flex-col h-full w-[320px] border-l border-white/10 bg-black'}>
                <WorldChat player={player} isMobile={isMobile} showMobileChat={showMobileChat} isOpen={showMobileChat} onClose={() => setShowMobileChat(false)} onNewMessage={() => { if (activeTab !== 'TRAVEL' || (isMobile && !showMobileChat)) setUnreadChatCount(prev => (prev || 0) + 1); }} unreadChatCount={unreadChatCount} />    
              </div>
            )}
          >
            {renderMainView()}
          </GameLayout>
        } />
      </Routes>
    </BrowserRouter>
  );
}