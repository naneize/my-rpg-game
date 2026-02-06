// hooks/useStatusEffects.js
import { useState } from 'react';

export function useStatusEffects(setPlayer, setLogs, addDamageText) {
  const [activeStatuses, setActiveStatuses] = useState([]);

  const applyStatus = (effect, target = 'player') => { // เพิ่ม target
    if (!effect) return;
    setActiveStatuses(prev => {
      // เช็คทั้งประเภทและเป้าหมาย
      const exists = prev.find(s => s.type === effect.type && s.target === target);
      if (exists) {
        return prev.map(s => (s.type === effect.type && s.target === target)
          ? { ...effect, target, remainingTurns: effect.duration } : s);
      }
      return [...prev, { ...effect, target, remainingTurns: effect.duration }];
    });
  };

  const processTurn = () => {
    if (activeStatuses.length === 0) return;

    activeStatuses.forEach((status, index) => {
      const delay = index * 400;
      const isLastTurn = status.remainingTurns <= 1;
      // ✅ [เพิ่มใหม่] เช็คว่าเป็นเทิร์นแรกที่สถานะเริ่มทำงานหรือไม่
      const isFirstTurn = status.remainingTurns === status.duration;

      // 🔥 1. สถานะ BURN (คงเดิม)
      if (status.type === 'BURN') {
        const dmg = status.damagePerTurn || 0;
        setPlayer(p => ({ ...p, hp: Math.max(0, p.hp - dmg) }));
        setTimeout(() => {
          if (addDamageText) addDamageText(dmg, 'player_burn');
        }, delay);
        setLogs(l => [`🔥 ไฟเผาไหม้ต่อเนื่อง -${dmg} HP`, ...l].slice(0, 5));
      }

      // 🛡️ 2. สถานะลดพลังป้องกัน (DEBUFF_DEF)
      if (status.type === 'DEBUFF_DEF') {
        setTimeout(() => {
          if (addDamageText) {
            if (isLastTurn) {
              addDamageText(status.value, 'player_recovery_def');
              setLogs(l => [`✨ พลังป้องกันของคุณกลับคืนสู่ปกติ!`, ...l].slice(0, 5));
            } else if (isFirstTurn) {
              addDamageText(status.value, 'debuff_def');
            }
          }
        }, delay);
        if (!isLastTurn) {
          setLogs(l => [`🛡️ พลังป้องกันลดลง -${status.value} (${status.remainingTurns - 1} เทิร์น)`, ...l].slice(0, 5));
        }
      }

      // ⚔️ 3. สถานะลดพลังโจมตี (DEBUFF_ATK)
      if (status.type === 'DEBUFF_ATK') {
        setTimeout(() => {
          if (addDamageText) {
            if (isLastTurn) {
              addDamageText(status.value, 'player_recovery_atk');
              setLogs(l => [`✨ พลังโจมตีของคุณกลับคืนสู่ปกติ!`, ...l].slice(0, 5));
            } else if (isFirstTurn) {
              addDamageText(status.value, 'debuff_atk');
            }
          }
        }, delay);
        if (!isLastTurn) {
          setLogs(l => [`⚔️ พลังโจมตีลดลง -${status.value} (${status.remainingTurns - 1} เทิร์น)`, ...l].slice(0, 5));
        }
      }

      // ✨ 4. สถานะเพิ่มพลังป้องกัน (BUFF_DEF)
      if (status.type === 'BUFF_DEF') {
        setTimeout(() => {
          if (addDamageText) {
            if (isLastTurn) {
              addDamageText(status.value, 'debuff_def');
            } else if (isFirstTurn) {
              addDamageText(status.value, 'buff_def');
            }
          }
        }, delay);
      }

      // ⚡ 5. สถานะเพิ่มพลังโจมตี (BUFF_ATK)
      if (status.type === 'BUFF_ATK') {
        setTimeout(() => {
          if (addDamageText) {
            if (isLastTurn) {
              addDamageText(status.value, 'debuff_atk');
            } else if (isFirstTurn) {
              addDamageText(status.value, 'buff_atk');
            }
          }
        }, delay);
      }

      // 💎 6. [เพิ่มใหม่] สถานะสะท้อนดาเมจ (REFLECT_SHIELD)
      if (status.type === 'REFLECT_SHIELD') {
        if (isFirstTurn) {
          setLogs(l => [`💎 บอสกางเกล็ดนิลกาฬ! ระวังการสะท้อนดาเมจ`, ...l].slice(0, 5));
        }
        if (isLastTurn) {
          setLogs(l => [`💨 เกล็ดนิลกาฬคลายตัวลงแล้ว`, ...l].slice(0, 5));
        }
      }
    });

    setActiveStatuses(prev => {
      const nextStatuses = prev.map(status => ({
        ...status,
        remainingTurns: status.remainingTurns - 1
      }));
      return nextStatuses.filter(s => s.remainingTurns > 0);
    });
  };

  const clearAllStatuses = () => setActiveStatuses([]);

  return { activeStatuses, applyStatus, processTurn, clearAllStatuses };
}