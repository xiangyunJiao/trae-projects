import React from 'react';
import './KickButton.css';

interface KickButtonProps {
  onClick: () => void;
  disabled: boolean;
}

const KickButton: React.FC<KickButtonProps> = ({ onClick, disabled }) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`kick-button ${disabled ? 'disabled' : ''}`}
    >
      <div className="button-content">
        <div className="football-icon">
          <svg viewBox="0 0 100 100" className="w-full h-full">
            <circle cx="50" cy="50" r="45" fill="white" />
            <polygon points="50,10 62,30 38,30" fill="#000" opacity="0.9" />
            <polygon points="20,38 38,30 30,52" fill="#000" opacity="0.9" />
            <polygon points="80,38 62,30 70,52" fill="#000" opacity="0.9" />
            <polygon points="50,90 38,70 62,70" fill="#000" opacity="0.9" />
            <polygon points="15,62 30,52 35,72" fill="#000" opacity="0.9" />
            <polygon points="85,62 70,52 65,72" fill="#000" opacity="0.9" />
          </svg>
        </div>
        <span className="button-text">{disabled ? '射门中...' : '射 门'}</span>
      </div>
    </button>
  );
};

export default KickButton;
