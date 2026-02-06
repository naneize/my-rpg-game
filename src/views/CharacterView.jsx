import React, { useState } from 'react'; 
import { PartyPopper, ChevronRight, Star, Shield, Sword, Heart, Sparkles, Package, Lock, Check, X } from 'lucide-react';

// --- Sub-Components ---
import ProfileHeader from '../components/character/ProfileHeader';
import TitleSelector from '../components/character/TitleSelector';
import StatGroup from '../components/character/StatGroup'; 

// --- Data & Utils ---
import { getCollectionTitle } from '../utils/characterUtils';
import { titles as allTitles } from '../data/titles';
import { EQUIPMENTS } from '../data/equipments'; 
import { getFullItemInfo } from '../utils/inventoryUtils'; 

// --- Custom Hooks ---
import { useTitleUnlocker } from '../hooks/useTitleUnlocker'; 
import { useMonsterCollection } from '../hooks/useMonsterCollection';

export default function CharacterView({ stats, setPlayer, collScore, collectionBonuses }) {
  // --- States Management ---
  const [showTitleSelector, setShowTitleSelector] = useState(false);
  const [newTitlePopup, setNewTitlePopup] = useState(null);
  const [selectedTitleInfo, setSelectedTitleInfo] = useState(null);
  const [selectorSlot, setSelectorSlot] = useState(null); 
  const [selectedInstanceId, setSelectedInstanceId] = useState(null);

  // --- Game Logic Hooks ---
  useTitleUnlocker(stats, collScore, setPlayer, setNewTitlePopup);
  const { completedMonsterSets } = useMonsterCollection(stats);

  // --- Computed Data ---
  const activeTitle = allTitles.find(t => t.id === stats.activeTitleId) || allTitles[0];
  const collTitle = getCollectionTitle(collScore);

  // --- Actions ---
  const handleEquip = (instanceId, slot) => {
    setPlayer(prev => ({
      ...prev,
      equipment: { ...prev.equipment, [slot.toLowerCase()]: instanceId }
    }));
    closeModal();
  };

  const handleUnequip = (slot) => {
    setPlayer(prev => ({
      ...prev,
      equipment: { ...prev.equipment, [slot.toLowerCase()]: null }
    }));
    closeModal();
  };

  const closeModal = () => {
    setSelectorSlot(null);
    setSelectedInstanceId(null);
  };

  return (
    <div className="flex-1 w-full bg-[#020617] overflow-y-auto custom-scrollbar relative pb-24 font-sans">
      <div className="fixed inset-0 bg-[radial-gradient(circle_at_50%_0%,_rgba(245,158,11,0.02)_0%,_transparent_50%)] pointer-events-none" />
      
      <div className="relative z-10 w-full max-w-[1300px] mx-auto px-4 sm:px-6 py-4 sm:py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
          
          <div className="lg:col-span-3 space-y-4 order-2 lg:order-1">
             <div className="bg-slate-900/30 border border-white/5 p-5 rounded-[2rem] backdrop-blur-md shadow-lg transition-all hover:border-amber-500/20">
                <span className="text-[9px] font-black text-amber-500/40 uppercase tracking-[0.3em] mb-3 block italic">Account Rank</span>
                <div className={`py-3 px-4 rounded-xl bg-gradient-to-r ${collTitle.color} text-center shadow-inner border border-white/5`}>
                  <p className="text-[10px] font-black text-white italic truncate uppercase tracking-widest">{collTitle.name}</p>
                </div>
             </div>

             <div className="bg-slate-900/30 border border-white/5 p-5 rounded-[2rem] backdrop-blur-md shadow-lg">
                <span className="text-[9px] font-black text-blue-400/40 uppercase tracking-[0.3em] mb-3 block italic text-right">Active Title</span>
                <button onClick={() => setShowTitleSelector(true)} className="w-full group flex items-center justify-between p-2 rounded-xl bg-white/[0.02] hover:bg-amber-500/10 transition-all border border-white/5">
                  <div className="p-1.5 bg-amber-500 rounded-lg shadow-lg group-hover:rotate-90 transition-transform">
                    <ChevronRight size={12} className="text-slate-950" />
                  </div>
                  <span className="text-[10px] font-bold text-slate-200 italic truncate ml-3 uppercase leading-none">"{activeTitle.name}"</span>
                </button>
             </div>
          </div>

          <div className="lg:col-span-6 space-y-6 order-1 lg:order-2 flex flex-col items-center">
             <div className="w-full bg-slate-900/60 border border-white/10 p-2 rounded-[3.5rem] shadow-2xl backdrop-blur-2xl ring-1 ring-white/5">
                <ProfileHeader stats={stats} collectionScore={collScore} finalMaxHp={stats.finalMaxHp} hpPercent={stats.hpPercent} expPercent={stats.expPercent} />
             </div>

             <div className="w-full bg-slate-900/30 border border-white/5 p-6 rounded-[3rem] backdrop-blur-xl shadow-xl relative overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-b from-white/[0.01] to-transparent pointer-events-none" />
                <div className="relative z-10 flex flex-col items-center">
                   <div className="flex items-center gap-3 mb-6 opacity-30">
                      <div className="h-px w-8 bg-white" />
                      <span className="text-[7px] font-black text-white uppercase tracking-[0.4em]">Gear Station</span>
                      <div className="h-px w-8 bg-white" />
                   </div>
                   <div className="flex gap-4 md:gap-6 justify-center w-full">
                      {['WEAPON', 'ARMOR', 'ACCESSORY'].map((slot) => {
                        const equippedId = stats.equipment[slot.toLowerCase()];
                        const invItem = stats.inventory?.find(i => i.instanceId === equippedId);
                        const item = invItem ? getFullItemInfo(invItem) : null;
                        return (
                          <div key={slot} onClick={() => setSelectorSlot(slot)} 
                            className={`w-16 h-16 md:w-20 md:h-20 rounded-[1.8rem] border-2 flex flex-col items-center justify-center transition-all cursor-pointer active:scale-90 relative group/slot
                            ${item ? 'border-amber-500/40 bg-amber-500/5 shadow-[0_0_15px_rgba(245,158,11,0.1)]' : 'border-dashed border-white/10 bg-black/40 hover:border-white/20'}`}>
                            {item ? (
                              <span className="text-3xl md:text-4xl drop-shadow-md group-hover/slot:scale-110 transition-transform">{item.icon}</span>
                            ) : (
                               <div className="opacity-10 group-hover/slot:opacity-30 transition-opacity">
                                 {slot === 'WEAPON' && <Sword size={24} />}
                                 {slot === 'ARMOR' && <Shield size={24} />}
                                 {slot === 'ACCESSORY' && <Heart size={24} />}
                               </div>
                            )}
                            <span className="absolute -bottom-5 text-[6px] font-black text-slate-700 uppercase tracking-widest">{slot}</span>
                          </div>
                        );
                      })}
                   </div>
                </div>
             </div>
          </div>

          <div className="lg:col-span-3 space-y-4 order-3 lg:order-3">
             <div className="bg-slate-900/40 border border-amber-500/20 px-6 py-4 rounded-[2rem] flex items-center justify-between shadow-lg">
                <div className="flex flex-col">
                  <span className="text-[8px] font-black text-amber-500 uppercase tracking-widest italic">Growth</span>
                  <span className="text-[10px] font-bold text-slate-500 uppercase">Available</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-3xl font-black text-white italic drop-shadow-[0_0_8px_rgba(255,255,255,0.2)]">{stats.points || 0}</span>
                  <div className="w-1.5 h-1.5 bg-amber-500 rounded-full animate-pulse shadow-[0_0_5px_rgba(245,158,11,1)]" />
                </div>
             </div>
             <div className="bg-slate-900/40 border border-white/5 p-6 rounded-[2.5rem] backdrop-blur-xl shadow-lg">
                <StatGroup stats={stats} bonusStats={stats.bonusStats} collectionBonuses={collectionBonuses}
                  onUpgrade={(key) => setPlayer(prev => ({ ...prev, [key]: (prev[key] || 0) + 1, points: prev.points - 1 }))}
                />
             </div>
          </div>
        </div>
      </div>

      {/* --- SELECTOR MODAL (แก้ไขให้เต็มจอในมือถือ) --- */}
      {selectorSlot && (
        <div className="fixed inset-0 z-[150] flex flex-col md:items-center md:justify-center bg-[#020617] md:bg-slate-950/95 md:backdrop-blur-2xl animate-in fade-in duration-300">
          
          {/* Header สำหรับ Mobile */}
          <div className="md:hidden flex items-center justify-between p-6 border-b border-white/5 bg-slate-900/50 backdrop-blur-md">
            <button onClick={closeModal} className="p-2 bg-slate-800 rounded-full text-slate-400">
              <X size={20} />
            </button>
            <h3 className="text-white font-black uppercase italic tracking-[0.2em] text-sm">
              <span className="text-amber-500">{selectorSlot}</span> Inventory
            </h3>
            <div className="w-10" />
          </div>

          <div className="flex-1 md:flex-none w-full md:max-w-md bg-slate-900 md:border md:border-white/10 md:rounded-[3.5rem] flex flex-col md:max-h-[80vh] shadow-[0_32px_64px_rgba(0,0,0,0.8)] overflow-hidden transform animate-in slide-in-from-bottom md:zoom-in-95">
            
            {/* Header สำหรับ Desktop */}
            <div className="hidden md:block p-8 pb-4 border-b border-white/5 text-center">
               <h3 className="text-white font-black uppercase italic tracking-[0.3em] text-lg">
                 Inventory: <span className="text-amber-500">{selectorSlot}</span>
               </h3>
            </div>

            {/* ส่วนรายการไอเทม */}
            <div className="flex-1 space-y-3 overflow-y-auto p-6 md:p-8 custom-scrollbar">
              {stats.inventory?.filter(i => EQUIPMENTS.find(e => e.id === i.itemId)?.slot === selectorSlot).length > 0 ? (
                stats.inventory.filter(i => EQUIPMENTS.find(e => e.id === i.itemId)?.slot === selectorSlot).map((invItem) => {
                  const item = getFullItemInfo(invItem);
                  const isEquipped = stats.equipment[selectorSlot.toLowerCase()] === invItem.instanceId;
                  const isSelected = selectedInstanceId === invItem.instanceId;

                  return (
                    <button 
                      key={invItem.instanceId} 
                      onClick={() => setSelectedInstanceId(invItem.instanceId)}
                      className={`w-full flex items-center gap-4 p-5 rounded-[2rem] border transition-all active:scale-[0.98] group relative
                        ${isSelected ? 'bg-amber-500/10 border-amber-500/50 shadow-inner' : 'bg-white/[0.03] border-white/5'}
                        ${isEquipped ? 'ring-1 ring-amber-500/20' : ''}`}
                    >
                      <span className="text-4xl group-hover:scale-110 transition-transform">{item.icon}</span>
                      <div className="text-left flex-1">
                        <p className={`text-[11px] font-black uppercase italic ${item.color || 'text-white'} tracking-wider`}>
                          {item.name} {item.level > 0 && <span className="text-amber-500">+{item.level}</span>}
                        </p>
                        <div className="flex flex-wrap gap-2 mt-1.5">
                          {item.totalAtk > 0 && <span className="px-2 py-0.5 rounded-md bg-red-500/10 text-[9px] font-black text-red-400 uppercase">ATK +{item.totalAtk}</span>}
                          {item.totalDef > 0 && <span className="px-2 py-0.5 rounded-md bg-blue-500/10 text-[9px] font-black text-blue-400 uppercase">DEF +{item.totalDef}</span>}
                          {item.totalMaxHp > 0 && <span className="px-2 py-0.5 rounded-md bg-emerald-500/10 text-[9px] font-black text-emerald-400 uppercase">HP +{item.totalMaxHp}</span>}
                        </div>
                      </div>
                      {isEquipped && (
                        <div className="absolute top-4 right-5 px-2 py-1 bg-amber-500/20 rounded-lg">
                          <span className="text-[7px] font-black text-amber-500 uppercase tracking-widest italic">Equipped</span>
                        </div>
                      )}
                    </button>
                  );
                })
              ) : (
                <div className="h-full py-20 text-center opacity-20 flex flex-col items-center justify-center">
                  <Package size={64} strokeWidth={1} className="mb-4 text-white" />
                  <p className="text-xs font-black uppercase tracking-[0.3em] text-white">Empty Bag</p>
                </div>
              )}
            </div>

            {/* ส่วนปุ่ม Action ด้านล่าง (Sticky) */}
            <div className="p-6 md:p-8 bg-slate-900/80 border-t border-white/5">
              {selectedInstanceId ? (
                <div className="grid grid-cols-2 gap-3 animate-in fade-in slide-in-from-bottom-2">
                  {stats.equipment[selectorSlot.toLowerCase()] === selectedInstanceId ? (
                    <button 
                      onClick={() => handleUnequip(selectorSlot)}
                      className="py-5 bg-red-500/10 border border-red-500/30 text-red-500 text-[10px] font-black rounded-2xl uppercase tracking-[0.2em] active:scale-95 transition-all"
                    >
                      Unequip
                    </button>
                  ) : (
                    <button 
                      onClick={() => handleEquip(selectedInstanceId, selectorSlot)}
                      className="py-5 bg-amber-500 text-slate-950 text-[10px] font-black rounded-2xl uppercase tracking-[0.2em] shadow-lg shadow-amber-500/20 active:scale-95 transition-all"
                    >
                      Equip Gear
                    </button>
                  )}
                  <button 
                    onClick={() => setSelectedInstanceId(null)}
                    className="py-5 bg-white/5 border border-white/10 text-slate-400 text-[10px] font-black rounded-2xl uppercase tracking-[0.2em] active:scale-95 transition-all"
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <button 
                  onClick={closeModal}
                  className="w-full py-5 bg-white/[0.03] hover:bg-white/[0.08] text-white text-[10px] font-black rounded-2xl uppercase tracking-[0.3em] transition-all active:scale-95 border border-white/10"
                >
                  Return to Profile
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* --- MODALS ฉายา --- */}
      {showTitleSelector && (
        <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center bg-[#020617] md:bg-slate-950/95 md:backdrop-blur-xl animate-in fade-in">
           <div className="w-full md:max-w-lg h-full md:h-auto md:max-h-[90vh] bg-slate-900 md:border md:border-white/10 md:rounded-[4rem] shadow-2xl overflow-hidden flex flex-col transform animate-in slide-in-from-bottom md:zoom-in-95">
              <div className="p-6 sm:p-8 overflow-y-auto flex-1 custom-scrollbar">
                <TitleSelector stats={stats} setPlayer={setPlayer} showTitleSelector={true} setShowTitleSelector={setShowTitleSelector} selectedTitleInfo={selectedTitleInfo} setSelectedTitleInfo={setSelectedTitleInfo} />
              </div>
              <div className="p-6 sm:p-8 bg-black/20 border-t border-white/5">
                <button onClick={() => { setShowTitleSelector(false); setSelectedTitleInfo(null); }} 
                  className="w-full py-5 bg-amber-500 text-slate-950 text-[10px] font-black rounded-3xl uppercase tracking-[0.3em] shadow-[0_10px_30px_rgba(245,158,11,0.3)] active:scale-95 transition-all">
                  Confirm Achievement
                </button>
              </div>
           </div>
        </div>
      )}
    </div>
  );
}