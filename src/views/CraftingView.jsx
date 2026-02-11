import React, { useState } from 'react';
import { Hammer, Sword, Shield, Zap, Box, ChevronRight, Sparkles, X, Trophy, AlertCircle, Coins, Activity, Cpu, Layers } from 'lucide-react';
import { craftItem, getFullItemInfo } from '../utils/inventoryUtils';

export default function CraftingView({ player, setPlayer, setLogs }) {
  const [isCrafting, setIsCrafting] = useState(false);
  const [lastCrafted, setLastCrafted] = useState(null);
  const [errorToast, setErrorToast] = useState(null);

  const RECIPES = {
    BASIC: { Scrap: 10, Shard: 0, Dust: 0, chance: 'Common - Uncommon', label: 'Basic Forge', desc: 'Perfect for beginner adventurers.' },
    ELITE: { Scrap: 40, Shard: 20, Dust: 0, chance: 'Uncommon - Rare', label: 'Elite Forge', desc: 'Enhanced strength for the brave.' },
    MASTER: { Scrap: 100, Shard: 50, Dust: 50, chance: 'Rare - Legendary', label: 'Masterwork Forge', desc: 'Crafting legendary masterpieces.' }
  };

  const getRarityColor = (rarity) => {
    switch (rarity) {
      case 'Legendary': return { border: 'border-amber-500', text: 'text-amber-500', bg: 'bg-amber-500', glow: 'shadow-[0_0_50px_rgba(245,158,11,0.4)]', pulse: 'from-amber-500/20' };
      case 'Epic': return { border: 'border-purple-500', text: 'text-purple-500', bg: 'bg-purple-500', glow: 'shadow-[0_0_50px_rgba(168,85,247,0.4)]', pulse: 'from-purple-500/20' };
      case 'Rare': return { border: 'border-blue-500', text: 'text-blue-500', bg: 'bg-blue-500', glow: 'shadow-[0_0_50px_rgba(59,130,246,0.4)]', pulse: 'from-blue-500/20' };
      case 'Uncommon': return { border: 'border-emerald-500', text: 'text-emerald-500', bg: 'bg-emerald-500', glow: 'shadow-[0_0_50px_rgba(16,185,129,0.4)]', pulse: 'from-emerald-500/20' };
      default: return { border: 'border-slate-400', text: 'text-slate-400', bg: 'bg-slate-400', glow: 'shadow-[0_0_50px_rgba(148,163,184,0.4)]', pulse: 'from-slate-400/20' };
    }
  };

  const handleCraft = (tier, slotType) => {
    const recipe = RECIPES[tier];
    const hasScrap = (player.materials?.scrap || 0);
    const hasShard = (player.materials?.shard || 0);
    const hasDust = (player.materials?.dust || 0);

    if (hasScrap < recipe.Scrap || hasShard < recipe.Shard || hasDust < recipe.Dust) {
      setErrorToast("Insufficient Materials");
      setTimeout(() => setErrorToast(null), 2000);
      return;
    }

    setIsCrafting(true);
    setLastCrafted(null);

    setTimeout(() => {
      const newItemInstance = craftItem(slotType, tier);
      if (!newItemInstance) {
        setIsCrafting(false);
        setErrorToast(`No ${slotType} data found`);
        return;
      }

      let bonusLevel = tier === 'MASTER' ? Math.floor(Math.random() * 4) : tier === 'ELITE' ? Math.floor(Math.random() * 3) : Math.floor(Math.random() * 2);
      const finalItem = {
        ...newItemInstance,
        instanceId: `craft-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        id: newItemInstance.id || newItemInstance.itemId, 
        level: bonusLevel,
        type: 'EQUIPMENT',
        slot: slotType.toLowerCase()
      };

      const fullInfo = getFullItemInfo(finalItem);
      setPlayer(prev => ({
        ...prev,
        materials: {
          ...prev.materials,
          scrap: (prev.materials?.scrap || 0) - recipe.Scrap,
          shard: (prev.materials?.shard || 0) - recipe.Shard,
          dust: (prev.materials?.dust || 0) - recipe.Dust
        },
        inventory: [...(prev.inventory || []), finalItem]
      }));

      setLogs(prev => [`🔨 [${tier}] Forged: ${fullInfo.name}`, ...prev].slice(0, 10));
      setLastCrafted(fullInfo); 
      setIsCrafting(false);
    }, 1500);
  };

  return (
    <div className="flex flex-col h-full bg-slate-950 text-slate-200 p-4 space-y-6 overflow-hidden relative font-mono">
      <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: 'radial-gradient(#3b82f6 1px, transparent 0)', backgroundSize: '24px 24px' }} />
      
      {errorToast && (
        <div className="fixed top-32 left-1/2 -translate-x-1/2 z-[999999] animate-in fade-in slide-in-from-top-4 duration-300 pointer-events-none">
          <div className="bg-slate-900/95 backdrop-blur-xl border border-red-500/50 px-6 py-4 rounded-2xl shadow-[0_0_30px_rgba(239,68,68,0.3)] flex items-center gap-3">
            <AlertCircle size={24} className="text-red-500" />
            <span className="text-sm font-black text-white whitespace-nowrap">{errorToast}</span>
          </div>
        </div>
      )}

      {/* Resource Header - ปรับขนาดตัวเลขให้ใหญ่ขึ้น */}
      <div className="shrink-0 grid grid-cols-3 gap-2 bg-slate-900/60 border-y border-white/10 py-6 px-2 backdrop-blur-md relative overflow-hidden">
        {[
          { id: 'scrap', label: 'SCRAP_MTL', val: player.materials?.scrap || 0, color: 'text-orange-500', icon: '/icon/scrap.png' },
          { id: 'shard', label: 'ENERGY_SHD', val: player.materials?.shard || 0, color: 'text-cyan-400', icon: '/icon/shard.png' },
          { id: 'dust', label: 'NEURAL_DST', val: player.materials?.dust || 0, color: 'text-purple-400', icon: '/icon/dust.png' }
        ].map(res => (
          <div key={res.id} className="flex flex-col items-center">
            <span className={`text-[10px] font-black ${res.color} tracking-widest mb-2`}>{res.label}</span>
            <div className="flex items-center gap-3">
               <img src={res.icon} className="w-6 h-6 object-contain" alt="" />
               <span className="text-xl font-black text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.2)]">{res.val}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Forge List */}
      <div className="flex-1 overflow-y-auto space-y-12 no-scrollbar pb-24 px-1">
        {['WEAPON', 'ARMOR', 'BELT', 'TRINKET', 'ACCESSORY'].map(slot => (
          <div key={slot} className="space-y-6">
            <div className="flex items-center gap-3 border-l-4 border-blue-500 pl-4">
              <h3 className="text-sm font-black text-white uppercase tracking-[0.3em] flex items-center gap-3">
                {slot === 'WEAPON' ? <Sword size={18}/> : slot === 'ARMOR' ? <Shield size={18}/> : slot === 'BELT' ? <Layers size={18}/> : slot === 'TRINKET' ? <Cpu size={18}/> : <Zap size={18}/>}
                {slot}_FABRICATION
              </h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {Object.entries(RECIPES).map(([tier, recipe]) => (
                <div key={tier} className={`relative p-6 border-2 transition-all duration-300 bg-slate-900/40 hover:bg-slate-800/60 ${tier === 'MASTER' ? 'border-amber-500/40 shadow-[0_0_20px_rgba(245,158,11,0.05)]' : 'border-white/10'}`}>
                  <div className="flex flex-col gap-6 relative z-10">
                    <div className="flex justify-between items-start">
                      <div className="text-left">
                        <span className={`text-[11px] font-black uppercase mb-1 block ${tier === 'MASTER' ? 'text-amber-500' : 'text-blue-400'}`}>TIER: {tier}</span>
                        <h4 className="text-xl font-black text-white italic tracking-tight">{recipe.label}</h4>
                      </div>
                      <div className={`text-xs px-3 py-1 border-2 font-black ${tier === 'MASTER' ? 'border-amber-500 text-amber-500' : 'border-white/20 text-slate-400'}`}>
                        {recipe.chance}
                      </div>
                    </div>
                    
                    <div className="flex items-end justify-between">
                      <div className="flex gap-4">
                        {/* ปรับขนาดตัวเลข Requirement ให้เห็นชัดๆ */}
                        {[{id:'scrap',a:recipe.Scrap,label:'Scrap'}, {id:'shard',a:recipe.Shard,label:'Shard'}, {id:'dust',a:recipe.Dust,label:'Dust'}].map(r=>r.a>0 && (
                          <div key={r.id} className="flex flex-col items-center gap-1">
                            <div className="bg-black/60 border border-white/10 p-2 rounded-lg min-w-[55px] text-center shadow-inner">
                              <span className={`text-sm font-black ${player.materials?.[r.id] >= r.a ? 'text-white' : 'text-red-500'}`}>{r.a}</span>
                            </div>
                            <span className="text-[9px] font-black uppercase text-slate-500 tracking-widest">{r.label}</span>
                          </div>
                        ))}
                      </div>
                      <button disabled={isCrafting} onClick={() => handleCraft(tier, slot)} className={`px-6 h-12 flex items-center gap-3 font-black text-xs shadow-lg transition-transform active:scale-95 ${tier === 'MASTER' ? 'bg-amber-500 text-black' : 'bg-blue-600 text-white'}`}>
                        ENGAGE <Hammer size={18} className={isCrafting ? 'animate-spin' : ''} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {isCrafting && (
        <div className="fixed inset-0 z-[1000] bg-slate-950/95 backdrop-blur-md flex flex-col items-center justify-center">
          <div className="w-32 h-32 border-8 border-blue-500/20 border-t-blue-500 rounded-full animate-spin" />
          <h2 className="text-2xl font-black text-blue-400 tracking-[0.5em] animate-pulse mt-10 uppercase italic">Forging_Process...</h2>
        </div>
      )}

      {/* Success Modal - ปรับขนาด Text ให้ใหญ่สะใจ */}
      {lastCrafted && !isCrafting && (
        <div className="fixed inset-0 z-[1100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-950/98 backdrop-blur-xl" onClick={() => setLastCrafted(null)} />
          <div className={`absolute w-[400px] h-[400px] rounded-full blur-[150px] opacity-30 animate-pulse pointer-events-none ${getRarityColor(lastCrafted.rarity).bg}`} />

          <div className={`relative w-full max-w-md overflow-hidden bg-slate-900 border-2 ${getRarityColor(lastCrafted.rarity).border} p-1 ${getRarityColor(lastCrafted.rarity).glow} animate-in zoom-in duration-300`}>
            <div className="bg-slate-950/40 p-8 text-center relative overflow-hidden">
                <div className={`absolute top-0 right-0 px-6 py-2 text-xs font-black text-black uppercase ${getRarityColor(lastCrafted.rarity).bg}`}>
                   {lastCrafted.rarity} MODULE
                </div>

                <div className="relative inline-block my-8">
                   <div className={`absolute inset-0 blur-3xl opacity-40 ${getRarityColor(lastCrafted.rarity).bg}`} />
                   <div className="w-32 h-32 bg-black/60 border-2 border-white/10 flex items-center justify-center p-4 relative z-10 shadow-2xl">
                    {typeof lastCrafted.icon === 'string' && lastCrafted.icon.startsWith('/') ? (
                      <img src={lastCrafted.icon} className="w-full h-full object-contain" alt="" />
                    ) : (
                      <span className="text-8xl drop-shadow-[0_0_20px_rgba(255,255,255,0.5)]">{lastCrafted.icon || "📦"}</span>
                    )}
                  </div>
                  <Sparkles className={`absolute -top-6 -right-6 animate-bounce ${getRarityColor(lastCrafted.rarity).text}`} size={40} />
                </div>

                <h3 className="text-4xl font-black text-white uppercase italic tracking-tighter mb-4 drop-shadow-md">{lastCrafted.name || "Unknown"}</h3>
                <div className={`inline-block px-6 py-2 bg-gradient-to-r ${getRarityColor(lastCrafted.rarity).pulse} to-transparent border-l-4 ${getRarityColor(lastCrafted.rarity).border} text-white text-xs font-black uppercase mb-10`}>
                   Grade: +{lastCrafted.level ?? 0} Integration Success
                </div>

                <div className="grid grid-cols-1 gap-3 mb-10 text-left">
                   {[
                     { label: 'ATK_POWER', val: lastCrafted.totalAtk || lastCrafted.atk, color: 'text-orange-400', icon: <Sword size={16}/> },
                     { label: 'DEF_RATING', val: lastCrafted.totalDef || lastCrafted.def, color: 'text-blue-400', icon: <Shield size={16}/> },
                     { label: 'HEALTH_CAP', val: lastCrafted.totalMaxHp || lastCrafted.hp, color: 'text-emerald-400', icon: <Activity size={16}/> },
                     { label: 'LUCK_FACTOR', val: lastCrafted.luck, color: 'text-purple-400', icon: <Zap size={16}/> },
                     { label: 'PENETRATION', val: lastCrafted.pen ? `${(lastCrafted.pen * 100).toFixed(0)}%` : 0, color: 'text-red-400', icon: <ChevronRight size={16}/> }
                   ].map(stat => (stat.val > 0 || typeof stat.val === 'string') && (
                     <div key={stat.label} className="flex justify-between items-center bg-white/5 p-4 border-l-4 border-white/10 hover:border-blue-500 transition-all">
                        <div className="flex items-center gap-3">
                           <span className={stat.color}>{stat.icon}</span>
                           <span className="text-xs font-black text-white/80 uppercase tracking-widest">{stat.label}</span>
                        </div>
                        <span className={`text-xl font-mono font-black ${stat.color}`}>+{stat.val}</span>
                     </div>
                   ))}
                </div>

                <button onClick={() => setLastCrafted(null)} className={`w-full py-5 text-sm text-black font-black uppercase tracking-[0.3em] italic shadow-2xl transition-all hover:brightness-110 active:scale-95 ${getRarityColor(lastCrafted.rarity).bg}`}>
                   Sync_Module_To_System
                </button>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
}