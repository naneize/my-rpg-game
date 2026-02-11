import React, { useState, useMemo } from 'react';
import { X, Tag, CheckCircle2, AlertTriangle, Shield, Sword, Box, ChevronDown, Coins, Database, Activity, Cpu } from 'lucide-react';
import { itemMaster } from '../data/itemData';
import { EQUIPMENTS } from '../data/equipments'; 

export default function MarketPostModal({ inventory, onConfirm, onClose, player }) {
  const [selectedItemId, setSelectedItemId] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(null); 
  const [want, setWant] = useState(''); 
  const [currency, setCurrency] = useState('SCRAP'); 
  const [sellCount, setSellCount] = useState(1); 
  const [desc, setDesc] = useState('');
  const [error, setError] = useState('');

  // 📚 1. สร้าง Dictionary รวมข้อมูล - คงเดิม
  const masterData = useMemo(() => {
    const dataMap = { ...itemMaster }; 
    if (Array.isArray(EQUIPMENTS)) {
      EQUIPMENTS.forEach(eq => {
        if (eq.id) dataMap[eq.id] = eq;
      });
    }
    return dataMap;
  }, []);

  // 💎 2. รวมไอเทมในตัว และแร่ - คงเดิม
  const allSellableItems = useMemo(() => {
    const items = (inventory || []).map(item => {
      const finalId = item.id || item.itemId || item.name;
      return {
        ...item,
        actualId: finalId, 
        isMaterial: false,
        maxQty: item.count || 1 
      };
    });
    
    const materials = Object.entries(player.materials || {})
      .filter(([id, count]) => count > 0)
      .map(([id, count]) => ({
        id: id,
        actualId: id,
        count: count,
        maxQty: count, 
        isMaterial: true
      }));

    return [...items, ...materials];
  }, [inventory, player.materials]);

  // 🚀 3. ฟังก์ชันลงประกาศขาย - คงเดิม
  const handlePost = (e) => {
    e.stopPropagation(); 
    if (selectedIndex === null || !selectedItemId) {
      setError("กรุณาเลือกไอเทมที่จะลงขาย");
      return;
    }
    if (!want.trim() || isNaN(want) || Number(want) <= 0) {
      setError("กรุณาระบุราคาที่ถูกต้อง");
      return;
    }
    if (sellCount <= 0) {
      setError("กรุณาระบุจำนวนที่จะขาย");
      return;
    }

    const finalWant = `${Number(want).toLocaleString()} ${currency}`;
    onConfirm(player.name || "Anonymous", selectedItemId, finalWant, desc.trim(), sellCount);
    onClose();
  };

  const selectedItem = selectedIndex !== null ? allSellableItems[selectedIndex] : null;

  return (
    <div 
      className="fixed inset-0 bg-black/95 backdrop-blur-md z-[999999] flex items-center justify-center p-4 animate-in fade-in duration-200 font-mono"
      onClick={onClose}
    >
      <div 
        className={`relative bg-[#020617] border-2 w-full max-w-md rounded-none overflow-hidden shadow-2xl animate-in zoom-in-95 duration-300 flex flex-col ${error ? 'border-red-500/40' : 'border-white/10'}`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* 🧩 Decorative Corners */}
        <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-amber-500/50 z-20" />
        <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-amber-500/50 z-20" />
        
        {/* --- HEADER --- */}
        <div className="p-6 border-b border-white/10 flex justify-between items-center bg-black/40 relative">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-amber-500 via-transparent to-transparent opacity-30" />
          <div className="select-none">
            <h2 className="text-xl font-black italic uppercase text-white tracking-tighter">Market_Post_v2.0</h2>
            <p className="text-[8px] text-amber-500/50 font-black uppercase tracking-[0.4em] mt-1 italic leading-none">Trading_Protocol_Active</p>
          </div>
          <button 
            onClick={onClose} 
            className="p-3 bg-white/5 border border-white/10 rounded-none text-slate-400 hover:text-white transition-all active:scale-90"
          >
            <X size={20}/>
          </button>
        </div>

        <div className="p-6 space-y-6 overflow-y-auto custom-scrollbar max-h-[65vh] bg-black/20">
          {/* 📦 SELECT ASSET */}
          <div className="space-y-3">
            <div className="flex justify-between items-center mb-1 select-none px-1">
              <label className="text-[9px] font-black uppercase text-slate-500 tracking-[0.3em] flex items-center gap-2">
                <Database size={12} className="text-blue-500" /> Select_Asset_Registry
              </label>
              <span className="text-[8px] font-black text-amber-500 uppercase italic bg-amber-500/10 px-2 py-0.5 border border-amber-500/20">{allSellableItems.length} Loaded</span>
            </div>
            
            <div className="grid grid-cols-1 gap-2 pr-1">
              {allSellableItems.map((item, idx) => {
                const info = masterData[item.actualId];
                const displayImg = info?.image || info?.icon || item.icon;
                const displayName = info?.name || item.name || item.actualId;

                return (
                  <div 
                    key={`${item.actualId}-${idx}`}
                    onClick={() => {
                      setSelectedItemId(item.actualId);
                      setSelectedIndex(idx);
                      setSellCount(1); 
                      setError('');
                    }}
                    className={`relative flex items-center gap-4 p-3 rounded-none border transition-all duration-300 active:scale-[0.98] ${
                      selectedIndex === idx 
                        ? 'bg-amber-500/10 border-amber-500 shadow-[inset_0_0_15px_rgba(245,158,11,0.1)]' 
                        : 'bg-white/5 border-white/5 hover:bg-white/10 hover:border-white/20'
                    }`}
                  >
                    {selectedIndex === idx && <div className="absolute left-0 top-0 h-full w-1 bg-amber-500" />}

                    <div className={`w-12 h-12 rounded-none flex items-center justify-center shrink-0 border transition-all ${
                      selectedIndex === idx ? 'bg-black/60 border-amber-500/50 shadow-[0_0_10px_rgba(245,158,11,0.2)]' : 'bg-black/40 border-white/5'
                    }`}>
                      {displayImg && (displayImg.includes('/') || displayImg.includes('.')) ? (
                        <img 
                          src={displayImg} 
                          className="w-8 h-8 object-contain pointer-events-none drop-shadow-[0_0_5px_rgba(255,255,255,0.2)]" 
                          alt="" 
                        />
                      ) : (
                        <span className="text-2xl pointer-events-none">{displayImg || '📦'}</span>
                      )}
                    </div>
                    
                    <div className="flex-1 min-w-0 pointer-events-none">
                      <p className={`text-xs font-black uppercase truncate italic tracking-widest ${selectedIndex === idx ? 'text-white' : 'text-slate-400'}`}>
                        {displayName}
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className={`text-[7px] font-black px-1.5 py-0.5 rounded-none uppercase italic border ${
                          item.isMaterial ? 'text-purple-400 border-purple-500/30 bg-purple-500/5' : 'text-cyan-400 border-cyan-500/30 bg-cyan-500/5'
                        }`}>
                          {item.isMaterial ? 'MAT_CLASS' : 'EQP_CLASS'}
                        </span>
                        <span className="text-[9px] text-slate-600 font-black uppercase tracking-tighter italic">Stock: {item.maxQty}</span>
                      </div>
                    </div>

                    {selectedIndex === idx && (
                      <div className="text-amber-500 animate-in zoom-in-50 duration-300">
                        <CheckCircle2 size={16} strokeWidth={3} />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* 🆕 QUANTITY & CURRENCY PICKER */}
          {selectedItem && (
            <div className="grid grid-cols-2 gap-3 animate-in slide-in-from-top-2 border-t border-white/5 pt-4">
               <div className="space-y-2">
                  <label className="text-[9px] font-black uppercase text-slate-500 tracking-[0.2em] italic">Units_to_Post</label>
                  <div className="relative">
                    <input 
                      type="number"
                      min="1"
                      max={selectedItem.maxQty}
                      value={sellCount}
                      onChange={(e) => setSellCount(Math.min(selectedItem.maxQty, Math.max(1, parseInt(e.target.value) || 1)))}
                      className="w-full bg-black/60 border border-white/10 rounded-none py-3 px-4 text-sm font-black text-amber-500 outline-none focus:border-amber-500 transition-all italic"
                    />
                    <Cpu size={10} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-700" />
                  </div>
               </div>
               <div className="space-y-2">
                  <label className="text-[9px] font-black uppercase text-slate-500 tracking-[0.2em] italic">Credit_Unit</label>
                  <div className="relative">
                    <select 
                      value={currency}
                      onChange={(e) => setCurrency(e.target.value)}
                      className="w-full bg-black/60 border border-white/10 rounded-none py-3 px-4 text-sm font-black text-white outline-none appearance-none focus:border-amber-500/50 transition-all cursor-pointer italic"
                    >
                      <option value="SCRAP" className="bg-slate-950">SCRAP_CORE</option>
                      <option value="SHARD" className="bg-slate-950">SHARD_NET</option>
                      <option value="DUST" className="bg-slate-950">DUST_VAL</option>
                    </select>
                    <ChevronDown size={14} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" />
                  </div>
               </div>
            </div>
          )}

          {/* INPUT FIELDS */}
          <div className="space-y-5 pt-2 border-t border-white/5">
            <div className="space-y-2">
              <label className="text-[9px] font-black uppercase text-slate-500 tracking-[0.2em] italic">Unit_Valuation (Asking Price)</label>
              <div className="relative group">
                <div className="absolute left-0 top-0 h-full w-1 bg-amber-500/20 group-focus-within:bg-amber-500 transition-colors" />
                <Coins className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-amber-500 transition-colors" size={16} />
                <input 
                  type="number"
                  placeholder="0.00"
                  value={want}
                  onChange={(e) => { setWant(e.target.value); setError(''); }}
                  className="w-full bg-black/40 border border-white/10 rounded-none py-4 pl-12 pr-4 text-sm font-black focus:border-white/30 text-white transition-all outline-none italic tracking-widest"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[9px] font-black uppercase text-slate-500 tracking-[0.2em] italic">Transaction_Brief (Note)</label>
              <div className="relative">
                <textarea 
                  placeholder="Data logs and item history..."
                  value={desc}
                  onChange={(e) => setDesc(e.target.value)}
                  className="w-full bg-black/40 border border-white/10 rounded-none py-4 px-4 text-[11px] font-black focus:border-white/30 h-20 resize-none text-slate-300 outline-none transition-all italic leading-relaxed"
                />
                <Activity size={10} className="absolute bottom-3 right-3 text-slate-800" />
              </div>
            </div>
          </div>

          {/* ⚠️ Error Message */}
          <div className={`overflow-hidden transition-all duration-300 ${error ? 'opacity-100' : 'opacity-0 h-0'}`}>
            <div className="bg-red-500/10 border-l-2 border-red-500 py-3 px-4 flex items-center gap-3 text-red-400">
              <AlertTriangle size={14} className="animate-pulse" />
              <span className="text-[9px] font-black uppercase italic tracking-widest leading-none">{error}</span>
            </div>
          </div>
        </div>

        {/* --- ACTIONS --- */}
        <div className="p-6 bg-black flex gap-3 border-t border-white/10">
          <button 
            onClick={onClose} 
            className="flex-1 bg-white/5 hover:bg-white/10 text-slate-500 hover:text-white py-4 rounded-none font-black text-[10px] uppercase italic border border-white/5 transition-all active:scale-95"
          >
            TERMINATE
          </button>
          <button 
            onClick={handlePost} 
            className="flex-[2.5] bg-amber-600 hover:bg-amber-500 text-black py-4 rounded-none font-black text-[11px] uppercase italic transition-all active:scale-95 shadow-[0_0_20px_rgba(217,119,6,0.2)] flex items-center justify-center gap-3 group tracking-widest"
          >
            PUBLISH_TRADE_LINK
          </button>
        </div>
      </div>
      
      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar { width: 3px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255, 255, 255, 0.05); }
      `}</style>
    </div>
  );
}