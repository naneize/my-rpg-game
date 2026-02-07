import React, { useState, useEffect, useMemo, useRef } from 'react';
import { ref, update } from "firebase/database";
import { db } from "./firebase"; 

// Components
import Sidebar from './components/Sidebar';
import WorldChat from './components/WorldChat';
import TitleUnlockPopup from './components/TitleUnlockPopup';
import ConfirmModal from './components/ConfirmModal'; 
import GameLayout from './components/layout/GameLayout';

// Utils & Data
import { calculateCollectionScore, getPassiveBonus, calculateCollectionBonuses } from './utils/characterUtils';
import { MONSTER_SKILLS } from './data/passive';
import { monsters } from './data/monsters/index'; 
import { titles as allTitles } from './data/titles'; 
import { INITIAL_PLAYER_DATA, INITIAL_LOGS } from './data/playerState';

// ✅ Hooks (นำเข้าทั้งหมดที่แยกไป)
import { useCharacterStats } from './hooks/useCharacterStats'; 
import { useSaveSystem } from './hooks/useSaveSystem'; 
import { useGameEngine } from './hooks/useGameEngine'; 
import { useViewRenderer } from './hooks/useViewRenderer.jsx';
import { useLevelSystem } from './hooks/useLevelSystem';
import { useTitleUnlocker } from './hooks/useTitleUnlocker';
import { useMailSystem } from './hooks/useMailSystem';
import { useWorldEventSystem } from './hooks/useWorldEventSystem';
import { useMobileChat } from './hooks/useMobileChat'; // ✅ อย่าลืมสร้างไฟล์นี้นะครับ

// Icons
import { MessageSquare, Terminal } from 'lucide-react';

export default function App() {
  // ==========================================
  // 💾 1. STATE MANAGEMENT
  // ==========================================
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
  
  // ✅ 1.1 ใช้ World Event System (แทนที่ useEffect และ State บอสเดิม)
  const { worldEvent, setWorldEvent, respawnTimeLeft, broadcast } = useWorldEventSystem();

  // ✅ 1.2 ใช้ Mail System (แทนที่ฟังก์ชันจดหมายเดิม)
  const { 
    claimMailItems, 
    deleteMail, 
    clearReadMail, 
    redeemGiftCode, 
    wrapItemAsCode 
  } = useMailSystem(player, setPlayer, setLogs);

  // ✅ 1.3 ใช้ Mobile Chat System (แทนที่ Logic การลากปุ่มแชทเดิม)
  const {
    chatPos,
    unreadChatCount,
    setUnreadChatCount,
    showMobileChat,
    setShowMobileChat,
    handleChatTouchStart,
    handleChatTouchMove,
    handleChatTouchEnd
  } = useMobileChat();

  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // 🕵️ Dev Token
  const installDevToken = (inputName) => {
    if (inputName === 'nanza1988') {
      localStorage.setItem('dev_token', '198831');
      window.sendAnnouncement?.("🔓 SYSTEM: DEV TOKEN INSTALLED");
      return true;
    }
    return false;
  };

  // ==========================================
  // ⚔️ 2. STATS & LOGIC HOOKS
  // ==========================================
  const passiveBonuses = useMemo(() => getPassiveBonus(player.equippedPassives, MONSTER_SKILLS), [player.equippedPassives]);
  const collectionBonuses = useMemo(() => calculateCollectionBonuses(player.collection, monsters), [player.collection]);
  const collScore = useMemo(() => calculateCollectionScore(player.inventory), [player.inventory]);
  const activeTitle = useMemo(() => allTitles?.find(t => t.id === player.activeTitleId) || allTitles?.[0], [player.activeTitleId]);
  
  const totalStatsPlayer = useCharacterStats(player, activeTitle, passiveBonuses, collectionBonuses);

  useTitleUnlocker(totalStatsPlayer, collScore, setPlayer, setNewTitlePopup, gameState);
  useLevelSystem(player, setPlayer, setLogs);

  useEffect(() => {
    if (player.level > 1) { 
      setPlayer(prev => ({ ...prev, hp: totalStatsPlayer.maxHp }));
    }
  }, [player.level, totalStatsPlayer.maxHp]);

  const { saveGame, loadGame, clearSave } = useSaveSystem(player, setPlayer, setLogs);
  
  const engine = useGameEngine({
    player, setPlayer, setLogs, totalStatsPlayer, collectionBonuses,
    gameState, setGameState, currentMap, setCurrentMap, saveGame, collection: player.collection,
    worldEvent, setWorldEvent, allSkills: MONSTER_SKILLS,
    mapControls: { currentMap, setCurrentMap, gameState, setGameState, worldEvent, setWorldEvent }
  });

  const handleManualSave = () => { 
    if (saveGame()) { 
      setHasSave(true); 
      setShowSaveToast(true); 
      setTimeout(() => setShowSaveToast(false), 2000); 
    } 
  };
  
  const triggerNewGame = (name) => { 
    installDevToken(name);
    setPendingName(name); 
    setIsConfirmOpen(true); 
  };

  const handleStartNewGame = () => {
    clearSave(); 
    installDevToken(pendingName);
    setPlayer({ ...INITIAL_PLAYER_DATA, name: pendingName, hp: INITIAL_PLAYER_DATA.maxHp || 100 });
    setHasSave(false); setCurrentMap(null); setGameState('MAP_SELECTION'); setIsConfirmOpen(false); setActiveTab('TRAVEL');
    setLogs(["🌅 ยินดีต้อนรับสู่การผจญภัยครั้งใหม่!", "📍 กรุณาเลือกแผนที่เพื่อเริ่มต้นการเดินทาง"]);
  };

  useEffect(() => {
    const savedData = localStorage.getItem('rpg_game_save_v1');
    if (savedData && savedData !== "null") setHasSave(true);
  }, []);

  const { renderMainView } = useViewRenderer({
    ...engine, activeTab, logs, originalPlayer: player, player: totalStatsPlayer, setPlayer, setLogs, 
    collScore, passiveBonuses, collectionBonuses, monsters, allSkills: MONSTER_SKILLS, gameState, currentMap, 
    claimMailItems, deleteMail, clearReadMail, redeemGiftCode, wrapItemAsCode, 
    setGameState, saveGame: handleManualSave, clearSave, hasSave, worldEvent, setWorldEvent, 
    respawnTimeLeft,
    onStart: triggerNewGame,
    onContinue: () => {
      const loaded = loadGame();
      if (loaded) {
        if (loaded.currentMap) setGameState('PLAYING'); else setGameState('MAP_SELECTION');
        setActiveTab('TRAVEL');
      }
    }
  });

  return (
    <GameLayout 
      overlays={<>
        <div className="fixed inset-0 z-[50000] pointer-events-none flex items-center justify-center">
          <div className="pointer-events-auto">
            <TitleUnlockPopup data={newTitlePopup} onClose={() => setNewTitlePopup(null)} />
          </div>
        </div>

        {broadcast.show && (
          <div className="fixed top-16 left-0 right-0 z-[9999] flex justify-center px-4 pointer-events-none animate-in fade-in slide-in-from-top-10 duration-500">
            <div className="bg-slate-950/90 border-y-2 border-amber-500 shadow-[0_0_30px_rgba(245,158,11,0.3)] w-full max-w-2xl p-4 relative overflow-hidden text-center">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-amber-500/10 to-transparent animate-pulse" />
              <div className="relative flex flex-col items-center gap-1">
                <div className="flex items-center gap-2">
                  <Terminal size={12} className="text-amber-500" />
                  <span className="text-[10px] font-black text-amber-500 uppercase italic tracking-[0.3em]">System Broadcast</span>
                  <Terminal size={12} className="text-amber-500" />
                </div>
                <h2 className="text-base md:text-xl font-black text-white uppercase italic tracking-tighter drop-shadow-lg">
                  {broadcast.message}
                </h2>
              </div>
            </div>
          </div>
        )}

        <div className="fixed inset-0 z-[50001] pointer-events-none flex items-center justify-center">
          <div className="pointer-events-auto">
            <ConfirmModal isOpen={isConfirmOpen} onClose={() => setIsConfirmOpen(false)}
              onConfirm={handleStartNewGame} title="WIPE DATA?" message="คุณต้องการลบประวัติการผจญภัยและเริ่มใหม่ทั้งหมดใช่หรือไม่?" />
          </div>
        </div>
          
        {showSaveToast && (
          <div className="fixed top-14 right-4 z-[1000] animate-in fade-in slide-in-from-top-2 duration-300 pointer-events-none">
            <div className="bg-emerald-500 text-slate-950 px-3 py-1 rounded-full text-[8px] font-black uppercase shadow-lg">✓ Data Secured</div>
          </div>
        )}

        {gameState !== 'START_SCREEN' && !showMobileChat && (
          <button 
            style={{ 
              left: `${chatPos.x}px`, 
              top: `${chatPos.y}px`, 
              position: 'fixed',
              zIndex: 9999, 
              display: isMobile ? 'block' : 'none', 
              pointerEvents: 'auto', 
              touchAction: 'none' 
            }}
            onTouchStart={handleChatTouchStart}
            onTouchMove={handleChatTouchMove} 
            onTouchEnd={() => handleChatTouchEnd(() => setUnreadChatCount(0))} 
            onClick={() => setShowMobileChat(true)} 
            className="md:hidden fixed bg-amber-500 text-slate-950 p-3 rounded-full shadow-[0_0_20px_rgba(0,0,0,0.5)] border-2 border-slate-950 active:scale-90 transition-transform"
          >
            <MessageSquare size={20} />
            {unreadChatCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-600 text-white text-[10px] w-5 h-5 rounded-full flex items-center justify-center border-2 border-slate-950 font-black">
                {unreadChatCount}
              </span>
            )}
          </button>
        )}
      </>}
      sidebar={gameState !== 'START_SCREEN' && (
        <Sidebar activeTab={activeTab} setActiveTab={(t) => { setActiveTab(t); if (t === 'TRAVEL') setUnreadChatCount(0); setShowMobileChat(false); }} player={totalStatsPlayer} saveGame={handleManualSave} unreadChatCount={unreadChatCount} />
      )}
      worldChat={gameState !== 'START_SCREEN' && (
        <div className={showMobileChat ? 'fixed inset-0 z-[10000] flex bg-slate-950/95 pointer-events-auto' : 'hidden md:flex flex-col h-full w-[320px] border-l border-white/5 bg-slate-900/20 pointer-events-auto'}>
          <WorldChat 
            player={player} 
            isMobile={isMobile} 
            showMobileChat={showMobileChat}
            isOpen={showMobileChat}
            onClose={() => setShowMobileChat(false)} 
            onNewMessage={() => { 
              if (activeTab !== 'TRAVEL' || (isMobile && !showMobileChat)) { 
                setUnreadChatCount(prev => (prev || 0) + 1); 
              } 
            }} 
            unreadChatCount={unreadChatCount} 
          />    
        </div>
      )}
    >
      {renderMainView()}
    </GameLayout>
  );
}