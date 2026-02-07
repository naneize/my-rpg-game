import React from 'react';
import { Compass, User, Library, ShieldAlert, ShoppingBag, BookMarked, Save, Package, Hammer, Mail } from 'lucide-react';

const SidebarItem = ({ icon: Icon, label, active, onClick, hasNotification }) => (
  <button 
    onClick={onClick}
    className={`flex-shrink-0 md:w-full flex flex-col md:flex-row items-center justify-center md:justify-start gap-1 md:gap-3 p-2 md:p-3 rounded-xl transition-all relative min-w-[60px] md:min-w-0 ${
      active ? 'bg-amber-600/20 text-amber-500 border border-amber-600/50' : 'hover:bg-slate-800 text-slate-400'
    }`}
  >
    <div className="relative">
      <Icon size={20} />
      {/* ✅ Notification Badge */}
      {hasNotification && (
        <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-slate-950 animate-pulse" />
      )}
    </div>
    <span className="hidden md:inline font-medium text-[10px] md:text-sm">{label}</span>
    <span className="md:hidden text-[7px] font-black uppercase tracking-tighter leading-none">{label}</span>
  </button>
);

export default function Sidebar({ activeTab, setActiveTab, player, saveGame }) {
  const hasUnreadMail = player.mailbox?.some(m => !m.isRead);

  return (
    <>
      {/* --- 📱 MOBILE NAVIGATION (ยืดหยุ่น & ไม่เบียด) --- */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-slate-950/90 backdrop-blur-xl border-t border-white/5 z-[5000] h-16 shadow-[0_-10px_30px_rgba(0,0,0,0.8)]">
        <div className="flex items-center justify-between h-full px-2 overflow-x-auto no-scrollbar gap-1">
          <SidebarItem icon={Compass} label="เดินทาง" active={activeTab === 'TRAVEL'} onClick={() => setActiveTab('TRAVEL')} />
          <SidebarItem icon={User} label="ตัวละคร" active={activeTab === 'CHARACTER'} onClick={() => setActiveTab('CHARACTER')} />
          <SidebarItem icon={Package} label="คลัง" active={activeTab === 'INVENTORY'} onClick={() => setActiveTab('INVENTORY')} />
          
          {/* ✅ คืนพื้นที่ให้ Monster Collection บนมือถือ */}
          <SidebarItem icon={Library} label="มอนสเตอร์" active={activeTab === 'COLLECTION'} onClick={() => setActiveTab('COLLECTION')} />
          
          <SidebarItem icon={Hammer} label="ตีเหล็ก" active={activeTab === 'CRAFT'} onClick={() => setActiveTab('CRAFT')} />
          <SidebarItem icon={ShoppingBag} label="ตลาด" active={activeTab === 'MARKET'} onClick={() => setActiveTab('MARKET')} />
          <SidebarItem icon={BookMarked} label="ทักษะ" active={activeTab === 'PASSIVESKILL'} onClick={() => setActiveTab('PASSIVESKILL')} />
          
          <SidebarItem 
            icon={Mail} 
            label="จดหมาย" 
            active={activeTab === 'MAIL'} 
            onClick={() => setActiveTab('MAIL')} 
            hasNotification={hasUnreadMail}
          />
        </div>
      </nav>

      {/* --- 💻 DESKTOP SIDEBAR --- */}
      <aside className="hidden md:flex w-64 bg-slate-950 border-r border-slate-800 p-6 flex-col justify-between h-screen transition-all sticky top-0">
        <div className="flex flex-col">
          <div className="flex items-center gap-2 mb-10 px-2">
            <ShieldAlert className="text-amber-500" size={28} />
            <h1 className="text-xl font-black text-white uppercase italic tracking-tighter">Infinite Steps</h1>
          </div>
          
          <nav className="flex flex-col space-y-2">
            <SidebarItem icon={Compass} label="ออกเดินทาง" active={activeTab === 'TRAVEL'} onClick={() => setActiveTab('TRAVEL')} />
            <SidebarItem icon={User} label="ตัวละคร" active={activeTab === 'CHARACTER'} onClick={() => setActiveTab('CHARACTER')} />
            <SidebarItem icon={Package} label="กระเป๋าเก็บของ" active={activeTab === 'INVENTORY'} onClick={() => setActiveTab('INVENTORY')} />
            <SidebarItem icon={Hammer} label="โรงตีเหล็ก" active={activeTab === 'CRAFT'} onClick={() => setActiveTab('CRAFT')} />
            <SidebarItem icon={Library} label="คลังแสงมอนสเตอร์" active={activeTab === 'COLLECTION'} onClick={() => setActiveTab('COLLECTION')} />
            <SidebarItem icon={BookMarked} label="ทักษะติดตัว" active={activeTab === 'PASSIVESKILL'} onClick={() => setActiveTab('PASSIVESKILL')} />
            <SidebarItem icon={ShoppingBag} label="ตลาดกลาง" active={activeTab === 'MARKET'} onClick={() => setActiveTab('MARKET')} />
            <SidebarItem 
              icon={Mail} 
              label="กล่องจดหมาย" 
              active={activeTab === 'MAIL'} 
              onClick={() => setActiveTab('MAIL')} 
              hasNotification={hasUnreadMail}
            />
          </nav>
        </div>

        {/* Desktop Save Button (คงไว้ได้เพราะมีที่เหลือ) */}
        <div className="mt-auto">
          <button 
            onClick={saveGame}
            className="w-full bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 p-3 rounded-xl text-emerald-500 flex items-center justify-center gap-2 transition-all active:scale-95 group"
          >
            <Save size={18} />
            <span className="text-xs font-black uppercase italic tracking-widest">Cloud Save</span>
          </button>
        </div>
      </aside>

      {/* Global CSS for hide scrollbar */}
      <style jsx>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </>
  );
}