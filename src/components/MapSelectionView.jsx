import React, { useState } from 'react'; 
import { 
  Skull, ChevronRight, Activity, Trophy, Timer, Zap, Flame, 
  Droplets, Wind, Mountain, Sun, Moon, Biohazard, Radio, 
  Info, X, BarChart3, Target, ShieldCheck, AlertCircle, Swords
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
    fire: { label: 'FIRE', icon: <Flame size={16} />, color: 'text-red-500', border: 'border-red-500/20', bg: 'bg-red-500/5', desc: 'Thermal energy detected. Optimizing offensive output.' },
    water: { label: 'WATER', icon: <Droplets size={16} />, color: 'text-cyan-400', border: 'border-cyan-400/20', bg: 'bg-cyan-400/5', desc: 'Fluid dynamics stable. Enhancing regenerative flow.' },
    wind: { label: 'WIND', icon: <Wind size={16} />, color: 'text-emerald-400', border: 'border-emerald-400/20', bg: 'bg-emerald-400/5', desc: 'Atmospheric pressure normal. Increasing reflex sync.' },
    earth: { label: 'EARTH', icon: <Mountain size={16} />, color: 'text-orange-700', border: 'border-orange-700/20', bg: 'bg-orange-700/5', desc: 'Seismic integrity verified. Fortifying defensive core.' },
    light: { label: 'LIGHT', icon: <Sun size={16} />, color: 'text-yellow-300', border: 'border-yellow-300/20', bg: 'bg-yellow-300/5', desc: 'Photon emission peak. Amplifying precision strikes.' },
    dark: { label: 'DARK', icon: <Moon size={16} />, color: 'text-purple-500', border: 'border-purple-500/20', bg: 'bg-purple-500/5', desc: 'Void frequency matched. Disrupting enemy patterns.' },
    poison: { label: 'POISON', icon: <Biohazard size={16} />, color: 'text-lime-500', border: 'border-lime-500/20', bg: 'bg-lime-500/5', desc: 'Toxic concentration high. Analyzing debuff efficiency.' },
  };

  return (
    <div className="p-4 lg:p-6 space-y-6 max-w-[1600px] mx-auto min-h-full flex flex-col animate-in fade-in duration-1000 overflow-y-auto overflow-x-hidden custom-scrollbar pb-24">
      
      {/* 🔝 1. COMPACT TOP HEADER */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-slate-900/40 p-4 rounded-[2rem] border border-white/5 backdrop-blur-md">
        <div className="flex items-center gap-4 sm:gap-6">
          <h2 className="text-3xl md:text-5xl font-black italic uppercase tracking-tighter text-white leading-none">
            Neural <span className="text-amber-500">Stream</span>
          </h2>
          {/* ปรับส่วนนี้: เอา hidden ออกเพื่อให้โชว์ในมือถือด้วย แต่ใช้ flex-col เพื่อรักษาเลเยอร์ */}
          <div className="flex flex-col">
            <p className="text-[8px] font-bold text-slate-500 tracking-[0.4em] uppercase flex items-center gap-1">
              <Radio size={10} className="text-emerald-500 animate-pulse" /> Sector: 01_NEON
            </p>
            {/* ปุ่ม Intel: ปรับสีพื้นหลังนิดหน่อยในมือถือเพื่อให้กดง่ายขึ้น */}
            <button 
              onClick={() => setShowInfo(true)} 
              className="flex items-center gap-1.5 text-blue-400 bg-blue-500/5 sm:bg-transparent px-2 py-0.5 rounded-full sm:p-0 border border-blue-500/10 sm:border-none hover:text-blue-300 transition-all mt-1"
            >
              <Info size={12} />
              <span className="text-[8px] font-black uppercase tracking-widest whitespace-nowrap">System Intelligence</span>
            </button>
          </div>
        </div>

        <div className="flex gap-3">
          <div className="px-4 py-2 bg-slate-950/50 rounded-xl border border-white/5">
            <p className="text-[7px] font-black text-slate-500 uppercase mb-0.5">Steps</p>
            <p className="text-lg font-black text-white font-mono leading-none">{totalSteps.toLocaleString()}</p>
          </div>
          <div className="px-4 py-2 bg-slate-950/50 rounded-xl border border-white/5">
            <p className="text-[7px] font-black text-slate-500 uppercase mb-0.5">Sync_LV</p>
            <p className="text-lg font-black text-amber-500 font-mono leading-none">{currentLvl}</p>
          </div>
        </div>
      </div>

      {/* 🚀 2. CENTER SECTION: ACTION & BOSS */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 shrink-0">
        <div className="lg:col-span-7">
          <button 
            onClick={() => onSelectMap({ id: 'endless' })}
            className="group relative w-full h-full min-h-[110px] active:scale-[0.98] transition-all duration-300"
          >
            <div className="absolute -inset-1 bg-gradient-to-r from-amber-600 to-amber-400 rounded-[2rem] blur opacity-10 group-hover:opacity-20 transition"></div>
            <div className="relative h-full overflow-hidden rounded-[2rem] bg-slate-950 border border-white/10 p-1">
              <div className="h-full bg-slate-900/40 rounded-[1.8rem] flex items-center justify-between px-8 py-6 hover:bg-slate-900/60 transition-colors">
                <div className="text-left text-balance max-w-[70%]">
                  <p className="text-[12px] font-black text-amber-500 uppercase tracking-[0.4em] mb-1 italic">ระบบพร้อมแล้ว !</p>
                  <h3 className="text-2xl md:text-5xl font-black text-white italic uppercase tracking-tighter leading-tight">ออกผจญภัย</h3>
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
                <div onClick={onChallengeWorldBoss} className="relative h-full overflow-hidden rounded-[2rem] bg-slate-950 border border-red-500/40 p-1 cursor-pointer group shadow-[0_0_20px_rgba(239,68,68,0.2)] hover:border-red-500/60 transition-all duration-500">
    {/* Animated Background Shimmer */}
    <div className="absolute inset-0 bg-gradient-to-r from-red-600/10 via-rose-500/10 to-red-600/10 group-hover:opacity-100 transition duration-1000 animate-shimmer" style={{ backgroundSize: '200% 100%' }}></div>
    
    <div className="relative z-10 p-3 flex flex-col justify-center h-full text-left space-y-2">
      {/* Alert Badge */}
      <div className="flex items-center justify-between gap-2 bg-gradient-to-r from-red-600/20 to-red-900/20 px-4 py-2 rounded-full border border-red-500/30 w-full shadow-[inset_0_0_10px_rgba(239,68,68,0.1)]">
        {/* ดาบอันหน้า */}
        <Swords size={12} className="text-red-500 animate-pulse" />
        
        <p className="text-[9px] md:text-[11px] font-black text-red-100 uppercase tracking-tight italic drop-shadow-[0_0_5px_rgba(239,68,68,0.5)]">
          ช่วยกันกำจัดบอส! อันดับดี ของยิ่งทวีคูณนะ
        </p>
        
        {/* ดาบอันหลัง (เพิ่มใหม่) */}
        <Swords size={12} className="text-red-500 animate-pulse" />
      </div>

                      <div className="flex items-center gap-4">
                        <div className="relative shrink-0">
                          <img src="/monsters/black_dragon_banner.png" alt="Boss" className="relative w-16 h-16 md:w-20 md:h-20 object-contain drop-shadow-2xl group-hover:scale-105 transition-transform duration-700" />
                        </div>
                        <div className="flex-1 space-y-1.5 min-w-0">
                          <div className="flex items-center justify-between gap-2">
                             <h4 className="text-lg md:text-2xl font-black text-white italic uppercase tracking-tighter truncate">{worldEvent.name}</h4>
                             <span className="text-[10px] font-black text-red-500 font-mono italic shrink-0">{((worldEvent.currentHp / worldEvent.maxHp) * 100).toFixed(1)}%</span>
                          </div>
                          <div className="h-2 w-full bg-slate-900 rounded-full border border-white/5 overflow-hidden">
                             <div className="h-full bg-gradient-to-r from-red-600 to-amber-500 transition-all duration-1000 shadow-[0_0_10px_rgba(239,68,68,0.4)]" style={{ width: `${(worldEvent.currentHp / worldEvent.maxHp) * 100}%` }} />
                          </div>
                        </div>
                      </div>
                   </div>
                </div>


              ) : (
                <div className="h-full flex flex-col items-center justify-center p-6 rounded-[2rem] bg-slate-900/40 border border-white/5 text-center">
                   <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest mb-1 italic">Reconstructing Matrix</p>
                   <div className="text-3xl font-black text-white font-mono italic tracking-tight">{formatTime(respawnTimeLeft)}</div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* 📊 3. SYSTEM CORE MASTERY */}
<section className="bg-slate-900/40 p-4 rounded-[2rem] border border-white/5 backdrop-blur-md">
        <div className="flex justify-between items-center mb-2 px-2">
           <h3 className="text-[8px] font-black text-slate-400 uppercase tracking-[0.4em] flex items-center gap-5">
             <BarChart3 size={12} className="text-blue-500" /> System Core Mastery
           </h3>
           <span className="text-[8px] font-bold text-slate-500 font-mono uppercase tracking-widest">Total Eradication: {totalKillsCount.toLocaleString()}</span>
        </div>
        
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-2 overflow-y-auto lg:overflow-visible custom-scrollbar px-1 pb-2 flex-1">
          {Object.keys(elementConfig).map((el) => {
            const data = elementalMastery[el] || { level: 1, kills: 0 };
            const config = elementConfig[el];
            return (
              <div key={el} className={`relative p-4 rounded-[1.5rem] border ${config.border} ${config.bg} flex flex-col justify-between group overflow-hidden shadow-lg min-h-[140px] lg:min-h-0`}>
                <div className="relative z-10 flex flex-col h-full text-left">
                  <div className="flex justify-between items-start mb-2">
                    <div className={`p-1.5 rounded-lg bg-slate-950 border ${config.border} ${config.color}`}>
                      {config.icon}
                    </div>
                    <div className="text-right">
                      <p className="text-xs font-black text-white italic leading-none">LV.{data.level}</p>
                      <p className="text-[6px] text-slate-500 uppercase font-black mt-1 tracking-tighter">Tier_Core</p>
                    </div>
                  </div>
                  
                  <div className="flex-1 my-2">
                    <p className="text-[7px] text-slate-400 font-bold leading-tight uppercase italic opacity-80 lg:opacity-60 lg:group-hover:opacity-100 transition-opacity">
                      {config.desc}
                    </p>
                  </div>
                  
                  <div className="space-y-1 mt-auto">
                    <div className="flex justify-between text-[7px] font-black uppercase">
                       <span className={config.color}>{config.label}</span>
                       <span className="text-white/40 font-mono">{data.kills}/100</span>
                    </div>
                    <div className="h-1.5 w-full bg-black/50 rounded-full overflow-hidden border border-white/5 shadow-inner">
                      <div 
                        className={`h-full transition-all duration-700 ${config.color.replace('text', 'bg')} shadow-[0_0_8px_current]`}
                        style={{ width: `${Math.min(data.kills, 100)}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 🛠️ 4. FOOTER */}
<div className="flex flex-col sm:flex-row items-center justify-between gap-2 px-6 py-4 opacity-40 shrink-0">        <div className="flex items-center gap-4">
          <p className="text-[16px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
            <Activity size={10} className="text-emerald-500" /> Neural Link Stable
          </p>
          <div className="h-3 w-px bg-white/10" />
          <p className="text-[16px] font-black text-amber-500/60 uppercase tracking-widest italic">
            Early Access Alpha
          </p>
        </div>
        <div className="text-[16px] font-black text-amber-500 uppercase tracking-tighter">
          Version   <span className="text-white">0.0.1_NEURAL_STREAM</span>
        </div>
      </div>

      {/* 🧠 MODAL: SYSTEM INTELLIGENCE */}
      {showInfo && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 backdrop-blur-2xl animate-in zoom-in duration-300">
          <div className="absolute inset-0 bg-slate-950/80" onClick={() => setShowInfo(false)} />
          <div className="relative w-full max-w-2xl bg-slate-900 border border-white/10 rounded-[2.5rem] shadow-2xl overflow-hidden">
            <div className="p-6 border-b border-white/5 flex justify-between items-center bg-slate-800/20">
              <div className="flex items-center gap-4 text-left">
                <div className="p-3 rounded-2xl bg-blue-500/20 text-blue-400"><BarChart3 size={24} /></div>
                <div>
                  <h2 className="text-2xl font-black text-white italic uppercase tracking-tighter leading-none">Intelligence Center</h2>
                  <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-1 italic">Tactical Manual & Statistics</p>
                </div>
              </div>
              <button onClick={() => setShowInfo(false)} className="p-3 rounded-full hover:bg-white/5 text-slate-500 transition-colors"><X size={24} /></button>
            </div>
            <div className="p-8 overflow-y-auto space-y-6 max-h-[60vh] custom-scrollbar bg-slate-900 text-left">
              <div className="grid grid-cols-2 gap-6">
                 <div className="p-6 rounded-[2rem] bg-black/40 border border-white/5 shadow-inner">
                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-2">Total Kills</p>
                    <p className="text-3xl font-black text-white font-mono leading-none">{totalKillsCount.toLocaleString()}</p>
                 </div>
                 <div className="p-6 rounded-[2rem] bg-black/40 border border-white/5 shadow-inner">
                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-2">Neural Steps</p>
                    <p className="text-3xl font-black text-amber-500 font-mono leading-none">{totalSteps.toLocaleString()}</p>
                 </div>
              </div>
              <div className="space-y-4">
                {[
                  { icon: <Zap />, title: "Infinity Mastery System", color: "text-amber-500", bg: "bg-amber-500/10", desc: "กำจัดมอนสเตอร์สะสมแต้มทุก 100 Kills เพื่อเพิ่มเลเวลธาตุรวม พลังถาวรจะเพิ่มขึ้นทวีคูณตามเลเวล" },
                  { icon: <Target />, title: "Monster Milestone Bonus", color: "text-emerald-500", bg: "bg-emerald-500/10", desc: "การฆ่ามอนสเตอร์ตัวเดิมครบ 100 ครั้งแรก จะได้รับโบนัสธาตุพิเศษก้อนใหญ่แบบถาวรครั้งเดียว" }
                ].map((item, idx) => (
                  <div key={idx} className="flex gap-4 items-start">
                    <div className={`shrink-0 w-10 h-10 rounded-xl ${item.bg} flex items-center justify-center ${item.color} border border-white/5`}>
                      {React.cloneElement(item.icon, { size: 20 })}
                    </div>
                    <div className="space-y-1">
                      <h4 className={`text-xs font-black uppercase italic ${item.color}`}>{item.title}</h4>
                      <p className="text-[10px] text-slate-400 leading-relaxed font-medium">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="p-6 bg-slate-800/20 border-t border-white/5">
               <button onClick={() => setShowInfo(false)} className="w-full py-4 rounded-xl bg-white/5 hover:bg-white/10 text-white text-[10px] font-black uppercase tracking-[0.4em] transition-all">System_Acknowledged_</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}