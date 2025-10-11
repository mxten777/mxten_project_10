import React from 'react';
import { useBalanceStore } from '../stores/balanceStore';

const BET_OPTIONS = [100, 500, 1000, 5000];

const BettingPanel: React.FC = () => {
  const { bet, setBet, balance } = useBalanceStore();

  return (
    <div className="flex flex-col items-center gap-3 sm:gap-4 mb-4 sm:mb-6 p-3 sm:p-4 glass-effect rounded-xl shadow-lg">
      {/* 베팅 버튼들 - 모바일 최적화 */}
      <div className="grid grid-cols-2 sm:flex gap-2 sm:gap-3 justify-center w-full sm:w-auto">
        {BET_OPTIONS.map((amount) => (
          <button
            key={amount}
            className={`px-3 py-2 sm:px-4 sm:py-2 rounded-lg font-bold text-sm sm:text-base transition-all duration-300 transform active:scale-95 hover:scale-105 shadow-md relative overflow-hidden min-h-[44px] ${
              bet === amount 
                ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg animate-glow-pulse' 
                : 'bg-white/80 text-blue-600 border-2 border-blue-500 hover:bg-blue-50 disabled:opacity-50 disabled:cursor-not-allowed'
            }`}
            onClick={() => setBet(amount)}
            disabled={balance < amount}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer"></div>
            <span className="relative z-10">💰 {amount.toLocaleString()}원</span>
          </button>
        ))}
      </div>
      
      {/* 잔고 표시 - 모바일 최적화 */}
      <div className="glass-effect p-2 sm:p-3 rounded-lg w-full sm:w-auto">
        <span className="text-gray-700 dark:text-gray-300 text-base sm:text-lg flex items-center justify-center gap-2">
          <span className="text-lg sm:text-xl">🏦</span>
          <span className="text-sm sm:text-base">잔고:</span> 
          <span className="font-bold text-green-600 dark:text-green-400 neon-text text-base sm:text-lg">
            {balance.toLocaleString()}원
          </span>
        </span>
      </div>
    </div>
  );
};

export default BettingPanel;
