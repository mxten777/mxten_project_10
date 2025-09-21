import { create } from 'zustand';

interface BalanceState {
  balance: number;
  bet: number;
  setBalance: (balance: number) => void;
  setBet: (bet: number) => void;
  decreaseBalance: (amount: number) => void;
  increaseBalance: (amount: number) => void;
}

export const useBalanceStore = create<BalanceState>((set) => ({
  balance: 10000, // 초기 잔고
  bet: 100, // 기본 베팅
  setBalance: (balance: number) => set(() => ({ balance })),
  setBet: (bet: number) => set(() => ({ bet })),
  decreaseBalance: (amount: number) => set((state) => ({ balance: state.balance - amount })),
  increaseBalance: (amount: number) => set((state) => ({ balance: state.balance + amount })),
}));
