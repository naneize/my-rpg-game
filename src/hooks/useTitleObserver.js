// src/hooks/useTitleObserver.js
import { useEffect } from 'react';
import { titles as allTitles, checkTitleUnlock } from '../data/titles';

export const useTitleObserver = (player, setPlayer, setNewTitlePopup) => {
  useEffect(() => {
    // 1. Logic การคำนวณคะแนนสะสม (ย้ายมาจาก App.jsx)
    const calculateScore = () => {
      if (!player.inventory) return 0;
      const rarityPoints = { Common: 1, Uncommon: 2, Rare: 5, Epic: 10, Legendary: 25 };
      const seenItems = new Set();
      let score = 0;
      player.inventory.forEach(item => {
        if (!seenItems.has(item.name)) {
          score += rarityPoints[item.rarity] || 1;
          seenItems.add(item.name);
        }
      });
      return score;
    };

    const currentCollectionScore = calculateScore();

    // 2. Logic การเช็คเงื่อนไขการปลดล็อก (ดึงฟังก์ชันมาจาก titles.js)
    allTitles.forEach(title => {
      const isPass = checkTitleUnlock(title.id, player, currentCollectionScore); //
      const isAlreadyUnlocked = player.unlockedTitles?.includes(title.id);

      if (isPass && !isAlreadyUnlocked) {
        setNewTitlePopup(title);
        setPlayer(prev => ({
          ...prev,
          unlockedTitles: [...(prev.unlockedTitles || []), title.id]
        }));
      }
    });
    
    // ติดตามการเปลี่ยนแปลงของค่าเหล่านี้เพื่อเช็คฉายาใหม่
  }, [player.level, player.inventory, player.monsterKills, player.totalSteps]);
};