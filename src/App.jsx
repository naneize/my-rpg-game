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
import { useViewRenderer } from './hooks/useViewRenderer.jsx'; // ✅ นำตัวจัดการหน้าจอเข้ามา

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

  // ✅ State สำหรับควบคุม Popup แจ้งเตือนฉายาใหม่
  const [newTitlePopup, setNewTitlePopup] = useState(null);

  // ==========================================
  // 🗺️ 2. TRAVEL SYSTEM 
  // ==========================================
  const travel = useTravel(player, setPlayer, setLogs, (monster) => startCombat(monster));
  const { handleStep, handleEnterDungeon, inDungeon, exitDungeon } = travel;

  // ==========================================
  // ⚔️ 3. COMBAT SYSTEM 
  // ==========================================
  const combat = useCombat(player, setPlayer, setLogs, travel.advanceDungeon, travel.exitDungeon, travel.inDungeon);
  
  // ✅ ดึงค่าสถานะที่จำเป็นออกมาจาก combat hook (เพื่อให้ปุ่มหายค้างและ Popup ทำงาน)
  const { 
    isCombat, 
    startCombat, 
    combatPhase,        // 👈 เพิ่มตัวนี้เพื่อปลดล็อคปุ่มสีเทา
    monsterSkillUsed,   // 👈 เพิ่มตัวนี้เพื่อโชว์ Popup สกิลมอนสเตอร์
    handleAttack,       // 👈 ส่งฟังก์ชันโจมตีไปให้ปุ่มกด
    lootResult          // 👈 ส่งสถานะของรางวัล
  } = combat;

  // ==========================================
  // 🎖️ 4. CUSTOM GAME SYSTEMS (Cleaned Hooks)
  // ==========================================
  
  // ✅ ระบบเช็คฉายา
  useTitleObserver(player, setPlayer, setNewTitlePopup);

  // ✅ ระบบเลเวล
  useLevelSystem(player, setPlayer, setLogs);

  // ✅ ระบบการเดิน
  const walking = useWalkingSystem(player, setPlayer, setLogs, isCombat, handleStep);
  const { handleWalkingStep } = walking;

  // ==========================================
  // 🧮 4.5 COLLECTION SCORE CALCULATION
  // ==========================================
  // ✅ คำนวณคะแนนที่นี่ที่เดียว เพื่อส่งให้ทุกหน้าจอเลขตรงกันเป๊ะ

  const collScore = calculateCollectionScore(player.inventory);
  const passiveBonuses = getPassiveBonus(player.equippedPassives, MONSTER_SKILLS);

  // ==========================================
  // 🎭 5. VIEW RENDERER (จัดการการแสดงผลหน้าจอ)
  // ==========================================
  // ✅ รวม State ทั้งหมดส่งให้ Renderer จัดการเลือกหน้าที่จะโชว์
  // การใช้ ...combat ตรงนี้จะทำให้ combatPhase และ monsterSkillUsed ถูกส่งต่อไปยังหน้า CombatView อัตโนมัติ
  const { renderMainView } = useViewRenderer({
    activeTab,
    logs,
    player,
    setPlayer,
    setLogs,
    collScore,
    passiveBonuses,
    ...travel,
    ...combat,
    ...walking
  });

  // ==========================================
  // 🖼️ 6. RENDER UI (คลีนที่สุดในสามโลก)
  // ==========================================
  return (
  /* 1. เปลี่ยนจาก flex เป็น flex-col (แนวตั้ง) ในมือถือ และ md:flex-row (แนวนอน) ในจอคอม */
  <div className="flex flex-col md:flex-row h-[100dvh] bg-black text-slate-200 overflow-hidden font-serif text-left">
    
    {/* 🧭 แถบเมนูด้านข้าง (Sidebar) */}
    {/* ตัวเองต้องเข้าไปแก้ในไฟล์ Sidebar.jsx ให้มันเป็นแนวนอนเมื่ออยู่บนมือถือด้วยนะจ๊ะ */}
    <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} gold={player.gold} />
    
    
    <main className="flex-1 relative overflow-hidden flex flex-col">
      
      {/* 🎊 6.1 Popup แจ้งเตือนฉายา */}
      <TitleUnlockPopup data={newTitlePopup} onClose={() => setNewTitlePopup(null)} />

      {/* 📺 6.2 ส่วนแสดงผลเนื้อหาหลัก */}
      <div className="flex-1 overflow-y-auto p-2">
        {renderMainView()}
      </div>

    </main>
  </div>
);
}