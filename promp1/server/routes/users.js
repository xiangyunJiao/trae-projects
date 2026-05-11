import express from 'express';
import { getUsersData } from './auth.js';
import { authMiddleware, adminMiddleware } from '../middleware/auth.js';

const router = express.Router();

router.use(authMiddleware);
router.use(adminMiddleware);

router.get('/', (req, res) => {
  const usersData = getUsersData();
  const users = usersData.map(u => ({
    id: u.id,
    username: u.username,
    email: u.email,
    role: u.role,
    createdAt: u.createdAt
  }));
  res.json(users);
});

router.put('/:id/role', (req, res) => {
  const { role } = req.body;
  const usersData = getUsersData();
  const index = usersData.findIndex(u => u.id === parseInt(req.params.id));
  
  if (index === -1) {
    return res.status(404).json({ error: '用户不存在' });
  }

  if (!['admin', 'user'].includes(role)) {
    return res.status(400).json({ error: '无效的角色类型' });
  }

  usersData[index].role = role;
  
  res.json({
    id: usersData[index].id,
    username: usersData[index].username,
    email: usersData[index].email,
    role: usersData[index].role,
    createdAt: usersData[index].createdAt
  });
});

router.delete('/:id', (req, res) => {
  const usersData = getUsersData();
  const index = usersData.findIndex(u => u.id === parseInt(req.params.id));
  
  if (index === -1) {
    return res.status(404).json({ error: '用户不存在' });
  }

  if (usersData[index].username === 'admin0511') {
    return res.status(400).json({ error: '不能删除超级管理员' });
  }

  usersData.splice(index, 1);
  res.status(204).send();
});

export default router;
