import React from 'react';

import SlotMachineBoard from '../components/SlotMachineBoard';
import ScoreBoard from '../components/ScoreBoard';
import ComboDisplay from '../components/ComboDisplay';
import Leaderboard from '../components/Leaderboard';
import { AuthButton } from '../components/AuthButton';
import BettingPanel from '../components/BettingPanel';
import AutoSpinToggle from '../components/AutoSpinToggle';

const GamePage: React.FC = () => {
  return (
    <div className="flex flex-col items-center gap-4 p-4">
      <div className="w-full flex justify-end max-w-2xl mb-2">
        <AuthButton />
      </div>
  <ScoreBoard />
  <BettingPanel />
  <AutoSpinToggle />
  <ComboDisplay />
      <div className="w-full max-w-2xl flex justify-center">
        <SlotMachineBoard />
      </div>
      <Leaderboard />
    </div>
  );
};

export default GamePage;
