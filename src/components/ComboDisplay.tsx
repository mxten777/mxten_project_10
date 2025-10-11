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
      className={`p-4 bg-gradient-to-r from-orange-400 to-red-500 dark:from-orange-600 dark:to-red-700 rounded-xl shadow-lg font-bold text-xl text-white backdrop-blur-sm border border-white/20 transition-all duration-300 card-hover ${anim ? 'animate-score-jump animate-shimmer' : ''}`}
    >
      <div className="flex items-center gap-2">
        <span className="text-2xl animate-bounce">⚡</span>
        <span className="neon-text">Combo: x{combo}</span>
      </div>
    </div>
  );
};

export default ComboDisplay;
