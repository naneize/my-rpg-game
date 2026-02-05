import React, { useState, useEffect } from 'react'; 
// --- Components & Views ---
import Sidebar from './components/Sidebar';
import WorldChat from './components/WorldChat';
import TitleUnlockPopup from './components/TitleUnlockPopup';
import { calculateCollectionScore, getPassiveBonus, calculateCollectionBonuses } from './utils/characterUtils';

import { MONSTER_SKILLS } from './data/passive';
import { monsters } from './data/monsters/index'; 

// --- Data & Hooks ---
import { initialStats } from './data/playerStats';
import { useCombat } from './hooks/useCombat';
import { useTravel } from './hooks/useTravel.jsx';
import { useTitleObserver } from './hooks/useTitleObserver'; 
import { useLevelSystem } from './hooks/useLevelSystem';
import { useWalkingSystem } from './hooks/useWalkingSystem';
import { useViewRenderer } from './hooks/useViewRenderer.jsx';

import { useSaveSystem } from './hooks/useSaveSystem'; 

export default function App() {
  // ==========================================
  // 💾 1. STATE MANAGEMENT
  // ==========================================
  const [activeTab, setActiveTab] = useState('TRAVEL');
  const [logs, setLogs] = useState(["เริ่มบันทึกการเดินทาง..."]);
  const [gameState, setGameState] = useState('START_SCREEN');
  const [currentMap, setCurrentMap] = useState(null);
  
  const [showSaveToast, setShowSaveToast] = useState(false);

  const [player, setPlayer] = useState({
    ...initialStats,
    name: initialStats.name || '', 
    activeTitleId: 'none', 
    unlockedTitles: ['none'], 
    totalSteps: 0,
    collection: initialStats.collection || {} 
  });

  const [newTitlePopup, setNewTitlePopup] = useState(null);

  // ==========================================
  // 💾 1.1 SAVE SYSTEM LOGIC
  // ==========================================
  const { saveGame, loadGame, clearSave } = useSaveSystem(player, setPlayer, setLogs);

  const handleManualSave = () => {
    const success = saveGame();
    if (success) {
      setShowSaveToast(true);
      setTimeout(() => setShowSaveToast(false), 2000);
    }
  };

  useEffect(() => {
    loadGame();
  }, []); 

  const handleStart = (chosenName) => {
    if (chosenName) {
      setPlayer(prev => ({ ...prev, name: chosenName }));
    }
    setGameState('MAP_SELECTION'); 
  };

  // ==========================================
  // 🧮 1.5 PRE-CALCULATION
  // ==========================================
  const collScore = calculateCollectionScore(player.inventory);
  const passiveBonuses = getPassiveBonus(player.equippedPassives, MONSTER_SKILLS);
  const collectionBonuses = calculateCollectionBonuses(player.collection || {}, monsters || []);

  // ==========================================
  // 🗺️ 2. TRAVEL SYSTEM
  // ==========================================
  const travel = useTravel(
    player, 
    setPlayer, 
    setLogs, 
    (monster) => combat.startCombat(monster), 
    currentMap 
  ); 
  const { handleStep, inDungeon, exitDungeon, advanceDungeon } = travel;

  // ==========================================
  // ⚔️ 3. COMBAT SYSTEM
  // ==========================================
  const combat = useCombat(
    player, 
    setPlayer, 
    setLogs, 
    advanceDungeon,
    exitDungeon,
    inDungeon,
    collectionBonuses, 
    { currentMap, setCurrentMap, gameState, setGameState } 
  ); 
  
  const { isCombat, handleSelectMap } = combat;

  combat.advanceDungeon = advanceDungeon;
  combat.exitDungeon = exitDungeon;
  combat.inDungeon = inDungeon;

  // ==========================================
  // 🎖️ 4. CUSTOM GAME SYSTEMS
  // ==========================================
  useTitleObserver(player, setPlayer, setNewTitlePopup);
  useLevelSystem(player, setPlayer, setLogs);

  const walking = useWalkingSystem(player, setPlayer, setLogs, isCombat, handleStep);
  const { handleWalkingStep } = walking;

  // ==========================================
  // 🎭 5. VIEW RENDERER
  // ==========================================
  const { renderMainView } = useViewRenderer({
    activeTab,
    logs,
    player,
    setPlayer,
    setLogs,
    collScore,
    passiveBonuses,
    collectionBonuses, 
    collection: player.collection || {}, 
    monsters, 
    gameState,          
    currentMap,          
    handleSelectMap, 
    setGameState,
    ...combat,   
    ...travel,   
    ...walking,
    advanceDungeon,
    forceShowColor: true,
    playerLevel: player.level,
    saveGame: handleManualSave,
    clearSave,
    onContinue: loadGame,
    onStart: handleStart 
  });

  return (
    <div className="flex flex-col md:flex-row h-[100dvh] bg-transparent text-slate-200 overflow-hidden font-serif text-left relative">
      
      {/* 🔔 ป้ายแจ้งเตือน Save Successful ดีไซน์ใหม่ */}
      {showSaveToast && (
        <div className="fixed top-14 right-4 z-[1000] animate-in fade-in slide-in-from-top-2 duration-300">
          <div className="bg-emerald-500 text-slate-950 px-3 py-1 rounded-full text-[8px] font-black uppercase italic shadow-lg shadow-emerald-500/20">
            ✓ Data Secured
          </div>
        </div>
      )}

      {/* 💾 ปุ่ม Quick Save ดีไซน์ใหม่สำหรับ Mobile & Desktop */}
      {gameState !== 'START_SCREEN' && (
        <div className="fixed top-2 right-2 z-[500] flex items-center">
          <button 
            onClick={handleManualSave}
            className="group relative flex items-center gap-2 px-3 py-1.5 bg-slate-900/40 backdrop-blur-md border border-emerald-500/30 rounded-full transition-all active:scale-90 shadow-[0_0_15px_rgba(16,185,129,0.1)]"
          >
            <div className="flex items-center justify-center w-4 h-4 bg-emerald-500/20 rounded-full border border-emerald-500/40">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="w-2.5 h-2.5 text-emerald-500">
                <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" />
                <polyline points="17 21 17 13 7 13 7 21" />
                <polyline points="7 3 7 8 15 8" />
              </svg>
            </div>
            <span className="text-[9px] font-black uppercase tracking-widest text-emerald-400 italic">
              Quick Save
            </span>
          </button>
        </div>
      )}

      {/* 💬 ระบบแชทสำหรับเวอร์ชันโมบาย */}
      {gameState !== 'START_SCREEN' && (
        <div className="md:hidden fixed bottom-20 right-4 z-[400]">
          <WorldChat player={player} isMobile={true} />
        </div>
      )}

      {/* Sidebar */}
      {gameState !== 'START_SCREEN' && (
        <Sidebar 
          activeTab={activeTab} 
          setActiveTab={setActiveTab} 
          gold={player.gold} 
          player={player} 
        />
      )}

      <main className="flex-1 relative overflow-hidden flex flex-col">
        <TitleUnlockPopup data={newTitlePopup} onClose={() => setNewTitlePopup(null)} />

        <div className={`flex-1 overflow-y-auto ${gameState === 'START_SCREEN' ? 'p-0' : 'p-2'}`}>
          {renderMainView()}
        </div>
      </main>
    </div>
  );
}