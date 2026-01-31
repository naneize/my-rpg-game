import React, { useState } from 'react'; 
// --- Components & Views ---
import Sidebar from './components/Sidebar';
import TitleUnlockPopup from './components/TitleUnlockPopup';
import { calculateCollectionScore, getPassiveBonus } from './utils/characterUtils';

import { MONSTER_SKILLS } from './data/passive';

// --- Data & Hooks (Standard) ---
import { initialStats } from './data/playerStats';
import { useCombat } from './hooks/useCombat';
import { useTravel } from './hooks/useTravel.jsx';


// --- 🛠️ Custom Hooks (Game Systems) ---
import { useTitleObserver } from './hooks/useTitleObserver'; 
import { useLevelSystem } from './hooks/useLevelSystem';
import { useWalkingSystem } from './hooks/useWalkingSystem';

// --- 🎨 Custom Hooks (View Management) ---
import { useViewRenderer } from './hooks/useViewRenderer.jsx'; 

/**
 * App Component: ศูนย์กลางควบคุมสถานะหลักของเกม (Master Clean Version)
 */
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
  // ⚔️ 2. COMBAT SYSTEM (ขั้นที่ 1: สร้างพื้นฐานระบบต่อสู้)
  // ==========================================
  // ✅ ดึงค่า gameState และ currentMap ออกมาก่อนเพื่อให้ Travel รู้ว่าต้องสุ่มมอนที่ไหน
  const combat = useCombat(player, setPlayer, setLogs, null, null, null); 
  
  const { 
    isCombat, 
    startCombat, 
    combatPhase, 
    monsterSkillUsed, 
    handleAttack, 
    lootResult,
    currentMap,      // 🌍 ดึงแมพปัจจุบัน
    gameState,       // 🌍 ดึงสถานะเกม (MAP_SELECT / EXPLORING)
    handleSelectMap  // 🌍 ดึงฟังก์ชันเลือกแมพ
  } = combat;

  // ==========================================
  // 🗺️ 3. TRAVEL SYSTEM (ขั้นที่ 2: เชื่อมโยงระบบเดินสำรวจ)
  // ==========================================
  // ✅ ส่ง currentMap เข้าไปเพื่อให้ระบบรู้ว่าจะต้องเจอตัวอะไรในแมพไหน
  const travel = useTravel(player, setPlayer, setLogs, (monster) => startCombat(monster), currentMap);
  const { handleStep, handleEnterDungeon, inDungeon, exitDungeon, advanceDungeon } = travel;

  // ✅ [แก้ไขสำคัญ] ขั้นที่ 3: "เสียบปลั๊ก" ฟังก์ชันดันเจี้ยนตัวจริงกลับเข้าไปในระบบ Combat
  // เพื่อให้จังหวะชนะมอนสเตอร์ในดันเจี้ยน ระบบสามารถสั่งนับก้าว (advance) และ ออก (exit) ได้จริง
  combat.advanceDungeon = advanceDungeon;
  combat.exitDungeon = exitDungeon;
  combat.inDungeon = inDungeon;

  // ==========================================
  // 🎖️ 4. CUSTOM GAME SYSTEMS (Cleaned Hooks)
  // ==========================================
  useTitleObserver(player, setPlayer, setNewTitlePopup);
  useLevelSystem(player, setPlayer, setLogs);

  // ✅ ใช้ handleStep จาก travel ที่เชื่อมต่อกับ Map แล้ว
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
  // ✅ ส่งข้อมูลทั้งหมดไปยัง Renderer โดยให้ลำดับของ ...travel มาทีหลังเพื่อทับค่า Placeholder
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
    ...combat,      // ข้อมูลระบบต่อสู้
    ...travel,      // ข้อมูลการเดิน (จะทับค่า advanceDungeon/exitDungeon/inDungeon ให้เป็นตัวจริง)
    ...walking      // ข้อมูลระบบก้าวเดิน
  });

  // ==========================================
  // 🖼️ 6. RENDER UI (คลีนที่สุดในสามโลก)
  // ==========================================
  return (
    <div className="flex flex-col md:flex-row h-[100dvh] bg-transparent text-slate-200 overflow-hidden font-serif text-left">
      
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} gold={player.gold} />
      
      <main className="flex-1 relative overflow-hidden flex flex-col">
        
        <TitleUnlockPopup data={newTitlePopup} onClose={() => setNewTitlePopup(null)} />

        <div className="flex-1 overflow-y-auto p-2">
          {renderMainView()}
        </div>

      </main>
    </div>
  );
}