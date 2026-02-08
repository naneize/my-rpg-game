import React, { useState, useMemo } from 'react';
import { X, Tag, CheckCircle2, AlertTriangle, Shield, Sword, Box, ChevronDown, Coins } from 'lucide-react';
import { itemMaster } from '../data/itemData';
import { EQUIPMENTS } from '../data/equipments'; 

export default function MarketPostModal({ inventory, onConfirm, onClose, player }) {
  const [selectedItemId, setSelectedItemId] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(null); 
  const [want, setWant] = useState(''); // เก็บเฉพาะตัวเลขราคา
  const [currency, setCurrency] = useState('SCRAP'); // 🆕 เพิ่มประเภทเงิน
  const [sellCount, setSellCount] = useState(1); // 🆕 เพิ่มจำนวนที่จะขาย
  const [desc, setDesc] = useState('');
  const [error, setError] = useState('');

  // 📚 1. สร้าง Dictionary รวมข้อมูล
  const masterData = useMemo(() => {
    const dataMap = { ...itemMaster }; 
    if (Array.isArray(EQUIPMENTS)) {
      EQUIPMENTS.forEach(eq => {
        if (eq.id) dataMap[eq.id] = eq;
      });
    }
    return dataMap;
  }, []);

  // 💎 2. รวมไอเทมในตัว และแร่
  const allSellableItems = useMemo(() => {
    const items = (inventory || []).map(item => {
      const finalId = item.id || item.itemId || item.name;
      return {
        ...item,
        actualId: finalId, 
        isMaterial: false,
        maxQty: item.count || 1 // จำนวนสูงสุดที่มี
      };
    });
    
    const materials = Object.entries(player.materials || {})
      .filter(([id, count]) => count > 0)
      .map(([id, count]) => ({
        id: id,
        actualId: id,
        count: count,
        maxQty: count, // จำนวนสูงสุดที่มี
        isMaterial: true
      }));

    return [...items, ...materials];
  }, [inventory, player.materials]);

  // 🚀 3. ฟังก์ชันลงประกาศขาย
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

    // รวมข้อมูลราคาและหน่วยเงินเข้าด้วยกัน เช่น "500 SHARD"
    const finalWant = `${Number(want).toLocaleString()} ${currency}`;
    
    // ส่งข้อมูลกลับไปยัง App (เพิ่ม sellCount เข้าไปด้วย)
    onConfirm(
      player.name || "Anonymous", 
      selectedItemId, 
      finalWant, 
      desc.trim(), 
      sellCount 
    );
    onClose();
  };

  const selectedItem = selectedIndex !== null ? allSellableItems[selectedIndex] : null;

  return (
    <div 
      className="fixed inset-0 bg-black/95 backdrop-blur-md z-[999999] flex items-center justify-center p-4 animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div 
        className="relative bg-slate-900 border border-white/10 w-full max-w-md rounded-[2.5rem] overflow-hidden shadow-2xl animate-in zoom-in duration-300 flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* --- HEADER --- */}
        <div className="p-6 border-b border-white/5 flex justify-between items-center bg-white/5 shadow-inner">
          <div className="select-none">
            <h2 className="text-xl font-black italic uppercase text-amber-500 tracking-tighter">Post New Trade</h2>
            <p className="text-[9px] text-slate-500 font-bold uppercase tracking-widest mt-0.5 font-mono opacity-50 italic">SECURE TRADING PROTOCOL</p>
          </div>
          <button 
            onClick={onClose} 
            className="p-2 hover:bg-white/10 rounded-full text-slate-400 hover:text-white transition-all active:scale-90"
          >
            <X size={24}/>
          </button>
        </div>

        <div className="p-6 space-y-5 overflow-y-auto custom-scrollbar max-h-[70vh]">
          {/* 📦 SELECT ASSET */}
          <div className="space-y-3">
            <div className="flex justify-between items-end mb-1 select-none">
              <label className="text-[10px] font-black uppercase text-slate-500 tracking-[0.2em]">Select Asset</label>
              <span className="text-[9px] font-bold text-amber-500 uppercase italic">{allSellableItems.length} Available</span>
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
                      setSellCount(1); // Reset จำนวนเมื่อเปลี่ยนไอเทม
                      setError('');
                    }}
                    className={`group flex items-center gap-4 p-3 rounded-2xl border cursor-pointer transition-all duration-300 active:scale-[0.98] ${
                      selectedIndex === idx 
                        ? 'bg-amber-500/20 border-amber-500 shadow-[0_0_20px_rgba(245,158,11,0.1)]' 
                        : 'bg-white/5 border-transparent hover:bg-white/10 hover:translate-x-1'
                    }`}
                  >
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 border transition-all ${
                      selectedIndex === idx ? 'bg-black/40 border-amber-500/50 scale-105' : 'bg-black/20 border-white/5'
                    }`}>
                      {displayImg && (displayImg.includes('/') || displayImg.includes('.')) ? (
                        <img 
                          src={displayImg} 
                          className="w-8 h-8 object-contain pointer-events-none drop-shadow-lg" 
                          alt="" 
                          onError={(e) => { e.target.style.display = 'none'; }} 
                        />
                      ) : (
                        <span className="text-2xl pointer-events-none drop-shadow-md">{displayImg || '📦'}</span>
                      )}
                    </div>
                    
                    <div className="flex-1 min-w-0 pointer-events-none">
                      <p className={`text-xs font-black uppercase truncate tracking-tighter ${selectedIndex === idx ? 'text-white' : 'text-slate-300'}`}>
                        {displayName}
                      </p>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className={`text-[7px] font-black px-1.5 py-0.5 rounded-md uppercase italic border ${
                          item.isMaterial ? 'text-purple-400 border-purple-500/20 bg-purple-500/5' : 'text-cyan-400 border-cyan-500/20 bg-cyan-500/5'
                        }`}>
                          {item.isMaterial ? 'Material' : 'Equipment'}
                        </span>
                        <span className="text-[9px] text-slate-500 font-bold">In Stock: {item.maxQty}</span>
                      </div>
                    </div>

                    {selectedIndex === idx && (
                      <div className="bg-amber-500 text-black rounded-full p-1 animate-in zoom-in duration-300 shadow-lg shadow-amber-500/20">
                        <CheckCircle2 size={14} strokeWidth={3} />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* 🆕 QUANTITY & CURRENCY PICKER */}
          {selectedItem && (
            <div className="grid grid-cols-2 gap-4 animate-in slide-in-from-top-2">
               <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-slate-500 tracking-[0.2em] select-none">Sell Quantity</label>
                  <input 
                    type="number"
                    min="1"
                    max={selectedItem.maxQty}
                    value={sellCount}
                    onChange={(e) => setSellCount(Math.min(selectedItem.maxQty, Math.max(1, parseInt(e.target.value) || 1)))}
                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 px-4 text-sm font-bold text-amber-500 outline-none focus:border-amber-500/50 transition-all"
                  />
               </div>
               <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-slate-500 tracking-[0.2em] select-none">Currency Unit</label>
                  <div className="relative">
                    <select 
                      value={currency}
                      onChange={(e) => setCurrency(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 px-4 text-sm font-bold text-white outline-none appearance-none focus:border-amber-500/50 transition-all cursor-pointer"
                    >
                      <option value="SCRAP" className="bg-slate-900">SCRAP</option>
                      <option value="SHARD" className="bg-slate-900">SHARD</option>
                      <option value="DUST" className="bg-slate-900">DUST</option>
                    </select>
                    <ChevronDown size={14} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" />
                  </div>
               </div>
            </div>
          )}

          {/* INPUT FIELDS */}
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-slate-500 tracking-[0.2em] select-none">Asking Price (Per Unit)</label>
              <div className="relative group">
                <Coins className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-amber-500 transition-colors" size={16} />
                <input 
                  type="number"
                  placeholder="Price amount"
                  value={want}
                  onChange={(e) => { setWant(e.target.value); setError(''); }}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-sm font-bold focus:border-amber-500/50 text-white transition-all outline-none shadow-inner"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-slate-500 tracking-[0.2em] select-none">Listing Note</label>
              <textarea 
                placeholder="Details about the trade..."
                value={desc}
                onChange={(e) => setDesc(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-4 text-sm font-medium focus:border-amber-500/50 h-20 resize-none text-white outline-none transition-all shadow-inner"
              />
            </div>
          </div>

          {/* ⚠️ Error Message */}
          <div className={`overflow-hidden transition-all duration-300 ${error ? 'opacity-100' : 'opacity-0 h-0'}`}>
            <div className="bg-red-500/10 border border-red-500/20 rounded-2xl py-3 px-4 flex items-center gap-2 text-red-400">
              <AlertTriangle size={14} className="animate-pulse" />
              <span className="text-[10px] font-black uppercase italic tracking-tight">{error}</span>
            </div>
          </div>
        </div>

        {/* --- ACTIONS --- */}
        <div className="p-6 bg-white/5 flex gap-3 shadow-2xl border-t border-white/5">
          <button 
            onClick={onClose} 
            className="flex-1 bg-white/5 hover:bg-white/10 text-white py-4 rounded-2xl font-black text-[10px] uppercase italic border border-white/5 transition-all active:scale-95"
          >
            Discard
          </button>
          <button 
            onClick={handlePost} 
            className="flex-[2.5] bg-amber-500 hover:bg-amber-400 text-black py-4 rounded-2xl font-black text-[11px] uppercase italic transition-all active:scale-95 shadow-xl shadow-amber-900/20 flex items-center justify-center gap-2 group"
          >
            Publish Listing
          </button>
        </div>
      </div>
    </div>
  );
}