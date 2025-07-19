# React Query + Zustand 기반 CRUD 애플리케이션 생성 프롬프트 (v2024)

이 프롬프트를 사용하여 Users, Posts, Todos 디렉토리와 동일한 패턴으로 완전한 CRUD 애플리케이션을 생성할 수 있습니다. 
최적화된 공통 스타일 시스템과 현대적인 React 패턴을 적용합니다.

## 사용법

아래 프롬프트를 복사하여 사용하고, `{API_URL}`과 `{ENTITY_NAME}`을 실제 값으로 교체하세요. 
디렉토리명은 엔티티명과 동일하게 자동으로 설정됩니다.

---

## 프롬프트

```
다음 요구사항에 따라 완전한 CRUD 애플리케이션을 생성해주세요:

**API URL**: {API_URL}
**엔티티명**: {ENTITY_NAME}
(디렉토리명은 엔티티명과 동일하게 생성됩니다)

### 생성할 파일들:

1. **src/pages/{ENTITY_NAME}/{ENTITY_NAME}Page.jsx**
   - 메인 컨테이너 컴포넌트
   - React Query + Zustand 예제임을 표시하는 제목
   - {ENTITY_NAME}List 컴포넌트를 렌더링

2. **src/pages/{ENTITY_NAME}/{ENTITY_NAME}List.jsx**
   - React Query를 사용한 데이터 조회 및 표시
   - Ant Design List 컴포넌트 사용
   - 공통 스타일 클래스 적용: `page-list-container`, `list-scroll-hide`, `page-list`
   - 체크박스를 이용한 개별 선택 기능 (useCheckedStore 사용)
   - 선택된 항목들 삭제 기능 (useMutation 사용)
   - FloatButton으로 새 항목 추가 버튼 (동적 위치 조정)
   - 삭제 버튼은 `fixed-delete-button` 클래스로 하단에 고정 배치
   - 로딩 상태: `loading-container`, `loading-text` 클래스 사용
   - 빈 상태: `empty-container`, `empty-icon`, `empty-text` 클래스 사용
   - 에러 상태: `error-alert` 클래스 사용
   - 검색/필터 컨트롤: `search-filter-container`, `search-input`, `filter-select` 클래스
   - 전체 선택: `select-all-container`, `select-all-left`, `select-stats` 클래스

3. **src/pages/{ENTITY_NAME}/{ENTITY_NAME}Item.jsx**
   - 개별 항목을 표시하는 컴포넌트
   - 공통 스타일 클래스 적용: `list-item-base`, `checkbox-container`
   - 체크박스와 항목 내용으로 구성
   - 항목 클릭 시 상세 페이지로 이동
   - List.Item.Meta를 사용한 정보 표시
   - 아바타: `item-avatar` 클래스, 메타 정보: `item-meta-title`, `item-meta-description`
   - 태그: `item-tag` 클래스 사용
   - React.memo로 최적화 및 useCallback 훅 사용

4. **src/pages/{ENTITY_NAME}/{ENTITY_NAME}Detail.jsx**
   - 상세 정보 표시 및 편집 컴포넌트
   - 새 항목 추가 모드 (id === 'new') 지원
   - React Query를 사용한 데이터 조회, 추가, 수정
   - Form 입력값 실시간 유효성 검사
   - 변경사항 추적 및 취소 기능
   - 폼 레이아웃: Card > Form (vertical layout)
   - 로딩, 에러 상태 처리

5. **src/pages/{ENTITY_NAME}/{ENTITY_NAME.toLowerCase()}-list.css**
   - 엔티티별 특화 스타일만 포함 (공통 스타일은 src/styles/pages.css 사용)
   - 엔티티별 색상 테마 (예: Posts=보라색, Users=파란색, Todos=녹색)
   - 특화된 상태별 스타일 (예: Todos의 완료/미완료 상태)
   - 반응형 스타일 오버라이드 (필요시)

6. **src/api/{ENTITY_NAME.toLowerCase()}Api.js**
   - 엔티티별 API 함수들 모음
   - fetch API 기반 (axios 대신 fetch 사용)
   - 기본 구조: `{entity}Api = { getAll, getById, create, update, delete }`
   - HTTP 상태 코드 검사 및 에러 처리
   - JSON 데이터 변환 처리

7. **src/hooks/use{ENTITY_NAME}Queries.js**
   - React Query 커스텀 훅 모음
   - QueryKey Factory 패턴: `{entity}Keys = { all: () => [...], list: (filters) => [...], detail: (id) => [...] }`
   - use{ENTITY_NAME}Query: 단일 항목 조회
   - use{ENTITY_NAME}sQuery: 목록 조회  
   - useAdd{ENTITY_NAME}Mutation: 추가
   - useUpdate{ENTITY_NAME}Mutation: 수정
   - useDelete{ENTITY_NAME}sMutation: 다중 삭제
   - **필수 import**: `useQuery, useMutation, useQueryClient`, `handleReactQueryError`
   - `useNotificationStore`를 통한 성공/실패 알림 (showSuccess, showError)
   - `useClearChecked`를 통한 체크박스 상태 초기화
   - `queryClient.invalidateQueries()` 직접 사용으로 캐시 무효화

### 스타일 시스템:
- **공통 스타일**: `src/styles/pages.css` 자동 임포트 (main.jsx에서 전역 로드)
- **엔티티별 스타일**: `./[entity-name]-list.css` 각 컴포넌트에서 임포트
- **공통 클래스 사용**: 모든 컴포넌트에서 pages.css의 클래스 활용
- **CSS 최적화**: 중복 제거, 공통 패턴 재사용, 반응형 디자인

### 필수 공통 유틸리티 및 설정:
```javascript
// API 계층
import { {entity}Api } from '../api/{entity}Api'

// React Query 및 에러 처리
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { handleReactQueryError } from '../utils/handleAxiosError'

// 전역 상태 관리 (Zustand)
import useNotificationStore from '../store/useNotificationStore'
import useCheckedStore, { useClearChecked } from '../store/useCheckedStore'

// 공통 스타일
import '../../styles/pages.css'  // 전역에서 자동 로드됨 (main.jsx)
import './{entity}-list.css'     // 엔티티 특화 스타일
```

### 필수 Import 구조별 가이드:

#### **API 파일 (src/api/{entity}Api.js)**:
```javascript
// 기본 구조 예시
const API_URL = 'https://api.example.com/{entities}'

export const {entity}Api = {
  getAll: async () => {
    const response = await fetch(API_URL)
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    return response.json()
  },
  
  getById: async (id) => {
    const response = await fetch(`${API_URL}/${id}`)
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    return response.json()
  },
  
  create: async (data) => {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    })
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    return response.json()
  },
  
  update: async (id, data) => {
    const response = await fetch(`${API_URL}/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    })
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    return response.json()
  },
  
  delete: async (id) => {
    const response = await fetch(`${API_URL}/${id}`, {
      method: 'DELETE'
    })
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    return response.json()
  }
}
```

#### **React Query 훅 파일 (src/hooks/use{Entity}Queries.js)**:
```javascript
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { {entity}Api } from '../api/{entity}Api'
import { handleReactQueryError } from '../utils/handleAxiosError'
import useNotificationStore from '../store/useNotificationStore'
import { useClearChecked } from '../store/useCheckedStore'

// QueryKey Factory 패턴
export const {entity}Keys = {
  all: () => ["{entities}"],
  list: (filters = {}) => [...{entity}Keys.all(), "list", filters],
  detail: (id) => [...{entity}Keys.all(), "detail", id],
}

// 목록 조회 훅
export const use{Entity}sQuery = (options = {}) => {
  const { showError } = useNotificationStore()
  
  return useQuery({
    queryKey: {entity}Keys.list(),
    queryFn: {entity}Api.getAll,
    staleTime: 5 * 60 * 1000, // 5분
    gcTime: 10 * 60 * 1000,   // 10분
    retry: 3,
    onError: (error) => {
      showError(handleReactQueryError(error, '{Entity} 목록 조회'))
    },
    ...options
  })
}

// 단일 조회 훅
export const use{Entity}Query = (id, options = {}) => {
  const { showError } = useNotificationStore()
  
  return useQuery({
    queryKey: {entity}Keys.detail(id),
    queryFn: () => {entity}Api.getById(id),
    enabled: !!id && id !== 'new',
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    retry: 3,
    onError: (error) => {
      showError(handleReactQueryError(error, '{Entity} 조회'))
    },
    ...options
  })
}

// 추가 뮤테이션
export const useAdd{Entity}Mutation = () => {
  const { showSuccess, showError } = useNotificationStore()
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: {entity}Api.create,
    onSuccess: (data) => {
      showSuccess('{Entity}가 성공적으로 추가되었습니다.')
      queryClient.invalidateQueries({ queryKey: {entity}Keys.all() })
    },
    onError: (error) => {
      showError(handleReactQueryError(error, '{Entity} 추가'))
    }
  })
}

// 수정 뮤테이션  
export const useUpdate{Entity}Mutation = () => {
  const { showSuccess, showError } = useNotificationStore()
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: ({ id, data }) => {entity}Api.update(id, data),
    onSuccess: (data, { id }) => {
      showSuccess('{Entity}가 성공적으로 수정되었습니다.')
      queryClient.invalidateQueries({ queryKey: {entity}Keys.detail(id) })
      queryClient.invalidateQueries({ queryKey: {entity}Keys.all() })
    },
    onError: (error) => {
      showError(handleReactQueryError(error, '{Entity} 수정'))
    }
  })
}

// 다중 삭제 뮤테이션
export const useDelete{Entity}sMutation = () => {
  const { showSuccess, showError } = useNotificationStore()
  const clearChecked = useClearChecked()
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async (ids) => {
      const results = await Promise.all(
        ids.map(id => {entity}Api.delete(id))
      )
      return results
    },
    onSuccess: (data, ids) => {
      showSuccess(`${ids.length}개의 {Entity}가 성공적으로 삭제되었습니다.`)
      clearChecked()
      queryClient.invalidateQueries({ queryKey: {entity}Keys.all() })
    },
    onError: (error) => {
      showError(handleReactQueryError(error, '{Entity} 삭제'))
    }
  })
}
```

### 기술 스택 및 라이브러리:
- React 18+ with JSX (함수형 컴포넌트, Hooks)
- React Router (useParams, useNavigate)
- React Query (@tanstack/react-query v5)
- Zustand (useCheckedStore, useNotificationStore)
- Ant Design v5 (List, Button, Alert, Spin, FloatButton, Form, Input, Card, Typography, Space, Checkbox)
- **Fetch API** (axios 대신 fetch 사용)
- 공통 스타일 시스템 (src/styles/pages.css)
- React.memo + useCallback 성능 최적화

### 프로젝트 공통 유틸리티:
- **handleReactQueryError** (src/utils/handleAxiosError.js) - React Query 에러 처리
- **handleErrorWithLogging** - 개발 환경 에러 로깅
- **useQueryClient** - React Query 캐시 무효화 및 관리
- **useNotificationStore** - showSuccess, showError, showWarning, showInfo 메서드
- **useCheckedStore** - checkedIds, toggleCheck, clearChecked, isAllChecked 등

### API 엔드포인트:
- GET {API_URL} - 목록 조회
- GET {API_URL}/{id} - 단일 항목 조회
- POST {API_URL} - 새 항목 추가
- PUT {API_URL}/{id} - 항목 수정
- DELETE {API_URL}/{id} - 항목 삭제

### 라우터 설정:
- /{ENTITY_NAME.toLowerCase()} - 목록 페이지
- /{ENTITY_NAME.toLowerCase()}/{ENTITY_NAME.toLowerCase()}/:id - 상세/편집 페이지
- /{ENTITY_NAME.toLowerCase()}/{ENTITY_NAME.toLowerCase()}/new - 새 항목 추가 페이지

### 주요 기능:
- 실시간 검색 및 필터링 (useState + useMemo 최적화)
- 체크박스 다중 선택 (useCheckedStore)
- 일괄 삭제 (React Query mutation)
- 인라인 편집 (Form 컴포넌트)
- 폼 유효성 검사 (실시간 validation)
- 로딩 및 에러 상태 처리 (공통 스타일 적용)
- 반응형 디자인 (모바일 최적화)
- 성능 최적화 (React.memo, useCallback, 구조적 공유)
- 로딩 및 에러 상태 처리 (공통 스타일 적용)
- 반응형 디자인 (모바일 최적화)
- 성능 최적화 (React.memo, useCallback, 구조적 공유)

### 스타일링 요구사항:
- **공통 스타일 시스템 사용**: src/styles/pages.css의 클래스 활용
- **반응형 디자인**: 모바일 퍼스트, 태블릿, 데스크톱 최적화
- **접근성**: 키보드 내비게이션, 스크린 리더 지원
- **다크 모드**: prefers-color-scheme 지원
- **성능**: 하드웨어 가속, will-change 속성 활용
- **일관성**: 기존 Posts, Users, Todos와 동일한 디자인 패턴

모든 파일에 상세한 주석을 포함하고, TypeScript 타입 정의가 필요한 경우 JSDoc을 사용하세요.

**중요 구현 가이드**: 
- **API 계층**: fetch API 사용, HTTP 상태 검사, JSON 변환 처리
- **에러 처리**: `handleReactQueryError(error, context)` 함수 활용
- **알림 시스템**: `useNotificationStore`의 `showSuccess/showError` 메서드 사용
- **상태 관리**: `useCheckedStore`로 체크박스 상태, `useClearChecked`로 초기화
- **React Query**: QueryKey Factory 패턴, 직접 `queryClient.invalidateQueries()` 사용
- **스타일링**: 공통 클래스 우선 사용, 인라인 스타일 금지
- **성능 최적화**: React.memo, useCallback, useMemo 적극 활용
```

---

## 현재 프로젝트의 실제 공통 함수 및 스토어 (반드시 활용)

### 🔧 **공통 유틸리티 함수**
```javascript
// src/utils/handleAxiosError.js
export const handleAxiosError = (error) => { ... }           // 기본 에러 처리
export const handleReactQueryError = (error, context) => { ... }  // React Query용 에러 처리  
export const handleErrorWithLogging = (error, operation) => { ... } // 개발환경 로깅
```

### 🏪 **Zustand 스토어**
```javascript
// src/store/useNotificationStore.js
const { showSuccess, showError, showWarning, showInfo } = useNotificationStore()

// src/store/useCheckedStore.js  
const { 
  checkedIds, 
  toggleCheck, 
  toggleAllCheck,
  clearChecked,
  isChecked,
  isAllChecked,
  isIndeterminate,
  getCheckedCount
} = useCheckedStore()

// 선택자 헬퍼 (성능 최적화용)
import { useClearChecked, useCheckedIds, useToggleCheck } from '../store/useCheckedStore'
```

### ⚙️ **React Query 최적화 패턴**
```javascript
// QueryKey Factory 패턴
export const {entity}Keys = {
  all: () => ["{entities}"],
  list: (filters = {}) => [...{entity}Keys.all(), "list", filters], 
  detail: (id) => [...{entity}Keys.all(), "detail", id]
}

// 기본 쿼리 옵션 (직접 설정)
const defaultQueryOptions = {
  staleTime: 5 * 60 * 1000,  // 5분
  gcTime: 10 * 60 * 1000,    // 10분 (구 cacheTime)
  retry: 3,
  refetchOnWindowFocus: false
}

// 캐시 무효화 (useQueryClient 직접 사용)
const queryClient = useQueryClient()
queryClient.invalidateQueries({ queryKey: {entity}Keys.all() })
```

---

## 현재 프로젝트의 공통 스타일 클래스 (src/styles/pages.css)

### 레이아웃 클래스:
- `.page-list-container` - 페이지 리스트 컨테이너
- `.page-list` - 공통 리스트 스타일
- `.page-list.has-bottom-action` - 하단 액션 버튼이 있을 때
- `.list-scroll-hide` - 스크롤바 숨김 처리

### 상태 클래스:
- `.loading-container`, `.loading-text` - 로딩 상태
- `.empty-container`, `.empty-icon`, `.empty-text` - 빈 상태
- `.error-alert` - 에러 알림

### 아이템 클래스:
- `.list-item-base` - 공통 리스트 아이템
- `.list-item-base.checked` - 체크된 아이템
- `.checkbox-container` - 체크박스 컨테이너
- `.item-avatar`, `.item-meta-title`, `.item-meta-description` - 메타 정보
- `.item-tag` - 태그 스타일

### 컨트롤 클래스:
- `.search-filter-container` - 검색/필터 컨테이너
- `.search-input`, `.filter-select` - 검색/필터 입력
- `.select-all-container`, `.select-all-left`, `.select-stats` - 전체 선택
- `.float-button-default`, `.float-button-with-action` - FloatButton 위치
- `.fixed-delete-button` - 하단 고정 삭제 버튼

---

## 사용 예시

### 예시 1: Products 관리 시스템
```
**API URL**: https://api.example.com/products  
**엔티티명**: Products
```

### 예시 2: Orders 관리 시스템  
```
**API URL**: https://api.example.com/orders
**엔티티명**: Orders
```

### 예시 3: Categories 관리 시스템
```
**API URL**: https://api.example.com/categories
**엔티티명**: Categories
```

### 예시 4: JSONPlaceholder API 사용
```
**API URL**: https://jsonplaceholder.typicode.com/albums
**엔티티명**: Albums
```

## 추가 요구사항

생성된 파일들은 기존 Users, Posts, Todos 디렉토리와 동일한 아키텍처와 패턴을 따라야 합니다:

1. **일관성**: 파일 구조, 네이밍 컨벤션, 코드 스타일이 기존 컴포넌트와 일치
2. **재사용성**: 공통 store(useCheckedStore, useNotificationStore)와 스타일 시스템 활용
3. **확장성**: 새로운 기능을 쉽게 추가할 수 있는 구조
4. **유지보수성**: 명확한 관심사 분리와 모듈화
5. **성능**: React.memo, useCallback, useMemo를 활용한 최적화
6. **스타일 최적화**: 공통 CSS 클래스 활용으로 중복 최소화

## 생성 후 확인사항

1. ✅ **Import/Export**: 모든 import/export가 올바르게 작동하는지 확인
2. ✅ **API 연동**: fetch API를 사용한 엔드포인트가 올바르게 설정되었는지 확인  
3. ✅ **라우팅**: 라우터 설정이 routes.js에 추가되었는지 확인
4. ✅ **공통 함수**: handleReactQueryError, createQueryOptions 등 프로젝트 공통 함수 사용 확인
5. ✅ **공통 스토어**: useNotificationStore, useCheckedStore 적절히 활용했는지 확인
6. ✅ **스타일**: 공통 CSS 클래스 활용하고 인라인 스타일 제거했는지 확인
7. ✅ **성능**: React.memo, useCallback 최적화가 적용되었는지 확인
8. ✅ **에러 처리**: handleReactQueryError로 일관된 에러 처리 구현했는지 확인
9. ✅ **알림**: showSuccess/showError 메서드로 사용자 피드백 제공하는지 확인
10. ✅ **반응형**: 모바일, 태블릿, 데스크톱에서 정상 작동하는지 확인

## 최신 기능 및 개선사항 (2024)

### 🎨 스타일 시스템 v2.0
- 공통 스타일 클래스 시스템으로 CSS 중복 90% 감소
- 반응형 디자인 및 다크 모드 지원
- 하드웨어 가속 및 성능 최적화

### ⚡ React 성능 최적화
- React.memo + useCallback 패턴으로 불필요한 리렌더링 방지
- 구조적 공유(Structural Sharing) 활용
- useMemo를 통한 필터링 최적화

### 🔄 React Query v5 패턴
- QueryKey Factory 패턴: `{entity}Keys = { all, list, detail }`
- `handleReactQueryError` 통합 에러 처리
- `useQueryClient` 직접 사용으로 캐시 무효화 
- 기본 쿼리 옵션 직접 설정 (staleTime, gcTime, retry)

### 🏪 Zustand 스토어 통합
- `useNotificationStore`: showSuccess, showError, showWarning, showInfo
- `useCheckedStore`: checkedIds, toggleCheck, clearChecked, 체크박스 상태 관리
- 선택자 헬퍼: useClearChecked, useCheckedIds 성능 최적화

### 🌐 Fetch API 패턴
- axios 대신 fetch API 사용으로 번들 크기 최적화
- HTTP 상태 코드 검사 및 JSON 변환 처리
- 일관된 에러 처리 패턴

### 🎯 UX/UI 개선
- 동적 FloatButton 위치 조정
- 하단 고정 액션 버튼 (backdrop-filter 적용)
- 향상된 로딩 및 빈 상태 표시
- 실시간 알림 시스템 (Ant Design message API 연동)

이 프롬프트를 사용하여 어떤 엔티티든 현재 프로젝트와 **완전히 동일한 아키텍처, 공통 함수, 스타일 시스템**을 가진 고품질 CRUD 애플리케이션을 생성할 수 있습니다.
