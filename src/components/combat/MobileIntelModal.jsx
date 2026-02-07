// ✅ สร้างไฟล์ใหม่ที่: src/components/combat/MobileIntelModal.jsx
import React from 'react';
import { X } from 'lucide-react';
import { CombatSidebarIntel } from './CombatSidebarIntel';

/**
 * Component สำหรับหน้าต่างข้อมูลสถิติต่างๆ บนมือถือ
 * @param {string} tab - แท็บที่เลือกอยู่ ('RANKING', 'LOGS', 'LOOT')
 * @param {function} onClose - ฟังก์ชันสำหรับปิด Modal
 * @param {object} worldEvent - ข้อมูลบอส
 * @param {array} logs - รายการ Log
 * @param {object} enemy - ข้อมูลมอนสเตอร์
 * @param {object} player - ข้อมูลผู้เล่น
 */
export const MobileIntelModal = ({ tab, onClose, worldEvent, logs, enemy, player }) => {
  if (!tab) return null;

  return (
    <div className="lg:hidden fixed inset-0 z-[11000] flex items-center justify-center p-6 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-sm max-h-[70vh] flex flex-col animate-in zoom-in-95">
        
        {/* ปุ่มปิด Modal */}
        <button 
          onClick={onClose} 
          className="absolute -top-14 right-0 w-12 h-12 bg-red-600 rounded-full flex items-center justify-center text-white shadow-2xl border-2 border-white/20 active:scale-90 z-[11001]"
        >
          <X size={28}/>
        </button>

        {/* ส่วนแสดงเนื้อหา (ดึงมาจาก Component ที่เราแยกไว้ก่อนหน้านี้) */}
        <div className="flex-1 overflow-hidden">
          <CombatSidebarIntel 
            type={tab} 
            worldEvent={worldEvent} 
            logs={logs} 
            enemy={enemy} 
            player={player} 
          />
        </div>
      </div>
    </div>
  );
};