// 웅장한 실제 게임 사운드 효과 관리 유틸
// mp3/wav 파일 기반 Audio 객체로 효과음 재생

export const playEffect = (name: 'spin' | 'win' | 'jackpot' | 'fail') => {
  const files: Record<string, string> = {
    spin: '/sounds/effects/mixkit-game-spinning-machine-2645.wav', // 스핀 효과음
    win: '/sounds/effects/mixkit-magical-coin-win-1936.wav',   // 승리 효과음
    jackpot: '/sounds/effects/mixkit-slot-machine-win-alarm-1995.wav', // 잭팟 효과음
    fail: '/sounds/effects/mixkit-slot-machine-win-alert-1931.wav', // 실패 효과음 (임시로 win 사운드 사용)
  };
  
  try {
    const audio = new Audio(files[name]);
    audio.volume = 0.7;
    audio.play().catch(err => {
      console.log('Audio play failed:', err);
    });
  } catch (error) {
    console.log('Audio error:', error);
  }
};

// 사용 예시: playEffect('spin');
