import React from 'react';
// ✅ นำเข้า Hammer สำหรับเมนูโรงตีเหล็ก และ Package สำหรับ Inventory
import { Compass, User, Library, ShieldAlert, BookMarked, Save, Package, Hammer, Map } from 'lucide-react';
import WorldChat from './WorldChat';

const SidebarItem = ({ icon: Icon, label, active, onClick }) => (
  <button 
    onClick={onClick}
    // ✅ ปรับแต่งให้รองรับทั้งแนวตั้ง (Desktop) และแนวนอน (Mobile)
    className={`flex-1 md:w-full flex flex-col md:flex-row items-center justify-center md:justify-start gap-1 md:gap-3 p-2 md:p-3 rounded-xl transition-all ${
      active ? 'bg-amber-600/20 text-amber-500 border border-amber-600/50' : 'hover:bg-slate-800 text-slate-400'
    }`}
  >
    <Icon size={window.innerWidth < 768 ? 18 : 20} />
    <span className="text-[9px] md:text-sm font-black md:font-medium uppercase md:capitalize tracking-tighter md:tracking-normal">
      {/* บนมือถือใช้ชื่อสั้นๆ เพื่อประหยัดพื้นที่ */}
      <span className="md:hidden">{label.length > 5 ? label.substring(0, 5) : label}</span>
      <span className="hidden md:inline">{label}</span>
    </span>
  </button>
);

export default function Sidebar({ activeTab, setActiveTab, player, saveGame }) {
  return (
    <>
      {/* --- 📱 MOBILE NAVIGATION (Bottom Bar) --- */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-slate-950/95 backdrop-blur-md border-t border-slate-800 flex justify-around items-center p-2 z-[100] h-16 shadow-[0_-10px_20px_rgba(0,0,0,0.5)]">
        <SidebarItem icon={Compass} label="เดินทาง" active={activeTab === 'TRAVEL'} onClick={() => setActiveTab('TRAVEL')} />
        <SidebarItem icon={User} label="ตัวละคร" active={activeTab === 'CHARACTER'} onClick={() => setActiveTab('CHARACTER')} />
        <SidebarItem icon={Package} label="กระเป๋า" active={activeTab === 'INVENTORY'} onClick={() => setActiveTab('INVENTORY')} />
        <SidebarItem icon={Hammer} label="ตีเหล็ก" active={activeTab === 'CRAFT'} onClick={() => setActiveTab('CRAFT')} />
        <SidebarItem icon={Library} label="คลังแสง" active={activeTab === 'COLLECTION'} onClick={() => setActiveTab('COLLECTION')} />
        
        {/* ปุ่มเซฟเวอร์ชันจิ๋วสำหรับมือถือ */}
        <button onClick={saveGame} className="flex flex-col items-center justify-center p-2 text-slate-500 active:text-amber-500">
          <Save size={18} />
          <span className="text-[8px] font-black uppercase mt-1 italic">Save</span>
        </button>
      </nav>

      {/* --- 💻 DESKTOP SIDEBAR (คงเดิม 100% แต่ซ่อนบนมือถือ) --- */}
      <aside className="hidden md:flex w-64 bg-slate-950 border-r border-slate-800 p-6 flex-col justify-between h-screen transition-all sticky top-0">
        <div className="flex flex-col">
          <div className="flex items-center gap-2 mb-10 px-2">
            <ShieldAlert className="text-amber-500" size={28} />
            <h1 className="text-xl font-black text-white uppercase italic">Infinite Steps</h1>
          </div>
          
          <nav className="flex flex-col space-y-2">
            <SidebarItem icon={Compass} label="ออกเดินทาง" active={activeTab === 'TRAVEL'} onClick={() => setActiveTab('TRAVEL')} />
            <SidebarItem icon={User} label="ตัวละคร" active={activeTab === 'CHARACTER'} onClick={() => setActiveTab('CHARACTER')} />
            <SidebarItem icon={Package} label="กระเป๋าเก็บของ" active={activeTab === 'INVENTORY'} onClick={() => setActiveTab('INVENTORY')} />
            <SidebarItem icon={Hammer} label="โรงตีเหล็ก" active={activeTab === 'CRAFT'} onClick={() => setActiveTab('CRAFT')} />
            <SidebarItem icon={Library} label="คลังแสงมอนสเตอร์" active={activeTab === 'COLLECTION'} onClick={() => setActiveTab('COLLECTION')} />
            <SidebarItem icon={BookMarked} label="ทักษะติดตัว" active={activeTab === 'PASSIVESKILL'} onClick={() => setActiveTab('PASSIVESKILL')} />
          </nav>
        </div>

        {/* --- ส่วนล่าง: ปุ่มบันทึกข้อมูล (Desktop) --- */}
        <div className="mt-auto">
          <button 
            onClick={saveGame}
            className="w-full bg-amber-600/10 hover:bg-amber-600/20 border border-amber-600/30 p-3 rounded-xl text-amber-500 flex items-center justify-center gap-2 transition-all active:scale-95 group"
            title="Quick Save"
          >
            <Save size={18} className="group-hover:scale-110 transition-transform" />
            <span className="text-xs font-black uppercase italic tracking-widest">Cloud Save</span>
          </button>
        </div>
      </aside>

      {/* ✅ CSS สำหรับซ่อน Scrollbar */}
      <style jsx>{`
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        /* เพิ่ม Padding ด้านล่างเพื่อไม่ให้เมนูบัง Content ในมือถือ */
        @media (max-width: 767px) {
          :global(body) {
            padding-bottom: 4rem;
          }
        }
      `}</style>
    </>
  );
}