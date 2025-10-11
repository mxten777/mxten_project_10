# 🔧 개발자 가이드

> 프리미엄 슬롯머신 게임 개발을 위한 상세 가이드

---

## 📋 목차

1. [개발 환경 설정](#개발-환경-설정)
2. [프로젝트 아키텍처](#프로젝트-아키텍처)
3. [상태 관리](#상태-관리)
4. [컴포넌트 설계](#컴포넌트-설계)
5. [성능 최적화](#성능-최적화)
6. [디버깅 가이드](#디버깅-가이드)
7. [테스팅](#테스팅)
8. [배포 가이드](#배포-가이드)

---

## 🛠 개발 환경 설정

### 필수 도구
```bash
# Node.js 18+ 설치 확인
node --version

# npm 9+ 설치 확인  
npm --version

# Git 설치 확인
git --version
```

### IDE 설정 (VS Code 권장)
```json
// .vscode/settings.json
{
  "typescript.preferences.importModuleSpecifier": "relative",
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode"
}
```

### 추천 VS Code 확장
- TypeScript Hero
- ES7+ React/Redux/React-Native snippets
- Tailwind CSS IntelliSense
- Auto Rename Tag
- Bracket Pair Colorizer

---

## 🏗 프로젝트 아키텍처

### 폴더 구조 규칙
```
src/
├── components/          # 재사용 가능한 UI 컴포넌트
│   ├── ui/             # 기본 UI 컴포넌트 (Button, Input 등)
│   ├── game/           # 게임 관련 컴포넌트
│   └── layout/         # 레이아웃 컴포넌트
├── stores/             # Zustand 스토어
├── utils/              # 유틸리티 함수
├── hooks/              # 커스텀 훅
├── types/              # TypeScript 타입 정의
└── constants/          # 상수 정의
```

### 컴포넌트 명명 규칙
```typescript
// ✅ 올바른 예시
export const SlotMachineBoard: React.FC<Props> = () => {
  return <div>...</div>;
};

// ❌ 잘못된 예시
export const slotMachineBoard = () => {
  return <div>...</div>;
};
```

### 파일 명명 규칙
- **컴포넌트**: PascalCase (예: `SlotMachineBoard.tsx`)
- **유틸리티**: camelCase (예: `gameUtils.ts`)
- **상수**: UPPER_SNAKE_CASE (예: `GAME_CONSTANTS.ts`)
- **타입**: PascalCase (예: `GameTypes.ts`)

---

## 🎯 상태 관리

### Zustand 스토어 패턴
```typescript
// stores/gameStore.ts
interface GameState {
  // 상태
  score: number;
  combo: number;
  isPlaying: boolean;
  
  // 액션
  setScore: (score: number) => void;
  setCombo: (combo: number) => void;
  startGame: () => void;
  endGame: () => void;
  
  // 계산된 값 (선택적)
  totalScore: () => number;
}

export const useGameStore = create<GameState>((set, get) => ({
  // 초기 상태
  score: 0,
  combo: 1,
  isPlaying: false,
  
  // 액션
  setScore: (score) => set({ score }),
  setCombo: (combo) => set({ combo }),
  startGame: () => set({ isPlaying: true }),
  endGame: () => set({ isPlaying: false }),
  
  // 계산된 값
  totalScore: () => get().score * get().combo,
}));
```

### 상태 사용 패턴
```typescript
// 컴포넌트에서 상태 사용
const MyComponent: React.FC = () => {
  // 필요한 상태만 구독
  const { score, setScore } = useGameStore(
    (state) => ({ 
      score: state.score, 
      setScore: state.setScore 
    })
  );
  
  // 또는 개별적으로 구독
  const combo = useGameStore((state) => state.combo);
  
  return <div>Score: {score}</div>;
};
```

---

## 🧩 컴포넌트 설계

### 컴포넌트 구조 템플릿
```typescript
import React from 'react';
import { motion } from 'framer-motion';

// 타입 정의
interface ComponentProps {
  title: string;
  value: number;
  onClick?: () => void;
  className?: string;
}

// 컴포넌트 정의
export const MyComponent: React.FC<ComponentProps> = ({
  title,
  value,
  onClick,
  className = '',
}) => {
  // 상태 (필요시)
  const [isActive, setIsActive] = React.useState(false);
  
  // 이벤트 핸들러
  const handleClick = () => {
    setIsActive(!isActive);
    onClick?.();
  };
  
  // 렌더링
  return (
    <motion.div
      className={`component-base ${className}`}
      onClick={handleClick}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      <h3>{title}</h3>
      <span>{value}</span>
    </motion.div>
  );
};

// 기본값 설정 (선택적)
MyComponent.defaultProps = {
  className: '',
};
```

### 재사용 가능한 컴포넌트 가이드
```typescript
// ui/Button.tsx - 기본 버튼 컴포넌트
interface ButtonProps {
  variant: 'primary' | 'secondary' | 'danger';
  size: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  loading?: boolean;
  children: React.ReactNode;
  onClick?: () => void;
}

export const Button: React.FC<ButtonProps> = ({
  variant,
  size,
  disabled = false,
  loading = false,
  children,
  onClick,
}) => {
  const baseClasses = 'btn transition-all duration-200';
  const variantClasses = {
    primary: 'bg-blue-500 hover:bg-blue-600 text-white',
    secondary: 'bg-gray-500 hover:bg-gray-600 text-white',
    danger: 'bg-red-500 hover:bg-red-600 text-white',
  };
  const sizeClasses = {
    sm: 'px-3 py-1 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg',
  };
  
  return (
    <motion.button
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]}`}
      disabled={disabled || loading}
      onClick={onClick}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      {loading ? 'Loading...' : children}
    </motion.button>
  );
};
```

---

## ⚡ 성능 최적화

### React 최적화
```typescript
// React.memo로 불필요한 리렌더링 방지
export const ExpensiveComponent = React.memo<Props>(({
  data,
  onClick,
}) => {
  return <div>...</div>;
});

// useMemo로 비싼 연산 캐싱
const expensiveValue = React.useMemo(() => {
  return heavyCalculation(data);
}, [data]);

// useCallback으로 함수 캐싱
const handleClick = React.useCallback(() => {
  onClick?.(value);
}, [onClick, value]);
```

### 코드 스플리팅
```typescript
// 라우트 레벨 스플리팅
const GamePage = React.lazy(() => import('./pages/GamePage'));
const SettingsPage = React.lazy(() => import('./pages/SettingsPage'));

// 컴포넌트 레벨 스플리팅
const Slot3D = React.lazy(() => import('./components/Slot3D'));

// 사용
<React.Suspense fallback={<div>Loading...</div>}>
  <Slot3D />
</React.Suspense>
```

### Three.js 최적화
```typescript
// 인스턴싱으로 동일한 메시 재사용
const instancedMesh = new THREE.InstancedMesh(geometry, material, count);

// LOD (Level of Detail) 사용
const lod = new THREE.LOD();
lod.addLevel(highDetailMesh, 0);
lod.addLevel(mediumDetailMesh, 50);
lod.addLevel(lowDetailMesh, 100);

// 프레임 레이트 제한
const clock = new THREE.Clock();
const targetFPS = 60;
const targetFrameTime = 1 / targetFPS;

function animate() {
  const deltaTime = clock.getDelta();
  
  if (deltaTime >= targetFrameTime) {
    // 렌더링 로직
    renderer.render(scene, camera);
  }
  
  requestAnimationFrame(animate);
}
```

---

## 🐛 디버깅 가이드

### 개발자 도구 활용
```typescript
// 조건부 디버깅
if (process.env.NODE_ENV === 'development') {
  console.log('Game State:', gameState);
}

// 성능 측정
console.time('heavy-operation');
heavyOperation();
console.timeEnd('heavy-operation');

// 스택 트레이스
console.trace('Function call stack');
```

### React DevTools
```bash
# React DevTools 브라우저 확장 설치
# Chrome: React Developer Tools
# Firefox: React Developer Tools
```

### Zustand DevTools
```typescript
// stores/gameStore.ts
export const useGameStore = create<GameState>()(
  devtools(
    (set, get) => ({
      // 스토어 로직
    }),
    {
      name: 'game-store', // DevTools에서 표시될 이름
    }
  )
);
```

### 에러 바운더리
```typescript
// components/ErrorBoundary.tsx
interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends React.Component<
  React.PropsWithChildren<{}>,
  State
> {
  constructor(props: React.PropsWithChildren<{}>) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="error-boundary">
          <h2>Something went wrong.</h2>
          <details>
            {this.state.error?.message}
          </details>
        </div>
      );
    }

    return this.props.children;
  }
}
```

---

## 🧪 테스팅

### 유닛 테스트 (Jest + React Testing Library)
```typescript
// __tests__/components/Button.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { Button } from '../components/ui/Button';

describe('Button Component', () => {
  it('renders correctly', () => {
    render(
      <Button variant="primary" size="md">
        Click me
      </Button>
    );
    
    expect(screen.getByText('Click me')).toBeInTheDocument();
  });

  it('calls onClick when clicked', () => {
    const handleClick = jest.fn();
    render(
      <Button variant="primary" size="md" onClick={handleClick}>
        Click me
      </Button>
    );
    
    fireEvent.click(screen.getByText('Click me'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});
```

### 스토어 테스트
```typescript
// __tests__/stores/gameStore.test.ts
import { useGameStore } from '../stores/gameStore';

describe('GameStore', () => {
  beforeEach(() => {
    // 스토어 초기화
    useGameStore.getState().resetGame();
  });

  it('should update score', () => {
    const { setScore } = useGameStore.getState();
    setScore(100);
    
    expect(useGameStore.getState().score).toBe(100);
  });
});
```

---

## 🚀 배포 가이드

### 환경 변수 설정
```bash
# .env.local (로컬 개발)
VITE_FIREBASE_API_KEY=local_api_key
VITE_FIREBASE_AUTH_DOMAIN=local_domain

# .env.production (프로덕션)
VITE_FIREBASE_API_KEY=prod_api_key
VITE_FIREBASE_AUTH_DOMAIN=prod_domain
```

### 빌드 최적화
```typescript
// vite.config.ts
export default defineConfig({
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          three: ['three', '@react-three/fiber', '@react-three/drei'],
          motion: ['framer-motion'],
        },
      },
    },
    chunkSizeWarningLimit: 1000,
  },
});
```

### CI/CD 파이프라인 (GitHub Actions)
```yaml
# .github/workflows/deploy.yml
name: Deploy

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          
      - name: Install dependencies
        run: npm ci
        
      - name: Run tests
        run: npm test
        
      - name: Build
        run: npm run build
        
      - name: Deploy to Vercel
        uses: vercel/action@v1
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
```

---

## 📚 추가 자료

### 유용한 링크
- [React 공식 문서](https://reactjs.org/docs)
- [TypeScript 핸드북](https://www.typescriptlang.org/docs)
- [Three.js 공식 문서](https://threejs.org/docs)
- [Framer Motion 가이드](https://www.framer.com/motion)
- [TailwindCSS 문서](https://tailwindcss.com/docs)

### 커뮤니티
- [React Discord](https://discord.gg/react)
- [Three.js Discord](https://discord.gg/56GBJwAnUS)
- [Stack Overflow](https://stackoverflow.com)

---

이 가이드를 통해 효율적이고 품질 높은 개발을 진행하시기 바랍니다! 🚀