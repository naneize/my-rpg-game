import React, { useState, useMemo } from 'react';
import { X, Tag, Package, CheckCircle2, AlertTriangle, Shield, Sword, Box } from 'lucide-react';
import { itemMaster } from '../data/itemData';
import { EQUIPMENTS } from '../data/equipments'; // ✅ ชื่อไฟล์ตรงตามโครงสร้าง data

export default function MarketPostModal({ inventory, onConfirm, onClose, player }) {
  const [selectedItemId, setSelectedItemId] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(null); 
  const [want, setWant] = useState('');
  const [desc, setDesc] = useState('');
  const [error, setError] = useState('');

  // 📚 1. สร้าง Dictionary รวมข้อมูล (ดึงจาก ID ใน equipments.js)
  const masterData = useMemo(() => {
    const dataMap = { ...itemMaster }; 

    if (Array.isArray(EQUIPMENTS)) {
      EQUIPMENTS.forEach(eq => {
        // ใช้ ID (เช่น 'wooden_sword') เป็นคีย์ในการค้นหา
        if (eq.id) dataMap[eq.id] = eq;
      });
    }
    return dataMap;
  }, []);

  // 💎 2. รวมไอเทมในตัว (Inventory) และแร่ (Materials)
  const allSellableItems = useMemo(() => {
    // ดึงไอเทมสวมใส่ (ระวังเรื่องชื่อฟิลด์ ID)
    const items = (inventory || []).map(item => {
      // 🚨 จุดสำคัญ: พยายามหา ID ให้เจอจากทุกช่องทางที่ระบบอาจจะส่งมา
      const finalId = item.id || item.itemId || item.name;
      return {
        ...item,
        actualId: finalId, 
        isMaterial: false
      };
    });
    
    // ดึงแร่
    const materials = Object.entries(player.materials || {})
      .filter(([id, count]) => count > 0)
      .map(([id, count]) => ({
        id: id,
        actualId: id,
        count: count,
        isMaterial: true
      }));

    return [...items, ...materials];
  }, [inventory, player.materials]);

  const preventBubbling = (e) => {
    e.stopPropagation();
    if (e.nativeEvent) e.nativeEvent.stopImmediatePropagation();
  };

  const handlePost = (e) => {
    preventBubbling(e);
    if (selectedIndex === null || !selectedItemId) {
      setError("กรุณาเลือกไอเทมที่จะลงขาย");
      return;
    }
    if (!want.trim()) {
      setError("กรุณาระบุสิ่งที่ต้องการแลกเปลี่ยน");
      return;
    }
    onConfirm(player.name || "Anonymous", selectedItemId, want.trim(), desc.trim());
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/95 backdrop-blur-md z-[1000000] flex items-center justify-center p-4 animate-in fade-in" onPointerDown={preventBubbling} onClick={onClose}>
      <div className="bg-slate-900 border border-white/10 w-full max-w-md rounded-[2.5rem] overflow-hidden shadow-2xl animate-in zoom-in" onClick={preventBubbling}>
        
        {/* HEADER */}
        <div className="p-6 border-b border-white/5 flex justify-between items-center bg-white/5 shadow-inner">
          <div>
            <h2 className="text-xl font-black italic uppercase text-amber-500">Post New Trade</h2>
            <p className="text-[9px] text-slate-500 font-bold uppercase tracking-widest mt-0.5 font-mono opacity-50 italic">SECURE TRADING PROTOCOL</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full text-slate-400 hover:text-white transition-all"><X size={24}/></button>
        </div>

        <div className="p-6 space-y-5">
          {/* 📦 SELECT ASSET */}
          <div>
            <div className="flex justify-between items-end mb-3">
              <label className="text-[10px] font-black uppercase text-slate-500 tracking-[0.2em]">Select Asset</label>
              <span className="text-[9px] font-bold text-amber-500 uppercase italic">{allSellableItems.length} Available</span>
            </div>
            
            <div className="grid grid-cols-1 gap-2 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
              {allSellableItems.map((item, idx) => {
                // 🔍 ค้นหาข้อมูลจาก MasterData ด้วย ID ที่เรากรองไว้แล้ว
                const info = masterData[item.actualId];
                const displayImg = info?.image || info?.icon || item.icon;
                const displayName = info?.name || item.name || item.actualId;

                return (
                  <div 
                    key={`${item.actualId}-${idx}`}
                    onPointerDown={(e) => {
                      preventBubbling(e);
                      setSelectedItemId(item.actualId);
                      setSelectedIndex(idx);
                      setError('');
                    }}
                    className={`group flex items-center gap-4 p-3 rounded-2xl border cursor-pointer transition-all duration-300 ${
                      selectedIndex === idx 
                        ? 'bg-amber-500/20 border-amber-500 shadow-[0_0_20px_rgba(245,158,11,0.2)]' 
                        : 'bg-white/5 border-transparent hover:bg-white/10 hover:translate-x-1'
                    }`}
                  >
                    {/* ICON BOX */}
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 border transition-all ${
  selectedIndex === idx ? 'bg-black/40 border-amber-500/50 scale-105' : 'bg-black/20 border-white/5'
}`}>
  {displayImg ? (
    // 🔍 เช็คว่า displayImg เป็น Path รูปภาพ (มี / หรือ .) หรือเป็น Emoji
    (displayImg.includes('/') || displayImg.includes('.')) ? (
      <img 
        src={displayImg} 
        className="w-8 h-8 object-contain pointer-events-none drop-shadow-lg" 
        alt="" 
        onError={(e) => { e.target.style.display = 'none'; }} // ถ้าโหลดรูปไม่ขึ้นให้ซ่อน
      />
    ) : (
      // 📝 ถ้าไม่ใช่ Path (เช่น เป็น Emoji '🗡️') ให้แสดงเป็น Text แทน
      <span className="text-2xl pointer-events-none drop-shadow-md">{displayImg}</span>
    )
  ) : (
    // Fallback กรณีไม่มีข้อมูลเลย
    item.isMaterial ? <Box className="text-slate-700" size={20} /> : <Sword className="text-slate-700" size={20} />
  )}
</div>
                    
                    {/* DETAILS */}
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
                        <span className="text-[9px] text-slate-500 font-bold">Qty: {item.count || 1}</span>
                      </div>
                    </div>

                    {selectedIndex === idx && (
                      <div className="bg-amber-500 text-black rounded-full p-1 animate-in zoom-in duration-300">
                        <CheckCircle2 size={14} />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* INPUT FIELDS */}
          <div className="space-y-4">
            <div>
              <label className="text-[10px] font-black uppercase text-slate-500 mb-2 block tracking-[0.2em]">Asking Price</label>
              <div className="relative group">
                <Tag className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-amber-500 transition-colors" size={16} />
                <input 
                  placeholder="e.g. 50,000 Gold"
                  value={want}
                  onChange={(e) => { setWant(e.target.value); setError(''); }}
                  onPointerDown={(e) => e.stopPropagation()} 
                  className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-sm font-bold focus:border-amber-500/50 text-white transition-all outline-none shadow-inner"
                />
              </div>
            </div>

            <div>
              <label className="text-[10px] font-black uppercase text-slate-500 mb-2 block tracking-[0.2em]">Listing Note</label>
              <textarea 
                placeholder="Details about the trade..."
                value={desc}
                onChange={(e) => setDesc(e.target.value)}
                onPointerDown={(e) => e.stopPropagation()} 
                className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-4 text-sm font-medium focus:border-amber-500/50 h-20 resize-none text-white outline-none transition-all shadow-inner"
              />
            </div>
          </div>

          {/* ⚠️ Error Message */}
          <div className={`overflow-hidden transition-all duration-300 ${error ? 'h-11 opacity-100' : 'h-0 opacity-0'}`}>
             <div className="bg-red-500/10 border border-red-500/20 rounded-2xl py-2.5 px-4 flex items-center gap-2 text-red-400">
                <AlertTriangle size={14} className="animate-pulse" />
                <span className="text-[10px] font-black uppercase italic tracking-tight">{error}</span>
             </div>
          </div>
        </div>

        {/* --- ACTIONS --- */}
        <div className="p-6 bg-white/5 flex gap-3 shadow-2xl">
          <button onClick={onClose} className="flex-1 bg-white/5 hover:bg-white/10 text-white py-4 rounded-2xl font-black text-[10px] uppercase italic border border-white/5 transition-all active:scale-95">Discard</button>
          <button onClick={handlePost} className="flex-[2.5] bg-amber-500 hover:bg-amber-400 text-black py-4 rounded-2xl font-black text-[11px] uppercase italic transition-all active:scale-95 shadow-xl shadow-amber-900/20 flex items-center justify-center gap-2 group">Publish Listing</button>
        </div>
      </div>
    </div>
  );
}