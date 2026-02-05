import React, { useState, useEffect, useRef } from 'react'; 
import { db } from '../firebase';
import { ref, push, onValue, query, limitToLast } from "firebase/database";

// ✅ รับ onNewMessage มาจาก App.jsx
export default function WorldChat({ player, isMobile, onNewMessage }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isOpen, setIsOpen] = useState(!isMobile); 
  const chatEndRef = useRef(null);

  // ✅ [คงเดิม] State สำหรับเก็บเวลาที่กดล้างแชท
  const [clearTimestamp, setClearTimestamp] = useState(0);

  // ✅ [คงเดิม] State สำหรับจัดการตำแหน่งปุ่มแชทที่ลากได้
  const [position, setPosition] = useState({ x: window.innerWidth - 70, y: window.innerHeight - 150 });
  const [isDragging, setIsDragging] = useState(false);

  // 💾 แก้ไข: ดึงข้อความและส่งสัญญาณแจ้งเตือน
  useEffect(() => {
    const chatRef = query(ref(db, 'chats'), limitToLast(50));
    const unsubscribe = onValue(chatRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const list = Object.values(data);
        
        // ✨ [คงเดิม] ส่งสัญญาณแจ้งเตือนไปยัง App.jsx
        if (messages.length > 0 && list.length > messages.length) {
          if (typeof onNewMessage === 'function') {
            onNewMessage();
          }
        }
        
        setMessages(list);
      }
    });
    return () => unsubscribe();
  }, [messages.length, onNewMessage]);

  // 💾 คงเดิม: เลื่อนแชทลงล่างสุดอัตโนมัติ
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isOpen, clearTimestamp]);

  // ✅ [คงเดิม] ฟังก์ชันจัดการการลากสำหรับ Mobile
  const handleTouchMove = (e) => {
    if (!isMobile || isOpen) return;
    const touch = e.touches[0];
    const newX = Math.min(Math.max(10, touch.clientX - 28), window.innerWidth - 60);
    const newY = Math.min(Math.max(10, touch.clientY - 28), window.innerHeight - 60);
    setPosition({ x: newX, y: newY });
    setIsDragging(true);
  };

  const handleTouchEnd = () => {
    setTimeout(() => setIsDragging(false), 50);
  };

  // ✅ [คงเดิม] ฟังก์ชันล้างแชท
  const handleClearChat = () => {
    setClearTimestamp(Date.now());
  };

  // 💾 คงเดิม: ฟังก์ชันส่งข้อความ
  const sendMessage = (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    push(ref(db, 'chats'), {
      username: player.name || 'Anonymous',
      text: input,
      level: player.level || 1,
      timestamp: Date.now()
    });
    setInput('');
  };

  // 📱 ปรับปรุง: ปุ่มวงกลมแบบลากได้ + แจ้งเตือนสีแดง (คงเดิม)
  if (isMobile && !isOpen) {
    return (
      <div 
        style={{ left: position.x, top: position.y }}
        className="fixed z-[999] touch-none"
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <button 
          onClick={() => !isDragging && setIsOpen(true)}
          className="relative w-14 h-14 bg-amber-600 rounded-full flex items-center justify-center shadow-[0_0_20px_rgba(217,119,6,0.5)] border-2 border-amber-400 active:scale-90 transition-transform"
        >
          <span className="text-2xl pointer-events-none">💬</span>
          <div className="absolute -top-1 -right-1 bg-red-600 w-5 h-5 rounded-full border-2 border-slate-950 flex items-center justify-center animate-bounce">
             <span className="text-[10px] font-black text-white">!</span>
          </div>
        </button>
      </div>
    );
  }

  return (
    <div className={`flex flex-col bg-slate-900/90 backdrop-blur-md border border-slate-700 rounded-lg overflow-hidden shadow-2xl transition-all duration-300
      ${isMobile ? 'fixed inset-4 h-[380px] m-auto z-[1000] border-amber-500/50' : 'h-full w-full'}`}>
      
      {/* ส่วนหัวแชท (คงเดิม) */}
      <div className="bg-slate-800/80 p-2 flex justify-between items-center border-b border-slate-700">
        <span className="text-[10px] font-black uppercase text-amber-500 italic tracking-widest">
          World Chat {isMobile && '(Mobile View)'}
        </span>
        
        <div className="flex items-center gap-2">
          <button 
            onClick={handleClearChat}
            className="text-[9px] font-black uppercase bg-slate-700 hover:bg-red-900/40 text-slate-300 hover:text-red-400 px-2 py-1 rounded border border-slate-600 transition-colors italic"
          >
            Clear
          </button>
          
          {isMobile && (
            <button onClick={() => setIsOpen(false)} className="text-slate-400 hover:text-white px-2 font-bold text-lg">
              ×
            </button>
          )}
        </div>
      </div>

      {/* 💾 ส่วนแสดงข้อความ (แก้ไข: ซ่อนชื่อผู้พัฒนา โชว์แต่ยศ และเอาเลเวลคนอื่นออก) */}
      <div className="flex-1 overflow-y-auto p-3 space-y-3 text-[12px] md:text-sm custom-scrollbar">
        {messages
          .filter(msg => msg.timestamp > clearTimestamp) 
          .map((msg, i) => {
            // 💎 ตรวจสอบว่าเป็นผู้พัฒนาหรือไม่ (ใส่ชื่อของคุณตรงเงื่อนไขนี้)
            const isDeveloper = msg.username === 'DEV001' || msg.username === 'GeminiAdmin';

            return (
              <div key={i} className={`flex flex-col ${isDeveloper ? 'items-start my-1' : ''} animate-in fade-in slide-in-from-left-2`}>
                {isDeveloper ? (
                  /* 🚀 กรอบข้อความพิเศษสำหรับผู้พัฒนา (ซ่อนชื่อ โชว์แค่ยศ) */
                  <div className="relative group max-w-[95%]">
                    <div className="absolute -inset-0.5 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-2xl blur opacity-25 group-hover:opacity-40 transition duration-1000"></div>
                    
                    <div className="relative bg-slate-950/80 border border-cyan-500/40 rounded-2xl rounded-tl-none p-2.5 shadow-xl">
                      <div className="flex items-center gap-2 mb-0.5">
                        {/* ✅ ซ่อนชื่อ msg.username และโชว์แค่ป้าย DEVELOPER */}
                        <span className="text-[8px] bg-cyan-500 text-slate-950 px-2 py-0.5 rounded-full font-black tracking-widest uppercase">
                          DEVELOPER
                        </span>
                        <div className="w-1.5 h-1.5 bg-cyan-500 rounded-full animate-pulse" />
                      </div>
                      <p className="text-cyan-50 leading-relaxed font-medium drop-shadow-sm">
                        {msg.text}
                      </p>
                    </div>
                  </div>
                ) : (
                  /* 🟠 ข้อความผู้เล่นปกติ (เอาเลเวลออก แต่ยังโชว์ชื่อปกติ) */
                  <div className="break-words leading-relaxed">
                    <span className="text-amber-500 font-black">{msg.username}: </span>
                    <span className="text-slate-200">{msg.text}</span>
                  </div>
                )}
              </div>
            );
          })}
        <div ref={chatEndRef} />
      </div>

      {/* 💾 คงเดิม: ช่องพิมพ์ */}
      <form onSubmit={sendMessage} className="p-2 border-t border-slate-700 flex gap-2 bg-slate-900/80">
        <input 
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="พิมพ์ข้อความ..."
          className="flex-1 bg-slate-800 border border-slate-600 rounded px-2 py-1.5 text-xs outline-none focus:border-amber-500 text-white"
        />
        <button className="bg-amber-600 hover:bg-amber-500 text-black font-bold px-4 py-1.5 rounded text-xs transition-colors">
          ส่ง
        </button>
      </form>
    </div>
  );
}