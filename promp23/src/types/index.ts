export interface Prize {
  id: string;
  name: string;
  image: string;
  value?: number;
  probability: number;
}

export type GameState = 'idle' | 'kicking' | 'ballFlying' | 'result';

export type SaveDirection = 'left' | 'right' | 'center' | null;

export interface ShootResult {
  isWin: boolean;
  prize?: Prize;
  angle: {
    horizontal: number;
    vertical: number;
  };
  speed: number;
  saveDirection: SaveDirection;
}

export interface GameConfig {
  prizes: Prize[];
  loseProbability: number;
  shootSpeed: number;
  goalkeeperReactionTime: number;
}
