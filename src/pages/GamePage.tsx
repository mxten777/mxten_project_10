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
      <div className="min-h-screen p-3 sm:p-6">
        <div className="flex flex-col items-center gap-4 sm:gap-6 md:gap-8 max-w-5xl mx-auto">
          {/* 헤더 영역 - 모바일 최적화 */}
          <div className="w-full flex flex-col sm:flex-row justify-between items-center gap-3 sm:gap-4 p-3 sm:p-4 bg-white/10 backdrop-blur-md rounded-xl sm:rounded-2xl border border-white/20 shadow-xl">
            <div className="flex items-center gap-2 sm:gap-4">
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white drop-shadow-lg text-center sm:text-left">
                🎰 <span className="bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">프리미엄 슬롯</span>
              </h1>
            </div>
            <AuthButton />
          </div>

          {/* 상단 정보 영역 - 모바일 최적화 */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 md:gap-6 w-full max-w-3xl">
            <div className="glass-morphism rounded-xl sm:rounded-2xl p-1">
              <ScoreBoard />
            </div>
            <div className="glass-morphism rounded-xl sm:rounded-2xl p-1">
              <ComboDisplay />
            </div>
          </div>

          {/* 베팅 및 컨트롤 영역 - 모바일 최적화 */}
          <div className="flex flex-col gap-3 sm:gap-4 md:gap-6 w-full max-w-3xl">
            <div className="glass-morphism rounded-xl sm:rounded-2xl p-1">
              <BettingPanel />
            </div>
            <div className="flex justify-center glass-morphism rounded-xl sm:rounded-2xl p-3 sm:p-4">
              <AutoSpinToggle />
            </div>
          </div>

          {/* 메인 게임 영역 - 모바일 최적화 */}
          <div className="w-full max-w-sm sm:max-w-md md:max-w-2xl flex justify-center">
            <SlotMachineBoard />
          </div>

          {/* 리더보드 - 모바일 최적화 */}
          <div className="w-full max-w-xs sm:max-w-sm md:max-w-md">
            <Leaderboard />
          </div>
        </div>
      </div>
    </ScoreEffectSystem>
  );
};

export default GamePage;
