// ✅ ฉบับแก้ไขสีหม่นใน MonsterSkillOverlay.jsx
export default function MonsterSkillOverlay({ skill }) {
  if (!skill) return null;

  return (
    // 1. เปลี่ยน bg-black เป็นสีน้ำตาลเข้ม (stone-950) และลด blur ลงเหลือ [2px]
    <div className="absolute inset-0 z-[100] flex items-center justify-center bg-stone-950/60 backdrop-blur-[2px] animate-in fade-in zoom-in duration-300">
      <div className="relative w-full">
        {/* 💥 Effect วงแสง ปรับให้สว่างขึ้นเพื่อสู้กับความมืด */}
        <div className="absolute inset-0 bg-amber-600/20 blur-[100px] opacity-70 animate-pulse" />
        
        {/* 🎨 ปรับ Gradient ให้ดูมีมิติ ไม่มืดจนกลืนสีอื่น */}
        <div className="relative bg-gradient-to-r from-transparent via-stone-900/95 to-transparent py-8 px-4 border-y-2 border-amber-700/50 shadow-[0_0_50px_rgba(0,0,0,0.5)]">
          
          <p className="text-[10px] text-amber-500 font-black uppercase tracking-[0.6em] text-center mb-1 drop-shadow-md">
            Monster Ability !!
          </p>
          
          <h2 className="text-4xl font-black text-white italic tracking-tighter uppercase text-center drop-shadow-[0_4px_12px_rgba(0,0,0,1)]">
            {skill.name}
          </h2>

          <div className="mt-3 w-32 h-[1px] bg-gradient-to-r from-transparent via-amber-500 to-transparent mx-auto opacity-50" />
        </div>
      </div>
    </div>
  );
}