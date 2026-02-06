import React from 'react';

export default function SkillFloatingText({ name, isWorldBoss }) {
  return (
    // ✅ 1. ปรับ Y-axis จาก top-1/2 เป็น top-[60%] เพื่อเลื่อนข้อความลงมาไม่ให้บังหน้าบอส
    <div className="absolute top-[60%] left-1/2 -translate-x-1/2 -translate-y-1/2 z-[200] pointer-events-none select-none px-6 w-full flex justify-center">
      
      {/* ✅ 2. ลด Scale จาก 125 เป็น 110 เพื่อไม่ให้ใหญ่จนล้นจอ */}
      <div className={`flex flex-col items-center ${isWorldBoss ? 'animate-boss-skill-pop scale-110' : 'animate-skill-center-pop'}`}>
        
        {/* 🏷️ Badge หัวข้อ (ปรับขนาดฟอนต์ให้เล็กลง) */}
        <span className={`text-[6px] md:text-[8px] font-black uppercase tracking-[0.3em] italic mb-1.5 drop-shadow-md
          ${isWorldBoss ? 'text-amber-400' : 'text-slate-400'}`}>
          {isWorldBoss ? '✦ Ancient Overlord Art ✦' : 'Monster Ability !!'}
        </span>
        
        {/* ⚔️ ชื่อสกิล */}
        <div className="relative">
           {isWorldBoss && <div className="absolute inset-0 bg-amber-500/30 blur-xl animate-pulse" />}
           
           {/* ✅ 3. ปรับขนาดฟอนต์จาก 4xl เหลือ 2xl/3xl เพื่อให้ดูพอดีกับกรอบรูป */}
           <h2 className={`relative text-xl sm:text-2xl md:text-2xl font-black italic tracking-tighter uppercase text-center leading-none whitespace-nowrap
             ${isWorldBoss 
                ? 'text-transparent bg-clip-text bg-gradient-to-b from-white via-amber-100 to-amber-500 drop-shadow-[0_4px_8px_rgba(0,0,0,0.8)]' 
                : 'text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.5)]'}`}>
             {name}
           </h2>
        </div>
        
        {/* 📏 เส้นขีดล่าง (ลดความยาวให้รับกับตัวอักษร) */}
        <div className={`h-[1.5px] mt-2 shadow-lg transition-all duration-500
          ${isWorldBoss 
             ? 'w-32 bg-gradient-to-r from-transparent via-amber-400 to-transparent shadow-[0_0_15px_rgba(245,158,11,0.6)]' 
             : 'w-20 bg-gradient-to-r from-transparent via-white/50 to-transparent'}`} 
        />
      </div>
    </div>
  );
}