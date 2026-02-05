import React from 'react';

export default function SkillFloatingText({ name }) {
  return (
    // ✅ ปรับตำแหน่ง top ให้สูงขึ้นเล็กน้อยบนมือถือ (25%) เพื่อไม่ให้บังตัวมอนสเตอร์
    <div className="absolute left-1/2 top-[25%] md:top-[30%] -translate-x-1/2 z-[110] pointer-events-none select-none w-full max-w-[90vw] flex justify-center">
      <div className="animate-skill-pop flex flex-col items-center">
        
        {/* 🏷️ ข้อความหัวเล็กๆ: ปรับขนาดให้จิ๋วลงบนมือถือเพื่อความเท่ */}
        <span className="text-[8px] md:text-[10px] text-amber-500 font-black uppercase tracking-[0.2em] md:tracking-[0.3em] drop-shadow-md italic">
          Monster Ability !!
        </span>
        
        {/* ⚔️ ชื่อสกิล: ใช้ text-2xl สำหรับจอเล็กมาก, 3xl สำหรับมือถือปกติ, 4xl สำหรับจอใหญ่ */}
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-white italic tracking-tighter uppercase text-stroke-black drop-shadow-[0_0_15px_rgba(245,158,11,0.8)] text-center leading-none">
          {name}
        </h2>
        
        {/* 📏 เส้นขีดล่าง: ปรับความกว้างให้ยืดหยุ่น (w-32 บนมือถือ, w-48 บนจอใหญ่) */}
        <div className="w-32 md:w-48 h-[1.5px] md:h-[2px] bg-gradient-to-r from-transparent via-amber-500 to-transparent mt-1 shadow-lg opacity-80" />
      </div>
    </div>
  );
}