// src/utils/monsterUtils.js

/**
 * 🕵️ 1. Monster Type Checker
 * แยกแยะสถานะของมอนสเตอร์เพื่อใช้ใน UI และ Logic การคำนวณ
 */
export const getMonsterTypeInfo = (monster) => {
  if (!monster) return { isWorldBoss: false, isTrulyBoss: false, isMiniBoss: false, isBoss: false };

  // World Boss: มีค่า Stats คงที่ และเป็นระดับตำนาน
  const isWorldBoss = monster.isFixedStats && (monster.isBoss || monster.rarity === 'Legendary');
  
  // Truly Boss: บอสใหญ่ประจำแผนที่ (ไม่ใช่บอสโลก และไม่ใช่ Mini Boss)
  const isTrulyBoss = monster.rarity === 'Legendary' || (monster.isBoss && !monster.isMiniBoss);
  
  // Mini Boss / Elite: พวกมอนสเตอร์ม่วง หรือระดับสูง
  const isMiniBoss = monster.isMiniBoss || monster.type === 'ELITE' || monster.rarity === 'Epic';
  
  // รวมสถานะ "บอส" ทุกประเภท
  const isBoss = isTrulyBoss || isWorldBoss || isMiniBoss;

  return { isWorldBoss, isTrulyBoss, isMiniBoss, isBoss };
};

/**
 * 📊 2. Get Effective Max HP
 * คืนค่า HP สูงสุดที่แท้จริง โดยเช็คเงื่อนไข Stats คงที่และสถานะบอส
 */
export const getEffectiveMaxHp = (monster) => {
  if (!monster) return 100;
  const { isBoss } = getMonsterTypeInfo(monster);
  
  // ถ้าเป็นบอส หรือเป็นมอนสเตอร์ที่มีการตั้งค่า Stats มาจากตัวแปรตรงๆ ให้ใช้ค่า maxHp ของมัน
  if (isBoss || monster.isFixedStats) {
    return monster.maxHp || monster.hp || 100;
  }
  
  // กรณีมอนสเตอร์ทั่วไป (กันเหนียว)
  return monster.maxHp || 100;
};

/**
 * 🛡️ 3. Scale Monster To Player
 * ปรับจูน Stat มอนสเตอร์ตามความเก่งของผู้เล่น
 */
export const scaleMonsterToPlayer = (monster, player) => {
  if (monster.isFixedStats) {
    return {
      ...monster,
      hp: monster.hp,
      maxHp: monster.maxHp || monster.hp,
      atk: monster.atk,
      def: monster.def,
      exp: monster.exp || 100,
      gold: monster.gold || 50
    };
  }

  const lv = player.level || 1;
  const currentAtk = player.finalAtk || player.atk || 10;
  const currentDef = player.finalDef || player.def || 7;
  const playerMaxHp = player.finalMaxHp || player.maxHp || 100;

  const rarityMults = { Common: 0.8, Uncommon: 1.0, Rare: 1.4, Epic: 2.0, Legendary: 3.5 };
  const mult = rarityMults[monster.rarity] || 0.8;

  const calculatedHP = Math.floor(((playerMaxHp * 0.5) + (currentAtk * 1.5)) * mult);

  const scaledMonster = {
    ...monster,
    level: lv + (monster.isBoss ? 2 : 0),
    hp: calculatedHP,
    maxHp: calculatedHP,
    atk: Math.floor((lv * 5) + (currentDef * 0.6 * mult) + (monster.atk || 0)),
    def: Math.floor((lv * 2) + (currentAtk * 0.05 * mult) + (monster.def || 0)),
    exp: Math.floor(lv * 25 * mult),
    gold: Math.floor(lv * 15 * mult),
  };

  return scaledMonster;
};

/**
 * ✨ 4. Generate Final Monster
 * รวมร่างกับ Shiny Logic
 */
export const generateFinalMonster = (monster, player, allMonsters) => {
  let finalMonster = scaleMonsterToPlayer(monster, player);
  const isShiny = Math.floor(Math.random() * 100) === 0;
  
  if (isShiny) {
    finalMonster = {
      ...finalMonster,
      id: `${finalMonster.id}_shiny`,
      isShiny: true,
      name: `✨ ${finalMonster.name} (SHINY)`,
      hp: Math.floor(finalMonster.hp * 2.5),
      maxHp: Math.floor(finalMonster.maxHp * 2.5),
      atk: Math.floor(finalMonster.atk * 2.5),
      def: Math.floor(finalMonster.def * 2.5),
      exp: Math.floor(finalMonster.exp * 4),
      gold: Math.floor(finalMonster.gold * 4),
    };
  }

  return finalMonster;
};