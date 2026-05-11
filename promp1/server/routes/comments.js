import express from 'express';
import { comments } from '../data/mockData.js';

const router = express.Router();

let commentsData = [...comments];
let nextId = commentsData.length + 1;

router.get('/post/:postId', (req, res) => {
  const postComments = commentsData.filter(c => c.postId === parseInt(req.params.postId));
  res.json(postComments);
});

router.post('/', (req, res) => {
  const { postId, author, content } = req.body;
  if (!postId || !author || !content) {
    return res.status(400).json({ error: '文章ID、作者和内容不能为空' });
  }

  const newComment = {
    id: nextId++,
    postId: parseInt(postId),
    author,
    content,
    createdAt: new Date().toISOString().split('T')[0]
  };

  commentsData.push(newComment);
  res.status(201).json(newComment);
});

router.delete('/:id', (req, res) => {
  const index = commentsData.findIndex(c => c.id === parseInt(req.params.id));
  if (index === -1) {
    return res.status(404).json({ error: '评论不存在' });
  }

  commentsData.splice(index, 1);
  res.status(204).send();
});

export default router;
