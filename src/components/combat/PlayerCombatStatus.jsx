import React from 'react';
import { Sword, Shield, Search, Activity, Cpu } from 'lucide-react'; 
import { MONSTER_SKILLS } from '../../data/passive';

export default function PlayerCombatStatus({ player, playerHpPercent, activePassiveTooltip, setActivePassiveTooltip }) {
  
  // ✅ แปลงเปอร์เซ็นต์เลือดให้เป็นทศนิยมเพื่อความนุ่มนวล
  const displayPlayerHpPercent = parseFloat(playerHpPercent).toFixed(2);

  // 🛡️ กำหนดค่าที่จะนำมาแสดงผล (ซิงค์ตาม CombatView)
  const currentAtk = player.displayAtk ?? player.atk ?? 0;
  const currentDef = player.displayDef ?? player.def ?? 0;

  return (
    <div className="mt-2 pt-2 border-t border-white/10 relative z-10 px-4 font-mono"> 
      <div className="flex items-center justify-between w-full gap-4">
        
        {/* 1. LEFT ZONE: COMMANDER STATUS (เหลี่ยมจัด ประหยัดพื้นที่) */}
        <div className="flex flex-col shrink-0 min-w-[80px]">
          <div className="flex items-baseline gap-1 mb-1 bg-white/5 px-2 py-0.5 border-l-2 border-amber-500">
            <span className="text-[7px] text-amber-500 font-black uppercase tracking-tighter opacity-70 italic">RANK</span>
            <span className="text-white font-black text-sm italic leading-none">LV.{player.level}</span>
          </div>
          
          <div className="grid grid-cols-2 gap-1">
             {/* ⚔️ ATK STATUS */}
             <div className={`flex items-center gap-1 px-1.5 py-1 bg-black/40 border-l border-white/10 transition-all duration-300 
               ${currentAtk < (player.atk || 0) ? 'text-rose-500 animate-pulse' : 'text-red-500'}`}>
                <Sword size={8} />
                <span className="text-[10px] font-black italic tabular-nums">{currentAtk}</span>
             </div>
             {/* 🛡️ DEF STATUS */}
             <div className={`flex items-center gap-1 px-1.5 py-1 bg-black/40 border-l border-white/10 transition-all duration-300 
               ${currentDef < (player.def || 0) ? 'text-rose-500 animate-pulse' : 'text-blue-400'}`}>
                <Shield size={8} />
                <span className="text-[10px] font-black italic tabular-nums">{currentDef}</span>
             </div>
          </div>

          <button 
            onClick={(e) => {
              e.stopPropagation();
              setActivePassiveTooltip('VIEW_ALL'); 
            }}
            className="mt-1.5 flex items-center justify-center gap-1.5 px-2 py-1 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 rounded-none transition-all active:scale-95 group"
          >
            <Cpu size={8} className="text-emerald-400 group-hover:rotate-90 transition-transform" />
            <span className="text-[7px] font-black text-emerald-400 uppercase tracking-widest italic">NEURAL_PASSIVE</span>
          </button>
        </div>

        {/* 2. CENTER ZONE: VITALITY MONITOR (Compact Flat Bars) */}
        <div className="flex-1 flex flex-col gap-2.5 px-4 border-x border-white/10">
          {/* HP BAR */}
          <div className="flex flex-col w-full">
            <div className="flex justify-between items-end w-full mb-1">
              <div className="flex items-center gap-1.5">
                <Activity size={8} className="text-emerald-500 animate-pulse" />
                <span className="text-[7px] text-emerald-500 font-black uppercase tracking-widest italic">BIO_INTEGRITY</span>
              </div>
              <span className="font-mono text-[9px] font-black text-white leading-none tracking-tighter tabular-nums italic">
                {player.hp} <span className="text-slate-600">/</span> {player.maxHp}
              </span>
            </div>
            <div className="w-full h-2 bg-black/60 rounded-none overflow-hidden border border-white/5 relative p-[1px]">
              <div className="h-full bg-gradient-to-r from-emerald-600 via-emerald-400 to-emerald-600 hp-bar-transition relative z-10" style={{ width: `${displayPlayerHpPercent}%` }} />
              {/* Scale marks */}
              <div className="absolute inset-0 z-20 flex justify-between px-1 opacity-20 pointer-events-none">
                 {[...Array(5)].map((_, i) => <div key={i} className="w-px h-full bg-black" />)}
              </div>
            </div>
          </div>

          {/* EXP BAR */}
          <div className="flex flex-col w-full opacity-80">
            <div className="flex justify-between items-end w-full mb-0.5">
              <span className="text-[7px] text-amber-500 font-black uppercase tracking-widest italic leading-none pl-1">EXP_LINK</span>
              <span className="font-mono text-[8px] text-amber-200/50 leading-none tabular-nums italic">{player.exp} / {player.nextLevelExp}</span>
            </div>
            <div className="w-full h-1 bg-black/40 rounded-none overflow-hidden border border-white/5 relative">
              <div className="h-full bg-gradient-to-r from-amber-600 to-yellow-500 transition-all duration-700" style={{ width: `${(player.exp / (player.nextLevelExp || 100)) * 100}%` }} />
            </div>
          </div>
        </div>

        {/* 3. RIGHT ZONE: ACTIVE NEURAL CORE (Square Matrix) */}
        <div className="flex flex-col gap-1.5 shrink-0 items-center min-w-[32px]">
          <span className="text-[6px] text-slate-500 font-black uppercase tracking-widest italic leading-none mb-0.5">SYMBOLS</span>
          <div className="flex flex-col gap-1">
            {[0, 1, 2].map((i) => {
              const skillId = player.equippedPassives?.[i];
              const skillData = MONSTER_SKILLS.find(s => s.id === skillId);
              return (
                <div key={i} className={`w-6 h-6 rounded-none border transition-all duration-300 flex items-center justify-center
                  ${skillData ? 'border-emerald-500/50 bg-emerald-500/10 shadow-[0_0_8px_rgba(16,185,129,0.2)]' : 'border-white/5 bg-black/40 opacity-20'}`}>
                  {skillData ? <span className="text-xs drop-shadow-md">{skillData.icon}</span> : <div className="w-0.5 h-0.5 bg-white/20" />}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* CENTER MODAL DETAIL (Hard-Edge Tactical Window) */}
      {activePassiveTooltip === 'VIEW_ALL' && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-6 font-mono">
          <div className="absolute inset-0 bg-slate-950/90 backdrop-blur-sm" onClick={() => setActivePassiveTooltip(null)} />
          <div className="relative w-full max-w-[320px] bg-slate-900 border-2 border-emerald-500/40 rounded-none p-1 shadow-2xl">
            {/* Modal Corners */}
            <div className="absolute top-0 left-0 w-6 h-6 border-t-2 border-l-2 border-emerald-500" />
            <div className="absolute bottom-0 right-0 w-6 h-6 border-b-2 border-r-2 border-emerald-500" />
            
            <div className="bg-black/60 p-6 max-h-[75vh] overflow-y-auto custom-scrollbar">
               <h3 className="text-emerald-400 font-black text-[10px] uppercase tracking-[0.4em] mb-6 text-center italic border-b border-emerald-500/20 pb-3 flex items-center justify-center gap-2">
                 <Cpu size={12} /> ACTIVE_NEURAL_LOG
               </h3>
               
               <div className="space-y-4">
                 {player.equippedPassives.map((skillId, idx) => {
                   const skill = MONSTER_SKILLS.find(s => s.id === skillId);
                   if (!skill) return null;
                   return (
                     <div key={idx} className="flex gap-4 p-3 bg-white/5 border-l-2 border-emerald-500/50 transition-all hover:bg-white/10">
                        <div className="w-10 h-10 shrink-0 rounded-none bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-xl">{skill.icon}</div>
                        <div className="min-w-0">
                           <p className="text-[10px] font-black text-white uppercase italic leading-none mb-1.5">{skill.name}</p>
                           <p className="text-[9px] text-slate-500 leading-tight italic">"{skill.description}"</p>
                        </div>
                     </div>
                   );
                 })}
               </div>

               <button 
                 onClick={() => setActivePassiveTooltip(null)} 
                 className="w-full mt-8 py-4 bg-emerald-600 text-white font-black text-[10px] uppercase tracking-[0.3em] rounded-none shadow-[0_4px_15px_rgba(16,185,129,0.3)] hover:bg-emerald-500 active:scale-95 transition-all"
               >
                 CLOSE_STREAM
               </button>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        .hp-bar-transition { transition: width 0.8s cubic-bezier(0.16, 1, 0.3, 1); }
        .custom-scrollbar::-webkit-scrollbar { width: 3px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(16, 185, 129, 0.2); }
      `}</style>
    </div>
  );
}