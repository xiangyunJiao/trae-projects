export interface WordItem {
  id: string
  emoji: string
  english: string
  chinese: string
  category: 'clothing' | 'fruit' | 'vegetable' | 'animal' | 'people' | 'household' | 'letter'
}

export interface GameObject {
  id: string
  type: 'word' | 'obstacle' | 'lightning' | 'car'
  x: number
  y: number
  word?: WordItem
  emoji: string
}

export interface SceneryItem {
  id: string
  emoji: string
  x: number
  y: number
  side: 'left' | 'right'
}

export interface CollectedWord {
  word: WordItem
  timestamp: number
}

export type GameStatus = 'idle' | 'playing' | 'paused' | 'gameover' | 'finished' | 'advertisement'
