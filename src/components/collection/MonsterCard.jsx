import React from 'react';

export default function MonsterCard({ monster, stats, style, onClick }) {
  const isOwned = !!stats; 

  return (
    <div 
      className="relative group cursor-pointer"
      onClick={() => isOwned && onClick()}
    >
      {/* 🃏 ตัวการ์ด: กรอบสีตามระดับ Rare (Single Border Theme) */}
      <div className={`relative aspect-[3/4] p-[2px] rounded-2xl transition-all duration-500
        ${isOwned 
          ? `hover:scale-105 active:scale-95 shadow-[0_0_15px_rgba(0,0,0,0.3)]` 
          : 'opacity-40 grayscale blur-[0.5px]'}`}>
        
        {/* กรอบชั้นในที่แสดงสีตาม Rarity และเอฟเฟกต์เรืองแสง */}
        <div className={`w-full h-full p-2 rounded-[14px] flex flex-col items-center justify-between z-10 transition-all border-2
          ${isOwned 
            ? `bg-slate-900 ${style.border} shadow-[0_0_10px_rgba(0,0,0,0.5),_inset_0_0_10px_rgba(255,255,255,0.05)]` 
            : 'bg-slate-950 border-slate-900'}`}>
          
          {/* 👾 Monster Image Section */}
          <div className="flex-1 flex flex-col items-center justify-center w-full overflow-hidden p-1 relative">
            {monster.image && monster.image.startsWith('/') ? (
              <img 
                src={monster.image} 
                alt={monster.name} 
                className={`w-full h-full object-contain transition-all duration-700
                  ${isOwned 
                    ? `drop-shadow-[0_0_8px_rgba(255,255,255,0.1)]` 
                    : 'brightness-0 opacity-80 invert-[0.1]'}`} 
              />
            ) : (
              <span className={`text-4xl transition-all duration-700 ${isOwned ? '' : 'brightness-0 opacity-60'}`}>
                {monster.image || '👾'}
              </span>
            )}

            {/* ส่วนแสดงจำนวนครั้งที่ปราบได้ (Defeat Count) */}
            {isOwned && (
              <div className="mt-1">
                <span className={`text-[7px] font-black uppercase px-2 py-0.5 rounded-full border bg-slate-950/40 ${style.text} ${style.border}`}>
                  DEFEAT: {stats.count}
                </span>
              </div>
            )}
          </div>

          {/* 📝 Name Label */}
          <div className="text-center w-full mt-1">
            <p className={`text-[7px] font-black uppercase mb-0.5 tracking-tighter
              ${isOwned ? style.text : 'text-slate-700 italic'}`}>
              {isOwned ? monster.rarity : 'Unknown'}
            </p>
            <h4 className={`text-[10px] font-bold leading-tight truncate px-1
              ${isOwned ? 'text-white' : 'text-slate-800'}`}>
              {isOwned ? monster.name : '???'}
            </h4>
          </div>
        </div>
      </div>
    </div>
  );
}