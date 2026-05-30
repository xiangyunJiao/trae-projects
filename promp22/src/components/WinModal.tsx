import { useSlotStore } from '@/store/slotStore'
import { getPrizeImageUrl } from '@/config/prizes'
import { Coins, X, PartyPopper } from 'lucide-react'

export default function WinModal() {
  const { showWinModal, wonPrize, closeWinModal } = useSlotStore()

  if (!showWinModal || !wonPrize) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ background: 'rgba(0, 0, 0, 0.8)' }}
      onClick={closeWinModal}
    >
      <div
        className="relative w-72 rounded-2xl p-6 text-center"
        style={{
          background: 'linear-gradient(135deg, #1a0a2e, #2d1b4e, #1a0a2e)',
          border: '2px solid #FFD700',
          boxShadow: '0 0 40px rgba(255, 215, 0, 0.4), 0 0 80px rgba(255, 215, 0, 0.2)',
          animation: 'modalPop 0.4s ease-out',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={closeWinModal}
          className="absolute top-3 right-3 text-gray-400 hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center justify-center gap-2 mb-4">
          <PartyPopper className="w-6 h-6 text-yellow-400" />
          <h2
            className="text-2xl font-bold"
            style={{
              background: 'linear-gradient(135deg, #FFD700, #FFA500)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            恭喜中奖
          </h2>
          <PartyPopper className="w-6 h-6 text-yellow-400" />
        </div>

        <div
          className="w-24 h-24 mx-auto mb-4 rounded-xl overflow-hidden"
          style={{
            border: '2px solid #FFD700',
            boxShadow: '0 0 20px rgba(255, 215, 0, 0.3)',
          }}
        >
          <img
            src={getPrizeImageUrl(wonPrize)}
            alt={wonPrize.name}
            className="w-full h-full object-cover"
          />
        </div>

        <p className="text-white text-lg font-bold mb-2">{wonPrize.name}</p>

        {wonPrize.hasValue && (
          <div className="flex items-center justify-center gap-1.5 mb-4">
            <Coins className="w-5 h-5 text-yellow-400" />
            <span
              className="text-2xl font-bold"
              style={{
                background: 'linear-gradient(135deg, #FFD700, #FFA500)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              {wonPrize.value}
            </span>
          </div>
        )}

        <button
          onClick={closeWinModal}
          className="w-full py-2.5 rounded-xl font-bold text-black transition-transform hover:scale-105 active:scale-95"
          style={{
            background: 'linear-gradient(135deg, #FFD700, #FFA500)',
            boxShadow: '0 4px 15px rgba(255, 165, 0, 0.4)',
          }}
        >
          太棒了
        </button>
      </div>
    </div>
  )
}
