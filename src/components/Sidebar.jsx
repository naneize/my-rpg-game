import React from 'react';
// ✅ นำเข้า Hammer สำหรับเมนูโรงตีเหล็ก และ Package สำหรับ Inventory
import { Compass, User, Library, ShieldAlert, BookMarked, Save, Package, Hammer } from 'lucide-react';
import WorldChat from './WorldChat';

const SidebarItem = ({ icon: Icon, label, active, onClick }) => (
  <button 
    onClick={onClick}
    // ✅ เพิ่ม flex-shrink-0 เพื่อไม่ให้ปุ่มโดนบีบในโหมดมือถือ
    className={`w-full flex-shrink-0 md:flex-shrink-1 flex items-center gap-3 p-3 rounded-lg transition-all ${
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
      <div className="flex flex-row md:flex-col items-center md:items-start flex-1 md:flex-none overflow-hidden">
        <div className="flex items-center gap-2 mb-0 md:mb-10 px-2 mr-4 md:mr-0 flex-shrink-0">
          <ShieldAlert className="text-amber-500" size={28} />
          <h1 className="text-lg md:text-xl font-black text-white uppercase italic hidden xs:block sm:block md:block">Infinite Steps</h1>
        </div>
        
        {/* ✅ ปรับ nav: 
            - เพิ่ม overflow-x-auto เพื่อให้เลื่อนซ้ายขวาได้ในมือถือ
            - ใช้ scrollbar-hide เพื่อความสวยงาม
            - เปลี่ยนจาก justify-around เป็น justify-start ในมือถือเพื่อให้ปุ่มเรียงตัวกันไปเรื่อยๆ */}
        <nav className="flex flex-row md:flex-col space-y-0 md:space-y-2 gap-1 md:gap-0 flex-1 justify-start md:justify-start overflow-x-auto md:overflow-visible no-scrollbar pb-2 md:pb-0">
          <SidebarItem icon={Compass} label="ออกเดินทาง" active={activeTab === 'TRAVEL'} onClick={() => setActiveTab('TRAVEL')} />
          <SidebarItem icon={User} label="ตัวละคร" active={activeTab === 'CHARACTER'} onClick={() => setActiveTab('CHARACTER')} />
          
          {/* ✅ เมนู กระเป๋าเก็บของ (สำหรับจัดการไอเทมและย่อย Scrap) */}
          <SidebarItem icon={Package} label="กระเป๋าเก็บของ" active={activeTab === 'INVENTORY'} onClick={() => setActiveTab('INVENTORY')} />

          {/* ✅ เพิ่มเมนู โรงตีเหล็ก (สำหรับนำ Scrap มาคราฟต์ไอเทมใหม่) */}
          <SidebarItem icon={Hammer} label="โรงตีเหล็ก" active={activeTab === 'CRAFT'} onClick={() => setActiveTab('CRAFT')} />
          
          <SidebarItem icon={Library} label="คลังแสงมอนสเตอร์" active={activeTab === 'COLLECTION'} onClick={() => setActiveTab('COLLECTION')} />
          <SidebarItem icon={BookMarked} label="ทักษะติดตัว" active={activeTab === 'PASSIVESKILL'} onClick={() => setActiveTab('PASSIVESKILL')} />
          
        </nav>
      </div>

      {/* --- World Chat (Desktop Only) --- */}
      <div className="hidden md:flex flex-col flex-1 mt-6 mb-6 overflow-hidden max-h-[40%]">
        {/* <WorldChat player={player} /> */}
      </div>    

      {/* --- ส่วนล่าง: ปุ่มบันทึกข้อมูล --- */}
      <div className="flex flex-row md:flex-col gap-2 ml-2 md:ml-0 flex-shrink-0">
        <button 
          onClick={saveGame}
          className="bg-amber-600/10 hover:bg-amber-600/20 border border-amber-600/30 p-2 md:p-3 rounded-xl text-amber-500 flex items-center justify-center gap-2 transition-all active:scale-95 group"
          title="Quick Save"
        >
          <Save size={18} className="group-hover:scale-110 transition-transform" />
          <span className="text-[10px] md:text-xs font-black uppercase hidden md:block italic tracking-widest">Cloud Save</span>
        </button>
      </div>

      {/* ✅ CSS สำหรับซ่อน Scrollbar (ถ้าไม่ได้ใช้ Tailwind plugin) */}
      <style jsx>{`
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </aside>
  );
}