import { motion, AnimatePresence } from 'framer-motion';
import React from 'react';

// 🎰 프리미엄 슬롯 릴 애니메이션 컴포넌트
interface AnimatedSlotReelProps {
  symbol: string;
  isSpinning: boolean;
  isWinning: boolean;
  index: number;
  onClick?: () => void;
}

export const AnimatedSlotReel: React.FC<AnimatedSlotReelProps> = ({
  symbol,
  isSpinning,
  isWinning,
  index,
  onClick
}) => {
  return (
    <motion.div
      className="relative"
      initial={{ opacity: 0, y: 50 }}
      animate={{ 
        opacity: 1, 
        y: 0,
        scale: isWinning ? [1, 1.15, 1.05, 1.1, 1] : 1,
        rotateY: isSpinning ? [0, 360] : 0
      }}
      transition={{
        duration: isSpinning ? 0.15 : 0.8,
        repeat: isSpinning ? Infinity : (isWinning ? 2 : 0),
        ease: isSpinning ? "linear" : "easeInOut",
        delay: index * 0.1
      }}
      whileHover={!isSpinning ? { 
        scale: 1.05,
        rotateY: 5
      } : {}}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
    >
      <motion.div
        className={`
          relative w-20 h-20 md:w-24 md:h-24 rounded-xl border-2 cursor-pointer
          transform-gpu transition-all duration-300
          ${isSpinning ? 'bg-gradient-to-br from-purple-500 to-pink-500' : 'bg-gradient-to-br from-white/90 to-gray-100/90'}
          ${isWinning ? 'ring-4 ring-yellow-400 shadow-yellow-400/50' : ''}
          border-white/50 shadow-xl backdrop-blur-sm
        `}
        animate={isWinning ? {
          boxShadow: [
            '0 10px 30px rgba(0,0,0,0.2)',
            '0 10px 50px rgba(255,215,0,0.8)',
            '0 10px 30px rgba(0,0,0,0.2)'
          ]
        } : {}}
      >
        {/* 반사 효과 */}
        <motion.div 
          className="absolute inset-0 rounded-xl bg-gradient-to-br from-white/40 via-transparent to-transparent"
          animate={{
            opacity: isWinning ? [0.4, 0.8, 0.4] : 0.4
          }}
          transition={{
            duration: 1,
            repeat: isWinning ? Infinity : 0
          }}
        />
        
        {/* 심볼 */}
        <motion.div 
          className="flex items-center justify-center h-full relative z-10"
          animate={{
            rotateY: isSpinning ? [0, 180, 360] : 0
          }}
          transition={{
            duration: 0.3,
            repeat: isSpinning ? Infinity : 0,
            ease: "linear"
          }}
        >
          <motion.span
            className={`
              text-4xl md:text-5xl font-bold
              ${isWinning ? 'drop-shadow-lg filter brightness-110' : ''}
            `}
            animate={isWinning ? {
              scale: [1, 1.2, 1]
            } : {}}
            transition={{
              duration: 0.6,
              repeat: isWinning ? Infinity : 0
            }}
          >
            {symbol}
          </motion.span>
        </motion.div>

        {/* 승리 글로우 효과 */}
        <AnimatePresence>
          {isWinning && (
            <motion.div
              className="absolute inset-0 rounded-xl bg-gradient-to-r from-yellow-400/40 via-orange-500/40 to-yellow-400/40"
              initial={{ opacity: 0 }}
              animate={{ 
                opacity: [0, 0.6, 0]
              }}
              exit={{ opacity: 0 }}
              transition={{ 
                duration: 1, 
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
};

// 🎉 애니메이션 결과 표시 컴포넌트
interface AnimatedResultProps {
  result: string | null;
  effect: string;
}

export const AnimatedResult: React.FC<AnimatedResultProps> = ({ result, effect }) => {
  return (
    <AnimatePresence mode="wait">
      {result && (
        <motion.div
          key={result}
          className={`
            mt-4 px-6 py-3 rounded-xl font-bold shadow-lg
            transform-gpu relative overflow-hidden
            ${effect === 'jackpot-glow' 
              ? 'bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-3xl animate-pulse'
              : effect === 'win-glow'
              ? 'bg-gradient-to-r from-blue-400 to-cyan-500 text-white text-2xl'
              : 'bg-gradient-to-r from-gray-400 to-gray-600 text-white text-xl'
            }
          `}
          initial={
            effect === 'jackpot-glow' 
              ? { scale: 0, rotateZ: -180, opacity: 0 }
              : effect === 'win-glow'
              ? { scale: 0, y: 50, opacity: 0 }
              : { opacity: 0 }
          }
          animate={
            effect === 'jackpot-glow'
              ? { 
                  scale: [0, 1.3, 1],
                  rotateZ: 0,
                  opacity: 1
                }
              : effect === 'win-glow'
              ? { 
                  scale: 1,
                  y: 0,
                  opacity: 1
                }
              : effect === 'fail-shake'
              ? {
                  opacity: 1,
                  x: [-10, 10, -8, 8, -6, 6, 0]
                }
              : { opacity: 1, y: 0 }
          }
          exit={{ 
            scale: 0, 
            opacity: 0,
            transition: { duration: 0.3 }
          }}
        >
          {/* 배경 반짝임 효과 */}
          {effect === 'jackpot-glow' && (
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
              animate={{
                x: [-100, 200],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: "linear"
              }}
            />
          )}
          
          <span className="relative z-10">{result}</span>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

// 💰 애니메이션 상금 표시 컴포넌트
interface AnimatedWinAmountProps {
  amount: number;
  isVisible: boolean;
}

export const AnimatedWinAmount: React.FC<AnimatedWinAmountProps> = ({ amount, isVisible }) => {
  return (
    <AnimatePresence>
      {isVisible && amount > 0 && (
        <motion.div
          initial={{ 
            scale: 0, 
            y: 20, 
            opacity: 0,
            rotateX: -90 
          }}
          animate={{ 
            scale: 1, 
            y: 0, 
            opacity: 1,
            rotateX: 0
          }}
          exit={{ 
            scale: 0.8, 
            y: -20, 
            opacity: 0,
            transition: { duration: 0.3 }
          }}
          className="mt-4 p-4 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-xl shadow-lg"
          style={{ transformStyle: 'preserve-3d' }}
        >
          <motion.div 
            className="text-center text-white font-bold"
            animate={{
              scale: [1, 1.05, 1]
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            <motion.div 
              className="text-lg"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              총 상금
            </motion.div>
            
            {/* 숫자 카운터 애니메이션 */}
            <motion.div
              className="text-3xl"
              animate={{
                textShadow: [
                  '0 0 10px rgba(255,255,255,0.5)',
                  '0 0 20px rgba(255,255,255,0.8)',
                  '0 0 10px rgba(255,255,255,0.5)'
                ]
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              💰 {amount.toLocaleString()}원
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

// 🎯 스핀 버튼 고급 애니메이션
interface AnimatedSpinButtonProps {
  onClick: () => void;
  disabled: boolean;
  isSpinning: boolean;
}

export const AnimatedSpinButton: React.FC<AnimatedSpinButtonProps> = ({
  onClick,
  disabled,
  isSpinning
}) => {
  return (
    <motion.button
      className={`
        mt-6 px-8 py-4 rounded-xl text-xl font-bold
        flex items-center gap-3 relative overflow-hidden
        transition-all duration-300 transform-gpu
        ${disabled 
          ? 'bg-gray-400 cursor-not-allowed' 
          : 'bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 cursor-pointer'
        }
        text-white shadow-lg
      `}
      onClick={onClick}
      disabled={disabled}
      whileHover={!disabled ? { 
        scale: 1.05,
        boxShadow: "0 10px 25px rgba(0,0,0,0.3)"
      } : {}}
      whileTap={!disabled ? { 
        scale: 0.95,
        transition: { duration: 0.1 }
      } : {}}
      animate={isSpinning ? {
        boxShadow: [
          "0 0 0px rgba(59, 130, 246, 0.5)",
          "0 0 30px rgba(59, 130, 246, 0.8)",
          "0 0 0px rgba(59, 130, 246, 0.5)"
        ]
      } : {}}
      transition={{
        duration: 1,
        repeat: isSpinning ? Infinity : 0,
        ease: "easeInOut"
      }}
    >
      {/* 배경 반짝임 효과 */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
        animate={{
          x: isSpinning ? [-100, 200] : [-100],
        }}
        transition={{
          duration: 1.5,
          repeat: isSpinning ? Infinity : 0,
          ease: "linear"
        }}
      />
      
      {/* 아이콘 회전 애니메이션 */}
      <motion.span 
        className="text-2xl relative z-10"
        animate={isSpinning ? {
          rotate: 360
        } : {}}
        transition={{
          duration: 0.8,
          repeat: isSpinning ? Infinity : 0,
          ease: "linear"
        }}
      >
        🎰
      </motion.span>
      
      <span className="relative z-10">
        {isSpinning ? '스핀 중...' : 'SPIN!'}
      </span>
    </motion.button>
  );
};