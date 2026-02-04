import React from 'react';
import { Star, Award, Package, Scroll } from 'lucide-react'; 

// ✅ สไตล์สี (คงเดิม)
const rarityBorderStyles = {
  Common: "border-white/5 bg-white/5",
  Uncommon: "border-green-500/40 bg-green-500/5",
  Rare: "border-blue-500/50 bg-blue-500/5",
  Epic: "border-purple-500/60 bg-purple-500/10",
  Legendary: "border-orange-500 bg-orange-500/10 shadow-[0_0_20px_rgba(249,115,22,0.25)]",
  Skill: "border-orange-500 bg-gradient-to-r from-orange-500/30 to-amber-500/30 shadow-[0_0_25px_rgba(249,115,22,0.5)]"
};

const rarityTextStyles = {
  Common: "text-slate-500", Legendary: "text-orange-400", Skill: "text-amber-400 font-black"
};

export default function VictoryLootModal({ lootResult, monster, onFinalize }) {
  // 🔍 DEBUG: ส่องค่าที่ส่งมาจ่ะ
  console.log("Debug LootResult:", lootResult);

  if (!lootResult) return null;

  // 🛡️ 1. จัดระเบียบข้อมูลไอเทมพื้นฐาน
  const baseItems = Array.isArray(lootResult) ? lootResult : (lootResult.items || []);
  
  // 🔍 2. ค้นหาสกิลแบบ "ปูพรม" (Logic เดิมของเธอ)
  const droppedSkill = lootResult.skill || baseItems.find(item => 
    item.type === 'SKILL' || 
    (item.skillId && item.skillId !== 'none') ||
    item.name?.toLowerCase().includes('skill') ||
    item.name?.toLowerCase().includes('passive')
  );
  
  // 📦 3. กรองไอเทมปกติ
  const filteredItems = baseItems.filter(item => {
    const isThisASkill = item.type === 'SKILL' || (item.skillId && item.skillId !== 'none');
    return !isThisASkill;
  });

  // 🧪 4. รวมร่างเพื่อแสดงผล (สกิลขึ้นหิ้งอันแรก)
  const itemsToDisplay = droppedSkill 
    ? [{ ...droppedSkill, isSpecialSkill: true }, ...filteredItems] 
    : filteredItems;

  return (
    <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 animate-in fade-in duration-300">
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
          <div className="space-y-2 max-h-[250px] overflow-y-auto pr-1">
            {itemsToDisplay.map((item, index) => {
              // 🛡️ ตรวจสอบสถานะสกิลเพื่อใช้สไตล์ (Logic เดิมของเธอ)
              const isSkill = !!(item.isSpecialSkill || item.type === 'SKILL' || (item.skillId && item.skillId !== 'none'));
              
              const borderStyle = isSkill ? rarityBorderStyles.Skill : (rarityBorderStyles[item.rarity] || rarityBorderStyles.Common);
              const textStyle = isSkill ? rarityTextStyles.Skill : (rarityTextStyles[item.rarity] || rarityTextStyles.Common);

              return (
                <div 
                  key={item.id || index} 
                  className={`flex items-center gap-3 p-2 rounded-2xl border transition-all ${borderStyle} ${isSkill ? 'ring-1 ring-orange-500/30' : ''}`}
                >
                  {/* 🖼️ Icon Box - Compact Size */}
                  <div className={`w-10 h-10 flex-shrink-0 rounded-xl flex items-center justify-center border overflow-hidden ${isSkill ? 'bg-orange-500/20 border-orange-500/50' : 'bg-slate-800 border-white/10'}`}>
                    {isSkill ? (
                      <Scroll size={22} className="text-amber-400 drop-shadow-[0_0_50px_rgba(251,191,36,0.6)] animate-pulse" />
                    ) : (
                      <span className="text-xl">{item.image || "📦"}</span>
                    )}
                  </div>

                  {/* 📝 Text Info - Compact Spacing */}
                  <div className="flex-1 min-w-0 text-left py-0.5">
                    <h4 className={`font-black text-[10px] uppercase italic truncate leading-tight ${isSkill ? 'text-amber-300' : 'text-white'}`}>
                      {item.name}
                    </h4>
                    
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <p className={`text-[7px] font-bold uppercase tracking-wider ${textStyle}`}>
                        {isSkill ? '✨ NEW PASSIVE' : (item.rarity || 'Common')}
                      </p>
                      {isSkill && (
                        <div className="h-1 w-1 bg-amber-500 rounded-full animate-ping" />
                      )}
                    </div>
                  </div>

                  {/* ⭐ Star Icon for Skill */}
                  {isSkill && <Star size={12} className="text-amber-500 fill-amber-500 animate-spin-slow" />}
                </div>
              );
            })}
          </div>

          {/* Stats & Button */}
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

          <button onClick={onFinalize} className="w-full py-4 bg-gradient-to-r from-amber-600 to-amber-500 text-white font-black rounded-2xl uppercase italic text-lg shadow-lg active:scale-95 transition-transform">
            Claim Rewards
          </button>
        </div>
      </div>
    </div>
  );
}