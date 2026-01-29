import React from 'react';
import { Sparkles, ChevronRight, CheckCircle2, Target, Info, X } from 'lucide-react';
import { titles as allTitles } from '../../data/titles';

export default function TitleSelector({ 
  stats, setPlayer, showTitleSelector, setShowTitleSelector, 
  selectedTitleInfo, setSelectedTitleInfo, getRarityStyle 
}) {
  
  // ส่วนปุ่มเปิด (คงเดิม)
  if (!showTitleSelector) return (
    <button 
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation(); // ✅ ป้องกัน Event ทะลุไปด้านหลัง
        setShowTitleSelector(true);
      }}
      className="flex items-center gap-1.5 px-2.5 py-1 bg-slate-800/80 hover:bg-slate-700 rounded border border-white/10 transition-all shadow-sm group"
    >
      <span className="text-[9px] font-black text-amber-500 uppercase tracking-widest group-hover:text-amber-400">Change Title</span>
      <ChevronRight size={10} className="text-amber-500 group-hover:translate-x-0.5 transition-transform" />
    </button>
  );

  return (
    /* ✅ เพิ่ม z-[100] เพื่อให้มั่นใจว่าอยู่บนสุด และ e.stopPropagation() ทุกจุด */
    <div 
      className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/60 backdrop-blur-sm"
      onClick={() => setShowTitleSelector(false)} // ✅ คลิกที่ว่างรอบๆ เพื่อปิด
    >
      <div 
        onClick={(e) => e.stopPropagation()} // ✅ ป้องกันคลิกข้างในแล้วเผลอปิด
        className="relative z-[110] bg-slate-900 border border-amber-500/30 rounded-xl p-3 space-y-3 shadow-2xl overflow-hidden w-full max-w-sm mx-auto animate-in zoom-in duration-200"
      >
        {/* ส่วนหัว (คงเดิม) */}
        <div className="flex items-center justify-between border-b border-white/5 pb-2">
          <div className="flex items-center gap-1.5">
            <Sparkles size={12} className="text-amber-500 animate-pulse" />
            <span className="text-[9px] font-black text-slate-300 uppercase tracking-widest">Select Title</span>
          </div>
          <button 
            onClick={() => setShowTitleSelector(false)} 
            className="text-slate-500 hover:text-white transition-colors"
          >
            <X size={14} />
          </button>
        </div>
        
        {/* Grid รายการฉายา (คงเดิม) */}
        <div className="grid grid-cols-2 gap-1.5 max-h-40 overflow-y-auto pr-1 custom-scrollbar">
          {allTitles
            .filter(title => stats.unlockedTitles?.includes(title.id) && title.id !== 'none')
            .map((title) => {
              const isActive = stats.activeTitleId === title.id;
              const isSelected = selectedTitleInfo?.id === title.id;
              const style = getRarityStyle(title.rarity, isSelected || isActive);

              return (
                <button
                  key={title.id}
                  onClick={(e) => {
                    e.preventDefault();
                    setSelectedTitleInfo(title);
                  }}
                  className={`flex items-center gap-2 p-1.5 rounded-lg border transition-all text-left relative z-[120]
                    ${isSelected ? 'bg-white/10 border-white/30 shadow-md scale-[0.98]' : 'bg-black/20 border-white/5 hover:border-white/20'}`}
                >
                  <div className={`w-7 h-7 rounded flex-shrink-0 flex items-center justify-center font-black text-[10px] ${style.text} ${style.bgIcon} border ${style.border}`}>
                    {title.name[0]}
                  </div>
                  <div className="overflow-hidden pointer-events-none">
                    <p className={`text-[9px] font-bold whitespace-normal leading-tight ${isActive ? 'text-amber-500' : 'text-slate-300'}`}>
                        {title.name}
                    </p>
                    <p className="text-[6px] text-slate-500 uppercase font-mono">{title.rarity}</p>
                  </div>
                  {isActive && <CheckCircle2 size={10} className="absolute top-1 right-1 text-amber-500" />}
                </button>
              );
            })}
        </div>

        {/* กล่องรายละเอียด (จุดที่แก้เพื่อให้กดสวมใส่ติด) */}
        <div className="bg-black/40 border border-white/5 rounded-lg p-2.5 space-y-1.5 relative z-[130]">
          {selectedTitleInfo ? (
            <>
              <div className="flex justify-between items-center gap-2">
                <div className="flex-1">
                  <p className="text-[10px] font-black text-amber-500 uppercase leading-none">{selectedTitleInfo.name}</p>
                  <p className="text-[8px] text-slate-400 mt-0.5 italic leading-tight">"{selectedTitleInfo.description}"</p>
                </div>
                
                {/* ✅ ปุ่ม EQUIP ที่เพิ่มความมั่นใจในการกด */}
                <button 
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    console.log("Equipping Title:", selectedTitleInfo.id); // ✅ ใส่ไว้เช็คใน Console
                    setPlayer(prev => ({ 
                      ...prev, 
                      activeTitleId: selectedTitleInfo.id 
                    }));
                    setShowTitleSelector(false); // ✅ ปิดหน้าต่างทันที
                  }}
                  disabled={stats.activeTitleId === selectedTitleInfo.id}
                  className={`relative z-[150] flex-shrink-0 text-[8px] px-3 py-1.5 rounded font-black uppercase border transition-all
                    ${stats.activeTitleId === selectedTitleInfo.id 
                      ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30 cursor-default opacity-50' 
                      : 'bg-amber-600 text-black border-amber-700 hover:bg-amber-500 active:scale-90 cursor-pointer'}`}
                >
                  {stats.activeTitleId === selectedTitleInfo.id ? 'Equipped' : 'Equip Now'}
                </button>
              </div>
              
              <div className="flex items-center gap-1 pt-1 border-t border-white/5 opacity-50">
                <Target size={8} className="text-slate-400" />
                <span className="text-[7px] text-slate-400 font-bold uppercase tracking-tighter">REQ: {selectedTitleInfo.unlockRequirement}</span>
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center py-1 opacity-40">
              <Info size={12} className="text-slate-500 mb-0.5" />
              <p className="text-[8px] text-slate-500 uppercase font-black text-center">Select a title to see details</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}