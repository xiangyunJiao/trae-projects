export type Rarity = 'common' | 'rare' | 'epic' | 'legendary';

export type GameMode = 'normal' | 'premium';

export type AnimationState = 'idle' | 'switching' | 'rolling' | 'dropping' | 'showing';

export interface Reward {
  id: string;
  name: string;
  image: string;
  rarity: Rarity;
  color: string;
}

export interface BallState {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  color: string;
  reward: Reward;
}

export interface GachaState {
  mode: GameMode;
  animationState: AnimationState;
  balls: BallState[];
  selectedReward: Reward | null;
  showModal: boolean;
  droppingBallColor: string;
}
