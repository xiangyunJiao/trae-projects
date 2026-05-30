import { create } from 'zustand'
import { Prize, SLOT_CONFIG, drawPrize, shuffleArray } from '@/config/prizes'

export interface WinnerRecord {
  id: string
  username: string
  prizeName: string
  prizeValue: number
  hasValue: boolean
}

interface ReelState {
  prizes: Prize[]
  targetIndex: number
  isSpinning: boolean
}

interface SlotState {
  points: number
  reels: ReelState[]
  isSpinning: boolean
  wonPrize: Prize | null
  showWinModal: boolean
  isLeverPulled: boolean
  winners: WinnerRecord[]
  flashLights: boolean

  spin: () => void
  closeWinModal: () => void
  setReelStopped: (index: number, targetIndex: number) => void
  setLeverPulled: (pulled: boolean) => void
}

const MOCK_USERNAMES = [
  '小明', '小红', '阿华', '大壮', '小李',
  '甜甜', '老王', '阿杰', '美美', '小刚',
  '丽丽', '大伟', '小芳', '阿强', '晓晓',
  '志强', '小雨', '大毛', '小雪', '阿宝',
]

function generateMockWinners(): WinnerRecord[] {
  const records: WinnerRecord[] = []
  for (let i = 0; i < 15; i++) {
    const prize = SLOT_CONFIG.prizes[Math.floor(Math.random() * SLOT_CONFIG.prizes.length)]
    records.push({
      id: `mock-${i}`,
      username: MOCK_USERNAMES[Math.floor(Math.random() * MOCK_USERNAMES.length)],
      prizeName: prize.name,
      prizeValue: prize.value,
      hasValue: prize.hasValue,
    })
  }
  return records
}

function createInitialReels(): ReelState[] {
  return [0, 1, 2].map(() => ({
    prizes: shuffleArray(SLOT_CONFIG.prizes),
    targetIndex: 0,
    isSpinning: false,
  }))
}

function pickNoWinTargets(prizes: Prize[]): { targetIndex: number; prizes: Prize[] }[] {
  const results: { targetIndex: number; prizes: Prize[] }[] = []
  const usedIds = new Set<string>()

  for (let i = 0; i < 3; i++) {
    const shuffled = shuffleArray(prizes)
    const availableIndices = shuffled
      .map((p, idx) => (!usedIds.has(p.id) ? idx : -1))
      .filter((idx) => idx !== -1)

    let targetIdx: number
    if (availableIndices.length > 0) {
      targetIdx = availableIndices[Math.floor(Math.random() * availableIndices.length)]
    } else {
      targetIdx = Math.floor(Math.random() * shuffled.length)
    }

    usedIds.add(shuffled[targetIdx].id)
    results.push({ targetIndex: targetIdx, prizes: shuffled })
  }

  return results
}

export const useSlotStore = create<SlotState>((set, get) => ({
  points: SLOT_CONFIG.initialPoints,
  reels: createInitialReels(),
  isSpinning: false,
  wonPrize: null,
  showWinModal: false,
  isLeverPulled: false,
  winners: generateMockWinners(),
  flashLights: false,

  spin: () => {
    const state = get()
    if (state.isSpinning) return
    if (state.points < SLOT_CONFIG.costPerDraw) return

    const wonPrize = drawPrize(SLOT_CONFIG.prizes)

    let newReels: ReelState[]

    if (wonPrize) {
      newReels = [0, 1, 2].map(() => {
        const shuffled = shuffleArray(SLOT_CONFIG.prizes)
        const targetIdx = Math.floor(Math.random() * shuffled.length)
        const arranged = [...shuffled]
        arranged[targetIdx] = wonPrize
        return { prizes: arranged, targetIndex: targetIdx, isSpinning: true }
      })
    } else {
      const noWinResults = pickNoWinTargets(SLOT_CONFIG.prizes)
      newReels = noWinResults.map((r) => ({
        prizes: r.prizes,
        targetIndex: r.targetIndex,
        isSpinning: true,
      }))
    }

    set({
      points: state.points - SLOT_CONFIG.costPerDraw,
      reels: newReels,
      isSpinning: true,
      wonPrize: null,
      showWinModal: false,
      flashLights: true,
    })
  },

  setReelStopped: (index, targetIndex) => {
    set((state) => {
      const newReels = [...state.reels]
      newReels[index] = { ...newReels[index], isSpinning: false, targetIndex }

      const allStopped = newReels.every((r) => !r.isSpinning)
      if (allStopped) {
        const middlePrizes = newReels.map((r) => r.prizes[r.targetIndex])
        const isWin = middlePrizes.every((p) => p.id === middlePrizes[0].id)
        const wonPrize = isWin ? middlePrizes[0] : null

        const newState: Partial<SlotState> = {
          reels: newReels,
          isSpinning: false,
          flashLights: false,
          wonPrize,
        }

        if (wonPrize) {
          newState.showWinModal = true
        }

        return newState
      }

      return { reels: newReels }
    })
  },

  closeWinModal: () => {
    const state = get()
    if (state.wonPrize) {
      const newWinner: WinnerRecord = {
        id: `win-${Date.now()}`,
        username: '你',
        prizeName: state.wonPrize.name,
        prizeValue: state.wonPrize.value,
        hasValue: state.wonPrize.hasValue,
      }
      set({
        showWinModal: false,
        wonPrize: null,
        winners: [...state.winners, newWinner],
      })
    } else {
      set({ showWinModal: false, wonPrize: null })
    }
  },

  setLeverPulled: (pulled) => set({ isLeverPulled: pulled }),
}))
