import React from 'react';

export default function MonsterSkillOverlay({ skill }) {
  if (!skill) return null;

  return (
    <div className="absolute inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-[3px] animate-in fade-in zoom-in duration-300">
      <div className="relative w-full">
        {/* 💥 Effect วงแสงหลังชื่อสกิล (ปรับเป็นส้มอำพัน) */}
        <div className="absolute inset-0 bg-orange-500 blur-[60px] opacity-40 animate-pulse" />
        
        {/* แถบพื้นหลัง Gradient สีส้มเข้มตัดดำ */}
        <div className="relative bg-gradient-to-r from-transparent via-orange-950/90 to-transparent py-6 px-4 border-y border-orange-500/50 shadow-[0_0_50px_rgba(249,115,22,0.3)]">
          
          {/* หัวข้อขนาดเล็ก (สีทองสว่าง) */}
          <p className="text-[10px] text-orange-300 font-black uppercase tracking-[0.6em] text-center mb-1 drop-shadow-md">
            Monster Ability
          </p>
          
          {/* ชื่อสกิล (ขาวนวล ตัดด้วยเงาดำเข้ม) */}
          <h2 className="text-4xl font-black text-white italic tracking-tighter uppercase text-center drop-shadow-[0_4px_12px_rgba(0,0,0,1)]">
            {skill.name}
          </h2>

          {/* เส้นขีดตกแต่งเล็กๆ ใต้ชื่อสกิลเพิ่มความพรีเมียม */}
          <div className="mt-2 w-24 h-[2px] bg-gradient-to-r from-transparent via-orange-400 to-transparent mx-auto opacity-70" />
        </div>
      </div>
    </div>
  );
}