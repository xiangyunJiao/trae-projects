import axios from 'axios'
import type { Post, Comment, About, CreatePostForm, CreateCommentForm } from '../types'

const api = axios.create({
  baseURL: '/api',
  timeout: 5000
})

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
