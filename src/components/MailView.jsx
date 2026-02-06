import React, { useState } from 'react';
// ✅ เพิ่ม Trash2, Eraser, Gift สำหรับระบบลบและแลกโค้ด
import { Mail, MailOpen, Gift, CheckCircle2, Trash2, Eraser, Ticket, AlertCircle } from 'lucide-react';

export default function MailView({ player, claimMailItems, deleteMail, clearReadMail, redeemGiftCode }) {
  const [inputCode, setInputCode] = useState('');
  // ✅ เพิ่ม State สำหรับจัดการแจ้งเตือนในหน้าจอ
  const [redeemStatus, setRedeemStatus] = useState(null); 
  const mailbox = player.mailbox || [];

  // ✅ ฟังก์ชันจัดการการกดแลกโค้ด (เปลี่ยนจาก alert เป็น Toast)
  const handleRedeem = () => {
    if (!inputCode.trim()) return;
    const result = redeemGiftCode(inputCode);
    
    // แสดงสถานะแจ้งเตือน
    setRedeemStatus(result);
    if (result.success) setInputCode('');

    // หายไปเองใน 3 วินาที
    setTimeout(() => setRedeemStatus(null), 3000);
  };

  return (
    <div className="flex flex-col h-full bg-slate-950 text-slate-200 p-4 space-y-4 relative overflow-hidden">
      
      {/* 🚀 CUSTOM REDEEM TOAST (แสดงผลด้านบนแทน Windows Popup) */}
      {redeemStatus && (
        <div className="absolute top-16 left-4 right-4 z-[100] animate-in fade-in slide-in-from-top-2 duration-300">
          <div className={`p-3 rounded-2xl border-2 flex items-center gap-3 shadow-2xl backdrop-blur-md
            ${redeemStatus.success 
              ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-400' 
              : 'bg-red-500/20 border-red-500/50 text-red-400'}`}>
            <div className={`w-6 h-6 rounded-full flex items-center justify-center font-black text-xs
              ${redeemStatus.success ? 'bg-emerald-500 text-slate-950' : 'bg-red-500 text-white'}`}>
              {redeemStatus.success ? '✓' : '!'}
            </div>
            <p className="text-[10px] font-black uppercase italic tracking-wider">{redeemStatus.message}</p>
          </div>
        </div>
      )}

      {/* --- ส่วนหัวหน้าจดหมาย --- */}
      <div className="flex justify-between items-center border-b border-white/10 pb-4">
        <h2 className="text-xl font-black italic uppercase flex items-center gap-2">
          <Mail className="text-amber-500" size={20} /> Mailbox
        </h2>

        {/* ✅ ปุ่มล้างจดหมายที่อ่าน/รับของแล้วทั้งหมด */}
        {mailbox.some(m => m.isRead) && (
          <button 
            onClick={clearReadMail}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 rounded-xl text-[9px] font-black text-red-500 transition-all active:scale-95"
          >
            <Eraser size={12} /> CLEAR ALL READ
          </button>
        )}
      </div>

      {/* 🎁 [NEW] ระบบ Gift Code แลกรางวัล */}
      <div className="flex gap-2 p-2 bg-slate-900/50 rounded-2xl border border-amber-500/20 shadow-inner">
        <div className="flex items-center pl-2 text-amber-500/50">
          <Ticket size={16} />
        </div>
        <input 
          value={inputCode}
          onChange={(e) => setInputCode(e.target.value)}
          placeholder="ENTER GIFT CODE..."
          className="flex-1 bg-transparent px-2 text-xs font-black uppercase outline-none text-amber-500 placeholder:text-slate-700"
        />
        <button 
          onClick={handleRedeem}
          className="bg-amber-600 hover:bg-amber-500 text-slate-950 px-4 py-2 rounded-xl text-[10px] font-black uppercase italic transition-all active:scale-95 shadow-lg shadow-amber-600/20"
        >
          REDEEM
        </button>
      </div>

      {/* --- รายการจดหมาย --- */}
      <div className="flex-1 overflow-y-auto space-y-3 pr-1 custom-scrollbar pb-20">
        {mailbox.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-40 opacity-30 italic">
            <Mail size={40} className="mb-2" />
            <p className="text-xs">ไม่มีจดหมายในขณะนี้</p>
          </div>
        ) : (
          mailbox.map((mail) => (
            <div 
              key={mail.id} 
              className={`p-4 rounded-2xl border transition-all relative ${
                mail.isRead ? 'bg-slate-900/30 border-white/5 opacity-70' : 'bg-slate-900 border-amber-500/20 shadow-lg shadow-amber-500/5'
              }`}
            >
              <div className="flex justify-between items-start mb-2">
                <div className="flex items-center gap-2">
                  {mail.isRead ? <MailOpen size={14} className="text-slate-500" /> : <Mail size={14} className="text-amber-500" />}
                  <h3 className={`text-sm font-black ${mail.isRead ? 'text-slate-400' : 'text-white'}`}>{mail.title}</h3>
                </div>
                
                {/* ✅ ปุ่มลบจดหมายรายชิ้น */}
                <button 
                  onClick={() => deleteMail(mail.id)}
                  className="p-1.5 text-slate-600 hover:text-red-500 transition-colors"
                  title="Delete Mail"
                >
                  <Trash2 size={14} />
                </button>
              </div>

              <div className="flex justify-between items-end">
                <p className="text-[11px] text-slate-400 leading-relaxed mb-4 flex-1 pr-4">{mail.content}</p>
                <span className="text-[8px] font-bold text-slate-600 italic mb-4">{mail.sentAt}</span>
              </div>

              {/* ส่วนของรางวัลในจดหมาย */}
              {mail.items && mail.items.length > 0 && (
                <div className="flex items-center justify-between bg-black/40 p-3 rounded-xl border border-white/5">
                  <div className="flex gap-4">
                    {mail.items.map((item, idx) => (
                      <div key={idx} className="flex flex-col items-center">
                        <span className="text-[9px] font-black uppercase italic mb-1" 
                          style={{ color: item.id === 'scrap' ? '#fb923c' : item.id === 'shard' ? '#34d399' : '#a855f7' }}>
                          {item.name}
                        </span>
                        <span className="text-xs font-black text-white">x{item.amount}</span>
                      </div>
                    ))}
                  </div>
                  
                  {/* ปุ่มกดรับของ */}
                  <button
                    disabled={mail.isClaimed}
                    onClick={() => claimMailItems(mail.id)}
                    className={`px-4 py-2 rounded-lg text-[10px] font-black uppercase italic transition-all active:scale-95 ${
                      mail.isClaimed 
                        ? 'bg-slate-800 text-slate-600 cursor-not-allowed' 
                        : 'bg-amber-600 text-slate-950 shadow-lg shadow-amber-600/20 hover:bg-amber-500'
                    }`}
                  >
                    {mail.isClaimed ? (
                      <div className="flex items-center gap-1"><CheckCircle2 size={12}/> CLAIMED</div>
                    ) : (
                      'CLAIM REWARD'
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