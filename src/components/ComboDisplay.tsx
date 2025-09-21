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
      className={`p-2 text-pink-600 dark:text-pink-300 font-bold transition-transform duration-300 ${anim ? 'animate-score-jump' : ''}`}
    >
      Combo: x{combo}
    </div>
  );
};

export default ComboDisplay;
