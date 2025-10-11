import React from 'react';

import SlotMachineBoard from '../components/SlotMachineBoard';
import ScoreBoard from '../components/ScoreBoard';
import ComboDisplay from '../components/ComboDisplay';
import Leaderboard from '../components/Leaderboard';
import { AuthButton } from '../components/AuthButton';
import BettingPanel from '../components/BettingPanel';
import AutoSpinToggle from '../components/AutoSpinToggle';
import ScoreEffectSystem from '../components/ScoreEffectSystem';

const GamePage: React.FC = () => {
  return (
    <ScoreEffectSystem>
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 p-4">
        <div className="flex flex-col items-center gap-6 max-w-4xl mx-auto">
          {/* 헤더 영역 */}
          <div className="w-full flex justify-between items-center mb-4">
            <div className="flex items-center gap-4">
              <h1 className="text-3xl font-bold text-white neon-text">🎰 파칭코 슬롯</h1>
            </div>
            <AuthButton />
          </div>

          {/* 상단 정보 영역 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-2xl">
            <ScoreBoard />
            <ComboDisplay />
          </div>

          {/* 베팅 및 컨트롤 영역 */}
          <div className="flex flex-col gap-4 w-full max-w-2xl">
            <BettingPanel />
            <div className="flex justify-center">
              <AutoSpinToggle />
            </div>
          </div>

          {/* 메인 게임 영역 */}
          <div className="w-full max-w-2xl flex justify-center">
            <SlotMachineBoard />
          </div>

          {/* 리더보드 */}
          <div className="w-full max-w-md">
            <Leaderboard />
          </div>
        </div>
      </div>
    </ScoreEffectSystem>
  );
};

export default GamePage;
