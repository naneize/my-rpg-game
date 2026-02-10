// src/utils/statCalculations.js
import { MONSTER_SKILLS } from '../data/passive';
import { PLAYER_SKILLS } from '../data/playerSkills';
import { EQUIPMENTS } from '../data/equipments'; 

export const calculateFinalStats = (player) => {
  if (!player) return null;

  const bonus = {
    atk: 0, def: 0, hp: 0, 
    // เพิ่มตัวแปรสะสมค่า % แยกออกมา
    atkPercent: 0, defPercent: 0, hpPercent: 0,
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
      // รองรับ % จาก Passive มอนสเตอร์ (ถ้ามี)
      bonus.atkPercent += (s.sync.atkPercent || 0);
      bonus.defPercent += (s.sync.defPercent || 0);
      bonus.hpPercent += (s.sync.hpPercent || 0);
    }
  });

  /// --- ⚔️ C. Equipment Stats (แก้ไขให้ดึงค่าพื้นฐานมารวมด้วย) ---
  if (player.equipment) {
    Object.values(player.equipment).forEach(item => {
      if (item && typeof item === 'object') {
        // 1. ดึงค่าพื้นฐานจากไฟล์ EQUIPMENTS โดยใช้ itemId
        const baseData = EQUIPMENTS.find(e => e.id === item.itemId);
        
        if (baseData) {
          // 2. รวมพลัง: (ค่าพื้นฐานจากไฟล์) + (โบนัสในตัวไอเทม) + (ค่าจากการตีบวก)
          bonus.atk += (baseData.atk || 0) + (item.bonusAtk || 0) + ((item.level || 0) * 2);
          bonus.def += (baseData.def || 0) + (item.bonusDef || 0) + ((item.level || 0) * 2);
          bonus.hp += (baseData.hp || 0) + (item.bonusHp || 0) + ((item.level || 0) * 10);
          
          // 3. รวมค่า % (ถ้ามี)
          bonus.atkPercent += (baseData.atkPercent || 0);
          bonus.defPercent += (baseData.defPercent || 0);
          bonus.hpPercent += (baseData.hpPercent || 0);
        } else {
          // กรณีหา baseData ไม่เจอ (กันพัง) ให้ใช้ค่าในตัวมันเองไปก่อน
          bonus.atk += (item.atk || 0) + (item.bonusAtk || 0);
          bonus.def += (item.def || 0);
          bonus.hp += (item.hp || 0);
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
  if (player.permanentElementPower) {
    Object.entries(player.permanentElementPower).forEach(([el, power]) => {
      if (bonus.hasOwnProperty(el)) {
        bonus[el] += (power || 0);
      }
    });
  }

  // --- 🧮 การคำนวณขั้นสุดท้าย (Final Calculation) ---
  const finalAtk = Math.floor(((player.atk || 0) + bonus.atk) * (1 + bonus.atkPercent));
  const finalDef = Math.floor(((player.def || 0) + bonus.def) * (1 + bonus.defPercent));
  const finalMaxHp = Math.floor(((player.maxHp || 100) + bonus.hp) * (1 + bonus.hpPercent));

  return {
    ...player, 
    finalAtk,
    finalDef,
    finalMaxHp,
    
    // 🟢 ส่งค่าที่เพิ่มขึ้นสุทธิ (รวม % แล้ว) ไปโชว์เป็นเลขสีเขียวใน UI
    displayBonus: {
      atk: finalAtk - (player.atk || 0),
      def: finalDef - (player.def || 0),
      hp: finalMaxHp - (player.maxHp || 100),
      atkPercent: bonus.atkPercent,
      defPercent: bonus.defPercent,
      hpPercent: bonus.hpPercent
    },

    reflectChance: bonus.reflect,
    armorPen: bonus.pen,
    critRate: bonus.crit,
    elementPower: {
      fire: bonus.fire,
      water: bonus.water,
      earth: bonus.earth,
      wind: bonus.wind,
      light: bonus.light,
      dark: bonus.dark,
      poison: bonus.poison
    },
    // รักษาค่าโบนัสดิบไว้ตามเดิม
    bonus: bonus 
  };
};