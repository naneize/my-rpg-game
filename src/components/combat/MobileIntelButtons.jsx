import React from 'react';
import { Trophy, ScrollText, ShieldAlert, Activity, Database } from 'lucide-react';

/**
 * 🛰️ MobileIntelButtons: Tactical Hard-Edge Version
 */
export const MobileIntelButtons = ({ enemy, onTabClick }) => {
  return (
    <div className="lg:hidden absolute left-3 top-24 flex flex-col gap-3 z-[60] font-mono">
      {/* 🏷️ Label เล็กๆ บอกสถานะแผงปุ่ม */}
      <div className="flex items-center gap-1 opacity-40 mb-1 ml-1">
         <Activity size={8} className="text-white" />
         <span className="text-[6px] font-black text-white uppercase tracking-[0.2em]">Intel_Link</span>
      </div>

      {/* 🏆 ปุ่ม Ranking - เฉพาะ World Boss */}
      {enemy?.type === 'WORLD_BOSS' && (
        <button 
          onClick={() => onTabClick('RANKING')} 
          className="w-10 h-10 rounded-none bg-slate-900 border-2 border-amber-600 shadow-[4px_4px_0_rgba(217,119,6,0.3)] flex flex-col items-center justify-center text-amber-500 active:scale-95 active:shadow-none transition-all group relative"
        >
          <div className="absolute top-0 left-0 w-1.5 h-1.5 bg-amber-500" />
          <Trophy size={20} className="group-hover:scale-110 transition-transform" />
          <span className="text-[5px] font-black mt-0.5 tracking-tighter">RANK</span>
        </button>
      )}

      {/* 📜 ปุ่ม Logs */}
      <button 
        onClick={() => onTabClick('LOGS')} 
        className="w-10 h-10 rounded-none bg-slate-900 border-2 border-blue-600 shadow-[4px_4px_0_rgba(37,99,235,0.3)] flex flex-col items-center justify-center text-blue-400 active:scale-95 active:shadow-none transition-all group relative"
      >
        <div className="absolute top-0 left-0 w-1.5 h-1.5 bg-blue-500" />
        <ScrollText size={20} className="group-hover:scale-110 transition-transform" />
        <span className="text-[5px] font-black mt-0.5 tracking-tighter">LOGS</span>
      </button>

      {/* 🛡️ ปุ่ม Loot Table */}
      <button 
        onClick={() => onTabClick('LOOT')} 
        className="w-10 h-10 rounded-none bg-slate-900 border-2 border-emerald-600 shadow-[4px_4px_0_rgba(5,150,105,0.3)] flex flex-col items-center justify-center text-emerald-400 active:scale-95 active:shadow-none transition-all group relative"
      >
        <div className="absolute top-0 left-0 w-1.5 h-1.5 bg-emerald-500" />
        <ShieldAlert size={20} className="group-hover:scale-110 transition-transform" />
        <span className="text-[5px] font-black mt-0.5 tracking-tighter">LOOT</span>
      </button>

      {/* 🧩 ตกแต่งปิดท้ายด้านล่างแผงปุ่ม */}
      <div className="mt-1 ml-1 flex flex-col gap-0.5 opacity-20">
         <div className="w-4 h-0.5 bg-white" />
         <div className="w-2 h-0.5 bg-white" />
      </div>
    </div>
  );
};