// src/utils/statCalculations.js
import { MONSTER_SKILLS } from '../data/passive';
import { PLAYER_SKILLS } from '../data/playerSkills';

export const calculateFinalStats = (player) => {
  const bonus = {
    atk: 0, def: 0, hp: 0, 
    reflect: 0, pen: 0, crit: 0,
    fire: 0, water: 0, earth: 0, wind: 0, light: 0, dark: 0, poison: 0
  };

  const unlockedPassives = player?.unlockedPassives || [];
  const equippedPassives = player?.equippedPassives || [null, null, null];
  const equippedActives = player?.equippedActives || [null, null];

  // A. Permanent Link (Auto-Passive จาก Monster ที่ปลดล็อกแล้ว)
  unlockedPassives.forEach(id => {
    const s = MONSTER_SKILLS.find(item => item.id === id);
    if (s) {
      bonus.hp += (s.bonusMaxHp || 0);
      bonus.reflect += (s.reflectDamage || 0);
      bonus.pen += (s.armorPen || 0);
      bonus.crit += (s.critRate || 0);
      
      const el = s.element?.toLowerCase();
      if (bonus.hasOwnProperty(el)) bonus[el] += (s.elementPower || 5);
    }
  });

  // B. Neural Sync (จาก Monster ที่สวมใส่ใน Slot Essence)
  equippedPassives.forEach(id => {
    const s = MONSTER_SKILLS.find(item => item.id === id);
    if (s) {
      bonus.atk += (s.bonusAtk || 0);
      bonus.def += (s.bonusDef || 0);
      bonus.hp += (s.bonusMaxHp || 0);
    }
  });

  // C. Neural Sync (จาก Active Skills ที่สวมใส่ใน Slot Strike & Assist)
  equippedActives.forEach(id => {
    const s = PLAYER_SKILLS[id];
    if (s) {
      bonus.atk += (s.passiveAtkBonus || 0);
      bonus.def += (s.passiveDefBonus || 0);
      bonus.hp += (s.passiveMaxHpBonus || 0);
      bonus.reflect += (s.passiveReflect || 0);
      bonus.crit += (s.passiveCritRate || 0);
      bonus.pen += (s.passivePenBonus || 0);
      
      const el = s.element?.toLowerCase();
      if (bonus.hasOwnProperty(el)) bonus[el] += (s.elementPower || 10);
    }
  });

  // คืนค่าทั้งตัวแปร Net (รวมแล้ว) และก้อนโบนัส (เผื่อเอาไปโชว์เลขสีเขียว +X)
  return {
    finalAtk: (player.atk || 0) + bonus.atk,
    finalDef: (player.def || 0) + bonus.def,
    finalMaxHp: (player.maxHp || 100) + bonus.hp,
    bonus: bonus // สำหรับโชว์เลขสีเขียวใน CharacterView
  };
};