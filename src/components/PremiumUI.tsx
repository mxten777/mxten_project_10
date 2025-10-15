// 🎨 프리미엄 글래스모피즘 & 네오모피즘 UI 시스템
import React, { useState } from 'react';
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { Canvas } from '@react-three/fiber';
import { Environment } from '@react-three/drei';

// 🌟 프리미엄 컬러 팔레트
export const premiumColors = {
  gradients: {
    primary: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    secondary: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
    success: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
    warning: 'linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)',
    danger: 'linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)',
    dark: 'linear-gradient(135deg, #2c3e50 0%, #34495e 100%)',
    light: 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)',
    neon: 'linear-gradient(135deg, #00f5ff 0%, #ff00ff 50%, #ffff00 100%)',
    hologram: 'linear-gradient(45deg, #ff0080, #ff8c00, #40e0d0, #ff0080)',
    aurora: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)'
  },
  glass: {
    background: 'rgba(255, 255, 255, 0.1)',
    border: 'rgba(255, 255, 255, 0.2)',
    shadow: 'rgba(0, 0, 0, 0.1)',
    blur: 'backdrop-filter: blur(20px)'
  },
  neon: {
    cyan: '#00ffff',
    pink: '#ff00ff',
    purple: '#8a2be2',
    gold: '#ffd700',
    lime: '#00ff00'
  }
};

// 🎯 프리미엄 버튼 컴포넌트
interface PremiumButtonProps {
  children: React.ReactNode;
  variant?: 'glass' | 'neon' | 'hologram' | 'crystal' | 'plasma';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  color?: 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'neon';
  disabled?: boolean;
  loading?: boolean;
  onClick?: () => void;
  className?: string;
}

export const PremiumButton: React.FC<PremiumButtonProps> = ({
  children,
  variant = 'glass',
  size = 'md',

  disabled = false,
  loading = false,
  onClick,
  className = ''
}) => {
  const [isPressed, setIsPressed] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  
  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [7.5, -7.5]));
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-7.5, 7.5]));

  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    mouseX.set((e.clientX - centerX) / (rect.width / 2));
    mouseY.set((e.clientY - centerY) / (rect.height / 2));
  };

  const sizeClasses = {
    sm: 'px-4 py-2 text-sm min-h-[36px]',
    md: 'px-6 py-3 text-base min-h-[44px]',
    lg: 'px-8 py-4 text-lg min-h-[52px]',
    xl: 'px-10 py-5 text-xl min-h-[60px]'
  };

  const baseClasses = `
    relative font-bold rounded-2xl cursor-pointer select-none overflow-hidden
    transform-gpu transition-all duration-300 ease-out
    ${sizeClasses[size]}
    ${disabled || loading ? 'opacity-50 cursor-not-allowed' : ''}
  `;

  const variantStyles = {
    glass: `
      bg-white/10 backdrop-blur-xl border border-white/20
      shadow-[0_8px_32px_0_rgba(31,38,135,0.37)]
      hover:bg-white/20 hover:shadow-[0_8px_32px_0_rgba(31,38,135,0.5)]
    `,
    neon: `
      bg-black/80 border-2 border-cyan-400
      shadow-[0_0_20px_rgba(0,255,255,0.5)] text-cyan-400
      hover:shadow-[0_0_30px_rgba(0,255,255,0.8)]
      hover:text-white hover:border-cyan-300
    `,
    hologram: `
      bg-gradient-to-r from-purple-500/20 via-pink-500/20 to-cyan-500/20
      border border-transparent backdrop-blur-xl
      bg-gradient-to-r from-purple-500 via-pink-500 to-cyan-500 bg-clip-border
      shadow-[0_0_20px_rgba(168,85,247,0.4)]
      hover:shadow-[0_0_30px_rgba(168,85,247,0.6)]
    `,
    crystal: `
      bg-gradient-to-br from-white/30 to-white/10 backdrop-blur-2xl
      border border-white/30 shadow-[0_16px_40px_rgba(255,255,255,0.1)]
      hover:from-white/40 hover:to-white/20
      hover:shadow-[0_20px_50px_rgba(255,255,255,0.2)]
    `,
    plasma: `
      bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-500
      shadow-[0_0_20px_rgba(236,72,153,0.5)]
      hover:shadow-[0_0_30px_rgba(236,72,153,0.7)]
      text-white border-0
    `
  };



  return (
    <motion.button
      className={`${baseClasses} ${variantStyles[variant]} ${className}`}
      style={{
        rotateX,
        rotateY,
        transformStyle: 'preserve-3d'
      }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
        mouseX.set(0);
        mouseY.set(0);
      }}
      onMouseDown={() => setIsPressed(true)}
      onMouseUp={() => setIsPressed(false)}
      onClick={onClick}
      disabled={disabled || loading}
      whileHover={{ scale: 1.05, z: 10 }}
      whileTap={{ scale: 0.98 }}
      animate={{
        boxShadow: isHovered
          ? '0 20px 40px rgba(0, 0, 0, 0.2), 0 0 20px rgba(255, 255, 255, 0.1)'
          : '0 10px 20px rgba(0, 0, 0, 0.1)'
      }}
    >
      {/* 홀로그램 오버레이 */}
      {variant === 'hologram' && (
        <div className="absolute inset-0 bg-gradient-to-r from-purple-500/30 via-pink-500/30 to-cyan-500/30 rounded-2xl" />
      )}
      
      {/* 글로우 효과 */}
      <motion.div
        className="absolute inset-0 rounded-2xl opacity-0"
        style={{
          background: `radial-gradient(circle at ${mouseX}% ${mouseY}%, rgba(255,255,255,0.2) 0%, transparent 70%)`
        }}
        animate={{ opacity: isHovered ? 1 : 0 }}
      />
      
      {/* 리플 효과 */}
      {isPressed && (
        <motion.div
          className="absolute inset-0 bg-white/20 rounded-2xl"
          initial={{ scale: 0, opacity: 1 }}
          animate={{ scale: 2, opacity: 0 }}
          transition={{ duration: 0.6 }}
        />
      )}
      
      {/* 컨텐츠 */}
      <span className="relative z-10 flex items-center justify-center gap-2">
        {loading && (
          <motion.div
            className="w-4 h-4 border-2 border-current border-t-transparent rounded-full"
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          />
        )}
        {children}
      </span>
      
      {/* 네온 보더 애니메이션 */}
      {variant === 'neon' && (
        <motion.div
          className="absolute inset-0 rounded-2xl border-2 border-cyan-400"
          animate={{
            borderColor: [
              'rgba(0, 255, 255, 0.5)',
              'rgba(255, 0, 255, 0.5)',
              'rgba(255, 255, 0, 0.5)',
              'rgba(0, 255, 255, 0.5)'
            ]
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: 'linear'
          }}
        />
      )}
    </motion.button>
  );
};

// 🎭 프리미엄 카드 컴포넌트
interface PremiumCardProps {
  children: React.ReactNode;
  variant?: 'glass' | 'neon' | 'crystal' | 'hologram';
  className?: string;
  hoverable?: boolean;
  animated?: boolean;
}

export const PremiumCard: React.FC<PremiumCardProps> = ({
  children,
  variant = 'glass',
  className = '',
  hoverable = true,
  animated = true
}) => {
  const [isHovered, setIsHovered] = useState(false);
  
  const variantStyles = {
    glass: `
      bg-white/10 backdrop-blur-xl border border-white/20
      shadow-[0_8px_32px_0_rgba(31,38,135,0.37)]
    `,
    neon: `
      bg-black/90 border border-cyan-400/50
      shadow-[0_0_20px_rgba(0,255,255,0.3)]
    `,
    crystal: `
      bg-gradient-to-br from-white/20 to-white/5 backdrop-blur-2xl
      border border-white/30 shadow-[0_16px_40px_rgba(255,255,255,0.1)]
    `,
    hologram: `
      bg-gradient-to-br from-purple-500/10 via-pink-500/10 to-cyan-500/10
      backdrop-blur-xl border border-white/20
      shadow-[0_0_20px_rgba(168,85,247,0.2)]
    `
  };

  return (
    <motion.div
      className={`
        relative rounded-3xl p-6 overflow-hidden
        ${variantStyles[variant]}
        ${hoverable ? 'cursor-pointer' : ''}
        ${className}
      `}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      whileHover={hoverable && animated ? { 
        scale: 1.02, 
        y: -5,
        rotateX: 5,
        rotateY: 5
      } : {}}
      initial={animated ? { opacity: 0, y: 20 } : {}}
      animate={animated ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, ease: [0.23, 1, 0.32, 1] }}
    >
      {/* 홀로그램 오버레이 */}
      {variant === 'hologram' && (
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-purple-500/20 via-pink-500/20 to-cyan-500/20"
          animate={{
            background: [
              'linear-gradient(45deg, rgba(168,85,247,0.1), rgba(236,72,153,0.1), rgba(6,182,212,0.1))',
              'linear-gradient(90deg, rgba(6,182,212,0.1), rgba(168,85,247,0.1), rgba(236,72,153,0.1))',
              'linear-gradient(135deg, rgba(236,72,153,0.1), rgba(6,182,212,0.1), rgba(168,85,247,0.1))'
            ]
          }}
          transition={{ duration: 3, repeat: Infinity }}
        />
      )}
      
      {/* 글로우 효과 */}
      <AnimatePresence>
        {isHovered && hoverable && (
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"
            initial={{ opacity: 0, x: '-100%' }}
            animate={{ opacity: 1, x: '100%' }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
          />
        )}
      </AnimatePresence>
      
      {/* 컨텐츠 */}
      <div className="relative z-10">
        {children}
      </div>
    </motion.div>
  );
};

// 💎 프리미엄 타이포그래피
interface PremiumTextProps {
  children: React.ReactNode;
  variant?: 'title' | 'subtitle' | 'body' | 'caption';
  effect?: 'glow' | 'neon' | 'hologram' | 'gradient' | 'crystal';
  color?: string;
  className?: string;
}

export const PremiumText: React.FC<PremiumTextProps> = ({
  children,
  variant = 'body',
  effect = 'gradient',
  color,
  className = ''
}) => {
  const variantClasses = {
    title: 'text-4xl md:text-6xl font-black',
    subtitle: 'text-2xl md:text-3xl font-bold',
    body: 'text-base md:text-lg font-medium',
    caption: 'text-sm font-normal'
  };

  const effectStyles = {
    glow: `
      text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.8)]
      filter blur-[0.5px] animate-pulse
    `,
    neon: `
      text-cyan-400 drop-shadow-[0_0_10px_rgba(0,255,255,0.8)]
      text-shadow-[0_0_5px_rgba(0,255,255,0.5)]
    `,
    hologram: `
      bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent
      drop-shadow-[0_0_20px_rgba(168,85,247,0.5)]
    `,
    gradient: `
      bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent
    `,
    crystal: `
      text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.3)]
      filter brightness-110 contrast-110
    `
  };

  return (
    <motion.span
      className={`
        ${variantClasses[variant]}
        ${effectStyles[effect]}
        ${className}
      `}
      style={{ color }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      {children}
    </motion.span>
  );
};

// 🎪 프리미엄 컨테이너
interface PremiumContainerProps {
  children: React.ReactNode;
  background?: 'cosmic' | 'cyber' | 'aurora' | 'crystal' | 'void';
  className?: string;
}

export const PremiumContainer: React.FC<PremiumContainerProps> = ({
  children,
  background = 'cosmic',
  className = ''
}) => {
  const backgroundStyles = {
    cosmic: 'bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900',
    cyber: 'bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900',
    aurora: 'bg-gradient-to-br from-green-900 via-blue-900 to-purple-900',
    crystal: 'bg-gradient-to-br from-blue-50 via-white to-purple-50',
    void: 'bg-gradient-to-br from-black via-gray-900 to-purple-900'
  };

  return (
    <motion.div
      className={`
        relative min-h-screen overflow-hidden
        ${backgroundStyles[background]}
        ${className}
      `}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
    >
      {/* 동적 배경 패턴 */}
      <div className="absolute inset-0">
        {/* 그리드 패턴 */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:50px_50px]" />
        
        {/* 플로팅 파티클 */}
        {Array.from({ length: 20 }, (_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-white/20 rounded-full"
            animate={{
              y: [0, -100, 0],
              x: [0, Math.random() * 100 - 50, 0],
              opacity: [0, 1, 0]
            }}
            transition={{
              duration: Math.random() * 10 + 5,
              repeat: Infinity,
              delay: Math.random() * 5
            }}
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`
            }}
          />
        ))}
      </div>
      
      {/* 컨텐츠 */}
      <div className="relative z-10">
        {children}
      </div>
    </motion.div>
  );
};

// 🔮 프리미엄 3D 배경 컴포넌트
export const Premium3DBackground: React.FC = () => {
  return (
    <div className="fixed inset-0 -z-10">
      <Canvas
        camera={{ position: [0, 0, 5], fov: 60 }}
        gl={{ antialias: true, alpha: true }}
      >
        <Environment preset="night" />
        <ambientLight intensity={0.2} />
        <pointLight position={[10, 10, 10]} intensity={1} color="#ff00ff" />
        <pointLight position={[-10, -10, -10]} intensity={1} color="#00ffff" />
        
        {/* 회전하는 홀로그램 오브젝트들 */}
        {Array.from({ length: 10 }, (_, i) => (
          <mesh
            key={i}
            position={[
              (Math.random() - 0.5) * 20,
              (Math.random() - 0.5) * 20,
              (Math.random() - 0.5) * 20
            ]}
          >
            <boxGeometry args={[0.5, 0.5, 0.5]} />
            <meshStandardMaterial
              color={`hsl(${Math.random() * 360}, 80%, 60%)`}
              transparent
              opacity={0.3}
              emissive={`hsl(${Math.random() * 360}, 80%, 40%)`}
              emissiveIntensity={0.5}
            />
          </mesh>
        ))}
      </Canvas>
    </div>
  );
};

export default {
  PremiumButton,
  PremiumCard,
  PremiumText,
  PremiumContainer,
  Premium3DBackground,
  premiumColors
};