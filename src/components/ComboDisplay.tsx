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
      className={`p-3 sm:p-4 bg-gradient-to-r from-orange-400 to-red-500 dark:from-orange-600 dark:to-red-700 rounded-xl shadow-lg font-bold text-lg sm:text-xl text-white backdrop-blur-sm border border-white/20 transition-all duration-300 card-hover ${anim ? 'animate-score-jump animate-shimmer' : ''}`}
    >
      <div className="flex items-center justify-center sm:justify-start gap-2">
        <span className="text-xl sm:text-2xl animate-bounce">⚡</span>
        <span className="neon-text text-base sm:text-xl">콤보: x{combo}</span>
      </div>
    </div>
  );
};

export default ComboDisplay;
