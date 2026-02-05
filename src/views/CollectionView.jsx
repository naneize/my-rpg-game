import React, { useState, useMemo } from 'react';
import { Skull, Sparkles, Map, Globe } from 'lucide-react'; 
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

export default function CollectionView({ inventory, collection, collScore }) {
  // ✅ เพิ่ม State สำหรับจัดการแมพ (เริ่มต้นที่ All หรือ meadow)
  const [activeMap, setActiveMap] = useState('All');
  const [activeFilter, setActiveFilter] = useState('All'); 
  const [selectedMonster, setSelectedMonster] = useState(null);

  // ✅ 1. เตรียมข้อมูล Master List
  const allGameMonsters = useMemo(() => {
    return [...monsters]
      .map(m => ({
        ...m,
        pointValue: m.level * 5 
      }))
      .sort((a, b) => {
        if (a.area !== b.area) return 0; // เรียงตามกลุ่มแมพ
        if (a.type !== b.type) return (a.level || 0) - (b.level || 0);
        return a.isShiny ? 1 : -1;
      });
  }, []);

  // ✅ ดึงรายชื่อ Map ทั้งหมดที่มีในเกมมาสร้างปุ่ม
  const availableMaps = useMemo(() => {
    const maps = new Set(allGameMonsters.map(m => m.area));
    return ['All', ...Array.from(maps)];
  }, [allGameMonsters]);

  // ✅ 2. ตรวจสอบสถานะการครอบครอง (Logic เดิมที่แก้ไขเรื่องการนับจำนวนแล้ว)
  const playerOwnedMap = useMemo(() => {
    const data = {};
    allGameMonsters.forEach(m => {
      const monsterCollection = collection?.[m.id] || [];
      const relevantLoot = m.lootTable ? m.lootTable.filter(loot => loot.type !== 'SKILL') : [];
      const collectedCount = relevantLoot.filter(loot => monsterCollection.includes(loot.name)).length;
      const isComplete = relevantLoot.length > 0 && collectedCount === relevantLoot.length;

      const killRecords = inventory.filter(item => 
        (item.type === 'MONSTER_CARD' || item.type === 'MONSTER_RECORD') && 
        item.monsterId === m.id
      );

      const totalKills = killRecords.length;
      const isDiscovered = monsterCollection.length > 0 || totalKills > 0;

      data[m.id] = {
        count: totalKills,
        collectedCount,
        totalItems: relevantLoot.length,
        isSetComplete: isComplete,
        isDiscovered: isDiscovered, 
        hasShiny: m.isShiny && isDiscovered,
        bonus: isComplete ? m.collectionBonus : null 
      };
    });
    return data;
  }, [inventory, collection, allGameMonsters]);

  // ✅ 3. ระบบกรองข้อมูลแบบ 2 ชั้น (Map + Rarity)
  const filteredCollection = useMemo(() => {
    let list = allGameMonsters;
    
    // ชั้นที่ 1: กรองตามแมพ
    if (activeMap !== 'All') {
      list = list.filter(m => m.area === activeMap);
    }

    // ชั้นที่ 2: กรองตาม Rarity
    if (activeFilter === 'Shiny') {
      list = list.filter(m => m.isShiny);
    } else if (activeFilter !== 'All') {
      list = list.filter(m => m.rarity === activeFilter && !m.isShiny);
    }
    
    return list;
  }, [allGameMonsters, activeMap, activeFilter]);

  // ✅ คำนวณความคืบหน้าเฉพาะแมพที่เลือก
  const currentMapProgress = useMemo(() => {
    const mapBaseMonsters = allGameMonsters.filter(m => !m.isShiny && (activeMap === 'All' || m.area === activeMap));
    const foundInMap = mapBaseMonsters.filter(m => playerOwnedMap[m.id]?.isDiscovered).length;
    return {
      found: foundInMap,
      total: mapBaseMonsters.length,
      rate: mapBaseMonsters.length > 0 ? ((foundInMap / mapBaseMonsters.length) * 100).toFixed(0) : 0
    };
  }, [allGameMonsters, activeMap, playerOwnedMap]);

  return (
    <div className="max-w-7xl mx-auto space-y-6 pb-40 px-4 pt-6 text-slate-200 overflow-x-hidden">
      
      {/* HEADER & OVERALL PROGRESS */}
      <div className="flex flex-col gap-4 border-b border-slate-800 pb-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center gap-2 font-serif">
            <Skull className="text-red-500" size={20} />
            <h2 className="text-lg font-black uppercase tracking-widest text-white italic">Monster Bestiary</h2>
          </div>
          <div className="text-[11px] font-mono text-slate-400 uppercase tracking-tighter flex flex-wrap gap-x-4">
             <span className="flex items-center gap-1"><Globe size={12} className="text-blue-400"/> Map: <span className="text-white">{activeMap}</span></span>
             <span>Discovered: <span className="text-white">{currentMapProgress.found}/{currentMapProgress.total}</span></span>
             <span className="text-amber-500 font-bold">Score: {collScore}</span>
          </div>
        </div>
        
        <div className="space-y-1">
          <div className="flex justify-between text-[9px] font-bold text-slate-500 uppercase">
             <span>Map Exploration</span>
             <span>{currentMapProgress.rate}%</span>
          </div>
          <div className="w-full h-2 bg-slate-900 rounded-full overflow-hidden border border-white/5">
            <div 
              className="h-full bg-gradient-to-r from-red-600 to-orange-500 shadow-[0_0_10px_rgba(220,38,38,0.5)] transition-all duration-1000" 
              style={{ width: `${currentMapProgress.rate}%` }} 
            />
          </div>
        </div>
      </div>

      {/* 🗺️ MAP SELECTOR (NEW) */}
      <div className="space-y-2">
        <label className="text-[10px] font-black text-slate-500 uppercase flex items-center gap-1">
          <Map size={12} /> Select Territory
        </label>
        <div className="flex flex-nowrap gap-2 overflow-x-auto pb-2 scrollbar-hide">
          {availableMaps.map(mapName => (
            <button
              key={mapName}
              onClick={() => setActiveMap(mapName)}
              className={`px-4 py-2 rounded-lg text-[10px] font-bold uppercase transition-all whitespace-nowrap border
                ${activeMap === mapName 
                  ? 'bg-blue-600 border-blue-400 text-white shadow-lg shadow-blue-900/40' 
                  : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-600'}`}
            >
              {mapName === 'All' ? 'World Map' : mapName.replace('_', ' ')}
            </button>
          ))}
        </div>
      </div>

      {/* 🔍 RARITY FILTERS */}
      <div className="flex flex-nowrap gap-2 overflow-x-auto pb-4 scrollbar-hide select-none">
        {['All', 'Common', 'Uncommon', 'Rare', 'Epic', 'Legendary', 'Shiny'].map(r => {
          const isActive = activeFilter === r;
          const style = rarityStyles[r] || { btnActive: "bg-white text-black" };
          return (
            <button
              key={r}
              onClick={() => setActiveFilter(r)}
              className={`whitespace-nowrap px-4 py-2 rounded-xl text-[10px] font-black uppercase transition-all border-2 flex items-center gap-1.5
                ${isActive ? `${style.btnActive} border-transparent shadow-lg scale-105` : 'text-slate-500 border-slate-800 bg-slate-900/50 hover:border-slate-700'}`}
            >
              {r === 'Shiny' && <Sparkles size={12} className={isActive ? 'text-slate-950' : 'text-amber-500'} />}
              {r}
            </button>
          );
        })}
      </div>

      {/* GRID: Monster Cards */}
      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-3 content-start min-h-[400px]">
        {filteredCollection.length > 0 ? (
          filteredCollection.map((monster) => {
            const mStats = playerOwnedMap[monster.id];
            const isDiscovered = mStats?.isDiscovered;
            return (
              <div 
                key={monster.id}
                className={`transition-all duration-500 ${!isDiscovered ? 'opacity-30 grayscale brightness-50' : 'opacity-100'}`}
              >
                <MonsterCard 
                  monster={monster}
                  stats={mStats}
                  style={monster.isShiny ? rarityStyles.Shiny : (rarityStyles[monster.rarity] || rarityStyles.Common)}
                  onClick={() => isDiscovered && setSelectedMonster(monster)}
                />
              </div>
            );
          })
        ) : (
          <div className="col-span-full py-20 text-center text-slate-600 font-black uppercase tracking-widest text-xs italic">
            No monsters found in this territory...
          </div>
        )}
      </div>

      {/* MODAL DETAIL */}
      {selectedMonster && (
        <MonsterDetailModal 
          monster={selectedMonster}
          inventory={inventory}
          collection={collection} 
          collectedItemsCount={playerOwnedMap[selectedMonster.id]?.collectedCount}
          isShinyUnlocked={selectedMonster.isShiny || playerOwnedMap[selectedMonster.id]?.hasShiny}
          isSetComplete={playerOwnedMap[selectedMonster.id]?.isSetComplete}
          rarityStyle={selectedMonster.isShiny ? rarityStyles.Shiny : (rarityStyles[selectedMonster.rarity] || rarityStyles.Common)}
          onClose={() => setSelectedMonster(null)}
        />
      )}
    </div>
  );
}