import PointsDisplay from '@/components/PointsDisplay'
import SlotMachine from '@/components/SlotMachine'
import WinnerScroll from '@/components/WinnerScroll'
import WinModal from '@/components/WinModal'

export default function Home() {
  return (
    <div
      className="min-h-screen flex flex-col items-center relative"
      style={{
        background: 'linear-gradient(180deg, #0a0015 0%, #1a0a2e 30%, #150828 70%, #0a0015 100%)',
      }}
    >
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div
          className="absolute w-72 h-72 rounded-full opacity-10"
          style={{ background: 'radial-gradient(circle, #8B0000, transparent)', top: '-80px', left: '-80px' }}
        />
        <div
          className="absolute w-96 h-96 rounded-full opacity-5"
          style={{ background: 'radial-gradient(circle, #FFD700, transparent)', bottom: '-120px', right: '-120px' }}
        />
      </div>

      <div className="relative z-10 w-full max-w-md mx-auto px-6 pt-6 pb-8 flex flex-col items-center gap-5">
        <h1
          className="text-2xl font-bold tracking-wider"
          style={{
            background: 'linear-gradient(135deg, #FFD700, #FFA500, #FF6347)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            filter: 'drop-shadow(0 0 10px rgba(255, 215, 0, 0.3))',
          }}
        >
          🎰 幸运老虎机 🎰
        </h1>

        <PointsDisplay />

        <SlotMachine />

        <div className="w-full mt-2">
          <div
            className="text-center text-sm font-bold mb-2 py-1"
            style={{
              background: 'linear-gradient(90deg, transparent, rgba(255, 215, 0, 0.15), transparent)',
              color: '#FFD700',
            }}
          >
            🏆 中奖榜 🏆
          </div>
          <div
            className="rounded-xl p-3"
            style={{
              background: 'rgba(255, 255, 255, 0.03)',
              border: '1px solid rgba(255, 215, 0, 0.1)',
            }}
          >
            <WinnerScroll />
          </div>
        </div>
      </div>

      <WinModal />
    </div>
  )
}
