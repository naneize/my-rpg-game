import React from 'react';
import { Mountain, Skull, ArrowRight, XCircle, Sparkles, TrendingUp } from 'lucide-react';

export default function DungeonDiscoveryView({ dungeon, onEnter, onSkip }) {
  if (!dungeon) return null;

  const borderColor = dungeon.borderColor || "border-amber-500/50";
  const accentColor = dungeon.accentColor || "bg-amber-600";
  const glowColor = borderColor.replace('border-', 'bg-').replace('/50', '/20');
  const iconTextColor = borderColor.replace('border-', 'text-').split('/')[0];

  return (
    <div className="flex flex-col items-center justify-center h-full p-4 animate-in fade-in zoom-in duration-300">
      <div className={`max-w-md w-full bg-gradient-to-b ${dungeon.themeColor} border-2 ${borderColor} rounded-[2.5rem] p-8 shadow-[0_0_50px_rgba(0,0,0,0.8)] relative overflow-hidden`}>
        
        <div className={`absolute top-0 left-1/2 -translate-x-1/2 w-32 h-32 ${glowColor} blur-[50px] rounded-full`} />

        <div className="relative z-10 text-center space-y-6">
          <div className="flex justify-center">
            <div className={`p-4 bg-slate-900/80 rounded-full border ${borderColor.replace('/50', '/30')} shadow-inner`}>
              <Mountain className={`${iconTextColor} animate-bounce`} size={48} />
            </div>
          </div>

          <div className="space-y-2">
            <h2 className="text-2xl font-black text-white uppercase tracking-tighter italic">
              {dungeon.name}
            </h2>
            <div className="flex flex-wrap items-center justify-center gap-2">
               <span className={`px-3 py-1 bg-black/50 rounded-full text-[10px] font-bold ${iconTextColor} border ${borderColor.replace('/50', '/20')}`}>
                 {dungeon.difficulty}
               </span>

              <span className="px-3 py-1 bg-black/50 rounded-full text-[10px] font-bold text-yellow-400 border border-yellow-900/50">
                  Lv. {dungeon.minLevel} - {dungeon.maxLevel}
              </span>

               <span className="px-3 py-1 bg-black/50 rounded-full text-[10px] font-bold text-slate-300 border border-slate-800">
                 {dungeon.steps} Steps
               </span>
            </div>
          </div>

          <p className="text-slate-300 text-sm leading-relaxed italic font-serif">
            "{dungeon.description}"
          </p>

          {/* 🎁 ส่วนที่เพิ่มใหม่: บัฟพิเศษของดันเจี้ยน */}
          <div className="flex flex-col gap-2 bg-black/40 p-4 rounded-2xl border border-white/5 shadow-inner">
            <div className="flex items-center justify-between">
               <div className="flex items-center gap-2">
                  <TrendingUp size={14} className="text-emerald-400" />
                  <span className="text-[10px] font-black text-white uppercase tracking-widest">Dungeon Perks</span>
               </div>
               <span className="text-[9px] text-slate-500 italic">Active during exploration</span>
            </div>
            
            <div className="flex items-center gap-3">
               {/* Drop Rate Bonus */}
               <div className="flex-1 flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 py-2 px-3 rounded-xl">
                  <Sparkles size={12} className="text-emerald-400" />
                  <div className="text-left leading-none">
                    <p className="text-[10px] font-black text-emerald-400 leading-none">+3.0%</p>
                    <p className="text-[8px] text-white/50 uppercase font-bold">Drop Rate</p>
                  </div>
               </div>

               {/* Luck Bonus (ถ้ามี หรือจะใส่เป็นค่าอื่นก็ได้) */}
               <div className="flex-1 flex items-center gap-2 bg-amber-500/10 border border-amber-500/20 py-2 px-3 rounded-xl">
                  <TrendingUp size={12} className="text-amber-400" />
                  <div className="text-left leading-none">
                    <p className="text-[10px] font-black text-amber-400 leading-none">SPECIAL</p>
                    <p className="text-[8px] text-white/50 uppercase font-bold">Loot Quality</p>
                  </div>
               </div>
            </div>
          </div>

          <div className="flex flex-col gap-3 pt-2">
            <button 
              onClick={onEnter}
              className={`group relative flex items-center justify-center gap-3 ${accentColor} hover:brightness-110 text-black font-black py-4 rounded-2xl transition-all active:scale-95 shadow-[0_4px_0_rgba(0,0,0,0.3)] hover:shadow-none hover:translate-y-[4px]`}
            >
              <Skull size={20} />
              บุกตะลุยดันเจี้ยน!
              <ArrowRight className="group-hover:translate-x-1 transition-transform" size={18} />
            </button>

            <button 
              onClick={onSkip}
              className="flex items-center justify-center gap-2 text-slate-500 hover:text-slate-300 text-xs font-bold py-2 transition-colors"
            >
              <XCircle size={14} />
              เดินผ่านไปอย่างเงียบๆ
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}