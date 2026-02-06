import React from 'react';
import { Sword, Shield, Heart, Sparkles, Plus } from 'lucide-react';

const StatGroup = ({ stats, bonusStats, onUpgrade }) => {
  const statRows = [
    { key: 'maxHp', label: 'HP', icon: <Heart size={12} />, color: 'text-red-500', bg: 'bg-red-500/10', bonus: bonusStats?.hp },
    { key: 'atk', label: 'ATK', icon: <Sword size={12} />, color: 'text-amber-500', bg: 'bg-amber-500/10', bonus: bonusStats?.atk },
    { key: 'def', label: 'DEF', icon: <Shield size={12} />, color: 'text-blue-400', bg: 'bg-blue-500/10', bonus: bonusStats?.def },
    { key: 'luck', label: 'LUCK', icon: <Sparkles size={12} />, color: 'text-emerald-400', bg: 'bg-emerald-400/10', bonus: bonusStats?.luck },
  ];

  return (
    <div className="flex flex-col gap-2 w-full max-w-[240px]"> {/* ✅ บังคับความกว้างไม่ให้บานออก */}
      {statRows.map((stat) => (
        <div key={stat.key} className="relative flex items-center bg-white/[0.03] border border-white/5 rounded-2xl p-2 pr-12 group">
          
          {/* ซ้าย: Icon (ขนาดจิ๋วลง) */}
          <div className={`p-2 rounded-xl ${stat.bg} ${stat.color} mr-3`}>
            {stat.icon}
          </div>

          {/* กลาง: Label และ ตัวเลข (แยกห่างกันชัดเจน) */}
          <div className="flex flex-col flex-1 min-w-0">
            <span className="text-[8px] font-black text-slate-500 uppercase tracking-tighter leading-none mb-1">
              {stat.label}
            </span>
            <div className="flex items-baseline gap-1.5">
              <span className="text-sm font-black text-white italic leading-none">
                {stat.key === 'maxHp' ? stats.maxHp : stats[stat.key]}
              </span>
              {stat.bonus > 0 && (
                <span className="text-[9px] font-bold text-emerald-400 leading-none">
                  +{stat.bonus}
                </span>
              )}
            </div>
          </div>

          {/* ขวา: ปุ่มบวก (วางตำแหน่ง Absolute ขวาสุด) */}
          <button 
            onClick={() => stats.points > 0 && onUpgrade(stat.key)}
            disabled={stats.points <= 0}
            className={`absolute right-2 w-8 h-8 rounded-full flex items-center justify-center transition-all
              ${stats.points > 0 
                ? 'bg-amber-500 text-slate-950 shadow-lg hover:scale-105 active:scale-95' 
                : 'bg-slate-800 text-slate-600 opacity-20 cursor-not-allowed'}`}
          >
            <Plus size={14} strokeWidth={4} />
          </button>
        </div>
      ))}
    </div>
  );
};

export default StatGroup;