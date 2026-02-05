import React, { useState, useEffect, useMemo } from 'react'; 
// --- Components & Layout ---
import Sidebar from './components/Sidebar';
import WorldChat from './components/WorldChat';
import TitleUnlockPopup from './components/TitleUnlockPopup';
import ConfirmModal from './components/ConfirmModal'; 
import TutorialOverlay from './components/TutorialOverlay'; 
import GameLayout from './components/layout/GameLayout';

// --- Data & Utils ---
import { calculateCollectionScore, getPassiveBonus, calculateCollectionBonuses } from './utils/characterUtils';
import { MONSTER_SKILLS } from './data/passive';
import { monsters } from './data/monsters/index'; 
import { titles as allTitles } from './data/titles'; 
import { INITIAL_PLAYER_DATA, INITIAL_LOGS } from './data/playerState';

// --- Hooks ---
import { useCharacterStats } from './hooks/useCharacterStats'; 
import { useSaveSystem } from './hooks/useSaveSystem'; 
import { useTutorialManager } from './hooks/useTutorialManager';
import { useGameEngine } from './hooks/useGameEngine'; 
import { useViewRenderer } from './hooks/useViewRenderer.jsx';

// ✅ นำเข้าไอคอนเพิ่มเติมสำหรับปุ่ม Chat
import { MessageSquare, X } from 'lucide-react';

export default function App() {
  // ==========================================
  // 💾 1. STATE MANAGEMENT
  // ==========================================
  const [activeTab, setActiveTab] = useState('TRAVEL');
  const [logs, setLogs] = useState(INITIAL_LOGS);
  const [gameState, setGameState] = useState('START_SCREEN');
  const [currentMap, setCurrentMap] = useState(null);
  const [player, setPlayer] = useState(INITIAL_PLAYER_DATA);
  const [unreadChatCount, setUnreadChatCount] = useState(0);
  const [newTitlePopup, setNewTitlePopup] = useState(null);
  
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [pendingName, setPendingName] = useState('');
  const [showSaveToast, setShowSaveToast] = useState(false);
  const [hasSave, setHasSave] = useState(false);

  // 📱 สถานะสำหรับเปิด/ปิดแชทบนมือถือ
  const [showMobileChat, setShowMobileChat] = useState(false);

  // 1. Brain
  const passiveBonuses = useMemo(() => getPassiveBonus(player.equippedPassives, MONSTER_SKILLS), [player.equippedPassives]);
  const collectionBonuses = useMemo(() => calculateCollectionBonuses(player.collection, monsters), [player.collection]);
  const collScore = useMemo(() => calculateCollectionScore(player.inventory), [player.inventory]);
  
  const totalStatsPlayer = useMemo(() => {
    const activeTitle = allTitles?.find(t => t.id === player.activeTitleId) || allTitles?.[0];
    return useCharacterStats(player, activeTitle, passiveBonuses, collectionBonuses);
  }, [player, passiveBonuses, collectionBonuses]);

  // 2. Systems
  const { saveGame, loadGame, clearSave } = useSaveSystem(player, setPlayer, setLogs);
  const { tutorialStep, closeTutorial } = useTutorialManager(player, setPlayer, gameState, activeTab);
  
  // 3. Engine
  const engine = useGameEngine({
    player, setPlayer, setLogs, totalStatsPlayer, collectionBonuses,
    gameState, setGameState, currentMap, setCurrentMap, saveGame
  });

  const [chatPos, setChatPos] = useState({ x: window.innerWidth - 70, y: window.innerHeight - 150 });
const [isDragging, setIsDragging] = useState(false);

// 2. ฟังก์ชันจัดการการลาก
const handleChatTouchMove = (e) => {
  if (showMobileChat) return;
  const touch = e.touches[0];
  const newX = Math.min(Math.max(10, touch.clientX - 28), window.innerWidth - 60);
  const newY = Math.min(Math.max(10, touch.clientY - 28), window.innerHeight - 60);
  setChatPos({ x: newX, y: newY });
  setIsDragging(true);
};

  // ==========================================
  // ⚒️ 2. ACTIONS
  // ==========================================
  const handleManualSave = () => { 
    if (saveGame()) { 
      setHasSave(true);
      setShowSaveToast(true);
      setTimeout(() => setShowSaveToast(false), 2000);
    } 
  };

  const triggerNewGame = (name) => { 
    setPendingName(name); 
    setIsConfirmOpen(true); 
  };

  const handleStartNewGame = () => {
    clearSave(); 
    setPlayer({
      ...INITIAL_PLAYER_DATA,
      name: pendingName,
      hp: INITIAL_PLAYER_DATA.maxHp || 100
    });
    setHasSave(false);
    setGameState('MAP_SELECTION');
    setIsConfirmOpen(false);
    // ✅ เมื่อเริ่มเกมใหม่ ให้ Reset Tab มาที่ TRAVEL
    setActiveTab('TRAVEL');
    setLogs(["🌅 ยินดีต้อนรับสู่การผจญภัยครั้งใหม่!", "📍 กรุณาเลือกแผนที่เพื่อเริ่มต้นการเดินทาง"]);
  };

  useEffect(() => {
    const savedData = localStorage.getItem('rpg_game_save_v1');
    if (savedData && savedData !== "null") setHasSave(true);
  }, []);

  // 4. View Renderer
  const { renderMainView } = useViewRenderer({
    ...engine, 
    activeTab,
    logs,
    player: totalStatsPlayer,
    setPlayer,
    setLogs,
    collScore,
    passiveBonuses,
    collectionBonuses,
    monsters,
    gameState,
    currentMap,
    setGameState,
    saveGame: handleManualSave,
    clearSave,
    hasSave,
    onStart: triggerNewGame,
    onContinue: () => {
      const loaded = loadGame();
      if (loaded) {
        setGameState('MAP_SELECTION');
        if (loaded.currentMap) setGameState('PLAYING');
        setActiveTab('TRAVEL');
      }
    }
  });

  return (
    <GameLayout 
      overlays={<>
        {tutorialStep && <TutorialOverlay step={tutorialStep} onNext={closeTutorial} />}
        <ConfirmModal 
          isOpen={isConfirmOpen} 
          onClose={() => setIsConfirmOpen(false)} 
          onConfirm={handleStartNewGame} 
          title="WIPE DATA?" 
          message="คุณต้องการลบประวัติการผจญภัยและเริ่มใหม่ทั้งหมดใช่หรือไม่?" 
        />
        {showSaveToast && (
          <div className="fixed top-14 right-4 z-[1000] animate-in fade-in slide-in-from-top-2 duration-300">
            <div className="bg-emerald-500 text-slate-950 px-3 py-1 rounded-full text-[8px] font-black uppercase shadow-lg">✓ Data Secured</div>
          </div>
        )}

        {/* 🔘 ปุ่มกดเรียกดูแชท (Floating Action Button) - แสดงเฉพาะบนมือถือตอนเล่นเกม */}
        {gameState !== 'START_SCREEN' && !showMobileChat && (
          <button 
    style={{ left: chatPos.x, top: chatPos.y }} // ใช้ตำแหน่งจาก State
    onTouchMove={handleChatTouchMove}
    onTouchEnd={() => setTimeout(() => setIsDragging(false), 50)}
    onClick={() => !isDragging && setShowMobileChat(true)}
    className="md:hidden fixed z-[60] bg-amber-500 text-slate-950 p-3 rounded-full shadow-2xl border-2 border-slate-950 touch-none"
  >
    <MessageSquare size={20} />
    {/* ... เลขแจ้งเตือน ... */}
  </button>
        )}
      </>}
      
      sidebar={gameState !== 'START_SCREEN' && (
        <Sidebar 
          activeTab={activeTab} 
          setActiveTab={(t) => { 
            setActiveTab(t); 
            if (t === 'TRAVEL') setUnreadChatCount(0); 
            setShowMobileChat(false); // ปิดแชทเมื่อเปลี่ยนเมนู
          }} 
          player={totalStatsPlayer} 
          saveGame={handleManualSave} 
          unreadChatCount={unreadChatCount} 
        />
      )}
      
      worldChat={gameState !== 'START_SCREEN' && (
        <div className={`
          ${showMobileChat 
            ? 'fixed inset-0 z-[100] bg-slate-950/98 p-4 flex flex-col animate-in fade-in slide-in-from-bottom duration-300' 
            : 'hidden md:flex flex-col h-full'}
        `}>
          {/* ส่วนหัวของแชทบนมือถือ (มีปุ่มปิด) */}
          <div className="flex justify-between items-center mb-4 md:hidden">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <h3 className="text-white font-black text-xs uppercase italic tracking-widest">Global Comms</h3>
            </div>
            <button 
              onClick={() => setShowMobileChat(false)}
              className="p-2 bg-slate-800 rounded-full text-slate-400 hover:text-white"
            >
              <X size={20} />
            </button>
          </div>

          <WorldChat 
            player={player} 
            onNewMessage={() => {
              if (activeTab !== 'TRAVEL' || (window.innerWidth < 768 && !showMobileChat)) {
                setUnreadChatCount(prev => prev + 1);
              }
            }} 
            unreadChatCount={unreadChatCount} 
          />
        </div>
      )}
    >
      <TitleUnlockPopup data={newTitlePopup} onClose={() => setNewTitlePopup(null)} />
      {renderMainView()}
    </GameLayout>
  );
}