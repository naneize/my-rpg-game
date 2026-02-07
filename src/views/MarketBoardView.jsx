import React, { useState, useMemo } from 'react';
import { ShoppingBag, MessageSquare, PlusCircle, Tag, Search, Clock, Package, User, X, Info, Shield, Sword, Heart } from 'lucide-react';
import { itemMaster } from '../data/itemData';
import { EQUIPMENTS } from '../data/equipments';

export default function MarketBoardView({ listings, onPostListing, onContactSeller }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedInfoItem, setSelectedInfoItem] = useState(null); // สำหรับเปิดดูข้อมูลไอเทม

  // 📚 1. สร้างฐานข้อมูลรวม (แบบเดียวกับหน้า Post เพื่อให้ชื่อตรงกัน)
  const allMasterData = useMemo(() => {
    const equipmentMap = {};
    if (Array.isArray(EQUIPMENTS)) {
      EQUIPMENTS.forEach(eq => { if (eq.id) equipmentMap[eq.id] = eq; });
    }
    return { ...itemMaster, ...equipmentMap };
  }, []);

  // 🔍 2. กรองรายการตามชื่อไอเทม
  const filteredListings = useMemo(() => {
    return listings?.filter(list => {
      const item = allMasterData[list.itemId];
      const itemName = item?.name || list.itemId || 'Unknown Item';
      return itemName.toLowerCase().includes(searchTerm.toLowerCase());
    }) || [];
  }, [listings, searchTerm, allMasterData]);

  return (
    <div className="flex flex-col h-full bg-slate-950 text-white p-3 md:p-6 space-y-4 overflow-hidden pb-24 md:pb-6 relative">
      
      {/* --- 📢 HEADER SECTION --- */}
      <div className="flex flex-col gap-4 shrink-0 animate-in fade-in slide-in-from-top-4 duration-500">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-3">
            <div className="p-2.5 md:p-3 bg-amber-500/20 rounded-2xl border border-amber-500/20 shadow-[0_0_20px_rgba(245,158,11,0.15)]">
              <ShoppingBag className="text-amber-500" size={20} />
            </div>
            <div>
              <h1 className="text-lg md:text-2xl font-black italic uppercase tracking-tighter leading-none">Global Market</h1>
              <p className="text-[8px] md:text-[10px] text-slate-500 font-bold uppercase tracking-[0.2em] mt-1">Trading Hub</p>
            </div>
          </div>
          
          <button 
            onClick={onPostListing}
            className="flex items-center gap-2 bg-amber-500 hover:bg-amber-400 text-black px-4 py-3 rounded-2xl text-[10px] md:text-xs font-black transition-all active:scale-95 shadow-lg shadow-amber-900/20"
          >
            <PlusCircle size={14} /> <span>POST ITEM</span>
          </button>
        </div>

        {/* --- 🔍 SEARCH BAR --- */}
        <div className="relative group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-amber-500 transition-colors" size={16} />
          <input 
            type="text"
            placeholder="Search by name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-900/50 border border-white/10 rounded-2xl py-3.5 pl-11 pr-4 text-sm focus:outline-none focus:border-amber-500/50 transition-all placeholder:text-slate-600"
          />
        </div>
      </div>

      {/* --- 📦 LISTINGS GRID --- */}
      <div className="flex-1 overflow-y-auto custom-scrollbar pr-1 touch-pan-y">
        {filteredListings.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 md:gap-4">
            {filteredListings.map((post) => {
              const item = allMasterData[post.itemId];
              const displayImg = item?.image || item?.icon;
              const isEmoji = displayImg && !displayImg.includes('/') && !displayImg.includes('.');

              return (
                <div 
                  key={post.id} 
                  className="bg-slate-900/40 border border-white/5 rounded-[2rem] p-4 md:p-5 flex flex-col gap-4 hover:border-amber-500/30 transition-all group animate-in fade-in zoom-in duration-300"
                >
                  <div className="flex gap-4 relative z-10">
                    {/* Item Image Clickable */}
                    <button 
                      onClick={() => setSelectedInfoItem(item)}
                      className="w-16 h-16 md:w-20 md:h-20 bg-black/60 rounded-3xl border border-white/10 flex items-center justify-center relative shrink-0 shadow-inner group-hover:border-amber-500/50 transition-colors overflow-hidden"
                    >
                      {isEmoji ? (
                        <span className="text-3xl drop-shadow-lg">{displayImg}</span>
                      ) : displayImg ? (
                        <img src={displayImg} alt="" className="w-12 h-12 object-contain drop-shadow-xl group-hover:scale-110 transition-transform" />
                      ) : (
                        <Package className="text-slate-700" size={24} />
                      )}
                      <div className="absolute top-1 right-1"><Info size={10} className="text-white/20" /></div>
                    </button>
                    
                    <div className="flex-1 min-w-0 flex flex-col justify-center">
                      <div className="flex justify-between items-start gap-1">
                        <h3 className="font-black text-sm md:text-lg text-white truncate uppercase italic tracking-tight group-hover:text-amber-400">
                          {item?.name || post.itemId || 'Unknown Item'}
                        </h3>
                        <div className="flex items-center gap-1 shrink-0 bg-white/5 px-2 py-0.5 rounded-full border border-white/5">
                          <Clock size={8} className="text-slate-500" />
                          <span className="text-[8px] text-slate-500 font-bold uppercase">{post.timeAgo || 'NOW'}</span>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-1.5 mt-1">
                         <User size={10} className="text-amber-500/50" />
                         <span className="text-[9px] font-black text-slate-500 uppercase">Seller: <span className="text-slate-300">{post.sellerName}</span></span>
                      </div>

                      <p className="text-[10px] text-slate-500 mt-2 line-clamp-2 italic leading-snug">
                        "{post.description || 'No description provided.'}"
                      </p>
                    </div>
                  </div>

                  {/* Pricing & Contact */}
                  <div className="flex items-center justify-between pt-3 border-t border-white/5">
                    <div className="flex flex-col">
                      <span className="text-[8px] text-slate-500 font-black uppercase tracking-widest mb-0.5">Price / Want</span>
                      <div className="flex items-center gap-1.5">
                        <Tag size={12} className="text-amber-500" />
                        <span className="text-xs md:text-sm font-black text-amber-500 uppercase">{post.want}</span>
                      </div>
                    </div>

                    <button 
                      onClick={() => onContactSeller(post)}
                      className="flex items-center gap-2 bg-white/5 hover:bg-amber-500 hover:text-black px-4 py-2.5 rounded-xl text-amber-500 transition-all border border-white/5 shadow-lg group/btn"
                    >
                      <MessageSquare size={14} fill="currentColor" className="opacity-30 group-hover/btn:opacity-100" />
                      <span className="text-[9px] font-black uppercase italic">Contact</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="h-full flex flex-col items-center justify-center py-20 opacity-30">
            <ShoppingBag size={48} className="mb-4" />
            <p className="text-xs font-black uppercase tracking-widest">No listings found</p>
          </div>
        )}
      </div>

      {/* --- 🛡️ ITEM INFO MODAL (PREVIEW) --- */}
      {selectedInfoItem && (
        <div className="fixed inset-0 z-[2000000] flex items-center justify-center p-6 animate-in fade-in duration-200">
          <div className="absolute inset-0 bg-black/90 backdrop-blur-sm" onClick={() => setSelectedInfoItem(null)} />
          <div className="relative bg-slate-900 border border-white/10 w-full max-w-[320px] rounded-[2.5rem] overflow-hidden shadow-2xl animate-in zoom-in duration-300">
            <div className={`p-8 flex flex-col items-center text-center bg-gradient-to-b from-amber-500/10 to-transparent`}>
              <button onClick={() => setSelectedInfoItem(null)} className="absolute top-6 right-6 p-2 bg-white/5 rounded-full"><X size={16} /></button>
              
              <div className="w-24 h-24 bg-black/40 rounded-[2rem] border border-white/10 flex items-center justify-center mb-4 shadow-2xl">
                {(!selectedInfoItem.image && !selectedInfoItem.icon.includes('/')) ? (
                   <span className="text-5xl">{selectedInfoItem.icon || selectedInfoItem.image}</span>
                ) : (
                   <img src={selectedInfoItem.image || selectedInfoItem.icon} className="w-16 h-16 object-contain" alt="" />
                )}
              </div>

              <h3 className="text-xl font-black uppercase italic text-white tracking-tighter">{selectedInfoItem.name}</h3>
              <span className="text-[10px] font-black uppercase px-3 py-1 bg-white/5 border border-white/10 rounded-full mt-2 text-slate-400">{selectedInfoItem.rarity || 'Common'}</span>
            </div>

            <div className="p-6 space-y-4">
              {/* Stats Grid */}
              <div className="grid grid-cols-3 gap-2">
                <div className="bg-black/20 p-3 rounded-2xl border border-white/5 text-center">
                  <Sword size={14} className="mx-auto mb-1 text-red-400" />
                  <span className="block text-xs font-black text-white">{selectedInfoItem.baseAtk || 0}</span>
                  <span className="text-[8px] font-bold text-slate-500 uppercase">ATK</span>
                </div>
                <div className="bg-black/20 p-3 rounded-2xl border border-white/5 text-center">
                  <Shield size={14} className="mx-auto mb-1 text-blue-400" />
                  <span className="block text-xs font-black text-white">{selectedInfoItem.baseDef || 0}</span>
                  <span className="text-[8px] font-bold text-slate-500 uppercase">DEF</span>
                </div>
                <div className="bg-black/20 p-3 rounded-2xl border border-white/5 text-center">
                  <Heart size={14} className="mx-auto mb-1 text-emerald-400" />
                  <span className="block text-xs font-black text-white">{selectedInfoItem.baseHp || 0}</span>
                  <span className="text-[8px] font-bold text-slate-500 uppercase">HP</span>
                </div>
              </div>

              <div className="space-y-1">
                <p className="text-[9px] font-black text-slate-500 uppercase italic">Description</p>
                <p className="text-[11px] text-slate-400 leading-relaxed italic">"{selectedInfoItem.description || 'No description available for this item.'}"</p>
              </div>

              <button 
                onClick={() => setSelectedInfoItem(null)}
                className="w-full py-4 bg-white/5 hover:bg-white/10 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all"
              >
                Close Preview
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}