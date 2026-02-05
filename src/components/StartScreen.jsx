import React, { useState } from 'react'; // อย่าลืม import useState นะครับ

export default function StartScreen({ onStart, onContinue }) {
  
  const [nameInput, setNameInput] = useState("");
  const [error, setError] = useState(""); // ✅ เพิ่ม State สำหรับเก็บข้อความแจ้งเตือน

  // ฟังก์ชันรองรับการกด Continue
  const handleContinueClick = () => {
    setError(""); // ล้างค่า error ก่อนเช็คใหม่
    const success = onContinue();
    if (success) {
      // ✅ หมายเหตุ: ในระบบใหม่เราไม่ต้องเรียก onStart() ซ้ำที่นี่ 
      // เพราะ loadGame ใน App.jsx จะอัปเดตสถานะและเปลี่ยนหน้าเองถ้าทำเสร็จ
    } else {
      setError("ไม่พบข้อมูลการเล่นเก่าในเครื่องนี้จ่ะ"); // ✅ แสดง error แทน alert
    }
  };

  // ✅ แก้ไข: ฟังก์ชันเริ่มเกมใหม่พร้อมส่งชื่อไปให้ App เปิด Modal
  const handleStartGame = () => {
    setError(""); // ล้างค่า error ก่อนเช็คใหม่

    // ตรวจสอบความถูกต้องเบื้องต้นก่อนส่งไปถามยืนยัน
    if (nameInput.trim().length < 4) {
      setError("กรุณาตั้งชื่ออย่างน้อย 4 ตัวอักษรครับ"); // ✅ แสดง error แทน alert
      return;
    }

    // ✅ ส่งชื่อกลับไปที่ App.jsx (ซึ่งตอนนี้รับฟังก์ชัน triggerNewGame มาในชื่อ onStart)
    // เพื่อให้ App เปิด ConfirmModal ธีมสีทองขึ้นมาถามผู้เล่น
    onStart(nameInput); 
  };

  return (
    <div className="min-h-[100dvh] w-full flex flex-col items-center justify-center bg-slate-950 relative overflow-hidden p-4 text-center">
      
      {/* Background Decor */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[280px] md:w-[500px] h-[280px] md:h-[500px] bg-amber-500/10 blur-[80px] md:blur-[120px] rounded-full" />

      {/* Main Content */}
      <div className="relative z-10 animate-in fade-in zoom-in duration-1000 -mt-20 md:-mt-32 w-full max-w-lg">
        
        {/* Logo */}
        <div className="flex justify-center mb-2 md:mb-4">
          <img 
            src="/game-logo.png" 
            alt="Logo"
            className="w-24 h-24 md:w-40 md:h-40 object-contain drop-shadow-[0_0_20px_rgba(245,158,11,0.6)] animate-pulse"
          />
        </div>
        
        {/* ชื่อเกม */}
        <h1 className="text-4xl md:text-8xl font-black italic uppercase tracking-tighter text-white mb-2">
          Infinite <span className="text-amber-500">Step</span>
        </h1>
        
        <div className="flex items-center justify-center gap-2 md:gap-4 mb-8 md:mb-10">
          <div className="h-[1px] w-8 md:w-12 bg-slate-700" />
          <p className="text-slate-400 font-mono text-[9px] md:text-xs uppercase tracking-[0.3em]">
            The Eternal Expedition
          </p>
          <div className="h-[1px] w-8 md:w-12 bg-slate-700" />
        </div>

        {/* --- ส่วนของ Input และปุ่มกด --- */}
        <div className="px-6 flex flex-col gap-3 items-center">
          
          {/* ช่องกรอกชื่อ */}
          <div className="w-full flex flex-col items-center gap-2 mb-2">
            <input 
              type="text"
              value={nameInput}
              onChange={(e) => {
                setNameInput(e.target.value);
                if(error) setError(""); // พิมพ์ใหม่ให้ข้อความ error หายไปทันที
              }}
              placeholder="ENTER YOUR NAME"
              className={`w-full max-w-[260px] bg-slate-900/80 border ${error ? 'border-red-500 shadow-[0_0_10px_rgba(239,68,68,0.2)]' : 'border-amber-500/30'} rounded-full px-6 py-2.5 text-amber-500 text-center outline-none focus:border-amber-500 font-black italic uppercase text-sm transition-all`}
            />

            {/* ✅ แสดงข้อความ Error แบบเนียนๆ แทน Popup */}
            {error && (
              <p className="text-red-500 text-[10px] font-black uppercase italic tracking-[0.15em] animate-in fade-in slide-in-from-top-1 duration-300">
                ⚠️ {error}
              </p>
            )}
          </div>

          {/* 1. ปุ่ม Continue */}
          <button 
            onClick={handleContinueClick}
            className="group relative w-full max-w-[260px] px-8 py-2.5 bg-transparent transition-all active:scale-95"
          >
            <div className="absolute inset-0 border border-amber-500/40 bg-slate-900/60 rounded-full shadow-lg group-hover:bg-slate-800 transition-colors" />
            <span className="relative text-sm md:text-base font-black italic uppercase tracking-widest text-amber-500">
              Continue Journey
            </span>
          </button>

          {/* 2. ปุ่ม Start เดิม */}
          <button 
            onClick={handleStartGame}
            className="group relative w-full max-w-[260px] px-8 py-2.5 bg-transparent transition-all active:scale-95"
          >
            <div className="absolute inset-0 bg-amber-600 rounded-full shadow-[0_5px_15px_rgba(217,119,6,0.3)] group-hover:bg-amber-500 transition-colors" />
            <span className="relative text-sm md:text-base font-black italic uppercase tracking-widest text-black">
              New Expedition
            </span>
          </button>

        </div>
      </div>

      {/* Footer Info */}
      <div className="absolute bottom-6 md:bottom-10 left-0 right-0 z-10 px-4 scale-90">
        <p className="text-slate-500 text-[9px] uppercase font-bold tracking-[0.2em]">
          Version 1.0.0 - Alpha Release
        </p>
        <p className="text-amber-500/50 text-[10px] font-black uppercase tracking-widest italic">
          Developed by nannaja
        </p>
        <p className="text-slate-400/80 text-[11px] font-medium italic mt-1 animate-pulse">
          Hope you enjoy
        </p>
      </div>
    </div>
  );
}