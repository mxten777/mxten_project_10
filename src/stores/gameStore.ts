import { create } from 'zustand';

interface GameState {
  score: number;
  combo: number;
  setScore: (score: number) => void;
  setCombo: (combo: number) => void;
}

export const useGameStore = create<GameState>((set) => ({
  score: 0,
  combo: 1,
  setScore: (score) => set({ score }),
  setCombo: (combo) => set({ combo }),
}));
