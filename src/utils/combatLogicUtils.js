// ✅ สร้างไฟล์ใหม่ที่: src/utils/combatLogicUtils.js
export const calculateNetStats = (player, activeStatuses) => {
  let atkMod = 0;
  let defMod = 0;
  
  activeStatuses.forEach(status => {
    if (status.target === 'player' || !status.target) {
      if (status.type === 'BUFF_ATK') atkMod += (status.value || 0);
      if (status.type === 'DEBUFF_ATK') atkMod -= (status.value || 0);
      if (status.type === 'BUFF_DEF') defMod += (status.value || 0);
      if (status.type === 'DEBUFF_DEF') defMod -= (status.value || 0);
    }
  });

  return {
    netAtk: Math.max(1, (player.finalAtk || player.atk) + atkMod),
    netDef: Math.max(0, (player.finalDef || player.def) + defMod)
  };
};