import React, { useState, useEffect, useRef } from 'react';
import { db } from '../firebase';
import { ref, push, onValue, query, limitToLast } from "firebase/database";

export default function WorldChat({ player, isMobile }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isOpen, setIsOpen] = useState(!isMobile); // ถ้าเป็นมือถือให้เริ่มแบบปิดไว้
  const chatEndRef = useRef(null);

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
  }, [messages, isOpen]);

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

  // 📱 เพิ่มเติม: แสดงปุ่มวงกลมสำหรับ Mobile ตอนที่ปิดแชทอยู่
  if (isMobile && !isOpen) {
    return (
      <button 
        onClick={() => setIsOpen(true)}
        className="w-14 h-14 bg-amber-600 rounded-full flex items-center justify-center shadow-[0_0_20px_rgba(217,119,6,0.5)] border-2 border-amber-400 animate-bounce active:scale-90 transition-all"
      >
        <span className="text-2xl">💬</span>
      </button>
    );
  }

  return (
    <div className={`flex flex-col bg-slate-900/90 backdrop-blur-md border border-slate-700 rounded-lg overflow-hidden shadow-2xl transition-all duration-300
      ${isMobile ? 'fixed bottom-20 right-4 w-[calc(100vw-32px)] h-[350px] z-[500] border-amber-500/50' : 'h-full w-full'}`}>
      
      {/* ส่วนหัวแชท (สำหรับ Mobile ไว้กดปิด) */}
      <div className="bg-slate-800/80 p-2 flex justify-between items-center border-b border-slate-700">
        <span className="text-[10px] font-black uppercase text-amber-500 italic tracking-widest">
          World Chat {isMobile && '(Mobile View)'}
        </span>
        {isMobile && (
          <button onClick={() => setIsOpen(false)} className="text-slate-400 hover:text-white px-2 font-bold text-lg">
            ×
          </button>
        )}
      </div>

      {/* 💾 คงเดิม: ส่วนแสดงข้อความ */}
      <div className="flex-1 overflow-y-auto p-3 space-y-2 text-[12px] md:text-sm custom-scrollbar">
        {messages.map((msg, i) => (
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