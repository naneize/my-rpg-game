import React, { useState, useMemo } from 'react'; 
import { 
  ChevronRight, Shield, Sword, Heart, Package, Lock, 
  Check, X, ShieldCheck, Zap, Target, Flame
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

  const closeModal = () => {
    setSelectorSlot(null);
    setSelectedInstanceId(null);
  };

  // ✅ แก้ไข: เติมพลังให้ไอเทมในตัวก่อนคำนวณ เพื่อให้เลขเขียว (+X) โชว์ใน Header และ StatGroup
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

  // --- Actions ---
  const handleEquip = (instanceId, slot) => {
    const rawItem = stats.inventory.find(
      (item) => (item.instanceId || item.id) === instanceId
    );
    if (!rawItem) return;

    // เติมพลังจากฐานข้อมูลก่อนสวมใส่ เพื่อให้โบนัสไม่หาย
    const itemData = getFullItemInfo(rawItem);

    setPlayer(prev => {
      const newEquipment = { ...prev.equipment };
      // 🛡️ Neural Link Re-routing: ป้องกันการใส่ของชิ้นเดิมซ้ำในหลายช่อง
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

  // วางไว้ก่อนบรรทัด return ( ... )
  console.log("=== 🛡️ GEAR MATRIX DEBUGGER ===");
  console.log("1. Equipment in State:", stats.equipment);
  console.log("2. Inventory Items:", stats.inventory);

  // เช็คเฉพาะไอเทมที่ใส่อยู่ในช่อง Weapon (ตัวอย่าง)
  if (stats.equipment?.weapon) {
    const wp = stats.equipment.weapon;
    console.log("⚔️ Weapon Check:", {
      hasAtk: wp.atk !== undefined,
      instanceId: wp.instanceId,
      fullInfo: getFullItemInfo(wp)
    });
  }

  return (
    <div className="flex-1 w-full bg-[#020617] overflow-y-auto custom-scrollbar relative pb-32 font-sans">
      <div className="fixed inset-0 bg-[radial-gradient(circle_at_50%_0%,_rgba(245,158,11,0.03)_0%,_transparent_50%)] pointer-events-none" />
      
      <div className="relative z-10 w-full max-w-[1200px] mx-auto px-4 py-4 md:py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          <div className="lg:col-span-3 space-y-4 order-2 lg:order-1">
             <div className="bg-slate-900/30 border border-white/5 p-4 rounded-[2rem] backdrop-blur-md shadow-lg text-center">
                <span className="text-[10px] font-black text-amber-500/40 uppercase tracking-[0.3em] mb-2 block italic">Neural Sync Rank</span>
             </div>
             
             <div className="bg-slate-900/40 border border-white/5 p-5 rounded-[2rem] backdrop-blur-md grid grid-cols-2 gap-3">
                <div className="flex flex-col items-center p-3 bg-black/40 rounded-2xl border border-yellow-500/10">
                   <Target size={14} className="text-yellow-500 mb-1" />
                   <span className="text-[8px] font-black text-slate-500 uppercase">Crit Rate</span>
                   <span className="text-sm font-black text-white font-mono">{(fullStats?.critRate * 100).toFixed(1)}%</span>
                </div>
                <div className="flex flex-col items-center p-3 bg-black/40 rounded-2xl border border-purple-500/10">
                   <Zap size={14} className="text-purple-500 mb-1" />
                   <span className="text-[8px] font-black text-slate-500 uppercase">Crit Dmg</span>
                   <span className="text-sm font-black text-white font-mono">{(fullStats?.critDamage * 100).toFixed(0)}%</span>
                </div>
             </div>
          </div>

          <div className="lg:col-span-6 space-y-6 order-1 lg:order-2 flex flex-col items-center">
            <ProfileHeader 
                stats={{
                  ...stats, 
                  displayAtk: fullStats?.finalAtk || stats.atk, 
                  displayDef: fullStats?.finalDef || stats.def
                }} 
                collectionScore={collScore}
                finalMaxHp={fullStats?.finalMaxHp || stats.maxHp} 
                hpPercent={Math.min(Math.max((stats.hp / (fullStats?.finalMaxHp || stats.maxHp)) * 100, 0), 100)} 
                expPercent={Math.min(Math.max((stats.exp / (stats.nextLevelExp || 100)) * 100, 0), 100)} 
            />

            <div className="w-full bg-slate-900/30 border border-white/5 p-6 md:p-8 rounded-[3rem] backdrop-blur-xl shadow-xl relative overflow-hidden group">
               <div className="relative z-10 flex flex-col items-center">
                  <div className="grid grid-cols-3 md:flex md:flex-row gap-4 md:gap-6 justify-center w-full max-w-md md:max-w-none">
                    {['WEAPON', 'ARMOR', 'ACCESSORY', 'BELT', 'TRINKET'].map((slot) => {
                      const rawItem = stats.equipment[slot.toLowerCase()];
                      const item = rawItem ? getFullItemInfo(rawItem) : null;
                      
                      return (
                        <div key={slot} onClick={() => setSelectorSlot(slot)} 
                          className={`aspect-square w-full md:w-20 rounded-[1.8rem] border-2 flex flex-col items-center justify-center transition-all cursor-pointer active:scale-90 relative group/slot
                          ${rawItem ? 'border-amber-500/40 bg-amber-500/10 shadow-lg' : 'border-dashed border-white/5 bg-black/40'}`}>
                          {rawItem ? (
                            <span className="text-3xl md:text-4xl drop-shadow-md group-hover/slot:scale-110 transition-transform">
                                {item?.icon || rawItem?.icon || '📦'}
                            </span>
                          ) : (
                            <div className="opacity-10 group-hover/slot:opacity-30">
                              {slot === 'WEAPON' && <Sword size={24} />}
                              {slot === 'ARMOR' && <Shield size={24} />}
                              {slot === 'ACCESSORY' && <Heart size={24} />}
                              {slot === 'BELT' && <ShieldCheck size={24} />}
                              {slot === 'TRINKET' && <Lock size={24} />}
                            </div>
                          )}
                          <span className="absolute -bottom-6 text-[8px] font-black text-slate-600 uppercase tracking-widest">{slot}</span>
                        </div>
                      );
                    })}
                  </div>
               </div>
            </div>
          </div>

          <div className="lg:col-span-3 space-y-4 order-3 lg:order-3">
             <div className="bg-slate-900/40 border border-white/5 p-6 rounded-[2.5rem] backdrop-blur-xl shadow-lg">
                <StatGroup 
                  stats={stats} 
                  displayStats={{
                    atk: fullStats?.finalAtk || stats.atk,
                    def: fullStats?.finalDef || stats.def,
                    maxHp: fullStats?.finalMaxHp || stats.maxHp,
                    critRate: (fullStats?.critRate * 100).toFixed(1) + "%",
                    critDamage: (fullStats?.critDamage * 100).toFixed(0) + "%"
                  }}
                  bonusStats={fullStats?.displayBonus}
                  displayBonus={fullStats?.displayBonus}
                />
             </div>
          </div>
        </div>
      </div>

      {/* --- SELECTOR MODAL --- */}
      {selectorSlot && (
        <div className="fixed inset-0 z-[150] flex items-end md:items-center justify-center p-0 md:p-4 bg-black/90 backdrop-blur-md animate-in fade-in duration-300">
          <div className="absolute inset-0 hidden md:block" onClick={closeModal} />
          <div className="relative w-full max-w-sm bg-[#0b1120] rounded-t-[3rem] md:rounded-[3rem] border border-white/10 shadow-2xl flex flex-col h-[85vh] md:max-h-[80vh] overflow-hidden transform animate-in slide-in-from-bottom duration-300">
            <div className="shrink-0 px-8 py-6 border-b border-white/5 bg-white/[0.03] flex items-center justify-between">
              <div>
                <span className="text-[10px] font-black text-amber-500 uppercase tracking-widest block mb-1 italic">Selecting Matrix</span>
                <h3 className="text-white font-black uppercase italic tracking-tighter text-lg">{selectorSlot}</h3>
              </div>
              <button onClick={closeModal} className="p-3 bg-white/5 rounded-2xl text-slate-400 active:scale-90"><X size={24} /></button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
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
                  <div className="grid grid-cols-1 gap-4">
                    {displayItems.map((invItem) => {
                      const item = getFullItemInfo(invItem);
                      const isEquippedInSlot = stats.equipment[selectorSlot.toLowerCase()]?.instanceId === invItem.instanceId;
                      const isSelected = selectedInstanceId === (invItem.instanceId || invItem.id);

                      return (
                        <button 
                          key={invItem.instanceId || invItem.id} 
                          onClick={() => setSelectedInstanceId(invItem.instanceId || invItem.id)}
                          className={`w-full flex items-center gap-5 p-5 rounded-[2rem] border transition-all active:scale-[0.98]
                            ${isSelected ? 'bg-amber-500/10 border-amber-500/50 shadow-lg' : 'bg-white/[0.02] border-white/5'}`}
                        >
                          <span className="text-4xl drop-shadow-lg">{item?.icon || '📦'}</span>
                          <div className="text-left flex-1 min-w-0">
                            <p className={`text-[12px] font-black uppercase italic truncate ${item?.color || 'text-white'}`}>
                              {item?.name} {invItem.level > 0 && `+${invItem.level}`}
                            </p>
                            <div className="flex flex-wrap gap-x-3 gap-y-1 mt-2">
                              {item?.atk > 0 && <span className="text-[9px] text-red-400 font-bold uppercase">ATK +{item.atk}</span>}
                              {item?.critRate > 0 && <span className="text-[9px] text-yellow-400 font-black uppercase">CRIT +{(item.critRate * 100).toFixed(0)}%</span>}
                              {item?.def > 0 && <span className="text-[9px] text-blue-400 font-bold uppercase">DEF +{item.def}</span>}
                              {item?.hp > 0 && <span className="text-[9px] text-emerald-400 font-bold uppercase">HP +{item.hp}</span>}
                            </div>
                          </div>
                          {isEquippedInSlot && <div className="p-1.5 bg-amber-500 rounded-lg"><Check size={12} className="text-slate-950" /></div>}
                        </button>
                      );
                    })}
                  </div>
                ) : (
                  <div className="py-20 text-center flex flex-col items-center gap-4 opacity-20">
                    <Package size={48} />
                    <span className="text-[10px] uppercase font-black tracking-widest italic">Inventory Matrix Empty</span>
                  </div>
                );
              })()}
            </div>

            <div className="shrink-0 p-8 bg-slate-900/80 border-t border-white/5 backdrop-blur-xl pb-10 md:pb-8">
              {selectedInstanceId ? (
                <div className="grid grid-cols-1 gap-3">
                  <button 
                    onClick={() => {
                        const equippedInSlot = stats.equipment[selectorSlot.toLowerCase()];
                        const isCurrent = equippedInSlot?.instanceId === selectedInstanceId;
                        isCurrent ? handleUnequip(selectorSlot) : handleEquip(selectedInstanceId, selectorSlot);
                    }}
                    className="py-5 bg-amber-500 text-slate-950 text-[11px] font-black rounded-2xl uppercase tracking-[0.3em] shadow-xl active:scale-95 transition-all"
                  >
                    { stats.equipment[selectorSlot.toLowerCase()]?.instanceId === selectedInstanceId ? 'DISCONNECT' : 'SYNC CORE' }
                  </button>
                </div>
              ) : (
                <button onClick={closeModal} className="w-full py-5 bg-white/5 text-white/50 text-[11px] font-black rounded-2xl border border-white/10 uppercase tracking-[0.3em]">RETURN</button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}