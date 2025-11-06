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
      className={`p-8 bg-gradient-to-r from-orange-400 to-red-500 dark:from-orange-600 dark:to-red-700 rounded-3xl shadow-2xl font-bold text-white backdrop-blur-sm border border-white/20 transition-all duration-300 w-full min-h-[200px] flex flex-col justify-center items-center ${anim ? 'animate-score-jump animate-shimmer' : ''}`}
    >
      <div className="flex flex-col items-center justify-center gap-4">
        <div className="flex items-center gap-4">
          <span className="text-6xl animate-bounce">⚡</span>
          <span className="text-4xl font-bold">콤보</span>
        </div>
        <span className="neon-text text-6xl font-black">x{combo}</span>
      </div>
    </div>
  );
};

export default ComboDisplay;
