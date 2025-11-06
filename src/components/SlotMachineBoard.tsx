/**
 * SlotMachineBoard
 * - 메인 슬롯머신 게임 보드 컴포넌트
 * - 2D/3D 모드, Glass Morphism, 프리미엄 애니메이션, 사운드, 파티클, 게임 모드별 보상/효과 통합
 * - 주요 외부 의존성: Zustand 스토어, 유틸리티, 프리미엄 컴포넌트
 * - 접근성 및 반응형 UI, 모바일 대응
 */
import React, { useState, useEffect } from 'react';
import TutorialModal from './TutorialModal';
import PaytableModal from './PaytableModal';
import SoundVibrationToggle from './SoundVibrationToggle';
import { useSoundVibrationStore } from '../stores/soundVibrationStore';
import { useGameStore } from '../stores/gameStore';
import { useAuthStore } from '../stores/authStore';
import { useBalanceStore } from '../stores/balanceStore';
import { useAutoSpinStore } from '../stores/autoSpinStore';
import { saveGameRun } from '../utils/firestoreGame';
import { useParticleEffects } from '../utils/premiumParticles';
import { AnimatedSlotReel, AnimatedResult, AnimatedSpinButton } from './SimpleAnimations';
import { Slot3DContainer } from './Slot3D';
import { motion } from 'framer-motion';
import PremiumLottie from './PremiumLottie';
import { getRandomSymbols, getRandomSymbol, checkWinningCombinations } from '../utils/slotConstants';
import { createBeepSound, createMelodySound } from '../utils/soundUtils';
import GameModeSelector from './GameModeSelector';
import type { GameMode } from './GameModeSelector';

import AchievementBoard from './AchievementBoard';
import { useAchievementStore } from '../stores/achievementStore';

const sounds = {
  button: createBeepSound(800, 0.1, 'square'),
  spin: createBeepSound(400, 1.5, 'sawtooth'),
  win: createMelodySound([
    { freq: 523, duration: 0.2 }, // C5
    { freq: 659, duration: 0.2 }, // E5
    { freq: 784, duration: 0.3 }, // G5
  ]),
  jackpot: createMelodySound([
    { freq: 523, duration: 0.15 }, // C5
    { freq: 659, duration: 0.15 }, // E5
    { freq: 784, duration: 0.15 }, // G5
    { freq: 1047, duration: 0.2 }, // C6
    { freq: 784, duration: 0.2 },  // G5
    { freq: 1047, duration: 0.3 }, // C6
  ]),
  jackpot2: createMelodySound([
    { freq: 1047, duration: 0.1 }, // C6
    { freq: 1175, duration: 0.1 }, // D6
    { freq: 1319, duration: 0.1 }, // E6
    { freq: 1397, duration: 0.2 }, // F6
    { freq: 1319, duration: 0.1 }, // E6
    { freq: 1047, duration: 0.3 }, // C6
  ]),
  fail: createBeepSound(200, 0.5, 'square'),
};

const SlotMachineBoard: React.FC = () => {
  // 기존 중복 선언 제거, 타입 명시 선언만 유지
  // 3D 모드 토글 및 모바일/저사양 환경 감지
  const [is3DMode, setIs3DMode] = useState(false);
  // 업적 달성 함수
  const { achieve } = useAchievementStore();
  const isMobile = typeof window !== 'undefined' && /Mobi|Android/i.test(window.navigator.userAgent);
  const effective3DMode = isMobile ? false : is3DMode;
  // 접근성: 주요 버튼 및 인터랙션 요소에 aria-label, role, tabIndex 적용
  const { score, setScore, combo, setCombo } = useGameStore();
  // 사운드/진동 상태
  const { soundOn } = useSoundVibrationStore();
  const { uid } = useAuthStore();
  const { bet, balance, decreaseBalance, increaseBalance, setBalance } = useBalanceStore();
  const { autoSpin } = useAutoSpinStore();
  
  // 프리미엄 파티클 효과
  const particles = useParticleEffects();


  const [reels, setReels] = useState<string[]>(getRandomSymbols());
  const [spinning, setSpinning] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [effect, setEffect] = useState<string>('');
  const [winningLines, setWinningLines] = useState<number[][]>([]);
  const [totalWin, setTotalWin] = useState(0);
  const [lottieType, setLottieType] = useState<'jackpot' | 'bonus' | 'win' | 'celebration' | 'spin' | null>(null);
  // 게임 모드 상태 추가
  const [gameMode, setGameMode] = useState<GameMode>('classic');

  // 미션/챌린지 상태(예시) - 중복 제거, 한 번만 선언
  const [mission] = useState<string | null>('3회 연속 승리');
  const [missionProgress, setMissionProgress] = useState<number>(0);
  // challengeActive 상태 제거 (미사용)

  // 미션/챌린지 진행 예시: 스핀 결과에 따라 진행도/활성화 갱신
  useEffect(() => {
    if (gameMode === 'mission') {
      // 예시: 승리 시 진행도 증가
      if (result && result !== '꽝!') {
        setMissionProgress(prev => Math.min(prev + 33, 100));
      }
    }
    // 챌린지 모드: 연속 승리 시 추가 보상만 처리 (상태 제거)
  }, [result, combo, gameMode, setMissionProgress]);

  // (중복 선언 제거됨)

  // 튜토리얼 모달 상태
  const [showTutorial, setShowTutorial] = useState(false);
  const [showPaytable, setShowPaytable] = useState(false);
  
  
  // 최초 진입 시 튜토리얼/웰컴 파티클
  useEffect(() => {
    if (!localStorage.getItem('tutorialShown')) {
      setShowTutorial(true);
      localStorage.setItem('tutorialShown', '1');
    }
    // 🎊 웰컴 파티클 효과
    if (!localStorage.getItem('welcomeShown')) {
      particles.welcome();
      localStorage.setItem('welcomeShown', '1');
    }
  }, [particles, setShowTutorial]);

  /**
   * 스핀 결과 계산 및 보상/효과 처리
   * - 모드별 승리 조합, 보상, 파티클/사운드/애니메이션 트리거
   */
  const processSpinResult = (finalReels: string[], combo: number, bet: number, gameMode: GameMode) => {
    let wins = checkWinningCombinations(finalReels);
    let totalPayout = 0;
    let resultText = '';
    let newCombo = combo;
    // 챌린지 모드: 페이라인 감소, 배당률 증가
    if (gameMode === 'challenge') {
      wins = wins.filter((_, idx) => idx < 4);
    }
    // 프리미엄 모드: 추가 보상 및 멀티플라이어 적용
    const premiumMultiplier = gameMode === 'premium' ? 1.5 : 1;
    if (wins.length > 0) {
      const winLines = wins.map(w => w.line);
      setWinningLines(winLines);
      totalPayout = wins.reduce((sum, win) => sum + (bet * win.payout * win.multiplier * premiumMultiplier), 0);
      // 미션/챌린지 모드 추가 보상/피드백
      if (gameMode === 'mission' && missionProgress >= 99) {
        totalPayout += bet * 10; // 미션 달성 시 추가 보상
        resultText = '🎯 미션 달성! 추가 보상 지급';
        setMissionProgress(0); // 미션 초기화
        // 업적: 미션 클리어
        achieve('mission-clear');
      }
      if (gameMode === 'challenge' && combo >= 3) {
        totalPayout += bet * 5; // 챌린지 달성 시 추가 보상
        resultText = '🔥 챌린지 성공! 특별 보상 지급';
      }
      setTotalWin(totalPayout);
      const megaWin = totalPayout >= bet * 50;
      const bigWin = totalPayout >= bet * 20;
      const hasSpecialSymbol = wins.some(w => w.symbol === '🌟' || w.symbol === '💥');
      // 결과별 효과/애니메이션/사운드
      if (megaWin || hasSpecialSymbol) {
        resultText = resultText || '🌟 MEGA WIN! 🌟';
        newCombo = combo + 3;
        if (soundOn) {
          (Math.random() < 0.5 ? sounds.jackpot : sounds.jackpot2).play();
          if (window.navigator.vibrate) window.navigator.vibrate([100, 50, 100, 50, 200]);
        }
        setEffect('jackpot-glow');
        setLottieType('jackpot');
        particles.jackpot();
        setTimeout(() => particles.coinRain(totalPayout), 1000);
        setTimeout(() => setLottieType(null), 3000);
        // 업적: 잭팟
        achieve('jackpot');
      } else if (bigWin) {
        resultText = resultText || '💰 BIG WIN! 💰';
        newCombo = combo + 2;
        if (soundOn) {
          sounds.win.play();
          if (window.navigator.vibrate) window.navigator.vibrate([80, 40, 80]);
        }
        setEffect('win-glow');
        setLottieType('win');
        particles.celebrate('big');
        particles.coinRain(totalPayout);
        setTimeout(() => setLottieType(null), 2500);
      } else {
        resultText = resultText || `🎉 WIN x${wins.length}라인!`;
        setLottieType('celebration');
        newCombo = combo + 1;
        if (soundOn) {
          sounds.win.play();
          if (window.navigator.vibrate) window.navigator.vibrate([40, 20, 40]);
        }
        setEffect('win-glow');
        setTimeout(() => setLottieType(null), 2000);
        particles.celebrate('small');
        // 업적: 첫 승리
        achieve('first-win');
      }
      increaseBalance(totalPayout);
      window.dispatchEvent(new CustomEvent('scoreIncrease', {
        detail: { value: totalPayout, x: window.innerWidth / 2, y: window.innerHeight / 2 }
      }));
      // 특수 심볼 효과
      if (hasSpecialSymbol) {
        wins.forEach(win => {
          if (win.symbol === '🌟') particles.special('wild');
          if (win.symbol === '💥') particles.special('scatter');
        });
        const specialCount = finalReels.filter(symbol => symbol === '🌟' || symbol === '💥').length;
        if (specialCount >= 3) {
          setTimeout(() => {
            setLottieType('bonus');
            setTimeout(() => setLottieType(null), 4000);
          }, 1500);
        }
      }
      // 콤보 효과
      if (newCombo > 1) {
        particles.combo(newCombo);
        // 업적: 콤보 마스터 (콤보 5회 달성)
        if (newCombo >= 5) achieve('combo-master');
      }
    } else {
      resultText = '꽝!';
      newCombo = 1;
      if (soundOn) sounds.fail.play();
      setEffect('fail-shake');
    }
    setResult(resultText);
    setTimeout(() => {
      setEffect('');
      setWinningLines([]);
    }, 3000);
    setScore(score + totalPayout);
    setCombo(newCombo);
    // Firestore 기록 저장 (로그인 상태에서만)
    if (uid) {
      (async () => {
        await saveGameRun({
          uid,
          score: score + totalPayout,
          ballsUsed: 1,
          combos: newCombo,
          createdAt: new Date(),
        });
      })();
    }
    // 오토스핀: 스핀 종료 후 자동 재시작
    if (autoSpin && balance >= bet) {
      setTimeout(() => {
        particles.autoSpin();
        handleSpin();
      }, 1500);
    }
  };


  /**
   * 스핀 버튼 클릭 핸들러
   * - 스핀 애니메이션 시작, 상태 초기화, 사운드/진동 트리거
   */
  const handleSpin = () => {
    if (spinning || balance < bet) return;
    if (soundOn) {
      sounds.button.play();
      if (window.navigator.vibrate) window.navigator.vibrate(30);
    }
    decreaseBalance(bet);
    setSpinning(true);
    setResult(null);
    setWinningLines([]);
    setTotalWin(0);
    setLottieType('spin');
    let stopped = 0;
    const spinCounts = Array.from({length: 9}, (_, i) => 15 + i * 3);
    if (soundOn) sounds.spin.play();
    if (soundOn && window.navigator.vibrate) window.navigator.vibrate([20, 40, 20]);
    function spinCell(cellIdx: number, count: number) {
      if (count === 0) {
        stopped++;
        if (stopped === 9) {
          const finalReels = getRandomSymbols();
          setReels(finalReels);
          setSpinning(false);
          setLottieType(null);
          processSpinResult(finalReels, combo, bet, gameMode);
        }
        return;
      }
      setReels(prevReels => {
        const newReels = [...prevReels];
        newReels[cellIdx] = getRandomSymbol();
        return newReels;
      });
      setTimeout(() => spinCell(cellIdx, count - 1), 80 + (cellIdx % 3) * 15);
    }
    for (let i = 0; i < 9; i++) {
      spinCell(i, spinCounts[i]);
    }
  };

  return (
    <>
      <TutorialModal open={showTutorial} onClose={() => setShowTutorial(false)} />
      <PaytableModal isOpen={showPaytable} onClose={() => setShowPaytable(false)} />

      <div className="flex flex-col items-center gap-5 sm:gap-6 md:gap-8 w-full max-w-lg sm:max-w-xl md:max-w-2xl lg:max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* 미션/챌린지 모드 현황 표시 */}
        {(gameMode === 'mission' || gameMode === 'challenge') && (
          <div className="w-full mb-2 p-3 rounded-xl bg-gradient-to-r from-blue-200/40 to-purple-200/40 border border-blue-300/30 shadow-lg flex flex-col items-center">
            {gameMode === 'mission' && mission && (
              <>
                <div className="font-bold text-blue-700">미션: {mission}</div>
                <div className="text-sm text-gray-700">진행도: {missionProgress}%</div>
              </>
            )}
            {gameMode === 'challenge' && (
              <>
                <div className="font-bold text-purple-700">챌린지 모드 활성화!</div>
                <div className="text-sm text-gray-700">특별 조건 달성 시 추가 보상 지급</div>
                <div className="text-xs text-gray-500">예시: 연속 승리, 특정 심볼 획득 등</div>
              </>
            )}
          </div>
        )}
        {/* Glass Morphism 배경 카드 */}
        <div className="absolute inset-0 -z-10 bg-gradient-to-br from-white/10 via-slate-200/10 to-purple-100/10 backdrop-blur-2xl rounded-3xl shadow-2xl border border-white/20" />
        {/* 게임 모드 선택 */}
        <GameModeSelector mode={gameMode} onChange={setGameMode} />
  {/* 🎮 상단 컨트롤 패널 - 완벽한 정렬 */}
        <div className="w-full flex flex-col sm:flex-row justify-between items-center gap-4 sm:gap-6 p-4 sm:p-5 lg:p-6 bg-gradient-to-r from-indigo-900/80 to-purple-900/80 rounded-2xl sm:rounded-3xl backdrop-blur-md shadow-2xl border border-white/20">
          <div className="flex gap-3 sm:gap-4 w-full sm:w-auto justify-center sm:justify-start">
            <motion.button
              onClick={() => setShowPaytable(true)}
              className="px-4 sm:px-5 py-3 sm:py-4 bg-gradient-to-r from-amber-400/80 to-orange-400/80 text-white rounded-xl sm:rounded-2xl font-bold hover:from-amber-500 hover:to-orange-500 transition-all duration-300 shadow-2xl flex items-center gap-2 sm:gap-3 text-sm sm:text-base lg:text-lg whitespace-nowrap min-h-[44px] sm:min-h-[48px] focus:outline-none focus-visible:ring-4 focus-visible:ring-amber-300/60 active:scale-95 backdrop-blur-lg border border-amber-200/30"
              whileHover={{ scale: 1.07 }}
              whileTap={{ scale: 0.96 }}
              aria-label="배당표 보기"
              tabIndex={0}
              role="button"
              onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') setShowPaytable(true); }}
            >
              <span className="text-lg sm:text-xl drop-shadow-md" aria-hidden="true">💰</span>
              <span className="drop-shadow-md">배당표</span>
            </motion.button>
            
            {/* 3D 모드 토글 - 완벽한 정렬 */}
            <motion.button
              onClick={() => setIs3DMode(!is3DMode)}
              className={`
                px-4 sm:px-5 py-3 sm:py-4 rounded-xl sm:rounded-2xl font-bold transition-all duration-300 shadow-2xl flex items-center gap-2 sm:gap-3 text-sm sm:text-base lg:text-lg whitespace-nowrap min-h-[44px] sm:min-h-[48px] focus:outline-none focus-visible:ring-4 focus-visible:ring-purple-300/60 active:scale-95 backdrop-blur-lg border border-purple-200/30
                ${is3DMode 
                  ? 'bg-gradient-to-r from-purple-400/80 to-pink-400/80 text-white ring-2 ring-purple-200/40 shadow-purple-400/30' 
                  : 'bg-gradient-to-r from-slate-500/80 to-slate-700/80 text-white hover:from-slate-400/80 hover:to-slate-600/80'
                }
              `}
              whileHover={{ scale: 1.07 }}
              whileTap={{ scale: 0.96 }}
              aria-label={is3DMode ? '2D 모드로 전환' : '3D 모드로 전환'}
              tabIndex={0}
              role="button"
              onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') setIs3DMode(!is3DMode); }}
            >
              <span className="text-lg sm:text-xl drop-shadow-md" aria-hidden="true">{is3DMode ? '🌟' : '🎯'}</span>
              <span className="drop-shadow-md">{is3DMode ? '3D' : '2D'}</span>
            </motion.button>
          </div>
          
          <div className="w-full sm:w-auto flex justify-center sm:justify-end">
            <SoundVibrationToggle />
          </div>
        </div>
        
        {/* 🎰 메인 게임 보드 - 완벽한 중앙 정렬 */}
        {/* 모드별 안내 메시지 */}
        <div className="w-full text-center mb-2">
          {gameMode === 'classic' && <span className="text-gray-500">클래식 슬롯: 기본 규칙</span>}
          {gameMode === 'premium' && <span className="text-purple-600 font-bold">프리미엄 슬롯: 특수 효과/보상 활성화</span>}
          {gameMode === 'challenge' && <span className="text-red-500 font-bold">챌린지 모드: 난이도 상승, 추가 보상</span>}
        </div>
        <motion.div 
          className={`flex flex-col items-center gap-6 sm:gap-7 md:gap-8 p-6 sm:p-7 md:p-8 lg:p-10 rounded-3xl sm:rounded-4xl shadow-2xl w-full transition-all duration-500 backdrop-blur-md
            ${effect === 'jackpot-glow' ? 'bg-gradient-to-br from-yellow-400/20 to-orange-500/20 ring-2 sm:ring-4 ring-yellow-400 animate-gradient-shift animate-glow-pulse border border-yellow-400/50' : 'bg-gradient-to-br from-slate-900/60 to-indigo-900/60 border border-white/20'}
            ${effect === 'win-glow' ? 'bg-gradient-to-br from-blue-400/20 to-cyan-500/20 ring-2 ring-blue-300 animate-shimmer border border-blue-400/50' : ''}
            ${effect === 'fail-shake' ? 'bg-gradient-to-br from-red-400/20 to-pink-500/20 animate-shake border border-red-400/50' : ''}
          `}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* 🎰 2D/3D 슬롯 그리드 조건부 렌더링 */}
          {/* 모드별로 3D/2D, 보상, 효과 등 분기 가능. 아래는 예시 */}
          {effective3DMode ? (
            /* 🌟 3D 슬롯머신 (환경 효과 및 성능 최적화) */
            <motion.div
              initial={{ opacity: 0, rotateY: -90 }}
              animate={{ opacity: 1, rotateY: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              <div className="relative w-full h-[340px] sm:h-[400px] lg:h-[480px] rounded-3xl overflow-hidden shadow-2xl">
                {/* Three.js Canvas 환경 효과 예시 */}
                <div className="absolute inset-0 pointer-events-none z-0 bg-gradient-to-br from-indigo-900/40 to-purple-900/40 backdrop-blur-lg" />
                <Slot3DContainer
                  symbols={reels}
                  isSpinning={spinning}
                  winningLines={winningLines}
                />
              </div>
            </motion.div>
          ) : (
            /* 🎯 2D Framer Motion 프리미엄 슬롯 그리드 - 완벽한 균형감 */
            <motion.div 
              className="grid grid-cols-3 gap-3 sm:gap-4 p-6 sm:p-8 bg-gradient-to-br from-slate-800/80 to-slate-900/90 rounded-2xl sm:rounded-3xl backdrop-blur-sm border-2 border-slate-600/50 shadow-2xl aspect-square max-w-sm sm:max-w-md mx-auto"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: isMobile ? 0.3 : 0.6, ease: "easeOut" }}
            >
              {reels.map((symbol, i) => {
                const isWinning = winningLines.some(line => line.includes(i));
                
                return (
                  <AnimatedSlotReel
                    key={i}
                    symbol={symbol}
                    isSpinning={spinning}
                    isWinning={isWinning}
                    index={i}
                  />
                );
              })}
            </motion.div>
          )}

          {/* 💰 승리 정보 표시 개선 */}
          {/* 프리미엄 모드: 추가 보상/파티클/애니메이션 표시 */}
          {gameMode === 'premium' && totalWin > 0 && !spinning && (
            <>
              {/* 승리/잭팟/보너스 상황별 프리미엄 애니메이션 */}
              <motion.div className="absolute left-1/2 top-0 -translate-x-1/2 z-30">
                {lottieType === 'jackpot' && <PremiumLottie type="jackpot" size={140} speed={2} loop={false} autoplay={true} />}
                {lottieType === 'win' && <PremiumLottie type="win" size={120} speed={1.5} loop={false} autoplay={true} />}
                {lottieType === 'bonus' && <PremiumLottie type="bonus" size={120} speed={1.5} loop={false} autoplay={true} />}
                {lottieType === 'celebration' && <PremiumLottie type="celebration" size={120} speed={1.5} loop={false} autoplay={true} />}
              </motion.div>
              {/* 파티클 효과 */}
              <motion.div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-20 pointer-events-none">
                <div className="w-[180px] h-[180px]">
                  {/* 예시: Framer Motion 파티클 애니메이션 */}
                  <motion.div
                    className="absolute inset-0 rounded-full bg-gradient-to-br from-yellow-400/40 via-pink-400/30 to-purple-400/40 blur-2xl"
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1.2, opacity: 0.7 }}
                    transition={{ duration: 1.2, type: 'spring' }}
                  />
                </div>
              </motion.div>
            </>
          )}
          {totalWin > 0 && !spinning && (
            <motion.div 
              className="w-full p-5 bg-gradient-to-r from-amber-300/60 via-yellow-400/60 to-orange-300/60 rounded-2xl shadow-2xl border-2 border-yellow-200/30 backdrop-blur-xl relative overflow-hidden"
              initial={{ scale: 0, y: 30, opacity: 0 }}
              animate={{ 
                scale: 1, 
                y: 0, 
                opacity: 1,
                boxShadow: [
                  '0 10px 40px rgba(255, 215, 0, 0.3)',
                  '0 15px 60px rgba(255, 215, 0, 0.5)',
                  '0 10px 40px rgba(255, 215, 0, 0.3)'
                ]
              }}
              transition={{
                duration: 0.8,
                type: "spring",
                stiffness: 200,
                boxShadow: {
                  duration: 2.5,
                  repeat: Infinity,
                  ease: "easeInOut"
                }
              }}
            >
              {/* Glass Morphism 오버레이 */}
              <div className="absolute inset-0 bg-white/10 rounded-2xl backdrop-blur-2xl pointer-events-none" />
              <motion.div 
                className="text-center text-white font-bold"
                animate={{ scale: [1, 1.02, 1] }}
                transition={{ duration: 2.5, repeat: Infinity }}
              >
                <motion.div 
                  className="text-base mb-2 opacity-90"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  🎉 총 상금 🎉
                </motion.div>
                <motion.div 
                  className="text-4xl font-black text-white drop-shadow-lg"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.3, type: "spring", stiffness: 300 }}
                  style={{
                    textShadow: '0 0 20px rgba(255,255,255,0.8), 0 0 40px rgba(255,215,0,0.6)'
                  }}
                >
                  💰 {totalWin.toLocaleString()}원
                </motion.div>
                <motion.div 
                  className="text-sm mt-2 bg-white/20 rounded-full px-4 py-1 inline-block"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  ⚡ {winningLines.length}개 라인 승리!
                </motion.div>
              </motion.div>
            </motion.div>
          )}
          {/*  Framer Motion 결과 표시 */}
          <AnimatedResult result={result} effect={effect} />

          {/* 🎨 프리미엄 Lottie 애니메이션 오버레이 개선 */}
          {lottieType && (
            <motion.div 
              className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-2xl"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
            >
              <motion.div
                className="relative p-8 rounded-3xl bg-gradient-to-br from-white/10 to-white/5 border border-white/20 shadow-2xl backdrop-blur-2xl overflow-hidden"
                initial={{ scale: 0, rotate: -180, opacity: 0 }}
                animate={{ scale: 1, rotate: 0, opacity: 1 }}
                exit={{ scale: 0, rotate: 180, opacity: 0 }}
                transition={{ 
                  type: "spring", 
                  stiffness: 300, 
                  damping: 25,
                  duration: 0.8 
                }}
              >
                {/* Glass Morphism 오버레이 */}
                <div className="absolute inset-0 bg-white/10 rounded-3xl backdrop-blur-2xl pointer-events-none" />
                {/* 글로우 효과 */}
                <motion.div
                  className="absolute inset-0 rounded-3xl bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-pink-500/20"
                  animate={{
                    scale: [1, 1.05, 1],
                    opacity: [0.3, 0.6, 0.3]
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                />
                
                <PremiumLottie 
                  type={lottieType}
                  size={320}
                  speed={1.3}
                  loop={true}
                  autoplay={true}
                />
                
                {/* 타입별 메시지 */}
                <motion.div
                  className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 px-6 py-2 bg-white/90 rounded-full shadow-lg"
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.5 }}
                >
                  <span className="text-sm font-bold text-gray-800">
                    {lottieType === 'jackpot' && '🏆 메가 잭팟!'}
                    {lottieType === 'win' && '🎉 빅 윈!'}
                    {lottieType === 'celebration' && '✨ 축하합니다!'}
                    {lottieType === 'bonus' && '🎁 보너스 라운드!'}
                    {lottieType === 'spin' && '🌀 스피닝...'}
                  </span>
                </motion.div>
              </motion.div>
            </motion.div>
          )}

          {/* 🎯 스핀 버튼 - 완벽한 중앙 정렬 */}
          <motion.div 
            className="w-full max-w-sm mx-auto flex justify-center mt-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <div
              role="button"
              aria-label="스핀 시작"
              tabIndex={0}
              onKeyDown={e => { if ((e.key === 'Enter' || e.key === ' ') && !(spinning || balance < bet)) handleSpin(); }}
              className="w-full flex justify-center"
            >
              <AnimatedSpinButton
                onClick={handleSpin}
                disabled={spinning || balance < bet}
                spinning={spinning}
                balance={balance}
                bet={bet}
              />
            </div>
          </motion.div>

          {/* 💸 잔고 부족 알림 개선 */}
          {balance <= 0 && (
            <motion.div 
              className="w-full flex flex-col items-center gap-4 p-6 bg-gradient-to-r from-red-400/40 to-pink-400/40 border-2 border-red-200/30 rounded-2xl backdrop-blur-xl shadow-2xl relative overflow-hidden"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
            >
              {/* Glass Morphism 오버레이 */}
              <div className="absolute inset-0 bg-white/10 rounded-2xl backdrop-blur-2xl pointer-events-none" />
              <motion.div 
                className="text-red-300 font-bold text-xl text-center"
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                💸 잔고가 부족합니다!
              </motion.div>
              <motion.button
                className="px-6 py-3 bg-gradient-to-r from-emerald-500 to-green-600 text-white rounded-xl font-bold hover:from-emerald-600 hover:to-green-700 transition-all duration-300 shadow-lg"
                onClick={() => setBalance(10000)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                🎰 잔고 10,000원으로 재시작
              </motion.button>
            </motion.div>
          )}
        </motion.div>
        
        {/* 하단 정보 패널 */}
        <div className="w-full flex justify-center mt-6 max-w-2xl mx-auto">
          <AchievementBoard />
        </div>
      </div>
    </>
  );
};

export default SlotMachineBoard;
