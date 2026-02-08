import React, { useState, useMemo } from 'react';
import { ShoppingBag, MessageSquare, PlusCircle, Tag, Search, Clock, Package, User, X, Info, Shield, Sword, Heart } from 'lucide-react';
import { itemMaster } from '../data/itemData';
import { EQUIPMENTS } from '../data/equipments';

/**
 * MarketBoardView - หน้าตลาดซื้อขาย (Fixed Button Layout)
 */
export default function MarketBoardView({ listings, onPostListing, onContactSeller, onBuyItem }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedInfoItem, setSelectedInfoItem] = useState(null);

  const allMasterData = useMemo(() => {
    const equipmentMap = {};
    if (Array.isArray(EQUIPMENTS)) {
      EQUIPMENTS.forEach(eq => { if (eq.id) equipmentMap[eq.id] = eq; });
    }
    return { ...itemMaster, ...equipmentMap };
  }, []);

  const filteredListings = useMemo(() => {
    return listings?.filter(list => {
      const item = allMasterData[list.itemId];
      const itemName = item?.name || list.itemId || 'Unknown Item';
      return itemName.toLowerCase().includes(searchTerm.toLowerCase());
    }) || [];
  }, [listings, searchTerm, allMasterData]);

  return (
    <div className="flex flex-col h-full bg-slate-950 text-slate-200 overflow-hidden relative">
      <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/5 blur-[100px] pointer-events-none" />

      {/* --- 🛰️ HEADER SECTION --- */}
      <header className="shrink-0 p-4 md:p-8 space-y-6 z-10">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <div className="w-2 h-6 bg-amber-500 rounded-full" />
              <h1 className="text-2xl md:text-3xl font-black italic uppercase tracking-tighter text-white">
                Trading <span className="text-amber-500">Hub</span>
              </h1>
            </div>
            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-[0.3em]">Sector-01 Global Market</p>
          </div>

          <button 
            onClick={(e) => {
              e.stopPropagation();
              onPostListing();
            }}
            className="bg-amber-500 hover:bg-amber-400 text-slate-950 px-5 py-3 rounded-2xl flex items-center gap-2 transition-all active:scale-90 shadow-[0_8px_20px_rgba(245,158,11,0.2)]"
          >
            <PlusCircle size={18} strokeWidth={2.5} />
            <span className="text-xs font-black uppercase tracking-widest">Post</span>
          </button>
        </div>

        <div className="relative group">
          <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
            <Search className="text-slate-500 group-focus-within:text-amber-500 transition-colors" size={18} />
          </div>
          <input 
            type="text"
            placeholder="Search rare items..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-900/40 backdrop-blur-md border border-white/5 rounded-[1.5rem] py-4 pl-12 pr-4 text-sm text-white focus:outline-none focus:border-amber-500/40 focus:bg-slate-900/60 transition-all placeholder:text-slate-600 shadow-inner"
          />
        </div>
      </header>

      {/* --- 📦 LISTINGS --- */}
      <div className="flex-1 overflow-y-auto px-4 md:px-8 pb-32 custom-scrollbar relative z-10">
        {filteredListings.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {filteredListings.map((post) => {
              const item = allMasterData[post.itemId];
              const displayImg = item?.image || item?.icon;
              const isEmoji = displayImg && !displayImg.includes('/') && !displayImg.includes('.');

              return (
                <div 
                  key={post.id} 
                  className="bg-slate-900/40 backdrop-blur-sm border border-white/5 rounded-[2.5rem] p-5 flex flex-col gap-5 hover:bg-slate-900/60 hover:border-amber-500/30 transition-all group relative overflow-hidden"
                >
                  <div className="flex gap-4">
                    <div 
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedInfoItem(item);
                      }}
                      className="w-20 h-20 bg-slate-950 rounded-[2rem] border border-white/5 flex items-center justify-center shrink-0 shadow-2xl relative cursor-pointer group-hover:border-amber-500/20"
                    >
                      {isEmoji ? (
                        <span className="text-4xl drop-shadow-md">{displayImg}</span>
                      ) : (
                        <img src={displayImg} alt="" className="w-12 h-12 object-contain group-hover:scale-110 transition-transform" />
                      )}
                      <div className="absolute -bottom-1 -right-1 p-1.5 bg-slate-900 border border-white/10 rounded-full">
                        <Info size={10} className="text-amber-500" />
                      </div>
                    </div>

                    <div className="flex-1 min-w-0 py-1">
                      <div className="flex items-center justify-between gap-2 mb-1">
                        <h3 className="font-black text-lg text-white truncate italic uppercase tracking-tight leading-none group-hover:text-amber-400 transition-colors">
                          {item?.name || 'Artifact'}
                        </h3>
                        <div className="flex items-center gap-1 bg-white/5 px-2 py-1 rounded-full border border-white/5 shrink-0">
                          <Clock size={10} className="text-slate-500" />
                          <span className="text-[9px] text-slate-500 font-bold uppercase">{post.timeAgo || 'NOW'}</span>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2 text-slate-500 mb-2">
                        <User size={12} className="text-amber-500/50" />
                        <span className="text-[10px] font-bold uppercase tracking-wider truncate">{post.sellerName}</span>
                      </div>

                      <p className="text-[11px] text-slate-400 italic line-clamp-2 leading-relaxed bg-black/20 p-2 rounded-xl">
                        "{post.description || 'No data logs found.'}"
                      </p>
                    </div>
                  </div>

                  {/* 🛠️ Pricing & Action */}
                  <div className="flex flex-col gap-4 mt-auto pt-4 border-t border-white/5">
                    <div className="flex items-center justify-between">
                      <span className="text-[9px] text-slate-500 font-black uppercase tracking-[0.2em]">Asking Price</span>
                      <div className="flex items-center gap-1.5 text-amber-500 px-3 py-1 bg-amber-500/5 rounded-full border border-amber-500/10">
                        <Tag size={12} strokeWidth={3} />
                        <span className="text-sm font-black uppercase tracking-tighter">{post.want}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 h-12"> 
                      {/* ปุ่ม Connect */}
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          onContactSeller(post);
                        }}
                        className="w-12 h-12 flex items-center justify-center bg-white/5 hover:bg-white/10 text-slate-400 rounded-2xl transition-all border border-white/10 active:scale-90 shrink-0 relative z-20"
                      >
                        <MessageSquare size={18} />
                      </button>

                      {/* ปุ่ม Buy Now */}
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          if (onBuyItem) onBuyItem(post);
                        }}
                        className="flex-1 h-12 bg-emerald-500 hover:bg-emerald-400 text-slate-950 rounded-2xl flex items-center justify-center gap-2 transition-all active:scale-95 shadow-lg shadow-emerald-500/10 shrink-0 relative z-20"
                      >
                        <ShoppingBag size={16} strokeWidth={3} />
                        <span className="text-[10px] font-black uppercase italic tracking-widest whitespace-nowrap">Buy Now</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="h-64 flex flex-col items-center justify-center opacity-20">
            <ShoppingBag size={64} strokeWidth={1} className="mb-4" />
            <p className="text-sm font-black uppercase tracking-[0.3em]">No Assets Found</p>
          </div>
        )}
      </div>

      {/* --- 🛡️ ITEM MODAL (Glass Design) --- */}
      {selectedInfoItem && (
        <div className="fixed inset-0 z-[2000000] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-950/90 backdrop-blur-md animate-in fade-in" onClick={() => setSelectedInfoItem(null)} />
          
          <div className="relative bg-slate-900 border border-white/10 w-full max-w-sm rounded-[3rem] overflow-hidden shadow-2xl animate-in zoom-in slide-in-from-bottom-10 duration-300">
            <div className="relative h-48 flex flex-col items-center justify-center bg-gradient-to-b from-amber-500/20 to-transparent">
              <button onClick={() => setSelectedInfoItem(null)} className="absolute top-6 right-6 p-3 bg-black/20 hover:bg-black/40 text-white rounded-full transition-colors border border-white/10">
                <X size={20} />
              </button>
              
              <div className="w-28 h-28 bg-slate-950 rounded-[2.5rem] border-2 border-amber-500/20 flex items-center justify-center shadow-2xl relative">
                {(!selectedInfoItem.image && !selectedInfoItem.icon?.includes('/')) ? (
                   <span className="text-5xl">{selectedInfoItem.icon}</span>
                ) : (
                   <img src={selectedInfoItem.image || selectedInfoItem.icon} className="w-16 h-16 object-contain" alt="" />
                )}
              </div>
            </div>

            <div className="px-8 pb-8 -mt-4 text-center">
              <h3 className="text-2xl font-black uppercase italic text-white tracking-tight">{selectedInfoItem.name}</h3>
              <div className="inline-flex items-center px-4 py-1.5 bg-amber-500/10 border border-amber-500/20 rounded-full mt-3">
                <span className="text-[10px] font-black uppercase text-amber-500 tracking-widest">{selectedInfoItem.rarity || 'Common Asset'}</span>
              </div>

              <div className="grid grid-cols-3 gap-3 my-8">
                <div className="bg-slate-950/50 p-3 rounded-3xl border border-white/5">
                  <Sword size={16} className="mx-auto mb-2 text-red-500" />
                  <span className="block text-sm font-black text-white">{selectedInfoItem.baseAtk || 0}</span>
                  <p className="text-[8px] font-bold text-slate-500 uppercase mt-1">Atk</p>
                </div>
                <div className="bg-slate-950/50 p-3 rounded-3xl border border-white/5">
                  <Shield size={16} className="mx-auto mb-2 text-blue-500" />
                  <span className="block text-sm font-black text-white">{selectedInfoItem.baseDef || 0}</span>
                  <p className="text-[8px] font-bold text-slate-500 uppercase mt-1">Def</p>
                </div>
                <div className="bg-slate-950/50 p-3 rounded-3xl border border-white/5">
                  <Heart size={16} className="mx-auto mb-2 text-emerald-500" />
                  <span className="block text-sm font-black text-white">{selectedInfoItem.baseHp || 0}</span>
                  <p className="text-[8px] font-bold text-slate-500 uppercase mt-1">Hp</p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="bg-black/20 p-4 rounded-2xl text-left border border-white/5">
                  <p className="text-[9px] font-black text-slate-500 uppercase mb-2 tracking-widest">Encrypted Data</p>
                  <p className="text-xs text-slate-400 italic leading-relaxed">"{selectedInfoItem.description || 'No additional logs found for this relic.'}"</p>
                </div>

                <button 
                  onClick={() => setSelectedInfoItem(null)}
                  className="w-full py-4 bg-white text-slate-950 rounded-2xl text-xs font-black uppercase tracking-[0.2em] transition-all active:scale-95 shadow-lg"
                >
                  Terminate Link
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ⚡ UI DECORATION: SCANLINE EFFECT */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.03] bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_2px,3px_100%] z-0" />
    </div>
  );
}