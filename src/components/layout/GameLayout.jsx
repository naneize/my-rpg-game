import React from 'react';
import { Save, Menu } from 'lucide-react';

/**
 * GameLayout - โครงสร้างหลักของเกม
 * @param {boolean} hasNotification - เช็คว่ามีจุดแจ้งเตือน (จดหมายใหม่/สเตตัสค้าง) หรือไม่
 * @param {boolean} showUI - เช็คว่าอยู่ในสถานะที่ควรโชว์ UI หลัก (Hamburger/Save) หรือไม่
 */
export default function GameLayout({ 
  children, 
  sidebar, 
  worldChat, 
  overlays, 
  saveGame, 
  onOpenSidebar,
  hasNotification,
  showUI = true // ✅ เพิ่ม Prop เพื่อเช็คว่าจะโชว์ UI หลักไหม (ส่งมาจาก App.jsx)
}) {
  return (
    <div className="flex flex-col md:flex-row h-[100dvh] w-full bg-slate-950 text-slate-200 overflow-hidden font-sans text-left relative">
      
      {/* 🌑 Background Effects */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_-20%,#1e293b,transparent)] pointer-events-none" />
      <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/dark-matter.png')] pointer-events-none" />

      {/* 🎭 5. Master Overlay Layer (Popups/Toasts) */}
      <div className="fixed inset-0 z-[1000000] pointer-events-none flex items-center justify-center">
        <div className="contents pointer-events-none">
          {overlays}
        </div>
      </div>
      
      {/* 🏰 1. Sidebar (Desktop: ด้านซ้าย / Mobile: สไลด์ออกมา) */}
      <aside className="hidden md:flex relative z-[5000] flex-shrink-0 shadow-[10px_0_30px_rgba(0,0,0,0.5)]">
        {sidebar}
      </aside>

      {/* ⚔️ 2. Main Content ตรงกลาง */}
      <main className="flex-1 relative overflow-hidden flex flex-col border-l border-white/5 bg-gradient-to-b from-slate-900/50 to-transparent">
        
        {/* 🛰️ TOP HEADER */}
        {/* ✅ ซ่อน Header ทั้งหมดถ้าอยู่ในหน้า Start Screen เพื่อความคลีน */}
        {showUI && (
          <header className="shrink-0 h-14 border-b border-white/5 bg-slate-950/40 backdrop-blur-md flex items-center justify-between px-4 relative z-50 animate-in fade-in slide-in-from-top duration-500">
            <div className="flex items-center gap-3">
              {/* ✅ ปุ่ม Hamburger สำหรับมือถือ พร้อมจุดแจ้งเตือนสีแดง */}
              <button 
                onClick={onOpenSidebar}
                className="md:hidden p-2 -ml-2 text-slate-400 hover:text-white transition-colors active:scale-90 relative"
              >
                <Menu size={20} />
                
                {/* 🔴 Notification Dot */}
                {hasNotification && (
                  <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-red-600 rounded-full border-2 border-slate-950 animate-pulse shadow-[0_0_8px_rgba(220,38,38,0.5)]" />
                )}
              </button>
              
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-amber-500 animate-pulse shadow-[0_0_8px_#f59e0b]" />
                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 italic">Sector-01</span>
              </div>
            </div>

            {/* ✅ ปุ่ม Save */}
            <button 
              onClick={saveGame}
              className="flex items-center gap-2 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-500 px-3 py-1.5 rounded-xl border border-emerald-500/20 transition-all active:scale-90 group"
            >
              <Save size={14} className="group-hover:rotate-12 transition-transform" />
              <span className="text-[10px] font-black uppercase tracking-widest">Secure Data</span>
            </button>
          </header>
        )}

        {/* 🎮 Game Viewport */}
        <div className="flex-1 overflow-y-auto no-scrollbar relative"> 
          <div className="w-full h-full min-h-full flex flex-col"> 
            {children}
          </div>
        </div>
      </main>

      {/* 💬 3. WorldChat (Desktop: ด้านขวา) */}
      {worldChat && (
        <aside className="hidden md:flex flex-shrink-0 relative z-[10000]">
          {worldChat}
        </aside>
      )}

      {/* 📱 4. Mobile Layout Elements (วางไว้ท้ายสุดเพื่อให้ลอยทับ) */}
      
      {/* Mobile Sidebar Drawer */}
      <div className="md:hidden">
        {sidebar}
      </div>

      {/* Mobile WorldChat Overlay */}
      <div className="md:hidden">
        {worldChat}
      </div>

      {/* ⚡ UI DECORATION: SCANLINE EFFECT */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.03] bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_2px,3px_100%]" />
    </div>
  );
}