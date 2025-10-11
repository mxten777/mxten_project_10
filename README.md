# 🎰 프리미엄 슬롯머신 게임

> **최첨단 웹 기반 카지노급 슬롯머신 게임**  
> React + TypeScript + Three.js로 구현된 프리미엄 게이밍 플랫폼

[![React](https://img.shields.io/badge/React-18.x-blue.svg)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue.svg)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-7.x-yellow.svg)](https://vitejs.dev/)
[![Three.js](https://img.shields.io/badge/Three.js-Latest-green.svg)](https://threejs.org/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.4-blue.svg)](https://tailwindcss.com/)

---

## 📋 목차

1. [프로젝트 개요](#프로젝트-개요)
2. [주요 기능](#주요-기능)
3. [기술 스택](#기술-스택))
4. [설치 및 실행](#설치-및-실행)
5. [프로젝트 구조](#프로젝트-구조)
6. [프리미엄 시스템](#프리미엄-시스템)
7. [게임 메커니즘](#게임-메커니즘)
8. [개발 가이드](#개발-가이드)

---

## 🎯 프로젝트 개요

**프리미엄 슬롯머신 게임**은 현대적인 웹 기술을 활용하여 제작된 고품질 온라인 카지노 게임입니다. 단순한 1x3 슬롯에서 시작하여 5단계 프리미엄 업그레이드를 통해 **웹 기반 카지노급 게이밍 플랫폼**으로 진화했습니다.

### ✨ 프로젝트 비전
- 🎨 **시각적 완성도**: 카지노급 그래픽과 애니메이션
- 🔊 **오디오 경험**: Web Audio API 기반 실시간 사운드
- 🎮 **게임플레이**: 복잡하고 흥미진진한 멀티 페이라인 시스템
- 📱 **접근성**: 반응형 디자인과 크로스 플랫폼 지원
- 🚀 **성능**: 최적화된 렌더링과 부드러운 애니메이션

---

## 🚀 주요 기능

### 🎰 게임 기능
- **3x3 프리미엄 그리드**: 복잡한 멀티 페이라인 시스템 (8개 승리 라인)
- **프리미엄 심볼**: 9가지 특수 심볼 (`💎`, `🌟`, `💥`, `🍀`, `🎯`, `💰`, `🔥`, `⚡`, `🎊`)
- **승리 등급 시스템**: 일반 승리 → 빅 윈 → 메가 윈 → 잭팟
- **보너스 라운드**: 특수 심볼 3개 이상 시 자동 트리거
- **오토 스핀**: 자동 연속 스핀 기능
- **실시간 점수**: 즉시 반영되는 점수 및 잔고 시스템

### 🎨 시각적 시스템
- **2D/3D 모드**: 실시간 전환 가능한 이중 렌더링 시스템
- **파티클 효과**: 8가지 승리별 맞춤 파티클 (폭죽, 동전비, 레이저쇼)
- **Lottie 애니메이션**: 6가지 프리미엄 벡터 애니메이션
- **Framer Motion**: 부드러운 UI 전환과 마이크로 인터랙션
- **글래스모피즘**: 현대적인 반투명 UI 디자인

---

## 🛠 기술 스택

### 🎯 Frontend Core
- **React**: 18.3.1
- **TypeScript**: 5.5.3  
- **Vite**: 7.1.6
- **TailwindCSS**: 3.4.0

### 🎨 UI/UX 라이브러리
- **framer-motion**: 고급 애니메이션
- **canvas-confetti**: 파티클 효과
- **lottie-react**: 벡터 애니메이션

### 🌐 3D 그래픽
- **three**: 3D 렌더링 엔진
- **@react-three/fiber**: React용 Three.js
- **@react-three/drei**: Three.js 헬퍼

### 📡 백엔드 & 데이터
- **firebase**: 실시간 데이터베이스
- **zustand**: 상태 관리

---

## 🚀 설치 및 실행

### 📋 필수 요구사항
- **Node.js**: 18.0.0 이상
- **npm**: 9.0.0 이상
- **모던 브라우저**: Chrome 90+, Firefox 88+, Safari 14+

### 💻 로컬 개발 환경 설정

```bash
# 1. 저장소 클론
git clone https://github.com/mxten777/mxten_project_10.git
cd mxten_project_10

# 2. 의존성 설치
npm install

# 3. 개발 서버 실행
npm run dev

# 4. 브라우저에서 확인
# http://localhost:5173
```

```
mxten_project_10/
├── 📁 public/                    # 정적 파일
│   ├── 📁 animations/            # Lottie 애니메이션 파일
│   └── 📁 fonts/                 # 웹 폰트
├── 📁 src/                       # 소스 코드
│   ├── 📁 components/            # React 컴포넌트
│   │   ├── 🎰 SlotMachineBoard.tsx    # 메인 게임 보드
│   │   ├── 🎨 SimpleAnimations.tsx    # Framer Motion 애니메이션
│   │   ├── 🌟 Slot3D.tsx             # Three.js 3D 시스템
│   │   ├── ✨ PremiumLottie.tsx      # Lottie 애니메이션 시스템
│   │   ├── 📊 ScoreBoard.tsx         # 점수 표시
│   │   ├── 🎯 BettingPanel.tsx       # 베팅 컨트롤
│   │   ├── 🏆 Leaderboard.tsx        # 리더보드
│   │   └── 🔐 AuthButton.tsx         # 인증 버튼
│   ├── 📁 stores/                # Zustand 상태 관리
│   │   ├── 🎮 gameStore.ts           # 게임 상태
│   │   ├── 💰 balanceStore.ts        # 잔고 관리
│   │   ├── 👤 authStore.ts           # 인증 상태
│   │   └── 🔊 soundVibrationStore.ts # 사운드 설정
│   ├── 📁 utils/                 # 유틸리티 함수
│   │   ├── 🎆 premiumParticles.ts    # 파티클 시스템
│   │   ├── 🔥 firestoreGame.ts       # Firebase 연동
│   │   └── 🎵 PremiumSoundSystem.ts  # 사운드 시스템
│   ├── 📁 pages/                 # 페이지 컴포넌트
│   │   └── 🎯 GamePage.tsx           # 메인 게임 페이지
│   ├── 🎨 App.tsx                # 앱 루트 컴포넌트
│   ├── 🎯 main.tsx               # 앱 진입점
│   └── 🎨 index.css              # 글로벌 스타일
├── 📋 package.json               # 프로젝트 설정
├── ⚙️ vite.config.ts            # Vite 설정
├── 🎨 tailwind.config.js        # TailwindCSS 설정
├── 📝 tsconfig.json             # TypeScript 설정
└── 📖 README.md                 # 프로젝트 문서
```

---

## ⭐ 프리미엄 시스템

### 🎆 1단계: 프리미엄 사운드 시스템
- Web Audio API 기반 실시간 사운드 생성
- 6가지 게임 효과음 (스핀, 승리, 잭팟, 실패, 버튼, 잭팟2)
- 고품질 오디오 컨텍스트로 카지노급 사운드

### 🎨 2단계: 파티클 시스템
- canvas-confetti 기반 8가지 파티클 효과
- 승리 시 폭죽, 동전 비, 레이저쇼 효과
- 특수 심볼별 맞춤 파티클 (와일드, 스캐터)

### ✨ 3단계: 고급 애니메이션 시스템
- Framer Motion 기반 부드러운 UI 전환
- 스프링 애니메이션과 제스처 인터랙션
- 릴 회전, 결과 표시, 버튼 상호작용 애니메이션

### 🎮 4단계: 3D 그래픽 엔진
- Three.js 기반 3D 슬롯머신 시스템
- 실시간 3D 릴 회전과 네온 라이팅
- 2D/3D 모드 토글로 선택 가능

### 🎨 5단계: Lottie 애니메이션 시스템
- 프로그래매틱 벡터 애니메이션 (After Effects 스타일)
- 6가지 프리미엄 애니메이션 (잭팟, 보너스, 승리, 축하, 스핀, 로딩)
- 승리 상황별 맞춤 애니메이션 오버레이

---

## 🎮 게임 메커니즘

### 🎯 페이라인 시스템
```typescript
const paylines = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8], // 가로줄
  [0, 3, 6], [1, 4, 7], [2, 5, 8], // 세로줄
  [0, 4, 8], [2, 4, 6]             // 대각선
];
```

### 💎 심볼별 배당률
- `💎`: 10배 배당 + 3배 승수 (다이아몬드 - 최고급)
- `🌟`: 8배 배당 + 2.5배 승수 (스타 - 와일드)
- `💥`: 8배 배당 + 2.5배 승수 (폭발 - 스캐터)
- `🍀`: 6배 배당 + 2배 승수 (클로버)
- `🎯`: 5배 배당 + 1.8배 승수 (타겟)
- `💰`: 4배 배당 + 1.5배 승수 (머니백)
- `🔥`: 3배 배당 + 1.3배 승수 (불꽃)
- `⚡`: 3배 배당 + 1.3배 승수 (번개)
- `🎊`: 2배 배당 + 1.2배 승수 (축하)

### 🏆 승리 등급 시스템
- **메가 윈**: 베팅의 50배 이상
- **빅 윈**: 베팅의 20배 이상  
- **일반 승리**: 모든 기타 승리

---

## 🔧 개발 가이드

### 📝 새로운 기능 추가
```bash
# 1. 새 컴포넌트 생성
src/components/NewFeature.tsx

# 2. 상태 관리 추가
src/stores/newFeatureStore.ts

# 3. 유틸리티 함수 추가
src/utils/newFeatureUtils.ts

# 4. 스타일 추가
src/index.css (글로벌 스타일)
```

### 🎯 주요 명령어
```bash
# 개발 서버 실행
npm run dev

# 프로덕션 빌드
npm run build

# 빌드 미리보기
npm run preview

# 타입 체크
npm run type-check

# 린트 검사
npm run lint
```

---

## 🚀 배포

### 📦 프로덕션 빌드
```bash
# 빌드 실행
npm run build

# 빌드 결과물 확인
dist/
├── assets/          # 최적화된 JS/CSS
├── index.html       # 메인 HTML
└── ...
```

### 🌐 배포 플랫폼
```bash
# Vercel 배포
vercel --prod

# Netlify 배포  
netlify deploy --prod --dir=dist

# Firebase Hosting
firebase deploy
```

---

## 📄 라이선스

MIT License - 자유롭게 사용, 수정, 배포 가능합니다.

---

## 📞 연락처

- **개발자**: mxten777
- **깃허브**: [https://github.com/mxten777](https://github.com/mxten777)
- **프로젝트**: [https://github.com/mxten777/mxten_project_10](https://github.com/mxten777/mxten_project_10)

---

<div align="center">

**🎰 프리미엄 슬롯머신 게임 🎰**

*최첨단 웹 기술로 구현된 카지노급 게이밍 경험*

⭐ **Star this repo if you like it!** ⭐

</div>
