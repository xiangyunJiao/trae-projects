export interface AlphabetItem {
  letter: string;
  phoneticUk: string;
  phoneticUs: string;
}

export interface WordItem {
  word: string;
  translation: string;
  phoneticUk: string;
  phoneticUs: string;
  emoji: string;
}

export interface WordCategory {
  id: string;
  name: string;
  emoji: string;
  color: string;
  words: WordItem[];
}

export interface SentenceItem {
  sentence: string;
  translation: string;
}

export interface SentenceCategory {
  id: string;
  name: string;
  emoji: string;
  color: string;
  sentences: SentenceItem[];
}

export interface StoryItem {
  id: string;
  title: string;
  titleCn: string;
  coverEmoji: string;
  coverColor: string;
  content: string[];
}

export type FavoriteType = 'letter' | 'word' | 'sentence' | 'story';

export interface FavoriteStore {
  letters: string[];
  words: string[];
  sentences: string[];
  stories: string[];
}
