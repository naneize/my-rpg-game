import React from 'react';
// ✅ เปลี่ยน Collection เป็น Library หรือกล่องสมบัติเพื่อให้เข้ากับธีมสะสม
import { Compass, User, Library, ShieldAlert, Coins, BookMarked } from 'lucide-react';

const SidebarItem = ({ icon: Icon, label, active, onClick }) => (
  <button 
    onClick={onClick}
    className={`w-full flex items-center gap-3 p-3 rounded-lg transition-all ${
      active ? 'bg-amber-600/20 text-amber-500 border border-amber-600/50' : 'hover:bg-slate-800 text-slate-400'
    }`}
  >
    <Icon size={20} />
    <span className="font-medium">{label}</span>
  </button>
);

export default function Sidebar({ activeTab, setActiveTab, gold }) {
  return (
    <aside className="w-64 bg-slate-950 border-r border-slate-800 p-6 flex flex-col justify-between h-screen">
      <div>
        <div className="flex items-center gap-2 mb-10 px-2">
          <ShieldAlert className="text-amber-500" size={28} />
          <h1 className="text-xl font-black text-white uppercase italic">Infinite Steps</h1>
        </div>
        <nav className="space-y-2">
          <SidebarItem icon={Compass} label="ออกเดินทาง" active={activeTab === 'TRAVEL'} onClick={() => setActiveTab('TRAVEL')} />

          <SidebarItem icon={User} label="ตัวละคร" active={activeTab === 'CHARACTER'} onClick={() => setActiveTab('CHARACTER')} />
          
          {/* ✅ เปลี่ยน label เป็น "ของสะสม" และเปลี่ยน onClick เป็น COLLECTION */}
          <SidebarItem 
            icon={Library} 
            label="ของสะสม" 
            active={activeTab === 'COLLECTION'} 
            onClick={() => setActiveTab('COLLECTION')} 
          />

          <SidebarItem
          icon={BookMarked}
          label='ทักษะติดตัว'
          active={activeTab === 'PASSIVESKILL'}
          onClick={() => setActiveTab('PASSIVESKILL')}
          />

        </nav>
      </div>
      <div className="bg-slate-900/50 p-4 rounded-xl border border-slate-800 text-amber-500 flex items-center justify-between">
        <span className="text-xs font-bold uppercase">Gold</span>
        <div className="flex items-center gap-1">
          <Coins size={16} />
          <span className="font-mono">{gold.toLocaleString()}</span>
        </div>
      </div>
    </aside>
  );
}