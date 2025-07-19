# React + Vite + React Query + Zustand + Ant Design

이 프로젝트는 React와 Vite를 기반으로 하며, 다음과 같은 주요 라이브러리들을 사용합니다:

## 🚀 주요 기술 스택

- **React 18** - 사용자 인터페이스 구축을 위한 JavaScript 라이브러리
- **Vite** - 빠른 개발 서버와 빌드 도구
- **React Query (@tanstack/react-query)** - 서버 상태 관리와 데이터 페칭
- **Zustand** - 경량 클라이언트 상태 관리
- **Ant Design** - 기업급 UI 컴포넌트 라이브러리

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
├── api/           # API 관련 함수들
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
