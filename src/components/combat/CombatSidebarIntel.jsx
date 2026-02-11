import React from 'react';
import { Trophy, ScrollText, ShieldAlert, Cpu, Activity, Database } from 'lucide-react';
import { itemMaster } from '../../data/itemData';

/**
 * 🛰️ CombatSidebarIntel: Tactical Hard-Edge Version
 */
export const CombatSidebarIntel = ({ type, worldEvent, logs, enemy, player }) => {

  // 🏆 1. วาด Live Ranking (World Boss Only - Hard-Edge Edition)
  if (type === 'RANKING') {
    return (
      <div className="bg-[#020617]/80 rounded-none p-4 border border-white/10 h-full overflow-hidden shadow-2xl relative flex flex-col font-mono">
        {/* Tactical Corner Decor */}
        <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-amber-500/50" />
        <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-amber-500/50" />

        <div className="flex items-center justify-between mb-4 border-b border-white/10 pb-3 relative z-10">
          <div className="flex items-center gap-2">
            <Trophy size={16} className="text-amber-500 animate-pulse" />
            <h4 className="text-[10px] font-black text-white uppercase italic tracking-[0.2em]">Battle_Rankings</h4>
          </div>
          <span className="text-[8px] font-black text-amber-500/40 uppercase italic animate-pulse tracking-widest">Live_Sync</span>
        </div>

        <div className="space-y-2 relative z-10 overflow-y-auto custom-scrollbar pr-1">
          {worldEvent?.damageDealers && Object.entries(worldEvent.damageDealers)
            .sort(([, a], [, b]) => b - a)
            .slice(0, 5)
            .map(([name, dmg], i) => {
              const isFirst = i === 0;
              return (
                <div key={i} className={`relative p-3 rounded-none transition-all duration-300 border-l-2
                  ${isFirst ? 'bg-amber-500/10 border-amber-500 shadow-[inset_0_0_15px_rgba(245,158,11,0.1)]' : 
                    'bg-white/[0.02] border-white/10 hover:bg-white/[0.05]'}`}>
                  
                  <div className="flex justify-between items-center relative z-10">
                    <div className="flex items-center gap-3">
                      <div className={`w-6 h-6 rounded-none flex items-center justify-center text-[10px] font-black italic border
                        ${isFirst ? 'bg-amber-500 text-slate-950 border-amber-400' : 
                          i === 1 ? 'bg-slate-700 text-white border-slate-500' : 
                          'bg-black/60 text-slate-500 border-white/5'}`}>
                        {i + 1}
                      </div>
                      
                      <div className="flex flex-col leading-none">
                        <span className={`text-[10px] font-black uppercase italic truncate max-w-[90px] mb-1
                          ${isFirst ? 'text-amber-400' : 'text-slate-300'}`}>
                          {name}
                        </span>
                        <span className="text-[6px] font-black text-white/10 uppercase tracking-widest">
                          {isFirst ? 'OP_RANK: MASTER' : 'OP_RANK: ELITE'}
                        </span>
                      </div>
                    </div>

                    <div className="text-right leading-none">
                      <p className={`text-[11px] font-black font-mono tracking-tighter
                        ${isFirst ? 'text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.3)]' : 'text-slate-500'}`}>
                        {dmg.toLocaleString()}
                      </p>
                      <p className="text-[6px] font-black text-white/10 uppercase mt-1">Damage_Value</p>
                    </div>
                  </div>
                </div>
              );
            })}
        </div>

        <div className="mt-auto pt-4 border-t border-white/10 flex flex-col items-center gap-2">
          <div className="flex gap-2">
            <div className="w-1.5 h-1.5 bg-amber-500 animate-pulse" />
            <div className="w-1.5 h-1.5 bg-amber-500/40" />
            <div className="w-1.5 h-1.5 bg-amber-500/10" />
          </div>
          <p className="text-[8px] font-black text-amber-500/60 uppercase italic tracking-[0.5em] animate-pulse">
            APEX_PREDATORS_LINKED
          </p>
        </div>
      </div>
    );
  }

  // 📜 2. วาด Combat Intel (Logs - Hard-Edge Edition)
  if (type === 'LOGS') {
    return (
      <div className="bg-black/60 rounded-none p-5 border border-white/10 h-full flex flex-col shadow-2xl relative overflow-hidden font-mono">
        <div className="absolute top-0 right-0 p-2">
           <Activity size={12} className="text-blue-500/30" />
        </div>
        <div className="flex items-center gap-3 mb-4 border-b border-white/10 pb-3">
          <ScrollText size={18} className="text-blue-500" />
          <h4 className="text-[10px] font-black text-white uppercase italic tracking-[0.3em]">Combat_Intel_Logs</h4>
        </div>
        <div className="flex-1 overflow-y-auto space-y-2 custom-scrollbar text-[10px] italic text-slate-500 touch-pan-y">
          {logs?.slice(0, 25).map((log, i) => (
            <div key={i} className="flex gap-3 border-l border-white/5 pl-3 group hover:border-blue-500/50 transition-colors">
               <span className="text-blue-500/30 font-black">[{i}]</span>
               <p className="leading-relaxed group-hover:text-slate-300">{log}</p>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // 🛡️ 3. วาด Monster Drops (Loot Table - Hard-Edge Edition)
  if (type === 'LOOT') {
    return (
      <div className="bg-black/60 rounded-none p-5 border border-white/10 h-full shadow-2xl overflow-hidden flex flex-col font-mono">
        <div className="flex items-center gap-3 mb-4 border-b border-white/10 pb-3 flex-none relative">
          <ShieldAlert size={18} className="text-emerald-500" />
          <h4 className="text-[10px] font-black text-white uppercase italic tracking-[0.3em]">Drop_Analysis_Matrix</h4>
          <Cpu size={14} className="absolute right-0 text-white/5" />
        </div>
        <div className="space-y-2 overflow-y-auto flex-1 pr-2 custom-scrollbar touch-pan-y">
          {enemy?.lootTable?.map((lootItem, idx) => {
            const itemInfo = itemMaster[lootItem.id];
            return (
              <div key={idx} className="flex justify-between items-center bg-white/[0.03] p-3 rounded-none border border-white/5 group hover:border-emerald-500/30 transition-all">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 flex items-center justify-center bg-black/60 rounded-none border border-white/10 overflow-hidden shrink-0 group-hover:border-emerald-500/20">
                    {itemInfo?.image && itemInfo.image.startsWith('/') ? (
                      <img 
                        src={itemInfo.image} 
                        alt="" 
                        className="w-full h-full object-contain p-2 drop-shadow-[0_0_8px_rgba(255,255,255,0.1)] transition-transform group-hover:scale-110" 
                      />
                    ) : (
                      <span className="text-lg">{itemInfo?.image || '📦'}</span>
                    )}
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[10px] text-white font-black uppercase italic tracking-widest group-hover:text-emerald-400">
                      {itemInfo?.name || lootItem.id}
                    </span>
                    <span className="text-[7px] text-slate-600 font-black uppercase tracking-tighter mt-1">
                      {itemInfo?.rarity || 'MAT_TYPE: NORMAL'}
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-[11px] font-mono text-emerald-500 font-black italic block">
                    {(lootItem.chance * 100).toFixed(1)}%
                  </span>
                  <span className="text-[6px] text-slate-700 font-black uppercase tracking-widest">Sync_Rate</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  return null;
};