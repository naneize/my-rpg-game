import React from 'react'; 
// ✅ เพิ่ม Trophy และ Timer สำหรับ UI ใหม่
import { Skull, ChevronRight, Lock, Activity, ShieldAlert, Trophy, Timer } from 'lucide-react';
import { worldMaps } from '../data/worldMaps';

export default function MapSelectionView({ playerLevel, worldEvent, onChallengeWorldBoss, onSelectMap, respawnTimeLeft }) {
  
  // ✅ กำหนดค่า currentLvl ให้แม่นยำเพื่อใช้ใน HUD และการเช็ค Risk
  const currentLvl = Number(playerLevel || 1);

  // ⏲️ ฟังก์ชันช่วยจัดรูปแบบเวลา (วินาที -> MM:SS)
  const formatTime = (seconds) => {
    // ✅ 1. ถ้าค่าไม่ใช่ตัวเลข (NaN) หรือ null ให้แสดงเวลา Cooldown เริ่มต้น
    if (seconds === null || isNaN(seconds)) return "15:00"; 
    
    // ✅ 2. ถ้าเวลาหมด (0 หรือติดลบ) ให้แสดง 00:00 ค้างไว้ 
    // เพื่อรอให้ Firebase อัปเดตค่า active: true แล้วแบนเนอร์จะเด้งมาเอง
    if (seconds <= 0) return "00:00"; 

    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="p-4 space-y-6">
      {/* 👑 1. World Boss Banner (Top Section) */}
      {worldEvent && (
        <>
          {/* ✅ กรณีบอสยัง Active (เลือดไม่หมด) - แสดงแบนเนอร์ปกติ */}
          {worldEvent.active && (
            <div 
              onClick={onChallengeWorldBoss}
              className="relative w-full p-6 rounded-3xl bg-gradient-to-r from-amber-900/80 to-slate-900 border-2 border-amber-500/50 overflow-hidden cursor-pointer active:scale-95 transition-all shadow-[0_0_30px_rgba(245,158,11,0.15)]"
            >
              <div className="relative z-10 flex items-center gap-6"> 
                <div className="relative shrink-0 hidden sm:block">
                  <div className="absolute inset-0 bg-amber-500/20 blur-2xl rounded-full" />
                  <img 
                    src="/monsters/black_dragon_banner.png" 
                    alt="Boss Avatar"
                    className="relative w-24 h-24 md:w-32 md:h-32 object-contain drop-shadow-[0_10px_15px_rgba(0,0,0,0.5)] transform hover:scale-110 transition-transform duration-500"
                  />
                </div>

                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                     <div className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
                     <h2 className="text-amber-500 font-black italic uppercase tracking-tighter text-[10px] md:text-xs">Limited Time Event</h2>
                  </div>
                  <h1 className="text-2xl md:text-4xl font-black text-white italic uppercase tracking-tighter leading-tight">
                     {worldEvent.name}
                  </h1>
                  
                  <div className="mt-5 w-full h-3 bg-black/50 rounded-full border border-white/10 overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-red-600 via-orange-500 to-amber-500 rounded-full transition-all duration-1000 shadow-[0_0_10px_rgba(239,68,68,0.5)]"
                      style={{ width: `${(worldEvent.currentHp / worldEvent.maxHp) * 100}%` }}
                    />
                  </div>
                  
                  <div className="flex justify-between mt-2 px-1">
                     <div className="flex items-center gap-1.5">
                        <span className="text-[10px] text-slate-500 font-black uppercase tracking-widest">Global Status</span>
                        <span className="text-[10px] text-emerald-500 font-black uppercase italic">Active</span>
                     </div>
                     <div className="text-right">
                        <span className="text-[10px] text-slate-400 font-bold mr-2">GLOBAL HP:</span>
                        <span className="text-xs md:text-sm font-black text-white font-mono">{worldEvent.currentHp.toLocaleString()}</span>
                     </div>
                  </div>
                </div>
              </div>
              
              <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                 <Trophy size={120} className="text-amber-500 -rotate-12 translate-x-8 -translate-y-4" />
              </div>
              <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-amber-500/10 blur-[50px] rounded-full" />
            </div>
          )}

          {/* ⏳ [NEW] กรณีบอสไม่อยู่ (Cooldown) - แสดงนาฬิกานับถอยหลัง */}
          {!worldEvent.active && (
            <div className="relative w-full p-8 rounded-3xl bg-slate-900/60 border-2 border-slate-800 overflow-hidden backdrop-blur-md">
              <div className="relative z-10 flex flex-col items-center justify-center text-center py-4">
                <div className="flex items-center gap-2 mb-2">
                  <Timer size={16} className="text-amber-500 animate-spin-slow" />
                  <span className="text-[10px] font-black text-amber-500/70 uppercase tracking-[0.3em]">Boss Respawn in Progress</span>
                </div>
                
                <h3 className="text-slate-500 text-xs font-bold uppercase italic mb-4">
                   🐲 {worldEvent.name} พ่ายแพ้แล้วและกำลังฟื้นฟูพลัง...
                </h3>

                <div className="flex items-center gap-4">
                   <span className="text-5xl md:text-7xl font-mono font-black text-white italic tracking-tighter drop-shadow-[0_0_20px_rgba(255,255,255,0.1)]">
                     {formatTime(respawnTimeLeft)}
                   </span>
                </div>

                <p className="mt-4 text-[9px] font-bold text-slate-600 uppercase tracking-widest">
                  เตรียมความพร้อมให้ดี เพื่อการล่าในรอบถัดไป
                </p>
              </div>

              {/* Decorative Background */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-[0.03] select-none pointer-events-none">
                <Skull size={200} />
              </div>
            </div>
          )}
        </>
      )}

      {/* --- 2. HUD Header & Navigation List --- */}
      <div className="max-w-7xl mx-auto p-2 pb-20 animate-in fade-in duration-700">
        
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

        {/* --- Map List --- */}
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
                <div className={`absolute left-0 top-0 bottom-0 w-2 transition-all duration-500
                  ${isLocked ? 'bg-slate-800' : isHighRisk ? 'bg-red-600 group-hover:w-4' : 'bg-emerald-500 group-hover:w-4'}
                `} />

                <div className="ml-6 md:ml-10 w-12 h-12 md:w-20 md:h-20 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-3xl md:text-5xl shrink-0 group-hover:scale-110 group-hover:rotate-3 transition-transform">
                  {isLocked ? <Lock className="text-slate-700" /> : (map.icon || "🗺️")}
                </div>

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
                  <p className="hidden md:block text-xs text-slate-500 font-medium max-w-md line-clamp-2 leading-relaxed opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                    {map.description}
                  </p>
                </div>

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
                <div className="absolute right-20 top-1/2 -translate-y-1/2 text-8xl font-black italic text-white/[0.02] pointer-events-none uppercase select-none group-hover:text-white/[0.05] transition-colors">
                  {map.id}
                </div>
              </button>
            );
          })}
        </div>

        <div className="mt-10 flex items-center justify-center gap-2 opacity-50">
          <ShieldAlert size={14} className="text-amber-500" />
          <p className="text-[9px] font-bold text-slate-400 uppercase tracking-[0.2em]">
            Proceed with caution. Expedition once started cannot be cancelled.
          </p>
        </div>
      </div>
    </div>
  );
}