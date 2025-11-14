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
      <div className="min-h-screen p-4 sm:p-6 lg:p-8 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <div className="flex flex-col items-center gap-4 sm:gap-6 md:gap-8 max-w-4xl mx-auto">
          {/* 깔끔한 헤더 */}
          <div className="w-full flex flex-col sm:flex-row justify-between items-center gap-4 sm:gap-6 p-4 sm:p-6 md:p-8 bg-gradient-to-r from-slate-800/90 via-purple-800/90 to-slate-800/90 backdrop-blur-xl rounded-2xl border border-purple-400/30 shadow-xl">
            <div className="flex items-center justify-center sm:justify-start">
              <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black text-white text-center sm:text-left leading-tight">
                🎰 <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 bg-clip-text text-transparent">PREMIUM SLOTS</span>
              </h1>
            </div>
            <div className="flex justify-center sm:justify-end">
              <AuthButton />
            </div>
          </div>

          {/* 깔끔한 정보 영역 */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 w-full">
            <ScoreBoard />
            <ComboDisplay />
          </div>

          {/* 베팅 및 컨트롤 영역 */}
          <div className="flex flex-col gap-4 sm:gap-6 w-full">
            <BettingPanel />
            <div className="flex justify-center">
              <AutoSpinToggle />
            </div>
          </div>

          {/* 메인 게임 영역 */}
          <div className="w-full flex justify-center">
            <SlotMachineBoard />
          </div>

          {/* 리더보드 */}
          <div className="w-full max-w-lg mx-auto">
            <Leaderboard />
          </div>
        </div>
      </div>
    </ScoreEffectSystem>
  );
};

export default GamePage;
