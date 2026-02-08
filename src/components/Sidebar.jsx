import React from 'react';
import { Compass, User, Library, ShieldAlert, ShoppingBag, BookMarked, Save, Package, Hammer, Mail, X, ChevronRight } from 'lucide-react';

const SidebarItem = ({ icon: Icon, label, active, onClick, hasNotification, isMobile }) => (
  <button 
    onClick={onClick}
    className={`w-full flex items-center gap-4 p-4 rounded-2xl transition-all relative ${
      active 
        ? 'bg-amber-600/20 text-amber-500 border border-amber-600/50 shadow-[0_0_15px_rgba(217,119,6,0.1)]' 
        : 'hover:bg-slate-800/50 text-slate-400 border border-transparent'
    }`}
  >
    <div className="relative shrink-0">
      <Icon size={isMobile ? 22 : 20} />
      {hasNotification && (
        <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-slate-950 animate-pulse" />
      )}
    </div>
    <span className="font-bold text-sm md:text-[13px] uppercase tracking-wider">{label}</span>
    {active && <ChevronRight size={14} className="ml-auto opacity-50" />}
  </button>
);

export default function Sidebar({ activeTab, setActiveTab, player, saveGame, isOpen, onClose }) {
  const hasUnreadMail = player.mailbox?.some(m => !m.isRead);

  return (
    <>
      {/* --- 📱 MOBILE SIDEBAR (Drawer Mode) --- */}
      <div 
        className={`md:hidden fixed inset-0 bg-slate-950/80 backdrop-blur-md z-[1000000] transition-opacity duration-300 ${
          isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        onClick={onClose}
      />

      <aside className={`md:hidden fixed inset-y-0 left-0 w-[80%] max-w-[300px] bg-slate-900 z-[1000001] shadow-[20px_0_50px_rgba(0,0,0,0.5)] border-r border-white/5 flex flex-col transition-transform duration-300 transform ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <div className="p-6 border-b border-white/5 flex items-center justify-between bg-slate-950/50">
          <div className="flex items-center gap-2">
            <ShieldAlert className="text-amber-500" size={24} />
            <h1 className="font-black text-white uppercase italic tracking-tighter">Menu</h1>
          </div>
          <button onClick={onClose} className="p-2 bg-white/5 rounded-xl text-slate-400 active:scale-90">
            <X size={20} />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto p-4 space-y-2 custom-scrollbar">
          <SidebarItem isMobile icon={Compass} label="Adventure" active={activeTab === 'TRAVEL'} onClick={() => setActiveTab('TRAVEL')} />
          <SidebarItem isMobile icon={User} label="Character" active={activeTab === 'CHARACTER'} onClick={() => setActiveTab('CHARACTER')} />
          <SidebarItem isMobile icon={Package} label="Inventory" active={activeTab === 'INVENTORY'} onClick={() => setActiveTab('INVENTORY')} />
          <SidebarItem isMobile icon={Hammer} label="Blacksmith" active={activeTab === 'CRAFT'} onClick={() => setActiveTab('CRAFT')} />
          <SidebarItem isMobile icon={Library} label="Bestiary" active={activeTab === 'COLLECTION'} onClick={() => setActiveTab('COLLECTION')} />
          <SidebarItem isMobile icon={BookMarked} label="Passive Skills" active={activeTab === 'PASSIVESKILL'} onClick={() => setActiveTab('PASSIVESKILL')} />
          <SidebarItem isMobile icon={ShoppingBag} label="Marketplace" active={activeTab === 'MARKET'} onClick={() => setActiveTab('MARKET')} />
          <SidebarItem isMobile icon={Mail} label="Mailbox" active={activeTab === 'MAIL'} onClick={() => setActiveTab('MAIL')} hasNotification={hasUnreadMail} />
        </nav>

        <div className="p-6 border-t border-white/5 bg-slate-950/50">
          <button 
            onClick={() => { saveGame(); onClose(); }}
            className="w-full bg-emerald-500 text-slate-950 py-4 rounded-2xl flex items-center justify-center gap-2 font-black uppercase text-xs tracking-widest active:scale-95 transition-all shadow-lg shadow-emerald-500/20"
          >
            <Save size={18} />
            Force Cloud Save
          </button>
        </div>
      </aside>

      {/* --- 💻 DESKTOP SIDEBAR --- */}
      <aside className="hidden md:flex w-64 bg-slate-950 border-r border-slate-800 p-6 flex-col justify-between h-screen transition-all sticky top-0">
        <div className="flex flex-col">
          <div className="flex items-center gap-2 mb-10 px-2">
            <ShieldAlert className="text-amber-500" size={28} />
            <h1 className="text-xl font-black text-white uppercase italic tracking-tighter">Infinite Steps</h1>
          </div>
          
          <nav className="flex flex-col space-y-2">
            <SidebarItem icon={Compass} label="Adventure" active={activeTab === 'TRAVEL'} onClick={() => setActiveTab('TRAVEL')} />
            <SidebarItem icon={User} label="Character" active={activeTab === 'CHARACTER'} onClick={() => setActiveTab('CHARACTER')} />
            <SidebarItem icon={Package} label="Inventory" active={activeTab === 'INVENTORY'} onClick={() => setActiveTab('INVENTORY')} />
            <SidebarItem icon={Hammer} label="Blacksmith" active={activeTab === 'CRAFT'} onClick={() => setActiveTab('CRAFT')} />
            <SidebarItem icon={Library} label="Bestiary" active={activeTab === 'COLLECTION'} onClick={() => setActiveTab('COLLECTION')} />
            <SidebarItem icon={BookMarked} label="Passive Skills" active={activeTab === 'PASSIVESKILL'} onClick={() => setActiveTab('PASSIVESKILL')} />
            <SidebarItem icon={ShoppingBag} label="Marketplace" active={activeTab === 'MARKET'} onClick={() => setActiveTab('MARKET')} />
            <SidebarItem 
              icon={Mail} 
              label="Mailbox" 
              active={activeTab === 'MAIL'} 
              onClick={() => setActiveTab('MAIL')} 
              hasNotification={hasUnreadMail}
            />
          </nav>
        </div>
      </aside>
    </>
  );
}