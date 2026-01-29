import React, { useState, useMemo } from 'react';
import { Library, Target, Star, X } from 'lucide-react'; // ✅ เพิ่ม X สำหรับปุ่มปิด
import { monsters } from '../data/monsters';
import { itemMaster } from '../data/itemData';

const rarityStyles = {
  Common: { border: "border-slate-700", bg: "bg-slate-950", text: "text-slate-500", btnActive: "bg-slate-100 text-black" },
  Uncommon: { border: "border-green-800", bg: "bg-green-950/20", text: "text-green-500", btnActive: "bg-green-600 text-white" },
  Rare: { border: "border-blue-800", bg: "bg-blue-950/20", text: "text-blue-500", btnActive: "bg-blue-600 text-white" },
  Epic: { border: "border-purple-800", bg: "bg-purple-950/20", text: "text-purple-500", btnActive: "bg-purple-600 text-white" },
  Legendary: { border: "border-orange-600", bg: "bg-orange-950/30", text: "text-orange-500", btnActive: "bg-orange-600 text-white" },
};

export default function CollectionView({ inventory, collScore }) {
  const [activeFilter, setActiveFilter] = useState('All');
  
  // ✅ 1. เพิ่ม State สำหรับจัดการ Tooltip บนมือถือ (จิ้มแล้วเด้ง)
  const [selectedItem, setSelectedItem] = useState(null);

  const allGameItems = useMemo(() => {  
    const items = [];
    const seen = new Set();
    monsters.forEach(m => {
      m.lootTable?.forEach(loot => {
        const key = `${loot.name}-${loot.rarity}`;
        if (!seen.has(key)) {
          const masterData = itemMaster[loot.name] || {}; 
          items.push({ ...loot, ...masterData, droppedBy: m.name });
          seen.add(key);
        }
      });
    });
    return items;
  }, []);

  const playerOwnedMap = useMemo(() => {
    const data = {};
    inventory.forEach(item => {
      const key = `${item.name}-${item.rarity}`;
      if (!data[key]) data[key] = { count: 0, hasShiny: false };
      data[key].count += 1;
      if (item.isShiny) data[key].hasShiny = true;
    });
    return data;
  }, [inventory]);

  const filteredCollection = useMemo(() => {
    if (activeFilter === 'All') return allGameItems;
    if (activeFilter === 'Shiny') {
      return allGameItems.filter(item => playerOwnedMap[`${item.name}-${item.rarity}`]?.hasShiny);
    }
    return allGameItems.filter(item => {
      const stats = playerOwnedMap[`${item.name}-${item.rarity}`];
      const isRarityMatch = item.rarity === activeFilter;
      const isNotShiny = stats ? !stats.hasShiny : true; 
      return isRarityMatch && isNotShiny;
    });
  }, [allGameItems, activeFilter, playerOwnedMap]);

  const totalFound = allGameItems.filter(item => !!playerOwnedMap[`${item.name}-${item.rarity}`]).length;
  const completionRate = ((totalFound / allGameItems.length) * 100).toFixed(0);

  return (
    <div className="max-w-7xl mx-auto space-y-4 pb-32 px-4 pt-6 text-slate-200">
      
      {/* HEADER: ปรับให้กะทัดรัดขึ้นในมือถือ */}
      <div className="flex flex-col gap-2 border-b border-slate-800 pb-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center gap-2 font-serif">
            <Library className="text-amber-500" size={18} />
            <h2 className="text-sm font-black uppercase tracking-widest text-white italic">Collection Archive</h2>
          </div>
          <div className="text-[9px] sm:text-[10px] font-mono text-slate-500 uppercase tracking-tighter flex flex-wrap gap-2">
            <span>Progress: <span className="text-white">{totalFound}/{allGameItems.length}</span></span>
            <span className="text-amber-500">| Score: {collScore}</span> 
          </div>
        </div>
        <div className="w-full h-1.5 bg-slate-900 rounded-full overflow-hidden border border-white/5">
          <div className="h-full bg-amber-500 shadow-[0_0_10px_#f59e0b] transition-all duration-1000" style={{ width: `${completionRate}%` }} />
        </div>
      </div>

      {/* FILTERS: เพิ่ม overflow-x-auto เพื่อไม่ให้ปุ่มเบียดกันจนเลื่อนไม่ได้ */}
      <div className="flex flex-nowrap sm:flex-wrap gap-1.5 overflow-x-auto pb-2 scrollbar-hide">
        {['All', 'Common', 'Uncommon', 'Rare', 'Epic', 'Legendary', 'Shiny'].map(r => {
          const isActive = activeFilter === r;
          const style = rarityStyles[r] || { btnActive: "bg-white text-black" };
          return (
            <button
              key={r}
              onClick={() => setActiveFilter(r)}
              className={`whitespace-nowrap px-3 py-1.5 rounded-md text-[9px] font-black uppercase transition-all border-2 
                ${isActive 
                  ? (r === 'Shiny' ? 'bg-gradient-to-r from-red-500 via-yellow-500 to-blue-500 text-white border-transparent' : `${style.btnActive} border-white`) 
                  : 'text-slate-400 border-slate-800 bg-slate-950/50'}`}
            >
              {r === 'Shiny' ? '✨ Shiny' : r}
            </button>
          );
        })}
      </div>

      {/* GRID: ปรับเป็น 4 คอลัมน์ (มือถือ) / 7 คอลัมน์ (แท็บเล็ต) / 10 คอลัมน์ (คอม) */}
      <div className="grid grid-cols-4 sm:grid-cols-7 lg:grid-cols-10 gap-2 md:gap-3 content-start min-h-[400px]">
        {filteredCollection.length > 0 ? (
          filteredCollection.map((item, index) => {
            const stats = playerOwnedMap[`${item.name}-${item.rarity}`];
            const isOwned = !!stats;
            const showAsShiny = activeFilter === 'Shiny' || (isOwned && stats.hasShiny);
            const style = rarityStyles[item.rarity];
            const pointsMap = { Common: 1, Uncommon: 5, Rare: 10, Epic: 15, Legendary: 20 };
            const pointValue = pointsMap[item.rarity] || 0;       

            return (
              <div 
                key={index} 
                className="relative group hover:z-50"
                onClick={() => isOwned && setSelectedItem({ ...item, showAsShiny, pointValue })} // ✅ จิ้มเพื่อเปิด Tooltip
              >
                {isOwned && stats.count > 0 && (
                  <span className="absolute -top-1 -left-1 bg-white text-black text-[8px] font-black px-1 rounded z-30 border border-slate-200">
                    x{stats.count}
                  </span>
                )}

                <div className={`relative min-h-[85px] md:min-h-[100px] p-[1.5px] rounded-xl transition-all flex flex-col items-center justify-center
                  ${isOwned ? 'cursor-pointer md:cursor-help hover:scale-105' : 'opacity-25 grayscale'}`}>
                  
                  {isOwned && showAsShiny && (
                    <div className="absolute inset-0 rounded-xl bg-[linear-gradient(45deg,#ff0000,#ffff00,#00ff00,#00ffff,#0000ff,#ff00ff,#ff0000)] animate-pulse opacity-50" />
                  )}
                  
                  <div className={`relative w-full h-full p-2 rounded-[10px] flex flex-col items-center justify-center z-10 
                    ${isOwned ? `bg-slate-900 border-2 ${showAsShiny ? 'border-white/40' : style.border}` : 'bg-slate-950 border border-slate-900'}`}>
                    
                    <div className="relative w-10 h-10 md:w-12 md:h-12 mb-1 flex items-center justify-center">
                      {isOwned ? (
                        item.image ? (
                          <img src={item.image} alt={item.name} className="w-full h-full object-contain drop-shadow-md" />
                        ) : ( <span className="text-xl">📦</span> )
                      ) : ( <span className="text-xl font-black text-slate-800">?</span> )}
                    </div>

                    <div className="text-center w-full">
                      <p className={`text-[6px] md:text-[7px] font-black uppercase tracking-tighter mb-0.5 
                        ${isOwned ? (showAsShiny ? 'text-amber-400 animate-pulse' : style.text) : 'text-transparent'}`}>
                        {showAsShiny ? '✨ SHINY' : item.rarity}
                      </p>
                      <h4 className={`text-[8px] md:text-[9px] font-bold leading-tight line-clamp-1 ${isOwned ? 'text-white' : 'text-slate-800'}`}>
                        {isOwned ? item.name : 'Unknown'}
                      </h4>
                    </div>
                  </div>
                </div>

                {/* ✅ TOOLTIP (Desktop): ยังคงเดิมไว้ 100% สำหรับการใช้เมาส์ */}
                {isOwned && (
                  <div className="hidden md:block absolute bottom-[105%] left-1/2 -translate-x-1/2 w-64 opacity-0 group-hover:opacity-100 transition-all pointer-events-none z-[150] origin-bottom">
                    <div className="bg-slate-900/95 backdrop-blur-xl border border-slate-700 rounded-t-xl p-2.5 shadow-2xl">
                      <div className="flex justify-between items-start mb-2">
                        <span className="text-[11px] font-black text-white italic uppercase tracking-wide">{item.name}</span>
                        {showAsShiny && <span className="text-[8px] bg-amber-500 text-black px-2 py-0.5 rounded font-black uppercase">SHINY</span>}
                      </div>
                      <p className="text-[10px] text-slate-400 italic mb-3 border-l-2 border-slate-700 pl-3">"{item.description}"</p>
                      <div className="flex items-center gap-2 pt-2 border-t border-white/5">
                        <Target size={12} className="text-amber-500/50" /> 
                        <div className="flex flex-col">
                          <span className="text-[8px] text-slate-500 font-bold uppercase">Dropped By:</span>
                          <span className="text-[10px] font-black text-slate-200 italic uppercase">{item.droppedBy}</span>
                        </div>
                      </div>
                    </div>
                    <div className="bg-gradient-to-r from-yellow-600 to-amber-700 rounded-b-xl px-4 py-1 flex items-center justify-between">
                      <Star size={10} className="text-white" fill="currentColor" />
                      <span className="text-white text-[10px] font-black uppercase tracking-widest">+ {pointValue} Collection Point</span>
                    </div>
                  </div>
                )}
              </div>
            );
          })
        ) : (
          <div className="col-span-full py-20 flex flex-col items-center justify-center text-slate-800">
            <Library size={40} className="opacity-20 mb-2" />
            <p className="text-[10px] font-black uppercase tracking-widest">Vault Empty</p>
          </div>
        )}
      </div>

      {/* ✅ 2. MOBILE TOOLTIP MODAL: จิ้มแล้วเด้งกลางจอสำหรับมือถือ */}
      {selectedItem && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-6 md:hidden" onClick={() => setSelectedItem(null)}>
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" />
          <div 
            className="relative w-full max-w-xs bg-slate-900 border border-amber-500/50 rounded-3xl overflow-hidden shadow-2xl animate-in zoom-in duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <button onClick={() => setSelectedItem(null)} className="absolute top-4 right-4 text-slate-500 hover:text-white"><X size={20}/></button>
            
            <div className="p-6">
              <div className="flex items-center gap-4 mb-4">
                <div className={`w-16 h-16 rounded-2xl flex items-center justify-center bg-slate-800 border-2 ${selectedItem.showAsShiny ? 'border-amber-500' : rarityStyles[selectedItem.rarity].border}`}>
                  {selectedItem.image ? <img src={selectedItem.image} className="w-12 h-12 object-contain" /> : <span className="text-2xl">📦</span>}
                </div>
                <div>
                  <h3 className="text-white font-black uppercase italic text-lg leading-tight">{selectedItem.name}</h3>
                  <p className={`text-[10px] font-black uppercase ${selectedItem.showAsShiny ? 'text-amber-500' : rarityStyles[selectedItem.rarity].text}`}>
                    {selectedItem.showAsShiny ? '✨ Shiny Variant' : selectedItem.rarity}
                  </p>
                </div>
              </div>

              <p className="text-slate-400 text-sm italic mb-6 leading-relaxed border-l-4 border-slate-700 pl-4">"{selectedItem.description}"</p>
              
              <div className="space-y-3 mb-6">
                <div className="flex items-center gap-3 text-slate-300">
                  <Target size={16} className="text-amber-500" />
                  <div>
                    <p className="text-[10px] uppercase font-bold text-slate-500 leading-none mb-1">Dropped By</p>
                    <p className="text-sm font-black text-white uppercase italic">{selectedItem.droppedBy}</p>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-r from-amber-600 to-orange-700 p-4 rounded-2xl flex items-center justify-between shadow-lg">
                <div className="flex items-center gap-2">
                  <Star size={16} className="text-white fill-white" />
                  <span className="text-white font-black uppercase text-xs tracking-tighter">Collection Score</span>
                </div>
                <span className="text-white font-black text-xl">+{selectedItem.pointValue}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}