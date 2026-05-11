export interface Post {
  id: number
  title: string
  content: string
  summary: string
  author: string
  createdAt: string
  likes: number
  views: number
  tags: string[]
}

export interface Comment {
  id: number
  postId: number
  author: string
  content: string
  createdAt: string
  authorId: number | null
}

export interface About {
  name: string
  avatar: string
  bio: string
  skills: string[]
  email: string
  github: string
}

export interface User {
  id: number
  username: string
  email: string
  role: 'admin' | 'user'
  createdAt: string
}

export interface CreatePostForm {
  title: string
  content: string
  summary: string
  tags: string
}

export interface CreateCommentForm {
  author: string
  content: string
}

export interface LoginForm {
  username: string
  password: string
}

export interface RegisterForm {
  username: string
  password: string
  email: string
}

export interface AuthResponse {
  token: string
  user: User
}
