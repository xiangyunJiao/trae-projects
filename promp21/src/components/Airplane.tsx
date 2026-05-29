import React from 'react';

interface AirplaneProps {
  x: number;
  y: number;
  angle: number;
}

const Airplane: React.FC<AirplaneProps> = ({ x, y, angle }) => {
  return (
    <div
      className="absolute z-40 pointer-events-none"
      style={{
        left: x,
        top: y,
        transform: `translate(-50%, -50%) rotate(${angle + 90}deg)`,
      }}
    >
      <div className="relative">
        <svg
          width="48"
          height="48"
          viewBox="0 0 64 64"
          className="drop-shadow-lg"
        >
          <defs>
            <linearGradient id="planeBody" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#60A5FA" />
              <stop offset="100%" stopColor="#3B82F6" />
            </linearGradient>
            <filter id="glow">
              <feGaussianBlur stdDeviation="2" result="coloredBlur" />
              <feMerge>
                <feMergeNode in="coloredBlur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>
          
          <g filter="url(#glow)">
            <path
              d="M32 8 L38 28 L56 32 L38 36 L32 56 L26 36 L8 32 L26 28 Z"
              fill="url(#planeBody)"
              stroke="#1D4ED8"
              strokeWidth="1"
            />
            <ellipse cx="32" cy="24" rx="4" ry="6" fill="#93C5FD" />
            <path
              d="M20 30 L12 40 L20 38 Z"
              fill="#2563EB"
            />
            <path
              d="M44 30 L52 40 L44 38 Z"
              fill="#2563EB"
            />
          </g>
        </svg>
        
        <div
          className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-3 h-8 bg-gradient-to-b from-orange-400 via-orange-300 to-transparent opacity-80 rounded-full blur-sm"
          style={{ animation: 'flicker 0.1s infinite alternate' }}
        />
      </div>
    </div>
  );
};

export default Airplane;
