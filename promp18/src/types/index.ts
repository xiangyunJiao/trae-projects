export type HorseColor = 'white' | 'brown' | 'black';

export type GamePhase = 'idle' | 'countdown' | 'racing' | 'finished' | 'settlement' | 'waiting';

export interface Horse {
  id: number;
  name: string;
  color: HorseColor;
  position: number;
  speed: number;
  baseSpeed: number;
}

export interface Bet {
  horseId: number;
  amount: number;
}

export interface GameState {
  phase: GamePhase;
  countdown: number;
  raceTime: number;
  horses: Horse[];
  winnerId: number | null;
  userCoins: number;
  currentBet: Bet | null;
  showBetModal: boolean;
  showResultModal: boolean;
  isWinner: boolean;
  winAmount: number;
}

export interface CoinData {
  id: number;
  startX: number;
  startY: number;
  endX: number;
  endY: number;
  delay: number;
}
