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

const highlightStats = (text) => {
  if (!text) return text;
  // ค้นหาตัวเลขที่มี % หรือ + (เช่น 150%, +10, 25%)
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
  const [activeSkillTooltip, setActiveSkillTooltip] = useState(null);
  const el = getElementInfo(monster.element);

  const isWorldBoss = monster.type === 'WORLD_BOSS';
  const isTrulyBoss = isBoss || monster.isBoss || monster.rarity === 'Legendary' || isWorldBoss;
  const isElite = !isTrulyBoss && (monster.isMiniBoss || monster.type === 'ELITE' || monster.rarity === 'Epic');

  const displayHpPercent = parseFloat(monsterHpPercent).toFixed(2);
  const allSkills = [...(monster.skills || []), ...(monster.bossSkills || [])];

  return (
    <div className="relative z-0 text-center flex flex-col h-[40vh] sm:h-full w-full overflow-hidden justify-between py-1 pointer-events-auto">
      
      {/* 👑 1. [ส่วนหัว] ชื่อและแท็ก */}
      <div className="flex flex-col items-center justify-center shrink-0 pt-2">
        <h3 className={`text-xl sm:text-3xl font-black uppercase italic tracking-tighter drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)] transition-all duration-500
          ${isShiny ? 'text-transparent bg-clip-text bg-gradient-to-r from-red-400 via-yellow-300 via-green-400 via-blue-400 to-purple-500 animate-rainbow-text' : 
            isTrulyBoss ? 'text-amber-300 drop-shadow-[0_0_15px_rgba(251,191,36,0.6)]' : 
            isElite ? 'text-red-100' : 'text-white'}`}>
          {monster.name}
        </h3>
        
        <div className="flex items-center gap-1 mt-0.5 scale-90 sm:scale-100">
          <span className={`text-[7px] font-black px-1.5 py-0.5 rounded border uppercase italic
            ${isTrulyBoss 
                ? 'bg-amber-950/90 text-amber-400 border-amber-500/50' 
                : isElite 
                  ? 'bg-red-950/90 text-red-400 border-red-500/50' 
                  : 'bg-slate-800/95 text-slate-200 border-white/10'}`}>
            {isTrulyBoss ? 'BOSS' : isElite ? 'ELITE' : (monster.type || 'Normal')}
          </span>

          <div className="flex items-center gap-1 px-1.5 py-0.5 rounded border border-white/10 bg-black/40">
            <span className={`${el.color}`}>{el.icon}</span>
            <span className="text-[7px] font-black uppercase text-white">{monster.element || 'Neutral'}</span>
          </div>
        </div>
      </div>

      {/* 👾 2. [ส่วนกลาง] มอนสเตอร์แอเรีย - ปรับ Scale ให้พอดีไม่ดัน UI */}
      <div 
        onClick={(e) => { 
          e.stopPropagation();
          if(setShowSkills) setShowSkills(!showSkills); 
          setActiveSkillTooltip(null); 
        }} 
        className="relative flex items-center justify-center flex-1 min-h-0 cursor-pointer py-2"
      >
        {showSkills ? (
  <div className="w-full h-full max-h-[160px] flex flex-col justify-center px-4 animate-in fade-in zoom-in duration-300 text-left">
    <h4 className="text-white font-black text-[9px] uppercase italic tracking-widest mb-1 border-b border-white/20 pb-1 flex justify-between">
      <span>{isWorldBoss ? 'OVERLORD ABILITIES' : 'Monster Skills'}</span>
      <span className="text-[8px] opacity-70 underline">Close</span>
    </h4>
    <div className="space-y-2 overflow-y-auto max-h-full pr-1 custom-scrollbar"> {/* ปรับ space-y-2 ให้อ่านง่ายขึ้น */}
      {allSkills.length > 0 ? allSkills.map((skill, i) => (
        <div 
          key={i} 
          className={`p-2 rounded-lg border transition-all ${
            isWorldBoss ? 'bg-amber-950/40 border-amber-500/40' : 'bg-slate-800/40 border-white/10'
          }`}
        >
          <div className="flex justify-between items-center mb-1">
            <span className="font-bold text-[9px] text-white uppercase">{skill.name}</span>
            <span className="text-[6px] bg-black/50 px-1 rounded text-slate-400">{skill.condition || 'Active'}</span>
          </div>

          {/* 🟢 ส่วนที่เพิ่ม: แสดงรายละเอียดสกิล */}
          <p className="text-[8px] text-slate-400 leading-tight italic">
            {highlightStats(skill.description) || "No description available."}
          </p>
        </div>
      )) : (
        <div className="text-center py-2 opacity-40 text-[8px]">No identified skills...</div>
      )}
    </div>
  </div>
) : (



          /* 🆕 [จุดแก้ไขหลัก] ลด Scale ลงเหลือ 1.1 - 1.25 และคุมความสูงที่ 70% */
          <div className={`relative flex items-center justify-center h-full w-full transition-all duration-500 ${isTrulyBoss || isElite ? 'scale-125' : 'scale-110'} animate-bounce-slow`}>
            
            <div className={`absolute w-48 h-48 rounded-full blur-[60px] transition-all duration-1000 
              ${isTrulyBoss ? 'bg-amber-500/20' : isElite ? 'bg-red-600/20' : `bg-white/5`}`} 
            />
            
            {monster.image ? (
              <img 
                src={monster.image} 
                alt="" 
                className="max-h-[90%] w-auto object-contain z-10 drop-shadow-[0_15px_25px_rgba(0,0,0,0.8)]" 
              />
            ) : (
              <span className="relative z-10 text-7xl sm:text-9xl">{monster.emoji || "👾"}</span>
            )}
            
            <div className="absolute bottom-6 w-24 h-4 bg-black/40 blur-xl rounded-[100%]" />
          </div>
        )}
      </div>

      {/* 📊 3. [ส่วนท้าย] HP Bar & Stats - กระชับพื้นที่เพื่อให้ปุ่มลอยขึ้น */}
      <div className="shrink-0 space-y-1 px-5 pb-1">
        <div className="flex justify-between items-end mb-0.5">
            <div className="flex gap-2 scale-90 origin-left">
              <span className="text-[9px] font-black italic text-orange-400">ATK {monster.atk}</span>
              <span className="text-[9px] font-black text-blue-300 italic">DEF {monster.def || 0}</span>
            </div>
            <span className="text-[10px] font-black text-white italic">
              HP {Math.ceil(monster.hp)} / {monster.maxHp}
            </span>
        </div>

        <div className="w-full h-2 bg-black/70 rounded-full overflow-hidden border border-white/5 relative">
          <div 
            className={`h-full hp-bar-transition relative z-10 ${
              isTrulyBoss ? 'bg-gradient-to-r from-amber-400 to-amber-700' :
              isElite ? 'bg-gradient-to-r from-red-600 to-red-900' : el.bg}`} 
            style={{ width: `${displayHpPercent}%` }} 
          />
        </div>

        {!lootResult && (
          <div className="flex justify-center pt-1">
            <button 
              onClick={(e) => { 
                e.stopPropagation(); 
                if(setShowSkills) setShowSkills(!showSkills); 
              }} 
              className="flex flex-row items-center gap-1.5 px-4 py-1 rounded-xl border-2 border-white/10 bg-slate-900/90 active:scale-95 transition-all pointer-events-auto"
            >
              <Target size={10} className="text-orange-500" />
              <span className="text-[8px] font-black uppercase italic tracking-widest text-white">
                {showSkills ? "CLOSE" : "SKILL DETAIL"}
              </span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}