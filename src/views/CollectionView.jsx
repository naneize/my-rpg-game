import React, { useState, useMemo } from 'react';
import { Library, Target, Star } from 'lucide-react';
import { monsters } from '../data/monsters';
import { itemMaster } from '../data/itemData';


// ==========================================
// 💎 1. CONFIGURATION: ตั้งค่าคะแนนและสไตล์
// ==========================================


const rarityStyles = {
  Common: { border: "border-slate-700", bg: "bg-slate-950", text: "text-slate-500", btnActive: "bg-slate-100 text-black" },
  Uncommon: { border: "border-green-800", bg: "bg-green-950/20", text: "text-green-500", btnActive: "bg-green-600 text-white" },
  Rare: { border: "border-blue-800", bg: "bg-blue-950/20", text: "text-blue-500", btnActive: "bg-blue-600 text-white" },
  Epic: { border: "border-purple-800", bg: "bg-purple-950/20", text: "text-purple-500", btnActive: "bg-purple-600 text-white" },
  Legendary: { border: "border-orange-600", bg: "bg-orange-950/30", text: "text-orange-500", btnActive: "bg-orange-600 text-white" },
};

export default function CollectionView({ inventory, collScore }) {
  // ==========================================
  // 🕹️ 2. STATE & LOGIC: จัดการข้อมูลไอเทม
  // ==========================================
  const [activeFilter, setActiveFilter] = useState('All');

  // 📝 รวบรวมไอเทมทั้งหมดที่มีในเกมจาก Monster Loot Table
  const allGameItems = useMemo(() => {  
    const items = [];
    const seen = new Set();
    
    monsters.forEach(m => {
      m.lootTable?.forEach(loot => {
        const key = `${loot.name}-${loot.rarity}`;
        if (!seen.has(key)) {
          const masterData = itemMaster[loot.name] || {}; 
          items.push({ 
            ...loot, 
            ...masterData, 
            droppedBy: m.name 
          });
          seen.add(key);
        }
      });
    });
    return items;
  }, []);

  // 🎒 ตรวจสอบไอเทมที่ผู้เล่นครอบครองจริง (Inventory Mapping)
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

  // 🔍 กรองไอเทมตาม Filter ที่เลือก (Rarity หรือ Shiny)
  const filteredCollection = useMemo(() => {
    if (activeFilter === 'All') return allGameItems;
    if (activeFilter === 'Shiny') {
      return allGameItems.filter(item => 
        playerOwnedMap[`${item.name}-${item.rarity}`]?.hasShiny
      );
    }
    return allGameItems.filter(item => {
      const stats = playerOwnedMap[`${item.name}-${item.rarity}`];
      const isRarityMatch = item.rarity === activeFilter;
      const isNotShiny = stats ? !stats.hasShiny : true; 
      return isRarityMatch && isNotShiny;
    });
  }, [allGameItems, activeFilter, playerOwnedMap]);

  // 📊 คำนวณความคืบหน้า (Progress)
  const totalFound = allGameItems.filter(item => !!playerOwnedMap[`${item.name}-${item.rarity}`]).length;
  const completionRate = ((totalFound / allGameItems.length) * 100).toFixed(0);

  return (
    <div className="max-w-7xl mx-auto space-y-4 pb-20 px-4 pt-6 text-slate-200">
      
      {/* ==========================================
          📈 3. HEADER: แสดงความคืบหน้าการสะสม
          ========================================== */}
      <div className="flex flex-col gap-3 border-b border-slate-800 pb-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 font-serif">
            <Library className="text-amber-500" size={18} />
            <h2 className="text-sm font-black uppercase tracking-widest text-white italic">Collection Archive</h2>
          </div>
          <div className="text-[10px] font-mono text-slate-500 uppercase tracking-tighter">
                Total Progress: <span className="text-white">{totalFound}</span> / {allGameItems.length} ({completionRate}%)
                <span className="ml-2 text-amber-500">| Score: {collScore}</span> 
                </div>
          
        </div>
        <div className="w-full h-1 bg-slate-900 rounded-full overflow-hidden border border-white/5">
          <div className="h-full bg-amber-500 transition-all duration-1000 ease-out" style={{ width: `${completionRate}%` }} />
        </div>
      </div>

      {/* ==========================================
          🔘 4. FILTERS: ปุ่มกรองระดับความหายาก
          ========================================== */}
      <div className="flex flex-wrap gap-1.5">
        {['All', 'Common', 'Uncommon', 'Rare', 'Epic', 'Legendary', 'Shiny'].map(r => {
          const isActive = activeFilter === r;
          const style = rarityStyles[r] || { btnActive: "bg-white text-black" };
          return (
            <button
              key={r}
              onClick={() => setActiveFilter(r)}
              className={`px-3 py-1 rounded-md text-[9px] font-black uppercase transition-all border-2 
                ${isActive 
                  ? (r === 'Shiny' 
                      ? 'bg-gradient-to-r from-red-500 via-yellow-500 to-blue-500 text-white border-transparent shadow-[0_0_15px_rgba(239,68,68,0.3)]' 
                      : `${style.btnActive} border-white`) 
                  : 'text-slate-400 border-slate-800 bg-slate-950/50 hover:border-slate-600'}`}
            >
              {r === 'Shiny' ? '✨ Shiny' : r}
            </button>
          );
        })}
      </div>

      {/* ==========================================
          📦 5. GRID: แสดงรายการไอเทมในคลัง
          ========================================== */}
      <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-7 lg:grid-cols-10 gap-3 content-start min-h-[400px]">
        {filteredCollection.length > 0 ? (
          filteredCollection.map((item, index) => {
            const stats = playerOwnedMap[`${item.name}-${item.rarity}`];
            const isOwned = !!stats;
            const showAsShiny = activeFilter === 'Shiny' || (isOwned && stats.hasShiny);
            const style = rarityStyles[item.rarity];
            const pointsMap = { Common: 1, Uncommon: 5, Rare: 10, Epic: 15, Legendary: 20 };
            const pointValue = pointsMap[item.rarity] || 0;       

            return (
              <div key={index} className="relative group hover:z-50">
                {/* ตัวเลขแสดงจำนวนที่ครอบครอง */}
                {isOwned && stats.count > 0 && (
                  <span className="absolute -top-1.5 -left-1.5 bg-white text-black text-[9px] font-black px-1.5 py-0.5 rounded shadow-xl z-30 border border-slate-200">
                    x{stats.count}
                  </span>
                )}

                {/* Card ไอเทม */}
                <div className={`relative min-h-[100px] p-[1.8px] rounded-xl transition-all flex flex-col items-center justify-center overflow-visible
                  ${isOwned ? 'cursor-help shadow-md scale-100 hover:scale-110 hover:-translate-y-1' : 'opacity-25 grayscale'}`}>
                  
                  {/* เอฟเฟกต์สีรุ้งสำหรับไอเทม Shiny */}
                  {isOwned && showAsShiny && (
                    <div className="absolute inset-0 rounded-xl bg-[linear-gradient(45deg,#ff0000,#ffff00,#00ff00,#00ffff,#0000ff,#ff00ff,#ff0000)] opacity-100" />
                  )}
                  
                  <div className={`relative w-full h-full p-2 rounded-[10px] flex flex-col items-center justify-center z-10 
                    ${isOwned ? `bg-slate-900 border-2 ${showAsShiny ? 'border-white/40' : style.border}` : 'bg-slate-950 border border-slate-900'}`}>
                    
                    {/* Icon/Image ไอเทม */}
                    <div className="relative w-12 h-12 mb-1 flex items-center justify-center">
                      {isOwned ? (
                        item.image ? (
                          <img src={item.image} alt={item.name} className="w-full h-full object-contain brightness-125 contrast-110 drop-shadow-[0_0_8px_rgba(255,255,255,0.1)]" />
                        ) : ( <span className="text-2xl">📦</span> )
                      ) : ( <span className="text-2xl font-black text-slate-800">?</span> )}
                    </div>

                    {/* ข้อมูลพื้นฐานใต้ไอเทม */}
                    <div className="text-center w-full overflow-hidden relative z-10">
                      <p className={`text-[7px] font-black uppercase tracking-tighter mb-0.5 
                        ${isOwned 
                          ? (showAsShiny ? 'bg-clip-text text-transparent bg-gradient-to-r from-red-400 via-yellow-300 to-blue-400 animate-pulse font-extrabold' : style.text) 
                          : 'text-transparent'}`}>
                        {showAsShiny ? '✨ SHINY' : item.rarity}
                      </p>
                      <h4 className={`text-[9px] font-bold leading-tight line-clamp-1 ${isOwned ? 'text-white' : 'text-slate-800'}`}>
                        {isOwned ? item.name : 'Unknown'}
                      </h4>
                    </div>
                  </div>
                </div>

                {/* ==========================================
                    💬 6. TOOLTIP: รายละเอียดเมื่อ Hover
                    ========================================== */}
                {isOwned && (
                  <div className="absolute bottom-[95%] left-1/2 -translate-x-1/2 w-64 opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none z-[150] scale-90 group-hover:scale-100 origin-bottom">
                    
                    {/* ส่วนบน: ชื่อและคำอธิบาย */}
                    <div className="bg-slate-900/95 backdrop-blur-xl border border-slate-700 rounded-t-xl p-2.5 shadow-2xl">
                      <div className="flex justify-between items-start mb-2">
                        <span className="text-[11px] font-black text-white leading-tight pr-2 uppercase italic tracking-wide">
                          {item.name}
                        </span>
                        {showAsShiny && (
                          <span className="shrink-0 text-[8px] bg-gradient-to-r from-yellow-400 to-orange-500 text-black px-2 py-0.5 rounded font-black italic shadow-sm">
                            SHINY
                          </span>
                        )}
                      </div>
                      
                      <p className="text-[10px] text-slate-400 italic leading-relaxed mb-3 border-l-2 border-slate-700 pl-3">
                        "{item.description}"
                      </p>
                      
                      {/* แหล่งที่มา (Dropped By) */}
                      <div className="flex items-center gap-2 pt-2 border-t border-white/5 font-serif">
                        <Target size={12} className="text-amber-500/50" /> 
                        <div className="flex flex-col">
                          <span className="text-[9px] text-slate-500 font-bold uppercase tracking-widest leading-none mb-1">Dropped By:</span>
                          <span className="text-[12px] font-black text-slate-200 tracking-tight leading-none uppercase italic">
                            {item.droppedBy}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* ส่วนล่าง: คะแนนสะสม (Collection Point) */}
                    <div className="bg-gradient-to-r from-yellow-600 to-amber-700 rounded-b-xl px-4 py-0.8 flex items-center justify-between border-x border-b border-yellow-500/50 shadow-[0_10px_20px_rgba(0,0,0,0.4)]">
                      <div className="flex items-center gap-1.5">
                        <Star size={10} className="text-white drop-shadow-md" fill="currentColor" />
                        <span className="text-white text-[12px] font-black italic uppercase tracking-widest">
                          Collection Point
                        </span>
                      </div>
                      <span className="text-white text-[13px] font-black drop-shadow-md">
                        +{pointValue}
                      </span>
                    </div>

                    {/* Arrow (หาง Tooltip) */}
                    <div className="absolute top-full left-1/2 -translate-x-1/2 border-[6px] border-transparent border-t-amber-700" />
                  </div>
                )}
              </div>
            );
          })
        ) : (
          /* กรณีไม่พบไอเทมในหมวดหมู่ที่เลือก */
          <div className="col-span-full py-20 flex flex-col items-center justify-center text-slate-800 space-y-3">
            <Library size={40} className="opacity-20" />
            <div className="text-center">
              <p className="text-[10px] font-black uppercase tracking-[0.3em]">Vault Empty</p>
              <p className="text-[9px] opacity-40">Keep hunting to unlock this category</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}