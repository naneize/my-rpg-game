// ✅ สร้างไฟล์ใหม่ที่: src/hooks/useWorldBossSync.js
import { useEffect } from 'react';
import { ref, onValue } from "firebase/database";
import { rtdb } from "../firebase";

export function useWorldBossSync(isCombat, enemy, setEnemy, combatPhase, executeVictory, setGameState) {
  useEffect(() => {
    if (isCombat && enemy?.type === 'WORLD_BOSS') {
      const bossRef = ref(rtdb, 'worldEvent');
      
      const unsubscribe = onValue(bossRef, (snapshot) => {
        const data = snapshot.val();
        if (data) {
          setEnemy(prev => {
            if (!prev || prev.hp === data.currentHp) return prev;
            return { ...prev, hp: data.currentHp };
          });

          if ((data.currentHp <= 0 || data.active === false) && 
              combatPhase !== 'VICTORY' && combatPhase !== 'IDLE') {
            executeVictory();
            if (setGameState) setGameState('MAP_SELECTION');
          }
        }
      });

      return () => unsubscribe();
    }
  }, [isCombat, enemy?.type, combatPhase, executeVictory, setEnemy, setGameState]);
}