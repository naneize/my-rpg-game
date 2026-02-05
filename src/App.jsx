import React, { useState, useEffect } from 'react'; 
// --- Components & Views ---
import Sidebar from './components/Sidebar';
import WorldChat from './components/WorldChat';
import TitleUnlockPopup from './components/TitleUnlockPopup';
import ConfirmModal from './components/ConfirmModal'; // ✅ นำเข้า Modal ใหม่
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

  // ✅ เพิ่ม State สำหรับ Modal ยืนยัน
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [pendingName, setPendingName] = useState('');

  const [player, setPlayer] = useState({
    ...initialStats,
    name: initialStats.name || '', 
    activeTitleId: 'none', 
    unlockedTitles: ['none'], 
    totalSteps: 0,
    collection: initialStats.collection || {} 
    // ❌ ตัด gold ออกจาก State เริ่มต้น
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

  // ✅ ปรับปรุง: ฟังก์ชันรัน Logic การ Reset ข้อมูลจริง (ตัดระบบเงินออก)
  const handleStart = (chosenName) => {
    clearSave(); 

    if (chosenName) {
      const freshPlayer = {
        ...initialStats,
        name: chosenName,
        hp: initialStats.maxHp,
        exp: 0,
        level: 1,
        activeTitleId: 'none',
        unlockedTitles: ['none'],
        totalSteps: 0,
        inventory: [],
        collection: {}
        // ❌ ระบบเงิน (gold) ถูกตัดออกถาวรจากข้อมูลเริ่มใหม่
      };
      setPlayer(freshPlayer);
    }
    
    setGameState('MAP_SELECTION'); 
    setLogs(["🌅 ยินดีต้อนรับสู่การผจญภัยครั้งใหม่!", "📍 กรุณาเลือกแผนที่เพื่อเริ่มต้นการเดินทาง"]);
  };

  // ✅ ฟังก์ชันเรียกเปิด Popup ยืนยัน (ส่งไปหน้า StartScreen)
  const triggerNewGame = (name) => {
    setPendingName(name);
    setIsConfirmOpen(true);
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
    skillTexts: combat.skillTexts,
    ...travel,   
    ...walking,
    advanceDungeon,
    forceShowColor: true,
    playerLevel: player.level,
    saveGame: handleManualSave,
    clearSave,
    onContinue: loadGame,
    onStart: triggerNewGame // ✅ เปลี่ยนมาใช้ตัว Trigger แทน
  });

  return (
    <div className="flex flex-col md:flex-row h-[100dvh] bg-transparent text-slate-200 overflow-hidden font-serif text-left relative">
      
      {/* ✅ วาง ConfirmModal ไว้ที่นี่ */}
      <ConfirmModal 
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={() => handleStart(pendingName)}
        title="WIPE DATA?"
        message="คุณต้องการลบประวัติการผจญภัยและเริ่มใหม่ทั้งหมดใช่หรือไม่? ข้อมูลเดิมจะหายไปถาวร"
      />

      {showSaveToast && (
        <div className="fixed top-14 right-4 z-[1000] animate-in fade-in slide-in-from-top-2 duration-300">
          <div className="bg-emerald-500 text-slate-950 px-3 py-1 rounded-full text-[8px] font-black uppercase italic shadow-lg shadow-emerald-500/20">
            ✓ Data Secured
          </div>
        </div>
      )}

      {gameState !== 'START_SCREEN' && (
        <div className="md:hidden">
          <WorldChat player={player} isMobile={true} />
        </div>
      )}

      {/* Sidebar: ❌ ตัด gold ออกจาก Props */}
      {gameState !== 'START_SCREEN' && (
        <Sidebar 
          activeTab={activeTab} 
          setActiveTab={setActiveTab} 
          player={player} 
          saveGame={handleManualSave}
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