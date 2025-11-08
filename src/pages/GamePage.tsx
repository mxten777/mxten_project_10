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
        <div className="flex flex-col items-center gap-6 sm:gap-8 md:gap-10 max-w-5xl mx-auto">
          {/* 헤더 영역 - 일관성 있는 프리미엄 디자인 */}
          <div className="w-full flex flex-col sm:flex-row justify-between items-center gap-4 sm:gap-6 p-6 sm:p-7 md:p-8 bg-gradient-to-br from-slate-900/95 via-purple-900/90 to-blue-900/85 backdrop-blur-xl rounded-[24px] sm:rounded-[28px] md:rounded-[32px] border-2 border-yellow-400/40 shadow-[0_0_60px_rgba(255,215,0,0.2)]">
            <div className="flex items-center justify-center sm:justify-start gap-4">
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-white drop-shadow-2xl text-center sm:text-left leading-tight">
                🎰 <span className="bg-gradient-to-r from-yellow-400 via-orange-400 to-red-400 bg-clip-text text-transparent">프리미엄 슬롯</span>
              </h1>
            </div>
            <div className="flex justify-center sm:justify-end">
              <AuthButton />
            </div>
          </div>

          {/* 상단 정보 영역 - 일관성 있는 프리미엄 그리드 */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-7 md:gap-8 w-full max-w-4xl">
            <div 
              className="bg-gradient-to-br from-slate-900/95 via-purple-900/90 to-blue-900/85 backdrop-blur-xl rounded-[20px] sm:rounded-[24px] md:rounded-[28px] border-2 border-yellow-400/30 shadow-[0_0_40px_rgba(255,215,0,0.15)] p-3 sm:p-4"
              style={{ minHeight: 'clamp(160px, 20vw, 220px)' }}
            >
              <ScoreBoard />
            </div>
            <div 
              className="bg-gradient-to-br from-slate-900/95 via-purple-900/90 to-blue-900/85 backdrop-blur-xl rounded-[20px] sm:rounded-[24px] md:rounded-[28px] border-2 border-yellow-400/30 shadow-[0_0_40px_rgba(255,215,0,0.15)] p-3 sm:p-4"
              style={{ minHeight: 'clamp(160px, 20vw, 220px)' }}
            >
              <ComboDisplay />
            </div>
          </div>

          {/* 베팅 및 컨트롤 영역 - 일관성 있는 프리미엄 디자인 */}
          <div className="flex flex-col gap-6 sm:gap-7 md:gap-8 w-full max-w-4xl">
            <div className="bg-gradient-to-br from-slate-900/95 via-purple-900/90 to-blue-900/85 backdrop-blur-xl rounded-[20px] sm:rounded-[24px] md:rounded-[28px] border-2 border-yellow-400/30 shadow-[0_0_40px_rgba(255,215,0,0.15)] p-4 sm:p-5 md:p-6">
              <BettingPanel />
            </div>
            <div className="flex justify-center bg-gradient-to-br from-slate-900/95 via-purple-900/90 to-blue-900/85 backdrop-blur-xl rounded-[20px] sm:rounded-[24px] md:rounded-[28px] border-2 border-yellow-400/30 shadow-[0_0_40px_rgba(255,215,0,0.15)] p-4 sm:p-5 md:p-6">
              <AutoSpinToggle />
            </div>
          </div>

          {/* 메인 게임 영역 - 프리미엄 중앙 배치 */}
          <div className="w-full max-w-2xl sm:max-w-3xl md:max-w-4xl flex justify-center">
            <SlotMachineBoard />
          </div>

          {/* 리더보드 - 일관된 프리미엄 디자인 */}
          <div className="w-full max-w-lg sm:max-w-xl md:max-w-2xl bg-gradient-to-br from-slate-900/95 via-purple-900/90 to-blue-900/85 backdrop-blur-xl rounded-[20px] sm:rounded-[24px] md:rounded-[28px] border-2 border-yellow-400/30 shadow-[0_0_40px_rgba(255,215,0,0.15)] p-4 sm:p-5 md:p-6">
            <Leaderboard />
          </div>
        </div>
      </div>
    </ScoreEffectSystem>
  );
};

export default GamePage;
