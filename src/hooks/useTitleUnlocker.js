import { useEffect } from 'react';
import { titles as allTitles, checkTitleUnlock } from '../data/titles';

export function useTitleUnlocker(stats, collectionScore, setPlayer, setNewTitlePopup) {
  useEffect(() => {
    allTitles.forEach(title => {
      const isUnlocked = stats.unlockedTitles?.includes(title.id);
      if (checkTitleUnlock(title.id, stats, collectionScore) && !isUnlocked) {
        setNewTitlePopup(title);
        setPlayer(prev => ({ 
          ...prev, 
          unlockedTitles: [...(prev.unlockedTitles || []), title.id] 
        }));
      }
    });
  }, [stats.level, collectionScore, stats.unlockedTitles, setPlayer, setNewTitlePopup]);
}