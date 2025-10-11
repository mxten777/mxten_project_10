# 📡 API 문서

> 프리미엄 슬롯머신 게임 API 레퍼런스

---

## 📋 목차

1. [개요](#개요)
2. [상태 관리 API](#상태-관리-api)
3. [게임 로직 API](#게임-로직-api)
4. [Firebase API](#firebase-api)
5. [사운드 시스템 API](#사운드-시스템-api)
6. [파티클 시스템 API](#파티클-시스템-api)
7. [3D 그래픽 API](#3d-그래픽-api)
8. [애니메이션 API](#애니메이션-api)

---

## 🎯 개요

프리미엄 슬롯머신 게임은 다음과 같은 주요 API 시스템을 제공합니다:

- **상태 관리**: Zustand 기반 전역 상태 관리
- **게임 로직**: 슬롯머신 핵심 로직
- **Firebase**: 실시간 데이터베이스 연동
- **사운드**: Web Audio API 기반 오디오 시스템
- **파티클**: canvas-confetti 파티클 효과
- **3D 그래픽**: Three.js 3D 렌더링
- **애니메이션**: Framer Motion 애니메이션

---

## 🎮 상태 관리 API

### GameStore

게임의 핵심 상태를 관리하는 스토어입니다.

```typescript
interface GameStore {
  // 상태
  score: number;
  combo: number;
  
  // 액션
  setScore: (score: number) => void;
  setCombo: (combo: number) => void;
  resetGame: () => void;
}

// 사용 예시
const { score, setScore } = useGameStore();
```

#### Methods

##### `setScore(score: number): void`
게임 점수를 설정합니다.

**Parameters:**
- `score` (number): 설정할 점수 값

**Example:**
```typescript
const { setScore } = useGameStore();
setScore(1000);
```

##### `setCombo(combo: number): void`
콤보 수를 설정합니다.

**Parameters:**
- `combo` (number): 설정할 콤보 값 (최소 1)

**Example:**
```typescript
const { setCombo } = useGameStore();
setCombo(5);
```

##### `resetGame(): void`
게임 상태를 초기값으로 리셋합니다.

**Example:**
```typescript
const { resetGame } = useGameStore();
resetGame();
```

---

### BalanceStore

사용자의 잔고를 관리하는 스토어입니다.

```typescript
interface BalanceStore {
  // 상태
  balance: number;
  
  // 액션
  setBalance: (balance: number) => void;
  increaseBalance: (amount: number) => void;
  decreaseBalance: (amount: number) => void;
}
```

#### Methods

##### `setBalance(balance: number): void`
잔고를 직접 설정합니다.

**Parameters:**
- `balance` (number): 설정할 잔고 금액

##### `increaseBalance(amount: number): void`
잔고를 증가시킵니다.

**Parameters:**
- `amount` (number): 증가시킬 금액

##### `decreaseBalance(amount: number): void`
잔고를 감소시킵니다.

**Parameters:**
- `amount` (number): 감소시킬 금액

---

### AuthStore

사용자 인증 상태를 관리하는 스토어입니다.

```typescript
interface AuthStore {
  // 상태
  user: User | null;
  uid: string | null;
  
  // 액션
  setUser: (user: User | null) => void;
  logout: () => void;
}
```

---

## 🎰 게임 로직 API

### 심볼 시스템

#### `getRandomSymbol(): string`
랜덤 심볼을 반환합니다.

**Returns:**
- `string`: 랜덤 심볼 ('💎', '🌟', '💥', '🍀', '🎯', '💰', '🔥', '⚡', '🎊' 중 하나)

**Example:**
```typescript
const symbol = getRandomSymbol();
console.log(symbol); // '💎'
```

#### `getRandomSymbols(): string[]`
3x3 그리드용 9개의 랜덤 심볼 배열을 반환합니다.

**Returns:**
- `string[]`: 9개 심볼의 배열

**Example:**
```typescript
const symbols = getRandomSymbols();
console.log(symbols); // ['💎', '🌟', '💥', ...]
```

### 승리 판정 시스템

#### `checkWinningCombinations(symbols: string[]): WinResult[]`
주어진 심볼 배열에서 승리 조합을 찾습니다.

**Parameters:**
- `symbols` (string[]): 9개 심볼의 배열

**Returns:**
- `WinResult[]`: 승리 결과 배열

**Types:**
```typescript
interface WinResult {
  line: number[];
  symbol: string;
  payout: number;
  multiplier: number;
}
```

**Example:**
```typescript
const symbols = ['💎', '💎', '💎', '🌟', '🍀', '🎯', '💰', '🔥', '⚡'];
const wins = checkWinningCombinations(symbols);
console.log(wins); // [{ line: [0, 1, 2], symbol: '💎', payout: 10, multiplier: 3 }]
```

### 페이라인 시스템

#### `PAYLINES: number[][]`
승리 가능한 모든 페이라인 정의

**Value:**
```typescript
const PAYLINES = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8], // 가로줄
  [0, 3, 6], [1, 4, 7], [2, 5, 8], // 세로줄
  [0, 4, 8], [2, 4, 6]             // 대각선
];
```

---

## 🔥 Firebase API

### 게임 기록 저장

#### `saveGameRun(gameRun: GameRun): Promise<void>`
게임 플레이 기록을 Firestore에 저장합니다.

**Parameters:**
- `gameRun` (GameRun): 게임 기록 객체

**Types:**
```typescript
interface GameRun {
  uid: string;
  score: number;
  ballsUsed: number;
  combos: number;
  createdAt: Date;
}
```

**Example:**
```typescript
await saveGameRun({
  uid: 'user123',
  score: 1500,
  ballsUsed: 10,
  combos: 3,
  createdAt: new Date()
});
```

### 리더보드 조회

#### `getLeaderboard(): Promise<LeaderboardEntry[]>`
상위 10명의 리더보드를 조회합니다.

**Returns:**
- `Promise<LeaderboardEntry[]>`: 리더보드 엔트리 배열

**Types:**
```typescript
interface LeaderboardEntry {
  uid: string;
  displayName: string;
  score: number;
  rank: number;
}
```

**Example:**
```typescript
const leaderboard = await getLeaderboard();
console.log(leaderboard[0]); // { uid: 'user123', displayName: 'Player1', score: 5000, rank: 1 }
```

---

## 🔊 사운드 시스템 API

### 사운드 생성

#### `createMelodySound(frequencies: number[]): AudioBuffer`
주어진 주파수 배열로 멜로디 사운드를 생성합니다.

**Parameters:**
- `frequencies` (number[]): 주파수 배열 (Hz)

**Returns:**
- `AudioBuffer`: 생성된 오디오 버퍼

### 게임 사운드

게임에서 사용되는 사전 정의된 사운드들:

```typescript
const sounds = {
  spin: AudioBuffer,      // 스핀 사운드
  win: AudioBuffer,       // 승리 사운드
  jackpot: AudioBuffer,   // 잭팟 사운드
  fail: AudioBuffer,      // 실패 사운드
  button: AudioBuffer,    // 버튼 사운드
  jackpot2: AudioBuffer   // 메가 잭팟 사운드
};
```

**Example:**
```typescript
// 사운드 재생
if (soundOn) {
  sounds.win.play();
}
```

---

## 🎆 파티클 시스템 API

### 파티클 효과

#### `celebrationExplosion(): void`
축하 폭죽 효과를 실행합니다.

#### `coinRain(amount: number): void`
동전비 효과를 실행합니다.

**Parameters:**
- `amount` (number): 상금 금액 (표시용)

#### `jackpotLaserShow(): void`
잭팟 레이저쇼 효과를 실행합니다.

#### `comboEffect(comboCount: number): void`
콤보 효과를 실행합니다.

**Parameters:**
- `comboCount` (number): 콤보 수

#### `specialWildCard(): void`
와일드 카드 특수 효과를 실행합니다.

#### `scatterBurst(): void`
스캐터 버스트 효과를 실행합니다.

### 파티클 훅

#### `useParticleEffects(): ParticleEffects`
파티클 효과 함수들을 제공하는 훅입니다.

**Returns:**
- `ParticleEffects`: 파티클 효과 함수 객체

**Example:**
```typescript
const particles = useParticleEffects();

// 승리 시 파티클 효과
particles.celebrate('big');
particles.coinRain(1000);
```

---

## 🌟 3D 그래픽 API

### Slot3D 컴포넌트

#### Props
```typescript
interface Slot3DProps {
  symbols: string[];
  isSpinning: boolean;
  winningLines: number[][];
}
```

### 3D 씬 구성 요소

#### `Slot3DReel`
개별 3D 슬롯 릴 컴포넌트

**Props:**
```typescript
interface Slot3DReelProps {
  symbol: string;
  position: [number, number, number];
  isSpinning: boolean;
  isWinning: boolean;
}
```

#### `HologramEffect`
홀로그램 머티리얼 효과

#### `LaserShow`
레이저 라이트 쇼 효과

---

## ✨ 애니메이션 API

### Framer Motion 컴포넌트

#### `AnimatedSlotReel`
애니메이션이 적용된 슬롯 릴 컴포넌트

**Props:**
```typescript
interface AnimatedSlotReelProps {
  symbol: string;
  isSpinning: boolean;
  isWinning: boolean;
  index: number;
}
```

#### `AnimatedSpinButton`
애니메이션이 적용된 스핀 버튼

**Props:**
```typescript
interface AnimatedSpinButtonProps {
  onClick: () => void;
  disabled: boolean;
  isSpinning: boolean;
}
```

#### `AnimatedResult`
결과 표시 애니메이션 컴포넌트

**Props:**
```typescript
interface AnimatedResultProps {
  result: string | null;
  effect: string;
}
```

### Lottie 애니메이션

#### `PremiumLottie`
프리미엄 Lottie 애니메이션 컴포넌트

**Props:**
```typescript
interface PremiumLottieProps {
  type: 'jackpot' | 'bonus' | 'spin' | 'win' | 'celebration' | 'loading';
  size?: number;
  speed?: number;
  loop?: boolean;
  autoplay?: boolean;
  onComplete?: () => void;
}
```

**Example:**
```typescript
<PremiumLottie 
  type="jackpot"
  size={300}
  speed={1.2}
  loop={true}
  autoplay={true}
  onComplete={() => console.log('Animation complete')}
/>
```

---

## 🔧 유틸리티 API

### 상수

#### `SYMBOL_PAYOUTS`
심볼별 배당률 정의

```typescript
const SYMBOL_PAYOUTS = {
  '💎': { payout: 10, multiplier: 3 },
  '🌟': { payout: 8, multiplier: 2.5 },
  '💥': { payout: 8, multiplier: 2.5 },
  // ...
};
```

### 헬퍼 함수

#### `formatCurrency(amount: number): string`
금액을 한국 원화 형식으로 포맷팅합니다.

**Parameters:**
- `amount` (number): 포맷팅할 금액

**Returns:**
- `string`: 포맷팅된 문자열

**Example:**
```typescript
const formatted = formatCurrency(1000);
console.log(formatted); // "1,000원"
```

#### `calculateWinAmount(wins: WinResult[], bet: number): number`
승리 결과와 베팅 금액으로 총 상금을 계산합니다.

**Parameters:**
- `wins` (WinResult[]): 승리 결과 배열
- `bet` (number): 베팅 금액

**Returns:**
- `number`: 총 상금

---

## 🚨 에러 처리

### 에러 타입

```typescript
// Firebase 에러
interface FirebaseError extends Error {
  code: string;
  message: string;
}

// 게임 로직 에러
interface GameError extends Error {
  type: 'INVALID_BET' | 'INSUFFICIENT_BALANCE' | 'INVALID_SYMBOLS';
  details?: any;
}
```

### 에러 핸들링 예시

```typescript
try {
  await saveGameRun(gameData);
} catch (error) {
  if (error instanceof FirebaseError) {
    console.error('Firebase error:', error.code, error.message);
  } else {
    console.error('Unknown error:', error);
  }
}
```

---

## 📚 추가 정보

### API 버전 관리

현재 API 버전: `v1.0.0`

### 성능 고려사항

- 파티클 효과는 성능에 영향을 줄 수 있으므로 적절히 사용
- 3D 렌더링은 GPU 성능에 따라 프레임 드롭 가능
- 사운드 재생은 Web Audio API 지원 브라우저에서만 동작

### 브라우저 호환성

- **Chrome**: 90+
- **Firefox**: 88+
- **Safari**: 14+
- **Edge**: 90+

---

이 API 문서는 지속적으로 업데이트되며, 새로운 기능 추가 시 함께 문서화됩니다. 🚀