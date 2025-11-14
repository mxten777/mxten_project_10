// ⚡ 극한 프리미엄 성능 최적화 시스템
import { useMemo, useEffect, useState, lazy } from 'react';
import { create } from 'zustand';

// 🚀 성능 모니터링 시스템
class PerformanceMonitor {
  private fps = 60;
  private frameCount = 0;
  private lastTime = performance.now();
  private memoryUsage = 0;
  private renderTime = 0;
  private listeners: PerformanceListener[] = [];

  constructor() {
    this.startMonitoring();
  }

  private startMonitoring() {
    const monitor = () => {
      const now = performance.now();
      this.frameCount++;
      
      if (now - this.lastTime >= 1000) {
        this.fps = this.frameCount;
        this.frameCount = 0;
        this.lastTime = now;
        
        // 메모리 사용량 측정
        if ('memory' in performance) {
          const memory = (performance as any).memory;
          this.memoryUsage = memory.usedJSHeapSize / memory.jsHeapSizeLimit;
        }
        
        this.notifyListeners();
      }
      
      requestAnimationFrame(monitor);
    };
    
    requestAnimationFrame(monitor);
  }

  addListener(listener: PerformanceListener) {
    this.listeners.push(listener);
  }

  removeListener(listener: PerformanceListener) {
    this.listeners = this.listeners.filter(l => l !== listener);
  }

  private notifyListeners() {
    const metrics: PerformanceMetrics = {
      fps: this.fps,
      memoryUsage: this.memoryUsage,
      renderTime: this.renderTime
    };
    
    this.listeners.forEach(listener => listener(metrics));
  }

  getFPS(): number {
    return this.fps;
  }

  getMemoryUsage(): number {
    return this.memoryUsage;
  }
}

interface PerformanceMetrics {
  fps: number;
  memoryUsage: number;
  renderTime: number;
}

type PerformanceListener = (metrics: PerformanceMetrics) => void;

// 🎯 적응형 품질 조정 시스템
class AdaptiveQualitySystem {
  private currentQuality: 'low' | 'medium' | 'high' | 'ultra' = 'high';
  private performanceHistory: number[] = [];
  private monitor: PerformanceMonitor;

  constructor(monitor: PerformanceMonitor) {
    this.monitor = monitor;
    this.monitor.addListener(this.handlePerformanceUpdate.bind(this));
  }

  private handlePerformanceUpdate(metrics: PerformanceMetrics) {
    this.performanceHistory.push(metrics.fps);
    
    // 최근 10프레임의 평균 FPS로 품질 결정
    if (this.performanceHistory.length > 10) {
      this.performanceHistory = this.performanceHistory.slice(-10);
    }
    
    const avgFPS = this.performanceHistory.reduce((a, b) => a + b, 0) / this.performanceHistory.length;
    
    // 품질 자동 조정
    if (avgFPS < 30 && this.currentQuality !== 'low') {
      this.adjustQuality('low');
    } else if (avgFPS < 45 && this.currentQuality === 'ultra') {
      this.adjustQuality('high');
    } else if (avgFPS < 50 && this.currentQuality === 'high') {
      this.adjustQuality('medium');
    } else if (avgFPS > 55 && this.currentQuality === 'low') {
      this.adjustQuality('medium');
    } else if (avgFPS > 58 && this.currentQuality === 'medium') {
      this.adjustQuality('high');
    }
  }

  private adjustQuality(newQuality: typeof this.currentQuality) {
    if (newQuality !== this.currentQuality) {
      console.log(`품질 조정: ${this.currentQuality} → ${newQuality}`);
      this.currentQuality = newQuality;
      
      // 품질 변경 이벤트 발생
      window.dispatchEvent(new CustomEvent('qualityChanged', {
        detail: { quality: newQuality }
      }));
    }
  }

  getCurrentQuality(): typeof this.currentQuality {
    return this.currentQuality;
  }

  getQualitySettings() {
    const settings = {
      low: {
        particleCount: 100,
        shadowQuality: 'off',
        postProcessing: false,
        textureQuality: 'low',
        animationSmoothing: false
      },
      medium: {
        particleCount: 500,
        shadowQuality: 'basic',
        postProcessing: false,
        textureQuality: 'medium',
        animationSmoothing: true
      },
      high: {
        particleCount: 1000,
        shadowQuality: 'high',
        postProcessing: true,
        textureQuality: 'high',
        animationSmoothing: true
      },
      ultra: {
        particleCount: 2000,
        shadowQuality: 'ultra',
        postProcessing: true,
        textureQuality: 'ultra',
        animationSmoothing: true
      }
    };

    return settings[this.currentQuality];
  }
}

// 🗂️ 메모리 관리 시스템
class MemoryManager {
  private textureCache = new Map<string, any>();
  private audioCache = new Map<string, any>();
  private maxTextureCache = 50;
  private maxAudioCache = 20;

  // 텍스처 캐시 관리
  cacheTexture(key: string, texture: any) {
    if (this.textureCache.size >= this.maxTextureCache) {
      const firstKey = this.textureCache.keys().next().value;
      if (firstKey) {
        const oldTexture = this.textureCache.get(firstKey);
        if (oldTexture && oldTexture.dispose) {
          oldTexture.dispose();
        }
        this.textureCache.delete(firstKey);
      }
    }
    
    this.textureCache.set(key, texture);
  }

  getTexture(key: string): any {
    return this.textureCache.get(key);
  }

  // 오디오 캐시 관리
  cacheAudio(key: string, audio: any) {
    if (this.audioCache.size >= this.maxAudioCache) {
      const firstKey = this.audioCache.keys().next().value;
      if (firstKey) {
        this.audioCache.delete(firstKey);
      }
    }
    
    this.audioCache.set(key, audio);
  }

  getAudio(key: string): any {
    return this.audioCache.get(key);
  }

  // 메모리 정리
  clearUnusedAssets() {
    // 사용되지 않는 텍스처 정리
    this.textureCache.forEach((texture, key) => {
      if (texture && texture.dispose && !texture.isUsed) {
        texture.dispose();
        this.textureCache.delete(key);
      }
    });

    // 가비지 컬렉션 요청 (가능한 경우)
    if (window.gc) {
      window.gc();
    }
  }
}

// 🔄 리소스 프리로딩 시스템
class ResourcePreloader {
  // private loadQueue: LoadTask[] = [];
  // private isLoading = false;
  private loadedResources = new Set<string>();

  async preloadCriticalResources() {
    const criticalResources = [
      // 텍스처
      { type: 'texture', url: '/textures/slot-bg.jpg', key: 'slot-bg' },
      { type: 'texture', url: '/textures/particle.png', key: 'particle' },
      
      // 오디오
      { type: 'audio', url: '/audio/spin.mp3', key: 'spin-sound' },
      { type: 'audio', url: '/audio/win.mp3', key: 'win-sound' },
      
      // 3D 모델
      { type: 'model', url: '/models/slot-machine.glb', key: 'slot-machine' }
    ];

    return Promise.all(criticalResources.map(resource => this.loadResource(resource as LoadTask)));
  }

  private async loadResource(task: LoadTask): Promise<void> {
    if (this.loadedResources.has(task.key)) {
      return;
    }

    try {
      switch (task.type) {
        case 'texture':
          await this.loadTexture(task);
          break;
        case 'audio':
          await this.loadAudio(task);
          break;
        case 'model':
          await this.loadModel(task);
          break;
      }
      
      this.loadedResources.add(task.key);
    } catch (error) {
      console.warn(`리소스 로딩 실패: ${task.url}`, error);
    }
  }

  private loadTexture(task: LoadTask): Promise<void> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve();
      img.onerror = reject;
      img.src = task.url;
    });
  }

  private loadAudio(task: LoadTask): Promise<void> {
    return new Promise((resolve, reject) => {
      const audio = new Audio();
      audio.oncanplaythrough = () => resolve();
      audio.onerror = reject;
      audio.src = task.url;
    });
  }

  private loadModel(task: LoadTask): Promise<void> {
    return fetch(task.url).then(() => {});
  }
}

interface LoadTask {
  type: 'texture' | 'audio' | 'model';
  url: string;
  key: string;
}

// 🔧 성능 최적화 훅
export const usePerformanceOptimization = () => {
  const performanceMonitor = useMemo(() => new PerformanceMonitor(), []);
  const qualitySystem = useMemo(() => new AdaptiveQualitySystem(performanceMonitor), [performanceMonitor]);
  const memoryManager = useMemo(() => new MemoryManager(), []);
  const [performanceMetrics, setPerformanceMetrics] = useState<PerformanceMetrics>({
    fps: 60,
    memoryUsage: 0,
    renderTime: 0
  });

  useEffect(() => {
    const handlePerformance = (metrics: PerformanceMetrics) => {
      setPerformanceMetrics(metrics);
    };

    performanceMonitor.addListener(handlePerformance);
    
    return () => {
      performanceMonitor.removeListener(handlePerformance);
    };
  }, [performanceMonitor]);

  // 메모리 정리 (5분마다)
  useEffect(() => {
    const interval = setInterval(() => {
      memoryManager.clearUnusedAssets();
    }, 5 * 60 * 1000);

    return () => clearInterval(interval);
  }, [memoryManager]);

  return {
    performanceMetrics,
    qualitySettings: qualitySystem.getQualitySettings(),
    currentQuality: qualitySystem.getCurrentQuality(),
    memoryManager
  };
};

// 🚀 코드 스플리팅 최적화
export const OptimizedComponents = {
  // 현재 사용 중인 컴포넌트들만 포함
  SlotMachineBoard: lazy(() => import('../components/SlotMachineBoard')),

  // 메모화된 컴포넌트들 (참고용 - 실제 JSX는 컴포넌트 파일에서 구현)
  createMemoizedSlotReel: (symbol: string, isSpinning: boolean) => ({
    symbol,
    isSpinning,
    className: `slot-reel ${isSpinning ? 'spinning' : ''}`
  }),

  createMemoizedParticles: (intensity: number, type: string) => ({
    intensity,
    type,
    loading: '파티클 로딩 중...'
  })
};

// 📱 PWA 설정
export const PWAConfig = {
  name: '프리미엄 슬롯머신',
  shortName: 'PremiumSlots',
  description: '최고급 3D 슬롯머신 게임',
  themeColor: '#6366f1',
  backgroundColor: '#1e1b4b',
  display: 'standalone',
  orientation: 'portrait-primary',
  startUrl: '/',
  scope: '/',
  icons: [
    {
      src: '/icons/icon-192.png',
      sizes: '192x192',
      type: 'image/png'
    },
    {
      src: '/icons/icon-512.png',
      sizes: '512x512',
      type: 'image/png'
    },
    {
      src: '/icons/icon-maskable-512.png',
      sizes: '512x512',
      type: 'image/png',
      purpose: 'maskable'
    }
  ]
};

// 🔄 서비스 워커 등록
export const registerServiceWorker = async () => {
  if ('serviceWorker' in navigator) {
    try {
      const registration = await navigator.serviceWorker.register('/sw.js');
      console.log('Service Worker 등록 성공:', registration);
      
      // 업데이트 체크
      registration.addEventListener('updatefound', () => {
        console.log('새 버전 발견, 업데이트 중...');
      });
      
      return registration;
    } catch (error) {
      console.error('Service Worker 등록 실패:', error);
    }
  }
};

// 📊 성능 상태 관리
interface PerformanceState {
  isOptimized: boolean;
  quality: 'low' | 'medium' | 'high' | 'ultra';
  fps: number;
  memoryUsage: number;
  
  setQuality: (quality: PerformanceState['quality']) => void;
  toggleOptimization: () => void;
}

export const usePerformanceStore = create<PerformanceState>((set, get) => ({
  isOptimized: true,
  quality: 'high',
  fps: 60,
  memoryUsage: 0,
  
  setQuality: (quality) => set({ quality }),
  toggleOptimization: () => set({ isOptimized: !get().isOptimized })
}));

// 🎯 성능 최적화 컴포넌트
// interface PerformanceOptimizerProps {
//   children: React.ReactNode;
// }

export const usePerformanceOptimizer = () => {
  const { performanceMetrics } = usePerformanceOptimization();
  const { isOptimized } = usePerformanceStore();

  // 품질 변경 리스너
  useEffect(() => {
    const handleQualityChange = (event: CustomEvent) => {
      console.log('품질 변경됨:', event.detail.quality);
    };

    window.addEventListener('qualityChanged', handleQualityChange as EventListener);
    
    return () => {
      window.removeEventListener('qualityChanged', handleQualityChange as EventListener);
    };
  }, []);

  // 성능 경고
  useEffect(() => {
    if (performanceMetrics.fps < 30) {
      console.warn('낮은 FPS 감지:', performanceMetrics.fps);
    }
    
    if (performanceMetrics.memoryUsage > 0.8) {
      console.warn('높은 메모리 사용량:', performanceMetrics.memoryUsage);
    }
  }, [performanceMetrics]);

  return {
    performanceMetrics,
    isOptimized,
    containerClass: `performance-container ${isOptimized ? 'optimized' : ''}`,
    debugInfo: process.env.NODE_ENV === 'development' ? {
      fps: performanceMetrics.fps,
      memory: (performanceMetrics.memoryUsage * 100).toFixed(1) + '%'
    } : null
  };
};

export default {
  PerformanceMonitor,
  AdaptiveQualitySystem,
  MemoryManager,
  ResourcePreloader,
  usePerformanceOptimization,
  OptimizedComponents,
  PWAConfig,
  registerServiceWorker,
  usePerformanceOptimizer
};