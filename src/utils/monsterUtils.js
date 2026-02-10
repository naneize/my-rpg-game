/**
 * 🕵️ 1. Monster Type Checker
 */
export const getMonsterTypeInfo = (monster) => {
  if (!monster) return { isWorldBoss: false, isTrulyBoss: false, isMiniBoss: false, isBoss: false };
  const isWorldBoss = monster.isFixedStats && (monster.isBoss || monster.rarity === 'Legendary');
  const isTrulyBoss = monster.rarity === 'Legendary' || (monster.isBoss && !monster.isMiniBoss);
  const isMiniBoss = monster.isMiniBoss || monster.type === 'ELITE' || monster.rarity === 'Epic';
  const isBoss = isTrulyBoss || isWorldBoss || isMiniBoss;
  return { isWorldBoss, isTrulyBoss, isMiniBoss, isBoss };
};

/**
 * 📊 2. Get Effective Max HP
 */
export const getEffectiveMaxHp = (monster) => {
  if (!monster) return 100;
  const { isBoss } = getMonsterTypeInfo(monster);
  if (isBoss || monster.isFixedStats) {
    return monster.maxHp || monster.hp || 100;
  }
  return monster.maxHp || 100;
};

/**
 * 🛡️ 3. Scale Monster To Player (Balanced Version)
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
  const pAtk = player.finalAtk || player.atk || 10;
  const pDef = player.finalDef || player.def || 7;
  const pHp = player.finalMaxHp || player.maxHp || 100;

  const rarityMults = { Common: 0.8, Uncommon: 1.0, Rare: 1.3, Epic: 1.8, Legendary: 3.0 };
  const mult = rarityMults[monster.rarity] || 0.8;

  /**
   * 💡 ปรับปรุงสมดุล HP: 
   * ใช้ Math.sqrt (รากที่สอง) ช่วยบางส่วน เพื่อไม่ให้ HP มอนสเตอร์พุ่งเป็นเส้นตรงตาม ATK ผู้เล่น
   * สูตร: (ฐานเลเวล) + (0.8 * ATK ผู้เล่น) + (โบนัส HP ผู้เล่นบางส่วน)
   */
  const baseHp = lv * 50;
  const scaledHp = (baseHp + (pAtk * 1.2) + (pHp * 0.2)) * mult;
  const finalHP = Math.floor(scaledHp);

  /**
   * 💡 ปรับปรุงสมดุล ATK:
   * มอนสเตอร์ควรตีแรงตามความถึก (DEF) ของผู้เล่น แต่ต้องมีเพดาน
   */
  const finalAtk = Math.floor((lv * 4) + (pDef * 0.4 * mult) + (monster.atk || 0));

  /**
   * 💡 ปรับปรุงสมดุล DEF: 
   * สำคัญมาก! ห้ามให้ DEF มอนสเตอร์สูงตาม ATK ผู้เล่นแบบ Linear 
   * ไม่งั้นพอผู้เล่น ATK 1 ล้าน มอนสเตอร์จะ DEF หลักแสนจนตีไม่เข้า (กลายเป็น 0)
   * สูตรใหม่: ใช้ตัวคูณที่น้อยลงมาก และเน้นค่าคงที่ตามเลเวล
   */
  const finalDef = Math.floor((lv * 1.5) + (Math.sqrt(pAtk) * 2 * mult) + (monster.def || 0));

  return {
    ...monster,
    level: lv + (monster.isBoss ? 2 : 0),
    hp: finalHP,
    maxHp: finalHP,
    atk: finalAtk,
    def: finalDef,
    exp: Math.floor(lv * 25 * mult),
    gold: Math.floor(lv * 15 * mult),
  };
};

/**
 * ✨ 4. Generate Final Monster
 */
export const generateFinalMonster = (monster, player, allMonsters) => {
  let finalMonster = scaleMonsterToPlayer(monster, player);
  
  // ปรับโอกาส Shiny ให้เหมาะสม (ตัวอย่างนี้ 1% ถ้าอยากให้หายาก)
  const isShiny = Math.random() < 0.01; 
  
  if (isShiny) {
    finalMonster = {
      ...finalMonster,
      id: `${finalMonster.id}_shiny`,
      isShiny: true,
      name: `✨ ${finalMonster.name} (SHINY)`,
      hp: Math.floor(finalMonster.hp * 3.0), // Shiny ถึกขึ้น 3 เท่า
      maxHp: Math.floor(finalMonster.maxHp * 3.0),
      atk: Math.floor(finalMonster.atk * 1.5), // แต่ตีแรงขึ้นแค่ 1.5 เท่า (ไม่ให้โหดร้ายเกินไป)
      def: Math.floor(finalMonster.def * 1.2),
      exp: Math.floor(finalMonster.exp * 5),
      gold: Math.floor(finalMonster.gold * 10), // Shiny รวยมาก
    };
  }

  return finalMonster;
};