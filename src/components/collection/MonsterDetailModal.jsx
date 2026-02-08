import React, { useState, useMemo } from 'react';
import { Shield, Target, Zap, Heart, Lock, CheckCircle2, Skull, Cpu, X } from 'lucide-react';

export default function MonsterDetailModal({ 
  monster, 
  inventory, 
  collection, 
  killCount, 
  onClose, 
  rarityStyle 
}) {
  
  const [activeTooltip, setActiveTooltip] = useState(null);
  const currentKills = killCount || 0;
  const masteryTarget = 100;
  const masteryProgress = Math.min((currentKills / masteryTarget) * 100, 100);
  const isMastered = currentKills >= masteryTarget;

  const artifactsOnly = useMemo(() => {
    return (monster.lootTable || []).filter(loot => 
      loot.type !== 'SKILL' && loot.type !== 'EQUIPMENT' && !loot.slot
    );
  }, [monster.lootTable]);

  const isCompleteSet = useMemo(() => {
    if (artifactsOnly.length === 0) return false;
    const monsterCollection = collection?.[monster.id] || [];
    return artifactsOnly.every(loot => monsterCollection.includes(loot.name));
  }, [artifactsOnly, collection, monster.id]);

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md" 
      onClick={() => {
        if (activeTooltip !== null) setActiveTooltip(null);
        else onClose();
      }}>
      
      {/* 📱 ปรับขนาด Modal ให้สมดุลขึ้น (max-w-360px) */}
      <div 
        className={`relative w-full max-w-[360px] bg-slate-950 border-2 rounded-[2.5rem] overflow-hidden shadow-2xl transition-all duration-500 flex flex-col max-h-[95vh] ${isCompleteSet ? 'border-amber-500 shadow-amber-500/20' : 'border-slate-800'}`}
        onClick={e => {
          e.stopPropagation();
          setActiveTooltip(null); 
        }}
      >
        {/* Banner Section - ปรับความสูงให้พอดี */}
        <div className={`h-36 flex items-center justify-center p-6 relative overflow-hidden ${isCompleteSet ? 'bg-amber-500/10' : 'bg-slate-900/50'}`}>
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-slate-950/60" />
          
          {monster.image && typeof monster.image === 'string' && monster.image.startsWith('/') ? (
            <img 
              src={monster.image} 
              className={`h-full object-contain drop-shadow-[0_0_20px_rgba(0,0,0,0.5)] transition-transform duration-700 ${isMastered ? 'scale-110' : ''}`} 
              alt={monster.name} 
            />
          ) : (
            <span className={`text-6xl transition-transform duration-700 ${isMastered ? 'scale-110' : ''}`}>
              {monster.image || "👾"}
            </span>
          )}

          {isMastered && (
            <div className="absolute top-4 left-4 bg-amber-500 text-slate-950 px-2 py-0.5 rounded-lg font-black text-[8px] uppercase tracking-tighter shadow-lg animate-pulse">
              Mastered
            </div>
          )}
          
          <button onClick={onClose} className="absolute top-4 right-4 p-2 bg-black/40 rounded-full text-white/50 hover:text-white transition-colors">
            <X size={16} />
          </button>
        </div>

        <div className="p-6 pt-6 space-y-1 overflow-y-auto custom-scrollbar">
          {/* Header */}
          <div className="text-center space-y-1">
            <h3 className={`font-black uppercase italic text-2xl tracking-tighter leading-none ${rarityStyle.text}`}>
              {monster.name}
            </h3>
            <div className="flex items-center justify-center gap-2">
               <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest bg-white/5 px-2 py-0.5 rounded border border-white/5">
                {monster.rarity}
              </span>
               <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest bg-white/5 px-2 py-0.5 rounded border border-white/5">
                LV.{monster.level}
              </span>
            </div>
          </div>

          {/* 📊 Mastery - Slim & Clean */}
          <div className="bg-slate-900/50 border border-white/5 p-3 rounded-2xl space-y-2">
            <div className="flex justify-between items-center px-1">
              <div className="flex items-center gap-1.5">
                <Skull size={12} className={isMastered ? "text-amber-500" : "text-slate-600"} />
                <span className="text-[10px] font-black text-white">{currentKills} / {masteryTarget}</span>
              </div>
              <div className="flex gap-2">
                {Object.entries(monster.elementPowerBonus || {}).map(([el, pow]) => (
                  <div key={el} className="flex items-center gap-1">
                    <Zap size={8} className={isMastered ? "text-amber-400" : "text-slate-700"} />
                    <span className={`text-[8px] font-bold uppercase ${isMastered ? 'text-amber-400' : 'text-slate-600'}`}>+{pow} {el}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="h-1.5 bg-black/40 rounded-full overflow-hidden p-0.5 border border-white/5">
              <div 
                className={`h-full rounded-full transition-all duration-1000 ease-out ${isMastered ? 'bg-gradient-to-r from-amber-600 to-yellow-400' : 'bg-slate-700'}`} 
                style={{ width: `${masteryProgress}%` }} 
              />
            </div>
          </div>

          {/* 💎 Artifact Grid - 8 Items Layout */}
          <div className={`p-4 rounded-[2rem] border transition-all ${isCompleteSet ? 'bg-amber-500/5 border-amber-500/20' : 'bg-slate-900 border-white/5'}`}>
            <div className="flex justify-between items-center mb-3 px-1">
              <p className={`text-[8px] font-black uppercase tracking-widest ${isCompleteSet ? 'text-amber-500' : 'text-slate-500'}`}>
                Collection Artifacts ({artifactsOnly.filter(l => collection?.[monster.id]?.includes(l.name)).length}/8)
              </p>
              {isCompleteSet && <CheckCircle2 size={12} className="text-amber-500" />}
            </div>
            
            <div className="grid grid-cols-4 gap-2">
              {artifactsOnly.map((loot, idx) => {
                const hasItem = collection?.[monster.id]?.includes(loot.name);
                const isTooltipOpen = activeTooltip === idx;
                return (
                  <div key={idx} className="relative aspect-square">
                    {isTooltipOpen && (
                      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-24 z-[110] animate-in fade-in zoom-in duration-200">
                        <div className="bg-slate-900 border border-slate-700 p-2 rounded-xl shadow-2xl text-center">
                          <p className="text-[8px] font-bold text-white leading-tight">{loot.name}</p>
                        </div>
                      </div>
                    )}
                    <div 
                      onClick={(e) => { e.stopPropagation(); setActiveTooltip(isTooltipOpen ? null : idx); }}
                      className={`w-full h-full rounded-xl border flex items-center justify-center text-lg transition-all ${hasItem ? 'bg-slate-800 border-white/20 shadow-inner' : 'bg-black/40 border-white/5 opacity-20 grayscale'}`}
                    >
                      {loot.image && (typeof loot.image === 'string' && loot.image.startsWith('/') 
                        ? <img src={loot.image} className="w-6 h-6 object-contain" alt="icon" /> : loot.image)}
                      {!hasItem && <Lock size={8} className="absolute bottom-1 right-1 text-slate-800" />}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* 🏆 Permanent Bonus - Horizontal Badge */}
          <div className={`p-4 rounded-[2rem] border-2 transition-all duration-500 ${isCompleteSet ? 'bg-gradient-to-br from-amber-600 to-orange-700 border-amber-400 shadow-lg' : 'bg-slate-900 border-slate-800 opacity-40'}`}>
            <div className="flex justify-between items-center px-1">
              <span className={`text-[8px] font-black uppercase tracking-[0.2em] ${isCompleteSet ? 'text-amber-200' : 'text-slate-500'}`}>Set Bonus</span>
              <div className="flex gap-3">
                {Object.entries(monster.collectionBonus || {}).map(([stat, val]) => (
                  <span key={stat} className="text-[11px] font-black italic uppercase text-white drop-shadow-md">{stat} +{val}</span>
                ))}
              </div>
            </div>
          </div>

          <button onClick={onClose} className="w-full py-4 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/5 text-slate-500 text-[9px] font-black uppercase tracking-[0.4em] transition-all">
            RETURN TO ARCHIVE
          </button>
        </div>
      </div>
      
      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 10px; }
      `}</style>
    </div>
  );
}