export interface ActivityConfig {
  headerImage: string;
  headerTitle: string;
  ruleContent: string;
  rewardLink: string;
  gameCombination: 'lottery' | 'ranking' | 'both';
  lotteryButtonName: string;
  rankingButtonName: string;
  giftAreaBg: string;
  gifts: GiftItem[];
  lotteryConfig: LotteryConfig;
  rankingConfig: RankingConfig;
}

export interface GiftItem {
  id: number;
  image: string;
  name: string;
  score: number;
}

export interface LotteryConfig {
  backgroundImage: string;
  cellDefaultBg: string;
  cellSelectedBg: string;
  buttonText: string;
  drawCounts: number[];
  prizes: LotteryPrize[];
}

export interface LotteryPrize {
  id: number;
  index: number;
  image: string;
  name: string;
  quantity: number;
  probability: number;
}

export interface RankingConfig {
  type: 'receive' | 'send';
  list: RankingItem[];
}

export interface RankingItem {
  id: number;
  avatar: string;
  nickname: string;
  score: number;
}

export interface DrawResult {
  prize: LotteryPrize;
  index: number;
}

export interface WinPrize {
  prize: LotteryPrize;
  count: number;
}
