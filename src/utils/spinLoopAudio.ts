// 릴 스피닝 중 반복 사운드 제어 유틸
let spinAudio: HTMLAudioElement | null = null;

export function startSpinLoop() {
  if (spinAudio) {
    spinAudio.pause();
    spinAudio.currentTime = 0;
  }
  spinAudio = new Audio('/sounds/effects/mixkit-game-spinning-machine-2645.wav'); // 릴 회전 loop 사운드
  spinAudio.loop = true;
  spinAudio.volume = 0.6;
  spinAudio.play();
}

export function stopSpinLoop() {
  if (spinAudio) {
    spinAudio.pause();
    spinAudio.currentTime = 0;
    spinAudio = null;
  }
}
