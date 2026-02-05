import React from 'react';
import { 
  ChevronRight, Compass, Footprints, Star, Swords, 
  Loader2, RefreshCcw, MapPin
} from 'lucide-react'; 

export default function TravelView({ 
  onStep, currentEvent, logs, 
  isWalking, walkProgress, player, currentMap, onResetMap 
}) {
  return (
    <div className="max-w-2xl mx-auto space-y-5 pb-20 animate-in fade-in duration-700">
      
      {/* 🟠 1. EXPLORATION HUD: ปรับพื้นหลังเป็น Slate-800/90 เพื่อความสว่างและเห็นมิติ */}
      <div className="flex justify-between items-center bg-slate-800/90 backdrop-blur-md border-2 border-orange-500/50 p-4 rounded-3xl shadow-[0_0_20px_rgba(245,158,11,0.2)] relative z-20">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-orange-500/20 text-orange-500">
            <MapPin size={18} />
          </div>
          <div>
            <p className="text-[8px] font-black text-orange-500/50 uppercase tracking-widest leading-none mb-1">Current Location</p>
            <h2 className="text-sm font-black text-white uppercase tracking-tight">
              {currentMap?.name || "The Unknown"}
            </h2>
          </div>
        </div>

        <div className="text-right border-l border-orange-500/20 pl-4">
          <p className="text-[8px] font-black text-orange-500/50 uppercase tracking-widest leading-none mb-1">Adventure Stats</p>
          <div className="flex items-center justify-end gap-1.5 text-orange-500">
             <Footprints size={14} />
             <span className="text-sm font-black font-mono">{(player?.totalSteps || 0).toLocaleString()} <span className="text-[10px]">STEPS</span></span>
          </div>
        </div>
      </div>

      {/* 🖼️ 2. EVENT DISPLAY: ปรับพื้นหลังเป็น Slate-900 และเพิ่ม Opacity ของลวดลาย */}
      <div className="relative overflow-hidden rounded-[2.5rem] border-2 bg-slate-900 border-orange-500/40 p-8 min-h-[350px] flex flex-col items-center justify-center transition-all duration-700 shadow-[0_0_40px_rgba(245,158,11,0.15)]">
        
        {/* Background Dark Matter Pattern: เพิ่มความชัดของลายจาก 20% เป็น 40% */}
        <div className="absolute inset-0 opacity-40 bg-[url('https://www.transparenttextures.com/patterns/dark-matter.png')]" />
        
        {currentEvent ? (
          /* ✨ Pop-up เด้งเมื่อเจอเหตุการณ์ */
          <div className="relative z-10 animate-in zoom-in-95 fade-in duration-500 text-center flex flex-col items-center">
             <div className="relative mb-8 scale-110">
                {/* Glow Effect ตามประเภทเหตุการณ์ */}
                <div className={`absolute inset-0 blur-3xl rounded-full animate-pulse ${currentEvent.isDanger ? 'bg-red-600/40' : 'bg-orange-500/30'}`} />
                
                <div className="relative p-8 bg-slate-800/80 rounded-full border-2 border-orange-500/50 backdrop-blur-xl shadow-[0_0_30_rgba(245,158,11,0.3)]">
                   {currentEvent.isDanger ? (
                     <Swords size={56} className="text-red-500 animate-bounce" />
                   ) : (
                     currentEvent.Icon ? <currentEvent.Icon size={56} className="text-orange-400" /> : <Star size={56} className="text-orange-400" />
                   )}
                </div>
             </div>

             <h3 className="text-4xl font-black text-white uppercase italic tracking-tighter mb-3 drop-shadow-[0_0_15px_rgba(245,158,11,0.6)]">
                {currentEvent.title}
             </h3>
             
             {/* ปรับพื้นหลังกล่องข้อความให้สว่างขึ้นเป็น Slate-800/60 */}
             <div className="bg-slate-800/60 backdrop-blur-md p-4 rounded-2xl border border-white/10 max-w-sm">
                <p className="text-orange-50 text-base italic leading-relaxed font-medium">
                   "{currentEvent.description}"
                </p>
             </div>
          </div>
        ) : (
          /* 🚶 สถานะขณะกำลังเดิน (Loading) */
          <div className="relative z-10 text-center flex flex-col items-center gap-6">
            <div className="relative">
               <Loader2 size={48} className={isWalking ? "animate-spin text-orange-400" : "text-slate-600 opacity-50"} />
               {isWalking && <div className="absolute inset-0 bg-orange-500/20 blur-xl animate-pulse rounded-full" />}
            </div>
            <p className="text-[10px] font-black uppercase tracking-[0.5em] text-slate-500 animate-pulse">
               {isWalking ? "Venturing Forward..." : "Awaiting Next Step"}
            </p>
          </div>
        )}
      </div>

      {/* 🕹️ 3. ACTION CONTROLS: ปรับพื้นหลังกล่องควบคุมเป็น Slate-800/80 และปุ่มเดินให้สว่างขึ้น */}
      <div className="bg-slate-800/80 backdrop-blur-xl border-2 border-orange-500/30 p-6 rounded-[2.5rem] shadow-2xl space-y-4">
        
        {/* Main Step Button */}
        <button 
          onClick={onStep}
          disabled={isWalking} 
          className="group relative w-full h-20 rounded-3xl overflow-hidden transition-all active:scale-95 disabled:scale-[0.98] border-2 border-orange-500/50 shadow-[0_0_20px_rgba(245,158,11,0.2)]"
        >
          {/* ปรับพื้นหลังปุ่มเป็น Slate-700 เพื่อความสว่าง */}
          <div className="absolute inset-0 bg-slate-700" />
          
          {/* Progress Layer */}
          {isWalking && (
            <div 
              className="absolute inset-0 bg-orange-600 transition-all duration-75 ease-linear opacity-60"
              style={{ width: `${walkProgress}%` }}
            />
          )}

          <div className="relative z-10 flex items-center justify-center gap-4">
            {isWalking ? (
              <span className="text-orange-50 font-black uppercase italic tracking-widest animate-pulse">Exploring...</span>
            ) : (
              <>
                <span className="text-white font-black text-2xl uppercase italic tracking-tighter group-hover:text-orange-200 transition-colors">
                   {currentEvent ? "Continue Journey" : "Take a Step"}
                </span>
                <ChevronRight className="text-orange-400 group-hover:text-white group-hover:translate-x-1 transition-all" size={28} />
              </>
            )}
          </div>
        </button>

        {/* Support Buttons: เปลี่ยนสีข้อความเป็น Slate-200 เพื่อความชัดเจน */}
        <button 
          onClick={onResetMap}
          disabled={isWalking}
          className="w-full h-12 flex items-center justify-center gap-2 bg-orange-500/5 hover:bg-orange-500/20 text-slate-200 hover:text-orange-400 rounded-2xl border border-orange-500/20 transition-all text-[10px] font-black uppercase tracking-widest disabled:opacity-0"
        >
          <RefreshCcw size={14} /> Change Expedition Location
        </button>
      </div>
      
      {/* 📜 4. MINI LOGS: เปลี่ยนสีข้อความเป็น Slate-400 เพื่อให้อ่านง่ายขึ้นบนพื้นหลังสว่าง */}
      <div className="px-6 text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] text-center">
         Recent Event: <span className="text-slate-300">{logs[0] || "None"}</span>
      </div>

    </div>
  );
}