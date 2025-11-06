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
      className={`p-8 bg-gradient-to-r from-purple-600 via-purple-500 to-pink-600 rounded-3xl shadow-2xl font-bold text-white backdrop-blur-sm border border-purple-400/30 transition-all duration-300 w-full min-h-[200px] flex flex-col justify-center items-center ${anim ? 'animate-score-jump animate-glow-pulse' : ''}`}
    >
      <div className="flex flex-col items-center justify-center gap-4">
        <div className="flex items-center gap-4">
          <span className="text-6xl">🏆</span>
          <span className="text-4xl text-purple-100 font-bold">점수</span>
        </div>
        <span className="text-6xl font-black text-white drop-shadow-lg text-center">
          {score.toLocaleString()}
        </span>
      </div>
    </div>
  );
};

export default ScoreBoard;
