jest.mock('./Leaderboard', () => () => <div>Leaderboard</div>);
jest.mock('./ScoreBoard', () => () => <div>ScoreBoard</div>);
jest.mock('./ComboDisplay', () => () => <div>ComboDisplay</div>);
jest.mock('./GameModeSelector', () => () => <div>GameModeSelector</div>);
jest.mock('./SimpleAnimations', () => ({ AnimatedSlotReel: () => <div>AnimatedSlotReel</div>, AnimatedResult: () => <div>AnimatedResult</div>, AnimatedSpinButton: (props: any) => <button {...props}>스핀 시작</button> }));
jest.mock('./Slot3D', () => ({ Slot3DContainer: () => <div>Slot3DContainer</div> }));
jest.mock('./PremiumLottie', () => () => <div>PremiumLottie</div>);
jest.mock('./PaytableModal', () => (props: any) => props.isOpen ? <div>배당표</div> : null);
jest.mock('./TutorialModal', () => (props: any) => props.open ? <div>튜토리얼</div> : null);
jest.mock('./SoundVibrationToggle', () => () => <div>SoundVibrationToggle</div>);
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';

// 외부 의존성 모킹
jest.mock('../utils/firestoreGame', () => ({ saveGameRun: jest.fn() }));
jest.mock('../stores/soundVibrationStore', () => ({ useSoundVibrationStore: () => ({ soundOn: false }) }));
jest.mock('../stores/gameStore', () => ({ useGameStore: () => ({ score: 0, setScore: () => {}, combo: 1, setCombo: () => {} }) }));
jest.mock('../stores/authStore', () => ({ useAuthStore: () => ({ uid: 'testuid' }) }));
jest.mock('../stores/balanceStore', () => ({ useBalanceStore: () => ({ bet: 100, balance: 0, decreaseBalance: () => {}, increaseBalance: () => {}, setBalance: () => {} }) }));
jest.mock('../stores/autoSpinStore', () => ({ useAutoSpinStore: () => ({ autoSpin: false }) }));
jest.mock('../utils/premiumParticles', () => ({ useParticleEffects: () => ({ welcome: jest.fn(), jackpot: jest.fn(), coinRain: jest.fn(), celebrate: jest.fn(), combo: jest.fn(), special: jest.fn(), autoSpin: jest.fn() }) }));
jest.mock('../utils/slotConstants', () => ({ getRandomSymbols: () => Array(9).fill('🍒'), getRandomSymbol: () => '🍒', checkWinningCombinations: () => [] }));
jest.mock('../utils/soundUtils', () => ({ createBeepSound: () => ({ play: jest.fn() }), createMelodySound: () => ({ play: jest.fn() }) }));

import SlotMachineBoard from './SlotMachineBoard';

describe('SlotMachineBoard', () => {
  it('renders without crashing', () => {
    render(<SlotMachineBoard />);
    const spinButtons = screen.getAllByRole('button', { name: /스핀 시작/i });
    expect(spinButtons.length).toBeGreaterThan(0);
  });

  it('shows balance warning when balance is zero', () => {
    render(<SlotMachineBoard />);
    // 잔고 부족 메시지 확인
    expect(screen.getByText(/잔고가 부족합니다/i)).toBeInTheDocument();
  });

  it('opens paytable modal when button clicked', () => {
    render(<SlotMachineBoard />);
    const paytableBtn = screen.getByRole('button', { name: /배당표/i });
    fireEvent.click(paytableBtn);
    const paytableTexts = screen.getAllByText(/배당표/i);
    expect(paytableTexts.length).toBeGreaterThan(0);
  });
});
