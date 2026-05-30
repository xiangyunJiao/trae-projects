import React from 'react';
import './Player.css';

interface PlayerProps {
  isKicking: boolean;
}

const Player: React.FC<PlayerProps> = ({ isKicking }) => {
  return (
    <div className={`absolute bottom-[8%] left-1/2 -translate-x-1/2 player-container ${isKicking ? 'kicking' : ''}`}>
      <div className="relative w-28 h-44 md:w-36 md:h-56">
        <svg viewBox="0 0 120 180" className="w-full h-full player-svg">
          <defs>
            <linearGradient id="playerSkin" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FFDAB9" />
              <stop offset="100%" stopColor="#DEB887" />
            </linearGradient>
            <linearGradient id="playerJersey" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#3B82F6" />
              <stop offset="50%" stopColor="#2563EB" />
              <stop offset="100%" stopColor="#1D4ED8" />
            </linearGradient>
            <linearGradient id="playerShorts" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#1F2937" />
              <stop offset="100%" stopColor="#111827" />
            </linearGradient>
            <linearGradient id="playerSock" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FFFFFF" />
              <stop offset="100%" stopColor="#F3F4F6" />
            </linearGradient>
            <linearGradient id="playerShoe" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#1F2937" />
              <stop offset="100%" stopColor="#111827" />
            </linearGradient>
            <linearGradient id="playerHair" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#78350F" />
              <stop offset="100%" stopColor="#451A03" />
            </linearGradient>
          </defs>

          <ellipse cx="60" cy="175" rx="40" ry="6" fill="rgba(0,0,0,0.25)" />

          <g className="player-body">
            <g className="player-left-leg leg">
              <rect x="45" y="110" width="14" height="48" rx="4" fill="url(#playerSock)" />
              <rect x="47" y="138" width="10" height="3" fill="#EF4444" />
              <path d="M43,155 L43,170 Q43,175 50,175 L59,175 Q59,175 59,170 L59,155 Z" fill="url(#playerShoe)" />
              <rect x="45" y="168" width="12" height="2" fill="#FBBF24" rx="1" />
            </g>

            <g className="player-right-leg kicking-leg leg">
              <rect x="61" y="110" width="14" height="48" rx="4" fill="url(#playerSock)" />
              <rect x="63" y="138" width="10" height="3" fill="#EF4444" />
              <path d="M61,155 L61,170 Q61,175 68,175 L77,175 Q77,175 77,170 L77,155 Z" fill="url(#playerShoe)" />
              <rect x="63" y="168" width="12" height="2" fill="#FBBF24" rx="1" />
            </g>

            <path d="M35,65 Q30,85 33,115 L87,115 Q90,85 85,65 Q60,75 35,65" fill="url(#playerJersey)" />
            <path d="M45,65 L45,115 L75,115 L75,65 Q60,70 45,65" fill="url(#playerJersey)" opacity="0.7" />
            <rect x="35" y="110" width="52" height="18" rx="4" fill="url(#playerShorts)" />
            <rect x="58" y="112" width="4" height="14" fill="#374151" />

            <ellipse cx="60" cy="55" rx="22" ry="28" fill="url(#playerJersey)" />
            <ellipse cx="60" cy="55" rx="18" ry="24" fill="#1E40AF" opacity="0.3" />
            <text x="60" y="63" textAnchor="middle" fill="white" fontSize="22" fontWeight="900" fontFamily="Arial, sans-serif">10</text>
            <rect x="52" y="30" width="16" height="6" rx="2" fill="#FBBF24" />
            <text x="60" y="35" textAnchor="middle" fill="#1F2937" fontSize="5" fontWeight="bold">MESSI</text>

            <ellipse cx="60" cy="28" rx="16" ry="18" fill="url(#playerSkin)" />
            <ellipse cx="60" cy="20" rx="17" ry="10" fill="url(#playerHair)" />
            <ellipse cx="60" cy="16" rx="14" ry="6" fill="url(#playerHair)" />
            <path d="M45,18 Q50,22 55,18" stroke="#451A03" strokeWidth="2" fill="none" />
            <path d="M65,18 Q70,22 75,18" stroke="#451A03" strokeWidth="2" fill="none" />
            <ellipse cx="52" cy="28" rx="2" ry="1.5" fill="#92400E" />
            <ellipse cx="68" cy="28" rx="2" ry="1.5" fill="#92400E" />

            <g className="player-left-arm arm">
              <path d="M35,60 Q20,80 18,110" stroke="url(#playerJersey)" strokeWidth="14" fill="none" strokeLinecap="round" />
              <ellipse cx="16" cy="112" rx="9" ry="11" fill="url(#playerSkin)" />
            </g>

            <g className="player-right-arm arm">
              <path d="M85,60 Q100,80 102,110" stroke="url(#playerJersey)" strokeWidth="14" fill="none" strokeLinecap="round" />
              <ellipse cx="104" cy="112" rx="9" ry="11" fill="url(#playerSkin)" />
            </g>
          </g>
        </svg>
      </div>
    </div>
  );
};

export default Player;
