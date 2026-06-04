import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { AppState, User } from '../types';

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      user: null,
      bgMusicPlaying: true,
      setUser: (user: User | null) => set({ user }),
      setBgMusicPlaying: (playing: boolean) => set({ bgMusicPlaying: playing }),
      logout: () => set({ user: null }),
    }),
    {
      name: 'fleamarket-storage',
    }
  )
);
