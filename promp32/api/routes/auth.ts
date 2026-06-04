import { Router, Request, Response } from 'express';
import db from '../database.js';
import { v4 as uuidv4 } from 'uuid';

const router = Router();

router.post('/login', (req: Request, res: Response) => {
  try {
    const { username, password } = req.body;
    
    const stmt = db.prepare('SELECT * FROM users WHERE username = ?');
    const user: any = stmt.get(username);
    
    if (!user || user.password !== password) {
      return res.json({ success: false, message: '用户名或密码错误' });
    }
    
    const { password: _, ...userWithoutPassword } = user;
    res.json({ 
      success: true, 
      user: userWithoutPassword, 
      token: uuidv4() 
    });
  } catch (error) {
    res.json({ success: false, message: '登录失败' });
  }
});

router.post('/register', (req: Request, res: Response) => {
  try {
    const { username, password, nickname } = req.body;
    
    const checkStmt = db.prepare('SELECT * FROM users WHERE username = ?');
    const existingUser = checkStmt.get(username);
    
    if (existingUser) {
      return res.json({ success: false, message: '用户名已存在' });
    }
    
    const userId = uuidv4();
    const insertStmt = db.prepare(`
      INSERT INTO users (id, username, password, nickname, role)
      VALUES (?, ?, ?, ?, 'user')
    `);
    
    insertStmt.run(userId, username, password, nickname);
    
    const userStmt = db.prepare('SELECT * FROM users WHERE id = ?');
    const user: any = userStmt.get(userId);
    
    const { password: _, ...userWithoutPassword } = user;
    res.json({ 
      success: true, 
      user: userWithoutPassword,
      token: uuidv4(),
      message: '注册成功' 
    });
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: '注册失败' });
  }
});

export default router;
