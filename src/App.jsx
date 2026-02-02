import React, { useState } from 'react'; 
// --- Components & Views ---
import Sidebar from './components/Sidebar';
import TitleUnlockPopup from './components/TitleUnlockPopup';
import { calculateCollectionScore, getPassiveBonus } from './utils/characterUtils';

import { MONSTER_SKILLS } from './data/passive';

// --- Data & Hooks (กู้คืนมาให้ครบแล้วจ่ะ!) ---
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
  // 🗺️ 2. TRAVEL SYSTEM (ต้องสร้างก่อนเพื่อดึงฟังก์ชัน Dungeon ออกมา)
  // ==========================================
  // ✅ สร้างระบบ Travel ขึ้นมาก่อนเพื่อให้ได้ฟังก์ชัน Dungeon ตัวจริง
  // [หมายเหตุ]: ย้ายมาไว้ข้างบนสุดเพื่อให้ Combat ด้านล่างเรียกใช้ได้จ่ะ
  const travel = useTravel(player, setPlayer, setLogs, (monster) => combat.startCombat(monster), null); 
  const { handleStep, handleEnterDungeon, inDungeon, exitDungeon, advanceDungeon } = travel;

  // ==========================================
  // ⚔️ 3. COMBAT SYSTEM (สร้างทีหลังเพื่อรับค่าจาก Travel)
  // ==========================================
  // ✅ ส่ง advanceDungeon, exitDungeon และ inDungeon เข้าไปใน useCombat ได้เลยเพราะสร้างไว้ข้างบนแล้ว!
  const combat = useCombat(
    player, 
    setPlayer, 
    setLogs, 
    advanceDungeon, 
    exitDungeon, 
    inDungeon
  ); 
  
  const { 
    isCombat, 
    startCombat, 
    combatPhase, 
    monsterSkillUsed, 
    handleAttack, 
    lootResult,
    currentMap,      
    gameState,       
    handleSelectMap  
  } = combat;

  // ✅ เชื่อม Map ปัจจุบันกลับไปให้ Travel
  travel.currentMap = currentMap;

  // ✅ [สำคัญมาก] การ "เสียบปลั๊ก" ซ้ำอีกรอบเพื่อความชัวร์ (เหมือนเดิมของตัวเธอจ่ะ)
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
  // 🧮 4.5 COLLECTION SCORE CALCULATION
  // ==========================================
  const collScore = calculateCollectionScore(player.inventory);
  const passiveBonuses = getPassiveBonus(player.equippedPassives, MONSTER_SKILLS);

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

      {/* ✅ ปรับ Padding: ถ้าเป็นหน้า Start ให้ p-0 เพื่อให้รูปเต็มจอ ถ้าหน้าอื่นให้ p-2 เหมือนเดิมจ่ะ */}
      <div className={`flex-1 overflow-y-auto ${gameState === 'START_SCREEN' ? 'p-0' : 'p-2'}`}>
        {renderMainView()}
      </div>
    </main>
  </div>
  );
}