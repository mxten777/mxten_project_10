import React from 'react';

interface PaytableModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const PaytableModal: React.FC<PaytableModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const symbolData = [
    { symbol: '1', name: '숫자 1', payout: '2x', rarity: 'low' },
    { symbol: '2', name: '숫자 2', payout: '3x', rarity: 'low' },
    { symbol: '3', name: '숫자 3', payout: '4x', rarity: 'low' },
    { symbol: '4', name: '숫자 4', payout: '5x', rarity: 'medium' },
    { symbol: '5', name: '숫자 5', payout: '6x', rarity: 'medium' },
    { symbol: '6', name: '숫자 6', payout: '8x', rarity: 'medium' },
    { symbol: '7', name: '럭키 7', payout: '20x', rarity: 'high' },
    { symbol: '8', name: '숫자 8', payout: '10x', rarity: 'medium' },
    { symbol: '9', name: '숫자 9', payout: '15x', rarity: 'high' },
  ];

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'low': return 'text-gray-600 bg-gray-100';
      case 'medium': return 'text-blue-600 bg-blue-100';
      case 'high': return 'text-purple-600 bg-purple-100';
      case 'special': return 'text-yellow-600 bg-yellow-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl p-6 max-w-2xl w-full mx-4 max-h-[80vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold text-gray-800 dark:text-white flex items-center gap-2">
            💰 배당표
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 text-2xl font-bold"
          >
            ×
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-6">
          {symbolData.map((item, index) => (
            <div
              key={index}
              className={`p-3 rounded-lg border-2 transition-all duration-300 hover:scale-105 ${getRarityColor(item.rarity)}`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 flex items-center justify-center bg-gradient-to-br from-blue-400 to-blue-600 rounded-lg text-white font-black text-2xl shadow-lg">
                    {item.symbol}
                  </div>
                  <div>
                    <div className="font-bold text-lg">{item.name}</div>
                    <div className="text-sm opacity-75 capitalize">{item.rarity}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-bold text-xl">{item.payout}</div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 p-4 rounded-xl">
          <h3 className="font-bold text-lg mb-3 text-gray-800 dark:text-white">� 파친코 승리 조건</h3>
          <div className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
            <div>• 한 줄(3칸)에서 같은 숫자 3개가 나오면 승리!</div>
            <div>• 숫자 7이 3개 나오면 🎉 JACKPOT! (20배 배당)</div>
            <div>• 파친코 스타일: 릴이 순차적으로 멈추며 긴장감 연출</div>
            <div>• BIG WIN: 베팅액의 10배 이상</div>
            <div>• JACKPOT WIN: 베팅액의 20배 이상</div>
          </div>
        </div>

        <div className="mt-6 flex justify-center">
          <button
            onClick={onClose}
            className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl font-bold hover:from-blue-600 hover:to-purple-700 transition-all duration-300 shadow-lg"
          >
            게임으로 돌아가기
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaytableModal;