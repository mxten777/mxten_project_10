// 🎰 극한 프리미엄 게임 메커니즘 시스템
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// 🎯 프리미엄 게임 상태 관리
interface PremiumGameState {
  // 기본 게임 상태
  level: number;
  experience: number;
  totalSpins: number;
  totalWins: number;
  biggestWin: number;
  streak: number;
  
  // 프리미엄 기능
  multiplier: number;
  jackpotProgress: number;
  bonusRoundsUnlocked: number;
  achievements: Achievement[];
  
  // 멀티플레이어
  playerRank: number;
  seasonPoints: number;
  
  // 고급 기능
  autoSpinSettings: AutoSpinSettings;
  customSymbols: CustomSymbol[];
  personalizedSettings: PersonalizedSettings;
  
  // 액션들
  levelUp: () => void;
  addExperience: (amount: number) => void;
  incrementStreak: () => void;
  resetStreak: () => void;
  unlockAchievement: (id: string) => void;
  updateJackpot: (amount: number) => void;
}

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlocked: boolean;
  unlockedAt?: Date;
  reward: {
    type: 'coins' | 'multiplier' | 'symbol' | 'feature';
    value: number;
  };
}

interface AutoSpinSettings {
  enabled: boolean;
  count: number;
  stopOnWin: boolean;
  stopOnBigWin: boolean;
  stopOnBonusFeature: boolean;
  maxBet: number;
}

interface CustomSymbol {
  id: string;
  emoji: string;
  name: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary' | 'mythic';
  multiplier: number;
  unlocked: boolean;
}

interface PersonalizedSettings {
  difficulty: 'easy' | 'normal' | 'hard' | 'extreme';
  theme: string;
  soundProfile: string;
  preferredFeatures: string[];
}

// 🎊 프리미엄 업적 시스템
const PREMIUM_ACHIEVEMENTS: Achievement[] = [
  {
    id: 'first_spin',
    title: '첫 스핀',
    description: '게임에 첫 발을 내딛다',
    icon: '🎰',
    unlocked: false,
    reward: { type: 'coins', value: 1000 }
  },
  {
    id: 'lucky_seven',
    title: '행운의 7',
    description: '7연승 달성',
    icon: '🍀',
    unlocked: false,
    reward: { type: 'multiplier', value: 2 }
  },
  {
    id: 'jackpot_hunter',
    title: '잭팟 헌터',
    description: '잭팟을 10번 달성',
    icon: '💎',
    unlocked: false,
    reward: { type: 'symbol', value: 1 }
  },
  {
    id: 'master_spinner',
    title: '스핀 마스터',
    description: '10,000번 스핀 달성',
    icon: '👑',
    unlocked: false,
    reward: { type: 'feature', value: 1 }
  },
  {
    id: 'legendary_win',
    title: '전설적 승리',
    description: '100만원 이상 승리',
    icon: '🌟',
    unlocked: false,
    reward: { type: 'multiplier', value: 5 }
  }
];

// 🔮 프리미엄 심볼 시스템
const PREMIUM_SYMBOLS: CustomSymbol[] = [
  // 기본 심볼 (언락됨)
  { id: 'fire', emoji: '🔥', name: '불꽃', rarity: 'common', multiplier: 2, unlocked: true },
  { id: 'lightning', emoji: '⚡', name: '번개', rarity: 'common', multiplier: 2.5, unlocked: true },
  { id: 'star', emoji: '🌟', name: '별', rarity: 'rare', multiplier: 3, unlocked: true },
  
  // 레어 심볼
  { id: 'diamond', emoji: '💎', name: '다이아몬드', rarity: 'epic', multiplier: 5, unlocked: false },
  { id: 'crown', emoji: '👑', name: '왕관', rarity: 'legendary', multiplier: 8, unlocked: false },
  { id: 'phoenix', emoji: '🐉', name: '피닉스', rarity: 'mythic', multiplier: 12, unlocked: false },
  
  // 특수 심볼 (이벤트/업적 보상)
  { id: 'galaxy', emoji: '🌌', name: '은하', rarity: 'mythic', multiplier: 15, unlocked: false },
  { id: 'infinity', emoji: '♾️', name: '무한대', rarity: 'mythic', multiplier: 20, unlocked: false }
];

export const usePremiumGameStore = create<PremiumGameState>()(
  persist(
    (set, get) => ({
      // 기본 상태
      level: 1,
      experience: 0,
      totalSpins: 0,
      totalWins: 0,
      biggestWin: 0,
      streak: 0,
      
      // 프리미엄 상태
      multiplier: 1,
      jackpotProgress: 0,
      bonusRoundsUnlocked: 0,
      achievements: PREMIUM_ACHIEVEMENTS,
      
      // 멀티플레이어
      playerRank: 999999,
      seasonPoints: 0,
      
      // 설정
      autoSpinSettings: {
        enabled: false,
        count: 10,
        stopOnWin: false,
        stopOnBigWin: true,
        stopOnBonusFeature: true,
        maxBet: 10000
      },
      customSymbols: PREMIUM_SYMBOLS,
      personalizedSettings: {
        difficulty: 'normal',
        theme: 'cyber',
        soundProfile: 'premium',
        preferredFeatures: []
      },
      
      // 액션들
      levelUp: () => {
        const { level, experience } = get();
        const expNeeded = level * 1000;
        if (experience >= expNeeded) {
          set({ 
            level: level + 1, 
            experience: experience - expNeeded,
            multiplier: get().multiplier + 0.1 
          });
        }
      },
      
      addExperience: (amount: number) => {
        set({ experience: get().experience + amount });
        get().levelUp();
      },
      
      incrementStreak: () => {
        const newStreak = get().streak + 1;
        set({ streak: newStreak });
        
        // 연승 보너스
        if (newStreak % 5 === 0) {
          set({ multiplier: get().multiplier + 0.5 });
        }
      },
      
      resetStreak: () => {
        set({ streak: 0, multiplier: Math.max(1, get().multiplier - 0.2) });
      },
      
      unlockAchievement: (id: string) => {
        set({
          achievements: get().achievements.map(achievement =>
            achievement.id === id
              ? { ...achievement, unlocked: true, unlockedAt: new Date() }
              : achievement
          )
        });
      },
      
      updateJackpot: (amount: number) => {
        const newProgress = Math.min(100, get().jackpotProgress + amount);
        set({ jackpotProgress: newProgress });
        
        if (newProgress >= 100) {
          // 잭팟 트리거!
          set({ jackpotProgress: 0 });
          return true;
        }
        return false;
      }
    }),
    {
      name: 'premium-game-storage'
    }
  )
);

// 🎪 보너스 라운드 시스템
interface BonusRound {
  type: 'free_spins' | 'mini_game' | 'wheel_fortune' | 'pick_bonus';
  title: string;
  description: string;
  duration: number;
  multiplier: number;
  specialFeatures: string[];
}

export const BONUS_ROUNDS: BonusRound[] = [
  {
    type: 'free_spins',
    title: '프리 스핀 보너스',
    description: '15회 무료 스핀 + 3배 승수',
    duration: 15,
    multiplier: 3,
    specialFeatures: ['wild_expanding', 'sticky_wilds']
  },
  {
    type: 'wheel_fortune',
    title: '행운의 바퀴',
    description: '거대한 상금이 걸린 바퀴를 돌려보세요!',
    duration: 1,
    multiplier: 10,
    specialFeatures: ['instant_win', 'progressive_jackpot']
  },
  {
    type: 'mini_game',
    title: '보물찾기 게임',
    description: '숨겨진 보물을 찾아 추가 보상을 획득하세요!',
    duration: 5,
    multiplier: 5,
    specialFeatures: ['treasure_hunt', 'cascade_wins']
  }
];

// 🎯 스킬 트리 시스템
interface Skill {
  id: string;
  name: string;
  description: string;
  icon: string;
  maxLevel: number;
  currentLevel: number;
  cost: number;
  prerequisites: string[];
  effects: SkillEffect[];
}

interface SkillEffect {
  type: 'win_rate' | 'multiplier' | 'jackpot_chance' | 'bonus_frequency';
  value: number;
  perLevel: number;
}

export const SKILL_TREE: Skill[] = [
  {
    id: 'lucky_charm',
    name: '행운의 부적',
    description: '승리 확률을 증가시킵니다',
    icon: '🍀',
    maxLevel: 10,
    currentLevel: 0,
    cost: 1000,
    prerequisites: [],
    effects: [
      { type: 'win_rate', value: 2, perLevel: 1 }
    ]
  },
  {
    id: 'golden_touch',
    name: '황금손',
    description: '승리 시 획득 코인이 증가합니다',
    icon: '👑',
    maxLevel: 5,
    currentLevel: 0,
    cost: 2500,
    prerequisites: ['lucky_charm'],
    effects: [
      { type: 'multiplier', value: 0.2, perLevel: 0.1 }
    ]
  },
  {
    id: 'jackpot_magnet',
    name: '잭팟 자석',
    description: '잭팟 확률을 대폭 증가시킵니다',
    icon: '💎',
    maxLevel: 3,
    currentLevel: 0,
    cost: 10000,
    prerequisites: ['golden_touch'],
    effects: [
      { type: 'jackpot_chance', value: 5, perLevel: 2 }
    ]
  }
];

// 🏆 시즌 및 리더보드 시스템
// interface SeasonData {
//   id: string;
//   name: string;
//   startDate: Date;
//   endDate: Date;
//   theme: string;
//   rewards: SeasonReward[];
//   leaderboard: PlayerRank[];
// }

// interface SeasonReward {
//   rank: number;
//   coins: number;
//   exclusiveSymbol?: string;
//   title?: string;
// }

// interface PlayerRank {
//   playerId: string;
//   playerName: string;
//   points: number;
//   level: number;
//   avatar: string;
// }

// 🎨 테마 시스템
export const PREMIUM_THEMES = {
  cyber: {
    name: '사이버펑크',
    colors: {
      primary: '#00ffff',
      secondary: '#ff00ff',
      background: 'linear-gradient(135deg, #0a0a0f 0%, #2d1b69 100%)'
    },
    effects: ['neon_glow', 'digital_particles']
  },
  space: {
    name: '우주 탐험',
    colors: {
      primary: '#ffd700',
      secondary: '#4169e1',
      background: 'linear-gradient(135deg, #000011 0%, #1e3a8a 100%)'
    },
    effects: ['star_field', 'nebula_clouds']
  },
  fantasy: {
    name: '판타지 왕국',
    colors: {
      primary: '#daa520',
      secondary: '#9370db',
      background: 'linear-gradient(135deg, #2d5016 0%, #8b4513 100%)'
    },
    effects: ['magic_sparkles', 'enchanted_forest']
  },
  ocean: {
    name: '심해 탐험',
    colors: {
      primary: '#00ced1',
      secondary: '#ff7f50',
      background: 'linear-gradient(135deg, #001133 0%, #003366 100%)'
    },
    effects: ['bubble_trails', 'coral_reef']
  }
};

// 🔊 고급 사운드 프로파일
export const SOUND_PROFILES = {
  premium: {
    name: '프리미엄',
    spin: 'premium_spin.wav',
    win: 'premium_win.wav',
    jackpot: 'premium_jackpot.wav',
    bonus: 'premium_bonus.wav',
    ambient: 'premium_ambient.wav'
  },
  retro: {
    name: '레트로',
    spin: 'retro_spin.wav',
    win: 'retro_win.wav',
    jackpot: 'retro_jackpot.wav',
    bonus: 'retro_bonus.wav',
    ambient: 'retro_ambient.wav'
  },
  orchestral: {
    name: '오케스트라',
    spin: 'orchestral_spin.wav',
    win: 'orchestral_win.wav',
    jackpot: 'orchestral_jackpot.wav',
    bonus: 'orchestral_bonus.wav',
    ambient: 'orchestral_ambient.wav'
  }
};

// 🎯 AI 기반 개인화 시스템
interface GameHistory {
  bet: number;
  symbols: string[];
  win: number;
  timestamp: Date;
}

interface PlayerPreferences {
  preferredBetAmount: number;
  favoriteSymbols: string[];
  playingPattern: 'casual' | 'aggressive' | 'strategic';
  riskTolerance: number;
  sessionLength: number;
}

export class PersonalizationEngine {
  static analyzePlayerBehavior(gameHistory: GameHistory[]): PlayerPreferences {
    const preferences: PlayerPreferences = {
      preferredBetAmount: 0,
      favoriteSymbols: [],
      playingPattern: 'casual',
      riskTolerance: 0.5,
      sessionLength: 0
    };
    
    // 플레이어 행동 분석 로직
    if (gameHistory.length > 0) {
      const totalBets = gameHistory.reduce((sum, game) => sum + game.bet, 0);
      preferences.preferredBetAmount = totalBets / gameHistory.length;
      
      const symbolCounts = gameHistory.reduce((counts, game) => {
        game.symbols.forEach((symbol: string) => {
          counts[symbol] = (counts[symbol] || 0) + 1;
        });
        return counts;
      }, {} as Record<string, number>);
      
      preferences.favoriteSymbols = Object.entries(symbolCounts)
        .sort(([, a], [, b]) => (b as number) - (a as number))
        .slice(0, 3)
        .map(([symbol]) => symbol);
    }
    
    return preferences;
  }
  
  static generatePersonalizedRecommendations(preferences: PlayerPreferences) {
    return {
      recommendedBet: Math.max(100, Math.min(preferences.preferredBetAmount, 5000)),
      suggestedTheme: preferences.riskTolerance > 0.7 ? 'cyber' : 'fantasy',
      personalizedOffers: [
        '당신의 플레이 스타일에 맞는 특별 보너스!',
        '좋아하는 심볼이 포함된 이벤트가 진행 중입니다!',
        '오늘 특별히 높은 승률을 기록하고 있어요!'
      ]
    };
  }
}

export default {
  usePremiumGameStore,
  BONUS_ROUNDS,
  SKILL_TREE,
  PREMIUM_THEMES,
  SOUND_PROFILES,
  PersonalizationEngine
};