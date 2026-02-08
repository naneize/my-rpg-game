// src/hooks/useMonsterAI.js
export const useMonsterAI = () => {
  
  const getMonsterAction = (monster, activeStatuses = []) => {

    console.log("DEBUG: Current Monster Data ->", monster);
    if (!monster) return { type: 'basic_attack', skill: null };

    const hpPercent = monster.hp / (monster.maxHp || 100);
    const roll = Math.random();

    // 🐉 --- ส่วนที่ 1: สำหรับ WORLD_BOSS ---
    if (monster.type === 'WORLD_BOSS') {
      if (!monster.bossSkills || monster.bossSkills.length === 0) {
         return { type: 'basic_attack', skill: null };
      }

      const ultimateSkill = monster.bossSkills.find(s => s.isUltimate);
      if (ultimateSkill && hpPercent <= 0.3 && roll <= 0.25) {
        return { type: 'boss_skill', skill: ultimateSkill };
      }

      const hasReflect = activeStatuses.find(s => s.type === 'REFLECT_SHIELD' && s.target === 'monster');
      const shieldSkill = monster.bossSkills.find(s => s.id === 'obsidian_scale');
      if (!hasReflect && shieldSkill && roll <= 0.4) {
        return { type: 'boss_skill', skill: shieldSkill };
      }

      if (roll <= 0.5) { 
        const attackSkills = monster.bossSkills.filter(s => !s.isUltimate && s.id !== 'obsidian_scale');
        if (attackSkills.length > 0) {
          const randomSkill = attackSkills[Math.floor(Math.random() * attackSkills.length)];
          return { type: 'boss_skill', skill: randomSkill };
        }
      }

      return { type: 'basic_attack', skill: null };
    }

    // 👿 --- ส่วนที่ 2: สำหรับมอนสเตอร์ทั่วไป ---
    if (!monster.skills || monster.skills.length === 0) {
      // 🚩 ถ้าตบธรรมดา แต่ตัวมอนสเตอร์มีธาตุ ให้ส่ง "ธาตุตัวมันเอง" ไปด้วยเพื่อให้มีสี
      return { type: 'basic_attack', skill: { element: monster.element } };
    }

    // 1. Special Skill (เลือดต่ำกว่า 20%)
    const specialSkill = monster.skills.find(skill => 
      skill.condition === "Special" && hpPercent <= 0.2
    );
    if (specialSkill) {
      // ✅ ประกันความปลอดภัย: ถ้าในสกิลลืมใส่ element ให้ใช้ element ของตัวมอนสเตอร์แทน
      const skillWithElement = { ...specialSkill, element: specialSkill.element || monster.element };
      console.log(`👿 Special Skill: ${skillWithElement.name} (${skillWithElement.element})`);
      return { type: 'skill', skill: skillWithElement };
    }

    // 2. Active Skill
    const activeSkill = monster.skills.find(skill => 
      skill.condition === "Active" && roll <= (skill.chance || 0.5)
    );
    if (activeSkill) {
      // ✅ ประกันความปลอดภัย: ถ้าในสกิลลืมใส่ element ให้ใช้ element ของตัวมอนสเตอร์แทน
      const skillWithElement = { ...activeSkill, element: activeSkill.element || monster.element };
      console.log(`⚔️ Monster Skill: ${skillWithElement.name} (${skillWithElement.element})`);
      return { type: 'skill', skill: skillWithElement };
    }

    // 🚩 พื้นฐาน: ถ้าตบธรรมดา ส่งธาตุของตัวมอนสเตอร์กลับไปด้วย
    return { type: 'basic_attack', skill: { element: monster.element } };
  };

  return { getMonsterAction };
};