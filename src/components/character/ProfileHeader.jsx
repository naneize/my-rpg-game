import React from 'react'; 
import { Trophy, Sword, Shield, Heart, Zap } from 'lucide-react';

/**
 * ProfileHeader: ฉบับเน้น ATK และ DEF (Minimalist High-Impact)
 */
const ProfileHeader = ({ stats, collectionScore, finalMaxHp, hpPercent, expPercent }) => {
  
  return (
    <div className="w-full bg-slate-900/40 border border-white/5 p-6 rounded-[2.5rem] text-center shadow-2xl relative overflow-hidden backdrop-blur-md">
      
      {/* 🏆 Top Info Bar */}
      <div className="flex justify-between items-center mb-6 border-b border-white/5 pb-4">
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-amber-500/10 rounded-lg">
            <Trophy size={12} className="text-amber-500" />
          </div>
          <div className="flex flex-col items-start">
            <span className="text-[7px] text-slate-500 uppercase font-black tracking-widest italic">Score</span>
            <span className="text-xs font-black text-white italic leading-none">{collectionScore}</span>
          </div>
        </div>

        <div className="flex items-center gap-2 text-right">
          <div className="flex flex-col items-end">
            <span className="text-[7px] text-slate-500 uppercase font-black tracking-widest italic">Level</span>
            <span className="text-xs font-black text-indigo-400 italic leading-none">{stats.level}</span>
          </div>
          <div className="p-1.5 bg-indigo-500/10 rounded-lg">
            <Zap size={12} className="text-indigo-400" />
          </div>
        </div>
      </div>
      
      {/* 👤 Hero Identity */}
      <h2 className="text-2xl font-black text-white uppercase tracking-[0.2em] mb-1 italic drop-shadow-lg">
        {stats.name || "HERO"}
      </h2>
      <div className="inline-block px-3 py-1 rounded-full bg-white/[0.03] border border-white/5 mb-8">
        <p className="text-slate-400 font-bold text-[7px] tracking-[0.4em] uppercase">
          Battle Protocol Active
        </p>
      </div>

      {/* 📊 --- MAIN BATTLE STATS (Focus ATK & DEF) --- */}
      <div className="grid grid-cols-2 gap-4 mb-8">
        {/* ATK Box */}
        <div className="bg-gradient-to-br from-amber-500/10 to-transparent rounded-2xl p-4 border border-amber-500/20 relative group">
          <Sword size={14} className="text-amber-500 absolute top-3 right-3 opacity-30 group-hover:opacity-100 transition-opacity" />
          <p className="text-[8px] font-black text-amber-500/60 uppercase tracking-[0.2em] mb-1 text-left">Attack</p>
          <p className="text-3xl font-black text-white italic text-left drop-shadow-[0_0_10px_rgba(245,158,11,0.3)]">
            {/* ✅ แก้ไข: ใช้ค่าที่ซิงค์มาแล้ว (displayAtk) ถ้าไม่มีให้ใช้ค่าพื้นฐาน */}
            {stats.displayAtk || stats.atk}
          </p>
        </div>

        {/* DEF Box */}
        <div className="bg-gradient-to-br from-blue-500/10 to-transparent rounded-2xl p-4 border border-blue-500/20 relative group">
          <Shield size={14} className="text-blue-400 absolute top-3 right-3 opacity-30 group-hover:opacity-100 transition-opacity" />
          <p className="text-[8px] font-black text-blue-400/60 uppercase tracking-[0.2em] mb-1 text-left">Defense</p>
          <p className="text-3xl font-black text-white italic text-left drop-shadow-[0_0_10px_rgba(59,130,246,0.3)]">
            {/* ✅ แก้ไข: ใช้ค่าที่ซิงค์มาแล้ว (displayDef) ถ้าไม่มีให้ใช้ค่าพื้นฐาน */}
            {stats.displayDef || stats.def}
          </p>
        </div>
      </div>

      {/* 🔴 VITALITY (HP BAR) */}
      <div className="space-y-2 px-1 mb-4">
        <div className="flex justify-between items-end px-1">
          <div className="flex items-center gap-1.5">
            <Heart size={10} className="text-red-500" />
            <span className="text-[8px] font-black uppercase text-red-500 tracking-widest italic">HP</span>
          </div>
          <span className="text-[10px] font-black text-white italic">{Math.floor(stats.hp)} <span className="text-slate-500 text-[8px]">/ {finalMaxHp}</span></span>
        </div>
        <div className="w-full h-2 bg-black/40 rounded-full overflow-hidden border border-white/5 p-[1px]">
          <div 
            className="h-full bg-gradient-to-r from-red-600 via-rose-500 to-orange-500 rounded-full transition-all duration-700 shadow-[0_0_12px_rgba(225,29,72,0.3)]" 
            style={{ width: `${hpPercent}%` }} 
          />
        </div>
      </div>

      {/* 🟣 EXPERIENCE (EXP BAR) */}
      <div className="space-y-1.5 px-1">
        <div className="flex justify-between text-[7px] font-black uppercase text-indigo-400 leading-none px-1">
          <span className="tracking-[0.2em] italic">EXPERIENCE</span>
          <span>{Math.floor(expPercent || 0)}%</span>
        </div>
        <div className="w-full h-1 bg-black/20 rounded-full overflow-hidden border border-white/5 p-[1px]">
          <div 
            className="h-full bg-gradient-to-r from-indigo-600 via-purple-500 to-violet-400 rounded-full transition-all duration-1000" 
            style={{ width: `${expPercent}%` }} 
          />
        </div>
      </div>

    </div>
  );
};

export default ProfileHeader;