import express from 'express';
import { users } from '../data/mockData.js';
import { createSession, destroySession, authMiddleware } from '../middleware/auth.js';

const router = express.Router();

let usersData = [...users];
let nextUserId = usersData.length + 1;

router.post('/register', (req, res) => {
  const { username, password, email } = req.body;
  
  if (!username || !password || !email) {
    return res.status(400).json({ error: '用户名、密码和邮箱不能为空' });
  }

  if (usersData.find(u => u.username === username)) {
    return res.status(400).json({ error: '用户名已存在' });
  }

  if (usersData.find(u => u.email === email)) {
    return res.status(400).json({ error: '邮箱已被注册' });
  }

  const newUser = {
    id: nextUserId++,
    username,
    password,
    email,
    role: 'user',
    createdAt: new Date().toISOString().split('T')[0]
  };

  usersData.push(newUser);

  const token = createSession(newUser);
  res.status(201).json({
    token,
    user: {
      id: newUser.id,
      username: newUser.username,
      email: newUser.email,
      role: newUser.role,
      createdAt: newUser.createdAt
    }
  });
});

router.post('/login', (req, res) => {
  const { username, password } = req.body;
  
  if (!username || !password) {
    return res.status(400).json({ error: '用户名和密码不能为空' });
  }

  const user = usersData.find(u => u.username === username && u.password === password);
  
  if (!user) {
    return res.status(401).json({ error: '用户名或密码错误' });
  }

  const token = createSession(user);
  res.json({
    token,
    user: {
      id: user.id,
      username: user.username,
      email: user.email,
      role: user.role,
      createdAt: user.createdAt
    }
  });
});

router.post('/logout', authMiddleware, (req, res) => {
  const authHeader = req.headers.authorization;
  const token = authHeader.substring(7);
  destroySession(token);
  res.json({ message: '退出登录成功' });
});

router.get('/me', authMiddleware, (req, res) => {
  const user = usersData.find(u => u.id === req.user.userId);
  if (!user) {
    return res.status(404).json({ error: '用户不存在' });
  }
  res.json({
    id: user.id,
    username: user.username,
    email: user.email,
    role: user.role,
    createdAt: user.createdAt
  });
});

export const getUsersData = () => usersData;
export const setUsersData = (data) => { usersData = data; };
export default router;
