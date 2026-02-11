import React from 'react';
import { Users, X, Activity, Globe } from 'lucide-react';

export default function OnlinePlayersModal({ onlineList, onClose }) {
  return (
    <div className="fixed inset-0 z-[2000] flex items-center justify-center p-6 backdrop-blur-md bg-slate-950/90 font-mono">
      {/* 📱 Hard-Edge Container */}
      <div className="bg-[#020617] border-2 border-emerald-500/40 w-full max-w-sm rounded-none overflow-hidden shadow-[0_0_30px_rgba(16,185,129,0.1)] animate-in zoom-in-95 duration-200 relative">
        
        {/* Decorative Corner Lines */}
        <div className="absolute top-0 right-0 w-6 h-6 border-t border-r border-emerald-500/20 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-6 h-6 border-b border-l border-emerald-500/20 pointer-events-none" />

        {/* --- HEADER (Tactical Bar) --- */}
        <div className="p-4 bg-emerald-500/10 border-b-2 border-emerald-500/30 flex justify-between items-center relative">
          <div className="absolute top-0 left-0 w-1 h-full bg-emerald-500 animate-pulse" />
          <div className="flex items-center gap-3">
            <Globe className="text-emerald-400 animate-spin-slow" size={16} />
            <div className="flex flex-col">
              <span className="text-[10px] font-black uppercase italic text-white tracking-widest leading-none">Net_Signal_Sync</span>
              <span className="text-[8px] text-emerald-500/60 font-black uppercase mt-1">Online_Users: {onlineList.length}</span>
            </div>
          </div>
          <button 
            onClick={onClose} 
            className="p-2 bg-white/5 border border-white/10 hover:bg-emerald-500 hover:text-black transition-all active:scale-90 rounded-none"
          >
            <X size={18} />
          </button>
        </div>
        
        {/* --- NODE LIST (Research List) --- */}
        <div className="max-h-[300px] overflow-y-auto p-4 space-y-2 custom-scrollbar bg-black/20">
          {onlineList.length > 0 ? (
            onlineList.map((player, idx) => (
              <div key={idx} className="group flex justify-between items-center bg-white/[0.03] p-3 rounded-none border-l-2 border-transparent border-b border-white/5 transition-all hover:bg-emerald-500/5 hover:border-emerald-500/50">
                <div className="flex items-center gap-3">
                  {/* Digital Node Indicator */}
                  <div className="w-2.5 h-2.5 bg-emerald-500 rounded-none animate-pulse shadow-[0_0_10px_rgba(16,185,129,0.8)] relative">
                     <div className="absolute inset-0 bg-white opacity-20 animate-ping" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xs font-black text-slate-200 uppercase italic tracking-tighter group-hover:text-white transition-colors">
                      {player.username}
                    </span>
                    <span className="text-[6px] text-slate-600 font-black uppercase tracking-widest">Connection_Stable</span>
                  </div>
                </div>

                {player.username === 'Admin' && (
                  <div className="flex items-center gap-1 bg-cyan-500/10 border border-cyan-500/40 px-2 py-0.5">
                    <Activity size={8} className="text-cyan-400" />
                    <span className="text-[8px] text-cyan-400 font-black uppercase tracking-tighter">DEV_LINK</span>
                  </div>
                )}
              </div>
            ))
          ) : (
            <div className="flex flex-col items-center py-8 gap-3 opacity-30">
               <Activity size={24} className="text-slate-700" />
               <p className="text-center text-[9px] font-black text-slate-500 uppercase tracking-[0.3em] italic">No_Signals_Detected</p>
            </div>
          )}
        </div>

        {/* --- FOOTER STATUS --- */}
        <div className="p-3 bg-black/40 border-t border-white/5 flex justify-center">
           <p className="text-[7px] font-black text-slate-700 uppercase tracking-[0.5em] italic">
             Neural_Network_Scanner_Active
           </p>
        </div>
      </div>

      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar { width: 3px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(16, 185, 129, 0.2); }
        .animate-spin-slow { animation: spin 4s linear infinite; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}