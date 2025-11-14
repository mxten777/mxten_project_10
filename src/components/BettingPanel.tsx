import React from 'react';
import { useBalanceStore } from '../stores/balanceStore';

const BET_OPTIONS = [100, 500, 1000, 5000];

const BettingPanel: React.FC = () => {
  const { bet, setBet, balance } = useBalanceStore();

  return (
    <div className="flex flex-col items-center gap-4 sm:gap-6 p-4 sm:p-6 bg-gradient-to-r from-slate-800 to-purple-800 rounded-xl shadow-xl">
      {/* 베팅 버튼들 */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 justify-center w-full max-w-2xl">
        {BET_OPTIONS.map((amount) => (
          <button
            key={amount}
            className={`px-3 py-3 sm:px-4 sm:py-4 rounded-lg font-bold text-sm sm:text-base transition-all duration-200 transform active:scale-95 hover:scale-105 shadow-lg min-h-[48px] sm:min-h-[52px] border-2 ${
              bet === amount 
                ? 'bg-gradient-to-r from-blue-600 to-purple-700 text-white border-blue-400 shadow-xl' 
                : 'bg-gradient-to-r from-gray-600 to-gray-700 text-white border-gray-500 hover:from-blue-500 hover:to-purple-600 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:from-gray-600 disabled:hover:to-gray-700 disabled:hover:scale-100'
            }`}
            onClick={() => setBet(amount)}
            disabled={balance < amount}
          >
            💰 {amount.toLocaleString()}원
          </button>
        ))}
      </div>
      
      {/* 잔고 표시 */}
      <div className="bg-gradient-to-r from-emerald-600 to-green-700 p-4 sm:p-5 rounded-lg shadow-lg border-2 border-emerald-400/30 w-full max-w-md">
        <div className="flex items-center justify-center gap-3 text-white">
          <span className="text-2xl sm:text-3xl">🏦</span>
          <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
            <span className="text-base sm:text-lg text-emerald-100 font-semibold">잔고:</span> 
            <span className="font-black text-xl sm:text-2xl md:text-3xl text-white drop-shadow-lg">
              {balance.toLocaleString()}원
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BettingPanel;
