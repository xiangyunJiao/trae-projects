import express from 'express';
import { posts } from '../data/mockData.js';

const router = express.Router();

let postsData = [...posts];
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

router.post('/', (req, res) => {
  const { title, content, summary, tags } = req.body;
  if (!title || !content) {
    return res.status(400).json({ error: '标题和内容不能为空' });
  }

  const newPost = {
    id: nextId++,
    title,
    content,
    summary: summary || content.substring(0, 100),
    author: '博主',
    createdAt: new Date().toISOString().split('T')[0],
    likes: 0,
    views: 0,
    tags: tags || []
  };

  postsData.unshift(newPost);
  res.status(201).json(newPost);
});

router.put('/:id', (req, res) => {
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

router.delete('/:id', (req, res) => {
  const index = postsData.findIndex(p => p.id === parseInt(req.params.id));
  if (index === -1) {
    return res.status(404).json({ error: '文章不存在' });
  }

  postsData.splice(index, 1);
  res.status(204).send();
});

router.post('/:id/like', (req, res) => {
  const post = postsData.find(p => p.id === parseInt(req.params.id));
  if (!post) {
    return res.status(404).json({ error: '文章不存在' });
  }

  post.likes = (post.likes || 0) + 1;
  res.json({ likes: post.likes });
});

export default router;
