import React from 'react';
import { Skull, ChevronRight, Map as MapIcon } from 'lucide-react';
import { worldMaps } from '../data/worldMaps';
import { monsters } from '../data/monsters/index';

export default function MapSelectionView({ playerLevel, onSelectMap }) {

  // 1. ดักจับค่า ไม่ว่ามันจะส่งมาเป็น playerLevel, player.level หรือ player.Level
  // 2. ถ้าหาค่าไม่เจอจริงๆ (undefined) ให้ใช้ 1 เป็นค่าเริ่มต้น
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
            เลือกพื้นที่เพื่อเริ่มการออกเดินทาง
          </p>
          <div className="h-[1px] w-12 bg-gradient-to-l from-transparent to-amber-500/50" />
        </div>
      </div>

      {/* Grid Layout: 1 col on mobile, 3 cols on desktop */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {worldMaps.map((map) => {

          // ✅ [แก้ไขจุดตาย] ใช้ currentLvl แทน playerLevel และครอบ Number() ทั้งคู่
          const pLvl = Number(currentLvl); 
          const rLvl = Number(map.recommendedLevel) || 0;

          // ถ้าเลเวลเรา น้อยกว่าแนะนำ ถึงจะแดงจ่ะ
          const isUnderLevel = pLvl < rLvl;
          
          return (
            <div 
              key={map.id}
              onClick={() => onSelectMap(map)} // ✅ คลิกได้ 100% ไม่ต้องเช็ค Lock
              className={`
                group relative flex flex-col h-[320px] md:h-[450px] rounded-[2rem] border-2 transition-all duration-500 overflow-hidden
                cursor-pointer shadow-2xl hover:shadow-amber-500/20 hover:-translate-y-2
                ${isUnderLevel 
                  ? 'border-red-900/40 bg-slate-950/90' 
                  : `border-slate-700 bg-gradient-to-br ${map.theme?.bg || 'from-slate-800 to-slate-900'}`}
              `}
            >
              {/* Background Glow Effect */}
              <div className={`
                absolute -top-24 -right-24 w-48 h-48 blur-[80px] transition-all duration-700 group-hover:opacity-40
                ${isUnderLevel ? 'bg-red-600/20' : (map.theme?.glow || 'bg-amber-500/10')}
              `} />

              {/* Top Section: Icon & Badge */}
              <div className="p-6 flex justify-between items-start relative z-10">
                <div className={`
                  w-14 h-14 md:w-16 md:h-16 rounded-2xl flex items-center justify-center text-3xl border-2 transition-transform duration-500 group-hover:scale-110
                  ${isUnderLevel ? 'border-red-500/20 bg-red-950/30 shadow-none' : 'border-white/10 bg-white/5 shadow-inner'}
                `}>
                  {map.icon}
                </div>
                
                <div className="text-right">
                  <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1 font-mono">
                    Recommended
                  </div>
                  <div className={`text-sm font-mono font-black ${isUnderLevel ? 'text-red-500 animate-pulse' : 'text-amber-500'}`}>
                    LV. {map.recommendedLevel} - {map.recommendedLevel + 4}
                    {isUnderLevel && <span className="block text-[8px] tracking-normal font-sans">[ DANGER ]</span>}
                  </div>
                </div>
              </div>

              {/* Middle Section: Text Content (Title & Description) */}
              <div className="px-6 flex-1 flex flex-col justify-end pb-8 relative z-10">
                <h3 className={`text-2xl md:text-3xl font-black text-white uppercase italic tracking-tighter mb-2 transition-colors duration-300 ${isUnderLevel ? 'group-hover:text-red-500' : `group-hover:${map.theme?.text || 'text-amber-500'}`}`}>
                  {map.name}
                </h3>
                <p className="text-xs md:text-sm text-slate-400 leading-relaxed italic line-clamp-3 md:line-clamp-4 border-l-2 border-slate-800 pl-4">
                  "{map.description}"
                </p>
              </div>

              {/* Bottom Section: Action Only (เอา Species ออกแล้ว) */}
              <div className={`
                p-6 border-t flex items-center justify-end transition-colors relative z-10
                ${isUnderLevel ? 'border-red-900/20 bg-red-950/10' : 'border-white/5 bg-white/5'}
              `}>
                <div className={`flex items-center gap-1 font-black text-[10px] uppercase tracking-tighter group-hover:translate-x-1 transition-transform ${isUnderLevel ? 'text-red-500' : 'text-amber-500'}`}>
                  {isUnderLevel ? 'Risk Entry' : 'Enter'} <ChevronRight size={14} />
                </div>
              </div>

              {/* Animated Border Line */}
              <div className={`absolute bottom-0 left-0 h-[3px] w-0 group-hover:w-full transition-all duration-700 shadow-lg 
                ${isUnderLevel 
                  ? 'bg-red-600 shadow-red-600/50' 
                  : (
                      map.id === 'meadow' ? 'bg-green-500 shadow-green-500/50' : 
                      map.id === 'emerald_valley' ? 'bg-emerald-500 shadow-emerald-500/50' : 
                      map.id === 'whispering_woods' ? 'bg-teal-500 shadow-teal-500/50' : 
                      map.id === 'goblin_outpost' ? 'bg-orange-500 shadow-orange-500/50' : 
                      map.id === 'dark_fortress' ? 'bg-red-700 shadow-red-700/50' : 
                      map.id === 'ruin_temple' ? 'bg-violet-500 shadow-violet-500/50' : 
                      'bg-amber-500 shadow-amber-500/50' 
                    )
                }`}
              />
            </div>
          );
        })}
      </div>

      {/* Footer Info */}
      <div className="mt-12 flex flex-col items-center gap-4 opacity-30 group">
        <MapIcon size={24} className="text-slate-500 group-hover:text-amber-500 transition-colors" />
        <p className="text-[9px] font-bold uppercase tracking-[0.4em] text-slate-600">
          Infinite Steps Expedition Board
        </p>
      </div>
    </div>
  );
}