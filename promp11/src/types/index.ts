export interface PlayButton {
  id: number
  name: string
  type: 'lottery' | 'ranking'
}

export interface ActivityConfig {
  id: number
  title: string
  headerImage: string
  ruleContent: string
  rewardUrl: string
  enableLottery: boolean
  enableRanking: boolean
  rankingType: 'receive' | 'send'
  playButtons: PlayButton[]
}

export interface Prize {
  id: number
  name: string
  image: string
  quantity: number
  probability: number
}

export interface LotteryConfig {
  id: number
  backgroundImage: string
  cellDefaultImage: string
  cellSelectedImage: string
  drawCounts: number[]
  buttonText: string
  prizes: Prize[]
}

export interface Gift {
  id: number
  name: string
  image: string
  points: number
}

export interface RankingItem {
  id: number
  avatar: string
  nickname: string
  value: number
}

export interface LotteryResult {
  prize: Prize
  count: number
}

export type RankingType = 'receive' | 'send'