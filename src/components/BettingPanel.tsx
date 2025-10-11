import React from 'react';
import { useBalanceStore } from '../stores/balanceStore';

const BET_OPTIONS = [100, 500, 1000, 5000];

const BettingPanel: React.FC = () => {
  const { bet, setBet, balance } = useBalanceStore();

  return (
    <div className="flex flex-col items-center gap-4 mb-6 p-4 glass-effect rounded-xl shadow-lg">
      <div className="flex gap-3 flex-wrap justify-center">
        {BET_OPTIONS.map((amount) => (
          <button
            key={amount}
            className={`px-4 py-2 rounded-lg font-bold transition-all duration-300 transform hover:scale-105 shadow-md relative overflow-hidden ${
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
      <div className="glass-effect p-3 rounded-lg">
        <span className="text-gray-700 dark:text-gray-300 text-lg flex items-center gap-2">
          <span className="text-xl">🏦</span>
          잔고: <span className="font-bold text-green-600 dark:text-green-400 neon-text">{balance.toLocaleString()}원</span>
        </span>
      </div>
    </div>
  );
};

export default BettingPanel;
