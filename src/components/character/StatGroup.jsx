import React from 'react'; 
import { Sword, Shield, Heart, Sparkles, Activity } from 'lucide-react';

/**
 * ✅ StatGroup เวอร์ชัน Tactical Hard-Edge (Military Grade)
 * เน้นความเหลี่ยม คม และข้อมูลเชิงลึกแบบ Dashboard วิจัย
 */
const StatGroup = ({ stats, displayStats, bonusStats, displayBonus }) => {
  const statRows = [
    { 
      key: 'maxHp', 
      label: 'BIO_INTEGRITY', 
      icon: <Heart size={12} />, 
      color: 'text-red-500', 
      bg: 'bg-red-500/10', 
      displayValue: displayStats?.finalMaxHp || stats.maxHp,
      bonus: displayBonus?.hp || bonusStats?.hp,
      percent: displayBonus?.hpPercent || 0
    },
    { 
      key: 'atk', 
      label: 'ATK_RATING', 
      icon: <Sword size={12} />, 
      color: 'text-amber-500', 
      bg: 'bg-amber-500/10', 
      displayValue: displayStats?.finalAtk || stats.atk,
      bonus: displayBonus?.atk || bonusStats?.atk,
      percent: displayBonus?.atkPercent || 0
    },
    { 
      key: 'def', 
      label: 'DEF_RATING', 
      icon: <Shield size={12} />, 
      color: 'text-blue-400', 
      bg: 'bg-blue-500/10', 
      displayValue: displayStats?.finalDef || stats.def,
      bonus: displayBonus?.def || bonusStats?.def,
      percent: displayBonus?.defPercent || 0
    },
    { 
      key: 'luck', 
      label: 'LUCK_INDEX', 
      icon: <Sparkles size={12} />, 
      color: 'text-emerald-400', 
      bg: 'bg-emerald-400/10', 
      displayValue: displayStats?.luck || stats.luck,
      bonus: bonusStats?.luck 
    },
  ];

  return (
    <div className="flex flex-col gap-1.5 w-full max-w-[260px] font-mono">
      {/* 📊 Header Decor */}
      <div className="flex items-center gap-2 mb-2 px-1 opacity-50">
        <Activity size={10} className="text-blue-400 animate-pulse" />
        <span className="text-[8px] font-black uppercase tracking-[0.3em] text-blue-400">Stat_Analysis_v4.0</span>
      </div>

      {statRows.map((stat) => (
        <div key={stat.key} className="relative flex items-center bg-black/40 border border-white/10 rounded-none p-2 group transition-all hover:bg-white/5">
          
          {/* 🧩 Corner Accents */}
          <div className="absolute top-0 left-0 w-1.5 h-1.5 border-t border-l border-white/20" />
          <div className="absolute bottom-0 right-0 w-1.5 h-1.5 border-b border-r border-white/20" />

          {/* ซ้าย: Icon Box (Hard-Edge) */}
          <div className={`p-2 rounded-none ${stat.bg} ${stat.color} mr-3 border border-white/5 shadow-inner`}>
            {stat.icon}
          </div>

          {/* กลาง: Label และ ตัวเลข */}
          <div className="flex flex-col flex-1 min-w-0">
            <span className="text-[7.5px] font-black text-slate-500 uppercase tracking-widest leading-none mb-1.5 italic">
              {stat.label}
            </span>
            <div className="flex items-baseline gap-2 flex-wrap">
              <span className="text-sm font-black text-white italic leading-none drop-shadow-md">
                {stat.displayValue.toLocaleString()}
              </span>

              {/* 🟢 ตัวเลขสีเขียว: โบนัสสุทธิ */}
              {stat.bonus > 0 && (
                <span className="text-[9px] font-bold text-emerald-400 leading-none italic">
                  +{stat.bonus.toLocaleString()}
                </span>
              )}

              {/* 🟡 ตัวเลขสีทอง: % โบนัส */}
              {stat.percent > 0 && (
                <span className="text-[9px] font-black text-amber-400 leading-none opacity-80 italic">
                  (+{Math.round(stat.percent * 100)}%)
                </span>
              )}
            </div>
          </div>

          {/* Decorative side bar */}
          <div className={`absolute right-0 top-1/2 -translate-y-1/2 w-0.5 h-4 ${stat.color} opacity-20 group-hover:opacity-100 transition-opacity`} />
        </div>
      ))}
    </div>
  );
};

export default StatGroup;