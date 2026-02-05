import React, { useState } from 'react'; 
import { Target, Zap, Droplets, Flame, Wind, Mountain, Ghost, Shield } from 'lucide-react';

// ✅ ฟังก์ชันสำหรับดึงไอคอนและสีตามธาตุ
const getElementInfo = (element) => {
  const elements = {
    FIRE: { icon: <Flame size={10} />, color: 'text-red-500', bg: 'bg-red-600', shadow: 'shadow-red-500/40' },
    WATER: { icon: <Droplets size={10} />, color: 'text-blue-400', bg: 'bg-blue-600', shadow: 'shadow-blue-500/40' },
    WIND: { icon: <Wind size={10} />, color: 'text-emerald-400', bg: 'bg-emerald-600', shadow: 'shadow-emerald-500/40' },
    EARTH: { icon: <Mountain size={10} />, color: 'text-orange-700', bg: 'bg-orange-800', shadow: 'shadow-orange-900/40' },
    LIGHT: { icon: <Zap size={10} />, color: 'text-yellow-300', bg: 'bg-yellow-500', shadow: 'shadow-yellow-300/40' },
    DARK: { icon: <Ghost size={10} />, color: 'text-purple-500', bg: 'bg-purple-800', shadow: 'shadow-purple-900/40' },
  };
  return elements[element?.toUpperCase()] || { 
    icon: <Target size={10} />, 
    color: 'text-slate-400', 
    bg: 'bg-red-600' 
  };
};

export default function MonsterDisplay({ 
  monster, showSkills, setShowSkills, lootResult, isBoss, isShiny, monsterHpPercent 
}) {
  const [activeSkillTooltip, setActiveSkillTooltip] = useState(null);
  const el = getElementInfo(monster.element);

  return (
    // ✅ 1. เพิ่ม h-full และลด space-y-0 เพื่อดันทุกอย่างขึ้นและกัน Scrollbar
    <div className="relative z-10 text-center space-y-0 sm:space-y-1 flex flex-col h-full overflow-hidden">
      
      {/* 👑 1. [ส่วนหัว] ชื่อและแท็ก - ปรับ Contrast ให้อ่านง่ายขึ้น */}
      <div className="flex flex-col items-center justify-center shrink-0 pt-1 sm:pt-3">
        {/* ขยายชื่อและเพิ่ม Drop Shadow ให้อ่านง่ายขึ้น */}
        <h3 className={`text-xl sm:text-2xl font-black uppercase italic tracking-tighter drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] transition-all duration-500
          ${isShiny ? 'text-transparent bg-clip-text bg-gradient-to-r from-red-400 via-yellow-300 via-green-400 via-blue-400 to-purple-500 animate-rainbow-text' : 'text-white'}`}>
          {monster.name}
        </h3>
        
        {/* ปรับปรุง Tag: ใช้พื้นหลังเข้มตัดกับตัวหนังสือสว่างเพื่อแก้ปัญหาสีบังตัวหนังสือ */}
        <div className="flex items-center gap-1.5 mt-0.5 scale-95 sm:scale-110">
          <span className="text-[8px] font-black bg-slate-800/95 text-slate-200 px-2 py-0.5 rounded-md border border-white/10 uppercase italic">
            {monster.type || 'Normal'}
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

      {/* 👾 2. [ส่วนกลาง] มอนสเตอร์แอเรีย - ใช้ flex-1 เพื่อให้ขยายตามพื้นที่ที่เหลือโดยไม่ดันปุ่ม */}
      <div 
        onClick={() => { setShowSkills(!showSkills); setActiveSkillTooltip(null); }} 
        className="relative flex items-center justify-center flex-1 min-h-0 cursor-pointer py-1"
      >
        {showSkills ? (
          <div className="w-full h-full max-h-[160px] flex flex-col justify-center px-4 animate-in fade-in zoom-in duration-300 text-left">
            <h4 className="text-white font-black text-[9px] uppercase italic tracking-widest mb-1 border-b border-white/20 pb-0.5 flex justify-between">
              <span>Monster Skills</span><span className="text-[8px] opacity-70 underline uppercase">Close</span>
            </h4>
            <div className="space-y-1.5 overflow-y-auto max-h-full pr-1 custom-scrollbar">
              {monster.skills?.map((skill, i) => (
                <div 
                  key={i} 
                  onClick={(e) => { e.stopPropagation(); setActiveSkillTooltip(activeSkillTooltip === i ? null : i); }}
                  className={`p-2 rounded-xl border-2 transition-all ${
                    skill.condition?.includes("Passive") ? 'bg-blue-600/20 border-blue-400/30' : 
                    skill.condition?.includes("Special") ? 'bg-red-600/20 border-red-400/40 animate-pulse' : 'bg-orange-600/20 border-orange-400/30'
                  }`}
                >
                  <div className="flex justify-between items-center mb-0.5">
                    <span className="font-bold text-[10px] italic uppercase text-white drop-shadow-sm">{skill.name}</span>
                    <span className="text-[7px] text-white font-mono font-bold px-1.5 bg-black/60 rounded border border-white/10 uppercase">{skill.condition || 'Active'}</span>
                  </div>
                  <p className={`text-[9px] text-slate-200 leading-tight italic transition-all duration-300 ${activeSkillTooltip === i ? 'max-h-24 opacity-100 mt-1' : 'max-h-0 opacity-0'} overflow-hidden`}>
                    "{skill.description || 'No description available.'}"
                  </p>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className={`relative flex items-center justify-center h-full max-h-[190px] transition-all duration-500 ${isBoss ? 'scale-100' : 'scale-90'} animate-bounce-slow`}>
            <div className={`absolute inset-0 rounded-full blur-[40px] opacity-15 ${el.bg.replace('600', '600/15')}`} />
            <div className={`absolute -top-1 -right-1 opacity-20 scale-[2.5] ${el.color} pointer-events-none`}>{el.icon}</div>
            {monster.image ? (
              <img src={monster.image} alt="" className="max-h-full w-auto object-contain z-10 drop-shadow-[0_10px_20px_rgba(0,0,0,0.7)]" />
            ) : (
              <span className="relative z-10 text-7xl sm:text-9xl">{monster.emoji || "👾"}</span>
            )}
            <div className="absolute -bottom-2 w-24 h-4 bg-black/40 blur-xl rounded-[100%]" />
          </div>
        )}
      </div>

      {/* 📊 3. [ส่วนท้าย] HP Bar & Stats - บีบตัวหนังสือให้ชัดและชิดขึ้น */}
      <div className="shrink-0 space-y-1 px-5 pb-1">
        <div className="flex justify-between items-end mb-0.5">
           <div className="flex gap-2 scale-95 origin-left">
              <span className="text-[10px] font-black text-orange-400 italic drop-shadow-md">ATK {monster.atk}</span>
              <span className="text-[10px] font-black text-blue-300 italic drop-shadow-md">DEF {monster.def || 0}</span>
           </div>
           <span className="text-[11px] font-black text-white italic tracking-tighter drop-shadow-lg">
              HP {Math.ceil(monster.hp)} / {monster.maxHp}
           </span>
        </div>

        {/* HP Bar - หนาขึ้นเล็กน้อยเพื่อความชัดเจน */}
        <div className="w-full h-2.5 bg-black/70 rounded-full overflow-hidden border border-white/10 relative">
          <div 
            className={`h-full transition-all duration-500 ${isShiny ? 'bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400' : el.bg}`} 
            style={{ width: `${monsterHpPercent}%` }} 
          />
        </div>

        {!lootResult && (
          <div className="flex justify-center pt-0.5">
            <button 
              onClick={(e) => { e.stopPropagation(); setShowSkills(!showSkills); setActiveSkillTooltip(null); }} 
              className={`flex flex-row items-center gap-1.5 px-4 py-1 rounded-xl border-2 transition-all active:scale-90 ${showSkills ? 'bg-orange-600 border-orange-400' : 'bg-slate-900/90 border-white/10'}`}
            >
              <Target size={12} className={showSkills ? "text-white" : "text-orange-500"} />
              <span className="text-[9px] font-black uppercase italic tracking-widest text-white">
                {showSkills ? "CLOSE" : "SKILL DETAIL"}
              </span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}