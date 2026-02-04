import React from 'react';
import { Sparkles } from 'lucide-react';

export default function MonsterCard({ monster, stats, style, onClick }) {
  const isFound = !!stats;
  // ✅ เช็คว่าเคยสยบเวอร์ชัน Shiny มาหรือยัง
  const isShiny = stats?.hasShiny || false;

  return (
    <div 
      onClick={onClick}
      // ✅ แก้ไข: ใช้ 'animate-rainbow-border' เพื่อให้ขอบรุ้งหมุนวนได้ตาม CSS ที่เราเขียนไว้
      className={`relative flex flex-col items-center p-[2px] rounded-2xl cursor-pointer transition-all duration-500 active:scale-95 overflow-hidden
        ${isFound 
          ? `${isShiny 
              ? 'animate-rainbow-border shadow-[0_0_20px_rgba(255,255,255,0.3)]' 
              : `${style.border} border-2 bg-slate-900/60 shadow-lg`}` 
          : 'border-2 border-slate-800 bg-slate-950/40 grayscale brightness-50'}`}
    >
      
      {/* 🌈 Inner Container: เพื่อให้เห็นขอบสีรุ้งหมุนวนอยู่ด้านหลัง (ใช้เฉพาะตอนเป็น Shiny) */}
      <div className={`w-full h-full flex flex-col items-center p-3 rounded-[14px] relative z-10 
        ${isShiny ? 'bg-slate-900/95 backdrop-blur-sm' : ''}`}>
        
        {/* ✨ Shiny Effect: แสงวูบวาบหลังตัวมอนสเตอร์ */}
        {isFound && isShiny && (
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white/10 via-transparent to-transparent animate-pulse" />
        )}

        {/* 🖼️ Monster Image Area */}
        <div className={`h-16 flex items-center justify-center mb-2 relative z-10 ${isShiny ? 'drop-shadow-[0_0_8px_rgba(255,255,255,0.6)]' : ''}`}>
          {monster.image.startsWith('/') ? (
            <img src={monster.image} className={`h-full object-contain transition-transform ${isShiny ? 'scale-110' : ''}`} alt={monster.name} />
          ) : (
            <span className={`text-4xl ${isShiny ? 'animate-bounce' : ''}`}>{monster.image}</span>
          )}
          
          {/* ไอคอนประกายมุมขวาบนภาพ */}
          {isShiny && (
            <div className="absolute -top-1 -right-1 text-white animate-pulse">
              <Sparkles size={12} fill="currentColor" />
            </div>
          )}
        </div>

        {/* 📊 Status Area */}
        <div className="w-full flex flex-col items-center gap-1 relative z-10">
          
          {/* ✅ DEFEAT: บรรทัดเท่ากันเป๊ะ */}
          <div className={`h-5 flex items-center px-2 rounded-full border ${isShiny ? 'bg-white/10 border-white/20' : 'bg-black/40 border-white/5'}`}>
            <span className={`text-[7px] font-black uppercase tracking-tighter ${isShiny ? 'text-white' : 'text-slate-400'}`}>
              DEFEAT: <span className={`${isShiny ? 'text-yellow-400' : 'text-white'} ml-0.5`}>{stats?.count || 0}</span>
            </span>
          </div>

          {/* ✅ RARITY: คุมพื้นที่เท่ากัน */}
          <div className="h-3 flex items-center">
            <span className={`text-[6px] font-black uppercase tracking-widest ${isShiny ? 'text-transparent bg-clip-text bg-gradient-to-r from-red-400 via-yellow-300 to-blue-400 font-extrabold' : style.text}`}>
              {isShiny ? 'SHINY SPECIAL' : monster.rarity}
            </span>
          </div>

          {/* ✅ NAME: ใช้ truncate กันบรรทัดดีด */}
          <h4 className={`w-full text-center text-[9px] font-black truncate leading-tight mt-1 ${isShiny ? 'text-white italic' : 'text-white'}`}>
            {monster.name}
          </h4>
        </div>
      </div>

      {/* 🔒 Overlay สำหรับ Unknown */}
      {!isFound && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/20 rounded-2xl z-20">
          <span className="text-[8px] font-black text-slate-700 uppercase tracking-widest">Unknown</span>
        </div>
      )}
    </div>
  );
}