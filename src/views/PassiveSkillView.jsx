import React, { useState, useMemo } from 'react'; 
import { MONSTER_SKILLS } from '../data/passive';
import { Sword, Shield, Lock, X, Heart, Zap, Sparkles, Activity } from 'lucide-react';

const PassiveSkillView = ({ player, setPlayer }) => {
  const [selectedId, setSelectedId] = useState(null);

  const equippedIds = player?.equippedPassives || [null, null, null];
  const unlockedPassives = player?.unlockedPassives || [];

  // ✅ คำนวณสรุปโบนัสรวมทั้งหมด (คงเดิม 100%)
  const totalBonus = useMemo(() => {
    return equippedIds.reduce((acc, id) => {
      const skill = MONSTER_SKILLS.find(s => s.id === id);
      if (skill) {
        acc.atk += (skill.bonusAtk || 0);
        acc.def += (skill.bonusDef || 0);
        acc.hp += (skill.bonusMaxHp || 0);
      }
      return acc;
    }, { atk: 0, def: 0, hp: 0 });
  }, [equippedIds]);

  // ✅ ระบบติดตั้งสกิล (คงเดิม 100%)
  const handleEquip = (skillId) => {
    setPlayer(prev => {
      const isEquipped = prev.equippedPassives.includes(skillId);
      let nextEquipped = [...prev.equippedPassives];

      if (isEquipped) {
        nextEquipped = nextEquipped.map(id => id === skillId ? null : id);
      } else {
        const emptySlot = nextEquipped.findIndex(slot => slot === null);
        if (emptySlot !== -1) nextEquipped[emptySlot] = skillId;
        else return prev; 
      }
      return { ...prev, equippedPassives: nextEquipped };
    });
  };

  const currentSelection = MONSTER_SKILLS.find(s => s.id === selectedId);

  return (
    <div className="p-4 md:p-8 bg-slate-950/40 min-h-screen animate-fadeIn select-none pb-32">
      
      {/* 1. Header & Total Bonus Summary (ปรับให้ Stack บนมือถือ) */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 mb-8 md:mb-10">
        <div>
          <h1 className="text-xl md:text-2xl font-black text-white uppercase italic tracking-tighter flex items-center gap-2">
            <Zap className="text-orange-500 fill-orange-500" size={24} />
            Passive Skills
          </h1>
          <p className="text-[9px] md:text-[10px] text-slate-500 font-bold uppercase tracking-[0.2em]">Synchronize Monster Essences</p>
        </div>

        {/* Total Bonus Box (Responsive Padding) */}
        <div className="w-full lg:w-auto bg-white/5 border border-white/10 rounded-2xl p-3 md:px-6 flex justify-around lg:justify-start items-center gap-4 md:gap-6 shadow-inner">
          <div className="text-center">
            <p className="text-[7px] md:text-[8px] text-slate-500 uppercase font-black">Total ATK</p>
            <p className="text-xs md:text-sm font-black text-red-500">+{totalBonus.atk}</p>
          </div>
          <div className="w-px h-6 bg-white/10" />
          <div className="text-center">
            <p className="text-[7px] md:text-[8px] text-slate-500 uppercase font-black">Total DEF</p>
            <p className="text-xs md:text-sm font-black text-blue-500">+{totalBonus.def}</p>
          </div>
          <div className="w-px h-6 bg-white/10" />
          <div className="text-center">
            <p className="text-[7px] md:text-[8px] text-slate-500 uppercase font-black">Total HP</p>
            <p className="text-xs md:text-sm font-black text-pink-500">+{totalBonus.hp}</p>
          </div>
        </div>
      </div>

      {/* Main Content Grid (1 col on mobile, 12 on desktop) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-8">
        
        {/* RIGHT COLUMN: Selection Details (โชว์ก่อนบนมือถือด้วย order-1) */}
        <div className="lg:col-span-4 order-1 lg:order-2">
          <div className="lg:sticky lg:top-8 bg-slate-900 border border-white/10 rounded-[2rem] md:rounded-[2.5rem] p-6 md:p-8 flex flex-col items-center text-center shadow-2xl transition-all">
            {currentSelection ? (
              <>
                <span className="text-[8px] md:text-[9px] text-amber-500 font-black uppercase tracking-[0.3em] mb-4 bg-amber-500/10 px-3 py-1 rounded-full">
                  {currentSelection.monster} Essence
                </span>
                <div className="text-5xl md:text-7xl mb-4 md:mb-6 drop-shadow-[0_0_15px_rgba(245,158,11,0.3)] hover:scale-105 transition-transform duration-300">
                  {currentSelection.icon}
                </div>
                <h3 className="text-lg md:text-xl font-black text-white uppercase italic mb-2 tracking-tight">
                  {currentSelection.name}
                </h3>
                <p className="text-[10px] md:text-[11px] text-slate-400 italic leading-relaxed mb-6 md:mb-8 px-2 md:px-4">
                  "{currentSelection.description}"
                </p>

                {/* Stats Bonus Area */}
                <div className="w-full space-y-2 mb-6 md:mb-8">
                  {currentSelection.bonusAtk > 0 && (
                    <div className="flex justify-between items-center bg-white/5 p-2.5 md:p-3 rounded-xl border border-white/5">
                      <div className="flex items-center gap-2"><Sword size={12} className="text-red-500" /> <span className="text-[8px] md:text-[9px] uppercase font-bold text-slate-500">Attack Power</span></div>
                      <span className="text-xs font-black text-emerald-400">+{currentSelection.bonusAtk}</span>
                    </div>
                  )}
                  {currentSelection.bonusDef > 0 && (
                    <div className="flex justify-between items-center bg-white/5 p-2.5 md:p-3 rounded-xl border border-white/5">
                      <div className="flex items-center gap-2"><Shield size={12} className="text-blue-500" /> <span className="text-[8px] md:text-[9px] uppercase font-bold text-slate-500">Defense Rank</span></div>
                      <span className="text-xs font-black text-emerald-400">+{currentSelection.bonusDef}</span>
                    </div>
                  )}
                  {currentSelection.bonusMaxHp > 0 && (
                    <div className="flex justify-between items-center bg-white/5 p-2.5 md:p-3 rounded-xl border border-white/5">
                      <div className="flex items-center gap-2"><Heart size={12} className="text-pink-500" /> <span className="text-[8px] md:text-[9px] uppercase font-bold text-slate-500">Vitality Boost</span></div>
                      <span className="text-xs font-black text-emerald-400">+{currentSelection.bonusMaxHp}</span>
                    </div>
                  )}
                </div>

                <button
                  onClick={() => handleEquip(currentSelection.id)}
                  className={`w-full py-3 md:py-4 rounded-xl md:rounded-2xl font-black uppercase tracking-widest text-[10px] md:text-xs transition-all active:scale-95 shadow-xl
                    ${equippedIds.includes(currentSelection.id) 
                      ? 'bg-red-500/20 text-red-500 border border-red-500/30 hover:bg-red-500/30' 
                      : 'bg-orange-500 text-slate-950 hover:bg-orange-400 shadow-orange-500/20'}`}
                >
                  {equippedIds.includes(currentSelection.id) ? 'De-Synchronize' : 'Equip Essence'}
                </button>
              </>
            ) : (
              <div className="flex flex-col items-center justify-center py-10 md:py-20 opacity-30">
                {/* ✅ แก้ไข Syntax error จาก md:size={48} เป็น size={40} */}
                <Sparkles size={40} className="text-slate-500 mb-4" />
                <p className="text-[9px] md:text-[10px] font-black uppercase tracking-widest text-slate-500 text-center px-4">
                  Select an essence below to synchronize monster powers
                </p>
              </div>
            )}
          </div>
        </div>

        {/* LEFT COLUMN: Slots & Library (เลื่อนไปด้านล่างบนมือถือด้วย order-2) */}
        <div className="lg:col-span-8 space-y-8 md:space-y-10 order-2 lg:order-1">
          
          {/* Active Slots Area */}
          <section>
            <h2 className="text-orange-500 font-black text-[9px] md:text-[10px] uppercase tracking-widest mb-4 flex items-center gap-2">
              <Activity size={12} className="animate-pulse" /> Active Synchronizers
            </h2>
            <div className="grid grid-cols-3 gap-3 md:gap-4">
              {equippedIds.map((id, i) => {
                const skill = MONSTER_SKILLS.find(s => s.id === id);
                return (
                  <div 
                    key={i}
                    onClick={() => id && setSelectedId(id)}
                    className={`relative aspect-square rounded-2xl md:rounded-3xl border-2 transition-all flex flex-col items-center justify-center cursor-pointer group
                      ${skill ? 'border-orange-500/50 bg-orange-500/5 shadow-lg scale-100 hover:scale-[1.02]' : 'border-white/5 bg-white/5 border-dashed'}`}
                  >
                    {skill ? (
                      <>
                        <div className="text-3xl md:text-4xl mb-1 group-hover:scale-110 transition-transform duration-300">{skill.icon}</div>
                        <span className="text-[7px] md:text-[8px] font-black text-orange-400 uppercase tracking-tighter text-center px-1 truncate w-full">{skill.name}</span>
                      </>
                    ) : (
                      <span className="text-[10px] md:text-xs font-black text-slate-800 uppercase italic opacity-30">Slot {i+1}</span>
                    )}
                  </div>
                );
              })}
            </div>
          </section>

          {/* Library Area (Grid Responsive: 4 col mobile, 8 col desktop) */}
          <section className="bg-white/2 p-4 md:p-6 rounded-[2rem] border border-white/5">
            <h2 className="text-slate-500 font-black text-[9px] md:text-[10px] uppercase tracking-widest mb-4">
              Essence Library ({unlockedPassives.length})
            </h2>
            <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-2.5 md:gap-3">
              {MONSTER_SKILLS.filter(s => unlockedPassives.includes(s.id)).map((skill) => {
                const isEquipped = equippedIds.includes(skill.id);
                const isSelected = selectedId === skill.id;
                return (
                  <button
                    key={skill.id}
                    onClick={() => setSelectedId(skill.id)}
                    className={`aspect-square rounded-lg md:rounded-xl border transition-all flex items-center justify-center text-xl md:text-2xl relative group
                      ${isSelected 
                        ? 'border-amber-500 bg-amber-500/10 scale-110 shadow-inner z-10' 
                        : 'border-white/5 bg-white/5 hover:border-white/20 hover:scale-105'}`}
                  >
                    {skill.icon}
                    {isEquipped && (
                      <div className="absolute -top-1 -right-1 w-2.5 h-2.5 md:w-3 md:h-3 bg-emerald-500 rounded-full border-2 border-slate-950 shadow-lg animate-in zoom-in" />
                    )}
                  </button>
                );
              })}
              {/* Fillers for UI balance */}
              {[...Array(Math.max(0, 12 - unlockedPassives.length))].map((_, i) => (
                <div key={i} className="aspect-square rounded-lg md:rounded-xl border border-white/5 bg-white/5 opacity-10 flex items-center justify-center">
                  <Lock size={12} className="text-slate-800" />
                </div>
              ))}
            </div>
          </section>
        </div>

      </div>
    </div>
  );
};

export default PassiveSkillView;