import React from 'react'; 
import { Trophy, Sword, Shield, Heart, Zap, Activity } from 'lucide-react';

/**
 * ProfileHeader: ฉบับ Tactical High-Impact 
 * เน้นโชว์ตัวเลข ATK/DEF ให้ชัดเจน พร้อมเกจพลังชีวิตและประสบการณ์
 */
const ProfileHeader = ({ stats, collectionScore, finalMaxHp, hpPercent, expPercent, atkP, defP }) => {  

  const getStatColor = (val) => val >= 0 ? 'text-amber-500' : 'text-red-500';
  const getDefColor = (val) => val >= 0 ? 'text-blue-400' : 'text-red-500';


  return (
    <div className="w-full bg-slate-900/60 border border-white/10 p-6 md:p-8 rounded-[3rem] text-center shadow-2xl relative overflow-hidden backdrop-blur-xl ring-1 ring-white/5">
      
      {/* 🔮 Background Effect: สร้างแสงเรืองรองบางๆ ด้านหลัง */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-32 bg-amber-500/10 blur-[60px] pointer-events-none" />
      
      {/* 🏆 1. Top Status Bar */}
      <div className="flex justify-between items-center mb-8 bg-black/20 p-3 rounded-2xl border border-white/5">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-amber-500/20 rounded-xl border border-amber-500/20">
            <Trophy size={14} className="text-amber-500" />
          </div>
          <div className="flex flex-col items-start">
            <span className="text-[8px] text-slate-500 uppercase font-black tracking-[0.2em] leading-none mb-1">Total Score</span>
            <span className="text-sm font-black text-white italic leading-none font-mono">{collectionScore}</span>
          </div>
        </div>

        <div className="flex items-center gap-3 text-right">
          <div className="flex flex-col items-end">
            <span className="text-[8px] text-slate-500 uppercase font-black tracking-[0.2em] leading-none mb-1">Neural Level</span>
            <span className="text-sm font-black text-indigo-400 italic leading-none font-mono">{stats.level}</span>
          </div>
          <div className="p-2 bg-indigo-500/20 rounded-xl border border-indigo-500/20">
            <Zap size={14} className="text-indigo-400" />
          </div>
        </div>
      </div>
      
      {/* 👤 2. Hero Identity */}
      <div className="relative mb-8">
        <h2 className="text-3xl md:text-4xl font-black text-white uppercase tracking-[0.15em] italic drop-shadow-[0_0_15px_rgba(255,255,255,0.2)]">
          {stats.name || "UNIDENTIFIED"}
        </h2>
        <div className="mt-2 flex items-center justify-center gap-2">
          <div className="h-[1px] w-8 bg-gradient-to-r from-transparent to-emerald-500/50" />
          <p className="text-emerald-500 font-black text-[8px] tracking-[0.5em] uppercase animate-pulse">
            System Online
          </p>
          <div className="h-[1px] w-8 bg-gradient-to-l from-transparent to-emerald-500/50" />
        </div>
      </div>



      {/* ⚔️ 3. Main Battle Stats (High-Impact Display) */}
      <div className="grid grid-cols-2 gap-4 md:gap-6 mb-8">
        
        {/* ATK Box */}
        <div className="bg-slate-950/50 rounded-[2rem] p-5 border border-amber-500/10 hover:border-amber-500/30 transition-all group overflow-hidden relative">
          <div className="absolute -right-2 -top-2 opacity-5 group-hover:opacity-10 transition-opacity">
            <Sword size={60} className="text-amber-500" />
          </div>
          <p className="text-[9px] font-black text-amber-500 uppercase tracking-widest mb-1 text-left opacity-60">Power_Atk</p>
          <div className="flex items-baseline gap-2">
            <p className="text-3xl md:text-4xl font-black text-white italic text-left drop-shadow-[0_0_12px_rgba(245,158,11,0.4)] font-display">
              {stats.displayAtk || stats.atk}
            </p>
            {/* 🆕 แสดงผล % Mastery */}
            {stats.atkP !== 0 && (
              <span className={`text-[10px] md:text-xs font-black italic ${getStatColor(stats.atkP)}`}>
                ({stats.atkP > 0 ? '+' : ''}{(stats.atkP * 100).toFixed(0)}%)
              </span>
            )}
          </div>
        </div>

        {/* DEF Box */}
        <div className="bg-slate-950/50 rounded-[2rem] p-5 border border-blue-500/10 hover:border-blue-500/30 transition-all group overflow-hidden relative">
          <div className="absolute -right-2 -top-2 opacity-5 group-hover:opacity-10 transition-opacity">
            <Shield size={60} className="text-blue-400" />
          </div>
          <p className="text-[9px] font-black text-blue-400 uppercase tracking-widest mb-1 text-left opacity-60">Shield_Def</p>
          <div className="flex items-baseline gap-2">
            <p className="text-3xl md:text-4xl font-black text-white italic text-left drop-shadow-[0_0_12px_rgba(59,130,246,0.4)] font-display">
              {stats.displayDef || stats.def}
            </p>
            {/* 🆕 แสดงผล % Mastery (รองรับค่าลบจาก Void Reaper) */}
            {stats.defP !== 0 && (
              <span className={`text-[10px] md:text-xs font-black italic ${getDefColor(stats.defP)}`}>
                ({stats.defP > 0 ? '+' : ''}{(stats.defP * 100).toFixed(0)}%)
              </span>
            )}
          </div>
        </div>
      </div>

      {/* 🔴 4. Vitality Matrix (HP) */}
      <div className="space-y-3 mb-6">
        <div className="flex justify-between items-end px-2">
          <div className="flex items-center gap-2">
            <div className="p-1 bg-red-500/20 rounded shadow-[0_0_5px_rgba(239,68,68,0.5)]">
              <Heart size={10} className="text-red-500 fill-red-500" />
            </div>
            <span className="text-[10px] font-black uppercase text-red-500 tracking-widest">Integrity</span>
          </div>
          <div className="text-right">
            <span className="text-sm font-black text-white italic">{Math.floor(stats.hp)}</span>
            <span className="text-slate-600 text-[10px] font-bold ml-1">/ {finalMaxHp}</span>
          </div>
        </div>
        <div className="w-full h-3 bg-black/60 rounded-full border border-white/5 p-[2px] shadow-inner">
          <div 
            className="h-full bg-gradient-to-r from-red-600 via-rose-500 to-amber-500 rounded-full transition-all duration-1000 shadow-[0_0_15px_rgba(225,29,72,0.4)]" 
            style={{ width: `${hpPercent}%` }} 
          />
        </div>
      </div>

      {/* 🟣 5. Neural Sync Matrix (EXP) */}
      <div className="space-y-2">
        <div className="flex justify-between items-center px-2">
          <span className="text-[8px] font-black uppercase text-indigo-400 tracking-[0.3em] flex items-center gap-2">
            <Activity size={10} className="animate-pulse" /> Sync_Progress
          </span>
          <span className="text-[10px] font-black text-indigo-300 font-mono">{Math.floor(expPercent || 0)}%</span>
        </div>
        <div className="w-full h-1.5 bg-black/40 rounded-full overflow-hidden border border-white/5">
          <div 
            className="h-full bg-gradient-to-r from-indigo-600 via-purple-500 to-violet-400 rounded-full transition-all duration-[1500ms]" 
            style={{ width: `${expPercent}%` }} 
          />
        </div>
      </div>

    </div>
  );
};

export default ProfileHeader;