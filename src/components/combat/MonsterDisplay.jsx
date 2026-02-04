import React, { useState } from 'react'; // ✅ คงเดิม: เพิ่ม useState สำหรับ tooltip
import { Target } from 'lucide-react';

export default function MonsterDisplay({ 
  monster, 
  showSkills, 
  setShowSkills, 
  lootResult, 
  isBoss, 
  isShiny, // ✅ รับ Prop isShiny เพิ่มเข้ามาจาก CombatView
  monsterHpPercent 
}) {

  // ✅ [เพิ่มใหม่] สำหรับคุมการโชว์คำอธิบายสกิลรายตัว (รองรับมือถือ)
  const [activeSkillTooltip, setActiveSkillTooltip] = useState(null);

  return (
    // ✅ ปรับ space-y-4 เป็น space-y-2 ในมือถือเพื่อให้ "เต็มจอ" แบบไม่ต้องไถ
    <div className="relative z-10 text-center space-y-2 sm:space-y-4">
      
      {/* 👑 1. [ชื่อมอนสเตอร์] และ Stat พื้นฐาน */}
      <div className="flex flex-col items-center justify-center gap-0.5 sm:gap-1">
        {/* ✨ [แก้ไข] เปลี่ยนสีชื่อมอนสเตอร์ให้เป็นสีรุ้งถ้าเป็น Shiny */}
        <h3 className={`text-xl sm:text-2xl font-black uppercase italic tracking-tighter transition-all duration-500
          ${isShiny 
            ? 'text-transparent bg-clip-text bg-gradient-to-r from-red-400 via-yellow-300 via-green-400 via-blue-400 to-purple-500 animate-rainbow-text' 
            : 'text-white drop-shadow-lg'}`}>
          {monster.name}
        </h3>
        
        {/* ✅ ปรับ mb-2 เป็น mb-1 เพื่อประหยัดพื้นที่แนวตั้ง */}
        <div className="flex flex-col items-center gap-1 mb-1">
          <div className="flex items-center gap-3">
            <span className="text-[10px] sm:text-[12px] font-mono text-slate-400 bg-black/50 px-2 py-0.5 rounded border border-slate-800">
              Lv.{monster.level}
            </span>
            <span className="text-[10px] sm:text-[12px] font-black text-white ml-5 tracking-tighter uppercase italic">
              HP: {Math.ceil(monster.hp)} / {monster.maxHp}
            </span>
          </div>
          
          <div className="flex gap-2">
            <span className="text-[10px] sm:text-[12px] font-bold text-orange-400 bg-orange-950/30 px-2 py-0.5 rounded border border-orange-500/20 italic uppercase">
              Atk: {monster.atk}
            </span>
            <span className="text-[10px] sm:text-[12px] font-bold text-blue-400 bg-blue-950/30 px-2 py-0.5 rounded border border-blue-500/20 italic uppercase">
              Def: {monster.def || 0}
            </span>
          </div>
        </div>
      </div>

      {/* 👑 2. BOSS BATTLE BADGE (คงเดิม 100%) */}
      {isBoss && (
        <div className="flex justify-center w-full mb-1 sm:mb-2">
          <div className="px-3 py-0.5 sm:px-4 sm:py-1 rounded-full bg-red-600 text-white shadow-lg animate-bounce inline-flex items-center gap-2">
            <span className="text-[10px] sm:text-[12px] font-black tracking-[0.2em] uppercase">BOSS BATTLE !!</span>
          </div>
        </div>
      )}

      {/* 👾 3. มอนสเตอร์แอเรีย (เพิ่มระบบ Toggle คำอธิบายสกิล) */}
      <div 
        onClick={() => {
          setShowSkills(!showSkills);
          setActiveSkillTooltip(null); // เคลียร์ Tooltip เมื่อปิดหน้าสกิล
        }} 
        // ✅ ปรับความสูง h-40 เป็น h-32 บนมือถือจอเล็กเพื่อความ "เต็มจอ"
        className="relative flex items-center mb-1 justify-center py-2 h-32 sm:h-40 cursor-pointer group"
      >
        {showSkills ? (
          <div className="w-full h-full flex flex-col justify-center px-4 animate-in fade-in zoom-in duration-300 text-left">
            <h4 className="text-white font-black text-[10px] uppercase italic tracking-widest mb-2 border-b border-orange-900/30 pb-1 flex justify-between">
              <span>Monster Skills</span><span className="text-[8px] opacity-50 italic underline">Close</span>
            </h4>
            <div className="space-y-1 overflow-y-auto max-h-32 sm:max-h-40 pr-1 custom-scrollbar">
              {monster.skills?.map((skill, i) => (
                <div 
                  key={i} 
                  onClick={(e) => {
                    e.stopPropagation();
                    setActiveSkillTooltip(activeSkillTooltip === i ? null : i);
                  }}
                  className={`p-1.5 sm:p-2 rounded-xl border transition-all ${skill.condition?.includes("Passive") ? 'bg-blue-500/10 border-blue-500/20' : skill.condition?.includes("Special") ? 'bg-red-500/10 border-red-500/30 animate-pulse' : 'bg-orange-500/10 border-orange-400/20'}`}
                >
                  <div className="flex justify-between items-center mb-0.5">
                    <span className="font-bold text-[10px] sm:text-[11px] italic uppercase tracking-tighter text-white">{skill.name}</span>
                    <span className="text-[7px] text-white/70 font-mono font-bold px-1.5 bg-black/40 rounded border border-white/5">{skill.condition}</span>
                  </div>
                  
                  {/* ✅ คำอธิบายจะโชว์เสมอในคอม และโชว์เมื่อ 'จิ้ม' ในมือถือ */}
                  <p className={`text-[8px] sm:text-[9px] text-slate-400 leading-tight italic transition-all duration-300 ${
                    activeSkillTooltip === i ? 'max-h-20 opacity-100 mt-1' : 'max-h-0 lg:max-h-20 opacity-0 lg:opacity-100'
                  } overflow-hidden`}>
                    "{skill.description}"
                  </p>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className={`relative flex items-center justify-center transition-all duration-500 ${isBoss ? 'scale-110' : 'scale-100'} animate-bounce-slow`}>
            {/* ✨ เพิ่มออร่าสีขาวถ้าเป็น Shiny */}
            <div className={`absolute inset-0 rounded-full blur-[40px] sm:blur-[60px] opacity-40 
              ${isShiny ? 'bg-white/40 shadow-[0_0_50px_white]' : isBoss ? 'bg-red-500/50' : 'bg-blue-400/20'}`} />
            
            {monster.image ? (
              <img src={monster.image} alt="" className={`max-w-[140px] sm:max-w-[180px] z-10 drop-shadow-2xl transition-all ${isShiny ? 'drop-shadow-[0_0_15px_rgba(255,255,255,0.8)]' : ''}`} />
            ) : (
              <span className={`relative z-10 text-6xl sm:text-8xl ${isShiny ? 'drop-shadow-[0_0_10px_white]' : ''}`}>{monster.emoji || "👾"}</span>
            )}
          </div>
        )}
      </div>

      {/* 📊 4. ส่วนล่างรูป (คงเดิม 100%) */}
      <div className="space-y-2 sm:space-y-3">
        {!lootResult && (
          <div className="flex justify-center">
            <button 
              onClick={(e) => { e.stopPropagation(); setShowSkills(!showSkills); setActiveSkillTooltip(null); }} 
              className={`flex flex-row items-center gap-1.5 px-3 py-1.5 sm:py-2 rounded-full border transition-all active:scale-90 group ${showSkills ? 'bg-orange-500 border-orange-400 shadow-[0_0_10px_rgba(249,115,22,0.4)]' : 'bg-white/5 border-white/10 hover:bg-white/20'}`}
            >
              <Target size={12} className={showSkills ? "text-white" : "text-orange-500"} />
              <span className={`text-[9px] font-black uppercase italic tracking-widest whitespace-nowrap transition-colors ${showSkills ? "text-white" : "text-slate-500 group-hover:text-orange-400"}`}>
                {showSkills ? "CLOSE" : "SKILLS DETAIL"}
              </span>
            </button>
          </div>
        )}
        
        <div className="w-full h-2.5 sm:h-3 bg-black/60 rounded-full overflow-hidden border border-white/10 relative">
          <div 
            className={`h-full transition-all duration-500 ${isShiny ? 'bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400' : isBoss ? 'bg-gradient-to-r from-red-800 to-red-400' : 'bg-gradient-to-r from-red-600 to-orange-500'}`} 
            style={{ width: `${monsterHpPercent}%` }} 
          />
        </div>
      </div>

    </div>
  );
}