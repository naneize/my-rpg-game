import React from 'react';
import { Sword, Shield } from 'lucide-react';
import { MONSTER_SKILLS } from '../../data/passive';

export default function PlayerCombatStatus({ player, playerHpPercent, activePassiveTooltip, setActivePassiveTooltip }) {
  return (
    // ✅ ย่น mt-6 -> mt-2 และ pt-5 -> pt-2 เพื่อลดช่องว่างบนมือถือ
    <div className="mt-2 pt-2 border-t border-white/5 relative z-10">
      <div className="flex items-center justify-between w-full gap-2 text-center">
        
        {/* 1. สเตตัสฝั่งซ้าย: ย่นระยะห่างและขนาดตัวอักษรเล็กน้อย */}
        <div className="flex-1 flex flex-col justify-between py-0.5 items-start">
          <div className="flex flex-col leading-none text-left">
            <span className="text-[6px] text-blue-400 font-black uppercase tracking-widest mb-0.5">Player Status</span>
            <span className="text-white font-black text-xl italic leading-none drop-shadow-md">LV.{player.level}</span>
          </div>
          {/* ย่น gap-4 -> gap-2 และ py-1.5 -> py-1 */}
          <div className="flex gap-2 text-[11px] font-black uppercase bg-white/5 px-1.5 py-1 rounded-lg border border-white/5 w-fit mt-1.5">
            <div className="flex items-center gap-1 text-red-400"><Sword size={9} /><span>{player.atk ?? 0}</span></div>
            <div className="flex items-center gap-1 text-blue-400"><Shield size={9} /><span>{player.def ?? 0}</span></div>
          </div>
        </div>

        {/* 2. ส่วนกลาง: HP Bar & EXP Bar (คงเดิมแต่ย่น Gap) */}
        <div className="flex-[1.5] flex flex-col items-center justify-center gap-1.5 px-2 border-x border-white/5">
          {/* ❤️ HP Bar */}
          <div className="flex flex-col items-center gap-0.5 w-full">
            <div className="flex justify-between w-full px-1">
              <span className="text-[6px] text-green-500 font-black uppercase tracking-tighter">Vitality</span>
              <span className="font-mono text-[9px] font-bold text-white/90 leading-none">{player.hp}/{player.maxHp}</span>
            </div>
            <div className="w-full h-1.5 bg-black/60 rounded-full overflow-hidden border border-white/10 shadow-inner">
              <div className="h-full bg-gradient-to-r from-green-500 to-emerald-400" style={{ width: `${playerHpPercent}%` }} />
            </div>
          </div>

          {/* ✨ EXP Bar */}
          <div className="flex flex-col items-center gap-0.5 w-full">
            <div className="flex justify-between w-full px-1">
              <span className="text-[6px] text-amber-500 font-black uppercase tracking-tighter">Experience</span>
              <span className="font-mono text-[6px] text-amber-200/40 leading-none">{player.exp}/{player.nextLevelExp}</span>
            </div>
            <div className="w-full h-1 bg-black/40 rounded-full overflow-hidden border border-white/5">
              <div 
                className="h-full bg-gradient-to-r from-amber-600 to-yellow-400" 
                style={{ width: `${(player.exp / (player.nextLevelExp || 100)) * 100}%` }} 
              />
            </div>
          </div>
        </div>

        {/* 3. ฝั่งขวา: ACTIVE PASSIVE SLOTS (ย่นขนาด Slot ลง) */}
        <div className="flex flex-col gap-0.5 pl-1 relative">
          <span className="text-[6px] text-orange-500 font-black uppercase text-center mb-0.5 tracking-tighter">Active</span>
          <div className="flex flex-col gap-1">
            {[0, 1, 2].map((i) => {
              const skillId = player.equippedPassives?.[i];
              const skillData = MONSTER_SKILLS.find(s => s.id === skillId);
              const isActive = activePassiveTooltip === `active-${i}`;

              return (
                <div 
                  key={i} 
                  className="relative group/tooltip"
                  onClick={(e) => {
                    if (skillData && setActivePassiveTooltip) {
                      e.stopPropagation();
                      setActivePassiveTooltip(isActive ? null : `active-${i}`);
                    }
                  }}
                >
                  {/* ย่นขนาด w-7 h-7 -> w-6 h-6 */}
                  <div className={`w-6 h-6 rounded-md border flex items-center justify-center transition-all ${skillData ? 'border-orange-500/40 bg-orange-500/10' : 'border-white/5 bg-white/5 opacity-10'}`}>
                    {skillData ? <span className="text-xs drop-shadow-md cursor-help">{skillData.icon}</span> : <div className="w-1 h-1 bg-white/20 rounded-full" />}
                  </div>

                  {skillData && (
                    <div className={`absolute right-full mr-3 top-1/2 -translate-y-1/2 w-32 p-2 bg-slate-900 border border-orange-500/50 rounded-xl shadow-2xl transition-all z-[150] pointer-events-none text-left
                      ${isActive ? 'opacity-100 translate-x-0 scale-100' : 'opacity-0 translate-x-1 scale-95 group-hover/tooltip:opacity-100 group-hover/tooltip:translate-x-0 group-hover/tooltip:scale-100'}
                    `}>
                      <p className="text-[9px] font-black text-orange-400 uppercase leading-none mb-1">{skillData.name}</p>
                      <p className="text-[7px] text-slate-300 italic leading-tight">{skillData.description}</p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}