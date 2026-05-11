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
}

export interface About {
  name: string
  avatar: string
  bio: string
  skills: string[]
  email: string
  github: string
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
