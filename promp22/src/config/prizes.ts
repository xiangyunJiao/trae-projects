export interface Prize {
  id: string
  name: string
  imagePrompt: string
  value: number
  hasValue: boolean
  probability: number
}

export interface SlotConfig {
  prizes: Prize[]
  reelItemCount: number
  costPerDraw: number
  initialPoints: number
}

export const DEFAULT_PRIZES: Prize[] = [
  {
    id: 'grand',
    name: '现金x888',
    imagePrompt: 'golden trophy with 888 cash prize, luxury reward',
    value: 888,
    hasValue: true,
    probability: 0.5,
  },
  {
    id: 'coins100',
    name: '金币x100',
    imagePrompt: 'stack of 100 gold coins, shiny metal currency',
    value: 100,
    hasValue: true,
    probability: 3,
  },
  {
    id: 'redpack50',
    name: '红包x50',
    imagePrompt: 'red envelope with 50 yuan, chinese lucky money',
    value: 50,
    hasValue: true,
    probability: 5,
  },
  {
    id: 'cash20',
    name: '现金x20',
    imagePrompt: 'twenty yuan bill cash reward',
    value: 20,
    hasValue: true,
    probability: 8,
  },
  {
    id: 'coins10',
    name: '金币x10',
    imagePrompt: 'ten gold coins scattered, small reward',
    value: 10,
    hasValue: true,
    probability: 10,
  },
  {
    id: 'coupon5',
    name: '优惠券x5',
    imagePrompt: 'discount coupon voucher worth 5 yuan',
    value: 5,
    hasValue: true,
    probability: 12,
  },
  {
    id: 'sticker',
    name: '贴纸',
    imagePrompt: 'cute decorative sticker, colorful fun accessory',
    value: 0,
    hasValue: false,
    probability: 8,
  },
  {
    id: 'pendant',
    name: '挂件',
    imagePrompt: 'small charm pendant accessory, keychain decoration',
    value: 0,
    hasValue: false,
    probability: 8,
  },
  {
    id: 'emoji',
    name: '表情包',
    imagePrompt: 'emoji sticker pack, funny face expressions',
    value: 0,
    hasValue: false,
    probability: 6,
  },
  {
    id: 'frame',
    name: '头像框',
    imagePrompt: 'decorative avatar frame border, digital accessory',
    value: 0,
    hasValue: false,
    probability: 5,
  },
]

export const SLOT_CONFIG: SlotConfig = {
  prizes: DEFAULT_PRIZES,
  reelItemCount: 10,
  costPerDraw: 10,
  initialPoints: 100,
}

export function getPrizeImageUrl(prize: Prize): string {
  const prompt = encodeURIComponent(prize.imagePrompt)
  return `https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=${prompt}&image_size=square`
}

export function drawPrize(prizes: Prize[]): Prize | null {
  const totalWeight = prizes.reduce((sum, p) => sum + p.probability, 0)
  const random = Math.random() * 100
  if (random > totalWeight) return null

  let accumulated = 0
  for (const prize of prizes) {
    accumulated += prize.probability
    if (random <= accumulated) return prize
  }
  return null
}

export function shuffleArray<T>(array: T[]): T[] {
  const result = [...array]
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[result[i], result[j]] = [result[j], result[i]]
  }
  return result
}
