import { create } from 'zustand';

export type CellType = 'start' | 'destination' | 'reward' | 'punishment' | 'normal' | 'end';
export type RewardType = 'coins' | 'gift' | 'forward' | 'backward';

export interface RewardItem {
  type: RewardType;
  value: number;
  name: string;
  icon: string;
  description: string;
  isPositive: boolean;
}

export interface Cell {
  id: number;
  type: CellType;
  reward?: RewardItem;
  isDestination: boolean;
  destinationName?: string;
}

export interface GameState {
  currentPosition: number;
  isRolling: boolean;
  diceValue: number | null;
  showModal: boolean;
  currentReward: RewardItem | null;
  coins: number;
  hasFinished: boolean;
  cells: Cell[];
  isMoving: boolean;
  
  setCurrentPosition: (pos: number) => void;
  setIsRolling: (rolling: boolean) => void;
  setDiceValue: (value: number | null) => void;
  setShowModal: (show: boolean) => void;
  setCurrentReward: (reward: RewardItem | null) => void;
  setCoins: (coins: number) => void;
  setHasFinished: (finished: boolean) => void;
  setIsMoving: (moving: boolean) => void;
  resetGame: () => void;
}

const generateCells = (): Cell[] => {
  const destinations = [
    { id: 0, name: '起点' },
    { id: 5, name: '神秘岛' },
    { id: 10, name: '宝藏湾' },
    { id: 15, name: '幻境森林' },
    { id: 20, name: '彩虹谷' },
    { id: 25, name: '星辰海' },
    { id: 30, name: '水晶宫' },
    { id: 35, name: '梦幻城' },
    { id: 39, name: '终点' },
  ];

  const cells: Cell[] = [];
  const rewards: RewardItem[] = [
    { type: 'coins', value: 50, name: '金币', icon: '💰', description: '恭喜你获得50金币！', isPositive: true },
    { type: 'coins', value: 100, name: '金币', icon: '💎', description: '恭喜你获得100金币！', isPositive: true },
    { type: 'coins', value: 20, name: '金币', icon: '🪙', description: '恭喜你获得20金币！', isPositive: true },
    { type: 'forward', value: 1, name: '前进', icon: '⏩', description: '恭喜你可以额外前进1步！', isPositive: true },
    { type: 'forward', value: 2, name: '前进', icon: '⏩', description: '恭喜你可以额外前进2步！', isPositive: true },
    { type: 'gift', value: 1, name: '神秘礼物', icon: '🎁', description: '恭喜你获得神秘礼物！', isPositive: true },
    { type: 'gift', value: 1, name: '豪华礼盒', icon: '🎀', description: '恭喜你获得豪华礼盒！', isPositive: true },
    { type: 'gift', value: 1, name: '幸运星', icon: '⭐', description: '恭喜你获得幸运星！', isPositive: true },
    { type: 'backward', value: 1, name: '后退', icon: '💔', description: '很遗憾，你需要后退1步', isPositive: false },
    { type: 'backward', value: 2, name: '后退', icon: '💔', description: '很遗憾，你需要后退2步', isPositive: false },
    { type: 'coins', value: -20, name: '金币', icon: '💸', description: '很遗憾，你损失了20金币', isPositive: false },
  ];

  for (let i = 0; i < 40; i++) {
    const dest = destinations.find(d => d.id === i);
    let cellType: CellType = 'normal';
    let reward: RewardItem | undefined;
    let isDestination = false;
    let destinationName: string | undefined;

    if (i === 0) {
      cellType = 'start';
      isDestination = true;
      destinationName = '起点';
    } else if (i === 39) {
      cellType = 'end';
      isDestination = true;
      destinationName = '终点';
    } else if (dest) {
      cellType = 'destination';
      isDestination = true;
      destinationName = dest.name;
    } else {
      const rand = Math.random();
      if (rand < 0.4) {
        cellType = 'reward';
        const positiveRewards = rewards.filter(r => r.isPositive);
        reward = positiveRewards[Math.floor(Math.random() * positiveRewards.length)];
      } else if (rand < 0.65) {
        cellType = 'punishment';
        const negativeRewards = rewards.filter(r => !r.isPositive);
        reward = negativeRewards[Math.floor(Math.random() * negativeRewards.length)];
      }
    }

    cells.push({
      id: i,
      type: cellType,
      reward,
      isDestination,
      destinationName,
    });
  }

  return cells;
};

export const useGameStore = create<GameState>((set) => ({
  currentPosition: 0,
  isRolling: false,
  diceValue: null,
  showModal: false,
  currentReward: null,
  coins: 0,
  hasFinished: false,
  cells: generateCells(),
  isMoving: false,
  
  setCurrentPosition: (pos) => set({ currentPosition: pos }),
  setIsRolling: (rolling) => set({ isRolling: rolling }),
  setDiceValue: (value) => set({ diceValue: value }),
  setShowModal: (show) => set({ showModal: show }),
  setCurrentReward: (reward) => set({ currentReward: reward }),
  setCoins: (coins) => set({ coins }),
  setHasFinished: (finished) => set({ hasFinished: finished }),
  setIsMoving: (moving) => set({ isMoving: moving }),
  
  resetGame: () => set({
    currentPosition: 0,
    isRolling: false,
    diceValue: null,
    showModal: false,
    currentReward: null,
    coins: 0,
    hasFinished: false,
    cells: generateCells(),
    isMoving: false,
  }),
}));
