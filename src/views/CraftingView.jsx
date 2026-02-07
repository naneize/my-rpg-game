import React, { useState } from 'react';
import { Hammer, Sword, Shield, Gem, Zap, Box, ChevronRight, Sparkles, X, Trophy, AlertCircle } from 'lucide-react';
import { craftItem, getFullItemInfo } from '../utils/inventoryUtils';

export default function CraftingView({ player, setPlayer, setLogs }) {
  // --- States ---
  const [isCrafting, setIsCrafting] = useState(false); // สถานะกำลังคราฟต์ (สำหรับโชว์ Animation)
  const [lastCrafted, setLastCrafted] = useState(null); // เก็บข้อมูลไอเทมล่าสุดที่คราฟต์ได้ (สำหรับโชว์ Result Popup)
  const [errorToast, setErrorToast] = useState(null); // เก็บข้อความ Error เมื่อวัตถุดิบไม่พอ

  // 📜 สูตรการคราฟต์ (Recipes Configuration)
  // กำหนดจำนวนวัตถุดิบที่ใช้ และโอกาสที่จะสุ่มได้ไอเทมระดับต่างๆ ในแต่ละ Tier
  const RECIPES = {
    BASIC: { Scrap: 10, Shard: 0,  Dust: 0,  chance: 'Common-Uncommon', label: 'Basic Forge' },
    ELITE: { Scrap: 40, Shard: 20, Dust: 0,  chance: 'Uncommon-Rare',    label: 'Elite Forge' }, 
    MASTER: { Scrap: 100, Shard: 50, Dust: 50, chance: 'Rare-Legendary',  label: 'Masterwork Forge' }
  };

  /**
   * ฟังก์ชันหลักสำหรับการคราฟต์ไอเทม
   * @param {string} tier - ระดับของการคราฟต์ (BASIC, ELITE, MASTER)
   * @param {string} slotType - ประเภทไอเทมที่จะคราฟต์ (WEAPON, ARMOR, ACCESSORY)
   */
  const handleCraft = (tier, slotType) => {
    const recipe = RECIPES[tier];
    const m = player.materials || {};

    // 🛡️ 1. ตรวจสอบว่าวัตถุดิบในตัวผู้เล่นพอหรือไม่
    if ((m.scrap || 0) < recipe.Scrap || 
        (m.shard || 0) < recipe.Shard || 
        (m.dust || 0) < recipe.Dust) {
      
      setErrorToast("❌ วัตถุดิบไม่เพียงพอสำหรับการตีเหล็ก!");
      setTimeout(() => setErrorToast(null), 1500); // หายไปหลังจาก 1.5 วินาที
      return;
    }

    // 2. เริ่มกระบวนการคราฟต์
    setIsCrafting(true);
    setLastCrafted(null);

    // 🔨 จำลองเวลาการตีเหล็ก 1.5 วินาที
    setTimeout(() => {
      const newItemInstance = craftItem(slotType); // สร้างไอเทมใหม่จาก Utils
      
      // 3. คำนวณ Bonus Level ตามระดับของ Forge
      let bonusLevel = 0;
      if (tier === 'BASIC') {
        bonusLevel = Math.floor(Math.random() * 2); // +0 ถึง +1
      } else if (tier === 'ELITE') {
        bonusLevel = Math.floor(Math.random() * 3); // +0 ถึง +2
      } else if (tier === 'MASTER') {
        bonusLevel = Math.floor(Math.random() * 4); // +0 ถึง +3
      }
      
      newItemInstance.level = bonusLevel;
      const fullInfo = getFullItemInfo(newItemInstance); // ดึง Stats ทั้งหมดของไอเทม
      
      // 4. อัปเดตข้อมูลผู้เล่น (หักวัตถุดิบ และ เพิ่มไอเทมเข้า Inventory)
      setPlayer(prev => ({
        ...prev,
        materials: {
          ...prev.materials,
          scrap: (prev.materials?.scrap || 0) - recipe.Scrap,
          shard: (prev.materials?.shard || 0) - recipe.Shard,
          dust: (prev.materials?.dust || 0) - recipe.Dust
        },
        inventory: [...(prev.inventory || []), newItemInstance]
      }));

      // 5. บันทึก Log และแสดงผลลัพธ์
      setLogs(prev => [`🔨 [${tier}] คราฟต์สำเร็จ! ได้รับ ${fullInfo.name}`, ...prev].slice(0, 10));
      setLastCrafted(fullInfo); 
      setIsCrafting(false);
    }, 1500);
  };

  return (
    <div className="flex flex-col h-full bg-slate-950 text-slate-200 p-3 sm:p-4 space-y-4 overflow-hidden relative">
      
      {/* 🚨 Error Toast: แจ้งเตือนเมื่อวัตถุดิบไม่พอ */}
      {errorToast && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-[500] w-[90%] max-w-xs animate-in fade-in slide-in-from-top-4 duration-300">
          <div className="bg-slate-900 border-2 border-red-500/50 p-4 rounded-2xl shadow-[0_0_30px_rgba(239,68,68,0.2)] flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-red-500 flex items-center justify-center text-slate-950 font-black">
              <AlertCircle size={18} />
            </div>
            <div>
              <p className="text-[10px] font-black uppercase text-red-500 tracking-widest italic">Inventory Error</p>
              <p className="text-xs font-bold text-white leading-tight">{errorToast}</p>
            </div>
          </div>
        </div>
      )}

      {/* ⚒️ Resource Header: แสดงจำนวนวัตถุดิบที่มีปัจจุบัน */}
      <div className="grid grid-cols-3 gap-2 bg-slate-900/50 p-2 sm:p-3 rounded-2xl sm:rounded-3xl border border-white/5 shadow-2xl">
        <div className="flex flex-col items-center p-1 sm:p-2 bg-black/40 rounded-xl border border-orange-500/20">
          <div className="flex items-center gap-1 mb-1 opacity-80">
            <img src="/icon/scrap.png" className="w-3 h-3 object-contain" alt="scrap" />
            <span className="text-[8px] font-black text-orange-500 uppercase italic tracking-tighter">Scrap</span>
          </div>
          <span className="text-[10px] sm:text-xs font-black text-orange-400 leading-none">
            {player.materials?.scrap || 0}
          </span>
        </div>
        <div className="flex flex-col items-center p-1 sm:p-2 bg-black/40 rounded-xl border border-emerald-500/20">
          <div className="flex items-center gap-1 mb-1 opacity-80">
            <img src="/icon/shard.png" className="w-3 h-3 object-contain" alt="shard" />
            <span className="text-[8px] font-black text-emerald-400 uppercase italic tracking-tighter">Shard</span>
          </div>
          <span className="text-[10px] sm:text-xs font-black text-emerald-400 leading-none">
            {player.materials?.shard || 0}
          </span>
        </div>
        <div className="flex flex-col items-center p-1 sm:p-2 bg-black/40 rounded-xl border border-purple-500/20">
          <div className="flex items-center gap-1 mb-1 opacity-80">
            <img src="/icon/dust.png" className="w-3 h-3 object-contain" alt="dust" />
            <span className="text-[8px] font-black text-purple-400 uppercase italic tracking-tighter">Dust</span>
          </div>
          <span className="text-[10px] sm:text-xs font-black text-purple-400 leading-none">
            {player.materials?.dust || 0}
          </span>
        </div>
      </div>

      {/* 📜 Crafting List: รายการเมนูการคราฟต์แยกตามประเภทไอเทม */}
      <div className="flex-1 overflow-y-auto space-y-6 no-scrollbar pb-20">
        {['WEAPON', 'ARMOR', 'ACCESSORY'].map(slot => (
          <div key={slot} className="space-y-3">
            <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] pl-2 flex items-center gap-2 italic">
              FORGE {slot}
            </h3>
            
            <div className="grid grid-cols-1 gap-2">
              {Object.entries(RECIPES).map(([tier, recipe]) => (
                <button
                  key={tier}
                  disabled={isCrafting}
                  onClick={() => handleCraft(tier, slot)}
                  className={`relative p-4 sm:p-5 rounded-2xl sm:rounded-[2rem] border-2 transition-all active:scale-95 flex items-center justify-between overflow-hidden group
                    ${tier === 'MASTER' ? 'border-amber-500 bg-amber-500/10' : 
                      tier === 'ELITE' ? 'border-blue-500/30 bg-blue-500/5' : 'border-slate-800 bg-slate-900/40'}`}
                >
                  {/* ข้อมูลระดับการ Forge */}
                  <div className="flex flex-col text-left z-10">
                    <span className={`text-xs sm:text-sm font-black uppercase italic ${tier === 'MASTER' ? 'text-amber-500' : 'text-white'}`}>{recipe.label}</span>
                    <span className="text-[8px] font-bold text-slate-400 mt-0.5">Chance: {recipe.chance}</span>
                  </div>

                  {/* ✅ ส่วนแสดงผลวัตถุดิบ (Material Requirements) พร้อมชื่อกำกับ */}
                  <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 text-[9px] font-black text-slate-400 z-10 items-end sm:items-center">
                      <span className="flex items-center gap-1.5 bg-black/20 px-2 py-1 rounded-lg">
                        <img src="/icon/scrap.png" className="w-3 h-3 object-contain" alt="" />
                        <span>SCRAP: {recipe.Scrap}</span>
                      </span>
                      
                      {recipe.Shard > 0 && (
                        <span className="text-emerald-400 flex items-center gap-1.5 bg-black/20 px-2 py-1 rounded-lg">
                          <img src="/icon/shard.png" className="w-3 h-3 object-contain" alt="" />
                          <span>SHARD: {recipe.Shard}</span>
                        </span>
                      )}
                      
                      {recipe.Dust > 0 && (
                        <span className="text-purple-400 font-bold flex items-center gap-1.5 bg-black/20 px-2 py-1 rounded-lg">
                          <img src="/icon/dust.png" className="w-3 h-3 object-contain" alt="" />
                          <span>DUST: {recipe.Dust}</span>
                        </span>
                      )}
                  </div>
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* 🔨 Animation Overlay: แสดงตอนกำลังตีเหล็ก */}
      {isCrafting && (
        <div className="fixed inset-0 z-[300] bg-slate-950/90 backdrop-blur-md flex flex-col items-center justify-center animate-in fade-in">
          <div className="relative animate-hammer-hit">
            <Hammer size={80} className="text-amber-500 drop-shadow-[0_0_15px_rgba(245,158,11,0.5)]" />
            <Sparkles className="absolute -top-4 -right-4 text-white animate-pulse" size={30} />
          </div>
          <p className="text-xl font-black italic uppercase text-white mt-6 animate-pulse tracking-widest">Forging Masterpiece...</p>
        </div>
      )}

      {/* 🎉 Result Popup: แสดงไอเทมที่คราฟต์สำเร็จ */}
      {lastCrafted && !isCrafting && (
        <div className="fixed inset-0 z-[400] flex items-center justify-center p-4 sm:p-6 animate-in zoom-in duration-300">
          <div className="absolute inset-0 bg-black/95 backdrop-blur-md" onClick={() => setLastCrafted(null)} />
          
          <div className={`relative w-full max-w-[320px] bg-slate-900 border-2 rounded-[2.5rem] sm:rounded-[3rem] overflow-hidden shadow-[0_0_50px_rgba(245,158,11,0.3)] 
            ${lastCrafted.level >= 2 ? 'border-amber-500 shadow-amber-500/30' : 'border-slate-700'}`}>
            
            <div className={`p-6 sm:p-8 text-center bg-gradient-to-b from-transparent to-transparent 
              ${lastCrafted.level >= 2 ? 'from-amber-500/20' : 'from-slate-500/10'}`}>
              <div className="text-6xl sm:text-7xl mb-4 animate-bounce drop-shadow-2xl flex justify-center">
                {/* ตรวจสอบว่าเป็นรูปภาพ Path หรือ Emoji */}
                {typeof lastCrafted.icon === 'string' && lastCrafted.icon.startsWith('/') ? (
                  <img src={lastCrafted.icon} className="w-20 h-20 object-contain" alt="crafted-item" />
                ) : (
                  lastCrafted.icon
                )}
              </div>
              <h3 className="text-xl sm:text-2xl font-black text-white uppercase italic leading-tight">{lastCrafted.name} +{lastCrafted.level}</h3>
              <p className="text-[10px] text-amber-500 font-bold uppercase tracking-[0.3em] mt-2">✨ Crafted Masterpiece ✨</p>
            </div>

            {/* แสดงค่าพลังของไอเทมใหม่ */}
            <div className="px-6 sm:px-8 pb-8 space-y-3">
              <div className="grid grid-cols-1 gap-2">
                {lastCrafted.totalAtk > 0 && (
                  <div className="flex justify-between items-center bg-orange-500/10 p-3 sm:p-4 rounded-xl sm:rounded-2xl border border-orange-500/20">
                    <span className="text-[10px] font-black text-orange-400 uppercase italic">Attack</span>
                    <span className="text-base sm:text-lg font-black text-white">+{lastCrafted.totalAtk}</span>
                  </div>
                )}
                {lastCrafted.totalDef > 0 && (
                  <div className="flex justify-between items-center bg-emerald-500/10 p-3 sm:p-4 rounded-xl sm:rounded-2xl border border-emerald-500/20">
                    <span className="text-[10px] font-black text-emerald-400 uppercase italic">Defense</span>
                    <span className="text-base sm:text-lg font-black text-white">+{lastCrafted.totalDef}</span>
                  </div>
                )}
                {lastCrafted.totalMaxHp > 0 && (
                  <div className="flex justify-between items-center bg-blue-500/10 p-3 sm:p-4 rounded-xl sm:rounded-2xl border border-blue-500/20">
                    <span className="text-[10px] font-black text-blue-400 uppercase italic">Health</span>
                    <span className="text-base sm:text-lg font-black text-white">+{lastCrafted.totalMaxHp}</span>
                  </div>
                )}
              </div>

              <button 
                onClick={() => setLastCrafted(null)}
                className="w-full mt-4 py-4 sm:py-5 bg-gradient-to-r from-amber-600 to-amber-400 text-slate-950 font-black rounded-xl sm:rounded-2xl uppercase text-[10px] sm:text-xs shadow-lg active:scale-95 transition-all"
              >
                Confirm & Add to Bag
              </button>
            </div>
          </div>
        </div>
      )}

      {/* สไตล์ Animation และ Scrollbar */}
      <style jsx>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        @keyframes hammer-hit {
          0%, 100% { transform: rotate(0deg) scale(1); }
          50% { transform: rotate(-45deg) scale(1.15); }
          60% { transform: rotate(10deg) scale(0.95); }
        }
        .animate-hammer-hit { animation: hammer-hit 0.35s infinite; }
      `}</style>
    </div>
  );
}