import React from 'react';
import { SaveDirection } from '@/types';
import './Goalkeeper.css';

interface GoalkeeperProps {
  saveDirection: SaveDirection;
  isActive: boolean;
}

const Goalkeeper: React.FC<GoalkeeperProps> = ({ saveDirection, isActive }) => {
  const getSaveClass = () => {
    if (!isActive || !saveDirection) return '';
    return `save-${saveDirection}`;
  };

  return (
    <div className={`absolute bottom-[50%] left-1/2 -translate-x-1/2 goalkeeper-container ${getSaveClass()}`}>
      <div className="relative w-20 h-28 md:w-24 md:h-36">
        <svg viewBox="0 0 100 140" className="w-full h-full goalkeeper-svg">
          <defs>
            <linearGradient id="gkSkin" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FFDAB9" />
              <stop offset="100%" stopColor="#DEB887" />
            </linearGradient>
            <linearGradient id="gkJersey" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#22C55E" />
              <stop offset="50%" stopColor="#16A34A" />
              <stop offset="100%" stopColor="#15803D" />
            </linearGradient>
            <linearGradient id="gkShorts" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#1F2937" />
              <stop offset="100%" stopColor="#111827" />
            </linearGradient>
            <linearGradient id="glove" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#F97316" />
              <stop offset="100%" stopColor="#EA580C" />
            </linearGradient>
            <linearGradient id="gkSock" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#22C55E" />
              <stop offset="100%" stopColor="#16A34A" />
            </linearGradient>
          </defs>

          <ellipse cx="50" cy="132" rx="35" ry="5" fill="rgba(0,0,0,0.2)" />

          <g className="gk-body">
            <rect x="38" y="85" width="10" height="35" rx="3" fill="url(#gkSock)" />
            <rect x="52" y="85" width="10" height="35" rx="3" fill="url(#gkSock)" />
            <rect x="36" y="118" width="14" height="6" rx="2" fill="#1F2937" />
            <rect x="50" y="118" width="14" height="6" rx="2" fill="#1F2937" />
            <rect x="37" y="123" width="12" height="4" rx="1" fill="#EAB308" />
            <rect x="51" y="123" width="12" height="4" rx="1" fill="#EAB308" />

            <path d="M32,55 Q28,70 30,88 L70,88 Q72,70 68,55 Q50,65 32,55" fill="url(#gkJersey)" />
            <rect x="30" y="85" width="40" height="10" rx="2" fill="url(#gkShorts)" />

            <ellipse cx="50" cy="45" rx="18" ry="22" fill="url(#gkJersey)" />
            <rect x="45" y="40" width="10" height="8" rx="2" fill="#1F2937" />
            <text x="50" y="47" textAnchor="middle" fill="white" fontSize="8" fontWeight="bold">1</text>

            <g className="gk-head">
              <ellipse cx="50" cy="28" rx="14" ry="16" fill="url(#gkSkin)" />
              <ellipse cx="50" cy="18" rx="15" ry="8" fill="#78350F" />
              <rect x="42" y="14" width="16" height="6" fill="#78350F" />
              
              <ellipse cx="45" cy="28" rx="2.5" ry="3" fill="white" />
              <ellipse cx="55" cy="28" rx="2.5" ry="3" fill="white" />
              <circle cx="45" cy="28" r="1.5" fill="#1F2937" />
              <circle cx="55" cy="28" r="1.5" fill="#1F2937" />
              <circle cx="45.5" cy="27.5" r="0.5" fill="white" />
              <circle cx="55.5" cy="27.5" r="0.5" fill="white" />
              
              <path d="M42,23 Q45,22 47,23" stroke="#78350F" strokeWidth="1.5" fill="none" />
              <path d="M53,23 Q55,22 58,23" stroke="#78350F" strokeWidth="1.5" fill="none" />
              
              <ellipse cx="50" cy="33" rx="1.5" ry="1" fill="#D4A574" />
              <path d="M45,37 Q50,40 55,37" stroke="#92400E" strokeWidth="1.5" fill="none" strokeLinecap="round" />
            </g>

            <g className="gk-left-arm arm">
              <path d="M32,55 Q15,45 12,30" stroke="url(#gkJersey)" strokeWidth="10" fill="none" strokeLinecap="round" />
              <ellipse cx="10" cy="26" rx="8" ry="10" fill="url(#glove)" />
              <ellipse cx="10" cy="26" rx="6" ry="8" fill="#FED7AA" opacity="0.3" />
              <line x1="6" y1="22" x2="14" y2="22" stroke="#C2410C" strokeWidth="1" />
              <line x1="6" y1="26" x2="14" y2="26" stroke="#C2410C" strokeWidth="1" />
              <line x1="6" y1="30" x2="14" y2="30" stroke="#C2410C" strokeWidth="1" />
            </g>

            <g className="gk-right-arm arm">
              <path d="M68,55 Q85,45 88,30" stroke="url(#gkJersey)" strokeWidth="10" fill="none" strokeLinecap="round" />
              <ellipse cx="90" cy="26" rx="8" ry="10" fill="url(#glove)" />
              <ellipse cx="90" cy="26" rx="6" ry="8" fill="#FED7AA" opacity="0.3" />
              <line x1="86" y1="22" x2="94" y2="22" stroke="#C2410C" strokeWidth="1" />
              <line x1="86" y1="26" x2="94" y2="26" stroke="#C2410C" strokeWidth="1" />
              <line x1="86" y1="30" x2="94" y2="30" stroke="#C2410C" strokeWidth="1" />
            </g>
          </g>
        </svg>
      </div>
    </div>
  );
};

export default Goalkeeper;
