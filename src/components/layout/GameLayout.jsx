import React from 'react';

export default function GameLayout({ children, sidebar, worldChat, overlays }) {
  return (
    <div className="flex flex-col md:flex-row h-[100dvh] bg-transparent text-slate-200 overflow-hidden font-serif text-left relative">
      {overlays}
      
      {/* 1. Sidebar ด้านซ้าย (สำหรับ Desktop/Mobile ตามที่คุณเขียนไว้) */}
      {sidebar && sidebar}

      {/* 2. Main Content ตรงกลาง */}
      <main className="flex-1 relative overflow-hidden flex flex-col">
        <div className="flex-1 overflow-y-auto p-2">
          {children}
        </div>
      </main>

      {/* ✅ แก้ไขจุดนี้: แสดง WorldChat ทั้งใน Desktop และ Mobile */}
      {worldChat && (
        <div className="md:w-80 border-l border-white/5 bg-slate-900/20">
          {worldChat}
        </div>
      )}
    </div>
  );
}