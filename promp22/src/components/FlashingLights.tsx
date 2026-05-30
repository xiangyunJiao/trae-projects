import { useEffect, useState } from 'react'
import { useSlotStore } from '@/store/slotStore'

const LIGHT_COUNT = 12
const COLORS = ['#ff2222', '#ffcc00', '#22ff44', '#ff44ff', '#ff8800', '#00ccff']

export default function FlashingLights() {
  const flashLights = useSlotStore((s) => s.flashLights)
  const wonPrize = useSlotStore((s) => s.wonPrize)
  const [tick, setTick] = useState(0)

  useEffect(() => {
    if (!flashLights && !wonPrize) return

    const interval = setInterval(() => {
      setTick((t) => t + 1)
    }, 120)

    return () => clearInterval(interval)
  }, [flashLights, wonPrize])

  const isActive = flashLights || !!wonPrize

  return (
    <>
      <div className="absolute top-0 bottom-0 flex flex-col justify-around items-center"
        style={{ left: '-10px', zIndex: 100 }}
      >
        {Array.from({ length: LIGHT_COUNT }).map((_, i) => {
          const on = (tick + i) % 3 !== 0
          const color = COLORS[i % COLORS.length]
          return (
            <div
              key={`left-${i}`}
              className="rounded-full"
              style={{
                width: '10px',
                height: '10px',
                background: isActive && on ? color : '#1a1a2e',
                boxShadow: isActive && on
                  ? `0 0 8px ${color}, 0 0 16px ${color}, 0 0 24px ${color}80`
                  : '0 0 2px rgba(0,0,0,0.3)',
                border: isActive ? `1px solid ${on ? '#fff3' : '#fff1'}` : '1px solid #333',
                transition: 'background 0.1s, box-shadow 0.1s',
              }}
            />
          )
        })}
      </div>
      <div className="absolute top-0 bottom-0 flex flex-col justify-around items-center"
        style={{ right: '-10px', zIndex: 100 }}
      >
        {Array.from({ length: LIGHT_COUNT }).map((_, i) => {
          const on = (tick + i + 1) % 3 !== 0
          const color = COLORS[(i + 3) % COLORS.length]
          return (
            <div
              key={`right-${i}`}
              className="rounded-full"
              style={{
                width: '10px',
                height: '10px',
                background: isActive && on ? color : '#1a1a2e',
                boxShadow: isActive && on
                  ? `0 0 8px ${color}, 0 0 16px ${color}, 0 0 24px ${color}80`
                  : '0 0 2px rgba(0,0,0,0.3)',
                border: isActive ? `1px solid ${on ? '#fff3' : '#fff1'}` : '1px solid #333',
                transition: 'background 0.1s, box-shadow 0.1s',
              }}
            />
          )
        })}
      </div>
    </>
  )
}
