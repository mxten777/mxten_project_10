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
// Web Audio API를 사용한 간단한 사운드 생성
const createBeepSound = (frequency: number, duration: number, type: OscillatorType = 'sine') => {
  return {
    play: () => {
      try {
        const audioContext = new (window.AudioContext || (window as unknown as { webkitAudioContext: AudioContext }).webkitAudioContext)();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        oscillator.frequency.value = frequency;
        oscillator.type = type;
        
        gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + duration);
        
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + duration);
      } catch (error) {
        console.warn('Audio not supported:', error);
      }
    }
  };
};

// 복합음을 위한 멜로디 사운드
const createMelodySound = (notes: { freq: number; duration: number }[]) => {
  return {
    play: () => {
      try {
        const audioContext = new (window.AudioContext || (window as unknown as { webkitAudioContext: AudioContext }).webkitAudioContext)();
        let startTime = audioContext.currentTime;
        
        notes.forEach((note) => {
          const oscillator = audioContext.createOscillator();
          const gainNode = audioContext.createGain();
          
          oscillator.connect(gainNode);
          gainNode.connect(audioContext.destination);
          
          oscillator.frequency.value = note.freq;
          oscillator.type = 'sine';
          
          gainNode.gain.setValueAtTime(0.2, startTime);
          gainNode.gain.exponentialRampToValueAtTime(0.01, startTime + note.duration);
          
          oscillator.start(startTime);
          oscillator.stop(startTime + note.duration);
          
          startTime += note.duration * 0.8; // 약간 겹치도록
        });
      } catch (error) {
        console.warn('Audio not supported:', error);
      }
    }
  };
};

// 게임 사운드 정의
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

// 프리미엄 심볼 시스템
const SYMBOLS = {
  low: ['🍒', '🍋', '🍊', '🍇'],      // 낮은 배당 (2-5배)
  medium: ['🔔', '⭐', '💎', '🎯'],   // 중간 배당 (5-15배)
  high: ['7️⃣', '🎰', '👑', '💰'],    // 높은 배당 (20-100배)
  special: ['🌟', '💥']               // 특수 심볼 (와일드, 스캐터)
};



// 심볼별 배당률
const SYMBOL_PAYOUTS = {
  '🍒': 2, '🍋': 3, '🍊': 3, '🍇': 4,
  '🔔': 5, '⭐': 8, '💎': 10, '🎯': 12,
  '7️⃣': 20, '🎰': 50, '👑': 75, '💰': 100,
  '🌟': 0, '💥': 0  // 특수 심볼
};

// 페이라인 정의 (3x3에서 가능한 승리 조합)
const PAYLINES = [
  [0, 1, 2], // 첫 번째 행
  [3, 4, 5], // 두 번째 행
  [6, 7, 8], // 세 번째 행
  [0, 3, 6], // 첫 번째 열
  [1, 4, 7], // 두 번째 열
  [2, 5, 8], // 세 번째 열
  [0, 4, 8], // 대각선 1
  [2, 4, 6]  // 대각선 2
];

// 가중치가 적용된 랜덤 심볼 생성
function getWeightedRandomSymbol(): string {
  const random = Math.random();
  if (random < 0.4) return SYMBOLS.low[Math.floor(Math.random() * SYMBOLS.low.length)];
  if (random < 0.7) return SYMBOLS.medium[Math.floor(Math.random() * SYMBOLS.medium.length)];
  if (random < 0.95) return SYMBOLS.high[Math.floor(Math.random() * SYMBOLS.high.length)];
  return SYMBOLS.special[Math.floor(Math.random() * SYMBOLS.special.length)];
}

function getRandomSymbols() {
  return Array(9) // 3x3 = 9개 심볼
    .fill(0)
    .map(() => getWeightedRandomSymbol());
}

function getRandomSymbol() {
  return getWeightedRandomSymbol();
}

// 승리 조합 체크 함수
function checkWinningCombinations(symbols: string[]) {
  const wins: Array<{
    line: number[];
    symbol: string;
    payout: number;
    multiplier: number;
  }> = [];

  PAYLINES.forEach((line) => {
    const [pos1, pos2, pos3] = line;
    const symbol1 = symbols[pos1];
    const symbol2 = symbols[pos2];
    const symbol3 = symbols[pos3];

    // 와일드 심볼(🌟) 처리
    const isWild = (sym: string) => sym === '🌟';
    
    if (symbol1 === symbol2 && symbol2 === symbol3 && !isWild(symbol1)) {
      // 일반 3개 일치
      wins.push({
        line,
        symbol: symbol1,
        payout: SYMBOL_PAYOUTS[symbol1 as keyof typeof SYMBOL_PAYOUTS] || 1,
        multiplier: 1
      });
    } else if (isWild(symbol1) || isWild(symbol2) || isWild(symbol3)) {
      // 와일드 포함 조합
      const nonWildSymbols = [symbol1, symbol2, symbol3].filter(s => !isWild(s));
      if (nonWildSymbols.length >= 2 && nonWildSymbols[0] === nonWildSymbols[1]) {
        wins.push({
          line,
          symbol: nonWildSymbols[0],
          payout: SYMBOL_PAYOUTS[nonWildSymbols[0] as keyof typeof SYMBOL_PAYOUTS] || 1,
          multiplier: 2 // 와일드 보너스
        });
      }
    }
  });

  return wins;
}

const SlotMachineBoard: React.FC = () => {
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

  // 튜토리얼 모달 상태
  const [showTutorial, setShowTutorial] = useState(false);
  const [showPaytable, setShowPaytable] = useState(false);
  
  // 3D 모드 토글
  const [is3DMode, setIs3DMode] = useState(false);
  
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
  }, [particles]);


  const handleSpin = () => {
    console.log('Spin clicked! Balance:', balance, 'Bet:', bet, 'Spinning:', spinning);
    if (spinning || balance < bet) {
      console.log('Spin blocked - already spinning or insufficient balance');
      return;
    }
    console.log('Starting spin...');
    if (soundOn) sounds.button.play();
    decreaseBalance(bet);
    setSpinning(true);
    setResult(null);
    setWinningLines([]);
    setTotalWin(0);
    setLottieType('spin');

    // 3x3 그리드 애니메이션 - 실시간 상태 업데이트
    let stopped = 0;
    const spinCounts = Array.from({length: 9}, (_, i) => 15 + i * 3); // 각 셀별로 다른 속도 (더 빠르게)
    if (soundOn) sounds.spin.play();

    function spinCell(cellIdx: number, count: number) {
      if (count === 0) {
        stopped++;
        if (stopped === 9) { // 9개 셀 모두 정지
          // 최종 심볼들로 결과 계산
          const finalReels = getRandomSymbols(); // 새로운 최종 결과
          setReels(finalReels);
          setSpinning(false);
          setLottieType(null); // 스핀 애니메이션 종료
          
          // 프리미엄 승리 조합 계산
          const wins = checkWinningCombinations(finalReels);
          let totalPayout = 0;
          let resultText = '';
          let newCombo = combo;

          if (wins.length > 0) {
            // 승리 라인들 처리
            const winLines = wins.map(w => w.line);
            setWinningLines(winLines);
            
            totalPayout = wins.reduce((sum, win) => sum + (bet * win.payout * win.multiplier), 0);
            setTotalWin(totalPayout);
            
            // 특수 결과 판정
            const megaWin = totalPayout >= bet * 50;
            const bigWin = totalPayout >= bet * 20;
            const hasSpecialSymbol = wins.some(w => w.symbol === '🌟' || w.symbol === '💥');
            
            if (megaWin || hasSpecialSymbol) {
              resultText = '🌟 MEGA WIN! 🌟';
              newCombo = combo + 3;
              if (soundOn) (Math.random() < 0.5 ? sounds.jackpot : sounds.jackpot2).play();
              setEffect('jackpot-glow');
              setLottieType('jackpot');
              // 🎆 메가윈 잭팟 레이저쇼
              particles.jackpot();
              setTimeout(() => particles.coinRain(totalPayout), 1000);
              setTimeout(() => setLottieType(null), 3000);
            } else if (bigWin) {
              resultText = '💰 BIG WIN! 💰';
              newCombo = combo + 2;
              if (soundOn) sounds.win.play();
              setEffect('win-glow');
              setLottieType('win');
              // 🎉 빅윈 폭죽 효과
              particles.celebrate('big');
              particles.coinRain(totalPayout);
              setTimeout(() => setLottieType(null), 2500);
            } else {
              resultText = `🎉 WIN x${wins.length}라인!`;
              setLottieType('celebration');
              newCombo = combo + 1;
              if (soundOn) sounds.win.play();
              setEffect('win-glow');
              // 🎊 일반 승리 효과
              setTimeout(() => setLottieType(null), 2000);
              particles.celebrate('small');
            }
            
            increaseBalance(totalPayout);
            
            // 점수 증가 이벤트 발생 (플로팅 효과용)
            window.dispatchEvent(new CustomEvent('scoreIncrease', {
              detail: { value: totalPayout, x: window.innerWidth / 2, y: window.innerHeight / 2 }
            }));
            
            // 💎 특수 심볼 효과
            if (hasSpecialSymbol) {
              wins.forEach(win => {
                if (win.symbol === '🌟') particles.special('wild');
                if (win.symbol === '💥') particles.special('scatter');
              });
              
              // 🎰 보너스 라운드 트리거 (특수 심볼 3개 이상)
              const specialCount = finalReels.filter(symbol => symbol === '🌟' || symbol === '💥').length;
              if (specialCount >= 3) {
                setTimeout(() => {
                  setLottieType('bonus');
                  setTimeout(() => setLottieType(null), 4000);
                }, 1500);
              }
            }
            
            // 🔥 콤보 효과
            if (newCombo > 1) {
              particles.combo(newCombo);
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
              particles.autoSpin(); // 🔥 오토스핀 트레일 효과
              handleSpin();
            }, 1500);
          }
        }
        return;
      }
      
      // 각 셀의 심볼을 실시간으로 변경 (스핀 애니메이션)
      setReels(prevReels => {
        const newReels = [...prevReels];
        newReels[cellIdx] = getRandomSymbol();
        return newReels;
      });
      
      // 다음 스핀 프레임
      setTimeout(() => spinCell(cellIdx, count - 1), 80 + (cellIdx % 3) * 15);
    }

    // 9개 셀 모두 시작
    for (let i = 0; i < 9; i++) {
      spinCell(i, spinCounts[i]);
    }
  };

  return (
    <>
      <TutorialModal open={showTutorial} onClose={() => setShowTutorial(false)} />
      <PaytableModal isOpen={showPaytable} onClose={() => setShowPaytable(false)} />
      <div className="flex flex-col items-center gap-3 sm:gap-4 w-full max-w-sm sm:max-w-md md:max-w-lg mx-auto px-2 sm:px-4">
        {/* 🎮 상단 컨트롤 패널 - 모바일 최적화 */}
        <div className="w-full flex flex-col sm:flex-row justify-between items-center gap-2 sm:gap-3 p-2 sm:p-3 bg-gradient-to-r from-indigo-900/80 to-purple-900/80 rounded-xl sm:rounded-2xl backdrop-blur-md shadow-xl border border-white/20">
          <div className="flex gap-2 sm:gap-3 w-full sm:w-auto justify-center sm:justify-start">
            <motion.button
              onClick={() => setShowPaytable(true)}
              className="px-2 sm:px-3 py-2 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-lg sm:rounded-xl font-semibold hover:from-amber-600 hover:to-orange-600 transition-all duration-300 shadow-lg flex items-center gap-1 sm:gap-2 text-xs sm:text-sm whitespace-nowrap min-h-[40px]"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <span>💰</span>
              <span>배당표</span>
            </motion.button>
            
            {/* 3D 모드 토글 - 모바일 최적화 */}
            <motion.button
              onClick={() => setIs3DMode(!is3DMode)}
              className={`
                px-2 sm:px-3 py-2 rounded-lg sm:rounded-xl font-semibold transition-all duration-300 shadow-lg flex items-center gap-1 sm:gap-2 text-xs sm:text-sm whitespace-nowrap min-h-[40px]
                ${is3DMode 
                  ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white ring-2 ring-purple-300' 
                  : 'bg-gradient-to-r from-slate-600 to-slate-700 text-white hover:from-slate-500 hover:to-slate-600'
                }
              `}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <span>{is3DMode ? '🌟' : '🎯'}</span>
              <span>{is3DMode ? '3D' : '2D'}</span>
            </motion.button>
          </div>
          
          <div className="w-full sm:w-auto flex justify-center">
            <SoundVibrationToggle />
          </div>
        </div>
        
        {/* 🎰 메인 게임 보드 - 모바일 최적화 */}
        <motion.div 
          className={`flex flex-col items-center gap-4 sm:gap-5 md:gap-6 p-4 sm:p-5 md:p-6 rounded-2xl sm:rounded-3xl shadow-2xl w-full transition-all duration-500 backdrop-blur-md
            ${effect === 'jackpot-glow' ? 'bg-gradient-to-br from-yellow-400/20 to-orange-500/20 ring-2 sm:ring-4 ring-yellow-400 animate-gradient-shift animate-glow-pulse border border-yellow-400/50' : 'bg-gradient-to-br from-slate-900/60 to-indigo-900/60 border border-white/20'}
            ${effect === 'win-glow' ? 'bg-gradient-to-br from-blue-400/20 to-cyan-500/20 ring-2 ring-blue-300 animate-shimmer border border-blue-400/50' : ''}
            ${effect === 'fail-shake' ? 'bg-gradient-to-br from-red-400/20 to-pink-500/20 animate-shake border border-red-400/50' : ''}
          `}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* 🎰 2D/3D 슬롯 그리드 조건부 렌더링 */}
          {is3DMode ? (
            /* 🌟 3D 슬롯머신 */
            <motion.div
              initial={{ opacity: 0, rotateY: -90 }}
              animate={{ opacity: 1, rotateY: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              <Slot3DContainer
                symbols={reels}
                isSpinning={spinning}
                winningLines={winningLines}
              />
            </motion.div>
          ) : (
            /* 🎯 2D Framer Motion 프리미엄 슬롯 그리드 - 모바일 최적화 */
            <motion.div 
              className="grid grid-cols-3 gap-2 sm:gap-3 p-3 sm:p-4 bg-black/30 rounded-xl sm:rounded-2xl backdrop-blur-sm border-2 border-gold/50"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
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
          {totalWin > 0 && !spinning && (
            <motion.div 
              className="w-full p-5 bg-gradient-to-r from-amber-400 via-yellow-500 to-orange-500 rounded-2xl shadow-2xl border-2 border-yellow-300/50 backdrop-blur-sm"
              initial={{ scale: 0, y: 30, opacity: 0 }}
              animate={{ 
                scale: 1, 
                y: 0, 
                opacity: 1,
                boxShadow: [
                  '0 10px 40px rgba(255, 215, 0, 0.4)',
                  '0 15px 60px rgba(255, 215, 0, 0.7)',
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
            >
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
          {/* 🎯 Framer Motion 스핀 버튼 */}
          <AnimatedSpinButton
            onClick={handleSpin}
            disabled={spinning || balance < bet}
            isSpinning={spinning}
          />
          
          {/* 🎉 Framer Motion 결과 표시 */}
          <AnimatedResult result={result} effect={effect} />

          {/* 🎨 프리미엄 Lottie 애니메이션 오버레이 개선 */}
          {lottieType && (
            <motion.div 
              className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-md"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
            >
              <motion.div
                className="relative p-8 rounded-3xl bg-gradient-to-br from-white/10 to-white/5 border border-white/20 shadow-2xl backdrop-blur-xl"
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

          {/* 💸 잔고 부족 알림 개선 */}
          {balance <= 0 && (
            <motion.div 
              className="w-full flex flex-col items-center gap-4 p-6 bg-gradient-to-r from-red-500/20 to-pink-500/20 border-2 border-red-400/50 rounded-2xl backdrop-blur-md shadow-xl"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
            >
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
      </div>
    </>
  );
};

export default SlotMachineBoard;
