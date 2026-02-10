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
 * ปรับปรุงให้รองรับ Passive Core และการเพิ่มพลังแบบก้าวกระโดด
 */
export const scaleMonsterToPlayer = (monster, player) => {
  
  // ดึงค่าสเตตัสผู้เล่น (ใช้ตัวแปรเดิม)
  const lv = player.level || 1;
  const pAtk = player.finalAtk || player.atk || 10;
  const pDef = player.finalDef || player.def || 7;
  const pHp = player.finalMaxHp || player.maxHp || 100;

  // 🕵️ เช็คประเภทก่อนคำนวณ
  const { isWorldBoss, isBoss } = getMonsterTypeInfo(monster);

  // ตัวคูณตามระดับความหายาก (ใช้ตัวแปรเดิม แต่ปรับตัวเลขให้ตึงขึ้น)
  const rarityMults = { Common: 1.0, Uncommon: 1.2, Rare: 1.6, Epic: 2.5, Legendary: 4.5 };
  const mult = rarityMults[monster.rarity] || 1.0;
  if (isWorldBoss) mult = 8.0;

  /**
   * 💡 ปรับปรุงสมดุล HP:
   * รองรับดาเมจจาก Passive Core ที่อาจจะแรงมาก
   * มอนสเตอร์จะถึกขึ้นตาม ATK ผู้เล่น เพื่อให้การต่อสู้ไม่จบใน 1 วินาที
   */
  const bossHpFactor = isWorldBoss ? 5 : (isBoss ? 1.5 : 1); // บอสเลือดเยอะขึ้นอีก 5 เท่าจากสูตรปกติ
  const baseHp = lv * 100; // ฐานตามเลเวล
  const scaledHp = (baseHp + (pAtk * 7.5) + (pHp * 0.2)) * mult * bossHpFactor;
  const finalHP = Math.floor(scaledHp);

  /**
   * 💡 ปรับปรุงสมดุล ATK:
   * มอนสเตอร์ตีเจ็บขึ้นตามความถึกของผู้เล่น เพื่อบีบให้ต้องหา Passive Core สายป้องกัน
   */
      const finalAtk = Math.floor(((lv * 10) + (pDef * 0.45) + (monster.atk || 0)) * mult);
  /**
   * 💡 ปรับปรุงสมดุล DEF:
   * ใช้ Math.pow แทน Math.sqrt เพื่อคุมเพดาน DEF ไม่ให้สูงจนผู้เล่นตีไม่เข้า
   * สูตร: (ฐานเลเวล) + (ATK ผู้เล่นยกกำลัง 0.42)
   */
      const finalDef = Math.floor(((lv * 4) + (Math.pow(pAtk, 0.42) * 6)) * mult);


  return {
    ...monster,
    level: lv + (isBoss ? 2 : 0),
    hp: finalHP,
    maxHp: finalHP,
    atk: finalAtk,
    def: finalDef,
    exp: Math.floor(lv * 35 * mult),
    gold: Math.floor(lv * 25 * mult),
  };
};

/**
 * ✨ 4. Generate Final Monster
 */
export const generateFinalMonster = (monster, player, allMonsters) => {
  let finalMonster = scaleMonsterToPlayer(monster, player);
  
  // โอกาสเกิด Shiny 1%
  const isShiny = Math.random() < 0.01; 
  
  if (isShiny) {
    finalMonster = {
      ...finalMonster,
      id: `${finalMonster.id}_shiny`,
      isShiny: true,
      name: `✨ ${finalMonster.name} (SHINY)`,
      hp: Math.floor(finalMonster.hp * 3.5), // Shiny ถึกขึ้น 3.5 เท่า
      maxHp: Math.floor(finalMonster.maxHp * 3.5),
      atk: Math.floor(finalMonster.atk * 1.5), 
      def: Math.floor(finalMonster.def * 1.3),
      exp: Math.floor(finalMonster.exp * 5),
      gold: Math.floor(finalMonster.gold * 10),
    };
  }

  return finalMonster;
};