import React from 'react';
import { Users, X } from 'lucide-react';

export default function OnlinePlayersModal({ onlineList, onClose }) {
  return (
    <div className="fixed inset-0 z-[2000] flex items-center justify-center p-6 backdrop-blur-sm bg-slate-950/80">
      <div className="bg-slate-900 border-2 border-emerald-500/30 w-full max-w-sm rounded-[2rem] overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200">
        <div className="p-4 bg-emerald-500/10 border-b border-white/5 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Users className="text-emerald-500" size={18} />
            <span className="text-xs font-black uppercase italic text-white">Online Players ({onlineList.length})</span>
          </div>
          <button onClick={onClose} className="p-1 hover:bg-white/10 rounded-full transition-colors">
            <X size={20} className="text-slate-400" />
          </button>
        </div>
        
        <div className="max-h-[300px] overflow-y-auto p-4 space-y-2 custom-scrollbar">
          {onlineList.length > 0 ? (
            onlineList.map((player, idx) => (
              <div key={idx} className="flex justify-between items-center bg-white/5 p-3 rounded-xl border border-white/5 transition-all hover:border-emerald-500/30">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                  <span className="text-sm font-bold text-slate-200">{player.username}</span>
                </div>
                {player.username === 'Admin' && (
                  <span className="text-[7px] bg-cyan-500 text-slate-950 px-2 py-0.5 rounded-full font-black uppercase">DEV</span>
                )}
              </div>
            ))
          ) : (
            <p className="text-center text-[10px] text-slate-500 italic py-4">ไม่มีผู้เล่นออนไลน์ในขณะนี้</p>
          )}
        </div>
      </div>
    </div>
  );
}