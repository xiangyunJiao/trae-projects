import { useGameStore } from '@/store/gameStore';

const BOARD_LAYOUT = [
  39, 38, 37, 36, 35, 34, 33, 32, 31, 30,
  29, 28, 27, 26, 25, 24, 23, 22, 21, 20,
  19, 18, 17, 16, 15, 14, 13, 12, 11, 10,
  9, 8, 7, 6, 5, 4, 3, 2, 1, 0
];

export default function GameBoard() {
  const { cells, currentPosition } = useGameStore();

  const getCellColor = (type: string) => {
    switch (type) {
      case 'start':
        return 'bg-gradient-to-br from-green-400 to-green-600 border-green-300';
      case 'end':
        return 'bg-gradient-to-br from-yellow-400 to-yellow-600 border-yellow-300';
      case 'destination':
        return 'bg-gradient-to-br from-purple-400 to-purple-600 border-purple-300';
      case 'reward':
        return 'bg-gradient-to-br from-blue-400 to-blue-600 border-blue-300';
      case 'punishment':
        return 'bg-gradient-to-br from-red-400 to-red-600 border-red-300';
      default:
        return 'bg-gradient-to-br from-gray-400 to-gray-600 border-gray-300';
    }
  };

  const getCellIcon = (type: string) => {
    switch (type) {
      case 'start':
        return '🏁';
      case 'end':
        return '🏆';
      case 'destination':
        return '⭐';
      case 'reward':
        return '🎁';
      case 'punishment':
        return '⚠️';
      default:
        return '';
    }
  };

  return (
    <div className="w-full max-w-lg mx-auto">
      <div className="relative">
        <div className="absolute -inset-4 bg-gradient-to-r from-purple-600 via-pink-500 to-purple-600 rounded-3xl blur-xl opacity-30" />
        
        <div className="relative bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-3 md:p-4 shadow-2xl border border-gray-700">
          <div className="grid grid-cols-10 gap-1 md:gap-2">
            {BOARD_LAYOUT.map((cellId, index) => {
              const cell = cells[cellId];
              const isCurrentPosition = currentPosition === cellId;
              
              return (
                <div
                  key={cellId}
                  className={`
                    relative aspect-square rounded-lg
                    ${getCellColor(cell.type)}
                    border-2
                    flex items-center justify-center
                    text-xs md:text-sm font-bold
                    shadow-lg
                    transition-all duration-300
                    ${isCurrentPosition ? 'ring-4 ring-yellow-400 ring-opacity-75 scale-110 z-10' : ''}
                  `}
                >
                  {isCurrentPosition && (
                    <div className="absolute -top-2 -left-2 w-8 h-8 md:w-10 md:h-10 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full border-2 border-white shadow-lg flex items-center justify-center text-lg md:text-xl z-20 animate-bounce">
                      🧑
                    </div>
                  )}
                  
                  <span className="text-base md:text-xl drop-shadow-lg">
                    {getCellIcon(cell.type)}
                  </span>
                  
                  {cell.isDestination && cell.destinationName && (
                    <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 text-[8px] md:text-[10px] text-white bg-black/70 px-1 rounded whitespace-nowrap">
                      {cell.destinationName}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
          
          <div className="mt-3 md:mt-4 flex flex-wrap justify-center gap-2 text-xs">
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 rounded bg-gradient-to-br from-green-400 to-green-600" />
              <span className="text-gray-300">起点</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 rounded bg-gradient-to-br from-yellow-400 to-yellow-600" />
              <span className="text-gray-300">终点</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 rounded bg-gradient-to-br from-purple-400 to-purple-600" />
              <span className="text-gray-300">目的地</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 rounded bg-gradient-to-br from-blue-400 to-blue-600" />
              <span className="text-gray-300">奖励</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 rounded bg-gradient-to-br from-red-400 to-red-600" />
              <span className="text-gray-300">惩罚</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
