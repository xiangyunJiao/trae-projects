import { useState, useCallback } from 'react';
import { Prize, GameState, ShootResult, SaveDirection } from '@/types';
import { prizes, loseProbability, gameConfig } from '@/config/prizes';
import { lottery, generateWinAngle, generateLoseAngle, determineSaveDirection } from '@/utils/probability';
import { playKickSound, playWhooshSound, playMissSound } from '@/utils/sound';

export const useGameLogic = () => {
  const [gameState, setGameState] = useState<GameState>('idle');
  const [shootResult, setShootResult] = useState<ShootResult | null>(null);
  const [showWinModal, setShowWinModal] = useState(false);
  const [showLoseModal, setShowLoseModal] = useState(false);
  const [loseReason, setLoseReason] = useState<'saved' | 'missed'>('saved');

  const handleKick = useCallback(() => {
    if (gameState !== 'idle') return;

    setGameState('kicking');
    setShootResult(null);
    playKickSound();

    setTimeout(() => {
      playWhooshSound();
      const prize = lottery(prizes, loseProbability);
      const isWin = prize !== null;
      
      let angle;
      let reason: 'saved' | 'missed' = 'saved';
      
      if (isWin) {
        angle = generateWinAngle();
      } else {
        reason = Math.random() > 0.5 ? 'saved' : 'missed';
        angle = generateLoseAngle(reason);
      }
      
      const saveDirection = determineSaveDirection(angle.horizontal, isWin);

      const result: ShootResult = {
        isWin,
        prize: prize || undefined,
        angle,
        speed: gameConfig.shootSpeed,
        saveDirection: reason === 'saved' ? saveDirection : (saveDirection || 'center'),
      };

      setShootResult(result);
      setGameState('ballFlying');
      setLoseReason(reason);
    }, 400);
  }, [gameState]);

  const handleBallComplete = useCallback(() => {
    if (!shootResult) return;

    setGameState('result');

    setTimeout(() => {
      if (shootResult.isWin && shootResult.prize) {
        setShowWinModal(true);
      } else {
        playMissSound();
        setShowLoseModal(true);
      }
    }, 300);
  }, [shootResult]);

  const resetGame = useCallback(() => {
    setShowWinModal(false);
    setShowLoseModal(false);
    setGameState('idle');
    setShootResult(null);
  }, []);

  return {
    gameState,
    shootResult,
    showWinModal,
    showLoseModal,
    loseReason,
    handleKick,
    handleBallComplete,
    resetGame,
    isKicking: gameState === 'kicking' || gameState === 'ballFlying',
  };
};
