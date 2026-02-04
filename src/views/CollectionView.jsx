import React, { useState, useMemo } from 'react';
import { Skull } from 'lucide-react';
import { monsters } from '../data/monsters';

// --- Import Sub-Components (ที่แยกไฟล์ไว้) ---
import MonsterCard from '../components/collection/MonsterCard';
import MonsterDetailModal from '../components/collection/MonsterDetailModal';

const rarityStyles = {
  Common: { border: "border-slate-400", text: "text-slate-400", btnActive: "bg-slate-400 text-slate-950" },
  Uncommon: { border: "border-green-500", text: "text-green-500", btnActive: "bg-green-500 text-green-950" },
  Rare: { border: "border-blue-500", text: "text-blue-500", btnActive: "bg-blue-500 text-blue-950" },
  Epic: { border: "border-purple-500", text: "text-purple-500", btnActive: "bg-purple-500 text-purple-950" },
  Legendary: { border: "border-orange-500", text: "text-orange-500", btnActive: "bg-orange-500 text-orange-950" },
};

export default function CollectionView({ inventory, collScore }) {
  const [activeFilter, setActiveFilter] = useState('All');
  const [selectedMonster, setSelectedMonster] = useState(null);

  // ✅ 1. จัดการข้อมูล Monster ทั้งหมด (คงเดิม)
  const allGameMonsters = useMemo(() => {
    return monsters.map(m => ({
      ...m,
      pointValue: m.level * 5 
    }));
  }, []);

  // ✅ 2. ตรวจสอบสถานะการครอบครอง (คงเดิม)
  const playerOwnedMap = useMemo(() => {
    const data = {};
    inventory.forEach(item => {
      if (item.type === 'MONSTER_CARD' || item.monsterId) { 
        const key = item.monsterId || item.id;
        if (!data[key]) data[key] = { count: 0, hasShiny: false };
        data[key].count += 1;
        if (item.isShiny) data[key].hasShiny = true;
      }
    });
    return data;
  }, [inventory]);

  // ✅ 3. กรองข้อมูลตาม Filter (คงเดิม)
  const filteredCollection = useMemo(() => {
    if (activeFilter === 'All') return allGameMonsters;
    return allGameMonsters.filter(m => m.rarity === activeFilter);
  }, [allGameMonsters, activeFilter]);

  const totalFound = allGameMonsters.filter(m => !!playerOwnedMap[m.id]).length;
  const completionRate = ((totalFound / allGameMonsters.length) * 100).toFixed(0);

  return (
    // ✅ Mobile: เพิ่ม px-4 และ pb-40 เพื่อไม่ให้ Sidebar บังการ์ดแถวสุดท้ายจ่ะ
    <div className="max-w-7xl mx-auto space-y-4 pb-40 px-4 pt-6 text-slate-200 overflow-x-hidden">
      
      {/* HEADER: Monster Archive (คงเดิม) */}
      <div className="flex flex-col gap-2 border-b border-slate-800 pb-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center gap-2 font-serif">
            <Skull className="text-red-500" size={18} />
            <h2 className="text-sm font-black uppercase tracking-widest text-white italic">Monster Bestiary</h2>
          </div>
          {/* ✅ Mobile: ปรับขนาดตัวอักษรให้เล็กลงในมือถือเพื่อไม่ให้บรรทัดเบียดกัน */}
          <div className="text-[10px] font-mono text-slate-500 uppercase tracking-tighter flex flex-wrap gap-x-3 gap-y-1">
            <span>Enemies Encountered: <span className="text-white">{totalFound}/{allGameMonsters.length}</span></span>
            <span className="text-amber-500">| Discovery Score: {collScore}</span> 
          </div>
        </div>
        <div className="w-full h-1.5 bg-slate-900 rounded-full overflow-hidden border border-white/5">
          <div className="h-full bg-red-600 shadow-[0_0_10px_#dc2626] transition-all duration-1000" style={{ width: `${completionRate}%` }} />
        </div>
      </div>

      {/* FILTERS - ✅ Mobile: ปรับให้ลื่นด้วย snap-x และซ่อน scrollbar */}
      <div className="flex flex-nowrap gap-2 overflow-x-auto pb-4 scrollbar-hide snap-x select-none -mx-4 px-4">
        {['All', 'Common', 'Uncommon', 'Rare', 'Epic', 'Legendary'].map(r => {
          const isActive = activeFilter === r;
          const style = rarityStyles[r] || { btnActive: "bg-white text-black" };
          return (
            <button
              key={r}
              onClick={() => setActiveFilter(r)}
              className={`whitespace-nowrap px-4 py-2 rounded-xl text-[10px] font-black uppercase transition-all border-2 snap-start
                ${isActive 
                  ? `${style.btnActive} border-transparent shadow-lg shadow-black/40` 
                  : 'text-slate-500 border-slate-800 bg-slate-900/50'}`}
            >
              {r}
            </button>
          );
        })}
      </div>

      {/* GRID: Monster Cards - ✅ Mobile: ปรับ grid-cols-3 เป็นมาตรฐานจอเล็กเพื่อให้การ์ดไม่เล็กจนกดลำบาก */}
      <div className="grid grid-cols-3 sm:grid-cols-5 lg:grid-cols-8 gap-3 content-start min-h-[400px]">
        {filteredCollection.map((monster) => (
          <MonsterCard 
            key={monster.id}
            monster={monster}
            stats={playerOwnedMap[monster.id]}
            style={rarityStyles[monster.rarity] || rarityStyles.Common}
            onClick={() => setSelectedMonster(monster)}
          />
        ))}
      </div>

      {/* ✅ Empty State: กรณี Filter แล้วไม่เจอ */}
      {filteredCollection.length === 0 && (
        <div className="py-20 text-center space-y-2">
          <p className="text-slate-600 text-xs font-black uppercase tracking-widest">No Monsters Encountered</p>
          <p className="text-slate-800 text-[10px] uppercase">Continue your journey to discover more.</p>
        </div>
      )}

      {/* MOBILE TOOLTIP / MODAL - ✅ Sub-Component */}
      {selectedMonster && (
        <MonsterDetailModal 
          monster={selectedMonster}
          inventory={inventory}
          rarityStyle={rarityStyles[selectedMonster.rarity] || rarityStyles.Common}
          onClose={() => setSelectedMonster(null)}
        />
      )}
    </div>
  );
}