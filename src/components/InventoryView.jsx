import React, { useState, useMemo } from 'react';
  import { Package, Trash2, AlertTriangle, Recycle, 
        Gift, Send, X, Box,
        CheckCircle2, Sparkles, Eye, Shield, Sword, 
        Heart, Zap, Target, Flame, ArrowUpCircle, Activity, Search } from 'lucide-react';

  import { getFullItemInfo, salvageItem } from '../utils/inventoryUtils';

export default function InventoryView({ player, setPlayer, setLogs, wrapItemAsCode }) {
  const [selectedItem, setSelectedItem] = useState(null);

  const getRarityColor = (rarity) => {
    switch (rarity) {
      case 'Uncommon': return { text: 'text-emerald-400', border: 'border-emerald-500/30', bg: 'bg-emerald-500', glow: 'shadow-[0_0_20px_rgba(16,185,129,0.2)]' };
      case 'Rare': return { text: 'text-blue-400', border: 'border-blue-500/30', bg: 'bg-blue-500', glow: 'shadow-[0_0_20px_rgba(59,130,246,0.2)]' };
      case 'Epic': return { text: 'text-purple-400', border: 'border-purple-500/30', bg: 'bg-purple-500', glow: 'shadow-[0_0_20px_rgba(168,85,247,0.2)]' };
      case 'Legendary': return { text: 'text-amber-400', border: 'border-amber-500/50', bg: 'bg-amber-500', glow: 'shadow-[0_0_30px_rgba(245,158,11,0.3)]' };
      case 'Mythic': return { text: 'text-red-400', border: 'border-red-500/50', bg: 'bg-red-500', glow: 'shadow-[0_0_30px_rgba(239,68,68,0.3)]' };
      default: return { text: 'text-slate-400', border: 'border-white/10', bg: 'bg-slate-500', glow: '' };
    }
  };

  React.useEffect(() => {
    if (player.inventory && player.inventory.length > 0) {
      console.log("-----------------------------------------");
      console.log(`📦 TOTAL ITEMS IN STATE: ${player.inventory.length}`);
      const ids = player.inventory.map(i => i.instanceId || i.id);
      const duplicates = ids.filter((id, index) => ids.indexOf(id) !== index);
      if (duplicates.length > 0) console.error("🚨 DETECTED DUPLICATE IDs:", duplicates);
      console.log("-----------------------------------------");
    }
  }, [player.inventory]);

  const [filter, setFilter] = useState('ALL');
  const [itemToSalvage, setItemToSalvage] = useState(null);
  const [salvageMode, setSalvageMode] = useState(null);
  const [materialToWrap, setMaterialToWrap] = useState(null); 
  const [wrapAmount, setWrapAmount] = useState('');
  const [giftFeedback, setGiftFeedback] = useState(null);

  const inventoryItems = useMemo(() => {
    const seenIds = new Set();
    return (player.inventory || [])
    .map(item => getFullItemInfo(item))
    .filter(item => {
      if (!item) return false;
      const itemId = item.instanceId || item.id;
      if (seenIds.has(itemId)) return false;
      if (item.type === 'MONSTER_CARD') return false;
      if (!item.name || item.name === 'undefined') return false;
      if (!item.slot) return false;
      seenIds.add(itemId);
      return true;
    })
  }, [player.inventory]);

  const materialItems = useMemo(() => [
    { id: 'scrap', name: 'Scrap', type: 'MATERIAL', icon: '/icon/scrap.png', amount: player.materials?.scrap || 0, color: 'text-orange-400', slot: 'MATERIALS' },
    { id: 'shard', name: 'Shard', type: 'MATERIAL', icon: '/icon/shard.png', amount: player.materials?.shard || 0, color: 'text-emerald-400', slot: 'MATERIALS' },
    { id: 'dust', name: 'Dust', type: 'MATERIAL', icon: '/icon/dust.png', amount: player.materials?.dust || 0, color: 'text-purple-400', slot: 'MATERIALS' },
    { id: 'dragon_soul', name: "Dragon King's Soul", type: 'MATERIAL', icon: '/icon/dragon_king_soul.png', amount: player.materials?.dragon_soul || 0, color: 'text-amber-500', slot: 'MATERIALS' },
    { id: 'obsidian_scale', name: 'Obsidian Scale', type: 'MATERIAL', icon: '/icon/Obsidian_Scale.png', amount: player.materials?.obsidian_scale || 0, color: 'text-slate-400', slot: 'MATERIALS' },
    { id: 'neural_cell', name: 'Neural Cell', type: 'MATERIAL', icon: '🔋', amount: player.materials?.neural_cell || 0, color: 'text-lime-400', slot: 'MATERIALS' },
  ], [player.materials]);

  const filteredItems = useMemo(() => {
    if (filter === 'MATERIALS') return materialItems;
    if (filter === 'ALL') return [...inventoryItems, ...materialItems];
    return inventoryItems.filter(item => item.slot === filter);
  }, [filter, inventoryItems, materialItems]);

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
      const isEquipped = player.equipment?.weapon === invItem.instanceId || player.equipment?.armor === invItem.instanceId || player.equipment?.accessory === invItem.instanceId || player.equipment?.belt === invItem.instanceId || player.equipment?.trinket === invItem.instanceId;
      if (isEquipped || !fullInfo?.slot) return false;
      return mode === 'COMMON' ? fullInfo?.rarity === 'Common' : true;
    });
    if (targets.length === 0) { setSalvageMode(null); return; }
    let totalGains = {}; 
    targets.forEach(item => {
      const result = salvageItem(item);
      if (result.materialType) totalGains[result.materialType] = (totalGains[result.materialType] || 0) + result.amount;
    });
    setPlayer(prev => {
      const newMaterials = { ...prev.materials };
      Object.keys(totalGains).forEach(key => { newMaterials[key] = (newMaterials[key] || 0) + totalGains[key]; });
      return { ...prev, inventory: prev.inventory.filter(invItem => !targets.find(t => t.instanceId === invItem.instanceId)), materials: newMaterials };
    });
    setLogs(prev => [`♻️ ย่อยไอเทม ${targets.length} ชิ้น สำเร็จ!`, ...prev].slice(0, 10));
    setSalvageMode(null);
  };

  return (
    <div className="flex flex-col h-full bg-slate-950 text-slate-200 p-4 space-y-4 relative overflow-hidden font-mono">
      {/* Header Area */}
      <div className="shrink-0 flex justify-between items-end border-b border-white/10 pb-4 relative z-10">
        <div>
          <div className="text-[10px] text-blue-500 font-bold tracking-[0.2em] mb-1">STASH_STORAGE_v4.2</div>
          <h2 className="text-2xl font-black italic uppercase flex items-center gap-3 tracking-tighter">
            <Package className="text-blue-500 animate-pulse" size={24} /> Inventory
          </h2>
        </div>
        <div className="flex flex-wrap justify-end gap-x-3 gap-y-1 text-[9px] font-black italic max-w-[60%]">
          {materialItems.map((m) => (
            <div key={`head-${m.id}`} className="flex items-center gap-1 bg-white/5 px-2 py-0.5 rounded-full border border-white/5">
              <span className={m.color}>{m.amount || 0}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Filters */}
      <div className="shrink-0 flex gap-2 overflow-x-auto no-scrollbar pb-1 relative z-10">
        {['ALL', 'WEAPON', 'ARMOR', 'ACCESSORY', 'BELT', 'TRINKET', 'MATERIALS'].map(type => (
          <button key={type} onClick={() => setFilter(type)} className={`flex-shrink-0 px-4 py-1.5 rounded-sm text-[9px] font-black border transition-all ${filter === type ? 'bg-blue-600 border-blue-400 text-white shadow-[0_0_15px_rgba(37,99,235,0.4)]' : 'bg-slate-900 border-white/10 text-slate-500 hover:border-blue-500/50'}`}>
            {type}
          </button>
        ))}
      </div>

      {/* Mass Actions */}
      {filter !== 'MATERIALS' && (
        <div className="shrink-0 flex gap-2 relative z-10">
          <button onClick={() => setSalvageMode('COMMON')} className="flex-1 py-2 bg-slate-900 border border-orange-500/30 rounded-lg text-[9px] font-black text-orange-400 hover:bg-orange-500/10 transition-colors">CLEAR_COMMON</button>
          <button onClick={() => setSalvageMode('ALL_INVENTORY')} className="flex-1 py-2 bg-slate-900 border border-red-500/30 rounded-lg text-[9px] font-black text-red-500 hover:bg-red-500/10 transition-colors">PURGE_DATABASE</button>
        </div>
      )}

      {/* Main List */}
      <div className="flex-1 overflow-y-auto space-y-2 pr-1 custom-scrollbar relative z-10 min-h-0">
        {filteredItems.map((item, idx) => {
          const isMaterial = item.type === 'MATERIAL';
          const isEquipped = !isMaterial && (player.equipment?.weapon === item.instanceId || player.equipment?.armor === item.instanceId || player.equipment?.accessory === item.instanceId || player.equipment?.belt === item.instanceId || player.equipment?.trinket === item.instanceId);
          const rarityStyles = isMaterial ? 'text-slate-400' : getRarityColor(item.rarity).text;
          const rarityBorder = isMaterial ? 'border-white/5' : getRarityColor(item.rarity).border;
          
          return (
            <div 
              key={isMaterial ? `mat-${item.id}-${idx}` : item.instanceId} 
              onClick={() => !isMaterial && setSelectedItem(item)}
              className={`p-3 rounded-xl border transition-all flex items-center gap-4 cursor-pointer active:scale-[0.98]
                ${isEquipped ? 'border-blue-500 bg-blue-500/10 shadow-[inset_0_0_20px_rgba(59,130,246,0.1)]' : `${rarityBorder} bg-slate-900/40 hover:bg-slate-900/60`}`}
            >
              <div className={`w-14 h-14 flex items-center justify-center rounded-lg bg-black/60 border relative shrink-0 ${isEquipped ? 'border-blue-400' : 'border-white/5 shadow-inner'}`}>
                {typeof item.icon === 'string' && item.icon.startsWith('/') ? (<img src={item.icon} alt={item.name} className="w-full h-full object-contain p-2" />) : (<span className="text-2xl">{item.icon || '📦'}</span>)}
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <h3 className={`font-black text-sm truncate uppercase italic tracking-tighter ${isMaterial ? item.color : rarityStyles}`}>{item.name}</h3>
                  {isEquipped && <span className="text-[7px] bg-blue-500 text-white px-1.5 py-0.5 font-black uppercase italic tracking-tighter">In_Use</span>}
                </div>
                <div className="flex items-center gap-2">
                  <p className="text-[9px] font-bold opacity-40 uppercase tracking-widest">{isMaterial ? `Qty: ${item.amount.toLocaleString()}` : item.rarity}</p>
                  {!isMaterial && <p className="text-[9px] font-bold opacity-40 uppercase tracking-tighter text-blue-400">{item.slot}</p>}
                </div>
              </div>
              
              <div className="flex items-center gap-1.5">
                {/* ✅ แก้ไข: เพิ่ม e.stopPropagation() เพื่อให้กดปุ่มย่อยได้โดยไม่ไปเปิดหน้า Inspect */}
                <button 
                  onClick={(e) => { 
                    e.stopPropagation(); 
                    setGiftFeedback(null); 
                    if(isMaterial) setMaterialToWrap(item); 
                    else setItemToSalvage(item); 
                  }} 
                  disabled={isEquipped || (isMaterial && item.amount <= 0)} 
                  className={`p-2.5 rounded-lg border transition-all active:scale-90
                    ${isMaterial ? 'bg-purple-500/10 border-purple-500/20 text-purple-400' : 'bg-slate-800 border-white/5 text-slate-500 hover:text-red-400'} disabled:opacity-10`} 
                >
                  {isMaterial ? <Gift size={18} /> : <Recycle size={18} />}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Inspect Modal (สเตตัสแบบตอนคราฟเสร็จ) */}
      {selectedItem && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-950/95 backdrop-blur-xl" onClick={() => setSelectedItem(null)} />
          <div className={`relative w-full max-w-sm overflow-hidden bg-slate-900 border-2 rounded-sm p-1 shadow-2xl animate-in zoom-in duration-300 ${getRarityColor(selectedItem.rarity).border} ${getRarityColor(selectedItem.rarity).glow}`}>
            <div className="bg-slate-950/40 p-6 text-center relative overflow-hidden">
                <div className={`absolute top-0 right-0 px-4 py-1 text-[8px] font-black text-black uppercase ${getRarityColor(selectedItem.rarity).bg} opacity-80`}>
                   {selectedItem.rarity} MODULE
                </div>
                <div className="w-24 h-24 bg-black/60 border border-white/10 flex items-center justify-center mx-auto my-6 shadow-inner">
                    <span className="text-6xl drop-shadow-[0_0_15px_rgba(255,255,255,0.4)]">{selectedItem.icon || "📦"}</span>
                </div>
                <h3 className={`text-3xl font-black uppercase italic tracking-tighter mb-1 ${getRarityColor(selectedItem.rarity).text}`}>{selectedItem.name}</h3>
                <div className="text-[10px] font-black opacity-50 uppercase tracking-[0.3em] mb-6">GRADE: +{selectedItem.level || 0} // {selectedItem.slot}</div>

                <div className="space-y-1.5 text-left mb-6">
                   {[
                     { label: 'ATK_POWER', val: selectedItem.atk, bonus: selectedItem.bonusAtk, color: 'text-red-400', icon: <Sword size={14}/> },
                     { label: 'DEF_RATING', val: selectedItem.def, bonus: selectedItem.bonusDef, color: 'text-blue-400', icon: <Shield size={14}/> },
                     { label: 'BIO_INTEGRITY', val: selectedItem.hp, bonus: selectedItem.bonusHp, color: 'text-emerald-400', icon: <Activity size={14}/> }
                   ].map(stat => stat.val > 0 && (
                     <div key={stat.label} className="flex justify-between items-center bg-white/5 p-3 border-l-2 border-white/10">
                        <div className="flex items-center gap-2"><span className={stat.color}>{stat.icon}</span><span className="text-[10px] font-black text-white/70 uppercase tracking-widest">{stat.label}</span></div>
                        <div className="text-right"><span className={`text-lg font-mono font-black ${stat.color}`}>+{stat.val.toLocaleString()}</span>{stat.bonus > 0 && <span className="text-[10px] text-white/30 ml-2 italic">(+{stat.bonus})</span>}</div>
                     </div>
                   ))}
                </div>
                <button onClick={() => setSelectedItem(null)} className="w-full py-4 bg-white text-slate-950 font-black rounded-sm uppercase tracking-[0.2em] text-[10px]">Close_Analysis</button>
            </div>
          </div>
        </div>
      )}

      {/* Material Wrap Modal */}
      {materialToWrap && (
        <div className="fixed inset-0 z-[600] flex items-center justify-center p-6">
          <div className="absolute inset-0 bg-slate-950/95 backdrop-blur-md" onClick={() => { setMaterialToWrap(null); setGiftFeedback(null); }} />
          <div className="relative w-full max-w-[320px] bg-slate-900 border border-purple-500/40 p-1 shadow-2xl animate-in zoom-in-95 rounded-sm">
            <div className="bg-slate-950 p-6">
              {!giftFeedback ? (
                <>
                  <div className="p-4 text-center">
                    <h3 className={`text-xl font-black italic uppercase tracking-tighter ${materialToWrap.color}`}>Wrap_Resource</h3>
                    <p className="text-[9px] font-bold text-slate-500 uppercase mt-1">Package: {materialToWrap.name}</p>
                  </div>
                  <div className="space-y-2 mb-6">
                    <input type="number" value={wrapAmount} onChange={(e) => setWrapAmount(e.target.value)} placeholder={`Limit: ${materialToWrap.amount}`} className="w-full bg-black border-b-2 border-purple-500/50 py-4 px-6 text-center text-3xl font-black text-purple-400 outline-none" />
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => setMaterialToWrap(null)} className="flex-1 py-4 bg-slate-800 text-slate-500 font-black uppercase text-[10px]">Cancel</button>
                    <button onClick={executeWrap} disabled={!wrapAmount || parseInt(wrapAmount) <= 0 || parseInt(wrapAmount) > materialToWrap.amount} className="flex-1 py-4 bg-purple-600 text-white font-black uppercase text-[10px]">Generate</button>
                  </div>
                </>
              ) : (
                <div className="text-center space-y-4 py-4 animate-in zoom-in-95">
                  <CheckCircle2 size={40} className="text-emerald-400 mx-auto animate-bounce" />
                  <button onClick={() => { navigator.clipboard.writeText(giftFeedback.code); setLogs(prev => ["📋 คัดลอกรหัสพัสดุแล้ว!", ...prev].slice(0, 10)); }} className="w-full bg-black p-5 border border-emerald-500/30 break-all rounded-sm"><p className="text-[11px] font-mono text-emerald-500 font-bold">{giftFeedback.code}</p></button>
                  <button onClick={() => { setGiftFeedback(null); setMaterialToWrap(null); }} className="w-full py-4 bg-slate-800 text-white text-[10px] font-black uppercase">Done</button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Equipment Salvage Modal */}
      {itemToSalvage && (
        <div className="fixed inset-0 z-[500] flex items-center justify-center p-6">
          <div className="absolute inset-0 bg-slate-950/95 backdrop-blur-md" onClick={() => { setItemToSalvage(null); setGiftFeedback(null); }} />
          <div className={`relative w-full max-w-[320px] bg-slate-900 border p-1 rounded-sm ${giftFeedback ? 'border-emerald-500/40' : 'border-red-500/40'}`}>
            <div className="bg-slate-950 p-6 text-center">
              {!giftFeedback ? (
                <>
                  <div className={`w-20 h-20 bg-black border flex items-center justify-center text-5xl mx-auto mb-4 relative ${itemToSalvage.isShiny ? 'border-yellow-500' : 'border-white/10'}`}>{itemToSalvage.icon}</div>
                  <p className="text-[11px] font-black uppercase italic text-white mb-6">Analyzing: {itemToSalvage.name}</p>
                  <div className="flex flex-col gap-2">
                    <button onClick={executeWrapEquipment} className="w-full py-4 bg-purple-600 text-white font-black rounded-sm uppercase text-[10px]">Create_Gift</button>
                    <div className="flex gap-2">
                      <button onClick={() => setItemToSalvage(null)} className="flex-1 py-3 bg-slate-800 text-slate-500 font-black rounded-sm uppercase text-[10px]">Abort</button>
                      <button onClick={executeSalvage} className="flex-1 py-3 bg-red-600 text-white font-black rounded-sm uppercase text-[10px]">Salvage</button>
                    </div>
                  </div>
                </>
              ) : (
                <div className="text-center space-y-4 py-4 animate-in zoom-in-95">
                  <CheckCircle2 size={40} className="text-emerald-400 mx-auto animate-bounce" />
                  <button onClick={() => { navigator.clipboard.writeText(giftFeedback.code); setLogs(prev => ["📋 คัดลอกรหัสพัสดุแล้ว!", ...prev].slice(0, 10)); }} className="w-full bg-black p-5 border border-emerald-500/30 break-all transition-all rounded-sm"><p className="text-[11px] font-mono text-emerald-500 font-bold">{giftFeedback.code}</p></button>
                  <button onClick={() => { setGiftFeedback(null); setItemToSalvage(null); }} className="w-full py-4 bg-slate-800 text-white text-[10px] font-black uppercase">Close</button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Mass Salvage Warning */}
      {salvageMode && (
        <div className="fixed inset-0 z-[500] flex items-center justify-center p-6">
          <div className="absolute inset-0 bg-slate-950/98 backdrop-blur-md" onClick={() => setSalvageMode(null)} />
          <div className="relative w-full max-w-[320px] bg-slate-900 border-2 border-red-500/40 rounded-sm p-8 text-center space-y-6 animate-in zoom-in-95">
            <AlertTriangle className="text-red-500 mx-auto" size={48} />
            <h3 className="text-2xl font-black text-white italic uppercase tracking-tighter">{salvageMode === 'COMMON' ? 'Database_Clean' : 'Emergency_Purge'}</h3>
            <button onClick={() => executeMassSalvage(salvageMode)} className="w-full py-4 bg-red-600 text-white font-black rounded-sm uppercase text-[10px]">Confirm_Scrap_Operation</button>
            <button onClick={() => setSalvageMode(null)} className="w-full py-3 bg-slate-800 text-slate-500 font-black rounded-sm uppercase text-[9px]">Cancel_Task</button>
          </div>
        </div>
      )}
    </div>
  );
}