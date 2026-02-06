import React, { useState } from 'react';
import { Package, Trash2, Hammer, Shield, Sword, Gem, Recycle, AlertTriangle, X } from 'lucide-react';
import { getFullItemInfo, salvageItem } from '../utils/inventoryUtils';

export default function InventoryView({ player, setPlayer, setLogs }) {
  const [filter, setFilter] = useState('ALL');
  const [itemToSalvage, setItemToSalvage] = useState(null); // สำหรับย่อยทีละชิ้น
  const [showSalvageAllConfirm, setShowSalvageAllConfirm] = useState(false); // สำหรับย่อยทั้งหมด

  const inventoryItems = (player.inventory || [])
    .map(item => getFullItemInfo(item))
    .filter(item => item !== null);

  const filteredItems = inventoryItems.filter(item => {
    if (filter === 'ALL') return true;
    return item.slot === filter;
  });

  // ✅ Logic สำหรับย่อยไอเทม Common ทั้งหมด (อัปเดตเข้า Key: Scrap, Shard, Dust)
  const executeSalvageAllCommon = () => {
    const commonItems = (player.inventory || []).filter(invItem => {
      const fullInfo = getFullItemInfo(invItem);
      const isEquipped = player.equipment?.weapon === invItem.instanceId || 
                         player.equipment?.armor === invItem.instanceId || 
                         player.equipment?.accessory === invItem.instanceId;
      return fullInfo?.rarity === 'Common' && !isEquipped;
    });

    if (commonItems.length === 0) {
      setShowSalvageAllConfirm(false);
      return;
    }

    let totalGains = { scrap: 0, shard: 0, dust: 0 };
    commonItems.forEach(item => {
      const result = salvageItem(item);
      totalGains[result.materialType] += result.amount;
    });

    setPlayer(prev => ({
      ...prev,
      inventory: prev.inventory.filter(invItem => 
        !commonItems.find(common => common.instanceId === invItem.instanceId)
      ),
      materials: {
        ...prev.materials,
        Scrap: (prev.materials?.Scrap || 0) + totalGains.scrap,
        Shard: (prev.materials?.Shard || 0) + totalGains.shard,
        Dust: (prev.materials?.Dust || 0) + totalGains.dust
      }
    }));

    setLogs(prev => [`♻️ ย่อยไอเทม Common ทั้งหมด ${commonItems.length} ชิ้น ได้รับเศษเหล็ก ${totalGains.scrap}`, ...prev].slice(0, 10));
    setShowSalvageAllConfirm(false);
  };

  // ♻️ Logic การย่อยไอเทม (รายชิ้น - พร้อม Map ชื่อตัวแปร)
  const executeSalvage = () => {
    if (!itemToSalvage) return;
    const result = salvageItem(itemToSalvage);
    
    // ✅ แปลงชื่อตัวแปรจาก Utils ให้เป็นตัวพิมพ์ใหญ่ตาม State
    const materialMap = {
      scrap: 'Scrap',
      shard: 'Shard',
      dust: 'Dust'
    };
    const targetKey = materialMap[result.materialType];

    setPlayer(prev => ({
      ...prev,
      inventory: prev.inventory.filter(i => i.instanceId !== itemToSalvage.instanceId),
      materials: {
        ...prev.materials,
        [targetKey]: (prev.materials?.[targetKey] || 0) + result.amount
      }
    }));

    const materialName = targetKey === 'Scrap' ? 'เศษเหล็ก' : targetKey === 'Shard' ? 'ผลึก' : 'ผงเวทมนตร์';
    setLogs(prev => [`♻️ ย่อย ${itemToSalvage.name} ได้รับ ${result.amount} ${materialName}`, ...prev].slice(0, 10));
    setItemToSalvage(null);
  };

  return (
    <div className="flex flex-col h-full bg-slate-950 text-slate-200 p-4 space-y-4 relative overflow-hidden">
      
      {/* --- ส่วนหัวและทรัพยากร --- */}
      <div className="flex justify-between items-end border-b border-white/10 pb-4">
        <div className="flex flex-col gap-2">
          <h2 className="text-2xl font-black italic uppercase tracking-tighter flex items-center gap-2">
            <Package className="text-amber-500" /> Inventory
          </h2>
          <button 
            onClick={() => setShowSalvageAllConfirm(true)}
            className="flex items-center gap-2 px-3 py-1 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 rounded-lg text-[10px] font-bold text-red-400 transition-all active:scale-95 w-fit"
          >
            <Trash2 size={12} />
            SALVAGE ALL COMMON
          </button>
        </div>
        <div className="flex gap-3 bg-black/40 p-2 rounded-xl border border-white/5">
           {/* ✅ แก้ไขจุดดึงตัวเลข: Scrap, Shard, Dust (พิมพ์ใหญ่ตัวแรก) */}
           <div className="text-center">
             <p className="text-[8px] text-slate-500 font-bold uppercase">Scrap</p>
             <p className="text-xs font-black text-orange-400">{player.materials?.Scrap || 0}</p>
           </div>
           <div className="text-center border-x border-white/10 px-3">
             <p className="text-[8px] text-slate-500 font-bold uppercase">Shard</p>
             <p className="text-xs font-black text-emerald-400">{player.materials?.Shard || 0}</p>
           </div>
           <div className="text-center">
             <p className="text-[8px] text-slate-500 font-bold uppercase">Dust</p>
             <p className="text-xs font-black text-purple-400">{player.materials?.Dust || 0}</p>
           </div>
        </div>
      </div>

      {/* --- Tabs กรองไอเทม (คงเดิม) --- */}
      <div className="flex gap-2">
        {['ALL', 'WEAPON', 'ARMOR', 'ACCESSORY'].map(type => (
          <button key={type} onClick={() => setFilter(type)} className={`px-4 py-1.5 rounded-full text-[10px] font-black border transition-all ${filter === type ? 'bg-amber-500 border-amber-500 text-slate-900 shadow-[0_0_15px_rgba(245,158,11,0.3)]' : 'bg-slate-900 border-white/10 text-slate-400'}`}>{type}</button>
        ))}
      </div>

      {/* --- รายการไอเทม (คงเดิม) --- */}
      <div className="flex-1 overflow-y-auto space-y-2 pr-1 custom-scrollbar">
        {filteredItems.map((item) => {
          const isEquipped = player.equipment?.weapon === item.instanceId || player.equipment?.armor === item.instanceId || player.equipment?.accessory === item.instanceId;
          return (
            <div key={item.instanceId} className="group relative p-3 rounded-2xl border border-white/5 bg-slate-900/40 hover:bg-slate-900/80 transition-all">
              <div className="flex items-center gap-4">
                <div className="text-3xl bg-black/40 w-12 h-12 flex items-center justify-center rounded-xl border border-white/5">{item.icon}</div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-black text-sm">{item.name} {item.level > 0 && `+${item.level}`}</h3>
                    {isEquipped && <span className="text-[8px] bg-blue-500 text-white px-1.5 rounded font-black uppercase">Equipped</span>}
                  </div>
                  <div className="flex gap-3 mt-1 text-[9px] font-bold">
                    {item.totalAtk > 0 && <span className="text-orange-400">ATK {item.totalAtk}</span>}
                    {item.totalDef > 0 && <span className="text-emerald-400">DEF {item.totalDef}</span>}
                    {item.totalMaxHp > 0 && <span className="text-blue-400">HP {item.totalMaxHp}</span>}
                  </div>
                </div>
                {!isEquipped && (
                  <button onClick={() => setItemToSalvage(item)} className="flex flex-col items-center justify-center gap-1 p-2 bg-red-500/10 hover:bg-red-500/30 border border-red-500/20 hover:border-red-500/50 text-red-400 rounded-xl transition-all active:scale-90">
                    <Recycle size={16} className="animate-spin-slow" />
                    <span className="text-[7px] font-black uppercase">Salvage</span>
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* --- ✨ Salvage One Item Popup (คงเดิม) --- */}
      {itemToSalvage && (
        <div className="absolute inset-0 z-[200] flex items-center justify-center p-6 animate-in fade-in duration-200">
          <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm" onClick={() => setItemToSalvage(null)} />
          <div className="relative w-full max-w-[300px] bg-slate-900 border-2 border-red-500/30 rounded-[2rem] overflow-hidden shadow-[0_0_50px_rgba(239,68,68,0.25)]">
            <div className="bg-gradient-to-b from-red-500/20 to-transparent p-6 text-center">
              <div className="inline-flex p-3 bg-red-500 rounded-2xl mb-3 shadow-lg shadow-red-500/20"><Recycle className="text-white animate-spin-slow" size={24} /></div>
              <h3 className="text-xl font-black text-white italic uppercase tracking-tight">Salvage Item?</h3>
              <p className="text-red-400/60 text-[8px] font-bold uppercase tracking-widest mt-1">This action cannot be undone</p>
            </div>
            <div className="px-6 pb-6 space-y-4">
              <div className="bg-black/40 rounded-2xl p-3 border border-white/5 flex items-center gap-3">
                <span className="text-2xl">{itemToSalvage.icon}</span>
                <div className="text-left">
                  <p className="text-xs font-black text-white">{itemToSalvage.name} +{itemToSalvage.level}</p>
                  <p className="text-[8px] text-slate-500 font-bold uppercase">{itemToSalvage.rarity} Item</p>
                </div>
              </div>
              <div className="flex gap-2">
                <button onClick={() => setItemToSalvage(null)} className="flex-1 py-3 bg-slate-800 hover:bg-slate-700 text-slate-300 font-black rounded-xl uppercase text-[10px] transition-all">Cancel</button>
                <button onClick={executeSalvage} className="flex-[2] py-3 bg-gradient-to-r from-red-600 to-red-500 hover:from-red-500 hover:to-red-400 text-white font-black rounded-xl uppercase text-[10px] shadow-lg shadow-red-500/20 active:scale-95 transition-all">Confirm Salvage</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* --- ✨ Salvage ALL COMMON Confirmation Popup (คงเดิม) --- */}
      {showSalvageAllConfirm && (
        <div className="absolute inset-0 z-[201] flex items-center justify-center p-6 animate-in fade-in zoom-in duration-200">
          <div className="absolute inset-0 bg-slate-950/90 backdrop-blur-sm" onClick={() => setShowSalvageAllConfirm(false)} />
          <div className="relative w-full max-w-[320px] bg-slate-900 border-2 border-orange-500/40 rounded-[2.5rem] overflow-hidden shadow-[0_0_60px_rgba(239,68,68,0.25)]">
            <div className="bg-gradient-to-b from-orange-500/20 to-transparent p-8 text-center">
              <div className="inline-flex p-4 bg-orange-600 rounded-full mb-4 shadow-xl"><Trash2 className="text-white" size={28} /></div>
              <h3 className="text-2xl font-black text-white italic uppercase tracking-tighter leading-tight">Salvage All<br/>Common Items?</h3>
              <p className="text-orange-400 text-[9px] font-black uppercase tracking-widest mt-3 px-4">ระบบจะย่อยไอเทมระดับทั่วไปทั้งหมดที่ไม่ได้สวมใส่อยู่</p>
            </div>
            <div className="px-8 pb-8 flex flex-col gap-3">
              <button onClick={executeSalvageAllCommon} className="w-full py-4 bg-gradient-to-r from-orange-600 to-red-600 text-white font-black rounded-2xl uppercase text-xs shadow-lg shadow-orange-500/20 active:scale-95 transition-all">
                YES, SCRAP THEM ALL!
              </button>
              <button onClick={() => setShowSalvageAllConfirm(false)} className="w-full py-3 bg-slate-800 text-slate-400 font-black rounded-xl uppercase text-[10px] transition-all">
                NOT NOW
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}