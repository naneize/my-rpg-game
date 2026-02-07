import React, { useState } from 'react'; 
import { Target, Zap, Droplets, Flame, Wind, Mountain, Ghost, Skull, ShieldAlert } from 'lucide-react';

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

export default function MonsterDisplay({ 
  monster, showSkills, setShowSkills, lootResult, isBoss, isShiny, monsterHpPercent 
}) {
  const [activeSkillTooltip, setActiveSkillTooltip] = useState(null);
  const el = getElementInfo(monster.element);

  // 🛡️ [แก้ไขจุดนี้] แยกสถานะให้เด็ดขาด
  const isWorldBoss = monster.type === 'WORLD_BOSS';
  const isTrulyBoss = isBoss || monster.isBoss || monster.rarity === 'Legendary' || isWorldBoss;
  const isElite = !isTrulyBoss && (monster.isMiniBoss || monster.type === 'ELITE' || monster.rarity === 'Epic');

  const displayHpPercent = parseFloat(monsterHpPercent).toFixed(2);

  // ✅ [เพิ่มใหม่] รวมสกิลจากทุกแหล่ง (skills และ bossSkills)
  const allSkills = [...(monster.skills || []), ...(monster.bossSkills || [])];

  return (
    /* ✅ ปรับ z-index เป็น z-0 เพื่อไม่ให้ทับ Overlays ของระบบแชท */
    <div className="relative z-0 text-center flex flex-col h-full w-full overflow-hidden justify-between py-2 pointer-events-auto">
      
      {/* 👑 1. [ส่วนหัว] ชื่อและแท็ก */}
      <div className="flex flex-col items-center justify-center shrink-0 pt-1 sm:pt-3">
        <h3 className={`text-2xl sm:text-3xl font-black uppercase italic tracking-tighter drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] transition-all duration-500
          ${isShiny ? 'text-transparent bg-clip-text bg-gradient-to-r from-red-400 via-yellow-300 via-green-400 via-blue-400 to-purple-500 animate-rainbow-text' : 
            isTrulyBoss ? 'text-amber-300 drop-shadow-[0_0_15px_rgba(251,191,36,0.6)]' : 
            isElite ? 'text-red-100' : 'text-white'}`}>
          {monster.name}
        </h3>
        
        <div className="flex items-center gap-1.5 mt-0.5 scale-95 sm:scale-110">
          <span className={`text-[8px] font-black px-2 py-0.5 rounded-md border uppercase italic
            ${isTrulyBoss 
                ? 'bg-amber-950/90 text-amber-400 border-amber-500/50 shadow-[0_0_8px_rgba(251,191,36,0.4)]' 
                : isElite 
                  ? 'bg-red-950/90 text-red-400 border-red-500/50 animate-pulse' 
                  : 'bg-slate-800/95 text-slate-200 border-white/10'}`}>
            {isTrulyBoss ? <span className="flex items-center gap-1">👑 {isWorldBoss ? 'WORLD BOSS' : 'BOSS'}</span> : 
             isElite ? <span className="flex items-center gap-1"><Skull size={8}/> ELITE</span> : 
             (monster.type || 'Normal')}
          </span>

          <div className={`flex items-center gap-1 px-2 py-0.5 rounded-md border border-white/20 bg-black/40 shadow-sm`}>
            <span className={`${el.color} drop-shadow-[0_0_2px_rgba(0,0,0,1)]`}>{el.icon}</span>
            <span className="text-[8px] font-black uppercase tracking-tighter text-white">{monster.element || 'Neutral'}</span>
          </div>
          <span className="text-[9px] font-mono text-white bg-black/60 px-1.5 py-0.5 rounded-md border border-slate-700">
            Lv.{monster.level}
          </span>
        </div>
      </div>

      {/* 👾 2. [ส่วนกลาง] มอนสเตอร์แอเรีย */}
      <div 
        onClick={(e) => { 
          e.stopPropagation(); // ✅ ป้องกัน Event ไหลไปโดนปุ่มอื่น
          setShowSkills(!showSkills); 
          setActiveSkillTooltip(null); 
        }} 
        className="relative flex items-center justify-center flex-1 min-h-0 cursor-pointer py-1"
      >
        {showSkills ? (
          <div className="w-full h-full max-h-[160px] flex flex-col justify-center px-4 animate-in fade-in zoom-in duration-300 text-left">
            <h4 className="text-white font-black text-[9px] uppercase italic tracking-widest mb-1 border-b border-white/20 pb-0.5 flex justify-between">
              <span>{isWorldBoss ? 'OVERLORD ABILITIES' : 'Monster Skills'}</span>
              <span className="text-[8px] opacity-70 underline uppercase">Close</span>
            </h4>
            <div className="space-y-1.5 overflow-y-auto max-h-full pr-1 custom-scrollbar">
              {allSkills.length > 0 ? allSkills.map((skill, i) => (
                <div 
                  key={i} 
                  onClick={(e) => { 
                    e.stopPropagation(); 
                    setActiveSkillTooltip(activeSkillTooltip === i ? null : i); 
                  }}
                  className={`p-2 rounded-xl border-2 transition-all ${
                    isWorldBoss ? 'bg-amber-950/40 border-amber-500/40 shadow-[inset_0_0_10px_rgba(245,158,11,0.1)]' :
                    skill.condition?.includes("Passive") ? 'bg-blue-600/20 border-blue-400/30' : 
                    skill.condition?.includes("Special") ? 'bg-red-600/20 border-red-400/40 animate-pulse' : 
                    'bg-orange-600/20 border-orange-400/30'
                  }`}
                >
                  <div className="flex justify-between items-center mb-0.5">
                    <span className={`font-bold text-[10px] italic uppercase drop-shadow-sm ${isWorldBoss ? 'text-amber-400' : 'text-white'}`}>
                      {skill.name}
                    </span>
                    <span className={`text-[7px] font-mono font-bold px-1.5 rounded border uppercase
                      ${isWorldBoss ? 'bg-amber-500 text-black border-amber-400' : 'bg-black/60 text-white border-white/10'}`}>
                      {skill.isUltimate ? 'ULTIMATE' : (skill.condition || 'Active')}
                    </span>
                  </div>
                  <p className={`text-[9px] leading-tight italic transition-all duration-300 ${activeSkillTooltip === i ? 'max-h-24 opacity-100 mt-1' : 'max-h-0 opacity-0'} overflow-hidden
                    ${isWorldBoss ? 'text-amber-100/70' : 'text-slate-200'}`}>
                    "{skill.description || skill.message || 'No description available.'}"
                  </p>
                </div>
              )) : (
                <div className="text-center py-4 opacity-40 text-[9px] italic">No identified skills...</div>
              )}
            </div>
          </div>
        ) : (
          <div className={`relative flex items-center justify-center h-full max-h-[190px] transition-all duration-500 ${isTrulyBoss || isElite ? 'scale-110' : 'scale-90'} animate-bounce-slow`}>
            <div className={`absolute inset-0 rounded-full blur-[50px] transition-all duration-1000 ${isTrulyBoss ? 'bg-amber-500/30 opacity-40 scale-125' : isElite ? 'bg-red-600/30 opacity-40 scale-125' : `opacity-20 ${el.bg.replace('600', '600/15')}`}`} />
            
            {(isTrulyBoss || isElite) && (
              <div className={`absolute inset-0 ${isTrulyBoss ? 'bg-amber-500/10' : 'bg-red-500/10'} blur-[30px] animate-elite-glow rounded-full z-0`} />
            )}

            <div className={`absolute -top-1 -right-1 opacity-20 scale-[2.5] ${el.color} pointer-events-none`}>{el.icon}</div>
            {monster.image ? (
              <img 
                src={monster.image} 
                alt="" 
                className={`max-h-full w-auto object-contain z-10 transition-all
                  ${isTrulyBoss ? 'drop-shadow-[0_0_20px_rgba(251,191,36,0.8)] brightness-110' : 
                    isElite ? 'drop-shadow-[0_0_15px_rgba(220,38,38,0.8)] brightness-110 contrast-110' : 
                    'drop-shadow-[0_10px_20px_rgba(0,0,0,0.7)]'}`} 
              />
            ) : (
              <span className="relative z-10 text-7xl sm:text-9xl">{monster.emoji || "👾"}</span>
            )}
            <div className="absolute -bottom-2 w-24 h-4 bg-black/40 blur-xl rounded-[100%]" />
          </div>
        )}
      </div>

      {/* 📊 3. [ส่วนท้าย] HP Bar & Stats */}
      <div className="shrink-0 space-y-1 px-5 pb-1">
        <div className="flex justify-between items-end mb-0.5">
            <div className="flex gap-2 scale-95 origin-left">
              <span className={`text-[10px] font-black italic drop-shadow-md ${isTrulyBoss ? 'text-amber-400' : isElite ? 'text-red-500' : 'text-orange-400'}`}>ATK {monster.atk}</span>
              <span className="text-[10px] font-black text-blue-300 italic drop-shadow-md">DEF {monster.def || 0}</span>
            </div>
            <span className={`text-[11px] font-black italic tracking-tighter drop-shadow-lg ${isTrulyBoss ? 'text-amber-100' : isElite ? 'text-red-100' : 'text-white'}`}>
              HP {Math.ceil(monster.hp)} / {monster.maxHp}
            </span>
        </div>

        <div className="w-full h-2.5 bg-black/70 rounded-full overflow-hidden border border-white/10 relative shadow-inner">
          <div 
            className="absolute top-0 left-0 h-full bg-white/15 hp-bar-ghost" 
            style={{ width: `${displayHpPercent}%` }} 
          />

          <div 
            className={`h-full hp-bar-transition relative z-10 ${
              isShiny ? 'bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400' : 
              isTrulyBoss ? 'bg-gradient-to-r from-amber-400 to-amber-700 shadow-[0_0_10px_rgba(251,191,36,0.8)]' :
              isElite ? 'bg-gradient-to-r from-red-600 to-red-900 shadow-[0_0_10px_rgba(220,38,38,0.8)]' : 
              el.bg}`} 
            style={{ width: `${displayHpPercent}%` }} 
          />
          
          <div className="absolute top-0 left-0 w-full h-[30%] bg-white/10 z-20" />
        </div>

        {!lootResult && (
          <div className="flex justify-center pt-0.5">
            <button 
              onClick={(e) => { 
                e.stopPropagation(); 
                setShowSkills(!showSkills); 
                setActiveSkillTooltip(null); 
              }} 
              className={`flex flex-row items-center gap-1.5 px-4 py-1 rounded-xl border-2 transition-all active:scale-90 pointer-events-auto ${
                showSkills ? 'bg-orange-600 border-orange-400 shadow-[0_0_15px_rgba(234,88,12,0.4)]' : 
                isWorldBoss ? 'bg-amber-900/80 border-amber-400 shadow-[0_0_10px_rgba(245,158,11,0.3)]' :
                isTrulyBoss ? 'bg-amber-950/80 border-amber-500/50' :
                isElite ? 'bg-red-950/80 border-red-500/50' : 
                'bg-slate-900/90 border-white/10'}`}
            >
              <Target size={12} className={showSkills ? "text-white" : isTrulyBoss ? "text-amber-500" : "text-orange-500"} />
              <span className="text-[9px] font-black uppercase italic tracking-widest text-white">
                {showSkills ? "CLOSE" : isWorldBoss ? "OVERLORD ART" : isTrulyBoss ? "BOSS SKILLS" : isElite ? "ELITE SKILLS" : "SKILL DETAIL"}
              </span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}