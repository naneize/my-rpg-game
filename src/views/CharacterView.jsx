import React, { useState, useEffect } from 'react';
import { Heart, Sword, Shield, Sparkles, Star, ChevronRight, PartyPopper } from 'lucide-react';
import StatItem from '../components/character/StatItem';
import TitleSelector from '../components/character/TitleSelector';
import ProfileHeader from '../components/character/ProfileHeader';
import { useCharacterStats } from '../hooks/useCharacterStats';
// ✅ Import getCollectionTitle (คงเดิม)
import { getCollectionTitle } from '../utils/characterUtils';
import { titles as allTitles, checkTitleUnlock } from '../data/titles';


// สไตล์ Rarity (คงเดิม 100%)
const getRarityStyle = (rarity, isActive) => {
  const styles = {
    Common: { border: isActive ? 'border-slate-400' : 'border-white/5', text: 'text-slate-200', bgIcon: 'bg-slate-700/50' },
    Uncommon: { border: isActive ? 'border-emerald-500' : 'border-white/5', text: 'text-emerald-400', bgIcon: 'bg-emerald-900/40' },
    Rare: { border: isActive ? 'border-blue-500' : 'border-white/5', text: 'text-blue-400', bgIcon: 'bg-blue-900/40' },
    Epic: { border: isActive ? 'border-purple-500' : 'border-white/5', text: 'text-purple-400', bgIcon: 'bg-purple-900/40' },
    Legendary: { border: isActive ? 'border-orange-500' : 'border-white/5', text: 'text-orange-400', bgIcon: 'bg-amber-900/50' }
  };
  return styles[rarity] || styles.Common;
};

export default function CharacterView({ stats, setPlayer, collScore, passiveBonuses }) {
  const [showTitleSelector, setShowTitleSelector] = useState(false);
  const [newTitlePopup, setNewTitlePopup] = useState(null);
  

  // ✅ แก้ไข: เพิ่ม State สำหรับเก็บฉายาที่เลือกในหน้า Popup (เพื่อให้กดสวมใส่ได้)
  const [selectedTitleInfo, setSelectedTitleInfo] = useState(null);
  const collectionScore = collScore || 0;

  // 🧮 Logic การคำนวณ (คงเดิม 100%)
  
  
  const activeTitle = allTitles.find(t => t.id === stats.activeTitleId) || allTitles[0];

  // ✅ เรียกใช้ฟังก์ชันจากไฟล์ Utils (คงเดิม)
  const collTitle = getCollectionTitle(collScore);

  // 🆙 ระบบเช็คปลดล็อคฉายา (คงเดิม 100%)
  useEffect(() => {
    allTitles.forEach(title => {
      if (checkTitleUnlock(title.id, stats, collectionScore) && !stats.unlockedTitles?.includes(title.id)) {
        setNewTitlePopup(title);
        setPlayer(prev => ({ ...prev, unlockedTitles: [...(prev.unlockedTitles || []), title.id] }));
      }
    });
  }, [stats.level, collectionScore, stats, setPlayer]);

  // ⚔️ รวมสเตตัสพร้อมโบนัส (คงเดิม 100%)
  const { finalMaxHp, finalAtk, finalDef, bonusStats, hpPercent, expPercent } = 
    useCharacterStats(stats, activeTitle, passiveBonuses);

  const statDisplayList = [
  { 
    icon: Heart, label: 'HP', color: 'text-red-500', 
    val: finalMaxHp, 
    bonus: bonusStats?.hp || 0, // 👈 เพิ่มบรรทัดนี้
    key: 'maxHp' 
  },
  { 
    icon: Sword, label: 'ATK', color: 'text-orange-500', 
    val: finalAtk, 
    bonus: bonusStats?.atk || 0, // 👈 เพิ่มบรรทัดนี้
    key: 'atk' 
  },
  { 
    icon: Shield, label: 'DEF', color: 'text-blue-500', 
    val: finalDef, 
    bonus: bonusStats?.def || 0, // 👈 เพิ่มบรรทัดนี้
    key: 'def' 
  },
  { 
    icon: Sparkles, label: 'LUCK', color: 'text-emerald-400', 
    val: stats.luck || 0, 
    bonus: 0, // Luck ปกติยังไม่มีโบนัส
    key: 'luck' 
  }
  ];

  return (
    <div className="flex-1 w-full h-full flex flex-col items-center justify-between bg-slate-950 overflow-hidden px-4 py-6
    bg-[url('https://www.transparenttextures.com/patterns/dark-matter.png')]">
      
      <div className="w-full max-w-sm flex-1 flex flex-col justify-evenly min-h-0">
        
        {/* 🎖️ Section: Titles (คงเดิม 100%) */}
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
              <span className="text-white text-[10px] font-bold italic leading-tight text-right">
                    "{activeTitle.name}"
              </span>
              <button onClick={() => setShowTitleSelector(true)} className="p-1 bg-slate-800 hover:bg-slate-700 rounded-md border border-white/10">
                <ChevronRight size={14} className="text-amber-500" />
              </button>
            </div>
          </div>
        </div>

        {/* 💳 Section: Profile Header (คงเดิม 100%) */}
        <div className="flex-shrink-0">
          <ProfileHeader stats={stats} collectionScore={collectionScore} finalMaxHp={finalMaxHp} hpPercent={hpPercent} expPercent={expPercent} />
        </div>

        {/* ✨ Section: Available Points (คงเดิม 100%) */}
        <div className="bg-gradient-to-r from-amber-500 to-orange-600 p-[1px] rounded-2xl flex-shrink-0 shadow-xl shadow-orange-950/20">
          <div className="bg-slate-900/95 py-3 px-6 rounded-[calc(1rem-1px)] flex justify-between items-center backdrop-blur-md">
            <div className="flex items-center gap-3">
              <Star className="text-amber-500 fill-amber-500 animate-pulse" size={16} />
              <span className="text-white font-black uppercase text-[10px] italic tracking-widest">Available Points</span>
            </div>
            <span className="text-3xl font-black text-amber-500 leading-none">
              {stats.points || 0}
            </span>
          </div>
        </div>

        {/* 🛠️ Section: Stat List (คงเดิม 100%) */}
        <div className="flex flex-col space-y-2 flex-shrink-0">
          {statDisplayList.map((stat, i) => (
            <div key={i} className="w-full">
              <StatItem 
                stat={stat} 
                stats={stats}
                bonus={stat.bonus}
                onUpgrade={(key) => setPlayer(prev => ({ ...prev, [key]: (prev[key] || 0) + 1, points: prev.points - 1 }))} 
              />
            </div>
          ))}
        </div>

      </div>

      {/* 📜 Title Selector Popup */}
      {showTitleSelector && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/80 backdrop-blur-md">
          <div className="w-full max-w-sm max-h-[85vh] overflow-hidden bg-slate-900 border border-white/10 rounded-[2.5rem] shadow-2xl flex flex-col animate-in zoom-in duration-300">
             <div className="p-5 overflow-y-auto custom-scrollbar flex-1">
                {/* ✅ แก้ไข: เพิ่ม selectedTitleInfo และ setSelectedTitleInfo ส่งเข้าไปให้ Component ลูก */}
                <TitleSelector 
                  stats={stats} 
                  setPlayer={setPlayer} 
                  showTitleSelector={true} 
                  setShowTitleSelector={setShowTitleSelector} 
                  selectedTitleInfo={selectedTitleInfo}
                  setSelectedTitleInfo={setSelectedTitleInfo}
                  getRarityStyle={getRarityStyle} 
                />
             </div>
             <button 
               onClick={() => {
                 setShowTitleSelector(false);
                 setSelectedTitleInfo(null); // ล้างค่าที่เลือกไว้เมื่อปิด
               }} 
               className="m-5 p-4 bg-slate-800 text-white font-black rounded-2xl text-xs uppercase hover:bg-slate-700 transition-colors"
             >
               Close List
             </button>
          </div>
        </div>
      )}

      {/* 🎊 Popup ปลดล็อค (คงเดิม 100%) */}
      {newTitlePopup && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm">
          <div className="bg-slate-950 border border-amber-500/50 rounded-3xl p-8 text-center shadow-2xl animate-in zoom-in duration-300">
             <PartyPopper className="mx-auto mb-4 text-amber-500" size={56} />
             <h3 className="text-amber-500 font-black text-sm uppercase mb-1">New Title Unlocked!</h3>
             <p className="text-white text-xl font-black italic uppercase mb-6">"{newTitlePopup.name}"</p>
             <button onClick={() => setNewTitlePopup(null)} className="w-full py-3 bg-amber-600 text-black font-black rounded-xl hover:bg-amber-500 transition-colors">AWESOME!</button>
          </div>
        </div>
      )}
    </div>
  );
}