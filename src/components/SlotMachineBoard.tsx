import React, { useState, useEffect, useCallback } from 'react';
import { useAutoSpinStore } from '../stores/autoSpinStore';
import { useSoundVibrationStore } from '../stores/soundVibrationStore';
import { useGameStore } from '../stores/gameStore';
import { useBalanceStore } from '../stores/balanceStore';
import { getRandomSymbol, SYMBOL_PAYOUTS } from '../utils/slotConstants';
import { playEffect } from '../utils/gameAudio';
import SoundVibrationToggle from './SoundVibrationToggle';
import AutoSpinToggle from './AutoSpinToggle';

const SlotMachineBoard: React.FC = () => {
  const { autoSpin, setAutoSpin } = useAutoSpinStore();
  const { combo, setCombo } = useGameStore();
  const { soundOn } = useSoundVibrationStore();
  const { bet, balance, decreaseBalance, increaseBalance } = useBalanceStore();
  
  const [reels, setReels] = useState<string[]>([getRandomSymbol(), getRandomSymbol(), getRandomSymbol()]);
  const [spinning, setSpinning] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [totalWin, setTotalWin] = useState(0);
  const [winningLine, setWinningLine] = useState<boolean[]>([false, false, false]);
  const [showWinParticles, setShowWinParticles] = useState(false);
  const [showMegaWin, setShowMegaWin] = useState(false);
  const [showFireworks, setShowFireworks] = useState(false);
  const [showRainbow, setShowRainbow] = useState(false);

  const processSpinResult = useCallback((finalReels: string[], currentCombo: number, betAmount: number) => {
    const isWin = finalReels[0] === finalReels[1] && finalReels[1] === finalReels[2];
    
    if (isWin) {
      const payout = betAmount * (SYMBOL_PAYOUTS[finalReels[0]] || 1);
      const resultText = finalReels[0] === '7️⃣' ? '🎉 777 JACKPOT!' : `${finalReels[0]} WIN!`;
      
      increaseBalance(payout);
      setCombo(currentCombo + 1);
      setResult(resultText);
      setTotalWin(payout);
      setWinningLine([true, true, true]);
      setShowWinParticles(true);
      setShowMegaWin(true);
      setShowFireworks(true);
      setShowRainbow(true);
      
      // 다양한 효과들 자동 제거 (시간차 두어 더 오래 지속)
      setTimeout(() => setShowWinParticles(false), 5000);
      setTimeout(() => setShowMegaWin(false), 6000);
      setTimeout(() => setShowFireworks(false), 7000);
      setTimeout(() => setShowRainbow(false), 4000);
      
      if (soundOn) playEffect(finalReels[0] === '7️⃣' ? 'jackpot' : 'win');
    } else {
      setResult('꽝!');
      setTotalWin(0);
      setCombo(0);
      setWinningLine([false, false, false]);
      setShowWinParticles(false);
      setShowMegaWin(false);
      setShowFireworks(false);
      setShowRainbow(false);
      if (soundOn) playEffect('fail');
    }
  }, [soundOn, increaseBalance, setCombo]);

  const handleSpin = useCallback(() => {
    if (spinning || balance < bet) {
      if (autoSpin && balance < bet) setAutoSpin(false);
      return;
    }
    
    setSpinning(true);
    setResult(null);
    setTotalWin(0);
    setWinningLine([false, false, false]);
    setShowWinParticles(false);
    setShowMegaWin(false);
    setShowFireworks(false);
    setShowRainbow(false);
    decreaseBalance(bet);
    
    if (soundOn) playEffect('spin');
    
    // 10% 확률로 당첨
    const isWinning = Math.random() < 0.1;
    const winSymbol = getRandomSymbol();
    
    // 스핀 애니메이션 중 빠른 릴 변화
    const spinInterval = setInterval(() => {
      setReels([getRandomSymbol(), getRandomSymbol(), getRandomSymbol()]);
    }, 80);
    
    // 스핀 완료
    setTimeout(() => {
      clearInterval(spinInterval);
      
      const finalReels = isWinning 
        ? [winSymbol, winSymbol, winSymbol]
        : [getRandomSymbol(), getRandomSymbol(), getRandomSymbol()];
      
      setReels(finalReels);
      setSpinning(false);
      
      // 릴이 완전히 정지한 후 적절한 대기 시간으로 결과 표시
      setTimeout(() => {
        processSpinResult(finalReels, combo, bet);
      }, 1200); // 단일 타이머로 1.2초 대기
    }, 2000);
  }, [spinning, balance, bet, autoSpin, setAutoSpin, soundOn, combo, decreaseBalance, processSpinResult]);

  // 오토스핀 로직 (초기 시작)
  useEffect(() => {
    if (autoSpin && !spinning && balance >= bet) {
      const timer = setTimeout(() => {
        handleSpin();
      }, result === null ? 800 : 100); // 초기는 0.8초, 이후는 0.1초 대기
      return () => clearTimeout(timer);
    }
  }, [autoSpin, spinning, balance, bet, result, handleSpin]);

  useEffect(() => {
    if (autoSpin && !spinning && result !== null && balance >= bet) {
      // 결과 확인 시간을 충분히 제공 (승리시 더 길게 감상 시간 제공)
      const delayTime = totalWin > 0 ? 6000 : 2500; // 승리시 6초, 패배시 2.5초 대기
      const timer = setTimeout(() => {
        handleSpin();
      }, delayTime);
      return () => clearTimeout(timer);
    }
  }, [autoSpin, spinning, result, balance, bet, totalWin, handleSpin]);

  return (
    <div className="flex flex-col items-center gap-6 sm:gap-8 md:gap-10 w-full max-w-4xl mx-auto px-4 sm:px-6 md:px-8">
      {/* 컨트롤 패널 */}
      <div className="w-full max-w-2xl flex justify-center items-center gap-6 sm:gap-8 p-6 sm:p-8 md:p-10 bg-gradient-to-r from-slate-800 to-purple-800 rounded-2xl shadow-2xl border-2 border-purple-400/30">
        <SoundVibrationToggle />
        <AutoSpinToggle />
      </div>

      {/* 라스베가스 스타일 슬롯 머신 */}
      <div className="w-full flex justify-center">
        <div className="p-10 sm:p-14 md:p-16 lg:p-20 bg-gradient-to-br from-yellow-600 via-red-800 to-purple-900 rounded-3xl shadow-2xl border-4 border-yellow-400 relative overflow-hidden max-w-5xl w-full">
          {/* 네온 글로우 효과 */}
          <div className="absolute inset-0 bg-gradient-to-br from-yellow-400/20 via-red-400/20 to-purple-400/20 rounded-3xl animate-pulse" />
          <div className="absolute inset-2 border-2 border-yellow-300/50 rounded-2xl animate-ping opacity-60" />
          <div className="relative z-10 flex items-center justify-center gap-8 sm:gap-12 md:gap-16 lg:gap-20">
            {reels.map((symbol, i) => (
              <div
                key={i}
                className={`w-40 h-56 sm:w-48 sm:h-64 md:w-56 md:h-72 lg:w-64 lg:h-80 xl:w-72 xl:h-88 bg-gradient-to-br from-black via-gray-900 to-black rounded-2xl border-4 flex items-center justify-center text-7xl sm:text-8xl md:text-9xl lg:text-[8rem] xl:text-[9rem] transition-all duration-500 relative overflow-hidden shadow-2xl ${
                  spinning 
                    ? 'border-cyan-400 shadow-xl shadow-cyan-400/60 scale-110 animate-pulse' 
                    : 'border-yellow-400/60'
                } ${
                  winningLine[i] && !spinning 
                    ? 'border-yellow-300 shadow-2xl shadow-yellow-300/80 animate-bounce bg-gradient-to-br from-yellow-500/30 to-orange-500/30 scale-125' 
                    : ''
                }`}
              >
                {/* 내부 네온 글로우 */}
                <div className="absolute inset-1 bg-gradient-to-br from-yellow-400/10 to-red-400/10 rounded-xl" />
                
                <div className={`relative z-10 font-bold drop-shadow-2xl ${
                  spinning ? 'animate-spin text-cyan-300' : 'text-yellow-200'
                } ${
                  winningLine[i] ? 'animate-pulse text-yellow-100 drop-shadow-[0_0_20px_rgba(255,255,0,0.8)]' : ''
                }`}>
                  {symbol}
                </div>
                
                {/* 승리 시 강력한 발광 효과 */}
                {winningLine[i] && !spinning && (
                  <>
                    <div className="absolute inset-0 bg-gradient-to-r from-yellow-400/40 to-orange-400/40 rounded-2xl animate-pulse" />
                    <div className="absolute inset-0 border-4 border-yellow-300 rounded-2xl animate-ping" />
                    <div className="absolute -inset-2 border-2 border-yellow-400/50 rounded-3xl animate-ping" style={{animationDelay: '150ms'}} />
                  </>
                )}
                
                {/* 스핀 중 사이버펑크 효과 */}
                {spinning && (
                  <>
                    <div className="absolute inset-0 border-4 border-cyan-400 rounded-2xl animate-ping opacity-75" />
                    <div className="absolute -inset-1 border-2 border-blue-400/50 rounded-2xl animate-ping" style={{animationDelay: '75ms'}} />
                    <div className="absolute inset-0 bg-gradient-to-tr from-cyan-400/20 to-blue-400/20 rounded-2xl animate-pulse" />
                  </>
                )}
              </div>
            ))}
          </div>

          {/* 라스베가스 스타일 스핀 버튼 */}
          {!autoSpin && (
            <button
              className={`relative z-10 mt-10 sm:mt-12 md:mt-14 px-16 py-8 text-3xl sm:text-4xl md:text-5xl font-black rounded-2xl transition-all duration-300 w-full border-4 overflow-hidden ${
                balance < bet 
                  ? 'bg-gray-700 text-gray-400 cursor-not-allowed border-gray-600'
                  : 'bg-gradient-to-r from-red-600 via-yellow-500 to-red-600 text-white hover:from-red-700 hover:via-yellow-400 hover:to-red-700 active:scale-95 shadow-2xl border-yellow-400 hover:shadow-yellow-400/50'
              }`}
              onClick={handleSpin}
              disabled={balance < bet || spinning}
            >
              {/* 버튼 글로우 효과 */}
              {balance >= bet && !spinning && (
                <div className="absolute inset-0 bg-gradient-to-r from-yellow-400/20 to-red-400/20 animate-pulse" />
              )}
              <span className="relative z-10 drop-shadow-lg">
                {spinning ? '🎰 SPINNING...' : '🎰 SPIN TO WIN!'}
              </span>
            </button>
          )}
        </div>
      </div>

      {/* 무지개 효과 */}
      {showRainbow && (
        <div className="fixed inset-0 pointer-events-none z-40">
          <div className="absolute inset-0 bg-gradient-to-r from-red-500/20 via-yellow-500/20 via-green-500/20 via-blue-500/20 via-indigo-500/20 to-purple-500/20 animate-pulse" />
          <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-red-500 via-yellow-500 via-green-500 via-blue-500 via-indigo-500 to-purple-500 animate-bounce" />
          <div className="absolute bottom-0 left-0 w-full h-2 bg-gradient-to-r from-purple-500 via-indigo-500 via-blue-500 via-green-500 via-yellow-500 to-red-500 animate-bounce" />
        </div>
      )}

      {/* 대형 폭죽 효과 */}
      {showFireworks && (
        <div className="fixed inset-0 pointer-events-none z-50">
          {/* 중앙 대형 폭죽 */}
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
            {[...Array(50)].map((_, i) => {
              const colors = ['bg-red-400', 'bg-yellow-400', 'bg-green-400', 'bg-blue-400', 'bg-purple-400', 'bg-pink-400', 'bg-orange-400'];
              const randomColor = colors[Math.floor(Math.random() * colors.length)];
              const size = Math.random() > 0.7 ? 'w-4 h-4' : 'w-2 h-2';
              return (
                <div
                  key={i}
                  className={`absolute ${size} ${randomColor} rounded-full animate-ping`}
                  style={{
                    left: `${Math.random() * 400 - 200}px`,
                    top: `${Math.random() * 400 - 200}px`,
                    animationDelay: `${Math.random() * 3}s`,
                    animationDuration: `${1 + Math.random() * 2}s`
                  }}
                />
              );
            })}
          </div>
          
          {/* 모서리 폭죽들 */}
          {[...Array(4)].map((_, cornerIndex) => {
            const positions = [
              { top: '10%', left: '10%' },
              { top: '10%', right: '10%' },
              { bottom: '10%', left: '10%' },
              { bottom: '10%', right: '10%' }
            ];
            return (
              <div
                key={cornerIndex}
                className="absolute"
                style={positions[cornerIndex]}
              >
                {[...Array(15)].map((_, i) => {
                  const colors = ['bg-yellow-300', 'bg-orange-400', 'bg-red-400', 'bg-pink-400'];
                  const randomColor = colors[Math.floor(Math.random() * colors.length)];
                  return (
                    <div
                      key={i}
                      className={`absolute w-3 h-3 ${randomColor} rounded-full animate-ping`}
                      style={{
                        left: `${Math.random() * 100 - 50}px`,
                        top: `${Math.random() * 100 - 50}px`,
                        animationDelay: `${Math.random() * 2}s`,
                        animationDuration: `${0.8 + Math.random()}s`
                      }}
                    />
                  );
                })}
              </div>
            );
          })}
        </div>
      )}

      {/* 메가 승리 표시 */}
      {showMegaWin && (
        <div className="fixed inset-0 pointer-events-none z-60 flex items-center justify-center">
          <div className="text-center animate-bounce">
            <div className="text-8xl sm:text-9xl md:text-[12rem] font-black bg-gradient-to-r from-yellow-300 via-red-500 to-purple-600 bg-clip-text text-transparent animate-pulse drop-shadow-2xl mb-4">
              🎆 MEGA WIN! 🎆
            </div>
            <div className="text-4xl sm:text-5xl md:text-6xl font-black text-white animate-ping drop-shadow-xl">
              🎉 JACKPOT WINNER! 🎉
            </div>
          </div>
        </div>
      )}

      {/* 기본 파티클 효과 (추가 레이어) */}
      {showWinParticles && (
        <div className="fixed inset-0 pointer-events-none z-45">
          <div className="absolute inset-0">
            {[...Array(100)].map((_, i) => {
              const emojis = ['🎉', '🎊', '✨', '💫', '🎆', '🎇', '💎', '👑'];
              const randomEmoji = emojis[Math.floor(Math.random() * emojis.length)];
              return (
                <div
                  key={i}
                  className="absolute text-2xl animate-bounce"
                  style={{
                    left: `${Math.random() * 100}%`,
                    top: `${Math.random() * 100}%`,
                    animationDelay: `${Math.random() * 4}s`,
                    animationDuration: `${2 + Math.random() * 3}s`
                  }}
                >
                  {randomEmoji}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 라스베가스 스타일 결과 표시 */}
      {result && (
        <div className={`relative w-full max-w-3xl mx-auto p-10 sm:p-12 md:p-14 rounded-3xl text-center font-black shadow-2xl transform transition-all duration-500 border-4 overflow-hidden ${
          totalWin > 0 
            ? 'bg-gradient-to-r from-yellow-500 via-orange-500 to-red-500 text-white scale-110 animate-pulse border-yellow-300 shadow-yellow-400/50'
            : 'bg-gradient-to-r from-red-700 to-gray-800 text-white border-red-400'
        }`}>
          {/* 승리 시 강력한 글로우 효과 */}
          {totalWin > 0 && (
            <>
              <div className="absolute inset-0 bg-gradient-to-r from-yellow-400/30 to-orange-400/30 animate-pulse" />
              <div className="absolute inset-1 border-2 border-yellow-200/50 rounded-xl animate-ping" />
            </>
          )}
          
          <div className={`relative z-10 text-3xl sm:text-4xl md:text-5xl lg:text-6xl mb-4 drop-shadow-2xl font-black ${
            totalWin > 0 ? 'animate-bounce text-yellow-100' : 'text-red-200'
          }`}>{result}</div>
          
          {totalWin > 0 && (
            <div className="relative z-10 mb-3">
              <div className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black animate-pulse drop-shadow-lg text-yellow-100 mb-2">
                💰 +{totalWin.toLocaleString()} COINS
              </div>
              <div className="text-lg sm:text-xl md:text-2xl text-yellow-200 animate-bounce">
                🎉 BIG WIN! 🎉
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SlotMachineBoard;