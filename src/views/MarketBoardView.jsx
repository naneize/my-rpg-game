import React, { useState, useMemo } from 'react';
import { ShoppingBag, MessageSquare, PlusCircle, Tag, Search, Clock, Package, User, X, Info, Shield, Sword, Heart, Activity, Database, Cpu } from 'lucide-react';
import { itemMaster } from '../data/itemData';
import { EQUIPMENTS } from '../data/equipments';

/**
 * 🛰️ MarketBoardView - Tactical Hard-Edge Edition
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
    <div className="flex flex-col h-full bg-[#020617] text-slate-200 overflow-hidden relative font-mono">
      {/* 🌌 Background Decoration */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/5 blur-[120px] pointer-events-none" />
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none" 
           style={{ backgroundImage: 'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)', backgroundSize: '40px 40px' }} />

      {/* --- 🛰️ HEADER SECTION (Hard-Edge) --- */}
      <header className="shrink-0 p-6 md:p-8 space-y-6 z-10 border-b border-white/10 bg-black/40 relative">
        <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-amber-500 via-transparent to-transparent opacity-30" />
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-3">
              <div className="w-2 h-8 bg-amber-500" />
              <h1 className="text-2xl md:text-4xl font-black italic uppercase tracking-tighter text-white">
                Trading_<span className="text-amber-500">Hub_v2.0</span>
              </h1>
            </div>
            <p className="text-[10px] text-amber-500/50 font-black uppercase tracking-[0.4em] italic pl-5">Sector-01 Global Network Active</p>
          </div>

          <button 
            onClick={(e) => {
              e.stopPropagation();
              onPostListing();
            }}
            className="bg-amber-600 hover:bg-amber-500 text-black px-6 py-4 rounded-none flex items-center gap-3 transition-all active:scale-95 shadow-[0_0_20px_rgba(217,119,6,0.3)] group"
          >
            <PlusCircle size={20} strokeWidth={3} className="group-hover:rotate-90 transition-transform" />
            <span className="text-xs font-[1000] uppercase tracking-widest italic">Create_Post</span>
          </button>
        </div>

        <div className="relative group max-w-2xl">
          <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
            <Search className="text-slate-500 group-focus-within:text-amber-500 transition-colors" size={18} />
          </div>
          <input 
            type="text"
            placeholder="Scan for encrypted assets..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-black/60 border border-white/10 rounded-none py-4 pl-12 pr-4 text-sm text-white focus:outline-none focus:border-amber-500 focus:bg-white/5 transition-all placeholder:text-slate-700 italic tracking-widest"
          />
        </div>
      </header>

      {/* --- 📦 LISTINGS (Hard-Edge Grid) --- */}
      <div className="flex-1 overflow-y-auto px-4 md:px-8 pt-8 pb-32 custom-scrollbar relative z-10">
        {filteredListings.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredListings.map((post) => {
              const item = allMasterData[post.itemId];
              const displayImg = item?.image || item?.icon;
              const isEmoji = displayImg && !displayImg.includes('/') && !displayImg.includes('.');

              return (
                <div 
                  key={post.id} 
                  className="bg-black/40 border-2 border-white/5 rounded-none p-5 flex flex-col gap-6 hover:bg-white/[0.03] hover:border-blue-500/30 transition-all group relative overflow-hidden"
                >
                  {/* Decorative corner */}
                  <div className="absolute top-0 right-0 w-8 h-8 bg-blue-500/10 border-b border-l border-blue-500/20 pointer-events-none" />
                  
                  <div className="flex gap-5">
                    <div 
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedInfoItem(item);
                      }}
                      className="w-20 h-20 bg-black rounded-none border-2 border-white/5 flex items-center justify-center shrink-0 shadow-2xl relative cursor-pointer group-hover:border-blue-500/40 transition-colors"
                    >
                      {isEmoji ? (
                        <span className="text-4xl drop-shadow-md">{displayImg}</span>
                      ) : (
                        <img src={displayImg} alt="" className="w-12 h-12 object-contain group-hover:scale-110 transition-transform" />
                      )}
                      <div className="absolute -bottom-1 -right-1 p-1 bg-black border border-white/20 text-blue-500">
                        <Info size={12} strokeWidth={3} />
                      </div>
                    </div>

                    <div className="flex-1 min-w-0 py-1">
                      <div className="flex items-center justify-between gap-2 mb-2">
                        <h3 className="font-black text-lg text-white truncate italic uppercase tracking-tighter group-hover:text-blue-400 transition-colors">
                          {item?.name || 'Unknown_Relic'}
                        </h3>
                        <div className="flex items-center gap-1.5 bg-black/60 px-2 py-1 border border-white/10 shrink-0">
                          <Activity size={10} className="text-blue-500 animate-pulse" />
                          <span className="text-[8px] text-blue-500 font-black uppercase tracking-widest">{post.timeAgo || 'LIVE'}</span>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2 text-slate-500 mb-3 border-l-2 border-amber-500/30 pl-2">
                        <User size={10} className="text-amber-500/50" />
                        <span className="text-[9px] font-black uppercase tracking-widest truncate italic">Seller_{post.sellerName}</span>
                      </div>

                      <div className="text-[10px] text-slate-500 italic leading-relaxed bg-black/40 p-3 border border-white/5 relative">
                         <div className="absolute top-0 right-0 p-1 opacity-20"><Database size={8} /></div>
                        "{post.description || 'Data logs: Empty.'}"
                      </div>
                    </div>
                  </div>

                  {/* 🛠️ Pricing & Action (Hard-Edge Buttons) */}
                  <div className="flex flex-col gap-4 mt-auto pt-5 border-t border-white/10">
                    <div className="flex items-center justify-between px-1">
                      <span className="text-[8px] text-slate-600 font-black uppercase tracking-[0.4em] italic">Unit_Price_Value</span>
                      <div className="flex items-center gap-2 text-amber-500 px-3 py-1 bg-amber-500/5 border-l-2 border-amber-500">
                        <Tag size={12} strokeWidth={3} />
                        <span className="text-sm font-black uppercase tracking-widest italic">{post.want}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 h-14"> 
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          onContactSeller(post);
                        }}
                        className="w-14 h-full flex items-center justify-center bg-white/5 hover:bg-blue-500/20 text-slate-500 hover:text-blue-400 rounded-none transition-all border border-white/10 active:scale-90"
                      >
                        <MessageSquare size={20} />
                      </button>

                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          if (onBuyItem) onBuyItem(post);
                        }}
                        className="flex-1 h-full bg-emerald-600 hover:bg-emerald-500 text-black rounded-none flex items-center justify-center gap-3 transition-all active:scale-95 shadow-[0_4px_20px_rgba(5,150,105,0.2)]"
                      >
                        <ShoppingBag size={18} strokeWidth={3} />
                        <span className="text-[11px] font-[1000] uppercase italic tracking-[0.3em]">Authorize_Buy</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        
        ) : (
          <div className="h-96 flex flex-col items-center justify-center opacity-20 gap-4">
            <Cpu size={80} strokeWidth={1} className="animate-pulse" />
            <p className="text-sm font-black uppercase tracking-[0.5em] italic">No_Assets_Synchronized</p>
          </div>
        )}
      </div>

      {/* --- 🛡️ ITEM MODAL (Tactical Data Decryption) --- */}
      {selectedInfoItem && (
        <div className="fixed inset-0 z-[2000000] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/95 backdrop-blur-md animate-in fade-in" onClick={() => setSelectedInfoItem(null)} />
          
          <div className="relative bg-[#020617] border-2 border-amber-500/40 w-full max-w-sm rounded-none overflow-hidden shadow-[0_0_50px_rgba(245,158,11,0.1)] animate-in zoom-in-95 duration-300">
            {/* Modal Corners */}
            <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-amber-500 z-20" />
            <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-amber-500 z-20" />

            <div className="relative h-48 flex flex-col items-center justify-center bg-black/60 border-b border-white/10">
              <button onClick={() => setSelectedInfoItem(null)} className="absolute top-4 right-4 p-2 bg-white/5 border border-white/10 text-white hover:bg-red-500 hover:border-red-400 transition-all z-30">
                <X size={20} />
              </button>
              
              <div className="w-28 h-28 bg-black rounded-none border-2 border-amber-500/20 flex items-center justify-center shadow-2xl relative">
                {(!selectedInfoItem.image && !selectedInfoItem.icon?.includes('/')) ? (
                   <span className="text-5xl">{selectedInfoItem.icon}</span>
                ) : (
                   <img src={selectedInfoItem.image || selectedInfoItem.icon} className="w-16 h-16 object-contain" alt="" />
                )}
                <div className="absolute -top-2 -left-2 w-4 h-4 bg-amber-500 opacity-50" />
              </div>
            </div>

            <div className="px-8 pb-10 mt-6 text-center space-y-4">
              <div>
                <h3 className="text-2xl font-black uppercase italic text-white tracking-widest">{selectedInfoItem.name}</h3>
                <div className="inline-block mt-2 px-3 py-0.5 bg-amber-500 text-black text-[9px] font-black uppercase tracking-[0.3em] italic">
                   {selectedInfoItem.rarity || 'ASSET_CLASS: NORMAL'}
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2 py-4">
                {[
                  { icon: Sword, val: selectedInfoItem.atk, label: 'ATK_PWR', color: 'text-red-500' },
                  { icon: Shield, val: selectedInfoItem.def, label: 'DEF_ARM', color: 'text-blue-500' },
                  { icon: Heart, val: selectedInfoItem.hp, label: 'VIT_LVL', color: 'text-emerald-500' }
                ].map((stat, i) => (
                  <div key={i} className="bg-white/5 p-3 border border-white/5 relative">
                    <stat.icon size={14} className={`mx-auto mb-2 ${stat.color}`} />
                    <span className="block text-sm font-black text-white italic">{stat.val || 0}</span>
                    <p className="text-[7px] font-black text-slate-600 uppercase mt-1 tracking-widest">{stat.label}</p>
                  </div>
                ))}
              </div>

              <div className="bg-black/40 p-4 border-l-2 border-amber-500 text-left relative">
                <div className="absolute top-0 right-0 p-1 opacity-10"><Database size={10} /></div>
                <p className="text-[8px] font-black text-slate-600 uppercase mb-2 tracking-[0.3em] italic">Decrypted_Logs</p>
                <p className="text-[11px] text-slate-400 italic leading-relaxed">
                  {">"} {selectedInfoItem.description || 'No data strings identified for this relic.'}
                </p>
              </div>

              <button 
                onClick={() => setSelectedInfoItem(null)}
                className="w-full py-4 bg-white text-black rounded-none text-[10px] font-black uppercase tracking-[0.5em] transition-all active:scale-95 shadow-[0_4px_15px_rgba(255,255,255,0.1)] italic"
              >
                Terminate_Connection
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ⚡ SCANLINE & NOISE OVERLAY */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.02] bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_2px,3px_100%] z-[100]" />
    </div>
  );
}