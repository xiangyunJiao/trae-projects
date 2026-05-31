import type { Reward } from '../../types';
import { RARITY_COLORS, RARITY_NAMES } from '../../data/rewards';
import { X } from 'lucide-react';

interface RewardModalProps {
  reward: Reward | null;
  isOpen: boolean;
  onClose: () => void;
}

export function RewardModal({ reward, isOpen, onClose }: RewardModalProps) {
  if (!isOpen || !reward) return null;

  const rarityColor = RARITY_COLORS[reward.rarity];
  const rarityName = RARITY_NAMES[reward.rarity];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-modal-fade-in">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose} />

      <div
        className="relative w-full max-w-sm animate-modal-pop-up"
        style={{
          background: `linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)`,
          borderRadius: '24px',
          boxShadow: `
            0 0 60px ${rarityColor}60,
            0 0 100px ${rarityColor}30,
            inset 0 1px 0 rgba(255,255,255,0.1)
          `,
          border: `3px solid ${rarityColor}`,
        }}
      >
        <button
          onClick={onClose}
          className="absolute top-3 right-3 p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors z-10"
        >
          <X className="w-5 h-5 text-white" />
        </button>

        <div className="p-8 text-center">
          <div className="mb-2 text-3xl animate-bounce">🎉</div>

          <h2
            className="text-2xl font-bold mb-6"
            style={{
              background: `linear-gradient(135deg, #FFD700, #FFA500)`,
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              fontFamily: '"Creepster", cursive',
            }}
          >
            恭喜你获得！
          </h2>

          <div
            className="w-32 h-32 mx-auto mb-6 rounded-full flex items-center justify-center text-7xl relative"
            style={{
              background: `radial-gradient(circle at 30% 30%, ${reward.color}ee, ${reward.color} 50%, ${reward.color}aa 100%)`,
              boxShadow: `
                inset -5px -5px 20px rgba(0,0,0,0.3),
                inset 5px 5px 20px rgba(255,255,255,0.3),
                0 0 40px ${reward.color}80,
                0 0 80px ${reward.color}40
              `,
              animation: 'pulse 2s ease-in-out infinite',
            }}
          >
            <span className="drop-shadow-lg">{reward.image}</span>
            <div
              className="absolute rounded-full bg-white/40"
              style={{
                left: '25%',
                top: '20%',
                width: '30%',
                height: '20%',
                filter: 'blur(3px)',
              }}
            />
          </div>

          <div
            className="inline-block px-4 py-1 rounded-full text-sm font-bold mb-4"
            style={{
              backgroundColor: `${rarityColor}30`,
              color: rarityColor,
              border: `2px solid ${rarityColor}`,
            }}
          >
            {rarityName}
          </div>

          <h3 className="text-2xl font-bold text-white mb-8">{reward.name}</h3>

          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 py-3 px-6 rounded-xl font-bold text-lg transition-all duration-200 bg-gradient-to-r from-orange-500 to-amber-500 text-white hover:from-orange-600 hover:to-amber-600 transform hover:scale-105 active:scale-95 shadow-lg shadow-orange-500/30"
            >
              再来一次
            </button>
          </div>
        </div>

        <div className="absolute -top-6 -left-6 text-5xl animate-float">⭐</div>
        <div className="absolute -top-4 -right-4 text-4xl animate-float" style={{ animationDelay: '0.5s' }}>✨</div>
        <div className="absolute -bottom-4 -left-4 text-4xl animate-float" style={{ animationDelay: '1s' }}>🎊</div>
        <div className="absolute -bottom-6 -right-6 text-5xl animate-float" style={{ animationDelay: '1.5s' }}>🌟</div>
      </div>
    </div>
  );
}
