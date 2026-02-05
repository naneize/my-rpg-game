import React from 'react';
import { Skull, ChevronRight, Lock, MapPin, Activity, ShieldAlert } from 'lucide-react';
import { worldMaps } from '../data/worldMaps';

export default function MapSelectionView({ playerLevel, onSelectMap }) {
  const currentLvl = typeof playerLevel === 'object' 
    ? (playerLevel.level || 1) 
    : (Number(playerLevel) || 1);

  return (
    <div className="max-w-7xl mx-auto p-6 pb-20 animate-in fade-in duration-700">
      
      {/* --- HUD Header --- */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 border-b border-white/10 pb-6 gap-4">
        <div>
          <h2 className="text-4xl md:text-6xl font-black italic uppercase tracking-tighter text-white">
            World <span className="text-amber-500">Navigation</span>
          </h2>
          <p className="text-[10px] font-bold text-slate-500 tracking-[0.3em] uppercase mt-2">
            Select a territory to begin expedition
          </p>
        </div>
        <div className="flex gap-6 items-center bg-slate-900/50 p-4 rounded-2xl border border-white/5 backdrop-blur-sm">
          <div className="text-right">
            <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest">Current Level</p>
            <p className="text-2xl font-black text-amber-500 font-mono">LV.{currentLvl}</p>
          </div>
          <div className="h-10 w-[1px] bg-white/10" />
          <div className="text-right">
            <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest">Active Maps</p>
            <p className="text-2xl font-black text-white font-mono">01<span className="text-slate-600">/06</span></p>
          </div>
        </div>
      </div>

      {/* --- Map List (Vertical Stack / Horizontal Layout) --- */}
      <div className="flex flex-col gap-4">
        {worldMaps.map((map, index) => {
          const rLvl = Number(map.recommendedLevel) || 0;
          const isLocked = map.id !== 'meadow'; 
          const isHighRisk = currentLvl < rLvl;

          return (
            <button
              key={map.id || index}
              disabled={isLocked}
              onClick={() => onSelectMap(map)}
              className={`
                group relative flex items-center w-full h-24 md:h-32 rounded-3xl border transition-all duration-500 overflow-hidden
                ${isLocked 
                  ? 'border-slate-800 bg-slate-950/40 grayscale opacity-60' 
                  : `border-white/10 bg-slate-900/80 hover:bg-slate-800/90 hover:border-amber-500/50 hover:translate-x-2 shadow-xl shadow-black/40`}
              `}
            >
              {/* Status Indicator (Left Bar) */}
              <div className={`absolute left-0 top-0 bottom-0 w-2 transition-all duration-500
                ${isLocked ? 'bg-slate-800' : isHighRisk ? 'bg-red-600 group-hover:w-4' : 'bg-emerald-500 group-hover:w-4'}
              `} />

              {/* Map Icon Box */}
              <div className="ml-6 md:ml-10 w-12 h-12 md:w-20 md:h-20 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-3xl md:text-5xl shrink-0 group-hover:scale-110 group-hover:rotate-3 transition-transform">
                {isLocked ? <Lock className="text-slate-700" /> : (map.icon || "🗺️")}
              </div>

              {/* Map Main Info */}
              <div className="ml-6 flex-1 flex flex-col md:flex-row md:items-center gap-2 md:gap-8 overflow-hidden text-left">
                <div className="shrink-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded ${isLocked ? 'bg-slate-800 text-slate-500' : isHighRisk ? 'bg-red-500/20 text-red-500' : 'bg-emerald-500/20 text-emerald-500'}`}>
                      {isLocked ? 'Locked' : isHighRisk ? 'Lethal' : 'Secure'}
                    </span>
                    <span className="text-[9px] font-mono text-amber-500 font-bold tracking-tighter">REC. LV {rLvl}</span>
                  </div>
                  <h3 className="text-xl md:text-3xl font-black text-white italic uppercase tracking-tighter leading-none">
                    {map.name}
                  </h3>
                </div>
                
                {/* Description (Hidden on mobile small height) */}
                <p className="hidden md:block text-xs text-slate-500 font-medium max-w-md line-clamp-2 leading-relaxed opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                  {map.description}
                </p>
              </div>

              {/* Stats & Action */}
              <div className="mr-6 md:mr-10 flex items-center gap-8 shrink-0">
                {!isLocked && (
                   <div className="hidden lg:flex flex-col items-end gap-1">
                      <div className="flex items-center gap-2 text-slate-500">
                        <Activity size={12} />
                        <span className="text-[8px] font-black uppercase tracking-widest">Threat Level</span>
                      </div>
                      <div className="flex gap-1">
                        {[1,2,3,4,5].map(dot => (
                          <div key={dot} className={`h-1 w-4 rounded-full ${dot <= (rLvl/10) ? 'bg-red-500' : 'bg-slate-800'}`} />
                        ))}
                      </div>
                   </div>
                )}

                <div className={`w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center transition-all duration-300
                  ${isLocked ? 'bg-slate-900 border border-slate-800' : 'bg-amber-500 text-slate-950 group-hover:shadow-[0_0_20px_rgba(245,158,11,0.4)]'}
                `}>
                  {isLocked ? <Lock size={16} className="text-slate-700" /> : <ChevronRight size={24} className="group-hover:translate-x-1 transition-transform" />}
                </div>
              </div>

              {/* Background Map Name (Watermark) */}
              <div className="absolute right-20 top-1/2 -translate-y-1/2 text-8xl font-black italic text-white/[0.02] pointer-events-none uppercase select-none group-hover:text-white/[0.05] transition-colors">
                {map.id}
              </div>
            </button>
          );
        })}
      </div>

      {/* --- Footer Note --- */}
      <div className="mt-10 flex items-center justify-center gap-2 opacity-50">
        <ShieldAlert size={14} className="text-amber-500" />
        <p className="text-[9px] font-bold text-slate-400 uppercase tracking-[0.2em]">
          Proceed with caution. Expedition once started cannot be cancelled.
        </p>
      </div>
    </div>
  );
}