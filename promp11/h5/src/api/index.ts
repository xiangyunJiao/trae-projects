import { ActivityConfig, DrawResult, RankingConfig } from '../types';
import { mockActivityConfig, calculatePrizeByProbability } from './mock';

const API_BASE = '/api';

function delay<T>(data: T, ms = 300): Promise<T> {
  return new Promise(resolve => setTimeout(() => resolve(data), ms));
}

export async function getActivityConfig(): Promise<ActivityConfig> {
  try {
    const res = await fetch(`${API_BASE}/activity/config`);
    if (res.ok) return res.json();
  } catch (e) {
    console.warn('使用mock数据');
  }
  return delay(mockActivityConfig);
}

export async function drawLottery(count: number): Promise<DrawResult[]> {
  try {
    const res = await fetch(`${API_BASE}/activity/draw`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ count }),
    });
    if (res.ok) return res.json();
  } catch (e) {
    console.warn('使用mock数据');
  }
  const results: DrawResult[] = [];
  for (let i = 0; i < count; i++) {
    const prize = calculatePrizeByProbability(mockActivityConfig.lotteryConfig.prizes);
    results.push({ prize, index: prize.index });
  }
  return delay(results);
}

export async function getRankingList(type: 'receive' | 'send'): Promise<RankingConfig> {
  try {
    const res = await fetch(`${API_BASE}/activity/ranking?type=${type}`);
    if (res.ok) return res.json();
  } catch (e) {
    console.warn('使用mock数据');
  }
  return delay(mockActivityConfig.rankingConfig);
}

export async function saveActivityConfig(config: ActivityConfig): Promise<boolean> {
  try {
    const res = await fetch(`${API_BASE}/admin/activity/config`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(config),
    });
    if (res.ok) return res.json();
  } catch (e) {
    console.warn('使用mock保存');
  }
  return delay(true);
}
