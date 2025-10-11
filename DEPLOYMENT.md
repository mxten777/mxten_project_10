# 🚀 배포 가이드

> 프리미엄 슬롯머신 게임 배포 매뉴얼

---

## 📋 목차

1. [배포 개요](#배포-개요)
2. [환경 설정](#환경-설정)
3. [빌드 프로세스](#빌드-프로세스)
4. [Vercel 배포](#vercel-배포)
5. [Netlify 배포](#netlify-배포)
6. [GitHub Pages 배포](#github-pages-배포)
7. [Firebase Hosting](#firebase-hosting)
8. [도메인 설정](#도메인-설정)
9. [성능 최적화](#성능-최적화)
10. [모니터링](#모니터링)

---

## 🎯 배포 개요

프리미엄 슬롯머신 게임은 다음과 같은 배포 옵션을 지원합니다:

- **Vercel** (추천): 자동 배포, 최적화된 성능
- **Netlify**: 쉬운 설정, 폼 처리 지원
- **GitHub Pages**: 무료 호스팅
- **Firebase Hosting**: Google 생태계 통합

---

## ⚙️ 환경 설정

### 환경 변수 설정

배포 전 필요한 환경 변수들을 설정해주세요:

```bash
# .env.production
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
VITE_FIREBASE_MEASUREMENT_ID=your_measurement_id
```

### Firebase 설정

```javascript
// firebase.config.js
export const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID
};
```

---

## 🔨 빌드 프로세스

### 로컬 빌드 테스트

```bash
# 의존성 설치
npm install

# 개발 서버 실행
npm run dev

# 프로덕션 빌드
npm run build

# 빌드 결과 미리보기
npm run preview
```

### 빌드 최적화 설정

`vite.config.ts` 최적화:

```typescript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist',
    sourcemap: false,
    minify: 'terser',
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          firebase: ['firebase/app', 'firebase/auth', 'firebase/firestore'],
          three: ['three', '@react-three/fiber', '@react-three/drei'],
          motion: ['framer-motion'],
          lottie: ['lottie-react']
        }
      }
    }
  },
  define: {
    'process.env.NODE_ENV': '"production"'
  }
})
```

---

## 🔥 Vercel 배포

### 자동 배포 설정

1. **GitHub 연결**
```bash
# Vercel CLI 설치
npm i -g vercel

# 프로젝트 배포
vercel --prod
```

2. **vercel.json 설정**
```json
{
  "version": 2,
  "builds": [
    {
      "src": "package.json",
      "use": "@vercel/static-build",
      "config": {
        "distDir": "dist"
      }
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "/index.html"
    }
  ],
  "env": {
    "VITE_FIREBASE_API_KEY": "@firebase-api-key",
    "VITE_FIREBASE_AUTH_DOMAIN": "@firebase-auth-domain",
    "VITE_FIREBASE_PROJECT_ID": "@firebase-project-id",
    "VITE_FIREBASE_STORAGE_BUCKET": "@firebase-storage-bucket",
    "VITE_FIREBASE_MESSAGING_SENDER_ID": "@firebase-messaging-sender-id",
    "VITE_FIREBASE_APP_ID": "@firebase-app-id",
    "VITE_FIREBASE_MEASUREMENT_ID": "@firebase-measurement-id"
  },
  "headers": [
    {
      "source": "/assets/(.*)",
      "headers": [
        {
          "key": "Cache-Control",
          "value": "public, max-age=31536000, immutable"
        }
      ]
    }
  ]
}
```

3. **환경 변수 설정**
```bash
# Vercel 대시보드에서 설정하거나 CLI로 설정
vercel env add VITE_FIREBASE_API_KEY
```

### GitHub Actions 자동 배포

`.github/workflows/deploy.yml`:

```yaml
name: Deploy to Vercel

on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'
        cache: 'npm'
    
    - name: Install dependencies
      run: npm ci
    
    - name: Build
      run: npm run build
      env:
        VITE_FIREBASE_API_KEY: ${{ secrets.VITE_FIREBASE_API_KEY }}
        VITE_FIREBASE_AUTH_DOMAIN: ${{ secrets.VITE_FIREBASE_AUTH_DOMAIN }}
        VITE_FIREBASE_PROJECT_ID: ${{ secrets.VITE_FIREBASE_PROJECT_ID }}
        VITE_FIREBASE_STORAGE_BUCKET: ${{ secrets.VITE_FIREBASE_STORAGE_BUCKET }}
        VITE_FIREBASE_MESSAGING_SENDER_ID: ${{ secrets.VITE_FIREBASE_MESSAGING_SENDER_ID }}
        VITE_FIREBASE_APP_ID: ${{ secrets.VITE_FIREBASE_APP_ID }}
        VITE_FIREBASE_MEASUREMENT_ID: ${{ secrets.VITE_FIREBASE_MEASUREMENT_ID }}
    
    - name: Deploy to Vercel
      uses: amondnet/vercel-action@v25
      with:
        vercel-token: ${{ secrets.VERCEL_TOKEN }}
        github-token: ${{ secrets.GITHUB_TOKEN }}
        vercel-args: '--prod'
        vercel-org-id: ${{ secrets.ORG_ID }}
        vercel-project-id: ${{ secrets.PROJECT_ID }}
```

---

## 🌐 Netlify 배포

### 자동 배포 설정

1. **netlify.toml 설정**
```toml
[build]
  publish = "dist"
  command = "npm run build"

[build.environment]
  NODE_VERSION = "18"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200

[[headers]]
  for = "/assets/*"
  [headers.values]
    Cache-Control = "public, max-age=31536000, immutable"

[[headers]]
  for = "/*.js"
  [headers.values]
    Cache-Control = "public, max-age=31536000, immutable"

[[headers]]
  for = "/*.css"
  [headers.values]
    Cache-Control = "public, max-age=31536000, immutable"
```

2. **환경 변수 설정**
Netlify 대시보드 → Site settings → Environment variables에서 설정

3. **Netlify CLI 배포**
```bash
# Netlify CLI 설치
npm install -g netlify-cli

# 로그인
netlify login

# 초기 배포
netlify init

# 수동 배포
netlify deploy --prod
```

---

## 📘 GitHub Pages 배포

### GitHub Actions 설정

`.github/workflows/gh-pages.yml`:

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [ main ]

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: "pages"
  cancel-in-progress: false

jobs:
  build:
    runs-on: ubuntu-latest
    
    steps:
    - name: Checkout
      uses: actions/checkout@v3
    
    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'
        cache: 'npm'
    
    - name: Install dependencies
      run: npm ci
    
    - name: Build
      run: npm run build
      env:
        VITE_FIREBASE_API_KEY: ${{ secrets.VITE_FIREBASE_API_KEY }}
        VITE_FIREBASE_AUTH_DOMAIN: ${{ secrets.VITE_FIREBASE_AUTH_DOMAIN }}
        VITE_FIREBASE_PROJECT_ID: ${{ secrets.VITE_FIREBASE_PROJECT_ID }}
        VITE_FIREBASE_STORAGE_BUCKET: ${{ secrets.VITE_FIREBASE_STORAGE_BUCKET }}
        VITE_FIREBASE_MESSAGING_SENDER_ID: ${{ secrets.VITE_FIREBASE_MESSAGING_SENDER_ID }}
        VITE_FIREBASE_APP_ID: ${{ secrets.VITE_FIREBASE_APP_ID }}
        VITE_FIREBASE_MEASUREMENT_ID: ${{ secrets.VITE_FIREBASE_MEASUREMENT_ID }}
    
    - name: Setup Pages
      uses: actions/configure-pages@v3
    
    - name: Upload artifact
      uses: actions/upload-pages-artifact@v2
      with:
        path: './dist'
    
    - name: Deploy to GitHub Pages
      id: deployment
      uses: actions/deploy-pages@v2
```

### Base URL 설정

`vite.config.ts`에 base URL 추가:

```typescript
export default defineConfig({
  base: '/your-repo-name/', // GitHub Pages의 경우
  // ... 기타 설정
})
```

---

## 🔥 Firebase Hosting

### Firebase CLI 설정

1. **Firebase CLI 설치 및 설정**
```bash
# Firebase CLI 설치
npm install -g firebase-tools

# Firebase 로그인
firebase login

# 프로젝트 초기화
firebase init hosting
```

2. **firebase.json 설정**
```json
{
  "hosting": {
    "public": "dist",
    "ignore": [
      "firebase.json",
      "**/.*",
      "**/node_modules/**"
    ],
    "rewrites": [
      {
        "source": "**",
        "destination": "/index.html"
      }
    ],
    "headers": [
      {
        "source": "/assets/**",
        "headers": [
          {
            "key": "Cache-Control",
            "value": "public, max-age=31536000, immutable"
          }
        ]
      }
    ]
  }
}
```

3. **배포 실행**
```bash
# 빌드
npm run build

# Firebase 배포
firebase deploy --only hosting
```

### GitHub Actions Firebase 배포

```yaml
name: Deploy to Firebase Hosting

on:
  push:
    branches: [ main ]

jobs:
  build_and_deploy:
    runs-on: ubuntu-latest

    steps:
    - uses: actions/checkout@v3
    
    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'
        cache: 'npm'
    
    - name: Install dependencies
      run: npm ci
    
    - name: Build
      run: npm run build
    
    - name: Deploy to Firebase Hosting
      uses: FirebaseExtended/action-hosting-deploy@v0
      with:
        repoToken: '${{ secrets.GITHUB_TOKEN }}'
        firebaseServiceAccount: '${{ secrets.FIREBASE_SERVICE_ACCOUNT }}'
        projectId: your-project-id
```

---

## 🌍 도메인 설정

### 커스텀 도메인 연결

1. **Vercel 도메인 설정**
```bash
# Vercel CLI로 도메인 추가
vercel domains add yourdomain.com
```

2. **DNS 설정**
```
A 레코드: @ → 76.76.19.61
CNAME 레코드: www → cname.vercel-dns.com
```

3. **SSL 인증서**
대부분의 호스팅 서비스에서 자동으로 Let's Encrypt SSL 제공

### HTTPS 강제 리다이렉트

Vercel에서는 자동으로 처리되지만, 다른 서비스의 경우:

```javascript
// _headers (Netlify)
/*
  X-Frame-Options: DENY
  X-XSS-Protection: 1; mode=block
  X-Content-Type-Options: nosniff
  Strict-Transport-Security: max-age=31536000; includeSubDomains
```

---

## ⚡ 성능 최적화

### 번들 분석

```bash
# 번들 분석기 설치
npm install --save-dev rollup-plugin-visualizer

# vite.config.ts에 플러그인 추가
import { visualizer } from 'rollup-plugin-visualizer';

export default defineConfig({
  plugins: [
    react(),
    visualizer({
      filename: 'dist/stats.html',
      open: true,
      gzipSize: true,
      brotliSize: true,
    }),
  ],
});
```

### 이미지 최적화

```typescript
// vite.config.ts
import { defineConfig } from 'vite'
import { createSvgIconsPlugin } from 'vite-plugin-svg-icons'

export default defineConfig({
  plugins: [
    createSvgIconsPlugin({
      iconDirs: [path.resolve(process.cwd(), 'src/assets/icons')],
      symbolId: 'icon-[dir]-[name]',
    })
  ],
  build: {
    rollupOptions: {
      output: {
        assetFileNames: (assetInfo) => {
          const info = assetInfo.name.split('.');
          const extType = info[info.length - 1];
          if (/png|jpe?g|svg|gif|tiff|bmp|ico/i.test(extType)) {
            return `assets/images/[name]-[hash][extname]`;
          }
          return `assets/[name]-[hash][extname]`;
        },
      },
    },
  },
})
```

### CDN 설정

```typescript
// vite.config.ts
export default defineConfig({
  build: {
    rollupOptions: {
      external: ['react', 'react-dom'],
      output: {
        globals: {
          react: 'React',
          'react-dom': 'ReactDOM'
        }
      }
    }
  }
})
```

`index.html`에 CDN 링크 추가:

```html
<script crossorigin src="https://unpkg.com/react@18/umd/react.production.min.js"></script>
<script crossorigin src="https://unpkg.com/react-dom@18/umd/react-dom.production.min.js"></script>
```

---

## 📊 모니터링

### 성능 모니터링

1. **Google Analytics 4**
```typescript
// src/lib/analytics.ts
import { getAnalytics, logEvent } from 'firebase/analytics';

const analytics = getAnalytics();

export const trackEvent = (eventName: string, parameters?: any) => {
  if (typeof window !== 'undefined') {
    logEvent(analytics, eventName, parameters);
  }
};

// 게임 이벤트 추적
trackEvent('game_start');
trackEvent('game_win', { amount: winAmount });
trackEvent('game_jackpot', { type: 'mega' });
```

2. **Web Vitals 모니터링**
```typescript
// src/lib/vitals.ts
import { getCLS, getFID, getFCP, getLCP, getTTFB } from 'web-vitals';

function sendToAnalytics(metric: any) {
  trackEvent('web_vitals', {
    metric_name: metric.name,
    metric_value: Math.round(metric.value),
    metric_rating: metric.rating,
  });
}

getCLS(sendToAnalytics);
getFID(sendToAnalytics);
getFCP(sendToAnalytics);
getLCP(sendToAnalytics);
getTTFB(sendToAnalytics);
```

### 에러 모니터링

1. **Sentry 설정**
```bash
npm install @sentry/react @sentry/vite-plugin
```

```typescript
// src/main.tsx
import * as Sentry from "@sentry/react";

Sentry.init({
  dsn: "YOUR_SENTRY_DSN",
  environment: import.meta.env.MODE,
  tracesSampleRate: 1.0,
});
```

2. **커스텀 에러 바운더리**
```typescript
// src/components/ErrorBoundary.tsx
import { ErrorBoundary } from "@sentry/react";

const MyErrorBoundary = ({ children }: { children: React.ReactNode }) => (
  <ErrorBoundary fallback={<ErrorFallback />} showDialog>
    {children}
  </ErrorBoundary>
);
```

---

## 🚀 배포 체크리스트

### 배포 전 확인사항

- [ ] 모든 환경 변수 설정 완료
- [ ] Firebase 설정 및 보안 규칙 적용
- [ ] 빌드 에러 없이 성공
- [ ] 모든 기능 테스트 완료
- [ ] 성능 최적화 적용
- [ ] SEO 메타 태그 설정
- [ ] 브라우저 호환성 테스트
- [ ] 모바일 반응형 테스트
- [ ] 에러 모니터링 설정

### SEO 최적화

```html
<!-- public/index.html -->
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>프리미엄 슬롯머신 게임 | Premium Slot Machine</title>
  <meta name="description" content="최고의 프리미엄 슬롯머신 게임! 3D 그래픽, 파티클 효과, 다양한 보너스 게임을 즐겨보세요." />
  <meta name="keywords" content="슬롯머신, 온라인게임, 카지노게임, 프리미엄게임" />
  
  <!-- Open Graph -->
  <meta property="og:title" content="프리미엄 슬롯머신 게임" />
  <meta property="og:description" content="최고의 프리미엄 슬롯머신 게임! 3D 그래픽, 파티클 효과, 다양한 보너스 게임을 즐겨보세요." />
  <meta property="og:image" content="/og-image.png" />
  <meta property="og:url" content="https://your-domain.com" />
  <meta property="og:type" content="website" />
  
  <!-- Twitter Card -->
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="프리미엄 슬롯머신 게임" />
  <meta name="twitter:description" content="최고의 프리미엄 슬롯머신 게임!" />
  <meta name="twitter:image" content="/twitter-image.png" />
  
  <!-- Favicon -->
  <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
  <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
  
  <!-- Manifest -->
  <link rel="manifest" href="/site.webmanifest" />
</head>
```

---

## 🔧 트러블슈팅

### 일반적인 배포 문제

1. **환경 변수 누락**
```bash
# 환경 변수 확인
echo $VITE_FIREBASE_API_KEY
```

2. **빌드 실패**
```bash
# 캐시 삭제 후 재빌드
rm -rf node_modules package-lock.json
npm install
npm run build
```

3. **라우팅 문제**
```json
// vercel.json
{
  "rewrites": [
    { "source": "/(.*)", "dest": "/index.html" }
  ]
}
```

4. **CORS 에러**
```typescript
// Firebase 보안 규칙에서 도메인 허용
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if request.auth != null;
    }
  }
}
```

### 성능 이슈

1. **번들 크기 최적화**
```typescript
// 동적 임포트 사용
const Slot3D = lazy(() => import('./components/Slot3D'));
const PremiumLottie = lazy(() => import('./components/PremiumLottie'));
```

2. **이미지 최적화**
```bash
# WebP 변환
npm install -g @squoosh/cli
squoosh-cli --webp auto src/assets/images/*.png
```

---

이제 프로젝트가 완전히 문서화되었습니다! API 문서와 배포 가이드가 추가되어 개발자들이 쉽게 프로젝트를 이해하고 배포할 수 있도록 구성했습니다. 🚀✨