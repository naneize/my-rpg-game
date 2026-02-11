import React, { useState, useEffect } from 'react';
import { 
  ChevronRight, Star, Swords, Loader2, Zap, Info, X, ChevronLeft,
  Flame, Droplets, Mountain, Wind, Settings2, BatteryCharging, AlertCircle,
  Database, Activity, Radio
} from 'lucide-react'; 

export default function TravelView({ 
  onBack, onStep, currentEvent, isWalking, walkProgress, player, 
  targetElement, tuneToElement, tuningEnergy, currentMap, setCurrentEvent 
}) {
  const [showInfo, setShowInfo] = useState(false);
  const [errorTarget, setErrorTarget] = useState(null); 
  const [showDebug, setShowDebug] = useState(false); 
  const [isTuningOpen, setIsTuningOpen] = useState(false); // ✅ เพิ่ม State สำหรับเปิด/ปิดแผงธาตุ

  useEffect(() => {
    console.group("🛰️ [TRAVEL_VIEW_DEBUG]");
    console.log("📍 แผนที่ปัจจุบัน:", currentMap?.name || "❌ MISSING");
    console.groupEnd();
  }, [currentMap, targetElement]);

  const cellStock = player?.inventory?.find(i => i.id === 'neural_cell')?.count || 0;

  const getZoneInfo = (steps) => {
    const loopStep = steps % 1500;
    if (loopStep <= 375) return { name: "Sector: Meadow Base", color: "text-emerald-600", icon: <Mountain size={10}/> };
    if (loopStep <= 750) return { name: "Sector: Highwind Plains", color: "text-emerald-400", icon: <Wind size={10}/> };
    if (loopStep <= 1125) return { name: "Sector: Thermal Vent", color: "text-orange-500", icon: <Flame size={10}/> };
    return { name: "Sector: Crystal Stream", color: "text-cyan-400", icon: <Droplets size={10}/> };
  };

  const zone = getZoneInfo(player?.totalSteps || 0);

  const handleTuneClick = (id) => {
    if (id === 'ALL') {
      tuneToElement(id);
      setIsTuningOpen(false); // ปิดเมื่อเลือกเสร็จ
      return;
    }
    if (cellStock <= 0 && tuningEnergy <= 0) {
      setErrorTarget(id);
      setTimeout(() => setErrorTarget(null), 800);
      return;
    }
    tuneToElement(id);
    setIsTuningOpen(false); // ปิดเมื่อเลือกเสร็จ
  };

  const elements = [
    { id: 'ALL', icon: Settings2, color: 'text-slate-400', label: 'AUTO', wave: 'bg-amber-500' },
    { id: 'EARTH', icon: Mountain, color: 'text-emerald-700', label: 'EARTH', wave: 'bg-emerald-700' },
    { id: 'WIND', icon: Wind, color: 'text-emerald-400', label: 'WIND', wave: 'bg-emerald-400' },
    { id: 'FIRE', icon: Flame, color: 'text-orange-500', label: 'FIRE', wave: 'bg-orange-500' },
    { id: 'WATER', icon: Droplets, color: 'text-cyan-400', label: 'WATER', wave: 'bg-cyan-400' },
    { id: 'LIGHT', icon: Star, color: 'text-yellow-300', label: 'LIGHT', wave: 'bg-yellow-300' },
    { id: 'DARK', icon: Activity, color: 'text-purple-600', label: 'DARK', wave: 'bg-purple-600' },
    { id: 'STEEL', icon: BatteryCharging, color: 'text-slate-300', label: 'STEEL', wave: 'bg-slate-300' },
    { id: 'POISON', icon: AlertCircle, color: 'text-lime-500', label: 'POISON', wave: 'bg-lime-500' },
  ];

  const currentElementObj = elements.find(el => el.id === targetElement) || elements[0];
  const currentWaveColor = currentElementObj.wave;

  return (
    <div className="max-w-4xl mx-auto space-y-3 pb-32 px-2 md:px-4 pt-4 relative animate-in fade-in duration-500 select-none font-mono">
      
      {/* 🌌 1. HUD HEADER */}
      <div className="flex items-center gap-2 h-14 md:h-16 bg-slate-900/40 border border-white/10 p-1 rounded-none relative">
        <div className="flex-1 h-full px-4 flex flex-col justify-center relative overflow-hidden bg-black/20">
          <div className={`absolute top-0 left-0 w-1 h-full ${zone.color.replace('text', 'bg')}`} />
          <p className="text-[7px] font-black text-slate-500 uppercase tracking-[0.3em] mb-0.5 leading-none italic">Scanning_Sector</p>
          <h2 className={`text-[10px] md:text-xs font-black uppercase italic truncate ${zone.color}`}>{currentMap?.name || zone.name}</h2>
        </div>

        <div className={`h-full px-3 md:px-4 flex items-center gap-3 border-l border-white/5 bg-black/20`}>
          <div className="text-right">
            <p className="text-[7px] font-black uppercase tracking-widest text-emerald-500 leading-none mb-1 italic">Cells</p>
            <div className="flex items-center justify-end gap-1.5">
                <span className="text-xs md:text-sm font-black italic text-white">{cellStock}</span>
                <BatteryCharging size={10} className="text-emerald-400" />
            </div>
          </div>
          <button onClick={() => setShowInfo(true)} className="p-2 bg-white/5 text-slate-400 border border-white/5">
            <Info size={14} />
          </button>
        </div>
      </div>

      <div className="flex flex-col md:grid md:grid-cols-2 gap-3 md:gap-4 items-stretch">
        
        {/* 🖼️ 2. EXPEDITION SCREEN (Square Frame) */}
        <div className="relative border-2 border-white/10 bg-[#020617] h-[280px] md:h-[450px] flex flex-col items-center justify-center shadow-2xl overflow-hidden shrink-0">
          <div className="absolute top-0 left-0 w-6 h-6 border-t-2 border-l-2 border-amber-500/40" />
          <div className="absolute bottom-0 right-0 w-6 h-6 border-b-2 border-r-2 border-amber-500/40" />
          
          {!currentEvent && (
            <div className="absolute inset-x-0 bottom-10 flex items-end justify-center gap-1 h-12 opacity-30 px-6">
              {[...Array(18)].map((_, i) => (
                <div key={i} className={`w-1 ${currentWaveColor} transition-all duration-500`}
                  style={{
                    height: isWalking ? `${20 + Math.random() * 80}%` : '10%',
                    animation: isWalking ? `neural-wave 0.5s ease-in-out ${i * 0.04}s infinite alternate` : 'none'
                  }}
                />
              ))}
            </div>
          )}

          {currentEvent ? (
            <div className="relative z-10 animate-in zoom-in-95 duration-300 text-center flex flex-col items-center w-full max-w-[240px]">
                <div className="relative mb-6">
                  <div className={`absolute inset-0 blur-3xl opacity-30 animate-pulse ${currentEvent.isDanger ? 'bg-red-600' : 'bg-amber-400'}`} />
                  <div className={`relative p-8 bg-slate-900/90 border-2 ${currentEvent.isDanger ? 'border-red-500' : 'border-amber-500'}`}>
                     {currentEvent.isDanger ? <Swords size={40} className="text-red-500" /> : <Star size={40} className="text-amber-400" />}
                  </div>
                </div>
                <h3 className="text-lg font-black text-white uppercase italic tracking-tighter mb-3">{currentEvent.title}</h3>
                <div className="bg-black/60 p-3 border-l-4 border-amber-500 border border-white/5">
                  <p className="text-amber-100/70 text-[10px] italic leading-relaxed">"{currentEvent.description}"</p>
                </div>
            </div>
          ) : (
            <div className="relative z-10 text-center flex flex-col items-center gap-6">
              <Loader2 size={32} className={isWalking ? "animate-spin text-amber-500" : "text-slate-800 opacity-20"} />
              <p className="text-[8px] font-black uppercase tracking-[0.4em] text-amber-500/40 italic">
                  {isWalking ? "SCANNING_PATH..." : "SYSTEM_IDLE"}
              </p>
            </div>
          )}
        </div>

        {/* ⚡ Mobile-Optimized Control Group */}
        <div className="flex flex-col gap-3">
          
          {/* 🔋 ENERGY BAR - Compact on Mobile */}
          {targetElement !== 'ALL' && (
            <div className="px-1 animate-in slide-in-from-top-2 duration-300">
              <div className="flex justify-between items-end mb-1">
                 <div className="flex items-center gap-1.5">
                    <Radio size={12} className="text-lime-400 animate-pulse" />
                    <span className="text-[8px] font-black text-lime-400 uppercase italic tracking-widest">Locked: {targetElement}</span>
                 </div>
                 <span className="text-[10px] font-black text-white italic">{tuningEnergy}%</span>
              </div>
              <div className="h-1.5 w-full bg-slate-900 border border-white/5 overflow-hidden">
                 <div className="h-full bg-lime-500 transition-all duration-500" style={{ width: `${tuningEnergy}%` }} />
              </div>
            </div>
          )}

          {/* 📡 DESKTOP TUNING (Hidden on Mobile) */}
          <div className="hidden md:block bg-slate-900/40 p-5 border border-white/10">
            <div className="grid grid-cols-3 gap-2"> 
              {elements.map((el) => (
                <button key={el.id} onClick={() => handleTuneClick(el.id)}
                  className={`flex flex-col items-center py-4 border-2 transition-all relative ${targetElement === el.id ? `bg-white/10 ${el.color} border-white` : 'bg-black/40 border-white/5 text-slate-600 hover:border-white/20'}`}>
                  <el.icon size={18} />
                  <span className="text-[8px] font-black mt-2 tracking-widest uppercase">{el.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* 🕹️ MAIN CONTROLS - RE-DESIGNED FOR MOBILE */}
          <div className="flex gap-2 h-24 md:h-28">
              {/* Back/Exit Button */}
              <button onClick={onBack} className="w-16 md:w-20 bg-slate-900 border border-white/10 flex flex-col items-center justify-center text-slate-500">
                <ChevronLeft size={20} />
                <span className="text-[7px] font-black uppercase tracking-tighter">Exit</span>
              </button>

              {/* 📱 Mobile Tuning Trigger (NEW) */}
              <button 
                onClick={() => setIsTuningOpen(true)}
                className={`md:hidden w-20 flex flex-col items-center justify-center border-2 transition-all relative
                  ${targetElement === 'ALL' ? 'border-white/10 bg-slate-900 text-slate-400' : `border-white bg-white/10 ${currentElementObj.color}`}
                `}
              >
                <currentElementObj.icon size={24} className={targetElement !== 'ALL' ? 'animate-pulse' : ''} />
                <span className="text-[7px] font-black mt-1 uppercase tracking-tighter">{targetElement === 'ALL' ? 'Tuning' : 'Locked'}</span>
              </button>

              {/* Step Button - Primary Action */}
              <button 
                onClick={() => { if (typeof setCurrentEvent === 'function') setCurrentEvent(null); onStep(); }}
                disabled={isWalking} 
                className="flex-1 relative rounded-none overflow-hidden border-2 border-amber-500 shadow-2xl bg-slate-950"
              >
                {isWalking && (
                  <div className="absolute inset-y-0 left-0 bg-amber-500 z-10" style={{ width: `${walkProgress}%` }} />
                )}
                <div className="relative z-20 h-full flex flex-col items-center justify-center">
                  <span className={`font-black text-xl md:text-2xl uppercase italic tracking-tighter ${isWalking ? 'text-slate-950' : 'text-amber-500'}`}>
                    {isWalking ? "SYNCHRONIZING" : "INITIATE_STEP"}
                  </span>
                  <div className={`flex items-center gap-1.5 mt-0.5 ${isWalking ? 'text-slate-950/70' : 'text-slate-600'}`}>
                    <Activity size={10} />
                    <span className="text-[8px] font-black uppercase tracking-[0.2em]">Neural_Path_Scan</span>
                  </div>
                </div>
              </button>
          </div>
        </div>
      </div>

      {/* 📡 TUNING POPUP MODAL (NEW FOR MOBILE) */}
      {isTuningOpen && (
        <div className="fixed inset-0 z-[3000] flex items-end md:items-center justify-center p-0 md:p-4">
          <div className="absolute inset-0 bg-slate-950/90 backdrop-blur-md" onClick={() => setIsTuningOpen(false)} />
          <div className="relative w-full max-w-md bg-slate-900 border-t-4 md:border-2 border-amber-500 animate-in slide-in-from-bottom duration-300">
            <div className="p-4 border-b border-white/5 flex justify-between items-center bg-black/40">
               <div className="flex items-center gap-2">
                 <Settings2 size={16} className="text-amber-500" />
                 <h3 className="text-xs font-black text-white uppercase italic tracking-widest">Neural_Tuning_Interface</h3>
               </div>
               <button onClick={() => setIsTuningOpen(false)} className="p-2 text-slate-500 hover:text-white"><X size={20} /></button>
            </div>
            <div className="p-4 grid grid-cols-3 gap-2 bg-slate-900">
              {elements.map((el) => {
                const isActive = targetElement === el.id;
                const isError = errorTarget === el.id;
                return (
                  <button key={el.id} onClick={() => handleTuneClick(el.id)}
                    className={`flex flex-col items-center justify-center py-5 border-2 transition-all relative
                      ${isActive ? `bg-white/10 ${el.color} border-white shadow-[0_0_15px_rgba(255,255,255,0.1)]` : 'bg-black/40 border-white/5 text-slate-600'}
                      ${isError ? 'border-red-500 bg-red-500/30 animate-error' : ''}
                    `}
                  >
                    {el.id !== 'ALL' && (
                      <div className="absolute top-1 right-1 text-[6px] font-black px-1 bg-slate-800 text-slate-500 border border-white/5">1C</div>
                    )}
                    <el.icon size={22} />
                    <span className="text-[8px] font-black mt-2 uppercase tracking-tighter">{el.label}</span>
                  </button>
                );
              })}
            </div>
            <div className="p-4 bg-black/40 text-[9px] text-slate-500 text-center uppercase tracking-[0.2em] italic border-t border-white/5">
              Tuning requires 1 Neural Cell for 100 steps
            </div>
          </div>
        </div>
      )}

      {/* 🔍 [SYSTEM DEBUG] */}
      <div className="flex justify-center pt-2 md:pt-4 border-t border-white/5">
         <button onClick={() => setShowDebug(!showDebug)} className="text-[7px] md:text-[9px] font-black text-slate-600 uppercase hover:text-white transition-colors tracking-[0.2em]">
           {showDebug ? "// CLOSE_DEBUG" : "// SYSTEM_DEBUG"}
         </button>
      </div>

      {showDebug && (
        <div className="bg-black/80 border border-amber-500/30 p-4 font-mono text-[10px] text-amber-500/80 space-y-1 animate-in slide-in-from-bottom-2">
           <p>SYNC_PROGRESS: {walkProgress}%</p>
           <p>ENGINE_STATE: {onStep ? "CONNECTED" : "FAILED"}</p>
        </div>
      )}

      {/* ℹ️ SYSTEM PROTOCOL (Modal) - คงเดิมแต่ปรับสเกล */}
      {showInfo && (
        <div className="fixed inset-0 z-[4000] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-950/98 backdrop-blur-xl" onClick={() => setShowInfo(false)} />
          <div className="relative w-full max-w-sm bg-slate-900 border-2 border-amber-500/50 p-1">
             <div className="bg-slate-950 p-6 space-y-6">
                <div className="flex justify-between items-start">
                   <div className="p-2 bg-amber-500/10 border border-amber-500/20 text-amber-500"><Settings2 size={20} /></div>
                   <button onClick={() => setShowInfo(false)} className="text-slate-500 hover:text-white"><X size={24}/></button>
                </div>
                <div className="space-y-4">
                   <div className="p-4 bg-black/60 border border-white/10">
                     <p className="text-[9px] font-black text-blue-400 uppercase italic mb-1">🛰️ AUTO MODE</p>
                     <p className="text-[10px] text-slate-400">เปลี่ยนธาตุตามพื้นที่ทุก 375 ก้าว</p>
                   </div>
                   <div className="p-4 bg-black/60 border border-white/10">
                     <p className="text-[9px] font-black text-lime-400 uppercase italic mb-1">🔋 TUNING MODE</p>
                     <p className="text-[10px] text-slate-400">ใช้ 1 Cell ล็อคธาตุ 100 ก้าว</p>
                   </div>
                </div>
                <button onClick={() => setShowInfo(false)} className="w-full py-4 bg-amber-600 text-slate-950 font-black uppercase text-[10px]">Close</button>
             </div>
          </div>
        </div>
      )}

      <style jsx>{` 
        @keyframes neural-wave { 0% { transform: scaleY(0.5); opacity: 0.3; } 100% { transform: scaleY(1.3); opacity: 1; } } 
        @keyframes error-shake { 0%, 100% { transform: translateX(0); } 25% { transform: translateX(-4px); } 75% { transform: translateX(4px); } }
        .animate-error { animation: error-shake 0.2s ease-in-out infinite; }
      `}</style>
    </div>
  );
}