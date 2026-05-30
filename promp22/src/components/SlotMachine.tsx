import { useSlotStore } from '@/store/slotStore'
import ReelColumn from './ReelColumn'
import LeverHandle from './LeverHandle'
import FlashingLights from './FlashingLights'
import WinHighlight from './WinHighlight'
import { SLOT_CONFIG } from '@/config/prizes'

const ITEM_HEIGHT = 90

export default function SlotMachine() {
  const { reels, isSpinning, spin, points, setLeverPulled } = useSlotStore()

  const handleSpin = () => {
    if (isSpinning || points < SLOT_CONFIG.costPerDraw) return

    setLeverPulled(true)
    setTimeout(() => setLeverPulled(false), 350)
    setTimeout(() => spin(), 200)
  }

  return (
    <div className="flex flex-col items-center gap-5">
      <div className="flex items-start gap-4">
        <div className="relative" style={{ padding: '0 16px' }}>
          <FlashingLights />

          <div
            className="relative rounded-2xl overflow-hidden"
            style={{
              background: 'linear-gradient(180deg, #1a1a2e 0%, #0d0d1a 100%)',
              border: '3px solid #FFD700',
              boxShadow: '0 0 30px rgba(255, 215, 0, 0.2), inset 0 0 30px rgba(0, 0, 0, 0.5)',
              padding: '4px',
            }}
          >
            <div className="relative flex gap-[2px] rounded-xl overflow-hidden">
              {reels.map((reel, idx) => (
                <div key={idx} className="relative" style={{ width: '110px' }}>
                  <ReelColumn
                    reelIndex={idx}
                    prizes={reel.prizes}
                    targetIndex={reel.targetIndex}
                    isSpinning={reel.isSpinning}
                  />
                  <div
                    className="absolute left-0 right-0 h-[2px] z-10 pointer-events-none"
                    style={{
                      top: `${ITEM_HEIGHT}px`,
                      background: 'linear-gradient(90deg, transparent, #FFD700, transparent)',
                      boxShadow: '0 0 8px #FFD700',
                    }}
                  />
                </div>
              ))}

              <WinHighlight />
            </div>
          </div>
        </div>

        <LeverHandle />
      </div>

      <button
        onClick={handleSpin}
        disabled={isSpinning || points < SLOT_CONFIG.costPerDraw}
        className="px-8 py-3 rounded-xl font-bold text-black text-lg transition-all hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
        style={{
          background: isSpinning
            ? 'linear-gradient(135deg, #666, #444)'
            : 'linear-gradient(135deg, #FFD700, #FFA500)',
          boxShadow: isSpinning
            ? 'none'
            : '0 4px 20px rgba(255, 165, 0, 0.5), 0 0 40px rgba(255, 215, 0, 0.2)',
        }}
      >
        {isSpinning ? '转动中...' : `抽奖 (-${SLOT_CONFIG.costPerDraw}积分)`}
      </button>
    </div>
  )
}
