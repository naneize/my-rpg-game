import React from 'react';
import { Trophy, Package } from 'lucide-react';

/**
 * ProfileHeader: ส่วนแสดงผลข้อมูลหลักของผู้เล่น (Card ด้านบน)
 * แสดงคะแนนสะสม, จำนวนมอนสเตอร์ และหลอดเลือด/EXP
 */
const ProfileHeader = ({ stats, collectionScore, finalMaxHp, hpPercent, expPercent }) => {
  return (
    <div className="flex-shrink-0 bg-slate-900/80 border border-slate-800 p-4 rounded-2xl text-center shadow-2xl relative overflow-hidden backdrop-blur-sm">
      {/* ส่วนข้อมูลสถิติ (Top Bar) */}
      <div className="flex justify-between items-start mb-3 border-b border-white/5 pb-2">
        <div className="flex flex-col items-start">
          <span className="text-[6px] text-slate-500 uppercase font-black tracking-tighter">Collection Score</span>
          <div className="flex items-center gap-1 text-amber-500">
            <Trophy size={10} />
            <span className="text-xs font-black italic">{collectionScore}</span>
          </div>
        </div>
        <div className="flex flex-col items-end">
          <span className="text-[6px] text-slate-500 uppercase font-black tracking-tighter">Monsters Found</span>
          <div className="flex items-center gap-1 text-blue-400">
            <span className="text-xs font-black italic">{stats.inventory?.length || 0}</span>
            <Package size={10} />
          </div>
        </div>
      </div>
      
      {/* ชื่อและเลเวล */}
      <h2 className="text-xl font-black text-white uppercase tracking-[0.1em] mb-0.5 italic drop-shadow-md leading-none">
        YOUR PROFILE
      </h2>
      <p className="text-slate-500 font-mono text-[9px] mb-3 tracking-widest uppercase">
        LV.{stats.level} HERO STATUS
      </p>
      
      {/* ❤️ HP BAR (Vitality) */}
      <div className="px-1 mb-3">
        <div className="flex justify-between text-[8px] font-black uppercase text-red-500 mb-1 leading-none">
          <span>Vitality</span>
          <span className="text-white">{Math.floor(stats.hp)} / {finalMaxHp}</span>
        </div>
        <div className="w-full h-2.5 bg-black/60 rounded-sm overflow-hidden border border-white/10 p-[1px]">
          <div 
            className="h-full bg-gradient-to-r from-red-700 to-red-500 transition-all duration-700" 
            style={{ width: `${hpPercent}%` }} 
          />
        </div>
      </div>

      {/* ✨ EXP Bar (Experience) - [อัปเดต: เพิ่มชื่อแถบและเปลี่ยนสีให้เป็นโทนม่วง] */}
      <div className="px-1">
        {/* ✅ เพิ่มส่วนหัวของหลอด EXP ให้เหมือนกับ Vitality */}
        <div className="flex justify-between text-[8px] font-black uppercase text-indigo-400 mb-1 leading-none">
          <span>Experience</span>
          <span className="text-slate-400">{expPercent}%</span>
        </div>
        
        {/* ✅ ปรับความสูงจาก h-1.5 เป็น h-2 เพื่อให้เห็นสี Gradient ชัดขึ้นและเปลี่ยนโทนสี */}
        <div className="w-full h-1 bg-slate-950 rounded-sm overflow-hidden border border-slate-800 p-[1px]">
          <div 
            className="h-full bg-gradient-to-r from-indigo-700 via-purple-600 to-violet-500 transition-all duration-1000 shadow-[0_0_10px_rgba(99,102,241,0.3)]" 
            style={{ width: `${expPercent}%` }} 
          />
        </div>
      </div>
    </div>
  );
};

export default ProfileHeader;