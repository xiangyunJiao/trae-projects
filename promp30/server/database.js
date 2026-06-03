import sqlite3 from 'sqlite3';
import { fileURLToPath } from 'url';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let db;

export async function initDB() {
  return new Promise((resolve, reject) => {
    db = new sqlite3.Database(path.join(__dirname, 'chat.db'), (err) => {
      if (err) reject(err);
      else {
        createTables().then(resolve).catch(reject);
      }
    });
  });
}

function createTables() {
  return Promise.all([
    run(`
      CREATE TABLE IF NOT EXISTS users (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        avatar TEXT,
        isBot INTEGER DEFAULT 0,
        gender TEXT,
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `),
    run(`
      CREATE TABLE IF NOT EXISTS chats (
        id TEXT PRIMARY KEY,
        name TEXT,
        type TEXT DEFAULT 'private',
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `),
    run(`
      CREATE TABLE IF NOT EXISTS chat_members (
        chatId TEXT,
        userId TEXT,
        lastReadAt DATETIME,
        PRIMARY KEY (chatId, userId),
        FOREIGN KEY (chatId) REFERENCES chats(id),
        FOREIGN KEY (userId) REFERENCES users(id)
      )
    `),
    run(`
      CREATE TABLE IF NOT EXISTS messages (
        id TEXT PRIMARY KEY,
        chatId TEXT NOT NULL,
        fromUserId TEXT NOT NULL,
        toUserId TEXT NOT NULL,
        type TEXT NOT NULL DEFAULT 'text',
        content TEXT,
        metadata TEXT,
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
        readAt DATETIME,
        FOREIGN KEY (chatId) REFERENCES chats(id)
      )
    `)
  ]).then(() => initDefaultUsers());
}

function initDefaultUsers() {
  const users = [
    { id: 'user_1', name: '我', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=me', isBot: 0 },
    { id: 'friend_1', name: '小明', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=xiaoming', isBot: 0 },
    { id: 'friend_2', name: '小红', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=xiaohong', isBot: 0 },
    { id: 'male_bot', name: '小帅', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=handsome&backgroundColor=b6e3f4', isBot: 1, gender: 'male' },
    { id: 'female_bot', name: '小美', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=beauty&backgroundColor=ffd5dc', isBot: 1, gender: 'female' }
  ];

  return Promise.all(users.map(user => saveUser(user)));
}

function run(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.run(sql, params, function(err) {
      if (err) reject(err);
      else resolve(this);
    });
  });
}

function get(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.get(sql, params, (err, row) => {
      if (err) reject(err);
      else resolve(row);
    });
  });
}

function all(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.all(sql, params, (err, rows) => {
      if (err) reject(err);
      else resolve(rows);
    });
  });
}

export async function saveUser(user) {
  const existing = await get('SELECT id FROM users WHERE id = ?', [user.id]);
  if (existing) {
    return run('UPDATE users SET name = ?, avatar = ?, isBot = ?, gender = ? WHERE id = ?', 
      [user.name, user.avatar, user.isBot || 0, user.gender || null, user.id]);
  }
  return run('INSERT INTO users (id, name, avatar, isBot, gender) VALUES (?, ?, ?, ?, ?)', 
    [user.id, user.name, user.avatar, user.isBot || 0, user.gender || null]);
}

export async function getUsers() {
  return all('SELECT * FROM users');
}

export async function getBotUser(botId) {
  return get('SELECT * FROM users WHERE id = ?', [botId]);
}

export async function createChat(userId1, userId2) {
  const chatId = [userId1, userId2].sort().join('_');
  const existing = await get('SELECT id FROM chats WHERE id = ?', [chatId]);
  if (existing) return chatId;

  await run('INSERT INTO chats (id, type) VALUES (?, ?)', [chatId, 'private']);
  await run('INSERT INTO chat_members (chatId, userId) VALUES (?, ?)', [chatId, userId1]);
  await run('INSERT INTO chat_members (chatId, userId) VALUES (?, ?)', [chatId, userId2]);
  return chatId;
}

export async function getChatList(userId) {
  const rows = await all(`
    SELECT 
      c.id as chatId,
      c.type,
      u.id as userId,
      u.name as userName,
      u.avatar as userAvatar,
      u.isBot,
      m.content as lastMessage,
      m.type as lastMessageType,
      m.metadata as lastMessageMetadata,
      m.createdAt as lastMessageTime
    FROM chats c
    JOIN chat_members cm1 ON c.id = cm1.chatId
    JOIN chat_members cm2 ON c.id = cm2.chatId
    JOIN users u ON cm2.userId = u.id
    LEFT JOIN messages m ON c.id = m.chatId AND m.createdAt = (
      SELECT MAX(createdAt) FROM messages WHERE chatId = c.id
    )
    WHERE cm1.userId = ? AND cm2.userId != ?
    ORDER BY COALESCE(m.createdAt, c.createdAt) DESC
  `, [userId, userId]);

  return rows.map(row => {
    let lastMessage = row.lastMessage;
    const lastMessageType = row.lastMessageType;
    let metadata = null;
    
    if (row.lastMessageMetadata) {
      try {
        metadata = JSON.parse(row.lastMessageMetadata);
      } catch (e) {
        metadata = null;
      }
    }
    
    if (lastMessageType === 'voice') {
      lastMessage = metadata?.transcription || '[语音]';
    } else if (lastMessageType === 'image') {
      lastMessage = '[图片]';
    } else if (lastMessageType === 'video') {
      lastMessage = '[视频]';
    } else if (lastMessageType === 'file') {
      lastMessage = '[文件]';
    } else if (lastMessageType === 'sticker') {
      lastMessage = '[表情包]';
    } else if (lastMessageType === 'emoji') {
      lastMessage = '[表情]';
    }
    
    return {
      chatId: row.chatId,
      type: row.type,
      userId: row.userId,
      userName: row.userName,
      userAvatar: row.userAvatar,
      isBot: row.isBot === 1,
      lastMessage,
      lastMessageType,
      lastMessageTime: row.lastMessageTime
    };
  });
}

export async function saveMessage(message) {
  const id = message.id || uuidv4();
  const metadata = message.metadata ? JSON.stringify(message.metadata) : null;
  
  await run(`
    INSERT INTO messages (id, chatId, fromUserId, toUserId, type, content, metadata, createdAt)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `, [id, message.chatId, message.from, message.to, message.type, message.content, metadata, message.createdAt || new Date().toISOString()]);

  return { ...message, id, metadata: message.metadata };
}

export async function getMessages(chatId) {
  const rows = await all(`
    SELECT * FROM messages 
    WHERE chatId = ? 
    ORDER BY createdAt ASC
  `, [chatId]);

  return rows.map(row => ({
    ...row,
    metadata: row.metadata ? JSON.parse(row.metadata) : null,
    from: row.fromUserId,
    to: row.toUserId
  }));
}
