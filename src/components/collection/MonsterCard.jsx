import React from 'react';
import { Sparkles, Skull, Zap, Activity } from 'lucide-react';

export default function MonsterCard({ monster, stats, style, onClick, forceShowColor = false }) {
  // ✅ เช็คว่าเป็น Mini-Boss หรือ Boss หรือไม่
  const isElite = monster.type === "BOSS" || monster.isBoss || monster.isMiniBoss || monster.rarity === "Legendary";
  
  // ✅ เช็คค่า isDiscovered
  const isFound = forceShowColor || (stats?.isDiscovered || false);
  
  // ✅ เช็คว่าเคยสยบเวอร์ชัน Shiny มาหรือยัง
  const isShiny = stats?.hasShiny || false;

  // 📊 Mastery Calculation
  const currentKills = stats?.count || 0;
  const masteryTarget = 100;
  const isMastered = currentKills >= masteryTarget;
  const progress = Math.min((currentKills / masteryTarget) * 100, 100);

  // 🛡️ กำหนดสไตล์กรอบสำหรับ Mini-Boss / Boss (Hard-Edge)
  const eliteFrameStyle = "border-red-600 bg-slate-900 shadow-[inset_0_0_10px_rgba(220,38,38,0.2)] border-2";

  return (
    <div 
      onClick={onClick}
      className={`relative flex flex-col items-center p-[1px] rounded-none cursor-pointer transition-all duration-300 active:scale-95 overflow-hidden font-mono
        ${isFound 
          ? `${isShiny 
              ? 'animate-rainbow-border shadow-[0_0_15px_rgba(255,255,255,0.2)] border-2' 
              : isElite 
                ? `${eliteFrameStyle}` 
                : `${style.border} border-2 bg-slate-900/60`}` 
          : 'border-2 border-slate-800 bg-slate-950/40'}`}
    >
      
      {/* 🧩 Corner Decoration for Found Monsters */}
      {isFound && !isShiny && (
        <div className={`absolute top-0 right-0 w-2 h-2 border-t border-r ${isElite ? 'border-red-500' : 'border-white/20'}`} />
      )}

      {/* 🌈 Inner Container */}
      <div className={`w-full h-full flex flex-col items-center p-3 rounded-none relative z-10 
        ${isShiny ? 'bg-slate-950/90' : ''}
        ${isElite && !isShiny ? 'bg-gradient-to-b from-slate-900 to-black' : ''}`}>
        
        {/* 💀 Boss Badge */}
        {isFound && isElite && !isShiny && (
          <div className="absolute top-0 inset-x-0 flex justify-center -translate-y-px">
              <div className="bg-red-600 px-2 py-0.5 border-x border-b border-red-400">
                 <Skull size={8} className="text-white animate-pulse" />
              </div>
          </div>
        )}

        {/* 🏅 Level Badge */}
        {isFound && (
          <div className="absolute top-2 left-2 z-20 flex items-center justify-center">
            <div className={`flex items-center gap-1 px-1.5 py-0.5 rounded-none border text-[7px] font-black italic
              ${isElite 
                ? 'bg-red-600 border-red-400 text-white shadow-[0_0_8px_rgba(220,38,38,0.5)]' 
                : 'bg-black/60 border-white/10 text-slate-300'}`}>
              <Zap size={6} fill="currentColor" />
              LV.{monster.recommendedLevel || monster.level || 1}
            </div>
          </div>
        )}

        {/* ✨ Shiny Effect Background */}
        {isFound && isShiny && (
          <div className="absolute inset-0 bg-[radial-gradient(square_at_center,_rgba(255,255,255,0.05),_transparent)] animate-pulse" />
        )}

        {/* 🖼️ Monster Image Area */}
        <div className={`h-16 flex items-center justify-center mb-3 relative z-10 
          ${isShiny ? 'drop-shadow-[0_0_10px_rgba(255,255,255,0.5)]' : ''}
          ${isElite ? 'scale-110' : ''}`}>
          
          {!isFound ? (
            <span className="text-4xl opacity-10 blur-[1px]">❓</span>
          ) : (monster.image && typeof monster.image === 'string' && monster.image.startsWith('/')) ? (
            <img 
              src={monster.image}
              className={`h-full object-contain transition-all duration-500 ${isShiny ? 'scale-110' : ''} ${isElite ? 'brightness-110' : ''}`} 
              alt={monster.name} 
            />
          ) : (
            <span className={`text-4xl ${isShiny ? 'animate-bounce' : ''}`}>
                {monster.image || monster.icon || monster.emoji || "👾"}
            </span>
          )}
          
          {isShiny && isFound && (
            <div className="absolute -top-2 -right-2 text-white animate-pulse">
              <Sparkles size={14} fill="currentColor" className="drop-shadow-[0_0_5px_white]" />
            </div>
          )}
        </div>

        {/* 📊 Status Area */}
        <div className="w-full flex flex-col items-center gap-1.5 relative z-10">
          
          {/* ✅ DEFEAT Status (Hard-Edge) */}
          <div className={`h-4 flex items-center px-2 rounded-none border ${isShiny ? 'bg-white/5 border-white/20' : isElite ? 'bg-red-950/60 border-red-600/30' : 'bg-black/60 border-white/5'}`}>
            <span className={`text-[7px] font-black uppercase tracking-widest ${isShiny ? 'text-amber-400' : 'text-slate-500'}`}>
              {isElite ? 'Target_Neutralized:' : 'Defeat:'} <span className="text-white ml-1">{currentKills}</span>
            </span>
          </div>

          <div className="h-2 flex items-center">
            <span className={`text-[6px] font-black uppercase tracking-[0.2em] 
              ${isShiny && isFound 
                ? 'text-transparent bg-clip-text bg-gradient-to-r from-red-400 via-yellow-300 to-blue-400' 
                : isElite ? 'text-red-500' : style.text}`}>
              {!isFound ? 'Unknown_Entity' : (isShiny ? 'SHINY_VARIANT' : isElite ? 'ELITE_COMMANDER' : monster.rarity)}
            </span>
          </div>

          <h4 className={`w-full text-center text-[10px] font-black truncate leading-tight mt-1 px-1 italic ${isShiny ? 'text-white' : isElite ? 'text-red-100 uppercase' : 'text-slate-200'}`}>
            {!isFound ? '-----------' : monster.name}
          </h4>

          {/* ⚡ Mastery Progress Bar (Hard-Edge Version) */}
          {isFound && (
            <div className="w-full mt-2">
              <div className="relative w-full h-3 bg-black/80 rounded-none overflow-hidden border border-white/5">
                
                {/* 🟦 Progress Fill */}
                <div 
                  className={`h-full transition-all duration-1000 ease-out
                    ${isMastered 
                      ? 'bg-gradient-to-r from-amber-600 to-yellow-400 shadow-[0_0_10px_rgba(245,158,11,0.5)]' 
                      : 'bg-gradient-to-r from-blue-700 to-cyan-500'}`}
                  style={{ width: `${progress}%` }}
                />

                {/* 🔢 Percent Text */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <span className="text-[7px] font-black tracking-widest text-white italic"
                    style={{ textShadow: '1px 1px 1px #000' }}>
                    {isMastered ? 'MASTERED' : `${Math.floor(progress)}%`}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 🔒 Overlay for Locked */}
      {!isFound && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/60 rounded-none z-20 backdrop-blur-[2px]">
          <div className="flex flex-col items-center gap-1 opacity-40">
             <Activity size={12} className="text-slate-500" />
             <span className="text-[8px] font-black text-slate-500 uppercase tracking-[0.3em]">NO_DATA</span>
          </div>
        </div>
      )}
    </div>
  );
}