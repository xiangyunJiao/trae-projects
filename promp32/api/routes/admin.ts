import { Router, Request, Response } from 'express';
import db from '../database.js';

const router = Router();

router.get('/users', (req: Request, res: Response) => {
  try {
    const users: any[] = db.prepare(`
      SELECT id, username, nickname, avatar, role, created_at 
      FROM users
      ORDER BY created_at DESC
    `).all();
    
    res.json({ success: true, users });
  } catch (error) {
    res.json({ success: false, message: '获取用户列表失败' });
  }
});

router.put('/users/:id', (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { role } = req.body;
    
    db.prepare('UPDATE users SET role = ? WHERE id = ?').run(role, id);
    
    const user: any = db.prepare(`
      SELECT id, username, nickname, avatar, role, created_at 
      FROM users WHERE id = ?
    `).get(id);
    
    res.json({ success: true, user, message: '更新成功' });
  } catch (error) {
    res.json({ success: false, message: '更新失败' });
  }
});

router.delete('/users/:id', (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    const items = db.prepare('SELECT id FROM items WHERE user_id = ?').all(id) as any[];
    for (const item of items) {
      db.prepare('DELETE FROM comments WHERE item_id = ?').run(item.id);
      db.prepare('DELETE FROM likes WHERE item_id = ?').run(item.id);
    }
    
    db.prepare('DELETE FROM items WHERE user_id = ?').run(id);
    db.prepare('DELETE FROM comments WHERE user_id = ?').run(id);
    db.prepare('DELETE FROM likes WHERE user_id = ?').run(id);
    db.prepare('DELETE FROM users WHERE id = ?').run(id);
    
    res.json({ success: true, message: '删除成功' });
  } catch (error) {
    res.json({ success: false, message: '删除失败' });
  }
});

router.get('/items', (req: Request, res: Response) => {
  try {
    const items: any[] = db.prepare(`
      SELECT items.*, users.nickname,
        (SELECT COUNT(*) FROM likes WHERE likes.item_id = items.id) as like_count,
        (SELECT COUNT(*) FROM comments WHERE comments.item_id = items.id) as comment_count
      FROM items 
      LEFT JOIN users ON items.user_id = users.id
      ORDER BY items.created_at DESC
    `).all();
    
    res.json({ success: true, items });
  } catch (error) {
    res.json({ success: false, message: '获取作品列表失败' });
  }
});

export default router;
