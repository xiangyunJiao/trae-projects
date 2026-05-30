import { useSlotStore } from '@/store/slotStore'

const ITEM_HEIGHT = 90

export default function WinHighlight() {
  const wonPrize = useSlotStore((s) => s.wonPrize)

  if (!wonPrize) return null

  return (
    <div className="absolute inset-0 z-30 pointer-events-none">
      <div
        className="absolute left-0 right-0"
        style={{
          top: `${ITEM_HEIGHT}px`,
          height: `${ITEM_HEIGHT}px`,
          border: '3px solid #FFD700',
          borderRadius: '6px',
          boxShadow: '0 0 20px #FFD700, 0 0 40px #FFD700, 0 0 60px #FFA500, inset 0 0 20px rgba(255, 215, 0, 0.3)',
          animation: 'winPulse 0.6s ease-in-out 3',
        }}
      />
    </div>
  )
}
