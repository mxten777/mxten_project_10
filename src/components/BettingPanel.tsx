import React from 'react';
import { useBalanceStore } from '../stores/balanceStore';

const BET_OPTIONS = [100, 500, 1000, 5000];

const BettingPanel: React.FC = () => {
  const { bet, setBet, balance } = useBalanceStore();

  return (
    <div className="flex flex-col items-center gap-2 mb-4">
      <div className="flex gap-2">
        {BET_OPTIONS.map((amount) => (
          <button
            key={amount}
            className={`px-3 py-1 rounded border font-bold ${bet === amount ? 'bg-blue-500 text-white' : 'bg-white text-blue-500 border-blue-500'}`}
            onClick={() => setBet(amount)}
            disabled={balance < amount}
          >
            {amount.toLocaleString()}원
          </button>
        ))}
      </div>
      <div className="text-gray-700 text-sm">잔고: <span className="font-bold">{balance.toLocaleString()}원</span></div>
    </div>
  );
};

export default BettingPanel;
