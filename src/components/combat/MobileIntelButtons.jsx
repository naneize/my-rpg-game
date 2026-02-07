// ✅ สร้างไฟล์ใหม่ที่: src/components/combat/MobileIntelButtons.jsx
import React from 'react';
import { Trophy, ScrollText, ShieldAlert } from 'lucide-react';

/**
 * Component ปุ่มลัดแสดงข้อมูลบนมือถือ
 * @param {object} enemy - ข้อมูลมอนสเตอร์ (เพื่อเช็คว่าเป็นบอสไหม)
 * @param {function} onTabClick - ฟังก์ชันสำหรับเปลี่ยนแท็บ ('RANKING', 'LOGS', 'LOOT')
 */
export const MobileIntelButtons = ({ enemy, onTabClick }) => {
  return (
    <div className="lg:hidden absolute left-4 top-24 flex flex-col gap-4 z-[60]">
      {/* ปุ่ม Ranking - โชว์เฉพาะตอนตี World Boss */}
      {enemy?.type === 'WORLD_BOSS' && (
        <button 
          onClick={() => onTabClick('RANKING')} 
          className="w-11 h-11 rounded-full bg-amber-600 border-2 border-amber-400 shadow-lg flex items-center justify-center text-white active:scale-90 transition-transform"
        >
          <Trophy size={22}/>
        </button>
      )}

      {/* ปุ่ม Logs */}
      <button 
        onClick={() => onTabClick('LOGS')} 
        className="w-11 h-11 rounded-full bg-blue-600 border-2 border-blue-400 shadow-lg flex items-center justify-center text-white active:scale-90 transition-transform"
      >
        <ScrollText size={22}/>
      </button>

      {/* ปุ่ม Loot Table */}
      <button 
        onClick={() => onTabClick('LOOT')} 
        className="w-11 h-11 rounded-full bg-slate-700 border-2 border-slate-500 shadow-lg flex items-center justify-center text-white active:scale-90 transition-transform"
      >
        <ShieldAlert size={22}/>
      </button>
    </div>
  );
};