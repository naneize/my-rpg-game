import React from 'react';

export default function GameLayout({ children, sidebar, worldChat, overlays }) {
  return (
    <div className="flex flex-col md:flex-row h-[100dvh] bg-transparent text-slate-200 overflow-hidden font-serif text-left relative">
      {overlays}
      
      {/* ✅ แก้ไข: แสดง worldChat เฉพาะเมื่อมีข้อมูล (ป้องกันการค้างหน้าจอตามรูป 1000005326.png) */}
      {worldChat && <div className="md:hidden">{worldChat}</div>}
      
      {/* ✅ แก้ไข: แสดง sidebar เฉพาะเมื่อมีข้อมูล */}
      {sidebar && sidebar}

      <main className="flex-1 relative overflow-hidden flex flex-col">
        <div className="flex-1 overflow-y-auto p-2">
          {children}
        </div>
      </main>
    </div>
  );
}