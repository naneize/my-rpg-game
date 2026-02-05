import React from 'react';
// ✅ ลบ Hammer ออกจาก Imports
import { Compass, User, Library, ShieldAlert, BookMarked, Save } from 'lucide-react';
import WorldChat from './WorldChat';

const SidebarItem = ({ icon: Icon, label, active, onClick }) => (
  <button 
    onClick={onClick}
    className={`w-full flex items-center gap-3 p-3 rounded-lg transition-all ${
      active ? 'bg-amber-600/20 text-amber-500 border border-amber-600/50' : 'hover:bg-slate-800 text-slate-400'
    }`}
  >
    <Icon size={20} />
    <span className="font-medium hidden sm:inline md:inline">{label}</span>
  </button>
);

export default function Sidebar({ activeTab, setActiveTab, player, saveGame }) {
  return (
    <aside className="w-full md:w-64 bg-slate-950 border-b md:border-r border-slate-800 p-4 md:p-6 flex flex-row md:flex-col justify-between h-auto md:h-screen transition-all">
      <div className="flex flex-row md:flex-col items-center md:items-start flex-1 md:flex-none">
        <div className="flex items-center gap-2 mb-0 md:mb-10 px-2 mr-4 md:mr-0">
          <ShieldAlert className="text-amber-500" size={28} />
          <h1 className="text-lg md:text-xl font-black text-white uppercase italic hidden xs:block sm:block md:block">Infinite Steps</h1>
        </div>
        
        <nav className="flex flex-row md:flex-col space-y-0 md:space-y-2 gap-1 md:gap-0 flex-1 justify-around md:justify-start">
          <SidebarItem icon={Compass} label="ออกเดินทาง" active={activeTab === 'TRAVEL'} onClick={() => setActiveTab('TRAVEL')} />
          <SidebarItem icon={User} label="ตัวละคร" active={activeTab === 'CHARACTER'} onClick={() => setActiveTab('CHARACTER')} />
          <SidebarItem icon={Library} label="คลังแสงมอนสเตอร์" active={activeTab === 'COLLECTION'} onClick={() => setActiveTab('COLLECTION')} />
          <SidebarItem icon={BookMarked} label="ทักษะติดตัว" active={activeTab === 'PASSIVESKILL'} onClick={() => setActiveTab('PASSIVESKILL')} />
          
          {/* 🚫 ลบเมนูโรงตีเหล็ก (Workshop) ออกแล้ว */}
        </nav>
      </div>

      {/* --- World Chat (Desktop Only) --- */}
      <div className="hidden md:flex flex-col flex-1 mt-6 mb-6 overflow-hidden max-h-[40%]">
        <WorldChat player={player} />
      </div>    

      {/* --- ส่วนล่าง: ปุ่มบันทึกข้อมูล --- */}
      <div className="flex flex-row md:flex-col gap-2 ml-2 md:ml-0">
        <button 
          onClick={saveGame}
          className="bg-amber-600/10 hover:bg-amber-600/20 border border-amber-600/30 p-2 md:p-3 rounded-xl text-amber-500 flex items-center justify-center gap-2 transition-all active:scale-95 group"
          title="Quick Save"
        >
          <Save size={18} className="group-hover:scale-110 transition-transform" />
          <span className="text-[10px] md:text-xs font-black uppercase hidden md:block italic tracking-widest">Cloud Save</span>
        </button>
      </div>
    </aside>
  );
}