import React, { useEffect, useRef, useState } from 'react';
import { useBalanceStore } from '../stores/balanceStore';


const ScoreBoard: React.FC = () => {
  const { balance } = useBalanceStore();
  const [anim, setAnim] = useState(false);
  const prevBalance = useRef(balance);

  useEffect(() => {
    if (balance > prevBalance.current) {
      setAnim(true);
      setTimeout(() => setAnim(false), 400);
    }
    prevBalance.current = balance;
  }, [balance]);

  return (
    <div
      className={`p-4 sm:p-6 md:p-8 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl shadow-xl font-bold text-white w-full min-h-[120px] sm:min-h-[140px] flex flex-col justify-center items-center transition-all duration-300 ${anim ? 'animate-score-jump scale-105' : ''}`}
    >
      <div className="flex flex-col items-center justify-center gap-2 sm:gap-3">
        <div className="flex items-center gap-2 sm:gap-3">
          <span className="text-2xl sm:text-3xl md:text-4xl">💰</span>
          <span className="text-lg sm:text-xl md:text-2xl text-purple-100 font-bold">잔고</span>
        </div>
        <span className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black text-white drop-shadow-lg text-center">
          {balance.toLocaleString()}원
        </span>
      </div>
    </div>
  );
};

export default ScoreBoard;
