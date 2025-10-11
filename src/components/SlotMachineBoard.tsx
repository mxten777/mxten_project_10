import React, { useState, useEffect } from 'react';
import TutorialModal from './TutorialModal';
import SoundVibrationToggle from './SoundVibrationToggle';
import { useSoundVibrationStore } from '../stores/soundVibrationStore';
import { useGameStore } from '../stores/gameStore';
import { useAuthStore } from '../stores/authStore';
import { useBalanceStore } from '../stores/balanceStore';
import { useAutoSpinStore } from '../stores/autoSpinStore';
import { saveGameRun } from '../utils/firestoreGame';
import { Howl } from 'howler';
// 사운드 객체 준비
const sounds = {
  spin: new Howl({ src: ['/src/assets/sounds/spin-232536.mp3'] }),
  button: new Howl({ src: ['/src/assets/sounds/button-press-382713.mp3'] }),
  win: new Howl({ src: ['/src/assets/sounds/pop-win-casino-winning-398059.mp3'] }),
  jackpot: new Howl({ src: ['/src/assets/sounds/jackpot.mp3'] }),
  jackpot2: new Howl({ src: ['/src/assets/sounds/playful-casino-slot-machine-jackpot-3-183921.mp3'] }),
  fail: new Howl({ src: ['/src/assets/sounds/sword-slash-and-swing-185432.mp3'] }),
};

const SYMBOLS = ['🍒', '🍋', '🔔', '⭐', '7️⃣'];
const REEL_COUNT = 3;

function getRandomSymbols() {
  return Array(REEL_COUNT)
    .fill(0)
    .map(() => SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)]);
}

function getRandomSymbol() {
  return SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)];
}

const SlotMachineBoard: React.FC = () => {
  const { score, setScore, combo, setCombo } = useGameStore();
  // 사운드/진동 상태
  const { soundOn } = useSoundVibrationStore();
  const { uid } = useAuthStore();
  const { bet, balance, decreaseBalance, increaseBalance, setBalance } = useBalanceStore();
  const { autoSpin } = useAutoSpinStore();


  const [reels, setReels] = useState<string[]>(getRandomSymbols());
  const [spinning, setSpinning] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [effect, setEffect] = useState<string>('');

  // 튜토리얼 모달 상태
  const [showTutorial, setShowTutorial] = useState(false);
  useEffect(() => {
    if (!localStorage.getItem('tutorialShown')) {
      setShowTutorial(true);
      localStorage.setItem('tutorialShown', '1');
    }
  }, []);


  const handleSpin = () => {
    if (spinning || balance < bet) return;
    if (soundOn) sounds.button.play();
    decreaseBalance(bet); // 스핀 시 베팅만큼 차감
    setSpinning(true);
    setResult(null);

    // 릴별 애니메이션 상태
    let current = [...reels];
    let stopped = 0;
    const spinCounts = [20, 30, 40]; // 릴별로 다르게 멈춤
    if (soundOn) sounds.spin.play();

  function spinReel(reelIdx: number, count: number) {
      if (count === 0) {
        stopped++;
        if (stopped === REEL_COUNT) {
          setSpinning(false);
          // 결과 계산
          const final = current;
          let resultText = '';
          let addScore = 0;
          let newCombo = combo;
          if (final.every((s) => s === final[0])) {
            resultText = 'JACKPOT!';
            addScore = bet * 10; // JACKPOT 배당
            newCombo = combo + 1;
            if (soundOn) (Math.random() < 0.5 ? sounds.jackpot : sounds.jackpot2).play();
            increaseBalance(addScore);
            setEffect('jackpot-glow');
          } else if (new Set(final).size === 2) {
            resultText = '2개 일치!';
            addScore = bet * 2; // 2개 일치 배당
            newCombo = combo + 1;
            if (soundOn) sounds.win.play();
            increaseBalance(addScore);
            setEffect('win-glow');
          } else {
            resultText = '꽝!';
            newCombo = 1;
            if (soundOn) sounds.fail.play();
            setEffect('fail-shake');
            // 꽝은 배당 없음
          }
          setResult(resultText);
          setTimeout(() => setEffect(''), 1200);
          setScore(score + addScore);
          setCombo(newCombo);
          // Firestore 기록 저장 (로그인 상태에서만)
          if (uid) {
            (async () => {
              await saveGameRun({
                uid,
                score: score + addScore,
                ballsUsed: 1,
                combos: newCombo,
                createdAt: new Date(),
              });
            })();
          }
          // 오토스핀: 스핀 종료 후 자동 재시작 (잔고 충분, 오토스핀 활성화, 스핀 중 아님)
          if (autoSpin && balance >= bet) {
            setTimeout(() => handleSpin(), 600); // 0.6초 후 자동 스핀
          }
        }
        return;
      }
      // 릴 심볼 변경
      current[reelIdx] = getRandomSymbol();
      setReels([...current]);
      setTimeout(() => spinReel(reelIdx, count - 1), 60 + reelIdx * 30); // 릴별 속도 차이
    }

    for (let i = 0; i < REEL_COUNT; i++) {
      spinReel(i, spinCounts[i]);
    }
  };

  return (
    <>
      <TutorialModal open={showTutorial} onClose={() => setShowTutorial(false)} />
      <div className="flex flex-col items-center gap-2 w-full max-w-md mx-auto">
        <div className="w-full flex justify-end mb-2">
          <SoundVibrationToggle />
        </div>
        <div className={`flex flex-col items-center gap-4 p-6 rounded-xl shadow-2xl w-full transition-all duration-500 card-hover glass-effect
          ${effect === 'jackpot-glow' ? 'ring-4 ring-yellow-400 animate-gradient-shift animate-glow-pulse' : 'bg-gradient-to-br from-green-100 to-emerald-200 dark:from-gray-800 dark:to-gray-700'}
          ${effect === 'win-glow' ? 'ring-2 ring-blue-300 bg-gradient-to-br from-blue-50 to-cyan-100 animate-shimmer' : ''}
          ${effect === 'fail-shake' ? 'bg-gradient-to-br from-red-100 to-pink-200 animate-shake' : ''}
        `}>
          <div className="flex gap-6 text-7xl font-mono justify-center">
            {reels.map((symbol, i) => (
              <div key={i} className={`p-3 rounded-lg bg-white/20 backdrop-blur-sm border border-white/30 shadow-lg transform transition-all duration-300 ${spinning ? 'animate-spin' : 'hover:scale-110'}`}>
                <span className={`block ${effect === 'jackpot-glow' ? 'neon-text text-yellow-400' : ''} ${effect === 'win-glow' ? 'neon-text text-blue-400' : ''}`}>
                  {symbol}
                </span>
              </div>
            ))}
          </div>
          <button
            className="mt-6 px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white rounded-xl text-xl font-bold disabled:opacity-50 flex items-center gap-3 active:animate-btn-press transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 relative overflow-hidden"
            onClick={handleSpin}
            disabled={spinning || balance < bet}
            aria-label="Spin"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer"></div>
            <span role="img" aria-label="slot" className="text-2xl">🎰</span>
            <span className="relative z-10">{spinning ? '스핀 중...' : 'SPIN!'}</span>
          </button>
          {result && (
            <div className={`mt-4 px-6 py-3 rounded-xl text-2xl font-bold shadow-lg transform transition-all duration-500 ${
              result === 'JACKPOT!' ? 'bg-gradient-to-r from-yellow-400 to-orange-500 text-white animate-float-up neon-text' :
              result === '2개 일치!' ? 'bg-gradient-to-r from-blue-400 to-cyan-500 text-white animate-bounce' :
              'bg-gradient-to-r from-gray-400 to-gray-600 text-white'
            }`}>
              {result}
            </div>
          )}

          {balance <= 0 && (
            <div className="mt-4 flex flex-col items-center gap-2 p-4 bg-red-50 border border-red-300 rounded-lg animate-pulse">
              <div className="text-red-600 font-bold text-lg">잔고가 0원입니다!</div>
              <button
                className="px-4 py-2 bg-green-500 text-white rounded-lg font-bold hover:bg-green-600 transition"
                onClick={() => setBalance(10000)}
              >
                잔고 10,000원으로 재시작
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default SlotMachineBoard;
