// 🧠 AI 기반 게임 밸런싱 & 개인화 시스템
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// 🎯 플레이어 행동 패턴 분석
interface PlayerBehaviorProfile {
  // 플레이 스타일
  playingStyle: 'conservative' | 'balanced' | 'aggressive' | 'risk_taker';
  
  // 세션 패턴
  avgSessionDuration: number; // 분
  preferredPlayTime: 'morning' | 'afternoon' | 'evening' | 'night';
  weeklyPlayFrequency: number;
  
  // 베팅 패턴
  avgBetAmount: number;
  betProgressionPattern: 'flat' | 'martingale' | 'fibonacci' | 'custom';
  riskTolerance: number; // 0-1
  
  // 선호도
  preferredSymbols: string[];
  favoriteFeatures: string[];
  preferredGameModes: string[];
  
  // 성과 지표
  winRate: number;
  bigWinFrequency: number;
  longestSession: number;
  totalSpins: number;
  
  // 감정적 패턴
  frustrationLevel: number; // 0-1
  excitementLevel: number; // 0-1
  engagementScore: number; // 0-1
}

// 🎰 동적 게임 파라미터
interface DynamicGameParameters {
  // 확률 조정
  baseWinProbability: number;
  bonusFeatureProbability: number;
  jackpotMultiplier: number;
  
  // 경제 밸런스
  rtpTarget: number; // Return to Player %
  volatilityIndex: number;
  maxConsecutiveLosses: number;
  
  // 개인화 요소
  personalizedSymbolWeights: Record<string, number>;
  adaptiveBetSuggestions: number[];
  customizedRewards: string[];
}

// 🧮 머신러닝 기반 분석 엔진
class AIAnalysisEngine {
  // private behaviorHistory: GameSession[] = [];
  // private predictionModel: PredictionModel | null = null;

  // 플레이어 행동 분석
  analyzePlayerBehavior(sessions: GameSession[]): PlayerBehaviorProfile {
    const totalSessions = sessions.length;
    if (totalSessions === 0) {
      return this.getDefaultProfile();
    }

    // 세션 시간 분석
    const sessionDurations = sessions.map(s => s.duration);
    const avgSessionDuration = sessionDurations.reduce((a, b) => a + b, 0) / totalSessions;
    
    // 베팅 패턴 분석
    const allBets = sessions.flatMap(s => s.spins.map(spin => spin.betAmount));
    const avgBetAmount = allBets.reduce((a, b) => a + b, 0) / allBets.length;
    
    // 승률 계산
    const totalSpins = sessions.reduce((total, session) => total + session.spins.length, 0);
    const totalWins = sessions.reduce((total, session) => 
      total + session.spins.filter(spin => spin.payout > 0).length, 0);
    const winRate = totalWins / totalSpins;
    
    // 리스크 톨러런스 분석
    const maxBet = Math.max(...allBets);
    const minBet = Math.min(...allBets);
    const riskTolerance = maxBet > minBet * 5 ? 0.8 : 0.4;
    
    // 플레이 스타일 결정
    const playingStyle = this.determinePlayingStyle(avgBetAmount, riskTolerance, winRate);
    
    // 선호 심볼 분석
    const symbolCounts: Record<string, number> = {};
    sessions.forEach(session => {
      session.spins.forEach(spin => {
        spin.symbols.forEach(symbol => {
          symbolCounts[symbol] = (symbolCounts[symbol] || 0) + 1;
        });
      });
    });
    
    const preferredSymbols = Object.entries(symbolCounts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 3)
      .map(([symbol]) => symbol);

    return {
      playingStyle,
      avgSessionDuration,
      preferredPlayTime: this.determinePreferredTime(sessions),
      weeklyPlayFrequency: this.calculateWeeklyFrequency(sessions),
      avgBetAmount,
      betProgressionPattern: this.analyzeBetProgression(sessions),
      riskTolerance,
      preferredSymbols,
      favoriteFeatures: this.analyzeFavoriteFeatures(sessions),
      preferredGameModes: ['classic'], // 기본값
      winRate,
      bigWinFrequency: this.calculateBigWinFrequency(sessions),
      longestSession: Math.max(...sessionDurations),
      totalSpins,
      frustrationLevel: this.calculateFrustrationLevel(sessions),
      excitementLevel: this.calculateExcitementLevel(sessions),
      engagementScore: this.calculateEngagementScore(sessions)
    };
  }

  private getDefaultProfile(): PlayerBehaviorProfile {
    return {
      playingStyle: 'balanced',
      avgSessionDuration: 15,
      preferredPlayTime: 'evening',
      weeklyPlayFrequency: 3,
      avgBetAmount: 1000,
      betProgressionPattern: 'flat',
      riskTolerance: 0.5,
      preferredSymbols: ['🎰', '🍀', '💎'],
      favoriteFeatures: ['free_spins'],
      preferredGameModes: ['classic'],
      winRate: 0.3,
      bigWinFrequency: 0.05,
      longestSession: 30,
      totalSpins: 0,
      frustrationLevel: 0.3,
      excitementLevel: 0.7,
      engagementScore: 0.5
    };
  }

  private determinePlayingStyle(avgBet: number, riskTolerance: number, winRate: number): PlayerBehaviorProfile['playingStyle'] {
    if (riskTolerance > 0.7 && avgBet > 5000) return 'risk_taker';
    if (riskTolerance > 0.5 && winRate < 0.25) return 'aggressive';
    if (riskTolerance < 0.3 && avgBet < 1000) return 'conservative';
    return 'balanced';
  }

  private determinePreferredTime(sessions: GameSession[]): 'morning' | 'afternoon' | 'evening' | 'night' {
    const timeSlots = { morning: 0, afternoon: 0, evening: 0, night: 0 };
    
    sessions.forEach(session => {
      const hour = new Date(session.startTime).getHours();
      if (hour >= 6 && hour < 12) timeSlots.morning++;
      else if (hour >= 12 && hour < 18) timeSlots.afternoon++;
      else if (hour >= 18 && hour < 24) timeSlots.evening++;
      else timeSlots.night++;
    });

    return Object.entries(timeSlots).reduce((a, b) => 
      timeSlots[a[0] as keyof typeof timeSlots] > timeSlots[b[0] as keyof typeof timeSlots] ? a : b
    )[0] as 'morning' | 'afternoon' | 'evening' | 'night';
  }

  private calculateWeeklyFrequency(sessions: GameSession[]): number {
    if (sessions.length < 2) return 1;
    
    const firstSession = Math.min(...sessions.map(s => new Date(s.startTime).getTime()));
    const lastSession = Math.max(...sessions.map(s => new Date(s.startTime).getTime()));
    const weeksDiff = (lastSession - firstSession) / (7 * 24 * 60 * 60 * 1000);
    
    return sessions.length / Math.max(weeksDiff, 1);
  }

  private analyzeBetProgression(_sessions: GameSession[]): PlayerBehaviorProfile['betProgressionPattern'] {
    // 간단한 패턴 분석 - 실제로는 더 복잡한 알고리즘 필요
    return 'flat'; // 기본값
  }

  private analyzeFavoriteFeatures(_sessions: GameSession[]): string[] {
    // 보너스 피처 사용 빈도 분석
    return ['free_spins', 'wild_symbols'];
  }

  private calculateBigWinFrequency(sessions: GameSession[]): number {
    const allSpins = sessions.flatMap(s => s.spins);
    const bigWins = allSpins.filter(spin => spin.payout > spin.betAmount * 10);
    return bigWins.length / allSpins.length;
  }

  private calculateFrustrationLevel(sessions: GameSession[]): number {
    // 연속 패배 세션 비율로 계산
    // const consecutiveLossSessions = 0; // 추후 구현 예정
    let maxConsecutive = 0;
    let current = 0;

    sessions.forEach(session => {
      const totalPayout = session.spins.reduce((sum, spin) => sum + spin.payout, 0);
      const totalBet = session.spins.reduce((sum, spin) => sum + spin.betAmount, 0);
      
      if (totalPayout < totalBet) {
        current++;
        maxConsecutive = Math.max(maxConsecutive, current);
      } else {
        current = 0;
      }
    });

    return Math.min(maxConsecutive / 10, 1); // 10연패 시 최대 좌절감
  }

  private calculateExcitementLevel(sessions: GameSession[]): number {
    // 큰 승리의 빈도와 크기로 계산
    const bigWinFreq = this.calculateBigWinFrequency(sessions);
    return Math.min(bigWinFreq * 10, 1);
  }

  private calculateEngagementScore(sessions: GameSession[]): number {
    if (sessions.length === 0) return 0.5;
    
    const avgSessionLength = sessions.reduce((sum, s) => sum + s.duration, 0) / sessions.length;
    const frequency = this.calculateWeeklyFrequency(sessions);
    
    // 15분 이상 세션, 주 3회 이상 플레이 시 높은 참여도
    const lengthScore = Math.min(avgSessionLength / 15, 1);
    const frequencyScore = Math.min(frequency / 3, 1);
    
    return (lengthScore + frequencyScore) / 2;
  }

  // 🎯 동적 난이도 조정
  calculateOptimalParameters(profile: PlayerBehaviorProfile): DynamicGameParameters {
    let baseWinProbability = 0.3; // 기본 30% 승률
    let rtpTarget = 0.96; // 기본 96% RTP
    let volatilityIndex = 0.5;

    // 플레이어 스타일에 따른 조정
    switch (profile.playingStyle) {
      case 'conservative':
        baseWinProbability = 0.35; // 더 높은 승률
        volatilityIndex = 0.3; // 낮은 변동성
        break;
      case 'aggressive':
        baseWinProbability = 0.25; // 낮은 승률
        volatilityIndex = 0.8; // 높은 변동성
        break;
      case 'risk_taker':
        baseWinProbability = 0.2; // 매우 낮은 승률
        volatilityIndex = 1.0; // 최고 변동성
        rtpTarget = 0.98; // 높은 RTP로 보상
        break;
    }

    // 좌절감이 높으면 승률 증가
    if (profile.frustrationLevel > 0.7) {
      baseWinProbability += 0.1;
      rtpTarget += 0.02;
    }

    // 참여도가 낮으면 흥미 유발 요소 추가
    if (profile.engagementScore < 0.3) {
      baseWinProbability += 0.05;
      volatilityIndex += 0.2;
    }

    return {
      baseWinProbability: Math.min(baseWinProbability, 0.5),
      bonusFeatureProbability: 0.05 + (profile.excitementLevel * 0.03),
      jackpotMultiplier: 1 + (profile.riskTolerance * 2),
      rtpTarget: Math.min(rtpTarget, 0.99),
      volatilityIndex: Math.min(volatilityIndex, 1.0),
      maxConsecutiveLosses: profile.playingStyle === 'conservative' ? 5 : 10,
      personalizedSymbolWeights: this.createSymbolWeights(profile.preferredSymbols),
      adaptiveBetSuggestions: this.generateBetSuggestions(profile),
      customizedRewards: []
    };
  }

  private createSymbolWeights(preferredSymbols: string[]): Record<string, number> {
    const weights: Record<string, number> = {};
    preferredSymbols.forEach((symbol, index) => {
      weights[symbol] = 1.2 - (index * 0.1); // 선호 순서에 따라 가중치
    });
    return weights;
  }

  private generateBetSuggestions(profile: PlayerBehaviorProfile): number[] {
    const base = profile.avgBetAmount;
    return [
      Math.floor(base * 0.5),
      base,
      Math.floor(base * 1.5),
      Math.floor(base * 2),
      Math.floor(base * 3)
    ];
  }
}

// 📊 실시간 적응형 시스템
class AdaptiveGameSystem {
  private currentStreak = 0;
  private streakType: 'win' | 'loss' | 'none' = 'none';
  private sessionStartTime = Date.now();
  private recentPerformance: SpinResult[] = [];

  updateGameState(result: SpinResult, profile: PlayerBehaviorProfile): DynamicGameParameters {
    this.recentPerformance.push(result);
    
    // 최근 50스핀만 유지
    if (this.recentPerformance.length > 50) {
      this.recentPerformance = this.recentPerformance.slice(-50);
    }

    this.updateStreak(result);
    
    const sessionDuration = (Date.now() - this.sessionStartTime) / (1000 * 60); // 분
    const engine = new AIAnalysisEngine();
    let parameters = engine.calculateOptimalParameters(profile);

    // 실시간 조정
    parameters = this.applyRealTimeAdjustments(parameters, sessionDuration);
    
    return parameters;
  }

  private updateStreak(result: SpinResult) {
    const isWin = result.payout > result.betAmount;
    
    if (isWin && this.streakType === 'win') {
      this.currentStreak++;
    } else if (!isWin && this.streakType === 'loss') {
      this.currentStreak++;
    } else {
      this.currentStreak = 1;
      this.streakType = isWin ? 'win' : 'loss';
    }
  }

  private applyRealTimeAdjustments(
    parameters: DynamicGameParameters, 
    sessionDuration: number
  ): DynamicGameParameters {
    const adjusted = { ...parameters };

    // 긴 패배 연속 시 도움
    if (this.streakType === 'loss' && this.currentStreak >= 8) {
      adjusted.baseWinProbability *= 1.2;
      adjusted.bonusFeatureProbability *= 1.5;
    }

    // 긴 승리 연속 시 밸런스 조정
    if (this.streakType === 'win' && this.currentStreak >= 5) {
      adjusted.baseWinProbability *= 0.9;
    }

    // 세션 초기에는 더 관대하게
    if (sessionDuration < 5) {
      adjusted.baseWinProbability *= 1.1;
    }

    // 긴 세션에서는 흥미 유발
    if (sessionDuration > 30) {
      adjusted.bonusFeatureProbability *= 1.3;
      adjusted.jackpotMultiplier *= 1.2;
    }

    return adjusted;
  }

  getPersonalizedRecommendations(profile: PlayerBehaviorProfile): GameRecommendation[] {
    const recommendations: GameRecommendation[] = [];

    // 베팅 추천
    if (profile.riskTolerance < 0.4) {
      recommendations.push({
        type: 'bet_suggestion',
        message: '안전한 베팅으로 꾸준한 재미를 즐겨보세요!',
        suggestedBet: Math.floor(profile.avgBetAmount * 0.7),
        icon: '🛡️'
      });
    }

    // 피처 추천
    if (profile.excitementLevel < 0.4) {
      recommendations.push({
        type: 'feature_unlock',
        message: '보너스 라운드로 더 큰 재미를 경험해보세요!',
        feature: 'bonus_round',
        icon: '🎁'
      });
    }

    // 시간 추천
    const currentHour = new Date().getHours();
    if (profile.preferredPlayTime === 'evening' && currentHour >= 18) {
      recommendations.push({
        type: 'timing',
        message: '지금이 당신의 행운의 시간입니다!',
        icon: '🌟'
      });
    }

    return recommendations;
  }
}

// 타입 정의들
interface GameSession {
  id: string;
  startTime: string;
  duration: number; // 분
  spins: SpinResult[];
  totalBet: number;
  totalPayout: number;
}

interface SpinResult {
  betAmount: number;
  symbols: string[];
  payout: number;
  timestamp: string;
  bonusTriggered: boolean;
}

// interface PredictionModel {
//   predictNextOutcome: (history: SpinResult[]) => number;
//   updateModel: (newData: SpinResult[]) => void;
// }

interface GameRecommendation {
  type: 'bet_suggestion' | 'feature_unlock' | 'timing' | 'strategy';
  message: string;
  suggestedBet?: number;
  feature?: string;
  icon: string;
}

// 상태 관리
interface AIGameState {
  playerProfile: PlayerBehaviorProfile | null;
  currentParameters: DynamicGameParameters | null;
  adaptiveSystem: AdaptiveGameSystem;
  gameHistory: GameSession[];
  recommendations: GameRecommendation[];
  
  updateProfile: (sessions: GameSession[]) => void;
  recordSpin: (result: SpinResult) => void;
  getRecommendations: () => GameRecommendation[];
}

export const useAIGameStore = create<AIGameState>()(
  persist(
    (set, get) => ({
      playerProfile: null,
      currentParameters: null,
      adaptiveSystem: new AdaptiveGameSystem(),
      gameHistory: [],
      recommendations: [],

      updateProfile: (sessions: GameSession[]) => {
        const engine = new AIAnalysisEngine();
        const profile = engine.analyzePlayerBehavior(sessions);
        const parameters = engine.calculateOptimalParameters(profile);
        
        set({
          playerProfile: profile,
          currentParameters: parameters,
          gameHistory: sessions
        });
      },

      recordSpin: (result: SpinResult) => {
        const { playerProfile, adaptiveSystem } = get();
        
        if (playerProfile) {
          const updatedParameters = adaptiveSystem.updateGameState(result, playerProfile);
          
          set({
            currentParameters: updatedParameters,
            recommendations: adaptiveSystem.getPersonalizedRecommendations(playerProfile)
          });
        }
      },

      getRecommendations: () => {
        const { playerProfile, adaptiveSystem } = get();
        if (playerProfile) {
          return adaptiveSystem.getPersonalizedRecommendations(playerProfile);
        }
        return [];
      }
    }),
    {
      name: 'ai-game-storage'
    }
  )
);

export {
  AIAnalysisEngine,
  AdaptiveGameSystem,
  type PlayerBehaviorProfile,
  type DynamicGameParameters,
  type GameSession,
  type SpinResult,
  type GameRecommendation
};