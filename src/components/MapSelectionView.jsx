import React from 'react';
import { Skull, ChevronRight, Map as MapIcon, AlertTriangle, Lock } from 'lucide-react';
import { worldMaps } from '../data/worldMaps';

export default function MapSelectionView({ playerLevel, onSelectMap }) {

  // ✅ ดักจับค่าเลเวลเพื่อใช้คำนวณ "ระดับความเสี่ยง" เท่านั้น (ไม่ใช้บล็อกทางเข้า)
  const currentLvl = typeof playerLevel === 'object' 
    ? (playerLevel.level || playerLevel.Level || 1) 
    : (Number(playerLevel) || 1);

  return (
    <div className="max-w-6xl mx-auto p-4 pb-20 animate-in fade-in duration-700">
      
      {/* Header Section */}
      <div className="text-center mb-10 space-y-2">
        <h2 className="text-3xl md:text-4xl font-black italic uppercase tracking-tighter text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.2)]">
          Select Destination
        </h2>
        <div className="flex items-center justify-center gap-2">
          <div className="h-[1px] w-12 bg-gradient-to-r from-transparent to-amber-500/50" />
          <p className="text-[10px] md:text-xs text-amber-500/80 uppercase tracking-[0.3em] font-bold">
            พื้นที่อันตรายรอการสำรวจ... โปรดระวังตัว
          </p>
          <div className="h-[1px] w-12 bg-gradient-to-l from-transparent to-amber-500/50" />
        </div>
      </div>

      {/* Grid Layout */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {worldMaps.map((map, index) => {
          const pLvl = Number(currentLvl); 
          const rLvl = Number(map.recommendedLevel) || 0;

          // ✅ เช็คสถานะ "Coming Soon" (ล็อคทุกแมพยกเว้นแมพแรก)
          const isComingSoon = index !== 0; 
          
          // ✅ เปลี่ยนจาก "เข้าไม่ได้" เป็น "ความเสี่ยงสูง (High Risk)"
          const isHighRisk = pLvl < rLvl;
          
          return (
            <div 
              key={map.id}
              // ✅ ถ้า Coming Soon จะกดไม่ได้
              onClick={() => !isComingSoon && onSelectMap(map)} 
              className={`
                group relative flex flex-col h-[320px] md:h-[450px] rounded-[2rem] border-2 transition-all duration-500 overflow-hidden
                shadow-2xl hover:-translate-y-2
                ${isComingSoon 
                  ? 'border-slate-800 bg-slate-900/40 cursor-not-allowed grayscale' 
                  : isHighRisk 
                    ? 'border-red-900/40 bg-slate-950/90 cursor-pointer hover:shadow-red-500/20' 
                    : `border-slate-700 bg-gradient-to-br cursor-pointer hover:shadow-amber-500/20 ${map.theme?.bg || 'from-slate-800 to-slate-900'}`}
              `}
            >
              {/* Background Glow Effect */}
              {!isComingSoon && (
                <div className={`
                  absolute -top-24 -right-24 w-48 h-48 blur-[80px] transition-all duration-700 group-hover:opacity-40
                  ${isHighRisk ? 'bg-red-600/20' : (map.theme?.glow || 'bg-amber-500/10')}
                `} />
              )}

              {/* Top Section: Icon & Risk Level */}
              <div className="p-6 flex justify-between items-start relative z-10">
                <div className={`
                  w-14 h-14 md:w-16 md:h-16 rounded-2xl flex items-center justify-center text-3xl border-2 transition-transform duration-500 group-hover:scale-110
                  ${isComingSoon ? 'border-slate-700 bg-slate-800/50 text-slate-600' : isHighRisk ? 'border-red-500/20 bg-red-950/30 shadow-none' : 'border-white/10 bg-white/5 shadow-inner'}
                `}>
                  {isComingSoon ? <Lock size={24} /> : map.icon}
                </div>
                
                <div className="text-right">
                  <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1 font-mono">
                    {isComingSoon ? 'Status' : 'Danger Level'}
                  </div>
                  <div className={`text-sm font-mono font-black ${isComingSoon ? 'text-slate-600' : isHighRisk ? 'text-red-500' : 'text-emerald-500'}`}>
                    {isComingSoon ? (
                      <span className="animate-pulse">COMING SOON</span>
                    ) : isHighRisk ? (
                      <div className="flex flex-col items-end">
                        <span className="flex items-center gap-1 animate-pulse">
                          <AlertTriangle size={12} /> HIGH RISK
                        </span>
                        <span className="text-[9px] opacity-60 italic">Lv. {rLvl}+ recommended</span>
                      </div>
                    ) : (
                      'STABLE'
                    )}
                  </div>
                </div>
              </div>

              {/* Middle Section: Text Content */}
              <div className="px-6 flex-1 flex flex-col justify-end pb-8 relative z-10">
                <h3 className={`text-2xl md:text-3xl font-black text-white uppercase italic tracking-tighter mb-2 transition-colors duration-300 
                  ${isComingSoon ? 'opacity-40' : isHighRisk ? 'group-hover:text-red-500' : `group-hover:${map.theme?.text || 'text-amber-500'}`}`}>
                  {map.name}
                </h3>
                <p className="text-xs md:text-sm text-slate-400 leading-relaxed italic line-clamp-3 border-l-2 border-slate-800 pl-4">
                  {isComingSoon ? '"พื้นที่ลึกลับที่ยังไม่ถูกเปิดเผย โปรดรอการอัปเดตในอนาคต..."' : `"${map.description}"`}
                </p>
              </div>

              {/* Bottom Section: Action */}
              <div className={`
                p-6 border-t flex items-center justify-between transition-colors relative z-10
                ${isComingSoon ? 'border-slate-800 bg-slate-900/20' : isHighRisk ? 'border-red-900/20 bg-red-950/10' : 'border-white/5 bg-white/5'}
              `}>
                <div className="flex gap-1">
                   {!isComingSoon && isHighRisk && <Skull size={14} className="text-red-600 animate-bounce" />}
                </div>
                <div className={`flex items-center gap-1 font-black text-[10px] uppercase tracking-tighter transition-transform 
                  ${isComingSoon ? 'text-slate-700' : `group-hover:translate-x-1 ${isHighRisk ? 'text-red-500' : 'text-emerald-500'}`}`}>
                   {isComingSoon ? 'Area Locked' : isHighRisk ? 'Attempt Entry' : 'Start Expedition'} {!isComingSoon && <ChevronRight size={14} />}
                </div>
              </div>

              {/* Animated Border Line - สีตามธาตุของแมพ */}
              {!isComingSoon && (
                <div className={`absolute bottom-0 left-0 h-[3px] w-0 group-hover:w-full transition-all duration-700 shadow-lg 
                  ${isHighRisk 
                    ? 'bg-red-600 shadow-red-600/50' 
                    : (
                        map.id === 'meadow' ? 'bg-green-500 shadow-green-500/50' : 
                        map.id === 'emerald_valley' ? 'bg-emerald-500 shadow-emerald-500/50' : 
                        'bg-amber-500 shadow-amber-500/50' 
                      )
                  }`}
                />
              )}

              {/* Locked Overlay */}
              {isComingSoon && (
                <div className="absolute inset-0 bg-slate-950/20 pointer-events-none" />
              )}
            </div>
          );
        })}
      </div>

      {/* Footer Info */}
      <div className="mt-12 flex flex-col items-center gap-4 opacity-30 group">
        <MapIcon size={24} className="text-slate-500 group-hover:text-amber-500 transition-colors" />
        <p className="text-[9px] font-bold uppercase tracking-[0.4em] text-slate-600">
          Freedom of Exploration System
        </p>
      </div>
    </div>
  );
}