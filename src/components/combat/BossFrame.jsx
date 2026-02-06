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

  // 🛡️ [แก้ไขจุดนี้] แยกประเภทให้ชัดเจน เพื่อไม่ให้ระดับ Epic กลายเป็นสีทอง
  // Truly Boss จะใช้เฉพาะระดับสูงสุด (Legendary หรือ World Boss)
  const isTrulyBoss = isWorldBoss || monster?.rarity === 'Legendary';
  
  // Elite / MiniBoss คือระดับ Epic หรือระดับที่รองลงมาแต่ไม่ใช่บอสใหญ่
  const isElite = isBoss || monster?.isMiniBoss || monster?.rarity === 'Epic';

  // กำหนดสไตล์ของกรอบตามระดับ
  const frameStyles = isWorldBoss 
    ? 'border-2 border-amber-600/60 shadow-[0_0_80px_rgba(245,158,11,0.15)]' 
    : isShiny 
      ? 'animate-rainbow-border p-[2px]' 
      : isTrulyBoss
        ? 'border-2 border-amber-500/50 shadow-[0_0_40px_rgba(245,158,11,0.1),inset_0_0_20px_rgba(245,158,11,0.05)]' // กรอบสีทองสำหรับ Boss
        : isElite
          ? 'border-2 border-red-600/40 shadow-[0_0_30px_rgba(220,38,38,0.1)]' // ✅ กรอบสีแดงสำหรับมินิบอส Epic
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

      {/* ✨ Spotlight */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-white/5 blur-[120px] rounded-full pointer-events-none" style={{ zIndex: 1 }} />
      
      {/* 👑 Header (แสดงมงกุฎทองเฉพาะบอสใหญ่จริงๆ) */}
      {isTrulyBoss && !lootResult && (
        <div className={`w-full py-2 bg-slate-950/90 border-b flex justify-center items-center gap-2 z-50 shrink-0
          ${isWorldBoss ? 'border-amber-500/30' : 'border-amber-600/20'}`}>
          <Crown size={14} className={isWorldBoss ? "text-amber-500" : "text-amber-600/70"} />
          <span className={`text-[10px] font-black tracking-[0.3em] uppercase italic
            ${isWorldBoss ? 'text-amber-500' : 'text-amber-600/80'}`}>
            {isWorldBoss ? 'World Boss Encounter' : 'Legendary Entity'}
          </span>
          <Crown size={14} className={isWorldBoss ? "text-amber-500" : "text-amber-600/70"} />
        </div>
      )}

      {/* 👹 Header สำหรับ Elite/Epic (แสดงแถบสีแดงบางๆ เพื่อความดุดัน) */}
      {isElite && !isTrulyBoss && !lootResult && (
        <div className="w-full py-1 bg-red-950/40 border-b border-red-500/10 flex justify-center items-center z-50 shrink-0">
          <span className="text-[8px] font-black tracking-[0.2em] text-red-400 uppercase italic">Elite Entity Detected</span>
        </div>
      )}

      {/* 🌈 Content Area */}
      <div className={`relative flex-1 flex flex-col min-h-0 z-10 ${isShiny ? 'bg-slate-950/95 m-0.5 rounded-md' : ''}`}>
        {children}
      </div>

      {/* กรอบมุม UI */}
      <div className={`absolute top-0 left-0 w-3 h-3 border-t border-l pointer-events-none z-20 
        ${isTrulyBoss ? 'border-amber-500/40' : isElite ? 'border-red-500/30' : 'border-white/20'}`} />
      <div className={`absolute bottom-0 right-0 w-3 h-3 border-b border-r pointer-events-none z-20
        ${isTrulyBoss ? 'border-amber-500/40' : isElite ? 'border-red-500/30' : 'border-white/20'}`} />
    </div>
  );
}