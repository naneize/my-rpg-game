import React, { useState, useEffect, useRef } from 'react'; 
import { db } from '../firebase';
import { ref, push, onValue, query, limitToLast } from "firebase/database";
import { Users, X, Swords, Shield } from 'lucide-react'; 

export default function WorldChat({ player, isMobile, onNewMessage, unreadChatCount }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  
  // ✅ ปรับสถานะเริ่มต้น: ถ้าเป็นมือถือให้ปิดไว้ก่อน (รอ App.js สั่งเปิดผ่าน CSS หรือเพิ่ม Toggle ภายใน)
  const [isOpen, setIsOpen] = useState(!isMobile); 
  const chatEndRef = useRef(null);

  const [onlineCount, setOnlineCount] = useState(0);
  const [onlinePlayers, setOnlinePlayers] = useState([]);
  const [showOnlineModal, setShowOnlineModal] = useState(false);

  const [clearTimestamp, setClearTimestamp] = useState(0);
  const [position, setPosition] = useState({ x: window.innerWidth - 70, y: window.innerHeight - 150 });
  const [isDragging, setIsDragging] = useState(false);

  const [inspectId, setInspectId] = useState(null);

  const isActualAdmin = typeof window !== 'undefined' && localStorage.getItem('dev_token') === '198831';

  // 💾 1. ระบบดึงข้อความแชท (คงเดิม)
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

  // ✨ 2. ระบบดึงรายชื่อผู้เล่นออนไลน์ (คงเดิม)
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

  // 💾 4. ฟังก์ชันส่งข้อความ + ระบบ Admin Command (คงเดิม)
  const sendMessage = (e) => {
    e.preventDefault();
    const text = input.trim();
    if (!text) return;

    if (text.startsWith('/dev ') && isActualAdmin) {
      const adminMsg = text.replace('/dev ', '');
      if (window.publishBroadcast) {
        window.publishBroadcast(adminMsg);
        setInput('');
        return;
      }
    }

    push(ref(db, 'chats'), {
      username: player.name || 'Anonymous',
      text: text,
      level: player.level || 1,
      stats: {
        atk: player.finalAtk || player.atk || 0,
        def: player.finalDef || player.def || 0
      },
      timestamp: Date.now(),
      isAdminMsg: isActualAdmin 
    });
    
    setInspectId(null); 
    setInput('');
  };

  return (
    /* ✅ แก้ไข: เพิ่ม w-full h-full และปรับเงื่อนไข isMobile ให้ครอบคลุมการแสดงผล */
    <div 
      className={`flex flex-col bg-slate-900/95 backdrop-blur-md border border-slate-700 rounded-lg overflow-hidden shadow-2xl transition-all duration-300 pointer-events-auto
      ${isMobile 
        ? 'fixed inset-0 w-full h-full z-[10000] rounded-none border-none' 
        : 'h-full w-full relative z-10'}`}
    >
      
      {/* ส่วนหัวแชท (ปรับปรุงให้มีปุ่มปิดสำหรับมือถือ) */}
      <div className="bg-slate-800/80 p-3 flex justify-between items-center border-b border-slate-700 shrink-0">
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
          
          {/* ✅ ปุ่มปิดหน้าต่างแชทสำหรับมือถือ: ใช้ setShowMobileChat จาก Props จะเสถียรที่สุด */}
          {isMobile && (
            <button 
              onClick={() => {
                const closeBtn = document.querySelector('button[onClick*="setShowMobileChat(false)"]');
                if (closeBtn) {
                  closeBtn.click();
                } else {
                  setIsOpen(false);
                }
              }} 
              className="bg-slate-700 p-2 rounded-full text-slate-400 hover:text-white active:scale-90 transition-all"
            >
              <X size={24} />
            </button>
          )}
        </div>
      </div>

      {/* พื้นที่แสดงข้อความ (คงเดิม) */}
      <div className="flex-1 overflow-y-auto p-3 space-y-3 text-[12px] md:text-sm custom-scrollbar bg-slate-950/20 touch-pan-y">
        {messages
          .filter(msg => msg.timestamp > clearTimestamp) 
          .map((msg, i) => {
            const isGodMessage = msg.isAdminMsg === true;
            const isInspecting = inspectId === msg.timestamp;

            return (
              <div key={msg.timestamp || i} className={`animate-in fade-in slide-in-from-left-2 w-full ${isGodMessage ? 'py-1' : ''}`}>
                {isGodMessage ? (
                  <div className="relative group w-full">
                    <div className="absolute -inset-0.5 bg-gradient-to-r from-cyan-500/40 to-blue-600/40 rounded-xl blur opacity-20"></div>
                    <div className="relative bg-slate-900/90 border-l-4 border-cyan-500 rounded-r-xl p-2.5 shadow-lg">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-[7px] bg-cyan-500 text-slate-950 px-2 py-0.5 rounded-full font-black tracking-widest uppercase">THE CREATOR</span>
                        <div className="w-1.5 h-1.5 bg-cyan-500 rounded-full animate-pulse" />
                      </div>
                      <p className="text-cyan-5 leading-relaxed font-medium break-words whitespace-pre-wrap">{msg.text}</p>
                    </div>
                  </div>
                ) : (
                  <div className="relative bg-white/5 hover:bg-white/10 transition-colors p-2 rounded-lg border border-white/5 flex flex-col gap-1 w-full overflow-hidden">
                    <div className="flex flex-wrap items-start gap-x-2">
                      <div className="flex items-center gap-2 shrink-0">
                        <span className="text-[9px] font-mono bg-slate-800 text-amber-500 px-1 rounded border border-amber-500/20">
                          Lv.{msg.level || 1}
                        </span>
                        <button 
                          type="button"
                          onClick={() => setInspectId(isInspecting ? null : msg.timestamp)}
                          className="text-amber-500 font-black whitespace-nowrap hover:text-amber-300 transition-colors underline decoration-amber-500/30 underline-offset-2"
                        >
                          {msg.username}:
                        </button>
                      </div>
                      <span className="text-slate-200 leading-snug break-words whitespace-pre-wrap flex-1 min-w-[150px]">
                        {msg.text}
                      </span>
                    </div>

                    {isInspecting && msg.stats && (
                      <div className="mt-1 animate-in zoom-in-95 duration-200 bg-slate-800 border border-amber-500/40 rounded-lg p-2 shadow-xl flex gap-4 items-center">
                        <div className="flex items-center gap-1.5">
                          <Swords size={12} className="text-orange-500" />
                          <span className="text-[10px] text-slate-400 uppercase tracking-tighter">ATK</span>
                          <span className="text-xs font-bold text-orange-400">{msg.stats.atk}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Shield size={12} className="text-blue-500" />
                          <span className="text-[10px] text-slate-400 uppercase tracking-tighter">DEF</span>
                          <span className="text-xs font-bold text-blue-400">{msg.stats.def}</span>
                        </div>
                        <button onClick={() => setInspectId(null)} className="ml-auto text-[10px] text-slate-500 hover:text-white uppercase font-black">Close</button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        <div ref={chatEndRef} />
      </div>

      {/* ช่องกรอกข้อความ (คงเดิม) */}
      <form onSubmit={sendMessage} className="p-3 border-t border-slate-700 flex gap-2 bg-slate-900 shrink-0">
        <input 
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={isActualAdmin ? "พิมพ์ข้อความในฐานะพระเจ้า..." : "พิมพ์ข้อความ..."}
          className="flex-1 bg-slate-800 border border-slate-600 rounded-lg px-3 py-3 text-sm outline-none focus:border-amber-500 text-white"
        />
        <button className="bg-amber-600 hover:bg-amber-500 text-black font-black px-6 py-2 rounded-lg text-sm transition-all active:scale-95 shadow-lg shadow-amber-900/20">ส่ง</button>
      </form>

      {/* Modal รายชื่อคนออนไลน์ (คงเดิม) */}
      {showOnlineModal && (
        <div className="fixed inset-0 z-[20000] flex items-center justify-center p-6 backdrop-blur-sm bg-slate-950/80 pointer-events-auto">
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