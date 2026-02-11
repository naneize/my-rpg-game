import React, { useState, useEffect } from 'react';
import { 
  ChevronRight, Star, Swords, Loader2, Zap, Info, X, ChevronLeft,
  Flame, Droplets, Mountain, Wind, Settings2, BatteryCharging, AlertCircle,
  Database, Activity
} from 'lucide-react'; 

export default function TravelView({ 
  onBack, onStep, currentEvent, isWalking, walkProgress, player, 
  targetElement, tuneToElement, tuningEnergy, currentMap, setCurrentEvent 
}) {
  const [showInfo, setShowInfo] = useState(false);
  const [errorTarget, setErrorTarget] = useState(null); 
  const [showDebug, setShowDebug] = useState(false); 

  // ---------------------------------------------------------
  // 🔍 [ADVANCED DEBUGGER] - คงเดิม
  // ---------------------------------------------------------
  useEffect(() => {
    console.group("🛰️ [TRAVEL_VIEW_DEBUG]");
    console.log("📍 แผนที่ปัจจุบัน:", currentMap?.name || "❌ MISSING");
    console.log("🔋 สถานะพลังงาน:", tuningEnergy);
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
      return;
    }
    if (cellStock <= 0 && tuningEnergy <= 0) {
      setErrorTarget(id);
      setTimeout(() => setErrorTarget(null), 800);
      return;
    }
    tuneToElement(id);
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

  const currentWaveColor = elements.find(el => el.id === targetElement)?.wave || 'bg-amber-500';

  return (
    <div className="max-w-4xl mx-auto space-y-4 pb-32 px-4 pt-4 relative animate-in fade-in duration-500 select-none font-mono">
      
      {/* 🌌 1. TACTICAL HUD HEADER */}
      <div className="flex items-center gap-2 h-16 bg-slate-900/40 border border-white/10 p-1 rounded-none relative">
        <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-amber-500/50" />
        
        <div className="flex-1 h-full px-4 flex flex-col justify-center relative overflow-hidden bg-black/20">
          <div className={`absolute top-0 left-0 w-1 h-full ${zone.color.replace('text', 'bg')}`} />
          <div className="flex items-center gap-2 mb-0.5">
              <span className={zone.color}>{zone.icon}</span>
              <p className="text-[8px] font-black text-slate-500 uppercase tracking-[0.3em] italic leading-none">Scanning_Sector</p>
          </div>
          <h2 className={`text-xs font-black uppercase italic truncate ${zone.color}`}>{currentMap?.name || zone.name}</h2>
        </div>

        <div className={`h-full px-4 flex items-center gap-4 transition-all duration-300 border-l border-white/5 ${errorTarget ? 'bg-red-500/10' : 'bg-black/20'}`}>
          <div className="text-right">
            <p className={`text-[7px] font-black uppercase tracking-widest italic leading-none mb-1 ${errorTarget ? 'text-red-400 animate-pulse' : 'text-emerald-500'}`}>
                {errorTarget ? 'Low_Cells' : 'Neural_Cells'}
            </p>
            <div className="flex items-center justify-end gap-2">
                <span className={`text-sm font-black italic ${errorTarget ? 'text-red-500' : (cellStock > 0 ? "text-white" : "text-slate-600")}`}>
                  {cellStock}
                </span>
                <BatteryCharging size={12} className={cellStock > 0 ? "text-emerald-400" : "text-slate-600"} />
            </div>
          </div>
          <button onClick={() => setShowInfo(true)} className="p-2 bg-white/5 hover:bg-white/10 text-slate-400 active:scale-90 transition-all border border-white/5">
            <Info size={16} />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start">
        
        {/* 🖼️ 2. EXPEDITION SCREEN (Square Frame) */}
        <div className="relative rounded-none border-2 border-white/10 bg-[#020617] p-8 min-h-[300px] md:h-[450px] flex flex-col items-center justify-center shadow-2xl">
          <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-amber-500/40" />
          <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-amber-500/40" />
          
          <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(#3b82f6 1px, transparent 0)', backgroundSize: '24px 24px' }} />

          {!currentEvent && (
            <div className="absolute inset-x-0 bottom-16 flex items-end justify-center gap-1 h-16 opacity-30 px-12">
              {[...Array(24)].map((_, i) => (
                <div
                  key={i}
                  className={`w-1.5 rounded-none ${currentWaveColor} transition-all duration-500 shadow-[0_0_8px_currentColor]`}
                  style={{
                    height: isWalking ? `${20 + Math.random() * 80}%` : '10%',
                    animation: isWalking ? `neural-wave 0.5s ease-in-out ${i * 0.04}s infinite alternate` : 'none'
                  }}
                />
              ))}
            </div>
          )}

          {currentEvent ? (
            <div className="relative z-10 animate-in zoom-in-95 duration-300 text-center flex flex-col items-center w-full max-w-[280px]">
                <div className="relative mb-8">
                  <div className={`absolute inset-0 blur-3xl opacity-30 animate-pulse ${currentEvent.isDanger ? 'bg-red-600' : 'bg-amber-400'}`} />
                  <div className={`relative p-10 bg-slate-900/90 border-2 ${currentEvent.isDanger ? 'border-red-500' : 'border-amber-500 shadow-[0_0_20px_rgba(245,158,11,0.2)]'}`}>
                     {currentEvent.isDanger ? <Swords size={56} className="text-red-500" /> : <Star size={56} className="text-amber-400" />}
                  </div>
                </div>
                <h3 className="text-2xl font-black text-white uppercase italic tracking-tighter mb-4">{currentEvent.title}</h3>
                <div className="bg-black/60 p-4 border-l-4 border-amber-500 border border-white/5">
                  <p className="text-amber-100/70 text-xs italic leading-relaxed">"{currentEvent.description}"</p>
                </div>
            </div>
          ) : (
            <div className="relative z-10 text-center flex flex-col items-center gap-8">
              <Loader2 size={48} className={isWalking ? "animate-spin text-amber-500" : "text-slate-800 opacity-20"} />
              <p className="text-[10px] font-black uppercase tracking-[0.6em] text-amber-500/40 italic">
                  {isWalking ? "SCANNING_PATH..." : "SYSTEM_IDLE"}
              </p>
            </div>
          )}
        </div>

        {/* ⚡ Right Control Group */}
        <div className="space-y-4">
          {/* 🔋 3. ENERGY PROGRESS */}
          {targetElement !== 'ALL' && (
            <div className="px-1 animate-in slide-in-from-top-2 duration-300">
              <div className="flex justify-between items-end mb-2">
                 <div className="flex items-center gap-2">
                    <BatteryCharging size={14} className="text-lime-400 animate-pulse" />
                    <span className="text-[9px] font-black text-lime-400 uppercase tracking-widest italic">Signal_Locked: {targetElement}</span>
                 </div>
                 <span className="text-[11px] font-black text-white font-mono italic">{tuningEnergy}%</span>
              </div>
              <div className="h-2 w-full bg-slate-900 rounded-none border border-white/10 overflow-hidden">
                 <div className="h-full bg-gradient-to-r from-lime-600 to-lime-400 transition-all duration-500"
                   style={{ width: `${tuningEnergy}%` }}
                 />
              </div>
            </div>
          )}

          {/* 📡 4. TUNING HUB (Matrix Style) */}
          <div className="bg-slate-900/40 p-5 rounded-none border border-white/10 relative overflow-hidden">
            <div className="flex items-center justify-between mb-4 px-1">
              <div className="flex items-center gap-2">
                <Settings2 size={12} className="text-slate-500" />
                <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Neural_Override</span>
              </div>
              <div className={`text-[8px] font-black uppercase px-2 py-0.5 border ${targetElement === 'ALL' ? 'text-blue-400 border-blue-400/30' : 'text-orange-500 border-orange-500/30 animate-pulse'}`}>
                 {targetElement === 'ALL' ? 'SCAN_AUTO' : 'FREQ_LOCK'}
              </div>
            </div>
            
            <div className="grid grid-cols-3 gap-2"> 
              {elements.map((el) => {
                const isActive = targetElement === el.id;
                const isError = errorTarget === el.id;
                return (
                  <button
                    key={el.id}
                    onClick={() => handleTuneClick(el.id)}
                    className={`flex flex-col items-center justify-center py-4 rounded-none border-2 transition-all relative
                      ${isActive ? `bg-white/10 ${el.color} border-white shadow-[0_0_15px_rgba(255,255,255,0.1)]` : 'bg-black/40 border-white/5 text-slate-600 hover:border-white/20'}
                      ${isError ? 'border-red-500 bg-red-500/30 animate-error' : ''}
                    `}
                  >
                    {el.id !== 'ALL' && (
                      <div className="absolute top-1 right-1 text-[6px] font-black px-1 bg-slate-800 text-slate-500 border border-white/5">1C</div>
                    )}
                    <el.icon size={18} className={isActive ? "scale-110" : ""} />
                    <span className="text-[8px] font-black mt-2 tracking-widest uppercase font-mono">{el.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 🕹️ 5. NAVIGATION CONTROLS (Ergonomic Bar) */}
          <div className="flex gap-2">
             {/* ปุ่มถอยกลับ - ย้ายมาข้างปุ่มเดินตามคำขอ */}
             <button 
                onClick={onBack}
                className="w-20 bg-slate-900 border border-white/10 flex flex-col items-center justify-center text-slate-400 hover:text-white hover:bg-slate-800 transition-all active:scale-95"
             >
                <ChevronLeft size={24} />
                <span className="text-[8px] font-black uppercase tracking-tighter">Exit</span>
             </button>

             {/* ปุ่มเดินหน้า - ปรับปรุง UI */}
             <button 
                onClick={() => {
                  if (typeof setCurrentEvent === 'function') setCurrentEvent(null);
                  onStep(); 
                }}
                disabled={isWalking} 
                className="flex-1 relative h-28 rounded-none overflow-hidden transition-all active:scale-[0.98] border-2 border-amber-500/40 shadow-2xl disabled:opacity-50 group bg-slate-950"
             >
                {isWalking && (
                  <div className="absolute inset-y-0 left-0 bg-amber-500 shadow-[10px_0_30px_rgba(245,158,11,0.5)] transition-all duration-300 z-10"
                    style={{ width: `${walkProgress}%` }}
                  />
                )}
                <div className="relative z-20 h-full flex items-center justify-center gap-4">
                  <div className="text-center">
                    <span className={`font-black text-2xl uppercase italic tracking-tighter transition-all ${isWalking ? 'text-slate-950' : 'text-amber-500'}`}>
                       {isWalking ? "SYNCHRONIZING..." : "INITIATE_STEP"}
                    </span>
                    <div className={`flex items-center justify-center gap-2 mt-1 ${isWalking ? 'text-slate-950' : 'text-slate-600'}`}>
                      <Activity size={10} />
                      <span className="text-[8px] font-black uppercase tracking-[0.3em]">Neural_Path_Scan</span>
                    </div>
                  </div>
                  {!isWalking && <ChevronRight size={28} className="text-amber-500 group-hover:translate-x-2 transition-transform" />}
                </div>
             </button>
          </div>
        </div>
      </div>

      {/* 🔍 [SYSTEM DEBUG] */}
      <div className="flex justify-center pt-4 border-t border-white/5">
         <button onClick={() => setShowDebug(!showDebug)} className="text-[9px] font-black text-slate-600 uppercase hover:text-white transition-colors tracking-[0.2em]">
           {showDebug ? "// CLOSE_DEBUG_STREAM" : "// OPEN_SYSTEM_DEBUG"}
         </button>
      </div>

      {showDebug && (
        <div className="bg-black/80 border border-amber-500/30 p-4 font-mono text-[10px] text-amber-500/80 space-y-1 animate-in slide-in-from-bottom-2">
           <p className="border-b border-amber-500/20 pb-1 mb-2">PIPELINE_STATUS: 0x42A1</p>
           <p>MAP_UID: {currentMap?.id || "UNDEFINED"}</p>
           <p>SYNC_PROGRESS: {walkProgress}%</p>
           <p>ENGINE: {onStep ? "CONNECTED" : "FAILED"}</p>
        </div>
      )}

      {/* ℹ️ 6. SYSTEM PROTOCOL (Modal) */}
      {showInfo && (
        <div className="fixed inset-0 z-[2000] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-950/98 backdrop-blur-xl" onClick={() => setShowInfo(false)} />
          <div className="relative w-full max-w-sm bg-slate-900 border-2 border-amber-500/50 rounded-none p-1 shadow-2xl animate-in zoom-in-95">
             <div className="bg-slate-950 p-8 space-y-8">
                <div className="flex justify-between items-start">
                   <div className="p-3 bg-amber-500/10 border border-amber-500/20 text-amber-500"><Settings2 size={24} /></div>
                   <button onClick={() => setShowInfo(false)} className="text-slate-500 hover:text-white"><X size={28}/></button>
                </div>
                <div className="space-y-2">
                   <h3 className="text-3xl font-black text-white uppercase italic tracking-tighter">Expedition_Protocol</h3>
                   <p className="text-[10px] text-amber-500 font-bold uppercase tracking-widest border-l-2 border-amber-500 pl-3">Neural_Link v1.0.6</p>
                </div>
                <div className="space-y-4">
                   <div className="p-5 bg-black/60 border border-white/10 space-y-2">
                      <p className="text-[10px] font-black text-blue-400 uppercase italic">🛰️ Dynamic Mode (AUTO)</p>
                      <p className="text-[11px] text-slate-400 leading-relaxed">สลับธาตุตามระยะก้าวอัตโนมัติ ทุกๆ 375 ก้าวตามลูปโซน</p>
                   </div>
                   <div className="p-5 bg-black/60 border border-white/10 space-y-2">
                      <p className="text-[10px] font-black text-lime-400 uppercase italic">🔋 Signal Locked (Tuning)</p>
                      <p className="text-[11px] text-slate-400 leading-relaxed">ใช้ <span className="text-white font-bold">1 Cell</span> เพื่อล็อคธาตุที่ต้องการเป็นเวลา <span className="text-white font-bold">100 ก้าว</span></p>
                   </div>
                </div>
                <button onClick={() => setShowInfo(false)} className="w-full py-5 bg-amber-600 text-slate-950 font-black uppercase text-xs tracking-widest">Close_Protocol</button>
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