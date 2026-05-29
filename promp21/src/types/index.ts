export interface LocationData {
  id: number;
  name: string;
  image: string;
  points: number;
  x: number;
  y: number;
  unlocked: boolean;
  claimed: boolean;
}

export interface Reward {
  id: string;
  name: string;
  image: string;
}

export interface PathPoint {
  x: number;
  y: number;
}
