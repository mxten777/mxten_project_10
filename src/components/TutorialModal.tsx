import React from 'react';

interface TutorialModalProps {
  open: boolean;
  onClose: () => void;
}

const TutorialModal: React.FC<TutorialModalProps> = ({ open, onClose }) => {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div className="bg-white dark:bg-gray-900 rounded-lg shadow-lg p-6 max-w-md w-full relative animate-fade-in">
        <button
          className="absolute top-2 right-2 text-gray-400 hover:text-gray-700 dark:hover:text-white text-2xl font-bold"
          onClick={onClose}
          aria-label="튜토리얼 닫기"
        >
          ×
        </button>
        <h2 className="text-2xl font-bold mb-2 text-blue-600 dark:text-blue-300">파칭코 슬롯머신 게임 안내</h2>
        <ul className="list-disc pl-5 space-y-1 text-gray-800 dark:text-gray-200 text-base">
          <li>🎰 <b>SPIN</b> 버튼을 눌러 슬롯을 돌리세요.</li>
          <li>💰 <b>베팅</b> 금액을 선택하고, 잔고를 관리하세요.</li>
          <li>🔄 <b>오토스핀</b>으로 자동 플레이가 가능합니다.</li>
          <li>✨ <b>JACKPOT/2개 일치</b> 시 보너스 점수와 연출이 발생합니다.</li>
          <li>🏆 <b>리더보드</b>에서 상위 점수를 확인하세요.</li>
          <li>⚙️ 사운드/진동, 다크모드 등 다양한 설정을 지원합니다.</li>
        </ul>
        <div className="mt-4 flex justify-end">
          <button
            className="px-4 py-2 bg-blue-500 text-white rounded-lg font-bold hover:bg-blue-600 transition"
            onClick={onClose}
          >
            시작하기
          </button>
        </div>
      </div>
    </div>
  );
};

export default TutorialModal;
