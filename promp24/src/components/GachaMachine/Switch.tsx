interface SwitchProps {
  isRotating: boolean;
  onClick: () => void;
  disabled?: boolean;
}

export function Switch({ isRotating, onClick, disabled }: SwitchProps) {
  return (
    <div className="absolute right-2 top-1/2 transform -translate-y-1/2 z-30">
      <div className="relative">
        <div className="absolute -left-24 top-1/2 transform -translate-y-1/2 text-white font-bold text-xs whitespace-nowrap bg-black/60 px-2 py-1 rounded animate-pulse">
          点击扭动 ↗
        </div>
        <button
          onClick={onClick}
          disabled={disabled || isRotating}
          className={`
            relative w-16 h-16 rounded-full
            bg-gradient-to-br from-red-500 to-red-700
            border-4 border-red-800
            shadow-xl shadow-red-900/60
            transition-all duration-200
            ${isRotating ? 'animate-switch-rotate' : ''}
            ${disabled ? 'opacity-50 cursor-not-allowed' : 'hover:scale-110 active:scale-95 cursor-pointer'}
          `}
          style={{
            boxShadow: disabled ? undefined : '0 0 15px rgba(239, 68, 68, 0.5), 0 0 30px rgba(239, 68, 68, 0.3)',
          }}
        >
          <div className="absolute inset-2 rounded-full bg-gradient-to-br from-red-400 to-red-600" />
          <div
            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-3 h-8 bg-red-900 rounded-full shadow-inner"
            style={{ transformOrigin: 'center center' }}
          />
          <div className="absolute top-2 left-1/2 transform -translate-x-1/2 w-2 h-4 bg-yellow-400 rounded-full shadow-lg" />
        </button>
      </div>
    </div>
  );
}
