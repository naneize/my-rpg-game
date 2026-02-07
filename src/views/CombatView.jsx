import React, { useState, useEffect } from 'react';

// --- Import Sub-Components ---
import VictoryLootModal from '../components/combat/VictoryLootModal';
import MonsterDisplay from '../components/combat/MonsterDisplay';
import PlayerCombatStatus from '../components/combat/PlayerCombatStatus';
import DamageNumber from '../components/DamageNumber.jsx';
import BossFrame from '../components/combat/BossFrame';
import SkillFloatingText from '../components/SkillFloatingText';

// ✅ 1. Import สิ่งที่แยกออกไป (Hooks, Utils, New Components)
import { useCombatRewards } from '../hooks/useCombatRewards';
import { getMonsterTypeInfo, getEffectiveMaxHp } from '../utils/monsterUtils';
import { CombatActionButtons } from '../components/combat/CombatActionButtons';

export default function CombatView({
  monster, player, onAttack, onFlee, lootResult, onCloseCombat, setPlayer,
  monsterSkillUsed, forceShowColor, setLogs,
  combatPhase, damageTexts,
  skillTexts, 
  finalAtk, finalDef, allSkills
}) {

  if (!monster || !player) return null;

  const [showSkills, setShowSkills] = useState(false);
  const [activePassiveTooltip, setActivePassiveTooltip] = useState(null);

  // ✅ 2. ใช้ Hook จัดการเรื่องรางวัลและจบการต่อสู้
  const { hasSkillDropped, finalizeCombat } = useCombatRewards(
    monster, 
    player, 
    setPlayer, 
    setLogs, 
    lootResult
  );

  // ✅ 3. ใช้ Utility เช็คสถานะมอนสเตอร์ (ลบ Logic if-else ยาวๆ ออก)
  const { isWorldBoss, isTrulyBoss, isBoss } = getMonsterTypeInfo(monster);
  const effectiveMaxHp = getEffectiveMaxHp(monster);

  // --- Helper Stats ---
  const displayAtk = finalAtk !== undefined ? finalAtk : (player.finalAtk || player.atk);
  const displayDef = finalDef !== undefined ? finalDef : (player.finalDef || player.def);
  const finalMaxHp = player.maxHp || player.finalMaxHp;

  const playerWithFinalStats = {
    ...player,
    displayAtk,
    displayDef
  };

  const isInputLocked = combatPhase !== 'PLAYER_TURN' || !!lootResult;
  const isShiny = monster?.isShiny || false;

  // ✅ แจ้งเตือนเมื่อมอนสเตอร์ใช้สกิล
  useEffect(() => {
    if (monsterSkillUsed && setLogs) {
      const skillName = monsterSkillUsed.name || "ทักษะพิเศษ";
      setLogs(prev => [`👿 ${monster.name} ใช้สกิล [${skillName}]!`, ...prev].slice(0, 10));
    }
  }, [monsterSkillUsed, setLogs, monster.name]);

  const monsterHpPercent = (monster.hp / effectiveMaxHp) * 100;
  const playerHpPercent = (player.hp / finalMaxHp) * 100;

  return (
    <div className={`relative z-0 w-full h-full flex flex-col items-center overflow-y-auto no-scrollbar text-white transition-colors duration-1000 ${
      isWorldBoss ? 'bg-black' : 'bg-slate-950'
    }`}
      onClick={() => setActivePassiveTooltip(null)}
      style={{
        backgroundImage: isWorldBoss
          ? `radial-gradient(circle at center, #451a03 0%, #000 70%)`
          : `url('https://www.transparenttextures.com/patterns/dark-matter.png'), radial-gradient(#ffffff08 1px, transparent 1px)`,
        backgroundSize: 'auto, 4px 4px',
        backgroundAttachment: 'fixed'
      }}
    >
      <div className="w-full max-w-none md:max-w-7xl flex-1 flex flex-col mx-auto">
        <BossFrame
          monster={monster}
          isWorldBoss={isWorldBoss}
          isShiny={isShiny}
          isBoss={isTrulyBoss}
          lootResult={lootResult}
        >
          {/* 👾 1. ส่วนมอนสเตอร์ */}
          <div className={`flex-none flex flex-col px-2 justify-center min-h-[180px] h-[50vh] relative ${isWorldBoss ? 'pt-6' : 'pt-2'}`}>
            <div className="absolute inset-0 pointer-events-none z-[110] flex items-center justify-center">
              {skillTexts && skillTexts.map((skill) => (
                <SkillFloatingText 
                  key={skill.id} 
                  name={skill.name} 
                  isWorldBoss={isWorldBoss} 
                />
              ))}
            </div>
            <MonsterDisplay
              monster={monster}
              showSkills={showSkills}
              setShowSkills={setShowSkills}
              lootResult={lootResult}
              isBoss={isTrulyBoss}
              monsterHpPercent={monsterHpPercent}
              isShiny={isShiny}
              forceShowColor={forceShowColor}
            />
          </div>

          {/* ⚔️ 2. ส่วนปุ่มกด (ขั้นสุดท้าย: ใช้ Component ที่แยกไป) */}
          <CombatActionButtons 
            onAttack={onAttack}
            onFlee={onFlee}
            isInputLocked={isInputLocked}
            lootResult={lootResult}
            isWorldBoss={isWorldBoss}
            isShiny={isShiny}
            isTrulyBoss={isTrulyBoss}
          />

          {/* 💖 3. ส่วนสเตตัสผู้เล่น */}
          <div className="mt-4 pt-4 border-t border-white/5">
            <PlayerCombatStatus
              player={playerWithFinalStats} 
              playerHpPercent={playerHpPercent}
              activePassiveTooltip={activePassiveTooltip}
              setActivePassiveTooltip={setActivePassiveTooltip}
            />
          </div>
        </BossFrame>
      </div>

      <VictoryLootModal 
        lootResult={lootResult} 
        monster={monster} 
        hasSkillDropped={hasSkillDropped} 
        onFinalize={() => finalizeCombat(onCloseCombat)} 
        stats={player} 
      />
      
      <div className="absolute inset-0 pointer-events-none z-[5] overflow-hidden">
        {damageTexts && damageTexts.map((dmg) => (
          <DamageNumber key={dmg.id} value={dmg.value} type={dmg.type} />
        ))}
      </div>
    </div>
  );
}