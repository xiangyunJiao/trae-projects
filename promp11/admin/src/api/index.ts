import { ActivityConfig, RankingConfig } from '../types';

const API_BASE = '/api';

function delay<T>(data: T, ms = 200): Promise<T> {
  return new Promise(resolve => setTimeout(() => resolve(data), ms));
}

const defaultConfig: ActivityConfig = {
  headerImage: '',
  headerTitle: '活动标题',
  ruleContent: '请输入活动规则...',
  rewardLink: '',
  gameCombination: 'both',
  lotteryButtonName: '抽奖',
  rankingButtonName: '榜单',
  giftAreaBg: '',
  gifts: [],
  lotteryConfig: {
    backgroundImage: '',
    cellDefaultBg: '',
    cellSelectedBg: '',
    buttonText: '开始抽奖',
    drawCounts: [1, 10, 50],
    prizes: [],
  },
  rankingConfig: {
    type: 'receive',
    list: [],
  },
};

export async function getActivityConfig(): Promise<ActivityConfig> {
  try {
    const res = await fetch(`${API_BASE}/admin/activity/config`);
    if (res.ok) return res.json();
  } catch (e) {
    console.warn('使用默认配置');
  }
  return delay(defaultConfig);
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

export async function getRankingList(type: 'receive' | 'send'): Promise<RankingConfig> {
  try {
    const res = await fetch(`${API_BASE}/admin/activity/ranking?type=${type}`);
    if (res.ok) return res.json();
  } catch (e) {
    console.warn('使用mock数据');
  }
  return delay({ type, list: [] });
}
