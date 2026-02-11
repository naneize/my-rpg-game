import React, { useState, useEffect } from 'react';
import { 
  ChevronRight, Star, Swords, Loader2, Zap, Info, X, ChevronLeft,
  Flame, Droplets, Mountain, Wind, Settings2, BatteryCharging, AlertCircle,
  Database, Activity
} from 'lucide-react'; 

export default function TravelView({ 
  onBack, onStep, currentEvent, isWalking, walkProgress, player, 
  targetElement, tuneToElement, tuningEnergy, currentMap, setCurrentEvent // ✅ รับ setCurrentEvent มาเพื่อเคลียร์ค่า
}) {
  const [showInfo, setShowInfo] = useState(false);
  const [errorTarget, setErrorTarget] = useState(null); 
  const [showDebug, setShowDebug] = useState(false); 

  // ---------------------------------------------------------
  // 🔍 [ADVANCED DEBUGGER]
  // ---------------------------------------------------------
  useEffect(() => {
    console.group("🛰️ [TRAVEL_VIEW_DEBUG]");
    console.log("📍 แผนที่ปัจจุบัน:", currentMap?.name || "❌ MISSING (Undefined)");
    console.log("📋 จำนวนมอนสเตอร์ใน Pool:", currentMap?.monsterPool?.length || 0);
    console.log("🔋 สถานะพลังงาน:", tuningEnergy);
    console.log("🎯 เป้าหมายสัญญาณ:", targetElement);
    console.groupEnd();

    if (!currentMap) {
      console.error("⛔ [CRITICAL ERROR]: currentMap ไม่ได้ส่งมาถึง TravelView!");
    }
  }, [currentMap, targetElement]);

  // 🔋 ดึงจำนวนถ่านจากกระเป๋าผู้เล่น
  const cellStock = player?.inventory?.find(i => i.id === 'neural_cell')?.count || 0;

  // 📍 [Logic] คำนวณโซนตามระยะก้าว
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
    // 🚨 แจ้งเตือนถ้า Cell ไม่พอและพลังงานหมด
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
    <div className="max-w-md md:max-w-4xl mx-auto space-y-5 pb-32 px-4 pt-4 relative animate-in fade-in duration-500 select-none font-sans">
      
      {/* 🌌 1. COMPACT CYBER HUD */}
      <div className="flex items-center gap-2 relative h-16">
        <button 
          onClick={onBack}
          className="bg-amber-500/10 border-2 border-amber-500/50 w-14 h-full rounded-2xl flex flex-col items-center justify-center text-amber-500 hover:bg-amber-500 hover:text-slate-950 active:scale-90 transition-all backdrop-blur-md shadow-[0_0_15px_rgba(245,158,11,0.2)] shrink-0"
        >
          <ChevronLeft size={20} strokeWidth={3} />
          <span className="text-[7px] font-black uppercase mt-0.5 tracking-tighter">Back</span>
        </button>

        <div className="flex-1 bg-slate-900/90 border border-white/5 h-full p-3 rounded-2xl backdrop-blur-md relative overflow-hidden flex flex-col justify-center">
          <div className={`absolute top-0 left-0 w-1 h-full ${zone.color.replace('text', 'bg')}`} />
          <div className="flex items-center gap-1 mb-1">
              <span className={zone.color}>{zone.icon}</span>
              <p className="text-[7px] font-black text-amber-500 uppercase tracking-widest italic leading-none">Current Sector</p>
          </div>
          <h2 className={`text-[10px] font-black uppercase italic truncate ${zone.color}`}>{currentMap?.name || zone.name}</h2>
        </div>

        {/* Neural Cells Display with Error Shake */}
        <div className={`bg-slate-900/90 border h-full px-3 rounded-2xl backdrop-blur-md flex items-center gap-3 transition-all duration-300 shrink-0 ${errorTarget ? 'border-red-500 bg-red-500/20 scale-105 shadow-[0_0_15px_rgba(239,68,68,0.4)]' : 'border-white/5'}`}>
          <div className="text-right">
            <p className={`text-[7px] font-black uppercase tracking-widest italic leading-none mb-1 ${errorTarget ? 'text-red-400 animate-pulse' : 'text-emerald-400'}`}>
                {errorTarget ? 'Insufficient' : 'Neural Cells'}
            </p>
            <div className="flex items-center justify-end gap-1.5">
                <span className={`text-xs font-black font-mono italic ${errorTarget ? 'text-red-500' : (cellStock > 0 ? "text-white" : "text-slate-600")}`}>
                  {cellStock}
                </span>
                {errorTarget ? <AlertCircle size={10} className="text-red-500 animate-bounce" /> : <BatteryCharging size={10} className={cellStock > 0 ? "text-emerald-400" : "text-slate-600"} />}
            </div>
          </div>
          <button onClick={() => setShowInfo(true)} className="p-1.5 bg-white/5 rounded-lg text-slate-500 hover:text-amber-500 active:scale-95 transition-all">
            <Info size={14} />
          </button>
        </div>
      </div>

      {/* 🔄 Middle Layout Wrapper (Responsive Grid) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 items-start">
        
        {/* 🖼️ 2. EXPEDITION SCREEN WITH NEURAL WAVE */}
        <div className="relative overflow-hidden rounded-[2.5rem] border border-amber-500/20 bg-[#020617] p-8 min-h-[280px] md:h-[420px] flex flex-col items-center justify-center shadow-[inset_0_0_40px_rgba(0,0,0,0.7)]">
          <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />
          
          {/* 🌊 Neural Frequency Wave */}
          {!currentEvent && (
            <div className="absolute inset-x-0 bottom-12 flex items-end justify-center gap-[3px] h-12 opacity-30 px-12">
              {[...Array(20)].map((_, i) => (
                <div
                  key={i}
                  className={`w-1 rounded-full ${currentWaveColor} transition-all duration-500 shadow-[0_0_5px_currentColor]`}
                  style={{
                    height: isWalking ? `${20 + Math.random() * 80}%` : '15%',
                    animation: isWalking ? `neural-wave 0.6s ease-in-out ${i * 0.05}s infinite alternate` : 'none'
                  }}
                />
              ))}
            </div>
          )}

          <style>{` 
            @keyframes neural-wave { 0% { opacity: 0.3; transform: scaleY(0.5); } 100% { opacity: 1; transform: scaleY(1.2); } } 
            @keyframes error-shake { 0%, 100% { transform: translateX(0); } 25% { transform: translateX(-4px); } 75% { transform: translateX(4px); } }
            .animate-error { animation: error-shake 0.2s ease-in-out infinite; }
          `}</style>

          {currentEvent ? (
            <div className="relative z-10 animate-in zoom-in-95 duration-300 text-center flex flex-col items-center w-full px-2">
               <div className="relative mb-6">
                  <div className={`absolute inset-[-10px] blur-2xl rounded-full opacity-30 animate-pulse ${currentEvent.isDanger ? 'bg-red-600' : 'bg-amber-400'}`} />
                  <div className={`relative p-7 bg-slate-900/90 rounded-full border-2 ${currentEvent.isDanger ? 'border-red-500/50' : 'border-amber-500/50'}`}>
                     {currentEvent.isDanger ? <Swords size={48} className="text-red-500" /> : <Star size={48} className="text-amber-400" />}
                  </div>
               </div>
               <h3 className="text-2xl font-black text-white uppercase italic tracking-tighter mb-3">{currentEvent.title}</h3>
               <div className="bg-slate-950/60 backdrop-blur-md p-3 rounded-xl border border-white/5 border-l-amber-500 border-l-2">
                  <p className="text-amber-100/80 text-[11px] italic leading-tight">"{currentEvent.description}"</p>
               </div>
            </div>
          ) : (
            <div className="relative z-10 text-center flex flex-col items-center gap-6">
              <Loader2 size={40} className={isWalking ? "animate-spin text-amber-500" : "text-slate-800 opacity-20"} />
              <p className="text-[9px] font-black uppercase tracking-[0.5em] text-amber-500/40 italic">
                  {isWalking ? "Neural Scanning..." : "System Standby"}
              </p>
            </div>
          )}
        </div>

        {/* ⚡ Right Control Group (Energy + Tuning + Action) */}
        <div className="space-y-4">
          {/* 🔋 3. ENERGY PROGRESS BAR */}
          {targetElement !== 'ALL' && (
            <div className="px-1 animate-in slide-in-from-top-2 duration-300">
              <div className="flex justify-between items-end mb-1.5 px-1">
                 <div className="flex items-center gap-2">
                    <BatteryCharging size={12} className="text-lime-400 animate-pulse" />
                    <span className="text-[8px] font-black text-lime-400 uppercase tracking-widest italic tracking-tighter">Signal Lock Active: {targetElement}</span>
                 </div>
                 <span className="text-[10px] font-black text-white font-mono italic">{tuningEnergy}/100</span>
              </div>
              <div className="h-1.5 w-full bg-slate-900 rounded-full border border-white/5 overflow-hidden">
                 <div className="h-full bg-gradient-to-r from-lime-600 to-lime-400 transition-all duration-500 shadow-[0_0_10px_rgba(163,230,53,0.3)]"
                   style={{ width: `${(tuningEnergy / 100) * 100}%` }}
                 />
              </div>
            </div>
          )}

          {/* 📡 4. TUNING HUB */}
          <div className="bg-slate-900/60 p-4 rounded-[2.5rem] border border-white/5 shadow-2xl relative overflow-hidden">
            <div className="flex items-center justify-between px-2 mb-3">
              <div className="flex items-center gap-2">
                <Settings2 size={10} className="text-slate-500" />
                <span className="text-[8px] font-black text-slate-500 uppercase tracking-[0.2em]">Neural Signal Override</span>
              </div>
              <span className={`text-[8px] font-black uppercase italic ${targetElement === 'ALL' ? 'text-blue-400' : 'text-orange-500'}`}>
                 {targetElement === 'ALL' ? 'DYNAMIC_SCAN' : 'SIGNAL_LOCKED'}
              </span>
            </div>
            
            <div className="grid grid-cols-3 gap-2 pb-1"> 
              {elements.map((el) => {
                const isActive = targetElement === el.id;
                const isError = errorTarget === el.id;
                
                return (
                  <button
                    key={el.id}
                    onClick={() => handleTuneClick(el.id)}
                    className={`flex flex-col items-center justify-center py-3 rounded-2xl border-2 transition-all duration-300 relative
                      ${isActive ? `bg-slate-800 ${el.color} border-white/20 scale-95 shadow-[0_0_15px_rgba(255,255,255,0.05)]` : 'bg-slate-950/40 border-white/5 text-slate-600 active:scale-90'}
                      ${isError ? 'border-red-500 bg-red-500/30 animate-error shadow-[0_0_10px_rgba(239,68,68,0.3)]' : ''}
                    `}
                  >
                    {el.id !== 'ALL' && (
                      <div className={`absolute -top-1.5 -right-0.5 text-[5px] font-black px-1 rounded-md border ${cellStock > 0 ? 'bg-lime-500 border-lime-400 text-black' : 'bg-slate-800 border-slate-700 text-slate-500'}`}>1C</div>
                    )}
                    <el.icon size={14} className={isActive ? "animate-pulse" : ""} />
                    <span className="text-[6px] font-black mt-1.5 tracking-tighter uppercase font-mono">{el.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 🕹️ 5. ACTION BUTTON */}
          <button 
            onClick={() => {
              if (typeof setCurrentEvent === 'function') {
                setCurrentEvent(null);
              }
              onStep(); 
            }}
            disabled={isWalking} 
            className="group relative w-full h-24 md:h-28 rounded-[2rem] overflow-hidden transition-all active:scale-[0.98] border-2 border-amber-500/30 shadow-[0_20px_50px_rgba(0,0,0,0.5)] disabled:opacity-50"
          >
            <div className="absolute inset-0 bg-[#0a0f1e]" />
            {isWalking && (
              <div className="absolute inset-y-0 left-0 bg-gradient-to-r from-amber-600 via-amber-400 to-amber-600 shadow-[8px_0_20px_rgba(245,158,11,0.5)] transition-all duration-300 z-10"
                style={{ width: `${walkProgress}%` }}
              />
            )}
            <div className="relative z-20 flex items-center justify-center gap-4 py-5">
              <div className="flex flex-col items-center">
                <span className={`font-black text-xl md:text-2xl uppercase italic tracking-tighter transition-all ${isWalking ? 'text-slate-950 scale-105' : 'text-amber-500'}`}>
                   {isWalking ? "SCANNING PATH..." : "INITIATE STEP"}
                </span>
                <div className="flex items-center gap-1 opacity-40 mt-0.5">
                  <Zap size={8} className="text-amber-500" />
                  <span className="text-[7px] font-black text-white uppercase tracking-[0.3em]">Sector discovery matrix</span>
                </div>
              </div>
              {!isWalking && <ChevronRight size={20} className="text-amber-500 group-hover:translate-x-1 transition-transform" />}
            </div>
          </button>
        </div>
      </div>

      {/* 🔍 [DEBUG PANEL] */}
      <div className="flex justify-center gap-4 pt-4 border-t border-white/5">
         <button 
           onClick={() => setShowDebug(!showDebug)} 
           className="text-[8px] font-black text-slate-600 uppercase tracking-widest hover:text-white transition-colors"
         >
           {showDebug ? "[ Close Debug ]" : "[ Open System Debug ]"}
         </button>
      </div>

      {showDebug && (
        <div className="bg-black/80 border border-amber-500/50 p-3 rounded-xl font-mono text-[9px] text-amber-500 animate-in slide-in-from-bottom-2">
           <div className="flex items-center gap-2 mb-1 border-b border-amber-500/20 pb-1">
             <Database size={10} /> <span>SYSTEM_PIPELINE_STATUS</span>
           </div>
           <p>MAP_ID: {currentMap?.id || "NULL"}</p>
           <p>POOL_SIZE: {currentMap?.monsterPool?.length || 0}</p>
           <p>WALKING: {isWalking ? "TRUE" : "FALSE"}</p>
           <p>PROGRESS: {walkProgress}%</p>
           <div className="flex items-center gap-2 mt-1 text-cyan-400">
             <Activity size={10} /> <span>ENGINE_OK: {onStep ? "CONNECTED" : "DISCONNECTED"}</span>
           </div>
        </div>
      )}

      {/* ℹ️ 6. SYSTEM GUIDE (Modal) */}
      {showInfo && (
        <div className="fixed inset-0 z-[2000] flex items-center justify-center p-6 animate-in fade-in duration-300">
          <div className="absolute inset-0 bg-slate-950/95 backdrop-blur-xl" onClick={() => setShowInfo(false)} />
          <div className="relative w-full max-w-sm bg-slate-900 border-2 border-amber-500/30 rounded-[3rem] p-8 shadow-2xl overflow-hidden ring-1 ring-white/10">
            <div className="relative z-10 space-y-6 text-left">
              <div className="flex justify-between items-center">
                <div className="p-3 bg-amber-500/10 rounded-2xl border border-amber-500/20 text-amber-500"><Settings2 size={24} /></div>
                <button onClick={() => setShowInfo(false)} className="p-2 text-slate-500 hover:text-white"><X size={24}/></button>
              </div>
              <div className="space-y-2">
                <h3 className="text-2xl font-black text-white uppercase italic tracking-tighter">Expedition Protocol</h3>
                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest leading-tight border-l-2 border-amber-500 pl-2">Neural Link v1.0.6 - Deep Meadow</p>
              </div>
              <div className="space-y-4">
                <div className="p-4 bg-slate-950/50 rounded-2xl border border-white/5 space-y-2">
                  <p className="text-[10px] font-black text-blue-400 uppercase italic">🛰️ Dynamic Mode (AUTO)</p>
                  <p className="text-[11px] text-slate-400 leading-relaxed font-medium">สัญญาณแปรผันตามโซนก้าวเดิน: <span className="text-emerald-500">Earth</span> ➔ <span className="text-emerald-400">Wind</span> ➔ <span className="text-orange-500">Fire</span> ➔ <span className="text-cyan-400">Water</span> ทุกๆ 375 ก้าว</p>
                </div>
                <div className="p-4 bg-slate-950/50 rounded-2xl border border-white/5 space-y-2">
                  <p className="text-[10px] font-black text-lime-400 uppercase italic">🔋 Signal Locked (Tuning)</p>
                  <p className="text-[11px] text-slate-400 leading-relaxed font-medium">ใช้ <span className="text-white font-bold">1 Neural Cell</span> เพื่อแฮ็กสัญญาณและล็อคธาตุเป็นเวลา <span className="text-white font-bold font-mono">100 ก้าว</span></p>
                </div>
              </div>
              <button onClick={() => setShowInfo(false)} className="w-full py-5 bg-amber-500 text-slate-950 font-black rounded-[1.5rem] uppercase text-xs hover:bg-amber-400 active:scale-95 transition-all shadow-lg shadow-amber-500/20">Close Protocol</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}