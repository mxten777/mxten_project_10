import React from 'react';

interface PaytableModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const PaytableModal: React.FC<PaytableModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const symbolData = [
    { symbol: '🍒', name: '체리', payout: '2x', rarity: 'low' },
    { symbol: '🍋', name: '레몬', payout: '3x', rarity: 'low' },
    { symbol: '🍊', name: '오렌지', payout: '3x', rarity: 'low' },
    { symbol: '🍇', name: '포도', payout: '4x', rarity: 'low' },
    { symbol: '🔔', name: '벨', payout: '5x', rarity: 'medium' },
    { symbol: '⭐', name: '스타', payout: '8x', rarity: 'medium' },
    { symbol: '💎', name: '다이아몬드', payout: '10x', rarity: 'medium' },
    { symbol: '🎯', name: '타겟', payout: '12x', rarity: 'medium' },
    { symbol: '7️⃣', name: '럭키 7', payout: '20x', rarity: 'high' },
    { symbol: '🎰', name: '슬롯머신', payout: '50x', rarity: 'high' },
    { symbol: '👑', name: '왕관', payout: '75x', rarity: 'high' },
    { symbol: '💰', name: '머니백', payout: '100x', rarity: 'high' },
    { symbol: '🌟', name: '와일드', payout: '2배 배수', rarity: 'special' },
    { symbol: '💥', name: '스캐터', payout: '보너스', rarity: 'special' },
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
                  <span className="text-3xl">{item.symbol}</span>
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

        <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 p-4 rounded-xl">
          <h3 className="font-bold text-lg mb-3 text-gray-800 dark:text-white">🎯 승리 조건</h3>
          <div className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
            <div>• 가로, 세로, 대각선으로 같은 심볼 3개가 연결되면 승리</div>
            <div>• 와일드(🌟)는 다른 심볼을 대체하고 2배 배수 적용</div>
            <div>• 여러 라인에서 동시 승리 가능</div>
            <div>• BIG WIN: 베팅액의 20배 이상</div>
            <div>• MEGA WIN: 베팅액의 50배 이상</div>
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