import { Router, Request, Response } from 'express';
import db from '../database.js';
import { v4 as uuidv4 } from 'uuid';

const router = Router();

router.get('/item/:itemId', (req: Request, res: Response) => {
  try {
    const { itemId } = req.params;
    
    const comments: any[] = db.prepare(`
      SELECT * FROM comments 
      WHERE item_id = ? 
      ORDER BY created_at DESC
    `).all(itemId);
    
    res.json({ success: true, comments });
  } catch (error) {
    res.json({ success: false, message: '获取评论失败' });
  }
});

router.post('/item/:itemId', (req: Request, res: Response) => {
  try {
    const { itemId } = req.params;
    const { userId, nickname, content } = req.body;
    
    const commentId = uuidv4();
    
    db.prepare(`
      INSERT INTO comments (id, item_id, user_id, nickname, content)
      VALUES (?, ?, ?, ?, ?)
    `).run(commentId, itemId, userId, nickname, content);
    
    const comment: any = db.prepare('SELECT * FROM comments WHERE id = ?').get(commentId);
    
    res.json({ success: true, comment, message: '评论成功' });
  } catch (error) {
    res.json({ success: false, message: '评论失败' });
  }
});

router.delete('/:id', (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    db.prepare('DELETE FROM comments WHERE id = ?').run(id);
    
    res.json({ success: true, message: '删除成功' });
  } catch (error) {
    res.json({ success: false, message: '删除失败' });
  }
});

export default router;
