import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { FavoriteStore } from '@/types';

interface FavoriteState extends FavoriteStore {
  toggleLetter: (letter: string) => void;
  toggleWord: (key: string) => void;
  toggleSentence: (key: string) => void;
  toggleStory: (id: string) => void;
  hasLetter: (letter: string) => boolean;
  hasWord: (key: string) => boolean;
  hasSentence: (key: string) => boolean;
  hasStory: (id: string) => boolean;
}

export const useFavoriteStore = create<FavoriteState>()(
  persist(
    (set, get) => ({
      letters: [],
      words: [],
      sentences: [],
      stories: [],
      toggleLetter: (letter) =>
        set((state) => ({
          letters: state.letters.includes(letter)
            ? state.letters.filter((l) => l !== letter)
            : [...state.letters, letter],
        })),
      toggleWord: (key) =>
        set((state) => ({
          words: state.words.includes(key)
            ? state.words.filter((w) => w !== key)
            : [...state.words, key],
        })),
      toggleSentence: (key) =>
        set((state) => ({
          sentences: state.sentences.includes(key)
            ? state.sentences.filter((s) => s !== key)
            : [...state.sentences, key],
        })),
      toggleStory: (id) =>
        set((state) => ({
          stories: state.stories.includes(id)
            ? state.stories.filter((s) => s !== id)
            : [...state.stories, id],
        })),
      hasLetter: (letter) => get().letters.includes(letter),
      hasWord: (key) => get().words.includes(key),
      hasSentence: (key) => get().sentences.includes(key),
      hasStory: (id) => get().stories.includes(id),
    }),
    {
      name: 'kid-english-favorites',
    },
  ),
);
