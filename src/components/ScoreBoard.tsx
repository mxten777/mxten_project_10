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
      className={`p-5 sm:p-6 lg:p-7 bg-gradient-to-r from-purple-600 via-purple-500 to-pink-600 rounded-2xl shadow-2xl font-bold text-white backdrop-blur-sm border-2 border-purple-400/30 transition-all duration-300 ${anim ? 'animate-score-jump animate-glow-pulse' : ''}`}
    >
      <div className="flex items-center justify-center gap-4">
        <span className="text-3xl sm:text-4xl lg:text-5xl">🏆</span>
        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
          <span className="text-base sm:text-lg lg:text-xl text-purple-100 font-semibold">점수:</span>
          <span className="text-2xl sm:text-3xl lg:text-4xl font-black text-white drop-shadow-lg text-center sm:text-left">
            {score.toLocaleString()}
          </span>
        </div>
      </div>
    </div>
  );
};

export default ScoreBoard;
