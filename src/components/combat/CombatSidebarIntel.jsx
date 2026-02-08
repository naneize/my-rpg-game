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

  // 🏆 1. วาด Live Ranking (World Boss Only - Compact Elite Edition)
if (type === 'RANKING') {
  return (
    <div className="bg-slate-950/60 rounded-[2rem] p-4 border border-white/5 h-full overflow-hidden shadow-2xl relative flex flex-col">
      {/* 🎇 Background Deco - ลดขนาดลง */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-16 bg-amber-500/5 blur-[30px] pointer-events-none" />

      <div className="flex items-center justify-between mb-3 border-b border-white/10 pb-2 relative z-10">
        <div className="flex items-center gap-1.5">
          <Trophy size={14} className="text-amber-500 animate-pulse" />
          <h4 className="text-[9px] font-black text-white uppercase italic tracking-wider">Battle Rankings</h4>
        </div>
        <span className="text-[7px] font-black text-amber-500/50 uppercase italic animate-pulse tracking-tighter">Live Update !</span>
      </div>

      <div className="space-y-1.5 relative z-10 overflow-y-auto custom-scrollbar pr-1">
        {worldEvent?.damageDealers && Object.entries(worldEvent.damageDealers)
          .sort(([, a], [, b]) => b - a)
          .slice(0, 3)
          .map(([name, dmg], i) => {
            const isFirst = i === 0;
            return (
              <div key={i} className={`relative p-2 rounded-xl transition-all duration-300 border
                ${isFirst ? 'bg-gradient-to-r from-amber-500/20 to-transparent border-amber-500/40 shadow-[0_0_15px_rgba(245,158,11,0.15)]' : 
                  'bg-white/[0.02] border-white/5'}`}>
                
                {/* 👑 ออร่าจ่าฝูง - ปรับให้เล็กลงไม่กวนพื้นที่ */}
                {isFirst && (
                  <div className="absolute inset-0 bg-amber-500/5 blur-md pointer-events-none" />
                )}

                <div className="flex justify-between items-center relative z-10">
                  <div className="flex items-center gap-2">
                    {/* Badge เล็กลง */}
                    <div className={`w-6 h-6 rounded-lg flex items-center justify-center text-[10px] font-black italic
                      ${isFirst ? 'bg-amber-500 text-slate-950 shadow-lg shadow-amber-500/20' : 
                        i === 1 ? 'bg-slate-400 text-slate-950' : 
                        'bg-orange-700 text-white'}`}>
                      {i + 1}
                    </div>
                    
                    <div className="flex flex-col leading-tight">
                      <div className="flex items-center gap-1">
                        <span className={`text-[10px] font-black uppercase italic truncate max-w-[80px]
                          ${isFirst ? 'text-amber-400' : 'text-slate-300'}`}>
                          {name}
                        </span>
                      </div>
                      <span className="text-[6px] font-black text-white/20 uppercase tracking-tighter">
                        {isFirst ? 'Master' : 'Elite'}
                      </span>
                    </div>
                  </div>

                  <div className="text-right leading-tight">
                    <p className={`text-[10px] font-black font-mono
                      ${isFirst ? 'text-white' : 'text-slate-400'}`}>
                      {dmg.toLocaleString()}
                    </p>
                    <p className="text-[5px] font-black text-white/20 uppercase">Damage</p>
                  </div>
                </div>
              </div>
            );
          })}
      </div>

      {/* 🎖️ Footer Signature - APEX PREDATORS Edition */}
<div className="mt-2 pt-2 border-t border-white/5 flex flex-col items-center gap-1">
  <div className="flex gap-1.5">
    {/* จุดไฟวิ่งเล็กๆ ให้ดูมีพลัง */}
    <div className="w-1 h-1 rounded-full bg-amber-500 animate-pulse" />
    <div className="w-1 h-1 rounded-full bg-amber-500/40" />
    <div className="w-1 h-1 rounded-full bg-amber-500/10" />
  </div>
  
  {/* ข้อความ APEX PREDATORS ที่กระพริบนิดๆ */}
  <p className="text-[7px] font-black text-amber-500/60 uppercase italic tracking-[0.3em] animate-pulse">
    APEX PREDATORS
  </p>
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