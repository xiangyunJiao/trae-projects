import React from 'react';
import type { CardData } from '@/data/cards';

interface CardFrontProps {
  card: CardData;
}

export const CardFront: React.FC<CardFrontProps> = ({ card }) => {
  const [c1, c2, c3] = card.colors;

  return (
    <svg viewBox="0 0 120 168" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
      <defs>
        <radialGradient id={`grad-${card.id}`} cx="50%" cy="40%" r="60%">
          <stop offset="0%" stopColor={c3} />
          <stop offset="50%" stopColor={c2} />
          <stop offset="100%" stopColor={c1} />
        </radialGradient>
        <filter id={`glow-${card.id}`}>
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      <rect x="2" y="2" width="116" height="164" rx="8" fill="#1a0a2e" stroke={c2} strokeWidth="2" />

      <rect x="6" y="6" width="108" height="156" rx="6" fill={`url(#grad-${card.id})`} opacity="0.3" />

      {renderElementPattern(card)}

      <text x="60" y="148" textAnchor="middle" fill={c3} fontSize="10" fontFamily="serif" fontWeight="bold">
        {card.name}
      </text>

      <rect x="2" y="2" width="116" height="164" rx="8" fill="none" stroke={c2} strokeWidth="1.5" opacity="0.6" />
      <rect x="8" y="8" width="104" height="152" rx="4" fill="none" stroke={c2} strokeWidth="0.5" opacity="0.3" />
    </svg>
  );
};

function renderElementPattern(card: CardData) {
  const [c1, c2, c3] = card.colors;

  switch (card.element) {
    case 'fire':
      return (
        <g filter={`url(#glow-${card.id})`}>
          <path d="M60 30 Q70 50 55 70 Q75 55 65 80 Q80 65 60 95 Q40 65 55 80 Q45 55 65 70 Q50 50 60 30Z" fill={c1} opacity="0.9" />
          <path d="M60 40 Q65 55 58 68 Q68 58 62 75 Q70 60 60 88 Q50 60 58 75 Q52 58 62 68 Q55 55 60 40Z" fill={c2} opacity="0.7" />
          <path d="M60 52 Q63 60 59 66 Q64 62 61 72 Q66 62 60 80 Q54 62 59 72 Q56 62 61 66 Q57 60 60 52Z" fill={c3} opacity="0.9" />
          <circle cx="35" cy="110" r="6" fill={c1} opacity="0.4" />
          <circle cx="85" cy="105" r="5" fill={c1} opacity="0.3" />
          <circle cx="60" cy="120" r="4" fill={c2} opacity="0.3" />
        </g>
      );
    case 'frost':
      return (
        <g filter={`url(#glow-${card.id})`}>
          {[
            [60, 60], [40, 45], [80, 45], [45, 80], [75, 80],
            [60, 35], [35, 65], [85, 65], [60, 95],
          ].map(([cx, cy], i) => (
            <g key={i} transform={`translate(${cx},${cy})`}>
              {[0, 60, 120, 180, 240, 300].map((angle, j) => (
                <line
                  key={j}
                  x1="0" y1="0"
                  x2={Math.cos((angle * Math.PI) / 180) * (i === 0 ? 22 : 8)}
                  y2={Math.sin((angle * Math.PI) / 180) * (i === 0 ? 22 : 8)}
                  stroke={i === 0 ? c2 : c1}
                  strokeWidth={i === 0 ? 1.5 : 0.8}
                  opacity={0.8}
                />
              ))}
              <circle r={i === 0 ? 3 : 1.5} fill={c3} opacity="0.9" />
            </g>
          ))}
        </g>
      );
    case 'thunder':
      return (
        <g filter={`url(#glow-${card.id})`}>
          <path d="M65 25 L50 65 L62 65 L48 105 L72 58 L58 58 L72 25Z" fill={c2} opacity="0.9" />
          <path d="M63 35 L52 63 L61 63 L51 95 L69 60 L59 60 L69 35Z" fill={c3} opacity="0.8" />
          <circle cx="42" cy="50" r="2" fill={c2} opacity="0.6" />
          <circle cx="78" cy="70" r="2" fill={c2} opacity="0.5" />
          <circle cx="55" cy="115" r="1.5" fill={c1} opacity="0.4" />
          <circle cx="68" cy="40" r="1" fill={c3} opacity="0.5" />
        </g>
      );
    case 'shadow':
      return (
        <g filter={`url(#glow-${card.id})`}>
          <circle cx="60" cy="55" r="25" fill={c1} opacity="0.6" />
          <circle cx="55" cy="50" r="20" fill={c2} opacity="0.5" />
          <circle cx="65" cy="60" r="18" fill={c1} opacity="0.4" />
          <path d="M40 40 Q30 55 45 70 Q35 60 50 50 Q40 55 55 40 Q45 45 40 40Z" fill={c2} opacity="0.5" />
          <path d="M80 45 Q85 60 75 75 Q85 65 70 55 Q80 60 75 45Z" fill={c2} opacity="0.4" />
          <circle cx="52" cy="48" r="4" fill={c3} opacity="0.3" />
          <circle cx="68" cy="58" r="3" fill={c3} opacity="0.25" />
          <path d="M50 100 Q55 90 60 100 Q65 90 70 100 Q60 110 50 100Z" fill={c2} opacity="0.3" />
        </g>
      );
    case 'light':
      return (
        <g filter={`url(#glow-${card.id})`}>
          <circle cx="60" cy="55" r="8" fill={c3} opacity="0.95" />
          <circle cx="60" cy="55" r="15" fill={c2} opacity="0.3" />
          <circle cx="60" cy="55" r="25" fill={c2} opacity="0.15" />
          {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((angle, i) => {
            const rad = (angle * Math.PI) / 180;
            const innerR = 18;
            const outerR = i % 2 === 0 ? 35 : 28;
            return (
              <line
                key={i}
                x1={60 + Math.cos(rad) * innerR}
                y1={55 + Math.sin(rad) * innerR}
                x2={60 + Math.cos(rad) * outerR}
                y2={55 + Math.sin(rad) * outerR}
                stroke={i % 2 === 0 ? c2 : c1}
                strokeWidth={i % 2 === 0 ? 2 : 1}
                opacity="0.7"
              />
            );
          })}
          <circle cx="45" cy="100" r="2" fill={c3} opacity="0.4" />
          <circle cx="75" cy="95" r="1.5" fill={c3} opacity="0.3" />
          <circle cx="55" cy="110" r="1" fill={c2} opacity="0.3" />
        </g>
      );
    case 'nature':
      return (
        <g filter={`url(#glow-${card.id})`}>
          <path d="M60 25 Q75 45 60 65 Q45 45 60 25Z" fill={c2} opacity="0.8" />
          <path d="M60 35 Q70 48 60 58 Q50 48 60 35Z" fill={c3} opacity="0.6" />
          <path d="M45 40 Q55 55 42 70 Q32 55 45 40Z" fill={c2} opacity="0.6" />
          <path d="M75 40 Q85 55 78 70 Q68 55 75 40Z" fill={c2} opacity="0.6" />
          <line x1="60" y1="65" x2="60" y2="105" stroke="#5d4e37" strokeWidth="2" />
          <path d="M60 80 Q50 75 45 80" fill="none" stroke={c2} strokeWidth="1.5" opacity="0.6" />
          <path d="M60 90 Q70 85 75 90" fill="none" stroke={c2} strokeWidth="1.5" opacity="0.6" />
          <circle cx="38" cy="100" r="3" fill={c1} opacity="0.3" />
          <circle cx="80" cy="105" r="2.5" fill={c1} opacity="0.25" />
          <path d="M50 115 Q55 108 60 115 Q65 108 70 115 Q60 125 50 115Z" fill={c2} opacity="0.3" />
        </g>
      );
    default:
      return null;
  }
}

export const CardBack: React.FC = () => {
  return (
    <svg viewBox="0 0 120 168" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
      <defs>
        <radialGradient id="back-grad" cx="50%" cy="50%" r="70%">
          <stop offset="0%" stopColor="#2a1a4e" />
          <stop offset="100%" stopColor="#0d0520" />
        </radialGradient>
        <pattern id="back-pattern" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
          <circle cx="10" cy="10" r="0.8" fill="#8b6fc0" opacity="0.4" />
          <path d="M10 5 L12 10 L10 15 L8 10Z" fill="none" stroke="#8b6fc0" strokeWidth="0.3" opacity="0.3" />
        </pattern>
      </defs>

      <rect x="2" y="2" width="116" height="164" rx="8" fill="#0d0520" stroke="#8b6fc0" strokeWidth="2" />
      <rect x="6" y="6" width="108" height="156" rx="6" fill="url(#back-grad)" />
      <rect x="6" y="6" width="108" height="156" rx="6" fill="url(#back-pattern)" />

      <g transform="translate(60,84)">
        <circle r="22" fill="none" stroke="#8b6fc0" strokeWidth="1" opacity="0.5" />
        <circle r="15" fill="none" stroke="#a78bfa" strokeWidth="0.8" opacity="0.4" />
        <circle r="8" fill="none" stroke="#c4b5fd" strokeWidth="0.6" opacity="0.3" />
        <path d="M0 -22 L0 22 M-22 0 L22 0" stroke="#8b6fc0" strokeWidth="0.5" opacity="0.3" />
        <path d="M-15.5 -15.5 L15.5 15.5 M15.5 -15.5 L-15.5 15.5" stroke="#8b6fc0" strokeWidth="0.5" opacity="0.3" />
        <circle r="3" fill="#a78bfa" opacity="0.6" />
        <path d="M0 -5 L2 -2 L0 1 L-2 -2Z" fill="#c4b5fd" opacity="0.5" />
      </g>

      <rect x="2" y="2" width="116" height="164" rx="8" fill="none" stroke="#a78bfa" strokeWidth="1" opacity="0.4" />
      <rect x="10" y="10" width="100" height="148" rx="3" fill="none" stroke="#8b6fc0" strokeWidth="0.5" opacity="0.25" />

      <text x="60" y="155" textAnchor="middle" fill="#8b6fc0" fontSize="7" fontFamily="serif" opacity="0.5">
        ✦ MYSTIC ✦
      </text>
    </svg>
  );
};
