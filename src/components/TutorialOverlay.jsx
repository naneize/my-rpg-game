import React from 'react';

export default function TutorialOverlay({ step, onNext }) {
  const tutorials = {
    welcome: {
      title: "ยินดีต้อนรับนักผจญภัย",
      message: "ในโลกของ Infinite Step ทุกก้าวเดินของคุณคือความหมาย การออกเดินทางจะทำให้คุณพบทั้งสมบัติและศัตรู!",
      btn: "เริ่มเรียนรู้"
    },
    map: {
      title: "แผนที่",
      message: "คุณสามารถเลือกแผนที่สำหรับการเดินทางได้ตลอด เพื่อค้นหาไอเทมและมอนเตอร์ใหม่ๆมากมาย",
      btn: "รับทราบ"
    },
    passive: {
    title: "พลังแฝง",
    message: "เมื่อคุณกำจัดมอนสเตอร์สำเร็จ คุณมีโอกาสได้รับสกิลติดตัว นำมาสวมใส่เพื่อเพิ่มความสามารถพิเศษได้ที่นี่!",
    btn: "ขอดูหน่อย"
  },
  collection: {
    title: "สมุดสะสมไอเทม",
    message: "ไอเทมทุกชิ้นที่ดรอปจะถูกบันทึกไว้ ยิ่งสะสมได้มากเท่าไหร่ คุณจะได้รับโบนัสพลังโจมตีถาวรมากขึ้นเท่านั้น!",
    btn: "รับทราบ"
  },
  character: {
    title: "ข้อมูลต่างๆของผู้เล่น",
    message: "ข้อมูลของผู้เล่นจะแสดงอยู่ที่หน้านี้ ทั้งระบบฉายา การอัพสเตตัส และโบนัสต่างๆที่ได้รับ",
    btn: "รับทราบ"
  },

  };

  const current = tutorials[step];
  if (!current) return null;

  return (
    <div className="fixed inset-0 z-[3000] bg-black/70 backdrop-blur-md flex items-center justify-center p-6 text-center">
      <div className="w-full max-w-sm bg-slate-900 border-2 border-amber-600/50 rounded-3xl p-8 shadow-[0_0_50px_rgba(245,158,11,0.2)] animate-in zoom-in duration-300">
        <div className="w-16 h-16 bg-amber-500/20 rounded-full flex items-center justify-center mx-auto mb-4 border border-amber-500/30">
          <span className="text-amber-500 text-2xl">💡</span>
        </div>
        <h3 className="text-amber-500 font-black uppercase italic tracking-widest mb-3 text-xl">
          {current.title}
        </h3>
        <p className="text-slate-300 text-sm mb-8 font-serif leading-relaxed">
          {current.message}
        </p>
        <button 
          onClick={onNext}
          className="w-full py-4 bg-gradient-to-r from-amber-600 to-amber-700 hover:brightness-110 active:scale-95 text-white font-black rounded-2xl shadow-lg shadow-amber-900/40 transition-all uppercase italic tracking-widest text-sm"
        >
          {current.btn}
        </button>
      </div>
    </div>
  );
}