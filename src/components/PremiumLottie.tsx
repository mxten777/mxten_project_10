import React, { useEffect, useRef, useState } from 'react';

// Lottie 스타일 프리미엄 애니메이션 시스템
interface PremiumLottieProps {
  type: 'jackpot' | 'bonus' | 'spin' | 'win' | 'celebration' | 'loading';
  size?: number;
  speed?: number;
  loop?: boolean;
  autoplay?: boolean;
  onComplete?: () => void;
}

export const PremiumLottie: React.FC<PremiumLottieProps> = ({
  type,
  size = 200,
  speed = 1,
  loop = true,
  autoplay = true,
  onComplete,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number | undefined>(undefined);
  const [isPlaying, setIsPlaying] = useState(autoplay);
  const startTimeRef = useRef<number | undefined>(undefined);

  useEffect(() => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d')!;
    canvas.width = size;
    canvas.height = size;

    // 헬퍼 함수들
    const drawDiamond = (ctx: CanvasRenderingContext2D, x: number, y: number, size: number, color: string) => {
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.moveTo(x, y - size);
      ctx.lineTo(x + size * 0.6, y);
      ctx.lineTo(x, y + size);
      ctx.lineTo(x - size * 0.6, y);
      ctx.closePath();
      ctx.fill();
    };

    const drawStar = (ctx: CanvasRenderingContext2D, x: number, y: number, innerRadius: number, outerRadius: number) => {
      ctx.beginPath();
      for (let i = 0; i < 10; i++) {
        const angle = (i * Math.PI) / 5;
        const radius = i % 2 === 0 ? outerRadius : innerRadius;
        const px = x + Math.cos(angle) * radius;
        const py = y + Math.sin(angle) * radius;
        
        if (i === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      }
      ctx.closePath();
      ctx.fill();
    };

    const drawCrown = (ctx: CanvasRenderingContext2D, x: number, y: number, size: number) => {
      const gradient = ctx.createLinearGradient(x - size/2, y, x + size/2, y);
      gradient.addColorStop(0, '#FFD700');
      gradient.addColorStop(1, '#FFA500');
      
      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.moveTo(x - size/2, y + size/2);
      ctx.lineTo(x - size/4, y - size/2);
      ctx.lineTo(x - size/8, y - size/4);
      ctx.lineTo(x, y - size/2);
      ctx.lineTo(x + size/8, y - size/4);
      ctx.lineTo(x + size/4, y - size/2);
      ctx.lineTo(x + size/2, y + size/2);
      ctx.closePath();
      ctx.fill();
    };

    const drawJackpotAnimation = (ctx: CanvasRenderingContext2D, size: number, progress: number) => {
      const centerX = size / 2;
      const centerY = size / 2;
      const time = progress * Math.PI * 2;

      // 중앙 황금 원
      const mainRadius = 60 + Math.sin(time * 2) * 10;
      const gradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, mainRadius);
      gradient.addColorStop(0, '#FFD700');
      gradient.addColorStop(0.5, '#FFA500');
      gradient.addColorStop(1, '#FF6B35');
      
      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(centerX, centerY, mainRadius, 0, Math.PI * 2);
      ctx.fill();

      // 회전하는 다이아몬드들
      for (let i = 0; i < 8; i++) {
        const angle = (time * 0.5) + (i * Math.PI / 4);
        const distance = 80 + Math.sin(time * 3 + i) * 20;
        const x = centerX + Math.cos(angle) * distance;
        const y = centerY + Math.sin(angle) * distance;
        
        drawDiamond(ctx, x, y, 15 + Math.sin(time * 4 + i) * 5, '#FFFFFF');
      }

      // 중앙 텍스트 효과
      ctx.fillStyle = '#FFFFFF';
      ctx.font = 'bold 24px Arial';
      ctx.textAlign = 'center';
      ctx.shadowColor = '#000000';
      ctx.shadowBlur = 10;
      ctx.fillText('JACKPOT', centerX, centerY + 8);
      ctx.shadowBlur = 0;
    };

    const drawBonusAnimation = (ctx: CanvasRenderingContext2D, size: number, progress: number) => {
      const centerX = size / 2;
      const centerY = size / 2;
      const time = progress * Math.PI * 2;

      // 보너스 폭죽 효과
      for (let i = 0; i < 12; i++) {
        const angle = (i * Math.PI * 2) / 12 + time * 0.3;
        const distance = 50 + Math.sin(time * 2 + i) * 30;
        const x = centerX + Math.cos(angle) * distance;
        const y = centerY + Math.sin(angle) * distance;
        
        const starGradient = ctx.createRadialGradient(x, y, 0, x, y, 20);
        starGradient.addColorStop(0, '#FF00FF');
        starGradient.addColorStop(1, '#8A2BE2');
        
        ctx.fillStyle = starGradient;
        drawStar(ctx, x, y, 8, 15 + Math.sin(time * 3 + i) * 8);
      }

      // 중앙 보너스 텍스트
      ctx.fillStyle = '#FF00FF';
      ctx.font = 'bold 20px Arial';
      ctx.textAlign = 'center';
      ctx.strokeStyle = '#FFFFFF';
      ctx.lineWidth = 2;
      ctx.strokeText('BONUS', centerX, centerY + 6);
      ctx.fillText('BONUS', centerX, centerY + 6);
    };

    const drawSpinAnimation = (ctx: CanvasRenderingContext2D, size: number, progress: number) => {
      const centerX = size / 2;
      const centerY = size / 2;
      const time = progress * Math.PI * 2;

      // 회전하는 스피너
      ctx.save();
      ctx.translate(centerX, centerY);
      ctx.rotate(time * 3);
      
      for (let i = 0; i < 6; i++) {
        const angle = (i * Math.PI * 2) / 6;
        const x = Math.cos(angle) * 50;
        const y = Math.sin(angle) * 50;
        
        const opacity = 1 - (i * 0.15);
        ctx.fillStyle = `rgba(0, 255, 255, ${opacity})`;
        ctx.beginPath();
        ctx.arc(x, y, 15, 0, Math.PI * 2);
        ctx.fill();
      }
      
      ctx.restore();

      // 중앙 코어
      const coreGradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, 25);
      coreGradient.addColorStop(0, '#FFFFFF');
      coreGradient.addColorStop(1, '#00FFFF');
      
      ctx.fillStyle = coreGradient;
      ctx.beginPath();
      ctx.arc(centerX, centerY, 20, 0, Math.PI * 2);
      ctx.fill();
    };

    const drawWinAnimation = (ctx: CanvasRenderingContext2D, size: number, progress: number) => {
      const centerX = size / 2;
      const centerY = size / 2;
      const time = progress * Math.PI * 2;

      // 승리 광선 효과
      for (let i = 0; i < 16; i++) {
        const angle = (i * Math.PI * 2) / 16 + time * 0.2;
        const length = 80 + Math.sin(time * 2 + i) * 20;
        
        ctx.strokeStyle = `hsla(${50 + i * 20}, 100%, 60%, 0.8)`;
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.moveTo(centerX, centerY);
        ctx.lineTo(
          centerX + Math.cos(angle) * length,
          centerY + Math.sin(angle) * length
        );
        ctx.stroke();
      }

      // 중앙 크라운
      drawCrown(ctx, centerX, centerY - 10, 40 + Math.sin(time * 2) * 5);
      
      ctx.fillStyle = '#FFD700';
      ctx.font = 'bold 18px Arial';
      ctx.textAlign = 'center';
      ctx.fillText('WIN!', centerX, centerY + 35);
    };

    const drawCelebrationAnimation = (ctx: CanvasRenderingContext2D, size: number, progress: number) => {
      const time = progress * Math.PI * 2;
      
      // 폭죽 파티클들
      for (let i = 0; i < 20; i++) {
        const x = (Math.random() * size);
        const y = (Math.random() * size);
        const hue = (time * 50 + i * 18) % 360;
        
        ctx.fillStyle = `hsla(${hue}, 100%, 60%, ${0.5 + Math.sin(time + i) * 0.3})`;
        ctx.beginPath();
        ctx.arc(x, y, 3 + Math.sin(time * 2 + i) * 2, 0, Math.PI * 2);
        ctx.fill();
      }

      // 중앙 축하 메시지
      const centerX = size / 2;
      const centerY = size / 2;
      
      ctx.fillStyle = '#FF1493';
      ctx.font = 'bold 22px Arial';
      ctx.textAlign = 'center';
      ctx.shadowColor = '#FFFFFF';
      ctx.shadowBlur = 15;
      ctx.fillText('🎉', centerX, centerY - 20);
      ctx.fillText('AMAZING!', centerX, centerY + 10);
      ctx.fillText('🎉', centerX, centerY + 40);
      ctx.shadowBlur = 0;
    };

    const drawLoadingAnimation = (ctx: CanvasRenderingContext2D, size: number, progress: number) => {
      const centerX = size / 2;
      const centerY = size / 2;
      const time = progress * Math.PI * 2;

      // 로딩 링
      for (let i = 0; i < 3; i++) {
        const radius = 30 + i * 15;
        const strokeWidth = 8 - i * 2;
        const opacity = 0.8 - i * 0.2;
        
        ctx.strokeStyle = `rgba(0, 255, 255, ${opacity})`;
        ctx.lineWidth = strokeWidth;
        ctx.lineCap = 'round';
        
        ctx.beginPath();
        ctx.arc(centerX, centerY, radius, time + i, time + i + Math.PI);
        ctx.stroke();
      }

      // 중앙 점
      ctx.fillStyle = '#FFFFFF';
      ctx.beginPath();
      ctx.arc(centerX, centerY, 5, 0, Math.PI * 2);
      ctx.fill();
    };

    const animate = (timestamp: number) => {
      if (!startTimeRef.current) startTimeRef.current = timestamp;
      
      const progress = ((timestamp - startTimeRef.current) * speed) / 1000;
      
      ctx.clearRect(0, 0, size, size);
      
      switch (type) {
        case 'jackpot':
          drawJackpotAnimation(ctx, size, progress);
          break;
        case 'bonus':
          drawBonusAnimation(ctx, size, progress);
          break;
        case 'spin':
          drawSpinAnimation(ctx, size, progress);
          break;
        case 'win':
          drawWinAnimation(ctx, size, progress);
          break;
        case 'celebration':
          drawCelebrationAnimation(ctx, size, progress);
          break;
        case 'loading':
          drawLoadingAnimation(ctx, size, progress);
          break;
      }

      if (progress >= 2 && !loop) {
        setIsPlaying(false);
        onComplete?.();
        return;
      }

      if (isPlaying) {
        if (loop && progress >= 2) {
          startTimeRef.current = timestamp;
        }
        animationRef.current = requestAnimationFrame(animate);
      }
    };

    if (isPlaying) {
      animationRef.current = requestAnimationFrame(animate);
    }

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [type, size, speed, loop, isPlaying]);

  return (
    <div className="premium-lottie relative" style={{ width: size, height: size }}>
      <canvas
        ref={canvasRef}
        style={{
          width: '100%',
          height: '100%',
          filter: 'drop-shadow(0 0 20px rgba(255, 255, 255, 0.3))'
        }}
      />
      {type !== 'loading' && (
        <div className="absolute inset-0 pointer-events-none bg-gradient-to-r from-transparent via-white/10 to-transparent animate-pulse" />
      )}
    </div>
  );
};

export default PremiumLottie;