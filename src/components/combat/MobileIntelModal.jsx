import React from 'react';
import { X, Activity, Cpu, Database } from 'lucide-react'; // ✅ แก้ไข: เอา terminal ออก ใช้ตัวที่มีแทน
import { CombatSidebarIntel } from './CombatSidebarIntel';

/**
 * 🛰️ MobileIntelModal: ฉบับ Hard-Edge (แก้ไข Error Module)
 */
export const MobileIntelModal = ({ tab, onClose, worldEvent, logs, enemy, player }) => {
  if (!tab) return null;

  return (
    <div className="lg:hidden fixed inset-0 z-[2000000] flex items-center pointer-events-none justify-center p-6 bg-black/90 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-sm max-h-[70vh] flex flex-col pointer-events-auto animate-in zoom-in-95 font-mono">
        
        {/* 🔻 1. ปุ่มปิดแบบเหลี่ยม (Hard-Edge) */}
        <button 
          onClick={onClose} 
          className="absolute -top-14 right-0 w-12 h-12 bg-slate-900 border-2 border-red-500/50 flex items-center justify-center text-red-500 shadow-[0_0_15px_rgba(239,68,68,0.2)] active:scale-90 z-[11001] rounded-none hover:bg-red-500 hover:text-white transition-all"
        >
          <X size={28} strokeWidth={3} />
          <div className="absolute top-0 left-0 w-2 h-2 bg-red-500" />
        </button>

        {/* 🔻 2. กรอบเนื้อหาเหลี่ยมคม */}
        <div className="flex-1 overflow-hidden border-2 border-white/10 relative bg-[#020617] shadow-2xl">
          {/* ขอบมุมตกแต่ง (Decorative Corners) */}
          <div className="absolute top-0 right-0 w-6 h-6 border-t-2 border-r-2 border-blue-500/30 pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-6 h-6 border-b-2 border-l-2 border-blue-500/30 pointer-events-none" />
          
          {/* เพิ่มไอคอนประดับเล็กน้อยให้ดูเป็นหน้าจอวิจัย */}
          <div className="absolute top-2 left-2 opacity-10 pointer-events-none">
            <Database size={12} />
          </div>

          <CombatSidebarIntel 
            type={tab} 
            worldEvent={worldEvent} 
            logs={logs} 
            enemy={enemy} 
            player={player} 
          />
        </div>

        {/* 🔻 3. แถบสถานะระบบด้านล่าง */}
        <div className="mt-3 flex items-center justify-center gap-2">
           <Activity size={10} className="text-slate-600 animate-pulse" />
           <p className="text-[8px] font-black text-slate-600 uppercase tracking-[0.4em] italic">
             Data_Decryption_Protocol_v4.2
           </p>
        </div>
      </div>
    </div>
  );
};