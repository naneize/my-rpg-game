// src/components/character/StatItem.jsx
import { PlusCircle } from 'lucide-react';

export default function StatItem({ stat, stats, onUpgrade }) {
  return (
    <div className="bg-slate-900/60 border border-slate-800 p-4 rounded-3xl flex justify-between items-center hover:border-white/10 transition-all shadow-md">
      <div className={`flex items-center gap-4 ${stat.color}`}>
        <div className="p-2 bg-black/20 rounded-xl">
          <stat.icon size={22} fill={stat.auto ? 'currentColor' : 'none'} />
        </div>
        <div>
          <p className="text-[8px] uppercase font-bold text-slate-500 tracking-widest leading-none mb-1">{stat.label}</p>
          <div className="flex items-baseline gap-3">
            <p className="text-2xl font-black font-mono leading-none text-white">{stat.val}</p>
            {stat.bonus > 0 && (
              <span className="text-sm font-bold text-emerald-400" >
                +{stat.isPercent ? `${stat.bonus.toFixed(0)}%` : stat.bonus}
              </span>
            )}
          </div>
        </div>
      </div>
      {stats.points > 0 && !stat.auto ? (
        <button onClick={() => onUpgrade(stat.key)} className={`${stat.color} hover:scale-110 active:scale-90`}>
          <PlusCircle size={28} fill="white" />
        </button>
      ) : stat.auto && (
        <span className="text-[7px] text-slate-700 italic font-bold uppercase">Auto Growth</span>
      )}
    </div>
  );
}