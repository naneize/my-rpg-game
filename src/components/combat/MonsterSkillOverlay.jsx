export default function MonsterSkillOverlay({ skill }) {
  if (!skill) return null;

  return (
    <div className="absolute inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur-[4px] animate-in fade-in zoom-in duration-300">
      <div className="relative w-full">
        {/* 💥 Effect วงแสงหลังชื่อสกิล ปรับเป็นสีส้มอำพันหม่นๆ ให้เข้ากับปุ่มเดินทาง */}
        <div className="absolute inset-0 bg-orange-900/40 blur-[80px] opacity-50 animate-pulse" />
        
        {/* 🎨 แถบพื้นหลังใช้สีส้มอิฐเข้ม (Stone/Amber) และขอบทองเหลืองแบบปุ่มเดินทาง */}
        <div className="relative bg-gradient-to-r from-transparent via-[#2b1a0a]/95 to-transparent py-8 px-4 border-y-2 border-[#854d0e] shadow-[0_0_40px_rgba(133,77,14,0.3)]">
          
          {/* หัวข้อใช้สีเหลืองทองหม่น (Amber-400) */}
          <p className="text-[10px] text-amber-400 font-black uppercase tracking-[0.6em] text-center mb-1 drop-shadow-md">
            Monster Ability !!
          </p>
          
          {/* ชื่อสกิลใช้สีขาวนวล (Stone-100) ตัดกับขอบเงาสีดำหนาๆ */}
          <h2 className="text-4xl font-black text-stone-100 italic tracking-tighter uppercase text-center drop-shadow-[0_4px_8px_rgba(0,0,0,0.8)]">
            {skill.name}
          </h2>

          {/* เส้นขีดตกแต่งเลียนแบบสีขอบปุ่มเดินทาง */}
          <div className="mt-3 w-32 h-[2px] bg-gradient-to-r from-transparent via-[#854d0e] to-transparent mx-auto opacity-80" />
        </div>
      </div>
    </div>
  );
}