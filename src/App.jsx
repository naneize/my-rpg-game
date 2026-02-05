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
  
  // ✅ สำหรับโชว์ป้ายแจ้งเตือนเซฟ
  const [showSaveToast, setShowSaveToast] = useState(false);

  const [player, setPlayer] = useState({
    ...initialStats,
    name: initialStats.name || '', // ✅ เพิ่มฟิลด์ชื่อใน State เริ่มต้น
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

  // ✅ ฟังก์ชันกดเซฟพร้อมแสดงการแจ้งเตือน
  const handleManualSave = () => {
    const success = saveGame();
    if (success) {
      setShowSaveToast(true);
      setTimeout(() => setShowSaveToast(false), 2000);
    }
  };

  // 🔄 Auto-Load เมื่อเปิดแอปครั้งแรก
  useEffect(() => {
    loadGame();
  }, []); 

  // ✅ [เพิ่มใหม่] ฟังก์ชันรับชื่อและเริ่มเกม
  const handleStart = (chosenName) => {
    if (chosenName) {
      setPlayer(prev => ({ ...prev, name: chosenName }));
    }
    setGameState('MAP_SELECTION'); // หรือชื่อ State ที่คุณใช้สำหรับหน้าเลือกด่าน
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
    onStart: handleStart // ✅ ส่งฟังก์ชัน handleStart ใหม่เข้าไปแทน setGameState ตรงๆ
  });

  return (
    <div className="flex flex-col md:flex-row h-[100dvh] bg-transparent text-slate-200 overflow-hidden font-serif text-left relative">
      
      {/* 🔔 ป้ายแจ้งเตือน Save Successful */}
      {showSaveToast && (
        <div className="fixed top-12 left-1/2 -translate-x-1/2 z-[300] bg-emerald-500 text-white px-5 py-2 rounded-full font-black text-[10px] shadow-[0_0_20px_rgba(16,185,129,0.4)] border border-emerald-400/50 uppercase tracking-widest italic animate-in fade-in slide-in-from-top-2 duration-300">
          ✨ Game Saved Successfully!
        </div>
      )}

      {/* 💾 ปุ่ม Quick Save */}
      {gameState !== 'START_SCREEN' && (
        <div className="fixed top-1 right-15  z-[200] flex gap-2">
          <button 
            onClick={handleManualSave}
            className="px-2 py-1 bg-emerald-600/80 hover:bg-emerald-500 backdrop-blur-sm text-[10px] font-black rounded-lg border border-emerald-400/30 transition-all active:scale-90"
          >
            💾 QUICK SAVE
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