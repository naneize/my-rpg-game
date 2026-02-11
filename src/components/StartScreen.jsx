import React, { useState } from 'react'; 
import { Activity, Shield, Zap, Cpu } from 'lucide-react';

export default function StartScreen({ onStart, onContinue, hasSave }) {
  
  const [nameInput, setNameInput] = useState("");
  const [error, setError] = useState(""); 

  const handleContinueClick = () => {
    if (!hasSave) {
      setError("NO_SAVE_DATA_DETECTED_ON_LOCAL_STORAGE");
      return;
    }
    setError(""); 
    const success = onContinue();
    if (!success) {
      setError("ERROR_DURING_DATA_DECRYPTION"); 
    }
  };

  const handleStartGame = () => {
    setError(""); 
    if (nameInput.trim().length < 4) {
      setError("IDENT_ID_TOO_SHORT_MIN_4_CHAR"); 
      return;
    }
    onStart(nameInput); 
  };

  return (
    <div className="min-h-[100dvh] w-full flex flex-col items-center justify-center bg-[#020617] relative overflow-hidden p-6 text-center font-mono">
      
      {/* 🌌 Background Decor - Cyber Grid */}
      <div className="absolute inset-0 opacity-[0.05] pointer-events-none" 
           style={{ backgroundImage: 'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] md:w-[600px] h-[300px] md:h-[600px] bg-amber-500/5 blur-[100px] rounded-none rotate-45" />

      {/* 🚀 Main Content */}
      <div className="relative z-10 animate-in fade-in zoom-in-95 duration-1000 -mt-10 w-full max-w-lg">
        
        {/* Logo Section */}
        <div className="flex flex-col items-center mb-6">
          <div className="relative p-4 border-2 border-amber-500/20 bg-black/40 mb-4">
             <div className="absolute top-0 left-0 w-2 h-2 bg-amber-500" />
             <div className="absolute bottom-0 right-0 w-2 h-2 bg-amber-500" />
             <img 
               src="/game-logo.png" 
               alt="Logo"
               className="w-20 h-20 md:w-32 md:h-32 object-contain drop-shadow-[0_0_15px_rgba(245,158,11,0.4)]"
             />
          </div>
          
          <div className="flex items-center gap-3">
             <Activity size={14} className="text-amber-500 animate-pulse" />
             <span className="text-[10px] text-amber-500/60 font-black uppercase tracking-[0.4em] italic">System_Ready</span>
          </div>
        </div>
        
        {/* Game Title - Hard Edge */}
        <h1 className="text-5xl md:text-8xl font-black italic uppercase tracking-tighter text-white mb-1 drop-shadow-lg">
          INFINITE <span className="text-amber-500">STEP</span>
        </h1>
        
        <div className="flex items-center justify-center gap-3 mb-10">
          <div className="h-[2px] w-6 md:w-10 bg-amber-500" />
          <p className="text-slate-500 font-black text-[9px] md:text-[10px] uppercase tracking-[0.35em] italic">
            THE_ETERNAL_EXPEDITION_OS
          </p>
          <div className="h-[2px] w-6 md:w-10 bg-amber-500" />
        </div>

        {/* --- Input & Control Console --- */}
        <div className="w-full max-w-[320px] mx-auto flex flex-col gap-4 items-center">
          
          {/* Identity Input */}
          <div className="w-full space-y-2">
            <div className="relative group">
              <div className="absolute left-0 top-0 h-full w-1 bg-amber-500" />
              <input 
                type="text"
                value={nameInput}
                onChange={(e) => {
                  setNameInput(e.target.value);
                  if(error) setError(""); 
                }}
                placeholder="INPUT_OPERATOR_ID"
                className={`w-full bg-white/5 border-y border-r ${error ? 'border-red-500/50 text-red-500' : 'border-white/10 text-amber-500'} py-4 px-6 text-center outline-none focus:bg-white/10 font-black italic uppercase text-xs tracking-widest transition-all rounded-none`}
              />
            </div>

            {error && (
              <div className="flex items-center justify-center gap-2 text-red-500 animate-pulse">
                <span className="text-[9px] font-black uppercase italic tracking-tighter">
                  {">"} {error}
                </span>
              </div>
            )}
          </div>

          <div className="w-full grid grid-cols-1 gap-3 mt-4">
            {/* 1. Continue Action */}
            <button 
              onClick={handleContinueClick}
              disabled={!hasSave}
              className={`group relative w-full h-14 rounded-none transition-all active:scale-95 border-2 ${!hasSave ? 'border-white/5 opacity-20 cursor-not-allowed' : 'border-white/10 hover:border-amber-500/50'}`}
            >
              <div className={`absolute inset-0 ${hasSave ? 'bg-slate-900/80 group-hover:bg-amber-500/5' : 'bg-transparent'} transition-all`} />
              <div className="relative flex items-center justify-center gap-3">
                 <Shield size={14} className={hasSave ? 'text-amber-500' : 'text-slate-700'} />
                 <span className={`text-sm font-black italic uppercase tracking-[0.2em] ${hasSave ? 'text-amber-500' : 'text-slate-700'}`}>
                   Link_Archive
                 </span>
              </div>
            </button>

            {/* 2. New Expedition Action */}
            <button 
              onClick={handleStartGame}
              className="group relative w-full h-14 rounded-none transition-all active:scale-95 overflow-hidden"
            >
              <div className="absolute inset-0 bg-amber-600 group-hover:bg-amber-500 transition-colors shadow-[0_0_20px_rgba(217,119,6,0.2)]" />
              <div className="absolute top-0 left-0 w-full h-full bg-[linear-gradient(45deg,transparent_25%,rgba(255,255,255,0.1)_50%,transparent_75%)] bg-[length:250%_250%] group-hover:animate-shimmer" />
              <div className="relative flex items-center justify-center gap-3">
                 <Zap size={14} className="text-black fill-black" />
                 <span className="text-sm font-[1000] italic uppercase tracking-[0.2em] text-black">
                   Execute_Mission
                 </span>
              </div>
            </button>
          </div>

        </div>
      </div>

      {/* 📟 Tactical Footer */}
      <div className="absolute bottom-8 left-0 right-0 z-10 px-8 flex justify-between items-end">
        <div className="text-left space-y-1">
          <p className="text-slate-600 text-[8px] uppercase font-black tracking-widest">Global_Status: Online</p>
          <p className="text-slate-600 text-[8px] uppercase font-black tracking-widest">Version: 1.0.0_ALPHA</p>
        </div>
        <div className="text-right">
          <p className="text-amber-500/40 text-[9px] font-black uppercase tracking-widest italic leading-none mb-1">
            Dev_Auth: nannaja_hq
          </p>
          <div className="flex gap-1 justify-end">
             <div className="w-1 h-1 bg-amber-500/20" />
             <div className="w-1 h-1 bg-amber-500/40" />
             <div className="w-3 h-1 bg-amber-500" />
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes shimmer {
          0% { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
        .animate-shimmer {
          animation: shimmer 3s infinite linear;
        }
      `}</style>
    </div>
  );
}