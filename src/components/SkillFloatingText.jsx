import React from 'react';

export default function SkillFloatingText({ name }) {
  return (
    // ✅ เปลี่ยนจาก fixed เป็น absolute และถอด inset-0 ออก
    // ✅ ใช้ top-1/2 left-1/2 เพื่อให้แกนกลางอ้างอิงจาก Container มอนสเตอร์พอดี
    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[200] pointer-events-none select-none px-4 w-full flex justify-center">
      <div className="animate-skill-center-pop flex flex-col items-center">
        
        {/* 🏷️ ข้อความหัวเล็กๆ: ปรับ mb-2 เพื่อให้มีระยะหายใจระหว่างชื่อสกิล */}
        <span className="text-[7px] md:text-[8px] text-amber-500 font-black uppercase tracking-[0.4em] drop-shadow-md italic mb-2">
          Monster Ability !!
        </span>
        
        {/* ⚔️ ชื่อสกิล: ปรับขนาดลง (text-2xl - 3xl) เพื่อไม่ให้บังมอนสเตอร์จนมิด */}
        <h2 className="text-1 sm:text-3xl md:text-2xl font-black text-white italic tracking-tighter uppercase text-stroke-black drop-shadow-[0_0_20px_rgba(245,158,11,0.8)] text-center leading-none whitespace-nowrap">
          {name}
        </h2>
        
        {/* 📏 เส้นขีดล่าง: ปรับความยาวให้รับกับขนาดฟอนต์ใหม่ */}
        <div className="w-24 md:w-32 h-[1px] md:h-[2px] bg-gradient-to-r from-transparent via-amber-500 to-transparent mt-1 shadow-[0_0_15px_rgba(245,158,11,0.5)]" />
      </div>
    </div>
  );
}