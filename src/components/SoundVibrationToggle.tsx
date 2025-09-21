import React from 'react';
import { useSoundVibrationStore } from '../stores/soundVibrationStore';

const SoundVibrationToggle: React.FC = () => {
  const { soundOn, setSoundOn, vibrationOn, setVibrationOn } = useSoundVibrationStore();
  return (
    <div className="flex gap-4 items-center">
      <button
        className={`px-3 py-1 rounded font-bold flex items-center gap-1 border transition-all ${soundOn ? 'bg-blue-500 text-white' : 'bg-white text-blue-500 border-blue-500'}`}
        onClick={() => setSoundOn(!soundOn)}
        aria-label="사운드 토글"
      >
        <span role="img" aria-label="sound">🔊</span> {soundOn ? '사운드 ON' : '사운드 OFF'}
      </button>
      <button
        className={`px-3 py-1 rounded font-bold flex items-center gap-1 border transition-all ${vibrationOn ? 'bg-pink-500 text-white' : 'bg-white text-pink-500 border-pink-500'}`}
        onClick={() => setVibrationOn(!vibrationOn)}
        aria-label="진동 토글"
      >
        <span role="img" aria-label="vibration">📳</span> {vibrationOn ? '진동 ON' : '진동 OFF'}
      </button>
    </div>
  );
};

export default SoundVibrationToggle;
