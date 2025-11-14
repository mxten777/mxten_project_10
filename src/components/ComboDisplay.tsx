import React, { useEffect, useRef, useState } from 'react';
import { useGameStore } from '../stores/gameStore';


const ComboDisplay: React.FC = () => {
  const combo = useGameStore((s) => s.combo);
  const [anim, setAnim] = useState(false);
  const prevCombo = useRef(combo);

  useEffect(() => {
    if (combo > prevCombo.current) {
      setAnim(true);
      setTimeout(() => setAnim(false), 400);
    }
    prevCombo.current = combo;
  }, [combo]);

  return (
    <div
      className={`p-4 sm:p-6 md:p-8 bg-gradient-to-r from-orange-500 to-red-600 rounded-xl shadow-xl font-bold text-white w-full min-h-[120px] sm:min-h-[140px] flex flex-col justify-center items-center transition-all duration-300 ${anim ? 'animate-score-jump scale-105' : ''}`}
    >
      <div className="flex flex-col items-center justify-center gap-2 sm:gap-3">
        <div className="flex items-center gap-2 sm:gap-3">
          <span className="text-2xl sm:text-3xl md:text-4xl animate-bounce">⚡</span>
          <span className="text-lg sm:text-xl md:text-2xl font-bold">콤보</span>
        </div>
        <span className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-white drop-shadow-lg text-center">
          x{combo}
        </span>
      </div>
    </div>
  );
};

export default ComboDisplay;
