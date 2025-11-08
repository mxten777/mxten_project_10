import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

interface PremiumSlotReelProps {
  finalSymbol: string;
  isSpinning: boolean;
  isWinning: boolean;
  symbolsPool?: string[];
  reelSize?: 'large' | 'mega' | 'rect' | 'premium' | 'mobile';
  anticipationMode?: boolean;
  reelIndex?: number;
}

const DEFAULT_SYMBOLS = ['1️⃣','2️⃣','3️⃣','4️⃣','5️⃣','6️⃣','7️⃣','8️⃣','9️⃣'];

export const PremiumSlotReel: React.FC<PremiumSlotReelProps> = ({
  finalSymbol,
  isSpinning,
  isWinning,
  symbolsPool = DEFAULT_SYMBOLS,
  reelSize = 'large',
  anticipationMode = false,
  reelIndex = 0
}) => {
  const [scrollSymbols, setScrollSymbols] = useState<string[]>([]);
  const [currentDisplaySymbol, setCurrentDisplaySymbol] = useState(finalSymbol);
  
  useEffect(() => {
    if (isSpinning) {
      // 프리미엄 스크롤 효과: 실제로 여러 숫자가 초고속으로 지나가는 연출
      const interval = setInterval(() => {
        setCurrentDisplaySymbol(symbolsPool[Math.floor(Math.random() * symbolsPool.length)]);
      }, 50); // 초고속 숫자 변화 (100ms → 50ms)
      
      setScrollSymbols([currentDisplaySymbol]);
      
      return () => clearInterval(interval);
    } else {
      setCurrentDisplaySymbol(finalSymbol);
      setScrollSymbols([finalSymbol]);
    }
  }, [isSpinning, finalSymbol, symbolsPool, currentDisplaySymbol]);

  // 프리미엄 릴 크기/스타일 동적 적용 - 모바일 최적화 포함
  let sizeClass = '';
  let fontClass = '';
  let boxClass = '';
  let containerClass = '';
  
  if (reelSize === 'mobile') {
    sizeClass = 'min-h-[120px] min-w-[85px] xs:min-h-[140px] xs:min-w-[100px] sm:min-h-[180px] sm:min-w-[130px] md:min-h-[220px] md:min-w-[160px] lg:min-h-[280px] lg:min-w-[200px] xl:min-h-[340px] xl:min-w-[240px] 2xl:min-h-[400px] 2xl:min-w-[280px] flex items-center justify-center overflow-hidden';
    // 모바일에서 폰트 크기 일관성 개선 - 더 작은 단계로 조정
    fontClass = 'text-xl xs:text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl 2xl:text-7xl';
    boxClass = 'w-[65px] h-[90px] xs:w-[75px] xs:h-[105px] sm:w-[100px] sm:h-[135px] md:w-[120px] md:h-[165px] lg:w-[150px] lg:h-[200px] xl:w-[180px] xl:h-[240px] 2xl:w-[220px] 2xl:h-[280px] rounded-[12px] sm:rounded-[16px] md:rounded-[20px] lg:rounded-[24px] flex items-center justify-center relative';
    containerClass = 'bg-gradient-to-br from-slate-900/95 via-blue-900/90 to-purple-900/85 border-2 sm:border-3 md:border-4 lg:border-[6px] border-yellow-400 shadow-[0_0_20px_10px_rgba(255,215,0,0.25)] sm:shadow-[0_0_40px_15px_rgba(255,215,0,0.25)] md:shadow-[0_0_60px_20px_rgba(255,215,0,0.25)] lg:shadow-[0_0_80px_30px_rgba(255,215,0,0.25)]';
  } else if (reelSize === 'premium') {
    sizeClass = 'min-h-[280px] min-w-[200px] md:min-h-[340px] md:min-w-[240px] lg:min-h-[400px] lg:min-w-[280px] flex items-center justify-center overflow-hidden';
    fontClass = 'text-8xl md:text-9xl lg:text-[10rem] xl:text-[12rem]';
    boxClass = 'w-[160px] h-[200px] md:w-[200px] md:h-[260px] lg:w-[240px] lg:h-[320px] rounded-[24px] flex items-center justify-center relative';
    containerClass = 'bg-gradient-to-br from-slate-900/95 via-blue-900/90 to-purple-900/85 border-[6px] border-yellow-400 shadow-[0_0_80px_30px_rgba(255,215,0,0.25)]';
  } else if (reelSize === 'rect') {
    sizeClass = 'min-h-[180px] min-w-[120px] sm:min-h-[240px] sm:min-w-[160px] md:min-h-[320px] md:min-w-[200px] lg:min-h-[380px] lg:min-w-[240px] flex items-center justify-center overflow-hidden';
    fontClass = 'text-6xl sm:text-7xl md:text-8xl lg:text-9xl';
    boxClass = 'w-[90px] h-[120px] sm:w-[120px] sm:h-[160px] md:w-[150px] md:h-[200px] lg:w-[180px] lg:h-[240px] rounded-[18px] flex items-center justify-center';
    containerClass = 'bg-gradient-to-br from-blue-900 via-slate-900 to-black border-[6px] border-yellow-400 shadow-[0_0_80px_30px_rgba(255,215,0,0.18)]';
  } else if (reelSize === 'mega') {
    sizeClass = 'min-h-[220px] min-w-[220px] sm:min-h-[280px] sm:min-w-[280px] md:min-h-[340px] md:min-w-[340px] lg:min-h-[400px] lg:min-w-[400px]';
    fontClass = 'text-7xl sm:text-8xl md:text-9xl lg:text-[8rem]';
    boxClass = 'w-[140px] h-[140px] sm:w-[180px] sm:h-[180px] md:w-[220px] md:h-[220px] lg:w-[260px] lg:h-[260px] rounded-[32px]';
    containerClass = 'bg-gradient-to-br from-blue-900 via-slate-900 to-black border-[6px] border-yellow-400 shadow-[0_0_80px_30px_rgba(255,215,0,0.18)]';
  } else {
    sizeClass = 'min-h-[160px] min-w-[160px] sm:min-h-[200px] sm:min-w-[200px] md:min-h-[240px] md:min-w-[240px] lg:min-h-[300px] lg:min-w-[300px]';
    fontClass = 'text-5xl sm:text-6xl md:text-7xl lg:text-8xl';
    boxClass = 'w-[120px] h-[120px] sm:w-[150px] sm:h-[150px] md:w-[180px] md:h-[180px] lg:w-[220px] lg:h-[220px] rounded-[24px]';
    containerClass = 'bg-gradient-to-br from-blue-900 via-slate-900 to-black border-[6px] border-yellow-400 shadow-[0_0_80px_30px_rgba(255,215,0,0.18)]';
  }
  // 반응형 라운드 처리
  const borderRadius = reelSize === 'mobile' 
    ? 'rounded-[16px] sm:rounded-[20px] md:rounded-[24px] lg:rounded-[28px] xl:rounded-[32px]'
    : 'rounded-[32px]';

  return (
    <div className={`relative w-full ${sizeClass} ${containerClass} ${borderRadius}`}>
      {/* 프리미엄 배경 효과 */}
      <div className={`absolute inset-0 bg-gradient-to-br from-transparent via-white/5 to-transparent ${borderRadius}`} />
      
      {/* 스핀 중 파티클 효과 - 모바일 최적화 */}
      {isSpinning && (
        <div className={`absolute inset-0 overflow-hidden ${borderRadius} pointer-events-none`}>
          {[...Array(reelSize === 'mobile' ? 4 : 6)].map((_, i) => (
            <motion.div
              key={i}
              className={`absolute ${reelSize === 'mobile' ? 'w-1 h-1 sm:w-2 sm:h-2' : 'w-2 h-2'} bg-yellow-400/60 rounded-full`}
              initial={{ 
                x: Math.random() * (reelSize === 'mobile' ? 85 : 200), 
                y: Math.random() * (reelSize === 'mobile' ? 120 : 300),
                scale: 0 
              }}
              animate={{ 
                y: [reelSize === 'mobile' ? 120 : 300, -20],
                scale: [0, 1, 0],
                opacity: [0, 1, 0]
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                delay: i * 0.2,
                ease: "easeOut"
              }}
            />
          ))}
        </div>
      )}
      
      <motion.div
        className="absolute w-full h-full flex flex-col items-center justify-center"
        style={{height: '100%', overflow: 'hidden'}}
        initial={{ y: 0 }}
        animate={isSpinning ? { 
          y: [-500, 0],
          rotateX: [0, 180, 360],
          // 스핀 중에도 스케일 고정하여 크기 일관성 유지
          scale: 1
        } : { 
          y: 0,
          rotateX: 0,
          // 승리 시에만 약간의 스케일 효과 (모바일에서는 더 작게)
          scale: isWinning ? (reelSize === 'mobile' ? [1, 1.05, 1] : [1, 1.1, 1]) : 1
        }}
        transition={{ 
          duration: isSpinning ? 0.6 : 0.3, // 애니메이션 속도 2배 빠르게 (1.2 → 0.6)
          ease: isSpinning ? 'easeInOut' : 'easeOut',
          scale: {
            duration: isWinning ? 2 : 0.3,
            repeat: isWinning ? Infinity : 0
          }
        }}
      >
        {scrollSymbols.map((sym, i) => (
          <motion.span
            key={`${sym}-${i}-${isSpinning}`}
            className={`flex items-center justify-center ${boxClass} ${fontClass} font-black vegas-font text-yellow-300 relative leading-none`}
            style={{
              background: isWinning && !isSpinning 
                ? 'linear-gradient(135deg, #ffd700 0%, #ffed4e 50%, #ff6b35 100%)'
                : anticipationMode && reelIndex === 2
                  ? 'linear-gradient(135deg, #ff6b35 0%, #f7931e 50%, #ffd700 100%)'
                  : 'linear-gradient(135deg, #60a5fa 0%, #3b82f6 50%, #1d4ed8 100%)',
              filter: isSpinning 
                ? 'brightness(0.8) blur(1px)' 
                : isWinning 
                  ? 'brightness(1.6) drop-shadow(0_0_60px_gold)' 
                  : anticipationMode && reelIndex === 2
                    ? 'brightness(1.4) drop-shadow(0_0_40px_orange)'
                    : 'brightness(1.3) drop-shadow(0_0_30px_rgba(59,130,246,0.8))',
              opacity: isSpinning ? 0.9 : 1,
              transition: 'all 0.3s ease-out',
              textShadow: isWinning 
                ? '0 0 50px gold, 0 0 100px #fff, 0 0 150px gold' 
                : anticipationMode && reelIndex === 2
                  ? '0 0 40px orange, 0 0 80px #fff'
                  : '0 0 30px rgba(59,130,246,0.8), 0 0 60px #fff',
              margin: 0,
              borderRadius: reelSize === 'mobile' 
                ? '12px' 
                : '24px',
              border: isWinning 
                ? (reelSize === 'mobile' ? '2px solid gold' : '3px solid gold')
                : anticipationMode && reelIndex === 2
                  ? (reelSize === 'mobile' ? '2px solid orange' : '3px solid orange')
                  : (reelSize === 'mobile' ? '1px solid rgba(59,130,246,0.6)' : '2px solid rgba(59,130,246,0.6)'),
              // 일관된 크기 적용 - 모든 상태에서 동일한 스케일 유지
              transform: reelSize === 'mobile' ? 'scale(1.0)' : 'scale(1.1)',
              lineHeight: '0.8' // 줄 간격 최소화로 숫자가 더 크게 보이게
            }}
            // 스케일 애니메이션 제거하여 크기 일관성 유지
            animate={anticipationMode && reelIndex === 2 ? {
              rotate: [0, 1, -1, 0],
              // scale 애니메이션 제거
            } : {}}
            transition={{
              duration: 0.8,
              repeat: anticipationMode && reelIndex === 2 ? Infinity : 0,
              ease: "easeInOut"
            }}
          >
            {/* 심볼 글로우 효과 */}
            <div className={`absolute inset-0 bg-gradient-to-br from-white/20 via-transparent to-black/10 ${reelSize === 'mobile' ? 'rounded-[12px]' : 'rounded-[24px]'} pointer-events-none`} />
            
            {isSpinning ? currentDisplaySymbol : sym}
            
            {/* 프리미엄 반짝임 효과 */}
            {!isSpinning && (
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -skew-x-12"
                initial={{ x: '-100%' }}
                animate={{ x: '200%' }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  repeatDelay: 1,
                  ease: "easeInOut"
                }}
              />
            )}
          </motion.span>
        ))}
      </motion.div>
      
      {/* 승리 효과 - 모바일 최적화 */}
      {isWinning && (
        <>
          <motion.div
            className={`absolute inset-0 ${borderRadius} bg-gradient-to-br from-yellow-400/40 via-orange-500/30 to-red-600/40 pointer-events-none`}
            animate={{ 
              opacity: [0, 0.8, 0.3, 0.8, 0],
              scale: [1, 1.05, 1]
            }}
            transition={{ duration: 2, repeat: Infinity }}
          />
          
          {/* 승리 파티클 - 모바일 최적화 */}
          <div className={`absolute inset-0 pointer-events-none overflow-hidden ${borderRadius}`}>
            {[...Array(reelSize === 'mobile' ? 8 : 12)].map((_, i) => (
              <motion.div
                key={`win-${i}`}
                className={`absolute ${reelSize === 'mobile' ? 'w-2 h-2' : 'w-3 h-3'} bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full`}
                initial={{
                  x: Math.random() * (reelSize === 'mobile' ? 85 : 280),
                  y: Math.random() * (reelSize === 'mobile' ? 120 : 400),
                  scale: 0
                }}
                animate={{
                  y: [reelSize === 'mobile' ? 120 : 400, -50],
                  x: [null, Math.random() * (reelSize === 'mobile' ? 85 : 280)],
                  scale: [0, 1, 0],
                  rotate: [0, 360]
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  delay: i * 0.1,
                  ease: "easeOut"
                }}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
};
