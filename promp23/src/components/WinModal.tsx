import React, { useEffect } from 'react';
import { Prize } from '@/types';
import { playCheerSound } from '@/utils/sound';
import './Modal.css';

interface WinModalProps {
  prize: Prize;
  onClose: () => void;
}

const WinModal: React.FC<WinModalProps> = ({ prize, onClose }) => {
  useEffect(() => {
    playCheerSound();
  }, []);

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content win-modal" onClick={e => e.stopPropagation()}>
        <div className="confetti">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="confetti-piece"
              style={{
                left: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 0.5}s`,
                backgroundColor: ['#FFD700', '#FF6B6B', '#4ECDC4', '#45B7D1', '#FF69B4'][i % 5],
              }}
            />
          ))}
        </div>

        <div className="trophy-icon">
          <svg viewBox="0 0 100 100" className="w-full h-full">
            <defs>
              <linearGradient id="goldGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#FFD700" />
                <stop offset="50%" stopColor="#FFA500" />
                <stop offset="100%" stopColor="#FFD700" />
              </linearGradient>
            </defs>
            <path
              d="M30,20 L30,50 Q30,80 50,85 Q70,80 70,50 L70,20 Z"
              fill="url(#goldGradient)"
              stroke="#B8860B"
              strokeWidth="2"
            />
            <path
              d="M30,30 Q10,30 10,50 Q10,70 25,65"
              fill="none"
              stroke="url(#goldGradient)"
              strokeWidth="4"
              strokeLinecap="round"
            />
            <path
              d="M70,30 Q90,30 90,50 Q90,70 75,65"
              fill="none"
              stroke="url(#goldGradient)"
              strokeWidth="4"
              strokeLinecap="round"
            />
            <rect x="40" y="85" width="20" height="8" fill="url(#goldGradient)" stroke="#B8860B" strokeWidth="1" />
            <rect x="35" y="93" width="30" height="5" rx="2" fill="url(#goldGradient)" stroke="#B8860B" strokeWidth="1" />
          </svg>
        </div>

        <h2 className="win-title">恭喜进球！</h2>
        <p className="win-subtitle">你获得了以下奖励</p>

        <div className="prize-card">
          <div className="prize-image-container">
            <img src={prize.image} alt={prize.name} className="prize-image" />
          </div>
          <div className="prize-info">
            <h3 className="prize-name">{prize.name}</h3>
            {prize.value !== undefined && (
              <div className="prize-value">
                <span className="coin-icon">💰</span>
                <span className="value-text">¥{prize.value}</span>
              </div>
            )}
          </div>
        </div>

        <div className="football-decoration left">
          <svg viewBox="0 0 100 100" className="w-full h-full">
            <circle cx="50" cy="50" r="45" fill="white" />
            <polygon points="50,10 62,30 38,30" fill="#000" opacity="0.8" />
            <polygon points="50,90 38,70 62,70" fill="#000" opacity="0.8" />
            <polygon points="15,50 35,40 35,60" fill="#000" opacity="0.8" />
            <polygon points="85,50 65,40 65,60" fill="#000" opacity="0.8" />
          </svg>
        </div>
        <div className="football-decoration right">
          <svg viewBox="0 0 100 100" className="w-full h-full">
            <circle cx="50" cy="50" r="45" fill="white" />
            <polygon points="50,10 62,30 38,30" fill="#000" opacity="0.8" />
            <polygon points="50,90 38,70 62,70" fill="#000" opacity="0.8" />
            <polygon points="15,50 35,40 35,60" fill="#000" opacity="0.8" />
            <polygon points="85,50 65,40 65,60" fill="#000" opacity="0.8" />
          </svg>
        </div>

        <button className="modal-button win-button" onClick={onClose}>
          太棒了！
        </button>
      </div>
    </div>
  );
};

export default WinModal;
