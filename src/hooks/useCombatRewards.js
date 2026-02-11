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
        
        // 1. ตรวจสอบสกิลดรอปจากมอนสเตอร์ (Logic เดิม)
        if (hasSkillDropped && monster.skillId && !updatedUnlocked.includes(monster.skillId)) {
          updatedUnlocked.push(monster.skillId);
        }

        // 2. แยกประเภทจาก Loot Result (Logic ใหม่ตามคำสั่งแม่)
        // ใช้ droppedItems สำหรับของทั่วไป และ droppedCards สำหรับการ์ด
        const newGear = lootResult?.droppedItems || []; 
        const newCards = lootResult?.droppedCards || [];

        // นำ Card ID ที่ได้จาก Loot ไปใส่ใน Collection (unlockedPassives)
        newCards.forEach(card => {
          if (card.skillId && !updatedUnlocked.includes(card.skillId)) {
            updatedUnlocked.push(card.skillId);
          }
        });

        return {
          ...prev,
          hp: Math.min(maxHp, prev.hp + healAmount),
          unlockedPassives: updatedUnlocked,
          // ✅ เฉพาะไอเทมที่ไม่ใช่การ์ดเท่านั้นที่เข้า inventory
          inventory: [...newGear, ...prev.inventory],
          monsterKills: { ...prev.monsterKills, [monster.type]: (prev.monsterKills?.[monster.type] || 0) + 1 }
        };
      });
    }
    if (onCloseCombat) onCloseCombat();
  };

  return { hasSkillDropped, finalizeCombat };
}