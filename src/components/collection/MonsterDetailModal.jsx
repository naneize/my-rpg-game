import React, { useState, useMemo } from 'react';
import { Shield, Target, Zap, Heart, Lock, CheckCircle2 } from 'lucide-react';

export default function MonsterDetailModal({ monster, inventory, collection, onClose, rarityStyle }) {
  
  // ✅ [คงเดิม] สำหรับจัดการ Tooltip
  const [activeTooltip, setActiveTooltip] = useState(null);

  // ✅ [คงเดิม] ตรวจสอบความครบถ้วนของเซต
  const isCompleteSet = useMemo(() => {
    if (!monster.lootTable || monster.lootTable.length === 0) return false;
    const monsterCollection = collection?.[monster.id] || [];
    return monster.lootTable.every(loot => 
      monsterCollection.includes(loot.name)
    );
  }, [monster.lootTable, collection, monster.id]);

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm" 
      onClick={() => {
        if (activeTooltip !== null) setActiveTooltip(null);
        else onClose();
      }}>
      
      <div 
        className={`relative w-full max-w-sm bg-slate-950 border-2 rounded-[2.5rem] overflow-hidden shadow-2xl transition-all ${isCompleteSet ? 'border-amber-500 shadow-amber-500/20' : 'border-slate-800'}`}
        onClick={e => {
          e.stopPropagation();
          setActiveTooltip(null); 
        }}
      >
        {/* Banner Section */}
        <div className={`h-40 flex items-center justify-center p-6 relative overflow-hidden ${isCompleteSet ? 'bg-amber-500/10' : 'bg-slate-900'}`}>
          {isCompleteSet && (
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-amber-500/20 via-transparent to-transparent animate-pulse" />
          )}
          
          {/* ✅ [แก้ไขจุดอันตราย] เพิ่ม Type Check กัน Error startsWith จ่ะ */}
          {monster.image && typeof monster.image === 'string' && monster.image.startsWith('/') ? (
            <img 
              src={monster.image} 
              className={`h-full object-contain drop-shadow-2xl transition-transform duration-700 ${isCompleteSet ? 'scale-110' : ''}`} 
              alt={monster.name} 
            />
          ) : (
            <span className={`text-7xl transition-transform duration-700 ${isCompleteSet ? 'scale-125' : ''}`}>
              {monster.image || monster.icon || "👾"}
            </span>
          )}
        </div>

        <div className="p-8 pt-4 space-y-5">
          {/* Header Info (คงเดิม 100%) */}
          <div className="text-center">
            <h3 className={`font-black uppercase italic text-2xl tracking-tighter mb-1 ${rarityStyle.text}`}>
              {monster.name}
            </h3>
            <span className="px-3 py-0.5 rounded-full text-[9px] font-black border border-white/10 text-slate-400 uppercase">
              {monster.rarity} • LV.{monster.level}
            </span>
          </div>

          {/* 💎 Artifact Collection Grid (คงเดิม 100% พร้อมแก้ startsWith) */}
          <div className={`p-4 rounded-2xl border transition-all ${isCompleteSet ? 'bg-amber-500/5 border-amber-500/30 shadow-inner' : 'bg-slate-900 border-white/5'}`}>
            <div className="flex justify-between items-center mb-3">
              <p className={`text-[9px] font-black uppercase tracking-widest ${isCompleteSet ? 'text-amber-500' : 'text-slate-500'}`}>
                Collection Artifacts
              </p>
              {isCompleteSet && <CheckCircle2 size={12} className="text-amber-500" />}
            </div>
            
            <div className="grid grid-cols-4 gap-2">
              {monster.lootTable?.map((loot, idx) => {
                const hasItem = collection?.[monster.id]?.includes(loot.name);
                const isTooltipOpen = activeTooltip === idx;

                return (
                  <div key={idx} className="relative aspect-square">
                    {isTooltipOpen && (
                      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-28 z-[110] animate-in fade-in zoom-in duration-200 pointer-events-none">
                        <div className="bg-slate-900 border border-slate-700 p-2 rounded-xl shadow-2xl text-center">
                          <p className="text-[9px] font-bold text-white truncate mb-0.5">{loot.name}</p>
                          <p className={`text-[7px] font-black uppercase mb-1 
                            ${loot.rarity === 'Legendary' ? 'text-orange-400' : 
                              loot.rarity === 'Epic' ? 'text-purple-400' : 
                              loot.rarity === 'Rare' ? 'text-blue-400' : 'text-slate-400'}`}>
                            {loot.rarity || 'Common'}
                          </p>
                          <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-slate-900" />
                        </div>
                      </div>
                    )}

                    <div 
                      onClick={(e) => {
                        e.stopPropagation();
                        setActiveTooltip(isTooltipOpen ? null : idx);
                      }}
                      className={`w-full h-full rounded-xl border flex items-center justify-center text-xl transition-all cursor-pointer
                        ${hasItem 
                          ? 'bg-slate-800 border-white/20 shadow-sm' 
                          : 'bg-black/40 border-white/5 '}`}>
                      
                      {/* ✅ [แก้ไขจุดอันตราย] เพิ่ม Type Check สำหรับรูปภาพไอเทมดรอปจ่ะ */}
                      {loot.image && (typeof loot.image === 'string' && loot.image.startsWith('/') 
                        ? <img src={loot.image} className="w-6 h-6 object-contain" alt={loot.name} /> 
                        : loot.image)}
                        
                      {!hasItem && <Lock size={10} className="absolute bottom-1 right-1 text-white/20" />}
                      {isTooltipOpen && <div className="absolute inset-0 rounded-xl border-2 border-amber-500/50 animate-pulse" />}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* 🏆 Collection Bonus Status (คงเดิม 100% ตามที่เธอต้องการ) */}
          <div className={`relative p-4 rounded-2xl border-2 transition-all duration-500 overflow-hidden
            ${isCompleteSet 
              ? 'bg-gradient-to-br from-amber-600 to-orange-700 border-amber-400 shadow-lg shadow-amber-900/40' 
              : 'bg-slate-900 border-slate-800 opacity-60'}`}>
            
            {isCompleteSet && (
              <div className="absolute top-0 right-0 p-2 opacity-20">
                <Zap size={40} className="text-white" />
              </div>
            )}

            <div className="flex flex-col items-center text-center relative z-10">
              <p className={`text-[8px] font-bold uppercase tracking-[0.2em] mb-1 ${isCompleteSet ? 'text-amber-200' : 'text-slate-500'}`}>
                Permanent Set Bonus
              </p>
              
              <div className="flex flex-col items-center">
                {isCompleteSet ? (
                  Object.entries(monster.collectionBonus || {}).map(([stat, value]) => (
                    <h4 key={stat} className="text-lg font-black italic uppercase text-white drop-shadow-md">
                      {stat} +{value}
                    </h4>
                  ))
                ) : (
                  <h4 className="text-lg font-black italic uppercase text-slate-600">
                    No Bonus Active
                  </h4>
                )}
              </div>

              {!isCompleteSet && (
                <p className="text-[7px] font-bold text-red-500/70 mt-1 uppercase tracking-tighter">
                  (Collect all {monster.lootTable?.length || 4} artifacts to activate)
                </p>
              )}
            </div>
          </div>

          {/* Close Button (คงเดิม 100%) */}
          <button 
            onClick={onClose}
            className="w-full py-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 text-slate-400 text-[10px] font-black uppercase tracking-[0.3em] transition-all"
          >
            Close Archive
          </button>
        </div>
      </div>
    </div>
  );
}