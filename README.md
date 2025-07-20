# React + Vite + React Query + Zustand + Ant Design

**고성능 React 애플리케이션** - 현대적인 기술 스택과 최적화 기법이 적용된 풀스택 데모 프로젝트

이 프로젝트는 React 생태계의 최신 기술들을 통합하여 **성능 최적화**와 **개발자 경험(DX)** 모두를 고려한 최적의 아키텍처를 제공합니다.

## 🚀 주요 기술 스택

### Core Framework
- **React 18** - 최신 Concurrent Features와 Automatic Batching 지원
- **Vite** - 번개같이 빠른 개발 서버와 HMR (Hot Module Replacement)
- **JSX** - 컴포넌트 기반 선언적 UI 구성

### 상태 관리 & 데이터 페칭
- **React Query (@tanstack/react-query v5)** - 서버 상태 관리의 표준
  - 자동 캐싱, 백그라운드 업데이트, Optimistic Updates
  - Stale-While-Revalidate 전략으로 최적의 사용자 경험
- **Zustand** - 가볍고 직관적인 클라이언트 상태 관리 (2.5KB)
  - Redux 복잡성 없는 간단한 API
  - TypeScript 완벽 지원

### HTTP 클라이언트
- **Axios** - Promise 기반 HTTP 클라이언트
  - 자동 JSON 파싱
  - 향상된 에러 처리
  - 요청/응답 인터셉터 지원

### UI & 스타일링
- **Ant Design v5** - 기업급 React UI 컴포넌트 라이브러리
  - 180+ 고품질 컴포넌트
  - 한국어 로케일 완벽 지원
  - 다크 모드 및 테마 커스터마이징

### 라우팅 & 네비게이션
- **React Router v7** - SPA를 위한 선언적 라우팅
  - Code Splitting과 Lazy Loading으로 성능 최적화
  - 중첩 라우팅과 동적 라우팅 지원

## 📦 설치 및 실행

### 1. 의존성 설치
```bash
npm install
```

### 2. 개발 서버 실행
```bash
npm run dev
```

### 3. 빌드
```bash
npm run build
```

### 4. 빌드된 프로젝트 미리보기
```bash
npm run preview
```

## 📁 프로젝트 구조

```
src/
├── components/     # React 컴포넌트들
├── store/         # Zustand 스토어들
├── hooks/         # 커스텀 훅들 (React Query 포함)
├── api/           # API 관련 함수들 (Axios 기반)
├── utils/         # 유틸리티 함수들
├── App.jsx        # 메인 앱 컴포넌트
└── main.jsx       # 앱 진입점
```

## 🔧 주요 기능

### React Query
- 서버 상태 관리 및 캐싱
- 자동 백그라운드 업데이트
- 로딩 및 에러 상태 관리
- 개발자 도구 포함

### Zustand
- 간단하고 직관적인 상태 관리
- 보일러플레이트 없는 설정
- TypeScript 지원 (필요시)

### Ant Design
- 풍부한 UI 컴포넌트
- 한국어 로케일 설정
- 일관된 디자인 시스템

## 🛠 개발 도구

- **React Query Devtools** - 쿼리 상태 디버깅
- **Vite HMR** - 빠른 핫 리로드
- **ESLint** - 코드 품질 관리

## 📝 사용 예제

프로젝트에서 다음과 같은 예제들을 확인할 수 있습니다:

1. **Zustand를 이용한 카운터** - 클라이언트 상태 관리
2. **React Query를 이용한 사용자 목록** - 서버 데이터 페칭
3. **Ant Design 컴포넌트** - UI 구성 요소들
