// src/utils/monsterUtils.js

export const scaleMonsterToPlayer = (monster, player) => {
  // 🛡️ 0. ตรวจสอบระบบ Fixed Stats (สำหรับ World Boss หรือมอนสเตอร์พิเศษ)
  // ถ้าตั้งค่า isFixedStats ไว้ จะใช้ค่าพลังจากไฟล์ Data โดยตรง ไม่สนเลเวลผู้เล่นจ่ะ
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
  
  // 📈 1. ตัวคูณตามระดับความหายาก (Rarity Multiplier)
  const rarityMults = {
    Common: 0.6,    
    Uncommon: 0.8,
    Rare: 1.2,
    Epic: 1.8,
    Legendary: 2.5
  };
  const mult = rarityMults[monster.rarity] || 0.6;

  // 🛡️ 2. คำนวณ Stat พื้นฐานที่ควรจะเป็นของผู้เล่น (Base on Lv.1: HP 100, ATK 10, DEF 7)
  const basePlayerHP = 100 + (lv - 1) * 30;  
  const basePlayerAtk = 10 + (lv - 1) * 4;   
  const basePlayerDef = 7 + (lv - 1) * 2;    

  // 📊 3. คำนวณพลังมอนสเตอร์ (Scaling Logic)
  // ✅ ใช้ตัวคูณ 0.7 ตามโค้ดล่าสุดของเธอเพื่อให้เลือดดูสมเหตุสมผลขึ้น
  const calculatedHP = Math.floor((basePlayerHP * mult * 0.7) + (monster.hp || 0) * 0.1);

  const scaledMonster = {
    ...monster,
    level: lv + (monster.isBoss ? 2 : 0),
    hp: calculatedHP,       
    maxHp: calculatedHP,    
    // ⚔️ ปรับ Atk เป็น 1.0 ตามที่คุยกัน เพื่อให้มอนสเตอร์เริ่มตีผู้เล่น "เข้า" บ้างจ่ะ
    atk: Math.floor((basePlayerAtk * mult * 1.0) + (monster.atk || 0) * 0.1),
    def: Math.floor((basePlayerDef * mult * 0.5) + (monster.def || 0) * 0.1),
    exp: Math.floor(lv * 20 * mult),
    gold: Math.floor(lv * 12 * mult),
  };

  return scaledMonster;
};

// ✨ รวมร่างกับ Shiny Logic (คงเดิม 100% ตามที่เธอให้มา)
export const generateFinalMonster = (monster, player, allMonsters) => {
  // 1. ปรับ Stat ให้สมดุลกับเลเวลผู้เล่นก่อน (ยกเว้นตัวที่เป็น Fixed Stats)
  let finalMonster = scaleMonsterToPlayer(monster, player);
  
  // 2. สุ่มดูว่าเป็น Shiny ไหม (เรท 0.001)

  const isShiny = Math.floor(Math.random() * 100) === 0;

  // const isShiny = true; // เทสให้เกิด 100%
  
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