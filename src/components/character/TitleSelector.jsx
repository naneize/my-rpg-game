import React from 'react';
import { Sparkles, ChevronRight, CheckCircle2, Target, Info, X } from 'lucide-react';
import { titles as allTitles } from '../../data/titles';

export default function TitleSelector({ 
  stats, setPlayer, showTitleSelector, setShowTitleSelector, 
  selectedTitleInfo, setSelectedTitleInfo 
}) {

  // ✅ แก้ Error: getRarityStyle is not a function โดยสร้างไว้ในนี้เลย
  const internalGetRarityStyle = (rarity) => {
    const styles = {
      Common: { text: "text-slate-400", border: "border-slate-500/30", bgIcon: "bg-slate-500/10", glow: "shadow-slate-500/5" },
      Uncommon: { text: "text-emerald-400", border: "border-emerald-500/30", bgIcon: "bg-emerald-500/10", glow: "shadow-emerald-500/5" },
      Rare: { text: "text-blue-400", border: "border-blue-500/30", bgIcon: "bg-blue-500/10", glow: "shadow-blue-500/5" },
      Epic: { text: "text-purple-400", border: "border-purple-500/30", bgIcon: "bg-purple-500/10", glow: "shadow-purple-500/5" },
      Legendary: { text: "text-amber-400", border: "border-amber-500/40", bgIcon: "bg-amber-500/10", glow: "shadow-amber-500/10" },
    };
    return styles[rarity] || styles.Common;
  };

  if (!showTitleSelector) return (
    <button 
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        setShowTitleSelector(true);
      }}
      className="flex items-center gap-2 px-4 py-2 bg-slate-800/90 hover:bg-slate-700 rounded-lg border border-white/10 transition-all shadow-lg group"
    >
      <span className="text-xs font-black text-amber-500 uppercase tracking-widest group-hover:text-amber-400">Change Title</span>
      <ChevronRight size={14} className="text-amber-500 group-hover:translate-x-1 transition-transform" />
    </button>
  );

  return (
    <div 
      className="fixed inset-0 z-[999] flex items-center justify-center p-4 md:p-8 bg-black/90 backdrop-blur-md animate-in fade-in duration-300"
      onClick={() => setShowTitleSelector(false)}
    >
      <div 
        onClick={(e) => e.stopPropagation()} 
        className="relative bg-slate-900 border-2 border-amber-500/20 rounded-2xl shadow-[0_0_50px_rgba(0,0,0,0.5)] w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-200"
      >
        {/* --- Header Area --- */}
        <div className="p-6 border-b border-white/10 flex justify-between items-center bg-white/5">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-amber-500/20 rounded-lg">
              <Sparkles size={20} className="text-amber-500 animate-pulse" />
            </div>
            <div>
              <h2 className="text-xl font-black text-white uppercase italic tracking-tighter">Select Your Title</h2>
              <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Personalize your legacy</p>
            </div>
          </div>
          <button 
            onClick={() => setShowTitleSelector(false)} 
            className="p-2 hover:bg-white/10 rounded-full text-slate-400 hover:text-white transition-colors"
          >
            <X size={24} />
          </button>
        </div>
        
        {/* --- Titles Grid (ขยายขนาดปุ่มให้ใหญ่ขึ้น) --- */}
        <div className="flex-1 overflow-y-auto p-6 grid grid-cols-1 sm:grid-cols-2 gap-3 custom-scrollbar">
          {allTitles
            .filter(title => stats.unlockedTitles?.includes(title.id) && title.id !== 'none')
            .map((title) => {
              const isActive = stats.activeTitleId === title.id;
              const isSelected = selectedTitleInfo?.id === title.id;
              const style = internalGetRarityStyle(title.rarity);

              return (
                <button
                  key={title.id}
                  onClick={() => setSelectedTitleInfo(title)}
                  className={`flex items-center gap-4 p-4 rounded-xl border-2 transition-all text-left relative group
                    ${isSelected 
                      ? 'bg-amber-500/10 border-amber-500/60 shadow-[0_0_20px_rgba(245,158,11,0.15)] scale-[1.02]' 
                      : 'bg-white/5 border-white/5 hover:border-white/20 hover:bg-white/10'}`}
                >
                  <div className={`w-12 h-12 rounded-lg flex-shrink-0 flex items-center justify-center font-black text-xl ${style.text} ${style.bgIcon} border ${style.border} ${style.glow}`}>
                    {title.name[0]}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm font-black truncate ${isActive ? 'text-amber-500' : 'text-slate-100'}`}>
                        {title.name}
                    </p>
                    <span className={`text-[9px] font-black uppercase px-1.5 py-0.5 rounded border ${style.border} ${style.text} bg-black/40`}>
                      {title.rarity}
                    </span>
                  </div>
                  {isActive && (
                    <div className="absolute top-3 right-3 flex items-center gap-1 bg-emerald-500 text-slate-950 px-1.5 py-0.5 rounded text-[8px] font-black uppercase">
                      <CheckCircle2 size={10} /> Equipped
                    </div>
                  )}
                </button>
              );
            })}
        </div>

        {/* --- Detail & Equip Section (เน้นให้มองเห็นง่าย) --- */}
        <div className="p-6 bg-black/60 border-t border-white/10">
          {selectedTitleInfo ? (
            <div className="flex flex-col md:flex-row items-center gap-6">
              <div className="flex-1 space-y-2 text-center md:text-left">
                <div className="flex items-center justify-center md:justify-start gap-2">
                   <h3 className="text-2xl font-black text-amber-500 uppercase italic leading-none">{selectedTitleInfo.name}</h3>
                </div>
                <p className="text-sm text-slate-300 font-medium italic">"{selectedTitleInfo.description}"</p>
                <div className="flex items-center justify-center md:justify-start gap-2 pt-2 opacity-60">
                  <Target size={12} className="text-slate-400" />
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">
                    Unlock Code: {selectedTitleInfo.unlockRequirement}
                  </span>
                </div>
              </div>
              
              <button 
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setPlayer(prev => ({ ...prev, activeTitleId: selectedTitleInfo.id }));
                  setShowTitleSelector(false);
                }}
                disabled={stats.activeTitleId === selectedTitleInfo.id}
                className={`w-full md:w-auto min-w-[160px] py-4 rounded-xl font-black uppercase tracking-widest text-sm border-b-4 transition-all active:translate-y-1 active:border-b-0
                  ${stats.activeTitleId === selectedTitleInfo.id 
                    ? 'bg-emerald-500/20 text-emerald-400 border-emerald-900 cursor-default' 
                    : 'bg-amber-500 text-slate-950 border-amber-700 hover:bg-amber-400'}`}
              >
                {stats.activeTitleId === selectedTitleInfo.id ? 'Active Title' : 'Equip Title'}
              </button>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-4 opacity-40">
              <Info size={32} className="text-slate-500 mb-2" />
              <p className="text-sm text-slate-500 uppercase font-black tracking-widest">Please Select A Title Above</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}