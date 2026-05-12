import express from 'express';
import { posts, likes } from '../data/mockData.js';
import { authMiddleware, adminMiddleware } from '../middleware/auth.js';

const router = express.Router();

let postsData = [...posts];
let likesData = [...likes];
let nextId = postsData.length + 1;

router.get('/', (req, res) => {
  res.json(postsData);
});

router.get('/:id', (req, res) => {
  const post = postsData.find(p => p.id === parseInt(req.params.id));
  if (!post) {
    return res.status(404).json({ error: '文章不存在' });
  }
  post.views = (post.views || 0) + 1;
  res.json(post);
});

router.post('/', authMiddleware, adminMiddleware, (req, res) => {
  const { title, content, summary, tags } = req.body;
  if (!title || !content) {
    return res.status(400).json({ error: '标题和内容不能为空' });
  }

  const newPost = {
    id: nextId++,
    title,
    content,
    summary: summary || content.substring(0, 100),
    author: req.user.username,
    createdAt: new Date().toISOString().split('T')[0],
    likes: 0,
    views: 0,
    tags: tags || []
  };

  postsData.unshift(newPost);
  res.status(201).json(newPost);
});

router.put('/:id', authMiddleware, adminMiddleware, (req, res) => {
  const index = postsData.findIndex(p => p.id === parseInt(req.params.id));
  if (index === -1) {
    return res.status(404).json({ error: '文章不存在' });
  }

  const { title, content, summary, tags } = req.body;
  if (title) postsData[index].title = title;
  if (content) postsData[index].content = content;
  if (summary) postsData[index].summary = summary;
  if (tags) postsData[index].tags = tags;

  res.json(postsData[index]);
});

router.delete('/:id', authMiddleware, adminMiddleware, (req, res) => {
  const index = postsData.findIndex(p => p.id === parseInt(req.params.id));
  if (index === -1) {
    return res.status(404).json({ error: '文章不存在' });
  }

  postsData.splice(index, 1);
  likesData = likesData.filter(l => l.postId !== parseInt(req.params.id));
  res.status(204).send();
});

router.get('/:id/like-status', authMiddleware, (req, res) => {
  const postId = parseInt(req.params.id);
  const userId = req.user.userId;
  
  const post = postsData.find(p => p.id === postId);
  if (!post) {
    return res.status(404).json({ error: '文章不存在' });
  }

  const hasLiked = likesData.some(l => l.postId === postId && l.userId === userId);
  const likesCount = likesData.filter(l => l.postId === postId).length;
  post.likes = likesCount;

  res.json({
    likes: likesCount,
    hasLiked
  });
});

router.post('/:id/like', authMiddleware, (req, res) => {
  const postId = parseInt(req.params.id);
  const userId = req.user.userId;

  const post = postsData.find(p => p.id === postId);
  if (!post) {
    return res.status(404).json({ error: '文章不存在' });
  }

  const existingLike = likesData.find(l => l.postId === postId && l.userId === userId);
  
  if (existingLike) {
    likesData = likesData.filter(l => !(l.postId === postId && l.userId === userId));
    const likesCount = likesData.filter(l => l.postId === postId).length;
    post.likes = likesCount;
    return res.json({ 
      likes: likesCount, 
      hasLiked: false,
      action: 'unliked'
    });
  } else {
    likesData.push({
      id: Date.now(),
      postId,
      userId,
      createdAt: new Date().toISOString().split('T')[0]
    });
    const likesCount = likesData.filter(l => l.postId === postId).length;
    post.likes = likesCount;
    return res.json({ 
      likes: likesCount, 
      hasLiked: true,
      action: 'liked'
    });
  }
});

export default router;
