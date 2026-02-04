import React, { useState, useMemo } from 'react';
import { Skull, Sparkles, Filter } from 'lucide-react'; 
// ✅ มั่นใจว่า Path นี้ชี้ไปยังไฟล์ index.js ใหม่ที่เราแยกไว้นะจ๊ะ
import { monsters } from '../data/monsters/index';
import MonsterCard from '../components/collection/MonsterCard';
import MonsterDetailModal from '../components/collection/MonsterDetailModal';

const rarityStyles = {
  Common: { border: "border-slate-400", text: "text-slate-400", btnActive: "bg-slate-400 text-slate-950" },
  Uncommon: { border: "border-green-500", text: "text-green-500", btnActive: "bg-green-500 text-green-950" },
  Rare: { border: "border-blue-500", text: "text-blue-500", btnActive: "bg-blue-500 text-blue-950" },
  Epic: { border: "border-purple-500", text: "text-purple-500", btnActive: "bg-purple-500 text-purple-950" },
  Legendary: { border: "border-orange-500", text: "text-orange-500", btnActive: "bg-orange-500 text-orange-950" },
  Shiny: { border: "border-amber-400", text: "text-amber-400", btnActive: "bg-amber-400 text-slate-950" }, 
};

// ✅ พารามิเตอร์ collection รับค่ามาจาก App.jsx เพื่อเช็คความคืบหน้าแยกตามตัว
export default function CollectionView({ inventory, collection, collScore }) {
  // ✅ เริ่มต้นที่ Common เพื่อให้เห็นมอนสเตอร์พื้นฐานก่อนจ่ะ
  const [activeFilter, setActiveFilter] = useState('Common'); 
  const [selectedMonster, setSelectedMonster] = useState(null);

  // ✅ 1. เตรียมข้อมูล Master List และจัดลำดับ
  const allGameMonsters = useMemo(() => {
    return [...monsters]
      .map(m => {
        // ✨ คำนวณ Point สำหรับโชว์ในการ์ด
        return {
          ...m,
          pointValue: m.level * 5 
        };
      })
      .sort((a, b) => {
        // เรียงตามชนิด (Type) ก่อนเพื่อให้สายพันธุ์เดียวกันอยู่ติดกัน
        if (a.type !== b.type) return (a.level || 0) - (b.level || 0);
        // ถ้าชนิดเดียวกัน ให้เอาตัวธรรมดาขึ้นก่อนตัว Shiny
        return a.isShiny ? 1 : -1;
      });
  }, []);

  // ✅ แยกรายชื่อเฉพาะมอนสเตอร์หลัก (ไม่นับ Shiny) เพื่อเป็นฐานการคำนวณ Progress
  const baseMonstersOnly = useMemo(() => {
    return allGameMonsters.filter(m => !m.isShiny);
  }, [allGameMonsters]);

  // ✅ 2. ตรวจสอบสถานะการครอบครองและการสะสมครบเซต (เข้มงวดขึ้นเพื่อแก้ปัญหาปลดล็อกหมด)
  const playerOwnedMap = useMemo(() => {
    const data = {};
    
    allGameMonsters.forEach(m => {
      // 🔍 2.1 ดึงรายการไอเทมที่สะสมได้จากถังแยก ID (หัวใจหลักของระบบเธอเลยจ่ะ)
      const monsterCollection = collection?.[m.id] || [];
      
      // 🔍 2.2 ตรวจสอบว่าสะสมครบเซตตาม lootTable ไหม (เพื่อปลดโบนัส)
      const isComplete = m.lootTable ? m.lootTable
    .filter(loot => loot.type !== 'SKILL') // 🔥 เพิ่มบรรทัดนี้: ไม่เอาสกิลมานับรวมในเงื่อนไขการสะสมครบเซต
    .every(loot => monsterCollection.includes(loot.name)) 
    : false;

      // 🔍 2.3 เช็คประวัติจาก Inventory (นับจำนวน Card/Record)
      const hasCard = inventory.some(item => 
        (item.type === 'MONSTER_CARD' || item.type === 'MONSTER_RECORD') && 
        item.monsterId === m.id
      );

      // ✨ [เงื่อนไขการปลดล็อก] มอนสเตอร์จะสว่างก็ต่อเมื่อ:
      // เคยดรอปไอเทมได้สักชิ้น (monsterCollection.length > 0) OR เคยกำจัดได้ (hasCard)
      const isDiscovered = monsterCollection.length > 0 || hasCard;

      data[m.id] = {
        count: hasCard ? 1 : 0,
        isSetComplete: isComplete,
        isDiscovered: isDiscovered, // ✅ เก็บค่านี้ไว้คุม UI
        hasShiny: m.isShiny && isDiscovered
      };
    });

    return data;
  }, [inventory, collection, allGameMonsters]);

  // ✅ 3. ระบบกรองข้อมูลตาม Rarity หรือ Shiny
  const filteredCollection = useMemo(() => {
    let list = allGameMonsters;
    
    if (activeFilter === 'Shiny') {
      return list.filter(m => m.isShiny);
    }
    
    if (activeFilter !== 'All') {
      list = list.filter(m => m.rarity === activeFilter && !m.isShiny);
    }
    
    return list;
  }, [allGameMonsters, activeFilter]);

  // ✅ นับจำนวนสายพันธุ์ที่พบ
  const totalFound = useMemo(() => {
    return baseMonstersOnly.filter(m => playerOwnedMap[m.id]?.isDiscovered).length;
  }, [baseMonstersOnly, playerOwnedMap]);

  // ✅ Progress Rate คำนวณเป็น %
  const completionRate = baseMonstersOnly.length > 0 
    ? ((totalFound / baseMonstersOnly.length) * 100).toFixed(0)
    : 0;

  return (
    <div className="max-w-7xl mx-auto space-y-4 pb-40 px-4 pt-6 text-slate-200 overflow-x-hidden">
      
      {/* HEADER: Monster Archive */}
      <div className="flex flex-col gap-2 border-b border-slate-800 pb-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center gap-2 font-serif">
            <Skull className="text-red-500" size={18} />
            <h2 className="text-sm font-black uppercase tracking-widest text-white italic">Monster Bestiary</h2>
          </div>
          <div className="text-[10px] font-mono text-slate-500 uppercase tracking-tighter flex flex-wrap gap-x-3 gap-y-1">
            <span>Enemies Encountered: <span className="text-white">{totalFound}/{baseMonstersOnly.length}</span></span>
            <span className="text-amber-500">| Discovery Score: {collScore}</span> 
          </div>
        </div>
        <div className="w-full h-1.5 bg-slate-900 rounded-full overflow-hidden border border-white/5">
          <div 
            className="h-full bg-red-600 shadow-[0_0_10px_#dc2626] transition-all duration-1000" 
            style={{ width: `${completionRate}%` }} 
          />
        </div>
      </div>

      {/* FILTERS */}
      <div className="flex flex-nowrap gap-2 overflow-x-auto pb-4 scrollbar-hide snap-x select-none -mx-4 px-4">
        {['All', 'Common', 'Uncommon', 'Rare', 'Epic', 'Legendary', 'Shiny'].map(r => {
          const isActive = activeFilter === r;
          const style = rarityStyles[r] || { btnActive: "bg-white text-black" };
          
          return (
            <button
              key={r}
              onClick={() => setActiveFilter(r)}
              className={`whitespace-nowrap px-4 py-2 rounded-xl text-[10px] font-black uppercase transition-all border-2 snap-start flex items-center gap-1.5
                ${isActive ? `${style.btnActive} border-transparent shadow-lg shadow-black/40 scale-105` : 'text-slate-500 border-slate-800 bg-slate-900/50'}
                ${r === 'Shiny' && !isActive ? 'text-amber-500 border-amber-500/30' : ''}`}
            >
              {r === 'Shiny' && <Sparkles size={12} className={isActive ? 'text-slate-950' : 'text-amber-500 animate-pulse'} />}
              {r}
            </button>
          );
        })}
      </div>

      {/* GRID: Monster Cards */}
      <div className="grid grid-cols-3 sm:grid-cols-5 lg:grid-cols-8 gap-3 content-start min-h-[400px]">
        {filteredCollection.map((monster) => {
           const mStats = playerOwnedMap[monster.id];
           const isDiscovered = mStats?.isDiscovered;

           return (
            <div 
              key={monster.id}
              // ✅ ใส่ Grayscale และความโปร่งใสถ้ายังไม่เจอ เพื่อกันปัญหาปลดล็อกหมดจ่ะ
              className={`transition-all duration-500 ${!isDiscovered ? 'opacity-30 grayscale brightness-50 pointer-events-none' : 'opacity-100'}`}
            >
              <MonsterCard 
                monster={monster}
                stats={mStats}
                style={monster.isShiny ? rarityStyles.Shiny : (rarityStyles[monster.rarity] || rarityStyles.Common)}
                onClick={() => isDiscovered && setSelectedMonster(monster)}
              />
            </div>
          );
        })}
      </div>

      {/* MODAL DETAIL */}
      {selectedMonster && (
        <MonsterDetailModal 
          monster={selectedMonster}
          inventory={inventory}
          collection={collection} 
          isShinyUnlocked={selectedMonster.isShiny || playerOwnedMap[selectedMonster.id]?.hasShiny}
          isSetComplete={playerOwnedMap[selectedMonster.id]?.isSetComplete}
          rarityStyle={selectedMonster.isShiny ? rarityStyles.Shiny : (rarityStyles[selectedMonster.rarity] || rarityStyles.Common)}
          onClose={() => setSelectedMonster(null)}
        />
      )}
    </div>
  );
}