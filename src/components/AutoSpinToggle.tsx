import React from 'react';
import { useAutoSpinStore } from '../stores/autoSpinStore';

const AutoSpinToggle: React.FC = () => {
  const { autoSpin, setAutoSpin } = useAutoSpinStore();
  return (
    <button
      className={`px-6 sm:px-8 py-4 sm:py-5 rounded-xl font-bold border-2 flex items-center gap-3 sm:gap-4 transition-all text-base sm:text-lg min-h-[56px] shadow-lg ${
        autoSpin 
          ? 'bg-gradient-to-r from-green-600 to-emerald-700 text-white border-green-400 shadow-green-400/30' 
          : 'bg-gradient-to-r from-gray-600 to-gray-700 text-white border-gray-500 hover:from-green-500 hover:to-emerald-600'
      }`}
      onClick={() => setAutoSpin(!autoSpin)}
      aria-label="Auto Spin"
    >
      <span role="img" aria-label="auto" className="text-xl sm:text-2xl">🔄</span>
      <span className="whitespace-nowrap font-black drop-shadow-sm">
        {autoSpin ? '오토스핀 중지' : '오토스핀 시작'}
      </span>
    </button>
  );
};

export default AutoSpinToggle;
