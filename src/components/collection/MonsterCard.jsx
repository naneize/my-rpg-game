import React from 'react';
import { Sparkles, Skull, Zap } from 'lucide-react';

// ✅ เพิ่ม prop forceShowColor เพื่อใช้บังคับให้แสดงสี (เช่น ในหน้าต่อสู้)
export default function MonsterCard({ monster, stats, style, onClick, forceShowColor = false }) {
  // ✅ เช็คว่าเป็น Mini-Boss หรือ Boss หรือไม่
  const isElite = monster.type === "BOSS" || monster.isBoss || monster.isMiniBoss || monster.rarity === "Legendary";
  
  // ✅ [คงเดิม] เช็คค่า isDiscovered ที่เราส่งมาใน stats
  const isFound = forceShowColor || (stats?.isDiscovered || false);
  
  // ✅ [คงเดิม] เช็คว่าเคยสยบเวอร์ชัน Shiny มาหรือยัง
  const isShiny = stats?.hasShiny || false;

  // 📊 [NEW] Mastery Calculation
  const currentKills = stats?.count || 0;
  const masteryTarget = 100;
  const isMastered = currentKills >= masteryTarget;
  const progress = Math.min((currentKills / masteryTarget) * 100, 100);

  // 🛡️ กำหนดสไตล์กรอบสำหรับ Mini-Boss / Boss
  const eliteFrameStyle = "border-slate-500 bg-slate-900 shadow-[0_0_15px_rgba(0,0,0,0.8)] border-double border-4";

  return (
    <div 
      onClick={onClick}
      className={`relative flex flex-col items-center p-[2px] rounded-2xl cursor-pointer transition-all duration-500 active:scale-95 overflow-hidden
        ${isFound 
          ? `${isShiny 
              ? 'animate-rainbow-border shadow-[0_0_20px_rgba(255,255,255,0.3)]' 
              : isElite 
                ? `${eliteFrameStyle}` 
                : `${style.border} border-2 bg-slate-900/60 shadow-lg`}` 
          : 'border-2 border-slate-800 bg-slate-950/40 '}`}
    >
      
      {/* 🌈 Inner Container */}
      <div className={`w-full h-full flex flex-col items-center p-3 rounded-[14px] relative z-10 
        ${isShiny ? 'bg-slate-900/95 backdrop-blur-sm' : ''}
        ${isElite && !isShiny ? 'bg-gradient-to-b from-slate-800 to-slate-950' : ''}`}>
        
        {/* 💀 Boss Badge (แสดงเฉพาะบอส/มินิบอส) */}
        {isFound && isElite && !isShiny && (
          <div className="absolute top-0 inset-x-0 flex justify-center -translate-y-1">
             <div className="bg-slate-700 border border-slate-500 px-2 py-0.5 rounded-b-md shadow-md">
                <Skull size={8} className="text-red-500" />
             </div>
          </div>
        )}

        {/* ✨ Shiny Effect */}
        {isFound && isShiny && (
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white/10 via-transparent to-transparent animate-pulse" />
        )}

        {/* 🖼️ Monster Image Area */}
        <div className={`h-16 flex items-center justify-center mb-2 relative z-10 
          ${isShiny ? 'drop-shadow-[0_0_8px_rgba(255,255,255,0.6)]' : ''}
          ${isElite ? 'scale-110 drop-shadow-[0_10px_10px_rgba(0,0,0,0.5)]' : ''}`}>
          
          {!isFound ? (
            <span className="text-4xl opacity-20 contrast-0">❓</span>
          ) : (monster.image && typeof monster.image === 'string' && monster.image.startsWith('/')) ? (
            <img 
            src={monster.image}
             className={`h-full object-contain transition-transform ${isShiny ? 'scale-110' : ''} ${isElite ? 'brightness-110' : ''}`} 
            alt={monster.name} />
          ) : (
            <span className={`text-4xl ${isShiny ? 'animate-bounce' : ''}`}>
                {monster.image || monster.icon || monster.emoji || "👾"}
            </span>
          )}
          
          {isShiny && isFound && (
            <div className="absolute -top-1 -right-1 text-white animate-pulse">
              <Sparkles size={12} fill="currentColor" />
            </div>
          )}
        </div>

        {/* 📊 Status Area */}
        <div className="w-full flex flex-col items-center gap-1 relative z-10">
          
          {/* ✅ DEFEAT Status */}
          <div className={`h-5 flex items-center px-2 rounded-full border ${isShiny ? 'bg-white/10 border-white/20' : isElite ? 'bg-red-950/40 border-red-500/20' : 'bg-black/40 border-white/5'}`}>
            <span className={`text-[7px] font-black uppercase tracking-tighter ${isShiny ? 'text-white' : 'text-slate-400'}`}>
              {isElite ? '🔥 VANQUISHED:' : 'DEFEAT:'} <span className={`${isShiny ? 'text-yellow-400' : 'text-white'} ml-0.5`}>{currentKills}</span>
            </span>
          </div>

          <div className="h-3 flex items-center">
            <span className={`text-[6px] font-black uppercase tracking-widest 
              ${isShiny && isFound 
                ? 'text-transparent bg-clip-text bg-gradient-to-r from-red-400 via-yellow-300 to-blue-400 font-extrabold' 
                : isElite ? 'text-red-500 animate-pulse' : style.text}`}>
              {!isFound ? '???' : (isShiny ? 'SHINY SPECIAL' : isElite ? 'ELITE BOSS' : monster.rarity)}
            </span>
          </div>

          <h4 className={`w-full text-center text-[9px] font-black truncate leading-tight mt-1 ${isShiny ? 'text-white italic' : isElite ? 'text-red-100 uppercase tracking-tighter' : 'text-white'}`}>
            {!isFound ? '?????????' : monster.name}
          </h4>


{/* ⚡ Mastery Progress Bar (ฉบับอ่านง่าย 100%) */}
{isFound && (
  <div className="w-full mt-2 px-1">
    <div className="relative w-full h-3 bg-black/60 rounded-full overflow-hidden border border-white/10 shadow-inner">
      
      {/* 🟦 ตัวหลอด Progress */}
      <div 
        className={`h-full transition-all duration-700 ease-out rounded-full
          ${isMastered 
            ? 'bg-gradient-to-r from-amber-600 to-yellow-400' 
            : 'bg-gradient-to-r from-cyan-600 to-blue-500'}`}
        style={{ width: `${progress}%` }}
      />

      {/* 🔢 ตัวเลข % - ใช้เงาตัดขอบเพื่อให้เห็นชัดทุกสภาวะ */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <span className="text-[7px] font-black tracking-tighter text-white uppercase"
          style={{
            // 🖋️ ใช้ Text Shadow 4 ทิศทางเพื่อให้ตัวอักษรมีขอบสีดำชัดเจน
            textShadow: '1px 1px 0px #000, -1px -1px 0px #000, 1px -1px 0px #000, -1px 1px 0px #000'
          }}>
          {isMastered ? 'MAX' : `${Math.floor(progress)}%`}
        </span>
      </div>

    </div>
  </div>
)}
        </div>
      </div>

      {/* 🔒 Overlay สำหรับ Unknown */}
      {!isFound && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-2xl z-20 backdrop-blur-[1px]">
          <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest">Locked</span>
        </div>
      )}
    </div>
  );
}