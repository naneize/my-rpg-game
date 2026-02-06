import React from 'react';

export default function GameLayout({ children, sidebar, worldChat, overlays }) {
  return (
    <div className="flex flex-col md:flex-row h-[100dvh] bg-slate-950 text-slate-200 overflow-hidden font-sans text-left relative selection:bg-amber-500/30">
      
      {/* 🌑 Background Effects: เพิ่มมิติให้พื้นหลังไม่ดูเรียบเกินไป */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_-20%,#1e293b,transparent)] pointer-events-none" />
      <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/dark-matter.png')] pointer-events-none" />

      {/* 🎭 Overlays (เช่น ระบบประกาศ Broadcast ที่เราทำไว้) */}
      <div className="relative z-[100]">
        {overlays}
      </div>
      
      {/* 🏰 1. Sidebar ด้านซ้าย (เมนูหลัก) */}
      {sidebar && (
        <aside className="relative z-50 shadow-[10px_0_30px_rgba(0,0,0,0.5)]">
          {sidebar}
        </aside>
      )}

      {/* ⚔️ 2. Main Content ตรงกลาง (พื้นที่ผจญภัย) */}
      <main className="flex-1 relative overflow-hidden flex flex-col border-x border-white/5 bg-gradient-to-b from-slate-900/50 to-transparent">
        {/* ตกแต่งขอบจอให้ดูเหมือนกรอบภาพโบราณ */}
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-amber-500/20 to-transparent" />
        
        <div className="flex-1 overflow-y-auto p-4 md:p-6 scrollbar-hide">
          <div className="max-w-5xl mx-auto h-full">
            {children}
          </div>
        </div>
      </main>

      {/* 💬 3. WorldChat ด้านขวา */}
      {worldChat && (
        <div className="hidden md:block w-80 lg:w-96 border-l border-white/10 bg-slate-950/40 backdrop-blur-xl relative">
          {/* ขอบเรืองแสงเบาๆ ให้ดูเทคโนโลยีผสมเวทมนตร์ */}
          <div className="absolute left-0 top-0 bottom-0 w-[1px] bg-gradient-to-b from-transparent via-white/10 to-transparent" />
          {worldChat}
        </div>
      )}

      {/* 📱 Mobile Chat Overlay (กรณีเปิดบนมือถือ) */}
      <div className="md:hidden">
        {worldChat}
      </div>
    </div>
  );
}