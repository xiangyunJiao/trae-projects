export interface User {
  id: string;
  username: string;
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

export interface AppState {
  user: User | null;
  bgMusicPlaying: boolean;
  setUser: (user: User | null) => void;
  setBgMusicPlaying: (playing: boolean) => void;
  logout: () => void;
}
