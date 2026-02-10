import React from 'react';
import { Sword, Shield, Heart, Sparkles, Plus } from 'lucide-react';

/**
 * ✅ แก้ไข: รับ displayBonus เข้ามาเพิ่มเติมเพื่อดึงค่าโบนัสที่คำนวณรวม % แล้ว
 * displayStats: ยอดรวมสุทธิ (finalAtk, finalDef, finalMaxHp)
 * displayBonus: ยอดบวกสีเขียวสุทธิ และ เปอร์เซ็นต์ (atk, def, hp, atkPercent, ...)
 */
const StatGroup = ({ stats, displayStats, bonusStats, displayBonus, onUpgrade }) => {
  const statRows = [
    { 
      key: 'maxHp', 
      label: 'HP', 
      icon: <Heart size={12} />, 
      color: 'text-red-500', 
      bg: 'bg-red-500/10', 
      // ดึงค่าแสดงผลสุดท้ายจาก finalMaxHp (ที่คำนวณรวมทุกอย่างแล้ว)
      displayValue: displayStats?.finalMaxHp || stats.maxHp,
      // 🟢 ใช้โบนัสสุทธิจาก displayBonus (เช่น +160 แทนที่จะเป็นแค่ +120)
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
            <div className="flex items-baseline gap-1.5 flex-wrap">
              <span className="text-sm font-black text-white italic leading-none">
                {stat.displayValue}
              </span>

              {/* 🟢 ตัวเลขสีเขียว: โชว์โบนัสสุทธิ (รวมผลจาก % แล้ว) */}
              {stat.bonus > 0 && (
                <span className="text-[9px] font-bold text-emerald-400 leading-none animate-in fade-in slide-in-from-left-1">
                  +{stat.bonus}
                </span>
              )}

              {/* 🟡 ตัวเลขสีทอง: โชว์โบนัส % ต่อท้ายเพื่อให้ผู้เล่นเข้าใจที่มา */}
              {stat.percent > 0 && (
                <span className="text-[9px] font-bold text-amber-400 leading-none opacity-80">
                  (+{Math.round(stat.percent * 100)}%)
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