// ✅ ไฟล์: CombatView.jsx (เวอร์ชันถอนระบบ Intel Matrix ออก)
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
import { calculateFinalStats } from '../utils/statCalculations';
import { Zap, Activity, Cpu, Terminal } from 'lucide-react';

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

  const fullCombatStats = useMemo(() => calculateFinalStats(player), [player]);
  
  const attackSkill = useMemo(() => PLAYER_SKILLS[player.equippedActives?.[0]] || null, [player.equippedActives]);
  const supportSkill = useMemo(() => PLAYER_SKILLS[player.equippedActives?.[1]] || null, [player.equippedActives]);

  const { hasSkillDropped, finalizeCombat } = useCombatRewards(monster, player, setPlayer, setLogs, lootResult);
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
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(#3b82f6 1px, transparent 0)', backgroundSize: '32px 32px' }} />

      <div className="absolute inset-0 pointer-events-none z-[999999] overflow-hidden">
        {damageTexts && damageTexts.map((dmg) => <DamageNumber key={dmg.id} value={dmg.value} type={dmg.type} />)}
      </div>

      {/* Main Container */}
      <div className="w-full max-w-4xl h-full flex flex-col relative z-10 overflow-y-auto sm:overflow-hidden custom-scrollbar">
        
        {/* 👾 MONSTER AREA */}
        <div className="flex-[2] sm:flex-[2.5] min-h-0 flex flex-col justify-center relative px-4 pt-2">
            <BossFrame monster={monster} isWorldBoss={isWorldBoss} isShiny={isShiny} isBoss={isTrulyBoss} lootResult={lootResult}>
            <div className="relative h-full flex items-center justify-center">
              <div className="absolute inset-0 pointer-events-none z-[110] flex items-center justify-center">
                {skillTexts && skillTexts.map((skill) => <SkillFloatingText key={skill.id} name={skill.name} isWorldBoss={isWorldBoss} />)}
              </div>
              <MonsterDisplay monster={monster} player={player} lootResult={lootResult} isBoss={isTrulyBoss} monsterHpPercent={monsterHpPercent} isShiny={isShiny} forceShowColor={forceShowColor} showSkills={showSkills} setShowSkills={setShowSkills} />
            </div>
          </BossFrame>
        </div>

        {/* 💖 PLAYER STATUS */}
        <div className="flex-none px-4 py-1.5 bg-slate-900/90 backdrop-blur-xl border-y-2 border-white/10 relative z-20">
            <PlayerCombatStatus player={{ ...player, atk: displayAtk, def: displayDef, maxHp: finalMaxHp, bonus: fullCombatStats.bonus }} playerHpPercent={playerHpPercent} activePassiveTooltip={activePassiveTooltip} setActivePassiveTooltip={setActivePassiveTooltip} />
        </div>

        {/* 🎮 ACTION CONSOLE */}
        <div className="flex-none bg-slate-950 p-3 sm:p-4 space-y-3 sm:space-y-4 pb-8 sm:pb-12 relative z-10 border-t-2 border-white/5">
          
          {/* COMBO GAUGE */}
          <div className="flex items-center justify-between px-1 mb-1">
            <div className="flex items-center gap-2">
              <Zap size={14} className={isOverloaded ? 'text-orange-500 animate-pulse' : 'text-slate-600'} />
              <span className="text-[8px] sm:text-[9px] font-[1000] uppercase tracking-[0.2em] sm:tracking-[0.3em] text-slate-500">Neural_Charge_Link</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="flex gap-1 sm:gap-1.5">
                {[1, 2, 3, 4, 5].map((step) => (
                  <div key={step} className={`h-2 w-5 sm:h-2.5 sm:w-8 rounded-none border ${getStepColor(step)}`} />
                ))}
              </div>
              <span className={`ml-2 text-[10px] sm:text-xs font-black italic ${isOverloaded ? 'text-orange-400 animate-pulse' : 'text-white/30'}`}>
                {isOverloaded ? 'READY' : `${attackCombo}/5`}
              </span>
            </div>
          </div>

          {/* MAIN ACTIONS */}
          <div className="flex gap-3 sm:gap-4 h-14 sm:h-20">
            <button disabled={true} className={`flex-[4] rounded-none font-black italic text-sm sm:text-lg tracking-[0.3em] sm:tracking-[0.5em] relative overflow-hidden border-2 transition-all ${isInputLocked ? 'bg-blue-950/20 border-blue-500/40 text-blue-400/80' : 'bg-emerald-950/20 border-emerald-500/40 text-emerald-400/80'}`}>
              <div className="flex items-center justify-center gap-2 animate-pulse">
                <Activity size={14} className="animate-spin-slow" />
                <span className="uppercase">{isInputLocked ? 'NEURAL_WAIT' : 'ENGAGING...'}</span>
              </div>
              <div className={`absolute bottom-0 left-0 h-[2px] w-full ${isInputLocked ? 'bg-blue-500/50' : 'bg-emerald-500 animate-loading-bar'}`} />
            </button>
            <button onClick={onFlee} disabled={isInputLocked} className={`flex-1 rounded-none font-black text-[9px] sm:text-[10px] border-2 ${isInputLocked ? 'bg-slate-950 border-white/5 text-slate-800 opacity-50' : 'bg-black border-red-900/50 text-red-500'}`}>ABORT</button>
          </div>

          {/* SKILL SLOTS */}
          <div className="grid grid-cols-2 gap-3 sm:gap-4 h-16 sm:h-24">
            {[ 
              { skill: attackSkill, type: 'BURST', color: 'orange', resonance: 'bg-orange-500' },
              { skill: supportSkill, type: 'CORE', color: 'cyan', resonance: 'bg-cyan-500' }
            ].map((slot, idx) => (
              <button key={idx} onClick={() => slot.skill && handleUseSkill(slot.skill)} disabled={!slot.skill || combatPhase !== 'PLAYER_TURN' || !!lootResult} className={`group relative rounded-none border-2 transition-all active:scale-95 overflow-hidden flex items-center gap-3 sm:gap-5 px-3 sm:px-6 ${!isInputLocked && slot.skill ? (isOverloaded ? `border-amber-500 bg-amber-500/20 animate-pulse` : 'border-white/10 bg-white/5') : 'border-white/5 bg-slate-900/50 opacity-40'}`}>
                <div className={`absolute top-0 left-0 w-1 sm:w-1.5 h-full ${slot.resonance} opacity-50`} />
                <span className={`text-2xl sm:text-5xl ${isOverloaded ? 'animate-bounce' : 'opacity-80'}`}>{slot.skill?.icon || '🔒'}</span>
                <div className="flex flex-col items-start min-w-0">
                  <span className="text-[7px] font-black uppercase tracking-widest opacity-50">{slot.type}</span>
                  <span className="text-[10px] sm:text-sm font-black uppercase text-white truncate w-full italic">{slot.skill?.name || 'STANDBY'}</span>
                  {isOverloaded && <span className="text-[6px] font-black text-white/70 animate-pulse mt-0.5 sm:mt-1">{" >> OVERLOAD"}</span>}
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      <VictoryLootModal lootResult={lootResult} monster={monster} hasSkillDropped={hasSkillDropped} onFinalize={() => finalizeCombat(onCloseCombat)} stats={player} />
    </div>
  );
}