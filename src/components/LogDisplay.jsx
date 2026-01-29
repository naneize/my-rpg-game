import React, { useEffect, useRef } from 'react';

/**
 * LogDisplay: ส่วนแสดงผลบันทึกเหตุการณ์ (Logs) 
 * @param {Array} logs - รายการข้อความ log ทั้งหมด
 */
export default function LogDisplay({ logs }) {
  const scrollRef = useRef(null);

  // Auto-scroll ไปล่างสุดเมื่อมี log ใหม่ (ถ้าต้องการ)
  // แต่ในเกมแนวนี้ การดู log ล่าสุดที่ด้านบน (แบบที่คุณทำ) ก็ดีอยู่แล้วครับ
  
  return (
    <div className="w-full max-w-xl bg-slate-900/60 border border-slate-800 rounded-2xl p-4 h-32 overflow-y-auto font-mono text-[10px] shadow-2xl mb-2 text-left custom-scrollbar">
      <div className="space-y-1">
        {logs.map((log, i) => {
          // 🎨 เพิ่ม Logic เล็กน้อยเพื่อใส่สีตามเนื้อหาของ Log
          const isHeal = log.includes('ฟื้นฟู');
          const isLevelUp = log.includes('เลเวลอัป');
          const isItem = log.includes('ได้รับ');

          return (
            <div 
              key={i} 
              className={`flex gap-2 border-b border-slate-800/30 pb-1 animate-in slide-in-from-left duration-300 ${
                isHeal ? 'text-emerald-400' : 
                isLevelUp ? 'text-amber-400 font-bold' : 
                isItem ? 'text-blue-400' : 'text-slate-400'
              }`}
            >
              <span className={`${isLevelUp ? 'text-amber-500' : 'text-red-500'} font-bold`}>»</span> 
              {log}
            </div>
          );
        })}
      </div>
    </div>
  );
}