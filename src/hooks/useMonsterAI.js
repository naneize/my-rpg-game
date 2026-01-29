// src/hooks/useMonsterAI.js
export const useMonsterAI = () => {
  
  const getMonsterAction = (monster) => {
    // 1. ตรวจสอบว่ามอนสเตอร์มีสกิลไหม
    if (!monster.skills || monster.skills.length === 0) {
      return { type: 'basic_attack', skill: null };
    }

    // 2. สุ่มตัวเลข 0-1 (เช่น สุ่มได้ 0.2)
    const roll = Math.random();
    
    // 3. ลองหาความสามารถที่มีโอกาสออก (เช่น chance: 0.3)
    // หากสุ่มได้น้อยกว่าหรือเท่ากับค่า chance มอนสเตอร์จะใช้สกิลนั้น
    const activeSkill = monster.skills.find(skill => roll <= (skill.chance || 0.3));

    if (activeSkill) {
      return { type: 'skill', skill: activeSkill };
    }

    // 4. ถ้าสุ่มไม่โดนสกิล ให้โจมตีปกติ
    return { type: 'basic_attack', skill: null };
  };

  return { getMonsterAction };
};