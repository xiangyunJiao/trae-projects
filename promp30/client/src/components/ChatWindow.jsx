import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useStore } from '../store.js';
import MessageItem from './MessageItem.jsx';
import InputArea from './InputArea.jsx';
import ImageEditor from './ImageEditor.jsx';

function ChatWindow() {
  const { chatId } = useParams();
  const navigate = useNavigate();
  const messagesEndRef = useRef(null);
  const typingTimeoutRef = useRef(null);
  
  const { 
    activeChat, 
    messages, 
    setMessages, 
    socket, 
    currentUser,
    isTyping,
    typingUsers
  } = useStore();
  
  const [showImageEditor, setShowImageEditor] = useState(false);
  const [editingImage, setEditingImage] = useState(null);

  useEffect(() => {
    if (socket && chatId) {
      socket.emit('join_chat', chatId);
      socket.emit('get_messages', { chatId, userId: currentUser.id });
      
      const handleMessages = (msgs) => {
        setMessages(msgs);
      };
      
      socket.on('messages', handleMessages);
      
      return () => {
        socket.off('messages', handleMessages);
        socket.emit('leave_chat', chatId);
      };
    }
  }, [socket, chatId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = useCallback((message) => {
    if (!socket || !activeChat) return;
    
    const fullMessage = {
      ...message,
      chatId: activeChat.chatId,
      from: currentUser.id,
      to: activeChat.userId,
      createdAt: new Date().toISOString()
    };
    
    socket.emit('send_message', fullMessage);
  }, [socket, activeChat, currentUser]);

  const handleImageSelect = (file) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      setEditingImage(e.target.result);
      setShowImageEditor(true);
    };
    reader.readAsDataURL(file);
  };

  const handleImageEditComplete = (editedImageDataUrl) => {
    setShowImageEditor(false);
    setEditingImage(null);
    
    fetch(editedImageDataUrl)
      .then(res => res.blob())
      .then(blob => {
        const file = new File([blob], 'edited_image.png', { type: 'image/png' });
        const formData = new FormData();
        formData.append('file', file);
        
        return fetch('/upload', {
          method: 'POST',
          body: formData
        });
      })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          handleSendMessage({
            type: 'image',
            content: data.url
          });
        }
      });
  };

  const handleTyping = useCallback((isTyping) => {
    if (!socket || !activeChat) return;
    
    socket.emit('typing', {
      chatId: activeChat.chatId,
      userId: currentUser.id,
      isTyping
    });
    
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
    
    if (isTyping) {
      typingTimeoutRef.current = setTimeout(() => {
        socket.emit('typing', {
          chatId: activeChat.chatId,
          userId: currentUser.id,
          isTyping: false
        });
      }, 2000);
    }
  }, [socket, activeChat, currentUser]);

  const otherUserTyping = activeChat ? isTyping(activeChat.chatId, activeChat.userId) : false;

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日 ${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
  };

  const shouldShowTime = (index) => {
    if (index === 0) return true;
    const curr = new Date(messages[index].createdAt);
    const prev = new Date(messages[index - 1].createdAt);
    return curr - prev > 5 * 60 * 1000;
  };

  if (!activeChat) {
    return (
      <div className="chat-window">
        <div className="chat-header">
          <button className="back-btn" onClick={() => navigate('/')}>←</button>
        </div>
        <div className="empty-state">
          <div className="empty-icon">💬</div>
          <div className="empty-text">加载中...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="chat-window">
      <div className="chat-header">
        <button className="back-btn" onClick={() => navigate('/')}>←</button>
        <div className="chat-header-info">
          <div className="chat-header-name">
            {activeChat.userName}
            {activeChat.isBot && <span className="bot-badge" style={{ marginLeft: '6px' }}>AI</span>}
          </div>
          {otherUserTyping && (
            <div className="typing-indicator">
              对方正在输入<span className="typing-dots"><span>.</span><span>.</span><span>.</span></span>
            </div>
          )}
        </div>
        <div style={{ width: '40px' }}></div>
      </div>
      
      <div className="messages-container">
        {messages.map((msg, index) => (
          <React.Fragment key={msg.id}>
            {shouldShowTime(index) && (
              <div className="message-time">{formatDate(msg.createdAt)}</div>
            )}
            <MessageItem 
              message={msg} 
              isSelf={msg.from === currentUser.id}
              avatar={msg.from === currentUser.id ? currentUser.avatar : activeChat.userAvatar}
              onSendMessage={handleSendMessage}
            />
          </React.Fragment>
        ))}
        <div ref={messagesEndRef} />
      </div>
      
      <InputArea 
        onSendMessage={handleSendMessage}
        onTyping={handleTyping}
        onImageSelect={handleImageSelect}
      />
      
      {showImageEditor && editingImage && (
        <ImageEditor
          imageSrc={editingImage}
          onComplete={handleImageEditComplete}
          onCancel={() => {
            setShowImageEditor(false);
            setEditingImage(null);
          }}
        />
      )}
    </div>
  );
}

export default ChatWindow;
