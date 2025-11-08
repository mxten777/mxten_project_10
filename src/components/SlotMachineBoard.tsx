import React, { useState, useEffect } from 'react';
import TutorialModal from './TutorialModal';
import PaytableModal from './PaytableModal';
import SoundVibrationToggle from './SoundVibrationToggle';
import { useSoundVibrationStore } from '../stores/soundVibrationStore';
import { useGameStore } from '../stores/gameStore';
import { useBalanceStore } from '../stores/balanceStore';
import { useParticleEffects } from '../utils/premiumParticles';
import { motion } from 'framer-motion';
import PremiumLottie from './PremiumLottie';
import { getRandomSymbol, SYMBOL_PAYOUTS } from '../utils/slotConstants';
// import GameModeSelector from './GameModeSelector';
import type { GameMode } from './GameModeSelector';
import { playEffect } from '../utils/gameAudio';
import { startSpinLoop, stopSpinLoop } from '../utils/spinLoopAudio';
import { UltraPremiumSlotReel } from './UltraPremiumSlotReel';

const SlotMachineBoard: React.FC = () => {
  const isMobile = typeof window !== 'undefined' && /Mobi|Android/i.test(window.navigator.userAgent);
  const { combo, setCombo } = useGameStore();
  const { soundOn } = useSoundVibrationStore();
  const { bet, balance, decreaseBalance, increaseBalance } = useBalanceStore();
  const particles = useParticleEffects();

  // 프리미엄 상태 관리 - 항상 3개(한 줄)만 유지
  const [reels, setReels] = useState<string[]>(Array(3).fill('').map(() => getRandomSymbol()));
  const [spinning, setSpinning] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [totalWin, setTotalWin] = useState(0);
  const [lottieType, setLottieType] = useState<'jackpot' | 'bonus' | 'win' | 'celebration' | null>(null);
  const [gameMode] = useState<GameMode>('premium');
  const [showTutorial, setShowTutorial] = useState(false);
  const [showPaytable, setShowPaytable] = useState(false);
  const [reelStates, setReelStates] = useState<boolean[]>([false, false, false]); // 각 릴의 멈춤 상태
  const [anticipationMode, setAnticipationMode] = useState(false); // 긴장감 모드

  // 튜토리얼/웰컴 파티클
  useEffect(() => {
    if (!localStorage.getItem('tutorialShown')) {
      setShowTutorial(true);
      localStorage.setItem('tutorialShown', '1');
    }
    if (!localStorage.getItem('welcomeShown')) {
      particles.welcome();
      localStorage.setItem('welcomeShown', '1');
    }
  }, [particles, setShowTutorial]);

  // 스핀 결과 처리
  const processSpinResult = (finalReels: string[], combo: number, bet: number) => {
    let resultText = '';
    let newCombo = combo;
    let totalPayout = 0;
    const isWin = finalReels.length === 3 && finalReels[0] === finalReels[1] && finalReels[1] === finalReels[2];
    if (isWin) {
      totalPayout = bet * (SYMBOL_PAYOUTS[finalReels[0]] || 1);
      resultText = `${finalReels[0]} WIN!`;
      newCombo = combo + 1;
      if (finalReels[0] === '7️⃣') {
        resultText = '🎉 777 JACKPOT!';
        setLottieType('jackpot');
        if (soundOn) playEffect('jackpot');
        particles.jackpot();
        setTimeout(() => setLottieType(null), 3000);
      } else {
        setLottieType('win');
        if (soundOn) playEffect('win');
        particles.celebrate('big');
        setTimeout(() => setLottieType(null), 2000);
      }
      increaseBalance(totalPayout);
      setCombo(newCombo);
      setResult(resultText);
      setTotalWin(totalPayout);
    } else {
      setLottieType('celebration');
      setResult('꽝!');
      setTotalWin(0);
      setCombo(0);
      if (soundOn) playEffect('fail');
  particles.celebrate('small');
      setTimeout(() => setLottieType(null), 1200);
    }
  };

  // 프리미엄 스핀 핸들러 - 단계별 멈춤과 긴장감 연출
  const handleSpin = () => {
    if (spinning) return;
    setSpinning(true);
    setResult(null);
    setTotalWin(0);
    setReelStates([false, false, false]);
    setAnticipationMode(false);
    if (soundOn) startSpinLoop();
    decreaseBalance(bet);

    // 프리미엄 릴 애니메이션: 빠른 회전과 단계별 멈춤으로 긴장감 극대화
    const spinCounts = [20, 28, 40]; // 회전 횟수 줄이면서도 충분한 긴장감 (25→20, 35→28, 50→40)
    const finalReels: string[] = Array(3).fill('');
    let finished = 0;

    function spinCell(cellIdx: number, count: number) {
      if (count <= 0) {
        finalReels[cellIdx] = getRandomSymbol();
        
        // 릴별 멈춤 사운드와 상태 업데이트
        const newReelStates = [...reelStates];
        newReelStates[cellIdx] = true;
        setReelStates(newReelStates);
        
        if (cellIdx === 0 && soundOn) playEffect('spin');
        if (cellIdx === 1 && soundOn) {
          playEffect('spin');
          // 2개 릴이 멈춘 후 긴장감 모드 시작
          setTimeout(() => setAnticipationMode(true), 300);
        }
        if (cellIdx === 2 && soundOn) {
          playEffect('spin');
          setAnticipationMode(false);
        }
        
        if (++finished === 3) {
          setReels([...finalReels]);
          setSpinning(false);
          setLottieType(null);
          if (soundOn) stopSpinLoop();
          
          // 승리 판정과 프리미엄 연출
          setTimeout(() => {
            processSpinResult(finalReels, combo, bet);
          }, 500);
        }
        return;
      }
      
      setReels(prevReels => {
        const newReels = [...prevReels];
        newReels[cellIdx] = getRandomSymbol();
        return newReels.slice(0, 3);
      });
      
      // 각 릴별 차별화된 속도와 긴장감 - 속도 대폭 증가
      let delay = 40; // 기본 속도 2배 빠르게 (80 → 40)
      if (cellIdx === 1) delay = 60; // 2번째 릴 (110 → 60)
      if (cellIdx === 2) delay = count < 10 ? 180 : 80; // 마지막 릴도 빠르게 (280 → 180, 150 → 80)
      
      setTimeout(() => spinCell(cellIdx, count - 1), delay);
    }
    
    // 릴별 시차 시작으로 더욱 드라마틱하게
    for (let i = 0; i < 3; i++) {
      setTimeout(() => spinCell(i, spinCounts[i]), i * 200);
    }
  };

  // 승리 상태 계산
  const isWinning = reels.length === 3 && reels.every(symbol => symbol === reels[0]);

  return (
    <>
      <TutorialModal open={showTutorial} onClose={() => setShowTutorial(false)} />
      <PaytableModal isOpen={showPaytable} onClose={() => setShowPaytable(false)} />

      <div className="flex flex-col items-center gap-6 sm:gap-7 md:gap-8 w-full max-w-sm sm:max-w-md md:max-w-lg lg:max-w-2xl xl:max-w-3xl mx-auto px-2 sm:px-4">
        {/* 프리미엄 컨트롤 패널 - 일관된 디자인 */}
        <div className="w-full flex flex-col xs:flex-row justify-between items-center gap-4 sm:gap-5 md:gap-6 p-5 sm:p-6 md:p-7 bg-gradient-to-br from-slate-900/95 via-purple-900/90 to-blue-900/85 rounded-[20px] sm:rounded-[24px] md:rounded-[28px] shadow-[0_0_40px_rgba(255,215,0,0.15)] border-2 border-yellow-400/40 backdrop-blur-xl relative overflow-hidden"
             style={{ minHeight: 'clamp(80px, 12vw, 120px)' }}
        >
          {/* 배경 글로우 효과 */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-yellow-400/5 to-transparent pointer-events-none" />
          
          <motion.button
            onClick={() => setShowPaytable(true)}
            className="group relative px-3 py-2 sm:px-4 sm:py-3 md:px-5 md:py-4 bg-gradient-to-r from-yellow-400 via-amber-500 to-orange-500 text-white rounded-[12px] sm:rounded-[16px] md:rounded-[18px] font-black min-h-[40px] sm:min-h-[48px] md:min-h-[56px] focus:outline-none active:scale-95 backdrop-blur-lg border-2 border-yellow-400/60 shadow-[0_0_20px_rgba(255,215,0,0.4)] sm:shadow-[0_0_25px_rgba(255,215,0,0.4)] md:shadow-[0_0_30px_rgba(255,215,0,0.4)] overflow-hidden transition-all duration-300 whitespace-nowrap"
            whileHover={{ 
              scale: 1.05,
              boxShadow: "0 0 35px rgba(255,215,0,0.6)",
              rotateZ: [0, 1, -1, 0]
            }}
            whileTap={{ scale: 0.95 }}
            aria-label="프리미엄 배당표 보기"
            tabIndex={0}
            role="button"
            onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') setShowPaytable(true); }}
          >
            {/* 프리미엄 글리터 효과 */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -skew-x-12 transform translate-x-[-100%] group-hover:translate-x-[200%] transition-transform duration-1000" />
            
            {/* 아이콘과 텍스트 - 반응형 크기 조정 */}
            <div className="relative z-10 flex items-center gap-1 sm:gap-2 whitespace-nowrap">
              <span className="text-sm sm:text-lg md:text-xl filter drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]" aria-hidden="true">💎</span>
              <span className="drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)] tracking-wide text-sm sm:text-base md:text-lg">배당표</span>
            </div>
            
            {/* 펄스 효과 */}
            <div className="absolute inset-0 bg-gradient-to-r from-yellow-400/0 via-yellow-400/20 to-yellow-400/0 animate-pulse rounded-[12px] sm:rounded-[16px] md:rounded-[18px]" />
          </motion.button>
          
          <SoundVibrationToggle />
        </div>

        <div className="w-full text-center mb-2 sm:mb-3 md:mb-4">
          {gameMode === 'classic' && <span className="text-gray-400 text-sm sm:text-base md:text-lg font-medium">클래식 슬롯: 기본 규칙</span>}
          {gameMode === 'premium' && <span className="text-yellow-400 font-bold text-sm sm:text-base md:text-lg lg:text-xl drop-shadow-lg">프리미엄 슬롯: 특수 효과/보상 활성화</span>}
          {gameMode === 'challenge' && <span className="text-red-400 font-bold text-sm sm:text-base md:text-lg lg:text-xl drop-shadow-lg">챌린지 모드: 난이도 상승, 추가 보상</span>}
        </div>

        <div className="w-full flex justify-center relative">
          {/* 울트라 프리미엄 배경 효과 */}
          <div className="absolute inset-0 bg-gradient-to-br from-purple-900/30 via-blue-900/40 to-indigo-900/50 rounded-[40px] blur-3xl -z-10" />
          <div className="absolute inset-4 bg-gradient-to-tr from-yellow-400/10 via-transparent to-orange-400/10 rounded-[36px] blur-2xl -z-10" />
          
          {/* 메인 릴 컨테이너 - 완전히 새로운 프리미엄 디자인 */}
          <motion.div
            className="relative p-6 sm:p-8 md:p-10 bg-gradient-to-br from-slate-900/95 via-blue-900/90 to-purple-900/85 rounded-[32px] border-2 border-yellow-400/50 backdrop-blur-xl"
            initial={{ opacity: 0, scale: 0.8, y: 30 }}
            animate={{ 
              opacity: 1, 
              scale: result && totalWin > 0 && !spinning ? [1, 1.08, 1.04, 1.06, 1.02, 1.05] : 1, 
              y: result && totalWin > 0 && !spinning ? [0, -12, 6, -8, 4, -2] : 0,
              rotate: result && totalWin > 0 && !spinning ? [0, -1, 1, -0.5, 0.5, 0] : 0,
              boxShadow: result && totalWin > 0 && !spinning ? [
                "0 0 80px rgba(255, 215, 0, 0.3)",
                "0 0 150px rgba(255, 215, 0, 0.8)",
                "0 0 120px rgba(255, 215, 0, 0.6)",
                "0 0 180px rgba(255, 215, 0, 1.0)",
                "0 0 140px rgba(255, 215, 0, 0.7)",
                "0 0 160px rgba(255, 215, 0, 0.9)"
              ] : anticipationMode ? [
                "0 0 60px rgba(255, 215, 0, 0.4)",
                "0 0 100px rgba(255, 215, 0, 0.7)", 
                "0 0 60px rgba(255, 215, 0, 0.4)"
              ] : "0 0 80px rgba(255, 215, 0, 0.3)"
            }}
            transition={{ 
              duration: result && totalWin > 0 && !spinning ? 3 : 0.6, 
              ease: "easeOut",
              repeat: result && totalWin > 0 && !spinning ? Infinity : (anticipationMode ? Infinity : 0),
              repeatType: result && totalWin > 0 && !spinning ? "reverse" : "loop",
              boxShadow: {
                duration: result && totalWin > 0 && !spinning ? 2.5 : 2,
                repeat: (result && totalWin > 0 && !spinning) || anticipationMode ? Infinity : 0,
                ease: "easeInOut"
              }
            }}
          >
            {/* 프리미엄 내부 글로우 */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-yellow-400/5 to-transparent rounded-[32px] pointer-events-none" />
            
            {/* 릴 그리드 - 연결감 있는 디자인 */}
            <div className="flex items-center justify-center gap-3 sm:gap-4 md:gap-6 lg:gap-8">
              {reels.map((symbol, i) => {
                const isReelStopped = reelStates[i];
                
                return (
                  <motion.div 
                    key={i}
                    className="relative"
                    animate={{
                      scale: spinning && !isReelStopped ? [1, 1.02, 1] : (anticipationMode && i === 2 ? [1, 1.03, 1] : 1),
                      rotate: spinning && !isReelStopped ? [0, 0.5, -0.5, 0] : 0
                    }}
                    transition={{
                      duration: spinning ? 0.6 : (anticipationMode && i === 2 ? 1 : 0.3),
                      repeat: spinning && !isReelStopped ? Infinity : (anticipationMode && i === 2 ? Infinity : 0),
                      ease: "easeInOut"
                    }}
                  >
                    {/* 릴 프레임 - 균일한 크기와 연결감 */}
                    <div 
                      className="relative bg-gradient-to-br from-slate-800/50 to-slate-900/70 rounded-[20px] sm:rounded-[24px] border border-slate-700/50 shadow-inner"
                      style={{
                        width: 'clamp(85px, 12vw, 160px)',
                        height: 'clamp(120px, 16vw, 220px)',
                        padding: '1px' // 패딩을 극한까지 줄여서 숫자 공간 최대 확보
                      }}
                    >
                      {/* 내부 릴 영역 */}
                      <div className="w-full h-full relative">
                        <UltraPremiumSlotReel
                          finalSymbol={symbol}
                          isSpinning={spinning && !isReelStopped}
                          isWinning={isWinning && !spinning}
                          symbolsPool={["1️⃣","2️⃣","3️⃣","4️⃣","5️⃣","6️⃣","7️⃣","8️⃣","9️⃣"]}
                          reelIndex={i}
                          anticipationMode={anticipationMode && i === 2}
                        />
                      </div>
                      
                      {/* 릴 연결 라인 - 승리 시 더 강력한 효과 */}
                      {i < reels.length - 1 && (
                        <motion.div 
                          className="absolute -right-2 sm:-right-3 md:-right-4 lg:-right-5 top-1/2 -translate-y-1/2 w-4 sm:w-6 md:w-8 lg:w-10 rounded-full"
                          style={{
                            height: isWinning && !spinning ? '3px' : '2px',
                            background: isWinning && !spinning 
                              ? 'linear-gradient(to right, #ffd700, #ff8c00, #ffd700)'
                              : 'linear-gradient(to right, rgba(255,215,0,0.6), rgba(255,215,0,0.8), rgba(255,215,0,0.6))',
                            boxShadow: isWinning && !spinning
                              ? '0 0 20px rgba(255,215,0,0.8), 0 0 40px rgba(255,215,0,0.6)'
                              : '0 0 10px rgba(255,215,0,0.5)'
                          }}
                          animate={isWinning && !spinning ? {
                            scaleX: [1, 1.3, 1.1, 1.2, 1.05, 1.15],
                            opacity: [0.8, 1, 0.9, 1, 0.85, 0.95],
                            boxShadow: [
                              '0 0 20px rgba(255,215,0,0.8)',
                              '0 0 40px rgba(255,215,0,1.0)',
                              '0 0 30px rgba(255,215,0,0.9)',
                              '0 0 50px rgba(255,215,0,1.0)'
                            ]
                          } : {}}
                          transition={{
                            duration: isWinning && !spinning ? 2.2 : 0.3,
                            repeat: isWinning && !spinning ? Infinity : 0,
                            ease: "easeInOut",
                            repeatType: "reverse"
                          }}
                        />
                      )}
                      
                      {/* 릴 멈춤 표시 */}
                      {isReelStopped && (
                        <motion.div
                          className="absolute -top-2 -right-2 w-6 h-6 sm:w-7 sm:h-7 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full shadow-lg border-2 border-white/50 flex items-center justify-center"
                          initial={{ scale: 0, rotate: -180 }}
                          animate={{ scale: 1, rotate: 0 }}
                          transition={{ type: "spring", stiffness: 300, damping: 15 }}
                        >
                          <span className="text-white text-xs font-bold">✓</span>
                        </motion.div>
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </div>
            
            {/* 하단 프리미엄 인디케이터 - 승리 시 강화 */}
            <div className="flex justify-center mt-4 gap-3">
              {reels.map((_, i) => (
                <motion.div
                  key={i}
                  className={`w-3 h-3 rounded-full transition-all duration-300`}
                  style={{
                    background: isWinning && !spinning
                      ? 'linear-gradient(45deg, #ffd700, #ff8c00)'
                      : reelStates[i] 
                        ? 'linear-gradient(45deg, #34d399, #059669)'
                        : spinning 
                          ? 'linear-gradient(45deg, #fbbf24, #f59e0b)'
                          : '#64748b',
                    boxShadow: isWinning && !spinning
                      ? '0 0 15px rgba(255,215,0,1.0)'
                      : reelStates[i] 
                        ? '0 0 10px rgba(34,197,94,0.8)'
                        : spinning 
                          ? '0 0 8px rgba(255,215,0,0.6)'
                          : 'none'
                  }}
                  animate={isWinning && !spinning ? {
                    scale: [1, 1.4, 1.2, 1.3, 1.1, 1.25],
                    y: [0, -3, 1, -2, 0.5, -1],
                    boxShadow: [
                      '0 0 15px rgba(255,215,0,1.0)',
                      '0 0 25px rgba(255,215,0,1.0)',
                      '0 0 20px rgba(255,215,0,1.0)',
                      '0 0 30px rgba(255,215,0,1.0)'
                    ]
                  } : {}}
                  transition={{
                    duration: isWinning && !spinning ? 2.8 : 0.3,
                    repeat: isWinning && !spinning ? Infinity : 0,
                    ease: "easeInOut",
                    repeatType: "reverse",
                    delay: i * 0.1 // 순차적 애니메이션
                  }}
                />
              ))}
            </div>
          </motion.div>
        </div>

        <motion.button
          className={`mt-8 sm:mt-10 md:mt-12 px-8 py-4 sm:px-10 sm:py-5 md:px-12 md:py-6 lg:px-14 lg:py-7 text-xl sm:text-2xl md:text-3xl lg:text-4xl font-extrabold relative group overflow-hidden
            ${spinning 
              ? 'bg-gradient-to-r from-gray-600 via-gray-700 to-gray-800 cursor-not-allowed' 
              : 'bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 hover:from-yellow-300 hover:via-orange-400 hover:to-red-400 cursor-pointer'
            }
            rounded-[24px] sm:rounded-[28px] md:rounded-[32px] shadow-[0_0_40px_rgba(255,215,0,0.4)] sm:shadow-[0_0_50px_rgba(255,215,0,0.5)] md:shadow-[0_0_60px_rgba(255,215,0,0.6)] border-3 sm:border-4 md:border-[5px] border-yellow-400/80 backdrop-blur-xl 
            transition-all duration-500 transform-gpu w-full max-w-sm sm:max-w-md md:max-w-lg`}
          style={{ minHeight: 'clamp(60px, 10vw, 90px)' }}
        
          onClick={handleSpin}
          disabled={spinning || balance < bet}
          whileHover={!spinning ? { 
            scale: isMobile ? 1.02 : 1.05, 
            boxShadow: isMobile ? "0 0 40px rgba(255,215,0,0.6)" : "0 0 60px rgba(255,215,0,0.6)",
            rotateZ: [0, 0.5, -0.5, 0]
          } : {}}
          whileTap={!spinning ? { scale: 0.98 } : {}}
          animate={{
            backgroundPosition: spinning ? ["0% 50%", "100% 50%", "0% 50%"] : "0% 50%"
          }}
          transition={{
            backgroundPosition: {
              duration: 2,
              repeat: spinning ? Infinity : 0,
              ease: "linear"
            }
          }}
        >
          {/* 프리미엄 글리터 효과 */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 transform translate-x-[-100%] group-hover:translate-x-[200%] transition-transform duration-1000" />
          
          {/* 텍스트 - 반응형 줄바꿈 처리 */}
          <span className="relative z-10 drop-shadow-[0_4px_8px_rgba(0,0,0,0.5)] leading-tight">
            {spinning 
              ? (
                  isMobile 
                    ? `스핀 중... ${reelStates.filter(Boolean).length}/3` 
                    : `스핀 중... ${reelStates.filter(Boolean).length}/3`
                )
              : anticipationMode 
                ? (isMobile ? '기대해주세요!' : '기대해주세요!') 
                : (isMobile ? '🎰 SPIN!' : '🎰 PREMIUM SPIN!')
            }
          </span>
          
          {/* 펄스 효과 */}
          {!spinning && (
            <div className="absolute inset-0 bg-gradient-to-r from-yellow-400/0 via-yellow-400/10 to-yellow-400/0 animate-pulse rounded-[18px] sm:rounded-[22px] md:rounded-[25px] lg:rounded-[28px]" />
          )}
        </motion.button>

        {gameMode === 'premium' && totalWin > 0 && !spinning && (
          <>
            <motion.div className="absolute left-1/2 top-0 -translate-x-1/2 z-30">
              {lottieType === 'jackpot' && <PremiumLottie type="jackpot" size={140} speed={2} loop={false} autoplay={true} />}
              {lottieType === 'win' && <PremiumLottie type="win" size={120} speed={1.5} loop={false} autoplay={true} />}
              {lottieType === 'bonus' && <PremiumLottie type="bonus" size={120} speed={1.5} loop={false} autoplay={true} />}
              {lottieType === 'celebration' && <PremiumLottie type="celebration" size={120} speed={1.5} loop={false} autoplay={true} />}
            </motion.div>
            <motion.div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-20 pointer-events-none">
              <div className="w-[180px] h-[180px]">
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
            className="w-full p-5 sm:p-6 md:p-7 bg-gradient-to-r from-yellow-400 via-pink-400 to-red-400 rounded-[20px] sm:rounded-[24px] md:rounded-[28px] shadow-[0_0_40px_rgba(255,215,0,0.4)] border-3 sm:border-4 md:border-[5px] border-yellow-400/60 backdrop-blur-xl relative overflow-hidden animate-glow-pulse"
            initial={{ scale: 0, y: 30, opacity: 0 }}
            animate={{
              scale: 1,
              y: 0,
              opacity: 1,
              boxShadow: [
                '0 10px 40px rgba(255, 215, 0, 0.4)',
                '0 15px 60px rgba(255, 215, 0, 0.6)',
                '0 10px 40px rgba(255, 215, 0, 0.4)'
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
            style={{ minHeight: 'clamp(80px, 12vw, 120px)' }}
          >
            <div className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold text-yellow-900 drop-shadow-lg text-center">{result}</div>
            <div className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold text-pink-700 mt-2 sm:mt-3 text-center">+{totalWin.toLocaleString()} 코인</div>
          </motion.div>
        )}
      </div>
    </>
  );
};

export default SlotMachineBoard;