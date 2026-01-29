import React from 'react';
import { Sparkles } from 'lucide-react';

// สไตล์ของไอเทม (ย้ายมาจากหน้าหลัก)
const rarityStyles = {
  Common: { border: "border-slate-700", bg: "bg-slate-800/40" },
  Uncommon: { border: "border-green-800", bg: "bg-green-950/30" },
  Rare: { border: "border-blue-800", bg: "bg-blue-950/30" },
  Epic: { border: "border-purple-800", bg: "bg-purple-950/30" },
  Legendary: { border: "border-orange-600", bg: "bg-orange-950/40" },
};

export default function VictoryLootModal({ lootResult, monster, hasSkillDropped, onFinalize }) {
  if (!lootResult) return null;

  const hasLegendary = lootResult.some(item => item.rarity === 'Legendary');

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-6 text-center overflow-hidden">
      <div className="absolute inset-0 bg-black/90 backdrop-blur-md" />
      
      <div className={`relative bg-slate-900 border-2 rounded-[3rem] p-8 w-full max-w-sm z-[210] animate-in zoom-in 
        ${hasLegendary ? 'border-orange-500 mt-16 shadow-[0_0_80px_rgba(249,115,22,0.6)]' : 'border-yellow-500/50 shadow-[0_0_60px_rgba(234,179,8,0.3)]'}`}>
        
        <div className={`absolute -top-10 left-1/2 -translate-x-1/2 p-4 rounded-full shadow-lg animate-bounce ${hasLegendary ? 'bg-orange-600' : 'bg-yellow-500'}`}>
          <Sparkles className="text-white" size={32} />
        </div>

        <h2 className={`font-black text-3xl italic uppercase tracking-tighter mb-4 ${hasLegendary ? 'text-orange-500' : 'text-yellow-500'}`}>
          {hasLegendary ? 'GODLIKE!' : 'Victory Loot'}
        </h2>
        
        <div className="mb-4 flex flex-col gap-1 items-center">
            <div className="text-blue-400 font-mono text-[10px] uppercase font-bold tracking-widest">+ {monster.exp} Experience Points</div>
            {monster.onDeathHeal > 0 && (
              <div className="text-emerald-400 font-mono text-[10px] uppercase font-bold tracking-widest animate-pulse">
                + {monster.onDeathHeal} HP RECOVERED
              </div>
            )}
        </div>
        
        <div className="space-y-3 mb-8 max-h-60 overflow-y-auto pr-1 text-left custom-scrollbar">
          {/* ส่วนแสดง Skill ที่ดรอป */}
          {hasSkillDropped && (
            <div className="relative flex items-center gap-4 p-3 rounded-2xl border-2 border-orange-500 bg-orange-950/40 animate-pulse">
              <div className="w-12 h-12 flex-shrink-0 bg-black/40 rounded-xl flex items-center justify-center border border-orange-500/30 shadow-[0_0_15px_rgba(245,158,11,0.3)]">
                <span className="text-2xl">📜</span> 
              </div>
              <div className="flex-grow min-w-0">
                <div className="text-[8px] font-black uppercase leading-none mb-1 text-orange-400">NEW SKILL UNLOCKED!</div>
                <div className="text-sm font-bold text-white uppercase italic tracking-tighter">คัมภีร์ทักษะลับ</div>
              </div>
            </div>
          )}

          {/* ส่วนแสดงไอเทมดรอปทั่วไป */}
          {lootResult.map((item, i) => (
            <div key={item.id || i} className={`relative flex items-center gap-4 p-3 rounded-2xl border-2 transition-all ${rarityStyles[item.rarity]?.bg} ${rarityStyles[item.rarity]?.border}`}>
              <div className="w-12 h-12 flex-shrink-0 bg-black/40 rounded-xl flex items-center justify-center border border-white/5">
                {item.image ? <img src={item.image} alt="" className="w-full h-full object-contain" /> : <span className="text-2xl text-center">📦</span>}
              </div>
              <div className="flex-grow min-w-0">
                <div className={`text-[8px] font-black uppercase leading-none mb-1 ${item.rarity === 'Legendary' ? 'text-orange-400' : 'opacity-70'}`}>{item.rarity}</div>
                <div className={`text-sm font-bold truncate ${item.rarity === 'Legendary' ? 'text-white' : 'text-slate-200'}`}>{item.name}</div>
              </div>
            </div>
          ))}
        </div>

        <button onClick={onFinalize} className={`w-full py-5 font-black rounded-2xl transition-all uppercase tracking-widest active:scale-95 shadow-lg ${hasLegendary ? 'bg-gradient-to-r from-orange-600 to-orange-500 text-white' : 'bg-gradient-to-r from-yellow-600 to-yellow-500 text-white'}`}>
          กลับสู่การเดินทาง
        </button>
      </div>
    </div>
  );
}