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
      <div className="min-h-screen p-4 sm:p-6 lg:p-8">
        <div className="flex flex-col items-center gap-5 sm:gap-7 md:gap-9 max-w-6xl mx-auto">
          {/* 헤더 영역 - 완벽한 중앙 정렬 */}
          <div className="w-full flex flex-col sm:flex-row justify-between items-center gap-4 sm:gap-6 p-4 sm:p-5 lg:p-6 bg-white/10 backdrop-blur-md rounded-2xl sm:rounded-3xl border border-white/20 shadow-2xl">
            <div className="flex items-center justify-center sm:justify-start gap-3 sm:gap-4">
              <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black text-white drop-shadow-2xl text-center sm:text-left">
                🎰 <span className="bg-gradient-to-r from-yellow-400 via-orange-400 to-red-400 bg-clip-text text-transparent">프리미엄 슬롯</span>
              </h1>
            </div>
            <div className="flex justify-center sm:justify-end">
              <AuthButton />
            </div>
          </div>

          {/* 상단 정보 영역 - 균형잡힌 그리드 */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 md:gap-8 w-full max-w-4xl">
            <div className="glass-morphism rounded-2xl sm:rounded-3xl p-2 shadow-xl">
              <ScoreBoard />
            </div>
            <div className="glass-morphism rounded-2xl sm:rounded-3xl p-2 shadow-xl">
              <ComboDisplay />
            </div>
          </div>

          {/* 베팅 및 컨트롤 영역 - 완벽한 중앙 정렬 */}
          <div className="flex flex-col gap-4 sm:gap-6 md:gap-8 w-full max-w-4xl">
            <div className="glass-morphism rounded-2xl sm:rounded-3xl p-2 shadow-xl">
              <BettingPanel />
            </div>
            <div className="flex justify-center glass-morphism rounded-2xl sm:rounded-3xl p-4 sm:p-6 shadow-xl">
              <AutoSpinToggle />
            </div>
          </div>

          {/* 메인 게임 영역 - 완벽한 중앙 배치 */}
          <div className="w-full max-w-2xl sm:max-w-3xl md:max-w-4xl lg:max-w-5xl flex justify-center">
            <SlotMachineBoard />
          </div>

          {/* 리더보드 - 균형잡힌 배치 */}
          <div className="w-full max-w-sm sm:max-w-md md:max-w-lg lg:max-w-xl">
            <Leaderboard />
          </div>
        </div>
      </div>
    </ScoreEffectSystem>
  );
};

export default GamePage;
