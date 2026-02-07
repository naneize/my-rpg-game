import React from 'react';

export default function GameLayout({ children, sidebar, worldChat, overlays }) {
  return (
    <div className="flex flex-col md:flex-row h-[100dvh] w-full bg-slate-950 text-slate-200 overflow-hidden font-sans text-left relative">
      
      {/* 🌑 Background Effects */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_-20%,#1e293b,transparent)] pointer-events-none" />
      <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/dark-matter.png')] pointer-events-none" />

      {/* 🎭 Overlays (จุดที่แก้ไข) */}
      {/* เปลี่ยนจาก relative เป็น fixed inset-0 เพื่อให้คลุมทั้งหน้าจอแบบลอยตัว */}
      {/* ใช้ pointer-events-none เพื่อให้การคลิก "ทะลุ" ไปยังหน้าจอเกมด้านหลังได้ */}
      <div className="fixed inset-0 z-[9999] pointer-events-none">
        {/* pointer-events-auto จะถูกระบุไว้ที่ตัวลูก (Modal/Button) เพื่อดักจับแรงกดเฉพาะจุด */}
        {overlays}
      </div>
      
      {/* 🏰 1. Sidebar ด้านซ้าย */}
      {sidebar && (
        <aside className="relative z-50 flex-shrink-0 shadow-[10px_0_30px_rgba(0,0,0,0.5)]">
          {sidebar}
        </aside>
      )}

      {/* ⚔️ 2. Main Content ตรงกลาง - ปรับให้ชนขอบแชทเป๊ะๆ */}
      <main className="flex-1 relative overflow-hidden flex flex-col border-l border-white/5 bg-gradient-to-b from-slate-900/50 to-transparent">
        {/* ✅ ลบ border-x ออก เหลือแค่ border-l เพื่อคั่นจาก Sidebar */}
        <div className="flex-1 overflow-y-auto no-scrollbar"> 
          <div className="w-full h-full min-h-full flex flex-col"> 
            {children}
          </div>
        </div>
      </main>

      {/* 💬 3. WorldChat ด้านขวา - ลบความกว้างที่ซ้อนทับออกเพื่อให้ App.js คุมแทน */}
      {worldChat && (
        <aside className="hidden md:flex flex-shrink-0 relative z-[10000]">
          {/* ✅ ให้เนื้อหา worldChat ยืดเต็มพื้นที่ aside โดยไม่ใส่ border เพิ่มที่นี่ */}
          {worldChat}
        </aside>
      )}
      {/* 📱 Mobile Chat Overlay (จุดตาย) */}
      {/* ถ้า App.js ส่ง worldChat มา และเป็นช่วงที่ showMobileChat เป็น true 
    มันควรจะลอยอยู่นอกโครงสร้าง Flexbox ปกติ */}
      <div className="md:hidden">
              {worldChat}
      </div>
      {/* 📱 Mobile Chat ส่วนนี้ App.js จัดการแสดงผลผ่าน showMobileChat อยู่แล้ว */}
    </div>
  );
}