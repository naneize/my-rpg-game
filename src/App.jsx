import React, { useState, useEffect, useMemo } from 'react'; 
import { ShoppingBag, MessageSquare, PlusCircle, Tag, Search, Clock, Package, User, Save, BookOpen, Mail, Settings, Terminal, AlertCircle, CheckCircle2 } from 'lucide-react';

// Components
import Sidebar from './components/Sidebar';
import WorldChat from './components/WorldChat';
import TitleUnlockPopup from './components/TitleUnlockPopup';
import ConfirmModal from './components/ConfirmModal'; 
import GameLayout from './components/layout/GameLayout';
import MarketPostModal from './components/MarketPostModal'; 

// Utils & Data
import { calculateCollectionScore, getPassiveBonus, calculateCollectionBonuses } from './utils/characterUtils';
import { MONSTER_SKILLS } from './data/passive';
import { monsters } from './data/monsters/index'; 
import { titles as allTitles } from './data/titles'; 
import { INITIAL_PLAYER_DATA, INITIAL_LOGS } from './data/playerState';

// ✅ Hooks 
import { useCharacterStats } from './hooks/useCharacterStats'; 
import { useSaveSystem } from './hooks/useSaveSystem'; 
import { useGameEngine } from './hooks/useGameEngine'; 
import { useViewRenderer } from './hooks/useViewRenderer.jsx';
import { useLevelSystem } from './hooks/useLevelSystem';
import { useTitleUnlocker } from './hooks/useTitleUnlocker';
import { useMailSystem } from './hooks/useMailSystem';
import { useWorldEventSystem } from './hooks/useWorldEventSystem';
import { useMobileChat } from './hooks/useMobileChat';
import { useMarketSystem } from './hooks/useMarketSystem'; 

export default function App() {
  // 💾 1. STATE MANAGEMENT
  const [activeTab, setActiveTab] = useState('TRAVEL');
  const [logs, setLogs] = useState(INITIAL_LOGS);
  const [gameState, setGameState] = useState('START_SCREEN');
  const [currentMap, setCurrentMap] = useState(null);
  const [player, setPlayer] = useState(INITIAL_PLAYER_DATA);
  
  const [newTitlePopup, setNewTitlePopup] = useState(null);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [pendingName, setPendingName] = useState('');
  const [showSaveToast, setShowSaveToast] = useState(false);
  const [hasSave, setHasSave] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // 🛒 NEW: Store pending item to buy
  const [pendingBuyItem, setPendingBuyItem] = useState(null);

  // ✨ Notification System (Game Toast)
  const [gameToast, setGameToast] = useState({ show: false, message: '', type: 'info' });
  const triggerToast = (message, type = 'info') => {
    setGameToast({ show: true, message, type });
    setTimeout(() => setGameToast(prev => ({ ...prev, show: false })), 3000);
  };

  // ✅ Market System
  const { listings, postListing, buyItem } = useMarketSystem(player, setPlayer);
  const [showPostModal, setShowPostModal] = useState(false);

  // ⚔️ Hooks Logic
  const { saveGame, loadGame, clearSave } = useSaveSystem(player, setPlayer, setLogs);
  
  const handleConfirmPost = async (sellerName, itemId, want, desc) => {
    const result = await postListing(sellerName, itemId, want, desc);
    if (result.success) {
      setPlayer(prev => {
        const isMaterial = prev.materials && prev.materials[itemId] !== undefined;
        if (isMaterial) {
          return {
            ...prev,
            materials: { ...prev.materials, [itemId]: Math.max(0, prev.materials[itemId] - 1) }
          };
        } else {
          return {
            ...prev,
            inventory: prev.inventory.map(item => 
              (item.id === itemId || item.itemId === itemId) 
                ? { ...item, count: Math.max(0, (item.count || 1) - 1) } 
                : item
            ).filter(item => (item.count === undefined || item.count > 0))
          };
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
  
  const { worldEvent, setWorldEvent, respawnTimeLeft, broadcast } = useWorldEventSystem();
  const { claimMailItems, deleteMail, clearReadMail, redeemGiftCode, wrapItemAsCode } = useMailSystem(player, setPlayer, setLogs);
  const { chatPos, unreadChatCount, setUnreadChatCount, showMobileChat, setShowMobileChat, handleChatTouchStart, handleChatTouchMove, handleChatTouchEnd } = useMobileChat();

  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleManualSave = () => { 
    if (saveGame()) { 
      setHasSave(true); 
      setShowSaveToast(true); 
      setTimeout(() => setShowSaveToast(false), 2000); 
    } 
  };

  // 💎 Calculation System
  const passiveBonuses = useMemo(() => getPassiveBonus(player.equippedPassives, MONSTER_SKILLS), [player.equippedPassives]);
  const collectionBonuses = useMemo(() => calculateCollectionBonuses(player.collection, monsters), [player.collection]);
  const collScore = useMemo(() => calculateCollectionScore(player.inventory), [player.inventory]);
  const activeTitle = useMemo(() => allTitles?.find(t => t.id === player.activeTitleId) || allTitles?.[0], [player.activeTitleId]);
  
  // ✅ totalStatsPlayer
  const totalStatsPlayer = useCharacterStats(player, activeTitle, passiveBonuses, collectionBonuses);



  useTitleUnlocker(totalStatsPlayer, collScore, setPlayer, setNewTitlePopup, gameState);
  useLevelSystem(player, setPlayer, setLogs);

  useEffect(() => {
    if (player.level > 1) { 
      setPlayer(prev => ({ ...prev, hp: totalStatsPlayer.maxHp }));
    }
  }, [player.level, totalStatsPlayer.maxHp]);
  
  const engine = useGameEngine({
    player, setPlayer, setLogs, totalStatsPlayer, collectionBonuses,
    gameState, setGameState, currentMap, setCurrentMap, saveGame, collection: player.collection,
    worldEvent, setWorldEvent, allSkills: MONSTER_SKILLS,
    mapControls: { currentMap, setCurrentMap, gameState, setGameState, worldEvent, setWorldEvent }
  });

  const triggerNewGame = (name) => { 
    setPendingName(name); 
    setIsConfirmOpen(true); 
  };

  const handleStartNewGame = () => {
    clearSave(); 
    setPlayer({ ...INITIAL_PLAYER_DATA, name: pendingName, hp: 100 });
    setHasSave(false); setCurrentMap(null); setGameState('MAP_SELECTION'); setIsConfirmOpen(false); setActiveTab('TRAVEL');
    setLogs(["🌅 Welcome to your new adventure!", "📍 Please select a map to start your journey."]);
  };

  useEffect(() => {
    const savedData = localStorage.getItem('rpg_game_save_v1');
    if (savedData && savedData !== "null") setHasSave(true);
  }, []);

  // 🛠️ Renderer Link
  const { renderMainView } = useViewRenderer({
    ...engine, 
    activeTab, 
    logs, 
    originalPlayer: player, 
    player: player, 
    setPlayer, 
    setLogs, 
    collScore, 
    passiveBonuses, 
    collectionBonuses, 
    monsters, 
    allSkills: MONSTER_SKILLS, 
    gameState, 
    currentMap, 
    claimMailItems, 
    deleteMail, 
    clearReadMail, 
    redeemGiftCode, 
    wrapItemAsCode, 
    setGameState, 
    saveGame: handleManualSave, 
    clearSave, 
    hasSave, 
    worldEvent, 
    setWorldEvent, 
    respawnTimeLeft, 
    listings, 
    onPostListing: () => setShowPostModal(true),
    
    onBuyItem: (post) => {
      setPendingBuyItem(post);
    },

    onContactSeller: (post) => {
      if (isMobile) {
        setShowMobileChat(true);
        setUnreadChatCount(0);
      }
      triggerToast(`Connecting to ${post.sellerName}...`, "info");
    },

    onStart: triggerNewGame,
    onContinue: () => {
      const loaded = loadGame();
      if (loaded) {
        setGameState(loaded.currentMap ? 'PLAYING' : 'MAP_SELECTION');
        setActiveTab('TRAVEL');
      }
    }
  });

  return (
    <GameLayout 
      showUI={gameState !== 'START_SCREEN'} 
      onOpenSidebar={() => setIsSidebarOpen(true)}
      saveGame={handleManualSave}
      hasNotification={player.mailbox?.some(m => !m.isRead) || player.points > 0}
      overlays={<>
        {broadcast.show && (
          <div className="fixed top-2 left-0 right-0 z-[1000000] flex justify-center px-4 pointer-events-none animate-in fade-in slide-in-from-top-10 duration-500">
            <div className="bg-slate-950/95 border-b-2 border-amber-500 shadow-2xl w-full max-w-2xl p-4 text-center">
              <div className="flex flex-col items-center gap-1">
                <span className="text-[8px] font-black text-amber-500 uppercase tracking-[0.4em]">System Broadcast</span>
                <h2 className="text-sm md:text-lg font-black text-white uppercase italic">{broadcast.message}</h2>
              </div>
            </div>
          </div>
        )}

        {gameToast.show && (
          <div className="fixed top-20 left-1/2 -translate-x-1/2 z-[300000] animate-in fade-in slide-in-from-top-5 duration-300 pointer-events-none">
            <div className={`px-6 py-3 rounded-2xl border shadow-2xl flex items-center gap-3 backdrop-blur-xl ${
              gameToast.type === 'error' ? 'bg-red-500/20 border-red-500/50 text-red-200' : 'bg-emerald-500/20 border-emerald-500/50 text-emerald-200'
            }`}>
              {gameToast.type === 'error' ? <AlertCircle size={18}/> : <CheckCircle2 size={18}/>}
              <span className="text-[11px] font-black uppercase italic tracking-widest">{gameToast.message}</span>
            </div>
          </div>
        )}

        {showPostModal && (
          <MarketPostModal 
            inventory={player.inventory} 
            onConfirm={handleConfirmPost} 
            onClose={() => setShowPostModal(false)} 
            player={player} 
          />
        )}

        {pendingBuyItem && (
          <div className="fixed inset-0 z-[2000000] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/90 backdrop-blur-md" onClick={() => setPendingBuyItem(null)} />
            <ConfirmModal 
              isOpen={!!pendingBuyItem} 
              onClose={() => setPendingBuyItem(null)} 
              onConfirm={async () => {
                const itemToBuy = pendingBuyItem;
                setPendingBuyItem(null);
                if (typeof buyItem !== 'function') return;
                const res = await buyItem(itemToBuy);
                if (res?.success) {
                  triggerToast(`Purchased ${itemToBuy.itemId}!`, "success");
                  setLogs(prev => [`🛒 Purchased ${itemToBuy.itemId} from Market`, ...prev].slice(0, 10));
                  setTimeout(() => saveGame(), 500);
                } else {
                  triggerToast(res?.message || "Purchase failed", "error");
                }
              }} 
              title="CONFIRM PURCHASE" 
              message={`Do you want to buy ${pendingBuyItem.itemId} for ${pendingBuyItem.want}?`} 
            />
          </div>
        )}

        {newTitlePopup && (
          <div className="fixed inset-0 z-[50000] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setNewTitlePopup(null)} />
            <TitleUnlockPopup data={newTitlePopup} onClose={() => setNewTitlePopup(null)} />
          </div>
        )}

        {isConfirmOpen && (
          <div className="fixed inset-0 z-[50001] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/90 backdrop-blur-md" onClick={() => setIsConfirmOpen(false)} />
            <ConfirmModal isOpen={isConfirmOpen} onClose={() => setIsConfirmOpen(false)} onConfirm={handleStartNewGame} title="WIPE DATA?" message="Are you sure you want to delete all progress and start a new journey?" />
          </div>
        )}
          
        {showSaveToast && (
          <div className="fixed top-4 right-4 z-[400000] animate-in fade-in slide-in-from-top-2 duration-300">
            <div className="bg-emerald-500 text-slate-950 px-4 py-2 rounded-xl text-[10px] font-black uppercase shadow-xl flex items-center gap-2">
              <Save size={14} /> Data Secured
            </div>
          </div>
        )}

        {gameState !== 'START_SCREEN' && isMobile && !showMobileChat && (
          <button 
            style={{ left: `${chatPos.x}px`, top: `${chatPos.y}px`, touchAction: 'none' }}
            className="fixed z-[3000000] bg-amber-500 text-slate-950 p-4 rounded-full shadow-[0_0_20px_rgba(245,158,11,0.5)] border-2 border-slate-950 active:scale-90 pointer-events-auto transition-transform"
            onTouchStart={handleChatTouchStart} 
            onTouchMove={handleChatTouchMove} 
            onTouchEnd={() => handleChatTouchEnd(() => setUnreadChatCount(0))} 
            onClick={(e) => { e.stopPropagation(); setShowMobileChat(true); }} 
          >
            <MessageSquare size={24} />
            {unreadChatCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-600 text-white text-[10px] w-6 h-6 rounded-full flex items-center justify-center border-2 border-slate-950 font-black animate-bounce shadow-lg">
                {unreadChatCount}
              </span>
            )}
          </button>
        )}
      </>}
      sidebar={gameState !== 'START_SCREEN' && (
        <Sidebar 
          activeTab={activeTab} 
          setActiveTab={(t) => { setActiveTab(t); setIsSidebarOpen(false); }} 
          isOpen={isSidebarOpen} 
          onClose={() => setIsSidebarOpen(false)}
          isMobile={isMobile}
          player={totalStatsPlayer} 
        />
      )}
      worldChat={gameState !== 'START_SCREEN' && (
        <div className={showMobileChat ? 'fixed inset-0 z-[999999] flex bg-slate-950/95' : 'hidden md:flex flex-col h-full w-[320px] border-l border-white/5 bg-slate-900/20'}>
          <WorldChat 
            player={player} 
            isMobile={isMobile} 
            showMobileChat={showMobileChat} 
            isOpen={showMobileChat} 
            onClose={() => setShowMobileChat(false)} 
            onNewMessage={() => { if (activeTab !== 'TRAVEL' || (isMobile && !showMobileChat)) setUnreadChatCount(prev => (prev || 0) + 1); }} 
            unreadChatCount={unreadChatCount} 
          />    
        </div>
      )}
    >
      {renderMainView()}
    </GameLayout>
  );
}