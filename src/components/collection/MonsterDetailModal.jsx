import React, { useState, useMemo } from 'react';
import { Shield, Target, Zap, Heart, Lock, CheckCircle2, Skull, Cpu, X, Activity, Database } from 'lucide-react';

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
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/95 backdrop-blur-md font-mono" 
      onClick={() => {
        if (activeTooltip !== null) setActiveTooltip(null);
        else onClose();
      }}>
      
      {/* 📱 Hard-Edge Modal Container */}
      <div 
        className={`relative w-full max-w-[360px] bg-[#020617] border-2 rounded-none overflow-hidden shadow-2xl transition-all duration-500 flex flex-col max-h-[95vh] ${isCompleteSet ? 'border-amber-500 shadow-amber-500/20' : 'border-white/10'}`}
        onClick={e => {
          e.stopPropagation();
          setActiveTooltip(null); 
        }}
      >
        {/* Decorative Tech Corners */}
        <div className={`absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 ${isCompleteSet ? 'border-amber-500' : 'border-blue-500/30'} z-20`} />
        <div className={`absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 ${isCompleteSet ? 'border-amber-500' : 'border-blue-500/30'} z-20`} />

        {/* 🖼️ Banner Section - Hard-Edge Research Box */}
        <div className={`h-40 flex items-center justify-center p-6 relative overflow-hidden bg-black/40 border-b border-white/10`}>
          <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(#3b82f6 1px, transparent 0)', backgroundSize: '16px 16px' }} />
          
          {monster.image && typeof monster.image === 'string' && monster.image.startsWith('/') ? (
            <img 
              src={monster.image} 
              className={`h-full object-contain drop-shadow-[0_0_15px_rgba(255,255,255,0.2)] transition-transform duration-700 ${isMastered ? 'scale-110' : ''}`} 
              alt={monster.name} 
            />
          ) : (
            <span className={`text-6xl transition-transform duration-700 ${isMastered ? 'scale-110' : ''}`}>
              {monster.image || "👾"}
            </span>
          )}

          {isMastered && (
            <div className="absolute top-6 left-6 bg-amber-500 text-slate-950 px-2 py-0.5 rounded-none font-black text-[9px] uppercase tracking-widest shadow-[0_0_10px_rgba(245,158,11,0.5)]">
              DATA_MASTERED
            </div>
          )}
          
          <button onClick={onClose} className="absolute top-4 right-4 p-2 bg-white/5 border border-white/10 rounded-none text-white/50 hover:text-white transition-all z-30 active:scale-90">
            <X size={18} />
          </button>
        </div>

        <div className="p-6 space-y-4 overflow-y-auto custom-scrollbar relative">
          {/* 📝 Entity Header */}
          <div className="text-center space-y-2">
            <h3 className={`font-black uppercase italic text-2xl tracking-tighter leading-none ${rarityStyle.text}`}>
              {monster.name}
            </h3>
            <div className="flex items-center justify-center gap-2 opacity-60">
                <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest bg-white/5 px-2 py-1 border border-white/10">
                 CLASS: {monster.rarity}
              </span>
                <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest bg-white/5 px-2 py-1 border border-white/10">
                 THREAT_LV: {monster.level}
              </span>
            </div>
          </div>

          {/* 📊 Mastery - Tactical Status Panel */}
          <div className="bg-slate-900/40 border border-white/10 p-4 rounded-none space-y-3 relative">
            <div className="absolute top-0 right-0 p-1">
               <Database size={10} className="text-white/10" />
            </div>
            <div className="flex justify-between items-end px-1">
              <div className="flex flex-col gap-1">
                <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest italic">Eradication_Status</p>
                <div className="flex items-center gap-2">
                  <Skull size={14} className={isMastered ? "text-amber-500" : "text-slate-600"} />
                  <span className="text-sm font-black text-white italic">{currentKills} / {masteryTarget}</span>
                </div>
              </div>
              <div className="flex flex-col items-end gap-1">
                <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest italic">Sync_Bonuses</p>
                <div className="flex gap-2">
                  {Object.entries(monster.elementPowerBonus || {}).map(([el, pow]) => (
                    <div key={el} className="flex items-center gap-1">
                      <Zap size={10} className={isMastered ? "text-amber-400" : "text-slate-700"} />
                      <span className={`text-[9px] font-black uppercase ${isMastered ? 'text-amber-400' : 'text-slate-600'}`}>+{pow} {el}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="h-2 bg-black/60 rounded-none overflow-hidden p-[2px] border border-white/5">
              <div 
                className={`h-full transition-all duration-1000 ease-out ${isMastered ? 'bg-gradient-to-r from-amber-600 to-yellow-400' : 'bg-slate-700'}`} 
                style={{ width: `${masteryProgress}%` }} 
              />
            </div>
          </div>

          {/* 💎 Artifact Matrix - Hard-Edge Grid */}
          <div className={`p-5 rounded-none border transition-all relative ${isCompleteSet ? 'bg-amber-500/5 border-amber-500/30' : 'bg-slate-900/40 border-white/10'}`}>
            <div className="flex justify-between items-center mb-4 px-1">
              <div className="flex items-center gap-2">
                 <Cpu size={12} className={isCompleteSet ? 'text-amber-500' : 'text-slate-500'} />
                 <p className={`text-[9px] font-black uppercase tracking-widest ${isCompleteSet ? 'text-amber-500' : 'text-slate-500'}`}>
                    Collection_Matrix ({artifactsOnly.filter(l => collection?.[monster.id]?.includes(l.name)).length}/8)
                 </p>
              </div>
              {isCompleteSet && <Activity size={12} className="text-amber-500 animate-pulse" />}
            </div>
            
            <div className="grid grid-cols-4 gap-2">
              {artifactsOnly.map((loot, idx) => {
                const hasItem = collection?.[monster.id]?.includes(loot.name);
                const isTooltipOpen = activeTooltip === idx;
                return (
                  <div key={idx} className="relative aspect-square">
                    {isTooltipOpen && (
                      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-28 z-[110] animate-in slide-in-from-bottom-1 duration-200">
                        <div className="bg-slate-900 border border-amber-500/50 p-2 rounded-none shadow-2xl text-center">
                          <p className="text-[9px] font-black text-white leading-tight uppercase italic">{loot.name}</p>
                        </div>
                      </div>
                    )}
                    <div 
                      onClick={(e) => { e.stopPropagation(); setActiveTooltip(isTooltipOpen ? null : idx); }}
                      className={`w-full h-full rounded-none border-2 flex items-center justify-center text-xl transition-all relative
                        ${hasItem 
                          ? 'bg-black/60 border-white/20 shadow-[inset_0_0_10px_rgba(255,255,255,0.05)]' 
                          : 'bg-black/40 border-white/5 opacity-10 grayscale'}`}
                    >
                      {loot.image && (typeof loot.image === 'string' && loot.image.startsWith('/') 
                        ? <img src={loot.image} className="w-7 h-7 object-contain" alt="icon" /> : loot.image)}
                      {!hasItem && <Lock size={10} className="absolute bottom-1 right-1 text-slate-800" />}
                      {hasItem && isCompleteSet && <div className="absolute top-0 right-0 w-1.5 h-1.5 bg-amber-500" />}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* 🏆 Permanent Module - Hard Badge */}
          <div className={`p-5 rounded-none border-2 transition-all duration-500 relative overflow-hidden ${isCompleteSet ? 'bg-amber-600 border-amber-400 shadow-xl' : 'bg-slate-950 border-white/5 opacity-40'}`}>
            <div className="absolute top-0 left-0 w-full h-full bg-black/10 pointer-events-none" />
            <div className="flex justify-between items-center px-1 relative z-10">
              <div className="flex flex-col">
                 <span className={`text-[8px] font-black uppercase tracking-[0.3em] mb-1 ${isCompleteSet ? 'text-amber-200' : 'text-slate-600'}`}>Neural_Set_Bonus</span>
                 <div className="flex gap-4">
                   {Object.entries(monster.collectionBonus || {}).map(([stat, val]) => (
                     <span key={stat} className="text-sm font-black italic uppercase text-white drop-shadow-md">{stat} +{val}</span>
                   ))}
                 </div>
              </div>
              {isCompleteSet && <Zap size={18} className="text-white fill-white animate-pulse" />}
            </div>
          </div>

          <button onClick={onClose} className="w-full py-5 rounded-none bg-white/5 hover:bg-white/10 border border-white/10 text-slate-500 hover:text-white text-[10px] font-black uppercase tracking-[0.5em] transition-all italic">
            RETURN_TO_ARCHIVE
          </button>
        </div>
      </div>
      
      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(59, 130, 246, 0.2); }
      `}</style>
    </div>
  );
}