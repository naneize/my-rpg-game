import React from 'react';
import { Sword, Shield, Search } from 'lucide-react'; 
import { MONSTER_SKILLS } from '../../data/passive';

export default function PlayerCombatStatus({ player, playerHpPercent, activePassiveTooltip, setActivePassiveTooltip }) {
  
  // ✅ แปลงเปอร์เซ็นต์เลือดให้เป็นทศนิยมเพื่อความนุ่มนวล
  const displayPlayerHpPercent = parseFloat(playerHpPercent).toFixed(2);

  // 🛡️ [จุดที่แก้ไข] กำหนดค่าที่จะนำมาแสดงผลบนหน้าจอ
  // ดึงค่า displayAtk/Def ที่ผ่านการคำนวณสุทธิมาจาก CombatView
  const currentAtk = player.displayAtk ?? player.atk ?? 0;
  const currentDef = player.displayDef ?? player.def ?? 0;

  return (
    <div className="mt-4 pt-3 border-t border-white/5 relative z-10 px-5"> 
      <div className="flex items-center justify-between w-full gap-2">
        
        {/* 1. สเตตัสฝั่งซ้าย: อัปเดตให้ตัวเลขขยับตามสถานะจริง */}
        <div className="flex-1 flex flex-col justify-center items-start">
          <div className="flex flex-col leading-none text-left mb-2">
            <span className="text-[7px] text-blue-400 font-black uppercase tracking-[0.2em] mb-1 opacity-70">Status</span>
            <span className="text-white font-black text-2xl italic leading-none drop-shadow-md">LV.{player.level}</span>
          </div>
          <div className="flex flex-col gap-1.5 w-full">
            <div className="flex gap-2 text-[10px] font-black uppercase bg-slate-900/60 px-2 py-1.5 rounded-xl border border-white/10 w-fit shadow-inner">
              
              {/* ⚔️ แสดงพลังโจมตี: ถ้าโดนลด (Debuff) จะเปลี่ยนเป็นสีชมพูแดงและกระพริบ */}
              <div className={`flex items-center gap-1 tabular-nums transition-all duration-300 
                ${currentAtk < (player.atk || 0) ? 'text-rose-400 animate-pulse font-black' : 'text-red-400'}`}>
                <Sword size={10} />
                <span>{currentAtk}</span>
              </div>

              {/* 🛡️ แสดงพลังป้องกัน: ถ้าโดนลดจะเปลี่ยนสีทันที */}
              <div className={`flex items-center gap-1 tabular-nums transition-all duration-300 
                ${currentDef < (player.def || 0) ? 'text-rose-400 animate-pulse font-black' : 'text-blue-400'}`}>
                <Shield size={10} />
                <span>{currentDef}</span>
              </div>

            </div>
            
            <button 
              onClick={(e) => {
                e.stopPropagation();
                setActivePassiveTooltip('VIEW_ALL'); 
              }}
              className="flex items-center justify-center gap-1.5 px-3 py-1.5 bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/50 rounded-xl transition-all active:scale-95"
            >
              <Search size={10} className="text-emerald-400" />
              <span className="text-[8px] font-black text-emerald-400 uppercase tracking-tighter">View Passives</span>
            </button>
          </div>
        </div>

        {/* 2. ส่วนกลาง: HP & EXP Bar (คงเดิม 100%) */}
        <div className="flex-[1.8] flex flex-col gap-3 px-3 border-x border-white/5">
          <div className="flex flex-col gap-1 w-full">
            <div className="flex justify-between items-end w-full px-0.5">
              <span className="text-[7px] text-emerald-500 font-black uppercase tracking-widest">Vitality</span>
              <span className="font-mono text-[10px] font-black text-white leading-none tracking-tighter tabular-nums">{player.hp} / {player.maxHp}</span>
            </div>
            <div className="w-full h-2 bg-black/60 rounded-full overflow-hidden border border-white/10 relative shadow-inner">
              <div className="absolute top-0 left-0 h-full bg-white/20 hp-bar-ghost" style={{ width: `${displayPlayerHpPercent}%` }} />
              <div className="h-full bg-gradient-to-r from-emerald-600 via-emerald-400 to-emerald-600 hp-bar-transition relative z-10" style={{ width: `${displayPlayerHpPercent}%` }} />
            </div>
          </div>
          <div className="flex flex-col gap-1 w-full">
            <div className="flex justify-between items-end w-full px-0.5">
              <span className="text-[7px] text-amber-500 font-black uppercase tracking-widest">Experience</span>
              <span className="font-mono text-[8px] text-amber-200/50 leading-none tabular-nums">{player.exp} / {player.nextLevelExp}</span>
            </div>
            <div className="w-full h-1 bg-black/40 rounded-full overflow-hidden border border-white/5 relative">
              <div className="h-full bg-gradient-to-r from-amber-600 to-yellow-500 transition-all duration-700" style={{ width: `${(player.exp / (player.nextLevelExp || 100)) * 100}%` }} />
            </div>
          </div>
        </div>

        {/* 3. ฝั่งขวา: Passive Skills (คงเดิม 100%) */}
        <div className="flex flex-col gap-1 pl-2 items-center min-w-[40px]">
          <span className="text-[7px] text-emerald-500 font-black uppercase tracking-tighter opacity-70 mb-0.5 italic">Active</span>
          <div className="flex flex-col gap-1.5">
            {[0, 1, 2].map((i) => {
              const skillId = player.equippedPassives?.[i];
              const skillData = MONSTER_SKILLS.find(s => s.id === skillId);
              return (
                <div key={i} className="relative">
                  <div className={`w-7 h-7 rounded-lg border-2 flex items-center justify-center transition-all duration-300 shadow-lg ${
                    skillData ? 'border-emerald-500 bg-emerald-500/10 shadow-[0_0_12px_rgba(16,185,129,0.3)]' : 'border-white/5 bg-white/5 opacity-20'
                  }`}>
                    {skillData ? <span className="text-sm drop-shadow-[0_0_5px_rgba(16,185,129,0.6)]">{skillData.icon}</span> : <div className="w-1 h-1 bg-white/20 rounded-full" />}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Center Modal Detail (คงเดิม 100%) */}
      {activePassiveTooltip === 'VIEW_ALL' && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-6 animate-in fade-in zoom-in duration-200 shadow-2xl">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setActivePassiveTooltip(null)} />
          <div className="relative w-full max-w-[320px] bg-slate-900 border border-emerald-500/40 rounded-[2.5rem] p-6 shadow-2xl overflow-y-auto max-h-[80vh]">
            <h3 className="text-emerald-400 font-black text-xs uppercase tracking-widest mb-6 text-center italic border-b border-white/5 pb-2">Active Passives Detail</h3>
            <div className="space-y-6">
              {player.equippedPassives.map((skillId, idx) => {
                const skill = MONSTER_SKILLS.find(s => s.id === skillId);
                if (!skill) return null;
                return (
                  <div key={idx} className="space-y-3 border-b border-white/5 pb-4 last:border-0">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/50 flex items-center justify-center text-xl shadow-inner">{skill.icon}</div>
                      <div>
                        <p className="text-[10px] font-black text-white uppercase italic leading-none mb-1">{skill.name}</p>
                        <p className="text-[8px] text-slate-400 leading-tight italic">"{skill.description}"</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
            <button onClick={() => setActivePassiveTooltip(null)} className="w-full mt-6 py-3 bg-emerald-500 text-slate-950 font-black text-[10px] uppercase rounded-2xl shadow-lg active:scale-95 transition-all shadow-emerald-500/20">Close</button>
          </div>
        </div>
      )}
    </div>
  );
}