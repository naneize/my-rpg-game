import React, { useState, useMemo } from 'react';
import { Skull, Sparkles, Filter } from 'lucide-react'; 
import { monsters } from '../data/monsters';
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

export default function CollectionView({ inventory, collScore }) {
  // ✅ [แก้ไข] เปลี่ยนค่าเริ่มต้นจาก 'All' เป็น 'Common' เพื่อให้เปิดหน้าแรกมาเจอพวกมอนสเตอร์พื้นฐานก่อน
  const [activeFilter, setActiveFilter] = useState('Common'); 
  const [selectedMonster, setSelectedMonster] = useState(null);

  // ✅ 1. เตรียมข้อมูล Master List และจัดลำดับ
  const allGameMonsters = useMemo(() => {
    return [...monsters]
      .map(m => {
        // ✨ คำนวณ Point สำหรับโชว์ในการ์ด (ปรับให้สัมพันธ์กับ rarity และเลเวล)
        return {
          ...m,
          pointValue: m.level * 5 
        };
      })
      .sort((a, b) => {
        // เรียงตามชนิด (Type) ก่อนเพื่อให้สายพันธุ์เดียวกันอยู่ติดกัน
        if (a.type !== b.type) return a.level - b.level;
        // ถ้าชนิดเดียวกัน ให้เอาตัวธรรมดาขึ้นก่อนตัว Shiny
        return a.isShiny ? 1 : -1;
      });
  }, []);

  // ✅ [เพิ่มใหม่] แยกรายชื่อเฉพาะมอนสเตอร์หลัก (ไม่นับ Shiny) เพื่อเป็นฐานการคำนวณสถิติ
  const baseMonstersOnly = useMemo(() => {
    return allGameMonsters.filter(m => !m.isShiny);
  }, [allGameMonsters]);

  // ✅ 2. ตรวจสอบสถานะการครอบครองรายใบ
  const playerOwnedMap = useMemo(() => {
    const data = {};
    
    inventory.forEach(item => {
      if (item.type === 'MONSTER_CARD' || item.type === 'MONSTER_RECORD') { 
        let key = item.monsterId;
        if (item.isShiny && !key.endsWith('_shiny')) {
          key = `${key}_shiny`;
        }
        
        if (!data[key]) data[key] = { count: 0, isSetComplete: false, hasShiny: item.isShiny };
        data[key].count += 1;
      }
    });

    allGameMonsters.forEach(m => {
      if (m.lootTable) {
        const isComplete = m.lootTable.every(loot => 
          inventory.some(invItem => invItem.name === loot.name)
        );
        if (data[m.id]) {
          data[m.id].isSetComplete = isComplete;
        } else if (isComplete) {
          data[m.id] = { count: 0, hasShiny: m.isShiny, isSetComplete: true };
        }
      }
    });

    return data;
  }, [inventory, allGameMonsters]);

  // ✅ 3. ระบบกรองข้อมูล
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

  // ✅ [แก้ไข] นับจำนวนมอนสเตอร์ที่เจอโดยไม่อ้างอิง Shiny
  const totalFound = useMemo(() => {
    return baseMonstersOnly.filter(m => {
      const hasNormal = playerOwnedMap[m.id]?.count > 0;
      const hasShinyVariant = playerOwnedMap[`${m.id}_shiny`]?.count > 0;
      return hasNormal || hasShinyVariant;
    }).length;
  }, [baseMonstersOnly, playerOwnedMap]);

  // ✅ [แก้ไข] Progress Rate อิงจากจำนวนสายพันธุ์หลักเท่านั้น
  const completionRate = ((totalFound / baseMonstersOnly.length) * 100).toFixed(0);

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
          <div className="h-full bg-red-600 shadow-[0_0_10px_#dc2626] transition-all duration-1000" style={{ width: `${completionRate}%` }} />
        </div>
      </div>

      {/* FILTERS: ปรับลำดับให้ Shiny อยู่ท้ายสุด */}
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
           return (
            <MonsterCard 
              key={monster.id}
              monster={monster}
              stats={mStats}
              style={monster.isShiny ? rarityStyles.Shiny : (rarityStyles[monster.rarity] || rarityStyles.Common)}
              onClick={() => setSelectedMonster(monster)}
            />
          );
        })}
      </div>

      {/* MODAL DETIALS */}
      {selectedMonster && (
        <MonsterDetailModal 
          monster={selectedMonster}
          inventory={inventory}
          isShinyUnlocked={selectedMonster.isShiny || playerOwnedMap[selectedMonster.id]?.hasShiny}
          isSetComplete={playerOwnedMap[selectedMonster.id]?.isSetComplete}
          rarityStyle={selectedMonster.isShiny ? rarityStyles.Shiny : (rarityStyles[selectedMonster.rarity] || rarityStyles.Common)}
          onClose={() => setSelectedMonster(null)}
        />
      )}
    </div>
  );
}