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
      className={`p-4 sm:p-6 md:p-8 bg-gradient-to-r from-purple-600 via-purple-500 to-pink-600 rounded-2xl sm:rounded-3xl shadow-xl sm:shadow-2xl font-bold text-white backdrop-blur-sm border border-purple-400/30 transition-all duration-300 w-full min-h-[140px] sm:min-h-[160px] md:min-h-[200px] flex flex-col justify-center items-center ${anim ? 'animate-score-jump animate-glow-pulse' : ''}`}
    >
      <div className="flex flex-col items-center justify-center gap-2 sm:gap-3 md:gap-4">
        <div className="flex items-center gap-2 sm:gap-3 md:gap-4">
          <span className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl">🏆</span>
          <span className="text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl text-purple-100 font-bold">점수</span>
        </div>
        <span className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-black text-white drop-shadow-lg text-center">
          {score.toLocaleString()}
        </span>
      </div>
    </div>
  );
};

export default ScoreBoard;
