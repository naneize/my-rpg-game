import React, { useState } from 'react'; 
import { MONSTER_SKILLS } from '../data/passive';
import { Sword, Shield, Lock } from 'lucide-react';

const PassiveSkillView = ({ player, setPlayer }) => {
  // ✅ [คงเดิม] State สำหรับเก็บ ID ของสกิลที่กำลังถูกเลือกดู
  const [activeTooltip, setActiveTooltip] = useState(null);

  const equippedIds = player?.equippedPassives || [null, null, null];
  const actualUnlockedCount = player?.unlockedPassives?.filter(id => id && id !== 'none').length || 0;

  // ✅ [คงเดิม] ฟังก์ชันติดตั้ง/ถอดสกิล
  const handleEquip = (skillId) => {
    if (player.equippedPassives.includes(skillId)) {
      const newEquipped = player.equippedPassives.map(id => id === skillId ? null : id);
      setPlayer({ ...player, equippedPassives: newEquipped });
      return;
    }

    const emptySlotIndex = player.equippedPassives.findIndex(slot => slot === null);
    if (emptySlotIndex !== -1) {
      const newEquipped = [...player.equippedPassives];
      newEquipped[emptySlotIndex] = skillId;
      setPlayer({ ...player, equippedPassives: newEquipped });
    } else {
      alert("ช่องติดตั้งเต็มแล้ว!");
    }
  };

  // ✅ [คงเดิม] ฟังก์ชันจัดการ Tooltip
  const toggleTooltip = (e, skillId) => {
    e.stopPropagation(); 
    setActiveTooltip(activeTooltip === skillId ? null : skillId);
  };

  return (
    <div 
      className="p-6 bg-slate-950/20 min-h-screen animate-fadeIn relative select-none pb-32"
      onClick={() => setActiveTooltip(null)}
    >
      
      {/* --- Section: Equipped Slots --- */}
      <h2 className="text-orange-500 font-black text-xs mb-5 flex items-center gap-2 uppercase tracking-[0.2em]">
        <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse" />
        Active Passives ({equippedIds.filter(id => id !== null).length}/3)
      </h2>
      
      <div className="grid grid-cols-3 gap-3 mb-12">
        {equippedIds.map((slotId, i) => {
          const equippedSkill = MONSTER_SKILLS.find(s => s.id === slotId);
          
          return (
            <div 
              key={i} 
              onClick={(e) => equippedSkill && toggleTooltip(e, `slot-${i}`)}
              className={`relative aspect-square rounded-[2rem] border-2 transition-all duration-300 flex flex-col items-center justify-center overflow-visible
                ${equippedSkill 
                  ? 'border-orange-500/50 bg-orange-950/20 shadow-[0_0_20px_rgba(245,158,11,0.1)]' 
                  : 'border-dashed border-slate-800 bg-slate-900/40'}`}
            >
              {!equippedSkill && (
                <span className="absolute text-slate-800 font-black text-3xl opacity-10 italic">{i+1}</span>
              )}

              {equippedSkill ? (
                <>
                  <div className="text-3xl mb-1 drop-shadow-[0_0_8px_rgba(245,158,11,0.5)]">{equippedSkill.icon}</div>
                  <span className="text-[7px] text-orange-400 font-black uppercase tracking-tighter text-center px-1 truncate w-full">
                    {equippedSkill.name}
                  </span>
                  
                  {/* 💬 Tooltip สำหรับช่องที่ติดตั้งแล้ว */}
                  <div className={`absolute top-full mt-3 left-1/2 -translate-x-1/2 w-36 p-3 bg-slate-900 border border-orange-500/40 rounded-2xl shadow-2xl backdrop-blur-xl z-[100] transition-all
                    ${activeTooltip === `slot-${i}` ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-75 -translate-y-2 pointer-events-none'}
                  `}>
                    <p className="text-[9px] font-black text-orange-400 uppercase mb-1 text-center">{equippedSkill.name}</p>
                    <p className="text-[8px] text-slate-400 text-center leading-tight mb-2 italic">"{equippedSkill.description}"</p>
                    <button 
                      onClick={(e) => { e.stopPropagation(); handleEquip(slotId); setActiveTooltip(null); }}
                      className="w-full py-1.5 bg-red-500/10 text-red-500 text-[8px] font-black uppercase rounded-lg border border-red-500/20 active:scale-95 transition-all"
                    >
                      Unequip
                    </button>
                  </div>
                </>
              ) : (
                <div className="flex flex-col items-center opacity-20">
                  <div className="w-5 h-5 rounded-full border border-slate-600 border-dashed" />
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* --- Section: Skill Library --- */}
      <div className="flex justify-between items-end mb-5">
        <h2 className="text-slate-500 font-black text-[10px] uppercase tracking-[0.2em]">
          Skill Library <span className="text-orange-700 ml-1">({actualUnlockedCount})</span>
        </h2>
      </div>
      
      <div className="flex flex-wrap gap-4 justify-start items-start">
        {MONSTER_SKILLS.filter(skill => player?.unlockedPassives?.includes(skill.id)).map((skill) => {
          const isEquipped = equippedIds.includes(skill.id);
          return (
            <div 
              key={skill.id} 
              onClick={(e) => {
                if (activeTooltip !== skill.id) {
                  toggleTooltip(e, skill.id);
                } else {
                  handleEquip(skill.id);
                  setActiveTooltip(null);
                }
              }}
              className={`relative aspect-square w-[calc(33.33%-11px)] max-w-[100px] rounded-3xl border-2 transition-all duration-300 flex flex-col items-center justify-center p-2
                ${isEquipped 
                  ? 'bg-orange-500/10 border-orange-500 shadow-[0_0_15px_rgba(245,158,11,0.2)]' 
                  : 'bg-slate-900/40 border-slate-800 hover:border-slate-700'}`}
            >
              <div className={`text-2xl mb-1 transition-transform ${activeTooltip === skill.id ? 'scale-110' : ''}`}>
                {skill.icon}
              </div>
              <div className="text-[8px] font-black text-slate-300 truncate w-full text-center uppercase tracking-tighter">
                {skill.name}
              </div>

              {/* 💬 Tooltip สำหรับ Library (ย้ายมาไว้ด้านบนเพื่อไม่ให้โดนมือบัง) */}
              <div className={`absolute bottom-full mb-4 left-1/2 -translate-x-1/2 w-44 p-4 bg-slate-900/95 border border-white/10 rounded-[2rem] shadow-2xl transition-all z-[100] origin-bottom backdrop-blur-xl
                ${activeTooltip === skill.id ? 'opacity-100 scale-100' : 'opacity-0 scale-75 pointer-events-none'}
              `}>
                <div className="flex flex-col items-center text-center">
                  <span className="text-[7px] text-orange-500 font-black uppercase mb-1 tracking-widest">{skill.monster}</span>
                  <p className="text-[10px] font-black text-white uppercase mb-1">{skill.name}</p>
                  <p className="text-[9px] text-slate-400 italic mb-3 leading-tight">"{skill.description}"</p>
                  
                  {(skill.bonusAtk > 0 || skill.bonusDef > 0) && (
                    <div className="flex gap-4 border-t border-white/5 pt-3 w-full justify-center">
                      {skill.bonusAtk > 0 && (
                        <div className="flex items-center gap-1">
                          <Sword size={10} className="text-red-500" />
                          <span className="text-[10px] font-black text-emerald-400">+{skill.bonusAtk}</span>
                        </div>
                      )}
                      {skill.bonusDef > 0 && (
                        <div className="flex items-center gap-1">
                          <Shield size={10} className="text-blue-500" />
                          <span className="text-[10px] font-black text-emerald-400">+{skill.bonusDef}</span>
                        </div>
                      )}
                    </div>
                  )}
                  <p className="text-[7px] text-orange-500/60 mt-3 font-black uppercase animate-pulse">Tap again to equip</p>
                </div>
                <div className="absolute top-full left-1/2 -translate-x-1/2 border-8 border-transparent border-t-slate-900/95" />
              </div>

              {/* Checkmark ถ้าติดตั้งแล้ว */}
              {isEquipped && (
                <div className="absolute -top-1 -right-1 w-5 h-5 bg-orange-500 rounded-full flex items-center justify-center border-2 border-slate-950 shadow-lg">
                  <div className="w-2 h-1 border-b-2 border-r-2 border-white -rotate-45 mb-0.5" />
                </div>
              )}
            </div>
          );
        })}

        {actualUnlockedCount === 0 && (
          <div className="w-full py-12 flex flex-col items-center justify-center border-2 border-dashed border-slate-900 rounded-[2.5rem] opacity-30">
            <Lock className="text-slate-800 mb-2" size={24} />
            <p className="text-[10px] font-black text-slate-800 uppercase tracking-widest text-center px-6">
              No skills found in archive
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PassiveSkillView;