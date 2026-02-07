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
  
  // ⚔️ ดึงค่าพลังจริงๆ ของผู้เล่น (รวมอาวุธ/ชุดเกราะ) มาใช้คำนวณ
  const currentAtk = player.finalAtk || player.atk || 10;
  const currentDef = player.finalDef || player.def || 7;
  const playerMaxHp = player.finalMaxHp || player.maxHp || 100;

  // 📈 1. ตัวคูณตามระดับความหายาก (Rarity Multiplier)
  // ปรับจูนตัวคูณให้มีความต่างที่ชัดเจนขึ้นในระดับสูง
  const rarityMults = { Common: 0.8, Uncommon: 1.0, Rare: 1.4, Epic: 2.0, Legendary: 3.5 };
  const mult = rarityMults[monster.rarity] || 0.8;

  // 📊 2. คำนวณพลังมอนสเตอร์ (Balanced Scaling Logic)

  // ✅ HP มอนสเตอร์: ปรับตาม HP และ ATK ผู้เล่นเพื่อให้สมดุลกับความแรงอาวุธ
  // มอนสเตอร์จะอึดพอให้สู้สนุก แต่ไม่เป็นกระสอบทรายที่ตีไม่ตาย
  const calculatedHP = Math.floor(
    ((playerMaxHp * 0.5) + (currentAtk * 1.5)) * mult
  );

  const scaledMonster = {
    ...monster,
    level: lv + (monster.isBoss ? 2 : 0),
    hp: calculatedHP,       
    maxHp: calculatedHP,    
    
    // ⚔️ ปรับ Atk มอนสเตอร์: อิงตาม Defense ผู้เล่นเพื่อให้ยังมีความท้าทาย (ตบเข้าเนื้อตลอด)
    // ใช้ 0.6 เพื่อให้ดาเมจมอนสเตอร์เฉือนชนะพลังป้องกันเราได้เล็กน้อย
    atk: Math.floor((lv * 5) + (currentDef * 0.6 * mult) + (monster.atk || 0)),
    
    // 🛡️ ปรับ Def มอนสเตอร์: ป้องกันตาม Atk ผู้เล่น "เล็กน้อย"
    // ลดจาก 0.3 เหลือ 0.05 เพื่อให้ผู้เล่นที่อัปดาบมาหนักๆ ยังรู้สึกเทพที่ตีมอนตายไว
    def: Math.floor((lv * 2) + (currentAtk * 0.05 * mult) + (monster.def || 0)),
    
    exp: Math.floor(lv * 25 * mult),
    gold: Math.floor(lv * 15 * mult),
  };

  return scaledMonster;
};

// ✨ รวมร่างกับ Shiny Logic (คงเดิม 100% ตามโครงสร้างเดิม)
export const generateFinalMonster = (monster, player, allMonsters) => {
  // 1. ปรับ Stat ให้สมดุลกับเลเวลและอุปกรณ์ผู้เล่นก่อน
  let finalMonster = scaleMonsterToPlayer(monster, player);
  
  // 2. สุ่มดูว่าเป็น Shiny ไหม (เรท 1/100)
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