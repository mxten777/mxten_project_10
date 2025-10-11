import React from 'react';
import { useSoundVibrationStore } from '../stores/soundVibrationStore';

const SoundVibrationToggle: React.FC = () => {
  const { soundOn, setSoundOn, vibrationOn, setVibrationOn } = useSoundVibrationStore();
  return (
    <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 items-center">
      <button
        className={`px-2 sm:px-3 py-1 sm:py-2 rounded text-xs sm:text-sm font-bold flex items-center gap-1 border transition-all min-h-[36px] whitespace-nowrap ${soundOn ? 'bg-blue-500 text-white' : 'bg-white text-blue-500 border-blue-500'}`}
        onClick={() => setSoundOn(!soundOn)}
        aria-label="사운드 토글"
      >
        <span role="img" aria-label="sound">🔊</span> 
        <span className="hidden sm:inline">{soundOn ? '사운드 ON' : '사운드 OFF'}</span>
        <span className="sm:hidden">{soundOn ? 'ON' : 'OFF'}</span>
      </button>
      <button
        className={`px-2 sm:px-3 py-1 sm:py-2 rounded text-xs sm:text-sm font-bold flex items-center gap-1 border transition-all min-h-[36px] whitespace-nowrap ${vibrationOn ? 'bg-pink-500 text-white' : 'bg-white text-pink-500 border-pink-500'}`}
        onClick={() => setVibrationOn(!vibrationOn)}
        aria-label="진동 토글"
      >
        <span role="img" aria-label="vibration">📳</span> 
        <span className="hidden sm:inline">{vibrationOn ? '진동 ON' : '진동 OFF'}</span>
        <span className="sm:hidden">{vibrationOn ? 'ON' : 'OFF'}</span>
      </button>
    </div>
  );
};

export default SoundVibrationToggle;
