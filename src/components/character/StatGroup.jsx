import React from 'react';
import { Sword, Shield, Heart, Sparkles } from 'lucide-react';

/**
 * ✅ StatGroup เวอร์ชันเน้นแสดงผล (ลบปุ่มอัพเกรดออก)
 * displayStats: ยอดรวมสุทธิ (finalAtk, finalDef, finalMaxHp)
 * displayBonus: ยอดบวกสีเขียวสุทธิ และ เปอร์เซ็นต์ (atk, def, hp, atkPercent, ...)
 */
const StatGroup = ({ stats, displayStats, bonusStats, displayBonus }) => {
  const statRows = [
    { 
      key: 'maxHp', 
      label: 'HP', 
      icon: <Heart size={12} />, 
      color: 'text-red-500', 
      bg: 'bg-red-500/10', 
      displayValue: displayStats?.finalMaxHp || stats.maxHp,
      bonus: displayBonus?.hp || bonusStats?.hp,
      percent: displayBonus?.hpPercent || 0
    },
    { 
      key: 'atk', 
      label: 'ATK', 
      icon: <Sword size={12} />, 
      color: 'text-amber-500', 
      bg: 'bg-amber-500/10', 
      displayValue: displayStats?.finalAtk || stats.atk,
      bonus: displayBonus?.atk || bonusStats?.atk,
      percent: displayBonus?.atkPercent || 0
    },
    { 
      key: 'def', 
      label: 'DEF', 
      icon: <Shield size={12} />, 
      color: 'text-blue-400', 
      bg: 'bg-blue-500/10', 
      displayValue: displayStats?.finalDef || stats.def,
      bonus: displayBonus?.def || bonusStats?.def,
      percent: displayBonus?.defPercent || 0
    },
    { 
      key: 'luck', 
      label: 'LUCK', 
      icon: <Sparkles size={12} />, 
      color: 'text-emerald-400', 
      bg: 'bg-emerald-400/10', 
      displayValue: displayStats?.luck || stats.luck,
      bonus: bonusStats?.luck 
    },
  ];

  return (
    <div className="flex flex-col gap-2 w-full max-w-[240px]">
      {statRows.map((stat) => (
        <div key={stat.key} className="relative flex items-center bg-white/[0.03] border border-white/5 rounded-2xl p-2 group">
          
          {/* ซ้าย: Icon */}
          <div className={`p-2 rounded-xl ${stat.bg} ${stat.color} mr-3`}>
            {stat.icon}
          </div>

          {/* กลาง: Label และ ตัวเลข (ขยับพื้นที่ให้กว้างขึ้นเพราะไม่มีปุ่มขวางแล้ว) */}
          <div className="flex flex-col flex-1 min-w-0">
            <span className="text-[8px] font-black text-slate-500 uppercase tracking-tighter leading-none mb-1">
              {stat.label}
            </span>
            <div className="flex items-baseline gap-1.5 flex-wrap">
              <span className="text-sm font-black text-white italic leading-none">
                {stat.displayValue}
              </span>

              {/* 🟢 ตัวเลขสีเขียว: โบนัสสุทธิ */}
              {stat.bonus > 0 && (
                <span className="text-[9px] font-bold text-emerald-400 leading-none animate-in fade-in slide-in-from-left-1">
                  +{stat.bonus}
                </span>
              )}

              {/* 🟡 ตัวเลขสีทอง: % โบนัส */}
              {stat.percent > 0 && (
                <span className="text-[9px] font-bold text-amber-400 leading-none opacity-80">
                  (+{Math.round(stat.percent * 100)}%)
                </span>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default StatGroup;