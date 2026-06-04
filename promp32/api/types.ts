export interface User {
  id: string;
  username: string;
  password: string;
  nickname: string;
  avatar?: string;
  role: 'user' | 'admin';
  created_at: string;
}

export interface Item {
  id: string;
  user_id: string;
  title: string;
  content: string;
  images: string;
  audio?: string;
  cover_index: number;
  created_at: string;
  updated_at: string;
  nickname?: string;
  like_count?: number;
  comment_count?: number;
}

export interface Comment {
  id: string;
  item_id: string;
  user_id: string;
  nickname: string;
  content: string;
  created_at: string;
}

export interface Like {
  id: string;
  item_id: string;
  user_id: string;
  created_at: string;
}
