import React, { useState, useEffect, useMemo } from 'react'; 
// --- Components & Layout ---
import Sidebar from './components/Sidebar';
import WorldChat from './components/WorldChat';
import TitleUnlockPopup from './components/TitleUnlockPopup';
import ConfirmModal from './components/ConfirmModal'; 
// ❌ ลบ TutorialOverlay ออก
import GameLayout from './components/layout/GameLayout';

// --- Data & Utils ---
import { calculateCollectionScore, getPassiveBonus, calculateCollectionBonuses } from './utils/characterUtils';
import { MONSTER_SKILLS } from './data/passive';
import { monsters } from './data/monsters/index'; 
import { titles as allTitles } from './data/titles'; 
import { INITIAL_PLAYER_DATA, INITIAL_LOGS } from './data/playerState';
import { map1Monsters } from './data/monsters/map1_meadow';
import { generateFinalMonster } from './utils/monsterUtils';

// --- Hooks ---
import { useCharacterStats } from './hooks/useCharacterStats'; 
import { useSaveSystem } from './hooks/useSaveSystem'; 
// ❌ ลบ useTutorialManager ออก
import { useGameEngine } from './hooks/useGameEngine'; 
import { useViewRenderer } from './hooks/useViewRenderer.jsx';
import { useLevelSystem } from './hooks/useLevelSystem';

import { MessageSquare, X, Terminal } from 'lucide-react';

export default function App() {
  // ==========================================
  // 💾 1. STATE MANAGEMENT
  // ==========================================
  const [activeTab, setActiveTab] = useState('TRAVEL');
  const [logs, setLogs] = useState(INITIAL_LOGS);
  
  // ✅ [FIX] มั่นใจว่า gameState เริ่มที่ START_SCREEN เสมอ
  const [gameState, setGameState] = useState('START_SCREEN');
  const [currentMap, setCurrentMap] = useState(null);
  
  const [worldEvent, setWorldEvent] = useState({
  active: true,
  bossId: 'black_dragon_king',
  name: "BLACK DRAGON KING", // เปลี่ยนชื่อ
  currentHp: 1500000,           // เพิ่มเลือดให้สมกับเป็นมังกร (2.5 ล้าน)
  maxHp: 1500000,
  participants: 0 
  });

  const [player, setPlayer] = useState(INITIAL_PLAYER_DATA);
  const [unreadChatCount, setUnreadChatCount] = useState(0);
  const [newTitlePopup, setNewTitlePopup] = useState(null);
  
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [pendingName, setPendingName] = useState('');
  const [showSaveToast, setShowSaveToast] = useState(false);
  
  // ✅ State สำหรับเช็คว่ามีไฟล์เซฟในเครื่องไหม (เพื่อแสดงปุ่ม Continue)
  const [hasSave, setHasSave] = useState(false);

  const [showMobileChat, setShowMobileChat] = useState(false);
  const [showDebug, setShowDebug] = useState(false);

  // --- Brain & Stats ---
  const passiveBonuses = useMemo(() => getPassiveBonus(player.equippedPassives, MONSTER_SKILLS), [player.equippedPassives]);
  const collectionBonuses = useMemo(() => calculateCollectionBonuses(player.collection, monsters), [player.collection]);
  const collScore = useMemo(() => calculateCollectionScore(player.inventory), [player.inventory]);
  const activeTitle = useMemo(() => allTitles?.find(t => t.id === player.activeTitleId) || allTitles?.[0], [player.activeTitleId]);
  
  const totalStatsPlayer = useCharacterStats(player, activeTitle, passiveBonuses, collectionBonuses);

  useEffect(() => {
    if (player.level > 1) { 
      setPlayer(prev => ({
        ...prev,
        hp: totalStatsPlayer.maxHp
      }));
    }
  }, [player.level]);

  // --- Systems & Engine ---
  const { saveGame, loadGame, clearSave } = useSaveSystem(player, setPlayer, setLogs);
  
  const engine = useGameEngine({
    player, setPlayer, setLogs, totalStatsPlayer, collectionBonuses,
    gameState, setGameState, currentMap, setCurrentMap, saveGame, collection: player.collection,
    // ✅ ส่ง worldEvent เข้าไปใน Engine ด้วย
    worldEvent, setWorldEvent 
  });

  const [chatPos, setChatPos] = useState({ x: window.innerWidth - 70, y: window.innerHeight - 150 });
  const [isDragging, setIsDragging] = useState(false);

  const handleChatTouchMove = (e) => {
    if (showMobileChat) return;
    const touch = e.touches[0];
    const newX = Math.min(Math.max(10, touch.clientX - 28), window.innerWidth - 60);
    const newY = Math.min(Math.max(10, touch.clientY - 28), window.innerHeight - 60);
    setChatPos({ x: newX, y: newY });
    setIsDragging(true);
  };
  
  useLevelSystem(player, setPlayer, setLogs);

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
    // 1. ล้างข้อมูลเก่าทั้งหมด
    clearSave(); 
    
    // 2. ตั้งค่าผู้เล่นใหม่พร้อมชื่อที่ระบุ
    setPlayer({
      ...INITIAL_PLAYER_DATA,
      name: pendingName,
      hp: INITIAL_PLAYER_DATA.maxHp || 100,
      materials: INITIAL_PLAYER_DATA.materials
    });
    
    setHasSave(false);
    
    // ✅ 3. [FIX] บังคับลำดับหน้าจอ: ไปหน้าเลือกแผนที่เท่านั้น
    // และต้องล้าง currentMap เพื่อให้ useViewRenderer แสดงหน้า Map Selection
    setCurrentMap(null); 
    setGameState('MAP_SELECTION'); 
    
    setIsConfirmOpen(false);
    setActiveTab('TRAVEL');
    
    setLogs([
      "🌅 ยินดีต้อนรับสู่การผจญภัยครั้งใหม่!", 
      "📍 กรุณาเลือกแผนที่เพื่อเริ่มต้นการเดินทาง"
    ]);
  };

  // ✅ [FIX] ส่วนการเช็คเซฟเมื่อโหลดหน้าเว็บครั้งแรก (คงเดิมเพื่อให้ค้างที่หน้า Start)
  useEffect(() => {
    const savedData = localStorage.getItem('rpg_game_save_v1');
    if (savedData && savedData !== "null") {
      setHasSave(true);
      try {
        const parsed = JSON.parse(savedData);
        if (parsed && !parsed.materials) {
           setPlayer(prev => ({
             ...prev,
             materials: { scrap: 0, shard: 0, dust: 0 }
           }));
        }
      } catch (e) { console.error("Save check error", e); }
    }
  }, []);

  const { renderMainView, startCombat } = useViewRenderer({
    ...engine, 
    activeTab,
    logs,
    originalPlayer: player,
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
    worldEvent,
    setWorldEvent,
    onStart: triggerNewGame,
    onContinue: () => {
      const loaded = loadGame();
      if (loaded) {
        if (!loaded.materials) {
          setPlayer(prev => ({ ...prev, materials: { scrap: 0, shard: 0, dust: 0 } }));
        }
        // ✅ [FIX] ตรวจสอบว่ามีแมพค้างอยู่ไหม ถ้าไม่มีให้ไปหน้าเลือกแมพ
        if (loaded.currentMap) {
          setGameState('PLAYING');
        } else {
          setGameState('MAP_SELECTION');
        }
        setActiveTab('TRAVEL');
      }
    }
  });

  return (
    <GameLayout 
      overlays={<>
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

        {gameState !== 'START_SCREEN' && !showMobileChat && (
          <button 
            style={{ left: chatPos.x, top: chatPos.y }} 
            onTouchMove={handleChatTouchMove}
            onTouchEnd={() => setTimeout(() => setIsDragging(false), 50)}
            onClick={() => !isDragging && setShowMobileChat(true)}
            className="md:hidden fixed z-[60] bg-amber-500 text-slate-950 p-3 rounded-full shadow-2xl border-2 border-slate-950 touch-none"
          >
            <MessageSquare size={20} />
          </button>
        )}
      </>}
      
      sidebar={gameState !== 'START_SCREEN' && (
        <Sidebar 
          activeTab={activeTab} 
          setActiveTab={(t) => { 
            setActiveTab(t); 
            if (t === 'TRAVEL') setUnreadChatCount(0); 
            setShowMobileChat(false); 
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
            : 'hidden md:flex flex-col h-full w-[320px] border-l border-white/5 bg-slate-900/20'}
        `}>
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