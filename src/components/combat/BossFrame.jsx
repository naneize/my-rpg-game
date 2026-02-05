import React from 'react';
import { Crown } from 'lucide-react';

// ✅ ปรับสีให้สว่างขึ้นเพื่อให้เห็นความแตกต่างชัดเจน
const getElementTheme = (element) => {
  const themes = {
    FIRE: "from-red-900/40 via-slate-900/90 to-slate-950",
    WATER: "from-blue-800/30 via-slate-900/90 to-slate-950",
    WIND: "from-emerald-800/30 via-slate-900/90 to-slate-950",
    EARTH: "from-orange-900/30 via-slate-900/90 to-slate-950",
    LIGHT: "from-yellow-700/20 via-slate-900/90 to-slate-950",
    DARK: "from-purple-900/40 via-slate-900/90 to-slate-950",
  };
  return themes[element?.toUpperCase()] || "from-slate-900 via-slate-900 to-slate-950";
};

export default function BossFrame({ children, isWorldBoss, isShiny, isBoss, lootResult, monster }) {
  const bgTheme = getElementTheme(monster?.element);

  const frameStyles = isWorldBoss 
    ? 'border-2 border-amber-600/60 shadow-[0_0_80px_rgba(245,158,11,0.1)]' 
    : isShiny 
      ? 'animate-rainbow-border p-[2px]' 
      : `border-2 ${isBoss ? 'border-red-900/40 shadow-[inset_0_0_60px_rgba(220,38,38,0.05)]' : 'border-white/5'}`;

  return (
    <div className={`relative w-full max-w-[420px] h-full rounded-lg shadow-2xl transition-all duration-1000 overflow-hidden flex flex-col
      ${frameStyles} 
      ${lootResult ? 'opacity-90 scale-[0.98]' : 'opacity-100'}
    `}>
      
      {/* 🌈 จุดที่แก้ไข: ตรวจสอบว่า Class bg-gradient-to-b ทำงานร่วมกับ bgTheme หรือไม่ */}
      <div 
        className={`absolute inset-0 bg-gradient-to-b ${bgTheme} transition-colors duration-1000`} 
        style={{ zIndex: 0 }} // บังคับให้อยู่หลังสุด
      />

      {/* ✨ Spotlight ด้านหลังมอนสเตอร์ */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-white/5 blur-[120px] rounded-full pointer-events-none" style={{ zIndex: 1 }} />
      
      {/* 👑 Header */}
      {isWorldBoss && !lootResult && (
        <div className="w-full py-2 bg-slate-950/90 border-b border-amber-500/20 flex justify-center items-center gap-2 z-50 shrink-0">
          <Crown size={14} className="text-amber-500" />
          <span className="text-[10px] font-black tracking-[0.3em] text-amber-500 uppercase italic">World Boss Encounter</span>
          <Crown size={14} className="text-amber-500" />
        </div>
      )}

      {/* 🌈 Content Area */}
      <div className={`relative flex-1 flex flex-col min-h-0 z-10 ${isShiny ? 'bg-slate-950/95 m-0.5 rounded-md' : ''}`}>
        {children}
      </div>

      {/* กรอบมุม UI */}
      <div className="absolute top-0 left-0 w-3 h-3 border-t border-l border-white/20 pointer-events-none z-20" />
      <div className="absolute bottom-0 right-0 w-3 h-3 border-b border-r border-white/20 pointer-events-none z-20" />
    </div>
  );
}