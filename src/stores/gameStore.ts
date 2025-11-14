import { create } from 'zustand';

interface GameState {
  combo: number;
  setCombo: (combo: number) => void;
}

export const useGameStore = create<GameState>((set) => ({
  combo: 1,
  setCombo: (combo) => set({ combo }),
}));
