import React from 'react';
import { Star, Award, Package, Scroll, CheckCircle2, Sparkles } from 'lucide-react'; 

export default function VictoryLootModal({ lootResult, monster, onFinalize, stats }) {
  if (!lootResult) return null;

  // 🛡️ 1. จัดระเบียบข้อมูลไอเทม (อิงตามโครงสร้างเดิมของเธอ)
  const baseItems = Array.isArray(lootResult) ? lootResult : (lootResult.items || []);
  
  // 🔍 2. ค้นหาสกิล (Logic เดิมของเธอ)
  const droppedSkill = lootResult.skill || baseItems.find(item => 
    item.type === 'SKILL' || (item.skillId && item.skillId !== 'none')
  );
  
  // 📦 3. กรองไอเทมปกติ (ไม่รวมสกิล)
  const filteredItems = baseItems.filter(item => {
    const isThisASkill = item.type === 'SKILL' || (item.skillId && item.skillId !== 'none');
    return !isThisASkill;
  });

  // 🧪 4. รวมร่างเพื่อแสดงผล (สกิลขึ้นอันแรก)
  const itemsToDisplay = droppedSkill 
    ? [{ ...droppedSkill, isSpecialSkill: true }, ...filteredItems] 
    : filteredItems;

  // 🏆 5. [หัวใจหลัก] เช็คความครบของคอลเลกชัน (ไม่นับสกิล)
  const playerCollection = stats?.collection?.[monster?.id] || [];
  const requiredLoot = (monster?.lootTable || []).filter(l => l.type !== 'SKILL');
  const isCollectionComplete = requiredLoot.length > 0 && requiredLoot.every(l => playerCollection.includes(l.name));

  return (
    <div className="fixed inset-0 z-[150] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-md" onClick={onFinalize} />

      <div className="relative w-full max-w-[360px] bg-slate-900 border-2 border-amber-500/50 rounded-[2.5rem] overflow-hidden shadow-[0_0_50px_rgba(245,158,11,0.25)]">
        
        {/* Header */}
        <div className="bg-gradient-to-b from-amber-500/20 to-transparent p-6 text-center border-b border-white/5">
          <div className="inline-flex p-3 bg-amber-500 rounded-2xl shadow-lg mb-2">
            <Award className="text-slate-900" size={32} />
          </div>
          <h2 className="text-2xl font-black text-white italic uppercase tracking-tight">Victory!</h2>
          <p className="text-amber-500 text-[9px] font-black uppercase tracking-widest">Defeated: {monster?.name}</p>
        </div>

        <div className="p-6 space-y-4">
          
          {/* รายการไอเทมที่ดรอป */}
          <div className="space-y-2 max-h-[180px] overflow-y-auto pr-1">
             {itemsToDisplay.length > 0 ? (
               itemsToDisplay.map((item, index) => {
                 const isSkill = !!(item.isSpecialSkill || item.type === 'SKILL');
                 return (
                   <div key={index} className={`flex justify-between items-center bg-black/40 p-2.5 rounded-xl border ${isSkill ? 'border-orange-500/50' : 'border-white/5'}`}>
                      <div className="flex items-center gap-2">
                        <span className="text-sm">{isSkill ? <Scroll size={14} className="text-amber-500" /> : (item.image || "📦")}</span>
                        <span className={`text-[10px] font-bold ${isSkill ? 'text-amber-400' : 'text-white'}`}>{item.name}</span>
                      </div>
                      <span className="text-[8px] text-emerald-400 font-black">NEW!</span>
                   </div>
                 );
               })
             ) : (
               isCollectionComplete ? (
                 <div className="py-6 flex flex-col items-center justify-center bg-emerald-500/5 rounded-2xl border border-emerald-500/20">
                   <div className="relative mb-2">
                     <Package className="text-emerald-500/40" size={32} />
                     <CheckCircle2 className="absolute -bottom-1 -right-1 text-emerald-400 bg-slate-900 rounded-full" size={16} />
                   </div>
                   <p className="text-[10px] font-black text-emerald-400 uppercase tracking-[0.2em] text-center">
                     {monster?.name} <br/> Collection Complete
                   </p>
                   <p className="text-[7px] text-emerald-600 font-bold uppercase mt-1 italic opacity-70">
                     All rewards acquired
                   </p>
                 </div>
               ) : (
                 <div className="py-4 text-center opacity-40">
                   <Package className="mx-auto mb-1 text-slate-600" size={20} />
                   <p className="text-[9px] text-slate-500 italic uppercase">No new collection items</p>
                 </div>
               )
             )}
          </div>

          {/* 📊 สรุปผล Exp (ตัด Gold ออกและปรับ Layout เป็น Full Width) */}
          <div className="w-full">
            <div className="bg-slate-950/80 rounded-xl py-3 px-4 border border-blue-500/20 text-center shadow-inner">
              <span className="text-[10px] font-black text-slate-400 uppercase block mb-1 tracking-widest">Experience Gained</span>
              <span className="text-2xl font-black text-blue-400 italic">+{monster?.exp || 0}</span>
            </div>
          </div>

          {/* 🏆 [ไฮไลท์] แถบแจ้งเตือนสะสมครบเซต */}
          {isCollectionComplete && (
            <div className="bg-emerald-500/20 border border-emerald-500/40 rounded-2xl p-3 flex items-center justify-center gap-2 shadow-[0_0_15px_rgba(16,185,129,0.2)]">
              <Sparkles className="text-amber-400" size={16} />
              <div className="flex flex-col items-center">
                <span className="text-emerald-400 font-black text-[10px] uppercase tracking-tighter text-center">
                  {monster?.name} Collection Complete!
                </span>
                <span className="text-[7px] text-emerald-500/70 font-bold uppercase tracking-widest">Permanent Bonus Active</span>
              </div>
              <Sparkles className="text-amber-400" size={16} />
            </div>
          )}

          {/* ปุ่ม Claim Rewards */}
          <button 
            onClick={onFinalize} 
            className="w-full py-4 bg-orange-500 text-white font-black rounded-2xl uppercase italic text-lg shadow-lg active:scale-95 transition-transform hover:bg-orange-400"
          >
            Claim Rewards
          </button>
        </div>
      </div>
    </div>
  );
}