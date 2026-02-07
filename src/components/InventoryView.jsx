import React, { useState } from 'react';
import { Package, Trash2, AlertTriangle, Recycle, Gift, Send, X, Box, CheckCircle2 } from 'lucide-react';
import { getFullItemInfo, salvageItem } from '../utils/inventoryUtils';

export default function InventoryView({ player, setPlayer, setLogs, wrapItemAsCode }) {
  const [filter, setFilter] = useState('ALL');
  const [itemToSalvage, setItemToSalvage] = useState(null);
  const [salvageMode, setSalvageMode] = useState(null);
  
  // ✅ State สำหรับระบบ Gift
  const [materialToWrap, setMaterialToWrap] = useState(null); 
  const [wrapAmount, setWrapAmount] = useState('');
  const [giftFeedback, setGiftFeedback] = useState(null); // { success, code }

  // 📦 จัดเตรียมข้อมูลไอเทม (Equipment & Skills)
  const inventoryItems = (player.inventory || [])
    .map(item => getFullItemInfo(item))
    .filter(item => item !== null);

  // 💎 จัดเตรียมข้อมูลแร่ (Materials)
  const materialItems = [
    { id: 'scrap', name: 'Scrap', type: 'MATERIAL', icon: '/icon/scrap.png', amount: player.materials?.scrap || 0, color: 'text-orange-400', slot: 'MATERIALS' },
    { id: 'shard', name: 'Shard', type: 'MATERIAL', icon: '/icon/shard.png', amount: player.materials?.shard || 0, color: 'text-emerald-400', slot: 'MATERIALS' },
    { id: 'dust', name: 'Dust', type: 'MATERIAL', icon: '/icon/dust.png', amount: player.materials?.dust || 0, color: 'text-purple-400', slot: 'MATERIALS' },
    { id: 'dragon_soul', name: "Dragon King's Soul", type: 'MATERIAL', icon: '/icon/dragon_king_soul.png', amount: player.materials?.dragon_soul || 0, color: 'text-amber-500', slot: 'MATERIALS' },
    { id: 'obsidian_scale', name: 'Obsidian Scale', type: 'MATERIAL', icon: '/icon/Obsidian_Scale.png', amount: player.materials?.obsidian_scale || 0, color: 'text-slate-400', slot: 'MATERIALS' },
  ];

  const allDisplayItems = [...inventoryItems, ...materialItems];
  const filteredItems = allDisplayItems.filter(item => {
    if (filter === 'ALL') return true;
    return item.slot === filter;
  });

  const executeWrap = () => {
    const numAmount = parseInt(wrapAmount);
    if (isNaN(numAmount) || numAmount <= 0 || numAmount > materialToWrap.amount) return;
    const code = wrapItemAsCode('MATERIAL', { id: materialToWrap.id, name: materialToWrap.name, amount: numAmount });
    if (code) {
      try { navigator.clipboard.writeText(code); } catch(e) {}
      setGiftFeedback({ success: true, code: code });
      setWrapAmount('');
      setLogs(prev => [`📋 สร้างรหัสพัสดุ ${materialToWrap.name} จำนวน ${numAmount} แล้ว!`, ...prev].slice(0, 10));
    }
  };

  const executeWrapEquipment = () => {
    if (!itemToSalvage) return;
    const code = wrapItemAsCode('EQUIPMENT', itemToSalvage);
    if (code) {
      try { navigator.clipboard.writeText(code); } catch(e) {}
      setGiftFeedback({ success: true, code: code });
      setLogs(prev => [`🎁 ห่อ ${itemToSalvage.name} สำเร็จ!`, ...prev].slice(0, 10));
    }
  };

  const executeSalvage = () => {
    if (!itemToSalvage) return;
    const result = salvageItem(itemToSalvage);
    const targetKey = result.materialType; 
    if (!targetKey) return;
    setPlayer(prev => ({
      ...prev,
      inventory: prev.inventory.filter(i => i.instanceId !== itemToSalvage.instanceId),
      materials: { ...prev.materials, [targetKey]: (prev.materials?.[targetKey] || 0) + result.amount }
    }));
    setLogs(prev => [`♻️ ย่อย ${itemToSalvage.name} ได้รับ ${result.amount} ${targetKey}!`, ...prev].slice(0, 10));
    setItemToSalvage(null);
  };

  const executeMassSalvage = (mode) => {
    const targets = (player.inventory || []).filter(invItem => {
      const fullInfo = getFullItemInfo(invItem);
      const isEquipped = player.equipment?.weapon === invItem.instanceId || player.equipment?.armor === invItem.instanceId || player.equipment?.accessory === invItem.instanceId;
      if (isEquipped) return false;
      return mode === 'COMMON' ? fullInfo?.rarity === 'Common' : true;
    });
    if (targets.length === 0) { setSalvageMode(null); return; }
    let totalGains = {}; 
    targets.forEach(item => {
      const result = salvageItem(item);
      if (result.materialType) {
        totalGains[result.materialType] = (totalGains[result.materialType] || 0) + result.amount;
      }
    });
    setPlayer(prev => {
      const newMaterials = { ...prev.materials };
      Object.keys(totalGains).forEach(key => { newMaterials[key] = (newMaterials[key] || 0) + totalGains[key]; });
      return {
        ...prev,
        inventory: prev.inventory.filter(invItem => !targets.find(t => t.instanceId === invItem.instanceId)),
        materials: newMaterials
      };
    });
    setLogs(prev => [`♻️ ย่อยไอเทม ${targets.length} ชิ้น สำเร็จ!`, ...prev].slice(0, 10));
    setSalvageMode(null);
  };

  return (
    <div className="flex flex-col h-full bg-slate-950 text-slate-200 p-4 space-y-4 relative overflow-hidden pb-20 md:pb-4">
      {/* Header */}
      <div className="flex justify-between items-center border-b border-white/10 pb-4">
        <h2 className="text-xl font-black italic uppercase flex items-center gap-2">
          <Package className="text-amber-500" size={20} /> Inventory
        </h2>
        <div className="flex flex-wrap justify-end gap-x-2 gap-y-1 text-[8px] font-black italic max-w-[65%]">
          {materialItems.map((m) => (
            <div key={`head-${m.id}`} className="flex items-center gap-0.5">
              <img src={m.icon} alt="" className="w-2.5 h-2.5 object-contain" />
              <span className={m.color}>{m.amount || 0}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
        {['ALL', 'WEAPON', 'ARMOR', 'ACCESSORY', 'MATERIALS'].map(type => (
          <button key={type} onClick={() => setFilter(type)} className={`flex-shrink-0 px-4 py-1.5 rounded-full text-[9px] font-black border transition-all ${filter === type ? 'bg-amber-500 border-amber-500 text-slate-900 shadow-lg' : 'bg-slate-900 border-white/10 text-slate-400'}`}>{type}</button>
        ))}
      </div>

      {/* Mass Actions */}
      {filter !== 'MATERIALS' && (
        <div className="flex gap-2">
          <button onClick={() => setSalvageMode('COMMON')} className="flex-1 flex items-center justify-center gap-2 py-2 bg-orange-500/10 border border-orange-500/20 rounded-xl text-[8px] font-black text-orange-400"><Trash2 size={12} /> CLEAN COMMON</button>
          <button onClick={() => setSalvageMode('ALL_INVENTORY')} className="flex-1 flex items-center justify-center gap-2 py-2 bg-red-600/20 border border-red-500/30 rounded-xl text-[8px] font-black text-red-500"><AlertTriangle size={12} /> PURGE ALL</button>
        </div>
      )}

      {/* Display List */}
      <div className="flex-1 overflow-y-auto space-y-2 pr-1 custom-scrollbar">
        {filteredItems.length > 0 ? filteredItems.map((item, idx) => {
          const isMaterial = item.type === 'MATERIAL';
          const isEquipped = !isMaterial && (player.equipment?.weapon === item.instanceId || player.equipment?.armor === item.instanceId || player.equipment?.accessory === item.instanceId);
          
          return (
            <div key={isMaterial ? `mat-${item.id}-${idx}` : item.instanceId} className="p-3 rounded-2xl border border-white/5 bg-slate-900/40 flex items-center gap-4 transition-all hover:bg-slate-900/60 shadow-sm">
              <div className="w-12 h-12 flex items-center justify-center rounded-xl bg-black/40 border border-white/5 shadow-inner overflow-hidden shrink-0">
                {typeof item.icon === 'string' && item.icon.startsWith('/') ? (
                  <img src={item.icon} alt={item.name} className="w-full h-full object-contain p-1.5 drop-shadow-[0_0_8px_rgba(255,255,255,0.1)]" />
                ) : (
                  <span className="text-2xl">{item.icon || '📦'}</span>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h3 className={`font-black text-sm truncate ${isMaterial ? item.color : 'text-white'}`}>{item.name}</h3>
                  {isEquipped && <span className="text-[7px] bg-blue-500 text-white px-1.5 py-0.5 rounded font-black uppercase italic animate-pulse">Equipped</span>}
                </div>
                <p className="text-[10px] font-bold opacity-50 uppercase italic">{isMaterial ? `Stock: ${item.amount.toLocaleString()}` : item.rarity}</p>
              </div>
              <button onClick={() => { setGiftFeedback(null); if(isMaterial) setMaterialToWrap(item); else setItemToSalvage(item); }} disabled={isEquipped || (isMaterial && item.amount <= 0)} className={`p-3 rounded-xl border active:scale-90 transition-all ${isMaterial ? 'bg-purple-500/10 border-purple-500/20 text-purple-400 hover:bg-purple-500/30' : 'bg-white/5 border-white/5 text-slate-400 hover:text-red-400 hover:bg-red-500/10'} disabled:opacity-20`} >
                {isMaterial ? <Gift size={18} /> : <Recycle size={18} />}
              </button>
            </div>
          )
        }) : (
          <div className="py-20 text-center opacity-20 italic text-xs uppercase font-black tracking-widest">Inventory Empty</div>
        )}
      </div>

      {/* 🎁 MODAL: MATERIAL WRAPPING */}
      {materialToWrap && (
        <div className="fixed inset-0 z-[600] flex items-center justify-center p-6">
          <div className="absolute inset-0 bg-slate-950/90 backdrop-blur-md" onClick={() => { setMaterialToWrap(null); setGiftFeedback(null); }} />
          <div className="relative w-full max-w-[320px] bg-slate-900 border-2 border-purple-500/30 rounded-[2.5rem] overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="p-6 text-center bg-gradient-to-b from-purple-500/20 to-transparent">
              <div className="w-16 h-16 bg-black/40 rounded-2xl border border-white/10 flex items-center justify-center mx-auto mb-4 overflow-hidden">
                {typeof materialToWrap.icon === 'string' && materialToWrap.icon.startsWith('/') ? (
                  <img src={materialToWrap.icon} alt="" className="w-10 h-10 object-contain" />
                ) : (
                  <span className="text-4xl">{materialToWrap.icon}</span>
                )}
              </div>
              <h3 className={`text-xl font-black italic uppercase ${materialToWrap.color}`}>Wrap {materialToWrap.name}</h3>
            </div>
            <div className="p-8 pt-2 space-y-6">
              {!giftFeedback ? (
                <>
                  <div className="space-y-2">
                    <div className="flex justify-between text-[10px] font-black uppercase italic text-slate-500"><span>ระบุจำนวน</span><span>สูงสุด: {materialToWrap.amount}</span></div>
                    <input type="number" value={wrapAmount} onChange={(e) => setWrapAmount(e.target.value)} placeholder="0" className="w-full bg-black/40 border-2 border-white/5 rounded-2xl py-4 px-6 text-center text-2xl font-black text-purple-400 outline-none focus:border-purple-500/50 transition-colors" />
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => setMaterialToWrap(null)} className="flex-1 py-4 bg-slate-800 text-slate-400 font-black rounded-2xl uppercase text-[10px]">Cancel</button>
                    <button onClick={executeWrap} disabled={!wrapAmount || parseInt(wrapAmount) <= 0 || parseInt(wrapAmount) > materialToWrap.amount} className="flex-1 py-4 bg-purple-600 text-white font-black rounded-2xl uppercase text-[10px] active:scale-95 transition-all shadow-lg shadow-purple-600/20">Create Gift</button>
                  </div>
                </>
              ) : (
                <div className="text-center space-y-4 py-4 animate-in zoom-in-95">
                  <CheckCircle2 size={40} className="text-emerald-400 mx-auto animate-bounce" />
                  <p className="font-black text-xs uppercase text-emerald-400 italic">ห่อสำเร็จ!</p>
                  <button onClick={() => { navigator.clipboard.writeText(giftFeedback.code); setLogs(prev => ["📋 คัดลอกรหัสพัสดุแล้ว!", ...prev].slice(0, 10)); }} className="w-full bg-black/60 p-4 rounded-2xl border border-emerald-500/20 break-all active:bg-emerald-500/10 active:scale-95 transition-all group">
                    <p className="text-[8px] text-slate-500 font-black uppercase italic mb-2">Gift Code (จิ้มเพื่อคัดลอก):</p>
                    <p className="text-[10px] font-mono text-emerald-500 font-bold">{giftFeedback.code}</p>
                    <p className="mt-2 text-[7px] text-emerald-500/50 font-bold uppercase tracking-widest italic">TAP TO COPY</p>
                  </button>
                  <button onClick={() => { setGiftFeedback(null); setMaterialToWrap(null); }} className="w-full py-3 bg-slate-800 text-white text-[10px] font-black uppercase rounded-xl">Done</button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ⚔️ MODAL: EQUIPMENT MANAGEMENT */}
      {itemToSalvage && (
        <div className="fixed inset-0 z-[500] flex items-center justify-center p-6">
          <div className="absolute inset-0 bg-slate-950/90 backdrop-blur-sm" onClick={() => { setItemToSalvage(null); setGiftFeedback(null); }} />
          <div className="relative w-full max-w-[320px] bg-slate-900 border-2 border-red-500/30 rounded-[2.5rem] overflow-hidden shadow-2xl animate-in zoom-in-95">
            <div className={`p-6 text-center bg-gradient-to-b ${giftFeedback ? 'from-emerald-500/20' : 'from-red-500/20'} to-transparent`}>
              {!giftFeedback ? (
                <>
                  <div className="w-16 h-16 bg-black/40 rounded-2xl border border-white/10 flex items-center justify-center text-4xl mx-auto mb-2 shadow-xl">{itemToSalvage.icon}</div>
                  <p className="text-xs font-black text-white uppercase italic">{itemToSalvage.name}</p>
                </>
              ) : (
                <div className="flex flex-col items-center gap-2 text-emerald-400 py-4">
                  <CheckCircle2 size={40} className="animate-bounce" />
                  <h3 className="text-xl font-black uppercase italic">Wrap Success!</h3>
                </div>
              )}
            </div>
            <div className="p-6 pt-0 space-y-4">
              {!giftFeedback ? (
                <div className="flex flex-col gap-2">
                  <button onClick={executeWrapEquipment} className="w-full py-4 bg-purple-600 hover:bg-purple-500 text-white font-black rounded-2xl uppercase text-[10px] flex items-center justify-center gap-2 shadow-lg shadow-purple-600/20 active:scale-95 transition-all">
                    <Gift size={14} /> Create Gift (Wrap)
                  </button>
                  <div className="flex gap-2">
                    <button onClick={() => setItemToSalvage(null)} className="flex-1 py-3 bg-slate-800 text-slate-400 font-black rounded-xl uppercase text-[10px]">Cancel</button>
                    <button onClick={executeSalvage} className="flex-1 py-3 bg-red-600 hover:bg-red-500 text-white font-black rounded-xl uppercase text-[10px]">Salvage</button>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                   <button onClick={() => { navigator.clipboard.writeText(giftFeedback.code); setLogs(prev => ["📋 คัดลอกรหัสพัสดุแล้ว!", ...prev].slice(0, 10)); }} className="w-full bg-black/60 p-4 rounded-2xl border border-emerald-500/20 break-all active:bg-emerald-500/10 active:scale-95 transition-all group">
                    <p className="text-[8px] text-slate-500 font-black uppercase italic mb-2">Gift Code:</p>
                    <p className="text-[10px] font-mono text-emerald-500 font-bold">{giftFeedback.code}</p>
                    <p className="mt-2 text-[7px] text-emerald-500/50 font-bold uppercase tracking-widest italic">TAP TO COPY</p>
                  </button>
                  <button onClick={() => { setGiftFeedback(null); setItemToSalvage(null); }} className="w-full py-3 bg-slate-800 text-white text-[10px] font-black uppercase rounded-xl">Done</button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Mass Salvage Modal */}
      {salvageMode && (
        <div className="fixed inset-0 z-[500] flex items-center justify-center p-6">
          <div className="absolute inset-0 bg-slate-950/95 backdrop-blur-sm" onClick={() => setSalvageMode(null)} />
          <div className="relative w-full max-w-[320px] bg-slate-900 border-2 border-orange-500/40 rounded-[3rem] overflow-hidden shadow-2xl p-8 text-center space-y-6 animate-in fade-in zoom-in-95">
            <Trash2 className="text-white mx-auto animate-pulse" size={40} />
            <h3 className="text-2xl font-black text-white italic uppercase">{salvageMode === 'COMMON' ? 'Clean Common' : 'Purge All'}</h3>
            <p className="text-[10px] text-slate-500 font-bold uppercase italic">คุณแน่ใจหรือไม่? การกระทำนี้ไม่สามารถย้อนกลับได้</p>
            <button onClick={() => executeMassSalvage(salvageMode)} className="w-full py-4 bg-gradient-to-r from-orange-600 to-red-600 text-white font-black rounded-2xl uppercase text-xs active:scale-95 transition-all shadow-lg shadow-red-600/20">YES, SCRAP IT!</button>
            <button onClick={() => setSalvageMode(null)} className="w-full py-3 bg-slate-800 text-slate-400 font-black rounded-xl uppercase text-[10px]">NOT NOW</button>
          </div>
        </div>
      )}
    </div>
  );
}