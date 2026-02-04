import React from 'react';
import { Crown } from 'lucide-react';

export default function BossFrame({ children, isWorldBoss, isShiny, isBoss, lootResult }) {
  // 🎨 กำหนดสไตล์ตามระดับความเทพ
  const frameStyles = isWorldBoss 
    ? 'border-2 border-amber-500/50 shadow-[0_0_60px_rgba(245,158,11,0.2)] bg-slate-950/80' 
    : isShiny 
      ? 'animate-rainbow-border p-[3px] shadow-[0_0_40px_rgba(255,255,255,0.3)]' 
      : `p-2 sm:p-6 border border-white/10 bg-slate-900/60 ${isBoss ? 'border-red-500/40 shadow-[0_0_50px_rgba(220,38,38,0.2)]' : 'shadow-black/50'}`;

  return (
    <div className={`relative w-full max-w-[380px] rounded-[2.5rem] shadow-2xl transition-all duration-700 backdrop-blur-md overflow-hidden flex flex-col justify-between
      ${frameStyles} 
      ${lootResult ? 'opacity-90 scale-[0.98]' : 'opacity-100'}
    `}>
      
      {/* 👑 ป้ายประกาศ World Boss (แยกเลเยอร์ชัดเจน) */}
      {isWorldBoss && !lootResult && (
        <div className="absolute top-0 left-0 w-full py-2 bg-slate-950/95 border-b border-amber-500/30 flex justify-center items-center gap-2 z-50">
          <Crown size={14} className="text-amber-500 animate-pulse" />
          <span className="text-[10px] font-black tracking-[0.3em] text-amber-500 uppercase">World Boss Encounter</span>
          <Crown size={14} className="text-amber-500 animate-pulse" />
        </div>
      )}

      {/* 🌈 ส่วนเนื้อหาข้างใน (Children) */}
      <div className={`w-full h-full flex flex-col flex-1 ${isShiny ? 'bg-slate-950/90 rounded-[2.3rem] p-2 sm:p-6 z-10' : ''}`}>
        {children}
      </div>
    </div>
  );
}