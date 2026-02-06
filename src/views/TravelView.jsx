import React from 'react';
import { 
  ChevronRight, Footprints, Star, Swords, 
  Loader2, RefreshCcw, MapPin
} from 'lucide-react'; 

export default function TravelView({ 
  onStep, currentEvent, logs, 
  isWalking, walkProgress, player, currentMap, onResetMap 
}) {
  return (
    <div className="max-w-md mx-auto space-y-6 pb-24 animate-in fade-in duration-500 px-4">
      
      {/* 🟠 1. HUD: Compact but Sharp */}
      <div className="flex justify-between items-center bg-slate-900/95 border border-amber-500/30 p-4 rounded-2xl shadow-2xl">
        <div className="flex items-center gap-3">
          <MapPin size={18} className="text-amber-500" />
          <div>
            <p className="text-[8px] font-black text-amber-500/50 uppercase tracking-widest">Territory</p>
            <h2 className="text-sm font-black text-white uppercase truncate max-w-[150px]">
              {currentMap?.name || "Unknown"}
            </h2>
          </div>
        </div>
        <div className="text-right border-l border-slate-800 pl-4">
          <p className="text-[8px] font-black text-amber-500/50 uppercase tracking-widest">Steps</p>
          <div className="flex items-center justify-end gap-1.5 text-amber-500">
             <Footprints size={14} />
             <span className="text-sm font-black font-mono text-white">
               {(player?.totalSteps || 0).toLocaleString()}
             </span>
          </div>
        </div>
      </div>

      {/* 🖼️ 2. STAGE DISPLAY: ปรับให้สูงขึ้นเล็กน้อยเพื่อความสมดุล */}
      <div className="relative overflow-hidden rounded-[2.5rem] border border-amber-500/20 bg-slate-950 p-8 min-h-[320px] flex flex-col items-center justify-center shadow-inner">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-amber-500/5 via-transparent to-transparent" />
        
        {currentEvent ? (
          <div className="relative z-10 animate-in zoom-in-95 duration-300 text-center flex flex-col items-center">
             <div className="relative mb-6">
                <div className={`absolute inset-0 blur-3xl rounded-full ${currentEvent.isDanger ? 'bg-red-500/30' : 'bg-amber-500/30'}`} />
                <div className="relative p-8 bg-slate-900/90 rounded-full border border-amber-500/40 shadow-2xl">
                   {currentEvent.isDanger ? (
                     <Swords size={48} className="text-red-500" />
                   ) : (
                     <Star size={48} className="text-amber-400" />
                   )}
                </div>
             </div>
             <h3 className="text-3xl font-black text-white uppercase italic tracking-tighter mb-3 drop-shadow-md">
                {currentEvent.title}
             </h3>
             <div className="bg-slate-900/50 p-4 rounded-xl border border-white/5">
                <p className="text-amber-100/80 text-sm italic leading-relaxed">
                   "{currentEvent.description}"
                </p>
             </div>
          </div>
        ) : (
          <div className="relative z-10 text-center flex flex-col items-center gap-6">
            <Loader2 size={40} className={isWalking ? "animate-spin text-amber-500" : "text-slate-800"} />
            <p className="text-[10px] font-black uppercase tracking-[0.5em] text-amber-500/30">
               {isWalking ? "Venturing Forward" : "Waiting for Command"}
            </p>
          </div>
        )}
      </div>

      {/* 🕹️ 3. ACTION CONTROLS */}
      <div className="space-y-4">
        {/*ปุ่มหลัก Take a Step */}
        <button 
          onClick={onStep}
          disabled={isWalking} 
          className="group relative w-full h-24 rounded-[2rem] overflow-hidden transition-all active:scale-95 border-2 border-amber-500/30 shadow-2xl"
        >
          <div className="absolute inset-0 bg-slate-900" />
          
          {isWalking && (
            <div 
              className="absolute inset-y-0 left-0 bg-gradient-to-r from-amber-600 via-amber-400 to-amber-600 shadow-[4px_0_15px_rgba(245,158,11,0.6)] transition-all duration-300 ease-out border-r-2 border-white/30"
              style={{ width: `${walkProgress}%` }}
            />
          )}

          <div className="relative z-10 flex items-center justify-center gap-4">
            <span className={`font-black text-2xl uppercase italic tracking-tighter transition-all duration-300 ${isWalking ? 'text-slate-950 scale-110' : 'text-amber-500'}`}>
               {isWalking ? "EXPLORING" : "TAKE A STEP"}
            </span>
            {!isWalking && <ChevronRight size={28} className="text-amber-500 group-hover:translate-x-1 transition-transform" />}
          </div>
        </button>

        {/* ✅ แก้ไข: ปุ่ม Change Territory เพิ่มแบคกราวด์และลูกเล่นให้ดูรู้ว่ากดได้ */}
        <button 
          onClick={onResetMap}
          disabled={isWalking}
          className="w-full h-14 flex items-center justify-center gap-3 
                     bg-slate-800/40 hover:bg-amber-500/10 active:bg-amber-500/20 
                     text-slate-400 hover:text-amber-500 
                     rounded-2xl border border-white/5 hover:border-amber-500/30 
                     transition-all duration-300 group disabled:opacity-0 shadow-lg"
        >
          <div className="p-1.5 rounded-lg bg-slate-900/50 group-hover:bg-amber-500/20 transition-colors">
            <RefreshCcw size={14} className="group-hover:rotate-180 transition-transform duration-700" />
          </div>
          <span className="text-[10px] font-black uppercase tracking-[0.2em]">
            Change Expedition Area
          </span>
        </button>
      </div>

    </div>
  );
}