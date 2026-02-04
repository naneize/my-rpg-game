// src/hooks/useMonsterAI.js
export const useMonsterAI = () => {
  
  const getMonsterAction = (monster) => {
    // 1. ตรวจสอบว่ามอนสเตอร์มีสกิลไหม (คงเดิม)
    if (!monster || !monster.skills || monster.skills.length === 0) {
      return { type: 'basic_attack', skill: null };
    }

    // 🛡️ [เพิ่มใหม่] คำนวณเปอร์เซ็นต์เลือดเพื่อเช็คเงื่อนไข Special
    const hpPercent = monster.hp / monster.maxHp;
    const roll = Math.random();

    // 🔵 [แก้ไขลำดับความสำคัญ] เช็คท่าไม้ตาย (Special) ก่อนถ้าเลือดต่ำกว่า 20%
    const specialSkill = monster.skills.find(skill => 
      skill.condition === "Special" && hpPercent <= 0.2
    );

    if (specialSkill) {
      console.log(`👿 AI: ${monster.name} ใช้ท่าไม้ตาย [${specialSkill.name}]!`);
      return { type: 'skill', skill: specialSkill };
    }

    // 🟢 [คงเดิม] สุ่มหา Active Skill ตามค่า chance (เช่น chance: 0.3)
    // เพิ่มการกรองเฉพาะสกิลที่เป็น "Active" เพื่อไม่ให้ไปสุ่มโดนสกิลติดตัวจ่ะ
    const activeSkill = monster.skills.find(skill => 
      skill.condition === "Active" && roll <= (skill.chance || 0.3)
    );

    if (activeSkill) {
      console.log(`⚔️ AI: ${monster.name} ใช้สกิล [${activeSkill.name}]`);
      return { type: 'skill', skill: activeSkill };
    }

    // 4. ถ้าสุ่มไม่โดนสกิล ให้โจมตีปกติ (คงเดิม)
    return { type: 'basic_attack', skill: null };
  };

  return { getMonsterAction };
};