export const posts = [
  {
    id: 1,
    title: '欢迎来到我的博客',
    content: '这是我的第一篇博客文章。在这里，我将分享我的技术心得、生活感悟以及各种有趣的事情。\n\n欢迎大家常来看看，也欢迎在评论区留言交流！',
    summary: '我的第一篇博客文章',
    author: '博主',
    createdAt: '2024-01-01',
    likes: 10,
    views: 100,
    tags: ['生活', '随笔']
  },
  {
    id: 2,
    title: 'Vue 3 学习笔记',
    content: 'Vue 3 带来了许多新特性，其中 Composition API 是最重要的改进之一。\n\n## Composition API\n\nComposition API 允许我们按照功能组织代码，而不是按照选项类型组织。\n\n## 响应式系统\n\nVue 3 使用 Proxy 代替了 Object.defineProperty，性能更好，功能更强。',
    summary: 'Vue 3 核心特性学习',
    author: '博主',
    createdAt: '2024-01-15',
    likes: 25,
    views: 200,
    tags: ['Vue', '前端', '技术']
  },
  {
    id: 3,
    title: 'TypeScript 最佳实践',
    content: 'TypeScript 让 JavaScript 开发更加安全和高效。\n\n## 类型定义\n\n合理的类型定义可以让代码更易读、更易维护。\n\n## 泛型\n\n泛型是 TypeScript 中最强大的特性之一，可以大大提高代码的复用性。',
    summary: 'TypeScript 使用经验分享',
    author: '博主',
    createdAt: '2024-02-01',
    likes: 18,
    views: 150,
    tags: ['TypeScript', '前端', '技术']
  }
];

export const comments = [
  {
    id: 1,
    postId: 1,
    author: '访客1',
    content: '博客很棒，期待更多文章！',
    createdAt: '2024-01-02'
  },
  {
    id: 2,
    postId: 1,
    author: '访客2',
    content: '支持博主！',
    createdAt: '2024-01-03'
  },
  {
    id: 3,
    postId: 2,
    author: 'Vue爱好者',
    content: 'Vue 3 确实很好用！',
    createdAt: '2024-01-16'
  }
];

export const about = {
  name: '博主',
  avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=blogger',
  bio: '一个热爱技术和生活的开发者，喜欢分享和学习。',
  skills: ['JavaScript', 'TypeScript', 'Vue', 'React', 'Node.js'],
  email: 'blogger@example.com',
  github: 'https://github.com/blogger'
};
