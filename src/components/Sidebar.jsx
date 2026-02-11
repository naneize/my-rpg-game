import React from 'react';
import { Compass, User, Library, ShieldAlert, ShoppingBag, BookMarked, Save, Package, Hammer, Mail, X, ChevronRight, Activity } from 'lucide-react';

const SidebarItem = ({ icon: Icon, label, active, onClick, hasNotification, isMobile }) => (
  <button 
    onClick={onClick}
    className={`w-full flex items-center gap-4 p-4 rounded-none transition-all relative group ${
      active 
        ? 'bg-amber-600/10 text-amber-500 border border-amber-600/40 shadow-[inset_0_0_15px_rgba(217,119,6,0.1)]' 
        : 'hover:bg-white/5 text-slate-500 border border-transparent'
    }`}
  >
    {/* ✅ Active Indicator Side Bar */}
    {active && <div className="absolute left-0 top-0 h-full w-1 bg-amber-500" />}

    <div className="relative shrink-0">
      <Icon size={isMobile ? 22 : 20} className={active ? 'drop-shadow-[0_0_8px_rgba(245,158,11,0.5)]' : ''} />
      {hasNotification && (
        <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-red-600 rounded-none border-2 border-slate-950 animate-pulse" />
      )}
    </div>
    
    <span className={`font-black text-xs uppercase tracking-[0.2em] italic ${active ? 'text-white' : 'group-hover:text-slate-300'}`}>
      {label}
    </span>

    {active && <ChevronRight size={14} className="ml-auto opacity-50" />}
    
    {/* ✅ Corner Accent for Active Item */}
    {active && (
      <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-amber-500/50" />
    )}
  </button>
);

export default function Sidebar({ activeTab, setActiveTab, player, saveGame, isOpen, onClose }) {
  const hasUnreadMail = player.mailbox?.some(m => !m.isRead);

  const menuItems = [
    { id: 'TRAVEL', label: 'Adventure', icon: Compass },
    { id: 'CHARACTER', label: 'Character', icon: User },
    { id: 'INVENTORY', label: 'Inventory', icon: Package },
    { id: 'PASSIVESKILL', label: 'Passive Skills', icon: BookMarked },
    { id: 'CRAFT', label: 'Blacksmith', icon: Hammer },
    { id: 'COLLECTION', label: 'Bestiary', icon: Library },
    { id: 'MARKET', label: 'Marketplace', icon: ShoppingBag },
    { id: 'MAIL', label: 'Mailbox', icon: Mail, hasNotify: hasUnreadMail },
  ];

  return (
    <>
      {/* --- 📱 MOBILE SIDEBAR (Drawer Mode) --- */}
      <div 
        className={`md:hidden fixed inset-0 bg-slate-950/90 backdrop-blur-md z-[1000000] transition-opacity duration-300 ${
          isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        onClick={onClose}
      />

      <aside className={`md:hidden fixed inset-y-0 left-0 w-[85%] max-w-[300px] bg-slate-900 z-[1000001] shadow-[25px_0_50px_rgba(0,0,0,0.8)] border-r border-white/10 flex flex-col transition-transform duration-500 transform font-mono ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <div className="p-8 border-b border-white/10 flex items-center justify-between bg-black/40 relative">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-amber-500 via-transparent to-transparent opacity-50" />
          <div className="flex items-center gap-3">
            <ShieldAlert className="text-amber-500" size={26} />
            <div>
               <h1 className="font-black text-white uppercase italic tracking-tighter text-xl leading-none">COMMAND</h1>
               <p className="text-[8px] text-amber-500/50 font-black tracking-[0.4em] uppercase">Control_Center</p>
            </div>
          </div>
          <button onClick={onClose} className="p-3 bg-white/5 border border-white/10 rounded-none text-slate-400 active:scale-90 transition-all">
            <X size={20} />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto p-2 space-y-1 custom-scrollbar bg-slate-900/50">
          {menuItems.map((item) => (
            <SidebarItem 
              key={item.id}
              isMobile 
              icon={item.icon} 
              label={item.label} 
              active={activeTab === item.id} 
              onClick={() => { setActiveTab(item.id); onClose(); }} 
              hasNotification={item.hasNotify}
            />
          ))}
        </nav>

        <div className="p-8 border-t border-white/10 bg-black/40">
          <button 
            onClick={() => { saveGame(); onClose(); }}
            className="w-full bg-emerald-600 hover:bg-emerald-500 text-white py-5 rounded-none flex items-center justify-center gap-3 font-black uppercase text-[10px] tracking-[0.3em] active:scale-95 transition-all shadow-[0_10px_30px_rgba(16,185,129,0.2)] border border-emerald-400/30"
          >
            <Save size={18} />
            SYNC_TO_CLOUD
          </button>
        </div>
      </aside>

      {/* --- 💻 DESKTOP SIDEBAR --- */}
      <aside className="hidden md:flex w-64 bg-[#020617] border-r border-white/5 p-6 flex-col justify-between h-screen transition-all sticky top-0 font-mono relative z-[50]">
        <div className="flex flex-col">
          {/* Logo Section */}
          <div className="flex items-center gap-3 mb-12 px-3 relative group">
            <div className="relative">
               <ShieldAlert className="text-amber-500 group-hover:scale-110 transition-transform" size={32} />
               <div className="absolute inset-0 blur-lg bg-amber-500/20 opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
            <div>
               <h1 className="text-xl font-black text-white uppercase italic tracking-tighter leading-none">INFINITE</h1>
               <p className="text-[7px] text-slate-600 font-black tracking-[0.5em] uppercase">Step_Database</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2 mb-4 px-3 opacity-30">
             <Activity size={10} className="text-slate-500" />
             <span className="text-[8px] font-black uppercase tracking-widest text-slate-500 italic">Core_Navigation</span>
          </div>

          <nav className="flex flex-col space-y-1">
            {menuItems.map((item) => (
              <SidebarItem 
                key={item.id}
                icon={item.icon} 
                label={item.label} 
                active={activeTab === item.id} 
                onClick={() => setActiveTab(item.id)} 
                hasNotification={item.hasNotify}
              />
            ))}
          </nav>
        </div>

        {/* Desktop Save Area */}
        <div className="mt-auto px-2">
           <button 
             onClick={saveGame}
             className="w-full p-4 bg-white/5 border border-white/5 hover:border-emerald-500/50 hover:bg-emerald-500/5 text-slate-500 hover:text-emerald-500 transition-all group flex items-center justify-center gap-3"
           >
              <Save size={16} className="group-hover:animate-bounce" />
              <span className="text-[10px] font-black uppercase tracking-widest italic">Save_Sync</span>
           </button>
        </div>
      </aside>

      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar { width: 3px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255, 255, 255, 0.05); }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(255, 255, 255, 0.1); }
      `}</style>
    </>
  );
}