import React from 'react';
import { Award, Package, Scroll, CheckCircle2, Sparkles } from 'lucide-react'; 
// ✅ แก้ไข Path ให้ถูกต้องตามโครงสร้างไฟล์ของคุณ
import { EQUIPMENTS } from '../../data/equipments'; 

export default function VictoryLootModal({ lootResult, monster, onFinalize, stats }) {
  if (!lootResult) return null;

  // 🛡️ 1. จัดระเบียบข้อมูลไอเทม
  const baseItems = Array.isArray(lootResult) ? lootResult : (lootResult.items || []);
  
  const droppedSkill = lootResult.skill || baseItems.find(item => 
    item.type === 'SKILL' || (item.skillId && item.skillId !== 'none')
  );
  
  const filteredItems = baseItems.filter(item => {
    const isThisASkill = item.type === 'SKILL' || (item.skillId && item.skillId !== 'none');
    return !isThisASkill;
  });

  const itemsToDisplay = droppedSkill 
    ? [{ ...droppedSkill, isSpecialSkill: true }, ...filteredItems] 
    : filteredItems;

  const playerCollection = stats?.collection?.[monster?.id] || [];
  const requiredLoot = (monster?.lootTable || []).filter(l => l.type !== 'SKILL');
  const isCollectionComplete = requiredLoot.length > 0 && requiredLoot.every(l => playerCollection.includes(l.name));

  // ✨ 2. Helper สำหรับสีตาม Rarity และ Level
  const getRarityStyles = (rarity, level = 0) => {
    const isHighLevel = level >= 2;
    const levelGlow = isHighLevel ? 'ring-2 ring-amber-500/50 shadow-[0_0_20px_rgba(245,158,11,0.4)]' : '';

    switch (rarity) {
      case 'Uncommon': return `${levelGlow} border-emerald-500/50 bg-emerald-500/5 text-emerald-400 shadow-[0_0_10px_rgba(16,185,129,0.1)]`;
      case 'Rare': return `${levelGlow} border-blue-500/50 bg-blue-500/5 text-blue-400 shadow-[0_0_15px_rgba(59,130,246,0.15)]`;
      case 'Epic': return `${levelGlow} border-purple-500/50 bg-purple-500/5 text-purple-400 shadow-[0_0_20px_rgba(168,85,247,0.2)]`;
      case 'Legendary': return `border-amber-500 bg-amber-500/10 text-amber-400 shadow-[0_0_25px_rgba(245,158,11,0.3)] animate-pulse`;
      default: return `${levelGlow} border-white/5 bg-black/40 text-white`;
    }
  };

  return (
    <div className="fixed inset-0 z-[150] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-md" onClick={onFinalize} />

      <div className="relative w-full max-w-[360px] bg-slate-900 border-2 border-amber-500/50 rounded-[2.5rem] overflow-hidden shadow-[0_0_50px_rgba(245,158,11,0.25)] animate-in zoom-in-95 duration-300">
        
        {/* Header */}
        <div className="bg-gradient-to-b from-amber-500/20 to-transparent p-6 text-center border-b border-white/5">
          <div className="inline-flex p-3 bg-amber-500 rounded-2xl shadow-lg mb-2 relative">
            <Award className="text-slate-900" size={32} />
            <Sparkles className="absolute -top-1 -right-1 text-white animate-bounce" size={16} />
          </div>
          <h2 className="text-2xl font-black text-white italic uppercase tracking-tight">Victory!</h2>
          <p className="text-amber-500 text-[9px] font-black uppercase tracking-widest">Defeated: {monster?.name}</p>
        </div>

        <div className="p-6 space-y-4">
          <div className="space-y-2 max-h-[180px] overflow-y-auto pr-1 custom-scrollbar">
             {itemsToDisplay.map((item, index) => {
               const isSkill = !!(item.isSpecialSkill || item.type === 'SKILL');
               const itemLevel = item.level || 0;
               const rarityClass = getRarityStyles(item.rarity, itemLevel);
               
               // ✅ [แก้ไขจุดสำคัญ] ค้นหาโดยใช้ itemId หรือ name เพื่อให้แมตช์กับดาต้าเบส
               const equipData = EQUIPMENTS.find(e => e.id === (item.itemId || item.name));
               const itemSlot = equipData?.slot || item.slot || null;
               
               return (
                 <div key={index} className={`flex justify-between items-center p-2.5 rounded-xl border transition-all ${rarityClass}`}>
                    <div className="flex items-center gap-3">
                      <div className="text-xl relative">
                        {isSkill ? (
                          <Scroll size={18} className="text-amber-500 animate-pulse" />
                        ) : (
                          <>
                            {/* ✅ ดึง icon จาก EQUIPMENTS (เช่น 🧥) แทนที่จะโชว์กล่อง 📦 */}
                            {equipData?.icon || item.icon || item.image || "📦"}
                            {itemLevel > 0 && (
                              <div className="absolute -top-2 -right-2 bg-amber-500 text-[8px] font-black text-slate-950 px-1 rounded-sm border border-slate-900 shadow-lg">
                                +{itemLevel}
                              </div>
                            )}
                          </>
                        )}
                      </div>
                      <div className="flex flex-col">
                        <div className="flex items-center gap-1.5">
                          <span className="text-[10px] font-black uppercase tracking-wide leading-none mb-0.5">
                            {/* ✅ แสดงชื่อภาษาไทยจากฐานข้อมูลอุปกรณ์ */}
                            {equipData?.name || item.name}
                          </span>
                          {itemLevel >= 2 && <Sparkles size={10} className="text-amber-500 animate-pulse" />}
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-[7px] font-bold opacity-60 uppercase tracking-widest">
                            {isSkill ? 'Special Skill' : item.rarity || 'Common'}
                          </span>
                          {/* ✅ แสดง TEXT EQUIPMENT และประเภทอุปกรณ์ให้ชัดเจน */}
                          {itemSlot && (
                            <div className="flex items-center gap-1">
                              <span className="text-[6px] font-black text-amber-500/80 uppercase">EQUIPMENT:</span>
                              <span className="text-[6px] px-1 bg-white/10 rounded font-black text-slate-300 uppercase tracking-tighter">
                                {itemSlot}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                       <span className={`text-[8px] font-black animate-pulse ${itemLevel >= 2 ? 'text-amber-400' : 'text-emerald-400'}`}>
                         {itemLevel >= 2 ? 'SUPER!' : 'NEW!'}
                       </span>
                    </div>
                 </div>
               );
             })}
          </div>

          {/* Exp Section */}
          <div className="w-full">
            <div className="bg-slate-950/80 rounded-xl py-3 px-4 border border-blue-500/20 text-center shadow-inner relative overflow-hidden group">
              <span className="relative z-10 text-[10px] font-black text-slate-400 uppercase block mb-1 tracking-widest">Experience Gained</span>
              <span className="relative z-10 text-2xl font-black text-blue-400 italic">+{monster?.exp || 0}</span>
            </div>
          </div>

          <button 
            onClick={onFinalize} 
            className="w-full py-4 bg-gradient-to-r from-orange-600 to-orange-400 text-white font-black rounded-2xl uppercase italic text-lg shadow-[0_10px_20px_rgba(234,88,12,0.3)] active:scale-95 transition-all hover:brightness-110"
          >
            Claim Rewards
          </button>
        </div>
      </div>
    </div>
  );
}