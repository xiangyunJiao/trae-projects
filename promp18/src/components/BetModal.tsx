import React, { useState } from 'react';
import { X } from 'lucide-react';
import { HorseColor } from '../types';

interface BetModalProps {
  isOpen: boolean;
  countdown: number;
  userCoins: number;
  currentBet: { horseId: number; amount: number } | null;
  onClose: () => void;
  onPlaceBet: (horseId: number, amount: number) => void;
}

const horses = [
  { id: 1, name: '白马', color: 'white' as HorseColor, emoji: '🤍' },
  { id: 2, name: '驼马', color: 'brown' as HorseColor, emoji: '🤎' },
  { id: 3, name: '黑马', color: 'black' as HorseColor, emoji: '🖤' },
];

const betAmounts = [100, 500, 1000];

const colorClasses: Record<HorseColor, { bg: string; text: string }> = {
  white: { bg: 'bg-gradient-to-br from-gray-100 to-gray-200 border-gray-400', text: 'text-gray-700' },
  brown: { bg: 'bg-gradient-to-br from-amber-600 to-amber-800 border-amber-900', text: 'text-white' },
  black: { bg: 'bg-gradient-to-br from-gray-700 to-gray-900 border-gray-950', text: 'text-white' },
};

export const BetModal: React.FC<BetModalProps> = ({
  isOpen,
  countdown,
  userCoins,
  currentBet,
  onClose,
  onPlaceBet,
}) => {
  const [selectedHorse, setSelectedHorse] = useState<number | null>(currentBet?.horseId || null);
  const [selectedAmount, setSelectedAmount] = useState<number>(currentBet?.amount || 100);
  const [customAmount, setCustomAmount] = useState<string>('');
  const [isCustom, setIsCustom] = useState(false);

  if (!isOpen) return null;

  const handlePlaceBet = () => {
    if (selectedHorse && selectedAmount > 0 && selectedAmount <= userCoins) {
      onPlaceBet(selectedHorse, selectedAmount);
      onClose();
    }
  };

  const handleAmountSelect = (amount: number) => {
    setSelectedAmount(amount);
    setIsCustom(false);
    setCustomAmount('');
  };

  const handleCustomAmountChange = (value: string) => {
    setCustomAmount(value);
    const num = parseInt(value);
    if (!isNaN(num) && num > 0) {
      setSelectedAmount(num);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="relative w-[90%] max-w-md bg-gradient-to-br from-amber-100 to-orange-100 rounded-2xl shadow-2xl animate-modal-in overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 bg-[repeating-linear-gradient(45deg,transparent,transparent_10px,rgba(255,215,0,0.3)_10px,rgba(255,215,0,0.3)_20px)]" />
        </div>

        <div className="relative p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-amber-900">🎰 赛马竞猜</h2>
            <button
              onClick={onClose}
              className="p-2 rounded-full bg-amber-200 hover:bg-amber-300 transition-colors"
            >
              <X size={20} className="text-amber-800" />
            </button>
          </div>

          <div className="text-center mb-6">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-full shadow-lg">
              <span className="text-lg">⏰</span>
              <span className="text-2xl font-bold animate-pulse">{countdown}s</span>
              <span className="text-sm">后开始</span>
            </div>
          </div>

          <div className="mb-4">
            <p className="text-sm font-semibold text-amber-800 mb-2">选择马匹：</p>
            <div className="grid grid-cols-3 gap-2">
              {horses.map((horse) => (
                <button
                  key={horse.id}
                  onClick={() => setSelectedHorse(horse.id)}
                  className={`p-3 rounded-xl border-2 transition-all ${
                    selectedHorse === horse.id
                      ? 'ring-4 ring-yellow-400 scale-105 shadow-lg'
                      : 'hover:opacity-90'
                  } ${colorClasses[horse.color].bg}`}
                >
                  <div className="text-2xl mb-1">{horse.emoji}</div>
                  <div className={`text-xs font-bold ${colorClasses[horse.color].text}`}>
                    {horse.name}
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div className="mb-4">
            <p className="text-sm font-semibold text-amber-800 mb-2">选择金额：</p>
            <div className="grid grid-cols-3 gap-2 mb-2">
              {betAmounts.map((amount) => (
                <button
                  key={amount}
                  onClick={() => handleAmountSelect(amount)}
                  className={`p-3 rounded-xl font-bold transition-all ${
                    selectedAmount === amount && !isCustom
                      ? 'bg-yellow-500 text-white shadow-lg scale-105'
                      : 'bg-amber-200 text-amber-800 hover:bg-amber-300'
                  }`}
                >
                  💰 {amount}
                </button>
              ))}
            </div>
            <div className="flex items-center gap-2">
              <input
                type="number"
                placeholder="自定义金额"
                value={customAmount}
                onChange={(e) => handleCustomAmountChange(e.target.value)}
                onFocus={() => setIsCustom(true)}
                className="flex-1 px-4 py-2 rounded-xl bg-amber-200 text-amber-800 font-bold placeholder-amber-600 focus:outline-none focus:ring-2 focus:ring-yellow-500"
              />
              <span className="text-amber-800 font-bold">金币</span>
            </div>
          </div>

          <div className="flex items-center justify-between mb-4 p-3 bg-amber-200/50 rounded-xl">
            <span className="text-amber-800">你的金币：</span>
            <span className="text-xl font-bold text-amber-900">💰 {userCoins.toLocaleString()}</span>
          </div>

          {currentBet && (
            <div className="mb-4 p-3 bg-green-100 rounded-xl text-center">
              <span className="text-green-700 font-semibold">
                ✅ 已押注：{horses.find(h => h.id === currentBet.horseId)?.name} - {currentBet.amount}金币
              </span>
            </div>
          )}

          <button
            onClick={handlePlaceBet}
            disabled={!selectedHorse || selectedAmount > userCoins || selectedAmount <= 0}
            className={`w-full py-4 rounded-xl font-bold text-lg transition-all ${
              selectedHorse && selectedAmount <= userCoins && selectedAmount > 0
                ? 'bg-gradient-to-r from-yellow-500 to-orange-500 text-white shadow-lg hover:scale-105 hover:shadow-xl'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            🎲 确认押注
          </button>
        </div>
      </div>
    </div>
  );
};
