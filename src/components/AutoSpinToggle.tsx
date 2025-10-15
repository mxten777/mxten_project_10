import React from 'react';
import { useAutoSpinStore } from '../stores/autoSpinStore';

const AutoSpinToggle: React.FC = () => {
  const { autoSpin, setAutoSpin } = useAutoSpinStore();
  return (
    <button
      className={`px-6 sm:px-8 lg:px-10 py-4 sm:py-5 lg:py-6 rounded-2xl font-bold border-2 flex items-center gap-4 active:animate-btn-press transition-all text-lg sm:text-xl lg:text-2xl min-h-[56px] sm:min-h-[60px] shadow-2xl backdrop-blur-sm ${
        autoSpin 
          ? 'bg-gradient-to-r from-green-600 to-emerald-700 text-white border-green-400 shadow-green-400/30 ring-2 ring-green-300' 
          : 'bg-gradient-to-r from-white to-gray-50 text-green-700 border-green-500 hover:from-green-50 hover:to-emerald-50 hover:border-green-600 hover:shadow-green-400/20'
      }`}
      onClick={() => setAutoSpin(!autoSpin)}
      aria-label="Auto Spin"
    >
      <span role="img" aria-label="auto" className="text-2xl sm:text-3xl lg:text-4xl">🔄</span>
      <span className="whitespace-nowrap font-black drop-shadow-sm">
        {autoSpin ? '오토스핀 중지' : '오토스핀 시작'}
      </span>
    </button>
  );
};

export default AutoSpinToggle;
