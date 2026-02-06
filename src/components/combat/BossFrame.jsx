import React from 'react';
import { Crown, Zap } from 'lucide-react'; // ✅ เพิ่ม Zap มาทำเอฟเฟกต์สายฟ้าจางๆ

const getElementTheme = (element) => {
  const themes = {
    FIRE: "from-red-900/40 via-slate-900/90 to-slate-950",
    WATER: "from-blue-800/30 via-slate-900/90 to-slate-950",
    WIND: "from-emerald-800/30 via-slate-900/90 to-slate-950",
    EARTH: "from-orange-900/30 via-slate-900/90 to-slate-950",
    LIGHT: "from-yellow-700/20 via-slate-900/90 to-slate-950",
    DARK: "from-purple-900/40 via-slate-900/90 to-slate-950",
    // ✅ เพิ่ม Theme พิเศษสำหรับบอสโลก (Black Obsidian)
    DRAGON: "from-slate-800 via-slate-900/95 to-black", 
  };
  return themes[element?.toUpperCase()] || "from-slate-900 via-slate-900 to-slate-950";
};

export default function BossFrame({ children, isWorldBoss, isShiny, isBoss, lootResult, monster }) {
  // ✅ ถ้าเป็นบอสโลก ให้ใช้ Theme มังกรโดยเฉพาะ
  const bgTheme = isWorldBoss ? getElementTheme('DRAGON') : getElementTheme(monster?.element);

  const isTrulyBoss = isWorldBoss || monster?.rarity === 'Legendary';
  const isElite = isBoss || monster?.isMiniBoss || monster?.rarity === 'Epic';

  // ✅ ปรับปรุงสไตล์กรอบให้ World Boss ดูขลังกว่าเดิม
  const frameStyles = isWorldBoss 
    ? 'border-2 border-amber-500 shadow-[0_0_100px_rgba(245,158,11,0.1)] ring-1 ring-amber-500/20' 
    : isShiny 
      ? 'animate-rainbow-border p-[2px]' 
      : isTrulyBoss
        ? 'border-2 border-amber-500/50 shadow-[0_0_40px_rgba(245,158,11,0.1)]'
        : isElite
          ? 'border-2 border-red-600/40 shadow-[0_0_30px_rgba(220,38,38,0.1)]'
          : 'border-white/5';

  return (
    <div className={`relative w-full max-w-[420px] h-full rounded-lg shadow-2xl transition-all duration-1000 overflow-hidden flex flex-col
      ${frameStyles} 
      ${lootResult ? 'opacity-90 scale-[0.98]' : 'opacity-100'}
    `}>
      
      {/* 🌈 Background Gradient */}
      <div 
        className={`absolute inset-0 bg-gradient-to-b ${bgTheme} transition-colors duration-1000`} 
        style={{ zIndex: 0 }} 
      />

      {/* ✨ Spotlight - ถ้าเป็น World Boss จะเป็นแสงสีส้มหม่น */}
      <div className={`absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 blur-[120px] rounded-full pointer-events-none
        ${isWorldBoss ? 'bg-amber-500/10' : 'bg-white/5'}`} 
        style={{ zIndex: 1 }} 
      />
      
      {/* 👑 Header (แสดงมงกุฎทองเฉพาะบอสใหญ่จริงๆ) */}
      {isTrulyBoss && !lootResult && (
        <div className={`w-full py-2 bg-slate-950/90 border-b flex justify-center items-center gap-2 z-50 shrink-0
          ${isWorldBoss ? 'border-amber-500/50' : 'border-amber-600/20'}`}>
          
          {/* ✅ World Boss จะมี icon สายฟ้าเล็กๆ เพิ่มความดุ */}
          {isWorldBoss && <Zap size={12} className="text-amber-500 animate-pulse" />}
          
          <Crown size={14} className={isWorldBoss ? "text-amber-400" : "text-amber-600/70"} />
          <span className={`text-[10px] font-black tracking-[0.3em] uppercase italic
            ${isWorldBoss ? 'text-amber-400 drop-shadow-[0_0_8px_rgba(245,158,11,0.5)]' : 'text-amber-600/80'}`}>
            {isWorldBoss ? 'Ancient Dragon Overlord' : 'Legendary Entity'}
          </span>
          <Crown size={14} className={isWorldBoss ? "text-amber-400" : "text-amber-600/70"} />
          
          {isWorldBoss && <Zap size={12} className="text-amber-500 animate-pulse" />}
        </div>
      )}

      {/* 👹 Header สำหรับ Elite/Epic */}
      {isElite && !isTrulyBoss && !lootResult && (
        <div className="w-full py-1 bg-red-950/40 border-b border-red-500/10 flex justify-center items-center z-50 shrink-0">
          <span className="text-[8px] font-black tracking-[0.2em] text-red-400 uppercase italic">Elite Entity Detected</span>
        </div>
      )}

      {/* 🌈 Content Area */}
      <div className={`relative flex-1 flex flex-col min-h-0 z-10 ${isShiny ? 'bg-slate-950/95 m-0.5 rounded-md' : ''}`}>
        {children}
      </div>

      {/* 🕸️ World Boss Overlay (ม่านหมอกสีดำจางๆ ที่มุมเฟรม) */}
      {isWorldBoss && (
        <div className="absolute inset-0 pointer-events-none z-10 opacity-30 bg-[radial-gradient(circle_at_center,_transparent_50%,_black_100%)]" />
      )}

      {/* กรอบมุม UI */}
      <div className={`absolute top-0 left-0 w-3 h-3 border-t border-l pointer-events-none z-20 
        ${isTrulyBoss ? 'border-amber-500/60' : isElite ? 'border-red-500/30' : 'border-white/20'}`} />
      <div className={`absolute bottom-0 right-0 w-3 h-3 border-b border-r pointer-events-none z-20
        ${isTrulyBoss ? 'border-amber-500/60' : isElite ? 'border-red-500/30' : 'border-white/20'}`} />
    </div>
  );
}