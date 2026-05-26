import { useState, useEffect, useCallback, useRef } from 'react';
import { Horse, GamePhase, Bet } from '../types';

const RACE_DURATION = 30000;
const COUNTDOWN_DURATION = 10;
const WAITING_DURATION = 60;

const initialHorses: Horse[] = [
  { id: 1, name: '白马', color: 'white', position: 0, speed: 0, baseSpeed: 1 },
  { id: 2, name: '驼马', color: 'brown', position: 0, speed: 0, baseSpeed: 1 },
  { id: 3, name: '黑马', color: 'black', position: 0, speed: 0, baseSpeed: 1 },
];

const determineWinner = (horses: Horse[]): number => {
  const random = Math.random();
  if (random < 0.4) return horses[0].id;
  if (random < 0.75) return horses[1].id;
  return horses[2].id;
};

export const useGameState = () => {
  const [phase, setPhase] = useState<GamePhase>('countdown');
  const [countdown, setCountdown] = useState(COUNTDOWN_DURATION);
  const [raceTime, setRaceTime] = useState(0);
  const [horses, setHorses] = useState<Horse[]>(initialHorses);
  const [winnerId, setWinnerId] = useState<number | null>(null);
  const [userCoins, setUserCoins] = useState(10000);
  const [currentBet, setCurrentBet] = useState<Bet | null>(null);
  const [showBetModal, setShowBetModal] = useState(true);
  const [showResultModal, setShowResultModal] = useState(false);
  const [isWinner, setIsWinner] = useState(false);
  const [winAmount, setWinAmount] = useState(0);
  const [showCoinRain, setShowCoinRain] = useState(false);

  const winnerRef = useRef<number | null>(null);
  const animationRef = useRef<number | null>(null);
  const startTimeRef = useRef<number>(0);

  const placeBet = useCallback((bet: Bet) => {
    if (bet.amount <= userCoins) {
      setCurrentBet(bet);
      setUserCoins(prev => prev - bet.amount);
    }
  }, [userCoins]);

  const startRace = useCallback(() => {
    const winner = determineWinner(initialHorses);
    winnerRef.current = winner;
    
    setPhase('racing');
    setRaceTime(0);
    startTimeRef.current = performance.now();
    
    setHorses(prev => prev.map(horse => ({
      ...horse,
      position: 0,
      speed: 0.5 + Math.random() * 0.5,
    })));
  }, []);

  useEffect(() => {
    if (phase !== 'racing') return;

    const animate = () => {
      const elapsed = performance.now() - startTimeRef.current;
      const progress = Math.min(elapsed / RACE_DURATION, 1);

      setRaceTime(elapsed);

      setHorses(prev => prev.map(horse => {
        const isWinnerHorse = horse.id === winnerRef.current;
        
        let speedVariation = 0.8 + Math.random() * 0.4;
        
        if (progress < 0.3) {
          speedVariation *= (0.5 + Math.random() * 0.5);
        } else if (progress > 0.85) {
          if (isWinnerHorse) {
            speedVariation *= 1.3;
          } else {
            speedVariation *= 0.7;
          }
        }

        const baseProgress = progress * 100;
        let targetPosition = baseProgress * speedVariation;

        if (isWinnerHorse) {
          targetPosition = baseProgress * (0.95 + Math.random() * 0.1);
        } else {
          targetPosition = baseProgress * (0.85 + Math.random() * 0.1);
        }

        if (progress >= 1) {
          targetPosition = isWinnerHorse ? 100 : 85 + Math.random() * 10;
        }

        return {
          ...horse,
          position: Math.min(targetPosition, 100),
          speed: speedVariation,
        };
      }));

      if (progress < 1) {
        animationRef.current = requestAnimationFrame(animate);
      } else {
        setPhase('finished');
        setWinnerId(winnerRef.current);
        
        const hasBet = currentBet !== null;
        const didWin = currentBet && currentBet.horseId === winnerRef.current;
        
        setTimeout(() => {
          if (hasBet) {
            if (didWin) {
              setWinAmount(currentBet.amount);
              setIsWinner(true);
              setShowCoinRain(true);
              
              setTimeout(() => {
                setUserCoins(prev => prev + currentBet.amount * 2);
                setShowCoinRain(false);
                setPhase('settlement');
                setShowResultModal(true);
              }, 2000);
            } else {
              setWinAmount(0);
              setIsWinner(false);
              setPhase('settlement');
              setShowResultModal(true);
            }
          } else {
            setPhase('settlement');
          }
        }, 800);
      }
    };

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [phase, currentBet]);

  useEffect(() => {
    if (phase !== 'countdown') return;

    const timer = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          setShowBetModal(false);
          clearInterval(timer);
          startRace();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [phase, startRace]);

  const closeResultModal = useCallback(() => {
    setShowResultModal(false);
    setPhase('waiting');
    setCountdown(WAITING_DURATION);
    setCurrentBet(null);
    setWinnerId(null);
    setWinAmount(0);
    setIsWinner(false);
  }, []);

  useEffect(() => {
    if (phase !== 'waiting') return;

    const timer = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          setHorses(initialHorses.map(h => ({ ...h, position: 0, speed: 0 })));
          setPhase('countdown');
          setCountdown(COUNTDOWN_DURATION);
          setShowBetModal(true);
          return COUNTDOWN_DURATION;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [phase]);

  return {
    phase,
    countdown,
    raceTime,
    horses,
    winnerId,
    userCoins,
    currentBet,
    showBetModal,
    showResultModal,
    isWinner,
    winAmount,
    showCoinRain,
    placeBet,
    setShowBetModal,
    closeResultModal,
  };
};
