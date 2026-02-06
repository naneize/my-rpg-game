import React, { useState } from 'react';
import { Package, Trash2, Hammer, Shield, Sword, Gem, Recycle, AlertTriangle, X } from 'lucide-react';
import { getFullItemInfo, salvageItem } from '../utils/inventoryUtils';

export default function InventoryView({ player, setPlayer, setLogs }) {
  const [filter, setFilter] = useState('ALL');
  const [itemToSalvage, setItemToSalvage] = useState(null);
  const [salvageMode, setSalvageMode] = useState(null); // 'COMMON' หรือ 'ALL_INVENTORY'

  const inventoryItems = (player.inventory || [])
    .map(item => getFullItemInfo(item))
    .filter(item => item !== null);

  const filteredItems = inventoryItems.filter(item => {
    if (filter === 'ALL') return true;
    return item.slot === filter;
  });

  // ✅ Logic สำหรับย่อยไอเทม (แบบกลุ่ม)
  const executeMassSalvage = (mode) => {
    const targets = (player.inventory || []).filter(invItem => {
      const fullInfo = getFullItemInfo(invItem);
      const isEquipped = player.equipment?.weapon === invItem.instanceId || 
                         player.equipment?.armor === invItem.instanceId || 
                         player.equipment?.accessory === invItem.instanceId;
      
      if (isEquipped) return false;
      if (mode === 'COMMON') return fullInfo?.rarity === 'Common';
      return true; // ย่อยทั้งหมดถ้าโหมดไม่ใช่ Common
    });

    if (targets.length === 0) {
      setSalvageMode(null);
      return;
    }

    let totalGains = { scrap: 0, crystal: 0, magicDust: 0 };
    targets.forEach(item => {
      const result = salvageItem(item);
      const keyMap = { scrap: 'scrap', shard: 'crystal', dust: 'magicDust' };
      totalGains[keyMap[result.materialType]] += result.amount;
    });

    setPlayer(prev => ({
      ...prev,
      inventory: prev.inventory.filter(invItem => 
        !targets.find(t => t.instanceId === invItem.instanceId)
      ),
      materials: {
        ...prev.materials,
        scrap: (prev.materials?.scrap || 0) + totalGains.scrap,
        crystal: (prev.materials?.crystal || 0) + totalGains.crystal,
        magicDust: (prev.materials?.magicDust || 0) + totalGains.magicDust
      }
    }));

    setLogs(prev => [`♻️ ย่อยไอเทม ${targets.length} ชิ้น ได้รับวัตถุดิบจำนวนมาก!`, ...prev].slice(0, 10));
    setSalvageMode(null);
  };

  // ♻️ Logic การย่อยไอเทมรายชิ้น
  const executeSalvage = () => {
    if (!itemToSalvage) return;
    const result = salvageItem(itemToSalvage);
    const materialMap = { scrap: 'scrap', shard: 'crystal', dust: 'magicDust' };
    const targetKey = materialMap[result.materialType];

    setPlayer(prev => ({
      ...prev,
      inventory: prev.inventory.filter(i => i.instanceId !== itemToSalvage.instanceId),
      materials: {
        ...prev.materials,
        [targetKey]: (prev.materials?.[targetKey] || 0) + result.amount
      }
    }));

    setLogs(prev => [`♻️ ย่อย ${itemToSalvage.name} สำเร็จ!`, ...prev].slice(0, 10));
    setItemToSalvage(null);
  };

  return (
    <div className="flex flex-col h-full bg-slate-950 text-slate-200 p-4 space-y-4 relative overflow-hidden pb-20 md:pb-4">
      
      {/* --- Header & Resources --- */}
      <div className="flex flex-col gap-4 border-b border-white/10 pb-4">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-black italic uppercase tracking-tighter flex items-center gap-2">
            <Package className="text-amber-500" size={20} /> Inventory
          </h2>
          <div className="flex gap-2 bg-black/40 p-2 rounded-xl border border-white/5 scale-90 origin-right">
             <div className="text-center px-1">
               <p className="text-[7px] text-slate-500 font-bold uppercase italic leading-none">Scrap</p>
               <p className="text-xs font-black text-orange-400">{player.materials?.scrap || 0}</p>
             </div>
             <div className="text-center border-x border-white/10 px-2">
               <p className="text-[7px] text-slate-500 font-bold uppercase italic leading-none">Crystal</p>
               <p className="text-xs font-black text-emerald-400">{player.materials?.crystal || 0}</p>
             </div>
             <div className="text-center px-1">
               <p className="text-[7px] text-slate-500 font-bold uppercase italic leading-none">M.Dust</p>
               <p className="text-xs font-black text-purple-400">{player.materials?.magicDust || 0}</p>
             </div>
          </div>
        </div>

        {/* --- Multi-Salvage Buttons --- */}
        <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
          <button 
            onClick={() => setSalvageMode('COMMON')}
            className="flex-shrink-0 flex items-center gap-2 px-3 py-2 bg-orange-500/10 hover:bg-orange-500/20 border border-orange-500/20 rounded-xl text-[9px] font-black text-orange-400 transition-all active:scale-95"
          >
            <Trash2 size={12} /> CLEAN COMMON
          </button>
          <button 
            onClick={() => setSalvageMode('ALL_INVENTORY')}
            className="flex-shrink-0 flex items-center gap-2 px-3 py-2 bg-red-600/20 hover:bg-red-600/30 border border-red-500/30 rounded-xl text-[9px] font-black text-red-500 transition-all active:scale-95"
          >
            <AlertTriangle size={12} /> PURGE ALL
          </button>
        </div>
      </div>

      {/* --- Filter Tabs --- */}
      <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
        {['ALL', 'WEAPON', 'ARMOR', 'ACCESSORY'].map(type => (
          <button key={type} onClick={() => setFilter(type)} className={`flex-shrink-0 px-4 py-1.5 rounded-full text-[9px] font-black border transition-all ${filter === type ? 'bg-amber-500 border-amber-500 text-slate-900 shadow-lg shadow-amber-500/20' : 'bg-slate-900 border-white/10 text-slate-400'}`}>{type}</button>
        ))}
      </div>

      {/* --- Item List --- */}
      <div className="flex-1 overflow-y-auto space-y-2 pr-1 custom-scrollbar">
        {filteredItems.map((item) => {
          const isEquipped = player.equipment?.weapon === item.instanceId || player.equipment?.armor === item.instanceId || player.equipment?.accessory === item.instanceId;
          return (
            <div key={item.instanceId} className="relative p-3 rounded-2xl border border-white/5 bg-slate-900/40">
              <div className="flex items-center gap-3 sm:gap-4">
                <div className="text-3xl bg-black/40 w-12 h-12 flex items-center justify-center rounded-xl border border-white/5">{item.icon}</div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="font-black text-xs sm:text-sm truncate">{item.name}</h3>
                    {isEquipped && <span className="text-[7px] bg-blue-500 text-white px-1.5 py-0.5 rounded font-black uppercase italic">Equipped</span>}
                  </div>
                  <div className="flex gap-2 mt-1 text-[8px] font-bold opacity-70">
                    {item.totalAtk > 0 && <span className="text-orange-400">ATK {item.totalAtk}</span>}
                    {item.totalDef > 0 && <span className="text-emerald-400">DEF {item.totalDef}</span>}
                    {item.totalMaxHp > 0 && <span className="text-blue-400">HP {item.totalMaxHp}</span>}
                  </div>
                </div>
                {!isEquipped && (
                  <button 
                    onClick={() => setItemToSalvage(item)} 
                    className="p-3 bg-red-500/10 text-red-400 rounded-xl border border-red-500/20 active:scale-90 transition-transform flex-shrink-0"
                  >
                    <Recycle size={18} />
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* --- Individual Salvage Popup --- */}
      {itemToSalvage && (
        <div className="fixed inset-0 z-[500] flex items-center justify-center p-6">
          <div className="absolute inset-0 bg-slate-950/90 backdrop-blur-sm" onClick={() => setItemToSalvage(null)} />
          <div className="relative w-full max-w-[300px] bg-slate-900 border-2 border-red-500/30 rounded-[2.5rem] overflow-hidden">
            <div className="bg-gradient-to-b from-red-500/20 to-transparent p-6 text-center">
              <Recycle className="text-red-500 mx-auto mb-3" size={32} />
              <h3 className="text-xl font-black text-white uppercase italic">Salvage Item?</h3>
              <p className="text-[9px] text-red-400/60 font-bold mt-1 italic uppercase tracking-widest">การดำเนินการนี้ย้อนกลับไม่ได้</p>
            </div>
            <div className="p-6 pt-0 space-y-4 text-center">
              <span className="text-4xl block">{itemToSalvage.icon}</span>
              <p className="text-xs font-black text-white uppercase">{itemToSalvage.name}</p>
              <div className="flex gap-2">
                <button onClick={() => setItemToSalvage(null)} className="flex-1 py-3 bg-slate-800 text-slate-400 font-black rounded-xl uppercase text-[10px]">Cancel</button>
                <button onClick={executeSalvage} className="flex-1 py-3 bg-red-500 text-white font-black rounded-xl uppercase text-[10px]">Salvage</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* --- Mass Salvage Confirmation --- */}
      {salvageMode && (
        <div className="fixed inset-0 z-[500] flex items-center justify-center p-6">
          <div className="absolute inset-0 bg-slate-950/95 backdrop-blur-md" onClick={() => setSalvageMode(null)} />
          <div className="relative w-full max-w-[320px] bg-slate-900 border-2 border-orange-500/40 rounded-[3rem] overflow-hidden shadow-2xl">
            <div className="bg-gradient-to-b from-orange-500/20 to-transparent p-8 text-center">
              <Trash2 className="text-white mx-auto mb-4" size={40} />
              <h3 className="text-2xl font-black text-white italic uppercase leading-none">
                {salvageMode === 'COMMON' ? 'Clean Common' : 'Purge All'}
              </h3>
              <p className="text-orange-400 text-[10px] font-black uppercase mt-4 italic">
                {salvageMode === 'COMMON' ? 'ย่อยไอเทมขาวทั้งหมดที่ไม่ได้ใส่' : 'ย่อยไอเทมทุกอย่างในกระเป๋าที่ไม่ได้ใส่'}
              </p>
            </div>
            <div className="px-8 pb-8 flex flex-col gap-3">
              <button 
                onClick={() => executeMassSalvage(salvageMode)} 
                className="w-full py-4 bg-gradient-to-r from-orange-600 to-red-600 text-white font-black rounded-2xl uppercase text-xs shadow-lg shadow-orange-500/20 active:scale-95"
              >
                YES, SCRAP IT!
              </button>
              <button 
                onClick={() => setSalvageMode(null)} 
                className="w-full py-3 bg-slate-800 text-slate-400 font-black rounded-xl uppercase text-[10px]"
              >
                NOT NOW
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}