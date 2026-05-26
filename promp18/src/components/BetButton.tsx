import React from 'react';

interface BetButtonProps {
  onClick: () => void;
  visible: boolean;
}

export const BetButton: React.FC<BetButtonProps> = ({ onClick, visible }) => {
  if (!visible) return null;

  return (
    <button
      onClick={onClick}
      className="fixed top-4 left-4 z-40 w-16 h-16 rounded-full animate-rainbow shadow-lg hover:scale-110 transition-transform animate-pulse-glow"
    >
      <div className="absolute inset-1 rounded-full bg-white flex items-center justify-center">
        <span className="text-2xl">🎰</span>
      </div>
      <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-xs font-bold text-yellow-600 whitespace-nowrap bg-white/80 px-2 py-0.5 rounded-full">
        押注
      </div>
    </button>
  );
};
