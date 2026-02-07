import React from 'react';
import { Trophy, ScrollText, ShieldAlert } from 'lucide-react';
import { itemMaster } from '../../data/itemData';

/**
 * Component สำหรับแสดงข้อมูล Intel ข้างสนามรบ
 * @param {string} type - ประเภทของข้อมูล ('RANKING', 'LOGS', 'LOOT')
 * @param {object} worldEvent - ข้อมูล World Boss (สำหรับ Ranking)
 * @param {array} logs - รายการ Combat Logs
 * @param {object} enemy - ข้อมูลมอนสเตอร์ (สำหรับ Loot Table)
 * @param {object} player - ข้อมูลผู้เล่น (สำหรับเช็คอันดับตัวเอง)
 */
export const CombatSidebarIntel = ({ type, worldEvent, logs, enemy, player }) => {

  // 🏆 1. วาด Live Ranking (World Boss Only)
  if (type === 'RANKING') {
    return (
      <div className="bg-amber-950/40 rounded-3xl p-5 border border-amber-500/30 h-full overflow-y-auto custom-scrollbar shadow-inner">
        <div className="flex items-center gap-2 mb-4 border-b border-amber-500/20 pb-2">
          <Trophy size={18} className="text-amber-500 animate-bounce" />
          <h4 className="text-xs font-black text-amber-500 uppercase italic tracking-widest">Live Ranking</h4>
        </div>
        <div className="space-y-2">
          {worldEvent?.damageDealers && Object.entries(worldEvent.damageDealers)
            .sort(([, a], [, b]) => b - a).slice(0, 10) 
            .map(([name, dmg], i) => (
              <div key={i} className={`flex justify-between p-3 rounded-xl ${name === player?.name ? 'bg-amber-500/20 border border-amber-500/40' : 'bg-black/40'}`}>
                <span className="text-xs text-white">#{i + 1} {name}</span>
                <span className="text-xs font-mono text-amber-500">{dmg.toLocaleString()}</span>
              </div>
            ))}
        </div>
      </div>
    );
  }

  // 📜 2. วาด Combat Intel (Logs)
  if (type === 'LOGS') {
    return (
      <div className="bg-black/40 rounded-3xl p-5 border border-white/5 h-full flex flex-col shadow-inner overflow-hidden">
        <div className="flex items-center gap-2 mb-4 border-b border-white/10 pb-2">
          <ScrollText size={18} className="text-blue-400" />
          <h4 className="text-xs font-black text-white uppercase italic tracking-widest">Combat Intel</h4>
        </div>
        <div className="flex-1 overflow-y-auto space-y-2 custom-scrollbar text-[11px] italic text-slate-400 touch-pan-y">
          {logs?.slice(0, 20).map((log, i) => (
            <p key={i} className="border-l-2 border-slate-700 pl-2">{log}</p>
          ))}
        </div>
      </div>
    );
  }

  // 🛡️ 3. วาด Monster Drops (Loot Table)
  if (type === 'LOOT') {
    return (
      <div className="bg-black/40 rounded-3xl p-5 border border-white/5 h-full shadow-inner overflow-hidden flex flex-col">
        <div className="flex items-center gap-2 mb-4 border-b border-white/10 pb-2 flex-none">
          <ShieldAlert size={18} className="text-emerald-400" />
          <h4 className="text-xs font-black text-white uppercase italic tracking-widest">Monster Drops</h4>
        </div>
        <div className="space-y-2 overflow-y-auto flex-1 pr-2 custom-scrollbar touch-pan-y">
          {enemy?.lootTable?.map((lootItem, idx) => {
            const itemInfo = itemMaster[lootItem.id];
            return (
              <div key={idx} className="flex justify-between items-center bg-white/5 p-3 rounded-xl border border-white/5 shrink-0">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 flex items-center justify-center bg-black/40 rounded-lg border border-white/5 overflow-hidden shrink-0">
                    {itemInfo?.image && itemInfo.image.startsWith('/') ? (
                      <img 
                        src={itemInfo.image} 
                        alt="" 
                        className="w-full h-full object-contain p-1.5 drop-shadow-[0_0_5px_rgba(255,255,255,0.1)]" 
                      />
                    ) : (
                      <span className="text-sm">{itemInfo?.image || '📦'}</span>
                    )}
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[10px] text-white font-black uppercase italic tracking-wider">
                      {itemInfo?.name || lootItem.id}
                    </span>
                    <span className="text-[8px] text-slate-500 font-bold uppercase">
                      {itemInfo?.rarity || 'Material'}
                    </span>
                  </div>
                </div>
                <div className="flex flex-col items-end">
                  <span className="text-[10px] font-mono text-emerald-400 font-black italic">
                    {(lootItem.chance * 100).toFixed(1)}%
                  </span>
                  <span className="text-[7px] text-slate-600 font-bold uppercase">Rate</span>
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