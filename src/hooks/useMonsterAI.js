// src/hooks/useMonsterAI.js
export const useMonsterAI = () => {
  
  const getMonsterAction = (monster, activeStatuses = []) => {
    // 1. ตรวจสอบว่ามอนสเตอร์มีตัวตนไหม
    if (!monster) {
      return { type: 'basic_attack', skill: null };
    }

    const hpPercent = monster.hp / monster.maxHp;
    const roll = Math.random();

    // 🐉 [แก้ไข] Logic สำหรับ World Boss ให้มีการสุ่มโจมตีปกติสลับกับสกิล
    if (monster.type === 'WORLD_BOSS' && monster.bossSkills && monster.bossSkills.length > 0) {
      
      // 🌑 1. เช็คท่าไม้ตาย (Ultimate) เมื่อเลือดต่ำกว่า 30% (โอกาสใช้ 25%)
      const ultimateSkill = monster.bossSkills.find(s => s.isUltimate);
      if (ultimateSkill && hpPercent <= 0.3 && roll <= 0.25) {
        console.log(`🌑 WORLD BOSS: ${monster.name} ปลดปล่อยไม้ตาย [${ultimateSkill.name}]!`);
        return { type: 'boss_skill', skill: ultimateSkill };
      }

      // 🛡️ 2. [เพิ่มใหม่] Logic สำหรับสกิลบัฟ/เกราะ (อย่าง Obsidian Scale)
      // เช็คว่าบอสมีสถานะ REFLECT_SHIELD หรือยัง
      const hasReflect = activeStatuses.find(s => s.type === 'REFLECT_SHIELD' && s.target === 'monster');
      const shieldSkill = monster.bossSkills.find(s => s.id === 'obsidian_scale');


      // ถ้าไม่มีเกราะ และทอยได้โอกาส (เช่น 30%) ให้กางเกล็ดทันที
      if (!hasReflect && shieldSkill && roll <= 0.3) {
        console.log(`🐉 WORLD BOSS: ${monster.name} ใช้สกิลป้องกัน [${shieldSkill.name}]`);
        return { type: 'boss_skill', skill: shieldSkill };
      }


      // ☄️ 3. [เพิ่มการสุ่ม] สุ่มใช้สกิลปกติ 4 ท่าที่เหลือ (โอกาสใช้ 40%)
      // ถ้าทอย roll ได้ 0.40 - 1.0 จะข้ามไปโจมตีปกติแทน
      if (roll <= 0.4) { 
        const normalBossSkills = monster.bossSkills.filter(s => !s.isUltimate);
        if (normalBossSkills.length > 0) {
          const randomBossSkill = normalBossSkills[Math.floor(Math.random() * normalBossSkills.length)];
          console.log(`🐉 WORLD BOSS: ${monster.name} ใช้สกิลบอส [${randomBossSkill.name}]`);
          return { type: 'boss_skill', skill: randomBossSkill };
        }
      }

      // 👊 4. ถ้าไม่เข้าเงื่อนไขสกิล ให้โจมตีปกติ
      return { type: 'basic_attack', skill: null };
    }

    // --- ⬇️ เริ่มโค้ดเดิม 100% สำหรับมอนสเตอร์ทั่วไป ⬇️ ---

    if (!monster.skills || monster.skills.length === 0) {
      return { type: 'basic_attack', skill: null };
    }

    const specialSkill = monster.skills.find(skill => 
      skill.condition === "Special" && hpPercent <= 0.2
    );

    if (specialSkill) {
      console.log(`👿 AI: ${monster.name} ใช้ท่าไม้ตาย [${specialSkill.name}]!`);
      return { type: 'skill', skill: specialSkill };
    }

    const activeSkill = monster.skills.find(skill => 
      skill.condition === "Active" && roll <= (skill.chance || 0.3)
    );

    if (activeSkill) {
      console.log(`⚔️ AI: ${monster.name} ใช้สกิล [${activeSkill.name}]`);
      return { type: 'skill', skill: activeSkill };
    }

    return { type: 'basic_attack', skill: null };
  };

  return { getMonsterAction };
};