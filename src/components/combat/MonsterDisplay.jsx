import React from 'react';
import { Target } from 'lucide-react';

export default function MonsterDisplay({ 
  monster, 
  showSkills, 
  setShowSkills, 
  lootResult, 
  isBoss, 
  monsterHpPercent 
}) {
  return (
    <div className="relative z-10 text-center space-y-4">
      
      {/* 👑 1. [ชื่อมอนสเตอร์] ย้ายมาไว้บนสุดตัวเดียวเพื่อความเด่น */}
      <div className="flex flex-col items-center justify-center gap-1">
        <h3 className="text-2xl font-black uppercase italic tracking-tighter text-white drop-shadow-lg">
          {monster.name}
        </h3>
        <span className="text-[9px] font-mono text-slate-400 bg-black/50 px-2 py-0.5 rounded border border-slate-800">
          Lv.{monster.level}
        </span>
      </div>

      {/* 👑 2. BOSS BATTLE BADGE */}
      {isBoss && (
        <div className="flex justify-center w-full mb-2">
          <div className="px-4 py-1 rounded-full bg-red-600 text-white shadow-lg animate-bounce inline-flex items-center gap-2">
            <span className="text-[12px] font-black tracking-[0.2em] uppercase">BOSS BATTLE !!</span>
          </div>
        </div>
      )}

      {/* 👾 3. มอนสเตอร์แอเรีย (รูปภาพมอนสเตอร์) */}
      <div 
        onClick={() => setShowSkills(!showSkills)} 
        className="relative flex items-center mb-1 justify-center py-2 h-40 cursor-pointer group"
      >
        {showSkills ? (
          <div className="w-full h-full flex flex-col justify-center px-4 animate-in fade-in zoom-in duration-300 text-left">
            <h4 className="text-white font-black text-[10px] uppercase italic tracking-widest mb-3 border-b border-orange-900/30 pb-1 flex justify-between">
              <span>Monster Skills</span><span className="text-[8px] opacity-50 italic underline">Close</span>
            </h4>
            <div className="space-y-1.5 overflow-y-auto max-h-40 pr-1 custom-scrollbar">
              {monster.skills?.map((skill, i) => (
                <div key={i} className={`p-2 rounded-xl border transition-all ${skill.condition?.includes("Passive") ? 'bg-blue-500/10 border-blue-500/20' : skill.condition?.includes("Special") ? 'bg-red-500/10 border-red-500/30 animate-pulse' : 'bg-orange-500/10 border-orange-400/20'}`}>
                  <div className="flex justify-between items-center mb-0.5">
                    <span className="font-bold text-[11px] italic uppercase tracking-tighter text-white">{skill.name}</span>
                    <span className="text-[7px] text-white/70 font-mono font-bold px-1.5 bg-black/40 rounded border border-white/5">{skill.condition}</span>
                  </div>
                  <p className="text-[9px] text-slate-400 leading-tight italic">"{skill.description}"</p>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className={`relative flex items-center justify-center transition-all duration-500 ${isBoss ? 'scale-110' : 'scale-100'} animate-bounce-slow`}>
            <div className={`absolute inset-0 rounded-full blur-[60px] opacity-40 ${isBoss ? 'bg-red-500/50' : 'bg-blue-400/20'}`} />
            {monster.image ? <img src={monster.image} alt="" className="max-w-[180px] z-10 drop-shadow-2xl" /> : <span className="relative z-10 text-8xl">{monster.emoji || "👾"}</span>}
          </div>
        )}
      </div>

      {/* 📊 4. ส่วนล่างรูป: ปุ่ม Skill Detail และ หลอด HP */}
      <div className="space-y-3">
        {/* [ปุ่มกลับมาอยู่ที่เดิม] ใต้รูปมอนสเตอร์ */}
        {!lootResult && (
          <div className="flex justify-center">
            <button 
              onClick={(e) => { e.stopPropagation(); setShowSkills(!showSkills); }} 
              className={`flex flex-row items-center gap-1.5 px-3 py-1 rounded-full border transition-all active:scale-90 group ${showSkills ? 'bg-orange-500 border-orange-400 shadow-[0_0_10px_rgba(249,115,22,0.4)]' : 'bg-white/5 border-white/10 hover:bg-white/20'}`}
            >
              <Target size={12} className={showSkills ? "text-white" : "text-orange-500"} />
              <span className={`text-[9px] font-black uppercase italic tracking-widest whitespace-nowrap transition-colors ${showSkills ? "text-white" : "text-slate-500 group-hover:text-orange-400"}`}>
                {showSkills ? "CLOSE" : "SKILLS DETAIL"}
              </span>
            </button>
          </div>
        )}
        
        {/* หลอด HP มอนสเตอร์ */}
        <div className="w-full h-3 bg-black/60 rounded-full overflow-hidden border border-white/10 relative">
          <div 
            className={`h-full transition-all duration-500 ${isBoss ? 'bg-gradient-to-r from-red-800 to-red-400' : 'bg-gradient-to-r from-red-600 to-orange-500'}`} 
            style={{ width: `${monsterHpPercent}%` }} 
          />
        </div>
      </div>

    </div>
  );
}