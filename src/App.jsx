import React, { useState } from 'react'; 
// --- Components & Views ---
import Sidebar from './components/Sidebar';
import TitleUnlockPopup from './components/TitleUnlockPopup';
// ✅ นำเข้า calculateCollectionBonuses เพิ่มเติม
import { calculateCollectionScore, getPassiveBonus, calculateCollectionBonuses } from './utils/characterUtils';

import { MONSTER_SKILLS } from './data/passive';
// ✅ แก้ไข Path ให้ชี้ไปยังสถานีกลาง (index.js) เรียบร้อยแล้วจ่ะ
import { monsters } from './data/monsters/index'; 

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
    totalSteps: 0,
    // ✅ เพิ่ม collection เข้าไปใน state เริ่มต้นเพื่อป้องกัน Error จ่ะ
    collection: initialStats.collection || {} 
  });

  const [newTitlePopup, setNewTitlePopup] = useState(null);

  // ==========================================
  // 🗺️ 2. TRAVEL SYSTEM (ย้ายขึ้นมาเพื่อให้ได้ฟังก์ชัน advanceDungeon ก่อน)
  // ==========================================
  const travel = useTravel(
    player, 
    setPlayer, 
    setLogs, 
    (monster) => combat.startCombat(monster), 
    null // ส่ง null ไปก่อน เดี๋ยวจะเอา currentMap จาก combat มาใส่ด้านล่างจ่ะ
  ); 
  const { handleStep, inDungeon, exitDungeon, advanceDungeon } = travel;

  // ==========================================
  // ⚔️ 3. COMBAT SYSTEM (เสียบปลั๊ก advanceDungeon เข้าไปตรงๆ เลยจ่ะ)
  // ==========================================
  const combat = useCombat(
    player, 
    setPlayer, 
    setLogs, 
    advanceDungeon, // ✅ ส่งฟังก์ชันที่ได้จาก travel เข้าไปตรงๆ
    exitDungeon,    // ✅ ส่งฟังก์ชันที่ได้จาก travel เข้าไปตรงๆ
    inDungeon       // ✅ ส่งสถานะที่ได้จาก travel เข้าไปตรงๆ
  ); 
  
  const { isCombat, gameState, currentMap, handleSelectMap, setGameState } = combat;

  // ✅ เชื่อม Map ปัจจุบันกลับไปให้ Travel (เพื่อให้สุ่มมอนสเตอร์ตามแมพได้ถูกต้อง)
  travel.currentMap = currentMap;

  // ✅ [คงเดิม] เพื่อความชัวร์ในการเชื่อมต่อสถานะ
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
  
  // ✅ คำนวณโบนัสสะสมโดยใช้ Data มอนสเตอร์จากไฟล์แยกที่รวมกันที่ Index จ่ะ
  const collectionBonuses = calculateCollectionBonuses(player.collection || {}, monsters || []);

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

      {/* ✅ ปรับ Padding ตามสถานะหน้าจอ */}
      <div className={`flex-1 overflow-y-auto ${gameState === 'START_SCREEN' ? 'p-0' : 'p-2'}`}>
        {renderMainView()}
      </div>
    </main>
  </div>
  );
}