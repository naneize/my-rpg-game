import React from 'react';
import { Sword, Box } from 'lucide-react';

export default function EquipmentSlot({ weapon }) {
  return (
    <div className="bg-slate-900/80 backdrop-blur-md border-2 border-orange-500/30 rounded-[2rem] p-4 shadow-2xl relative overflow-hidden flex-shrink-0 transition-all">
      {/* Background Icon ตกแต่ง */}
      <div className="absolute -top-4 -right-4 opacity-5 rotate-12">
        <Sword size={80} className="text-orange-500" />
      </div>

      <span className="text-[8px] font-black text-orange-500/50 uppercase tracking-widest block mb-3">
        Main Equipment
      </span>

      <div className="flex items-center gap-4 relative z-10">
        {/* ช่องใส่ไอคอนอาวุธ */}
        <div className={`w-16 h-16 rounded-2xl border-2 flex items-center justify-center text-3xl transition-all shadow-inner
          ${weapon 
            ? 'bg-black/60 border-orange-500/50 shadow-orange-500/10' 
            : 'bg-black/40 border-white/5 opacity-30'
          }`}>
          {weapon ? (
            <span className="drop-shadow-[0_0_8px_rgba(249,115,22,0.4)]">{weapon.icon}</span>
          ) : (
            <Box size={20} className="text-slate-700" />
          )}
        </div>

        {/* ข้อมูลอาวุธ */}
        <div className="flex-1 overflow-hidden">
          {weapon ? (
            <div className="animate-in slide-in-from-left duration-300">
              <h4 className="text-[9px] font-black text-orange-400 uppercase italic leading-none mb-1">
                {weapon.rarity}
              </h4>
              <h3 className="text-lg font-black text-white italic truncate uppercase leading-tight mb-1">
                {weapon.name}
              </h3>
              <div className="flex gap-2">
                <span className="text-[8px] font-bold text-orange-400 bg-orange-400/10 px-1.5 py-0.5 rounded border border-orange-400/20">
                  ATK +{weapon.stats.atk}
                </span>
                {weapon.stats.hp && (
                  <span className="text-[8px] font-bold text-emerald-400 bg-emerald-400/10 px-1.5 py-0.5 rounded border border-emerald-400/20">
                    HP +{weapon.stats.hp}
                  </span>
                )}
              </div>
            </div>
          ) : (
            <div className="opacity-40">
              <h3 className="text-sm font-black text-slate-500 uppercase italic">Unarmed</h3>
              <p className="text-[8px] text-slate-600 font-bold uppercase tracking-tighter">
                Forge weapons in the Workshop
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}