import confetti from 'canvas-confetti';

// 프리미엄 파티클 효과 시스템
export class PremiumParticleSystem {
  
  // 🎉 승리 시 폭죽 효과
  static celebrationExplosion(intensity: 'small' | 'big' | 'mega' = 'small') {
    const configs = {
      small: {
        particleCount: 50,
        spread: 60,
        colors: ['#FFD700', '#FFA500', '#FF6347']
      },
      big: {
        particleCount: 100,
        spread: 80,
        colors: ['#FFD700', '#FFA500', '#FF6347', '#FF1493', '#00BFFF']
      },
      mega: {
        particleCount: 200,
        spread: 100,
        colors: ['#FFD700', '#FFA500', '#FF6347', '#FF1493', '#00BFFF', '#9370DB']
      }
    };

    const config = configs[intensity];
    
    confetti({
      particleCount: config.particleCount,
      spread: config.spread,
      origin: { y: 0.6 },
      colors: config.colors,
      gravity: 0.8,
      drift: 1,
      ticks: 200
    });
  }

  // 💰 동전 떨어지는 효과
  static coinRain(amount: number) {
    const coinCount = Math.min(amount / 100, 50); // 최대 50개 동전
    
    for (let i = 0; i < coinCount; i++) {
      setTimeout(() => {
        confetti({
          particleCount: 3,
          angle: 270,
          spread: 45,
          origin: { x: Math.random(), y: 0 },
          colors: ['#FFD700', '#FFA500'],
          gravity: 1.2,
          scalar: 1.5,
          shapes: ['circle'],
          ticks: 300
        });
      }, i * 50);
    }
  }

  // 🌟 잭팟 레이저쇼
  static jackpotLaserShow() {
    const duration = 3000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

    function randomInRange(min: number, max: number) {
      return Math.random() * (max - min) + min;
    }

    const interval = setInterval(() => {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        clearInterval(interval);
        return;
      }

      const particleCount = 50 * (timeLeft / duration);

      // 왼쪽에서 폭발
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
        colors: ['#FF1493', '#00BFFF', '#FFD700']
      });

      // 오른쪽에서 폭발
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
        colors: ['#9370DB', '#FF6347', '#32CD32']
      });
    }, 250);
  }

  // 🎯 연속 승리 효과
  static comboEffect(comboCount: number) {
    const colors = [
      ['#FFD700', '#FFA500'], // 1-2콤보: 골드
      ['#FF1493', '#00BFFF'], // 3-4콤보: 핑크/블루
      ['#9370DB', '#32CD32'], // 5+콤보: 퍼플/그린
    ];
    
    const colorIndex = Math.min(Math.floor((comboCount - 1) / 2), 2);
    const selectedColors = colors[colorIndex];
    
    // 화면 양쪽에서 중앙으로 모이는 효과
    confetti({
      particleCount: 30,
      angle: 60,
      spread: 55,
      origin: { x: 0 },
      colors: selectedColors
    });
    
    confetti({
      particleCount: 30,
      angle: 120,
      spread: 55,
      origin: { x: 1 },
      colors: selectedColors
    });
  }

  // 💎 특수 심볼 효과
  static specialSymbolEffect(symbolType: 'wild' | 'scatter') {
    const config = symbolType === 'wild' 
      ? {
          colors: ['#FFD700', '#FFFF00', '#FFA500'],
          shape: 'star' as const
        }
      : {
          colors: ['#FF1493', '#9370DB', '#00BFFF'],
          shape: 'circle' as const
        };

    confetti({
      particleCount: 25,
      spread: 70,
      origin: { y: 0.8 },
      colors: config.colors,
      shapes: [config.shape],
      scalar: 2,
      gravity: 0.6,
      drift: 2
    });
  }

  // 🔥 연속 스핀 효과 (오토스핀용)
  static autoSpinTrail() {
    confetti({
      particleCount: 10,
      spread: 30,
      origin: { y: 0.7 },
      colors: ['#00BFFF', '#87CEEB'],
      gravity: 0.4,
      ticks: 100,
      scalar: 0.8
    });
  }

  // 🎊 게임 시작 웰컴 효과
  static welcomeEffect() {
    setTimeout(() => {
      confetti({
        particleCount: 100,
        spread: 160,
        origin: { y: 0.3 },
        colors: ['#FFD700', '#FFA500', '#FF6347', '#FF1493', '#00BFFF', '#9370DB']
      });
    }, 500);
  }
}

// React Hook으로 파티클 시스템 사용
export const useParticleEffects = () => {
  return {
    celebrate: PremiumParticleSystem.celebrationExplosion,
    coinRain: PremiumParticleSystem.coinRain,
    jackpot: PremiumParticleSystem.jackpotLaserShow,
    combo: PremiumParticleSystem.comboEffect,
    special: PremiumParticleSystem.specialSymbolEffect,
    autoSpin: PremiumParticleSystem.autoSpinTrail,
    welcome: PremiumParticleSystem.welcomeEffect
  };
};