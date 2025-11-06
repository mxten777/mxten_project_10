import { create } from 'zustand';

export interface Achievement {
  id: string;
  name: string;
  description: string;
  achieved: boolean;
  reward: string;
}

interface AchievementState {
  achievements: Achievement[];
  achieve: (id: string) => void;
}

export const useAchievementStore = create<AchievementState>((set) => ({
  achievements: [
    { id: 'first-win', name: '첫 승리', description: '첫 승리를 달성하세요.', achieved: false, reward: '코인 1,000' },
    { id: 'combo-master', name: '콤보 마스터', description: '콤보 5회 달성.', achieved: false, reward: '코인 5,000' },
    { id: 'mission-clear', name: '미션 클리어', description: '미션 모드에서 미션 1회 달성.', achieved: false, reward: '코인 2,000' },
    { id: 'jackpot', name: '잭팟!', description: '잭팟을 1회 달성.', achieved: false, reward: '프리미엄 이펙트' },
  ],
  achieve: (id) => set((state) => ({
    achievements: state.achievements.map(a => a.id === id ? { ...a, achieved: true } : a)
  })),
}));
