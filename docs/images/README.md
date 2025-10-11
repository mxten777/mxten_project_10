# 📸 스크린샷 가이드

이 폴더에는 프로젝트의 스크린샷과 시연 이미지들을 저장합니다.

## 📁 권장 파일 구조

```
docs/images/
├── screenshots/
│   ├── home-page.png          # 홈페이지 스크린샷
│   ├── game-board.png         # 게임 보드 화면
│   ├── slot-spinning.gif      # 슬롯 스핀 애니메이션
│   ├── winning-effect.png     # 승리 효과 화면
│   ├── jackpot-celebration.png # 잭팟 축하 화면
│   ├── 3d-graphics.png        # 3D 그래픽 모드
│   ├── particle-effects.png   # 파티클 효과
│   ├── mobile-responsive.png  # 모바일 반응형
│   └── dark-theme.png         # 다크 테마
├── diagrams/
│   ├── architecture.png       # 시스템 아키텍처
│   ├── component-structure.png # 컴포넌트 구조도
│   ├── state-flow.png         # 상태 관리 플로우
│   └── user-flow.png          # 사용자 플로우
├── icons/
│   ├── favicon.ico
│   ├── logo.png
│   └── social-preview.png
└── marketing/
    ├── og-image.png           # Open Graph 이미지
    ├── twitter-card.png       # Twitter 카드 이미지
    └── app-preview.png        # 앱 미리보기 이미지
```

## 📏 이미지 사양

### 스크린샷
- **해상도**: 1920x1080 (풀HD)
- **포맷**: PNG (정적), GIF (애니메이션)
- **용량**: 2MB 이하 권장

### 다이어그램
- **해상도**: 최소 800x600
- **포맷**: PNG 또는 SVG
- **배경**: 투명 또는 흰색

### 소셜 미디어
- **Open Graph**: 1200x630px
- **Twitter Card**: 1200x600px
- **favicon**: 32x32px, 16x16px

## 🎯 촬영 가이드

### 게임 스크린샷
1. **홈페이지**: 브랜딩과 시작 버튼이 잘 보이도록
2. **게임 보드**: 3x3 슬롯 그리드가 중앙에 위치
3. **스핀 애니메이션**: GIF로 3-5초 길이
4. **승리 화면**: 파티클 효과와 함께
5. **잭팟**: 최대 효과가 표시될 때

### 반응형 테스트
- **데스크톱**: 1920x1080, 1366x768
- **태블릿**: 768x1024 (iPad)
- **모바일**: 375x667 (iPhone), 360x640 (Android)

### 테마 변형
- **라이트 모드**: 기본 밝은 테마
- **다크 모드**: 어두운 테마 변환

## 🔧 이미지 최적화

### 자동 최적화 스크립트

```bash
# WebP 변환 (선택사항)
npm install -g @squoosh/cli
squoosh-cli --webp auto docs/images/screenshots/*.png

# 이미지 압축
npm install -g imagemin-cli
imagemin docs/images/**/*.png --out-dir=docs/images/optimized
```

### 온라인 도구
- **TinyPNG**: PNG/JPG 압축
- **Squoosh**: 구글 이미지 최적화 도구
- **Canva**: 소셜 미디어 이미지 제작

## 📖 문서 연동

README.md와 다른 문서에서 이미지 사용 시:

```markdown
# 상대 경로 사용
![게임 보드](docs/images/screenshots/game-board.png)

# GitHub에서 직접 링크 (권장)
![게임 보드](https://raw.githubusercontent.com/your-username/repo-name/main/docs/images/screenshots/game-board.png)
```

## ✅ 체크리스트

프로젝트 완료 시 다음 이미지들을 준비해주세요:

- [ ] 홈페이지 스크린샷
- [ ] 게임 플레이 화면
- [ ] 승리/잭팟 효과
- [ ] 모바일 반응형 화면
- [ ] 다크/라이트 테마
- [ ] 3D 그래픽 모드
- [ ] 파티클 효과 시연
- [ ] 로고 및 아이콘
- [ ] 소셜 미디어 카드
- [ ] 아키텍처 다이어그램

---

**참고**: 모든 이미지는 프로젝트의 저작권 정책을 준수해야 하며, 개인정보가 포함되지 않도록 주의해주세요.