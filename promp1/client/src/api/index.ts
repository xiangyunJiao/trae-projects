import axios from 'axios'
import type { Post, Comment, About, CreatePostForm, CreateCommentForm, User, LoginForm, RegisterForm, AuthResponse } from '../types'

const api = axios.create({
  baseURL: '/api',
  timeout: 5000
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      if (window.location.pathname !== '/login' && window.location.pathname !== '/register') {
        window.location.href = '/login'
      }
    }
    return Promise.reject(error)
  }
)

export const postApi = {
  getPosts: () => api.get<Post[]>('/posts'),
  getPost: (id: number) => api.get<Post>(`/posts/${id}`),
  createPost: (data: CreatePostForm & { tags: string[] }) => api.post<Post>('/posts', data),
  updatePost: (id: number, data: Partial<Post>) => api.put<Post>(`/posts/${id}`, data),
  deletePost: (id: number) => api.delete(`/posts/${id}`),
  likePost: (id: number) => api.post<{ likes: number }>(`/posts/${id}/like`)
}

export const commentApi = {
  getComments: (postId: number) => api.get<Comment[]>(`/comments/post/${postId}`),
  createComment: (data: { postId: number } & CreateCommentForm) => api.post<Comment>('/comments', data),
  deleteComment: (id: number) => api.delete(`/comments/${id}`)
}

export const aboutApi = {
  getAbout: () => api.get<About>('/about'),
  updateAbout: (data: Partial<About>) => api.put<About>('/about', data)
}

export const authApi = {
  login: (data: LoginForm) => api.post<AuthResponse>('/auth/login', data),
  register: (data: RegisterForm) => api.post<AuthResponse>('/auth/register', data),
  logout: () => api.post('/auth/logout'),
  getCurrentUser: () => api.get<User>('/auth/me')
}

export const userApi = {
  getUsers: () => api.get<User[]>('/users'),
  updateUserRole: (id: number, role: 'admin' | 'user') => api.put<User>(`/users/${id}/role`, { role }),
  deleteUser: (id: number) => api.delete(`/users/${id}`)
}
