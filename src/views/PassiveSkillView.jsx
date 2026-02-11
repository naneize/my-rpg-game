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

  // ✅ 1. ระบบคำนวณ (คงเดิมทั้งหมด 100%)
  const stats = useMemo(() => {
    const p = {
      atk: 0, def: 0, hp: 0,
      atkP: 0, defP: 0, hpP: 0, 
      pen: 0, skill: 0, reflect: 0, crit: 0, critD: 0, 
      fire: 0, water: 0, earth: 0, wind: 0, light: 0, dark: 0, poison: 0
    };

    unlockedPassives.forEach(id => {
      const s = MONSTER_SKILLS.find(item => item.id === id);
      if (s && s.perm) {
        p.pen += (s.perm.armorPen || 0);
        p.reflect += (s.perm.reflectDamage || 0); 
        p.crit += (s.perm.critRate || 0);
        p.critD += (s.perm.critDamage || 0); 
        p.atkP += (s.perm.atkPercent || 0);
        p.defP += (s.perm.defPercent || 0);
        p.hpP += (s.perm.hpPercent || 0);
        const el = s.element?.toLowerCase();
        if (p.hasOwnProperty(el)) p[el] += (s.perm.elementPower || 0);
      }
    });

    [...equippedPassives, ...equippedActives].forEach(id => {
      const s = MONSTER_SKILLS.find(item => item.id === id) || PLAYER_SKILLS[id];
      if (!s) return;
      const data = s.sync || s; 
      p.atk += (data.atk || data.passiveAtkBonus || 0); 
      p.def += (data.def || data.passiveDefBonus || 0); 
      p.hp += (data.maxHp || data.passiveMaxHpBonus || 0);
      p.atkP += (data.atkPercent || data.passiveAtkPercent || 0);
      p.defP += (data.defPercent || data.passiveDefPercent || 0);
      p.hpP += (data.hpPercent || data.passiveMaxHpPercent || 0);
      p.crit += (data.passiveCritRate || 0);
      p.critD += (data.critDamage || 0);
    });
    return p;
  }, [equippedPassives, unlockedPassives, equippedActives]);

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
    <div className="min-h-screen bg-[#020617] text-slate-200 flex flex-col relative overflow-hidden font-mono select-none">
      
      {/* 📊 TOP MONITOR - Hard-Edge Tactical Header */}
      <div className="sticky top-0 z-50 bg-[#020617]/90 backdrop-blur-xl border-b border-white/10 p-4 flex justify-between items-center shadow-[0_4px_20px_rgba(0,0,0,0.8)]">
        <div className="flex gap-4 md:gap-8 pl-2 overflow-x-auto no-scrollbar">
          <HeaderStat label="ATK_OUTPUT" val={stats.atk} percent={stats.atkP} color="text-rose-500" icon={<Sword size={10}/>} />
          <HeaderStat label="DEF_RATING" val={stats.def} percent={stats.defP} color="text-sky-500" icon={<Shield size={10}/>} />
          <HeaderStat label="VIT_SIGNAL" val={stats.hp} percent={stats.hpP} color="text-emerald-500" icon={<Heart size={10}/>} />
        </div>
        
        <button onClick={() => setShowIntel(true)} className="bg-blue-500/10 text-blue-400 px-4 py-2 rounded-none border border-blue-500/30 hover:bg-blue-500/20 active:scale-95 flex items-center gap-2 transition-all">
          <BarChart3 size={16} />
          <span className="text-[10px] font-black uppercase tracking-widest hidden sm:block">SYNERGY_INTEL</span>
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 md:p-8 pb-40 space-y-12 custom-scrollbar relative z-10">
        <div className="fixed inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(#3b82f6 1px, transparent 0)', backgroundSize: '32px 32px' }} />

        {/* 🕹️ SLOT SECTION - Tech Matrix Slots */}
        <section className="max-w-2xl mx-auto relative">
          <div className="flex items-center justify-center gap-4 mb-8">
            <div className="h-px w-16 bg-gradient-to-r from-transparent via-slate-700 to-transparent" />
            <h2 className="text-[10px] font-black uppercase tracking-[0.5em] text-slate-500 italic">Neural_Sync_Slots</h2>
            <div className="h-px w-16 bg-gradient-to-r from-transparent via-slate-700 to-transparent" />
          </div>
          
          <div className="grid grid-cols-5 gap-3 sm:gap-6 bg-slate-900/40 p-8 rounded-none border border-white/10 backdrop-blur-md relative">
             {/* Tech Corners */}
             <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-blue-500/30" />
             <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-blue-500/30" />
             
             {equippedPassives.map((id, i) => (
               <SlotSquare key={i} skill={MONSTER_SKILLS.find(s => s.id === id)} color="orange" label="PASSIVE" onClick={() => id && setSelectedId(id)} />
             ))}
             <SlotSquare skill={PLAYER_SKILLS[equippedActives[0]]} color="red" label="STRIKE" onClick={() => equippedActives[0] && setSelectedId(equippedActives[0])} />
             <SlotSquare skill={PLAYER_SKILLS[equippedActives[1]]} color="cyan" label="ASSIST" onClick={() => equippedActives[1] && setSelectedId(equippedActives[1])} />
          </div>
        </section>

        {/* 📑 LIBRARY SECTION - Hard-Edge Grid */}
        <section className="max-w-5xl mx-auto space-y-8">
          <div className="flex flex-col sm:flex-row gap-6 justify-between items-end border-b border-white/5 pb-4">
            <div className="space-y-1">
               <p className="text-[8px] font-black text-blue-500 uppercase tracking-widest">Database_Access</p>
               <h2 className="text-xl font-black italic uppercase tracking-tighter text-white">Drive_Library</h2>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
               <div className="flex bg-slate-900 border border-white/10 rounded-none p-1">
                  <button onClick={() => {setActiveTab('PASSIVE'); setSelectedId(null); setActiveFilter('ALL');}}
                    className={`px-6 py-2 rounded-none text-[9px] font-black tracking-widest transition-all ${activeTab === 'PASSIVE' ? 'bg-orange-600 text-white' : 'text-slate-500 hover:text-white/40'}`}>
                    PASSIVE_CORES
                  </button>
                  <button onClick={() => {setActiveTab('ACTIVE'); setSelectedId(null); setActiveFilter('ALL');}}
                    className={`px-6 py-2 rounded-none text-[9px] font-black tracking-widest transition-all ${activeTab === 'ACTIVE' ? 'bg-blue-600 text-white' : 'text-slate-500 hover:text-white/40'}`}>
                    ACTIVE_DRIVES
                  </button>
               </div>

               {activeTab === 'ACTIVE' && (
                  <div className="flex gap-1 bg-black/40 p-1 border border-white/5">
                      {['ALL', 'ATTACK', 'SUPPORT'].map(f => (
                          <button key={f} onClick={() => setActiveFilter(f)}
                            className={`px-3 py-1 text-[8px] font-black tracking-tighter transition-all ${activeFilter === f ? 'bg-white/10 text-white' : 'text-slate-600'}`}>
                              {f}
                          </button>
                      ))}
                  </div>
               )}
            </div>
          </div>

          <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10 gap-2">
            {filteredLibrary.map((skill) => {
              const isUnlocked = activeTab === 'PASSIVE' ? unlockedPassives.includes(skill.id) : unlockedActives.includes(skill.id);
              const isEquipped = activeTab === 'PASSIVE' ? equippedPassives.includes(skill.id) : equippedActives.includes(skill.id);
              
              if (!isUnlocked) return (
                <div key={skill.id} className="aspect-square rounded-none bg-slate-900/40 flex items-center justify-center opacity-20 border border-white/5">
                    <Lock size={14} className="text-slate-500"/>
                </div>
              );
              
              return (
                <button key={skill.id} onClick={() => setSelectedId(skill.id)} 
                  className={`group relative aspect-square rounded-none flex items-center justify-center text-3xl transition-all active:scale-95 border
                  ${isEquipped 
                    ? (activeTab === 'PASSIVE' ? 'border-orange-500 bg-orange-500/10 shadow-[0_0_15px_rgba(249,115,22,0.2)]' : 'border-blue-500 bg-blue-500/10 shadow-[0_0_15px_rgba(37,99,235,0.2)]') 
                    : 'bg-slate-800/40 border-white/5 hover:border-white/20'}`}>
                  <span className="group-hover:scale-110 transition-transform duration-300 drop-shadow-md">{skill.icon}</span>
                  {isEquipped && (
                    <div className={`absolute top-0 right-0 w-3 h-3 flex items-center justify-center rounded-none
                        ${activeTab === 'PASSIVE' ? 'bg-orange-500' : 'bg-blue-500'}`}>
                        <CheckCircle2 size={8} className="text-[#020617]" />
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </section>
      </div>

      {/* 📢 MODAL: DETAIL VIEW - Tactical Research Window */}
      {selectedId && currentSelection && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
          <div className="absolute inset-0 bg-slate-950/95 backdrop-blur-sm" onClick={() => setSelectedId(null)} />
          <div className="relative w-full max-w-sm bg-slate-900 border-2 border-white/10 rounded-none p-1 shadow-2xl text-center overflow-hidden animate-in zoom-in-95">
             {/* Tech Frame Decoration */}
             <div className="absolute top-0 left-0 w-10 h-10 border-t-2 border-l-2 border-blue-500" />
             <div className="absolute bottom-0 right-0 w-10 h-10 border-b-2 border-r-2 border-blue-500" />
             
             <div className="bg-slate-950 p-8 pt-10">
                <div className="text-8xl mb-6 relative inline-block">
                    <div className="absolute inset-0 blur-3xl opacity-20 bg-blue-500" />
                    <span className="relative z-10 block animate-bounce-slow">{currentSelection.icon}</span>
                </div>
                
                <h3 className="text-3xl font-black text-white italic uppercase tracking-tighter mb-1">{currentSelection.name}</h3>
                <p className="text-[10px] text-blue-500 font-bold tracking-[0.4em] mb-6 uppercase">Module_Analysis</p>
                
                <div className="space-y-3 mb-10 text-left bg-black/40 p-6 border border-white/5 shadow-inner relative overflow-hidden">
                   <div className="absolute top-0 right-0 px-3 py-1 bg-white/5 text-[7px] text-slate-500 font-black uppercase">Data_Stream</div>

                   {/* Active Skill Analysis */}
                   {activeTab === 'ACTIVE' && (
                     <div className="mb-4 space-y-2 border-b border-white/10 pb-4">
                        <div className="flex items-center gap-2">
                           <Activity size={12} className="text-rose-500" />
                           <p className="text-[9px] font-black text-rose-500 uppercase tracking-widest italic">Drive_Analysis</p>
                        </div>
                        <div className="pl-5 grid grid-cols-2 gap-2">
                           <p className="text-[11px] text-slate-400">Element: <span className="text-white font-black">{currentSelection.element || 'NORMAL'}</span></p>
                           <p className="text-[11px] text-slate-400">Power: <span className="text-yellow-400 font-black">{(currentSelection.multiplier * 100).toFixed(0)}%</span></p>
                        </div>
                     </div>
                   )}

                   {/* Passive Bonus Section */}
                   <div className="space-y-4">
                      {/* Permanent Bonus */}
                      {activeTab === 'PASSIVE' && currentSelection.perm && (
                        <div className="space-y-2">
                           <p className="text-[9px] font-black text-orange-500 uppercase tracking-widest flex items-center gap-2">
                             <Zap size={10} /> Permanent_Link
                           </p>
                           <div className="pl-5 space-y-1">
                              {currentSelection.perm.elementPower > 0 && <p className="text-[11px] text-slate-300">✦ {currentSelection.element} Reso: <span className="text-orange-400 font-black">+{currentSelection.perm.elementPower}</span></p>}
                              {currentSelection.perm.reflectDamage > 0 && <p className="text-[11px] text-slate-300">✦ Reflect: <span className="text-orange-400 font-black">{(currentSelection.reflectDamage * 100).toFixed(0)}%</span></p>}
                              {currentSelection.perm.armorPen > 0 && <p className="text-[11px] text-slate-300">✦ Penetration: <span className="text-orange-400 font-black">{(currentSelection.perm.armorPen * 100).toFixed(0)}%</span></p>}
                              {currentSelection.perm.critRate > 0 && <p className="text-[11px] text-slate-300">✦ Crit_Chance: <span className="text-orange-400 font-black">{(currentSelection.perm.critRate * 100).toFixed(0)}%</span></p>}
                           </div>
                        </div>
                      )}

                      {/* Slot Required Bonus */}
                      <div className="space-y-2">
                         <p className="text-[9px] font-black text-blue-400 uppercase tracking-widest flex items-center gap-2">
                           <Cpu size={10} /> Neural_Sync_Bonus
                         </p>
                         <div className="pl-5 space-y-1">
                            {(currentSelection.sync?.atk || currentSelection.passiveAtkBonus) !== 0 && (
                              <p className="text-[11px] text-slate-300">✦ ATK_Rating: <span className="text-blue-400 font-black">+{currentSelection.sync?.atk || currentSelection.passiveAtkBonus}</span></p>
                            )}
                            {(currentSelection.sync?.atkPercent || currentSelection.passiveAtkPercent) > 0 && (
                              <p className="text-[11px] text-slate-300">✦ ATK_Mastery: <span className="text-amber-400 font-black">+{( (currentSelection.sync?.atkPercent || currentSelection.passiveAtkPercent) * 100).toFixed(0)}%</span></p>
                            )}
                            {(currentSelection.sync?.def || currentSelection.passiveDefBonus) !== 0 && (
                              <p className="text-[11px] text-slate-300">✦ DEF_Rating: <span className={`${(currentSelection.sync?.def || currentSelection.passiveDefBonus) > 0 ? 'text-blue-400' : 'text-rose-500'} font-black`}>{(currentSelection.sync?.def || currentSelection.passiveDefBonus) > 0 ? '+' : ''}{currentSelection.sync?.def || currentSelection.passiveDefBonus}</span></p>
                            )}
                            {(currentSelection.sync?.maxHp || currentSelection.passiveMaxHpBonus) > 0 && (
                              <p className="text-[11px] text-slate-300">✦ BIO_Integrity: <span className="text-emerald-400 font-black">+{currentSelection.sync?.maxHp || currentSelection.passiveMaxHpBonus}</span></p>
                            )}
                         </div>
                      </div>
                   </div>
                </div>
                
                <button onClick={() => handleEquip(currentSelection.id, activeTab)}
                  className={`w-full py-5 rounded-none font-black text-[12px] uppercase tracking-[0.3em] transition-all active:scale-95
                  ${(equippedPassives.includes(currentSelection.id) || equippedActives.includes(currentSelection.id)) 
                    ? 'bg-rose-600 text-white shadow-lg shadow-rose-900/40' 
                    : 'bg-blue-600 text-white shadow-lg shadow-blue-500/40'}`}>
                  {(equippedPassives.includes(currentSelection.id) || equippedActives.includes(currentSelection.id)) ? 'TERMINATE_SYNC' : 'INITIALIZE_SYNC'}
                </button>
             </div>
          </div>
        </div>
      )}

      {/* 📊 MODAL: INTEL - Dashboard Monitor */}
      {showIntel && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-6 backdrop-blur-md">
          <div className="absolute inset-0 bg-slate-950/90" onClick={() => setShowIntel(false)} />
          <div className="relative w-full max-w-sm bg-slate-900 border border-white/10 rounded-none p-1 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
             <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-blue-500" />
             <div className="bg-slate-950 p-8 max-h-[85vh] overflow-y-auto custom-scrollbar">
                <h2 className="text-xl font-black text-white italic mb-8 flex items-center gap-3 border-b border-white/10 pb-4">
                  <BarChart3 size={24} className="text-blue-500" /> SYNERGY_INTEL
                </h2>
                
                <div className="space-y-8">
                  <div className="space-y-3">
                    <p className="text-[9px] font-black text-orange-500 uppercase tracking-[0.3em] italic">Active_Link_Report</p>
                    <PerkBar icon={<Target size={14}/>} label="Penetration" val={(stats.pen * 100).toFixed(0)} color="text-orange-400" />
                    <PerkBar icon={<ShieldAlert size={14}/>} label="Reflect" val={(stats.reflect * 100).toFixed(0)} color="text-emerald-400" />
                    <PerkBar icon={<Sparkles size={14}/>} label="Crit_Chance" val={(stats.crit * 100).toFixed(0)} color="text-purple-400" />
                    <PerkBar icon={<Sword size={14}/>} label="Atk_Mastery" val={(stats.atkP * 100).toFixed(0)} color="text-rose-500" />
                  </div>

                  <div className="space-y-3">
                    <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest italic">Elemental_Affinity</p>
                    <div className="grid grid-cols-1 gap-2">
                        <PerkBar icon={<Flame size={14}/>} label="Fire" val={stats.fire} color="text-red-500" unit=" pts" />
                        <PerkBar icon={<Droplets size={14}/>} label="Water" val={stats.water} color="text-blue-400" unit=" pts" />
                        <PerkBar icon={<Wind size={14}/>} label="Wind" val={stats.wind} color="text-emerald-400" unit=" pts" />
                        <PerkBar icon={<Moon size={14}/>} label="Dark" val={stats.dark} color="text-indigo-400" unit=" pts" />
                    </div>
                  </div>
                </div>

                <button onClick={() => setShowIntel(false)} className="w-full mt-10 py-5 bg-white/5 border border-white/10 text-slate-500 hover:text-white rounded-none font-black text-[10px] uppercase tracking-widest transition-all">
                  EXIT_MONITOR
                </button>
             </div>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes bounce-slow { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-10px); } }
        .animate-bounce-slow { animation: bounce-slow 3s ease-in-out infinite; }
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(59, 130, 246, 0.2); }
      `}</style>
    </div>
  );
};

const HeaderStat = ({ label, val, percent, color, icon }) => {
  const isPosVal = val >= 0;
  const isPosPct = percent >= 0;
  return (
    <div className="flex flex-col shrink-0">
      <div className="flex items-center gap-1.5 mb-1">
          <span className="text-slate-600">{icon}</span>
          <span className="text-[7px] font-black text-slate-500 uppercase tracking-widest">{label}</span>
      </div>
      <div className="flex items-baseline gap-1.5 bg-black/40 px-2 py-0.5 border-l border-white/10">
        <span className={`text-[13px] font-black italic ${isPosVal ? color : 'text-red-500'}`}>
          {isPosVal ? '+' : ''}{val.toLocaleString()}
        </span>
        {percent !== 0 && (
          <span className={`text-[9px] font-black ${isPosPct ? color : 'text-red-500'} opacity-60`}>
            ({isPosPct ? '+' : ''}{(percent * 100).toFixed(0)}%)
          </span>
        )}
      </div>
    </div>
  );
};

const PerkBar = ({ icon, label, val, color, unit = "%" }) => (
  <div className="flex items-center justify-between bg-black/60 p-3 rounded-none border-l-2 border-white/5 hover:border-blue-500 transition-all group">
    <div className="flex items-center gap-3">
      <span className={`${color} group-hover:scale-110 transition-transform`}>{icon}</span>
      <span className="text-[10px] font-black text-slate-500 uppercase tracking-tighter group-hover:text-slate-300">{label}</span>
    </div>
    <span className={`text-[12px] font-black ${color}`}>+{val}{unit}</span>
  </div>
);

const SlotSquare = ({ skill, color, onClick, label }) => {
  const themes = {
    orange: 'border-orange-500/40 bg-orange-500/5 shadow-[0_0_15px_rgba(249,115,22,0.1)]',
    red: 'border-rose-500/40 bg-rose-500/5 shadow-[0_0_15px_rgba(225,29,72,0.1)]',
    cyan: 'border-sky-500/40 bg-sky-500/5 shadow-[0_0_15px_rgba(14,165,233,0.1)]'
  };
  const lights = {
    orange: 'bg-orange-500 shadow-orange-500/50',
    red: 'bg-rose-500 shadow-rose-500/50',
    cyan: 'bg-sky-500 shadow-sky-500/50'
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <button onClick={onClick} 
        className={`group aspect-square w-full rounded-none border-2 flex items-center justify-center text-4xl relative transition-all duration-300
        ${skill ? themes[color] + ' scale-105 border-solid' : 'bg-black/40 border-dashed border-white/5 hover:border-blue-500/30'}`}>
        {skill ? (
            <span className="drop-shadow-[0_0_10px_rgba(255,255,255,0.4)] transition-transform group-hover:scale-110">{skill.icon}</span>
        ) : (
            <Plus size={18} className="text-slate-800 group-hover:text-blue-500 transition-colors"/>
        )}
        {skill && <div className={`absolute -top-1 -right-1 w-2.5 h-2.5 rounded-none ${lights[color]} animate-pulse`} />}
      </button>
      <div className="flex flex-col items-center gap-0.5">
        <span className="text-[7px] font-black text-slate-600 uppercase tracking-widest leading-none">{label}</span>
        {skill && <span className="text-[9px] font-black text-white italic truncate w-14 text-center tracking-tighter">{skill.name}</span>}
      </div>
    </div>
  );
};

export default PassiveSkillView;