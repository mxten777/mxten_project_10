import React from 'react';
import { useAutoSpinStore } from '../stores/autoSpinStore';

const AutoSpinToggle: React.FC = () => {
  const { autoSpin, setAutoSpin } = useAutoSpinStore();
  return (
    <button
      className={`px-4 py-2 rounded-lg font-bold border flex items-center gap-2 active:animate-btn-press transition-all ${autoSpin ? 'bg-green-500 text-white' : 'bg-white text-green-500 border-green-500'}`}
      onClick={() => setAutoSpin(!autoSpin)}
      aria-label="Auto Spin"
    >
      <span role="img" aria-label="auto">🔄</span>
      {autoSpin ? '오토스핀 중지' : '오토스핀 시작'}
    </button>
  );
};

export default AutoSpinToggle;
