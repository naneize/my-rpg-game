import React, { useState } from 'react'; 
import { Target, Zap, Droplets, Flame, Wind, Mountain, Ghost, Skull, ShieldAlert, Activity, Cpu } from 'lucide-react';

const getElementInfo = (element) => {
  const elements = {
    FIRE: { icon: <Flame size={10} />, color: 'text-red-500', bg: 'bg-red-600', shadow: 'shadow-red-500/40' },
    WATER: { icon: <Droplets size={10} />, color: 'text-blue-400', bg: 'bg-blue-600', shadow: 'shadow-blue-500/40' },
    WIND: { icon: <Wind size={10} />, color: 'text-emerald-400', bg: 'bg-emerald-600', shadow: 'shadow-emerald-500/40' },
    EARTH: { icon: <Mountain size={10} />, color: 'text-orange-700', bg: 'bg-orange-800', shadow: 'shadow-orange-900/40' },
    LIGHT: { icon: <Zap size={10} />, color: 'text-yellow-300', bg: 'bg-yellow-500', shadow: 'shadow-yellow-300/40' },
    DARK: { icon: <Ghost size={10} />, color: 'text-purple-500', bg: 'bg-purple-800', shadow: 'shadow-purple-900/40' },
  };
  return elements[element?.toUpperCase()] || { icon: <Target size={10} />, color: 'text-slate-400', bg: 'bg-red-600' };
};

const highlightStats = (text) => {
  if (!text) return text;
  const parts = text.split(/(\d+%|\+\d+)/g); 
  return parts.map((part, i) => 
    /(\d+%|\+\d+)/.test(part) ? (
      <span key={i} className="text-rose-500 font-black">{part}</span>
    ) : part
  );
};

export default function MonsterDisplay({ 
  monster, showSkills, setShowSkills, lootResult, isBoss, isShiny, monsterHpPercent 
}) {
  const el = getElementInfo(monster.element);

  const isWorldBoss = monster.type === 'WORLD_BOSS';
  const isTrulyBoss = isBoss || monster.isBoss || monster.rarity === 'Legendary' || isWorldBoss;
  const isElite = !isTrulyBoss && (monster.isMiniBoss || monster.type === 'ELITE' || monster.rarity === 'Epic');

  const displayHpPercent = parseFloat(monsterHpPercent).toFixed(2);
  const allSkills = [...(monster.skills || []), ...(monster.bossSkills || [])];

  return (
    <div className="relative z-0 text-center flex flex-col h-[40vh] sm:h-full w-full overflow-hidden justify-between py-1 pointer-events-auto font-mono">
      
      {/* 👑 1. [ส่วนหัว] Target Identification */}
      <div className="flex flex-col items-center justify-center shrink-0 pt-3 relative">
        <div className="flex items-center gap-3 justify-center relative">
          <div className="absolute -top-1 -left-4 w-2 h-2 border-t border-l border-white/20" />
          
          <h3 className={`text-xl sm:text-3xl font-black uppercase italic tracking-tighter drop-shadow-lg transition-all duration-500
            ${isShiny ? 'text-transparent bg-clip-text bg-gradient-to-r from-red-400 via-yellow-300 to-blue-400 animate-rainbow-text' : 
              isTrulyBoss ? 'text-amber-400' : 
              isElite ? 'text-red-500' : 'text-white'}`}>
            {monster.name}
          </h3>
          
          <div className={`px-2 py-0.5 rounded-none border-2 text-[10px] font-black italic
            ${isTrulyBoss 
              ? 'bg-red-600 border-red-400 text-white shadow-[0_0_10px_rgba(220,38,38,0.5)]' 
              : 'bg-black/60 border-white/10 text-slate-300'}`}>
            LV.{monster.level || 1}
          </div>
        </div>
        
        <div className="flex items-center gap-1.5 mt-2 scale-90 sm:scale-100">
          <span className={`text-[8px] font-black px-2 py-0.5 rounded-none border uppercase italic tracking-widest
            ${isTrulyBoss 
                ? 'bg-amber-950/90 text-amber-400 border-amber-500/50' 
                : isElite 
                  ? 'bg-red-950/90 text-red-500 border-red-900/50' 
                  : 'bg-black/40 text-slate-400 border-white/5'}`}>
            {isTrulyBoss ? 'TARGET_BOSS' : isElite ? 'TARGET_ELITE' : (monster.type || 'TARGET_NORMAL')}
          </span>

          <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-none border border-white/10 bg-black/60">
            <span className={`${el.color} animate-pulse`}>{el.icon}</span>
            <span className="text-[8px] font-black uppercase text-white tracking-widest">{monster.element || 'Neutral'}</span>
          </div>
        </div>
      </div>

      {/* 👾 2. [ส่วนกลาง] Scanning Area */}
      <div 
        onClick={(e) => { 
          e.stopPropagation();
          if(setShowSkills) setShowSkills(!showSkills); 
        }} 
        className="relative flex items-center justify-center flex-1 min-h-0 cursor-pointer py-4"
      >
        {showSkills ? (
          <div className="w-full h-full max-h-[180px] flex flex-col justify-center px-4 animate-in slide-in-from-bottom-2 duration-300 text-left relative">
            <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-blue-500/50" />
            <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-blue-500/50" />
            
            <h4 className="text-blue-500 font-black text-[9px] uppercase italic tracking-[0.3em] mb-2 border-b border-white/10 pb-1.5 flex justify-between">
              <span>{isWorldBoss ? 'OVERLORD_SIGNATURE_DRIVES' : 'ENTITY_ABILITY_ANALYSIS'}</span>
              <span className="text-[7px] opacity-40 uppercase tracking-widest">{">>"} Close</span>
            </h4>
            
            <div className="space-y-2 overflow-y-auto max-h-full pr-1 custom-scrollbar">
              {allSkills.length > 0 ? allSkills.map((skill, i) => (
                <div 
                  key={i} 
                  className={`p-2.5 rounded-none border-l-2 transition-all bg-black/40 ${
                    isTrulyBoss ? 'border-amber-500 bg-amber-950/10' : 'border-white/10'
                  }`}
                >
                  <div className="flex justify-between items-center mb-1">
                    <span className={`font-black text-[10px] uppercase italic ${isTrulyBoss ? 'text-amber-400' : 'text-white'}`}>{skill.name}</span>
                    <span className="text-[7px] font-black bg-black px-2 py-0.5 text-slate-500 border border-white/5 uppercase">{skill.condition || 'ACTIVE'}</span>
                  </div>
                  <p className="text-[10px] text-slate-400 leading-relaxed italic">
                    {highlightStats(skill.description) || "Analysis: No data available."}
                  </p>
                </div>
              )) : (
                <div className="text-center py-4 opacity-20 text-[9px] font-black tracking-[0.4em]">NO_ABILITIES_DETECTED</div>
              )}
            </div>
          </div>
        ) : (
          <div className={`relative flex items-center justify-center h-full w-full transition-all duration-500 ${isTrulyBoss || isElite ? 'scale-125' : 'scale-110'}`}>
            <div className="absolute inset-0 bg-[radial-gradient(square_at_center,_rgba(59,130,246,0.05)_0%,_transparent_70%)] pointer-events-none" />
            
            <div className={`absolute w-56 h-56 rounded-none blur-[70px] transition-all duration-1000 opacity-20
              ${isTrulyBoss ? 'bg-amber-500' : isElite ? 'bg-red-600' : `bg-blue-400`}`} 
            />
            
            {monster.image ? (
              <img 
                src={monster.image} 
                alt="" 
                className="max-h-[90%] w-auto object-contain z-10 drop-shadow-[0_20px_30px_rgba(0,0,0,0.8)] animate-bounce-slow" 
              />
            ) : (
              <span className="relative z-10 text-7xl sm:text-9xl drop-shadow-2xl animate-bounce-slow">{monster.emoji || "👾"}</span>
            )}
            
            <div className="absolute inset-0 flex items-center justify-center opacity-10 pointer-events-none">
              <div className="w-64 h-64 border border-white/10 rounded-none rotate-45" />
              <div className="absolute w-48 h-48 border border-white/5 rounded-none -rotate-12" />
            </div>
          </div>
        )}
      </div>

      {/* 📊 3. [ส่วนท้าย] Vitality Gauge */}
      <div className="shrink-0 space-y-2 px-6 pb-2 relative z-20">
        <div className="flex justify-between items-end mb-1">
            <div className="flex gap-4">
              <div className="flex flex-col items-start">
                <span className="text-[7px] font-black text-slate-500 uppercase tracking-widest leading-none mb-1">ATK_PWR</span>
                <span className="text-[10px] font-black italic text-orange-500">{monster.atk}</span>
              </div>
              <div className="flex flex-col items-start">
                <span className="text-[7px] font-black text-slate-500 uppercase tracking-widest leading-none mb-1">DEF_ARM</span>
                <span className="text-[10px] font-black text-blue-400 italic">{monster.def || 0}</span>
              </div>
            </div>
            <div className="text-right">
              <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest block leading-none mb-1 italic">Vitality_Integrity</span>
              <span className="text-xs font-black text-white italic tracking-tighter">
                {Math.ceil(monster.hp).toLocaleString()} <span className="text-[8px] opacity-40 text-slate-500">/ {monster.maxHp.toLocaleString()}</span>
              </span>
            </div>
        </div>

        <div className="w-full h-3 bg-black/80 rounded-none overflow-hidden border border-white/10 relative p-[2px]">
          <div 
            className={`h-full hp-bar-transition relative z-10 rounded-none shadow-[0_0_10px_rgba(255,255,255,0.1)] ${
              isTrulyBoss ? 'bg-gradient-to-r from-amber-400 via-amber-600 to-amber-500' :
              isElite ? 'bg-gradient-to-r from-red-600 via-red-800 to-red-600' : el.bg}`} 
            style={{ width: `${displayHpPercent}%` }} 
          />
          <div className="absolute inset-0 z-20 flex justify-between pointer-events-none opacity-20">
             {[...Array(10)].map((_, i) => <div key={i} className="w-px h-full bg-black/40" />)}
          </div>
        </div>

        {!lootResult && (
          <div className="flex justify-center pt-2">
            <button 
              onClick={(e) => { 
                e.stopPropagation(); 
                if(setShowSkills) setShowSkills(!showSkills); 
              }} 
              className="flex flex-row items-center gap-2 px-6 py-2 rounded-none border border-white/10 bg-black/60 hover:bg-white/5 active:scale-95 transition-all pointer-events-auto"
            >
              <Cpu size={12} className="text-blue-500 animate-pulse" />
              <span className="text-[9px] font-black uppercase italic tracking-[0.4em] text-white">
                {showSkills ? "MINIMIZE_DATA" : "ENTITY_DRIVES"}
              </span>
            </button>
          </div>
        )}
      </div>

      <style jsx>{`
        .hp-bar-transition { transition: width 0.8s cubic-bezier(0.16, 1, 0.3, 1); }
        .animate-bounce-slow { animation: bounce-slow 4s ease-in-out infinite; }
        @keyframes bounce-slow { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-8px); } }
        .custom-scrollbar::-webkit-scrollbar { width: 3px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); }
      `}</style>
    </div>
  );
}