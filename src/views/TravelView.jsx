import React from 'react';
import { ChevronRight, Skull, Map as MapIcon, LogOut, Loader2, RefreshCcw } from 'lucide-react'; 

/**
 * TravelView: คอมโพเนนต์แสดงผลหน้าจอการเดินทางและดันเจี้ยน
 * อัปเดต: ย้ายปุ่ม onResetMap มาไว้ตรงกลางและเพิ่มขนาดตามคำขอจ่ะ
 */
export default function TravelView({ 
  onStep, 
  currentEvent, 
  logs, 
  inDungeon, 
  onExitDungeon,
  isWalking,     
  walkProgress,
  player,
  currentMap,
  onResetMap // ✅ รับข้อมูลแผนที่ปัจจุบันเข้ามาจ่ะ
}) {
  // ✅ ตรวจสอบว่าเป็นดันเจี้ยนหรือไม่เพื่อเปลี่ยนธีมสี
  const isDungeonMode = !!inDungeon;

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      
      {/* ==========================================
          🖼️ 1. AREA DISPLAY: ส่วนแสดงเหตุการณ์ / สถานะพื้นที่
          ========================================== */}
      <div className={`
        relative border-2 rounded-3xl p-10 min-h-[350px] flex flex-col justify-between shadow-2xl transition-all duration-500
        ${isDungeonMode 
          ? `bg-gradient-to-b from-amber-950/40 to-black border-orange-500/30 shadow-orange-900/20` 
          : `bg-slate-900/40 border-orange-500/50 shadow-orange-500/10`}
        bg-[url('https://www.transparenttextures.com/patterns/dark-matter.png')]
      `}>
        
        {/* Badge บอกสถานที่ปัจจุบัน */}
        <div className="absolute top-6 left-6 flex items-center gap-2 px-3 py-1 bg-black/40 rounded-full border border-white/10 backdrop-blur-sm">
          {isDungeonMode ? <Skull size={14} className="text-orange-200" /> : <MapIcon size={14} className="text-orange-500" />}
          <span className="text-[10px] font-black uppercase tracking-widest text-orange-400/80">
            {isDungeonMode ? inDungeon.name : (currentMap?.name || "แผนที่โลก")}
          </span>
        </div>

        {/* บันทึกระยะทางสะสม (คงเดิม) */}
        <div className="absolute top-6 right-6 flex flex-col items-end px-3 py-1 bg-black/40 rounded-2xl border border-white/5 backdrop-blur-sm shadow-inner">
          <span className="text-[7px] font-black text-orange-500/50 uppercase tracking-[0.2em] leading-none mb-1">
            Travel Distance
          </span>
          <div className="flex items-center gap-1.5">
            <span className="text-sm font-black text-white italic font-mono tracking-tighter">
              {(player?.totalSteps || 0).toLocaleString()}
            </span>
            <span className="text-[8px] font-bold text-orange-500 uppercase italic">Steps</span>
          </div>
        </div>
        

        {/* เนื้อหาหลัก: เหตุการณ์ปัจจุบัน หรือ สถานะการบุกตะลุย */}
        <div className="text-center py-10">
          {currentEvent ? (
            <div className="animate-in fade-in zoom-in duration-500 flex flex-col items-center">
              {currentEvent.Icon && (
                <div className="mb-4 p-4 bg-white/5 rounded-full border border-white/10 shadow-inner">
                  <currentEvent.Icon size={48} strokeWidth={2.5} className="animate-pulse" />
                </div>
              )}

              <h2 className={`text-4xl font-black mb-6 tracking-tighter uppercase italic ${isDungeonMode ? 'text-red-500' : 'text-orange-500'}`}>
                {currentEvent.title}
              </h2>
              <p className="text-orange-100/80 text-xl italic leading-relaxed">
                "{currentEvent.description}"
              </p>
            </div>
          ) : (
            <div className="animate-pulse">
              {isDungeonMode ? (
                <div className="space-y-4 flex flex-col items-center justify-center">
                    <p className="text-3xl text-orange-500 font-black uppercase tracking-tighter italic">
                        กำลังบุกตะลุย...
                    </p>
                    <div className="w-64 h-2 bg-black/50 rounded-full overflow-hidden border border-orange-900/30">
                      <div
                        className="h-full bg-orange-500 transition-all duration-500" 
                        style={{ width: `${(inDungeon.currentStep / inDungeon.steps) * 100}%` }}
                      />
                    </div>
                    <p className="text-[10px] text-orange-400 font-mono font-bold tracking-widest uppercase">
                      STEP {inDungeon.currentStep} / {inDungeon.steps}
                    </p>
                </div>
              ) : (
                <div className="opacity-60">
                  <p className="text-white font-bold uppercase tracking-widest">
                    {isWalking ? "กำลังออกสำรวจ..." : "เตรียมพร้อมออกเดินทาง"}
                  </p>
                  <p className="text-white-400/70 mt-2 italic text-sm font-medium tracking-wide">
                    {isWalking 
                      ? `เสียงฝีเท้าดังก้องไปทั่ว${currentMap?.name || 'บริเวณ'}...` 
                      : `เส้นทางใน${currentMap?.name || 'เบื้องหน้า'}เต็มไปด้วยอันตราย...`}
                  </p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* 🕹️ 2. CONTROLS: ส่วนควบคุมการเดินพร้อมหลอด Progress */}
        <div className="space-y-3">
          {/* 🔘 ปุ่มก้าวเดินหลัก */}
          <button 
            onClick={onStep}
            disabled={isWalking} 
            className={`
              relative overflow-hidden w-full py-5 text-white font-black rounded-2xl shadow-xl transition-all flex items-center justify-center gap-3 text-xl uppercase tracking-widest
              ${isWalking ? 'cursor-not-allowed scale-[0.98]' : 'active:scale-95'}
              bg-slate-900/80 border border-orange-900/40
            `}
          >
            {isWalking && (
              <div 
                className={`absolute inset-0 transition-all duration-75 ease-linear opacity-40
                  ${isDungeonMode ? 'bg-orange-400' : 'bg-orange-700'}`}
                style={{ width: `${walkProgress}%` }}
              />
            )}

            <div className="relative z-10 flex items-center justify-center gap-3">
                {isWalking ? (
                  <>
                    <Loader2 size={24} className="animate-spin text-orange-400" />
                    <span className="animate-pulse text-orange-500">
                      {isDungeonMode ? "กำลังมุ่งหน้าต่อไป..." : "กำลังเดินสำรวจ..."}
                    </span>
                  </>
                ) : (
                  <>
                    <span className="text-orange-500">
                      {isDungeonMode ? "บุกเข้าไปต่อ!" : "ก้าวเดินต่อไป"}
                    </span>
                    <ChevronRight size={24} className="text-orange-500" />
                  </>
                )}
            </div>
          </button>

          {/* ✅ [ย้ายตำแหน่งและเพิ่มขนาด] ปุ่ม Change Map: แสดงกึ่งกลางด้านล่างเมื่อไม่ได้อยู่ในดันเจี้ยน */}
          {!isDungeonMode && (
            <div className="flex justify-center pt-2">
              <button 
                onClick={onResetMap}
                disabled={isWalking}
                className={`
                  flex items-center gap-3 px-10 py-3 bg-orange-500/5 hover:bg-orange-500/10 
                  text-orange-500 rounded-xl border border-orange-500/30 transition-all active:scale-95
                  ${isWalking ? 'opacity-0 pointer-events-none' : 'opacity-100'}
                `}
              >
                <RefreshCcw size={16} />
                <span className="text-xs font-black uppercase tracking-[0.2em]">Change Expedition Map</span>
              </button>
            </div>
          )}

          {isDungeonMode && (
            <button 
              onClick={onExitDungeon} 
              disabled={isWalking} 
              className="w-full py-3 bg-black/40 hover:bg-orange-950/30 text-orange-500/70 hover:text-orange-500 font-black rounded-xl transition-all active:scale-95 text-[10px] uppercase tracking-[0.3em] flex items-center justify-center gap-2 border border-orange-900/30 backdrop-blur-sm disabled:opacity-30"
            >
              <LogOut size={14} /> <span>หลบหนีออกจากดันเจี้ยน</span>
            </button>
          )}
        </div>
      </div>

      {/* 📜 3. LOGS: ส่วนบันทึก Adventure Logs */}
      <div className="bg-black/50 border border-orange-900/20 rounded-2xl p-6 h-48 overflow-y-auto font-mono shadow-inner">
        <h3 className="text-orange-900 text-xs font-black uppercase mb-4 tracking-widest border-b border-orange-900/10 pb-2 flex justify-between">
          <span>Adventure Logs</span>
          {isDungeonMode && <span className="text-amber-800 animate-pulse">Dungeon Mode Active !</span>}
        </h3>
        <div className="space-y-2">
          {logs.map((log, i) => {
            const parts = log.split(/([+-]\d+)/);
            return (
              <div key={i} className="text-orange-100/60 text-sm flex gap-3 animate-in slide-in-from-left duration-300">
                <span className={`
                  ${(log.includes('⚔️') || log.includes('👿')) ? 'text-red-500' : 
                    log.includes('✨') ? 'text-emerald-500' : 'text-yellow-600'} 
                  font-bold`}
                >
                  »
                </span>
                <span className="leading-tight">
                  {parts.map((part, index) => 
                    part.startsWith('+') ? (
                      <span key={index} className="text-emerald-400 font-black drop-shadow-[0_0_8px_rgba(52,211,153,0.4)]">
                        {part}
                      </span>
                    ) : (
                      <span key={index}>{part}</span>
                    )
                  )}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}