import React from 'react';

function BotSelectModal({ onSelect, onClose }) {
  const bots = [
    {
      id: 'male_bot',
      name: '小帅',
      gender: 'male',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=handsome&backgroundColor=b6e3f4',
      desc: '阳光开朗，热情健谈的小哥哥'
    },
    {
      id: 'female_bot',
      name: '小美',
      gender: 'female',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=beauty&backgroundColor=ffd5dc',
      desc: '温柔可爱，善解人意的小姐姐'
    }
  ];

  return (
    <div className="bot-select-modal" onClick={onClose}>
      <div className="bot-select-content" onClick={(e) => e.stopPropagation()}>
        <h3>选择陪聊机器人</h3>
        <div className="bot-options">
          {bots.map((bot) => (
            <div
              key={bot.id}
              className={`bot-option ${bot.gender}`}
              onClick={() => onSelect(bot.id)}
            >
              <div className="bot-avatar">
                <img src={bot.avatar} alt={bot.name} />
              </div>
              <div className="bot-name">{bot.name}</div>
              <div className="bot-desc">{bot.desc}</div>
            </div>
          ))}
        </div>
        <button 
          onClick={onClose}
          style={{
            width: '100%',
            marginTop: '20px',
            padding: '10px',
            border: 'none',
            background: '#f5f5f5',
            borderRadius: '8px',
            color: '#666',
            cursor: 'pointer',
            fontSize: '14px'
          }}
        >
          取消
        </button>
      </div>
    </div>
  );
}

export default BotSelectModal;
