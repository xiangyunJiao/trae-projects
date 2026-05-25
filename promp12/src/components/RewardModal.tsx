import { useGameStore, RewardItem } from '@/store/gameStore';
import { playRewardSound, playPunishSound } from '@/utils/sound';
import { useEffect } from 'react';

interface RewardModalProps {
  reward: RewardItem;
  onClose: () => void;
}

export default function RewardModal({ reward, onClose }: RewardModalProps) {
  useEffect(() => {
    if (reward.isPositive) {
      playRewardSound();
    } else {
      playPunishSound();
    }
  }, [reward]);

  const getModalStyle = () => {
    if (reward.isPositive) {
      return {
        bg: 'from-yellow-400 via-orange-400 to-yellow-500',
        border: 'border-yellow-300',
        text: 'text-yellow-900',
        button: 'bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600',
      };
    }
    return {
      bg: 'from-gray-500 via-gray-600 to-gray-700',
      border: 'border-gray-400',
      text: 'text-gray-100',
      button: 'bg-gradient-to-r from-gray-500 to-gray-600 hover:from-gray-600 hover:to-gray-700',
    };
  };

  const style = getModalStyle();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
      <div className="absolute inset-0" onClick={onClose} />
      
      <div
        className={`
          relative z-10 w-80 md:w-96
          bg-gradient-to-br ${style.bg}
          rounded-3xl p-6 md:p-8
          shadow-2xl
          border-4 ${style.border}
          animate-modal-in
        `}
      >
        <div className="absolute -top-4 left-1/2 -translate-x-1/2">
          <div className={`
            px-6 py-2 rounded-full
            ${reward.isPositive ? 'bg-yellow-500' : 'bg-gray-600'}
            text-white font-bold text-lg shadow-lg
          `}>
            {reward.isPositive ? '🎉 恭喜你' : '😢 很遗憾'}
          </div>
        </div>
        
        <div className="mt-6 text-center">
          <div className="text-7xl md:text-8xl mb-4 animate-bounce">
            {reward.icon}
          </div>
          
          <h3 className={`text-2xl md:text-3xl font-bold mb-2 ${style.text}`}>
            {reward.name}
          </h3>
          
          <p className={`text-base md:text-lg ${style.text} opacity-90 mb-6`}>
            {reward.description}
          </p>
          
          {reward.type === 'coins' && (
            <div className={`text-3xl md:text-4xl font-bold ${style.text}`}>
              {reward.value > 0 ? `+${reward.value}` : reward.value} 💰
            </div>
          )}
          
          {reward.type === 'forward' && (
            <div className={`text-3xl md:text-4xl font-bold ${style.text}`}>
              前进 {reward.value} 步 ⏩
            </div>
          )}
          
          {reward.type === 'backward' && (
            <div className={`text-3xl md:text-4xl font-bold ${style.text}`}>
              后退 {reward.value} 步 ⏪
            </div>
          )}
        </div>
        
        <button
          onClick={onClose}
          className={`
            w-full mt-6 py-3 px-6
            ${style.button}
            text-white font-bold text-lg
            rounded-xl
            shadow-lg
            transition-all duration-200
            hover:shadow-xl
            active:scale-95
          `}
        >
          确定
        </button>
        
        {reward.isPositive && (
          <div className="absolute -top-2 -right-2 text-4xl animate-spin-slow">
            ✨
          </div>
        )}
      </div>
    </div>
  );
}
