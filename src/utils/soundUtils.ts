// 사운드 생성 유틸리티

export type OscillatorType = 'sine' | 'square' | 'sawtooth' | 'triangle';

// 싱글톤 AudioContext
let sharedAudioContext: AudioContext | null = null;
function getAudioContext(): AudioContext {
  if (!sharedAudioContext) {
    const win = window as Window & typeof globalThis & { webkitAudioContext?: typeof AudioContext };
    sharedAudioContext = win.AudioContext ? new win.AudioContext() : win.webkitAudioContext ? new win.webkitAudioContext() : null;
    if (!sharedAudioContext) throw new Error('Web Audio API not supported');
  }
  return sharedAudioContext;
}

export function createBeepSound(frequency: number, duration: number, type: OscillatorType = 'sine') {
  return {
    play: () => {
      try {
        const audioContext = getAudioContext();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        oscillator.frequency.value = frequency;
        oscillator.type = type;
        gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + duration);
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + duration);
      } catch (error) {
        console.warn('Audio not supported:', error);
      }
    }
  };
}

export function createMelodySound(notes: { freq: number; duration: number }[]) {
  return {
    play: () => {
      try {
        const audioContext = getAudioContext();
        let startTime = audioContext.currentTime;
        notes.forEach((note) => {
          const oscillator = audioContext.createOscillator();
          const gainNode = audioContext.createGain();
          oscillator.connect(gainNode);
          gainNode.connect(audioContext.destination);
          oscillator.frequency.value = note.freq;
          oscillator.type = 'sine';
          gainNode.gain.setValueAtTime(0.2, startTime);
          gainNode.gain.exponentialRampToValueAtTime(0.01, startTime + note.duration);
          oscillator.start(startTime);
          oscillator.stop(startTime + note.duration);
          startTime += note.duration * 0.8;
        });
      } catch (error) {
        console.warn('Audio not supported:', error);
      }
    }
  };
}
