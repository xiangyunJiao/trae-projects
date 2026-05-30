import { Prize, SaveDirection } from '@/types';

export function lottery(prizes: Prize[], loseProbability: number): Prize | null {
  const random = Math.random();
  
  if (random < loseProbability) {
    return null;
  }
  
  const winProbability = 1 - loseProbability;
  const adjustedPrizes = prizes.map(p => ({
    ...p,
    probability: p.probability / winProbability,
  }));
  
  let cumulative = 0;
  const adjustedRandom = (random - loseProbability) / winProbability;
  
  for (const prize of adjustedPrizes) {
    cumulative += prize.probability;
    if (adjustedRandom < cumulative) {
      return prize;
    }
  }
  
  return null;
}

export function generateRandomAngle(): { horizontal: number; vertical: number } {
  const horizontal = (Math.random() * 2 - 1) * 0.9;
  const vertical = Math.random() * 0.7 + 0.2;
  return { horizontal, vertical };
}

export function generateWinAngle(): { horizontal: number; vertical: number } {
  const horizontal = (Math.random() * 2 - 1) * 0.55;
  const vertical = Math.random() * 0.5 + 0.3;
  return { horizontal, vertical };
}

export function generateLoseAngle(reason: 'saved' | 'missed'): { horizontal: number; vertical: number } {
  if (reason === 'missed') {
    const side = Math.random() > 0.5 ? 1 : -1;
    const horizontal = side * (0.75 + Math.random() * 0.25);
    const vertical = Math.random() * 0.6 + 0.15;
    return { horizontal, vertical };
  } else {
    const horizontal = (Math.random() * 2 - 1) * 0.45;
    const vertical = Math.random() * 0.5 + 0.25;
    return { horizontal, vertical };
  }
}

export function determineSaveDirection(
  ballHorizontal: number,
  isWin: boolean
): SaveDirection {
  if (!isWin) {
    const absAngle = Math.abs(ballHorizontal);
    if (absAngle < 0.25) {
      return 'center';
    }
    return ballHorizontal > 0 ? 'right' : 'left';
  }
  
  if (Math.random() > 0.5) {
    return ballHorizontal > 0 ? 'left' : 'right';
  }
  return Math.random() > 0.5 ? 'center' : (ballHorizontal > 0 ? 'right' : 'left');
}
