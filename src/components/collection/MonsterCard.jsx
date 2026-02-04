import React from 'react';
import { Sparkles } from 'lucide-react';

// ✅ เพิ่ม prop forceShowColor เพื่อใช้บังคับให้แสดงสี (เช่น ในหน้าต่อสู้)
export default function MonsterCard({ monster, stats, style, onClick, forceShowColor = false }) {
  // ✅ [คงเดิม] เช็คค่า isDiscovered ที่เราส่งมาใน stats
  // ✨ แต่เพิ่มเงื่อนไข: ถ้า forceShowColor เป็น true ให้ถือว่าเจอแล้วเสมอ (เพื่อไม่ให้เป็นสีเทาตอนสู้)
  const isFound = forceShowColor || (stats?.isDiscovered || false);
  
  // ✅ [คงเดิม] เช็คว่าเคยสยบเวอร์ชัน Shiny มาหรือยัง
  const isShiny = stats?.hasShiny || false;

  return (
    <div 
      onClick={onClick}
      // ✅ [คงเดิม] แต่ Class grayscale จะไม่ทำงานถ้า isFound เป็น true (ซึ่งหน้าสู้จะถูกบังคับให้เป็น true จ่ะ)
      className={`relative flex flex-col items-center p-[2px] rounded-2xl cursor-pointer transition-all duration-500 active:scale-95 overflow-hidden
        ${isFound 
          ? `${isShiny 
              ? 'animate-rainbow-border shadow-[0_0_20px_rgba(255,255,255,0.3)]' 
              : `${style.border} border-2 bg-slate-900/60 shadow-lg`}` 
          : 'border-2 border-slate-800 bg-slate-950/40 '}`}
    >
      
      {/* 🌈 Inner Container */}
      <div className={`w-full h-full flex flex-col items-center p-3 rounded-[14px] relative z-10 
        ${isShiny ? 'bg-slate-900/95 backdrop-blur-sm' : ''}`}>
        
        {/* ✨ Shiny Effect */}
        {isFound && isShiny && (
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white/10 via-transparent to-transparent animate-pulse" />
        )}

        {/* 🖼️ Monster Image Area */}
        <div className={`h-16 flex items-center justify-center mb-2 relative z-10 ${isShiny ? 'drop-shadow-[0_0_8px_rgba(255,255,255,0.6)]' : ''}`}>
          {/* ✅ [คงเดิม] แสดงเงาดำ (Silhoutte) เฉพาะตอนที่ยังไม่เจอจริงๆ เท่านั้น */}
          {!isFound ? (
            <span className="text-4xl opacity-20 contrast-0">❓</span>
          ) : (monster.image && typeof monster.image === 'string' && monster.image.startsWith('/')) ? (
            <img 
            src={monster.image}
             className={`h-full object-contain transition-transform ${isShiny ? 'scale-110' : ''}`} 
            alt={monster.name} />
          ) : (
            <span className={`text-4xl ${isShiny ? 'animate-bounce' : ''}`}>
                {monster.image || monster.icon || monster.emoji || "👾"}
            </span>
          )}
          
          {isShiny && isFound && (
            <div className="absolute -top-1 -right-1 text-white animate-pulse">
              <Sparkles size={12} fill="currentColor" />
            </div>
          )}
        </div>

        {/* 📊 Status Area */}
        <div className="w-full flex flex-col items-center gap-1 relative z-10">
          
          {/* ✅ DEFEAT: แสดง 0 ได้ถ้าปลดล็อกจากการดรอปไอเทม */}
          <div className={`h-5 flex items-center px-2 rounded-full border ${isShiny ? 'bg-white/10 border-white/20' : 'bg-black/40 border-white/5'}`}>
            <span className={`text-[7px] font-black uppercase tracking-tighter ${isShiny ? 'text-white' : 'text-slate-400'}`}>
              DEFEAT: <span className={`${isShiny ? 'text-yellow-400' : 'text-white'} ml-0.5`}>{stats?.count || 0}</span>
            </span>
          </div>

          <div className="h-3 flex items-center">
            <span className={`text-[6px] font-black uppercase tracking-widest ${isShiny && isFound ? 'text-transparent bg-clip-text bg-gradient-to-r from-red-400 via-yellow-300 to-blue-400 font-extrabold' : style.text}`}>
              {!isFound ? '???' : (isShiny ? 'SHINY SPECIAL' : monster.rarity)}
            </span>
          </div>

          <h4 className={`w-full text-center text-[9px] font-black truncate leading-tight mt-1 ${isShiny ? 'text-white italic' : 'text-white'}`}>
            {!isFound ? '?????????' : monster.name}
          </h4>
        </div>
      </div>

      {/* 🔒 Overlay สำหรับ Unknown */}
      {!isFound && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-2xl z-20 backdrop-blur-[1px]">
          <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest">Locked</span>
        </div>
      )}
    </div>
  );
}