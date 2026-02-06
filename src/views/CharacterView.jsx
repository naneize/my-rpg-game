import React, { useState } from 'react'; 
import { PartyPopper, ChevronRight, Star, Shield, Sword, Heart, Sparkles, Package, Lock, Check } from 'lucide-react';

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
  const [showTitleSelector, setShowTitleSelector] = useState(false);
  const [newTitlePopup, setNewTitlePopup] = useState(null);
  const [selectedTitleInfo, setSelectedTitleInfo] = useState(null);
  const [selectorSlot, setSelectorSlot] = useState(null); 

  // ✅ เรียกใช้งาน Hooks
  useTitleUnlocker(stats, collScore, setPlayer, setNewTitlePopup);
  const { completedMonsterSets } = useMonsterCollection(stats);

  const activeTitle = allTitles.find(t => t.id === stats.activeTitleId) || allTitles[0];
  const collTitle = getCollectionTitle(collScore);

  const handleEquip = (instanceId, slot) => {
    setPlayer(prev => ({
      ...prev,
      equipment: { ...prev.equipment, [slot.toLowerCase()]: instanceId }
    }));
    setSelectorSlot(null);
  };

  return (
    <div className="flex-1 w-full bg-slate-950 overflow-y-auto custom-scrollbar relative pb-24">
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-full h-full bg-amber-500/[0.02] blur-[120px] pointer-events-none" />
      
      <div className="relative z-10 w-full max-w-[1300px] mx-auto px-4 md:px-8 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8 items-start">
          
          {/* --- COLUMN 1: IDENTITY & QUICK BAG --- */}
          <div className="space-y-4 order-2 lg:order-1">
             <div className="bg-slate-900/60 border border-white/5 p-5 rounded-[2rem] backdrop-blur-md shadow-lg text-right">
                <span className="text-[9px] font-black text-amber-500 uppercase tracking-[0.2em] mb-3 block italic">Account Rank</span>
                <div className={`py-3 px-4 rounded-xl bg-gradient-to-r ${collTitle.color} text-center shadow-md border border-white/10`}>
                  <p className="text-xs font-black text-white italic truncate uppercase">{collTitle.name}</p>
                </div>
             </div>

             <div className="bg-slate-900/60 border border-white/5 p-5 rounded-[2rem] backdrop-blur-md shadow-lg text-right">
                <span className="text-[9px] font-black text-blue-400 uppercase tracking-[0.2em] mb-3 block italic">Active Title</span>
                <button onClick={() => setShowTitleSelector(true)} className="w-full group flex items-center justify-between p-2.5 rounded-2xl bg-white/5 hover:bg-amber-500/10 transition-all border border-white/5">
                  <div className="p-1.5 bg-amber-500 rounded-lg group-hover:scale-110 transition-transform">
                    <ChevronRight size={14} className="text-slate-950" />
                  </div>
                  <span className="text-[10px] font-bold text-slate-200 italic truncate ml-2 uppercase leading-none">"{activeTitle.name}"</span>
                </button>
             </div>

             {/* 📦 QUICK BAG */}
             <div className="bg-slate-900/40 border border-white/5 p-6 rounded-[2rem] backdrop-blur-sm">
                <div className="flex justify-between items-center mb-4 font-black uppercase italic text-[9px] tracking-widest text-slate-500">
                  <div className="flex items-center gap-2"><Package size={14}/><span>Quick Equip</span></div>
                  <span className={stats.inventory?.length >= 20 ? "text-red-500" : ""}>{stats.inventory?.length || 0}/20</span>
                </div>
                <div className="grid grid-cols-3 gap-3">
                  {['WEAPON', 'ARMOR', 'ACCESSORY'].map((type) => (
                    <button key={type} onClick={() => setSelectorSlot(type)} className="aspect-square rounded-2xl bg-white/5 border border-white/5 flex flex-col items-center justify-center hover:bg-amber-500/10 hover:border-amber-500/30 transition-all active:scale-90">
                      {type === 'WEAPON' && <Sword size={20} className="text-amber-500" />}
                      {type === 'ARMOR' && <Shield size={20} className="text-blue-500" />}
                      {type === 'ACCESSORY' && <Heart size={20} className="text-pink-500" />}
                      <span className="text-[6px] font-black text-slate-600 mt-1 uppercase">{type}</span>
                    </button>
                  ))}
                </div>
             </div>
          </div>

          {/* --- COLUMN 2: HERO DASHBOARD --- */}
          <div className="lg:col-span-1 bg-slate-900/80 border border-white/10 p-6 md:p-8 rounded-[3rem] backdrop-blur-xl shadow-2xl order-1 lg:order-2 flex flex-col items-center">
             <ProfileHeader stats={stats} collectionScore={collScore} finalMaxHp={stats.finalMaxHp} hpPercent={stats.hpPercent} expPercent={stats.expPercent} />

             <div className="flex gap-4 md:gap-5 mt-8 border-t border-white/5 pt-8 w-full justify-center">
                {['WEAPON', 'ARMOR', 'ACCESSORY'].map((slot) => {
                  const equippedId = stats.equipment[slot.toLowerCase()];
                  const invItem = stats.inventory?.find(i => i.instanceId === equippedId);
                  const item = invItem ? getFullItemInfo(invItem) : null;

                  return (
                    <div key={slot} onClick={() => setSelectorSlot(slot)} className={`w-16 h-16 md:w-20 md:h-20 rounded-[1.5rem] md:rounded-[2rem] border-2 flex flex-col items-center justify-center transition-all cursor-pointer active:scale-95
                      ${item ? 'border-amber-500/40 bg-amber-500/5' : 'border-dashed border-white/10 bg-black/40'}`}>
                      {item ? <span className="text-3xl md:text-4xl">{item.icon}</span> : <Lock size={20} className="text-slate-700 opacity-20" />}
                      <span className="text-[7px] font-black text-slate-800 uppercase mt-1 tracking-widest">{slot}</span>
                    </div>
                  );
                })}
             </div>
          </div>

          {/* --- COLUMN 3: STATS & GROWTH --- */}
          <div className="space-y-4 order-3 lg:order-3">
             <div className="bg-slate-900/60 border border-amber-500/20 p-4 rounded-3xl backdrop-blur-md relative overflow-hidden group shadow-lg">
                <div className="absolute top-0 right-0 p-2 opacity-5"><Star size={30} className="text-amber-500" /></div>
                <div className="flex justify-between items-center relative z-10">
                  <p className="text-[9px] font-black text-amber-500 uppercase tracking-[0.2em] italic">Available Points</p>
                  <div className="flex items-center gap-2 font-black text-white italic text-3xl">{stats.points || 0}</div>
                </div>
             </div>

             <div className="bg-slate-900/60 border border-white/5 p-6 rounded-[2.5rem] backdrop-blur-md shadow-lg">
                <StatGroup stats={stats} bonusStats={stats.bonusStats} collectionBonuses={collectionBonuses}
                  onUpgrade={(key) => setPlayer(prev => ({ ...prev, [key]: (prev[key] || 0) + 1, points: prev.points - 1 }))}
                />
             </div>
          </div>
        </div>
      </div>

      {/* --- 🛡️ ITEM SELECTOR MODAL (หน้าต่างเลือกสวมใส่) --- */}
{selectorSlot && (
  <div className="fixed inset-0 z-[150] flex items-center justify-center p-6 bg-black/95 backdrop-blur-xl animate-in fade-in duration-200">
    <div className="w-full max-w-sm bg-slate-900 border border-white/10 rounded-[3rem] p-6 shadow-2xl flex flex-col">
      
      {/* ส่วนหัวหน้าต่าง */}
      <h3 className="text-white font-black uppercase italic tracking-[0.2em] text-sm mb-6 text-center border-b border-white/5 pb-4">
        Inventory: {selectorSlot}
      </h3>

      {/* รายการไอเทม */}
      <div className="flex-1 space-y-3 overflow-y-auto max-h-[400px] pr-2 custom-scrollbar">
        {stats.inventory?.filter(i => EQUIPMENTS.find(e => e.id === i.itemId)?.slot === selectorSlot).length > 0 ? (
          stats.inventory.filter(i => EQUIPMENTS.find(e => e.id === i.itemId)?.slot === selectorSlot).map((invItem) => {
            const item = getFullItemInfo(invItem);
            const isEquipped = stats.equipment[selectorSlot.toLowerCase()] === invItem.instanceId;
            return (
              <button 
                key={invItem.instanceId} 
                onClick={() => !isEquipped && handleEquip(invItem.instanceId, selectorSlot)}
                className={`w-full flex items-center gap-4 p-4 rounded-2xl border transition-all active:scale-95 
                  ${isEquipped ? 'bg-amber-500/20 border-amber-500/50 cursor-default' : 'bg-white/5 border-white/5 hover:border-white/20'}`}
              >
                <span className="text-3xl">{item.icon}</span>
                <div className="text-left flex-1">
                  <p className={`text-[10px] font-black uppercase italic ${item.color || 'text-white'}`}>
                    {item.name} {item.level > 0 && `+${item.level}`}
                  </p>
                  <div className="flex gap-2 mt-1">
                    {item.totalAtk > 0 && <span className="text-[8px] font-bold text-red-500 uppercase tracking-tighter">ATK +{item.totalAtk}</span>}
                    {item.totalDef > 0 && <span className="text-[8px] font-bold text-blue-500 uppercase tracking-tighter">DEF +{item.totalDef}</span>}
                  </div>
                </div>
                {isEquipped && <Check size={16} className="text-amber-500" />}
              </button>
            );
          })
        ) : (
          <div className="py-12 text-center opacity-20 flex flex-col items-center">
            <Package size={48} className="mb-2" />
            <p className="text-[10px] font-black uppercase tracking-[0.2em]">No {selectorSlot} Available</p>
          </div>
        )}
      </div>

            {/* ✅ ปุ่มปิดด้านล่าง (แทนที่กากบาทเดิม) */}
      <button 
        onClick={() => setSelectorSlot(null)}
        className="mt-6 w-full py-4 bg-white/5 hover:bg-white/10 text-white text-[10px] font-black rounded-2xl uppercase tracking-[0.2em] transition-all active:scale-95 border border-white/5"
      >
        Close Inventory
      </button>
    </div>
  </div>
)}

      {/* --- MODALS ฉายา (คงเดิม) --- */}
      {showTitleSelector && (
        <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-0 sm:p-6 bg-black/95 backdrop-blur-xl">
           <div className="w-full max-w-sm max-h-[90vh] bg-slate-900 border-t sm:border border-white/10 rounded-t-[3rem] sm:rounded-[3rem] shadow-2xl overflow-hidden flex flex-col">
              <div className="p-4 overflow-y-auto flex-1 custom-scrollbar">
                <TitleSelector stats={stats} setPlayer={setPlayer} showTitleSelector={true} setShowTitleSelector={setShowTitleSelector} selectedTitleInfo={selectedTitleInfo} setSelectedTitleInfo={setSelectedTitleInfo} />
              </div>
              <button onClick={() => { setShowTitleSelector(false); setSelectedTitleInfo(null); }} className="m-6 p-4 bg-white/5 text-white text-[10px] font-black rounded-2xl uppercase tracking-widest border border-white/5">Return to Profile</button>
           </div>
        </div>
      )}
    </div>
  );
}