import { motion } from 'framer-motion';
import React from 'react';

// 🎰 간단한 애니메이션 슬롯 릴
interface AnimatedSlotReelProps {
  symbol: string;
  isSpinning: boolean;
  isWinning: boolean;
  index: number;
}

export const AnimatedSlotReel: React.FC<AnimatedSlotReelProps> = ({
  symbol,
  isSpinning,
  isWinning,
  index
}) => {
  return (
    <motion.div
      className={`
        relative w-full aspect-square rounded-xl sm:rounded-2xl overflow-hidden
        ${isSpinning 
          ? 'bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 shadow-[0_0_30px_rgba(99,102,241,0.6)]' 
          : 'bg-gradient-to-br from-gray-700 via-gray-800 to-gray-900 border-2 border-gray-600/70'
        }
        ${isWinning ? 'ring-4 ring-yellow-400 shadow-[0_0_40px_rgba(255,215,0,0.8)] bg-gradient-to-br from-yellow-500/20 to-orange-500/20' : 'shadow-2xl'}
      `}
      initial={{ scale: 0, opacity: 0, rotateY: -180 }}
      animate={{ 
        scale: isWinning ? [1, 1.08, 1] : 1,
        opacity: 1,
        rotateY: 0
      }}
      transition={{
        delay: index * 0.08,
        repeat: isWinning ? Infinity : 0,
        duration: isWinning ? 1.2 : 0.6,
        type: "spring",
        stiffness: 200
      }}
      whileHover={{ scale: 1.05, rotateY: 5 }}
      whileTap={{ scale: 0.95 }}
    >
      {/* 글래스 오버레이 효과 */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/20 via-transparent to-transparent pointer-events-none" />
      
      {/* 스피닝 로딩 효과 */}
      {isSpinning && (
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
          animate={{ x: [-100, 100] }}
          transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}
        />
      )}
      
      <div className="flex items-center justify-center h-full relative z-10">
        <motion.span
          className={`
            text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold
            ${isSpinning ? 'text-white' : 'text-white'}
            ${isWinning ? 'drop-shadow-[0_0_10px_rgba(255,215,0,0.8)]' : 'drop-shadow-lg'}
          `}
          animate={isSpinning ? { 
            rotateY: [0, 180, 360],
            scale: [1, 0.8, 1]
          } : {}}
          transition={{
            duration: 0.3,
            repeat: isSpinning ? Infinity : 0,
            ease: "easeInOut"
          }}
        >
          {symbol}
        </motion.span>
      </div>
      
      {/* 승리 글로우 */}
      {isWinning && (
        <motion.div
          className="absolute inset-0 rounded-xl bg-yellow-400/20"
          animate={{ opacity: [0, 1, 0] }}
          transition={{ duration: 1, repeat: Infinity }}
        />
      )}
    </motion.div>
  );
};

// 🎉 결과 애니메이션
interface AnimatedResultProps {
  result: string | null;
  effect: string;
}

export const AnimatedResult: React.FC<AnimatedResultProps> = ({ result, effect }) => {
  if (!result) return null;

  return (
    <motion.div
      className={`
        mt-4 px-6 py-3 rounded-xl font-bold shadow-lg
        ${effect === 'jackpot-glow' ? 'bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-3xl' :
          effect === 'win-glow' ? 'bg-gradient-to-r from-blue-400 to-cyan-500 text-white text-2xl' :
          'bg-gradient-to-r from-gray-400 to-gray-600 text-white text-xl'}
      `}
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0, opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      {result}
    </motion.div>
  );
};

// 🎯 스핀 버튼
interface AnimatedSpinButtonProps {
  onClick: () => void;
  disabled: boolean;
  spinning: boolean;
  balance: number;
  bet: number;
}

export const AnimatedSpinButton: React.FC<AnimatedSpinButtonProps> = ({
  onClick,
  disabled,
  spinning,
  balance,
  bet
}) => {
  return (
    <motion.button
      className={`
        relative px-8 sm:px-12 py-4 sm:py-5 rounded-2xl text-lg sm:text-xl font-black
        flex items-center justify-center gap-3 sm:gap-4 overflow-hidden min-w-[180px] sm:min-w-[220px]
        ${disabled 
          ? 'bg-gradient-to-r from-gray-500 to-gray-600 cursor-not-allowed opacity-50' 
          : spinning
            ? 'bg-gradient-to-r from-orange-500 via-red-500 to-pink-600 shadow-[0_0_40px_rgba(236,72,153,0.6)]'
            : 'bg-gradient-to-r from-emerald-500 via-blue-500 to-purple-600 shadow-[0_0_30px_rgba(59,130,246,0.5)] hover:shadow-[0_0_50px_rgba(59,130,246,0.8)]'
        }
        text-white border-2 border-white/20 backdrop-blur-sm
        transition-all duration-300
      `}
      onClick={onClick}
      disabled={disabled}
      whileHover={!disabled ? { 
        scale: 1.05,
        boxShadow: "0 0 60px rgba(59,130,246,0.8)"
      } : {}}
      whileTap={!disabled ? { scale: 0.95 } : {}}
      animate={!disabled && !spinning ? {
        boxShadow: [
          "0 0 30px rgba(59,130,246,0.5)",
          "0 0 50px rgba(59,130,246,0.8)",
          "0 0 30px rgba(59,130,246,0.5)"
        ]
      } : {}}
      transition={{
        boxShadow: { duration: 2, repeat: Infinity, ease: "easeInOut" }
      }}
    >
      {/* 글로우 오버레이 */}
      {!disabled && (
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
          animate={spinning ? { x: [-200, 200] } : { x: [-200, 200] }}
          transition={{
            duration: spinning ? 1 : 3,
            repeat: Infinity,
            ease: "linear"
          }}
        />
      )}
      
      <motion.span 
        className="text-2xl sm:text-3xl relative z-10"
        animate={spinning ? { 
          rotate: 360,
          scale: [1, 1.2, 1]
        } : {
          rotate: [0, 5, -5, 0]
        }}
        transition={{
          duration: spinning ? 0.5 : 2,
          repeat: Infinity,
          ease: spinning ? "linear" : "easeInOut"
        }}
      >
        🎰
      </motion.span>
      <motion.span 
        className="relative z-10 tracking-wide"
        animate={spinning ? {
          color: ["#ffffff", "#fbbf24", "#ffffff"]
        } : {}}
        transition={{
          duration: 0.8,
          repeat: spinning ? Infinity : 0
        }}
      >
        {disabled && balance < bet ? '💸 잔고 부족' : spinning ? '⚡ 스피닝...' : '🚀 SPIN!'}
      </motion.span>
    </motion.button>
  );
};