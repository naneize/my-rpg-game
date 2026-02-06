import React, { useState, useEffect, useMemo } from 'react';
import { Sword, Footprints } from 'lucide-react';

// --- Import Sub-Components ---
import VictoryLootModal from '../components/combat/VictoryLootModal';
import MonsterDisplay from '../components/combat/MonsterDisplay';
import PlayerCombatStatus from '../components/combat/PlayerCombatStatus';

import DamageNumber from '../components/DamageNumber.jsx';
import BossFrame from '../components/combat/BossFrame';
import SkillFloatingText from '../components/SkillFloatingText';

export default function CombatView({
  monster,
  player,
  onAttack,
  onFlee,
  lootResult,
  onCloseCombat,
  dungeonContext,
  setPlayer,
  monsterSkillUsed,
  forceShowColor,
  setLogs,
  combatPhase,
  damageTexts,
  collectionBonuses,
  skillTexts
}) {
  // ==========================================
  // 🛡️ 1. GUARD & INITIAL CHECKS
  // ==========================================
  if (!monster || !player) return null;

  const [showSkills, setShowSkills] = useState(false);
  const [hasSkillDropped, setHasSkillDropped] = useState(false);
  const [activePassiveTooltip, setActivePassiveTooltip] = useState(null);

  // ข้อมูลสเตตัสผู้เล่นที่รวมโบนัสทั้งหมดมาแล้ว
  const playerWithFinalStats = player;
  const finalMaxHp = player.maxHp || player.finalMaxHp || 100;

  // สถานะการควบคุม
  const isInputLocked = combatPhase !== 'PLAYER_TURN' || !!lootResult;
  const isWorldBoss = monster.isFixedStats && monster.isBoss;
  const isMiniBoss = monster.isMiniBoss || monster.type === 'ELITE';
  const isBoss = monster?.isBoss || isMiniBoss || false;
  const isShiny = monster?.isShiny || false;

  // ==========================================
  // 👿 2. EFFECTS (MONSTER LOGIC)
  // ==========================================
  
  // แจ้งเตือนเมื่อมอนสเตอร์ใช้สกิล
  useEffect(() => {
    if (monsterSkillUsed && setLogs) {
      const skillName = monsterSkillUsed.name || "ทักษะพิเศษ";
      setLogs(prev => [`👿 ${monster.name} ใช้สกิล [${skillName}]!`, ...prev].slice(0, 10));
    }
  }, [monsterSkillUsed, setLogs, monster.name]);

  // ระบบสุ่มดรอปสกิลเมื่อจบการต่อสู้
  useEffect(() => {
    if (lootResult && monster.skillId) {
      const isAlreadyUnlocked = player.unlockedPassives?.includes(monster.skillId);
      if (!isAlreadyUnlocked) {
        const roll = Math.random();
        const dropChance = monster.skillDropChance || 1;
        if (roll <= dropChance) {
          setHasSkillDropped(true);
        }
      }
    }
  }, [lootResult, monster.skillId, player.unlockedPassives, monster.skillDropChance]);

  // คำนวณ % พลังชีวิต
  const monsterHpPercent = (monster.hp / monster.maxHp) * 100;
  const playerHpPercent = (player.hp / finalMaxHp) * 100;

  // ==========================================
  // ⚒️ 3. ACTIONS
  // ==========================================
  const handleFinalizeCombat = () => {
    if (setPlayer && monster) {
      const healAmount = monster.onDeathHeal || 0;
      if (healAmount > 0 && setLogs) {
        setLogs(prevLogs => [`💖 พลังชีวิตจาก${monster.name}! ฟื้นฟู HP +${healAmount}`, ...prevLogs].slice(0, 10));
      }
      setPlayer(prev => {
        const newHp = Math.min(prev.maxHp || 100, prev.hp + healAmount);
        let updatedUnlocked = [...(prev.unlockedPassives || [])];
        if (hasSkillDropped && monster.skillId && !updatedUnlocked.includes(monster.skillId)) {
          updatedUnlocked.push(monster.skillId);
        }
        return {
          ...prev,
          hp: newHp,
          unlockedPassives: updatedUnlocked,
          monsterKills: {
            ...prev.monsterKills,
            [monster.type]: (prev.monsterKills?.[monster.type] || 0) + 1
          }
        };
      });
    }
    if (onCloseCombat) onCloseCombat();
  };

  // ==========================================
  // 🎨 4. RENDER
  // ==========================================
  return (
    <div
      /* 🛠️ แก้ไขหลัก: h-[calc(100vh-140px)] และ overflow-y-auto เพื่อให้เต็มจอมือถือและเลื่อนดูสเตตัสได้ */
      className={`relative w-full h-[calc(100vh-140px)] md:h-full flex flex-col items-center overflow-y-auto no-scrollbar px-2 py-4 text-white transition-colors duration-1000 pb-32 md:pb-4 ${
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
      <div className="w-full max-w-xl flex-1 flex flex-col">
        <BossFrame
          monster={monster}
          isWorldBoss={isWorldBoss}
          isShiny={isShiny}
          isBoss={isBoss}
          lootResult={lootResult}
        >
          {/* --- Monster Section --- */}
          <div className={`flex-1 flex flex-col px-2 justify-center min-h-[300px] relative ${isWorldBoss ? 'pt-10' : 'pt-4'}`}>
            <div className="absolute inset-0 pointer-events-none z-[110] flex items-center justify-center">
              {skillTexts && skillTexts.map((skill) => (
                <SkillFloatingText key={skill.id} name={skill.name} />
              ))}
            </div>

            <MonsterDisplay
              monster={monster}
              showSkills={showSkills}
              setShowSkills={setShowSkills}
              lootResult={lootResult}
              isBoss={isBoss}
              monsterHpPercent={monsterHpPercent}
              isShiny={isShiny}
              forceShowColor={forceShowColor}
            />
          </div>

          {/* --- Action Buttons Section --- */}
          <div className="mt-4 sm:mt-5 space-y-2 relative z-10 w-full px-2">
            <button
              onClick={onAttack}
              disabled={isInputLocked}
              className={`w-full py-4 sm:py-5 text-white font-black rounded-3xl shadow-2xl flex items-center justify-center gap-3 text-lg sm:text-xl uppercase italic transition-all
                ${isInputLocked
                  ? 'bg-slate-800 opacity-50 cursor-not-allowed'
                  : isWorldBoss
                    ? 'bg-gradient-to-r from-amber-700 via-amber-600 to-amber-700 hover:brightness-125 shadow-amber-900/40'
                    : `bg-gradient-to-r ${isShiny ? 'from-indigo-600 to-purple-600' : 'from-red-700 to-red-600'} active:scale-95 shadow-red-900/40`}
              `}
            >
              <Sword size={22} />
              <span>โจมตี!</span>
            </button>

            {!lootResult && (
              <button
                onClick={onFlee}
                disabled={isInputLocked}
                className={`w-full py-3 bg-gradient-to-r from-slate-800 to-slate-700 text-white font-black rounded-3xl shadow-xl flex items-center justify-center gap-3 text-sm sm:text-base uppercase italic transition-all active:scale-95`}
              >
                <Footprints size={18} /> <span>ถอยไปตั้งหลัก!</span>
              </button>
            )}
          </div>

          {/* --- Player Status Section (สเตตัสที่หายไป กลับมาแล้ว) --- */}
          <div className="mt-6 sm:mt-8 pt-4 border-t border-white/5">
            <PlayerCombatStatus
              player={playerWithFinalStats}
              playerHpPercent={playerHpPercent}
              activePassiveTooltip={activePassiveTooltip}
              setActivePassiveTooltip={setActivePassiveTooltip}
            />
          </div>
        </BossFrame>
      </div>

      {/* --- Overlays & Floating Numbers --- */}
      <VictoryLootModal
        lootResult={lootResult}
        monster={monster}
        hasSkillDropped={hasSkillDropped}
        onFinalize={handleFinalizeCombat}
        stats={player}
      />

      <div className="absolute inset-0 pointer-events-none z-[200] overflow-hidden">
        {damageTexts && damageTexts.map((dmg) => (
          <DamageNumber key={dmg.id} value={dmg.value} type={dmg.type} />
        ))}
      </div>

      <style jsx>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
}