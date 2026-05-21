import { ActivityConfig, LotteryConfig, Gift, RankingItem, Prize } from '@/types'

const mockActivityConfig: ActivityConfig = {
  id: 1,
  title: '万圣节抽奖活动',
  headerImage: 'https://neeko-copilot.bytedance.net/api/text_to_image?prompt=halloween%20party%20background%20with%20pumpkins%20and%20bats&image_size=portrait_4_3',
  ruleContent: '活动规则：\n1. 活动时间：2024年10月25日-11月1日\n2. 每日可抽奖3次\n3. 奖品将在活动结束后7个工作日内发放\n4. 本活动最终解释权归主办方所有',
  rewardUrl: 'https://example.com/rewards',
  enableLottery: true,
  enableRanking: true,
  rankingType: 'receive',
  playButtons: [
    { id: 1, name: '万圣节抽奖', type: 'lottery' },
    { id: 2, name: '榜单', type: 'ranking' }
  ]
}

const mockLotteryConfig: LotteryConfig = {
  id: 1,
  backgroundImage: 'https://neeko-copilot.bytedance.net/api/text_to_image?prompt=halloween%20lottery%20wheel%20spooky%20design&image_size=portrait_4_3',
  cellDefaultImage: 'https://neeko-copilot.bytedance.net/api/text_to_image?prompt=empty%20prize%20slot%20halloween%20theme&image_size=square',
  cellSelectedImage: 'https://neeko-copilot.bytedance.net/api/text_to_image?prompt=golden%20glowing%20prize%20slot&image_size=square',
  drawCounts: [1, 10, 50],
  buttonText: '开始抽奖',
  prizes: [
    { id: 1, name: '万圣节礼包', image: 'https://neeko-copilot.bytedance.net/api/text_to_image?prompt=halloween%20gift%20box%20with%20candies&image_size=square', quantity: 10, probability: 5 },
    { id: 2, name: '南瓜灯', image: 'https://neeko-copilot.bytedance.net/api/text_to_image?prompt=halloween%20pumpkin%20lantern&image_size=square', quantity: 50, probability: 15 },
    { id: 3, name: '魔法帽', image: 'https://neeko-copilot.bytedance.net/api/text_to_image?prompt=wizard%20magic%20hat%20halloween&image_size=square', quantity: 100, probability: 20 },
    { id: 4, name: '蝙蝠玩偶', image: 'https://neeko-copilot.bytedance.net/api/text_to_image?prompt=cute%20bat%20plush%20toy&image_size=square', quantity: 200, probability: 25 },
    { id: 5, name: '幽灵挂件', image: 'https://neeko-copilot.bytedance.net/api/text_to_image?prompt=ghost%20keychain%20halloween&image_size=square', quantity: 300, probability: 20 },
    { id: 6, name: '糖果礼包', image: 'https://neeko-copilot.bytedance.net/api/text_to_image?prompt=colorful%20candy%20bag%20halloween&image_size=square', quantity: 500, probability: 10 },
    { id: 7, name: '优惠券', image: 'https://neeko-copilot.bytedance.net/api/text_to_image?prompt=discount%20coupon%20halloween%20theme&image_size=square', quantity: 1000, probability: 3 },
    { id: 8, name: '积分+10', image: 'https://neeko-copilot.bytedance.net/api/text_to_image?prompt=golden%20coins%20floating&image_size=square', quantity: 5000, probability: 1 },
    { id: 9, name: '谢谢参与', image: 'https://neeko-copilot.bytedance.net/api/text_to_image?prompt=thank%20you%20halloween%20style&image_size=square', quantity: 10000, probability: 1 }
  ]
}

const mockGifts: Gift[] = [
  { id: 1, name: '南瓜灯', image: 'https://neeko-copilot.bytedance.net/api/text_to_image?prompt=halloween%20pumpkin%20lantern&image_size=square', points: 100 },
  { id: 2, name: '魔法帽', image: 'https://neeko-copilot.bytedance.net/api/text_to_image?prompt=wizard%20magic%20hat&image_size=square', points: 200 },
  { id: 3, name: '蝙蝠玩偶', image: 'https://neeko-copilot.bytedance.net/api/text_to_image?prompt=cute%20bat%20plush&image_size=square', points: 150 },
  { id: 4, name: '幽灵挂件', image: 'https://neeko-copilot.bytedance.net/api/text_to_image?prompt=ghost%20keychain&image_size=square', points: 80 },
  { id: 5, name: '糖果礼包', image: 'https://neeko-copilot.bytedance.net/api/text_to_image?prompt=candy%20gift%20bag&image_size=square', points: 120 },
  { id: 6, name: '万圣节套装', image: 'https://neeko-copilot.bytedance.net/api/text_to_image?prompt=halloween%20costume%20set&image_size=square', points: 500 },
  { id: 7, name: '恐怖面具', image: 'https://neeko-copilot.bytedance.net/api/text_to_image?prompt=scary%20halloween%20mask&image_size=square', points: 180 },
  { id: 8, name: '魔法扫帚', image: 'https://neeko-copilot.bytedance.net/api/text_to_image?prompt=witch%20broomstick&image_size=square', points: 300 }
]

const mockRankingData: RankingItem[] = [
  { id: 1, avatar: 'https://neeko-copilot.bytedance.net/api/text_to_image?prompt=cute%20cartoon%20avatar%20halloween%20style&image_size=square', nickname: '南瓜王子', value: 15800 },
  { id: 2, avatar: 'https://neeko-copilot.bytedance.net/api/text_to_image?prompt=spooky%20ghost%20avatar&image_size=square', nickname: '幽灵使者', value: 12500 },
  { id: 3, avatar: 'https://neeko-copilot.bytedance.net/api/text_to_image?prompt=witch%20avatar%20cartoon&image_size=square', nickname: '暗夜女巫', value: 10200 },
  { id: 4, avatar: 'https://neeko-copilot.bytedance.net/api/text_to_image?prompt=vampire%20avatar%20cartoon&image_size=square', nickname: '血族伯爵', value: 8900 },
  { id: 5, avatar: 'https://neeko-copilot.bytedance.net/api/text_to_image?prompt=zombie%20avatar%20cartoon&image_size=square', nickname: '活死人', value: 7500 },
  { id: 6, avatar: 'https://neeko-copilot.bytedance.net/api/text_to_image?prompt=mummy%20avatar%20cartoon&image_size=square', nickname: '木乃伊归来', value: 6300 },
  { id: 7, avatar: 'https://neeko-copilot.bytedance.net/api/text_to_image?prompt=skeleton%20avatar%20cartoon&image_size=square', nickname: '骷髅王', value: 5100 },
  { id: 8, avatar: 'https://neeko-copilot.bytedance.net/api/text_to_image?prompt=black%20cat%20avatar%20cartoon&image_size=square', nickname: '黑猫警长', value: 4200 },
  { id: 9, avatar: 'https://neeko-copilot.bytedance.net/api/text_to_image?prompt=owl%20avatar%20cartoon%20halloween&image_size=square', nickname: '智慧猫头鹰', value: 3500 },
  { id: 10, avatar: 'https://neeko-copilot.bytedance.net/api/text_to_image?prompt=bat%20avatar%20cartoon&image_size=square', nickname: '暗夜蝙蝠', value: 2800 }
]

export const api = {
  getActivityConfig(): Promise<ActivityConfig> {
    return Promise.resolve(mockActivityConfig)
  },

  updateActivityConfig(config: ActivityConfig): Promise<ActivityConfig> {
    return Promise.resolve(config)
  },

  getLotteryConfig(): Promise<LotteryConfig> {
    return Promise.resolve(mockLotteryConfig)
  },

  updateLotteryConfig(config: LotteryConfig): Promise<LotteryConfig> {
    return Promise.resolve(config)
  },

  getGifts(): Promise<Gift[]> {
    return Promise.resolve(mockGifts)
  },

  updateGifts(gifts: Gift[]): Promise<Gift[]> {
    return Promise.resolve(gifts)
  },

  getRankingData(type: 'receive' | 'send'): Promise<RankingItem[]> {
    return Promise.resolve(mockRankingData)
  },

  drawLottery(count: number): Promise<Prize[]> {
    const result: Prize[] = []
    const prizes = mockLotteryConfig.prizes
    
    for (let i = 0; i < count; i++) {
      const random = Math.random() * 100
      let cumulative = 0
      
      for (const prize of prizes) {
        cumulative += prize.probability
        if (random <= cumulative) {
          result.push({ ...prize })
          break
        }
      }
    }
    
    return Promise.resolve(result)
  }
}

export default api