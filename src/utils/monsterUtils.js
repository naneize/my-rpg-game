// src/utils/monsterUtils.js

export const scaleMonsterToPlayer = (monster, player) => {
  // 🛡️ 0. ตรวจสอบระบบ Fixed Stats (สำหรับ World Boss หรือมอนสเตอร์พิเศษ)
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
  
  // ⚔️ [NEW] ดึงค่าพลังจริงๆ ของผู้เล่น (รวมอาวุธ/ชุดเกราะ) มาใช้คำนวณ
  // ถ้าไม่มีค่า final ให้ใช้ค่าพื้นฐานในตัวไปก่อน
  const currentAtk = player.finalAtk || player.atk || 10;
  const currentDef = player.finalDef || player.def || 7;

  // 📈 1. ตัวคูณตามระดับความหายาก (Rarity Multiplier)
  const rarityMults = {
    Common: 0.6,    
    Uncommon: 0.8,
    Rare: 1.2,
    Epic: 1.8,
    Legendary: 2.5
  };
  const mult = rarityMults[monster.rarity] || 0.6;

  // 🛡️ 2. คำนวณ Stat พื้นฐานที่ควรจะเป็นของผู้เล่น
  const basePlayerHP = 100 + (lv - 1) * 30;  
  
  // 📊 3. คำนวณพลังมอนสเตอร์ (Scaling Logic)
  // ✅ ปรับ HP ให้เก่งตามพลังโจมตี (ATK) ของผู้เล่น: 
  // ยิ่งเราถืออาวุธแรง มอนสเตอร์จะเลือดเยอะขึ้นเพื่อให้ไม่ตายไวเกินไปจ่ะ
  const calculatedHP = Math.floor(
    ((basePlayerHP + currentAtk * 2) * mult * 0.7) + (monster.hp || 0) * 0.1
  );

  const scaledMonster = {
    ...monster,
    level: lv + (monster.isBoss ? 2 : 0),
    hp: calculatedHP,       
    maxHp: calculatedHP,    
    // ⚔️ ปรับ Atk มอนสเตอร์: ให้เก่งตาม Defense ของผู้เล่น 
    // ถ้าเราใส่เกราะหนา มอนสเตอร์จะตีแรงขึ้นเล็กน้อยเพื่อให้ยังมีความท้าทาย
    atk: Math.floor((currentDef * 1.1 * mult) + (lv * 2) + (monster.atk || 0) * 0.1),
    
    // 🛡️ ปรับ Def มอนสเตอร์: ป้องกันตาม Atk ผู้เล่น
    def: Math.floor((currentAtk * 0.3 * mult) + (lv * 1.5) + (monster.def || 0) * 0.1),
    
    exp: Math.floor(lv * 20 * mult),
    gold: Math.floor(lv * 12 * mult),
  };

  return scaledMonster;
};

// ✨ รวมร่างกับ Shiny Logic (คงเดิม 100% ตามที่เธอให้มา)
export const generateFinalMonster = (monster, player, allMonsters) => {
  // 1. ปรับ Stat ให้สมดุลกับเลเวลและอุปกรณ์ผู้เล่นก่อน
  let finalMonster = scaleMonsterToPlayer(monster, player);
  
  // 2. สุ่มดูว่าเป็น Shiny ไหม (เรท 1/100 ตามโค้ดล่าสุดของเธอ)
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