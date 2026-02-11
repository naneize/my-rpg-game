import React, { useState } from 'react';
import { Mail, MailOpen, Gift, CheckCircle2, Trash2, Eraser, Ticket, AlertCircle, Activity, Database, ShieldCheck } from 'lucide-react';

export default function MailView({ player, claimMailItems, deleteMail, clearReadMail, redeemGiftCode }) {
  const [inputCode, setInputCode] = useState('');
  const [redeemStatus, setRedeemStatus] = useState(null); 
  const mailbox = player.mailbox || [];

  const handleRedeem = () => {
    if (!inputCode.trim()) return;
    const result = redeemGiftCode(inputCode);
    setRedeemStatus(result);
    if (result.success) setInputCode('');
    setTimeout(() => setRedeemStatus(null), 3000);
  };

  return (
    <div className="flex flex-col h-full bg-[#020617] text-slate-200 p-6 space-y-6 relative overflow-hidden font-mono">
      
      {/* 🚀 CUSTOM REDEEM TOAST (Hard-Edge Alert) */}
      {redeemStatus && (
        <div className="absolute top-20 left-6 right-6 z-[100] animate-in fade-in slide-in-from-top-4 duration-300">
          <div className={`p-4 rounded-none border-2 flex items-center gap-4 shadow-[0_0_30px_rgba(0,0,0,0.5)] backdrop-blur-md
            ${redeemStatus.success 
              ? 'bg-emerald-950/90 border-emerald-500 text-emerald-400' 
              : 'bg-red-950/90 border-red-500 text-red-400'}`}>
            <div className={`w-6 h-6 rounded-none flex items-center justify-center font-black text-xs
              ${redeemStatus.success ? 'bg-emerald-500 text-slate-950' : 'bg-red-500 text-white'}`}>
              {redeemStatus.success ? '✓' : '!'}
            </div>
            <p className="text-[10px] font-black uppercase italic tracking-widest">{redeemStatus.message}</p>
          </div>
        </div>
      )}

      {/* --- 🛰️ HEADER SECTION (Tactical Link) --- */}
      <div className="flex justify-between items-end border-b-2 border-white/10 pb-4 relative">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2 opacity-40">
            <Activity size={10} className="text-amber-500" />
            <span className="text-[8px] font-black uppercase tracking-[0.3em]">Comm_Link_Stable</span>
          </div>
          <h2 className="text-2xl font-black italic uppercase flex items-center gap-3 text-white tracking-tighter">
            <Mail className="text-amber-500" size={24} /> Neural_Mailbox
          </h2>
        </div>

        {mailbox.some(m => m.isRead) && (
          <button 
            onClick={clearReadMail}
            className="flex items-center gap-2 px-4 py-2 bg-red-600/10 hover:bg-red-600 text-red-500 hover:text-white border border-red-600/50 rounded-none text-[9px] font-black transition-all active:scale-95 italic tracking-widest"
          >
            <Eraser size={12} /> PURGE_READ_LOGS
          </button>
        )}
      </div>

      {/* 🎁 [GIFT MODULE] Hard-Edge Input */}
      <div className="flex gap-0 p-1 bg-black/40 border-2 border-white/10 shadow-inner relative group">
        <div className="absolute top-0 left-0 w-2 h-2 bg-amber-500/50" />
        <div className="flex items-center px-4 text-amber-500/30 group-focus-within:text-amber-500 transition-colors">
          <Ticket size={20} />
        </div>
        <input 
          value={inputCode}
          onChange={(e) => setInputCode(e.target.value)}
          placeholder="ENTER_GIFT_ACCESS_CODE..."
          className="flex-1 bg-transparent py-4 text-xs font-black uppercase outline-none text-amber-500 placeholder:text-slate-800 italic tracking-widest"
        />
        <button 
          onClick={handleRedeem}
          className="bg-amber-600 hover:bg-amber-500 text-black px-8 font-black text-[11px] uppercase italic transition-all active:scale-95 shadow-[0_0_15px_rgba(217,119,6,0.2)] tracking-widest"
        >
          EXECUTE
        </button>
      </div>

      {/* --- 📬 MAIL STREAM (Data Logs) --- */}
      <div className="flex-1 overflow-y-auto space-y-4 pr-2 custom-scrollbar pb-10">
        {mailbox.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 opacity-10 gap-4">
            <Database size={60} strokeWidth={1} />
            <p className="text-[10px] font-black uppercase tracking-[0.5em]">No_Inbound_Signals</p>
          </div>
        ) : (
          mailbox.map((mail) => (
            <div 
              key={mail.id} 
              className={`relative p-5 border-2 transition-all duration-300 rounded-none overflow-hidden ${
                mail.isRead 
                  ? 'bg-black/20 border-white/5 opacity-50' 
                  : 'bg-white/[0.02] border-amber-500/30 shadow-[inset_0_0_20px_rgba(245,158,11,0.05)]'
              }`}
            >
              {/* Tactical Status Tab */}
              {!mail.isRead && (
                <div className="absolute top-0 left-0 bg-amber-500 px-2 py-0.5 text-[6px] font-black text-black uppercase tracking-tighter">
                  NEW_DATA
                </div>
              )}

              <div className="flex justify-between items-start mb-3">
                <div className="flex items-center gap-3 mt-1">
                  {mail.isRead ? <MailOpen size={16} className="text-slate-600" /> : <Activity size={16} className="text-amber-500 animate-pulse" />}
                  <div className="flex flex-col">
                    <span className="text-[7px] text-slate-600 font-black uppercase tracking-widest">Sender: {mail.sender}</span>
                    <h3 className={`text-sm font-black italic uppercase tracking-tight ${mail.isRead ? 'text-slate-500' : 'text-white'}`}>{mail.title}</h3>
                  </div>
                </div>
                
                <button 
                  onClick={() => deleteMail(mail.id)}
                  className="p-2 text-slate-700 hover:text-red-500 hover:bg-red-500/10 transition-all"
                  title="Purge Log"
                >
                  <Trash2 size={16} />
                </button>
              </div>

              <div className="flex justify-between items-end mb-4 border-l-2 border-white/5 pl-4 ml-1">
                <p className="text-[11px] text-slate-400 leading-relaxed italic">{">"} {mail.content}</p>
                <div className="flex flex-col items-end shrink-0">
                   <span className="text-[8px] font-black text-slate-700 italic">{mail.sentAt}</span>
                   <span className="text-[6px] text-slate-800 font-black uppercase">Timestamp</span>
                </div>
              </div>

              {/* 📦 PAYLOAD MODULE */}
              {mail.items && mail.items.length > 0 && (
                <div className="flex items-center justify-between bg-black/60 p-4 border border-white/5 relative group">
                  <div className="absolute top-0 right-0 p-1 opacity-10"><Database size={10} /></div>
                  <div className="flex gap-6">
                    {mail.items.map((item, idx) => (
                      <div key={idx} className="flex flex-col">
                        <span className="text-[8px] font-black uppercase italic tracking-widest mb-1" 
                          style={{ color: item.id === 'scrap' ? '#fb923c' : item.id === 'shard' ? '#34d399' : '#a855f7' }}>
                          {item.name}_VALUE
                        </span>
                        <div className="flex items-baseline gap-1">
                           <span className="text-[8px] text-white/20 font-black">x</span>
                           <span className="text-lg font-black text-white leading-none tracking-tighter">{item.amount}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <button
                    disabled={mail.isClaimed}
                    onClick={() => claimMailItems(mail.id)}
                    className={`px-6 py-3 font-[1000] text-[10px] uppercase italic transition-all active:scale-95 rounded-none border-2
                      ${mail.isClaimed 
                        ? 'bg-transparent text-slate-700 border-white/5 cursor-not-allowed' 
                        : 'bg-emerald-600 text-black border-emerald-400 shadow-[4px_4px_0_rgba(5,150,105,0.3)] hover:bg-emerald-500'
                    }`}
                  >
                    {mail.isClaimed ? (
                      <div className="flex items-center gap-2 opacity-50"><ShieldCheck size={14}/> PAYLOAD_SECURED</div>
                    ) : (
                      'EXTRACT_PAYLOAD'
                    )}
                  </button>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}