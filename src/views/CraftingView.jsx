import React, { useState } from 'react';
import { Hammer, Sword, Shield, Gem, Zap, Box, ChevronRight, Sparkles, X, Trophy, AlertCircle, Coins } from 'lucide-react';
import { craftItem, getFullItemInfo } from '../utils/inventoryUtils';

export default function CraftingView({ player, setPlayer, setLogs }) {
  const [isCrafting, setIsCrafting] = useState(false);
  const [lastCrafted, setLastCrafted] = useState(null);
  const [errorToast, setErrorToast] = useState(null);

  const RECIPES = {
    BASIC: { Scrap: 10, Shard: 0, Dust: 0, chance: 'Common - Uncommon', label: 'Basic Forge', desc: 'เหมาะสำหรับผู้เริ่มต้น' },
    ELITE: { Scrap: 40, Shard: 20, Dust: 0, chance: 'Uncommon - Rare', label: 'Elite Forge', desc: 'เพิ่มความแข็งแกร่งขึ้นอีกระดับ' },
    MASTER: { Scrap: 100, Shard: 50, Dust: 50, chance: 'Rare - Legendary', label: 'Masterwork Forge', desc: 'ผลงานชิ้นเอกระดับตำนาน' }
  };

  const handleCraft = (tier, slotType) => {
  const recipe = RECIPES[tier];
  // ดึงค่ามาเช็คตรงๆ ป้องกันปัญหาค่า undefined
  const hasScrap = (player.materials?.scrap || 0);
  const hasShard = (player.materials?.shard || 0);
  const hasDust = (player.materials?.dust || 0);

  if (hasScrap < recipe.Scrap || hasShard < recipe.Shard || hasDust < recipe.Dust) {
    // 🚨 ถ้าของไม่พอ ให้ยัดข้อความใส่ Toast ทันที
    setErrorToast("วัตถุดิบไม่เพียงพอ");
    setTimeout(() => setErrorToast(null), 2000);
    return;
  }

    setIsCrafting(true);
    setLastCrafted(null);

    setTimeout(() => {
      const newItemInstance = craftItem(slotType);
      let bonusLevel = tier === 'MASTER' ? Math.floor(Math.random() * 4) : tier === 'ELITE' ? Math.floor(Math.random() * 3) : Math.floor(Math.random() * 2);
      
      newItemInstance.level = bonusLevel;
      const fullInfo = getFullItemInfo(newItemInstance);
      
      setPlayer(prev => ({
        ...prev,
        materials: {
          ...prev.materials,
          scrap: (prev.materials?.scrap || 0) - recipe.Scrap,
          shard: (prev.materials?.shard || 0) - recipe.Shard,
          dust: (prev.materials?.dust || 0) - recipe.Dust
        },
        inventory: [...(prev.inventory || []), newItemInstance]
      }));

      setLogs(prev => [`🔨 [${tier}] คราฟต์สำเร็จ! ได้รับ ${fullInfo.name}`, ...prev].slice(0, 10));
      setLastCrafted(fullInfo); 
      setIsCrafting(false);
    }, 1500);
  };

  return (
    <div className="flex flex-col h-full bg-slate-950 text-slate-200 p-4 space-y-6 overflow-hidden relative">
      
      {/* 🚨 Error Toast (ปรับให้กะทัดรัดมุมขวาบน) */}
      {errorToast && (
  <div className="fixed top-32 left-1/2 -translate-x-1/2 z-[999999] animate-in fade-in slide-in-from-top-4 duration-300 pointer-events-none">
    <div className="bg-slate-900/95 backdrop-blur-xl border border-red-500/50 px-5 py-3 rounded-2xl shadow-[0_0_30px_rgba(239,68,68,0.3)] flex items-center gap-3 min-w-[200px]">
      <div className="w-8 h-8 rounded-full bg-red-500/20 flex items-center justify-center text-red-500 shrink-0">
        <AlertCircle size={18} />
      </div>
      <div className="flex flex-col">
        <span className="text-[10px] font-black text-red-500 uppercase italic leading-none mb-1">Warning</span>
        <span className="text-xs font-bold text-white whitespace-nowrap">{errorToast}</span>
      </div>
    </div>
  </div>
)}

      {/* ⚒️ Resource Dashboard */}
      <div className="shrink-0 flex items-center justify-around bg-slate-900/80 border border-white/10 p-4 rounded-[2rem] shadow-2xl backdrop-blur-md">
        {[
          { id: 'scrap', label: 'SCRAP', val: player.materials?.scrap || 0, color: 'text-orange-500', icon: '/icon/scrap.png' },
          { id: 'shard', label: 'SHARD', val: player.materials?.shard || 0, color: 'text-emerald-400', icon: '/icon/shard.png' },
          { id: 'dust', label: 'DUST', val: player.materials?.dust || 0, color: 'text-purple-400', icon: '/icon/dust.png' }
        ].map(res => (
          <div key={res.id} className="flex flex-col items-center gap-1">
            <div className="w-10 h-10 bg-black/40 rounded-full border border-white/5 flex items-center justify-center mb-1 shadow-inner relative overflow-hidden group">
              <img src={res.icon} className="w-6 h-6 object-contain z-10" alt="" />
              <div className={`absolute inset-0 opacity-10 group-hover:opacity-20 transition-opacity bg-current ${res.color}`} />
            </div>
            <span className={`text-[10px] font-black ${res.color} italic tracking-tighter`}>{res.label}</span>
            <span className="text-sm font-black text-white">{res.val}</span>
          </div>
        ))}
      </div>

      {/* 📜 Forge Menu */}
      <div className="flex-1 overflow-y-auto space-y-8 no-scrollbar pb-24">
        {['WEAPON', 'ARMOR', 'ACCESSORY'].map(slot => (
          <div key={slot} className="space-y-4">
            <div className="flex items-center gap-3 px-2">
              <div className="h-[2px] flex-1 bg-gradient-to-r from-transparent to-slate-800" />
              <h3 className="text-[11px] font-black text-slate-500 uppercase tracking-[0.4em] italic flex items-center gap-2">
                {slot === 'WEAPON' ? <Sword size={14}/> : slot === 'ARMOR' ? <Shield size={14}/> : <Zap size={14}/>}
                {slot} FORGING
              </h3>
              <div className="h-[2px] flex-1 bg-gradient-to-l from-transparent to-slate-800" />
            </div>
            
            <div className="grid grid-cols-1 gap-4">
              {Object.entries(RECIPES).map(([tier, recipe]) => (
                <div
                  key={tier}
                  className={`group relative p-5 rounded-[2.5rem] border-2 transition-all overflow-hidden
                    ${tier === 'MASTER' ? 'border-amber-500/50 bg-amber-500/5' : 
                      tier === 'ELITE' ? 'border-blue-500/30 bg-blue-500/5' : 'border-slate-800 bg-slate-900/40'}`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative z-10">
                    <div className="text-left">
                      <div className="flex items-center gap-2">
                        <span className={`text-base font-black uppercase italic ${tier === 'MASTER' ? 'text-amber-500' : 'text-white'}`}>
                          {recipe.label}
                        </span>
                        <div className={`px-2 py-0.5 rounded-full text-[8px] font-bold ${tier === 'MASTER' ? 'bg-amber-500 text-black' : 'bg-white/10 text-slate-400'}`}>
                           {recipe.chance}
                        </div>
                      </div>
                      <p className="text-[10px] text-slate-500 font-medium mt-0.5">{recipe.desc}</p>
                    </div>

                    <div className="flex gap-2 items-center">
                      {[
                        { icon: '/icon/scrap.png', amount: recipe.Scrap, color: 'border-orange-500/30' },
                        { icon: '/icon/shard.png', amount: recipe.Shard, color: 'border-emerald-500/30' },
                        { icon: '/icon/dust.png', amount: recipe.Dust, color: 'border-purple-500/30' }
                      ].map((req, i) => req.amount > 0 && (
                        <div key={i} className={`flex flex-col items-center bg-black/40 border ${req.color} w-12 py-2 rounded-2xl`}>
                          <img src={req.icon} className="w-5 h-5 object-contain mb-1" alt="" />
                          <span className="text-[9px] font-black text-white">{req.amount}</span>
                        </div>
                      ))}

                      <button
                        disabled={isCrafting}
                        onClick={() => handleCraft(tier, slot)}
                        className={`ml-2 w-12 h-12 rounded-2xl flex items-center justify-center transition-all active:scale-90 shadow-lg
                          ${tier === 'MASTER' ? 'bg-amber-500 text-black' : 'bg-white text-black'}`}
                      >
                        <Hammer size={20} className={isCrafting ? 'animate-spin' : ''} />
                      </button>
                    </div>
                  </div>
                  
                  <div className="absolute right-[-5%] top-[-20%] opacity-[0.03] group-hover:opacity-[0.07] transition-all pointer-events-none">
                     <Hammer size={120} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {isCrafting && (
        <div className="fixed inset-0 z-[1000] bg-slate-950/90 backdrop-blur-xl flex flex-col items-center justify-center animate-in fade-in">
          <div className="relative animate-hammer-hit">
            <div className="absolute inset-0 bg-amber-500/20 blur-[60px] animate-pulse rounded-full" />
            <Hammer size={100} className="text-amber-500 relative z-10" />
            <Sparkles className="absolute -top-6 -right-6 text-white animate-bounce" size={40} />
          </div>
          <h2 className="text-2xl font-black italic uppercase text-white mt-10 tracking-[0.2em] animate-pulse">Forging...</h2>
        </div>
      )}

      {lastCrafted && !isCrafting && (
        <div className="fixed inset-0 z-[1100] flex items-center justify-center p-4 animate-in zoom-in duration-300">
          <div className="absolute inset-0 bg-black/95 backdrop-blur-md" onClick={() => setLastCrafted(null)} />
          <div className="relative w-full max-w-sm bg-slate-900 border-2 border-white/10 rounded-[3rem] p-8 text-center shadow-[0_0_80px_rgba(245,158,11,0.2)]">
            <div className="text-8xl mb-6 flex justify-center drop-shadow-[0_0_20px_rgba(255,255,255,0.3)]">
               {typeof lastCrafted.icon === 'string' && lastCrafted.icon.startsWith('/') ? (
                  <img src={lastCrafted.icon} className="w-24 h-24 object-contain" alt="" />
               ) : ( lastCrafted.icon )}
            </div>
            <h3 className="text-3xl font-black text-white uppercase italic">{lastCrafted.name}</h3>
            <div className="inline-block px-4 py-1 bg-amber-500 text-black text-[10px] font-black rounded-full mt-3 mb-6 uppercase tracking-widest">
               Grade: +{lastCrafted.level} SUCCESS
            </div>

            <div className="grid grid-cols-1 gap-2 mb-8">
               {[
                 { label: 'ATK', val: lastCrafted.totalAtk, color: 'text-orange-400', bg: 'bg-orange-500/5' },
                 { label: 'DEF', val: lastCrafted.totalDef, color: 'text-blue-400', bg: 'bg-blue-500/5' },
                 { label: 'HP', val: lastCrafted.totalMaxHp, color: 'text-emerald-400', bg: 'bg-emerald-500/5' }
               ].map(stat => stat.val > 0 && (
                 <div key={stat.label} className={`flex justify-between items-center ${stat.bg} p-4 rounded-2xl border border-white/5`}>
                    <span className={`text-xs font-black uppercase italic ${stat.color}`}>{stat.label}</span>
                    <span className="text-xl font-mono font-black text-white">+{stat.val}</span>
                 </div>
               ))}
            </div>

            <button onClick={() => setLastCrafted(null)} className="w-full py-5 bg-white text-black font-black rounded-[1.5rem] uppercase text-sm active:scale-95 transition-all shadow-xl shadow-white/5">
               Collect Item
            </button>
          </div>
        </div>
      )}

      <style jsx>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        @keyframes hammer-hit {
          0%, 100% { transform: rotate(0deg); }
          50% { transform: rotate(-40deg) translateY(-10px); }
        }
        .animate-hammer-hit { animation: hammer-hit 0.3s ease-in-out infinite; }
      `}</style>
    </div>
  );
}