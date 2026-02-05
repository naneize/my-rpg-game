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

  // 1. Brain: การคำนวณสเตตัส (เน้น ATK 25 เป็นหลัก)
  const passiveBonuses = useMemo(() => getPassiveBonus(player.equippedPassives, MONSTER_SKILLS), [player.equippedPassives]);
  const collectionBonuses = useMemo(() => calculateCollectionBonuses(player.collection, monsters), [player.collection]);
  const collScore = useMemo(() => calculateCollectionScore(player.inventory), [player.inventory]);
  
  const totalStatsPlayer = useMemo(() => {
    const activeTitle = allTitles?.find(t => t.id === player.activeTitleId) || allTitles?.[0];
    // ✅ ลบการอ้างอิงถึง player.equippedWeapon ออกถาวร
    return useCharacterStats(player, activeTitle, passiveBonuses, collectionBonuses);
  }, [player, passiveBonuses, collectionBonuses]);

  // 2. Systems
  const { saveGame, loadGame, clearSave } = useSaveSystem(player, setPlayer, setLogs);
  const { tutorialStep, closeTutorial } = useTutorialManager(player, setPlayer, gameState, activeTab);
  
  // 3. Engine: ระบบเกมหลัก
  const engine = useGameEngine({
    player, setPlayer, setLogs, totalStatsPlayer, collectionBonuses,
    gameState, setGameState, currentMap, setCurrentMap, saveGame
  });

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
    setLogs(["🌅 ยินดีต้อนรับสู่การผจญภัยครั้งใหม่!", "📍 กรุณาเลือกแผนที่เพื่อเริ่มต้นการเดินทาง"]);
  };

  useEffect(() => {
    const savedData = localStorage.getItem('rpg_game_save_v1');
    if (savedData && savedData !== "null") setHasSave(true);
  }, []);

  // 4. View Renderer: เชื่อมต่อ UI กับ Engine
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
      </>}
      
      // ✅ ซ่อน Sidebar และ WorldChat เมื่ออยู่ที่หน้า Start Screen ตามที่แจ้ง
      sidebar={gameState !== 'START_SCREEN' && (
        <Sidebar 
          activeTab={activeTab} 
          setActiveTab={(t) => { setActiveTab(t); if (t === 'TRAVEL') setUnreadChatCount(0); }} 
          player={totalStatsPlayer} 
          saveGame={handleManualSave} 
          unreadChatCount={unreadChatCount} 
        />
      )}
      worldChat={gameState !== 'START_SCREEN' && (
        <WorldChat 
          player={player} 
          onNewMessage={() => activeTab !== 'TRAVEL' && setUnreadChatCount(prev => prev + 1)} 
          unreadChatCount={unreadChatCount} 
        />
      )}
    >
      <TitleUnlockPopup data={newTitlePopup} onClose={() => setNewTitlePopup(null)} />
      {renderMainView()}
    </GameLayout>
  );
}