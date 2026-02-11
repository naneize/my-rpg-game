// ✅ ไฟล์: CombatView.jsx (เวอร์ชันแก้ Syntax Error)
import React, { useState, useEffect, useMemo } from 'react';

// --- Import Sub-Components ---
import VictoryLootModal from '../components/combat/VictoryLootModal';
import MonsterDisplay from '../components/combat/MonsterDisplay';
import PlayerCombatStatus from '../components/combat/PlayerCombatStatus';
import DamageNumber from '../components/DamageNumber.jsx';
import BossFrame from '../components/combat/BossFrame';
import SkillFloatingText from '../components/SkillFloatingText';

// ✅ Import ข้อมูลหลัก
import { PLAYER_SKILLS } from '../data/playerSkills'; 
import { useCombatRewards } from '../hooks/useCombatRewards';
import { getMonsterTypeInfo, getEffectiveMaxHp } from '../utils/monsterUtils';

// ✅ Import ตัวคำนวณกลางเพื่อให้สเตตัสซิงค์กัน
import { calculateFinalStats } from '../utils/statCalculations';

// ✅ Import Icons เพิ่มเติมสำหรับ UI ใหม่
import { Zap, AlertTriangle, ShieldAlert, Cpu, Activity, Swords as SwordsIcon, Terminal } from 'lucide-react';

export default function CombatView({
  monster, player, onAttack, onFlee, lootResult, onCloseCombat, setPlayer,
  monsterSkillUsed, forceShowColor, setLogs,
  combatPhase, damageTexts,
  skillTexts, 
  handleUseSkill,
  attackCombo = 0, 
}) {

  if (!monster || !player) return null;

  const [showSkills, setShowSkills] = useState(false); 
  const [showMatrix, setShowMatrix] = useState(false);
  const [activePassiveTooltip, setActivePassiveTooltip] = useState(null);

  const isOverloaded = attackCombo >= 5;

  const rarityConfig = {
    Common: { color: 'text-slate-400', border: 'border-slate-500/30', bg: 'bg-slate-500/10' },
    Uncommon: { color: 'text-emerald-400', border: 'border-emerald-500/30', bg: 'bg-emerald-500/10' },
    Rare: { color: 'text-blue-400', border: 'border-blue-500/30', bg: 'bg-blue-500/10' },
    Epic: { color: 'text-purple-400', border: 'border-purple-500/30', bg: 'bg-purple-500/10' },
    Legendary: { color: 'text-orange-400', border: 'border-orange-500/30', bg: 'bg-orange-500/10' },
    Mythic: { color: 'text-red-400', border: 'border-red-500/30', bg: 'bg-red-500/10' },
  };
  const rarityStyle = rarityConfig[monster.rarity] || rarityConfig.Common;

  const fullCombatStats = useMemo(() => calculateFinalStats(player), [player]);

  const statAnalysis = useMemo(() => {
    const atkP = fullCombatStats?.displayBonus?.atkPercent || 0;
    return { mastery: (atkP * 100).toFixed(0) };
  }, [player, fullCombatStats]);

  const attackSkill = useMemo(() => PLAYER_SKILLS[player.equippedActives?.[0]] || null, [player.equippedActives]);
  const supportSkill = useMemo(() => PLAYER_SKILLS[player.equippedActives?.[1]] || null, [player.equippedActives]);

  const { hasSkillDropped, finalizeCombat } = useCombatRewards(
    monster, player, setPlayer, setLogs, lootResult
  );

  const { isWorldBoss, isTrulyBoss } = getMonsterTypeInfo(monster);
  const effectiveMaxHp = getEffectiveMaxHp(monster);

  const displayAtk = fullCombatStats.finalAtk; 
  const displayDef = fullCombatStats.finalDef;
  const finalMaxHp = fullCombatStats.finalMaxHp;

  const isInputLocked = combatPhase !== 'PLAYER_TURN' || !!lootResult;
  const isShiny = monster?.isShiny || false;

  const monsterHpPercent = (monster.hp / effectiveMaxHp) * 100;
  const playerHpPercent = (player.hp / finalMaxHp) * 100;

  const getStepColor = (step) => {
    if (isOverloaded) return 'bg-orange-500 shadow-[0_0_15px_rgba(249,115,22,0.6)] animate-pulse';
    if (attackCombo < step) return 'bg-white/5 border border-white/5';
    if (step <= 2) return 'bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.4)]';
    if (step <= 4) return 'bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.4)]';
    return 'bg-orange-500 shadow-[0_0_12px_rgba(249,115,22,0.6)]';
  };

  return (
    <div className="relative z-0 w-full h-full flex flex-col items-center bg-[#020617] text-white overflow-hidden font-mono select-none">
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none" 
        style={{ backgroundImage: 'radial-gradient(#3b82f6 1px, transparent 0)', backgroundSize: '32px 32px' }} 
      />

      <div className="absolute inset-0 pointer-events-none z-[999999] overflow-hidden">
        {damageTexts && damageTexts.map((dmg) => (
          <DamageNumber key={dmg.id} value={dmg.value} type={dmg.type} />
        ))}
      </div>

      <div className="w-full max-w-4xl h-full flex flex-col relative z-10">
        
        <div className="flex-[2.5] min-h-0 flex flex-col justify-center relative px-4 pt-4">
            <BossFrame monster={monster} isWorldBoss={isWorldBoss} isShiny={isShiny} isBoss={isTrulyBoss} lootResult={lootResult}>
            <div className="relative h-full flex items-center justify-center">
              <div className="absolute inset-0 pointer-events-none z-[110] flex items-center justify-center">
                {skillTexts && skillTexts.map((skill) => (
                  <SkillFloatingText key={skill.id} name={skill.name} isWorldBoss={isWorldBoss} />
                ))}
              </div>

              <MonsterDisplay 
                monster={monster} 
                player={player}
                lootResult={lootResult} 
                isBoss={isTrulyBoss} 
                monsterHpPercent={monsterHpPercent} 
                isShiny={isShiny} 
                forceShowColor={forceShowColor} 
                showSkills={showSkills}
                setShowSkills={setShowSkills}
              />
            </div>
          </BossFrame>
        </div>

        <div className="flex-none px-4 py-2 bg-slate-900/90 backdrop-blur-xl border-y-2 border-white/10 relative z-20">
           <PlayerCombatStatus
             player={{ ...player, atk: displayAtk, def: displayDef, maxHp: finalMaxHp, bonus: fullCombatStats.bonus }} 
             playerHpPercent={playerHpPercent}
             activePassiveTooltip={activePassiveTooltip}
             setActivePassiveTooltip={setActivePassiveTooltip}
           />
        </div>

        <div className="flex-none bg-slate-950 p-4 space-y-4 pb-12 relative z-10 border-t-2 border-white/5">
          
          <div className="flex items-center justify-between px-1 mb-1">
            <div className="flex items-center gap-2">
              <Zap size={14} className={isOverloaded ? 'text-orange-500 animate-pulse' : 'text-slate-600'} />
              <span className={`text-[9px] font-[1000] uppercase tracking-[0.3em] ${isOverloaded ? 'text-orange-400' : 'text-slate-600'}`}>
                Neural_Charge_Link
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="flex gap-1.5">
                {[1, 2, 3, 4, 5].map((step) => (
                  <div key={step} className={`h-2.5 w-8 rounded-none transition-all duration-300 border ${getStepColor(step)}`} />
                ))}
              </div>
              <span className={`ml-3 text-xs font-black italic tracking-tighter ${isOverloaded ? 'text-orange-400 animate-pulse' : 'text-white/30'}`}>
                {isOverloaded ? 'READY' : `${attackCombo}/5`}
              </span>
            </div>
          </div>

          <div className="overflow-hidden rounded-none border-2 border-white/10 bg-black/80 backdrop-blur-xl relative">
            <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-blue-500/50" />
            <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-blue-500/50" />

            <button onClick={() => setShowMatrix(!showMatrix)} className="w-full flex justify-between items-center px-5 py-2.5 hover:bg-white/5 transition-all">
              <div className="flex items-center gap-3">
                <Activity size={14} className={showMatrix ? 'text-blue-500 animate-pulse' : 'text-slate-600'} />
                <span className="text-[10px] font-[1000] text-blue-500 tracking-[0.5em] uppercase italic">Intel_Matrix_v4.2</span>
              </div>
              <div className="flex items-center gap-4">
                <span className={`text-[8px] font-black px-2 py-0.5 border-l-2 border-r-2 italic uppercase ${rarityStyle.color} border-white/10`}>THREAT: {monster.rarity || 'Common'}</span>
                <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">{showMatrix ? '[Minimize]' : '[Expand]'}</span>
              </div>
            </button>
            
            {showMatrix && (
              <div className="p-6 grid grid-cols-2 gap-10 relative animate-in slide-in-from-top-2 duration-300 border-t-2 border-white/5 font-mono">
                <div className="space-y-3">
                  <p className="text-[8px] font-black text-slate-600 uppercase tracking-widest mb-2 italic flex items-center gap-1"><Terminal size={10} /> // Power_Analytics</p>
                  <div className="flex justify-between items-center text-xs"><span className="text-slate-500">Output_Atk:</span><span className="font-black text-white">{displayAtk} <span className="text-[9px] text-orange-400">({statAnalysis.mastery}%)</span></span></div>
                  <div className="flex justify-between items-center text-xs"><span className="text-slate-500">Defense_Rating:</span><span className="font-black text-blue-400">{displayDef}</span></div>
                  <div className="flex justify-between items-center text-xs"><span className="text-slate-500">Vitality_Total:</span><span className="font-black text-emerald-400">{finalMaxHp}</span></div>
                </div>
                <div className="space-y-3 border-l-2 border-white/5 pl-10">
                  <p className="text-[8px] font-black text-slate-600 uppercase tracking-widest mb-2 italic flex items-center gap-1"><Cpu size={10} /> // Tactical_Output</p>
                  <div className="flex justify-between items-center text-xs"><span className="text-slate-500">Penetration:</span><span className="font-black text-orange-400">{(fullCombatStats.bonus.pen * 100).toFixed(0)}%</span></div>
                  <div className="flex justify-between items-center text-xs"><span className="text-slate-500">Reflection:</span><span className="font-black text-cyan-400">{(fullCombatStats.bonus.reflect * 100).toFixed(0)}%</span></div>
                  <div className="flex justify-between items-center text-xs"><span className="text-slate-500">Crit_Chance:</span><span className="font-black text-purple-400">{(fullCombatStats.critRate * 100).toFixed(1)}%</span></div>
                </div>
              </div>
            )}
          </div>

          {/* ⚔️ PRIMARY ACTIONS (Dynamic Status Monitor) */}
<div className="flex gap-4 h-16 sm:h-20">
  <button 
    disabled={true} // 🔒 ล็อคไว้เลย เพราะเราใช้ระบบ Auto
    className={`flex-[4] rounded-none font-black italic text-lg tracking-[0.5em] relative overflow-hidden border-2 transition-all duration-500
      ${isInputLocked 
        ? 'bg-blue-950/20 border-blue-500/40 text-blue-400/80 shadow-[inset_0_0_20px_rgba(59,130,246,0.1)]' 
        : 'bg-emerald-950/20 border-emerald-500/40 text-emerald-400/80'}`}
  >
    {/* ส่วนแสดงสถานะข้อความ */}
    <div className="flex items-center justify-center gap-3 animate-pulse">
      <Activity size={18} className="animate-spin-slow" />
      <span className="text-sm md:text-base uppercase tracking-[0.3em]">
        {isInputLocked ? 'NEURAL_SYNC_WAITING' : 'ENGAGING_TARGET...'}
      </span>
    </div>

    {/* เส้นไฟวิ่งสถานะด้านล่าง (Hard-Edge Scanline) */}
    <div className={`absolute bottom-0 left-0 h-[2px] w-full 
      ${isInputLocked ? 'bg-blue-500/50' : 'bg-emerald-500 animate-loading-bar'}`} 
    />
    
    <div className="absolute bottom-1 left-2 text-[6px] opacity-30 font-black tracking-widest">
      STRIKE_PROTOCOL_v1.0
    </div>
  </button>

  {/* ปุ่ม ABORT (ปรับให้ดูเป็นปุ่มฉุกเฉิน) */}
  <button 
    onClick={onFlee} 
    disabled={isInputLocked}
    className={`flex-1 rounded-none font-black text-[10px] tracking-[0.2em] transition-all border-2
      ${isInputLocked 
        ? 'bg-slate-950 border-white/5 text-slate-800 opacity-50 cursor-not-allowed' 
        : 'bg-black border-red-900/50 text-red-500 hover:border-red-500 hover:shadow-[0_0_15px_rgba(239,68,68,0.2)]'}`}
  >
    ABORT
  </button>
</div>

          <div className="grid grid-cols-2 gap-4 h-16 sm:h-24">
            {[ 
              { skill: attackSkill, type: 'BURST_MODULE', color: 'orange', resonance: 'bg-orange-500' },
              { skill: supportSkill, type: 'CORE_SUPPORT', color: 'cyan', resonance: 'bg-cyan-500' }
            ].map((slot, idx) => (
              <button 
                key={idx}
                onClick={() => slot.skill && handleUseSkill(slot.skill)} 
                disabled={isInputLocked || !slot.skill} 
                className={`group relative rounded-none border-2 transition-all active:scale-95 overflow-hidden flex items-center gap-5 px-6
                  ${!isInputLocked && slot.skill 
                    ? (isOverloaded ? `border-amber-500 bg-amber-500/20 shadow-[0_0_25px_rgba(245,158,11,0.4)] animate-pulse` : 'border-white/10 bg-white/5 hover:border-white/30') 
                    : 'border-white/5 bg-slate-900/50 opacity-40'}`}
              >
                <div className={`absolute top-0 left-0 w-1.5 h-full ${slot.resonance} opacity-50`} />
                <span className={`text-3xl sm:text-5xl ${isOverloaded ? 'animate-bounce drop-shadow-[0_0_10px_rgba(255,255,255,0.5)]' : 'opacity-80'}`}>{slot.skill?.icon || '🔒'}</span>
                <div className="flex flex-col items-start min-w-0">
                  <span className={`text-[8px] font-black uppercase tracking-widest italic opacity-50 ${isOverloaded ? 'text-white' : ''}`}>{slot.type}</span>
                  <span className={`text-[11px] sm:text-sm font-black uppercase text-white truncate w-full italic tracking-tighter ${isOverloaded ? 'text-amber-400' : ''}`}>
                    {slot.skill?.name || 'STANDBY'}
                  </span>
                  {/* ✅ แก้จุด Error ตรงนี้ครับแม่ */}
                  {isOverloaded && <span className="text-[7px] font-black text-white/70 animate-pulse mt-1">{" >> OVERLOAD_ACTIVE: x2.0"}</span>}
                </div>
                {isOverloaded && <Zap size={16} className="ml-auto text-amber-500 animate-bounce" />}
              </button>
            ))}
          </div>
        </div>
      </div>
      <VictoryLootModal lootResult={lootResult} monster={monster} hasSkillDropped={hasSkillDropped} onFinalize={() => finalizeCombat(onCloseCombat)} stats={player} />
    </div>
  );
}