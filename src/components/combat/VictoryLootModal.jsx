import React from 'react';
import { Award, Package, Scroll, CheckCircle2, Sparkles } from 'lucide-react'; 
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

 // 📦 [แก้ไขใหม่] ป้องกันการโชว์ไอเทมที่ "ID ซ้ำกันเป๊ะ" (กรณีระบบรันเบิ้ล)
  const aggregatedItems = filteredItems.reduce((acc, item) => {
    // 1. ใช้ ID เต็มๆ (ที่มี uniqueSuffix) ในการเช็คด่านแรก
    const isDuplicateInstance = acc.find(i => i.id === item.id);
    
    // 2. ถ้าเจอ ID ซ้ำกันเป๊ะ (แสดงว่า Logic รันเบิ้ล) ให้ข้ามไปเลย ไม่ต้องเพิ่มลงจอ
    if (isDuplicateInstance) {
      return acc; 
    }

    // 3. ถ้าเป็นพวก Material (วัสดุ) ให้เช็ค CleanId เพื่อรวมยอด (Stack)
    let rawId = item.id || item.itemId || (typeof item.name === 'string' ? item.name.toLowerCase() : 'unknown');
    const cleanId = typeof rawId === 'string' && rawId.includes('-') ? rawId.split('-')[0] : rawId;

    const existingMaterial = acc.find(i => {
       const iRawId = i.id || i.itemId || (typeof i.name === 'string' ? i.name.toLowerCase() : '');
       const iCleanId = typeof iRawId === 'string' && iRawId.includes('-') ? iRawId.split('-')[0] : iRawId;
       return iCleanId === cleanId && (item.type === 'MATERIAL' || !item.slot);
    });

    if (existingMaterial) {
      // ถ้าเป็นวัสดุชื่อเดียวกัน ให้บวกยอดรวมกันในกล่องเดียว
      existingMaterial.amount = (existingMaterial.amount || 1) + (item.amount || 1);
    } else {
      // ถ้าเป็นอุปกรณ์ (ซึ่งตอนนี้ ID ไม่ซ้ำแล้ว) หรือวัสดุชิ้นใหม่ ให้เพิ่มเข้าไป
      acc.push({ ...item, amount: item.amount || 1 });
    }
    
    return acc;
  }, []);

  const itemsToDisplay = droppedSkill 
    ? [{ ...droppedSkill, isSpecialSkill: true }, ...aggregatedItems] 
    : aggregatedItems;

  const getRarityStyles = (rarity, level = 0, isShiny = false) => {
    // ✨ [เพิ่มใหม่] เช็คสถานะ SHINY เพื่อสร้างกรอบทอง
    if (isShiny) {
      return `border-yellow-400 bg-gradient-to-b from-yellow-500/20 to-black/60 text-yellow-300 shadow-[0_0_20px_rgba(250,204,21,0.5)] animate-pulse ring-1 ring-yellow-400/50`;
    }

    const isHighLevel = level >= 2;
    const levelGlow = isHighLevel ? 'ring-2 ring-amber-500/50 shadow-[0_0_20px_rgba(245,158,11,0.4)]' : '';

    switch (rarity) {
      case 'Uncommon': return `${levelGlow} border-emerald-500/50 bg-emerald-500/5 text-emerald-400 shadow-[0_0_10px_rgba(16,185,129,0.1)]`;
      case 'Rare': return `${levelGlow} border-blue-500/50 bg-blue-500/5 text-blue-400 shadow-[0_0_15px_rgba(59,130,246,0.15)]`;
      case 'Epic': return `${levelGlow} border-purple-500/50 bg-purple-500/5 text-purple-400 shadow-[0_0_20px_rgba(168,85,247,0.2)]`;
      case 'Legendary': return `border-amber-500 bg-amber-500/10 text-amber-400 shadow-[0_0_25px_rgba(245,158,11,0.3)] animate-pulse`;
      default: return `${levelGlow} border-white/5 bg-black/40 text-white`;
    }
  };

  return (
    <div className="fixed inset-0 z-[150] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-md" onClick={onFinalize} />

      <div className="relative w-full max-w-[360px] bg-slate-900 border-2 border-amber-500/50 rounded-[2.5rem] overflow-hidden shadow-[0_0_50px_rgba(245,158,11,0.25)] animate-in zoom-in-95 duration-300">
        
        <div className="bg-gradient-to-b from-amber-500/20 to-transparent p-6 text-center border-b border-white/5">
          <div className="inline-flex p-3 bg-amber-500 rounded-2xl shadow-lg mb-2 relative">
            <Award className="text-slate-900" size={32} />
            <Sparkles className="absolute -top-1 -right-1 text-white animate-bounce" size={16} />
          </div>
          <h2 className="text-2xl font-black text-white italic uppercase tracking-tight">Victory!</h2>
          <p className="text-amber-500 text-[9px] font-black uppercase tracking-widest">Defeated: {monster?.name}</p>
        </div>

        <div className="p-6 space-y-4">
          <div className="space-y-2 max-h-[260px] overflow-y-auto pr-1 custom-scrollbar">
             {itemsToDisplay.map((item, index) => {
               const isSkill = !!(item.isSpecialSkill || item.type === 'SKILL');
               const itemLevel = item.level || 0;
               // ✅ ส่ง item.isShiny เข้าไปใน getRarityStyles
               const rarityClass = getRarityStyles(item.rarity, itemLevel, item.isShiny);
               
               let rawId = item.id || item.itemId || (typeof item.name === 'string' ? item.name.toLowerCase() : '');
               const cleanId = typeof rawId === 'string' && rawId.includes('-') ? rawId.split('-')[0] : rawId;
               
               const itemInfo = itemMaster[cleanId] || EQUIPMENTS.find(e => e.id === cleanId) || item;
               const itemSlot = itemInfo?.slot || item.slot || null;
               
               return (
                 <div key={index} className={`flex justify-between items-center p-2.5 rounded-xl border transition-all ${rarityClass}`}>
                    <div className="flex items-center gap-3 min-w-0">
                      <div className={`w-10 h-10 flex items-center justify-center bg-black/40 rounded-lg overflow-hidden shrink-0 relative ${item.isShiny ? 'ring-1 ring-yellow-400' : ''}`}>
                        {isSkill ? (
                          <Scroll size={18} className="text-amber-500 animate-pulse" />
                        ) : (
                          <>
                            {itemInfo?.image && itemInfo.image.startsWith('/') ? (
                              <img src={itemInfo.image} className="w-full h-full object-contain p-1" alt="" />
                            ) : (
                              <span className="text-xl">{itemInfo?.icon || itemInfo?.image || item.icon || "📦"}</span>
                            )}
                            
                            {/* ✨ ประกายวิ้งๆ สำหรับของ Shiny */}
                            {item.isShiny && <Sparkles size={12} className="absolute -top-1 -left-1 text-yellow-400 animate-spin-slow" />}

                            {itemLevel > 0 && (
                              <div className="absolute -top-1 -right-1 bg-amber-500 text-[8px] font-black text-slate-950 px-1 rounded-sm border border-slate-900 shadow-lg">
                                +{itemLevel}
                              </div>
                            )}
                          </>
                        )}
                      </div>
                      <div className="flex flex-col min-w-0">
                        <div className="flex items-center gap-1.5">
                          <span className={`text-[10px] font-black uppercase tracking-wide leading-none truncate ${item.isShiny ? 'text-yellow-200' : ''}`}>
                            {itemInfo?.name || item.name || "Unknown Item"} 
                            {item.amount > 1 && <span className="text-amber-500 ml-1 font-mono">x{item.amount}</span>}
                          </span>
                          {(itemLevel >= 2 || item.isShiny) && <Sparkles size={10} className={`${item.isShiny ? 'text-yellow-400' : 'text-amber-500'} animate-pulse shrink-0`} />}
                        </div>
                        <div className="flex items-center gap-2">
                          <span className={`text-[7px] font-bold opacity-60 uppercase tracking-widest ${item.isShiny ? 'text-yellow-400 opacity-100' : ''}`}>
                            {item.isShiny ? '✨ SHINY VARIANT' : (isSkill ? 'Special Skill' : item.rarity || itemInfo?.rarity || 'Common')}
                          </span>
                          {itemSlot && (
                            <div className="flex items-center gap-1">
                              <span className="text-[6px] font-black text-amber-500/80 uppercase">TYPE:</span>
                              <span className="text-[6px] px-1 bg-white/10 rounded font-black text-slate-300 uppercase tracking-tighter">
                                {itemSlot}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                        <span className={`text-[8px] font-black animate-pulse ${item.isShiny ? 'text-yellow-400' : (itemLevel >= 2 ? 'text-amber-400' : 'text-emerald-400')}`}>
                          {item.isShiny ? 'LEGENDARY!' : (itemLevel >= 2 ? 'SUPER!' : 'NEW!')}
                        </span>
                    </div>
                 </div>
               );
             })}
          </div>

          <div className="w-full">
            <div className="bg-slate-950/80 rounded-xl py-3 px-4 border border-blue-500/20 text-center shadow-inner relative overflow-hidden group">
              <span className="relative z-10 text-[10px] font-black text-slate-400 uppercase block mb-1 tracking-widest">Experience Gained</span>
              <span className="relative z-10 text-2xl font-black text-blue-400 italic">+{monster?.expReward || monster?.exp || 0}</span>
            </div>
          </div>

          <button 
            onClick={onFinalize} 
            className="w-full py-4 bg-gradient-to-r from-orange-600 to-orange-400 text-white font-black rounded-2xl uppercase italic text-lg shadow-[0_10px_20px_rgba(234,88,12,0.3)] active:scale-95 transition-all hover:brightness-110"
          >
            Claim Rewards
          </button>
        </div>
      </div>
    </div>
  );
}