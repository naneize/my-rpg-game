import React, { useMemo } from 'react';
import { Shield, Target, Zap, Heart, Lock, CheckCircle2 } from 'lucide-react';

export default function MonsterDetailModal({ monster, inventory, onClose, rarityStyle }) {
  
  // ✅ 1. ตรวจสอบว่าสะสม Artifact ครบทั้งเซตหรือยัง
  const isCompleteSet = useMemo(() => {
    if (!monster.lootTable || monster.lootTable.length === 0) return false;
    
    // เช็คว่าไอเทมทุกชิ้นใน lootTable มีอยู่ใน inventory ของผู้เล่นไหม
    return monster.lootTable.every(loot => 
      inventory.some(invItem => invItem.name === loot.name)
    );
  }, [monster.lootTable, inventory]);

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm" onClick={onClose}>
      <div 
        className={`relative w-full max-w-sm bg-slate-950 border-2 rounded-[2.5rem] overflow-hidden shadow-2xl transition-all ${isCompleteSet ? 'border-amber-500 shadow-amber-500/20' : 'border-slate-800'}`}
        onClick={e => e.stopPropagation()}
      >
        {/* Banner Section */}
        <div className={`h-40 flex items-center justify-center p-6 relative overflow-hidden ${isCompleteSet ? 'bg-amber-500/10' : 'bg-slate-900'}`}>
          {isCompleteSet && (
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-amber-500/20 via-transparent to-transparent animate-pulse" />
          )}
          <img 
            src={monster.image} 
            className={`h-full object-contain drop-shadow-2xl transition-transform duration-700 ${isCompleteSet ? 'scale-110' : ''}`} 
            alt={monster.name} 
          />
        </div>

        <div className="p-8 pt-4 space-y-5">
          {/* Header Info */}
          <div className="text-center">
            <h3 className={`font-black uppercase italic text-2xl tracking-tighter mb-1 ${rarityStyle.text}`}>
              {monster.name}
            </h3>
            <span className="px-3 py-0.5 rounded-full text-[9px] font-black border border-white/10 text-slate-400 uppercase">
              {monster.rarity} • LV.{monster.level}
            </span>
          </div>

          {/* 💎 Artifact Collection Grid */}
          <div className={`p-4 rounded-2xl border transition-all ${isCompleteSet ? 'bg-amber-500/5 border-amber-500/30 shadow-inner' : 'bg-slate-900 border-white/5'}`}>
            <div className="flex justify-between items-center mb-3">
              <p className={`text-[9px] font-black uppercase tracking-widest ${isCompleteSet ? 'text-amber-500' : 'text-slate-500'}`}>
                Collection Artifacts
              </p>
              {isCompleteSet && <CheckCircle2 size={12} className="text-amber-500" />}
            </div>
            
            <div className="grid grid-cols-4 gap-2">
              {monster.lootTable?.map((loot, idx) => {
                const hasItem = inventory.some(inv => inv.name === loot.name);
                return (
                  <div key={idx} className="relative aspect-square">
                    <div className={`w-full h-full rounded-xl border flex items-center justify-center text-xl transition-all
                      ${hasItem 
                        ? 'bg-slate-800 border-white/20 shadow-sm' 
                        : 'bg-black/40 border-white/5 grayscale brightness-50 contrast-125'}`}>
                      {loot.image && (loot.image.startsWith('/') 
                        ? <img src={loot.image} className="w-6 h-6 object-contain" /> 
                        : loot.image)}
                      {!hasItem && <Lock size={10} className="absolute bottom-1 right-1 text-white/20" />}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* 🏆 Collection Bonus Status */}
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
              <h4 className={`text-lg font-black italic uppercase ${isCompleteSet ? 'text-white' : 'text-slate-600'}`}>
                {monster.collectionBonus?.description || 'No Bonus'}
              </h4>
              {!isCompleteSet && (
                <p className="text-[7px] font-bold text-red-500/70 mt-1 uppercase tracking-tighter">
                  (Collect all 4 artifacts to activate)
                </p>
              )}
            </div>
          </div>

          {/* Close Button */}
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