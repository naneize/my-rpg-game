import React, { useState, useEffect, useMemo } from 'react'; // ✅ useMemo เดิมยังอยู่
import { Sword, Footprints } from 'lucide-react'; 

// --- Import Sub-Components (แยกไฟล์เพื่อความคลีน) ---
import VictoryLootModal from '../components/combat/VictoryLootModal';
import MonsterDisplay from '../components/combat/MonsterDisplay';
import PlayerCombatStatus from '../components/combat/PlayerCombatStatus';
// ✅ 1. เพิ่มการนำเข้า Overlay สำหรับแสดงชื่อสกิล
import MonsterSkillOverlay from '../components/combat/MonsterSkillOverlay';
import DamageNumber from '../components/DamageNumber.jsx';

// ✅ เพิ่มการ Import เพื่อใช้คำนวณ Stat สุทธิ
import { useCharacterStats } from '../hooks/useCharacterStats';
import { getPassiveBonus } from '../utils/characterUtils';
import { titles as allTitles } from '../data/titles';
import { MONSTER_SKILLS } from '../data/passive';

export default function CombatView({ 
  monster, player, onAttack, onFlee, lootResult, onCloseCombat, dungeonContext, setPlayer, 
  monsterSkillUsed, setLogs,
  combatPhase, damageTexts // ✅ 2. รับ combatPhase มาเพื่อใช้คุมการ Lock ปุ่ม
}) {
  
  if (!monster || !player) return null;

  // 💾 2. STATES (คงเดิม 100%)
  const [showSkills, setShowSkills] = useState(false); 
  const [hasSkillDropped, setHasSkillDropped] = useState(false);

  // ✅ [เพิ่มใหม่] State สำหรับคุม Tooltip ของ Passive บนหน้าจอมือถือ
  const [activePassiveTooltip, setActivePassiveTooltip] = useState(null);

  // ⚔️ [ปรับปรุง] ใช้ useMemo ครอบเพื่อป้องกันการคำนวณ Stat ซ้ำซ้อน
  const activeTitle = allTitles.find(t => t.id === player.activeTitleId) || allTitles[0];
  const passiveBonuses = useMemo(() => getPassiveBonus(player.equippedPassives, MONSTER_SKILLS), [player.equippedPassives]);
  const { finalAtk, finalDef, finalMaxHp } = useCharacterStats(player, activeTitle, passiveBonuses);

  const playerWithFinalStats = useMemo(() => ({
    ...player,
    maxHp: finalMaxHp,
    atk: finalAtk,
    def: finalDef
  }), [player, finalMaxHp, finalAtk, finalDef]);

  // ✅ 3. [เพิ่มใหม่] ตรวจสอบเงื่อนไขการ Lock ปุ่ม
  const isInputLocked = combatPhase !== 'PLAYER_TURN' || !!monsterSkillUsed || !!lootResult;

  // ⚙️ 3. EFFECT: ระบบแจ้งเตือนสกิล (คงเดิม 100%)
  useEffect(() => {
    if (monsterSkillUsed && setLogs) {
      const skillName = monsterSkillUsed.name || "ทักษะพิเศษ";
      setLogs(prev => [`👿 ${monster.name} ใช้สกิล [${skillName}]!`, ...prev]);
    }
  }, [monsterSkillUsed, setLogs, monster.name]);

  // ✅ EFFECT: คำนวณการดรอปสกิล (คงเดิม 100%)
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

  // ⚙️ 5. LOGIC การคำนวณ (คงเดิม 100%)
  const isBoss = monster?.isBoss || false;
  // ✅ ปรับสีแบคกราวแผงควบคุมให้เป็นโทน Midnight สอดคล้องกับพื้นหลังใหม่
  const bgTheme = "from-[#0d1117] via-[#080a0f] to-[#05070a]";
  const monsterHpPercent = (monster.hp / monster.maxHp) * 100;
  const playerHpPercent = (player.hp / finalMaxHp) * 100;

  // ⚙️ 6. FUNCTION จบการต่อสู้ (คงเดิม 100%)
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
    // ✅ [แก้ไข] เปลี่ยน overflow-y-auto เป็น overflow-hidden และใช้ h-[100dvh] 
    // เพื่อให้พื้นหลังครอบคลุมพอดีหน้าจอและไม่มีแถบสไลด์บาร์ด้านข้าง
    <div 
      className="relative w-full h-full flex flex-col items-center justify-center bg-slate-950 overflow-hidden px-2 py-1  text-white touch-none"
    onClick={() => setActivePassiveTooltip(null)}
    style={{
      backgroundColor: '#020617',
      backgroundImage: `
        url('https://www.transparenttextures.com/patterns/dark-matter.png'),
        radial-gradient(#ffffff08 1px, transparent 1px)
      `,
      backgroundSize: 'auto, 4px 4px',
      backgroundAttachment: 'fixed'
    }}
  
    >
      
      {/* ✅ 4. [เพิ่มใหม่] Skill Popup Display */}
      <MonsterSkillOverlay skill={monsterSkillUsed} />

      {/* 🏟️ MAIN BATTLE CARD */}
      {/* ✅ [แก้ไข] ใช้ max-h-[96vh] และลด Padding เล็กน้อยเพื่อให้พอดีกับจอมือถือทุกรุ่น */}
      <div className={`relative w-full max-w-[380px] rounded-[2.5rem] p-2 sm:p-6 shadow-2xl transition-all duration-700 border border-white/10 bg-slate-900/60 backdrop-blur-md
        bg-[url('https://www.transparenttextures.com/patterns/dark-matter.png')]
        ${isBoss ? 'border-red-500/40 shadow-[0_0_50px_rgba(220,38,38,0.2)]' : 'shadow-black/50'} 
        ${(lootResult || monsterSkillUsed) ? 'blur-md grayscale scale-[0.98]' : ''}
        flex flex-col space-y-3 sm:space-y-6 max-h-[96vh] justify-between
      `}>

        {/* ✅ 3. ส่วนแสดงมอนสเตอร์: ใช้ flex-1 เพื่อให้ยืดหยุ่นตามความสูงหน้าจอที่เหลือ */}
        <div className="flex-1 flex flex-col px-2 justify-center min-h-0">
          <MonsterDisplay 
            monster={monster}
            showSkills={showSkills}
            setShowSkills={setShowSkills}
            lootResult={lootResult}
            isBoss={isBoss}
            monsterHpPercent={monsterHpPercent}
          />
        </div>

        {/* ⚔️ 4. ส่วนปุ่มกดโจมตี: ปรับแต่ง Spacing ให้กระชับขึ้นเพื่อกันการล้นจอ */}
        <div className="mt-2 sm:mt-5 space-y-1.5 relative z-10">
          <button 
            onClick={onAttack} 
            disabled={isInputLocked} 
            className={`w-full py-3 sm:py-1 text-white font-black rounded-2xl shadow-xl flex items-center justify-center gap-3 text-lg sm:text-xl uppercase italic transition-all
              ${isInputLocked 
                ? 'bg-slate-800 opacity-50 cursor-not-allowed' 
                : 'bg-gradient-to-r from-red-700 to-red-600 active:scale-95 shadow-red-900/20'}
            `}
          >
            <Sword size={18} /> 
            <span>{monsterSkillUsed ? "กำลังรับมือ..." : "โจมตี!"}</span>
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

        {/* ✅ 5. PLAYER STATUS: ส่วนนี้จะติดอยู่ขอบล่างของการ์ดเสมอ */}
        <div className="mt-2 sm:mt-3">
          <PlayerCombatStatus 
            player={playerWithFinalStats} 
            playerHpPercent={playerHpPercent}
            activePassiveTooltip={activePassiveTooltip}
            setActivePassiveTooltip={setActivePassiveTooltip}
          />
        </div>
      </div>

      {/* 🏆 4. VICTORY LOOT MODAL (คงเดิม 100%) - ✅ ตรวจสอบ Path รูปภาพใน Component นี้ต่อจ่ะ */}
      <VictoryLootModal 
        lootResult={lootResult}
        monster={monster}
        hasSkillDropped={hasSkillDropped}
        onFinalize={handleFinalizeCombat}
      />

      {/* 🎯 [เพิ่มใหม่] เลเยอร์ Damage Text */}
      <div className="absolute inset-0 pointer-events-none z-50 overflow-hidden">
        {damageTexts && damageTexts.map((dmg) => (
          <DamageNumber key={dmg.id} value={dmg.value} type={dmg.type} />
        ))}
      </div>
    </div> 
  );
}