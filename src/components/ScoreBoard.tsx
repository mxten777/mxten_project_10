import React, { useEffect, useRef, useState } from 'react';
import { useGameStore } from '../stores/gameStore';


const ScoreBoard: React.FC = () => {
  const score = useGameStore((s) => s.score);
  const [anim, setAnim] = useState(false);
  const prevScore = useRef(score);

  useEffect(() => {
    if (score > prevScore.current) {
      setAnim(true);
      setTimeout(() => setAnim(false), 400);
    }
    prevScore.current = score;
  }, [score]);

  return (
    <div
      className={`p-2 bg-white dark:bg-gray-900 rounded shadow font-bold text-lg text-black dark:text-yellow-200 transition-transform duration-300 ${anim ? 'animate-score-jump' : ''}`}
    >
      Score: {score}
    </div>
  );
};

export default ScoreBoard;
