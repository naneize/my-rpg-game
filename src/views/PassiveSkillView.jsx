import React, { useState, useMemo } from 'react'; 
import { MONSTER_SKILLS } from '../data/passive'; 
import { PLAYER_SKILLS } from '../data/playerSkills'; 
import { 
  Sword, Shield, Lock, Heart, Activity, Flame, Cpu, X, Plus, Zap, 
  Target, ShieldAlert, Sparkles, BarChart3, Droplets, Leaf, 
  Wind, Mountain, Sun, Moon, Skull, CheckCircle2, Search, Filter
} from 'lucide-react';

const PassiveSkillView = ({ player, setPlayer }) => {
  const [activeTab, setActiveTab] = useState('PASSIVE'); 
  const [selectedId, setSelectedId] = useState(null);
  const [showIntel, setShowIntel] = useState(false);
  const [activeFilter, setActiveFilter] = useState('ALL'); 

  const unlockedPassives = player?.unlockedPassives || [];
  const unlockedActives = player?.unlockedActives || []; 
  const equippedPassives = player?.equippedPassives || [null, null, null];
  const equippedActives = player?.equippedActives || [null, null];

  // ✅ 1. ระบบคำนวณ (คงเดิมทั้งหมด)
  const stats = useMemo(() => {
    const p = {
      atk: 0, def: 0, hp: 0,
      atkP: 0, defP: 0, hpP: 0, // 🆕 เพิ่มตัวแปรเก็บ %
      pen: 0, skill: 0, reflect: 0, crit: 0, critD: 0, // 🆕 เพิ่ม critDamage
      fire: 0, water: 0, earth: 0, wind: 0, light: 0, dark: 0, poison: 0
    };

    // 1. คำนวณ Permanent Links (Passive ที่ปลดล็อกแล้ว)
    unlockedPassives.forEach(id => {
      const s = MONSTER_SKILLS.find(item => item.id === id);
      if (s && s.perm) {
        p.pen += (s.perm.armorPen || 0);
        p.reflect += (s.perm.reflectDamage || 0); 
        p.crit += (s.perm.critRate || 0);
        p.critD += (s.perm.critDamage || 0); // 🆕
        
        // 🆕 รองรับการบวก % แบบ Permanent (ถ้ามี)
        p.atkP += (s.perm.atkPercent || 0);
        p.defP += (s.perm.defPercent || 0);
        p.hpP += (s.perm.hpPercent || 0);

        const el = s.element?.toLowerCase();
        if (p.hasOwnProperty(el)) p[el] += (s.perm.elementPower || 0);
      }
    });

    // 2. คำนวณ Neural Sync (สกิลใน Slot)
    [...equippedPassives, ...equippedActives].forEach(id => {
      // เช็คทั้งจาก MONSTER_SKILLS และ PLAYER_SKILLS
      const s = MONSTER_SKILLS.find(item => item.id === id) || PLAYER_SKILLS[id];
      if (!s) return;

      // ดึงค่าจากโครงสร้าง sync (ของ Monster) หรือโบนัสตรงๆ (ของ Player)
      const data = s.sync || s; 
      
      p.atk += (data.atk || data.passiveAtkBonus || 0); 
      p.def += (data.def || data.passiveDefBonus || 0); 
      p.hp += (data.maxHp || data.passiveMaxHpBonus || 0);

      // 🆕 รองรับโบนัส % จากการใส่ Slot
      p.atkP += (data.atkPercent || data.passiveAtkPercent || 0);
      p.defP += (data.defPercent || data.passiveDefPercent || 0);
      p.hpP += (data.hpPercent || data.passiveMaxHpPercent || 0);
      
      p.crit += (data.passiveCritRate || 0);
      p.critD += (data.critDamage || 0);
    });

    return p;
  }, [equippedPassives, unlockedPassives, equippedActives]);

  

  // ระบบกรองข้อมูล (New Filter UI Logic)
  const filteredLibrary = useMemo(() => {
    if (activeTab === 'PASSIVE') return MONSTER_SKILLS;
    const skills = Object.values(PLAYER_SKILLS);
    if (activeFilter === 'ATTACK') return skills.filter(s => s.type === 'ATTACK');
    if (activeFilter === 'SUPPORT') return skills.filter(s => s.type === 'HEAL' || s.type === 'SUPPORT' || s.type === 'BUFF');
    return skills;
  }, [activeTab, activeFilter]);

  const handleEquip = (skillId, type) => {
    setPlayer(prev => {
      if (type === 'PASSIVE') {
        let next = [...prev.equippedPassives];
        if (next.includes(skillId)) next = next.map(id => id === skillId ? null : id);
        else {
          const empty = next.indexOf(null);
          if (empty !== -1) next[empty] = skillId;
        }
        return { ...prev, equippedPassives: next };
      } 
      if (type === 'ACTIVE') {
        const skillData = PLAYER_SKILLS[skillId];
        let next = [...prev.equippedActives];
        if (next.includes(skillId)) return { ...prev, equippedActives: next.map(id => id === skillId ? null : id) };
        const slot = (skillData.type === 'HEAL' || skillData.type === 'SUPPORT' || skillData.type === 'BUFF') ? 1 : 0;
        next[slot] = skillId;
        return { ...prev, equippedActives: next };
      }
      return prev;
    });
    setSelectedId(null);
  };

  const currentSelection = activeTab === 'PASSIVE' ? MONSTER_SKILLS.find(s => s.id === selectedId) : PLAYER_SKILLS[selectedId];

  return (
    <div className="min-h-screen bg-[#020617] text-slate-200 flex flex-col relative overflow-hidden font-sans select-none">
      
      {/* 📊 TOP MONITOR - Futuristic Design */}
      <div className="sticky top-0 z-50 bg-[#020617]/80 backdrop-blur-2xl border-b border-white/10 p-4 flex justify-between items-center shadow-[0_10px_30px_rgba(0,0,0,0.5)]">
        <div className="flex gap-6 pl-2">
          <HeaderStat 
    label="ATK_POWER" 
    val={stats.atk} 
    percent={stats.atkP} 
    color="text-rose-500" 
    icon={<Sword size={10}/>} 
  />
  <HeaderStat 
    label="DEF_CORE" 
    val={stats.def} 
    percent={stats.defP} 
    color="text-sky-500" 
    icon={<Shield size={10}/>} 
  />
  <HeaderStat 
    label="VIT_SIGNAL" 
    val={stats.hp} 
    percent={stats.hpP} 
    color="text-emerald-500" 
    icon={<Heart size={10}/>} 
  />
</div>
        
        <button onClick={() => setShowIntel(true)} className="bg-blue-500/10 text-blue-400 px-4 py-2 rounded-2xl border border-blue-500/20 hover:bg-blue-500/20 active:scale-95 flex items-center gap-2 transition-all">
          <BarChart3 size={16} />
          <span className="text-[9px] font-black uppercase tracking-[0.2em] hidden sm:block">Synergy_Intel</span>
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 md:p-8 pb-32 space-y-10 custom-scrollbar">
        {/* 🕹️ SLOT SECTION */}
        <section className="max-w-2xl mx-auto">
          <div className="flex items-center justify-center gap-4 mb-6">
            <div className="h-px w-12 bg-gradient-to-r from-transparent to-slate-700" />
            <h2 className="text-[9px] font-black uppercase tracking-[0.5em] text-slate-500">Neural Sync_Slots</h2>
            <div className="h-px w-12 bg-gradient-to-l from-transparent to-slate-700" />
          </div>
          <div className="grid grid-cols-5 gap-3 sm:gap-6 bg-slate-900/20 p-6 rounded-[2.5rem] border border-white/5 backdrop-blur-sm">
            {equippedPassives.map((id, i) => (
              <SlotCircle key={i} skill={MONSTER_SKILLS.find(s => s.id === id)} color="orange" label="PASSIVE" onClick={() => id && setSelectedId(id)} />
            ))}
            <SlotCircle skill={PLAYER_SKILLS[equippedActives[0]]} color="red" label="STRIKE" onClick={() => equippedActives[0] && setSelectedId(equippedActives[0])} />
            <SlotCircle skill={PLAYER_SKILLS[equippedActives[1]]} color="cyan" label="ASSIST" onClick={() => equippedActives[1] && setSelectedId(equippedActives[1])} />
          </div>
        </section>

        {/* 📑 LIBRARY SECTION */}
        <section className="max-w-4xl mx-auto space-y-6">
          <div className="flex flex-col sm:flex-row gap-4 justify-between items-center">
             {/* Tab Switcher */}
            <div className="flex bg-slate-900/80 p-1.5 rounded-2xl border border-white/5 w-full sm:w-80">
                <button onClick={() => {setActiveTab('PASSIVE'); setSelectedId(null); setActiveFilter('ALL');}}
                className={`flex-1 py-2.5 rounded-xl text-[9px] font-black tracking-widest transition-all ${activeTab === 'PASSIVE' ? 'bg-orange-500 text-white shadow-[0_0_20px_rgba(249,115,22,0.3)]' : 'text-slate-500 hover:text-white/50'}`}>
                PASSIVE_CORES
                </button>
                <button onClick={() => {setActiveTab('ACTIVE'); setSelectedId(null); setActiveFilter('ALL');}}
                className={`flex-1 py-2.5 rounded-xl text-[9px] font-black tracking-widest transition-all ${activeTab === 'ACTIVE' ? 'bg-blue-600 text-white shadow-[0_0_20px_rgba(37,99,235,0.3)]' : 'text-slate-500 hover:text-white/50'}`}>
                ACTIVE_DRIVES
                </button>
            </div>

            {/* Sub-Filters for Active Skills */}
            {activeTab === 'ACTIVE' && (
                <div className="flex gap-2 bg-black/20 p-1 rounded-xl border border-white/5">
                    {['ALL', 'ATTACK', 'SUPPORT'].map(f => (
                        <button key={f} onClick={() => setActiveFilter(f)}
                        className={`px-4 py-1.5 rounded-lg text-[8px] font-black tracking-tighter transition-all ${activeFilter === f ? 'bg-white/10 text-white' : 'text-slate-600'}`}>
                            {f}
                        </button>
                    ))}
                </div>
            )}
          </div>

          <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10 gap-3">
            {filteredLibrary.map((skill) => {
              const isUnlocked = activeTab === 'PASSIVE' ? unlockedPassives.includes(skill.id) : unlockedActives.includes(skill.id);
              const isEquipped = activeTab === 'PASSIVE' ? equippedPassives.includes(skill.id) : equippedActives.includes(skill.id);
              
              if (!isUnlocked) return (
                <div key={skill.id} className="aspect-square rounded-2xl bg-slate-900/40 flex items-center justify-center opacity-20 border border-white/5">
                    <Lock size={14} className="text-slate-500"/>
                </div>
              );
              
              return (
                <button key={skill.id} onClick={() => setSelectedId(skill.id)} 
                  className={`group relative aspect-square rounded-2xl flex items-center justify-center text-4xl transition-all active:scale-95 
                  ${isEquipped 
                    ? (activeTab === 'PASSIVE' ? 'ring-2 ring-orange-500/50 bg-orange-500/10' : 'ring-2 ring-blue-500/50 bg-blue-500/10') 
                    : 'bg-slate-800/40 hover:bg-slate-700/60 border border-white/5'}`}>
                  <span className="group-hover:scale-110 transition-transform duration-300">{skill.icon}</span>
                  {isEquipped && (
                    <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-[#020617] flex items-center justify-center 
                        ${activeTab === 'PASSIVE' ? 'bg-orange-500' : 'bg-blue-500'}`}>
                        <CheckCircle2 size={10} className="text-white" />
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </section>
      </div>

      {/* 📢 MODAL: DETAIL VIEW (เพิ่มรายละเอียดธาตุและความแรง) */}
      {selectedId && currentSelection && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
          <div className="absolute inset-0 bg-slate-950/90 backdrop-blur-md" onClick={() => setSelectedId(null)} />
          <div className="relative w-full max-w-sm bg-slate-900 border border-white/10 rounded-[3rem] p-8 shadow-2xl text-center overflow-hidden">
             <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-blue-500 to-transparent" />
             <div className="text-8xl mb-4 mt-4 drop-shadow-2xl animate-bounce-slow">{currentSelection.icon}</div>
             <h3 className="text-2xl font-black text-white italic uppercase tracking-tighter mb-2">{currentSelection.name}</h3>
             
             <div className="space-y-4 mb-8 text-left bg-black/30 p-5 rounded-[2rem] border border-white/5 shadow-inner mx-2 relative overflow-hidden">
  
  {/* ⚔️ Action Drive Analysis (สำหรับ Active Skills เท่านั้น) */}
  {activeTab === 'ACTIVE' && (
    <div className="mb-4 space-y-2 border-b border-white/5 pb-3">
       <div className="flex items-center gap-2">
          <Activity size={14} className="text-rose-500" />
          <p className="text-[10px] font-black text-rose-500 uppercase tracking-widest italic">Action Drive Analysis</p>
       </div>
       <div className="pl-6 flex flex-wrap gap-x-4 gap-y-1">
          <p className="text-xs text-slate-200">Element: <span className={`font-bold ${currentSelection.element === 'FIRE' ? 'text-red-500' : currentSelection.element === 'WATER' ? 'text-blue-400' : 'text-slate-400'}`}>
            {currentSelection.element || 'NORMAL'}
          </span></p>
          <p className="text-xs text-slate-200">Multiplier: <span className="text-yellow-400 font-bold">
            {(currentSelection.multiplier * 100).toFixed(0)}% ATK
          </span></p>
       </div>
    </div>
  )}

  {/* 🔵 Permanent Link Zone (ไม่ต้องใส่ Slot) */}
  {activeTab === 'PASSIVE' && currentSelection.perm && (
    <div className="space-y-2 relative">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Zap size={14} className="text-orange-500 animate-pulse" />
          <p className="text-[10px] font-black text-orange-500 uppercase tracking-widest italic">Permanent Link</p>
        </div>
        <span className="text-[7px] bg-orange-500/10 text-orange-500 px-2 py-0.5 rounded-full border border-orange-500/20 font-black uppercase">Passive Always Active</span>
      </div>
      
      <div className="pl-6 space-y-1">
        {currentSelection.perm.elementPower > 0 && <p className="text-xs text-slate-200">💎 {currentSelection.element} Power: <span className="text-green-500 font-bold">+{currentSelection.perm.elementPower} pts</span></p>}
        {currentSelection.perm.reflectDamage > 0 && <p className="text-xs text-slate-200">🛡️ Reflect: <span className="text-green-500 font-bold">{(currentSelection.perm.reflectDamage * 100).toFixed(0)}%</span></p>}
        {currentSelection.perm.armorPen > 0 && <p className="text-xs text-slate-200">🏹 Penetration: <span className="text-green-500 font-bold">{(currentSelection.perm.armorPen * 100).toFixed(0)}%</span></p>}
        {currentSelection.perm.critRate > 0 && <p className="text-xs text-slate-200">✨ Crit: <span className="text-green-500 font-bold">{(currentSelection.perm.critRate * 100).toFixed(0)}%</span></p>}
      </div>
      <p className="text-[9px] text-green-500 italic pl-6 mt-1">* This bonus applies automatically once unlocked.</p>
      <div className="h-px bg-white/10 mx-2 mt-2" />
    </div>
  )}

  {/* 🟢 Neural Sync Zone (ต้องใส่ Slot) */}
  <div className="space-y-2">
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2">
        <Cpu size={14} className="text-blue-400" />
        <p className="text-[10px] font-black text-blue-400 uppercase tracking-widest italic">Neural Sync Bonus</p>
      </div>
      <span className="text-[7px] bg-blue-500/10 text-blue-400 px-2 py-0.5 rounded-full border border-blue-500/20 font-black uppercase">Slot Required</span>
    </div>

    <div className="pl-6 space-y-1">
  {activeTab === 'ACTIVE' && currentSelection.elementPower > 0 && (
    <p className="text-xs text-slate-200">💎 {currentSelection.element} Reso: <span className="text-blue-400 font-bold">+{currentSelection.elementPower} pts</span></p>
  )}

  {/* --- ⚔️ ATK Section --- */}
  {(currentSelection.sync?.atk || currentSelection.passiveAtkBonus) > 0 && (
    <p className="text-xs text-slate-200">⚔️ ATK Bonus: <span className="text-green-500 font-bold">+{currentSelection.sync?.atk || currentSelection.passiveAtkBonus}</span></p>
  )}
  {/* 🆕 เพิ่มแสดงผล ATK % */}
  {(currentSelection.sync?.atkPercent || currentSelection.passiveAtkPercent) > 0 && (
    <p className="text-xs text-slate-200">⚡ ATK Mastery: <span className="text-amber-400 font-bold">+{( (currentSelection.sync?.atkPercent || currentSelection.passiveAtkPercent) * 100).toFixed(0)}%</span></p>
  )}

  {/* --- 🛡️ DEF Section --- */}
  {/* --- 🛡️ DEF Section (ปรับปรุงให้รองรับค่าติดลบ) --- */}
{(currentSelection.sync?.def || currentSelection.passiveDefBonus) !== 0 && (
  <p className="text-xs text-slate-200">
    🛡️ DEF Bonus: 
    <span className={`font-bold ${(currentSelection.sync?.def || currentSelection.passiveDefBonus) > 0 ? 'text-green-500' : 'text-red-500'}`}>
      {/* ใส่เครื่องหมาย + เฉพาะค่าที่มากกว่า 0 */}
      {(currentSelection.sync?.def || currentSelection.passiveDefBonus) > 0 ? '+' : ''}
      {currentSelection.sync?.def || currentSelection.passiveDefBonus}
    </span>
  </p>
)}


  {/* 🆕 แก้ไข DEF % (สำหรับ Void Reaper ที่เป็น -0.10) */}
{(currentSelection.sync?.defPercent || currentSelection.passiveDefPercent) !== 0 && (
  <p className="text-xs text-slate-200">
    🛡️ DEF Mastery: 
    <span className={`font-bold ${(currentSelection.sync?.defPercent || currentSelection.passiveDefPercent) > 0 ? 'text-amber-400' : 'text-red-500'}`}>
      {(currentSelection.sync?.defPercent || currentSelection.passiveDefPercent) > 0 ? '+' : ''}
      {((currentSelection.sync?.defPercent || currentSelection.passiveDefPercent) * 100).toFixed(0)}%
    </span>
  </p>
)}



  {/* --- ❤️ HP Section --- */}
  {(currentSelection.sync?.maxHp || currentSelection.passiveMaxHpBonus) > 0 && (
    <p className="text-xs text-slate-200">❤️ HP Bonus: <span className="text-green-500 font-bold">+{currentSelection.sync?.maxHp || currentSelection.passiveMaxHpBonus}</span></p>
  )}
  {/* 🆕 เพิ่มแสดงผล HP % */}
  {(currentSelection.sync?.hpPercent || currentSelection.passiveMaxHpPercent) > 0 && (
    <p className="text-xs text-slate-200">🧬 Vitality Mastery: <span className="text-amber-400 font-bold">+{( (currentSelection.sync?.hpPercent || currentSelection.passiveMaxHpPercent) * 100).toFixed(0)}%</span></p>
  )}

  {/* --- ✨ Critical & Special Section (🆕 เพิ่มใหม่) --- */}
  {(currentSelection.sync?.critDamage || currentSelection.critDamage) > 0 && (
    <p className="text-xs text-slate-200">💥 Crit Damage: <span className="text-purple-400 font-bold">+{( (currentSelection.sync?.critDamage || currentSelection.critDamage) * 100).toFixed(0)}%</span></p>
  )}

  <p className="text-[8px] text-blue-400/60 italic mt-2 font-bold uppercase tracking-tighter">
    ⚠ Must equip in Neural Sync slot to activate these stats.
  </p>
</div>
  </div>
</div>
             
             <button onClick={() => handleEquip(currentSelection.id, activeTab)}
                className={`w-full py-5 rounded-2xl font-black text-[11px] uppercase tracking-[0.3em] transition-all active:scale-95
                ${(equippedPassives.includes(currentSelection.id) || equippedActives.includes(currentSelection.id)) 
                  ? 'bg-red-500/10 text-red-500 border border-red-500/20' 
                  : 'bg-blue-600 text-white shadow-lg shadow-blue-500/40'}`}>
                {(equippedPassives.includes(currentSelection.id) || equippedActives.includes(currentSelection.id)) ? 'DECOUPLE_CORE' : 'INITIALIZE_SYNC'}
             </button>
          </div>
        </div>
      )}

      {/* 📊 MODAL: INTEL (คงเดิมทั้งหมด) */}
      {showIntel && (
  <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 backdrop-blur-md">
    <div className="absolute inset-0 bg-slate-950/80" onClick={() => setShowIntel(false)} />
    <div className="relative w-full max-w-sm bg-slate-900 border border-white/10 rounded-[2.5rem] p-8 shadow-2xl overflow-y-auto max-h-[85vh]">
      <h2 className="text-lg font-black text-white italic mb-6 flex items-center gap-3">
        <BarChart3 size={20} className="text-blue-500" /> SYNERGY_INTEL
      </h2>
      
      <div className="space-y-6">
        {/* 🟠 ส่วน Permanent Links - แสดงค่าที่เป็น % สุทธิ */}
        {/* สรุป Permanent Link และโบนัสรวม (%) */}
<div className="space-y-2">
  <p className="text-[8px] font-black text-orange-500 uppercase tracking-[0.2em]">Active Link Analysis</p>
  
  {/* แสดงค่าที่เป็น % สุทธิจากการคำนวณ */}
  <PerkLine icon={<Target size={14}/>} label="Penetration" val={(stats.pen * 100).toFixed(0)} color="text-orange-400" />
  <PerkLine icon={<ShieldAlert size={14}/>} label="Reflect" val={(stats.reflect * 100).toFixed(0)} color="text-emerald-400" />
  <PerkLine icon={<Sparkles size={14}/>} label="Crit Chance" val={(stats.crit * 100).toFixed(0)} color="text-purple-400" />
  
  {/* 🆕 เพิ่มแสดงโบนัสพลังรวม (ATK/DEF/HP %) ในหน้า Intel */}
  {stats.atkP > 0 && <PerkLine icon={<Sword size={14}/>} label="Attack Mastery" val={(stats.atkP * 100).toFixed(0)} color="text-rose-500" />}
  {stats.hpP > 0 && <PerkLine icon={<Heart size={14}/>} label="Life Force" val={(stats.hpP * 100).toFixed(0)} color="text-emerald-500" />}
</div>

        {/* 💎 ส่วน Elemental Affinity - แสดงค่าแต้มธาตุสะสม (Element Power) */}
        <div className="space-y-2">
          <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest">Elemental Affinity</p>
          <div className="grid grid-cols-1 gap-1.5">
              <PerkLine icon={<Flame size={14}/>} label="Fire" val={stats.fire} color="text-red-500" unit=" pts" />
              <PerkLine icon={<Droplets size={14}/>} label="Water" val={stats.water} color="text-blue-400" unit=" pts" />
              <PerkLine icon={<Mountain size={14}/>} label="Earth" val={stats.earth} color="text-amber-700" unit=" pts" />
              <PerkLine icon={<Wind size={14}/>} label="Wind" val={stats.wind} color="text-emerald-400" unit=" pts" />
              <PerkLine icon={<Sun size={14}/>} label="Light" val={stats.light} color="text-yellow-400" unit=" pts" />
              <PerkLine icon={<Moon size={14}/>} label="Dark" val={stats.dark} color="text-indigo-400" unit=" pts" />
              <PerkLine icon={<Skull size={14}/>} label="Poison" val={stats.poison} color="text-lime-500" unit=" pts" />
          </div>
        </div>
      </div>

      <button onClick={() => setShowIntel(false)} className="w-full mt-8 py-4 bg-white/5 text-slate-400 rounded-xl font-black text-[9px] uppercase tracking-widest">
        Close_Monitor
      </button>
    </div>
  </div>
)}

      <style jsx>{`
        @keyframes bounce-slow { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-10px); } }
        .animate-bounce-slow { animation: bounce-slow 3s ease-in-out infinite; }
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 10px; }
      `}</style>
    </div>
  );
};

// 📍 วาง HeaderStat ไว้ตรงนี้ (ต่อท้ายไฟล์)
const HeaderStat = ({ label, val, percent, color, icon }) => {
  const isPosVal = val >= 0;
  const isPosPct = percent >= 0;

  return (
    <div className="flex flex-col">
      <div className="flex items-center gap-1">
          <span className="text-slate-600">{icon}</span>
          <span className="text-[6px] font-black text-slate-600 uppercase tracking-widest">{label}</span>
      </div>
      <div className="flex items-baseline gap-1">
        <span className={`text-xs font-black ${isPosVal ? color : 'text-red-500'}`}>
          {isPosVal ? '+' : ''}{val.toLocaleString()}
        </span>
        
        {percent !== 0 && (
          <span className={`text-[8px] font-black ${isPosPct ? color : 'text-red-500'} opacity-70`}>
            ({isPosPct ? '+' : ''}{(percent * 100).toFixed(0)}%)
          </span>
        )}
      </div>
    </div>
  );
};

const PerkLine = ({ icon, label, val, color, unit = "%" }) => (
  <div className="flex items-center justify-between bg-black/40 p-2.5 rounded-xl border border-white/5">
    <div className="flex items-center gap-2">
      <span className={color}>{icon}</span>
      <span className="text-[9px] font-bold text-slate-500 uppercase tracking-tight">{label}</span>
    </div>
    <span className={`text-[10px] font-black ${color}`}>+{val}{unit}</span>
  </div>
);

const SlotCircle = ({ skill, color, onClick, label }) => {
  const themes = {
    orange: 'border-orange-500/40 bg-orange-500/5 shadow-orange-500/10',
    red: 'border-rose-500/40 bg-rose-500/5 shadow-rose-500/10',
    cyan: 'border-sky-500/40 bg-sky-500/5 shadow-sky-500/10'
  };
  const dots = {
    orange: 'bg-orange-500 shadow-orange-500/50',
    red: 'bg-rose-500 shadow-rose-500/50',
    cyan: 'bg-sky-500 shadow-sky-500/50'
  };

  return (
    <div className="flex flex-col items-center gap-3">
      <button onClick={onClick} 
        className={`group aspect-square w-full rounded-2xl border-2 flex items-center justify-center text-4xl relative transition-all duration-300
        ${skill ? themes[color] + ' scale-105 shadow-xl border-solid' : 'bg-white/[0.02] border-dashed border-white/10 hover:border-white/20'}`}>
        {skill ? (
            <span className="drop-shadow-[0_0_10px_rgba(255,255,255,0.3)]">{skill.icon}</span>
        ) : (
            <Plus size={16} className="text-slate-700 group-hover:text-slate-400 transition-colors"/>
        )}
        {skill && <div className={`absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full border-2 border-[#0f172a] ${dots[color]} animate-pulse`} />}
      </button>
      <div className="flex flex-col items-center">
        <span className="text-[6px] font-black text-slate-600 uppercase tracking-widest">{label}</span>
        {skill && <span className="text-[8px] font-bold text-white/40 truncate w-12 text-center">{skill.name}</span>}
      </div>
    </div>
  );
};

export default PassiveSkillView;

