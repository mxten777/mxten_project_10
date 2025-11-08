// 웅장한 실제 게임 사운드 효과 관리 유틸
// mp3/wav 파일 기반 Audio 객체로 효과음 재생

export const playEffect = (name: 'spin' | 'win' | 'jackpot' | 'fail') => {
  const files: Record<string, string> = {
    spin: '/sounds/effects/spin.mp3', // 스핀 효과음
    win: '/sounds/effects/win.mp3',   // 승리 효과음
    jackpot: '/sounds/effects/jackpot.mp3', // 잭팟 효과음
    fail: '/sounds/effects/fail.mp3', // 실패 효과음
  };
  const audio = new Audio(files[name]);
  audio.volume = 0.7;
  audio.play();
};

// 사용 예시: playEffect('spin');
