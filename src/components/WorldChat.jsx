import React, { useState, useEffect, useRef } from 'react'; 
import { db } from '../firebase';
import { ref, push, onValue, query, limitToLast } from "firebase/database";
import { Users, X } from 'lucide-react';

export default function WorldChat({ player, isMobile, onNewMessage, unreadChatCount }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isOpen, setIsOpen] = useState(!isMobile); 
  const chatEndRef = useRef(null);

  const [onlineCount, setOnlineCount] = useState(0);
  const [onlinePlayers, setOnlinePlayers] = useState([]);
  const [showOnlineModal, setShowOnlineModal] = useState(false);

  const [clearTimestamp, setClearTimestamp] = useState(0);
  const [position, setPosition] = useState({ x: window.innerWidth - 70, y: window.innerHeight - 150 });
  const [isDragging, setIsDragging] = useState(false);

  // 🔑 [NEW] เช็คสิทธิ์จาก Token ลับในเครื่อง (ใช้คีย์เดียวกันกับที่คุณเซตใน App.jsx)
  const isActualAdmin = typeof window !== 'undefined' && localStorage.getItem('dev_token') === '198831';

  // 💾 1. ระบบดึงข้อความแชท
  useEffect(() => {
    const chatRef = query(ref(db, 'chats'), limitToLast(50));
    const unsubscribe = onValue(chatRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const list = Object.values(data);
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

  // ✨ 2. ระบบดึงรายชื่อผู้เล่นออนไลน์ (Sync กับ isAdmin ใน Firebase)
  useEffect(() => {
    const statusRef = ref(db, 'status');
    const unsubscribe = onValue(statusRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const playerList = Object.values(data);
        setOnlinePlayers(playerList);
        setOnlineCount(playerList.length);
      } else {
        setOnlinePlayers([]);
        setOnlineCount(0);
      }
    });
    return () => unsubscribe();
  }, []);

  // 💾 3. ระบบเลื่อนลงล่างสุด (คงเดิม)
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isOpen, clearTimestamp]);

  const handleTouchMove = (e) => {
    if (!isMobile || isOpen) return;
    const touch = e.touches[0];
    const newX = Math.min(Math.max(10, touch.clientX - 28), window.innerWidth - 60);
    const newY = Math.min(Math.max(10, touch.clientY - 28), window.innerHeight - 60);
    setPosition({ x: newX, y: newY });
    setIsDragging(true);
  };
  const handleTouchEnd = () => { setTimeout(() => setIsDragging(false), 50); };
  const handleClearChat = () => { setClearTimestamp(Date.now()); };

  // 💾 4. ฟังก์ชันส่งข้อความ + ระบบ Admin Command
  const sendMessage = (e) => {
    e.preventDefault();
    const text = input.trim();
    if (!text) return;

    // 🕵️ เช็คสิทธิ์พระเจ้าจาก Token ลับในเครื่องเท่านั้น
    if (text.startsWith('/dev ') && isActualAdmin) {
      const adminMsg = text.replace('/dev ', '');
      if (window.publishBroadcast) {
        window.publishBroadcast(adminMsg);
        setInput('');
        return; // ไม่ลงแชทปกติ
      }
    }

    push(ref(db, 'chats'), {
      username: player.name || 'Anonymous',
      text: text,
      level: player.level || 1,
      timestamp: Date.now(),
      // ✅ ส่ง Flag isAdmin ไปด้วยเพื่อให้ข้อความเรืองแสงอัตโนมัติ
      isAdminMsg: isActualAdmin 
    });
    setInput('');
  };

  return (
    <div className={`flex flex-col bg-slate-900/90 backdrop-blur-md border border-slate-700 rounded-lg overflow-hidden shadow-2xl transition-all duration-300
      ${isMobile ? 'fixed inset-4 h-[420px] m-auto z-[1000] border-amber-500/50' : 'h-full w-full'}`}>
      
      {/* ส่วนหัวแชท */}
      <div className="bg-slate-800/80 p-2 flex justify-between items-center border-b border-slate-700">
        <div className="flex flex-col leading-tight">
          <span className="text-[10px] font-black uppercase text-amber-500 italic tracking-widest">World Chat</span>
          <div 
            onClick={() => setShowOnlineModal(true)}
            className="flex items-center gap-1.5 mt-0.5 cursor-pointer hover:opacity-80 transition-opacity active:scale-95"
          >
            <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_5px_rgba(16,185,129,0.8)]" />
            <span className="text-[8px] font-black text-emerald-400/80 uppercase tracking-tighter underline decoration-emerald-500/30">
              {onlineCount} Players Active
            </span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={handleClearChat} className="text-[9px] font-black uppercase bg-slate-700 hover:bg-red-900/40 text-slate-300 hover:text-red-400 px-2 py-1 rounded border border-slate-600 transition-colors italic">Clear</button>
          {isMobile && <button onClick={() => setIsOpen(false)} className="text-slate-400 hover:text-white px-2 font-bold text-lg">×</button>}
        </div>
      </div>

      {/* พื้นที่แสดงข้อความ */}
      <div className="flex-1 overflow-y-auto p-3 space-y-2 text-[12px] md:text-sm custom-scrollbar bg-slate-950/20">
        {messages
          .filter(msg => msg.timestamp > clearTimestamp) 
          .map((msg, i) => {
            // ✅ เช็ค Flag จาก DB แทนการเช็คชื่อ
            const isGodMessage = msg.isAdminMsg === true;
            return (
              <div key={i} className={`animate-in fade-in slide-in-from-left-2 w-full ${isGodMessage ? 'py-1' : ''}`}>
                {isGodMessage ? (
                  <div className="relative group w-full">
                    <div className="absolute -inset-0.5 bg-gradient-to-r from-cyan-500/40 to-blue-600/40 rounded-xl blur opacity-20"></div>
                    <div className="relative bg-slate-900/90 border-l-4 border-cyan-500 rounded-r-xl p-2.5 shadow-lg">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-[7px] bg-cyan-500 text-slate-950 px-2 py-0.5 rounded-full font-black tracking-widest uppercase">THE CREATOR</span>
                        <div className="w-1.5 h-1.5 bg-cyan-500 rounded-full animate-pulse" />
                      </div>
                      <p className="text-cyan-50 leading-relaxed font-medium break-words">{msg.text}</p>
                    </div>
                  </div>
                ) : (
                  <div className="bg-white/5 hover:bg-white/10 transition-colors p-2 rounded-lg border border-white/5 flex items-start gap-x-2 w-full">
                    <span className="text-amber-500 font-black shrink-0 whitespace-nowrap">{msg.username}:</span>
                    <span className="text-slate-200 leading-snug break-words flex-1">{msg.text}</span>
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
          // ✅ เปลี่ยนเป็น placeholder เนียนๆ แก้ไขตัวแปรสีเทา
          placeholder={isActualAdmin ? "พิมพ์ข้อความ... " : "พิมพ์ข้อความ..."}
          className="flex-1 bg-slate-800 border border-slate-600 rounded px-2 py-1.5 text-xs outline-none focus:border-amber-500 text-white"
        />
        <button className="bg-amber-600 hover:bg-amber-500 text-black font-bold px-4 py-1.5 rounded text-xs transition-colors active:scale-95">ส่ง</button>
      </form>

      {/* Modal รายชื่อคนออนไลน์ (พรางตัว Admin) */}
      {showOnlineModal && (
        <div className="fixed inset-0 z-[2000] flex items-center justify-center p-6 backdrop-blur-sm bg-slate-950/80">
          <div className="bg-slate-900 border-2 border-emerald-500/30 w-full max-w-sm rounded-[2rem] overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="p-4 bg-emerald-500/10 border-b border-white/5 flex justify-between items-center">
              <div className="flex items-center gap-2">
                <Users className="text-emerald-500" size={18} />
                <span className="text-[10px] font-black uppercase italic text-white tracking-widest">Players Online ({onlineCount})</span>
              </div>
              <button onClick={() => setShowOnlineModal(false)} className="p-1 hover:bg-white/10 rounded-full transition-colors"><X size={20} className="text-slate-400" /></button>
            </div>
            <div className="max-h-[300px] overflow-y-auto p-4 space-y-2 custom-scrollbar">
              {onlinePlayers.length > 0 ? (
                onlinePlayers.map((u, idx) => (
                  <div key={idx} className="flex justify-between items-center bg-white/5 p-3 rounded-xl border border-white/5 transition-all hover:border-emerald-500/30">
                    <div className="flex items-center gap-2">
                      {/* ✅ แสดงสถานะ GOD ตาม isAdmin จริงๆ จากฐานข้อมูล */}
                      <div className={`w-2 h-2 rounded-full animate-pulse ${u.isAdmin ? 'bg-cyan-400 shadow-[0_0_8px_cyan]' : 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]'}`} />
                      <span className={`text-xs font-bold ${u.isAdmin ? 'text-cyan-400' : 'text-slate-200'}`}>{u.username}</span>
                    </div>
                    {u.isAdmin && <span className="text-[7px] bg-cyan-500 text-slate-950 px-2 py-0.5 rounded-full font-black uppercase tracking-tighter">GOD</span>}
                  </div>
                ))
              ) : (
                <p className="text-center text-[10px] text-slate-500 italic py-4">No explorers found...</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}