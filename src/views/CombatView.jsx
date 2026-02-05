import React, { useState, useEffect, useMemo } from 'react'; 
import { Sword, Footprints } from 'lucide-react'; 

// --- Import Sub-Components ---
import VictoryLootModal from '../components/combat/VictoryLootModal';
import MonsterDisplay from '../components/combat/MonsterDisplay';
import PlayerCombatStatus from '../components/combat/PlayerCombatStatus';

import DamageNumber from '../components/DamageNumber.jsx';
import BossFrame from '../components/combat/BossFrame'; 
import SkillFloatingText from '../components/SkillFloatingText'; // ✅ นำเข้าคอมโพเนนต์ใหม่

import { useCharacterStats } from '../hooks/useCharacterStats';
import { getPassiveBonus } from '../utils/characterUtils';
import { titles as allTitles } from '../data/titles';
import { MONSTER_SKILLS } from '../data/passive';

export default function CombatView({ 
  monster, player, onAttack, onFlee, lootResult, onCloseCombat, dungeonContext, setPlayer, 
  monsterSkillUsed, forceShowColor, setLogs,
  combatPhase, damageTexts,
  collectionBonuses,
  // ✅ [เพิ่มใหม่] รับค่า skillTexts มาจาก useCombat
  skillTexts 
}) {
  
  if (!monster || !player) return null;

  const [showSkills, setShowSkills] = useState(false); 
  const [hasSkillDropped, setHasSkillDropped] = useState(false);
  const [activePassiveTooltip, setActivePassiveTooltip] = useState(null);

  const activeTitle = allTitles.find(t => t.id === player.activeTitleId) || allTitles[0];
  const passiveBonuses = useMemo(() => getPassiveBonus(player.equippedPassives, MONSTER_SKILLS), [player.equippedPassives]);
  const { finalAtk, finalDef, finalMaxHp } = useCharacterStats(player, activeTitle, passiveBonuses, collectionBonuses);

  const playerWithFinalStats = useMemo(() => ({
    ...player,
    maxHp: finalMaxHp,
    atk: finalAtk,
    def: finalDef
  }), [player, finalMaxHp, finalAtk, finalDef]);

  // ✅ ปรับเงื่อนไขการล็อคปุ่ม (ลบ monsterSkillUsed ออกเพื่อให้กดโจมตีต่อเนื่องได้ลื่นไหลขึ้น)
  const isInputLocked = combatPhase !== 'PLAYER_TURN' || !!lootResult;

  const isWorldBoss = monster.isFixedStats && monster.isBoss;
  const isBoss = monster?.isBoss || false;
  const isShiny = monster?.isShiny || false; 

  useEffect(() => {
    if (monsterSkillUsed && setLogs) {
      const skillName = monsterSkillUsed.name || "ทักษะพิเศษ";
      setLogs(prev => [`👿 ${monster.name} ใช้สกิล [${skillName}]!`, ...prev]);
    }
  }, [monsterSkillUsed, setLogs, monster.name]);

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

  const monsterHpPercent = (monster.hp / monster.maxHp) * 100;
  const playerHpPercent = (player.hp / finalMaxHp) * 100;

  const handleFinalizeCombat = () => {
    if (setPlayer && monster) {
      const healAmount = monster.onDeathHeal || 0;
      if (healAmount > 0 && setLogs) {
        setLogs(prevLogs => [`💖 พลังชีวิตจาก${monster.name}! ฟื้นฟู HP +${healAmount}`, ...prevLogs]);
      }
      setPlayer(prev => {
        const newHp = Math.min(prev.maxHp, prev.hp + healAmount);
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

  return (
    <div 
      className={`relative w-full h-full flex flex-col items-center justify-center overflow-hidden px-2 py-1 text-white touch-none transition-colors duration-1000 ${
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
      {/* 🏟️ ระบบชื่อสกิลเด้ง (Floating Skills) แทนที่ Overlay เดิม */}
      <div className="absolute inset-0 pointer-events-none z-[110] overflow-hidden">
        {skillTexts && skillTexts.map((skill) => (
          <SkillFloatingText key={skill.id} name={skill.name} />
        ))}
      </div>

      <BossFrame 
        isWorldBoss={isWorldBoss} 
        isShiny={isShiny} 
        isBoss={isBoss} 
        lootResult={lootResult}
      >
        <div className={`flex-1 flex flex-col px-2 justify-center min-h-0 ${isWorldBoss ? 'pt-10' : 'pt-4'}`}>
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

        <div className="mt-2 sm:mt-5 space-y-1.5 relative z-10">
          <button 
            onClick={onAttack} 
            disabled={isInputLocked} 
            className={`w-full py-3 sm:py-4 text-white font-black rounded-2xl shadow-xl flex items-center justify-center gap-3 text-lg sm:text-xl uppercase italic transition-all
              ${isInputLocked 
                ? 'bg-slate-800 opacity-50 cursor-not-allowed' 
                : isWorldBoss 
                  ? 'bg-gradient-to-r from-amber-700 via-amber-600 to-amber-700 hover:brightness-125 shadow-amber-900/40' 
                  : `bg-gradient-to-r ${isShiny ? 'from-indigo-600 to-purple-600' : 'from-red-700 to-red-600'} active:scale-95 shadow-red-900/20`}
            `}
          >
            <Sword size={18} /> 
            <span>โจมตี!</span>
          </button>

          {!lootResult && (
            <button 
              onClick={onFlee} 
              disabled={isInputLocked} 
              className={`w-full py-2 sm:py-2.5 text-white font-black rounded-2xl shadow-xl flex items-center justify-center gap-3 text-base sm:text-xl uppercase italic transition-all
                ${isInputLocked 
                  ? 'bg-slate-800 opacity-50 cursor-not-allowed' 
                  : 'bg-gradient-to-r from-slate-700 to-slate-600 active:scale-95'}
              `}
            >
              <Footprints size={18} /> <span>ถอยไปตั้งหลัก!</span> 
            </button>
          )}
        </div>

        <div className="mt-2 sm:mt-3">
          <PlayerCombatStatus 
            player={playerWithFinalStats} 
            playerHpPercent={playerHpPercent}
            activePassiveTooltip={activePassiveTooltip}
            setActivePassiveTooltip={setActivePassiveTooltip}
          />
        </div>
      </BossFrame>

      <VictoryLootModal 
        lootResult={lootResult}
        monster={monster}
        hasSkillDropped={hasSkillDropped}
        onFinalize={handleFinalizeCombat}
        stats={player}
      />

      <div className="absolute inset-0 pointer-events-none z-50 overflow-hidden">
        {damageTexts && damageTexts.map((dmg) => (
          <DamageNumber key={dmg.id} value={dmg.value} type={dmg.type} />
        ))}
      </div>
    </div> 
  );
}