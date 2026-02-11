import React from 'react';
import { Award, Package, Scroll, Sparkles, ChevronRight, Cpu, Zap, BarChart3, Radio, Target, Activity, ShieldAlert, TrendingUp } from 'lucide-react'; 
import { EQUIPMENTS } from '../../data/equipments'; 
import { itemMaster } from '../../data/itemData'; 

export default function VictoryLootModal({ lootResult, monster, onFinalize, stats }) {
  if (!lootResult) return null;

  // ✅ ดึงข้อมูลดาเมจจาก lootResult
  const totalDamage = lootResult.totalDamageDealt || 0;
  const attackDamage = lootResult.attackDamageDealt || 0;
  const skillDamage = lootResult.skillDamageDealt || 0;
  
  // คำนวณ Ratio
  const atkRatio = totalDamage > 0 ? (attackDamage / totalDamage) * 100 : 0;
  const skillRatio = totalDamage > 0 ? (skillDamage / totalDamage) * 100 : 0;

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
      <div className="absolute inset-0 bg-slate-950/95 backdrop-blur-md" onClick={onFinalize} />
      
      <div className="absolute inset-0 opacity-[0.15] pointer-events-none" 
           style={{ backgroundImage: `radial-gradient(#3b82f6 1px, transparent 0)`, backgroundSize: '24px 24px' }} />
      
      <div className="absolute top-0 left-0 w-full h-[2px] bg-blue-500/50 shadow-[0_0_15px_#3b82f6] animate-[bounce_4s_infinite] pointer-events-none opacity-50" />

      <div className="relative w-full max-w-[440px] bg-slate-900 border border-slate-700 shadow-[0_0_50px_rgba(0,0,0,0.5)] rounded-sm overflow-hidden">
        
        <div className="absolute -top-[1px] -left-[1px] w-10 h-10 border-t-4 border-l-4 border-amber-500 z-10 pointer-events-none" />
        <div className="absolute -top-[1px] -right-[1px] w-10 h-10 border-t-4 border-r-4 border-amber-500 z-10 pointer-events-none" />
        <div className="absolute -bottom-[1px] -left-[1px] w-10 h-10 border-b-4 border-l-4 border-amber-500 z-10 pointer-events-none" />
        <div className="absolute -bottom-[1px] -right-[1px] w-10 h-10 border-b-4 border-r-4 border-amber-500 z-10 pointer-events-none" />

        {/* HEADER */}
        <div className="p-5 border-b border-white/5 bg-slate-950/50 relative">
          <div className="flex justify-between items-center mb-2">
             <div className="flex items-center gap-2">
                <Radio size={12} className="text-red-500 animate-pulse" />
                <span className="text-[9px] text-slate-500 font-bold tracking-[0.2em]">BATTLE_DATA_EXTRACT</span>
             </div>
             <div className="text-[9px] text-blue-500/50 font-mono italic">#{Math.random().toString(36).substring(7).toUpperCase()}</div>
          </div>
          <h2 className="text-4xl font-black text-white italic tracking-tighter uppercase leading-none">
            VICTORY<span className="text-amber-500">_</span>
          </h2>
          <div className="mt-3 flex items-center gap-2">
            <div className="h-1 w-1 bg-amber-500 rounded-full animate-ping" />
            <span className="text-[10px] text-amber-500 font-black uppercase tracking-tight">Deconstructed: {monster?.name || "Target_Entity"}</span>
          </div>
        </div>

        <div className="p-5 space-y-5">
          {/* 📊 COMBAT ANALYTICS GRID - เปลี่ยนจากแนวยาวเป็น Grid 2x2 */}
          <div className="grid grid-cols-2 gap-2">
             {/* Total Damage - ใหญ่กว่าเพื่อน */}
             <div className="col-span-2 bg-slate-950/50 border border-white/5 p-3 flex justify-between items-center relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-1 opacity-20 group-hover:opacity-40 transition-opacity">
                  <TrendingUp size={30} className="text-blue-500" />
                </div>
                <div>
                   <p className="text-[8px] text-slate-500 font-black uppercase mb-1">Cumulative_Output</p>
                   <p className="text-2xl font-black text-white italic tracking-tighter leading-none">{totalDamage.toLocaleString()}</p>
                </div>
                <div className="text-right">
                   <p className="text-[8px] text-blue-400 font-black uppercase mb-1">Efficiency</p>
                   <p className="text-xs font-black text-blue-400">OPTIMAL</p>
                </div>
             </div>

             {/* Attack Stat Card */}
             <div className="bg-blue-500/5 border border-blue-500/20 p-3 relative group">
                <div className="flex items-center gap-2 mb-2">
                   <Target size={12} className="text-blue-400" />
                   <span className="text-[8px] text-blue-400 font-black uppercase">Neutral_Atk</span>
                </div>
                <p className="text-lg font-black text-white italic leading-none mb-2">{attackDamage.toLocaleString()}</p>
                <div className="w-full h-1 bg-slate-800 rounded-full overflow-hidden">
                   <div className="h-full bg-blue-500 transition-all duration-1000 shadow-[0_0_8px_#3b82f6]" style={{ width: `${atkRatio}%` }} />
                </div>
                <span className="absolute top-3 right-3 text-[10px] font-black text-blue-500/40">{atkRatio.toFixed(0)}%</span>
             </div>

             {/* Skill Stat Card */}
             <div className="bg-purple-500/5 border border-purple-500/20 p-3 relative group">
                <div className="flex items-center gap-2 mb-2">
                   <Zap size={12} className="text-purple-400" />
                   <span className="text-[8px] text-purple-400 font-black uppercase">Neural_Skill</span>
                </div>
                <p className="text-lg font-black text-white italic leading-none mb-2">{skillDamage.toLocaleString()}</p>
                <div className="w-full h-1 bg-slate-800 rounded-full overflow-hidden">
                   <div className="h-full bg-purple-500 transition-all duration-1000 shadow-[0_0_8px_#a855f7]" style={{ width: `${skillRatio}%` }} />
                </div>
                <span className="absolute top-3 right-3 text-[10px] font-black text-purple-500/40">{skillRatio.toFixed(0)}%</span>
             </div>
          </div>

          {/* LOOT SECTION */}
          <div className="space-y-2">
            <div className="flex justify-between items-center px-1">
               <div className="text-[9px] text-slate-500 font-black uppercase tracking-widest flex items-center gap-2">
                 <Package size={12} /> Items_Retrieved
               </div>
               <span className="text-[8px] text-slate-700 font-mono">COUNT: {itemsToDisplay.length}</span>
            </div>

            <div className="grid grid-cols-1 gap-1.5 max-h-[180px] overflow-y-auto pr-2 custom-scrollbar">
              {itemsToDisplay.map((item, index) => {
                const isSkill = !!(item.isSpecialSkill || item.type === 'SKILL');
                const rarityClass = getRarityStyles(item.rarity, item.level, item.isShiny);
                const cleanId = (item.id || item.itemId || '').split('-')[0];
                const itemInfo = itemMaster[cleanId] || EQUIPMENTS.find(e => e.id === cleanId) || item;

                return (
                  <div key={index} className={`relative flex items-center p-2.5 border transition-all hover:bg-white/5 ${rarityClass}`}>
                    <div className="w-9 h-9 shrink-0 bg-black/60 border border-white/5 flex items-center justify-center relative mr-3">
                      {isSkill ? <Scroll size={16} /> : <span className="text-xl">{itemInfo?.icon || "📦"}</span>}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-center">
                        <span className="text-[11px] font-black text-white uppercase truncate">{itemInfo?.name || item.name}</span>
                        {item.amount > 1 && <span className="text-amber-500 text-[10px] font-black ml-2">x{item.amount}</span>}
                      </div>
                      <div className="flex items-center gap-2 mt-1 opacity-30">
                        <div className="w-12 h-[2px] bg-white/20" />
                        <span className="text-[6px] font-mono tracking-tighter">DATA_FRAGMENT_{index}</span>
                      </div>
                    </div>
                    {item.isShiny && <Sparkles size={10} className="ml-2 text-yellow-400 animate-pulse" />}
                  </div>
                );
              })}
            </div>
          </div>

          {/* EXP SECTION */}
          <div className="bg-blue-500/10 border-l-4 border-blue-500 p-4 relative overflow-hidden group">
            <div className="absolute right-0 top-0 h-full w-24 bg-gradient-to-l from-blue-500/20 to-transparent pointer-events-none" />
            <div className="flex justify-between items-center relative z-10">
              <div>
                <p className="text-[9px] text-blue-400 font-black uppercase mb-1">Neural_Link_EXP</p>
                <p className="text-4xl font-black text-white italic leading-none">+{monster?.expReward || monster?.exp || 0}</p>
              </div>
              <div className="flex gap-1 h-8 items-end opacity-40">
                  {[20, 50, 30, 70, 40].map((h, i) => (
                    <div key={i} className={`w-1 bg-blue-500 animate-pulse`} style={{ height: `${h}%` }} />
                  ))}
              </div>
            </div>
          </div>

          <button 
            onClick={onFinalize} 
            className="relative w-full h-14 bg-white active:scale-[0.98] transition-all group overflow-hidden"
          >
            <div className="absolute inset-0 bg-amber-500 translate-x-[-100%] group-hover:translate-x-0 transition-transform duration-300 pointer-events-none" />
            <div className="relative flex items-center justify-center gap-3 text-slate-950 font-black uppercase tracking-[0.2em] italic transition-colors group-hover:text-white">
              <span>FINALIZE_EXTRACTION</span>
              <ChevronRight size={18} />
            </div>
          </button>
        </div>

        <div className="px-5 py-2 bg-slate-950 text-[7px] text-slate-700 flex justify-between font-mono border-t border-white/5 uppercase">
           <span>DB: SYNC_OK</span>
           <span>SECURE: ENCRYPTED_LINK</span>
           <span>TS: {new Date().getTime()}</span>
        </div>
      </div>
    </div>
  );
}