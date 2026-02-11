import React from 'react';
import { Crown, Zap, Activity, Target } from 'lucide-react';

const getElementTheme = (element) => {
  const themes = {
    FIRE: "from-red-950 via-slate-900 to-slate-950",
    WATER: "from-blue-900/40 via-slate-900 to-slate-950",
    WIND: "from-emerald-900/40 via-slate-900 to-slate-950",
    EARTH: "from-orange-950/40 via-slate-900 to-slate-950",
    LIGHT: "from-yellow-900/20 via-slate-900 to-slate-950",
    DARK: "from-purple-950/40 via-slate-900 to-slate-950",
    DRAGON: "from-slate-900 via-black to-black", 
  };
  return themes[element?.toUpperCase()] || "from-slate-900 via-slate-950 to-black";
};

export default function BossFrame({ children, isWorldBoss, isShiny, isBoss, lootResult, monster }) {
  const bgTheme = isWorldBoss ? getElementTheme('DRAGON') : getElementTheme(monster?.element);
  const isTrulyBoss = isWorldBoss || monster?.rarity === 'Legendary';
  const isElite = isBoss || monster?.isMiniBoss || monster?.rarity === 'Epic';

  const frameStyles = isWorldBoss 
    ? 'border-2 border-amber-500/40 shadow-[inset_0_0_50px_rgba(245,158,11,0.1)]' 
    : isShiny 
      ? 'animate-rainbow-border p-[1px]' 
      : isTrulyBoss
        ? 'border-2 border-amber-600/30 shadow-[inset_0_0_30px_rgba(0,0,0,0.5)]'
        : 'border border-white/10';

  return (
    <div className={`relative w-full max-w-none lg:max-w-5xl flex-1 min-h-0 shadow-2xl transition-all duration-1000 overflow-hidden flex flex-col mx-auto rounded-none font-mono
      ${frameStyles} 
      ${lootResult ? 'opacity-80 scale-[0.98]' : 'opacity-100'}
    `}>
      
      {/* 🌈 Tactical Background Gradient */}
      <div className={`absolute inset-0 bg-gradient-to-b ${bgTheme} transition-colors duration-1000`} style={{ zIndex: 0 }} />
      
      {/* 🕸️ Research Grid Overlay (เพิ่มดีเทลวิจัย) */}
      <div className="absolute inset-0 opacity-[0.05] pointer-events-none z-[1]" 
           style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)', backgroundSize: '40px 40px' }} />

      {/* ✨ Square Spotlight */}
      <div className={`absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 sm:w-96 sm:h-96 blur-[100px] rounded-none pointer-events-none opacity-40
        ${isWorldBoss ? 'bg-amber-500/20' : 'bg-blue-500/10'}`} style={{ zIndex: 1 }} />
      
      {/* 👑 Header - Tactical Overlord Bar */}
      {isTrulyBoss && !lootResult && (
        <div className={`w-full py-2 bg-black/60 border-b-2 flex justify-center items-center gap-3 z-50 shrink-0 relative
          ${isWorldBoss ? 'border-amber-500 shadow-[0_4px_15px_rgba(245,158,11,0.2)]' : 'border-amber-600/40'}`}>
          <div className="absolute left-4 opacity-30"><Activity size={10} className="text-white" /></div>
          
          {isWorldBoss && <Zap size={12} className="text-amber-500 animate-pulse" />}
          <Crown size={14} className={isWorldBoss ? "text-amber-400" : "text-amber-600/50"} />
          <span className={`text-[9px] sm:text-[11px] font-black tracking-[0.4em] uppercase italic
            ${isWorldBoss ? 'text-amber-400 drop-shadow-[0_0_8px_rgba(245,158,11,0.5)]' : 'text-amber-600/80'}`}>
            {isWorldBoss ? 'ANCIENT_OVERLORD_IDENTIFIED' : 'LEGENDARY_ENTITY_FOUND'}
          </span>
          <Crown size={14} className={isWorldBoss ? "text-amber-400" : "text-amber-600/50"} />
          {isWorldBoss && <Zap size={12} className="text-amber-500 animate-pulse" />}

          <div className="absolute right-4 opacity-30"><Target size={10} className="text-white" /></div>
        </div>
      )}

      {/* 👹 Header Elite - Tactical Alert Bar */}
      {isElite && !isTrulyBoss && !lootResult && (
        <div className="w-full py-1.5 bg-red-950/40 border-b border-red-500/40 flex justify-center items-center z-50 shrink-0 relative">
          <div className="absolute left-0 w-1 h-full bg-red-500 animate-pulse" />
          <span className="text-[8px] font-black tracking-[0.5em] text-red-500 uppercase italic">CRITICAL_ELITE_DETECTED</span>
          <div className="absolute right-0 w-1 h-full bg-red-500 animate-pulse" />
        </div>
      )}

      {/* 🌈 Content Area */}
      <div className={`relative flex-1 min-h-0 flex flex-col z-10 ${isShiny ? 'bg-black/80 m-1 border border-white/10' : ''}`}>
        {children}
      </div>

      {/* 🕸️ World Boss Overlay (Hard Vignette) */}
      {isWorldBoss && (
        <div className="absolute inset-0 pointer-events-none z-10 opacity-30 bg-[radial-gradient(square_at_center,_transparent_40%,_black_100%)]" />
      )}

      {/* กรอบมุม UI (Hard-Edge Corners) */}
      <div className={`absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 pointer-events-none z-20 
        ${isTrulyBoss ? 'border-amber-500' : isElite ? 'border-red-500/60' : 'border-white/20'}`} />
      <div className={`absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 pointer-events-none z-20
        ${isTrulyBoss ? 'border-amber-500' : isElite ? 'border-red-500/60' : 'border-white/20'}`} />
    </div>
  );
}