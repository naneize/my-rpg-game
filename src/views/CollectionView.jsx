import React, { useState, useMemo } from 'react';
import { Skull, Sparkles, Map, Globe, Trophy, Target, Activity, Cpu } from 'lucide-react'; 
import { monsters } from '../data/monsters/index';
import MonsterCard from '../components/collection/MonsterCard';
import MonsterDetailModal from '../components/collection/MonsterDetailModal';

// 🎨 Rarity Styles (Hard-Edge Version)
const rarityStyles = {
  Common: { 
    border: "border-slate-500/30", 
    text: "text-slate-400", 
    btnActive: "bg-slate-500 text-slate-950",
    itemFrame: "border-slate-500/30 bg-slate-500/5 shadow-none"
  },
  Uncommon: { 
    border: "border-green-500/40", 
    text: "text-green-500", 
    btnActive: "bg-green-500 text-green-950",
    itemFrame: "border-green-500/40 bg-green-500/10 shadow-none"
  },
  Rare: { 
    border: "border-blue-500/50", 
    text: "text-blue-500", 
    btnActive: "bg-blue-500 text-blue-950",
    itemFrame: "border-blue-500/50 bg-blue-500/15 shadow-none"
  },
  Epic: { 
    border: "border-purple-500/60", 
    text: "text-purple-500", 
    btnActive: "bg-purple-500 text-purple-950",
    itemFrame: "border-purple-500/60 bg-purple-500/20 shadow-none"
  },
  Legendary: { 
    border: "border-orange-500/80", 
    text: "text-orange-500", 
    btnActive: "bg-orange-500 text-orange-950",
    itemFrame: "border-orange-500/80 bg-orange-500/25 shadow-none"
  },
  Shiny: { 
    border: "border-amber-400", 
    text: "text-amber-400", 
    btnActive: "bg-amber-400 text-slate-950",
    itemFrame: "border-amber-400 bg-amber-400/20 shadow-none"
  }, 
};

export default function CollectionView({ player, inventory, collection, collScore }) {
  const [activeFilter, setActiveFilter] = useState('All'); 
  const [selectedMonster, setSelectedMonster] = useState(null);

  const allGameMonsters = useMemo(() => {
    return [...monsters]
      .map(m => ({ ...m, pointValue: m.level * 5 }))
      .sort((a, b) => {
        if (a.type !== b.type) return (a.level || 0) - (b.level || 0);
        return a.isShiny ? 1 : -1;
      });
  }, []);

  const playerOwnedMap = useMemo(() => {
    const data = {};
    allGameMonsters.forEach(m => {
      const monsterCollection = collection?.[m.id] || [];
      const relevantLoot = m.lootTable ? m.lootTable.filter(loot => loot.type === 'ARTIFACT' ) : [];
      const collectedCount = relevantLoot.filter(loot => monsterCollection.includes(loot.name)).length;
      const isComplete = relevantLoot.length > 0 && collectedCount === relevantLoot.length;
      const killCount = player?.monsterKills?.[m.id] || 0;
      const baseId = m.id.replace('_shiny', '');
      const shinyId = `${baseId}_shiny`;
      const hasShinyDiscovered = collection?.[shinyId] || (player?.monsterKills?.[shinyId] > 0);
      const isDiscovered = monsterCollection.length > 0 || killCount > 0;

      data[m.id] = {
        count: killCount,
        collectedCount,
        totalItems: relevantLoot.length,
        isSetComplete: isComplete,
        isDiscovered, 
        hasShiny: hasShinyDiscovered,
        bonus: isComplete ? m.collectionBonus : null 
      };
    });
    return data;
  }, [player?.monsterKills, collection, allGameMonsters]);

  const filteredCollection = useMemo(() => {
    let baseList = allGameMonsters.filter(m => !m.isShiny);
    if (activeFilter !== 'All') baseList = baseList.filter(m => m.rarity === activeFilter);

    return baseList.map(monster => {
      const shinyId = `${monster.id}_shiny`;
      const hasShinyDiscovered = collection?.[shinyId] || (player?.monsterKills?.[shinyId] > 0);

      if (hasShinyDiscovered) {
        const shinyData = allGameMonsters.find(m => m.id === shinyId);
        return shinyData ? { ...shinyData, isShinyUpgraded: true } : monster;
      }
      return monster;
    });
  }, [allGameMonsters, activeFilter, collection, player?.monsterKills]);

  const globalProgress = useMemo(() => {
    const baseMonsters = allGameMonsters.filter(m => !m.isShiny);
    const foundCount = baseMonsters.filter(m => playerOwnedMap[m.id]?.isDiscovered).length;
    return {
      found: foundCount,
      total: baseMonsters.length,
      rate: baseMonsters.length > 0 ? ((foundCount / baseMonsters.length) * 100).toFixed(0) : 0
    };
  }, [allGameMonsters, playerOwnedMap]);

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-32 px-4 pt-4 text-slate-200 font-mono">
      
      {/* Discovery & Progress Header (Hard-Edge) */}
      <div className="space-y-4 bg-slate-900/40 border border-white/10 p-6 rounded-none relative overflow-hidden backdrop-blur-xl">
        {/* Tech Corner Decor */}
        <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-red-500/50" />
        <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-red-500/50" />

        <div className="flex items-center justify-between relative z-10">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-none">
              <Skull className="text-red-500" size={24} />
            </div>
            <div>
              <h2 className="text-xl font-black uppercase tracking-tighter text-white italic leading-none">Bestiary_Archive</h2>
              <p className="text-[10px] text-slate-500 font-bold uppercase tracking-[0.3em] mt-1">Reconnaissance_Data_v4.2</p>
            </div>
          </div>
          <div className="text-right">
             <div className="flex items-center justify-end gap-2 text-[10px] text-amber-500/60 font-black uppercase mb-1 tracking-widest">
               <Trophy size={10} /> Sync_Rank
             </div>
             <span className="text-2xl font-black text-amber-500 leading-none italic">{collScore.toLocaleString()}</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 relative z-10">
          <div className="bg-black/40 border border-white/5 p-4 rounded-none flex items-center gap-4 hover:border-blue-500/30 transition-colors">
            <div className="p-2 bg-blue-500/10 border border-blue-500/20">
              <Target size={18} className="text-blue-400" />
            </div>
            <div>
              <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1">Discovery_Index</p>
              <p className="text-sm font-black text-white italic">{globalProgress.found} / {globalProgress.total}</p>
            </div>
          </div>
          <div className="bg-black/40 border border-white/5 p-4 rounded-none flex items-center gap-4 hover:border-purple-500/30 transition-colors">
            <div className="p-2 bg-purple-500/10 border border-purple-500/20">
              <Cpu size={18} className="text-purple-400" />
            </div>
            <div>
              <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1">Sync_Completion</p>
              <p className="text-sm font-black text-white italic">{globalProgress.rate}%</p>
            </div>
          </div>
        </div>

        <div className="w-full h-2 bg-black/60 rounded-none overflow-hidden border border-white/5 relative z-10">
          <div 
            className="h-full bg-gradient-to-r from-blue-600 via-cyan-400 to-blue-600 transition-all duration-1000 ease-out" 
            style={{ width: `${globalProgress.rate}%` }} 
          />
        </div>
      </div>

      {/* Rarity Filters (Hard-Edge) */}
      <div className="space-y-3">
        <h3 className="text-[10px] font-black text-slate-500 uppercase flex items-center gap-2 px-1 tracking-widest italic">
          <Activity size={12} className="text-blue-500" /> Sector_Filtering
        </h3>
        <div className="flex gap-2 overflow-x-auto pb-4 no-scrollbar -mx-4 px-4">
          {['All', 'Common', 'Uncommon', 'Rare', 'Epic', 'Legendary'].map(r => {
            const isActive = activeFilter === r;
            const style = rarityStyles[r] || { btnActive: "bg-white text-black" };
            return (
              <button
                key={r}
                onClick={() => setActiveFilter(r)}
                className={`whitespace-nowrap px-6 py-2 rounded-none text-[10px] font-black uppercase transition-all border-2 flex items-center gap-2 italic
                  ${isActive ? `${style.btnActive} border-transparent scale-95 shadow-[0_0_15px_rgba(255,255,255,0.1)]` : 'text-slate-500 border-white/5 bg-slate-900/30 hover:border-white/20'}`}
              >
                {isActive && <div className="w-1.5 h-1.5 bg-current animate-pulse" />}
                {r}
              </button>
            );
          })}
        </div>
      </div>

      {/* Monster Grid (Hard-Edge Cards) */}
      <div className="grid grid-cols-3 xs:grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2 sm:gap-4 min-h-[300px]">
        {filteredCollection.length > 0 ? (
          filteredCollection.map((monster) => {
            const mStats = playerOwnedMap[monster.id];
            const isDiscovered = mStats?.isDiscovered;
            const style = monster.isShiny ? rarityStyles.Shiny : (rarityStyles[monster.rarity] || rarityStyles.Common);
            return (
              <div 
                key={monster.id}
                className={`transition-all duration-500 ${!isDiscovered ? 'opacity-20 grayscale brightness-50 scale-95' : 'opacity-100 hover:scale-105 active:scale-95'}`}
              >
                <MonsterCard 
                  monster={monster}
                  stats={mStats} 
                  style={style}
                  onClick={() => isDiscovered && setSelectedMonster(monster)}
                />
              </div>
            );
          })
        ) : (
          <div className="col-span-full py-20 text-center bg-slate-900/20 border border-dashed border-white/5">
            <p className="text-slate-600 font-black uppercase tracking-[0.4em] text-[11px] italic animate-pulse">Scanning_Sector_Empty</p>
          </div>
        )}
      </div>

      {/* Detail Modal (Logic remains intact) */}
      {selectedMonster && (
        <MonsterDetailModal 
          monster={selectedMonster}
          inventory={inventory}
          collection={collection} 
          killCount={playerOwnedMap[selectedMonster.id]?.count}
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