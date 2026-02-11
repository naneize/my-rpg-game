import React, { useState } from 'react'; 
import { 
  Skull, ChevronRight, Activity, Trophy, Timer, Zap, Flame, 
  Droplets, Wind, Mountain, Sun, Moon, Biohazard, Radio, 
  Info, X, BarChart3, Target, ShieldCheck, AlertCircle, Swords,
  Cpu, Database
} from 'lucide-react';

export default function MapSelectionView({ 
  playerLevel, 
  worldEvent, 
  onChallengeWorldBoss, 
  onSelectMap, 
  respawnTimeLeft,
  totalSteps = 0,
  elementalMastery = {} 
}) {
  const [showInfo, setShowInfo] = useState(false);
  const currentLvl = Number(playerLevel || 1);
  const totalKillsCount = Object.values(elementalMastery).reduce((sum, el) => sum + (el.totalKills || 0), 0);

  const formatTime = (seconds) => {
    if (seconds === null || isNaN(seconds)) return "15:00"; 
    if (seconds <= 0) return "00:00"; 
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const elementConfig = {
    fire: { label: 'FIRE', icon: <Flame size={14} />, color: 'text-red-500', border: 'border-red-500/20', bg: 'bg-red-500/5', desc: 'Thermal energy detected.' },
    water: { label: 'WATER', icon: <Droplets size={14} />, color: 'text-cyan-400', border: 'border-cyan-400/20', bg: 'bg-cyan-400/5', desc: 'Fluid dynamics stable.' },
    wind: { label: 'WIND', icon: <Wind size={14} />, color: 'text-emerald-400', border: 'border-emerald-400/20', bg: 'bg-emerald-400/5', desc: 'Atmospheric pressure normal.' },
    earth: { label: 'EARTH', icon: <Mountain size={14} />, color: 'text-orange-700', border: 'border-orange-700/20', bg: 'bg-orange-700/5', desc: 'Seismic integrity verified.' },
    steel: { label: 'STEEL', icon: <Cpu size={14} />, color: 'text-slate-300', border: 'border-slate-300/20', bg: 'bg-slate-300/5', desc: 'Neural metal integration.' },
    light: { label: 'LIGHT', icon: <Sun size={14} />, color: 'text-yellow-300', border: 'border-yellow-300/20', bg: 'bg-yellow-300/5', desc: 'Photon emission peak.' },
    dark: { label: 'DARK', icon: <Moon size={14} />, color: 'text-purple-500', border: 'border-purple-500/20', bg: 'bg-purple-500/5', desc: 'Void frequency matched.' },
    poison: { label: 'POISON', icon: <Biohazard size={14} />, color: 'text-lime-500', border: 'border-lime-500/20', bg: 'bg-lime-500/5', desc: 'Toxic concentration high.' },
  };

  return (
    // 🛠️ แก้ไข: เปลี่ยน h-screen เป็น h-auto และคุม max-width ให้ไม่บานเกินไป
    <div className="p-4 lg:p-6 space-y-6 max-w-[1200px] mx-auto min-h-screen flex flex-col animate-in fade-in duration-1000 select-none font-sans overflow-x-hidden">
      
      {/* 🔝 1. COMPACT TOP HEADER */}
      <div className="flex flex-row items-center justify-between gap-4 bg-slate-900/40 p-4 rounded-[2.5rem] border border-white/5 backdrop-blur-md shrink-0">
        <div className="flex items-center gap-4 sm:gap-6">
          <h2 className="text-3xl md:text-5xl font-black italic uppercase tracking-tighter text-white leading-none">
            Neural <span className="text-amber-500">Stream</span>
          </h2>
          <div className="flex flex-col">
            <p className="text-[8px] font-bold text-slate-500 tracking-[0.4em] uppercase flex items-center gap-1">
              <Radio size={10} className="text-emerald-500 animate-pulse" /> Sector: 01_NEON
            </p>
            <button 
              onClick={() => setShowInfo(true)} 
              className="flex items-center gap-2 text-blue-400 bg-blue-500/10 hover:bg-blue-500/20 px-3 py-1.5 rounded-xl border border-blue-500/20 transition-all mt-1 group"
            >
              <Info size={14} className="group-hover:rotate-12 transition-transform" />
              <span className="text-[10px] font-black uppercase tracking-widest whitespace-nowrap">View System Manual & Stats</span>
            </button>
          </div>
        </div>

        <div className="flex gap-3">
          <div className="px-4 py-2 bg-slate-950/50 rounded-xl border border-white/5 text-center">
            <p className="text-[7px] font-black text-slate-500 uppercase mb-0.5">Steps</p>
            <p className="text-lg font-black text-white font-mono leading-none">{totalSteps.toLocaleString()}</p>
          </div>
          <div className="px-4 py-2 bg-slate-950/50 rounded-xl border border-white/5 text-center">
            <p className="text-[7px] font-black text-slate-500 uppercase mb-0.5">Sync_LV</p>
            <p className="text-lg font-black text-amber-500 font-mono leading-none">{currentLvl}</p>
          </div>
        </div>
      </div>

      {/* 🚀 2. CENTER SECTION: ACTION & BOSS */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 shrink-0">
        <div className="lg:col-span-7">
          <button 
            onClick={() => onSelectMap({ id: 'meadow' })}
            className="group relative w-full h-full min-h-[110px] active:scale-[0.98] transition-all duration-300"
          >
            <div className="absolute -inset-1 bg-gradient-to-r from-amber-600 to-amber-400 rounded-[2.5rem] blur opacity-10 group-hover:opacity-20 transition"></div>
            <div className="relative h-full overflow-hidden rounded-[2.5rem] bg-slate-950 border border-white/10 p-1">
              <div className="h-full bg-slate-900/40 rounded-[2.3rem] flex items-center justify-between px-8 py-6 hover:bg-slate-900/60 transition-colors">
                <div className="text-left">
                  <p className="text-[12px] font-black text-amber-500 uppercase tracking-[0.4em] mb-1 italic text-balance">SYSTEM READY !</p>
                  <h3 className="text-2xl md:text-5xl font-black text-white italic uppercase tracking-tighter leading-tight">START JOURNEY</h3>
                </div>
                <div className="w-14 h-14 md:w-16 md:h-16 rounded-2xl bg-amber-500 flex items-center justify-center text-slate-950 shadow-lg group-hover:rotate-12 transition-all shrink-0">
                  <ChevronRight size={40} strokeWidth={4} />
                </div>
              </div>
            </div>
          </button>
        </div>

        <div className="lg:col-span-5">
          {worldEvent && (
            <div className="h-full min-h-[110px]">
              {worldEvent.active ? (
                <div onClick={onChallengeWorldBoss} className="relative h-full overflow-hidden rounded-[2.5rem] bg-slate-950 border border-red-500/40 p-1 cursor-pointer group shadow-[0_0_20px_rgba(239,68,68,0.2)] hover:border-red-500/60 transition-all duration-500">
                  <div className="absolute inset-0 bg-gradient-to-r from-red-600/10 via-rose-500/10 to-red-600/10 group-hover:opacity-100 transition animate-shimmer" style={{ backgroundSize: '200% 100%' }}></div>
                  <div className="relative z-10 p-4 flex flex-col justify-center h-full space-y-3">
                    <div className="flex items-center justify-between gap-2 bg-red-600/20 px-4 py-2 rounded-full border border-red-500/30">
                      <Swords size={12} className="text-red-500 animate-pulse" />
                      <p className="text-[10px] font-black text-red-100 uppercase italic">ERADICATE WORLD BOSS NOW!</p>
                      <Swords size={12} className="text-red-500 animate-pulse" />
                    </div>
                    <div className="flex items-center gap-4 px-2">
                      <div className="relative shrink-0">
                        <img src="/monsters/black_dragon_banner.png" alt="Boss" className="w-14 h-14 object-contain group-hover:scale-110 transition-transform" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-end mb-1">
                            <h4 className="text-lg font-black text-white italic uppercase truncate leading-none">{worldEvent.name}</h4>
                            <span className="text-[10px] font-mono text-red-500 font-black">{((worldEvent.currentHp / worldEvent.maxHp) * 100).toFixed(1)}%</span>
                        </div>
                        <div className="h-2 w-full bg-slate-900 rounded-full border border-white/5 overflow-hidden">
                           <div className="h-full bg-gradient-to-r from-red-600 to-amber-500 transition-all duration-1000" style={{ width: `${(worldEvent.currentHp / worldEvent.maxHp) * 100}%` }} />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="h-full flex flex-col items-center justify-center p-6 rounded-[2.5rem] bg-slate-900/40 border border-white/5 text-center">
                   <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest italic mb-1">Reconstructing Matrix</p>
                   <div className="text-3xl font-black text-white font-mono italic">{formatTime(respawnTimeLeft)}</div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* 📊 3. SYSTEM CORE MASTERY - 🛠️ แก้ไข: ลบ flex-1 ออกเพื่อให้สูงตามเนื้อหา */}
      <section className="bg-slate-900/40 p-6 rounded-[3rem] border border-white/5 backdrop-blur-md relative overflow-hidden group">
        
        {/* 🏷️ Game Metadata Overlay */}
        <div className="absolute top-4 right-8 flex items-center gap-4 opacity-20 group-hover:opacity-60 transition-opacity">
            <div className="text-right">
                <p className="text-[8px] font-black text-amber-500 uppercase tracking-widest italic leading-none">Early Access Alpha</p>
                <p className="text-[10px] font-mono text-white font-black">v0.0.1_NEURAL_STREAM</p>
            </div>
            <div className="h-8 w-px bg-white/10" />
            <Database size={16} className="text-slate-500" />
        </div>

        <div className="flex justify-between items-center mb-6 px-2">
           <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em] flex items-center gap-2">
             <BarChart3 size={14} className="text-blue-500" /> System Core Mastery
           </h3>
           <div className="mr-40 hidden lg:block"> {/* กันที่ไว้ไม่ให้ทับกับ Metadata */}
             <span className="text-[8px] font-black text-slate-500 font-mono uppercase tracking-widest">Eradication: {totalKillsCount.toLocaleString()}</span>
           </div>
        </div>
        
        {/* 🛠️ ปรับ Grid ให้กะทัดรัด (Compact) */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
          {Object.keys(elementConfig).map((el) => {
            const data = elementalMastery[el] || { level: 1, kills: 0 };
            const config = elementConfig[el];
            return (
              <div key={el} className={`relative p-4 rounded-[2rem] border ${config.border} ${config.bg} flex flex-col gap-3 group/card transition-all hover:bg-white/5 hover:translate-y-[-2px] shadow-lg`}>
                <div className="flex justify-between items-start">
                  <div className={`p-2 rounded-xl bg-slate-950 border ${config.border} ${config.color}`}>
                    {config.icon}
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-black text-white italic leading-none">LV.{data.level}</p>
                    <p className="text-[6px] text-slate-500 uppercase font-black mt-1">Core</p>
                  </div>
                </div>
                
                <p className="text-[8px] text-slate-400 font-bold leading-tight uppercase italic min-h-[32px] opacity-60 group-hover/card:opacity-100 transition-opacity">
                  {config.desc}
                </p>
                
                <div className="space-y-1.5">
                  <div className="flex justify-between text-[7px] font-black uppercase tracking-tighter">
                     <span className={config.color}>{config.label}</span>
                     <span className="text-white/40 font-mono">{data.kills}/100</span>
                  </div>
                  <div className="h-1.5 w-full bg-black/50 rounded-full overflow-hidden border border-white/5">
                    <div 
                      className={`h-full transition-all duration-700 ${config.color.replace('text', 'bg')} shadow-[0_0_8px_current]`}
                      style={{ width: `${Math.min(data.kills, 100)}%` }}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 🛠️ 4. FOOTER */}
      <div className="flex flex-row items-center justify-between gap-2 px-8 py-4 opacity-40 shrink-0 border-t border-white/5">
        <div className="flex items-center gap-6">
          <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
            <Activity size={12} className="text-emerald-500" /> Neural Link Stable
          </p>
          <div className="h-4 w-px bg-white/10" />
          <p className="text-[10px] font-black text-amber-500/60 uppercase tracking-widest italic">
             Neural Stream Protocol
          </p>
        </div>
        <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest font-mono">
          SYS_BUILD: <span className="text-white">0.0.1_BETA</span>
        </div>
      </div>

      {/* 🧠 MODAL: SYSTEM INTELLIGENCE (คงเดิม) */}
      {showInfo && (
        <div className="fixed inset-0 z-[2000] flex items-center justify-center p-4 backdrop-blur-2xl animate-in zoom-in duration-300">
          <div className="absolute inset-0 bg-slate-950/80" onClick={() => setShowInfo(false)} />
          <div className="relative w-full max-w-2xl bg-slate-900 border border-white/10 rounded-[3rem] shadow-2xl overflow-hidden">
             {/* เนื้อหา Modal เดิมของหนู แม่คงไว้ให้ครบค่ะ */}
             <div className="p-8 text-center text-white">
                <button onClick={() => setShowInfo(false)} className="absolute top-6 right-6 text-slate-500 hover:text-white"><X size={24} /></button>
                <h2 className="text-3xl font-black italic uppercase mb-6">System Intelligence</h2>
                <div className="grid grid-cols-2 gap-4 mb-8 text-left">
                    <div className="p-6 rounded-2xl bg-black/40 border border-white/5">
                        <p className="text-[10px] text-slate-500 uppercase font-black mb-1">Total Eradication</p>
                        <p className="text-3xl font-mono font-black text-white">{totalKillsCount.toLocaleString()}</p>
                    </div>
                    <div className="p-6 rounded-2xl bg-black/40 border border-white/5">
                        <p className="text-[10px] text-slate-500 uppercase font-black mb-1">Total Neural Steps</p>
                        <p className="text-3xl font-mono font-black text-amber-500">{totalSteps.toLocaleString()}</p>
                    </div>
                </div>
                <button onClick={() => setShowInfo(false)} className="w-full py-4 bg-amber-500 text-slate-950 font-black rounded-2xl uppercase text-sm hover:bg-amber-400">Close Data Stream</button>
             </div>
          </div>
        </div>
      )}
    </div>
  );
}