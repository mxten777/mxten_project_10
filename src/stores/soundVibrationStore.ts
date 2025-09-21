import { create } from 'zustand';

interface SoundVibrationState {
  soundOn: boolean;
  vibrationOn: boolean;
  setSoundOn: (on: boolean) => void;
  setVibrationOn: (on: boolean) => void;
}

export const useSoundVibrationStore = create<SoundVibrationState>((set) => ({
  soundOn: true,
  vibrationOn: true,
  setSoundOn: (on: boolean) => set(() => ({ soundOn: on })),
  setVibrationOn: (on: boolean) => set(() => ({ vibrationOn: on })),
}));
