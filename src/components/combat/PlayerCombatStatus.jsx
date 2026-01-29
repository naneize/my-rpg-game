import React from 'react';
import { Sword, Shield } from 'lucide-react';
import { MONSTER_SKILLS } from '../../data/passive';

export default function PlayerCombatStatus({ player, playerHpPercent }) {
  return (
    <div className="mt-6 pt-5 border-t border-white/5 relative z-10">
      <div className="flex items-center justify-between w-full gap-3 text-center">
        
        {/* 1. สเตตัสฝั่งซ้าย: LV, ATK, DEF */}
        <div className="flex-1 flex flex-col justify-between py-1 items-start">
          <div className="flex flex-col leading-none text-left">
            <span className="text-[7px] text-blue-400 font-black uppercase tracking-widest mb-0.5">Player Status</span>
            <span className="text-white font-black text-2xl italic leading-none drop-shadow-md">LV.{player.level}</span>
          </div>
          <div className="flex gap-4 text-[13px] font-black uppercase bg-white/5 px-2 py-1.5 rounded-lg border border-white/5 w-fit mt-2">
            <div className="flex items-center gap-1 text-red-400"><Sword size={10} /><span>{player.atk ?? 0}</span></div>
            <div className="flex items-center gap-1 text-blue-400"><Shield size={10} /><span>{player.def ?? 0}</span></div>
          </div>
        </div>

        {/* 2. ส่วนกลาง: HP Bar & EXP Bar */}
        <div className="flex-[1.5] flex flex-col items-center justify-center gap-2 px-2 border-x border-white/5">
          {/* ❤️ HP Bar */}
          <div className="flex flex-col items-center gap-1 w-full">
            <div className="flex justify-between w-full px-1">
              <span className="text-[7px] text-green-500 font-black uppercase tracking-tighter">Vitality</span>
              <span className="font-mono text-[10px] font-bold text-white/90 leading-none">{player.hp} / {player.maxHp}</span>
            </div>
            <div className="w-full h-2 bg-black/60 rounded-full overflow-hidden border border-white/10 shadow-inner">
              <div className="h-full bg-gradient-to-r from-green-500 to-emerald-400 shadow-[0_0_8px_rgba(34,197,94,0.4)] transition-all duration-500" style={{ width: `${playerHpPercent}%` }} />
            </div>
          </div>

          {/* ✨ EXP Bar */}
          <div className="flex flex-col items-center gap-1 w-full">
            <div className="flex justify-between w-full px-1">
              <span className="text-[7px] text-amber-500 font-black uppercase tracking-tighter">Experience</span>
              <span className="font-mono text-[7px] text-amber-200/40 leading-none">{player.exp} / {player.nextLevelExp}</span>
            </div>
            <div className="w-full h-1 bg-black/40 rounded-full overflow-hidden border border-white/5">
              <div 
                className="h-full bg-gradient-to-r from-amber-600 to-yellow-400 transition-all duration-1000" 
                style={{ width: `${(player.exp / (player.nextLevelExp || 100)) * 100}%` }} 
              />
            </div>
          </div>
        </div>

        {/* 3. ฝั่งขวา: ACTIVE PASSIVE SLOTS */}
        <div className="flex flex-col gap-1 pl-2 relative">
          <span className="text-[6px] text-orange-500 font-black uppercase text-center mb-0.5 tracking-tighter">Active</span>
          <div className="flex flex-col gap-1">
            {[0, 1, 2].map((i) => {
              const skillId = player.equippedPassives?.[i];
              const skillData = MONSTER_SKILLS.find(s => s.id === skillId);
              return (
                <div key={i} className="relative group/tooltip">
                  <div className={`w-7 h-7 rounded-lg border flex items-center justify-center transition-all ${skillData ? 'border-orange-500/40 bg-orange-500/10 shadow-[0_0_10px_rgba(245,158,11,0.2)]' : 'border-white/5 bg-white/5 opacity-10'}`}>
                    {skillData ? <span className="text-sm drop-shadow-md cursor-help">{skillData.icon}</span> : <div className="w-1 h-1 bg-white/20 rounded-full" />}
                  </div>

                  {/* 💬 [ส่วนที่เพิ่มกลับเข้ามา] Tooltip แสดงรายละเอียดสกิลเมื่อ Hover */}
                  {skillData && (
                    <div className="absolute right-full mr-3 top-1/2 -translate-y-1/2 w-32 p-2 bg-slate-900 border border-orange-500/50 rounded-xl shadow-2xl pointer-events-none opacity-0 group-hover/tooltip:opacity-100 transition-opacity z-[150] animate-in fade-in slide-in-from-right-1 text-left">
                      <p className="text-[9px] font-black text-orange-400 uppercase leading-none mb-1">
                        {skillData.name}
                      </p>
                      <p className="text-[7px] text-slate-300 italic leading-tight">
                        {skillData.description}
                      </p>
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