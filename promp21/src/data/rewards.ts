import { Reward } from '@/types';

const rewardEmojis = ['🎫', '🧳', '✈️', '🎒', '🏨', '🎁'];

export const rewards: Reward[] = [
  { id: '1', name: '50元优惠券', image: '' },
  { id: '2', name: '精美行李箱', image: '' },
  { id: '3', name: '机票抵扣券', image: '' },
  { id: '4', name: '旅行背包', image: '' },
  { id: '5', name: '酒店住宿券', image: '' },
  { id: '6', name: '神秘大礼包', image: '' }
];

export const getRewardEmoji = (id: string): string => {
  const index = rewards.findIndex(r => r.id === id);
  return rewardEmojis[index] || '🎁';
};

export const getRandomReward = (): Reward => {
  const randomIndex = Math.floor(Math.random() * rewards.length);
  return rewards[randomIndex];
};
