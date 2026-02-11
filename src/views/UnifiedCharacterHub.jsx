import React, { useState, useMemo } from 'react';
import { 
  Sword, Shield, Heart, Package, Lock, Check, X, ShieldCheck, Zap, Target, 
  Flame, Cpu, Activity, Search, Sparkles, Plus, BarChart3, Droplets, 
  Mountain, Wind, Sun, Moon, Skull, ChevronRight, Recycle, Gift, Trash2,
  Database, Info , AlertTriangle
} from 'lucide-react';


import { MONSTER_SKILLS } from '../data/passive'; 
import { PLAYER_SKILLS } from '../data/playerSkills'; 
import { getFullItemInfo, salvageItem } from '../utils/inventoryUtils';
import { calculateFinalStats } from '../utils/statCalculations';

export default function UnifiedCharacterHub({ player, setPlayer, setLogs, wrapItemAsCode }) {

  const [activeFilter, setActiveFilter] = useState('ALL');
  const [activeTab, setActiveTab] = useState('GEAR');
  const [showIntel, setShowIntel] = useState(false);
  const [selectorConfig, setSelectorConfig] = useState(null); 
  const [viewingItem, setViewingItem] = useState(null); 
  const [viewingSkill, setViewingSkill] = useState(null); 
  const [actionConfirm, setActionConfirm] = useState(null);

  const ELEMENT_CONFIG = {
    fire: { label: 'FIRE', icon: <Flame size={12}/>, color: 'text-red-500' },
    water: { label: 'WATER', icon: <Droplets size={12}/>, color: 'text-blue-500' },
    earth: { label: 'EARTH', icon: <Mountain size={12}/>, color: 'text-orange-900' },
    wind: { label: 'WIND', icon: <Wind size={12}/>, color: 'text-emerald-500' },
    light: { label: 'LIGHT', icon: <Sun size={12}/>, color: 'text-yellow-400' },
    dark: { label: 'DARK', icon: <Moon size={12}/>, color: 'text-purple-500' },
    poison: { label: 'POISON', icon: <Skull size={12}/>, color: 'text-lime-500' }
  };

  const finalStats = useMemo(() => {
    const enrichedEquipment = {};
    if (player.equipment) {
      Object.keys(player.equipment).forEach(slot => {
        const raw = player.equipment[slot];
        enrichedEquipment[slot] = raw ? getFullItemInfo(raw) : null;
      });
    }

    const skillStats = { 
      atk: 0, def: 0, hp: 0, atkP: 0, defP: 0, hpP: 0, pen: 0, crit: 0, critD: 0, reflect: 0,
      fire: 0, water: 0, earth: 0, wind: 0, light: 0, dark: 0, poison: 0 
    };

    (player.unlockedPassives || []).forEach(id => {
       const s = MONSTER_SKILLS.find(item => item.id === id);
       if (s?.perm) {
         const el = s.element?.toLowerCase();
         if (skillStats.hasOwnProperty(el)) skillStats[el] += (s.perm.elementPower || 0);
         skillStats.reflect += (s.perm.reflectDamage || 0);
       }
    });

    const equippedPassives = (player.equippedPassives || []).filter(Boolean);
    const equippedActives = (player.equippedActives || []).filter(Boolean);

    [...equippedPassives, ...equippedActives].forEach(id => {
      const s = MONSTER_SKILLS.find(item => item.id === id) || PLAYER_SKILLS[id];
      if (!s) return;
      const data = s.sync || s;
      
      skillStats.atk += (data.atk || data.passiveAtkBonus || 0);
      skillStats.atkP += (data.atkPercent || data.passiveAtkPercent || 0);
      skillStats.pen += (data.pen || data.armorPen || 0);
      skillStats.reflect += (data.reflectDamage || 0);
      skillStats.crit += (data.passiveCritRate || 0);
      
      const el = (s.element || data.element)?.toLowerCase();
      if (skillStats.hasOwnProperty(el)) skillStats[el] += (data.elementPower || 0);
    });

    return calculateFinalStats({ 
      ...player, 
      equipment: enrichedEquipment,
      atk: (player.atk || 0) + skillStats.atk,
      critRate: (player.critRate || 0) + skillStats.crit,
      pen: (player.pen || 0) + skillStats.pen,
      reflectDamage: (player.reflectDamage || 0) + skillStats.reflect,
      fire: (player.fire || 0) + skillStats.fire,
      water: (player.water || 0) + skillStats.water,
      earth: (player.earth || 0) + skillStats.earth,
      wind: (player.wind || 0) + skillStats.wind,
      light: (player.light || 0) + skillStats.light,
      dark: (player.dark || 0) + skillStats.dark,
      poison: (player.poison || 0) + skillStats.poison
    });
  }, [player]);

  const handleEquipItem = (itemInstance) => {
    setPlayer(prev => ({
      ...prev,
      equipment: { ...prev.equipment, [selectorConfig.slot.toLowerCase()]: itemInstance }
    }));
    setSelectorConfig(null);
  };

  const handleUnequipItem = (slot) => {
    setPlayer(prev => ({
      ...prev,
      equipment: { ...prev.equipment, [slot.toLowerCase()]: null }
    }));
    setSelectorConfig(null);
  };

  const handleEquipSkill = (skillId) => {
    setPlayer(prev => {
      const typeKey = selectorConfig.type === 'PASSIVE' ? 'equippedPassives' : 'equippedActives';
      const next = [...(prev[typeKey] || [])];
      next[selectorConfig.index] = skillId;
      return { ...prev, [typeKey]: next };
    });
    setSelectorConfig(null);
  };

  const handleUnequipSkill = (skillId, type) => {
    setPlayer(prev => {
      if (type === 'PASSIVE') {
        return {
          ...prev,
          equippedPassives: (prev.equippedPassives || []).map(id => id === skillId ? null : id)
        };
      } else {
        return {
          ...prev,
          equippedActives: (prev.equippedActives || []).map(id => id === skillId ? null : id)
        };
      }
    });
    setViewingSkill(null);
  };

  const handleSalvage = (item) => {
    setActionConfirm(item);
  };

  const executeSalvage = () => {
    if (actionConfirm) {
      salvageItem(actionConfirm, setPlayer, setLogs);
      setActionConfirm(null);
      setViewingItem(null);
    }
  };

  const MaterialChip = ({ label, val, color, icon }) => (
    <div className="flex flex-col items-start bg-slate-900/50 px-2 py-1 border border-white/10 rounded-sm min-w-[70px] md:min-w-[85px] shadow-sm shrink-0">
      <span className="text-[5.5px] md:text-[6.5px] font-black text-slate-500 uppercase tracking-widest mb-0.5 italic">
        {label}
      </span>
      <div className="flex items-center gap-1">
        <span className={`${color} opacity-90`}>{icon}</span>
        <span className={`text-[9px] md:text-[11px] font-black italic tracking-tighter ${color}`}>
          {val.toLocaleString()}
        </span>
      </div>
    </div>
  );
  

  return (
    <div className="flex flex-col h-full bg-[#020617] text-slate-200 font-mono relative overflow-hidden w-full">
      
      {/* HEADER - Responsive Adjusted */}
      <div className="shrink-0 bg-slate-950/90 backdrop-blur-md border-b border-blue-500/20 p-2 md:p-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-3 z-50 shadow-xl">
        <div className="flex gap-4 md:gap-8 overflow-x-auto no-scrollbar w-full md:w-auto">
          <StatMonitor label="ATK" val={finalStats.finalAtk || 0} color="text-rose-500" icon={<Sword size={12}/>} />
          <StatMonitor label="DEF" val={finalStats.finalDef || 0} color="text-sky-500" icon={<Shield size={12}/>} />
          <StatMonitor label="BIO" val={finalStats.finalMaxHp || 0} color="text-emerald-500" icon={<Activity size={12}/>} />
        </div>
        <div className="flex items-center justify-between w-full md:w-auto gap-2 md:gap-3 shrink-0">
          <div className="flex gap-1.5 md:gap-2.5 items-center overflow-x-auto no-scrollbar"> 
            <MaterialChip label="NANO" val={player.scrap || 0} color="text-slate-400" icon={<Recycle size={10} />} />
            <MaterialChip label="FLUX" val={player.shard || 0} color="text-blue-400" icon={<Zap size={10} />} />
            <MaterialChip label="VOID" val={player.dust || 0} color="text-purple-400" icon={<Sparkles size={10} />} />
          </div>
          <button onClick={() => setShowIntel(true)} className="p-2 bg-blue-500/10 border border-blue-500/30 text-blue-400 active:scale-95 shadow-inner shrink-0">
            <BarChart3 size={18} />
          </button>
        </div>
      </div>

      <div className="shrink-0 flex border-b border-white/5 bg-slate-900/20">
        <button onClick={() => { setActiveTab('GEAR'); setActiveFilter('ALL'); }} 
          className={`flex-1 py-3 text-[9px] md:text-[10px] font-black tracking-[0.2em] md:tracking-[0.3em] transition-all ${activeTab === 'GEAR' ? 'bg-blue-600/20 text-blue-400 border-b-2 border-blue-500' : 'text-slate-500'}`}>
          GEAR_MATRIX
        </button>
        <button onClick={() => { setActiveTab('NEURAL'); setActiveFilter('ALL'); }} 
          className={`flex-1 py-3 text-[9px] md:text-[10px] font-black tracking-[0.2em] md:tracking-[0.3em] transition-all ${activeTab === 'NEURAL' ? 'bg-purple-600/20 text-purple-400 border-b-2 border-purple-500' : 'text-slate-500'}`}>
          NEURAL_LINK
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-3 md:p-4 custom-scrollbar pb-32">
        <div className="bg-slate-900/40 border border-white/10 p-3 md:p-4 mb-6 relative overflow-hidden backdrop-blur-sm">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h3 className="text-lg md:text-xl font-black text-white italic tracking-tighter">LV.{player.level} {player.name}</h3>
              <p className="text-[7px] md:text-[8px] text-blue-500 font-bold uppercase tracking-[0.2em]">Neural_Sync_Active</p>
            </div>
          </div>
          <ProgressBar label="Bio_Integrity" cur={player.hp || 0} max={finalStats.finalMaxHp || 100} color="bg-emerald-500" />
          <ProgressBar label="Neural_Experience" cur={player.exp || 0} max={player.nextLevelExp || 100} color="bg-blue-400" className="mt-2" />
        </div>

        {activeTab === 'GEAR' ? (
          <div className="space-y-6 animate-in slide-in-from-left duration-300">
             <div className="grid grid-cols-5 gap-1.5 md:gap-3 max-w-xl mx-auto p-2 md:p-4 bg-blue-950/10 border border-blue-500/20 shadow-[inset_0_0_20px_rgba(59,130,246,0.1)]">
                {['WEAPON', 'ARMOR', 'BELT', 'TRINKET', 'ACCESSORY'].map(slot => {
                   const item = getFullItemInfo(player.equipment?.[slot.toLowerCase()]);
                   return (
                     <div key={slot} onClick={() => setSelectorConfig({ type: 'ITEM', slot })}
                        className={`aspect-square border-2 flex items-center justify-center relative cursor-pointer active:scale-95 transition-all
                        ${item ? 'border-blue-400 bg-blue-500/20 shadow-[0_0_15px_rgba(59,130,246,0.4)]' : 'border-white/5 bg-black/40 hover:border-blue-500/40'}`}>
                        <div className="absolute top-0 left-0 w-1 md:w-1.5 h-1 md:h-1.5 border-t border-l border-blue-400/50" />
                        <div className="absolute bottom-0 right-0 w-1 md:w-1.5 h-1 md:h-1.5 border-b border-r border-blue-400/50" />
                        <span className="text-2xl md:text-5xl">{item?.icon || <Plus size={12} className="opacity-10"/>}</span>
                        <span className="absolute -bottom-4 md:-bottom-5 text-[5px] md:text-[6px] font-black text-slate-600 uppercase tracking-widest">{slot}</span>
                     </div>
                   );
                })}
             </div>
             
             <div className="mt-8 md:mt-10 space-y-4">
                <div className="flex flex-col gap-2 md:gap-3">
                  <p className="text-[8px] md:text-[9px] font-black text-blue-500 tracking-[0.2em] md:tracking-[0.3em] uppercase italic flex items-center gap-2">
                    <Database size={12}/> Stash_Database
                  </p>
                  <div className="flex gap-1 overflow-x-auto no-scrollbar border-b border-white/5 pb-1">
                    {['ALL', 'WEAPON', 'ARMOR', 'BELT', 'TRINKET', 'ACCESSORY'].map(f => (
                      <button key={f} onClick={() => setActiveFilter(f)}
                        className={`px-2 md:px-3 py-1 text-[7px] md:text-[8px] font-black tracking-widest transition-all shrink-0 ${activeFilter === f ? 'bg-blue-500 text-white' : 'bg-white/5 text-slate-500 hover:bg-white/10'}`}>
                        {f}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  {player.inventory
                    ?.filter(invItem => {
                      const item = getFullItemInfo(invItem);
                      if (item.type === 'MONSTER_CARD') return false;
                      return activeFilter === 'ALL' || item.slot?.toUpperCase() === activeFilter;
                    })
                    .map((invItem, idx) => {
                      const item = getFullItemInfo(invItem);
                      const isEquipped = Object.values(player.equipment || {}).some(e => e?.instanceId === invItem.instanceId);
                      return (
                        <div key={invItem.instanceId || idx} onClick={() => setViewingItem(invItem)}
                          className={`bg-slate-900/40 border p-2.5 md:p-3 flex items-center gap-3 md:gap-4 transition-all cursor-pointer group ${isEquipped ? 'border-blue-500/50 bg-blue-500/5' : 'border-white/5 hover:border-blue-500/40'}`}>
                          <div className="w-10 h-10 md:w-12 md:h-12 bg-black/60 border border-white/10 flex items-center justify-center text-xl md:text-2xl group-hover:scale-105 transition-transform">{item.icon}</div>
                          <div className="flex-1 min-w-0">
                              <h4 className={`text-[10px] md:text-xs font-black uppercase italic truncate ${item.rarity === 'Legendary' ? 'text-amber-500' : (isEquipped ? 'text-blue-400' : 'text-white')}`}>{item.name} {isEquipped && "(E)"}</h4>
                              <div className="mt-1 md:mt-2 grid grid-cols-1 gap-0.5 opacity-80 border-t border-white/5 pt-1.5 md:pt-2">
                                <RenderItemStats item={item} ELEMENT_CONFIG={ELEMENT_CONFIG} />
                              </div>
                          </div>
                          <ChevronRight size={14} className="opacity-20" />
                        </div>
                      );
                  })}
                </div>
             </div>
          </div>
        ) : (
          /* NEURAL VIEW - Responsive */
          <div className="space-y-6 md:space-y-8 animate-in slide-in-from-right duration-300">
            <div className="grid grid-cols-5 gap-2 md:gap-3 max-w-xl mx-auto bg-slate-900/40 p-4 md:p-6 border border-white/10 relative">
                <div className="absolute top-0 left-0 w-2 md:w-3 h-2 md:h-3 border-t-2 border-l-2 border-purple-500/30" />
                <div className="absolute bottom-0 right-0 w-2 md:w-3 h-2 md:h-3 border-b-2 border-r-2 border-purple-500/30" />
                {(player.equippedPassives || [null, null, null]).map((id, i) => (
                  <SkillSlot key={`p-${i}`} skill={MONSTER_SKILLS.find(s => s.id === id)} label="PASS" onClick={() => id ? setViewingSkill({...MONSTER_SKILLS.find(s => s.id === id), type: 'PASSIVE', isEquipped: true}) : setSelectorConfig({ type: 'PASSIVE', index: i, slot: 'PASSIVE' })} />
                ))}
                <SkillSlot skill={PLAYER_SKILLS[player.equippedActives?.[0]]} label="ATK" onClick={() => player.equippedActives?.[0] ? setViewingSkill({...PLAYER_SKILLS[player.equippedActives[0]], type: 'ACTIVE', isEquipped: true}) : setSelectorConfig({ type: 'ACTIVE', index: 0, slot: 'ACTIVE' })} />
                <SkillSlot skill={PLAYER_SKILLS[player.equippedActives?.[1]]} label="SUP" onClick={() => player.equippedActives?.[1] ? setViewingSkill({...PLAYER_SKILLS[player.equippedActives[1]], type: 'ACTIVE', isEquipped: true}) : setSelectorConfig({ type: 'ACTIVE', index: 1, slot: 'ACTIVE' })} />
            </div>

            <div className="mt-8 md:mt-10 space-y-4">
              <div className="flex flex-col gap-2 md:gap-3">
                <p className="text-[8px] md:text-[9px] font-black text-purple-500 tracking-[0.2em] md:tracking-[0.3em] uppercase italic flex items-center gap-2">
                   <Cpu size={12}/> Skill_Repository
                </p>
                <div className="flex gap-1 border-b border-white/5 pb-1 overflow-x-auto no-scrollbar">
                  {['ALL', 'PASSIVE', 'ACTIVE'].map(f => (
                    <button key={f} onClick={() => setActiveFilter(f)}
                      className={`px-3 md:px-4 py-1.5 text-[7px] md:text-[8px] font-black tracking-widest transition-all shrink-0 ${activeFilter === f ? (f === 'PASSIVE' ? 'bg-orange-500 text-white' : f === 'ACTIVE' ? 'bg-purple-500 text-white' : 'bg-blue-500 text-white') : 'bg-white/5 text-slate-500 hover:bg-white/10'}`}>
                      {f}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-5 md:grid-cols-8 gap-1.5 md:gap-2">
                  {(activeFilter === 'ALL' || activeFilter === 'PASSIVE') && MONSTER_SKILLS.map(skill => (
                    <div 
                      key={skill.id} 
                      onClick={() => setViewingSkill({ ...skill, type: 'PASSIVE', isEquipped: (player.equippedPassives || []).includes(skill.id), isFilterList: true })}
                      className={`aspect-square border flex items-center justify-center text-xl md:text-2xl transition-all relative ${player.unlockedPassives?.includes(skill.id) ? 'bg-slate-800 border-orange-500/30 hover:border-orange-500 cursor-pointer shadow-[inset_0_0_10px_rgba(249,115,22,0.1)]' : 'bg-black/40 border-white/5 opacity-10 pointer-events-none'}`}
                    >
                      {skill.icon}
                      <div className="absolute bottom-0 right-0 w-1 h-1 bg-orange-500" />
                    </div>
                  ))}
                  {(activeFilter === 'ALL' || activeFilter === 'ACTIVE') && Object.values(PLAYER_SKILLS).map(skill => (
                    <div 
                      key={skill.id} 
                      onClick={() => setViewingSkill({ ...skill, type: 'ACTIVE', isEquipped: (player.equippedActives || []).includes(skill.id), isFilterList: true })}
                      className={`aspect-square border flex items-center justify-center text-xl md:text-2xl transition-all relative ${player.unlockedActives?.includes(skill.id) ? 'bg-slate-800 border-purple-500/30 hover:border-purple-500 cursor-pointer shadow-[inset_0_0_10px_rgba(168,85,247,0.1)]' : 'bg-black/40 border-white/5 opacity-10 pointer-events-none'}`}
                    >
                      {skill.icon}
                      <div className="absolute bottom-0 right-0 w-1 h-1 bg-purple-500" />
                    </div>
                  ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 🔴 READ-ONLY SKILL POPUP: สำหรับกดดูจากช่องปกติ หรือ Filter */}
      {viewingSkill && (() => {
          const el = ELEMENT_CONFIG[viewingSkill.element?.toLowerCase()] || { label: 'NEUTRAL', icon: <Zap size={12}/>, color: 'text-slate-400' };

          return (
            <div className="fixed inset-0 z-[400] flex items-center justify-center p-4 md:p-6 bg-slate-950/95 backdrop-blur-xl animate-in fade-in duration-200">
              <div className="absolute inset-0" onClick={() => setViewingSkill(null)} />
              <div className="relative w-full max-w-xs md:max-w-sm bg-slate-900 border-2 border-white/10 p-1 shadow-2xl overflow-hidden">
                <div className="absolute top-0 left-0 w-6 md:w-8 h-6 md:h-6 border-t-2 border-l-2 border-blue-500" />
                <div className="absolute bottom-0 right-0 w-6 md:w-8 h-6 md:h-6 border-b-2 border-r-2 border-blue-500" />
                
                <div className="bg-slate-950 p-4 md:p-6 space-y-4 md:space-y-6">
                  <div className="text-center space-y-2">
                    <div className="text-5xl md:text-7xl mb-2 flex justify-center drop-shadow-[0_0_20px_rgba(255,255,255,0.1)]">{viewingSkill.icon}</div>
                    <h3 className="text-xl md:text-2xl font-black uppercase italic tracking-tighter text-white">{viewingSkill.name}</h3>
                    <div className="flex justify-center items-center gap-2">
                      <span className={`px-2 py-0.5 text-[7px] md:text-[8px] font-black border border-white/10 bg-white/5 ${el.color} flex items-center gap-1`}>
                        {el.icon} {el.label}
                      </span>
                      <span className="text-[7px] md:text-[8px] text-slate-500 font-black uppercase tracking-[0.2em]">{viewingSkill.type}_MODULE</span>
                    </div>
                  </div>

                  <div className="bg-black/40 border border-white/5 p-3 md:p-4 space-y-3 md:space-y-4 shadow-inner">
                    {viewingSkill.type === 'PASSIVE' ? (
                      <>
                        <div className="space-y-1">
                          <p className="text-[6px] md:text-[7px] text-amber-500 font-black uppercase tracking-widest flex items-center gap-1"><Zap size={10}/> Permanent_Link</p>
                          <DetailStat data={viewingSkill.perm || viewingSkill.permanent} />
                        </div>
                        <div className="pt-2 border-t border-white/5 space-y-1">
                          <p className="text-[6px] md:text-[7px] text-blue-400 font-black uppercase tracking-widest flex items-center gap-1"><Cpu size={10}/> Neural_Sync_Bonus</p>
                          <DetailStat data={viewingSkill.sync || viewingSkill} /> 
                        </div>
                      </>
                    ) : (
                      <div className="space-y-2 md:space-y-3">
                        <div className="flex justify-between items-center border-b border-white/5 pb-1.5 md:pb-2">
                            <p className="text-[7px] md:text-[8px] text-slate-500 font-black uppercase tracking-widest">Active_Multiplier</p>
                            <p className="text-base md:text-lg font-black italic text-rose-500">x{viewingSkill.multiplier || 1.0}</p>
                        </div>
                        <div className="space-y-1">
                          <p className="text-[6px] md:text-[7px] text-purple-400 font-black uppercase tracking-widest flex items-center gap-1"><Sparkles size={10}/> Sync_Properties</p>
                          <DetailStat data={viewingSkill} />
                        </div>
                      </div>
                    )}
                  </div>

                  {/* ✅ UI เมื่อกดดูจาก Filter หรือดูสเตตัสเฉลี่ย - ไม่มีปุ่ม Equip/Unequip ตามสั่งแม่ */}
                  <div className="pt-2">
                    <button 
                      onClick={() => setViewingSkill(null)} 
                      className="w-full py-3 md:py-4 bg-white/5 border border-white/10 hover:bg-white/10 text-[9px] font-black uppercase text-white tracking-[0.3em] active:scale-95 transition-all"
                    >
                      EXIT_ANALYSIS
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
      })()}

      {/* ITEM POPUP */}
      {viewingItem && (() => {
          const item = getFullItemInfo(viewingItem);
          return (
            <div className="fixed inset-0 z-[250] flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-md animate-in fade-in">
                <div className="absolute inset-0" onClick={() => setViewingItem(null)} />
                <div className="relative w-full max-w-xs bg-slate-900 border-2 border-white/10 p-1 shadow-2xl">
                    <div className="bg-slate-950 p-4 md:p-6 space-y-4 md:space-y-6">
                        <div className="text-center">
                            <div className="text-5xl md:text-6xl mb-2 md:mb-4 drop-shadow-[0_0_15px_rgba(255,255,255,0.2)]">{item.icon}</div>
                            <h3 className={`text-lg md:text-xl font-black uppercase italic ${item.rarity === 'Legendary' ? 'text-amber-500' : 'text-white'}`}>{item.name}</h3>
                            <p className="text-[8px] md:text-[9px] text-slate-500 uppercase tracking-widest">{item.slot} // {item.rarity}</p>
                        </div>
                        <div className="bg-white/5 p-3 md:p-4 border border-white/10 space-y-1">
                            <RenderItemStats item={item} ELEMENT_CONFIG={ELEMENT_CONFIG} />
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                            <button onClick={() => handleSalvage(viewingItem)} className="py-2.5 md:py-3 bg-red-500/10 border border-red-500/30 text-red-500 text-[9px] font-black uppercase flex items-center justify-center gap-2 hover:bg-red-500/20 active:scale-95"><Recycle size={14}/> Salvage</button>
                            <button onClick={() => {wrapItemAsCode(viewingItem); setViewingItem(null);}} className="py-2.5 md:py-3 bg-blue-500/10 border border-blue-500/30 text-blue-400 text-[9px] font-black uppercase flex items-center justify-center gap-2 hover:bg-blue-500/20 active:scale-95"><Gift size={14}/> Gift</button>
                        </div>
                    </div>
                </div>
            </div>
          );
      })()}

      {/* SELECTOR MODAL - Mobile Optimized */}
      {selectorConfig && (
        <div className="fixed inset-0 z-[200] flex items-end md:items-center justify-center p-0 md:p-6 bg-slate-950/95 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="absolute inset-0" onClick={() => setSelectorConfig(null)} />
          <div className="relative w-full max-w-md bg-[#0b1120] border-t-2 md:border-2 border-blue-500/30 flex flex-col h-[80vh] md:h-[75vh] overflow-hidden shadow-2xl animate-in slide-in-from-bottom duration-300">
             <div className="p-3 md:p-4 border-b border-white/10 flex justify-between items-center bg-white/5 shrink-0">
                <h3 className="text-white font-black uppercase italic text-xs md:text-sm tracking-widest flex items-center gap-2"><Search size={16} className="text-blue-500"/> Select_{selectorConfig.slot}</h3>
                <button onClick={() => setSelectorConfig(null)} className="p-2 text-slate-400 hover:text-white transition-colors"><X size={20} /></button>
             </div>
             <div className="flex-1 overflow-y-auto p-3 md:p-4 space-y-2 no-scrollbar bg-slate-950/20">
                {selectorConfig.type === 'ITEM' ? (
                  player.inventory?.filter(i => {
                      const item = getFullItemInfo(i);
                      return item.slot?.toUpperCase() === selectorConfig.slot && item.type !== 'MONSTER_CARD';
                  }).map((invItem, idx) => {
                    const item = getFullItemInfo(invItem);
                    const isEquipped = player.equipment?.[selectorConfig.slot.toLowerCase()]?.instanceId === invItem.instanceId;
                    return (
                      <button key={idx} onClick={() => handleEquipItem(invItem)} 
                        className={`w-full border p-3 md:p-4 flex items-center gap-3 md:gap-4 transition-all text-left relative group ${isEquipped ? 'border-blue-500 bg-blue-500/20 shadow-[0_0_15px_rgba(59,130,246,0.3)]' : 'bg-white/5 border-white/5 hover:border-blue-500/40'}`}>
                        <span className="text-3xl md:text-4xl group-hover:scale-110 transition-transform">{item.icon}</span>
                        <div className="flex-1 min-w-0">
                          <p className={`text-[10px] md:text-xs font-black uppercase truncate ${isEquipped ? 'text-blue-400' : (item.rarity === 'Legendary' ? 'text-amber-500' : 'text-white')}`}>{item.name} {isEquipped && "(E)"}</p>
                          <div className="mt-1.5 md:mt-2 grid grid-cols-1 gap-0.5 opacity-80 border-t border-white/5 pt-1.5 md:pt-2">
                              <RenderItemStats item={item} ELEMENT_CONFIG={ELEMENT_CONFIG} />
                          </div>
                        </div>
                        <ChevronRight size={16} className="opacity-10 group-hover:opacity-100 transition-opacity" />
                      </button>
                    );
                  })
                ) : (
                  (selectorConfig.type === 'PASSIVE' ? MONSTER_SKILLS : Object.values(PLAYER_SKILLS)).map((skill) => {
                    const isUnlocked = selectorConfig.type === 'PASSIVE' ? player.unlockedPassives?.includes(skill.id) : player.unlockedActives?.includes(skill.id);
                    if (!isUnlocked) return null;
                    
                    // ✅ ปรับปรุง: ตรวจสอบการสวมใส่ซ้ำทั้งระบบ PASSIVE และ ACTIVE
                    const typeKey = selectorConfig.type === 'PASSIVE' ? 'equippedPassives' : 'equippedActives';
                    const isAlreadyEquippedElsewhere = (player[typeKey] || []).some((id, idx) => id === skill.id && idx !== selectorConfig.index);
                    
                    if (isAlreadyEquippedElsewhere) return null;

                    const skillData = selectorConfig.type === 'PASSIVE' ? (skill.sync || skill) : skill;
                    const permanentData = skill.permanent || skill.perm || {};

                    return (
                      <button key={skill.id} onClick={() => handleEquipSkill(skill.id)} 
                        className={`w-full border p-3 md:p-4 flex flex-col gap-2 transition-all text-left group ${selectorConfig.type === 'PASSIVE' ? 'bg-orange-500/5 border-orange-500/20 hover:border-orange-500' : 'bg-purple-500/5 border-purple-500/20 hover:border-purple-500'}`}>
                        <div className="flex items-center gap-3 md:gap-4 w-full">
                          <span className="text-3xl md:text-4xl group-hover:scale-110 transition-transform">{skill.icon}</span>
                          <div className="flex-1 min-w-0">
                            <p className={`text-[10px] md:text-xs font-black uppercase ${selectorConfig.type === 'PASSIVE' ? 'text-orange-400' : 'text-purple-400'}`}>{skill.name}</p>
                            <p className="text-[6px] md:text-[7px] text-slate-500 uppercase tracking-widest italic">{selectorConfig.type}</p>
                          </div>
                          <ChevronRight size={16} className="opacity-10" />
                        </div>

                        <div className="mt-1 w-full border-t border-white/5 pt-2 space-y-2">
                          {Object.keys(permanentData).length > 0 && (
                            <div className="mb-1">
                              <DetailStat data={permanentData} />
                            </div>
                          )}
                          <div className="mb-1">
                             <DetailStat data={skillData} />
                          </div>
                        </div>
                      </button>
                    );
                  })
                )}
                <button 
                    onClick={() => selectorConfig.type === 'ITEM' ? handleUnequipItem(selectorConfig.slot) : handleUnequipSkill(null, selectorConfig.type)}
                    className="w-full mt-4 bg-red-950/40 border border-red-500/30 p-4 flex items-center justify-center gap-3 hover:bg-red-500/20 transition-all group active:scale-95"
                >
                    <Trash2 size={16} className="text-red-500" />
                    <span className="text-[10px] font-black text-red-500 uppercase tracking-widest italic">Terminate_Sync</span>
                </button>
             </div>
          </div>
        </div>
      )}

      {/* INTEL MODAL - Mobile Optimized */}
      {showIntel && (
        <div className="fixed inset-0 z-[300] flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-md animate-in fade-in">
           <div className="relative w-full max-sm:max-w-[95%] max-w-sm bg-slate-900 border-2 border-white/10 p-4 md:p-6 shadow-2xl">
              <h3 className="text-lg md:text-xl font-black italic text-white mb-4 md:mb-6 border-b border-white/10 pb-2 flex items-center gap-2 uppercase tracking-tighter"><BarChart3 size={15} className="text-blue-500"/> System_Analysis</h3>
              <div className="grid grid-cols-2 gap-2 mb-4 md:mb-6 font-black italic text-center">
                <MiniStat label="Crit_Rate" val={`${(finalStats.critRate * 100).toFixed(1)}%`} color="text-yellow-500" />
                <MiniStat label="Crit_Dmg" val={`${(finalStats.critDamage * 100).toFixed(0)}%`} color="text-purple-500" />
                <MiniStat label="Armor_Pen" val={`${(finalStats.pen * 100).toFixed(1)}%`} color="text-rose-500" />
                <MiniStat label="Reflect" val={`${(finalStats.reflectDamage * 100).toFixed(0)}%`} color="text-emerald-500" />
              </div>
              <p className="text-[8px] md:text-[9px] font-black text-slate-500 uppercase tracking-widest mb-2 md:mb-3 italic">Elemental_Resonance</p>
              <div className="space-y-1.5 max-h-[25vh] overflow-y-auto no-scrollbar pr-1">
                 {Object.entries(ELEMENT_CONFIG).map(([key, config]) => {
                   const bonus = finalStats[key] || 0;
                   return (
                     <div key={key} className="flex justify-between items-center bg-black/40 p-2 border-l-2 border-white/5">
                        <div className="flex items-center gap-2">
                          <span className={config.color}>{config.icon}</span>
                          <span className={`text-[8px] md:text-[9px] font-black uppercase tracking-widest ${config.color}`}>{config.label}</span>
                        </div>
                        <span className={`text-[10px] md:text-xs font-black italic tracking-tighter ${config.color}`}>
                              +{bonus.toLocaleString()}
                      </span>
                     </div>
                   );
                 })}
              </div>
              <button onClick={() => setShowIntel(false)} className="w-full mt-4 md:mt-6 py-3 md:py-4 bg-white text-black font-black uppercase text-[10px] active:scale-95 transition-all">Close_Analysis</button>
           </div>
        </div>
      )}

      {/* SALVAGE CONFIRM */}
      {actionConfirm && (() => {
        const isEquipped = Object.values(player.equipment || {}).some(e => e?.instanceId === actionConfirm.instanceId);
        return (
          <div className="fixed inset-0 z-[300] flex items-center justify-center p-6 bg-red-950/20 backdrop-blur-md animate-in zoom-in duration-200">
            <div className={`bg-slate-900 border-2 ${isEquipped ? 'border-amber-500/50' : 'border-red-500/50'} p-5 md:p-6 w-full max-w-xs shadow-2xl`}>
              <div className={`flex items-center gap-3 ${isEquipped ? 'text-amber-500' : 'text-red-500'} mb-3 md:mb-4 font-black italic uppercase tracking-widest`}>
                <AlertTriangle size={24} /> {isEquipped ? 'Access_Denied' : 'Warning'}
              </div>
              <p className="text-[10px] md:text-xs font-black text-red-500 leading-relaxed uppercase mb-6 tracking-tight">
                {isEquipped 
                  ? `Cannot terminate ${actionConfirm.name}. Module is currently synced.`
                  : `Confirm termination of ${actionConfirm.name}? Permanent data loss will occur.`
                }
              </p>
              <div className="flex gap-2">
                {isEquipped ? (
                  <button onClick={() => setActionConfirm(null)} className="flex-1 py-3 bg-slate-800 text-white text-[10px] font-black uppercase border border-white/10 active:scale-95 transition-all">
                    BACK
                  </button>
                ) : (
                  <>
                    <button onClick={executeSalvage} className="flex-1 py-3 bg-red-600 text-white text-[10px] font-black uppercase active:scale-95 transition-all shadow-lg">
                      EXECUTE
                    </button>
                    <button onClick={() => setActionConfirm(null)} className="flex-1 py-3 bg-slate-800 text-slate-400 text-[10px] font-black uppercase border border-white/5">
                      CANCEL
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        );
      })()}
    </div>
  );
}

// ✅ Components ด้านล่าง ปรับให้รองรับขนาดฟอนต์บนมือถือ
const DetailStat = ({ data }) => {
  if (!data) return <p className="text-[8px] text-slate-700 italic">No_Data_Detected</p>;
  
  const mapping = [
    { keys: ['atk', 'passiveAtkBonus'], label: 'ATK', unit: '', color: 'text-rose-400' },
    { keys: ['def', 'passiveDefBonus'], label: 'DEF', unit: '', color: 'text-sky-400' },
    { keys: ['maxHp', 'passiveMaxHpBonus', 'hp'], label: 'BIO', unit: '', color: 'text-emerald-400' },
    { keys: ['atkPercent', 'passiveAtkPercent'], label: 'ATK_MASTERY', unit: '%', color: 'text-rose-500' },
    { keys: ['armorPen', 'pen'], label: 'PEN', unit: '%', color: 'text-orange-400' },
    { keys: ['passiveCritRate', 'critRate'], label: 'CRIT', unit: '%', color: 'text-amber-400' },
    { keys: ['critDamage'], label: 'CRIT_DMG', unit: '%', color: 'text-purple-400' },
    { keys: ['elementPower'], label: 'ELM', unit: 'pts', color: 'text-blue-400' },
    { keys: ['reflectDamage', 'reflect'], label: 'REF', unit: '%', color: 'text-emerald-500' },
  ];

  return (
    <div className="grid grid-cols-2 gap-x-2 md:gap-x-4 gap-y-1">
      {mapping.map(m => {
        const val = m.keys.map(k => data[k]).find(v => v !== undefined && v !== 0) || 0;
        if (val === 0) return null;
        return (
          <div key={m.label} className="flex justify-between items-center">
            <span className="text-[7.5px] md:text-[9px] text-slate-500 font-black">{m.label}</span>
            <span className={`text-[8.5px] md:text-[10px] font-black italic ${m.color}`}>
              +{m.unit === '%' ? (val * 100).toFixed(1) + '%' : val.toLocaleString()}{m.unit}
            </span>
          </div>
        );
      })}
    </div>
  );
};

const RenderItemStats = ({ item, ELEMENT_CONFIG }) => {
  if (!item) return null;
  const statDef = [
    { key: 'atk', label: 'ATK', color: 'text-rose-500', icon: <Sword size={10}/> },
    { key: 'def', label: 'DEF', color: 'text-sky-400', icon: <Shield size={10}/> },
    { key: 'maxHp', label: 'HP', color: 'text-emerald-400', icon: <Activity size={10}/> },
    { key: 'atkPercent', label: 'ATK%', color: 'text-rose-400', icon: <Zap size={10}/>, isPct: true },
    { key: 'pen', label: 'PEN', color: 'text-orange-500', icon: <Target size={10}/>, isPct: true },
    { key: 'reflect', label: 'REF', color: 'text-emerald-500', icon: <ShieldCheck size={10}/>, isPct: true },
    { key: 'passiveCritRate', label: 'CRIT', color: 'text-amber-500', icon: <Zap size={10}/>, isPct: true },
    { key: 'critDamage', label: 'CRIT_D', color: 'text-purple-500', icon: <Sparkles size={10}/>, isPct: true },
    { key: 'luck', label: 'LUCK', color: 'text-cyan-400', icon: <Sparkles size={10}/> }
  ];

  return (
    <div className="flex flex-wrap gap-x-2 md:gap-x-4 gap-y-0.5">
      {statDef.map(s => {
        const val = item[s.key];
        if (!val || val <= 0) return null;
        return (
          <div key={s.key} className="flex items-center gap-1">
            <span className={`text-[7px] md:text-[8px] uppercase italic opacity-70 ${s.color} flex items-center gap-0.5`}>
                {s.icon} {s.label}
            </span>
            <span className={`text-[7px] md:text-[8px] font-black ${s.color}`}>
              +{s.isPct ? (val * 100).toFixed(1) + '%' : val.toLocaleString()}
            </span>
          </div>
        );
      })}
    </div>
  );
};

const StatMonitor = ({ label, val, color, icon }) => (
  <div className="flex flex-col min-w-[50px] md:min-w-[60px]">
    <div className="flex items-center gap-1 text-[6px] md:text-[7px] font-black text-slate-500 uppercase tracking-widest">{icon} {label}</div>
    <div className={`text-[12px] md:text-[14px] font-black italic ${color}`}>+{val.toLocaleString()}</div>
  </div>
);

const ProgressBar = ({ label, cur, max, color, className = "" }) => (
  <div className={`space-y-0.5 md:space-y-1 ${className}`}>
    <div className="flex justify-between text-[6px] md:text-[7px] font-black uppercase tracking-widest opacity-50">
      <span>{label}</span>
      <span>{cur} / {max}</span>
    </div>
    <div className="w-full h-1 bg-black/40">
      <div className={`h-full ${color} transition-all duration-700`} style={{ width: `${Math.min((cur / max) * 100, 100)}%` }} />
    </div>
  </div>
);

const MiniStat = ({ label, val, color }) => (
  <div className="bg-black/40 p-1.5 md:p-2 border border-white/5">
    <div className="text-[7px] md:text-[8px] text-slate-500 uppercase tracking-widest mb-0.5 md:mb-1 font-black">{label}</div>
    <div className={`text-base md:text-lg font-black italic ${color} tracking-tighter`}>{val}</div>
  </div>
);

const SkillSlot = ({ skill, label, onClick }) => (
  <div className="flex flex-col items-center gap-1 md:gap-2 group">
     <div onClick={onClick} className={`aspect-square w-full border-2 flex items-center justify-center text-xl md:text-2xl transition-all cursor-pointer active:scale-95 ${skill ? 'border-purple-500 bg-purple-500/10 shadow-[0_0_15px_rgba(168,85,247,0.2)]' : 'border-dashed border-white/10 bg-black/20 hover:border-purple-500/40'}`}>
        {skill?.icon || <Plus size={12} className="opacity-20 group-hover:scale-125 transition-transform"/>}
     </div>
     <span className="text-[5px] md:text-[6px] font-black text-slate-600 uppercase tracking-tighter opacity-50">{label}</span>
  </div>
);