import { create } from 'zustand';

interface AutoSpinState {
  autoSpin: boolean;
  setAutoSpin: (autoSpin: boolean) => void;
}

export const useAutoSpinStore = create<AutoSpinState>((set) => ({
  autoSpin: false,
  setAutoSpin: (autoSpin: boolean) => set(() => ({ autoSpin })),
}));
