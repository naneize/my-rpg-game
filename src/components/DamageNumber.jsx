import React, { useMemo } from 'react';

export default function DamageNumber({ value, type }) {
  // ✅ ล็อกตำแหน่งสุ่มไว้ตั้งแต่เกิด เพื่อป้องกันเลข "วาร์ป"
  const position = useMemo(() => ({
    x: Math.floor(Math.random() * 40) - 20,
    y: Math.floor(Math.random() * 10) - 5 
  }), []); 

  // 🎨 กำหนดสีตามประเภทดาเมจ
  const getStyle = () => {
    switch (type) {
      case 'reflect':
        // ดาเมจสะท้อนเป็นสีชมพูม่วงเรืองแสง
        return 'text-fuchsia-400 drop-shadow-[0_0_12px_rgba(232,121,249,0.9)]';
      case 'player':
      case 'monster':
      default:
        // ทั้งผู้เล่นและมอนสเตอร์ใช้สีขาวมาตรฐาน
        return 'text-white drop-shadow-[0_0_8px_rgba(0,0,0,0.5)]';
    }
  };

  return (
    <div 
      className={`absolute left-1/2 font-black animate-damage-static select-none z-[100] text-stroke-black flex items-baseline gap-2
        ${getStyle()}
      `}
      style={{ 
        // ตำแหน่งเด้ง: บนสำหรับศัตรู (รวมสะท้อน), ล่างสำหรับผู้เล่น
        top: (type === 'monster' || type === 'reflect') ? '38%' : '75%',
        
        marginLeft: `${position.x}px`,
        marginTop: `${position.y}px`,
        transform: 'translateX(-50%)',
        
        // ขนาดตัวอักษร: ผู้เล่นโดนจะตัวใหญ่กว่านิดหน่อย
        fontSize: type === 'player' ? '2.5rem' : (type === 'reflect' ? '1.8rem' : '2.25rem'),
      }}
    >
      {/* ตัวเลขดาเมจ */}
      <span>-{value}</span>

      {/* ✅ ข้อความ Reflect อยู่ด้านขวาของตัวเลข */}
      {type === 'reflect' && (
        <span className="text-[12px] uppercase tracking-wider opacity-90 animate-pulse italic font-bold">
          Reflect
        </span>
      )}
    </div>
  );
}