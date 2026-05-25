import { useGameStore } from '@/store/gameStore';

export default function UserInfo() {
  const { coins, currentPosition, hasFinished } = useGameStore();
  
  const progress = Math.min((currentPosition / 39) * 100, 100);
  
  return (
    <div className="w-full max-w-lg mx-auto mb-4">
      <div className="bg-gradient-to-r from-gray-800 to-gray-900 rounded-2xl p-4 shadow-xl border border-gray-700">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 md:w-14 md:h-14 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center text-2xl md:text-3xl shadow-lg border-2 border-blue-300">
              🧑
            </div>
            <div>
              <p className="text-white font-bold text-sm md:text-base">幸运玩家</p>
              <p className="text-gray-400 text-xs md:text-sm">第 {currentPosition + 1} / 40 步</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2 bg-yellow-500/20 px-3 py-2 rounded-xl border border-yellow-500/30">
            <span className="text-xl md:text-2xl">💰</span>
            <span className="text-yellow-400 font-bold text-lg md:text-xl">{coins}</span>
          </div>
        </div>
        
        <div className="relative">
          <div className="h-3 bg-gray-700 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-green-400 via-yellow-400 to-red-400 rounded-full transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="flex justify-between mt-1 text-xs text-gray-500">
            <span>🏁 起点</span>
            <span>🏆 终点</span>
          </div>
        </div>
        
        {hasFinished && (
          <div className="mt-3 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-xl p-3 text-center">
            <p className="text-white font-bold text-lg">🎊 恭喜完成游戏！</p>
            <p className="text-yellow-100 text-sm">你已获得终极大奖！</p>
          </div>
        )}
      </div>
    </div>
  );
}
