import React, { useEffect, useState } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import ChatList from './components/ChatList.jsx';
import ChatWindow from './components/ChatWindow.jsx';
import BotSelectModal from './components/BotSelectModal.jsx';
import { useStore } from './store.js';
import { initSocket } from './socket.js';

function App() {
  const navigate = useNavigate();
  const { setSocket, setChatList, addMessage, setTyping, setActiveChat, currentUser } = useStore();
  const [showBotSelect, setShowBotSelect] = useState(false);

  useEffect(() => {
    const socket = initSocket();
    setSocket(socket);

    socket.on('connect', () => {
      console.log('Socket connected:', socket.id);
      socket.emit('register', currentUser.id);
      socket.emit('get_chat_list', currentUser.id);
    });

    socket.on('disconnect', () => {
      console.log('Socket disconnected');
    });

    socket.on('connect_error', (err) => {
      console.error('Socket connect error:', err.message);
    });

    socket.on('chat_list', (chatList) => {
      console.log('Received chat list:', chatList);
      setChatList(chatList);
    });

    socket.on('new_message', (message) => {
      addMessage(message);
    });

    socket.on('user_typing', ({ chatId, userId, isTyping }) => {
      setTyping({ chatId, userId, isTyping });
    });

    socket.on('chat_created', ({ chatId }) => {
      console.log('Chat created:', chatId);
      socket.emit('get_chat_list', currentUser.id);
    });

    if (socket.connected) {
      socket.emit('register', currentUser.id);
      socket.emit('get_chat_list', currentUser.id);
    }

    return () => {
      socket.off('connect');
      socket.off('disconnect');
      socket.off('connect_error');
      socket.off('chat_list');
      socket.off('new_message');
      socket.off('user_typing');
      socket.off('chat_created');
    };
  }, []);

  const handleAddBot = () => {
    setShowBotSelect(true);
  };

  const handleBotSelect = async (botId) => {
    const socket = useStore.getState().socket;
    setShowBotSelect(false);
    
    const expectedChatId = [currentUser.id, botId].sort().join('_');
    
    const checkAndNavigate = () => {
      const chatList = useStore.getState().chatList;
      const chat = chatList.find(c => c.chatId === expectedChatId);
      if (chat) {
        setActiveChat(chat);
        navigate(`/chat/${expectedChatId}`);
      } else {
        setTimeout(checkAndNavigate, 100);
      }
    };
    
    socket.emit('create_chat_with_bot', { userId: currentUser.id, botId });
    checkAndNavigate();
  };

  return (
    <div className="app-container">
      <Routes>
        <Route path="/" element={<ChatList onAddBot={handleAddBot} />} />
        <Route path="/chat/:chatId" element={<ChatWindow />} />
      </Routes>
      
      {showBotSelect && (
        <BotSelectModal 
          onSelect={handleBotSelect} 
          onClose={() => setShowBotSelect(false)} 
        />
      )}
    </div>
  );
}

export default App;
