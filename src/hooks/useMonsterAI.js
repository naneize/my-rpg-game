// src/hooks/useMonsterAI.js
export const useMonsterAI = () => {
  
  const getMonsterAction = (monster, activeStatuses = []) => {

    console.log("DEBUG: Current Monster Data ->", monster);
    if (!monster) return { type: 'basic_attack', skill: null };

    const hpPercent = monster.hp / monster.maxHp;
    const roll = Math.random();

    // 🐉 --- ส่วนที่ 1: สำหรับ WORLD_BOSS เท่านั้น ---
    if (monster.type === 'WORLD_BOSS') {
      if (!monster.bossSkills || monster.bossSkills.length === 0) {
         return { type: 'basic_attack', skill: null };
      }

      // 🌑 1. Ultimate (HP < 30%)
      const ultimateSkill = monster.bossSkills.find(s => s.isUltimate);
      if (ultimateSkill && hpPercent <= 0.3 && roll <= 0.25) {
        return { type: 'boss_skill', skill: ultimateSkill };
      }

      // 🛡️ 2. Shield Skill (ถ้ายังไม่มีเกราะ)
      const hasReflect = activeStatuses.find(s => s.type === 'REFLECT_SHIELD' && s.target === 'monster');
      const shieldSkill = monster.bossSkills.find(s => s.id === 'obsidian_scale');
      if (!hasReflect && shieldSkill && roll <= 0.4) {
        return { type: 'boss_skill', skill: shieldSkill };
      }

      // ☄️ 3. Normal Boss Skills (สุ่มใช้สกิลโจมตี)
      if (roll <= 0.5) { 
        const attackSkills = monster.bossSkills.filter(s => !s.isUltimate && s.id !== 'obsidian_scale');
        if (attackSkills.length > 0) {
          const randomSkill = attackSkills[Math.floor(Math.random() * attackSkills.length)];
          return { type: 'boss_skill', skill: randomSkill };
        }
      }

      return { type: 'basic_attack', skill: null };
    }

    // 👿 --- ส่วนที่ 2: สำหรับมอนสเตอร์ทั่วไป (รันต่อเมื่อไม่ใช่ WORLD_BOSS) ---
    if (!monster.skills || monster.skills.length === 0) {
      return { type: 'basic_attack', skill: null };
    }

    // 1. Special Skill (เลือดต่ำกว่า 20%)
    const specialSkill = monster.skills.find(skill => 
      skill.condition === "Special" && hpPercent <= 0.2
    );
    if (specialSkill) {
      console.log(`👿 Special Skill: ${specialSkill.name}`);
      return { type: 'skill', skill: specialSkill };
    }

    // 2. Active Skill (โอกาสใช้ ปรับเพิ่มเป็น 50% เพื่อทดสอบ)
    const activeSkill = monster.skills.find(skill => 
      skill.condition === "Active" && roll <= (skill.chance || 0.5)
    );
    if (activeSkill) {
      console.log(`⚔️ Monster Skill: ${activeSkill.name}`);
      return { type: 'skill', skill: activeSkill };
    }

    return { type: 'basic_attack', skill: null };
  };

  return { getMonsterAction };
};