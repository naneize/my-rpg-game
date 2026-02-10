// hooks/useCombatRewards.js
import { useState, useEffect } from 'react';

export function useCombatRewards(monster, player, setPlayer, setLogs, lootResult) {
  const [hasSkillDropped, setHasSkillDropped] = useState(false);

  // เช็คการดรอปสกิลเมื่อชนะ
  useEffect(() => {
    if (lootResult && monster?.skillId) {
      const isAlreadyUnlocked = player.unlockedPassives?.includes(monster.skillId);
      if (!isAlreadyUnlocked) {
        const roll = Math.random();
        const dropChance = monster.skillDropChance || 1;
        if (roll <= dropChance) setHasSkillDropped(true);
      }
    }
  }, [lootResult, monster, player.unlockedPassives]);

  const finalizeCombat = (onCloseCombat) => {
    if (setPlayer && monster) {
      const healAmount = monster.onDeathHeal || 0;
      const maxHp = player.maxHp || player.finalMaxHp;

      if (healAmount > 0 && setLogs) {
        setLogs(prev => [`💖 พลังชีวิตจาก${monster.name}! ฟื้นฟู HP +${healAmount}`, ...prev].slice(0, 10));
      }

      setPlayer(prev => {
        let updatedUnlocked = [...(prev.unlockedPassives || [])];
        if (hasSkillDropped && monster.skillId && !updatedUnlocked.includes(monster.skillId)) {
          updatedUnlocked.push(monster.skillId);
        }

        const newItems = lootResult?.items || [];



        return {
          ...prev,
          hp: Math.min(maxHp, prev.hp + healAmount),
          unlockedPassives: updatedUnlocked,
          inventory: [...newItems, ...prev.inventory],
          monsterKills: { ...prev.monsterKills, [monster.type]: (prev.monsterKills?.[monster.type] || 0) + 1 }
        };
      });
    }
    if (onCloseCombat) onCloseCombat();
  };

  return { hasSkillDropped, finalizeCombat };
}