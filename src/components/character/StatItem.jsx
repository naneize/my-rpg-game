// src/components/character/StatItem.jsx
import { PlusCircle } from 'lucide-react';

export default function StatItem({ stat, stats, onUpgrade }) {
  return (
    <div className="bg-slate-900/60 border border-white/10 p-4 rounded-none flex justify-between items-center hover:border-amber-500/30 transition-all shadow-xl relative group overflow-hidden font-mono">
      {/* 🧩 Decorative Hard Corners */}
      <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-white/20" />
      <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-white/20" />
      
      <div className={`flex items-center gap-4 ${stat.color}`}>
        {/* Icon Box: Hard-Edge */}
        <div className="p-2.5 bg-black/40 border border-white/5 rounded-none shadow-inner group-hover:border-white/20 transition-colors">
          <stat.icon size={22} fill={stat.auto ? 'currentColor' : 'none'} className="drop-shadow-[0_0_8px_currentColor]" />
        </div>

        <div>
          <p className="text-[9px] uppercase font-black text-slate-500 tracking-[0.2em] leading-none mb-1.5 italic opacity-70">
            {stat.label}_Analysis
          </p>
          <div className="flex items-baseline gap-3">
            <p className="text-2xl font-black leading-none text-white italic tracking-tighter drop-shadow-md">
              {stat.val}
            </p>
            {stat.bonus > 0 && (
              <span className="text-sm font-black text-emerald-400 italic animate-in fade-in slide-in-from-left-1" >
                (+{stat.isPercent ? `${stat.bonus.toFixed(0)}%` : stat.bonus})
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Action Area */}
      <div className="flex items-center">
        {stats.points > 0 && !stat.auto ? (
          <button 
            onClick={() => onUpgrade(stat.key)} 
            className={`${stat.color} hover:scale-110 active:scale-90 transition-transform p-1 relative`}
          >
            {/* 🆕 เพิ่มเอฟเฟกต์ Glow รอบปุ่มบวก */}
            <div className={`absolute inset-0 blur-lg opacity-20 bg-current`} />
            <PlusCircle size={32} fill="white" className="relative z-10" />
          </button>
        ) : stat.auto && (
          <div className="flex flex-col items-end opacity-40">
            <span className="text-[7px] text-slate-500 italic font-black uppercase tracking-widest mb-1">Neural_Growth</span>
            <div className="h-0.5 w-12 bg-current" />
          </div>
        )}
      </div>
    </div>
  );
}