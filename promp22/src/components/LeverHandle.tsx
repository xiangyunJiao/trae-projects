import { useSlotStore } from '@/store/slotStore'
import { SLOT_CONFIG } from '@/config/prizes'

export default function LeverHandle() {
  const { isLeverPulled, setLeverPulled, isSpinning, spin, points } = useSlotStore()

  const handleClick = () => {
    if (isSpinning || points < SLOT_CONFIG.costPerDraw) return

    setLeverPulled(true)
    setTimeout(() => setLeverPulled(false), 350)
    setTimeout(() => spin(), 200)
  }

  return (
    <div
      className="flex flex-col items-center cursor-pointer select-none"
      onClick={handleClick}
    >
      <div
        className="flex flex-col items-center"
        style={{
          transition: 'transform 0.2s cubic-bezier(0.4, 0, 0.2, 1.2)',
          transform: isLeverPulled ? 'translateY(30px)' : 'translateY(0)',
        }}
      >
        <div
          className="w-11 h-11 rounded-full"
          style={{
            background: 'radial-gradient(circle at 35% 35%, #ff6666, #cc0000, #770000)',
            boxShadow: isLeverPulled
              ? '0 2px 8px rgba(204, 0, 0, 0.6), inset 0 -2px 4px rgba(0,0,0,0.4)'
              : '0 4px 14px rgba(204, 0, 0, 0.4), inset 0 -2px 4px rgba(0,0,0,0.3), inset 0 2px 4px rgba(255,255,255,0.15)',
            border: '2px solid rgba(255,100,100,0.4)',
          }}
        />
        <div
          className="w-2 h-20"
          style={{
            background: 'linear-gradient(90deg, #777, #ccc 40%, #999)',
            borderRadius: '2px',
            boxShadow: '2px 2px 6px rgba(0,0,0,0.5)',
          }}
        />
      </div>
      <div
        className="w-9 h-4 rounded-b"
        style={{
          background: 'linear-gradient(90deg, #555, #777, #555)',
          boxShadow: '2px 2px 4px rgba(0,0,0,0.5)',
        }}
      />
    </div>
  )
}
