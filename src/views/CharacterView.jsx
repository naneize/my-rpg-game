import React, { useState } from 'react'; 
import { PartyPopper, ChevronRight, Star } from 'lucide-react';

// --- Sub-Components ---
import ProfileHeader from '../components/character/ProfileHeader';
import TitleSelector from '../components/character/TitleSelector';
// import EquipmentSlot from '../components/character/EquipmentSlot'; // 🚫 ลบออก
import StatGroup from '../components/character/StatGroup'; 

// --- Data & Utils ---
import { getCollectionTitle } from '../utils/characterUtils';
import { titles as allTitles } from '../data/titles';

// --- Custom Hooks ---
import { useTitleUnlocker } from '../hooks/useTitleUnlocker'; 
import { useMonsterCollection } from '../hooks/useMonsterCollection';

export default function CharacterView({ stats, setPlayer, collScore, collectionBonuses }) {
  const [showTitleSelector, setShowTitleSelector] = useState(false);
  const [newTitlePopup, setNewTitlePopup] = useState(null);
  const [selectedTitleInfo, setSelectedTitleInfo] = useState(null);

  // 🎖️ 1. Logic: ระบบเช็คการปลดล็อกฉายาอัตโนมัติ
  useTitleUnlocker(stats, collScore, setPlayer, setNewTitlePopup);

  // 👾 2. Logic: ระบบคำนวณการสะสมมอนสเตอร์
  const { completedMonsterSets } = useMonsterCollection(stats);

  // 📊 3. ข้อมูลพื้นฐาน
  const activeTitle = allTitles.find(t => t.id === stats.activeTitleId) || allTitles[0];
  const collTitle = getCollectionTitle(collScore);

  return (
    <div className="flex-1 w-full h-full flex flex-col items-center bg-slate-950 overflow-y-auto px-4 py-6
    bg-[url('https://www.transparenttextures.com/patterns/dark-matter.png')] relative">
      
      <div className="w-full max-w-sm flex flex-col space-y-4">
        
        {/* 🏆 RANK & TITLE: แถบแสดงอันดับและฉายา */}
        <div className="grid grid-cols-2 gap-3 flex-shrink-0">
          <div className="bg-slate-900/60 p-3 rounded-2xl border border-white/5 backdrop-blur-sm shadow-lg">
            <span className="text-[8px] font-black text-amber-500/50 uppercase block mb-1">Rank</span>
            <div className={`w-full py-1.5 rounded-lg bg-gradient-to-r ${collTitle.color} text-white text-[9px] font-black text-center shadow-md uppercase`}>
              {collTitle.name}
            </div>
          </div>
          
          <div className="bg-slate-900/60 p-3 rounded-2xl border border-white/5 flex flex-col justify-between backdrop-blur-sm shadow-lg">
            <span className="text-[8px] font-black text-blue-400/50 uppercase block mb-1 text-right">Title</span>
            <div className="flex items-center justify-end gap-1">
              <span className="text-white text-[10px] font-bold italic leading-tight text-right uppercase">
                "{activeTitle.name}"
              </span>
              <button onClick={() => setShowTitleSelector(true)} className="p-1 bg-slate-800 hover:bg-slate-700 rounded-md border border-white/10">
                <ChevronRight size={14} className="text-amber-500" />
              </button>
            </div>
          </div>
        </div>

        {/* 👤 PROFILE: ข้อมูลเลเวลและหลอดเลือด/EXP */}
        <ProfileHeader 
          stats={stats} 
          collectionScore={collScore} 
          finalMaxHp={stats.finalMaxHp} 
          hpPercent={stats.hpPercent} 
          expPercent={stats.expPercent} 
        />

        {/* ✨ POINTS: แต้มสเตตัสที่อัปได้ */}
        <div className="bg-gradient-to-r mb-1 from-amber-500 to-orange-600 p-[1px] rounded-2xl shadow-xl shadow-orange-950/20">
          <div className="bg-slate-900/95 py-2 px-6 rounded-[calc(1rem-1px)] flex justify-between items-center backdrop-blur-md">
            <div className="flex items-center gap-3">
              <Star className="text-amber-500 fill-amber-500 animate-pulse" size={16} />
              <span className="text-white font-black uppercase text-[10px] italic tracking-widest">Available Points</span>
            </div>
            <span className="text-3xl font-black text-amber-500 leading-none">
              {stats.points || 0}
            </span>
          </div>
        </div>

        {/* ⚔️ STATS: รายการสเตตัสหลักและการอัปเกรด */}
        <StatGroup 
          stats={stats}
          bonusStats={stats.bonusStats}
          collectionBonuses={collectionBonuses}
          onUpgrade={(key) => setPlayer(prev => ({ 
            ...prev, 
            [key]: (prev[key] || 0) + 1, 
            points: prev.points - 1 
          }))}
        />
      </div>

      {/* --- MODALS & POPUPS --- */}

      {/* Title Selection Modal */}
      {showTitleSelector && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/80 backdrop-blur-md">
          <div className="w-full max-w-sm max-h-[85vh] overflow-hidden bg-slate-900 border border-white/10 rounded-[2.5rem] shadow-2xl flex flex-col animate-in zoom-in duration-300">
            <div className="p-5 overflow-y-auto flex-1 custom-scrollbar">
              <TitleSelector 
                stats={stats} 
                setPlayer={setPlayer} 
                showTitleSelector={true} 
                setShowTitleSelector={setShowTitleSelector} 
                selectedTitleInfo={selectedTitleInfo}
                setSelectedTitleInfo={setSelectedTitleInfo}
              />
            </div>
            <button 
              onClick={() => { setShowTitleSelector(false); setSelectedTitleInfo(null); }} 
              className="m-5 p-4 bg-slate-800 text-white font-black rounded-2xl text-xs uppercase hover:bg-slate-700 transition-colors"
            >
              Close List
            </button>
          </div>
        </div>
      )}

      {/* New Title Unlock Popup */}
      {newTitlePopup && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm">
          <div className="bg-slate-950 border border-amber-500/50 rounded-3xl p-8 text-center shadow-2xl animate-in zoom-in duration-300">
            <PartyPopper className="mx-auto mb-4 text-amber-500" size={56} />
            <h3 className="text-amber-500 font-black text-sm uppercase mb-1">New Title Unlocked!</h3>
            <p className="text-white text-xl font-black italic uppercase mb-6">"{newTitlePopup.name}"</p>
            <button 
              onClick={() => setNewTitlePopup(null)} 
              className="w-full py-3 bg-amber-600 text-black font-black rounded-xl hover:bg-amber-500"
            >
              AWESOME!
            </button>
          </div>
        </div>
      )}
    </div>
  );
}