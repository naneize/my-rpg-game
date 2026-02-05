import React, { useState, useEffect } from 'react'; 
// --- Components & Views ---
import Sidebar from './components/Sidebar';
import WorldChat from './components/WorldChat';
import TitleUnlockPopup from './components/TitleUnlockPopup';
import ConfirmModal from './components/ConfirmModal'; 
import TutorialOverlay from './components/TutorialOverlay'; 
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

// ✅ [คงเดิม] นำเข้าฟังก์ชันอัปเดตสถานะ
import { updateOnlineStatus } from './firebase'; 

export default function App() {
  // ==========================================
  // 💾 1. STATE MANAGEMENT
  // ==========================================
  const [activeTab, setActiveTab] = useState('TRAVEL');
  const [logs, setLogs] = useState(["เริ่มบันทึกการเดินทาง..."]);
  const [gameState, setGameState] = useState('START_SCREEN');
  const [currentMap, setCurrentMap] = useState(null);
  
  const [showSaveToast, setShowSaveToast] = useState(false);
  const [hasSave, setHasSave] = useState(false);

  // ✅ State สำหรับ Modal และ Tutorial
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [pendingName, setPendingName] = useState('');
  const [tutorialStep, setTutorialStep] = useState(null);

  // ✨ [คงเดิม] State สำหรับนับจำนวนแชทที่ยังไม่ได้อ่าน
  const [unreadChatCount, setUnreadChatCount] = useState(0);

  // 🚩 ViewedTutorials ถูกรวมเข้าใน Player แล้ว
  const [player, setPlayer] = useState({
    ...initialStats,
    name: initialStats.name || '', 
    activeTitleId: 'none', 
    unlockedTitles: ['none'], 
    totalSteps: 0,
    collection: initialStats.collection || {},
    viewedTutorials: [] 
  });

  const [newTitlePopup, setNewTitlePopup] = useState(null);

  // ==========================================
  // 💾 1.1 SAVE SYSTEM LOGIC
  // ==========================================
  const { saveGame, loadGame, clearSave } = useSaveSystem(player, setPlayer, setLogs);

  const handleManualSave = () => {
    const success = saveGame();
    if (success) {
      setHasSave(true);
      setShowSaveToast(true);
      setTimeout(() => setShowSaveToast(false), 2000);
    }
  };

  useEffect(() => {
    const savedData = localStorage.getItem('rpg_game_save_v1');
    if (savedData && savedData !== "null" && savedData !== "undefined") {
      try {
        const parsed = JSON.parse(savedData);
        if (parsed && (parsed.name || parsed.totalSteps > 0)) {
          setHasSave(true);
        }
      } catch (e) {
        setHasSave(false);
      }
    }
  }, []); 

  // ✨ [คงเดิม] ระบบ Online Presence: ทำงานเมื่อมีชื่อและเข้าสู่หน้าเลือกแผนที่/เล่นเกม
  useEffect(() => {
    // 1. ตรวจสอบสถานะเบื้องต้นใน Console
    console.log("DEBUG Presence:", { name: player.name, state: gameState });

    // 2. เงื่อนไขที่ผ่อนปรนขึ้น: ถ้ามีชื่อ (ไม่ว่าเป็นชื่อจากเซฟหรือตั้งใหม่) และไม่อยู่หน้าแรก
    if (player.name && player.name.trim() !== "" && gameState !== 'START_SCREEN') {
      console.log(`%c[Presence] Attempting to connect: ${player.name}`, "color: #3b82f6; font-weight: bold;");
      updateOnlineStatus(player.name);
    } else {
      console.log("%c[Presence] Condition not met yet.", "color: #f59e0b;");
    }
  }, [player.name, gameState]);

  // ==========================================
  // 💡 1.2 TUTORIAL LOGIC
  // ==========================================
  useEffect(() => {
    const viewed = player.viewedTutorials || [];

    if (gameState === 'MAP_SELECTION' && !viewed.includes('welcome')) {
      setTutorialStep('welcome');
    } else if (activeTab === 'TRAVEL' && gameState === 'PLAYING' && !viewed.includes('travel')) {
      setTutorialStep('travel');
    } else if (activeTab === 'PASSIVESKILL' && !viewed.includes('passive')) {
      setTutorialStep('passive');
    } else if (activeTab === 'COLLECTION' && !viewed.includes('collection')) {
      setTutorialStep('collection');
    } else if (activeTab === 'CHARACTER' && !viewed.includes('character')) {
      setTutorialStep('character');
    }
  }, [gameState, activeTab, player.viewedTutorials]);

  const closeTutorial = () => {
    if (tutorialStep === 'welcome') {
      setPlayer(prev => ({
        ...prev,
        viewedTutorials: [...(prev.viewedTutorials || []), 'welcome']
      }));
      setTutorialStep('map'); 
    } else if (tutorialStep) {
      setPlayer(prev => ({
        ...prev,
        viewedTutorials: [...(prev.viewedTutorials || []), tutorialStep]
      }));
      setTutorialStep(null);
    }
  };

  // ✅ handleStart: เริ่มใหม่พร้อมล้างค่า
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
        collection: {},
        viewedTutorials: [] 
      };
      setPlayer(freshPlayer);
    }
    setHasSave(false); 
    setGameState('MAP_SELECTION'); 
    setLogs(["🌅 ยินดีต้อนรับสู่การผจญภัยครั้งใหม่!", "📍 กรุณาเลือกแผนที่เพื่อเริ่มต้นการเดินทาง"]);
  };

  const triggerNewGame = (name) => {
    setPendingName(name);
    setIsConfirmOpen(true);
  };

  // ✨ [คงเดิม] ฟังก์ชันจัดการการเปลี่ยน Tab และรีเซ็ตแจ้งเตือน
  const handleTabChange = (tabName) => {
    setActiveTab(tabName);
    if (tabName === 'TRAVEL') {
      setUnreadChatCount(0); 
    }
  };

  // ✨ [คงเดิม] Callback สำหรับ WorldChat
  const handleNewMessage = () => {
    if (activeTab !== 'TRAVEL') {
      setUnreadChatCount(prev => prev + 1);
    }
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
    hasSave, 
    onContinue: () => {
      const loadedPlayer = loadGame();
      if (loadedPlayer) {
        setGameState('MAP_SELECTION');
        if (loadedPlayer.currentMap) {
          setGameState('PLAYING');
        }
      }
    },
    onStart: triggerNewGame 
  });

  return (
    <div className="flex flex-col md:flex-row h-[100dvh] bg-transparent text-slate-200 overflow-hidden font-serif text-left relative">
      
      {tutorialStep && (
        <TutorialOverlay step={tutorialStep} onNext={closeTutorial} />
      )}

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

      {gameState === 'START_SCREEN' ? (
        <div className="flex-1 w-full h-full relative z-[60]">
            {renderMainView()}
        </div>
      ) : (
        <>
          <div className="md:hidden">
            <WorldChat 
              player={player} 
              isMobile={true} 
              onNewMessage={handleNewMessage} 
              unreadChatCount={unreadChatCount} 
            />
          </div>
          
          <Sidebar 
            activeTab={activeTab} 
            setActiveTab={handleTabChange} 
            player={player} 
            saveGame={handleManualSave}
            unreadChatCount={unreadChatCount} 
          />

          <main className="flex-1 relative overflow-hidden flex flex-col">
            <TitleUnlockPopup data={newTitlePopup} onClose={() => setNewTitlePopup(null)} />

            <div className="flex-1 overflow-y-auto p-2">
              {renderMainView()}
            </div>
          </main>
        </>
      )}
    </div>
  );
}