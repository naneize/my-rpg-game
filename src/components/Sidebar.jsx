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
    {/* ในมือถือที่จอแคบมาก ๆ จะซ่อนตัวหนังสือไว้ เหลือแต่ไอคอนเพื่อให้ไม่เบียดค่ะ */}
    <span className="font-medium hidden sm:inline md:inline">{label}</span>
  </button>
);

export default function Sidebar({ activeTab, setActiveTab, gold }) {
  return (
    /* แก้ไข aside: 
       - จอปกติ (มือถือ): ใช้ flex-row, ความสูง h-auto (ตามเนื้อหา), กว้างเต็มจอ w-full
       - จอคอม (md:): กลับเป็น flex-col, h-screen, w-64 เหมือนเดิม 100% */
    <aside className="w-full md:w-64 bg-slate-950 border-b md:border-r border-slate-800 p-4 md:p-6 flex flex-row md:flex-col justify-between h-auto md:h-screen transition-all">
      <div className="flex flex-row md:flex-col items-center md:items-start flex-1 md:flex-none">
        <div className="flex items-center gap-2 mb-0 md:mb-10 px-2 mr-4 md:mr-0">
          <ShieldAlert className="text-amber-500" size={28} />
          {/* ซ่อนชื่อเกมในมือถือถ้าจอเล็กจัด ๆ เพื่อประหยัดพื้นที่ */}
          <h1 className="text-lg md:text-xl font-black text-white uppercase italic hidden xs:block sm:block md:block">Infinite Steps</h1>
        </div>
        
        {/* ปรับ nav ให้เรียงแนวนอนในมือถือ และแนวตั้งในจอคอม */}
        <nav className="flex flex-row md:flex-col space-y-0 md:space-y-2 gap-1 md:gap-0 flex-1 justify-around md:justify-start">
          <SidebarItem icon={Compass} label="ออกเดินทาง" active={activeTab === 'TRAVEL'} onClick={() => setActiveTab('TRAVEL')} />

          <SidebarItem icon={User} label="ตัวละคร" active={activeTab === 'CHARACTER'} onClick={() => setActiveTab('CHARACTER')} />
          
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

      {/* ส่วน Gold: ในมือถือจะทำให้กะทัดรัดขึ้น */}
      <div className="bg-slate-900/50 p-2 md:p-4 rounded-xl border border-slate-800 text-amber-500 flex items-center justify-between ml-2 md:ml-0 min-w-[80px] md:min-w-0">
        <span className="text-[10px] md:text-xs font-bold uppercase hidden md:block">Gold</span>
        <div className="flex items-center gap-1">
          <Coins size={16} />
          <span className="font-mono text-sm md:text-base">{gold.toLocaleString()}</span>
        </div>
      </div>
    </aside>
  );
}