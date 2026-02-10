import React, { useState, useMemo } from 'react';
import { Skull, Sparkles, Map, Globe, Trophy, Target } from 'lucide-react'; 
import { monsters } from '../data/monsters/index';
import MonsterCard from '../components/collection/MonsterCard';
import MonsterDetailModal from '../components/collection/MonsterDetailModal';

// 🎨 Rarity Styles คงเดิม
const rarityStyles = {
  Common: { 
    border: "border-slate-400", 
    text: "text-slate-400", 
    btnActive: "bg-slate-400 text-slate-950",
    itemFrame: "border-slate-500/30 bg-slate-500/5 shadow-slate-500/5"
  },
  Uncommon: { 
    border: "border-green-500", 
    text: "text-green-500", 
    btnActive: "bg-green-500 text-green-950",
    itemFrame: "border-green-500/40 bg-green-500/10 shadow-green-500/10"
  },
  Rare: { 
    border: "border-blue-500", 
    text: "text-blue-500", 
    btnActive: "bg-blue-500 text-blue-950",
    itemFrame: "border-blue-500/50 bg-blue-500/15 shadow-blue-500/20"
  },
  Epic: { 
    border: "border-purple-500", 
    text: "text-purple-500", 
    btnActive: "bg-purple-500 text-purple-950",
    itemFrame: "border-purple-500/60 bg-purple-500/20 shadow-purple-500/30"
  },
  Legendary: { 
    border: "border-orange-500", 
    text: "text-orange-500", 
    btnActive: "bg-orange-500 text-orange-950",
    itemFrame: "border-orange-500/80 bg-orange-500/25 shadow-orange-500/40"
  },
  Shiny: { 
    border: "border-amber-400", 
    text: "text-amber-400", 
    btnActive: "bg-amber-400 text-slate-950",
    itemFrame: "border-amber-400 bg-amber-400/20 shadow-amber-400/50"
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
    <div className="max-w-4xl mx-auto space-y-5 pb-32 px-4 pt-4 text-slate-200">
      
      {/* Discovery & Progress Header */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-red-500/20 rounded-lg">
              <Skull className="text-red-500" size={20} />
            </div>
            <div>
              <h2 className="text-base font-black uppercase tracking-tighter text-white italic leading-none">Bestiary Archive</h2>
              <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Global Field Recon</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="text-right">
              <span className="block text-[10px] font-black text-slate-500 uppercase">Coll. Score</span>
              <span className="text-lg font-black text-amber-500 leading-none">{collScore.toLocaleString()}</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <div className="bg-slate-900/50 border border-white/5 p-3 rounded-2xl flex items-center gap-3">
            <div className="p-2 bg-blue-500/10 rounded-xl">
              <Target size={16} className="text-blue-400" />
            </div>
            <div>
              <p className="text-[8px] font-black text-slate-500 uppercase">Discovery</p>
              <p className="text-xs font-black text-white">{globalProgress.found} / {globalProgress.total}</p>
            </div>
          </div>
          <div className="bg-slate-900/50 border border-white/5 p-3 rounded-2xl flex items-center gap-3">
            <div className="p-2 bg-purple-500/10 rounded-xl">
              <Trophy size={16} className="text-purple-400" />
            </div>
            <div>
              <p className="text-[8px] font-black text-slate-500 uppercase">Completion</p>
              <p className="text-xs font-black text-white">{globalProgress.rate}%</p>
            </div>
          </div>
        </div>

        <div className="w-full h-1.5 bg-slate-900 rounded-full overflow-hidden border border-white/5">
          <div 
            className="h-full bg-gradient-to-r from-blue-600 to-cyan-400 transition-all duration-1000 ease-out" 
            style={{ width: `${globalProgress.rate}%` }} 
          />
        </div>
      </div>

      {/* Rarity Filters */}
      <div className="space-y-2">
        <h3 className="text-[9px] font-black text-slate-500 uppercase flex items-center gap-1.5 px-1">
          <Sparkles size={10} /> Filter by Rarity
        </h3>
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide -mx-4 px-4">
          {['All', 'Common', 'Uncommon', 'Rare', 'Epic', 'Legendary'].map(r => {
            const isActive = activeFilter === r;
            const style = rarityStyles[r] || { btnActive: "bg-white text-black" };
            return (
              <button
                key={r}
                onClick={() => setActiveFilter(r)}
                className={`whitespace-nowrap px-4 py-2 rounded-xl text-[10px] font-black uppercase transition-all border-2 flex items-center gap-1.5
                  ${isActive ? `${style.btnActive} border-transparent scale-95` : 'text-slate-500 border-slate-800 bg-slate-900/30'}`}
              >
                {r}
              </button>
            );
          })}
        </div>
      </div>

      {/* Monster Grid */}
      <div className="grid grid-cols-3 xs:grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2 sm:gap-3 min-h-[300px]">
        {filteredCollection.length > 0 ? (
          filteredCollection.map((monster) => {
            const mStats = playerOwnedMap[monster.id];
            const isDiscovered = mStats?.isDiscovered;
            const style = monster.isShiny ? rarityStyles.Shiny : (rarityStyles[monster.rarity] || rarityStyles.Common);
            return (
              <div 
                key={monster.id}
                className={`transition-all duration-500 ${!isDiscovered ? 'opacity-20 grayscale brightness-50 scale-90' : 'opacity-100 hover:scale-105'}`}
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
          <div className="col-span-full py-16 text-center">
            <p className="text-slate-600 font-black uppercase tracking-widest text-[10px] italic">No entities recorded in this sector</p>
          </div>
        )}
      </div>

      {/* Detail Modal */}
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