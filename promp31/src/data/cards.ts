export interface CardData {
  id: string;
  name: string;
  element: string;
  colors: [string, string, string];
  symbol: string;
}

export const CARDS: CardData[] = [
  {
    id: 'fire',
    name: '火焰之卡',
    element: 'fire',
    colors: ['#ff4500', '#ff8c00', '#ffd700'],
    symbol: '🔥',
  },
  {
    id: 'frost',
    name: '冰霜之卡',
    element: 'frost',
    colors: ['#00bfff', '#87ceeb', '#e0f7ff'],
    symbol: '❄️',
  },
  {
    id: 'thunder',
    name: '雷电之卡',
    element: 'thunder',
    colors: ['#9b59b6', '#f1c40f', '#fff176'],
    symbol: '⚡',
  },
  {
    id: 'shadow',
    name: '暗影之卡',
    element: 'shadow',
    colors: ['#2c003e', '#6a0dad', '#9b59b6'],
    symbol: '🌑',
  },
  {
    id: 'light',
    name: '光明之卡',
    element: 'light',
    colors: ['#ffd700', '#fff8dc', '#ffffff'],
    symbol: '✨',
  },
  {
    id: 'nature',
    name: '自然之卡',
    element: 'nature',
    colors: ['#228b22', '#32cd32', '#90ee90'],
    symbol: '🌿',
  },
];
