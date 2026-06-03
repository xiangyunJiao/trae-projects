import { create } from 'zustand';

export type GamePhase = 'display' | 'flipping' | 'shuffling' | 'selecting' | 'revealed';

export interface BackpackItem {
  cardId: string;
  count: number;
}

interface GameState {
  phase: GamePhase;
  backpack: BackpackItem[];
  hasWonGrandPrize: boolean;
  selectedCardId: string | null;

  startGame: () => void;
  setPhase: (phase: GamePhase) => void;
  selectCard: (cardId: string) => void;
  collectCard: (cardId: string) => void;
  claimGrandPrize: () => void;
  resetGame: () => void;
}

const STORAGE_KEY = 'magic-card-game-backpack';

function loadBackpack(): BackpackItem[] {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (data) return JSON.parse(data);
  } catch {
    // ignore parse errors
  }
  return [];
}

function saveBackpack(items: BackpackItem[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
}

function loadGrandPrize(): boolean {
  try {
    return localStorage.getItem(STORAGE_KEY + '-prize') === 'true';
  } catch {
    // ignore storage errors
  }
  return false;
}

function saveGrandPrize(won: boolean) {
  localStorage.setItem(STORAGE_KEY + '-prize', String(won));
}

export const useGameStore = create<GameState>((set, get) => ({
  phase: 'display',
  backpack: loadBackpack(),
  hasWonGrandPrize: loadGrandPrize(),
  selectedCardId: null,

  startGame: () => {
    set({ phase: 'flipping', selectedCardId: null });
  },

  setPhase: (phase) => {
    set({ phase });
  },

  selectCard: (cardId) => {
    set({ selectedCardId: cardId, phase: 'revealed' });
  },

  collectCard: (cardId) => {
    const { backpack } = get();
    const existing = backpack.find((item) => item.cardId === cardId);
    let newBackpack: BackpackItem[];
    if (existing) {
      newBackpack = backpack.map((item) =>
        item.cardId === cardId ? { ...item, count: item.count + 1 } : item
      );
    } else {
      newBackpack = [...backpack, { cardId, count: 1 }];
    }
    saveBackpack(newBackpack);
    const allCollected = ['fire', 'frost', 'thunder', 'shadow', 'light', 'nature'].every(
      (id) => newBackpack.some((item) => item.cardId === id)
    );
    if (allCollected && !get().hasWonGrandPrize) {
      saveGrandPrize(true);
      set({ backpack: newBackpack, hasWonGrandPrize: true });
    } else {
      set({ backpack: newBackpack });
    }
  },

  claimGrandPrize: () => {
    set({ hasWonGrandPrize: true });
    saveGrandPrize(true);
  },

  resetGame: () => {
    set({
      phase: 'display',
      selectedCardId: null,
    });
  },
}));
