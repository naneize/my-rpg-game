import React from 'react';
import { Skull, ChevronRight, Map as MapIcon, AlertTriangle, Lock } from 'lucide-react';
import { worldMaps } from '../data/worldMaps';

export default function MapSelectionView({ playerLevel, onSelectMap }) {

  // ✅ ดึงเลเวลมาเป็น Number ให้ชัวร์ที่สุด
  const currentLvl = typeof playerLevel === 'object' 
    ? (playerLevel.level || playerLevel.Level || 1) 
    : (Number(playerLevel) || 1);

  return (
    <div className="max-w-6xl mx-auto p-4 pb-20 animate-in fade-in zoom-in-95 duration-700">
      
      {/* Header Section */}
      <div className="text-center mb-10 space-y-2">
        <h2 className="text-3xl md:text-5xl font-black italic uppercase tracking-tighter text-white drop-shadow-[0_0_20px_rgba(255,255,255,0.3)]">
          Select Destination
        </h2>
        <div className="flex items-center justify-center gap-3">
          <div className="h-[2px] w-16 bg-gradient-to-r from-transparent to-amber-500" />
          <p className="text-xs md:text-sm text-amber-500 uppercase tracking-[0.4em] font-bold">
            ระบบนำทางพร้อมทำงาน... โปรดเลือกพื้นที่สำรวจ
          </p>
          <div className="h-[2px] w-16 bg-gradient-to-l from-transparent to-amber-500" />
        </div>
      </div>

      {/* Grid Layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {worldMaps.map((map, index) => {
          const rLvl = Number(map.recommendedLevel) || 0;

          // ✅ เงื่อนไขล็อคแมพ: เปิดแค่ meadow (แมพแรก) 
          // หรือจะเปลี่ยนเป็นเปิดตามเลเวลก็ได้ เช่น: currentLvl < rLvl && index !== 0
          const isLocked = map.id !== 'meadow'; 
          
          const isHighRisk = currentLvl < rLvl;
          
          return (
            <button 
              key={map.id || index}
              disabled={isLocked}
              // ✅ ส่ง map object เข้าไปเลยเพื่อป้องกันการ Map ID ผิดพลาดใน App.js
              onClick={() => onSelectMap(map)} 
              className={`
                group relative flex flex-col h-[350px] md:h-[480px] rounded-[2.5rem] border-2 transition-all duration-500 text-left
                ${isLocked 
                  ? 'border-slate-800 bg-slate-950/60 cursor-not-allowed opacity-80' 
                  : isHighRisk 
                    ? 'border-red-900/40 bg-slate-950/90 hover:border-red-500/50 hover:shadow-[0_0_40px_rgba(239,68,68,0.2)]' 
                    : `border-slate-700 bg-slate-900 hover:shadow-[0_0_40px_rgba(245,158,11,0.15)] ${map.theme?.bg || ''}`}
              `}
            >
              {/* Overlay สำหรับแมพที่ล็อค */}
              {isLocked && (
                <div className="absolute inset-0 z-20 flex items-center justify-center bg-slate-950/40 rounded-[2.5rem] backdrop-blur-[2px]">
                   <div className="bg-slate-900/90 border border-slate-700 p-4 rounded-2xl flex flex-col items-center gap-2 shadow-2xl">
                      <Lock className="text-slate-500" size={32} />
                      <span className="text-[10px] font-black text-slate-500 tracking-[0.2em]">UNDER DEVELOPMENT</span>
                   </div>
                </div>
              )}

              {/* Background Glow */}
              {!isLocked && (
                <div className={`
                  absolute -top-20 -right-20 w-64 h-64 blur-[100px] opacity-0 transition-opacity duration-700 group-hover:opacity-40
                  ${isHighRisk ? 'bg-red-600' : (map.theme?.glow ? 'bg-amber-500' : 'bg-blue-500')}
                `} />
              )}

              {/* Content Header */}
              <div className="p-8 flex justify-between items-start w-full relative z-10">
                <div className={`
                  w-16 h-16 md:w-20 md:h-20 rounded-3xl flex items-center justify-center text-4xl border-2 transition-all duration-500 
                  group-hover:scale-110 group-hover:rotate-3
                  ${isLocked ? 'border-slate-800 bg-slate-900 text-slate-700' : 'border-white/10 bg-white/5 text-white shadow-xl'}
                `}>
                  {isLocked ? <Lock size={28} /> : (map.icon || "🗺️")}
                </div>
                
                <div className="text-right">
                  <div className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-1">
                    Expedition Rank
                  </div>
                  <div className={`text-sm font-mono font-black italic ${isLocked ? 'text-slate-700' : isHighRisk ? 'text-red-500' : 'text-emerald-500'}`}>
                    {isLocked ? 'LOCKED' : isHighRisk ? '⚠ LETHAL' : '✓ SECURE'}
                  </div>
                </div>
              </div>

              {/* Text Body */}
              <div className="px-8 flex-1 flex flex-col justify-end pb-10 relative z-10">
                <div className="flex items-center gap-2 mb-2">
                   <span className="text-[10px] font-mono text-amber-500 font-bold">REC. LV {rLvl}</span>
                   <div className="h-[1px] flex-1 bg-slate-800" />
                </div>
                <h3 className="text-3xl md:text-4xl font-black text-white uppercase italic tracking-tighter mb-3 transition-transform group-hover:-translate-y-1">
                  {map.name}
                </h3>
                <p className="text-sm text-slate-400 leading-relaxed font-medium line-clamp-3 opacity-80">
                  {map.description}
                </p>
              </div>

              {/* Action Bar */}
              <div className={`
                p-8 border-t flex items-center justify-between transition-all relative z-10
                ${isLocked ? 'border-slate-800' : 'border-white/5 bg-white/[0.02] group-hover:bg-white/[0.05]'}
              `}>
                <div className="flex items-center gap-3">
                   {!isLocked && isHighRisk && <AlertTriangle size={18} className="text-red-500 animate-pulse" />}
                   <span className={`text-[11px] font-black uppercase tracking-widest ${isLocked ? 'text-slate-700' : 'text-slate-300'}`}>
                      {isLocked ? 'Access Denied' : 'Enter Expedition'}
                   </span>
                </div>
                {!isLocked && <ChevronRight className="text-amber-500 group-hover:translate-x-2 transition-transform" size={20} />}
              </div>

              {/* Hover Line Effect */}
              {!isLocked && (
                <div className={`absolute bottom-0 left-0 h-[4px] w-0 group-hover:w-full transition-all duration-500 
                  ${isHighRisk ? 'bg-red-600 shadow-[0_0_15px_rgba(220,38,38,0.5)]' : 'bg-amber-500 shadow-[0_0_15px_rgba(245,158,11,0.5)]'}`}
                />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}