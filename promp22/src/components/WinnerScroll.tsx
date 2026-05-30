import { useEffect, useRef } from 'react'
import { useSlotStore } from '@/store/slotStore'

export default function WinnerScroll() {
  const winners = useSlotStore((s) => s.winners)
  const containerRef = useRef<HTMLDivElement>(null)
  const animationRef = useRef<number>(0)
  const scrollPosRef = useRef(0)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const animate = () => {
      scrollPosRef.current += 0.5
      container.style.transform = `translateY(-${scrollPosRef.current}px)`

      const halfHeight = container.scrollHeight / 2
      if (scrollPosRef.current >= halfHeight) {
        scrollPosRef.current -= halfHeight
      }

      animationRef.current = requestAnimationFrame(animate)
    }

    animationRef.current = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(animationRef.current)
  }, [])

  const displayWinners = winners.slice(-10)
  const doubled = [...displayWinners, ...displayWinners]

  return (
    <div className="w-full overflow-hidden rounded-lg" style={{ height: '120px' }}>
      <div ref={containerRef}>
        {doubled.map((winner, idx) => (
          <div
            key={`${winner.id}-${idx}`}
            className="flex items-center justify-center gap-1 py-1.5 text-xs"
          >
            <span className="text-yellow-400">🎉</span>
            <span className="text-gray-400">恭喜</span>
            <span className="text-yellow-300 font-medium">{winner.username}</span>
            <span className="text-gray-400">获得</span>
            <span className="text-orange-400 font-medium">{winner.prizeName}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
