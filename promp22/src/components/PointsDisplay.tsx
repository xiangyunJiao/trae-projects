import { useSlotStore } from '@/store/slotStore'
import { Coins } from 'lucide-react'

export default function PointsDisplay() {
  const points = useSlotStore((s) => s.points)

  return (
    <div
      className="flex items-center justify-center gap-2 py-2 px-6 rounded-full"
      style={{
        background: 'linear-gradient(135deg, rgba(255, 215, 0, 0.15), rgba(255, 165, 0, 0.1))',
        border: '1px solid rgba(255, 215, 0, 0.3)',
      }}
    >
      <Coins className="w-5 h-5 text-yellow-400" />
      <span className="text-gray-400 text-sm">我的积分</span>
      <span
        className="text-xl font-bold"
        style={{
          background: 'linear-gradient(135deg, #FFD700, #FFA500)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
        }}
      >
        {points}
      </span>
    </div>
  )
}
