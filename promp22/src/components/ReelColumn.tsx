import { useEffect, useRef, useCallback, useMemo } from 'react'
import { Prize } from '@/config/prizes'
import { getPrizeImageUrl } from '@/config/prizes'
import { useSlotStore } from '@/store/slotStore'
import { Coins } from 'lucide-react'

const ITEM_HEIGHT = 90
const VISIBLE_COUNT = 3
const VISIBLE_HEIGHT = ITEM_HEIGHT * VISIBLE_COUNT

interface ReelColumnProps {
  reelIndex: number
  prizes: Prize[]
  targetIndex: number
  isSpinning: boolean
}

function easeInOutQuart(t: number): number {
  return t < 0.5
    ? 8 * t * t * t * t
    : 1 - Math.pow(-2 * t + 2, 4) / 2
}

export default function ReelColumn({ reelIndex, prizes, targetIndex, isSpinning }: ReelColumnProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const animFrameRef = useRef<number>(0)
  const wasSpinning = useRef(false)
  const setReelStopped = useSlotStore((s) => s.setReelStopped)

  const itemCount = prizes.length
  const cycleHeight = itemCount * ITEM_HEIGHT

  const stripItems = useMemo(() => {
    return Array.from({ length: 12 }, () => prizes).flat()
  }, [prizes])

  const applyOffset = useCallback((offset: number) => {
    if (!containerRef.current) return
    containerRef.current.style.transform = `translateY(${offset}px)`
  }, [])

  useEffect(() => {
    applyOffset(0)
  }, [applyOffset, prizes])

  useEffect(() => {
    if (isSpinning && !wasSpinning.current) {
      wasSpinning.current = true

      const rotations = 3 + reelIndex
      const totalDistance = rotations * cycleHeight + targetIndex * ITEM_HEIGHT
      const duration = 3000 + reelIndex * 1500

      let startTime = 0

      const animate = (timestamp: number) => {
        if (!startTime) startTime = timestamp
        const elapsed = timestamp - startTime
        const progress = Math.min(elapsed / duration, 1)
        const easedProgress = easeInOutQuart(progress)

        const currentOffset = -easedProgress * totalDistance

        applyOffset(currentOffset)

        if (progress >= 1) {
          const finalOffset = -targetIndex * ITEM_HEIGHT
          applyOffset(finalOffset)
          wasSpinning.current = false
          setTimeout(() => {
            setReelStopped(reelIndex, targetIndex)
          }, 200)
          return
        }

        animFrameRef.current = requestAnimationFrame(animate)
      }

      animFrameRef.current = requestAnimationFrame(animate)
    } else if (!isSpinning) {
      wasSpinning.current = false
    }

    return () => {
      cancelAnimationFrame(animFrameRef.current)
    }
  }, [isSpinning, reelIndex, cycleHeight, targetIndex, setReelStopped, applyOffset])

  return (
    <div className="relative overflow-hidden rounded" style={{ height: VISIBLE_HEIGHT }}>
      <div
        ref={containerRef}
        className="absolute w-full left-0 right-0"
        style={{ willChange: 'transform' }}
      >
        {stripItems.map((prize, idx) => (
          <div
            key={`${idx}-${prize.id}`}
            className="flex flex-col items-center justify-center border-b border-yellow-900/20"
            style={{
              height: ITEM_HEIGHT,
              background: 'linear-gradient(180deg, #1a1a2e 0%, #0d0d1a 100%)',
            }}
          >
            <img
              src={getPrizeImageUrl(prize)}
              alt=""
              className="w-11 h-11 object-contain rounded"
            />
            {prize.hasValue ? (
              <div className="flex items-center gap-0.5 mt-0.5">
                <Coins className="w-3 h-3 text-yellow-400" />
                <span className="text-yellow-400 text-[10px] font-bold">{prize.value}</span>
              </div>
            ) : (
              <span className="text-gray-400 text-[10px]">{prize.name}</span>
            )}
          </div>
        ))}
      </div>
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-0 right-0 h-8 bg-gradient-to-b from-[#0d0d1a] to-transparent z-10" />
        <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-[#0d0d1a] to-transparent z-10" />
      </div>
    </div>
  )
}
