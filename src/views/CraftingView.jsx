import React, { useState } from 'react';
import { Hammer, Sword, Shield, Gem, Zap, Box, ChevronRight, Sparkles, X, Trophy } from 'lucide-react';
import { craftItem, getFullItemInfo } from '../utils/inventoryUtils';

export default function CraftingView({ player, setPlayer, setLogs }) {
  const [isCrafting, setIsCrafting] = useState(false);
  const [lastCrafted, setLastCrafted] = useState(null); 

  // 📜 สูตรการคราฟต์ที่ใช้ชื่อตัวแปรตรงกับระบบ (Scrap, Shard, Dust)
  const RECIPES = {
    BASIC: { Scrap: 10, Shard: 0,  Dust: 0,  chance: 'Common-Uncommon', label: 'Basic Forge' },
    ELITE: { Scrap: 30, Shard: 15, Dust: 10, chance: 'Uncommon-Rare',    label: 'Elite Forge' },
    MASTER: { Scrap: 100, Shard: 50, Dust: 50, chance: 'Rare-Legendary',  label: 'Masterwork Forge' }
  };

  const handleCraft = (tier, slotType) => {
    const recipe = RECIPES[tier];
    const m = player.materials || {};

    // 🛡️ ตรวจสอบวัตถุดิบ (Check Against Real Keys)
    if ((m.Scrap || 0) < recipe.Scrap || 
        (m.Shard || 0) < recipe.Shard || 
        (m.Dust || 0) < recipe.Dust) {
      alert("❌ วัตถุดิบไม่เพียงพอ!");
      return;
    }

    setIsCrafting(true);
    setLastCrafted(null);

    setTimeout(() => {
      const newItemInstance = craftItem(slotType); 
      
      if (tier === 'MASTER') {
        newItemInstance.level = Math.floor(Math.random() * 2) + 2; // สุ่ม +2 หรือ +3
      }

      const fullInfo = getFullItemInfo(newItemInstance);
      
      setPlayer(prev => ({
        ...prev,
        materials: {
          ...prev.materials,
          Scrap: (prev.materials?.Scrap || 0) - recipe.Scrap,
          Shard: (prev.materials?.Shard || 0) - recipe.Shard,
          Dust: (prev.materials?.Dust || 0) - recipe.Dust
        },
        inventory: [...(prev.inventory || []), newItemInstance]
      }));

      setLogs(prev => [`🔨 [${tier}] คราฟต์สำเร็จ! ได้รับ ${fullInfo.name}`, ...prev].slice(0, 10));
      setLastCrafted(fullInfo); 
      setIsCrafting(false);
    }, 1500);
  };

  return (
    <div className="flex flex-col h-full bg-slate-950 text-slate-200 p-3 sm:p-4 space-y-4 overflow-hidden relative">
      
      {/* ⚒️ Header & Resources (ปรับให้เข้ากับมือถือ) */}
      <div className="grid grid-cols-3 gap-2 bg-slate-900/50 p-2 sm:p-3 rounded-2xl sm:rounded-3xl border border-white/5 shadow-2xl">
        <div className="flex flex-col items-center p-1 sm:p-2 bg-black/40 rounded-xl border border-orange-500/20">
          <Box className="text-orange-400 mb-1" size={12} />
          <span className="text-[10px] sm:text-xs font-black text-orange-400 leading-none">{player.materials?.Scrap || 0}</span>
        </div>
        <div className="flex flex-col items-center p-1 sm:p-2 bg-black/40 rounded-xl border border-emerald-500/20">
          <Zap className="text-emerald-400 mb-1" size={12} />
          <span className="text-[10px] sm:text-xs font-black text-emerald-400 leading-none">{player.materials?.Shard || 0}</span>
        </div>
        <div className="flex flex-col items-center p-1 sm:p-2 bg-black/40 rounded-xl border border-purple-500/20">
          <Sparkles className="text-purple-400 mb-1" size={12} />
          <span className="text-[10px] sm:text-xs font-black text-purple-400 leading-none">{player.materials?.Dust || 0}</span>
        </div>
      </div>

      {/* 📜 Crafting Menu - Scrollable */}
      <div className="flex-1 overflow-y-auto space-y-6 no-scrollbar pb-20">
        {['WEAPON', 'ARMOR', 'ACCESSORY'].map(slot => (
          <div key={slot} className="space-y-3">
            <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] pl-2 flex items-center gap-2 italic">
              FORGE {slot}
            </h3>
            
            <div className="grid grid-cols-1 gap-2">
              {Object.entries(RECIPES).map(([tier, recipe]) => (
                <button
                  key={tier}
                  disabled={isCrafting}
                  onClick={() => handleCraft(tier, slot)}
                  className={`relative p-4 sm:p-5 rounded-2xl sm:rounded-[2rem] border-2 transition-all active:scale-95 flex items-center justify-between overflow-hidden group
                    ${tier === 'MASTER' ? 'border-amber-500 bg-amber-500/10' : 
                      tier === 'ELITE' ? 'border-blue-500/30 bg-blue-500/5' : 'border-slate-800 bg-slate-900/40'}`}
                >
                  <div className="flex flex-col text-left z-10">
                    <span className={`text-xs sm:text-sm font-black uppercase italic ${tier === 'MASTER' ? 'text-amber-500' : 'text-white'}`}>{recipe.label}</span>
                    <span className="text-[8px] font-bold text-slate-400 mt-0.5">Chance: {recipe.chance}</span>
                  </div>
                  {/* แสดงค่าวัตถุดิบในบรรทัดเดียวสำหรับมือถือ */}
                  <div className="flex gap-2 text-[10px] font-black text-slate-400 z-10">
                     <span className="flex items-center gap-0.5">Scrap : {recipe.Scrap}</span>
                     {recipe.Shard > 0 && <span className="text-emerald-400">Shard : {recipe.Shard}</span>}
                     {recipe.Dust > 0 && <span className="text-purple-400 font-bold">Dust : {recipe.Dust}</span>}
                  </div>
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* 🔨 Animation Overlay */}
      {isCrafting && (
        <div className="fixed inset-0 z-[300] bg-slate-950/90 backdrop-blur-md flex flex-col items-center justify-center animate-in fade-in">
          <div className="relative animate-hammer-hit">
            <Hammer size={80} className="text-amber-500 drop-shadow-[0_0_15px_rgba(245,158,11,0.5)]" />
            <Sparkles className="absolute -top-4 -right-4 text-white animate-pulse" size={30} />
          </div>
          <p className="text-xl font-black italic uppercase text-white mt-6 animate-pulse tracking-widest">Forging Masterpiece...</p>
        </div>
      )}

      {/* 🎉 RESULT POPUP */}
      {lastCrafted && !isCrafting && (
        <div className="fixed inset-0 z-[400] flex items-center justify-center p-4 sm:p-6 animate-in zoom-in duration-300">
          <div className="absolute inset-0 bg-black/95 backdrop-blur-md" onClick={() => setLastCrafted(null)} />
          
          <div className={`relative w-full max-w-[320px] bg-slate-900 border-2 rounded-[2.5rem] sm:rounded-[3rem] overflow-hidden shadow-[0_0_50px_rgba(245,158,11,0.3)] 
            ${lastCrafted.level >= 2 ? 'border-amber-500 shadow-amber-500/30' : 'border-slate-700'}`}>
            
            <div className={`p-6 sm:p-8 text-center bg-gradient-to-b from-transparent to-transparent 
              ${lastCrafted.level >= 2 ? 'from-amber-500/20' : 'from-slate-500/10'}`}>
              <div className="text-6xl sm:text-7xl mb-4 animate-bounce drop-shadow-2xl">{lastCrafted.icon}</div>
              <h3 className="text-xl sm:text-2xl font-black text-white uppercase italic leading-tight">{lastCrafted.name} +{lastCrafted.level}</h3>
              <p className="text-[10px] text-amber-500 font-bold uppercase tracking-[0.3em] mt-2">✨ Crafted Masterpiece ✨</p>
            </div>

            <div className="px-6 sm:px-8 pb-8 space-y-3">
              <div className="grid grid-cols-1 gap-2">
                {lastCrafted.totalAtk > 0 && (
                  <div className="flex justify-between items-center bg-orange-500/10 p-3 sm:p-4 rounded-xl sm:rounded-2xl border border-orange-500/20">
                    <span className="text-[10px] font-black text-orange-400 uppercase italic">Attack</span>
                    <span className="text-base sm:text-lg font-black text-white">+{lastCrafted.totalAtk}</span>
                  </div>
                )}
                {lastCrafted.totalDef > 0 && (
                  <div className="flex justify-between items-center bg-emerald-500/10 p-3 sm:p-4 rounded-xl sm:rounded-2xl border border-emerald-500/20">
                    <span className="text-[10px] font-black text-emerald-400 uppercase italic">Defense</span>
                    <span className="text-base sm:text-lg font-black text-white">+{lastCrafted.totalDef}</span>
                  </div>
                )}
                {lastCrafted.totalMaxHp > 0 && (
                  <div className="flex justify-between items-center bg-blue-500/10 p-3 sm:p-4 rounded-xl sm:rounded-2xl border border-blue-500/20">
                    <span className="text-[10px] font-black text-blue-400 uppercase italic">Health</span>
                    <span className="text-base sm:text-lg font-black text-white">+{lastCrafted.totalMaxHp}</span>
                  </div>
                )}
              </div>

              <button 
                onClick={() => setLastCrafted(null)}
                className="w-full mt-4 py-4 sm:py-5 bg-gradient-to-r from-amber-600 to-amber-400 text-slate-950 font-black rounded-xl sm:rounded-2xl uppercase text-[10px] sm:text-xs shadow-lg active:scale-95 transition-all"
              >
                Confirm & Add to Bag
              </button>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        @keyframes hammer-hit {
          0%, 100% { transform: rotate(0deg) scale(1); }
          50% { transform: rotate(-45deg) scale(1.15); }
          60% { transform: rotate(10deg) scale(0.95); }
        }
        .animate-hammer-hit { animation: hammer-hit 0.35s infinite; }
      `}</style>
    </div>
  );
}