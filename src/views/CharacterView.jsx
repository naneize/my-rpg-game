import React, { useState, useEffect, useMemo } from 'react'; 
import { Heart, Sword, Shield, Sparkles, Star, ChevronRight, PartyPopper, Info, X } from 'lucide-react';
import StatItem from '../components/character/StatItem';
import TitleSelector from '../components/character/TitleSelector';
import ProfileHeader from '../components/character/ProfileHeader';
import { useCharacterStats } from '../hooks/useCharacterStats';
import { getCollectionTitle, calculateBaseStats } from '../utils/characterUtils';
import { titles as allTitles, checkTitleUnlock } from '../data/titles';

// ✅ [คงเดิม] นำเข้ามอนสเตอร์จากทุกแมพ
import { map1Monsters } from '../data/monsters/map1_meadow';
import { map2Monsters } from '../data/monsters/map2_valley';
import { map3Monsters } from '../data/monsters/map3_woods';
import { map4Monsters } from '../data/monsters/map4_outpost';
import { map5Monsters } from '../data/monsters/map5_fortress';
import { map6Monsters } from '../data/monsters/map6_core';

const getRarityStyle = (rarity, isActive) => {
  const styles = {
    Common: { border: isActive ? 'border-slate-400' : 'border-white/5', text: 'text-slate-200', bgIcon: 'bg-slate-700/50' },
    Uncommon: { border: isActive ? 'border-emerald-500' : 'border-white/5', text: 'text-emerald-400', bgIcon: 'bg-emerald-900/40' },
    Rare: { border: isActive ? 'border-blue-500' : 'border-white/5', text: 'text-blue-400', bgIcon: 'bg-blue-900/40' },
    Epic: { border: isActive ? 'border-purple-500' : 'border-white/5', text: 'text-purple-400', bgIcon: 'bg-purple-900/40' },
    Legendary: { border: isActive ? 'border-orange-500' : 'border-white/5', text: 'text-orange-400', bgIcon: 'bg-amber-900/50' }
  };
  return styles[rarity] || styles.Common;
};

export default function CharacterView({ stats, setPlayer, collScore, passiveBonuses, collectionBonuses }) {
  const [showTitleSelector, setShowTitleSelector] = useState(false);
  const [newTitlePopup, setNewTitlePopup] = useState(null);
  const [selectedTitleInfo, setSelectedTitleInfo] = useState(null);
  const [activeBreakdown, setActiveBreakdown] = useState(null);

  const collectionScore = collScore || 0;
  const activeTitle = allTitles.find(t => t.id === stats.activeTitleId) || allTitles[0];
  const collTitle = getCollectionTitle(collScore);

  useEffect(() => {
    allTitles.forEach(title => {
      if (checkTitleUnlock(title.id, stats, collectionScore) && !stats.unlockedTitles?.includes(title.id)) {
        setNewTitlePopup(title);
        setPlayer(prev => ({ ...prev, unlockedTitles: [...(prev.unlockedTitles || []), title.id] }));
      }
    });
  }, [stats.level, collectionScore, stats, setPlayer]);

  const allGameMonsters = useMemo(() => {
    return [
      ...map1Monsters, 
      ...(map2Monsters || []), 
      ...(map3Monsters || []), 
      ...(map4Monsters || []), 
      ...(map5Monsters || []), 
      ...(map6Monsters || [])
    ];
  }, []);

  const completedMonsterSets = useMemo(() => {
    return allGameMonsters.filter(m => {
      const mColl = stats.collection?.[m.id] || [];
      if (!m.lootTable || m.lootTable.length === 0) return false;

      return m.lootTable
        .filter(loot => loot.type !== 'SKILL')
        .every(loot => mColl.includes(loot.name));
    });
  }, [allGameMonsters, stats.collection]);

  const liveCollectionBonuses = useMemo(() => {
    return completedMonsterSets.reduce((acc, m) => {
      if (m.collectionBonus) {
        Object.keys(m.collectionBonus).forEach(key => {
          acc[key] = (acc[key] || 0) + m.collectionBonus[key];
        });
      }
      return acc;
    }, { hp: 0, atk: 0, def: 0, luck: 0 });
  }, [completedMonsterSets]);

  const { finalMaxHp, finalAtk, finalDef, bonusStats, hpPercent, expPercent } = 
    useCharacterStats(stats, activeTitle, passiveBonuses, liveCollectionBonuses);

  const baseStats = calculateBaseStats(stats);

  const statDisplayList = [
    { 
      icon: Heart, label: 'HP', color: 'text-red-500', 
      val: finalMaxHp, 
      bonus: bonusStats?.hp || 0, 
      key: 'maxHp',
      statKey: 'hp',
      breakdown: { base: stats.hp, title: activeTitle?.bonusStats?.maxHp || 0, passive: passiveBonuses?.hp || 0, collection: liveCollectionBonuses.hp }
    },
    { 
      icon: Sword, label: 'ATK', color: 'text-orange-500', 
      val: finalAtk, 
      bonus: bonusStats?.atk || 0, 
      key: 'atk',
      statKey: 'atk',
      breakdown: { base: stats.atk, title: activeTitle?.bonusStats?.atk || 0, passive: passiveBonuses?.atk || 0, collection: liveCollectionBonuses.atk }
    },
    { 
      icon: Shield, label: 'DEF', color: 'text-blue-500', 
      val: finalDef, 
      bonus: bonusStats?.def || 0, 
      key: 'def',
      statKey: 'def',
      breakdown: { base: stats.def, title: activeTitle?.bonusStats?.def || 0, passive: passiveBonuses?.def || 0, collection: liveCollectionBonuses.def }
    },
    { 
      icon: Sparkles, label: 'LUCK', color: 'text-emerald-400', 
      val: (stats.luck || 0) + (bonusStats?.luck || liveCollectionBonuses.luck), 
      bonus: bonusStats?.luck || liveCollectionBonuses.luck,
      key: 'luck',
      statKey: 'luck',
      breakdown: { base: stats.luck || 0, title: 0, passive: 0, collection: liveCollectionBonuses.luck }
    }
  ];

  return (
    <div className="flex-1 w-full h-full flex flex-col items-center bg-slate-950 overflow-y-auto px-4 py-6
    bg-[url('https://www.transparenttextures.com/patterns/dark-matter.png')] relative">
      
      <div className="w-full max-w-sm flex flex-col space-y-6">
        
        {/* ✅ เอาส่วน Profile Header Name ออกแล้วครับ */}

        <div className="grid grid-cols-2 gap-3 flex-shrink-0">
          <div className="bg-slate-900/60 p-3 rounded-2xl border border-white/5 backdrop-blur-sm shadow-lg">
            <span className="text-[8px] font-black text-amber-500/50 uppercase block mb-1">Rank</span>
            <div className={`w-full py-1.5 rounded-lg bg-gradient-to-r ${collTitle.color} text-white text-[9px] font-black text-center shadow-md uppercase`}>
              {collTitle.name}
            </div>
          </div>
          
          <div className="bg-slate-900/60 p-3 rounded-2xl border border-white/5 flex flex-col justify-between backdrop-blur-sm shadow-lg">
            <span className="text-[8px] font-black text-blue-400/50 uppercase block mb-1 text-right">Title</span>
            <div className="flex items-center justify-end gap-1">
              <span className="text-white text-[10px] font-bold italic leading-tight text-right uppercase">
                    "{activeTitle.name}"
              </span>
              <button onClick={() => setShowTitleSelector(true)} className="p-1 bg-slate-800 hover:bg-slate-700 rounded-md border border-white/10">
                <ChevronRight size={14} className="text-amber-500" />
              </button>
            </div>
          </div>
        </div>

        <div className="flex-shrink-0">
          <ProfileHeader stats={stats} collectionScore={collectionScore} finalMaxHp={finalMaxHp} hpPercent={hpPercent} expPercent={expPercent} />
        </div>

        <div className="bg-gradient-to-r mb-1 from-amber-500 to-orange-600 p-[1px] rounded-2xl flex-shrink-0 shadow-xl shadow-orange-950/20">
          <div className="bg-slate-900/95 py-2 px-6 rounded-[calc(1rem-1px)] flex justify-between items-center backdrop-blur-md">
            <div className="flex items-center gap-3">
              <Star className="text-amber-500 fill-amber-500 animate-pulse" size={16} />
              <span className="text-white font-black uppercase text-[10px] italic tracking-widest">Available Points</span>
            </div>
            <span className="text-3xl font-black text-amber-500 leading-none">
              {stats.points || 0}
            </span>
          </div>
        </div>

        <div className="flex flex-col space-y-2 flex-shrink-0">
          {statDisplayList.map((stat, i) => (
            <div key={i} className="w-full relative group">
              <StatItem 
                stat={stat} 
                stats={stats}
                bonus={stat.bonus}
                onUpgrade={(key) => setPlayer(prev => ({ ...prev, [key]: (prev[key] || 0) + 1, points: prev.points - 1 }))} 
              />
              <button 
                onClick={() => setActiveBreakdown(stat)}
                className="absolute left-1 top-1 p-1.5 text-slate-600 hover:text-amber-500 transition-colors"
              >
                <Info size={12} />
              </button>
            </div>
          ))}
        </div>
      </div>

      {activeBreakdown && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-6 bg-black/80 backdrop-blur-sm" onClick={() => setActiveBreakdown(null)}>
          <div className="w-full max-w-[300px] bg-slate-950 border-2 border-amber-600/30 rounded-[2rem] p-6 shadow-2xl animate-in fade-in zoom-in duration-200" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center gap-2">
                <activeBreakdown.icon className={activeBreakdown.color} size={18} />
                <h4 className="text-white font-black uppercase italic tracking-widest">{activeBreakdown.label} Sources</h4>
              </div>
              <button onClick={() => setActiveBreakdown(null)} className="text-slate-500"><X size={18} /></button>
            </div>

            <div className="space-y-3">
              <div className="flex justify-between text-[11px] border-b border-white/5 pb-2">
                <span className="text-slate-400 uppercase font-bold tracking-tighter">Base (Level)</span>
                <span className="text-white font-mono">{activeBreakdown.breakdown.base}</span>
              </div>
              <div className="flex justify-between text-[11px] border-b border-white/5 pb-2">
                <span className="text-slate-400 uppercase font-bold tracking-tighter">Title Bonus</span>
                <span className="text-emerald-500 font-mono">+{activeBreakdown.breakdown.title}</span>
              </div>
              <div className="flex justify-between text-[11px] border-b border-white/5 pb-2">
                <span className="text-slate-400 uppercase font-bold tracking-tighter">Passive Skills</span>
                <span className="text-emerald-500 font-mono">+{activeBreakdown.breakdown.passive}</span>
              </div>

              <div className="bg-amber-500/5 rounded-xl border border-amber-500/20 p-2 space-y-2">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-amber-500 text-[10px] font-black uppercase tracking-widest">Collection Set</span>
                  <span className="text-amber-500 font-mono font-black text-[11px]">
                    +{liveCollectionBonuses[activeBreakdown.statKey] || 0}
                  </span>
                </div>
                
                <div className="max-h-[100px] overflow-y-auto space-y-1.5 pr-1 custom-scrollbar">
                  {completedMonsterSets.filter(m => (m.collectionBonus?.[activeBreakdown.statKey] || 0) > 0).map(m => (
                    <div key={m.id} className="flex justify-between items-center text-[9px] bg-black/40 p-1.5 rounded-lg">
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs">{m.icon || "👾"}</span>
                        <span className={m.rarity === 'Legendary' ? "text-orange-400 font-bold" : "text-slate-300"}>
                          {m.name}
                        </span>
                      </div>
                      <span className="text-emerald-500">+{m.collectionBonus[activeBreakdown.statKey]}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-2 flex justify-between items-end border-t border-white/10 mt-2">
                <span className="text-[10px] text-slate-500 uppercase font-black">Final {activeBreakdown.label}</span>
                <span className={`text-2xl font-black italic ${activeBreakdown.color}`}>
                  {statDisplayList.find(s => s.statKey === activeBreakdown.statKey)?.val || activeBreakdown.val}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {showTitleSelector && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/80 backdrop-blur-md">
          <div className="w-full max-w-sm max-h-[85vh] overflow-hidden bg-slate-900 border border-white/10 rounded-[2.5rem] shadow-2xl flex flex-col animate-in zoom-in duration-300">
              <div className="p-5 overflow-y-auto custom-scrollbar flex-1">
                <TitleSelector 
                  stats={stats} 
                  setPlayer={setPlayer} 
                  showTitleSelector={true} 
                  setShowTitleSelector={setShowTitleSelector} 
                  selectedTitleInfo={selectedTitleInfo}
                  setSelectedTitleInfo={setSelectedTitleInfo}
                  getRarityStyle={getRarityStyle} 
                />
              </div>
              <button onClick={() => { setShowTitleSelector(false); setSelectedTitleInfo(null); }} 
               className="m-5 p-4 bg-slate-800 text-white font-black rounded-2xl text-xs uppercase hover:bg-slate-700 transition-colors">
                Close List
              </button>
          </div>
        </div>
      )}

      {newTitlePopup && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm">
          <div className="bg-slate-950 border border-amber-500/50 rounded-3xl p-8 text-center shadow-2xl animate-in zoom-in duration-300">
              <PartyPopper className="mx-auto mb-4 text-amber-500" size={56} />
              <h3 className="text-amber-500 font-black text-sm uppercase mb-1">New Title Unlocked!</h3>
              <p className="text-white text-xl font-black italic uppercase mb-6">"{newTitlePopup.name}"</p>
              <button onClick={() => setNewTitlePopup(null)} className="w-full py-3 bg-amber-600 text-black font-black rounded-xl hover:bg-amber-500 transition-colors">AWESOME!</button>
          </div>
        </div>
      )}
    </div>
  );
}