import type { Reward, BallState } from '../types';

const BALL_COLORS = [
  '#FF6B6B',
  '#4ECDC4',
  '#FFE66D',
  '#95E1D3',
  '#F38181',
  '#AA96DA',
  '#FCBAD3',
  '#A8D8EA',
];

const NORMAL_REWARDS: Reward[] = [
  { id: 'n1', name: '小糖果', image: '🍬', rarity: 'common', color: '#FF6B6B' },
  { id: 'n2', name: '万圣节贴纸', image: '🎃', rarity: 'common', color: '#4ECDC4' },
  { id: 'n3', name: '小玩具', image: '🧸', rarity: 'common', color: '#FFE66D' },
  { id: 'n4', name: '幽灵饼干', image: '👻', rarity: 'common', color: '#95E1D3' },
  { id: 'n5', name: '蝙蝠徽章', image: '🦇', rarity: 'rare', color: '#F38181' },
  { id: 'n6', name: '万圣节面具', image: '🎭', rarity: 'rare', color: '#AA96DA' },
  { id: 'n7', name: '南瓜灯', image: '🎃', rarity: 'rare', color: '#FCBAD3' },
  { id: 'n8', name: '怪兽玩偶', image: '👹', rarity: 'epic', color: '#A8D8EA' },
];

const PREMIUM_REWARDS: Reward[] = [
  { id: 'p1', name: '限量徽章', image: '🏅', rarity: 'rare', color: '#FF6B6B' },
  { id: 'p2', name: '魔法水晶', image: '🔮', rarity: 'rare', color: '#4ECDC4' },
  { id: 'p3', name: '神秘药水', image: '🧪', rarity: 'rare', color: '#FFE66D' },
  { id: 'p4', name: '魔法棒', image: '🪄', rarity: 'epic', color: '#95E1D3' },
  { id: 'p5', name: '黄金南瓜', image: '🎃', rarity: 'epic', color: '#F38181' },
  { id: 'p6', name: '神秘宝盒', image: '📦', rarity: 'epic', color: '#AA96DA' },
  { id: 'p7', name: '限定手办', image: '🎎', rarity: 'legendary', color: '#FCBAD3' },
  { id: 'p8', name: '超级大奖', image: '👑', rarity: 'legendary', color: '#A8D8EA' },
];

export function getRewardsByMode(mode: 'normal' | 'premium'): Reward[] {
  return mode === 'normal' ? NORMAL_REWARDS : PREMIUM_REWARDS;
}

export function createInitialBalls(mode: 'normal' | 'premium'): BallState[] {
  const rewards = getRewardsByMode(mode);
  return rewards.map((reward, index) => ({
    id: index,
    x: 60 + Math.random() * 180,
    y: 60 + Math.random() * 180,
    vx: 0,
    vy: 0,
    color: BALL_COLORS[index],
    reward,
  }));
}

export function getRandomReward(mode: 'normal' | 'premium'): Reward {
  const rewards = getRewardsByMode(mode);
  const weights = rewards.map(r => {
    switch (r.rarity) {
      case 'common': return 40;
      case 'rare': return 25;
      case 'epic': return 10;
      case 'legendary': return 5;
      default: return 1;
    }
  });
  const totalWeight = weights.reduce((a, b) => a + b, 0);
  let random = Math.random() * totalWeight;
  for (let i = 0; i < rewards.length; i++) {
    random -= weights[i];
    if (random <= 0) {
      return rewards[i];
    }
  }
  return rewards[0];
}

export const RARITY_COLORS: Record<string, string> = {
  common: '#9CA3AF',
  rare: '#3B82F6',
  epic: '#8B5CF6',
  legendary: '#F59E0B',
};

export const RARITY_NAMES: Record<string, string> = {
  common: '普通',
  rare: '稀有',
  epic: '史诗',
  legendary: '传说',
};
