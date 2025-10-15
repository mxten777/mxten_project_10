import React from 'react';
import { useBalanceStore } from '../stores/balanceStore';

const BET_OPTIONS = [100, 500, 1000, 5000];

const BettingPanel: React.FC = () => {
  const { bet, setBet, balance } = useBalanceStore();

  return (
    <div className="flex flex-col items-center gap-5 sm:gap-6 mb-6 sm:mb-8 p-5 sm:p-6 lg:p-7 glass-effect rounded-2xl shadow-2xl">
      {/* 베팅 버튼들 - 완벽한 그리드 정렬 */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 justify-center w-full max-w-2xl">
        {BET_OPTIONS.map((amount) => (
          <button
            key={amount}
            className={`px-4 py-4 sm:px-6 sm:py-5 rounded-xl font-bold text-sm sm:text-base lg:text-lg transition-all duration-300 transform active:scale-95 hover:scale-105 shadow-xl relative overflow-hidden min-h-[52px] sm:min-h-[56px] border-2 ${
              bet === amount 
                ? 'bg-gradient-to-r from-blue-600 to-indigo-700 text-white shadow-2xl border-blue-400 ring-2 ring-blue-300' 
                : 'bg-gradient-to-r from-gray-100 to-white text-gray-800 border-gray-300 hover:from-blue-50 hover:to-indigo-50 hover:border-blue-400 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:from-gray-100 disabled:hover:to-white'
            }`}
            onClick={() => setBet(amount)}
            disabled={balance < amount}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer"></div>
            <span className="relative z-10 drop-shadow-sm">💰 {amount.toLocaleString()}원</span>
          </button>
        ))}
      </div>
      
      {/* 잔고 표시 - 완벽한 중앙 정렬 */}
      <div className="bg-gradient-to-r from-emerald-500 to-green-600 p-4 sm:p-5 lg:p-6 rounded-2xl shadow-2xl border-2 border-emerald-400/30 backdrop-blur-sm w-full max-w-md">
        <div className="flex items-center justify-center gap-4 text-white">
          <span className="text-2xl sm:text-3xl lg:text-4xl">🏦</span>
          <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
            <span className="text-base sm:text-lg lg:text-xl text-emerald-100 font-semibold">잔고:</span> 
            <span className="font-black text-2xl sm:text-3xl lg:text-4xl text-white drop-shadow-lg">
              {balance.toLocaleString()}원
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BettingPanel;
