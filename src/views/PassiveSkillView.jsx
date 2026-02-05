import React, { useState, useEffect } from 'react'; 
import { MONSTER_SKILLS } from '../data/passive';
import { Sword, Shield, Lock, X, Heart } from 'lucide-react'; // ✅ เพิ่ม Heart เข้ามาตามที่ใส่ไว้

const PassiveSkillView = ({ player, setPlayer }) => {
  const [activeTooltip, setActiveTooltip] = useState(null);

  const equippedIds = player?.equippedPassives || [null, null, null];
  const actualUnlockedCount = player?.unlockedPassives?.filter(id => id && id !== 'none').length || 0;

  // 🔥 [คงเดิม] คำนวณผลรวมโบนัสจากสกิลที่ติดตั้ง
  useEffect(() => {
    const equippedSkillsData = equippedIds
      .map(id => MONSTER_SKILLS.find(s => s.id === id))
      .filter(Boolean);

    const totalBonuses = equippedSkillsData.reduce((acc, skill) => {
      acc.atk += (skill.bonusAtk || 0);
      acc.def += (skill.bonusDef || 0);
      acc.hp += (skill.bonusMaxHp || 0);
      return acc;
    }, { atk: 0, def: 0, hp: 0 });

    if (JSON.stringify(player.passiveBonuses) !== JSON.stringify(totalBonuses)) {
      setPlayer(prev => ({ ...prev, passiveBonuses: totalBonuses }));
    }
  }, [equippedIds, player.passiveBonuses, setPlayer]);

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

  const toggleTooltip = (e, skillId) => {
    e.stopPropagation(); 
    setActiveTooltip(activeTooltip === skillId ? null : skillId);
  };

  const selectedSkill = MONSTER_SKILLS.find(s => 
    s.id === (activeTooltip?.startsWith('slot-') ? equippedIds[parseInt(activeTooltip.split('-')[1])] : activeTooltip)
  );

  return (
    <div 
      className="p-6 bg-slate-950/20 min-h-screen animate-fadeIn relative select-none pb-32"
      onClick={() => setActiveTooltip(null)}
    >
      
      {/* --- Section: Equipped Slots (คงเดิม 100%) --- */}
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
              {equippedSkill && (
                <>
                  <div className="text-3xl mb-1 drop-shadow-[0_0_8px_rgba(245,158,11,0.5)]">{equippedSkill.icon}</div>
                  <span className="text-[7px] text-orange-400 font-black uppercase tracking-tighter text-center px-1 truncate w-full">
                    {equippedSkill.name}
                  </span>
                </>
              )}
            </div>
          );
        })}
      </div>

      {/* --- Section: Skill Library (คงเดิม 100%) --- */}
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
              onClick={(e) => toggleTooltip(e, skill.id)}
              className={`relative aspect-square w-[calc(33.33%-11px)] max-w-[100px] rounded-3xl border-2 transition-all duration-300 flex flex-col items-center justify-center p-2
                ${isEquipped 
                  ? 'bg-orange-500/10 border-orange-500 shadow-[0_0_15px_rgba(245,158,11,0.2)]' 
                  : 'bg-slate-900/40 border-slate-800 hover:border-slate-700'}`}
            >
              <div className="text-2xl mb-1">{skill.icon}</div>
              <div className="text-[8px] font-black text-slate-300 truncate w-full text-center uppercase tracking-tighter">
                {skill.name}
              </div>
              {isEquipped && (
                <div className="absolute -top-1 -right-1 w-5 h-5 bg-orange-500 rounded-full flex items-center justify-center border-2 border-slate-950 shadow-lg">
                  <div className="w-2 h-1 border-b-2 border-r-2 border-white -rotate-45 mb-0.5" />
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* CENTER MODAL TOOLTIP */}
      {activeTooltip && selectedSkill && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-6 animate-in fade-in zoom-in duration-200">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setActiveTooltip(null)} />
          
          <div className="relative w-full max-w-[300px] bg-slate-900 border border-orange-500/50 rounded-[2.5rem] p-8 shadow-[0_0_50px_rgba(0,0,0,0.5)]">
            <div className="flex flex-col items-center text-center">
              <span className="text-[8px] text-orange-500 font-black uppercase tracking-widest mb-2 italic">
                {selectedSkill.monster}
              </span>
              
              <div className="text-6xl mb-4 drop-shadow-[0_0_15px_rgba(245,158,11,0.5)]">
                {selectedSkill.icon}
              </div>

              <h3 className="text-xl font-black text-white uppercase italic mb-1">
                {selectedSkill.name}
              </h3>

              <p className="text-[10px] text-slate-400 italic leading-relaxed mb-6 px-4">
                "{selectedSkill.description}"
              </p>

              {/* ✅ ปรับปรุงส่วนแสดงสเตตัสให้รองรับ MaxHP ครบถ้วน */}
              {(selectedSkill.bonusAtk > 0 || selectedSkill.bonusDef > 0 || (selectedSkill.bonusMaxHp > 0)) && (
                <div className="flex flex-wrap gap-4 mb-8 bg-white/5 p-3 rounded-2xl w-full justify-center border border-white/5">
                  {selectedSkill.bonusAtk > 0 && (
                    <div className="flex items-center gap-1">
                      <Sword size={12} className="text-red-500" />
                      <span className="text-xs font-black text-emerald-400">+{selectedSkill.bonusAtk}</span>
                    </div>
                  )}
                  {selectedSkill.bonusDef > 0 && (
                    <div className="flex items-center gap-1">
                      <Shield size={12} className="text-blue-500" />
                      <span className="text-xs font-black text-emerald-400">+{selectedSkill.bonusDef}</span>
                    </div>
                  )}
                  {/* 💖 ส่วนที่เพิ่มใหม่: แสดงผลโบนัส HP ที่หายไป */}
                  {selectedSkill.bonusMaxHp > 0 && (
                    <div className="flex items-center gap-1">
                      <Heart size={12} className="text-red-500" />
                      <span className="text-xs font-black text-emerald-400">+{selectedSkill.bonusMaxHp}</span>
                    </div>
                  )}
                </div>
              )}

              <button 
                onClick={(e) => { 
                  e.stopPropagation(); 
                  handleEquip(selectedSkill.id); 
                  setActiveTooltip(null); 
                }}
                className={`w-full py-4 rounded-2xl font-black uppercase italic tracking-widest transition-all active:scale-95 shadow-lg
                  ${equippedIds.includes(selectedSkill.id) 
                    ? 'bg-red-500/20 text-red-500 border border-red-500/30' 
                    : 'bg-orange-500 text-slate-900 shadow-orange-500/20'}`}
              >
                {equippedIds.includes(selectedSkill.id) ? 'Unequip Skill' : 'Equip Skill'}
              </button>

              <button 
                onClick={() => setActiveTooltip(null)}
                className="mt-6 text-[9px] text-slate-500 font-black uppercase tracking-widest hover:text-white"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PassiveSkillView;