import express from 'express';
import cors from 'cors';
import postsRouter from './routes/posts.js';
import commentsRouter from './routes/comments.js';
import aboutRouter from './routes/about.js';
import authRouter from './routes/auth.js';
import usersRouter from './routes/users.js';

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

app.use('/api/posts', postsRouter);
app.use('/api/comments', commentsRouter);
app.use('/api/about', aboutRouter);
app.use('/api/auth', authRouter);
app.use('/api/users', usersRouter);

app.get('/', (req, res) => {
  res.json({ message: '个人博客 API 服务' });
});

app.listen(PORT, () => {
  console.log(`服务器运行在 http://localhost:${PORT}`);
});
