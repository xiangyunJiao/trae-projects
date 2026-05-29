import React, { useEffect, useState } from 'react';
import { X, Sparkles } from 'lucide-react';
import { Reward } from '@/types';
import { getRewardEmoji } from '@/data/rewards';

interface RewardModalProps {
  isOpen: boolean;
  reward: Reward | null;
  onClose: () => void;
}

const rewardGradients: Record<string, string[]> = {
  '1': ['from-amber-400', 'to-orange-500'],
  '2': ['from-blue-400', 'to-indigo-500'],
  '3': ['from-sky-400', 'to-cyan-500'],
  '4': ['from-emerald-400', 'to-green-500'],
  '5': ['from-purple-400', 'to-violet-500'],
  '6': ['from-pink-400', 'to-rose-500']
};

const RewardModal: React.FC<RewardModalProps> = ({ isOpen, reward, onClose }) => {
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setShowContent(false);
      const timer = setTimeout(() => setShowContent(true), 300);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  if (!isOpen || !reward) return null;

  const gradient = rewardGradients[reward.id] || ['from-orange-400', 'to-pink-500'];
  const emoji = getRewardEmoji(reward.id);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />
      
      <div
        className={`relative z-10 w-80 transform transition-all duration-500 ${
          showContent ? 'scale-100 opacity-100' : 'scale-75 opacity-0'
        }`}
      >
        <div className="absolute -top-8 left-1/2 transform -translate-x-1/2">
          <div className="relative">
            <Sparkles className="w-16 h-16 text-yellow-400 animate-pulse" />
            <div className="absolute inset-0 animate-ping">
              <Sparkles className="w-16 h-16 text-yellow-300 opacity-50" />
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-white to-gray-50 rounded-3xl shadow-2xl overflow-hidden pt-8">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
          >
            <X className="w-4 h-4 text-gray-500" />
          </button>

          <div className="p-6 text-center">
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              🎉 恭喜获得
            </h2>
            <p className="text-gray-500 text-sm mb-6">
              你成功解锁了新地点！
            </p>

            <div className="relative mx-auto w-32 h-32 mb-6">
              <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-2xl rotate-6 opacity-20" />
              <div className="absolute inset-0 bg-gradient-to-r from-pink-400 to-purple-500 rounded-2xl -rotate-6 opacity-20" />
              <div className={`relative w-full h-full rounded-2xl overflow-hidden shadow-lg border-4 border-white bg-gradient-to-br ${gradient[0]} ${gradient[1]} flex items-center justify-center`}>
                <span className="text-6xl">{emoji}</span>
              </div>
            </div>

            <h3 className="text-xl font-bold text-gray-800 mb-6">
              {reward.name}
            </h3>

            <button
              onClick={onClose}
              className="w-full py-3 px-6 bg-gradient-to-r from-orange-400 to-pink-500 text-white font-semibold rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
            >
              太棒了！
            </button>
          </div>
        </div>

        {[...Array(12)].map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 rounded-full"
            style={{
              background: ['#FBBF24', '#F472B6', '#60A5FA', '#34D399'][i % 4],
              left: `${10 + Math.random() * 80}%`,
              top: `${20 + Math.random() * 60}%`,
              animation: `float ${2 + Math.random() * 2}s ease-in-out infinite`,
              animationDelay: `${Math.random() * 1}s`,
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default RewardModal;
