import React, { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface UltraPremiumSlotReelProps {
  finalSymbol: string;
  isSpinning: boolean;
  isWinning: boolean;
  symbolsPool?: string[];
  reelIndex?: number;
  anticipationMode?: boolean;
}

const DEFAULT_SYMBOLS = ['1️⃣','2️⃣','3️⃣','4️⃣','5️⃣','6️⃣','7️⃣','8️⃣','9️⃣'];

export const UltraPremiumSlotReel: React.FC<UltraPremiumSlotReelProps> = ({
  finalSymbol,
  isSpinning,
  isWinning,
  symbolsPool = DEFAULT_SYMBOLS,
  reelIndex = 0,
  anticipationMode = false
}) => {
  const [currentSymbol, setCurrentSymbol] = useState(finalSymbol);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const [isReady, setIsReady] = useState(false);

  // 스핀 로직 - 완전히 새로운 방식
  useEffect(() => {
    if (isSpinning) {
      setIsReady(false);
      let currentSpeed = 30; // 매우 빠른 시작
      
      const spin = () => {
        setCurrentSymbol(symbolsPool[Math.floor(Math.random() * symbolsPool.length)]);
        
        // 점진적 속도 감소로 자연스러운 정지
        currentSpeed = Math.min(currentSpeed + 5, 150);
        
        intervalRef.current = setTimeout(spin, currentSpeed);
      };
      
      spin();
      
      return () => {
        if (intervalRef.current) {
          clearTimeout(intervalRef.current);
        }
      };
    } else {
      // 스핀 정지 시 최종 심볼 설정
      if (intervalRef.current) {
        clearTimeout(intervalRef.current);
      }
      
      setTimeout(() => {
        setCurrentSymbol(finalSymbol);
        setIsReady(true);
      }, 100);
    }
  }, [isSpinning, finalSymbol, symbolsPool]);

  // 모바일 감지
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;

  return (
    <div className="relative w-full h-full flex items-center justify-center overflow-hidden">
      {/* 배경 컨테이너 - 완전히 새로운 디자인 */}
      <motion.div
        className="relative w-full h-full flex items-center justify-center"
        style={{
          background: isWinning && !isSpinning 
            ? 'linear-gradient(145deg, #ffd700 0%, #ffed4e 30%, #ff8c00 70%, #ff6b35 100%)'
            : anticipationMode && reelIndex === 2
              ? 'linear-gradient(145deg, #ff6b35 0%, #ff8c00 30%, #ffd700 70%, #ffed4e 100%)'
              : 'linear-gradient(145deg, #1e40af 0%, #3b82f6 30%, #60a5fa 70%, #93c5fd 100%)',
          borderRadius: isMobile ? '16px' : '24px',
          border: isWinning 
            ? `${isMobile ? '4px' : '6px'} solid #ffd700`
            : anticipationMode && reelIndex === 2
              ? `${isMobile ? '3px' : '4px'} solid #ff8c00`
              : `${isMobile ? '2px' : '3px'} solid #60a5fa`,
          boxShadow: isWinning
            ? `0 0 ${isMobile ? '50px' : '80px'} rgba(255, 215, 0, 0.8), inset 0 0 ${isMobile ? '30px' : '50px'} rgba(255, 255, 255, 0.3)`
            : anticipationMode && reelIndex === 2
              ? `0 0 ${isMobile ? '25px' : '40px'} rgba(255, 140, 0, 0.5), inset 0 0 ${isMobile ? '15px' : '25px'} rgba(255, 255, 255, 0.2)`
              : `0 0 ${isMobile ? '20px' : '30px'} rgba(96, 165, 250, 0.4), inset 0 0 ${isMobile ? '10px' : '20px'} rgba(255, 255, 255, 0.1)`,
          transition: 'all 0.2s ease-out'
        }}
        animate={
          isWinning && !isSpinning ? {
            // 승리 시 강력한 동시 움직임
            rotate: [0, -2, 2, -1, 1, 0],
            scale: [1, 1.15, 1.05, 1.12, 1.08, 1.1],
            y: [0, -8, 4, -6, 2, 0],
            boxShadow: [
              `0 0 50px rgba(255, 215, 0, 0.8)`,
              `0 0 100px rgba(255, 215, 0, 1.0)`,
              `0 0 80px rgba(255, 215, 0, 0.9)`,
              `0 0 120px rgba(255, 215, 0, 1.0)`,
              `0 0 90px rgba(255, 215, 0, 0.8)`
            ]
          } : anticipationMode && reelIndex === 2 ? {
            rotate: [0, 0.5, -0.5, 0],
            scale: [1, 1.02, 1]
          } : {}
        }
        transition={{
          duration: isWinning && !isSpinning ? 2.5 : 0.8,
          repeat: isWinning && !isSpinning ? Infinity : (anticipationMode && reelIndex === 2 ? Infinity : 0),
          ease: isWinning && !isSpinning ? "easeInOut" : "easeInOut",
          repeatType: isWinning && !isSpinning ? "reverse" : "loop"
        }}
      >
        {/* 글래스 효과 */}
        <div 
          className="absolute inset-0 bg-gradient-to-br from-white/20 via-transparent to-black/10 pointer-events-none"
          style={{ borderRadius: isMobile ? '16px' : '24px' }}
        />
        
        {/* 스핀 중 블러 효과 */}
        {isSpinning && (
          <div 
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-pulse"
            style={{ borderRadius: isMobile ? '16px' : '24px' }}
          />
        )}

        {/* 메인 숫자 표시 - 완전 새로운 방식 */}
        <AnimatePresence mode="wait">
          <motion.div
            key={`${currentSymbol}-${isSpinning}-${isReady}`}
            className="flex items-center justify-center w-full h-full relative"
            initial={{ 
              opacity: 0, 
              scale: 0.5,
              rotateY: -90
            }}
            animate={{ 
              opacity: 1, 
              scale: 1,
              rotateY: 0
            }}
            exit={{ 
              opacity: 0, 
              scale: 0.5,
              rotateY: 90
            }}
            transition={{ 
              duration: isSpinning ? 0.1 : 0.3,
              ease: "easeOut"
            }}
          >
            <motion.span
              className="ultra-premium-number text-white relative z-10"
              style={{
                // 숫자 크기를 극대화 - 카드 전체를 거의 채우는 수준
                fontSize: 'clamp(3rem, 20vw, 10rem)', 
                textShadow: isWinning && !isSpinning
                  ? '0 0 40px #ffd700, 0 0 80px #fff, 0 0 120px #ffd700, 0 0 160px #ffd700'
                  : anticipationMode && reelIndex === 2
                    ? '0 0 25px #ff8c00, 0 0 50px #fff'
                    : '0 0 20px rgba(96, 165, 250, 0.8), 0 0 40px #fff',
                filter: isSpinning 
                  ? 'blur(0.5px) brightness(0.9)' 
                  : isWinning && !isSpinning
                    ? 'brightness(1.6) saturate(1.3)'
                    : 'brightness(1.4)',
                transition: 'all 0.15s ease-out',
                fontWeight: '900',
                width: '100%',
                height: '100%',
                // 카드 영역을 극한까지 활용
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                lineHeight: '0.6', // 더 조밀하게
                letterSpacing: '-0.05em', // 글자 간격 더 좁게
                margin: '-5px', // 네거티브 마진으로 공간 확보
                padding: '0'
              }}
              animate={
                isWinning && !isSpinning ? {
                  // 숫자 자체도 강력하게 움직임
                  scale: [1.3, 1.45, 1.35, 1.42, 1.38, 1.4],
                  rotate: [0, -1, 1, -0.5, 0.5, 0],
                  textShadow: [
                    '0 0 40px #ffd700, 0 0 80px #fff, 0 0 120px #ffd700',
                    '0 0 60px #ffd700, 0 0 120px #fff, 0 0 180px #ffd700',
                    '0 0 50px #ffd700, 0 0 100px #fff, 0 0 150px #ffd700',
                    '0 0 70px #ffd700, 0 0 140px #fff, 0 0 200px #ffd700'
                  ]
                } : {
                  scale: 1.3
                }
              }
              transition={{
                duration: isWinning && !isSpinning ? 2 : 0.3,
                repeat: isWinning && !isSpinning ? Infinity : 0,
                ease: "easeInOut",
                repeatType: "reverse"
              }}
            >
              {/* 이모지에서 숫자만 추출하고 일관성 유지 */}
              {currentSymbol.replace('️⃣', '')}
            </motion.span>
            
            {/* 숫자 주변 글로우 */}
            <div 
              className="absolute inset-0 flex items-center justify-center pointer-events-none"
              style={{
                background: isWinning && !isSpinning
                  ? 'radial-gradient(circle, rgba(255, 215, 0, 0.3) 0%, transparent 70%)'
                  : anticipationMode && reelIndex === 2
                    ? 'radial-gradient(circle, rgba(255, 140, 0, 0.2) 0%, transparent 70%)'
                    : 'radial-gradient(circle, rgba(96, 165, 250, 0.2) 0%, transparent 70%)',
                borderRadius: '50%'
              }}
            />
          </motion.div>
        </AnimatePresence>

        {/* 승리 시 파티클 효과 */}
        {isWinning && !isSpinning && (
          <div className="absolute inset-0 pointer-events-none overflow-hidden" 
               style={{ borderRadius: isMobile ? '16px' : '24px' }}>
            {[...Array(isMobile ? 6 : 10)].map((_, i) => (
              <motion.div
                key={`particle-${i}`}
                className="absolute w-1 h-1 sm:w-2 sm:h-2 bg-yellow-400 rounded-full"
                initial={{
                  x: '50%',
                  y: '50%',
                  scale: 0
                }}
                animate={{
                  x: [
                    '50%',
                    `${50 + (Math.random() - 0.5) * 100}%`,
                    `${50 + (Math.random() - 0.5) * 150}%`
                  ],
                  y: [
                    '50%',
                    `${50 + (Math.random() - 0.5) * 100}%`,
                    `${50 + (Math.random() - 0.5) * 150}%`
                  ],
                  scale: [0, 1, 0],
                  opacity: [0, 1, 0]
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  delay: i * 0.1,
                  ease: "easeOut"
                }}
              />
            ))}
          </div>
        )}

        {/* 스핀 중 회전 효과 */}
        {isSpinning && (
          <motion.div
            className="absolute inset-2 border border-white/30 rounded-full"
            animate={{ rotate: 360 }}
            transition={{
              duration: 0.5,
              repeat: Infinity,
              ease: "linear"
            }}
          />
        )}
      </motion.div>
    </div>
  );
};