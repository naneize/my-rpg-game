import React, { useState } from 'react';
import { Hammer, Sword, Shield, Zap, Box, ChevronRight, Sparkles, X, Trophy, AlertCircle, Coins, Activity, Cpu, Layers, Target, Flame, Droplets, Mountain, Wind, Sun, Moon, Skull } from 'lucide-react';
import { craftItem, getFullItemInfo } from '../utils/inventoryUtils';

export default function CraftingView({ player, setPlayer, setLogs }) {
  const [isCrafting, setIsCrafting] = useState(false);
  const [lastCrafted, setLastCrafted] = useState(null);
  const [errorToast, setErrorToast] = useState(null);

  const ELEMENT_CONFIG = {
    fire: { label: 'FIRE', icon: <Flame size={14}/>, color: 'text-red-500', border: 'border-red-500/30' },
    water: { label: 'WATER', icon: <Droplets size={14}/>, color: 'text-blue-500', border: 'border-blue-500/30' },
    earth: { label: 'EARTH', icon: <Mountain size={14}/>, color: 'text-orange-900', border: 'border-orange-900/30' },
    wind: { label: 'WIND', icon: <Wind size={14}/>, color: 'text-emerald-500', border: 'border-emerald-500/30' },
    light: { label: 'LIGHT', icon: <Sun size={14}/>, color: 'text-yellow-400', border: 'border-yellow-400/30' },
    dark: { label: 'DARK', icon: <Moon size={14}/>, color: 'text-purple-500', border: 'border-purple-500/30' },
    poison: { label: 'POISON', icon: <Skull size={14}/>, color: 'text-lime-500', border: 'border-lime-500/30' }
  };

  const RECIPES = {
    BASIC: { Scrap: 10, Shard: 0, Dust: 0, chance: 'Common - Uncommon', label: 'BASIC_FORGE' },
    ELITE: { Scrap: 40, Shard: 20, Dust: 0, chance: 'Uncommon - Rare', label: 'ELITE_FORGE' },
    MASTER: { Scrap: 100, Shard: 50, Dust: 50, chance: 'Rare - Legendary', label: 'MASTERWORK_FORGE' }
  };

  const getRarityColor = (rarity) => {
    switch (rarity) {
      case 'Legendary': return { border: 'border-amber-500', text: 'text-amber-500', bg: 'bg-amber-500', glow: 'shadow-[0_0_50px_rgba(245,158,11,0.4)]' };
      case 'Epic': return { border: 'border-purple-500', text: 'text-purple-500', bg: 'bg-purple-500', glow: 'shadow-[0_0_50px_rgba(168,85,247,0.4)]' };
      case 'Rare': return { border: 'border-blue-500', text: 'text-blue-500', bg: 'bg-blue-500', glow: 'shadow-[0_0_50px_rgba(59,130,246,0.4)]' };
      case 'Uncommon': return { border: 'border-emerald-500', text: 'text-emerald-500', bg: 'bg-emerald-500', glow: 'shadow-[0_0_50px_rgba(16,185,129,0.4)]' };
      default: return { border: 'border-slate-400', text: 'text-slate-400', bg: 'bg-slate-400', glow: 'shadow-[0_0_50px_rgba(148,163,184,0.4)]' };
    }
  };

  const handleCraft = (tier, slotType) => {
    const recipe = RECIPES[tier];
    if ((player.materials?.scrap || 0) < recipe.Scrap || (player.materials?.shard || 0) < recipe.Shard || (player.materials?.dust || 0) < recipe.Dust) {
      setErrorToast({ title: "INSUFFICIENT_MATERIALS", msg: "RESOURCE_SYNC_FAILED: Synthesis requires more raw materials." });
      return;
    }

    setIsCrafting(true);
    setLastCrafted(null);

    setTimeout(() => {
      let newItemInstance = craftItem(slotType, tier);
      if (!newItemInstance) { setIsCrafting(false); return; }

      let finalRarity = newItemInstance.rarity || newItemInstance.Rarity || 'Common';
      if (tier === 'MASTER' && (finalRarity === 'Common' || finalRarity === 'Uncommon')) finalRarity = 'Legendary';
      else if (tier === 'ELITE' && finalRarity === 'Common') finalRarity = 'Rare';

      const multiplier = finalRarity === 'Legendary' ? 6.5 : finalRarity === 'Epic' ? 4.2 : finalRarity === 'Rare' ? 2.8 : 1.5;

      let subStats = {};
      const subStatPool = [
        { key: 'critRate', label: 'CRIT_CHANCE', min: 0.02, max: 0.06, isPercent: true },
        { key: 'critDamage', label: 'CRIT_DMG', min: 0.15, max: 0.40, isPercent: true },
        { key: 'luck', label: 'LUCK', min: 5, max: 15, isPercent: false },
        { key: 'pen', label: 'ARMOR_PEN', min: 0.03, max: 0.10, isPercent: true }
      ];
      
      const subStatCount = finalRarity === 'Legendary' ? 3 : finalRarity === 'Epic' ? 2 : finalRarity === 'Rare' ? 1 : 0;
      if (subStatCount > 0) {
        [...subStatPool].sort(() => 0.5 - Math.random()).slice(0, subStatCount).forEach(stat => {
          subStats[stat.key] = Number(((Math.random() * (stat.max - stat.min) + stat.min) * (multiplier * 0.4)).toFixed(2));
        });
      }

      let elementalBonus = null;
      if (Math.random() < (tier === 'MASTER' ? 0.6 : 0.3)) {
          const keys = Object.keys(ELEMENT_CONFIG);
          const selectedKey = keys[Math.floor(Math.random() * keys.length)];
          elementalBonus = {
              type: selectedKey,
              value: Math.floor((Math.random() * 15 + 10) * multiplier)
          };
      }

      const finalItem = {
        ...newItemInstance,
        instanceId: `craft-${Date.now()}`,
        rarity: finalRarity,
        atk: Math.floor((newItemInstance.atk || 25) * multiplier),
        def: Math.floor((newItemInstance.def || 15) * multiplier),
        hp: Math.floor((newItemInstance.hp || 60) * multiplier),
        ...subStats,
        element: elementalBonus
      };

      const fullInfo = getFullItemInfo(finalItem);
      setPlayer(prev => ({
        ...prev,
        materials: { ...prev.materials, scrap: prev.materials.scrap - recipe.Scrap, shard: prev.materials.shard - recipe.Shard, dust: prev.materials.dust - recipe.Dust },
        inventory: [...(prev.inventory || []), finalItem]
      }));

      setLastCrafted(fullInfo);
      setIsCrafting(false);
    }, 1500);
  };

  return (
    <div className="flex flex-col h-full bg-slate-950 text-slate-200 p-2 md:p-4 space-y-4 md:space-y-6 overflow-hidden relative font-mono">
      
      {/* 🔴 TACTICAL ERROR OVERLAY */}
      {errorToast && (
        <div className="fixed inset-0 z-[5000] flex items-center justify-center p-6 bg-red-950/20 backdrop-blur-md animate-in fade-in duration-300">
           <div className="w-full max-w-xs bg-slate-900 border-2 border-red-500 p-6 shadow-[0_0_30px_rgba(239,68,68,0.3)] text-center relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-red-500 animate-pulse" />
              <AlertCircle size={40} className="text-red-500 mx-auto mb-4 animate-bounce" />
              <h2 className="text-lg font-black text-red-500 uppercase italic tracking-tighter mb-2">{errorToast.title}</h2>
              <p className="text-[10px] text-slate-400 uppercase leading-relaxed mb-6 italic">{errorToast.msg}</p>
              <button 
                onClick={() => setErrorToast(null)}
                className="w-full py-3 bg-red-500 text-black font-black uppercase text-[10px] tracking-widest active:scale-95 transition-all"
              >
                ACKNOWLEDGE_SYSTEM_WARNING
              </button>
           </div>
        </div>
      )}

      {/* Resource Header - เปลี่ยนชื่อเป็น NANO FLUX VOID และเอารูปออก */}
      <div className="shrink-0 grid grid-cols-3 gap-1 bg-slate-900/60 border-y border-white/10 py-3 md:py-6 px-1 backdrop-blur-md relative z-10">
        {[
          { id: 'scrap', label: 'NANO', val: player.materials?.scrap || 0, color: 'text-orange-500' },
          { id: 'shard', label: 'FLUX', val: player.materials?.shard || 0, color: 'text-cyan-400' },
          { id: 'dust', label: 'VOID', val: player.materials?.dust || 0, color: 'text-purple-400' }
        ].map(res => (
          <div key={res.id} className="flex flex-col items-center border-x border-white/5">
            <span className={`text-[7px] md:text-[10px] font-black ${res.color} mb-1 uppercase tracking-[0.2em] italic opacity-80`}>{res.label}</span>
            <div className="flex items-center gap-1 md:gap-3">
               <span className="text-sm md:text-2xl font-black text-white italic tracking-tighter">{res.val.toLocaleString()}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="flex-1 overflow-y-auto space-y-6 md:space-y-8 no-scrollbar pb-24">
        {['WEAPON', 'ARMOR', 'BELT', 'TRINKET', 'ACCESSORY'].map(slot => (
          <div key={slot} className="space-y-4 px-1">
            <h3 className="text-[10px] md:text-xs font-black text-white uppercase tracking-[0.2em] flex items-center gap-2 border-l-4 border-blue-500 pl-3 italic">
                {slot}_FABRICATION
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
              {Object.entries(RECIPES).map(([tier, recipe]) => (
                <div key={tier} className={`p-3 md:p-4 border-2 bg-slate-900/40 transition-all ${tier === 'MASTER' ? 'border-amber-500/40' : 'border-white/10'}`}>
                  <div className="flex justify-between items-start mb-3 md:mb-4">
                    <div className="text-left">
                      <span className={`text-[8px] md:text-[9px] font-black ${tier === 'MASTER' ? 'text-amber-500' : 'text-blue-400'}`}>IDENT: {tier}</span>
                      {/* Tight Black Italic Heading */}
                      <h4 className="text-base md:text-xl font-black text-white italic tracking-tighter uppercase leading-none mt-1">{recipe.label}</h4>
                    </div>
                    <div className="text-[7px] md:text-[8px] px-1.5 py-0.5 border font-black border-white/20 text-slate-500 whitespace-nowrap">{recipe.chance}</div>
                  </div>
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex gap-1 md:gap-2">
                       {/* บอกชื่อไอเทมกำกับในแต่ละ Slot ของสูตรคราฟต์ */}
                       {recipe.Scrap > 0 && (
                         <div className="flex flex-col items-center bg-black/40 border border-white/10 p-1 min-w-[32px]">
                            <span className="text-[5px] text-orange-500 font-bold">NANO</span>
                            <span className={`text-[9px] md:text-[10px] font-black ${player.materials?.scrap >= recipe.Scrap ? 'text-white' : 'text-red-500'}`}>{recipe.Scrap}</span>
                         </div>
                       )}
                       {recipe.Shard > 0 && (
                         <div className="flex flex-col items-center bg-black/40 border border-white/10 p-1 min-w-[32px]">
                            <span className="text-[5px] text-cyan-400 font-bold">FLUX</span>
                            <span className={`text-[9px] md:text-[10px] font-black ${player.materials?.shard >= recipe.Shard ? 'text-white' : 'text-red-500'}`}>{recipe.Shard}</span>
                         </div>
                       )}
                       {recipe.Dust > 0 && (
                         <div className="flex flex-col items-center bg-black/40 border border-white/10 p-1 min-w-[32px]">
                            <span className="text-[5px] text-purple-400 font-bold">VOID</span>
                            <span className={`text-[9px] md:text-[10px] font-black ${player.materials?.dust >= recipe.Dust ? 'text-white' : 'text-red-500'}`}>{recipe.Dust}</span>
                         </div>
                       )}
                    </div>
                    <button 
                      onClick={() => handleCraft(tier, slot)} 
                      className={`px-3 md:px-4 h-9 md:h-10 font-black text-[9px] md:text-[10px] flex items-center gap-2 shrink-0 ${tier === 'MASTER' ? 'bg-amber-500 text-black' : 'bg-blue-600 text-white hover:bg-blue-500'} active:scale-95 transition-transform`}
                    >
                      ENGAGE <Hammer size={14}/>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Success Modal - Responsive */}
      {lastCrafted && !isCrafting && (
        <div className="fixed inset-0 z-[1100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-950/98 backdrop-blur-xl" onClick={() => setLastCrafted(null)} />
          <div className={`relative w-full max-w-sm bg-slate-900 border-2 ${getRarityColor(lastCrafted.rarity).border} ${getRarityColor(lastCrafted.rarity).glow} animate-in zoom-in duration-300 p-1`}>
            <div className="bg-slate-950/40 p-5 md:p-8 text-center relative overflow-hidden max-h-[85vh] overflow-y-auto no-scrollbar">
                <div className={`absolute top-0 right-0 px-3 py-1 text-[8px] md:text-[9px] font-black text-black uppercase ${getRarityColor(lastCrafted.rarity).bg}`}>
                    {lastCrafted.rarity} MODULE
                </div>

                <div className="my-4 md:my-6">
                   <div className="w-20 h-20 md:w-32 md:h-32 bg-black/60 border-2 border-white/10 flex items-center justify-center mx-auto relative">
                    {typeof lastCrafted.icon === 'string' && lastCrafted.icon.startsWith('/') ? <img src={lastCrafted.icon} className="w-full h-full object-contain p-3 md:p-4" alt="" /> : <span className="text-4xl md:text-6xl">{lastCrafted.icon || "📦"}</span>}
                    {lastCrafted.element && <div className="absolute -bottom-2 -right-2 w-8 h-8 md:w-10 md:h-10 bg-slate-900 border-2 border-white/20 flex items-center justify-center text-base md:text-xl shadow-lg">{ELEMENT_CONFIG[lastCrafted.element.type].icon}</div>}
                  </div>
                </div>

                <h3 className="text-xl md:text-3xl font-black text-white uppercase italic tracking-tighter mb-1 truncate">{lastCrafted.name || "Unknown"}</h3>
                <div className="text-[8px] md:text-[10px] font-black text-white/50 mb-4 md:mb-6 uppercase border-b border-white/10 pb-2 italic">INTEGRATION_SUCCESSFUL</div>

                <div className="space-y-1.5 mb-6 md:mb-8 text-left">
                    {[
                      { label: 'ATK', val: lastCrafted.atk, color: 'text-rose-500', icon: <Sword size={12}/> },
                      { label: 'DEF', val: lastCrafted.def, color: 'text-sky-400', icon: <Shield size={12}/> },
                      { label: 'HP', val: lastCrafted.hp, color: 'text-emerald-500', icon: <Activity size={12}/> },
                    ].map(stat => stat.val > 0 && (
                      <div key={stat.label} className="flex justify-between items-center bg-white/5 p-2 md:p-2.5 border-l-2 border-white/10">
                         <div className="flex items-center gap-1.5 md:gap-2"><span className={stat.color}>{stat.icon}</span><span className="text-[8px] md:text-[9px] font-black text-white/70 uppercase">{stat.label}</span></div>
                         <span className={`text-base md:text-lg font-mono font-black ${stat.color}`}>+{stat.val.toLocaleString()}</span>
                      </div>
                    ))}

                    {lastCrafted.element && (
                      <div className={`flex justify-between items-center bg-slate-900 border-l-2 p-2 md:p-2.5 ${ELEMENT_CONFIG[lastCrafted.element.type].border}`}>
                         <div className="flex items-center gap-1.5 md:gap-2">
                            <span className={ELEMENT_CONFIG[lastCrafted.element.type].color}>{ELEMENT_CONFIG[lastCrafted.element.type].icon}</span>
                            <span className={`text-[8px] md:text-[9px] font-black uppercase ${ELEMENT_CONFIG[lastCrafted.element.type].color}`}>{ELEMENT_CONFIG[lastCrafted.element.type].label}_AFFINITY</span>
                         </div>
                         <span className={`text-base md:text-lg font-mono font-black ${ELEMENT_CONFIG[lastCrafted.element.type].color}`}>+{lastCrafted.element.value}</span>
                      </div>
                    )}

                    {[
                      { label: 'CRIT_RATE', val: lastCrafted.critRate, color: 'text-orange-400', icon: <Target size={12}/>, isPercent: true },
                      { label: 'CRIT_DMG', val: lastCrafted.critDamage, color: 'text-yellow-400', icon: <Zap size={12}/>, isPercent: true },
                      { label: 'LUCK', val: lastCrafted.luck, color: 'text-purple-400', icon: <Sparkles size={12}/>, isPercent: false },
                      { label: 'ARMOR_PEN', val: lastCrafted.pen, color: 'text-rose-400', icon: <ChevronRight size={12}/>, isPercent: true }
                    ].map(stat => (stat.val > 0) && (
                      <div key={stat.label} className="flex justify-between items-center bg-white/5 p-2 md:p-2.5 border-l-2 border-white/10">
                         <div className="flex items-center gap-1.5 md:gap-2"><span className={stat.color}>{stat.icon}</span><span className="text-[8px] md:text-[9px] font-black text-white/50 uppercase">{stat.label}</span></div>
                         <span className={`text-xs md:text-sm font-mono font-black ${stat.color}`}>+{stat.isPercent ? (stat.val * 100).toFixed(1) : stat.val}{stat.isPercent ? '%' : ''}</span>
                      </div>
                    ))}
                </div>

                <button onClick={() => setLastCrafted(null)} className={`w-full py-3 md:py-4 text-[9px] md:text-[10px] text-black font-black uppercase tracking-[0.2em] italic ${getRarityColor(lastCrafted.rarity).bg} active:scale-95 transition-all`}>SYNC_MODULE_TO_SYSTEM</button>
            </div>
          </div>
        </div>
      )}

      {/* Forging Animation */}
      {isCrafting && (
        <div className="fixed inset-0 z-[2000] bg-slate-950/95 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center animate-in fade-in duration-300">
          <div className="relative w-20 h-20 md:w-32 md:h-32">
            <div className="absolute inset-0 border-4 md:border-8 border-blue-500/20 rounded-full" />
            <div className="absolute inset-0 border-4 md:border-8 border-t-blue-500 rounded-full animate-spin shadow-[0_0_20px_rgba(59,130,246,0.5)]" />
            <Hammer className="absolute inset-0 m-auto text-blue-400 animate-bounce" size={32} />
          </div>
          
          <div className="mt-8 md:mt-10 space-y-1">
            <h2 className="text-lg md:text-3xl font-black text-blue-400 tracking-[0.3em] animate-pulse uppercase italic">FORGING_MODULE...</h2>
            <p className="text-[8px] md:text-[10px] font-bold text-blue-500/50 tracking-[0.2em] uppercase italic">Initializing_Quantum_Forge</p>
          </div>
          
          <div className="w-40 md:w-48 h-1 bg-white/5 mt-6 overflow-hidden relative border border-white/5">
            <div className="absolute inset-0 bg-blue-500 animate-[progress_1.5s_ease-in-out_infinite]" />
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes progress { 0% { transform: translateX(-100%); } 100% { transform: translateX(100%); } }
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
}