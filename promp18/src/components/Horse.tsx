import React from 'react';
import { HorseColor } from '../types';

interface HorseProps {
  color: HorseColor;
  position: number;
  isRunning: boolean;
  lane: number;
}

const colorStyles: Record<HorseColor, { body: string; bodyLight: string; mane: string; legs: string; hoof: string }> = {
  white: { body: '#F0F0F0', bodyLight: '#FFFFFF', mane: '#E0E0E0', legs: '#E8E8E8', hoof: '#2D2D2D' },
  brown: { body: '#8B5A2B', bodyLight: '#A0724A', mane: '#5D3A1A', legs: '#6B4423', hoof: '#1A1A1A' },
  black: { body: '#2D2D2D', bodyLight: '#404040', mane: '#1A1A1A', legs: '#252525', hoof: '#0A0A0A' },
};

export const Horse: React.FC<HorseProps> = ({ color, position, isRunning, lane }) => {
  const colors = colorStyles[color];
  const laneOffset = 10 + lane * 55;

  return (
    <div
      className="absolute"
      style={{
        left: `${position}%`,
        top: `${laneOffset}px`,
        transform: 'translateX(-50%)',
        zIndex: 10 - lane,
      }}
    >
      <svg width="100" height="65" viewBox="0 0 100 65">
        <defs>
          <linearGradient id={`body-${color}`} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor={colors.bodyLight} />
            <stop offset="100%" stopColor={colors.body} />
          </linearGradient>
          <filter id={`shadow-${color}`}>
            <feDropShadow dx="0" dy="1" stdDeviation="0.5" floodOpacity="0.3"/>
          </filter>
        </defs>

        <g filter={`url(#shadow-${color})`}>
          <g className={isRunning ? 'animate-horse-body' : ''}>
            <ellipse cx="42" cy="35" rx="25" ry="12" fill={`url(#body-${color})`} />
            
            <path
              d="M 60 28 Q 67 18 73 16 Q 77 14 80 18 Q 83 22 81 28 L 77 32 Q 73 35 70 33"
              fill={`url(#body-${color})`}
            />
            
            <ellipse cx="80" cy="26" rx="9" ry="7" fill={`url(#body-${color})`} />
            
            <ellipse cx="82" cy="20" rx="5" ry="4" fill={`url(#body-${color})`} />
            
            <path
              d="M 65 20 Q 70 13 75 12 Q 80 11 83 14"
              fill={colors.mane}
              className={isRunning ? 'animate-horse-mane' : ''}
            />
            <path
              d="M 67 22 Q 71 16 77 14 Q 81 13 84 15"
              fill={colors.mane}
              opacity="0.7"
              className={isRunning ? 'animate-horse-mane' : ''}
            />
            
            <circle cx="84" cy="24" r="2" fill="#000" />
            <circle cx="84.5" cy="23.5" r="0.8" fill="#fff" />
            
            <ellipse cx="88" cy="28" rx="2.5" ry="1.8" fill={colors.hoof} />
            <ellipse cx="88" cy="27" rx="0.8" ry="0.6" fill="#1a1a1a" />
            
            <path
              d="M 57 26 Q 53 20 47 18 Q 43 17 40 20"
              fill={colors.mane}
              opacity="0.8"
            />
            
            <g className={isRunning ? 'animate-leg-front-left' : ''} style={{ transformOrigin: '54px 40px' }}>
              <rect x="51" y="40" width="5" height="16" rx="2.5" fill={colors.legs} />
              <rect x="52" y="52" width="3" height="8" rx="1.5" fill={colors.legs} transform="rotate(-15 53 56)" />
              <ellipse cx="54" cy="62" rx="3" ry="2" fill={colors.hoof} transform="rotate(-12 54 62)" />
            </g>
            
            <g className={isRunning ? 'animate-leg-front-right' : ''} style={{ transformOrigin: '60px 40px' }}>
              <rect x="58" y="40" width="5" height="16" rx="2.5" fill={colors.legs} />
              <rect x="59" y="52" width="3" height="8" rx="1.5" fill={colors.legs} transform="rotate(15 60 56)" />
              <ellipse cx="61" cy="62" rx="3" ry="2" fill={colors.hoof} transform="rotate(12 61 62)" />
            </g>
            
            <g className={isRunning ? 'animate-leg-back-left' : ''} style={{ transformOrigin: '26px 40px' }}>
              <rect x="23" y="40" width="5" height="16" rx="2.5" fill={colors.legs} />
              <rect x="24" y="52" width="3" height="8" rx="1.5" fill={colors.legs} transform="rotate(12 25 56)" />
              <ellipse cx="26" cy="62" rx="3" ry="2" fill={colors.hoof} transform="rotate(8 26 62)" />
            </g>
            
            <g className={isRunning ? 'animate-leg-back-right' : ''} style={{ transformOrigin: '33px 40px' }}>
              <rect x="30" y="40" width="5" height="16" rx="2.5" fill={colors.legs} />
              <rect x="31" y="52" width="3" height="8" rx="1.5" fill={colors.legs} transform="rotate(-12 32 56)" />
              <ellipse cx="33" cy="62" rx="3" ry="2" fill={colors.hoof} transform="rotate(-8 33 62)" />
            </g>
            
            <path
              d="M 18 32 Q 10 29 8 37 Q 6 45 13 42"
              fill={colors.mane}
              opacity="0.6"
            />
            
            <path
              d="M 13 39 Q 6 47 4 54 Q 10 48 16 45"
              fill={colors.mane}
              className={isRunning ? 'animate-horse-tail' : ''}
              opacity="0.8"
            />
            
            <path
              d="M 37 28 Q 39 26 42 26"
              stroke={colors.bodyLight}
              strokeWidth="0.8"
              fill="none"
              opacity="0.5"
            />
          </g>
        </g>
      </svg>

      {isRunning && (
        <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 flex gap-0.5">
          <div className="w-1.5 h-1 bg-amber-600/50 rounded-full animate-dust" style={{ animationDelay: '0s' }} />
          <div className="w-2 h-1.5 bg-amber-700/40 rounded-full animate-dust" style={{ animationDelay: '0.08s' }} />
          <div className="w-1.5 h-0.5 bg-amber-800/30 rounded-full animate-dust" style={{ animationDelay: '0.16s' }} />
        </div>
      )}
    </div>
  );
};
