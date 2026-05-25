import { useGameStore } from '@/store/gameStore';
import { playVictorySound } from '@/utils/sound';
import { useEffect } from 'react';

interface VictoryModalProps {
  onClose: () => void;
}

export default function VictoryModal({ onClose }: VictoryModalProps) {
  const { coins, resetGame } = useGameStore();
  
  useEffect(() => {
    playVictorySound();
  }, []);
  
  const handleRestart = () => {
    resetGame();
    onClose();
  };
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
      <div className="absolute inset-0" onClick={onClose} />
      
      <div className="relative z-10 w-80 md:w-96">
        <div className="absolute -inset-4 bg-gradient-to-r from-yellow-400 via-orange-400 to-yellow-400 rounded-3xl blur-xl animate-pulse" />
        
        <div className="relative bg-gradient-to-br from-yellow-400 via-orange-400 to-yellow-500 rounded-3xl p-6 md:p-8 shadow-2xl border-4 border-yellow-300">
          <div className="absolute -top-4 left-1/2 -translate-x-1/2">
            <div className="px-6 py-2 rounded-full bg-gradient-to-r from-orange-500 to-red-500 text-white font-bold text-lg shadow-lg">
              🏆 终极大奖
            </div>
          </div>
          
          <div className="mt-6 text-center">
            <div className="text-8xl md:text-9xl mb-4 animate-bounce">
              🏆
            </div>
            
            <h2 className="text-3xl md:text-4xl font-bold text-yellow-900 mb-2">
              恭喜通关！
            </h2>
            
            <p className="text-lg text-yellow-800 mb-6">
              你成功到达终点，获得了终极大奖！
            </p>
            
            <div className="bg-white/30 rounded-2xl p-4 mb-6">
              <p className="text-yellow-900 text-lg">总获得金币</p>
              <p className="text-4xl font-bold text-yellow-900">💰 {coins}</p>
            </div>
            
            <div className="flex justify-center gap-4 text-4xl mb-6">
              <span className="animate-bounce" style={{ animationDelay: '0ms' }}>🎉</span>
              <span className="animate-bounce" style={{ animationDelay: '100ms' }}>🎊</span>
              <span className="animate-bounce" style={{ animationDelay: '200ms' }}>✨</span>
              <span className="animate-bounce" style={{ animationDelay: '300ms' }}>🎊</span>
              <span className="animate-bounce" style={{ animationDelay: '400ms' }}>🎉</span>
            </div>
          </div>
          
          <div className="flex gap-3">
            <button
              onClick={handleRestart}
              className="flex-1 py-3 px-6 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white font-bold text-lg rounded-xl shadow-lg transition-all duration-200 hover:shadow-xl active:scale-95"
            >
              再玩一次
            </button>
            <button
              onClick={onClose}
              className="flex-1 py-3 px-6 bg-gradient-to-r from-gray-500 to-gray-600 hover:from-gray-600 hover:to-gray-700 text-white font-bold text-lg rounded-xl shadow-lg transition-all duration-200 hover:shadow-xl active:scale-95"
            >
              关闭
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
