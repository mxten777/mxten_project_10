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
      className={`p-4 bg-gradient-to-r from-purple-500 to-pink-500 dark:from-purple-700 dark:to-pink-700 rounded-xl shadow-lg font-bold text-xl text-white backdrop-blur-sm border border-white/20 transition-all duration-300 card-hover ${anim ? 'animate-score-jump animate-glow-pulse' : ''}`}
    >
      <div className="flex items-center gap-2">
        <span className="text-2xl">🏆</span>
        <span className="neon-text">Score: {score.toLocaleString()}</span>
      </div>
    </div>
  );
};

export default ScoreBoard;
