import React, { useState } from 'react'; 
// --- Components & Views ---
import Sidebar from './components/Sidebar';
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

export default function App() {
  // ==========================================
  // 💾 1. STATE MANAGEMENT
  // ==========================================
  const [activeTab, setActiveTab] = useState('TRAVEL');
  const [logs, setLogs] = useState(["เริ่มบันทึกการเดินทาง..."]);
  const [gameState, setGameState] = useState('START_SCREEN');
  const [currentMap, setCurrentMap] = useState(null);

  const [player, setPlayer] = useState({
    ...initialStats,
    activeTitleId: 'none', 
    unlockedTitles: ['none'], 
    totalSteps: 0,
    collection: initialStats.collection || {} 
  });

  const [newTitlePopup, setNewTitlePopup] = useState(null);

  // ==========================================
  // 🧮 1.5 PRE-CALCULATION (ย้ายขึ้นมาเพื่อให้ Hooks ได้รับค่าที่ถูกต้องจ่ะ)
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
    collectionBonuses, // ✅ เปลี่ยนจาก null เป็นค่าโบนัสที่คำนวณแล้วจ่ะ
    { currentMap, setCurrentMap, gameState, setGameState } 
  ); 
  
  const { isCombat, handleSelectMap } = combat;

  // ✅ [คงเดิม] เพื่อความชัวร์ในการเชื่อมต่อสถานะ
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
    playerLevel: player.level 
  });

  return (
    <div className="flex flex-col md:flex-row h-[100dvh] bg-transparent text-slate-200 overflow-hidden font-serif text-left">
      {gameState !== 'START_SCREEN' && (
        <Sidebar 
          activeTab={activeTab} 
          setActiveTab={setActiveTab} 
          gold={player.gold} 
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