import React, { useState, useEffect, useRef } from 'react';
import { db } from '../firebase';
import { ref, push, onValue, query, limitToLast } from "firebase/database";

export default function WorldChat({ player, isMobile }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isOpen, setIsOpen] = useState(!isMobile); 
  const chatEndRef = useRef(null);

  // ✅ [เพิ่มใหม่] State สำหรับเก็บเวลาที่กดล้างแชท (เพื่อซ่อนข้อความเก่า)
  const [clearTimestamp, setClearTimestamp] = useState(0);

  // ✅ [คงเดิม] State สำหรับจัดการตำแหน่งปุ่มแชทที่ลากได้
  const [position, setPosition] = useState({ x: window.innerWidth - 70, y: window.innerHeight - 150 });
  const [isDragging, setIsDragging] = useState(false);

  // 💾 คงเดิม: ดึงข้อความ 50 ข้อความล่าสุด
  useEffect(() => {
    const chatRef = query(ref(db, 'chats'), limitToLast(50));
    const unsubscribe = onValue(chatRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const list = Object.values(data);
        setMessages(list);
      }
    });
    return () => unsubscribe();
  }, []);

  // 💾 คงเดิม: เลื่อนแชทลงล่างสุดอัตโนมัติ
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isOpen, clearTimestamp]);

  // ✅ [คงเดิม] ฟังก์ชันจัดการการลากสำหรับ Mobile Touch Events
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

  // ✅ [เพิ่มใหม่] ฟังก์ชันล้างแชทหน้าจอตัวเอง
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

  // 📱 ปรับปรุง: ปุ่มวงกลมแบบลากได้
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
          className="w-14 h-14 bg-amber-600 rounded-full flex items-center justify-center shadow-[0_0_20px_rgba(217,119,6,0.5)] border-2 border-amber-400 active:scale-90 transition-transform"
        >
          <span className="text-2xl pointer-events-none">💬</span>
        </button>
      </div>
    );
  }

  return (
    <div className={`flex flex-col bg-slate-900/90 backdrop-blur-md border border-slate-700 rounded-lg overflow-hidden shadow-2xl transition-all duration-300
      ${isMobile ? 'fixed inset-4 h-[380px] m-auto z-[1000] border-amber-500/50' : 'h-full w-full'}`}>
      
      {/* ส่วนหัวแชท */}
      <div className="bg-slate-800/80 p-2 flex justify-between items-center border-b border-slate-700">
        <span className="text-[10px] font-black uppercase text-amber-500 italic tracking-widest">
          World Chat {isMobile && '(Mobile View)'}
        </span>
        
        <div className="flex items-center gap-2">
          {/* ✅ [เพิ่มใหม่] ปุ่มล้างแชทเฉพาะของตัวเอง */}
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

      {/* 💾 ส่วนแสดงข้อความ (ปรับปรุงให้ Filter ข้อความเก่าออก) */}
      <div className="flex-1 overflow-y-auto p-3 space-y-2 text-[12px] md:text-sm custom-scrollbar">
        {messages
          .filter(msg => msg.timestamp > clearTimestamp) // ✅ กรองเฉพาะข้อความใหม่กว่าเวลาที่กดล้าง
          .map((msg, i) => (
            <div key={i} className="break-words animate-in fade-in slide-in-from-left-2">
              <span className="text-amber-500 font-black">Lv.{msg.level} {msg.username}: </span>
              <span className="text-slate-200">{msg.text}</span>
            </div>
        ))}
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