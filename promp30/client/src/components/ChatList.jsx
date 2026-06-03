import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../store.js';

function ChatList({ onAddBot }) {
  const navigate = useNavigate();
  const { chatList, setActiveChat, currentUser, socket } = useStore();

  const handleChatClick = (chat) => {
    setActiveChat(chat);
    socket.emit('join_chat', chat.chatId);
    navigate(`/chat/${chat.chatId}`);
  };

  const formatTime = (timeStr) => {
    if (!timeStr) return '';
    const date = new Date(timeStr);
    const now = new Date();
    const diff = now - date;
    
    if (diff < 60000) return '刚刚';
    if (diff < 3600000) return `${Math.floor(diff / 60000)}分钟前`;
    if (diff < 86400000) return `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
    if (diff < 172800000) return '昨天';
    return `${date.getMonth() + 1}/${date.getDate()}`;
  };

  const getPreviewText = (chat) => {
    if (!chat.lastMessage) return '暂无消息';
    if (chat.lastMessageType === 'image') return '[图片]';
    if (chat.lastMessageType === 'video') return '[视频]';
    if (chat.lastMessageType === 'voice') return '[语音]';
    if (chat.lastMessageType === 'file') return '[文件]';
    if (chat.lastMessageType === 'sticker') return '[表情包]';
    if (chat.lastMessageType === 'emoji') return '[表情]';
    return chat.lastMessage;
  };

  return (
    <>
      <div className="header">消息</div>
      <div className="chat-list">
        {chatList.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">💬</div>
            <div className="empty-text">还没有聊天记录</div>
            <div className="empty-text" style={{ fontSize: '13px', marginTop: '8px' }}>点击右下角按钮添加机器人陪聊吧~</div>
          </div>
        ) : (
          chatList.map((chat) => (
            <div
              key={chat.chatId}
              className="chat-list-item"
              onClick={() => handleChatClick(chat)}
            >
              <div className="chat-list-avatar">
                <img src={chat.userAvatar} alt={chat.userName} />
              </div>
              <div className="chat-list-info">
                <div className="chat-list-name">
                  {chat.userName}
                  {chat.isBot && <span className="bot-badge">AI</span>}
                </div>
                <div className="chat-list-preview">{getPreviewText(chat)}</div>
              </div>
              <div className="chat-list-time">{formatTime(chat.lastMessageTime)}</div>
            </div>
          ))
        )}
      </div>
      <button className="add-bot-btn" onClick={onAddBot}>
        +
      </button>
    </>
  );
}

export default ChatList;
