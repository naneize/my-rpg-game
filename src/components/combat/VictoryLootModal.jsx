import React from 'react';
import { Award, Package, Scroll, Sparkles, ChevronRight, Cpu, Zap, BarChart3, Radio } from 'lucide-react'; 
import { EQUIPMENTS } from '../../data/equipments'; 
import { itemMaster } from '../../data/itemData'; 

export default function VictoryLootModal({ lootResult, monster, onFinalize, stats }) {
  if (!lootResult) return null;

  const baseItems = Array.isArray(lootResult) ? lootResult : (lootResult.items || []);
  
  const droppedSkill = lootResult.skill || baseItems.find(item => 
    item.type === 'SKILL' || (item.skillId && item.skillId !== 'none')
  );
  
  const filteredItems = baseItems.filter(item => {
    const isThisASkill = item.type === 'SKILL' || (item.skillId && item.skillId !== 'none');
    return !isThisASkill;
  });

  const aggregatedItems = filteredItems.reduce((acc, item) => {
    const isDuplicateInstance = acc.find(i => i.id === item.id);
    if (isDuplicateInstance) return acc; 

    let rawId = item.id || item.itemId || (typeof item.name === 'string' ? item.name.toLowerCase() : 'unknown');
    const cleanId = typeof rawId === 'string' && rawId.includes('-') ? rawId.split('-')[0] : rawId;

    const existingMaterial = acc.find(i => {
       const iRawId = i.id || i.itemId || (typeof i.name === 'string' ? i.name.toLowerCase() : '');
       const iCleanId = typeof iRawId === 'string' && iRawId.includes('-') ? iRawId.split('-')[0] : iRawId;
       return iCleanId === cleanId && (item.type === 'MATERIAL' || !item.slot);
    });

    if (existingMaterial) {
      existingMaterial.amount = (existingMaterial.amount || 1) + (item.amount || 1);
    } else {
      acc.push({ ...item, amount: item.amount || 1 });
    }
    
    return acc;
  }, []);

  const itemsToDisplay = droppedSkill 
    ? [{ ...droppedSkill, isSpecialSkill: true }, ...aggregatedItems] 
    : aggregatedItems;

  const getRarityStyles = (rarity, level = 0, isShiny = false) => {
    if (isShiny) return `border-yellow-500/50 bg-yellow-500/10 text-yellow-200 shadow-[0_0_15px_rgba(250,204,21,0.2)]`;
    switch (rarity) {
      case 'Uncommon': return `border-emerald-500/40 bg-emerald-900/20 text-emerald-400`;
      case 'Rare': return `border-blue-500/40 bg-blue-900/20 text-blue-400`;
      case 'Epic': return `border-purple-500/40 bg-purple-900/20 text-purple-400`;
      case 'Legendary': return `border-amber-500/50 bg-amber-900/30 text-amber-300`;
      default: return `border-slate-700/50 bg-slate-800/40 text-slate-400`;
    }
  };

  return (
    <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 font-mono overflow-hidden">
      {/* 🌑 Overlay เข้มๆ ฟีล Lab */}
      <div className="absolute inset-0 bg-slate-950/95 backdrop-blur-md" onClick={onFinalize} />
      
      {/* 🟦 เส้น Grid พื้นหลัง (ใช้ Tailwind สร้าง) */}
      <div className="absolute inset-0 opacity-[0.15] pointer-events-none" 
           style={{ backgroundImage: `radial-gradient(#3b82f6 1px, transparent 0)`, backgroundSize: '24px 24px' }} />
      
      {/* 🛰️ เส้น Scan Line (ใช้ Animation ของ Tailwind) */}
      <div className="absolute top-0 left-0 w-full h-[2px] bg-blue-500/50 shadow-[0_0_15px_#3b82f6] animate-[bounce_4s_infinite] pointer-events-none opacity-50" />

      {/* 📦 Main UI Box */}
      <div className="relative w-full max-w-[420px] bg-slate-900 border border-slate-700 shadow-[0_0_50px_rgba(0,0,0,0.5)] rounded-sm">
        
        {/* 📐 Corner Brackets (เส้นขอบมุม 4 ด้าน) */}
        <div className="absolute -top-[1px] -left-[1px] w-10 h-10 border-t-4 border-l-4 border-amber-500 z-10" />
        <div className="absolute -top-[1px] -right-[1px] w-10 h-10 border-t-4 border-r-4 border-amber-500 z-10" />
        <div className="absolute -bottom-[1px] -left-[1px] w-10 h-10 border-b-4 border-l-4 border-amber-500 z-10" />
        <div className="absolute -bottom-[1px] -right-[1px] w-10 h-10 border-b-4 border-r-4 border-amber-500 z-10" />

        {/* 📊 Header Section */}
        <div className="p-6 border-b border-white/5 relative overflow-hidden bg-slate-950/50">
          <div className="flex justify-between items-center mb-4">
             <div className="flex items-center gap-2">
                <Radio size={14} className="text-red-500 animate-pulse" />
                <span className="text-[10px] text-slate-400 font-bold tracking-[0.2em]">REC // BATTLE_LOG</span>
             </div>
             <div className="text-[10px] text-blue-500 font-mono">STATUS: SYNC_COMPLETE</div>
          </div>
          
          <h2 className="text-5xl font-black text-white italic tracking-tighter uppercase mb-2">
            VICTORY<span className="text-amber-500 animate-pulse">_</span>
          </h2>
          
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-500 text-slate-950 text-[10px] font-black uppercase skew-x-[-12deg]">
             Target Identified: {monster?.name || "Unknown Entity"}
          </div>
        </div>

        {/* 🧪 Research Result (Loot Items) */}
        <div className="p-6 space-y-4">
          <div className="text-[10px] text-slate-500 font-bold uppercase mb-2 flex items-center gap-2">
             <Cpu size={12} /> Resource Extraction Result
          </div>

          <div className="space-y-2 max-h-[260px] overflow-y-auto pr-2 custom-scrollbar">
            {itemsToDisplay.map((item, index) => {
              const isSkill = !!(item.isSpecialSkill || item.type === 'SKILL');
              const rarityClass = getRarityStyles(item.rarity, item.level, item.isShiny);
              const cleanId = (item.id || item.itemId || '').split('-')[0];
              const itemInfo = itemMaster[cleanId] || EQUIPMENTS.find(e => e.id === cleanId) || item;

              return (
                <div key={index} className={`relative flex items-center p-3 border rounded-sm transition-all hover:bg-white/5 group ${rarityClass}`}>
                  {/* Icon Scan Box */}
                  <div className="w-12 h-12 shrink-0 bg-black/60 border border-white/10 flex items-center justify-center relative overflow-hidden mr-4">
                    <div className="absolute inset-0 bg-blue-500/10 animate-pulse" />
                    {isSkill ? <Scroll size={20} className="relative z-10" /> : <span className="text-2xl relative z-10">{itemInfo?.icon || "📦"}</span>}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between">
                      <span className="text-xs font-bold text-white uppercase truncate">
                        {itemInfo?.name || item.name}
                      </span>
                      {item.amount > 1 && <span className="text-amber-500 text-[10px] font-black">x{item.amount}</span>}
                    </div>
                    
                    {/* Fake Data Bar */}
                    <div className="mt-2 flex items-center gap-2">
                      <div className="flex-1 h-[3px] bg-slate-800">
                        <div className="h-full bg-current opacity-50 animate-[shimmer_2s_infinite]" style={{ width: '75%' }} />
                      </div>
                      <span className="text-[7px] opacity-50">DECODING...</span>
                    </div>
                  </div>
                  
                  {item.isShiny && <Sparkles size={12} className="ml-2 text-yellow-400 animate-spin-slow" />}
                </div>
              );
            })}
          </div>

          {/* 📈 Exp Graph Section */}
          <div className="bg-black/60 border-l-2 border-blue-500 p-4">
            <div className="flex justify-between items-end">
              <div>
                <div className="text-[9px] text-blue-400 font-bold uppercase mb-1 flex items-center gap-1">
                  <BarChart3 size={10} /> Neural Link Exp
                </div>
                <div className="text-4xl font-black text-blue-400 italic leading-none">
                  +{monster?.expReward || monster?.exp || 0}
                </div>
              </div>
              
              {/* Fake Graph Bars */}
              <div className="flex gap-1 h-10 items-end opacity-50">
                 {[30, 60, 45, 80, 50, 90, 40].map((h, i) => (
                   <div key={i} className={`w-1 bg-blue-500 animate-[pulse_${1+i/5}s_infinite]`} style={{ height: `${h}%` }} />
                 ))}
              </div>
            </div>
          </div>

          {/* 🔘 Action Button */}
          <button 
            onClick={onFinalize} 
            className="relative w-full h-14 bg-white hover:bg-amber-400 transition-colors group overflow-hidden"
          >
            {/* กล่องสีส้มที่วิ่งทับตอน Hover */}
            <div className="absolute inset-0 bg-amber-500 translate-x-[-100%] group-hover:translate-x-0 transition-transform duration-300" />
            <div className="relative flex items-center justify-center gap-3 text-slate-950 font-black uppercase tracking-[0.2em] italic">
              <span>FINALIZE_EXTRACTION</span>
              <ChevronRight size={18} />
            </div>
          </button>
        </div>

        {/* 📑 Footer Info */}
        <div className="px-6 py-2 bg-slate-950 text-[8px] text-slate-600 flex justify-between font-mono">
           <span>DB_QUERY: 0.002s</span>
           <span>ENCRYPT: AES-256</span>
           <span>LOCAL_TIME: {new Date().toLocaleTimeString()}</span>
        </div>
      </div>
    </div>
  );
}