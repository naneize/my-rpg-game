// src/utils/statCalculations.js
import { MONSTER_SKILLS } from '../data/passive';
import { PLAYER_SKILLS } from '../data/playerSkills';
import { EQUIPMENTS } from '../data/equipments'; 

export const calculateFinalStats = (player) => {
  if (!player) return null;

  const bonus = {
    atk: 0, def: 0, hp: 0, 
    reflect: 0, pen: 0, crit: 0,
    fire: 0, water: 0, earth: 0, wind: 0, light: 0, dark: 0, poison: 0
  };

  const unlockedPassives = player?.unlockedPassives || [];
  const equippedPassives = player?.equippedPassives || [null, null, null];
  const equippedActives = player?.equippedActives || [null, null];

  // --- 🔴 A. Permanent Link (ปลดล็อกแล้วได้เลย - ดึงจาก s.perm) ---
  unlockedPassives.forEach(id => {
    const s = MONSTER_SKILLS.find(item => item.id === id);
    if (s && s.perm) {
      bonus.reflect += (s.perm.reflectDamage || 0);
      bonus.pen += (s.perm.armorPen || 0);
      bonus.crit += (s.perm.critRate || 0);
      
      const el = s.element?.toLowerCase();
      if (bonus.hasOwnProperty(el)) {
        bonus[el] += (s.perm.elementPower || 0);
      }
    }
  });

  // --- 🟢 B. Neural Sync (ต้องใส่ใน Slot - ดึงจาก s.sync) ---
  equippedPassives.forEach(id => {
    const s = MONSTER_SKILLS.find(item => item.id === id);
    if (s && s.sync) {
      bonus.atk += (s.sync.atk || 0);
      bonus.def += (s.sync.def || 0);
      bonus.hp += (s.sync.maxHp || 0);
    }
  });

  // --- ⚔️ C. Equipment Stats ---
  if (player.equipment) {
    Object.values(player.equipment).forEach(instanceId => {
      if (instanceId) {
        const invItem = player.inventory?.find(i => i.instanceId === instanceId);
        if (invItem) {
          const baseData = EQUIPMENTS.find(e => e.id === invItem.itemId);
          if (baseData) {
            bonus.atk += (baseData.atk || 0) + (invItem.level * 2) + (invItem.bonusAtk || 0);
            bonus.def += (baseData.def || 0) + (invItem.level * 2);
            bonus.hp += (baseData.hp || 0) + (invItem.level * 10);
          }
        }
      }
    });
  }

  // --- ✨ D. Active Skills Slot (โบนัสแฝงจากสกิล) ---
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
      if (bonus.hasOwnProperty(el)) bonus[el] += (s.elementPower || 0);
    }
  });

  // --- ⭐ E. Permanent Mastery Bonus (จาก Kill Count 100 ตัว) ---
  // ดึงค่าแต้มธาตุถาวรที่สะสมมาจากการฟาร์มมอนสเตอร์มาบวกเพิ่มตรงนี้
  if (player.permanentElementPower) {
    Object.entries(player.permanentElementPower).forEach(([el, power]) => {
      if (bonus.hasOwnProperty(el)) {
        bonus[el] += (power || 0);
      }
    });
  }

  // คำนวณค่าสุทธิ (Final Stats)
  return {
    ...player, 
    finalAtk: (player.atk || 0) + bonus.atk,
    finalDef: (player.def || 0) + bonus.def,
    finalMaxHp: (player.maxHp || 100) + bonus.hp,
    reflectChance: bonus.reflect,
    armorPen: bonus.pen,
    critRate: bonus.crit,
    // ส่งค่าพลังธาตุสุทธิออกไปเพื่อให้ Combat Engine นำไปคูณความแรงสกิล
    elementPower: {
      fire: bonus.fire,
      water: bonus.water,
      earth: bonus.earth,
      wind: bonus.wind,
      light: bonus.light,
      dark: bonus.dark,
      poison: bonus.poison
    },
    bonus: bonus 
  };
};