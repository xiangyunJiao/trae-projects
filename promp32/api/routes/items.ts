import { Router, Request, Response } from 'express';
import db from '../database.js';
import { v4 as uuidv4 } from 'uuid';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const uploadDir = path.join(__dirname, '../../uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueName = uuidv4() + path.extname(file.originalname);
    cb(null, uniqueName);
  }
});

const upload = multer({ storage });

const router = Router();

router.get('/', (req: Request, res: Response) => {
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

router.get('/:id', (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    const item: any = db.prepare(`
      SELECT items.*, users.nickname,
        (SELECT COUNT(*) FROM likes WHERE likes.item_id = items.id) as like_count,
        (SELECT COUNT(*) FROM comments WHERE comments.item_id = items.id) as comment_count
      FROM items 
      LEFT JOIN users ON items.user_id = users.id
      WHERE items.id = ?
    `).get(id);
    
    if (!item) {
      return res.json({ success: false, message: '作品不存在' });
    }
    
    res.json({ success: true, item });
  } catch (error) {
    res.json({ success: false, message: '获取作品失败' });
  }
});

router.post('/', upload.fields([
  { name: 'images', maxCount: 9 },
  { name: 'audio', maxCount: 1 }
]), (req: Request, res: Response) => {
  try {
    const { title, content, userId, coverIndex } = req.body;
    const files = req.files as { [fieldname: string]: Express.Multer.File[] };
    
    const imageFiles = files?.images || [];
    const audioFile = files?.audio?.[0];
    
    const imagePaths = imageFiles.map(f => `/uploads/${f.filename}`).join(',');
    const audioPath = audioFile ? `/uploads/${audioFile.filename}` : null;
    
    const itemId = uuidv4();
    
    db.prepare(`
      INSERT INTO items (id, user_id, title, content, images, audio, cover_index)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `).run(itemId, userId, title, content, imagePaths, audioPath, parseInt(coverIndex) || 0);
    
    const item: any = db.prepare(`
      SELECT items.*, users.nickname,
        0 as like_count, 0 as comment_count
      FROM items 
      LEFT JOIN users ON items.user_id = users.id
      WHERE items.id = ?
    `).get(itemId);
    
    res.json({ success: true, item, message: '发布成功' });
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: '发布失败' });
  }
});

router.put('/:id', upload.fields([
  { name: 'images', maxCount: 9 },
  { name: 'audio', maxCount: 1 }
]), (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { title, content, coverIndex, existingImages } = req.body;
    const files = req.files as { [fieldname: string]: Express.Multer.File[] };
    
    const imageFiles = files?.images || [];
    const audioFile = files?.audio?.[0];
    
    const newImagePaths = imageFiles.map(f => `/uploads/${f.filename}`);
    const allImages = existingImages ? [...existingImages.split(','), ...newImagePaths] : newImagePaths;
    
    const audioPath = audioFile ? `/uploads/${audioFile.filename}` : null;
    
    const existingItem: any = db.prepare('SELECT * FROM items WHERE id = ?').get(id);
    if (!existingItem) {
      return res.json({ success: false, message: '作品不存在' });
    }
    
    const finalAudio = audioPath || existingItem.audio;
    
    db.prepare(`
      UPDATE items 
      SET title = ?, content = ?, images = ?, audio = ?, cover_index = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `).run(title, content, allImages.join(','), finalAudio, parseInt(coverIndex) || 0, id);
    
    const item: any = db.prepare(`
      SELECT items.*, users.nickname,
        (SELECT COUNT(*) FROM likes WHERE likes.item_id = items.id) as like_count,
        (SELECT COUNT(*) FROM comments WHERE comments.item_id = items.id) as comment_count
      FROM items 
      LEFT JOIN users ON items.user_id = users.id
      WHERE items.id = ?
    `).get(id);
    
    res.json({ success: true, item, message: '更新成功' });
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: '更新失败' });
  }
});

router.delete('/:id', (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    db.prepare('DELETE FROM comments WHERE item_id = ?').run(id);
    db.prepare('DELETE FROM likes WHERE item_id = ?').run(id);
    db.prepare('DELETE FROM items WHERE id = ?').run(id);
    
    res.json({ success: true, message: '删除成功' });
  } catch (error) {
    res.json({ success: false, message: '删除失败' });
  }
});

router.post('/:id/like', (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { userId } = req.body;
    
    const existingLike: any = db.prepare(
      'SELECT * FROM likes WHERE item_id = ? AND user_id = ?'
    ).get(id, userId);
    
    if (existingLike) {
      db.prepare('DELETE FROM likes WHERE item_id = ? AND user_id = ?').run(id, userId);
      const likeCount = db.prepare('SELECT COUNT(*) as count FROM likes WHERE item_id = ?').get(id) as any;
      return res.json({ success: true, liked: false, likeCount: likeCount.count });
    }
    
    db.prepare(
      'INSERT INTO likes (id, item_id, user_id) VALUES (?, ?, ?)'
    ).run(uuidv4(), id, userId);
    
    const likeCount = db.prepare('SELECT COUNT(*) as count FROM likes WHERE item_id = ?').get(id) as any;
    res.json({ success: true, liked: true, likeCount: likeCount.count });
  } catch (error) {
    res.json({ success: false, message: '操作失败' });
  }
});

router.get('/:id/liked', (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { userId } = req.query;
    
    const existingLike: any = db.prepare(
      'SELECT * FROM likes WHERE item_id = ? AND user_id = ?'
    ).get(id, userId);
    
    const likeCount = db.prepare('SELECT COUNT(*) as count FROM likes WHERE item_id = ?').get(id) as any;
    
    res.json({ success: true, liked: !!existingLike, likeCount: likeCount.count });
  } catch (error) {
    res.json({ success: false, message: '操作失败' });
  }
});

export default router;
