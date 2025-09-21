import { create } from 'zustand';

interface AuthState {
  uid: string | null;
  isAnonymous: boolean;
  loading: boolean;
  setAuth: (uid: string, isAnonymous: boolean) => void;
  setLoading: (loading: boolean) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  uid: null,
  isAnonymous: false,
  loading: false,
  setAuth: (uid, isAnonymous) => set({ uid, isAnonymous }),
  setLoading: (loading) => set({ loading }),
}));
