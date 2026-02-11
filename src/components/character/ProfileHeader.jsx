import React from 'react'; 
import { Trophy, Sword, Shield, Heart, Zap, Activity } from 'lucide-react';

/**
 * ProfileHeader: ฉบับ Tactical Hard-Edge (Military Grade)
 * เน้นความเหลี่ยม คม และการแสดงผลข้อมูลแบบ HUD วิจัย
 */
const ProfileHeader = ({ stats, collectionScore, finalMaxHp, hpPercent, expPercent, atkP, defP }) => {  

  const getStatColor = (val) => val >= 0 ? 'text-amber-500' : 'text-red-500';
  const getDefColor = (val) => val >= 0 ? 'text-blue-400' : 'text-red-500';

  return (
    <div className="w-full bg-slate-900/60 border border-white/10 p-6 md:p-8 rounded-none text-center shadow-2xl relative overflow-hidden backdrop-blur-xl ring-1 ring-white/5 font-mono">
      
      {/* 🧩 Cyber Corner Decorations */}
      <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-amber-500/50" />
      <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-amber-500/50" />
      <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-amber-500/50" />
      <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-amber-500/50" />
      
      {/* 🔮 Background Effect */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-32 bg-amber-500/5 blur-[60px] pointer-events-none" />
      
      {/* 🏆 1. Top Status Bar (Hard-Edge) */}
      <div className="flex justify-between items-center mb-8 bg-black/40 p-3 rounded-none border border-white/10">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-amber-500/10 border border-amber-500/20">
            <Trophy size={14} className="text-amber-500" />
          </div>
          <div className="flex flex-col items-start">
            <span className="text-[8px] text-slate-500 uppercase font-black tracking-[0.2em] leading-none mb-1">Total_Score</span>
            <span className="text-sm font-black text-white italic leading-none">{collectionScore}</span>
          </div>
        </div>

        <div className="flex items-center gap-3 text-right">
          <div className="flex flex-col items-end">
            <span className="text-[8px] text-slate-500 uppercase font-black tracking-[0.2em] leading-none mb-1">Neural_Lv</span>
            <span className="text-sm font-black text-indigo-400 italic leading-none">{stats.level}</span>
          </div>
          <div className="p-2 bg-indigo-500/10 border border-indigo-500/20">
            <Zap size={14} className="text-indigo-400" />
          </div>
        </div>
      </div>
      
      {/* 👤 2. Hero Identity */}
      <div className="relative mb-8">
        <h2 className="text-3xl md:text-4xl font-black text-white uppercase tracking-[0.15em] italic drop-shadow-[0_0_10px_rgba(255,255,255,0.1)]">
          {stats.name || "UNIDENTIFIED"}
        </h2>
        <div className="mt-2 flex items-center justify-center gap-3">
          <div className="h-[1px] w-12 bg-emerald-500/30" />
          <p className="text-emerald-500 font-black text-[8px] tracking-[0.5em] uppercase animate-pulse">
            System_Integrity_Stable
          </p>
          <div className="h-[1px] w-12 bg-emerald-500/30" />
        </div>
      </div>

      {/* ⚔️ 3. Main Battle Stats (Military-Grade Box) */}
      <div className="grid grid-cols-2 gap-3 md:gap-4 mb-8">
        
        {/* ATK Box */}
        <div className="bg-slate-950/50 rounded-none p-5 border border-amber-500/20 hover:border-amber-500/50 transition-all group relative overflow-hidden">
          <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-amber-500" />
          <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-amber-500" />
          
          <p className="text-[9px] font-black text-amber-500 uppercase tracking-widest mb-2 text-left opacity-60 italic">Power_Output</p>
          <div className="flex items-baseline gap-2">
            <p className="text-3xl md:text-4xl font-black text-white italic text-left drop-shadow-[0_0_8px_rgba(245,158,11,0.3)]">
              {stats.displayAtk || stats.atk}
            </p>
            {stats.atkP !== 0 && (
              <span className={`text-[10px] md:text-xs font-black italic ${getStatColor(stats.atkP)}`}>
                ({stats.atkP > 0 ? '+' : ''}{(stats.atkP * 100).toFixed(0)}%)
              </span>
            )}
          </div>
        </div>

        {/* DEF Box */}
        <div className="bg-slate-950/50 rounded-none p-5 border border-blue-500/20 hover:border-blue-500/50 transition-all group relative overflow-hidden">
          <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-blue-400" />
          <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-blue-400" />
          
          <p className="text-[9px] font-black text-blue-400 uppercase tracking-widest mb-2 text-left opacity-60 italic">Shield_Rating</p>
          <div className="flex items-baseline gap-2">
            <p className="text-3xl md:text-4xl font-black text-white italic text-left drop-shadow-[0_0_8px_rgba(59,130,246,0.3)]">
              {stats.displayDef || stats.def}
            </p>
            {stats.defP !== 0 && (
              <span className={`text-[10px] md:text-xs font-black italic ${getDefColor(stats.defP)}`}>
                ({stats.defP > 0 ? '+' : ''}{(stats.defP * 100).toFixed(0)}%)
              </span>
            )}
          </div>
        </div>
      </div>

      {/* 🔴 4. Vitality Matrix (Hard-Edge HP) */}
      <div className="space-y-3 mb-6">
        <div className="flex justify-between items-end px-1">
          <div className="flex items-center gap-2">
            <Heart size={10} className="text-red-500 fill-red-500" />
            <span className="text-[10px] font-black uppercase text-red-500 tracking-widest">Vital_Integrity</span>
          </div>
          <div className="text-right">
            <span className="text-sm font-black text-white italic">{Math.floor(stats.hp)}</span>
            <span className="text-slate-600 text-[10px] font-bold ml-1">/ {finalMaxHp}</span>
          </div>
        </div>
        <div className="w-full h-4 bg-black/60 rounded-none border border-white/10 p-[2px]">
          <div 
            className="h-full bg-gradient-to-r from-red-600 via-rose-500 to-amber-500 rounded-none transition-all duration-1000 shadow-[0_0_10px_rgba(225,29,72,0.3)]" 
            style={{ width: `${hpPercent}%` }} 
          />
        </div>
      </div>

      {/* 🟣 5. Neural Sync Matrix (Hard-Edge EXP) */}
      <div className="space-y-2">
        <div className="flex justify-between items-center px-1">
          <span className="text-[8px] font-black uppercase text-indigo-400 tracking-[0.3em] flex items-center gap-2">
            <Activity size={10} className="animate-pulse" /> Sync_Analysis
          </span>
          <span className="text-[10px] font-black text-indigo-300">{Math.floor(expPercent || 0)}%</span>
        </div>
        <div className="w-full h-2 bg-black/40 rounded-none border border-white/10">
          <div 
            className="h-full bg-gradient-to-r from-indigo-600 via-purple-500 to-violet-400 rounded-none transition-all duration-[1500ms]" 
            style={{ width: `${expPercent}%` }} 
          />
        </div>
      </div>

    </div>
  );
};

export default ProfileHeader;