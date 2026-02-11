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
    <div className="p-4 lg:p-6 space-y-6 max-w-[1200px] mx-auto min-h-screen flex flex-col animate-in fade-in duration-1000 select-none font-mono overflow-x-hidden">
      
      {/* 🔝 1. TACTICAL TOP MONITOR (Hard-Edge) */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-slate-900/40 p-6 rounded-none border border-white/10 backdrop-blur-md shrink-0 relative">
        <div className="absolute top-0 left-0 w-8 h-px bg-amber-500" />
        <div className="absolute top-0 left-0 h-8 w-px bg-amber-500" />
        
        <div className="flex items-center gap-4 sm:gap-8">
          <h2 className="text-4xl md:text-5xl font-black italic uppercase tracking-tighter text-white leading-none">
            Neural <span className="text-amber-500">Stream</span>
          </h2>
          <div className="flex flex-col border-l border-white/10 pl-6">
            <p className="text-[9px] font-black text-slate-500 tracking-[0.4em] uppercase flex items-center gap-2 mb-1">
              <Radio size={12} className="text-emerald-500 animate-pulse" /> Sector_01_Neon
            </p>
            <button 
              onClick={() => setShowInfo(true)} 
              className="flex items-center gap-2 text-blue-400 bg-blue-500/5 hover:bg-blue-500/10 px-4 py-2 rounded-none border border-blue-500/20 transition-all group"
            >
              <Info size={14} />
              <span className="text-[10px] font-black uppercase tracking-widest whitespace-nowrap">Access_System_Core</span>
            </button>
          </div>
        </div>

        <div className="flex gap-4">
          <div className="px-5 py-3 bg-black/40 rounded-none border border-white/5 text-center min-w-[100px]">
            <p className="text-[8px] font-black text-slate-600 uppercase mb-1 tracking-widest">Total_Steps</p>
            <p className="text-xl font-black text-white leading-none">{totalSteps.toLocaleString()}</p>
          </div>
          <div className="px-5 py-3 bg-black/40 rounded-none border border-white/5 text-center min-w-[100px]">
            <p className="text-[8px] font-black text-slate-600 uppercase mb-1 tracking-widest">Sync_Rate</p>
            <p className="text-xl font-black text-amber-500 leading-none">LV.{currentLvl}</p>
          </div>
        </div>
      </div>

      {/* 🚀 2. CENTER SECTION: ACTION & BOSS */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 shrink-0">
        <div className="lg:col-span-7">
          <button 
            onClick={() => onSelectMap({ id: 'meadow' })}
            className="group relative w-full h-full min-h-[120px] active:scale-[0.98] transition-all duration-300"
          >
            <div className="relative h-full overflow-hidden rounded-none bg-slate-950 border-2 border-white/10 p-1">
              <div className="h-full bg-slate-900/40 rounded-none flex items-center justify-between px-10 py-8 hover:bg-slate-900/60 transition-colors">
                <div className="text-left">
                  <p className="text-[12px] font-black text-amber-500 uppercase tracking-[0.4em] mb-1 italic">Status: System_Optimal</p>
                  <h3 className="text-3xl md:text-5xl font-black text-white italic uppercase tracking-tighter leading-tight">START</h3>
                </div>
                <div className="w-16 h-16 rounded-none bg-amber-500 flex items-center justify-center text-slate-950 shadow-[0_0_20px_rgba(245,158,11,0.3)] group-hover:translate-x-2 transition-all shrink-0">
                  <ChevronRight size={44} strokeWidth={4} />
                </div>
              </div>
            </div>
          </button>
        </div>

        <div className="lg:col-span-5">
          {worldEvent && (
            <div className="h-full min-h-[120px]">
              {worldEvent.active ? (
                <div onClick={onChallengeWorldBoss} className="relative h-full overflow-hidden rounded-none bg-slate-950 border-2 border-red-500/40 p-1 cursor-pointer group hover:border-red-500 transition-all duration-500">
                  <div className="absolute top-0 right-0 w-12 h-12 border-t-2 border-r-2 border-red-500 opacity-40 group-hover:opacity-100" />
                  <div className="relative z-10 p-5 flex flex-col justify-center h-full space-y-4">
                    <div className="flex items-center justify-between gap-2 bg-red-600/10 px-4 py-1.5 border border-red-500/20">
                      <Swords size={14} className="text-red-500 animate-pulse" />
                      <p className="text-[10px] font-black text-red-500 uppercase italic tracking-widest">Critical_Threat_Detected</p>
                      <Swords size={14} className="text-red-500 animate-pulse" />
                    </div>
                    <div className="flex items-center gap-5">
                      <div className="relative shrink-0 bg-black/40 p-2 border border-white/5">
                        <img src="/monsters/black_dragon_banner.png" alt="Boss" className="w-16 h-16 object-contain group-hover:scale-110 transition-all duration-500" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-end mb-2">
                            <h4 className="text-xl font-black text-white italic uppercase truncate leading-none">{worldEvent.name}</h4>
                            <span className="text-[11px] font-mono text-red-500 font-black">{((worldEvent.currentHp / worldEvent.maxHp) * 100).toFixed(1)}%</span>
                        </div>
                        <div className="h-2.5 w-full bg-black/60 rounded-none border border-white/5 overflow-hidden">
                            <div className="h-full bg-gradient-to-r from-red-600 via-rose-500 to-amber-500 transition-all duration-1000" style={{ width: `${(worldEvent.currentHp / worldEvent.maxHp) * 100}%` }} />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="h-full flex flex-col items-center justify-center p-6 rounded-none bg-slate-900/40 border border-white/10 text-center relative">
                    <div className="absolute top-2 left-2 w-4 h-4 border-t border-l border-white/20" />
                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest italic mb-2">Matrix_Reconstruction</p>
                    <div className="text-4xl font-black text-white font-mono italic tracking-tighter">{formatTime(respawnTimeLeft)}</div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* 📊 3. SYSTEM CORE MASTERY - Tactical Hard-Edge Grid */}
      <section className="bg-slate-900/40 p-8 rounded-none border border-white/10 backdrop-blur-md relative overflow-hidden group">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-blue-500/20 to-transparent" />
        
        {/* 🏷️ Game Metadata Overlay */}
        <div className="absolute top-4 right-10 flex items-center gap-6 opacity-20 group-hover:opacity-60 transition-opacity">
            <div className="text-right">
                <p className="text-[8px] font-black text-amber-500 uppercase tracking-widest italic leading-none mb-1">Early_Access_v0.0.1</p>
                <p className="text-[10px] font-black text-white">SYS_PROTOCOL: NEURAL_STREAM</p>
            </div>
            <Database size={20} className="text-slate-500" />
        </div>

        <div className="flex justify-between items-center mb-10 border-b border-white/10 pb-4">
            <h3 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.5em] flex items-center gap-3">
              <BarChart3 size={16} className="text-blue-500" /> Neural_Core_Mastery
            </h3>
            <div className="hidden lg:block pr-40">
              <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest italic">Eradication_Count: <span className="text-white">{totalKillsCount.toLocaleString()}</span></span>
            </div>
        </div>
        
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-4">
          {Object.keys(elementConfig).map((el) => {
            const data = elementalMastery[el] || { level: 1, kills: 0 };
            const config = elementConfig[el];
            return (
              <div key={el} className={`relative p-5 rounded-none border ${config.border} ${config.bg} flex flex-col gap-4 group/card transition-all hover:bg-white/5 hover:-translate-y-1 shadow-2xl`}>
                <div className="absolute top-0 right-0 w-3 h-3 border-t border-r border-white/20" />
                
                <div className="flex justify-between items-start">
                  <div className={`p-2.5 rounded-none bg-black/60 border ${config.border} ${config.color} shadow-inner`}>
                    {config.icon}
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-black text-white italic leading-none uppercase">LV.{data.level}</p>
                    <p className="text-[7px] text-slate-600 uppercase font-black mt-1 tracking-widest">MODULE</p>
                  </div>
                </div>
                
                <p className="text-[9px] text-slate-500 font-black leading-tight uppercase italic min-h-[36px] opacity-40 group-hover/card:opacity-100 transition-opacity">
                  {config.desc}
                </p>
                
                <div className="space-y-2">
                  <div className="flex justify-between text-[8px] font-black uppercase tracking-tighter italic">
                     <span className={config.color}>{config.label}</span>
                     <span className="text-white/40">{data.kills} / 100</span>
                  </div>
                  <div className="h-2 w-full bg-black/60 rounded-none overflow-hidden border border-white/5">
                    <div 
                      className={`h-full transition-all duration-700 ${config.color.replace('text', 'bg')} shadow-[0_0_10px_current]`}
                      style={{ width: `${Math.min(data.kills, 100)}%` }}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 🛠️ 4. TACTICAL FOOTER */}
      <div className="flex flex-row items-center justify-between gap-4 px-10 py-6 opacity-30 shrink-0 border-t border-white/10">
        <div className="flex items-center gap-8">
          <p className="text-[11px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-3">
            <Activity size={14} className="text-emerald-500" /> Neural_Link: Stable
          </p>
          <div className="h-4 w-px bg-white/20" />
          <p className="text-[11px] font-black text-amber-500/60 uppercase tracking-widest italic">
              Neural_Stream_Protocol_Activated
          </p>
        </div>
        <div className="text-[11px] font-black text-slate-500 uppercase tracking-widest font-mono">
          SYS_BUILD: <span className="text-white">0.0.1_BETA_LABS</span>
        </div>
      </div>

      {/* 🧠 MODAL: SYSTEM CORE INTELLIGENCE */}
      {showInfo && (
        <div className="fixed inset-0 z-[2000] flex items-center justify-center p-4 backdrop-blur-2xl animate-in zoom-in-95 duration-300">
          <div className="absolute inset-0 bg-slate-950/80" onClick={() => setShowInfo(false)} />
          <div className="relative w-full max-w-2xl bg-slate-900 border-2 border-white/10 rounded-none shadow-[0_0_60px_rgba(0,0,0,0.8)] overflow-hidden">
             <div className="absolute top-0 left-0 w-full h-1 bg-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.5)]" />
             <div className="p-10 text-center text-white">
                <button onClick={() => setShowInfo(false)} className="absolute top-6 right-6 text-slate-500 hover:text-white transition-colors"><X size={28} /></button>
                <h2 className="text-4xl font-black italic uppercase mb-8 tracking-tighter">System_Intelligence_Core</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10 text-left">
                    <div className="p-8 rounded-none bg-black/60 border border-white/10 relative">
                        <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-slate-500" />
                        <p className="text-[11px] text-slate-500 uppercase font-black mb-2 tracking-[0.2em]">Total_Neural_Eradication</p>
                        <p className="text-5xl font-mono font-black text-white italic">{totalKillsCount.toLocaleString()}</p>
                    </div>
                    <div className="p-8 rounded-none bg-black/60 border border-white/10 relative">
                        <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-amber-500" />
                        <p className="text-[11px] text-slate-500 uppercase font-black mb-2 tracking-[0.2em]">Total_Neural_Steps</p>
                        <p className="text-5xl font-mono font-black text-amber-500 italic">{totalSteps.toLocaleString()}</p>
                    </div>
                </div>
                <button onClick={() => setShowInfo(false)} className="w-full py-6 bg-amber-600 hover:bg-amber-500 text-slate-950 font-black rounded-none uppercase text-xs tracking-[0.5em] transition-all shadow-lg active:scale-95">Terminate_Data_Stream</button>
             </div>
          </div>
        </div>
      )}
    </div>
  );
}