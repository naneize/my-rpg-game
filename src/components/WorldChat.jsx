import React, { useState, useEffect, useRef } from 'react'; 
import { db } from '../firebase';
import { ref, push, onValue, query, limitToLast } from "firebase/database";

// ✅ รับ unreadChatCount เพิ่มเข้ามาเพื่อแก้บั๊กเครื่องหมาย ! เด้งค้าง
export default function WorldChat({ player, isMobile, onNewMessage, unreadChatCount }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isOpen, setIsOpen] = useState(!isMobile); 
  const chatEndRef = useRef(null);

  // ✨ [คงเดิม] State สำหรับเก็บจำนวนผู้เล่นออนไลน์
  const [onlineCount, setOnlineCount] = useState(0);

  // ✅ [คงเดิม] State สำหรับจัดการการล้างแชทส่วนตัว (Client-side clear)
  const [clearTimestamp, setClearTimestamp] = useState(0);

  // ✅ [คงเดิม] State สำหรับจัดการตำแหน่งปุ่มแชทที่ลากได้
  const [position, setPosition] = useState({ x: window.innerWidth - 70, y: window.innerHeight - 150 });
  const [isDragging, setIsDragging] = useState(false);

  // 💾 1. ระบบดึงข้อความแชทและแจ้งเตือน
  useEffect(() => {
    const chatRef = query(ref(db, 'chats'), limitToLast(50));
    const unsubscribe = onValue(chatRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const list = Object.values(data);
        
        // ✨ [คงเดิม] ส่งสัญญาณแจ้งเตือนไปยัง App.jsx เมื่อมีข้อความใหม่
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

  // ✨ 2. [ปรับปรุง] ระบบนับจำนวนผู้เล่นออนไลน์ (นับจากจำนวน Session ID ในฐานข้อมูล)
  useEffect(() => {
    const statusRef = ref(db, 'status');
    const unsubscribe = onValue(statusRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        // ✅ นับจำนวน Key ทั้งหมด (ID สุ่ม) ที่อยู่ภายใต้ status เพื่อความแม่นยำแม้เปิดหลายจอ
        const keys = Object.keys(data);
        setOnlineCount(keys.length);
        console.log("Online Sync:", keys.length, "sessions active");
      } else {
        setOnlineCount(0);
      }
    });
    return () => unsubscribe();
  }, []);

  // 💾 3. ระบบเลื่อนลงล่างสุดอัตโนมัติ
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isOpen, clearTimestamp]);

  // ✅ [คงเดิม] ฟังก์ชันจัดการการลากปุ่มสำหรับ Mobile
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

  // ✅ [คงเดิม] ฟังก์ชันล้างแชท (ส่วนตัว)
  const handleClearChat = () => {
    setClearTimestamp(Date.now());
  };

  // 💾 4. ฟังก์ชันส่งข้อความ
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

  // 📱 ปุ่มวงกลมแบบลากได้สำหรับ Mobile
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
          
          {/* ✅ แจ้งเตือน Unread (เลข 1-9 หรือ !) */}
          {unreadChatCount > 0 && (
          <div className="absolute -top-1 -right-1 bg-red-600 w-5 h-5 rounded-full border-2 border-slate-950 flex items-center justify-center animate-bounce">
             <span className="text-[10px] font-black text-white">
               {unreadChatCount > 9 ? '!' : unreadChatCount}
             </span>
          </div>
          )}
        </button>
      </div>
    );
  }

  return (
    <div className={`flex flex-col bg-slate-900/90 backdrop-blur-md border border-slate-700 rounded-lg overflow-hidden shadow-2xl transition-all duration-300
      ${isMobile ? 'fixed inset-4 h-[420px] m-auto z-[1000] border-amber-500/50' : 'h-full w-full'}`}>
      
      {/* ส่วนหัวแชท: ชื่อห้อง และจำนวนคนออนไลน์ */}
      <div className="bg-slate-800/80 p-2 flex justify-between items-center border-b border-slate-700">
        <div className="flex flex-col leading-tight">
          <span className="text-[10px] font-black uppercase text-amber-500 italic tracking-widest">
            World Chat
          </span>
          {/* 🟢 สถานะผู้เล่นออนไลน์ (Real-time) */}
          <div className="flex items-center gap-1.5 mt-0.5">
            <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_5px_rgba(16,185,129,0.8)]" />
            <span className="text-[8px] font-black text-emerald-400/80 uppercase tracking-tighter">
              {onlineCount} Players Active
            </span>
          </div>
        </div>
        
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

      {/* พื้นที่แสดงข้อความ (Full Width Layout) */}
      <div className="flex-1 overflow-y-auto p-3 space-y-2 text-[12px] md:text-sm custom-scrollbar bg-slate-950/20">
        {messages
          .filter(msg => msg.timestamp > clearTimestamp) 
          .map((msg, i) => {
            const isDeveloper = msg.username === 'DEV001' || msg.username === 'GeminiAdmin';

            return (
              <div key={i} className={`animate-in fade-in slide-in-from-left-2 w-full ${isDeveloper ? 'py-1' : ''}`}>
                {isDeveloper ? (
                  /* 🚀 เลย์เอาต์พิเศษสำหรับผู้พัฒนา (ซ่อนเลเวล) */
                  <div className="relative group w-full">
                    <div className="absolute -inset-0.5 bg-gradient-to-r from-cyan-500/40 to-blue-600/40 rounded-xl blur opacity-20 transition duration-1000"></div>
                    <div className="relative bg-slate-900/90 border-l-4 border-cyan-500 rounded-r-xl p-2.5 shadow-lg">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-[7px] bg-cyan-500 text-slate-950 px-2 py-0.5 rounded-full font-black tracking-widest uppercase shadow-[0_0_10px_rgba(34,211,238,0.3)]">
                          DEVELOPER
                        </span>
                        <div className="w-1.5 h-1.5 bg-cyan-500 rounded-full animate-pulse" />
                      </div>
                      <p className="text-cyan-50 leading-relaxed font-medium break-words">
                        {msg.text}
                      </p>
                    </div>
                  </div>
                ) : (
                  /* 🟠 เลย์เอาต์ข้อความผู้เล่นปกติ */
                  <div className="bg-white/5 hover:bg-white/10 transition-colors p-2 rounded-lg border border-white/5 flex items-start gap-x-2 w-full">
                    <span className="text-amber-500 font-black shrink-0 whitespace-nowrap">{msg.username}:</span>
                    <span className="text-slate-200 leading-snug break-words flex-1">
                      {msg.text}
                    </span>
                  </div>
                )}
              </div>
            );
          })}
        <div ref={chatEndRef} />
      </div>

      {/* ช่องกรอกข้อความ */}
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