import { useMemo } from 'react';
// นำเข้าข้อมูลมอนสเตอร์จากทุกแผนที่
import { map1Monsters } from '../data/monsters/map1_meadow';
import { map2Monsters } from '../data/monsters/map2_valley';
import { map3Monsters } from '../data/monsters/map3_woods';
import { map4Monsters } from '../data/monsters/map4_outpost';
import { map5Monsters } from '../data/monsters/map5_fortress';
import { map6Monsters } from '../data/monsters/map6_core';

export function useMonsterCollection(playerStats) {
  // 1. รวมมอนสเตอร์ทั้งหมดในเกม
  const allGameMonsters = useMemo(() => [
    ...map1Monsters, 
    ...(map2Monsters || []), 
    ...(map3Monsters || []), 
    ...(map4Monsters || []), 
    ...(map5Monsters || []), 
    ...(map6Monsters || [])
  ], []);

  // 2. ตรวจสอบชุดมอนสเตอร์ที่สะสมไอเทมดรอปครบแล้ว
  const completedMonsterSets = useMemo(() => {
    // ✅ เพิ่มการเช็ค: ถ้าไม่มีข้อมูล collection ให้คืนค่า Array ว่างทันที ป้องกันหน้าจอขาว
    if (!playerStats?.collection) return [];

    return allGameMonsters.filter(m => {
      const mColl = playerStats.collection[m.id] || [];
      
      // ถ้ามอนสเตอร์ตัวนั้นไม่มีของให้ดรอป (LootTable ว่าง) ไม่นับว่าสะสมได้
      if (!m.lootTable || m.lootTable.length === 0) return false;

      // ✅ [MODIFIED] กรองเอาเฉพาะ Material จริงๆ เท่านั้น
      // ไม่เอา SKILL และไม่เอา EQUIPMENT (ไอเทมที่มี slot หรือ type เป็น EQUIPMENT)
      const requiredArtifacts = m.lootTable.filter(loot => 
        loot.type !== 'SKILL' && 
        loot.type !== 'EQUIPMENT' && 
        !loot.slot
      );

      // ถ้าหลังจากกรองแล้วไม่มีของให้สะสมเลย (เช่น มอนสเตอร์ที่มีแต่ Skill/Equip) ให้ถือว่าไม่นับชุดนี้
      if (requiredArtifacts.length === 0) return false;

      // ✅ เช็คว่าในคลังสะสม (mColl) มีไอเทมวัตถุดิบครบทุกชิ้นไหม
      return requiredArtifacts.every(loot => mColl.includes(loot.name));
    });
  }, [allGameMonsters, playerStats?.collection]);

  return { allGameMonsters, completedMonsterSets };
}