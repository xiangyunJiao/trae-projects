import React from 'react';
import { HorseColor } from '../types';

interface ResultModalProps {
  isOpen: boolean;
  isWinner: boolean;
  winAmount: number;
  winnerHorse: { id: number; name: string; color: HorseColor } | null;
  onClose: () => void;
}

const colorEmoji: Record<HorseColor, string> = {
  white: '🤍',
  brown: '🤎',
  black: '🖤',
};

export const ResultModal: React.FC<ResultModalProps> = ({
  isOpen,
  isWinner,
  winAmount,
  winnerHorse,
  onClose,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm animate-fade-in">
      <div className={`relative w-[90%] max-w-md rounded-3xl shadow-2xl animate-modal-in overflow-hidden ${
        isWinner 
          ? 'bg-gradient-to-br from-yellow-300 via-yellow-400 to-orange-400' 
          : 'bg-gradient-to-br from-gray-400 via-gray-500 to-gray-600'
      }`}>
        <div className="absolute inset-0 opacity-20">
          <div className={`absolute inset-0 bg-[repeating-linear-gradient(${isWinner ? '45deg' : '-45deg'},transparent,transparent_15px,rgba(255,255,255,0.2)_15px,rgba(255,255,255,0.2)_30px)]`} />
        </div>

        <div className="relative p-8 text-center">
          <div className="text-6xl mb-4 animate-bounce">
            {isWinner ? '🎉' : '😢'}
          </div>

          <h2 className={`text-3xl font-bold mb-2 ${isWinner ? 'text-yellow-900' : 'text-gray-200'}`}>
            {isWinner ? '恭喜你！' : '很遗憾'}
          </h2>

          <p className={`text-lg mb-6 ${isWinner ? 'text-yellow-800' : 'text-gray-300'}`}>
            {isWinner ? '你押中了获胜的马匹！' : '下次继续加油哦~'}
          </p>

          {winnerHorse && (
            <div className={`mb-6 p-4 rounded-2xl ${isWinner ? 'bg-white/30' : 'bg-white/20'}`}>
              <div className="text-4xl mb-2">{colorEmoji[winnerHorse.color]}</div>
              <div className={`font-bold ${isWinner ? 'text-yellow-900' : 'text-gray-200'}`}>
                {winnerHorse.name} 获得冠军！
              </div>
            </div>
          )}

          {isWinner && (
            <div className="mb-6">
              <div className={`text-sm mb-1 ${isWinner ? 'text-yellow-800' : 'text-gray-300'}`}>
                赢得金币
              </div>
              <div className="text-5xl font-bold text-yellow-900 animate-number-pop">
                +{winAmount.toLocaleString()}
              </div>
              <div className="text-2xl mt-1">💰</div>
            </div>
          )}

          <button
            onClick={onClose}
            className={`w-full py-4 rounded-2xl font-bold text-lg transition-all hover:scale-105 shadow-lg ${
              isWinner
                ? 'bg-gradient-to-r from-yellow-600 to-orange-600 text-white'
                : 'bg-gradient-to-r from-gray-600 to-gray-700 text-white'
            }`}
          >
            {isWinner ? '太棒了！' : '知道了'}
          </button>
        </div>

        {isWinner && (
          <>
            <div className="absolute top-4 left-4 text-4xl animate-spin" style={{ animationDuration: '3s' }}>🎊</div>
            <div className="absolute top-4 right-4 text-4xl animate-spin" style={{ animationDuration: '3s', animationDirection: 'reverse' }}>🎊</div>
            <div className="absolute bottom-4 left-8 text-3xl animate-bounce">✨</div>
            <div className="absolute bottom-4 right-8 text-3xl animate-bounce" style={{ animationDelay: '0.5s' }}>✨</div>
          </>
        )}
      </div>
    </div>
  );
};
