import React from 'react';

export default function GameLayout({ children, sidebar, worldChat, overlays }) {
  return (
    <div className="flex flex-col md:flex-row h-[100dvh] w-full bg-slate-950 text-slate-200 overflow-hidden font-sans text-left relative">
      
      {/* 🌑 Background Effects */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_-20%,#1e293b,transparent)] pointer-events-none" />
      <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/dark-matter.png')] pointer-events-none" />

      {/* 🎭 Overlays */}
      <div className="relative z-[100]">
        {overlays}
      </div>
      
      {/* 🏰 1. Sidebar ด้านซ้าย - ใส่ flex-shrink-0 เพื่อป้องกันการถูกเบียด */}
      {sidebar && (
        <aside className="relative z-50 flex-shrink-0 shadow-[10px_0_30px_rgba(0,0,0,0.5)]">
          {sidebar}
        </aside>
      )}

      {/* ⚔️ 2. Main Content ตรงกลาง - ปรับให้ขยายเต็มพื้นที่ (Full Width) */}
      <main className="flex-1 relative overflow-hidden flex flex-col border-x border-white/5 bg-gradient-to-b from-slate-900/50 to-transparent">
        {/* ✅ หัวใจสำคัญ: ลบ p-4, md:p-6 และ max-w-5xl ออกทั้งหมดเพื่อให้ Content ชนขอบ */}
        <div className="flex-1 overflow-y-auto scrollbar-hide">
          {/* ✅ ลบ max-w-5xl และ mx-auto เพื่อให้กว้างเต็มพื้นที่ */}
          <div className="w-full h-full min-h-full"> 
            {children}
          </div>
        </div>
      </main>

      {/* 💬 3. WorldChat ด้านขวา - ใส่ flex-shrink-0 เพื่อให้ขนาดคงที่ */}
      {worldChat && (
        <div className="hidden md:block w-80 lg:w-96 flex-shrink-0 border-l border-white/10 bg-slate-950/40 backdrop-blur-xl relative">
          <div className="absolute left-0 top-0 bottom-0 w-[1px] bg-gradient-to-b from-transparent via-white/10 to-transparent" />
          {worldChat}
        </div>
      )}

      {/* 📱 Mobile Chat Overlay */}
      <div className="md:hidden">
        {worldChat}
      </div>
    </div>
  );
}