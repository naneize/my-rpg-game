import React, { useState } from 'react'; // ✅ เพิ่ม useState
import { MONSTER_SKILLS } from '../data/passive';
import { Sword, Shield } from 'lucide-react';

const PassiveSkillView = ({ player, setPlayer }) => {
  // ✅ [เพิ่มใหม่] State สำหรับเก็บ ID ของสกิลที่กำลังถูกเลือกดู (เพื่อรองรับมือถือ)
  const [activeTooltip, setActiveTooltip] = useState(null);

  const equippedIds = player?.equippedPassives || [null, null, null];
  const actualUnlockedCount = player?.unlockedPassives?.filter(id => id && id !== 'none').length || 0;

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

  // ✅ [เพิ่มใหม่] ฟังก์ชันสำหรับจัดการการแสดง Tooltip บนมือถือ
  const toggleTooltip = (e, skillId) => {
    e.stopPropagation(); // ป้องกันการกดซ้อน
    setActiveTooltip(activeTooltip === skillId ? null : skillId);
  };

  return (
    // ✅ เพิ่ม onClick ที่พื้นหลังเพื่อให้กดที่ว่างแล้ว Tooltip หายไป (สะดวกมากบนมือถือ)
    <div 
      className="p-6 bg-black/20 min-h-screen animate-fadeIn relative select-none"
      onClick={() => setActiveTooltip(null)}
    >
      
      <h2 className="text-orange-500 font-bold text-lg mb-4 flex items-center gap-2">
        ✨ สกิลที่ติดตั้ง ({equippedIds.filter(id => id !== null).length}/3)
      </h2>
      
      <div className="grid grid-cols-3 gap-4 mb-10">
        {equippedIds.map((slotId, i) => {
          const equippedSkill = MONSTER_SKILLS.find(s => s.id === slotId);
          
          return (
            <div 
              key={i} 
              onClick={(e) => equippedSkill && toggleTooltip(e, `slot-${i}`)}
              className="relative group/slot aspect-square rounded-2xl border-2 border-dashed border-orange-900/40 bg-orange-950/10 flex flex-col items-center justify-center transition-all hover:border-orange-500/50"
            >
              {equippedSkill ? (
                <>
                  <div className="text-3xl mb-1">{equippedSkill.icon}</div>
                  <span className="text-[10px] text-orange-500 font-black uppercase">{equippedSkill.name}</span>
                  
                  {/* 💬 Tooltip (ปรับปรุงเงื่อนไขให้แสดงผลเมื่อ activeTooltip ตรงกันด้วย) */}
                  <div className={`absolute inset-0 flex items-center justify-center pointer-events-none z-[100] transition-all
                    ${activeTooltip === `slot-${i}` ? 'opacity-100 scale-100' : 'group-hover/slot:opacity-100 group-hover/slot:scale-100 opacity-0 scale-75'}
                  `}>
                    <div className="w-[90%] p-4 bg-slate-900/95 border border-orange-500/40 rounded-3xl shadow-2xl backdrop-blur-xl flex flex-col items-center">
                      <p className="text-[11px] font-black text-orange-400 uppercase mb-1 text-center tracking-tight">{equippedSkill.name}</p>
                      <p className="text-[9px] text-slate-200 italic leading-tight mb-2 text-center opacity-90 px-1">"{equippedSkill.description}"</p>

                      {(equippedSkill.bonusAtk > 0 || equippedSkill.bonusDef > 0) && (
                        <div className="flex gap-3 border-t border-white/10 pt-2 mt-1 w-full justify-center">
                          {equippedSkill.bonusAtk > 0 && (
                            <div className="flex items-center gap-1">
                              <Sword size={10} className="text-red-500" fill="currentColor" />
                              <span className="text-[8px] font-bold text-slate-400 uppercase">Atk</span>
                              <span className="text-[10px] font-black text-emerald-400">+{equippedSkill.bonusAtk}</span>
                            </div>
                          )}
                          {equippedSkill.bonusDef > 0 && (
                            <div className="flex items-center gap-1">
                              <Shield size={10} className="text-blue-500" fill="currentColor" />
                              <span className="text-[8px] font-bold text-slate-400 uppercase">Def</span>
                              <span className="text-[10px] font-black text-emerald-400">+{equippedSkill.bonusDef}</span>
                            </div>
                          )}
                        </div>
                      )}
                      {/* แนะนำสำหรับมือถือ */}
                      <p className="text-[7px] text-slate-500 mt-2 uppercase lg:hidden">แตะอีกครั้งเพื่อปิด</p>
                    </div>
                  </div>
                </>
              ) : (
                <span className="text-orange-900/30 text-[10px] uppercase tracking-widest font-black">ว่าง</span>
              )}
            </div>
          );
        })}
      </div>

      <h2 className="text-orange-700 font-bold text-sm mb-4 uppercase tracking-wider">
        คลังคัมภีร์ทักษะ ({actualUnlockedCount})
      </h2>
      
      <div className="flex flex-wrap gap-3 justify-start items-start min-h-[100px]">
        {MONSTER_SKILLS.filter(skill => player?.unlockedPassives?.includes(skill.id)).map((skill) => {
          const isEquipped = equippedIds.includes(skill.id);
          return (
            <div 
              key={skill.id} 
              // ✅ [แก้ไข] เปลี่ยน onClick: ถ้าจิ้มค้างไว้จะถือว่าดู Tooltip ถ้าจิ้มแล้วปล่อย/จิ้มซ้ำจะถือว่า Equip
              onClick={(e) => {
                if (activeTooltip !== skill.id) {
                  toggleTooltip(e, skill.id);
                } else {
                  handleEquip(skill.id);
                  setActiveTooltip(null);
                }
              }}
              className={`relative group/skill aspect-square p-2 w-20 h-20 border rounded-xl transition-all cursor-pointer flex flex-col items-center justify-center text-center flex-shrink-0
                ${isEquipped 
                  ? 'bg-orange-500/20 border-orange-500 shadow-[0_0_10px_rgba(245,158,11,0.2)]' 
                  : 'bg-orange-900/10 border-orange-900/30 hover:bg-orange-900/20'}`}
            >
              <div className="text-xl mb-0.5">{skill.icon}</div>
              <div className="text-[7px] font-black text-amber-100 truncate w-full px-1 leading-none uppercase">
                {skill.name}
              </div>

              {/* 💬 Tooltip (ปรับปรุงเงื่อนไขให้แสดงผลเมื่อ activeTooltip ตรงกันด้วย) */}
              <div className={`absolute bottom-full mb-3 left-1/2 -translate-x-1/2 w-44 p-3 bg-slate-900 border border-white/10 rounded-2xl shadow-2xl transition-all pointer-events-none z-[100] origin-bottom backdrop-blur-xl flex flex-col items-center
                ${activeTooltip === skill.id ? 'opacity-100 scale-100' : 'group-hover/skill:opacity-100 group-hover/skill:scale-100 opacity-0 scale-75'}
              `}>
                <div className="flex flex-col items-center mb-1 text-center w-full">
                  <p className="text-[10px] font-black text-orange-400 uppercase tracking-tighter">{skill.name}</p>
                  <span className="text-[7px] bg-orange-500/20 px-1.5 py-0.5 rounded border border-orange-500/30 text-orange-300 font-bold uppercase mt-0.5">{skill.monster}</span>
                </div>
                
                <p className="text-[9px] text-slate-300 italic leading-tight mb-2 opacity-80 text-center">"{skill.description}"</p>
                
                {(skill.bonusAtk > 0 || skill.bonusDef > 0) && (
                  <div className="flex gap-3 border-t border-white/5 pt-2 mt-1 w-full justify-center">
                    {skill.bonusAtk > 0 && (
                      <div className="flex items-center gap-1">
                        <Sword size={10} className="text-red-500" fill="currentColor" />
                        <span className="text-[9px] font-bold text-slate-400 uppercase">Atk</span>
                        <span className="text-[10px] font-black text-emerald-400">+{skill.bonusAtk}</span>
                      </div>
                    )}
                    {skill.bonusDef > 0 && (
                      <div className="flex items-center gap-1">
                        <Shield size={10} className="text-blue-500" fill="currentColor" />
                        <span className="text-[9px] font-bold text-slate-400 uppercase">Def</span>
                        <span className="text-[10px] font-black text-emerald-400">+{skill.bonusDef}</span>
                      </div>
                    )}
                  </div>
                )}
                {/* แนะนำสำหรับมือถือ */}
                <p className="text-[7px] text-orange-500/50 mt-2 uppercase font-black lg:hidden">จิ้มอีกครั้งเพื่อติดตั้ง</p>
                <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-slate-900" />
              </div>
            </div>
          );
        })}

        {actualUnlockedCount === 0 && (
          <div className="w-full py-8 flex flex-col items-center justify-center border-2 border-dashed border-orange-900/20 rounded-2xl opacity-40">
            <p className="text-[10px] font-black text-orange-900 uppercase tracking-widest">ยังไม่พบทักษะในคลัง</p>
            <p className="text-[8px] text-orange-900/70 mt-1 uppercase">จัดการมอนสเตอร์เพื่อดรอปคัมภีร์</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PassiveSkillView;