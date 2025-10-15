// 🔊 극한 프리미엄 오디오 시스템
// import React, { useRef, useEffect, useState, useCallback } from 'react';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// 🎵 고급 오디오 컨텍스트 관리
class PremiumAudioEngine {
  private audioContext: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private compressor: DynamicsCompressorNode | null = null;
  private reverb: ConvolverNode | null = null;
  private delay: DelayNode | null = null;
  private filter: BiquadFilterNode | null = null;
  
  // 3D 오디오
  // private listener: AudioListener | null = null;
  private pannerNodes: Map<string, PannerNode> = new Map();
  
  // 동적 BGM
  private bgmTracks: Map<string, AudioBuffer> = new Map();
  private currentBgm: AudioBufferSourceNode | null = null;
  
  // 실시간 오디오 분석
  private analyzer: AnalyserNode | null = null;
  private frequencyData: Uint8Array | null = null;
  
  constructor() {
    this.initializeAudioContext();
  }

  private async initializeAudioContext() {
    try {
      this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      
      // 마스터 게인 노드 (볼륨 컨트롤)
      this.masterGain = this.audioContext.createGain();
      this.masterGain.connect(this.audioContext.destination);
      
      // 컴프레서 (다이나믹 레인지 컨트롤)
      this.compressor = this.audioContext.createDynamicsCompressor();
      this.compressor.threshold.setValueAtTime(-24, this.audioContext.currentTime);
      this.compressor.knee.setValueAtTime(30, this.audioContext.currentTime);
      this.compressor.ratio.setValueAtTime(12, this.audioContext.currentTime);
      this.compressor.attack.setValueAtTime(0.003, this.audioContext.currentTime);
      this.compressor.release.setValueAtTime(0.25, this.audioContext.currentTime);
      this.compressor.connect(this.masterGain);
      
      // 리버브 (공간감)
      await this.createReverb();
      
      // 딜레이 (에코 효과)
      this.delay = this.audioContext.createDelay(1.0);
      this.delay.delayTime.setValueAtTime(0.3, this.audioContext.currentTime);
      
      // 필터 (주파수 조절)
      this.filter = this.audioContext.createBiquadFilter();
      this.filter.type = 'lowpass';
      this.filter.frequency.setValueAtTime(20000, this.audioContext.currentTime);
      
      // 3D 오디오 리스너
      // this.listener = this.audioContext.listener;
      
      // 실시간 분석기
      this.analyzer = this.audioContext.createAnalyser();
      this.analyzer.fftSize = 2048;
      this.frequencyData = new Uint8Array(this.analyzer.frequencyBinCount);
      this.analyzer.connect(this.masterGain);
      
    } catch (error) {
      console.warn('고급 오디오 초기화 실패:', error);
    }
  }

  private async createReverb() {
    if (!this.audioContext) return;
    
    this.reverb = this.audioContext.createConvolver();
    
    // 인공적인 리버브 임펄스 응답 생성
    const sampleRate = this.audioContext.sampleRate;
    const length = sampleRate * 2; // 2초 리버브
    const impulse = this.audioContext.createBuffer(2, length, sampleRate);
    
    for (let channel = 0; channel < 2; channel++) {
      const channelData = impulse.getChannelData(channel);
      for (let i = 0; i < length; i++) {
        const decay = Math.pow(1 - i / length, 2);
        channelData[i] = (Math.random() * 2 - 1) * decay * 0.3;
      }
    }
    
    this.reverb.buffer = impulse;
    this.reverb.connect(this.compressor!);
  }

  // 🎼 프리미엄 사운드 생성
  createPremiumSound(config: PremiumSoundConfig): PremiumSound {
    if (!this.audioContext) {
      const dummyContext = new AudioContext();
      return new PremiumSound(dummyContext, {
        type: 'synthesis',
        synthesis: {
          frequencies: [440],
          waveform: 'sine' as OscillatorType,
          envelope: { 
            attack: 0.1, 
            attackTime: 0.1, 
            decay: 0.1, 
            decayTime: 0.1, 
            sustain: 0.8, 
            releaseTime: 0.2 
          }
        },
        effects: {}
      }, {
        masterGain: dummyContext.createGain(),
        compressor: dummyContext.createDynamicsCompressor(),
        reverb: dummyContext.createConvolver(),
        delay: dummyContext.createDelay(),
        filter: dummyContext.createBiquadFilter()
      });
    }

    return new PremiumSound(this.audioContext, config, {
      masterGain: this.masterGain!,
      compressor: this.compressor!,
      reverb: this.reverb!,
      delay: this.delay!,
      filter: this.filter!
    });
  }

  // 🌊 3D 오디오 생성
  create3DAudio(soundId: string, position: [number, number, number]): PannerNode | null {
    if (!this.audioContext) return null;

    const panner = this.audioContext.createPanner();
    panner.panningModel = 'HRTF';
    panner.distanceModel = 'inverse';
    panner.refDistance = 1;
    panner.maxDistance = 10000;
    panner.rolloffFactor = 1;
    panner.coneInnerAngle = 360;
    panner.coneOuterAngle = 0;
    panner.coneOuterGain = 0;

    panner.positionX.setValueAtTime(position[0], this.audioContext.currentTime);
    panner.positionY.setValueAtTime(position[1], this.audioContext.currentTime);
    panner.positionZ.setValueAtTime(position[2], this.audioContext.currentTime);

    this.pannerNodes.set(soundId, panner);
    return panner;
  }

  // 🎵 동적 BGM 관리
  async playDynamicBGM(trackName: string, fadeInTime: number = 2) {
    if (!this.audioContext || !this.bgmTracks.has(trackName)) return;

    // 현재 BGM 페이드아웃
    if (this.currentBgm) {
      const fadeOutGain = this.audioContext.createGain();
      this.currentBgm.connect(fadeOutGain);
      fadeOutGain.connect(this.masterGain!);
      
      fadeOutGain.gain.setValueAtTime(0.5, this.audioContext.currentTime);
      fadeOutGain.gain.linearRampToValueAtTime(0, this.audioContext.currentTime + fadeInTime);
      
      setTimeout(() => {
        this.currentBgm?.stop();
      }, fadeInTime * 1000);
    }

    // 새 BGM 페이드인
    this.currentBgm = this.audioContext.createBufferSource();
    this.currentBgm.buffer = this.bgmTracks.get(trackName)!;
    this.currentBgm.loop = true;

    const fadeInGain = this.audioContext.createGain();
    this.currentBgm.connect(fadeInGain);
    fadeInGain.connect(this.masterGain!);

    fadeInGain.gain.setValueAtTime(0, this.audioContext.currentTime);
    fadeInGain.gain.linearRampToValueAtTime(0.3, this.audioContext.currentTime + fadeInTime);

    this.currentBgm.start();
  }

  // 📊 오디오 비주얼라이저 데이터
  getVisualizerData(): Uint8Array | null {
    if (!this.analyzer || !this.frequencyData) return null;
    
    this.analyzer.getByteFrequencyData(this.frequencyData as Uint8Array);
    return this.frequencyData;
  }

  // 🎛️ 실시간 이퀄라이저
  updateEqualizer(frequencies: EqualizerBand[]) {
    if (!this.audioContext) return;

    frequencies.forEach(band => {
      const filter = this.audioContext!.createBiquadFilter();
      filter.type = 'peaking';
      filter.frequency.setValueAtTime(band.frequency, this.audioContext!.currentTime);
      filter.Q.setValueAtTime(band.q, this.audioContext!.currentTime);
      filter.gain.setValueAtTime(band.gain, this.audioContext!.currentTime);
      filter.connect(this.compressor!);
    });
  }
}

// 🔊 프리미엄 사운드 클래스
class PremiumSound {
  private audioContext: AudioContext;
  private config: PremiumSoundConfig;
  private nodes: AudioNodes;
  private oscillators: OscillatorNode[] = [];
  private gainNode: GainNode;

  constructor(audioContext: AudioContext, config: PremiumSoundConfig, nodes: AudioNodes) {
    this.audioContext = audioContext;
    this.config = config;
    this.nodes = nodes;
    this.gainNode = audioContext.createGain();
    this.setupAudioChain();
  }

  private setupAudioChain() {
    // 오디오 체인 설정: Source -> Effects -> Master
    let currentNode: AudioNode = this.gainNode;

    if (this.config.effects.reverb) {
      currentNode.connect(this.nodes.reverb);
      currentNode = this.nodes.reverb;
    }

    if (this.config.effects.delay) {
      const delayGain = this.audioContext.createGain();
      delayGain.gain.setValueAtTime(this.config.effects.delay, this.audioContext.currentTime);
      currentNode.connect(this.nodes.delay);
      this.nodes.delay.connect(delayGain);
      delayGain.connect(this.nodes.compressor);
    }

    currentNode.connect(this.nodes.compressor);
  }

  play(duration?: number) {
    const now = this.audioContext.currentTime;
    
    if (this.config.type === 'synthesis') {
      this.playSynthesis(now, duration);
    } else if (this.config.type === 'sequence') {
      this.playSequence(now);
    }
  }

  private playSynthesis(startTime: number, duration: number = 0.5) {
    const { frequencies, waveform, envelope } = this.config.synthesis!;
    
    frequencies.forEach((freq, index) => {
      const osc = this.audioContext.createOscillator();
      const oscGain = this.audioContext.createGain();
      
      osc.type = waveform;
      osc.frequency.setValueAtTime(freq, startTime);
      
      // ADSR 엔벨로프
      oscGain.gain.setValueAtTime(0, startTime);
      oscGain.gain.linearRampToValueAtTime(envelope.attack, startTime + envelope.attackTime);
      oscGain.gain.linearRampToValueAtTime(envelope.decay, startTime + envelope.attackTime + envelope.decayTime);
      oscGain.gain.setValueAtTime(envelope.sustain, startTime + envelope.attackTime + envelope.decayTime);
      oscGain.gain.linearRampToValueAtTime(0, startTime + duration);
      
      osc.connect(oscGain);
      oscGain.connect(this.gainNode);
      
      osc.start(startTime + index * 0.1);
      osc.stop(startTime + duration + index * 0.1);
      
      this.oscillators.push(osc);
    });
  }

  private playSequence(startTime: number) {
    const { notes } = this.config.sequence!;
    
    notes.forEach((note) => {
      const osc = this.audioContext.createOscillator();
      const oscGain = this.audioContext.createGain();
      
      osc.frequency.setValueAtTime(note.frequency, startTime + note.startTime);
      osc.type = 'sine';
      
      oscGain.gain.setValueAtTime(0, startTime + note.startTime);
      oscGain.gain.linearRampToValueAtTime(note.volume, startTime + note.startTime + 0.01);
      oscGain.gain.linearRampToValueAtTime(0, startTime + note.startTime + note.duration);
      
      osc.connect(oscGain);
      oscGain.connect(this.gainNode);
      
      osc.start(startTime + note.startTime);
      osc.stop(startTime + note.startTime + note.duration);
      
      this.oscillators.push(osc);
    });
  }

  stop() {
    this.oscillators.forEach(osc => {
      try {
        osc.stop();
      } catch (e) {
        // 이미 정지된 오실레이터 무시
      }
    });
    this.oscillators = [];
  }

  setVolume(volume: number) {
    this.gainNode.gain.setValueAtTime(volume, this.audioContext.currentTime);
  }
}

// 타입 정의
interface PremiumSoundConfig {
  type: 'synthesis' | 'sequence' | 'sample';
  synthesis?: {
    frequencies: number[];
    waveform: OscillatorType;
    envelope: {
      attack: number;
      attackTime: number;
      decay: number;
      decayTime: number;
      sustain: number;
      releaseTime: number;
    };
  };
  sequence?: {
    notes: {
      frequency: number;
      startTime: number;
      duration: number;
      volume: number;
    }[];
  };
  effects: {
    reverb?: number;
    delay?: number;
    distortion?: number;
    filter?: {
      type: BiquadFilterType;
      frequency: number;
      q: number;
    };
  };
}

interface AudioNodes {
  masterGain: GainNode;
  compressor: DynamicsCompressorNode;
  reverb: ConvolverNode;
  delay: DelayNode;
  filter: BiquadFilterNode;
}

interface EqualizerBand {
  frequency: number;
  gain: number;
  q: number;
}

// 🎵 오디오 상태 관리
interface PremiumAudioState {
  masterVolume: number;
  sfxVolume: number;
  musicVolume: number;
  currentTheme: string;
  equalizerSettings: EqualizerBand[];
  spatialAudioEnabled: boolean;
  audioEngine: PremiumAudioEngine | null;
  
  setMasterVolume: (volume: number) => void;
  setSfxVolume: (volume: number) => void;
  setMusicVolume: (volume: number) => void;
  setTheme: (theme: string) => void;
  initializeAudio: () => void;
}

export const usePremiumAudioStore = create<PremiumAudioState>()(
  persist(
    (set, get) => ({
      masterVolume: 0.8,
      sfxVolume: 0.9,
      musicVolume: 0.6,
      currentTheme: 'cyber',
      equalizerSettings: [
        { frequency: 60, gain: 0, q: 1 },
        { frequency: 170, gain: 0, q: 1 },
        { frequency: 350, gain: 0, q: 1 },
        { frequency: 1000, gain: 0, q: 1 },
        { frequency: 3500, gain: 0, q: 1 },
        { frequency: 10000, gain: 0, q: 1 }
      ],
      spatialAudioEnabled: true,
      audioEngine: null,

      setMasterVolume: (volume: number) => set({ masterVolume: volume }),
      setSfxVolume: (volume: number) => set({ sfxVolume: volume }),
      setMusicVolume: (volume: number) => set({ musicVolume: volume }),
      setTheme: (theme: string) => set({ currentTheme: theme }),
      
      initializeAudio: () => {
        if (!get().audioEngine) {
          set({ audioEngine: new PremiumAudioEngine() });
        }
      }
    }),
    {
      name: 'premium-audio-storage'
    }
  )
);

// 🎼 프리미엄 사운드 프리셋
export const PREMIUM_SOUND_LIBRARY = {
  // 🎰 슬롯 사운드
  slot: {
    spin: {
      type: 'synthesis' as const,
      synthesis: {
        frequencies: [200, 400, 800, 1600],
        waveform: 'sawtooth' as OscillatorType,
        envelope: {
          attack: 0.8,
          attackTime: 0.05,
          decay: 0.3,
          decayTime: 0.1,
          sustain: 0.2,
          releaseTime: 1.5
        }
      },
      effects: {
        reverb: 0.3,
        delay: 0.2,
        filter: {
          type: 'lowpass' as BiquadFilterType,
          frequency: 2000,
          q: 1.2
        }
      }
    },
    
    win: {
      type: 'sequence' as const,
      sequence: {
        notes: [
          { frequency: 523.25, startTime: 0, duration: 0.2, volume: 0.8 }, // C5
          { frequency: 659.25, startTime: 0.1, duration: 0.2, volume: 0.9 }, // E5
          { frequency: 783.99, startTime: 0.2, duration: 0.3, volume: 1.0 }, // G5
          { frequency: 1046.5, startTime: 0.3, duration: 0.5, volume: 1.0 }  // C6
        ]
      },
      effects: {
        reverb: 0.5,
        delay: 0.1
      }
    },
    
    jackpot: {
      type: 'synthesis' as const,
      synthesis: {
        frequencies: [261.63, 329.63, 392.00, 523.25, 659.25], // C Major Chord
        waveform: 'sine' as OscillatorType,
        envelope: {
          attack: 1.0,
          attackTime: 0.2,
          decay: 0.8,
          decayTime: 0.3,
          sustain: 0.6,
          releaseTime: 2.0
        }
      },
      effects: {
        reverb: 0.8,
        delay: 0.4,
        distortion: 0.1
      }
    }
  },
  
  // 🎵 UI 사운드
  ui: {
    button: {
      type: 'synthesis' as const,
      synthesis: {
        frequencies: [800, 1200],
        waveform: 'square' as OscillatorType,
        envelope: {
          attack: 0.5,
          attackTime: 0.01,
          decay: 0.2,
          decayTime: 0.05,
          sustain: 0.1,
          releaseTime: 0.1
        }
      },
      effects: {
        filter: {
          type: 'bandpass' as BiquadFilterType,
          frequency: 1000,
          q: 2.0
        }
      }
    },
    
    notification: {
      type: 'sequence' as const,
      sequence: {
        notes: [
          { frequency: 880, startTime: 0, duration: 0.1, volume: 0.6 },
          { frequency: 1320, startTime: 0.1, duration: 0.15, volume: 0.8 }
        ]
      },
      effects: {
        reverb: 0.2
      }
    }
  }
};

// 🎨 오디오 비주얼라이저 컴포넌트
// interface AudioVisualizerProps {
//   width?: number;
//   height?: number;
//   barCount?: number;
//   color?: string;
//   className?: string;
// }

export const createAudioVisualizer = (
  width = 300,
  height = 100,
  barCount = 32,
  color = '#00ffff'
) => {
  return {
    width,
    height, 
    barCount,
    color,
    // Provide canvas ref and draw function for external use
    canvasRef: null as HTMLCanvasElement | null,
    draw: function(frequencyData: Uint8Array) {
      if (!this.canvasRef) return;
      
      const ctx = this.canvasRef.getContext('2d');
      if (!ctx) return;

      ctx.clearRect(0, 0, width, height);
      
      const barWidth = width / barCount;
      const dataStep = Math.floor(frequencyData.length / barCount);

      for (let i = 0; i < barCount; i++) {
        const dataIndex = i * dataStep;
        const barHeight = (frequencyData[dataIndex] / 255) * height;
        
        const x = i * barWidth;
        const y = height - barHeight;
        
        // 그라데이션 생성
        const gradient = ctx.createLinearGradient(0, height, 0, 0);
        gradient.addColorStop(0, color);
        gradient.addColorStop(1, color + '88');
        
        ctx.fillStyle = gradient;
        ctx.fillRect(x, y, barWidth - 2, barHeight);
        
        // 글로우 효과
        ctx.shadowColor = color;
        ctx.shadowBlur = 10;
        ctx.fillRect(x, y, barWidth - 2, barHeight);
        ctx.shadowBlur = 0;
      }
    }
  };
};

export default {
  PremiumAudioEngine,
  usePremiumAudioStore,
  PREMIUM_SOUND_LIBRARY,
  createAudioVisualizer
};