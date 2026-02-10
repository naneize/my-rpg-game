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

export default function CombatView({
  monster, player, onAttack, onFlee, lootResult, onCloseCombat, setPlayer,
  monsterSkillUsed, forceShowColor, setLogs,
  combatPhase, damageTexts,
  skillTexts, 
  handleUseSkill,
}) {

  // --- 🛑 Validation ---
  if (!monster || !player) return null;

  const [showSkills, setShowSkills] = useState(false); 
  const [activePassiveTooltip, setActivePassiveTooltip] = useState(null);

  // ✅ [NEW] คำนวณ Final Stats จากระบบกลางเพื่อใช้ในฉากต่อสู้
  const fullCombatStats = useMemo(() => calculateFinalStats(player), [player]);

  // 2. ตามด้วย statAnalysis (เพราะตัวนี้ต้องใช้ข้อมูลจาก fullCombatStats)
  const statAnalysis = useMemo(() => {
    const baseAtk = player.atk || 0;
    const itemAtk = player.equipment ? Object.values(player.equipment).reduce((sum, item) => sum + (item?.atk || 0), 0) : 0;
    
    const atkP = fullCombatStats?.displayBonus?.atkPercent || 0;
    const passiveFlat = (fullCombatStats.finalAtk / (1 + atkP)) - (baseAtk + itemAtk);
    
    return {
      base: baseAtk,
      items: itemAtk,
      passive: Math.floor(passiveFlat),
      mastery: (atkP * 100).toFixed(0),
      // เพิ่มส่วน HP และ DEF สำหรับการวิเคราะห์รวม
      baseHp: player.maxHp || 100,
      gearHp: player.equipment ? Object.values(player.equipment).reduce((sum, item) => sum + (item?.hp || 0), 0) : 0,
      baseDef: player.def || 0,
      gearDef: player.equipment ? Object.values(player.equipment).reduce((sum, item) => sum + (item?.def || 0), 0) : 0
    };
  }, [player, fullCombatStats]);

  // --- 🛰️ SYNC LOGIC: ดึงข้อมูลตาม Slot ที่สวมใส่จริง ---
  const attackSkill = useMemo(() => {
    const skillId = player.equippedActives?.[0];
    return PLAYER_SKILLS[skillId] || null; 
  }, [player.equippedActives]);

  const supportSkill = useMemo(() => {
    const skillId = player.equippedActives?.[1];
    return PLAYER_SKILLS[skillId] || null;
  }, [player.equippedActives]);

  // --- 🏆 Combat Rewards & Logic ---
  const { hasSkillDropped, finalizeCombat } = useCombatRewards(
    monster, player, setPlayer, setLogs, lootResult
  );

  const { isWorldBoss, isTrulyBoss } = getMonsterTypeInfo(monster);
  const effectiveMaxHp = getEffectiveMaxHp(monster);

  // --- 📊 Stats Calculation (Updated to use fullCombatStats) ---
  const displayAtk = fullCombatStats.finalAtk; 
  const displayDef = fullCombatStats.finalDef;
  const finalMaxHp = fullCombatStats.finalMaxHp;

  const isInputLocked = combatPhase !== 'PLAYER_TURN' || !!lootResult;
  const isShiny = monster?.isShiny || false;

  const monsterHpPercent = (monster.hp / effectiveMaxHp) * 100;
  const playerHpPercent = (player.hp / finalMaxHp) * 100;

  // ✅ แจ้งเตือนมอนสเตอร์ใช้สกิล
  useEffect(() => {
    if (monsterSkillUsed && setLogs) {
      const skillName = monsterSkillUsed.name || "ทักษะพิเศษ";
      setLogs(prev => [`👿 ${monster.name} ใช้สกิล [${skillName}]!`, ...prev].slice(0, 10));
    }
  }, [monsterSkillUsed, setLogs, monster.name]);

  return (
    <div className="relative z-0 w-full h-full flex flex-col items-center bg-slate-950 text-white overflow-hidden">
      <div className="absolute inset-0 opacity-30 pointer-events-none" 
        style={{ backgroundImage: `radial-gradient(circle at center, #1e293b 0%, #020617 100%)` }} 
      />

      {/* 💥 DAMAGE DISPLAY LAYER */}
      <div className="absolute inset-0 pointer-events-none z-[999999] overflow-hidden select-none">
        {damageTexts && damageTexts.map((dmg) => (
          <DamageNumber key={dmg.id} value={dmg.value} type={dmg.type} />
        ))}
      </div>

      <div className="w-full max-w-4xl h-full flex flex-col relative z-10">
        
        {/* 👾 [SECTION 1] MONSTER DISPLAY */}
        <div className="flex-[2.5] min-h-0 flex flex-col justify-center relative px-4 pt-4 transition-all duration-500">
           <BossFrame monster={monster} isWorldBoss={isWorldBoss} isShiny={isShiny} isBoss={isTrulyBoss} lootResult={lootResult}>
            <div className="relative h-full flex items-center justify-center scale-110 sm:scale-100">
              <div className="absolute inset-0 pointer-events-none z-[110] flex items-center justify-center">
                {skillTexts && skillTexts.map((skill) => (
                  <SkillFloatingText key={skill.id} name={skill.name} isWorldBoss={isWorldBoss} />
                ))}
              </div>

              <MonsterDisplay 
                monster={monster} 
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

        {/* 💖 [SECTION 2] STATUS MONITOR */}
        <div className="flex-none px-4 py-1.5 bg-slate-900/60 backdrop-blur-md border-y border-white/5 shadow-2xl relative z-20">
           <PlayerCombatStatus
             player={{
               ...player, 
               atk: displayAtk, 
               def: displayDef, 
               maxHp: finalMaxHp,
               bonus: fullCombatStats.bonus 
             }} 
             playerHpPercent={playerHpPercent}
             activePassiveTooltip={activePassiveTooltip}
             setActivePassiveTooltip={setActivePassiveTooltip}
           />
        </div>

        {/* 🎮 [SECTION 3] ACTION CONSOLE */}
        <div className="flex-none bg-slate-900/90 p-4 space-y-3 pb-8 relative z-10">
          
          {/* 🛰️ [NEW] SYSTEM ANALYSIS MONITOR - วางไว้นอกปุ่ม เพื่อให้โชว์ตลอดเวลา */}
          <div className="mb-2 overflow-hidden rounded-3xl border border-white/10 bg-black/80 shadow-2xl backdrop-blur-xl ring-1 ring-white/5">
            <div className="flex justify-between items-center px-4 py-1.5 bg-white/5 border-b border-white/10">
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
                <span className="text-[10px] font-black text-amber-500 tracking-[0.2em] uppercase italic">System_Intelligence_Matrix</span>
              </div>
              <span className="text-[8px] font-bold text-slate-500 font-mono italic">DATA_SYNC_ACTIVE</span>
            </div>
            
            <div className="p-4 grid grid-cols-2 gap-6 relative">
              <div className="absolute top-4 bottom-4 left-1/2 w-px bg-white/5" />

              {/* ฝั่งซ้าย: รวมการเพิ่มขึ้นของพลัง (Stat Progression) */}
              <div className="space-y-1.5">
                <p className="text-[7px] font-black text-slate-500 uppercase tracking-widest mb-1 italic">Power_Analysis</p>
                <div className="flex justify-between items-center text-[10px]">
                  <span className="text-slate-400">Total_Atk:</span>
                  <span className="font-mono font-black text-white">{displayAtk} <span className="text-[8px] text-amber-400">({statAnalysis.mastery}%)</span></span>
                </div>
                <div className="flex justify-between items-center text-[10px]">
                  <span className="text-slate-400">Total_Def:</span>
                  <span className="font-mono font-black text-sky-400">{displayDef}</span>
                </div>
                <div className="flex justify-between items-center text-[10px]">
                  <span className="text-slate-400">Total_HP:</span>
                  <span className="font-mono font-black text-emerald-400">{finalMaxHp}</span>
                </div>
                <div className="pt-1.5 mt-1 border-t border-white/5 flex justify-between items-center">
                  <span className="text-[8px] font-black text-orange-500 uppercase">Skill_Mult:</span>
                  <span className="text-[10px] font-black text-white italic">x{attackSkill?.multiplier || 1.0}</span>
                </div>
              </div>

              {/* ฝั่งขวา: พลังพิเศษ (Tactical Data) */}
              <div className="space-y-1.5">
                <p className="text-[7px] font-black text-slate-500 uppercase tracking-widest mb-1 italic">Tactical_Data</p>
                <div className="flex justify-between items-center text-[10px]">
                  <span className="text-slate-400">Armor_Pen:</span>
                  <span className="font-mono font-black text-orange-400">{(fullCombatStats.bonus.pen * 100).toFixed(0)}%</span>
                </div>
                <div className="flex justify-between items-center text-[10px]">
                  <span className="text-slate-400">Reflect:</span>
                  <span className="font-mono font-black text-cyan-400">{(fullCombatStats.bonus.reflect * 100).toFixed(0)}%</span>
                </div>
                <div className="flex justify-between items-center text-[10px]">
                  <span className="text-slate-400">Crit_Rate:</span>
                  <span className="font-mono font-black text-purple-400">{(fullCombatStats.critRate * 100).toFixed(1)}%</span>
                </div>
                <div className="flex justify-between items-center text-[10px]">
                  <span className="text-slate-400">Crit_Dmg:</span>
                  <span className="font-mono font-black text-purple-300">{(fullCombatStats.critDamage * 100).toFixed(0)}%</span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex gap-2 h-12 sm:h-14">
            <button 
              onClick={onAttack}
              disabled={isInputLocked}
              className={`flex-[3.5] rounded-2xl font-black italic text-sm sm:text-base tracking-widest transition-all active:scale-95 shadow-xl border-b-4 ${
                isInputLocked 
                  ? 'bg-slate-800 border-slate-950 text-slate-600' 
                  : 'bg-white text-slate-950 border-slate-300'
              }`}
            >
              ATTACK
            </button>
            <button 
              onClick={onFlee}
              disabled={isInputLocked}
              className={`flex-1 rounded-2xl font-black text-[9px] sm:text-[10px] tracking-tighter transition-all active:scale-95 shadow-lg border-b-4 ${
                isInputLocked
                  ? 'bg-slate-900 border-slate-950 text-slate-700'
                  : 'bg-slate-800 border-slate-950 text-red-500 hover:text-red-400'
              }`}
            >
              FLEE
            </button>
          </div>

          <div className="grid grid-cols-2 gap-3 h-14 sm:h-20">
            <button
              onClick={() => attackSkill && handleUseSkill(attackSkill)}
              disabled={isInputLocked || !attackSkill}
              className={`group relative rounded-2xl border-2 transition-all active:scale-95 overflow-hidden flex flex-col items-center justify-center shadow-lg ${
                !isInputLocked && attackSkill
                  ? 'border-orange-500/50 bg-gradient-to-br from-orange-600/20 to-red-950/60'
                  : 'border-white/5 bg-slate-900 opacity-40'
              }`}
            >
              <div className="absolute top-0.5 left-2 text-[6px] font-black text-orange-400 opacity-70 italic tracking-widest uppercase">Offensive</div>
              <span className="text-lg sm:text-2xl mb-0.5">{attackSkill?.icon || '⚔️'}</span>
              <span className="text-[8px] sm:text-[10px] font-black uppercase text-white truncate px-2 italic">
                {attackSkill?.name || 'Empty'}
              </span>
            </button>

            <button
              onClick={() => supportSkill && handleUseSkill(supportSkill)}
              disabled={isInputLocked || !supportSkill}
              className={`group relative rounded-2xl border-2 transition-all active:scale-95 overflow-hidden flex flex-col items-center justify-center shadow-lg ${
                !isInputLocked && supportSkill
                  ? 'border-cyan-500/50 bg-gradient-to-br from-cyan-600/20 to-blue-950/60'
                  : 'border-white/5 bg-slate-900 opacity-40'
              }`}
            >
              <div className="absolute top-0.5 left-2 text-[6px] font-black text-cyan-400 opacity-70 italic tracking-widest uppercase">Support</div>
              <span className="text-lg sm:text-2xl mb-0.5">{supportSkill?.icon || '✨'}</span>
              <span className="text-[8px] sm:text-[10px] font-black uppercase text-white truncate px-2 italic">
                {supportSkill?.name || 'Empty'}
              </span>
            </button>
          </div>
        </div>
      </div>

      <VictoryLootModal lootResult={lootResult} monster={monster} hasSkillDropped={hasSkillDropped} onFinalize={() => finalizeCombat(onCloseCombat)} stats={player} />
    </div>
  );
}