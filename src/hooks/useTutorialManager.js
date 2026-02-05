import { useState, useEffect } from 'react';

export function useTutorialManager(player, setPlayer, gameState, activeTab) {
  const [tutorialStep, setTutorialStep] = useState(null);

  useEffect(() => {
    const viewed = player.viewedTutorials || [];
    const checkTutorial = (condition, key) => {
      if (condition && !viewed.includes(key)) {
        setTutorialStep(key);
        return true;
      }
      return false;
    };
    
    // ลำดับการเช็คความสำคัญ
    if (checkTutorial(gameState === 'MAP_SELECTION', 'welcome')) return;
    if (checkTutorial(activeTab === 'TRAVEL' && gameState === 'PLAYING', 'travel')) return;
    if (checkTutorial(activeTab === 'PASSIVESKILL', 'passive')) return;
    if (checkTutorial(activeTab === 'COLLECTION', 'collection')) return;
    if (checkTutorial(activeTab === 'CHARACTER', 'character')) return;
  }, [gameState, activeTab, player.viewedTutorials]);

  const closeTutorial = () => {
    if (!tutorialStep) return;
    setPlayer(prev => ({
      ...prev,
      viewedTutorials: [...(prev.viewedTutorials || []), tutorialStep]
    }));
    setTutorialStep(tutorialStep === 'welcome' ? 'map' : null);
  };

  return { tutorialStep, closeTutorial };
}