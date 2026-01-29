import React, { useState, useEffect } from 'react'; 
import { Sword, Footprints } from 'lucide-react'; 

// --- Import Sub-Components (แยกไฟล์เพื่อความคลีน) ---
import VictoryLootModal from '../components/combat/VictoryLootModal';
import MonsterDisplay from '../components/combat/MonsterDisplay';
import PlayerCombatStatus from '../components/combat/PlayerCombatStatus';
// ✅ 1. เพิ่มการนำเข้า Overlay สำหรับแสดงชื่อสกิล
import MonsterSkillOverlay from '../components/combat/MonsterSkillOverlay';

// ✅ เพิ่มการ Import เพื่อใช้คำนวณ Stat สุทธิ
import { useCharacterStats } from '../hooks/useCharacterStats';
import { getPassiveBonus } from '../utils/characterUtils';
import { titles as allTitles } from '../data/titles';
import { MONSTER_SKILLS } from '../data/passive';

export default function CombatView({ 
  monster, player, onAttack, onFlee, lootResult, onCloseCombat, dungeonContext, setPlayer, 
  monsterSkillUsed, setLogs,
  combatPhase // ✅ 2. รับ combatPhase มาเพื่อใช้คุมการ Lock ปุ่ม
}) {
  
  if (!monster || !player) return null;

  // 💾 2. STATES (คงเดิม 100%)
  const [showSkills, setShowSkills] = useState(false); 
  const [hasSkillDropped, setHasSkillDropped] = useState(false);

  // ⚔️ [เพิ่มใหม่] Logic การคำนวณ Stat เพื่อให้หน้า Combat อัปเดตตาม Passive/Title (คงเดิม)
  const activeTitle = allTitles.find(t => t.id === player.activeTitleId) || allTitles[0];
  const passiveBonuses = getPassiveBonus(player.equippedPassives, MONSTER_SKILLS);
  const { finalAtk, finalDef, finalMaxHp } = useCharacterStats(player, activeTitle, passiveBonuses);

  // สร้าง Object จำลองที่มี Stat สุทธิแล้ว เพื่อส่งให้ Sub-components แสดงผล
  const playerWithFinalStats = {
    ...player,
    maxHp: finalMaxHp,
    atk: finalAtk,
    def: finalDef
  };

  // ✅ 3. [เพิ่มใหม่] ตรวจสอบเงื่อนไขการ Lock ปุ่ม (ห้ามกดถ้า: ไม่ใช่เทิร์นเรา, มอนสเตอร์กำลังใช้สกิล, หรือจบการต่อสู้แล้ว)
  const isInputLocked = combatPhase !== 'PLAYER_TURN' || !!monsterSkillUsed || !!lootResult;

  // ⚙️ 3. EFFECT: ระบบแจ้งเตือนสกิล (คงเดิม 100% พร้อมเพิ่ม Logic แจ้งเตือน)
  useEffect(() => {
    if (monsterSkillUsed && setLogs) {
      // ✅ แสดงชื่อสกิลใน Log เมื่อมีการใช้งาน
      const skillName = monsterSkillUsed.name || "ทักษะพิเศษ";
      setLogs(prev => [`👿 ${monster.name} ใช้สกิล [${skillName}]!`, ...prev]);
    }
  }, [monsterSkillUsed, setLogs, monster.name]);

  // ✅ EFFECT: คำนวณการดรอปสกิลเมื่อเข้าสู่สถานะ Loot (มอนสเตอร์ตาย) (คงเดิม 100%)
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
  const bgTheme = dungeonContext?.themeColor || "from-slate-900 to-black";
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
    <div className="w-full max-w-md mx-auto animate-in zoom-in duration-500 relative text-left text-white">
      
      {/* ✅ 4. [เพิ่มใหม่] Skill Popup Display: จะเด้งขึ้นมาเมื่อ monsterSkillUsed มีค่า */}
      <MonsterSkillOverlay skill={monsterSkillUsed} />

      {/* 🏟️ MAIN BATTLE CARD */}
      <div className={`relative rounded-[2.5rem] p-6 shadow-2xl overflow-visible transition-all duration-700 border-2 bg-gradient-to-b ${bgTheme}
        ${isBoss ? 'border-red-500/20 shadow-[0_0_50px_rgba(220,38,38,0.3)]' : 'border-slate-800'} 
        ${(lootResult || monsterSkillUsed) ? 'blur-md grayscale scale-[0.98]' : ''}`}>
        
        {/* ✅ 1. ส่วนแสดงมอนสเตอร์ (คงเดิม 100%) */}
        <MonsterDisplay 
          monster={monster}
          showSkills={showSkills}
          setShowSkills={setShowSkills}
          lootResult={lootResult}
          isBoss={isBoss}
          monsterHpPercent={monsterHpPercent}
        />

        {/* ⚔️ 2. ส่วนปุ่มกดโจมตี (ปรับปรุง: เพิ่ม disabled และการเปลี่ยนสีเมื่อ Lock) */}
        <div className="mt-5 space-y-2 relative z-10">
          <button 
            onClick={onAttack} 
            disabled={isInputLocked} // ✅ ป้องกันการกด
            className={`w-full py-4 text-white font-black rounded-2xl shadow-xl flex items-center justify-center gap-3 text-xl uppercase italic transition-all
              ${isInputLocked 
                ? 'bg-gray-800 opacity-50 cursor-not-allowed' 
                : 'bg-gradient-to-r from-red-700 to-red-600 active:scale-95'}
            `}
          >
            <Sword size={18} /> 
            <span>{monsterSkillUsed ? "กำลังรับมือ..." : "โจมตี!"}</span>
          </button>

          {!lootResult && (
            <button 
              onClick={onFlee} 
              disabled={isInputLocked} // ✅ ป้องกันการกด
              className={`w-full py-2.5 text-white font-black rounded-2xl shadow-xl flex items-center justify-center gap-3 text-xl uppercase italic transition-all
                ${isInputLocked 
                  ? 'bg-gray-800 opacity-50 cursor-not-allowed' 
                  : 'bg-gradient-to-r from-gray-700 to-gray-600 active:scale-95'}
              `}
            >
              <Footprints size={18} /> <span>ถอยไปตั้งหลัก!</span> 
            </button>
          )}
        </div>

        {/* ✅ 3. PLAYER STATUS (คงเดิม 100%) */}
        <PlayerCombatStatus 
          player={playerWithFinalStats} 
          playerHpPercent={playerHpPercent} 
        />
      </div>

      {/* 🏆 4. VICTORY LOOT MODAL (คงเดิม 100%) */}
      <VictoryLootModal 
        lootResult={lootResult}
        monster={monster}
        hasSkillDropped={hasSkillDropped}
        onFinalize={handleFinalizeCombat}
      />
    </div> 
  );
}