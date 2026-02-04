import React from 'react';
import { Star, Award, Package } from 'lucide-react'; // ✅ เปลี่ยน TreasureChest เป็น Package แทนจ่ะ

export default function VictoryLootModal({ lootResult, monster, hasSkillDropped, onFinalize }) {
  if (!lootResult) return null;

  return (
    <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 animate-in fade-in duration-300">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-md" onClick={onFinalize} />

      <div className="relative w-full max-w-[360px] bg-slate-900 border-2 border-amber-500/50 rounded-[2.5rem] overflow-hidden shadow-[0_0_50px_rgba(245,158,11,0.25)]">
        
        <div className="bg-gradient-to-b from-amber-500/20 to-transparent p-6 text-center border-b border-white/5">
          <div className="inline-flex p-3 bg-amber-500 rounded-2xl shadow-lg mb-2">
            <Award className="text-slate-900" size={32} />
          </div>
          <h2 className="text-2xl font-black text-white italic uppercase tracking-tight">Victory!</h2>
          <p className="text-amber-500 text-[9px] font-black uppercase tracking-widest">
            Defeated: {monster?.name}
          </p>
        </div>

        <div className="p-6 space-y-4">
          <div className="space-y-2 max-h-[180px] overflow-y-auto pr-1">
            {lootResult.map((item, index) => (
              <div key={item.id || index} className="flex items-center gap-3 p-2.5 bg-white/5 rounded-2xl border border-white/5">
                
                {/* 🖼️ แก้ไขการแสดงรูปไอเทม: รองรับ Path /images/items/ จากโฟลเดอร์ public */}
                <div className="w-12 h-12 flex-shrink-0 bg-slate-800 rounded-xl flex items-center justify-center border border-white/10 overflow-hidden">
                  {item.image && typeof item.image === 'string' && item.image.startsWith('/') ? (
                    <img 
                      src={item.image} 
                      alt={item.name} 
                      className="w-full h-full object-contain p-1.5" 
                      // ✅ ถ้าโหลดรูปจากไฟล์ไม่ได้ ให้เปลี่ยนมาใช้ Emoji แทน (กันรูปแตก)
                      onError={(e) => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'block'; }}
                    />
                  ) : null}
                  <span className={`text-2xl ${item.image && item.image.startsWith('/') ? 'hidden' : 'block'}`}>
                    {item.image || "📦"}
                  </span>
                </div>

                <div className="flex-1 min-w-0">
                  <h4 className="text-white font-black text-xs uppercase italic truncate">{item.name}</h4>
                  <p className="text-[8px] font-bold text-slate-500 uppercase">{item.rarity || 'Common'}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div className="bg-slate-950/50 rounded-xl py-2 px-3 border border-white/5 text-center">
              <span className="text-[8px] font-bold text-slate-500 uppercase block">Gold</span>
              <span className="text-amber-500 font-black italic">+{monster?.gold || 0}</span>
            </div>
            <div className="bg-slate-950/50 rounded-xl py-2 px-3 border border-white/5 text-center">
              <span className="text-[8px] font-bold text-slate-500 uppercase block">Exp</span>
              <span className="text-blue-400 font-black italic">+{monster?.exp || 0}</span>
            </div>
          </div>

          <button 
            onClick={onFinalize}
            className="w-full py-4 bg-gradient-to-r from-amber-600 to-amber-500 text-white font-black rounded-2xl uppercase italic text-lg"
          >
            Claim Rewards
          </button>
        </div>
      </div>
    </div>
  );
}