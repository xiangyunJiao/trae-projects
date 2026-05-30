import React from 'react';
import './Modal.css';

interface LoseModalProps {
  onClose: () => void;
  reason: 'saved' | 'missed';
}

const LoseModal: React.FC<LoseModalProps> = ({ onClose, reason }) => {
  const getMessage = () => {
    if (reason === 'saved') {
      return {
        title: '很遗憾，被守门员扑出了！',
        subtitle: '差一点就进了，再试一次吧！',
      };
    }
    return {
      title: '很遗憾，球偏了！',
      subtitle: '调整一下角度，再来一次！',
    };
  };

  const message = getMessage();

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content lose-modal" onClick={e => e.stopPropagation()}>
        <div className="sad-football">
          <svg viewBox="0 0 100 100" className="w-full h-full">
            <circle cx="50" cy="50" r="45" fill="white" />
            <polygon points="50,10 62,30 38,30" fill="#000" opacity="0.8" />
            <polygon points="50,90 38,70 62,70" fill="#000" opacity="0.8" />
            <polygon points="15,50 35,40 35,60" fill="#000" opacity="0.8" />
            <polygon points="85,50 65,40 65,60" fill="#000" opacity="0.8" />
            <ellipse cx="35" cy="55" rx="6" ry="4" fill="#666" />
            <ellipse cx="65" cy="55" rx="6" ry="4" fill="#666" />
            <path d="M35,70 Q50,60 65,70" fill="none" stroke="#666" strokeWidth="3" strokeLinecap="round" />
          </svg>
        </div>

        <h2 className="lose-title">{message.title}</h2>
        <p className="lose-subtitle">{message.subtitle}</p>

        <div className="encouragement-card">
          <div className="encouragement-icon">⚽</div>
          <p className="encouragement-text">
            每一次射门都是进步！
            <br />
            下一次一定能进！
          </p>
        </div>

        <button className="modal-button lose-button" onClick={onClose}>
          再来一次
        </button>
      </div>
    </div>
  );
};

export default LoseModal;
