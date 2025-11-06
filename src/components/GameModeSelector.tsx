import React from 'react';

export type GameMode = 'classic' | 'premium' | 'challenge' | 'mission';

interface GameModeSelectorProps {
  mode: GameMode;
  onChange: (mode: GameMode) => void;
}

const modeLabels: Record<GameMode, string> = {
  classic: '클래식',
  premium: '프리미엄',
  challenge: '챌린지',
  mission: '미션',
};

const GameModeSelector: React.FC<GameModeSelectorProps> = ({ mode, onChange }) => {
  return (
    <div className="flex gap-3 items-center justify-center my-4">
  {(['classic', 'premium', 'challenge', 'mission'] as GameMode[]).map(m => (
        <button
          key={m}
          className={`px-4 py-2 rounded-xl font-bold transition-all duration-200 shadow-lg focus:outline-none focus-visible:ring-4 focus-visible:ring-blue-400 ${
            mode === m ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-blue-100'
          }`}
          aria-label={modeLabels[m] + ' 모드 선택'}
          onClick={() => onChange(m)}
        >
          {modeLabels[m]}
        </button>
      ))}
    </div>
  );
};

export default GameModeSelector;
