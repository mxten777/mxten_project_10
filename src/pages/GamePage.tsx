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
      <div className="min-h-screen p-6">
        <div className="flex flex-col items-center gap-8 max-w-5xl mx-auto">
          {/* 헤더 영역 */}
          <div className="w-full flex justify-between items-center p-4 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 shadow-xl">
            <div className="flex items-center gap-4">
              <h1 className="text-4xl font-bold text-white drop-shadow-lg">
                🎰 <span className="bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">프리미엄 슬롯</span>
              </h1>
            </div>
            <AuthButton />
          </div>

          {/* 상단 정보 영역 개선 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-3xl">
            <div className="glass-morphism rounded-2xl p-1">
              <ScoreBoard />
            </div>
            <div className="glass-morphism rounded-2xl p-1">
              <ComboDisplay />
            </div>
          </div>

          {/* 베팅 및 컨트롤 영역 개선 */}
          <div className="flex flex-col gap-6 w-full max-w-3xl">
            <div className="glass-morphism rounded-2xl p-1">
              <BettingPanel />
            </div>
            <div className="flex justify-center glass-morphism rounded-2xl p-4">
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
