import { v4 as uuidv4 } from 'uuid';

const maleResponses = [
  '哇！你好呀~ 😊 很高兴认识你！',
  '今天过得怎么样？有什么想聊的吗？',
  '哈哈，你说的太有意思了！继续说继续说~',
  '嗯嗯，我在认真听呢，你说的很有道理！',
  '哦？这真的太棒了！给你点赞 👍',
  '我觉得你真的很有趣，跟你聊天超开心的！',
  '还有还有，我最近发现了一家超好吃的餐厅，想推荐给你~',
  '哇塞，你太厉害了吧！教教我呗~',
  '嘿嘿，你是不是偷偷练过说话？怎么这么会聊~',
  '我跟你说哦，我特别喜欢交朋友，尤其是像你这么棒的朋友！',
  '哇！这个话题我超感兴趣的！快多跟我说说~',
  '你知道吗？跟你聊天时间过得超快的！',
  '哈哈哈哈，你太幽默了！我笑得停不下来~',
  '真的吗真的吗？太神奇了！',
  '我觉得我们三观超合的！以后要常联系哦~ 😄'
];

const femaleResponses = [
  '亲爱的~你好呀！💖 见到你超开心的！',
  '今天有没有发生什么有趣的事呀？快跟我说说~',
  '哇~你说的好有道理，我完全同意！',
  '嗯嗯嗯，我在听呢~继续说呀~',
  '天哪！这也太厉害了吧！你真的好棒哦 🌟',
  '跟你聊天真的好舒服，感觉心情都变好了~',
  '我最近新学了一道菜，超好吃的！下次做给你尝尝~',
  '你真的好会说话呀，说的我心里暖暖的~',
  '嘻嘻~能认识你真是太幸运了！',
  '你知道吗？我一直都很期待跟你聊天呢~',
  '哇哦！这个我也喜欢！我们太有共同语言了吧~',
  '时间过得好快呀，跟你聊天真开心~',
  '哈哈~你太可爱了！我好喜欢~ 😘',
  '真的假的？太不可思议了！快跟我详细说说~',
  '我觉得我们会成为很好的朋友的！以后要天天聊天哦~ 💫'
];

const voiceTexts = {
  male: [
    '你好呀，很高兴认识你！',
    '今天天气真好，我们聊点什么呢？',
    '哈哈，你说的太有意思了！',
    '我觉得你真的很有趣，跟你聊天超开心！',
    '哇塞，你也太厉害了吧！'
  ],
  female: [
    '亲爱的，你好呀！见到你超开心的！',
    '跟你聊天真的好舒服，心情都变好了~',
    '你说的好有道理，我完全同意！',
    '嘻嘻，能认识你真是太幸运了！',
    '你真的好会说话呀，说的我心里暖暖的~'
  ]
};

export function initBot(io, onlineUsers) {
  function sendTypingIndicator(chatId, userId, isTyping) {
    io.to(chatId).emit('user_typing', { chatId, userId, isTyping });
  }

  function handleBotMessage(message) {
    const botId = message.to;
    const isMale = botId === 'male_bot';
    const responses = isMale ? maleResponses : femaleResponses;
    const gender = isMale ? 'male' : 'female';

    sendTypingIndicator(message.chatId, botId, true);

    const delay = 1500 + Math.random() * 2000;

    setTimeout(() => {
      sendTypingIndicator(message.chatId, botId, false);

      const isVoice = Math.random() < 0.3;
      const response = responses[Math.floor(Math.random() * responses.length)];

      let botMessage = {
        id: uuidv4(),
        chatId: message.chatId,
        from: botId,
        to: message.from,
        type: 'text',
        content: response,
        createdAt: new Date().toISOString()
      };

      if (isVoice) {
        const voiceText = voiceTexts[gender][Math.floor(Math.random() * voiceTexts[gender].length)];
        botMessage = {
          ...botMessage,
          type: 'voice',
          content: '',
          metadata: {
            duration: 3 + Math.floor(Math.random() * 5),
            url: `/uploads/voice_${gender}_${Date.now()}.mp3`,
            transcription: voiceText,
            showTranscription: false
          }
        };
      }

      const socketId = onlineUsers.get(message.from);
      if (socketId) {
        io.to(socketId).emit('new_message', botMessage);
      }

      saveBotMessage(botMessage);
    }, delay);
  }

  async function saveBotMessage(message) {
    try {
      const { saveMessage } = await import('./database.js');
      await saveMessage(message);
    } catch (err) {
      console.error('Error saving bot message:', err);
    }
  }

  return { handleBotMessage };
}
