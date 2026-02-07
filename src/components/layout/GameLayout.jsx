import React from 'react';
import { Save, Zap } from 'lucide-react';

export default function GameLayout({ children, sidebar, worldChat, overlays, saveGame }) {
  return (
    <div className="flex flex-col md:flex-row h-[100dvh] w-full bg-slate-950 text-slate-200 overflow-hidden font-sans text-left relative">
      
      {/* 🌑 Background Effects */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_-20%,#1e293b,transparent)] pointer-events-none" />
      <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/dark-matter.png')] pointer-events-none" />

      {/* 🎭 Overlays (จุดที่แก้ไข) */}
      <div className="fixed inset-0 z-[999999] pointer-events-none">
        {overlays}
      </div>
      
      {/* 🏰 1. Sidebar (Desktop: ด้านซ้าย / Mobile: ด้านล่าง) */}
      {sidebar && (
        <aside className="relative z-[5000] flex-shrink-0 shadow-[10px_0_30px_rgba(0,0,0,0.5)]">
          {sidebar}
        </aside>
      )}

      {/* ⚔️ 2. Main Content ตรงกลาง */}
      <main className="flex-1 relative overflow-hidden flex flex-col border-l border-white/5 bg-gradient-to-b from-slate-900/50 to-transparent">
        
        {/* 🛰️ TOP HEADER (ย้ายปุ่ม Save มาไว้ที่นี่เพื่อประหยัดพื้นที่ด้านล่าง) */}
        <header className="shrink-0 h-14 border-b border-white/5 bg-slate-950/40 backdrop-blur-md flex items-center justify-between px-4 relative z-40">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-amber-500 animate-pulse shadow-[0_0_8px_#f59e0b]" />
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 italic">Sector-01</span>
          </div>

          {/* ✅ ปุ่ม Save ย้ายมาลอยตรงนี้แทน */}
          <button 
            onClick={saveGame}
            className="flex items-center gap-2 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-500 px-3 py-1.5 rounded-xl border border-emerald-500/20 transition-all active:scale-90 group"
          >
            <Save size={14} className="group-hover:rotate-12 transition-transform" />
            <span className="text-[10px] font-black uppercase tracking-widest">Secure Data</span>
          </button>
        </header>

        {/* 🎮 Game Viewport */}
        <div className="flex-1 overflow-y-auto no-scrollbar relative"> 
          <div className="w-full h-full min-h-full flex flex-col"> 
            {children}
          </div>
        </div>
      </main>

      {/* 💬 3. WorldChat ด้านขวา */}
      {worldChat && (
        <aside className="hidden md:flex flex-shrink-0 relative z-[10000]">
          {worldChat}
        </aside>
      )}

      {/* 📱 Mobile Chat Overlay */}
      <div className="md:hidden">
        {worldChat}
      </div>

      {/* ⚡ UI DECORATION: SCANLINE EFFECT */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.03] bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_2px,3px_100%]" />
    </div>
  );
}