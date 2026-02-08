import React from 'react';
import { PartyPopper } from 'lucide-react';

export default function TitleUnlockPopup({ data, onClose }) {
  if (!data) return null;

  return (
    <div className="fixed inset-0 z-[99] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-300">
      <div className="bg-slate-900 border-2 border-amber-500 rounded-[2.5rem] p-8 text-center shadow-[0_0_50px_rgba(245,158,11,0.4)] max-w-xs animate-in zoom-in duration-500">
        <div className="flex justify-center mb-4">
          <div className="p-4 bg-amber-500/20 rounded-full animate-bounce">
            <PartyPopper className="text-amber-500" size={48} />
          </div>
        </div>
        <h3 className="text-amber-500 font-black text-xl uppercase italic mb-1">New Secret Title!</h3>
        <p className="text-white text-2xl font-black mb-1 uppercase tracking-tighter italic">"{data.name}"</p>
        <p className="text-emerald-500 text-[10px] font-bold mb-3 uppercase tracking-widest animate-pulse">
          Success: {data.unlockRequirement}
        </p>
        <div className="bg-black/40 p-3 rounded-xl mb-6 border border-white/5">
          <p className="text-slate-400 text-xs italic leading-relaxed">{data.description}</p>
        </div>
        <button 
          onClick={onClose} 
          className="w-full py-3 bg-amber-600 hover:bg-amber-500 text-black font-black rounded-xl transition-all active:scale-95 shadow-[0_4px_0_rgb(146,64,14)]"
        >
          AWESOME!
        </button>
      </div>
    </div>
  );
}