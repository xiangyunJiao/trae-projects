import type { GameMode } from '../types';

interface ModeToggleProps {
  mode: GameMode;
  onModeChange: (mode: GameMode) => void;
  disabled?: boolean;
}

export function ModeToggle({ mode, onModeChange, disabled }: ModeToggleProps) {
  return (
    <div className="flex gap-3 mb-6">
      <button
        onClick={() => onModeChange('normal')}
        disabled={disabled}
        className={`
          flex-1 py-3 px-4 rounded-xl font-bold text-lg transition-all duration-300
          border-4 shadow-lg transform hover:scale-105 active:scale-95
          ${mode === 'normal'
            ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white border-orange-600 shadow-orange-500/50 scale-105'
            : 'bg-gray-800/80 text-gray-300 border-gray-600 hover:bg-gray-700/80'
          }
          ${disabled ? 'opacity-50 cursor-not-allowed hover:scale-100' : ''}
        `}
      >
        <span className="mr-2">🎃</span>
        初级扭蛋
      </button>
      <button
        onClick={() => onModeChange('premium')}
        disabled={disabled}
        className={`
          flex-1 py-3 px-4 rounded-xl font-bold text-lg transition-all duration-300
          border-4 shadow-lg transform hover:scale-105 active:scale-95
          ${mode === 'premium'
            ? 'bg-gradient-to-r from-yellow-400 to-amber-500 text-white border-yellow-500 shadow-yellow-500/50 scale-105 animate-pulse'
            : 'bg-gray-800/80 text-gray-300 border-gray-600 hover:bg-gray-700/80'
          }
          ${disabled ? 'opacity-50 cursor-not-allowed hover:scale-100' : ''}
        `}
      >
        <span className="mr-2">👑</span>
        高级扭蛋
      </button>
    </div>
  );
}
