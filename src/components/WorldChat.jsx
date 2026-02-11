import React, { useState, useEffect, useRef } from 'react'; 
import { rtdb } from '../firebase';
import { ref, push, onValue, query, limitToLast } from "firebase/database";
import { Users, X, Swords, Shield, Activity, Database, Send } from 'lucide-react'; 

export default function WorldChat({ player, isMobile, onNewMessage, unreadChatCount, onClose }) {
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
  const [inspectId, setInspectId] = useState(null);

  const isActualAdmin = typeof window !== 'undefined' && localStorage.getItem('dev_token') === '198831';

  // 💾 1. ระบบดึงข้อความแชท
  useEffect(() => {
    const chatRef = query(ref(rtdb, 'chats'), limitToLast(50));
    const unsubscribe = onValue(chatRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const list = Object.values(data);
        if (messages.length > 0 && list.length > messages.length) {
          if (typeof onNewMessage === 'function') onNewMessage();
        }
        setMessages(list);
      }
    });
    return () => unsubscribe();
  }, [messages.length, onNewMessage]);

  // ✨ 2. ระบบดึงรายชื่อผู้เล่นออนไลน์
  useEffect(() => {
    const statusRef = ref(rtdb, 'status');
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

  // 💾 3. ระบบเลื่อนลงล่างสุด
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isOpen, clearTimestamp]);

  const handleClearChat = () => { setClearTimestamp(Date.now()); };

  // 💾 4. ฟังก์ชันส่งข้อความ
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

    push(ref(rtdb, 'chats'), {
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
    <div className={`flex flex-col bg-[#020617]/95 backdrop-blur-xl border-2 transition-all duration-300 pointer-events-auto font-mono rounded-none
      ${isMobile 
        ? 'fixed inset-0 w-full h-full z-[10000] border-none' 
        : 'h-full w-full relative z-10 border-white/10 shadow-2xl'}`}>
      
      {/* Decorative Corners for Desktop */}
      {!isMobile && (
        <>
          <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-amber-500 z-20" />
          <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-amber-500 z-20" />
        </>
      )}

      {/* 📡 1. HEADER: Communication Terminal */}
      <div className="bg-slate-900 border-b-2 border-white/10 p-4 flex justify-between items-center shrink-0 relative">
        <div className="flex flex-col">
          <div className="flex items-center gap-2">
            <Activity size={12} className="text-amber-500 animate-pulse" />
            <span className="text-[10px] font-black uppercase italic text-white tracking-[0.3em]">Neural_Link_Chat</span>
          </div>
          <div 
            onClick={() => setShowOnlineModal(true)}
            className="flex items-center gap-2 mt-1.5 cursor-pointer hover:bg-white/5 transition-all w-fit pr-2"
          >
            <div className="w-1.5 h-1.5 bg-emerald-500 rounded-none shadow-[0_0_8px_rgba(16,185,129,1)]" />
            <span className="text-[9px] font-black text-emerald-500 uppercase tracking-widest border-b border-emerald-500/20">
              {onlineCount} NODE_ACTIVE
            </span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={handleClearChat} className="text-[9px] font-black uppercase bg-black/40 border border-white/10 text-slate-500 hover:text-red-500 px-3 py-1.5 transition-all italic">Flush_Log</button>
          
          {isMobile && (
            <button 
              onClick={onClose} 
              className="bg-red-600/10 border border-red-600/50 p-2 text-red-500 active:scale-90 transition-all rounded-none"
            >
              <X size={20} />
            </button>
          )}
        </div>
      </div>

      {/* 🗨️ 2. MESSAGE STREAM: Data Flow */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar bg-black/20 touch-pan-y relative">
         {/* Grid Background */}
         <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)', backgroundSize: '30px 30px' }} />

        {messages
          .filter(msg => msg.timestamp > clearTimestamp) 
          .map((msg, i) => {
            const isGodMessage = msg.isAdminMsg === true;
            const isInspecting = inspectId === msg.timestamp;

            return (
              <div key={msg.timestamp || i} className={`relative animate-in slide-in-from-left-2 duration-300 w-full ${isGodMessage ? 'py-2' : ''}`}>
                {isGodMessage ? (
                  <div className="relative w-full">
                    <div className="bg-cyan-950/40 border-l-4 border-cyan-500 p-3 shadow-[inset_0_0_20px_rgba(6,182,212,0.1)]">
                      <div className="flex items-center gap-2 mb-2">
                        <Cpu size={12} className="text-cyan-400" />
                        <span className="text-[8px] bg-cyan-500 text-black px-2 py-0.5 font-black tracking-widest uppercase italic">SYS_ADMIN_BROADCAST</span>
                      </div>
                      <p className="text-cyan-400 text-xs leading-relaxed font-bold break-words whitespace-pre-wrap italic">
                        {"> "} {msg.text}
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="relative bg-white/[0.03] border border-white/5 p-3 rounded-none hover:bg-white/[0.06] transition-all w-full overflow-hidden">
                    <div className="flex flex-wrap items-start gap-x-3">
                      <div className="flex items-center gap-2 shrink-0 mb-1">
                        <span className="text-[8px] font-black bg-slate-800 text-amber-500 px-1.5 py-0.5 border border-amber-500/30">
                          LV.{msg.level || 1}
                        </span>
                        <button 
                          type="button"
                          onClick={() => setInspectId(isInspecting ? null : msg.timestamp)}
                          className="text-white font-black text-xs whitespace-nowrap hover:text-amber-500 transition-colors italic tracking-tighter"
                        >
                          {msg.username}_ID:
                        </button>
                      </div>
                      <span className="text-slate-300 text-xs leading-relaxed break-words whitespace-pre-wrap flex-1 min-w-[150px]">
                        {msg.text}
                      </span>
                    </div>

                    {isInspecting && msg.stats && (
                      <div className="mt-3 animate-in zoom-in-95 duration-200 bg-black border border-white/20 rounded-none p-3 shadow-2xl flex gap-6 items-center relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-1 opacity-10"><Database size={12} /></div>
                        <div className="flex items-center gap-2">
                          <Swords size={12} className="text-orange-500" />
                          <span className="text-[9px] text-slate-500 font-black uppercase italic">Pwr</span>
                          <span className="text-xs font-black text-orange-400">{msg.stats.atk}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Shield size={12} className="text-blue-500" />
                          <span className="text-[9px] text-slate-500 font-black uppercase italic">Def</span>
                          <span className="text-xs font-black text-blue-400">{msg.stats.def}</span>
                        </div>
                        <button onClick={() => setInspectId(null)} className="ml-auto text-[9px] text-red-500 hover:text-white uppercase font-black italic underline decoration-red-500/30">Close_Data</button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        <div ref={chatEndRef} />
      </div>

      {/* ⌨️ 3. INPUT: Terminal Command */}
      <form onSubmit={sendMessage} className="p-4 border-t-2 border-white/10 flex gap-3 bg-slate-950 shrink-0 relative">
        <div className="absolute -top-1 left-4 w-8 h-1 bg-amber-500/50" />
        <input 
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="ENTER_DATA_STRING..."
          className="flex-1 bg-black/60 border border-white/10 rounded-none px-4 py-3 text-sm outline-none focus:border-amber-500 text-white italic placeholder:text-slate-700"
        />
        <button className="bg-amber-600 hover:bg-amber-500 text-black font-black px-6 py-3 rounded-none text-xs transition-all active:scale-95 shadow-[0_0_15px_rgba(217,119,6,0.3)] flex items-center gap-2">
          <Send size={14} /> SEND
        </button>
      </form>

      {/* 🌐 4. MODAL: Network Registry */}
      {showOnlineModal && (
        <div className="fixed inset-0 z-[20000] flex items-center justify-center p-6 backdrop-blur-md bg-black/90 pointer-events-auto">
          <div className="bg-[#020617] border-2 border-emerald-500/40 w-full max-w-sm rounded-none overflow-hidden shadow-[0_0_50px_rgba(16,185,129,0.1)] animate-in zoom-in-95 duration-200">
            <div className="p-5 bg-emerald-500/10 border-b-2 border-emerald-500/20 flex justify-between items-center relative">
               <div className="absolute top-0 left-0 w-full h-1 bg-emerald-500 opacity-20" />
              <div className="flex items-center gap-3">
                <Users className="text-emerald-500" size={18} />
                <span className="text-[10px] font-black uppercase italic text-white tracking-[0.3em]">Network_Registry ({onlineCount})</span>
              </div>
              <button onClick={() => setShowOnlineModal(false)} className="p-2 border border-white/10 text-slate-500 hover:text-white transition-all rounded-none"><X size={20}/></button>
            </div>
            <div className="max-h-[350px] overflow-y-auto p-4 space-y-2 custom-scrollbar bg-black/40">
              {onlinePlayers.length > 0 ? (
                onlinePlayers.map((u, idx) => (
                  <div key={idx} className="flex justify-between items-center bg-white/[0.03] p-3 rounded-none border border-white/5 hover:border-emerald-500/40 transition-all">
                    <div className="flex items-center gap-3">
                      <div className={`w-2.5 h-2.5 rounded-none animate-pulse ${u.isAdmin ? 'bg-cyan-400 shadow-[0_0_10px_cyan]' : 'bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]'}`} />
                      <span className={`text-xs font-black italic ${u.isAdmin ? 'text-cyan-400' : 'text-slate-200'}`}>{u.username}</span>
                    </div>
                    {u.isAdmin && <div className="bg-cyan-500/20 border border-cyan-500/50 px-2 py-0.5 text-cyan-400 text-[8px] font-black uppercase italic tracking-tighter shadow-[0_0_8px_rgba(6,182,212,0.2)]">ROOT_USER</div>}
                  </div>
                ))
              ) : (
                <div className="flex flex-col items-center py-8 opacity-20">
                   <Activity size={24} className="mb-2" />
                   <p className="text-[9px] font-black uppercase italic tracking-widest">No_Signals_Detected</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255, 255, 255, 0.05); }
      `}</style>
    </div>
  );
}