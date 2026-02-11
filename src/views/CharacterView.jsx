import React, { useState, useMemo } from 'react'; 
import { 
  ChevronRight, Shield, Sword, Heart, Package, Lock, 
  Check, X, ShieldCheck, Zap, Target, Flame, Cpu, Activity, Search,
  Droplets, Mountain, Wind, Sun, Moon, Skull, Sparkles
} from 'lucide-react';

// --- Sub-Components ---
import ProfileHeader from '../components/character/ProfileHeader';
import StatGroup from '../components/character/StatGroup'; 

import { EQUIPMENTS } from '../data/equipments'; 
import { getFullItemInfo } from '../utils/inventoryUtils'; 

// ✅ Step 2: Import ตัวคำนวณกลางมาใช้งาน
import { calculateFinalStats } from '../utils/statCalculations';

export default function CharacterView({ stats, setPlayer, collScore, collectionBonuses }) {
  // --- States สำหรับระบบ Gear Matrix เท่านั้น ---
  const [selectorSlot, setSelectorSlot] = useState(null);
  const [selectedInstanceId, setSelectedInstanceId] = useState(null);

  // --- Configuration สำหรับธาตุ ---
  const ELEMENT_CONFIG = {
    fire: { label: 'FIRE', icon: <Flame size={10}/>, color: 'text-red-500' },
    water: { label: 'WATER', icon: <Droplets size={10}/>, color: 'text-blue-500' },
    earth: { label: 'EARTH', icon: <Mountain size={10}/>, color: 'text-orange-900' },
    wind: { label: 'WIND', icon: <Wind size={10}/>, color: 'text-emerald-500' },
    light: { label: 'LIGHT', icon: <Sun size={10}/>, color: 'text-yellow-400' },
    dark: { label: 'DARK', icon: <Moon size={10}/>, color: 'text-purple-500' },
    poison: { label: 'POISON', icon: <Skull size={10}/>, color: 'text-lime-500' }
  };

  const closeModal = () => {
    setSelectorSlot(null);
    setSelectedInstanceId(null);
  };

  const getRarityColor = (rarity) => {
    switch (rarity) {
      case 'Legendary': return 'text-amber-500 border-amber-500/50 bg-amber-500/5 shadow-[0_0_15px_rgba(245,158,11,0.2)]';
      case 'Epic': return 'text-purple-500 border-purple-500/50 bg-purple-500/5';
      case 'Rare': return 'text-blue-500 border-blue-500/50 bg-blue-500/5';
      case 'Uncommon': return 'text-emerald-500 border-emerald-500/50 bg-emerald-500/5';
      default: return 'text-slate-400 border-white/10 bg-slate-900/40';
    }
  };

  const fullStats = useMemo(() => {
    const enrichedEquipment = {};
    if (stats.equipment) {
      Object.keys(stats.equipment).forEach(slot => {
        const raw = stats.equipment[slot];
        enrichedEquipment[slot] = raw ? getFullItemInfo(raw) : null;
      });
    }
    return calculateFinalStats({ ...stats, equipment: enrichedEquipment });
  }, [stats]);

  const handleEquip = (instanceId, slot) => {
    const rawItem = stats.inventory.find(
      (item) => (item.instanceId || item.id) === instanceId
    );
    if (!rawItem) return;

    const itemData = getFullItemInfo(rawItem);

    setPlayer(prev => {
      const newEquipment = { ...prev.equipment };
      Object.keys(newEquipment).forEach(s => {
        if (newEquipment[s]?.instanceId === instanceId) newEquipment[s] = null;
      });

      return {
        ...prev,
        equipment: {
          ...newEquipment,
          [slot.toLowerCase()]: itemData 
        }
      };
    });
    closeModal();
  };

  const handleUnequip = (slot) => {
    setPlayer(prev => ({
      ...prev,
      equipment: { ...prev.equipment, [slot.toLowerCase()]: null }
    }));
    closeModal();
  };

  return (
    <div className="flex-1 w-full bg-[#020617] overflow-y-auto custom-scrollbar relative pb-32 font-mono">
      <div className="fixed inset-0 bg-[radial-gradient(square_at_50%_0%,_rgba(59,130,246,0.05)_0%,_transparent_50%)] pointer-events-none" />
      <div className="fixed inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(#3b82f6 1px, transparent 0)', backgroundSize: '24px 24px' }} />
      
      <div className="relative z-10 w-full max-w-[1200px] mx-auto px-4 py-4 md:py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          <div className="lg:col-span-3 space-y-4 order-2 lg:order-1">
             <div className="bg-slate-900/40 border border-white/10 p-4 rounded-none backdrop-blur-md shadow-xl text-center relative overflow-hidden group">
                <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-amber-500" />
                <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-amber-500" />
                <span className="text-[10px] font-black text-amber-500 uppercase tracking-[0.4em] mb-1 block italic">Neural_Link_Status</span>
                <span className="text-white font-black italic tracking-tighter">SYNCHRONIZED_v2.0</span>
             </div>
             
             <div className="bg-slate-900/40 border border-white/10 p-4 rounded-none backdrop-blur-md grid grid-cols-1 gap-2">
                <div className="flex items-center justify-between p-3 bg-black/40 border border-yellow-500/20 hover:border-yellow-500/60 transition-all group">
                    <div className="flex items-center gap-3">
                        <Target size={16} className="text-yellow-500" />
                        <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Crit_Rate</span>
                    </div>
                    <span className="text-lg font-black text-white italic">{(fullStats?.critRate * 100).toFixed(1)}%</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-black/40 border border-purple-500/20 hover:border-purple-500/60 transition-all group">
                    <div className="flex items-center gap-3">
                        <Zap size={16} className="text-purple-500" />
                        <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Crit_Dmg</span>
                    </div>
                    <span className="text-lg font-black text-white italic">{(fullStats?.critDamage * 100).toFixed(0)}%</span>
                </div>
             </div>
          </div>

          <div className="lg:col-span-6 space-y-6 order-1 lg:order-2 flex flex-col items-center">
            <ProfileHeader 
                stats={{
                  ...stats, 
                  displayAtk: fullStats?.finalAtk || stats.atk, 
                  displayDef: fullStats?.finalDef || stats.def,
                  atkP: fullStats?.displayBonus?.atkPercent || 0,
                  defP: fullStats?.displayBonus?.defPercent || 0,
                }} 
                collectionScore={collScore}
                finalMaxHp={fullStats?.finalMaxHp || stats.maxHp} 
                hpPercent={Math.min(Math.max((stats.hp / (fullStats?.finalMaxHp || stats.maxHp)) * 100, 0), 100)} 
                expPercent={Math.min(Math.max((stats.exp / (stats.nextLevelExp || 100)) * 100, 0), 100)} 
            />

            <div className="w-full bg-slate-900/40 border border-white/10 p-6 md:p-10 rounded-none backdrop-blur-2xl shadow-2xl relative group">
               <div className="absolute top-0 left-0 w-6 h-6 border-t-2 border-l-2 border-blue-500/50" />
               <div className="absolute top-0 right-0 w-6 h-6 border-t-2 border-r-2 border-blue-500/50" />
               <div className="absolute bottom-0 left-0 w-6 h-6 border-b-2 border-l-2 border-blue-500/50" />
               <div className="absolute bottom-0 right-0 w-6 h-6 border-b-2 border-r-2 border-blue-500/50" />
               
               <div className="relative z-10 flex flex-col items-center">
                  <div className="grid grid-cols-3 md:flex md:flex-row gap-4 md:gap-6 justify-center w-full">
                    {['WEAPON', 'ARMOR', 'BELT', 'TRINKET', 'ACCESSORY'].map((slot) => {
                      const rawItem = stats.equipment[slot.toLowerCase()];
                      const item = rawItem ? getFullItemInfo(rawItem) : null;
                      
                      return (
                        <div key={slot} onClick={() => setSelectorSlot(slot)} 
                          className={`aspect-square w-full md:w-20 rounded-none border-2 flex flex-col items-center justify-center transition-all cursor-pointer active:scale-95 relative group/slot
                          ${rawItem ? 'border-amber-500 bg-amber-500/10' : 'border-white/5 bg-black/40 hover:border-blue-500/40 hover:bg-blue-500/5'}`}>
                          
                          {rawItem ? (
                            <div className="relative">
                               <span className="text-4xl md:text-5xl drop-shadow-[0_0_8px_rgba(255,255,255,0.2)]">
                                  {item?.icon || rawItem?.icon || '📦'}
                               </span>
                               <div className="absolute -top-1 -right-1 w-2 h-2 bg-amber-500 rounded-none animate-pulse border border-slate-950" />
                            </div>
                          ) : (
                            <div className="opacity-10 group-hover/slot:opacity-40 transition-opacity">
                              {slot === 'WEAPON' && <Sword size={28} />}
                              {slot === 'ARMOR' && <Shield size={28} />}
                              {slot === 'ACCESSORY' && <Heart size={28} />}
                              {slot === 'BELT' && <ShieldCheck size={28} />}
                              {slot === 'TRINKET' && <Lock size={28} />}
                            </div>
                          )}
                          <span className="absolute -bottom-6 text-[8px] font-black text-slate-500 uppercase tracking-widest">{slot}</span>
                        </div>
                      );
                    })}
                  </div>
               </div>
            </div>
          </div>

          <div className="lg:col-span-3 space-y-4 order-3 lg:order-3">
             <div className="bg-slate-900/40 border border-white/10 p-6 rounded-none backdrop-blur-xl shadow-xl relative">
                <div className="absolute top-0 right-0 p-3 opacity-10">
                    <Activity size={32} className="text-blue-500" />
                </div>
                <StatGroup 
                  stats={stats} 
                  displayStats={{
                    atk: fullStats?.finalAtk || stats.atk,
                    def: fullStats?.finalDef || stats.def,
                    maxHp: fullStats?.finalMaxHp || stats.maxHp,
                    critRate: (fullStats?.critRate * 100).toFixed(1) + "%",
                    critDamage: (fullStats?.critDamage * 100).toFixed(0) + "%"
                  }}
                  displayBonus={fullStats?.displayBonus}
                  bonusStats={fullStats?.displayBonus}
                />
             </div>
          </div>
        </div>
      </div>

      {/* --- HARD-EDGE SELECTOR MODAL --- */}
      {selectorSlot && (
        <div className="fixed inset-0 z-[150] flex items-end md:items-center justify-center p-0 md:p-6 bg-slate-950/95 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="absolute inset-0 hidden md:block" onClick={closeModal} />
          
          <div className="relative w-full max-w-md bg-[#0b1120] rounded-none border border-white/10 shadow-2xl flex flex-col h-[85vh] md:max-h-[85vh] overflow-hidden transform animate-in slide-in-from-bottom duration-300">
            <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-blue-500" />
            <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-blue-500" />
            
            <div className="shrink-0 px-8 py-6 border-b border-white/10 bg-white/[0.02] flex items-center justify-between">
              <div>
                <span className="text-[10px] font-black text-blue-500 uppercase tracking-[0.4em] block mb-1 italic">Matrix_Fabrication</span>
                <h3 className="text-white font-black uppercase italic tracking-tighter text-xl flex items-center gap-3">
                  <Cpu size={20} className="text-blue-500" /> {selectorSlot}
                </h3>
              </div>
              <button onClick={closeModal} className="p-2 bg-white/5 rounded-none text-slate-400 hover:text-white active:scale-90"><X size={24} /></button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-4 custom-scrollbar space-y-3">
              {(() => {
                const uniqueItemsMap = new Map();
                stats.inventory?.forEach(i => {
                  const itemInfo = getFullItemInfo(i);
                  if (itemInfo?.slot?.toUpperCase() === selectorSlot?.toUpperCase()) {
                    const key = i.instanceId || i.id;
                    if (key) uniqueItemsMap.set(key, i);
                  }
                });
                const displayItems = Array.from(uniqueItemsMap.values());

                return displayItems.length > 0 ? (
                  <div className="grid grid-cols-1 gap-2 pb-20">
                    {displayItems.map((invItem) => {
                      const item = getFullItemInfo(invItem);
                      const isEquippedInSlot = stats.equipment[selectorSlot.toLowerCase()]?.instanceId === invItem.instanceId;
                      const isSelected = selectedInstanceId === (invItem.instanceId || invItem.id);

                      return (
                        <button 
                          key={invItem.instanceId || invItem.id} 
                          onClick={() => setSelectedInstanceId(invItem.instanceId || invItem.id)}
                          className={`w-full flex items-center gap-4 p-4 rounded-none border-2 transition-all active:scale-[0.98] relative overflow-hidden
                            ${isSelected ? 'bg-blue-500/10 border-blue-500 shadow-lg' : 'bg-white/[0.03] border-white/5 hover:border-white/10'}`}
                        >
                          <div className={`w-14 h-14 rounded-none bg-black/40 flex items-center justify-center text-3xl shrink-0 border border-white/5`}>
                             {item?.icon || '📦'}
                          </div>

                          <div className="text-left flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                                <p className={`text-[12px] font-black uppercase italic truncate ${item?.color || 'text-white'}`}>
                                  {item?.name}
                                </p>
                                {/* ✅ โชว์ระดับไอเทม */}
                                <span className={`text-[7px] font-black px-1 py-0.5 uppercase border ${getRarityColor(item?.rarity || 'Common')}`}>
                                  {item?.rarity || 'Common'}
                                </span>
                                {invItem.level > 0 && <span className="text-[8px] bg-amber-500 text-black px-1.5 py-0.5 rounded-none font-black">+{invItem.level}</span>}
                            </div>
                            
                            <div className="flex flex-wrap gap-x-3 gap-y-1 opacity-80">
                              {/* Primary Stats */}
                              {item?.atk > 0 && <div className="flex items-center gap-1"><Sword size={10} className="text-red-400"/><span className="text-[9px] text-red-400 font-bold">+{item.atk}</span></div>}
                              {item?.def > 0 && <div className="flex items-center gap-1"><Shield size={10} className="text-blue-400"/><span className="text-[9px] text-blue-400 font-bold">+{item.def}</span></div>}
                              {item?.hp > 0 && <div className="flex items-center gap-1"><Heart size={10} className="text-emerald-400"/><span className="text-[9px] text-emerald-400 font-bold">+{item.hp}</span></div>}
                              
                              {/* ✅ Elemental Display (NEW) */}
                              {item?.element && (
                                <div className="flex items-center gap-1">
                                  <span className={ELEMENT_CONFIG[item.element.type]?.color || 'text-white'}>
                                    {ELEMENT_CONFIG[item.element.type]?.icon || <Zap size={10}/>}
                                  </span>
                                  <span className={`text-[9px] font-black ${ELEMENT_CONFIG[item.element.type]?.color || 'text-white'}`}>
                                    +{item.element.value}
                                  </span>
                                </div>
                              )}

                              {/* ✅ Sub Stats Display (NEW) */}
                              {item?.critRate > 0 && <div className="flex items-center gap-1"><Target size={10} className="text-orange-400"/><span className="text-[9px] text-orange-400 font-black">+{ (item.critRate * 100).toFixed(1)}%</span></div>}
                              {item?.pen > 0 && <div className="flex items-center gap-1"><ChevronRight size={10} className="text-rose-400"/><span className="text-[9px] text-rose-400 font-black">+{ (item.pen * 100).toFixed(1)}%</span></div>}
                              {item?.luck > 0 && <div className="flex items-center gap-1"><Sparkles size={10} className="text-purple-400"/><span className="text-[9px] text-purple-400 font-black">+{item.luck}</span></div>}
                            </div>
                          </div>
                          
                          {isEquippedInSlot && (
                            <div className="p-1 bg-blue-500 rounded-none">
                              <Check size={14} className="text-white" />
                            </div>
                          )}
                        </button>
                      );
                    })}
                  </div>
                ) : (
                  <div className="py-20 text-center flex flex-col items-center gap-4 opacity-10">
                    <Search size={48} />
                    <span className="text-[10px] uppercase font-black tracking-[0.4em] italic">No_Valid_Module_Found</span>
                  </div>
                );
              })()}
            </div>

            <div className="shrink-0 p-6 bg-slate-900 border-t border-white/10 backdrop-blur-2xl pb-10 md:pb-6">
              {selectedInstanceId ? (
                <button 
                  onClick={() => {
                    const equippedInSlot = stats.equipment[selectorSlot.toLowerCase()];
                    const isCurrent = (equippedInSlot?.instanceId || equippedInSlot?.id) === selectedInstanceId;
                    isCurrent ? handleUnequip(selectorSlot) : handleEquip(selectedInstanceId, selectorSlot);
                  }}
                  className="w-full py-4 bg-blue-600 text-white text-[11px] font-black rounded-none uppercase tracking-[0.3em] shadow-xl active:scale-95 transition-all flex items-center justify-center gap-3"
                >
                  { stats.equipment[selectorSlot.toLowerCase()]?.instanceId === selectedInstanceId ? 'DISCONNECT_LINK' : 'INITIALIZE_SYNC' }
                </button>
              ) : stats.equipment[selectorSlot.toLowerCase()] ? (
                <button 
                  onClick={() => handleUnequip(selectorSlot)}
                  className="w-full py-4 bg-red-600/90 text-white text-[11px] font-black rounded-none border border-red-500/20 uppercase tracking-[0.3em] active:scale-95 transition-all"
                >
                  TERMINATE_CURRENT_LINK
                </button>
              ) : (
                <button onClick={closeModal} className="w-full py-4 bg-white/5 text-white/50 text-[11px] font-black rounded-none border border-white/10 uppercase tracking-[0.3em]">SYSTEM_STANDBY</button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}