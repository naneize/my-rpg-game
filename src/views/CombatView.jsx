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
  monster, player, onAttack, onFlee, lootResult, onCloseCombat, dungeonContext, setPlayer,
  monsterSkillUsed, forceShowColor, setLogs,
  combatPhase, damageTexts,
  collectionBonuses,
  skillTexts
}) {

  if (!monster || !player) return null;

  const [showSkills, setShowSkills] = useState(false);
  const [hasSkillDropped, setHasSkillDropped] = useState(false);
  const [activePassiveTooltip, setActivePassiveTooltip] = useState(null);

  // ✅ [FIX] ดึงค่าที่ App.jsx รวมมาให้แล้ว
  const playerWithFinalStats = player;
  const finalMaxHp = player.maxHp || player.finalMaxHp;

  const isInputLocked = combatPhase !== 'PLAYER_TURN' || !!lootResult;
  
  // 🛡️ [แก้ไขจุดนี้] แยกสถานะบอสทองออกจากอีลิทแดงให้เด็ดขาด
  // isWorldBoss: บอสโลก (ทองพิเศษ)
  const isWorldBoss = monster.isFixedStats && (monster.isBoss || monster.rarity === 'Legendary');
  
  // isTrulyBoss: บอสใหญ่ประจำแผนที่ (ระดับ Legendary) -> จะส่งไปเป็น 'isBoss' ของ Component ลูก
  const isTrulyBoss = monster?.rarity === 'Legendary' || (monster?.isBoss && !monster?.isMiniBoss);
  
  // isMiniBoss: อีลิทหรือมินิบอส (ระดับ Epic) -> ห้ามรวมเข้าไปใน isTrulyBoss
  const isMiniBoss = monster.isMiniBoss || monster.type === 'ELITE' || monster.rarity === 'Epic';
  
  // ✅ [FIX] นำ isBoss มาใช้กำหนดเงื่อนไขเพื่อให้ตัวแปรทำงานและ Status ที่ Fix ไว้ถูกดึงมาใช้
  // ถ้าเป็นบอส (Legendary/Epic) ให้ใช้ MaxHP จากข้อมูลมอนสเตอร์โดยตรงเพื่อไม่ให้ค่าหาย
  const isBoss = isTrulyBoss || isWorldBoss || isMiniBoss; 
  const effectiveMaxHp = (isBoss || monster.isFixedStats) ? monster.maxHp : (monster.maxHp || 100);

  const isShiny = monster?.isShiny || false;

  // --- Logic เดิมครบทุกบรรทัด ---
  useEffect(() => {
    if (monsterSkillUsed && setLogs) {
      const skillName = monsterSkillUsed.name || "ทักษะพิเศษ";
      setLogs(prev => [`👿 ${monster.name} ใช้สกิล [${skillName}]!`, ...prev].slice(0, 10));
    }
  }, [monsterSkillUsed, setLogs, monster.name]);

  useEffect(() => {
    if (lootResult && monster.skillId) {
      const isAlreadyUnlocked = player.unlockedPassives?.includes(monster.skillId);
      if (!isAlreadyUnlocked) {
        const roll = Math.random();
        const dropChance = monster.skillDropChance || 1;
        if (roll <= dropChance) setHasSkillDropped(true);
      }
    }
  }, [lootResult, monster.skillId, player.unlockedPassives, monster.skillDropChance]);

  // ✅ ใช้ effectiveMaxHp ที่คำนวณจากการเช็ค isBoss เพื่อความแม่นยำ
  const monsterHpPercent = (monster.hp / effectiveMaxHp) * 100;
  const playerHpPercent = (player.hp / finalMaxHp) * 100;

  const handleFinalizeCombat = () => {
    if (setPlayer && monster) {
      const healAmount = monster.onDeathHeal || 0;
      if (healAmount > 0 && setLogs) {
        setLogs(prevLogs => [`💖 พลังชีวิตจาก${monster.name}! ฟื้นฟู HP +${healAmount}`, ...prevLogs].slice(0, 10));
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
          monsterKills: { ...prev.monsterKills, [monster.type]: (prev.monsterKills?.[monster.type] || 0) + 1 }
        };
      });
    }
    if (onCloseCombat) onCloseCombat();
  };

  return (
    <div
      className={`relative w-full h-[calc(100vh-140px)] md:h-full flex flex-col items-center overflow-y-auto no-scrollbar px-2 py-4 text-white transition-colors duration-1000 pb-24 md:pb-4 ${
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
      <div className="w-full max-w-xl flex-1 flex flex-col justify-between">
        <BossFrame
          monster={monster}
          isWorldBoss={isWorldBoss}
          isShiny={isShiny}
          isBoss={isTrulyBoss} // ✅ ส่งเฉพาะบอสทองจริงๆ เพื่อแยกสไตล์เฟรม
          lootResult={lootResult}
        >
          {/* 👾 1. ส่วนมอนสเตอร์ */}
          <div className={`flex-1 flex flex-col px-2 justify-center min-h-[250px] relative ${isWorldBoss ? 'pt-10' : 'pt-4'}`}>
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
              isBoss={isTrulyBoss} // ✅ ส่งเฉพาะบอสทองจริงๆ เพื่อแยกป้ายชื่อ
              monsterHpPercent={monsterHpPercent}
              isShiny={isShiny}
              forceShowColor={forceShowColor}
            />
          </div>

          {/* ⚔️ 2. ส่วนปุ่มกด */}
          <div className="mt-4 space-y-2 relative z-10 w-full px-2">
            <button
              onClick={onAttack}
              disabled={isInputLocked}
              className={`w-full py-4 text-white font-black rounded-3xl shadow-xl flex items-center justify-center gap-3 text-lg uppercase italic transition-all active:scale-95
                ${isInputLocked
                  ? 'bg-slate-800 opacity-50'
                  : isWorldBoss
                    ? 'bg-gradient-to-r from-amber-700 to-amber-900 shadow-amber-900/40'
                    : `bg-gradient-to-r ${isShiny ? 'from-indigo-600 to-purple-600' : isTrulyBoss ? 'from-amber-600 to-amber-800 shadow-amber-900/40' : 'from-red-700 to-red-600'} shadow-red-900/20`}
              `}
            >
              <Sword size={22} /> <span>โจมตี!</span>
            </button>

            {!lootResult && (
              <button
                onClick={onFlee}
                disabled={isInputLocked}
                className="w-full py-2.5 bg-slate-800 text-white font-black rounded-2xl flex items-center justify-center gap-3 text-sm uppercase italic active:scale-95"
              >
                <Footprints size={18} /> <span>ถอยไปตั้งหลัก!</span>
              </button>
            )}
          </div>

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

      {/* Rewards & Damage Numbers */}
      <VictoryLootModal lootResult={lootResult} monster={monster} hasSkillDropped={hasSkillDropped} onFinalize={handleFinalizeCombat} stats={player} />
      <div className="absolute inset-0 pointer-events-none z-50 overflow-hidden">
        {damageTexts && damageTexts.map((dmg) => (
          <DamageNumber key={dmg.id} value={dmg.value} type={dmg.type} />
        ))}
      </div>
    </div>
  );
}