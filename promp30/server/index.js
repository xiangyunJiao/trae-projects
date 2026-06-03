import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import { initDB, saveMessage, getMessages, getChatList, saveUser, getUsers, createChat, getBotUser } from './database.js';
import { initBot } from './bot.js';
import multer from 'multer';
import { v4 as uuidv4 } from 'uuid';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const server = createServer(app);
app.use(cors({
  origin: true,
  credentials: true
}));

const io = new Server(server, {
  cors: {
    origin: true,
    methods: ['GET', 'POST'],
    credentials: true
  }
});
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, 'uploads'));
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `${uuidv4()}${ext}`);
  }
});

const upload = multer({ storage });

app.post('/upload', upload.single('file'), (req, res) => {
  if (req.file) {
    res.json({
      success: true,
      url: `/uploads/${req.file.filename}`,
      filename: req.file.originalname,
      size: req.file.size,
      type: req.file.mimetype
    });
  } else {
    res.status(400).json({ success: false, error: 'No file uploaded' });
  }
});

const onlineUsers = new Map();

initDB().then(() => {
  return getBotUser('male_bot').then(maleBot => {
    if (!maleBot) return;
    return createChat('user_1', 'male_bot');
  }).then(() => {
    return getBotUser('female_bot').then(femaleBot => {
      if (!femaleBot) return;
      return createChat('user_1', 'female_bot');
    });
  });
});

const botHandlers = initBot(io, onlineUsers);

io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  socket.on('register', async (userId) => {
    onlineUsers.set(userId, socket.id);
    socket.userId = userId;
    console.log('User registered:', userId);
    
    const users = await getUsers();
    io.emit('user_list', users);
  });

  socket.on('get_chat_list', async (userId) => {
    const chatList = await getChatList(userId);
    socket.emit('chat_list', chatList);
  });

  socket.on('get_messages', async ({ chatId, userId }) => {
    const messages = await getMessages(chatId);
    socket.emit('messages', messages);
  });

  socket.on('typing', ({ chatId, userId, isTyping }) => {
    socket.to(chatId).emit('user_typing', { chatId, userId, isTyping });
  });

  socket.on('send_message', async (message) => {
    const savedMessage = await saveMessage(message);
    io.to(message.chatId).emit('new_message', savedMessage);

    if (message.to === 'male_bot' || message.to === 'female_bot') {
      botHandlers.handleBotMessage(message);
    }
  });

  socket.on('create_chat_with_bot', async ({ userId, botId }) => {
    try {
      const chatId = await createChat(userId, botId);
      socket.join(chatId);
      const chatList = await getChatList(userId);
      socket.emit('chat_list', chatList);
      socket.emit('chat_created', { chatId });
    } catch (err) {
      console.error('Error creating chat:', err);
    }
  });

  socket.on('join_chat', (chatId) => {
    socket.join(chatId);
  });

  socket.on('leave_chat', (chatId) => {
    socket.leave(chatId);
  });

  socket.on('disconnect', () => {
    if (socket.userId) {
      onlineUsers.delete(socket.userId);
      console.log('User disconnected:', socket.userId);
    }
  });
});

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
