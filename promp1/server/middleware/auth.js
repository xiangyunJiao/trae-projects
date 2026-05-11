import { sessions } from '../data/mockData.js';

const generateToken = () => {
  return Math.random().toString(36).substring(2) + Date.now().toString(36);
};

export const createSession = (user) => {
  const token = generateToken();
  const session = {
    userId: user.id,
    username: user.username,
    role: user.role,
    createdAt: Date.now()
  };
  sessions.set(token, session);
  return token;
};

export const destroySession = (token) => {
  sessions.delete(token);
};

export const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: '未登录' });
  }

  const token = authHeader.substring(7);
  const session = sessions.get(token);

  if (!session) {
    return res.status(401).json({ error: '登录已过期，请重新登录' });
  }

  req.user = session;
  next();
};

export const adminMiddleware = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ error: '权限不足，需要管理员权限' });
  }
  next();
};
