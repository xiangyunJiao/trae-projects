import { create } from 'zustand';

export const useStore = create((set, get) => ({
  currentUser: { id: 'user_1', name: '我', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=me' },
  chatList: [],
  messages: [],
  activeChat: null,
  typingUsers: {},
  socket: null,

  setSocket: (socket) => set({ socket }),
  
  setChatList: (chatList) => set({ chatList }),
  
  setMessages: (messages) => set({ messages }),
  
  addMessage: (message) => {
    const { messages, chatList, activeChat } = get();
    set({ messages: [...messages, message] });
    
    if (activeChat && activeChat.chatId === message.chatId) {
      const updatedChatList = chatList.map(chat => 
        chat.chatId === message.chatId 
          ? { ...chat, lastMessage: message.content, lastMessageType: message.type, lastMessageTime: message.createdAt }
          : chat
      );
      set({ chatList: updatedChatList });
    }
  },

  setActiveChat: (chat) => set({ activeChat: chat }),

  setTyping: ({ chatId, userId, isTyping }) => {
    const { typingUsers } = get();
    const newTypingUsers = { ...typingUsers };
    if (isTyping) {
      newTypingUsers[`${chatId}_${userId}`] = true;
    } else {
      delete newTypingUsers[`${chatId}_${userId}`];
    }
    set({ typingUsers: newTypingUsers });
  },

  isTyping: (chatId, userId) => {
    const { typingUsers } = get();
    return !!typingUsers[`${chatId}_${userId}`];
  },

  updateMessage: (messageId, updates) => {
    const { messages } = get();
    set({
      messages: messages.map(msg => 
        msg.id === messageId ? { ...msg, ...updates, metadata: { ...msg.metadata, ...updates.metadata } } : msg
      )
    });
  }
}));
