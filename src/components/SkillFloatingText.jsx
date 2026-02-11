import React from 'react';

export default function SkillFloatingText({ name, isWorldBoss }) {
  // ⚡ ตรวจสอบว่าเป็นสกิล Overload ของผู้เล่นหรือไม่
  const isOverload = name?.includes('OVERLOAD');

  return (
    // ✅ ปรับตำแหน่งให้เหมาะสม ไม่บังตัวละคร/บอส
    <div className="absolute top-[60%] left-1/2 -translate-x-1/2 -translate-y-1/2 z-[200] pointer-events-none select-none px-6 w-full flex justify-center font-mono">
      
      <div className={`flex flex-col items-center 
        ${isOverload ? 'animate-bounce scale-125' : isWorldBoss ? 'animate-boss-skill-pop scale-110' : 'animate-skill-center-pop'}`}>
        
        {/* 🏷️ Badge หัวข้อ (Tactical Header) */}
        <span className={`text-[7px] md:text-[9px] font-[1000] uppercase tracking-[0.4em] italic mb-1.5 drop-shadow-md px-2 py-0.5
          ${isOverload ? 'text-black bg-amber-500 shadow-[0_0_10px_rgba(245,158,11,0.8)]' : isWorldBoss ? 'text-amber-400' : 'text-slate-400'}`}>
          {isOverload 
            ? '>> SYSTEM_NEURAL_STRIKE <<' 
            : (isWorldBoss ? '✦ Ancient Overlord Art ✦' : 'Monster Ability !!')}
        </span>
        
        {/* ⚔️ ชื่อสกิล (Hard-Edge Highlight) */}
        <div className="relative">
           {/* แสงฟุ้งกระจายถ้าเป็น Overload หรือ Boss */}
           {(isOverload || isWorldBoss) && (
             <div className={`absolute inset-0 blur-2xl animate-pulse 
               ${isOverload ? 'bg-orange-600/50' : 'bg-amber-500/30'}`} />
           )}
           
           <h2 className={`relative text-2xl sm:text-3xl md:text-4xl font-[1000] italic tracking-tighter uppercase text-center leading-none whitespace-nowrap
             ${isOverload 
                ? 'text-transparent bg-clip-text bg-gradient-to-b from-white via-amber-200 to-orange-500 drop-shadow-[0_0_15px_rgba(245,158,11,1)]'
                : isWorldBoss 
                  ? 'text-transparent bg-clip-text bg-gradient-to-b from-white via-amber-100 to-amber-500 drop-shadow-[0_4px_8px_rgba(0,0,0,0.8)]' 
                  : 'text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.5)]'}`}>
             {name}
           </h2>
        </div>
        
        {/* 📏 เส้นขีดล่าง Tactical Divider */}
        <div className={`h-[2px] mt-2 shadow-lg transition-all duration-700
          ${isOverload
             ? 'w-48 bg-gradient-to-r from-transparent via-orange-500 to-transparent shadow-[0_0_20px_rgba(249,115,22,0.8)]'
             : isWorldBoss 
               ? 'w-32 bg-gradient-to-r from-transparent via-amber-400 to-transparent shadow-[0_0_15px_rgba(245,158,11,0.6)]' 
               : 'w-24 bg-gradient-to-r from-transparent via-white/50 to-transparent'}`} 
        />

        {/* 🛰️ ข้อมูลเสริมเล็กๆ ถ้าเป็น Overload */}
        {isOverload && (
          <span className="text-[6px] font-black text-amber-500/80 uppercase tracking-widest mt-1 animate-pulse">
            Neural_Synchronization_at_100%
          </span>
        )}
      </div>
    </div>
  );
}