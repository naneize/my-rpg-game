import React from 'react';
import { Crown, Zap } from 'lucide-react';

const getElementTheme = (element) => {
  const themes = {
    FIRE: "from-red-900/40 via-slate-900/90 to-slate-950",
    WATER: "from-blue-800/30 via-slate-900/90 to-slate-950",
    WIND: "from-emerald-800/30 via-slate-900/90 to-slate-950",
    EARTH: "from-orange-900/30 via-slate-900/90 to-slate-950",
    LIGHT: "from-yellow-700/20 via-slate-900/90 to-slate-950",
    DARK: "from-purple-900/40 via-slate-900/90 to-slate-950",
    DRAGON: "from-slate-800 via-slate-900/95 to-black", 
  };
  return themes[element?.toUpperCase()] || "from-slate-900 via-slate-900 to-slate-950";
};

export default function BossFrame({ children, isWorldBoss, isShiny, isBoss, lootResult, monster }) {
  const bgTheme = isWorldBoss ? getElementTheme('DRAGON') : getElementTheme(monster?.element);
  const isTrulyBoss = isWorldBoss || monster?.rarity === 'Legendary';
  const isElite = isBoss || monster?.isMiniBoss || monster?.rarity === 'Epic';

  const frameStyles = isWorldBoss 
    ? 'border border-amber-500/50 shadow-[0_0_50px_rgba(245,158,11,0.1)]' 
    : isShiny 
      ? 'animate-rainbow-border p-[1px]' 
      : isTrulyBoss
        ? 'border border-amber-500/30 shadow-[0_0_30px_rgba(245,158,11,0.05)]'
        : 'border-white/5';

  return (
    /* ✅ แก้จาก h-full เป็น min-h-0 และ flex-1 เพื่อให้มันยืดหยุ่นตามพื้นที่ที่เหลือจริง */
    <div className={`relative w-full max-w-none lg:max-w-5xl flex-1 min-h-0 shadow-2xl transition-all duration-1000 overflow-hidden flex flex-col mx-auto rounded-t-3xl
      ${frameStyles} 
      ${lootResult ? 'opacity-90 scale-[0.98]' : 'opacity-100'}
    `}>
      
      {/* 🌈 Background Gradient */}
      <div className={`absolute inset-0 bg-gradient-to-b ${bgTheme} transition-colors duration-1000`} style={{ zIndex: 0 }} />

      {/* ✨ Spotlight - ลดขนาดลงบนมือถือ */}
      <div className={`absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-40 h-40 sm:w-80 sm:h-80 blur-[80px] sm:blur-[120px] rounded-full pointer-events-none
        ${isWorldBoss ? 'bg-amber-500/10' : 'bg-white/5'}`} style={{ zIndex: 1 }} />
      
      {/* 👑 Header - ปรับให้เตี้ยลง (py-1) เพื่อประหยัดพื้นที่แนวตั้งบนมือถือ */}
      {isTrulyBoss && !lootResult && (
        <div className={`w-full py-1 sm:py-2 bg-slate-950/80 border-b flex justify-center items-center gap-2 z-50 shrink-0
          ${isWorldBoss ? 'border-amber-500/40' : 'border-amber-600/10'}`}>
          {isWorldBoss && <Zap size={10} className="text-amber-500 animate-pulse" />}
          <Crown size={12} className={isWorldBoss ? "text-amber-400" : "text-amber-600/50"} />
          <span className={`text-[8px] sm:text-[10px] font-black tracking-[0.2em] sm:tracking-[0.3em] uppercase italic
            ${isWorldBoss ? 'text-amber-400' : 'text-amber-600/80'}`}>
            {isWorldBoss ? 'Ancient Overlord' : 'Legendary Entity'}
          </span>
          <Crown size={12} className={isWorldBoss ? "text-amber-400" : "text-amber-600/50"} />
          {isWorldBoss && <Zap size={10} className="text-amber-500 animate-pulse" />}
        </div>
      )}

      {/* 👹 Header Elite - ปรับให้เล็กลง */}
      {isElite && !isTrulyBoss && !lootResult && (
        <div className="w-full py-0.5 bg-red-950/30 border-b border-red-500/10 flex justify-center items-center z-50 shrink-0 text-stroke-none">
          <span className="text-[7px] font-black tracking-widest text-red-500/80 uppercase italic">Elite Detected</span>
        </div>
      )}

      {/* 🌈 Content Area - ใช้ flex-1 min-h-0 เพื่อให้ MonsterDisplay คำนวณความสูงได้ถูกต้อง */}
      <div className={`relative flex-1 min-h-0 flex flex-col z-10 ${isShiny ? 'bg-slate-950/95 m-0.5 rounded-md' : ''}`}>
        {children}
      </div>

      {/* 🕸️ World Boss Overlay */}
      {isWorldBoss && (
        <div className="absolute inset-0 pointer-events-none z-10 opacity-20 bg-[radial-gradient(circle_at_center,_transparent_50%,_black_100%)]" />
      )}

      {/* กรอบมุม UI (ลดขนาดลงบนมือถือ) */}
      <div className={`absolute top-0 left-0 w-2 h-2 border-t border-l pointer-events-none z-20 
        ${isTrulyBoss ? 'border-amber-500/40' : isElite ? 'border-red-500/20' : 'border-white/10'}`} />
      <div className={`absolute bottom-0 right-0 w-2 h-2 border-b border-r pointer-events-none z-20
        ${isTrulyBoss ? 'border-amber-500/40' : isElite ? 'border-red-500/20' : 'border-white/10'}`} />
    </div>
  );
}