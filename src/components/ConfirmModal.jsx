import React from 'react';

export default function ConfirmModal({ isOpen, onClose, onConfirm, title, message }) {
  if (!isOpen) return null;

  return (
    /* ✅ แก้ไข: เพิ่ม pointer-events-auto เพื่อให้ Modal รับแรงกดได้แม้ตัวแม่ (GameLayout Overlay) จะสั่งให้ทะลุ */
    <div className="fixed inset-0 z-[2000] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 pointer-events-auto">
      <div className="w-full max-w-sm bg-slate-900 border-2 border-amber-600/50 rounded-2xl p-6 shadow-[0_0_50px_rgba(0,0,0,1)] text-center animate-in zoom-in duration-200">
        <h3 className="text-amber-500 font-black uppercase italic tracking-widest mb-2 text-xl">
          {title}
        </h3>
        <p className="text-slate-300 text-sm mb-6 font-serif leading-relaxed">
          {message}
        </p>
        <div className="flex gap-3">
          <button 
            onClick={onClose}
            className="flex-1 py-3 bg-slate-800 hover:bg-slate-700 text-slate-400 font-bold rounded-xl transition-all uppercase text-xs tracking-widest"
          >
            CANCEL
          </button>
          <button 
            onClick={() => { onConfirm(); onClose(); }}
            className="flex-1 py-3 bg-gradient-to-r from-amber-600 to-amber-700 hover:brightness-110 active:scale-95 text-white font-black rounded-xl shadow-lg shadow-amber-900/40 transition-all uppercase text-xs tracking-widest"
          >
            ACCEPT
          </button>
        </div>
      </div>
    </div>
  );
}