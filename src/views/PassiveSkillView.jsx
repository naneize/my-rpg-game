import React, { useState, useMemo } from 'react'; 
import { MONSTER_SKILLS } from '../data/passive'; 
import { PLAYER_SKILLS } from '../data/playerSkills'; 
import { 
  Sword, Shield, Lock, Heart, Activity, Flame, Cpu, X, Plus, Zap, 
  Target, ShieldAlert, Sparkles, BarChart3, Droplets, Leaf, 
  Wind, Mountain, Sun, Moon, Skull, CheckCircle2
} from 'lucide-react';

const PassiveSkillView = ({ player, setPlayer }) => {
  const [activeTab, setActiveTab] = useState('PASSIVE'); 
  const [selectedId, setSelectedId] = useState(null);
  const [showIntel, setShowIntel] = useState(false);
  const [activeFilter, setActiveFilter] = useState('ALL'); 

  // ✅ มั่นใจว่าดึงข้อมูล Arrays มาจาก player แน่นอน
  const unlockedPassives = player?.unlockedPassives || [];
  const unlockedActives = player?.unlockedActives || []; 
  const equippedPassives = player?.equippedPassives || [null, null, null];
  const equippedActives = player?.equippedActives || [null, null];

  // ✅ 1. Hybrid Calculation System
  const stats = useMemo(() => {
    const p = {
      atk: 0, def: 0, hp: 0,
      pen: 0, skill: 0, reflect: 0, crit: 0,
      fire: 0, water: 0, earth: 0, wind: 0, light: 0, dark: 0, poison: 0
    };

    // A. Permanent Link (Monster Cards)
    unlockedPassives.forEach(id => {
      const s = MONSTER_SKILLS.find(item => item.id === id);
      if (s) {
        p.pen += (s.armorPen || 0);
        p.reflect += (s.reflectDamage || 0); 
        p.crit += (s.critRate || 0);
        const el = s.element?.toUpperCase();
        if (p.hasOwnProperty(el?.toLowerCase())) p[el.toLowerCase()] += (s.elementPower || 5);
      }
    });

    // B. Neural Sync: Monster Essence
    equippedPassives.forEach(id => {
      const s = MONSTER_SKILLS.find(item => item.id === id);
      if (s) {
        p.atk += (s.bonusAtk || 0); 
        p.def += (s.bonusDef || 0); 
        p.hp += (s.bonusMaxHp || 0);
      }
    });

    // C. Neural Sync: Active Skills (Strike & Assist)
    equippedActives.forEach(id => {
      const s = PLAYER_SKILLS[id];
      if (s) {
        p.atk += (s.passiveAtkBonus || 0);
        p.def += (s.passiveDefBonus || 0);
        p.hp += (s.passiveMaxHpBonus || 0);
        p.reflect += (s.passiveReflect || 0);
        p.crit += (s.passiveCritRate || 0);
        p.pen += (s.passivePenBonus || 0);
        
        const el = s.element?.toUpperCase();
        if (p.hasOwnProperty(el?.toLowerCase())) p[el.toLowerCase()] += (s.elementPower || 10);
      }
    });
    return p;
  }, [equippedPassives, unlockedPassives, equippedActives]);

  const hasSpecialAbility = (skill) => {
    return skill && (skill.reflectDamage > 0 || skill.armorPen > 0 || skill.elementPower > 0 || skill.critRate > 0);
  };

  const filteredLibrary = useMemo(() => {
    if (activeTab === 'PASSIVE') return MONSTER_SKILLS;
    const skills = Object.values(PLAYER_SKILLS);
    if (activeFilter === 'ATK') return skills.filter(s => s.type === 'ATTACK');
    if (activeFilter === 'SUPPORT') return skills.filter(s => s.type === 'HEAL' || s.type === 'SUPPORT');
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
        const slot = (skillData.type === 'HEAL' || skillData.type === 'SUPPORT') ? 1 : 0;
        next[slot] = skillId;
        return { ...prev, equippedActives: next };
      }
      return prev;
    });
    setSelectedId(null);
  };

  const currentSelection = activeTab === 'PASSIVE' ? MONSTER_SKILLS.find(s => s.id === selectedId) : PLAYER_SKILLS[selectedId];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 flex flex-col relative overflow-hidden font-sans select-none">
      
      {/* 📊 TOP MONITOR */}
      <div className="sticky top-0 z-40 bg-slate-900/90 backdrop-blur-xl border-b border-white/5 p-4 flex justify-between items-center shadow-2xl">
        <div className="flex gap-4">
          <HeaderStat label="ATK" val={stats.atk} color="text-red-500" />
          <HeaderStat label="DEF" val={stats.def} color="text-blue-500" />
          <HeaderStat label="VIT" val={stats.hp} color="text-emerald-500" />
        </div>
        
        <button onClick={() => setShowIntel(true)} className="bg-blue-600/20 text-blue-400 p-2.5 rounded-xl border border-blue-500/30 active:scale-95 flex items-center gap-2 transition-all">
          <BarChart3 size={18} />
          <span className="text-[10px] font-black uppercase tracking-widest hidden sm:block">Link_Intel</span>
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 md:p-8 pb-32 space-y-8">
        {/* 🕹️ SLOT SECTION */}
        <section className="max-w-xl mx-auto space-y-4">
          <h2 className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-600 text-center">Neural Synchronization</h2>
          <div className="grid grid-cols-5 gap-2 sm:gap-4">
            {equippedPassives.map((id, i) => (
              <SlotCircle key={i} skill={MONSTER_SKILLS.find(s => s.id === id)} color="orange" label="ESSENCE" onClick={() => id && setSelectedId(id)} />
            ))}
            <SlotCircle skill={PLAYER_SKILLS[equippedActives[0]]} color="red" label="STRIKE" onClick={() => equippedActives[0] && setSelectedId(equippedActives[0])} />
            <SlotCircle skill={PLAYER_SKILLS[equippedActives[1]]} color="cyan" label="ASSIST" onClick={() => equippedActives[1] && setSelectedId(equippedActives[1])} />
          </div>
        </section>

        {/* 📑 LIBRARY SECTION */}
        <section className="max-w-3xl mx-auto bg-slate-900/40 rounded-[2.5rem] border border-white/5 p-6 shadow-inner">
          <div className="flex bg-black/40 p-1.5 rounded-2xl mb-4 border border-white/5 gap-1">
            <button onClick={() => {setActiveTab('PASSIVE'); setSelectedId(null); setActiveFilter('ALL');}}
              className={`flex-1 py-3 rounded-xl text-[10px] font-black tracking-widest transition-all ${activeTab === 'PASSIVE' ? 'bg-white/10 text-white shadow-lg border border-white/5' : 'text-slate-500 hover:text-white/50'}`}>
              PASSIVE_DRIVE
            </button>
            <button onClick={() => {setActiveTab('ACTIVE'); setSelectedId(null); setActiveFilter('ALL');}}
              className={`flex-1 py-3 rounded-xl text-[10px] font-black tracking-widest transition-all ${activeTab === 'ACTIVE' ? 'bg-white/10 text-white shadow-lg border border-white/5' : 'text-slate-500 hover:text-white/50'}`}>
              ACTIVE_DRIVE
            </button>
          </div>

          {activeTab === 'ACTIVE' && (
            <div className="flex justify-center gap-2 mb-6">
              {['ALL', 'ATK', 'SUPPORT'].map(f => (
                <button key={f} onClick={() => setActiveFilter(f)} 
                  className={`px-4 py-1.5 rounded-full text-[8px] font-black border transition-all ${activeFilter === f ? 'bg-white/10 border-white/20 text-white' : 'border-white/5 text-slate-600'}`}>
                  {f}
                </button>
              ))}
            </div>
          )}

          <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-3">
            {filteredLibrary.map((skill) => {
              // ✅ ตรวจสอบการปลดล็อคให้แม่นยำ
              const isUnlocked = activeTab === 'PASSIVE' 
                ? unlockedPassives.includes(skill.id) 
                : unlockedActives.includes(skill.id);
                
              const isEquipped = activeTab === 'PASSIVE' 
                ? equippedPassives.includes(skill.id) 
                : equippedActives.includes(skill.id);
                
              const isSpecial = activeTab === 'PASSIVE' && hasSpecialAbility(skill);

              if (!isUnlocked) return <div key={skill.id} className="aspect-square rounded-2xl bg-white/[0.02] flex items-center justify-center opacity-10 border border-white/5"><Lock size={16}/></div>;
              
              return (
                <button key={skill.id} onClick={() => setSelectedId(skill.id)} className={`relative aspect-square rounded-2xl flex items-center justify-center text-4xl transition-all active:scale-90 ${isEquipped ? 'ring-2 ring-blue-500 bg-blue-500/10 shadow-lg' : 'bg-white/[0.04] hover:bg-white/10'}`}>
                  {skill.icon}
                  {isEquipped && <div className={`absolute -top-1 -right-1 w-3 h-3 rounded-full border-2 border-slate-950 ${activeTab === 'PASSIVE' ? 'bg-orange-500' : 'bg-red-500'}`} />}
                  {isSpecial && !isEquipped && <Zap size={10} className="absolute top-1 right-1 text-orange-500 animate-pulse" />}
                </button>
              );
            })}
          </div>
        </section>
      </div>

      {/* 📢 MODAL 2: DETAIL VIEW (Fixed Mapping) */}
      {selectedId && currentSelection && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 animate-in fade-in duration-200">
          <div className="absolute inset-0 bg-slate-950/90 backdrop-blur-md" onClick={() => setSelectedId(null)} />
          <div className="relative w-full max-sm:w-full max-w-sm bg-slate-900 border border-white/10 rounded-[3rem] p-8 shadow-2xl text-center overflow-hidden">
             <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-blue-500 to-transparent" />
             <div className="text-8xl mb-4 mt-4 drop-shadow-2xl animate-bounce-slow">{currentSelection.icon}</div>
             <h3 className="text-2xl font-black text-white italic uppercase tracking-tighter mb-2">{currentSelection.name}</h3>
             
             <div className="space-y-4 mb-8 text-left bg-black/30 p-5 rounded-[2rem] border border-white/5 shadow-inner mx-2">
                {/* ⚡ Permanent Link (โชว์เฉพาะมอนสเตอร์) */}
                {activeTab === 'PASSIVE' && (
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Zap size={14} className="text-orange-500 animate-pulse" />
                      <p className="text-[10px] font-black text-orange-500 uppercase tracking-widest italic">Permanent Link</p>
                    </div>
                    <div className="pl-6 space-y-1">
                      {currentSelection.elementPower > 0 && <p className="text-xs text-slate-200">💎 {currentSelection.element} Power: <span className="text-orange-400 font-bold">+{currentSelection.elementPower} pts</span></p>}
                      {currentSelection.reflectDamage > 0 && <p className="text-xs text-slate-200">🛡️ Reflect: <span className="text-orange-400 font-bold">{(currentSelection.reflectDamage * 100).toFixed(0)}%</span></p>}
                      {currentSelection.armorPen > 0 && <p className="text-xs text-slate-200">🏹 Penetration: <span className="text-orange-400 font-bold">{(currentSelection.armorPen * 100).toFixed(0)}%</span></p>}
                      <p className="text-[9px] text-slate-500 italic mt-1">* Passive trait active upon unlock.</p>
                    </div>
                    <div className="h-px bg-white/10 mx-2 mt-2" />
                  </div>
                )}

                {/* 🧠 Neural Sync Bonus (ดึงค่าทั้งจาก Monster และ Player) */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Cpu size={14} className="text-blue-400" />
                    <p className="text-[10px] font-black text-blue-400 uppercase tracking-widest italic">Neural Sync Bonus</p>
                  </div>
                  <div className="pl-6 space-y-1">
                    {/* แสดงแต้มธาตุของ Active ที่นี่ */}
                    {activeTab === 'ACTIVE' && currentSelection.elementPower > 0 && (
                      <p className="text-xs text-slate-200">💎 {currentSelection.element} Resonance: <span className="text-blue-400 font-bold">+{currentSelection.elementPower} pts</span></p>
                    )}
                    
                    {(currentSelection.passiveAtkBonus || currentSelection.bonusAtk) > 0 && (
                      <p className="text-xs text-slate-200">⚔️ ATK Bonus: <span className="text-blue-400 font-bold">+{currentSelection.passiveAtkBonus || currentSelection.bonusAtk}</span></p>
                    )}
                    {(currentSelection.passiveDefBonus || currentSelection.bonusDef) > 0 && (
                      <p className="text-xs text-slate-200">🛡️ DEF Bonus: <span className="text-blue-400 font-bold">+{currentSelection.passiveDefBonus || currentSelection.bonusDef}</span></p>
                    )}
                    {(currentSelection.passiveMaxHpBonus || currentSelection.bonusMaxHp) > 0 && (
                      <p className="text-xs text-slate-200">❤️ HP Bonus: <span className="text-blue-400 font-bold">+{currentSelection.passiveMaxHpBonus || currentSelection.bonusMaxHp}</span></p>
                    )}
                    <p className="text-[9px] text-slate-500 italic mt-1">* Requires equipping in Sync Slot.</p>
                  </div>
                </div>
             </div>
             
             <button onClick={() => handleEquip(currentSelection.id, activeTab)}
                className={`w-full py-5 rounded-2xl font-black text-[11px] uppercase tracking-[0.3em] transition-all active:scale-95
                ${(equippedPassives.includes(currentSelection.id) || equippedActives.includes(currentSelection.id)) 
                  ? 'bg-red-500/20 text-red-500 border border-red-500/30 shadow-[0_0_20px_rgba(239,68,68,0.2)]' 
                  : 'bg-blue-600 text-white shadow-lg shadow-blue-500/30 hover:bg-blue-500'}`}>
                {(equippedPassives.includes(currentSelection.id) || equippedActives.includes(currentSelection.id)) ? 'DECOUPLE_CORE' : 'INITIALIZE_SYNC'}
             </button>
          </div>
        </div>
      )}

      {/* 📢 MODAL 1: INTEL */}
      {showIntel && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 animate-in fade-in duration-300">
          <div className="absolute inset-0 bg-slate-950/90 backdrop-blur-md" onClick={() => setShowIntel(false)} />
          <div className="relative w-full max-w-sm bg-slate-900 border border-white/10 rounded-[3rem] p-8 shadow-2xl overflow-y-auto max-h-[85vh]">
            <h2 className="text-xl font-black text-white italic mb-6 flex items-center gap-3">
              <BarChart3 className="text-blue-500" /> SYNERGY_INTEL
            </h2>
            <div className="space-y-6">
              <div className="space-y-2">
                <p className="text-[8px] font-black text-orange-500 uppercase tracking-[0.2em] italic">Permanent Links (Auto-Active)</p>
                <PerkLine icon={<Target size={14}/>} label="Penetration" val={stats.pen} color="text-orange-400" />
                <PerkLine icon={<ShieldAlert size={14}/>} label="Reflect" val={(stats.reflect * 100).toFixed(2)} // แปลงเป็น % และตัดเศษcolor="text-emerald-400" 
/>
                <PerkLine icon={<Sparkles size={14}/>} label="Crit Chance" val={stats.crit} color="text-purple-400" />
              </div>
              <div className="space-y-2">
                <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest italic">Elemental Catalyst</p>
                <PerkLine icon={<Flame size={14}/>} label="Fire" val={stats.fire} color="text-red-500" unit=" pts" />
                <PerkLine icon={<Droplets size={14}/>} label="Water" val={stats.water} color="text-blue-400" unit=" pts" />
                <PerkLine icon={<Mountain size={14}/>} label="Earth" val={stats.earth} color="text-amber-700" unit=" pts" />
                <PerkLine icon={<Wind size={14}/>} label="Wind" val={stats.wind} color="text-emerald-400" unit=" pts" />
                <PerkLine icon={<Sun size={14}/>} label="Light" val={stats.light} color="text-yellow-400" unit=" pts" />
                <PerkLine icon={<Moon size={14}/>} label="Dark" val={stats.dark} color="text-indigo-400" unit=" pts" />
                <PerkLine icon={<Skull size={14}/>} label="Poison" val={stats.poison} color="text-lime-500" unit=" pts" />
              </div>
            </div>
            <button onClick={() => setShowIntel(false)} className="w-full mt-8 py-4 bg-white/5 text-slate-400 rounded-2xl font-black text-[10px] uppercase tracking-widest border border-white/5">Close_Monitor</button>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes bounce-slow { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-10px); } }
        .animate-bounce-slow { animation: bounce-slow 3s ease-in-out infinite; }
      `}</style>
    </div>
  );
};

// --- Helper Components ---
const HeaderStat = ({ label, val, color }) => (
  <div className="flex flex-col items-center">
    <span className="text-[7px] font-black text-slate-500 uppercase tracking-widest">{label}</span>
    <span className={`text-sm font-black ${color}`}>+{val}</span>
  </div>
);

const PerkLine = ({ icon, label, val, color, unit = "%" }) => (
  <div className="flex items-center justify-between bg-white/[0.03] p-3 rounded-2xl border border-white/5">
    <div className="flex items-center gap-3">
      <span className={color}>{icon}</span>
      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tight">{label}</span>
    </div>
    <span className={`text-xs font-black ${color}`}>+{val}{unit}</span>
  </div>
);

const SlotCircle = ({ skill, color, onClick, label }) => {
  const ring = color === 'red' ? 'border-red-500/40 bg-red-500/10 shadow-red-500/10' : color === 'cyan' ? 'border-cyan-500/40 bg-cyan-500/10 shadow-cyan-500/10' : 'border-orange-500/40 bg-orange-500/10 shadow-orange-500/10';
  const dot = color === 'red' ? 'bg-red-500 shadow-red-500/50' : color === 'cyan' ? 'bg-cyan-500 shadow-cyan-500/50' : 'bg-orange-500 shadow-orange-500/50';
  return (
    <div className="flex flex-col items-center gap-2 flex-1">
      <button onClick={onClick} className={`aspect-square w-full rounded-[1.5rem] border-2 flex items-center justify-center text-3xl relative transition-all ${skill ? ring + ' scale-105 shadow-xl' : 'bg-white/5 border-dashed border-white/10 hover:bg-white/10'}`}>
        {skill ? skill.icon : <Plus size={14} className="opacity-10"/>}
        {skill && <div className={`absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full border-2 border-slate-950 ${dot} animate-pulse shadow-lg`} />}
      </button>
      <span className="text-[7px] font-black text-slate-600 uppercase tracking-tighter">{label}</span>
    </div>
  );
};

export default PassiveSkillView;