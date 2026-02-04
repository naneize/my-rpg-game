import React, { useState } from 'react'; 
// --- Components & Views ---
import Sidebar from './components/Sidebar';
import TitleUnlockPopup from './components/TitleUnlockPopup';
// ✅ นำเข้า calculateCollectionBonuses เพิ่มเติม
import { calculateCollectionScore, getPassiveBonus, calculateCollectionBonuses } from './utils/characterUtils';

import { MONSTER_SKILLS } from './data/passive';
import { monsters } from './data/monsters'; // ✅ นำเข้าข้อมูลมอนสเตอร์เพื่อใช้เช็คเงื่อนไข

// --- Data & Hooks ---
import { initialStats } from './data/playerStats';
import { useCombat } from './hooks/useCombat';
import { useTravel } from './hooks/useTravel.jsx';

// --- 🛠️ Custom Hooks (Game Systems) ---
import { useTitleObserver } from './hooks/useTitleObserver'; 
import { useLevelSystem } from './hooks/useLevelSystem';
import { useWalkingSystem } from './hooks/useWalkingSystem';

// --- 🎨 Custom Hooks (View Management) ---
import { useViewRenderer } from './hooks/useViewRenderer.jsx';


export default function App() {
  // ==========================================
  // 💾 1. STATE MANAGEMENT
  // ==========================================
  const [activeTab, setActiveTab] = useState('TRAVEL');
  const [logs, setLogs] = useState(["เริ่มบันทึกการเดินทาง..."]);
  const [player, setPlayer] = useState({
    ...initialStats,
    activeTitleId: 'none', 
    unlockedTitles: ['none'], 
    totalSteps: 0
  });

  const [newTitlePopup, setNewTitlePopup] = useState(null);

  // ==========================================
  // 🗺️ 2. TRAVEL SYSTEM
  // ==========================================
  const travel = useTravel(player, setPlayer, setLogs, (monster) => combat.startCombat(monster), null); 
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
    inDungeon
  ); 
  
  const { isCombat, gameState, currentMap, handleSelectMap } = combat;

  // ✅ เชื่อม Map ปัจจุบันกลับไปให้ Travel
  travel.currentMap = currentMap;

  // ✅ [สำคัญมาก] การ "เสียบปลั๊ก" ซ้ำอีกรอบเพื่อความชัวร์
  combat.advanceDungeon = advanceDungeon;
  combat.exitDungeon = exitDungeon;
  combat.inDungeon = inDungeon;

  // ==========================================
  // 🎖️ 4. CUSTOM GAME SYSTEMS (Cleaned Hooks)
  // ==========================================
  useTitleObserver(player, setPlayer, setNewTitlePopup);
  useLevelSystem(player, setPlayer, setLogs);

  const walking = useWalkingSystem(player, setPlayer, setLogs, isCombat, handleStep);
  const { handleWalkingStep } = walking;

  // ==========================================
  // 🧮 4.5 COLLECTION & PASSIVE CALCULATION
  // ==========================================
  const collScore = calculateCollectionScore(player.inventory);
  const passiveBonuses = getPassiveBonus(player.equippedPassives, MONSTER_SKILLS);
  
  // ✅ [เพิ่มใหม่] คำนวณ Bonus จากการสะสม Artifact มอนสเตอร์ครบเซต
  const collectionBonuses = calculateCollectionBonuses(player.inventory, monsters);

  // ==========================================
  // 🎭 5. VIEW RENDERER (จัดการการแสดงผลหน้าจอ)
  // ==========================================
  const { renderMainView } = useViewRenderer({
    activeTab,
    logs,
    player,
    setPlayer,
    setLogs,
    collScore,
    passiveBonuses,
    collectionBonuses, // ✅ ส่งก้อนโบนัสสะสมครบเซตเข้าไปในระบบแสดงผล
    gameState,       
    currentMap,      
    handleSelectMap, 
    ...combat,   
    ...travel,   
    ...walking,
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

      {/* ✅ ปรับ Padding ตามสถานะหน้าจอ */}
      <div className={`flex-1 overflow-y-auto ${gameState === 'START_SCREEN' ? 'p-0' : 'p-2'}`}>
        {renderMainView()}
      </div>
    </main>
  </div>
  );
}