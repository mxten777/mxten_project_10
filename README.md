
# Pachinko Web Game (슬롯머신형 일본 파칭코 웹 MVP)

---

## 프로젝트 개요

- **프로젝트명:** Pachinko Web Game (슬롯머신형 일본 파칭코 웹 MVP)
- **주요 목표:** 슬롯머신 기반의 파칭코 게임을 웹에서 아케이드 스타일로 구현, 다양한 UX 고도화 및 서버 검증/운영 기능 제공

---

## 기술 스택

- **Frontend:** Vite, React, TypeScript
- **스타일:** TailwindCSS (다크모드/반응형), 커스텀 CSS 애니메이션
- **상태관리:** Zustand (게임, 잔고, 오토스핀, 사운드/진동, 테마 등)
- **사운드:** Howler.js
- **백엔드/DB:** Firebase (Auth, Firestore, Functions)
- **기타:** 파티클/애니메이션 효과, 진동(웹/모바일), 서버 검증

---

## 주요 디렉토리 구조

- `src/components/` : UI 컴포넌트 (SlotMachineBoard, ScoreBoard, ComboDisplay, Leaderboard, BettingPanel, AutoSpinToggle, AuthButton, TutorialModal, SoundVibrationToggle 등)
- `src/stores/` : Zustand 상태관리 (gameStore, balanceStore, autoSpinStore, authStore, soundVibrationStore 등)
- `src/utils/` : Firebase 연동, 서버 검증, 파칭코 물리엔진 등
- `src/pages/` : 페이지 컴포넌트 (GamePage, index.tsx)
- `src/assets/` : 사운드, 이미지 등 정적 리소스
- `src/index.css` : TailwindCSS 및 커스텀 애니메이션

---

## 주요 기능 및 UI 흐름

### 1. 게임 플레이

- **SlotMachineBoard**: 슬롯머신 메인 UI, 스핀/결과/애니메이션/사운드/잔고 0 안내/재시작 등
- **ScoreBoard, ComboDisplay**: 점수/콤보 표시 및 점프 애니메이션
- **BettingPanel**: 베팅 금액 선택, 잔고 표시
- **AutoSpinToggle**: 오토스핀 토글
- **SoundVibrationToggle**: 사운드/진동 ON/OFF 토글
- **Leaderboard**: 상위 10명 랭킹, 1~3위 색상/왕관/애니메이션 강조
- **AuthButton**: 익명/Google 로그인, 로그아웃
- **TutorialModal**: 최초 진입 시 게임 방법 안내 모달

### 2. 상태관리

- **Zustand**로 게임 점수, 콤보, 잔고, 베팅, 오토스핀, 사운드/진동, 테마(다크/라이트) 등 관리

### 3. 서버 연동/검증

- **Firebase Auth**: 익명/Google 로그인
- **Firestore**: 게임 기록 저장, 리더보드 조회
- **Cloud Functions**: 점수/결과 서버 검증

### 4. UX 고도화

- **결과별 컬러/애니메이션**: JACKPOT/2개일치/꽝 등 상황별 컬러, 빛남, 흔들림 등 효과
- **점수/콤보 애니메이션**: 점프/페이드 효과
- **버튼 아이콘/애니메이션**: 스핀/오토스핀 등
- **잔고 0 안내/재시작**: 잔고 0원 시 안내 및 복구 버튼
- **튜토리얼/도움말**: 최초 진입 시 모달 안내
- **리더보드 상위권 강조**: 1~3위 색상, 왕관/메달, 팝업 애니메이션
- **사운드/진동 설정**: ON/OFF 토글 UI 및 효과음 제어
- **다크모드/반응형**: TailwindCSS 기반

---

## 주요 파일 설명

- `App.tsx` : 테마(다크/라이트) 전역 관리, GamePage 렌더링
- `pages/GamePage.tsx` : 전체 게임 UI 조립, 주요 컴포넌트 배치
- `components/SlotMachineBoard.tsx` : 슬롯머신 메인 로직/연출/상태/사운드/애니메이션
- `components/ScoreBoard.tsx`, `ComboDisplay.tsx` : 점수/콤보 UI 및 애니메이션
- `components/BettingPanel.tsx` : 베팅 금액 선택, 잔고 표시
- `components/AutoSpinToggle.tsx` : 오토스핀 토글
- `components/SoundVibrationToggle.tsx` : 사운드/진동 토글
- `components/Leaderboard.tsx` : 리더보드, 상위권 강조
- `components/AuthButton.tsx` : 로그인/로그아웃
- `components/TutorialModal.tsx` : 게임 방법 안내 모달
- `stores/` : zustand 상태관리 파일들
- `utils/firestoreGame.ts` : 서버 검증, 기록 저장/조회 함수
- `index.css` : TailwindCSS, 커스텀 애니메이션

---

## 개발 및 실행

```bash
npm install
npm run dev
```

---

## 기타 참고

- 사운드/진동, 애니메이션, 서버 검증 등은 확장/고도화 가능
- ESLint, 타입스크립트, 다크모드, 반응형 등 최신 프론트엔드 개발 패턴 적용

---

이 문서로 전체 구조, 주요 기능, 폴더/컴포넌트 역할, 실행 방법까지 한눈에 파악할 수 있습니다.  
세부 코드/구현 문의나 추가 문서화가 필요하면 말씀해 주세요!
