// 프리미엄 사운드 파일 목록 (다운로드 필요)
const PREMIUM_SOUNDS = {
  // 무료 게임 사운드 사이트들:
  // 1. Freesound.org - CC 라이선스 고품질 사운드
  // 2. Zapsplat.com - 프리미엄 게임 사운드
  // 3. Adobe Audition - 로열티 프리 사운드

  spin: '/sounds/premium/slot-machine-reel-spin.wav',        // 실제 슬롯머신 회전음
  win: '/sounds/premium/casino-win-celebration.wav',         // 카지노 승리 팡파레
  bigwin: '/sounds/premium/big-win-orchestral.mp3',         // 오케스트라 빅윈
  jackpot: '/sounds/premium/jackpot-fanfare.mp3',          // 웅장한 잭팟 팡파레
  button: '/sounds/premium/ui-button-click.wav',            // 프리미엄 UI 클릭음
  fail: '/sounds/premium/lose-disappointment.wav',          // 실망스러운 실패음
  ambient: '/sounds/premium/casino-background.mp3',         // 카지노 배경음악
  coins: '/sounds/premium/coins-falling.wav',               // 동전 떨어지는 소리
};

// 프리미엄 사운드 로더
export const loadPremiumSounds = async () => {
  const { Howl } = await import('howler');
  
  return {
    spin: new Howl({ 
      src: [PREMIUM_SOUNDS.spin], 
      volume: 0.7,
      loop: false 
    }),
    win: new Howl({ 
      src: [PREMIUM_SOUNDS.win], 
      volume: 0.8 
    }),
    bigwin: new Howl({ 
      src: [PREMIUM_SOUNDS.bigwin], 
      volume: 0.9,
      preload: true 
    }),
    jackpot: new Howl({ 
      src: [PREMIUM_SOUNDS.jackpot], 
      volume: 1.0,
      preload: true 
    }),
    button: new Howl({ 
      src: [PREMIUM_SOUNDS.button], 
      volume: 0.5 
    }),
    fail: new Howl({ 
      src: [PREMIUM_SOUNDS.fail], 
      volume: 0.6 
    }),
    ambient: new Howl({ 
      src: [PREMIUM_SOUNDS.ambient], 
      volume: 0.3, 
      loop: true 
    }),
    coins: new Howl({ 
      src: [PREMIUM_SOUNDS.coins], 
      volume: 0.8 
    }),
  };
};