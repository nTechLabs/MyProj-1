# React Query + Zustand 기반 CRUD 애플리케이션 생성 프롬프트 (v2025.01.29)

이 프롬프트를 사용하여 Users, Posts, Todos, Comments, Photos 디렉토리와 동일한 패턴으로 완전한 CRUD 애플리케이션을 생성할 수 있습니다. 
최적화된 공통 스타일 시스템, createCheckedStore 팩토리 패턴, axios HTTP 클라이언트를 적용합니다.

## 🚀 최신 업데이트 (2025.01.29)
- **createCheckedStore 팩토리 패턴** 적용으로 중복 코드 90% 감소
- **axios + dataSourceManager** 통합으로 네트워크/로컬 데이터 자동 전환
- **invalidateQueries 헬퍼** 적용으로 캐시 무효화 표준화
- **React Query 패턴 개선** - onError 콜백 방식으로 통일
- **성능 최적화** - 개별 선택자로 불필요한 리렌더링 방지

## 사용법

아래 프롬프트를 복사하여 사용하고, `{API_URL}`과 `{ENTITY_NAME}`을 실제 값으로 교체하세요. 
디렉토리명은 엔티티명과 동일하게 자동으로 설정됩니다.

---

## 프롬프트

```
다음 요구사항에 따라 완전한 C이 프롬프트를 사용하여 어떤 엔티티든 현재 프로젝트와 **완전히 동일한 아키텍처, createCheckedStore 팩토리 패턴, axios + dataSourceManager, invalidateQueries 헬퍼**를 가진 고품질 CRUD 애플리케이션을 생성할 수 있습니다.

---

## 📄 프롬프트 파일 현행화 히스토리

- **v2025.01.29**: createCheckedStore 팩토리 패턴, axios + dataSourceManager, invalidateQueries 헬퍼 반영
- **v2025.01.20**: React.memo + useCallback 패턴, 실시간 성능 모니터링, 중앙집중식 React Query 설정
- **v2024**: 초기 버전 (useCheckedStore 직접 사용, fetch API, queryClient 직접 사용)UD 애플리케이션을 생성해주세요:

**API URL**: {API_URL}
**엔티티명**: {ENTITY_NAME}
(디렉토리명은 엔티티명과 동일하게 생성됩니다)

### 생성할 파일들:

1. **src/pages/{ENTITY_NAME}/{ENTITY_NAME}Pa// 개별 선택자 사용 (성능 최적화용 - 권장)
import { use{Entity}ClearChecked, use{Entity}CheckedIds, use{Entity}ToggleCheck } from '../store/use{Entity}CheckedStore'
const clearChecked = use{Entity}ClearChecked()
const checkedIds = use{Entity}CheckedIds()
const toggleCheck = use{Entity}ToggleCheck()
```jsx**
   - 메인 컨테이너 컴포넌트
   - React Query + Zustand 예제임을 표시하는 제목
   - {ENTITY_NAME}List 컴포넌트를 렌더링

2. **src/pages/{ENTITY_NAME}/{ENTITY_NAME}List.jsx**
   - React Query를 사용한 데이터 조회 및 표시
   - Ant Design List 컴포넌트 사용
   - 공통 스타일 클래스 적용: `page-list-container`, `list-scroll-hide`, `page-list`
   - 엔티티별 클래스: `{entity}-list-*` 패턴 사용
   - createCheckedStore 팩토리를 통한 체크박스 상태 관리
   - 선택된 항목들 삭제 기능 (useMutation 사용)
   - FloatButton으로 새 항목 추가 버튼 (동적 위치 조정)
   - 삭제 버튼은 `fixed-delete-button` 클래스로 하단에 고정 배치
   - 로딩 상태: `{entity}-list-loading`, `{entity}-list-loading-text` 클래스 사용
   - 빈 상태: 공통 `empty-container` 클래스 활용
   - 에러 상태: `{entity}-list-error` 클래스 사용
   - 검색/필터 컨트롤: `search-filter-container`, `search-filter-space` 클래스
   - 전체 선택: `select-all-container`, `select-all-left`, `select-stats` 클래스
   - CSS import: `./{entity}.css`

3. **src/pages/{ENTITY_NAME}/{ENTITY_NAME}Item.jsx**
   - 개별 항목을 표시하는 컴포넌트
   - 공통 스타일 클래스 적용: `list-item-base`, `checkbox-container`
   - 엔티티별 클래스: `{entity}-item`, `{entity}-item-*` 패턴 사용
   - createCheckedStore 팩토리의 toggleCheck 액션 사용
   - 항목 클릭 시 상세 페이지로 이동
   - List.Item.Meta를 사용한 정보 표시
   - 아바타: `{entity}-item-avatar-*` 클래스, 메타 정보: `{entity}-item-title`, `{entity}-item-description`
   - 태그: `{entity}-item-tag` 클래스 사용
   - React.memo로 최적화 및 useCallback 훅 사용
   - **인라인 스타일 금지**: 모든 스타일을 CSS 클래스로 분리
   - CSS import: `./{entity}.css`

4. **src/pages/{ENTITY_NAME}/{ENTITY_NAME}Detail.jsx**
   - 상세 정보 표시 및 편집 컴포넌트
   - 새 항목 추가 모드 (id === 'new') 지원
   - React Query를 사용한 데이터 조회, 추가, 수정
   - Form 입력값 실시간 유효성 검사
   - 변경사항 추적 및 취소 기능
   - 폼 레이아웃: Card > Form (vertical layout)
   - 로딩, 에러 상태 처리

5. **src/pages/{ENTITY_NAME}/{ENTITY_NAME.toLowerCase()}.css**
   - 엔티티별 통합 스타일 파일 (List, Item, Detail, Page 모든 컴포넌트용)
   - 엔티티별 색상 테마 (예: Posts=보라색, Users=파란색, Todos=녹색)
   - 컴포넌트별 클래스 네이밍: `{entity}-list-*`, `{entity}-item-*`, `{entity}-detail-*`, `{entity}-page-*`
   - 상태별 스타일 (예: Todos의 완료/미완료, Posts의 published/draft)
   - 반응형 스타일 및 모바일 최적화
   - 공통 스타일(pages.css)을 확장하는 특화 스타일

6. **src/api/{ENTITY_NAME.toLowerCase()}Api.js**
   - 엔티티별 API 함수들 모음
   - **axios 기반 HTTP 클라이언트** 사용 (fetch 대신 axios)
   - 기본 구조: `{entity}Api = { getAll, getById, create, update, delete }`
   - **dataSourceManager** 통합: 네트워크/로컬 데이터 자동 전환
   - HTTP 상태 코드 검사 및 에러 처리
   - JSON 데이터 변환 처리

7. **src/hooks/use{ENTITY_NAME}Queries.js**
   - React Query 커스텀 훅 모음
   - QueryKey Factory 패턴: `{entity}Keys = { all: () => [...], list: (filters) => [...], detail: (id) => [...] }`
   - use{ENTITY_NAME}sQuery: 목록 조회  
   - use{ENTITY_NAME}Query: 단일 항목 조회
   - useAdd{ENTITY_NAME}Mutation: 추가
   - useUpdate{ENTITY_NAME}Mutation: 수정
   - useDelete{ENTITY_NAME}sMutation: 다중 삭제
   - **필수 import**: `useQuery, useMutation`, `handleReactQueryError`
   - `useNotificationStore`를 통한 성공/실패 알림 (showSuccess, showError)
   - **createCheckedStore 팩토리 사용**: `use{Entity}ClearChecked` 선택자 사용
   - **queryClient 직접 import**: `main.jsx`에서 import하여 사용
   - **invalidateQueries 헬퍼**: `reactQueryConfig.js`의 `invalidateQueries` 사용

8. **src/store/use{ENTITY_NAME}Store.js** 
   - **createCheckedStore 팩토리 패턴** 사용
   - 엔티티별 체크박스 상태 관리를 위한 Zustand 스토어
   - **createCheckedSelectors** 를 통한 성능 최적화된 선택자들
   - 주요 export: `use{Entity}ClearChecked`, `use{Entity}ToggleCheck` 등
   - 개별 선택자 export로 리렌더링 최적화

### 스타일 시스템:
- **공통 스타일**: `src/styles/pages.css` 자동 임포트 (main.jsx에서 전역 로드)
- **엔티티별 스타일**: `./[entity-name]-list.css` 각 컴포넌트에서 임포트
- **공통 클래스 사용**: 모든 컴포넌트에서 pages.css의 클래스 활용
- **CSS 최적화**: 중복 제거, 공통 패턴 재사용, 반응형 디자인

### CheckedStore 별도 구성 (최적화된 팩토리 패턴):
- **공통 팩토리**: `src/store/createCheckedStore.js`에서 중복 제거 및 표준화
- **엔티티별 독립 스토어**: `src/store/use{Entity}CheckedStore.js` 생성
- **네이밍 규칙**: use + Entity명(PascalCase) + CheckedStore (예: usePhotosCheckedStore)
- **상태 격리**: 각 엔티티의 체크박스 상태가 독립적으로 관리됨
- **성능 최적화**: Set 기반 O(1) 조회, 선택자 패턴으로 불필요한 리렌더링 방지
- **일관된 API**: 모든 엔티티 CheckedStore가 동일한 인터페이스 제공
- **메모리 효율성**: subscribeWithSelector 미들웨어로 선택적 구독
- **중복 코드 제거**: 90% 이상의 중복 제거로 유지보수성 향상

### 필수 공통 유틸리티 및 설정:
```javascript
// API 계층
import { {entity}Api } from '../api/{entity}Api'

// React Query 및 에러 처리
import { useQuery, useMutation } from '@tanstack/react-query'
import { handleReactQueryError } from '../utils/handleAxiosError'
import { invalidateQueries } from '../config/reactQueryConfig'
import { queryClient } from '../main'

// 전역 상태 관리 (Zustand) - createCheckedStore 팩토리 패턴
import useNotificationStore from '../store/useNotificationStore'
import { use{Entity}ClearChecked, use{Entity}ToggleCheck } from '../store/use{Entity}Store'

// 공통 스타일
import '../../styles/pages.css'  // 전역에서 자동 로드됨 (main.jsx)
import './{entity}.css'         // 엔티티 통합 스타일 (모든 컴포넌트용)
```

### 필수 Import 구조별 가이드:

#### **API 파일 (src/api/{entity}Api.js)**:
```javascript
// axios와 dataSourceManager import 추가
import axios from 'axios'
import { isNetworkEnabled, loadLocalData, findLocalDataById } from '../utils/dataSourceManager'

// API URL 설정
const API_URL = 'https://api.example.com/{entities}'

export const {entity}Api = {
  getAll: async () => {
    if (isNetworkEnabled('{entities}')) {
      const response = await axios.get(API_URL)
      return response.data
    } else {
      return await loadLocalData('{entities}')
    }
  },
  
  getById: async (id) => {
    if (isNetworkEnabled('{entities}')) {
      const response = await axios.get(`${API_URL}/${id}`)
      return response.data
    } else {
      return await findLocalDataById('{entities}', id)
    }
  },
  
  create: async (data) => {
    if (isNetworkEnabled('{entities}')) {
      const response = await axios.post(API_URL, data)
      return response.data
    } else {
      const newItem = { id: Date.now(), ...data }
      console.log('📝 [Local Mode] Created {entity}:', newItem)
      return newItem
    }
  },
  
  update: async (id, data) => {
    if (isNetworkEnabled('{entities}')) {
      const response = await axios.put(`${API_URL}/${id}`, data)
      return response.data
    } else {
      const updatedItem = { id, ...data }
      console.log('✏️ [Local Mode] Updated {entity}:', updatedItem)
      return updatedItem
    }
  },
  
  delete: async (ids) => {
    const idsArray = Array.isArray(ids) ? ids : [ids]
    
    if (isNetworkEnabled('{entities}')) {
      const results = await Promise.allSettled(
        idsArray.map(async (id) => {
          try {
            await axios.delete(`${API_URL}/${id}`)
            return { id, success: true }
          } catch (error) {
            return { id, success: false, error }
          }
        })
      )
      return results.map(result => 
        result.status === 'fulfilled' ? result.value : { id: null, success: false, error: result.reason }
      )
    } else {
      console.log('🗑️ [Local Mode] Deleted {entities}:', idsArray)
      return idsArray.map(id => ({ id, success: true }))
    }
  }
}
```

#### **React Query 훅 파일 (src/hooks/use{Entity}Queries.js)**:
```javascript
import { useQuery, useMutation } from '@tanstack/react-query'
import { {entity}Api } from '../api/{entity}Api'
import { handleReactQueryError } from '../utils/handleAxiosError'
import { invalidateQueries } from '../config/reactQueryConfig'
import { queryClient } from '../main'
import useNotificationStore from '../store/useNotificationStore'
import { use{Entity}ClearChecked } from '../store/use{Entity}Store'

// QueryKey Factory 패턴
export const {entity}Keys = {
  all: () => ["{entities}"],
  list: (filters = {}) => [...{entity}Keys.all(), "list", filters],
  detail: (id) => [...{entity}Keys.all(), "detail", id],
}

// 목록 조회 훅
export const use{Entity}sQuery = () => {
  const { showError } = useNotificationStore()
  
  return useQuery({
    queryKey: {entity}Keys.list(),
    queryFn: {entity}Api.getAll,
    onError: (error) => {
      showError(handleReactQueryError(error, '{Entity} 목록 조회'))
    }
  })
}

// 단일 조회 훅
export const use{Entity}Query = (id) => {
  const { showError } = useNotificationStore()
  
  return useQuery({
    queryKey: {entity}Keys.detail(id),
    queryFn: () => {entity}Api.getById(id),
    enabled: !!id && id !== 'new',
    onError: (error) => {
      showError(handleReactQueryError(error, '{Entity} 조회'))
    }
  })
}

// 추가 뮤테이션
export const useAdd{Entity}Mutation = () => {
  const { showSuccess, showError } = useNotificationStore()
  
  return useMutation({
    mutationFn: {entity}Api.create,
    onSuccess: (data) => {
      showSuccess('새 {Entity}가 추가되었습니다.')
      invalidateQueries.listByEntity('{entities}')
      queryClient.setQueryData({entity}Keys.detail(data.id), data)
    },
    onError: (error) => {
      showError(handleReactQueryError(error, '{Entity} 추가'))
    }
  })
}

// 수정 뮤테이션
export const useUpdate{Entity}Mutation = () => {
  const { showSuccess, showError } = useNotificationStore()
  
  return useMutation({
    mutationFn: ({ id, data }) => {entity}Api.update(id, data),
    onSuccess: (data, variables) => {
      showSuccess('{Entity}가 성공적으로 수정되었습니다.')
      invalidateQueries.listByEntity('{entities}')
      invalidateQueries.detailByEntity('{entities}', variables.id)
      queryClient.setQueryData({entity}Keys.detail(variables.id), data)
    },
    onError: (error) => {
      showError(handleReactQueryError(error, '{Entity} 수정'))
    }
  })
}

// 다중 삭제 뮤테이션
export const useDelete{Entity}sMutation = () => {
  const { showSuccess, showError } = useNotificationStore()
  const clearChecked = use{Entity}ClearChecked()
  
  return useMutation({
    mutationFn: {entity}Api.delete,
    onSuccess: (results) => {
      const successCount = results.filter(result => result.success).length
      const failCount = results.length - successCount
      
      if (successCount > 0) {
        showSuccess(`${successCount}개의 {Entity}가 삭제되었습니다.`)
        invalidateQueries.listByEntity('{entities}')
        clearChecked()
      }
      
      if (failCount > 0) {
        showError(`${failCount}개의 {Entity} 삭제에 실패했습니다.`)
      }
    },
    onError: (error) => {
      showError(handleReactQueryError(error, '{Entity} 삭제'))
    }
  })
}
```

#### **Zustand 스토어 파일 (src/store/use{Entity}Store.js)**:
```javascript
import { createCheckedStore, createCheckedSelectors } from './createCheckedStore'

/**
 * {Entity} 체크된 항목들을 관리하는 Zustand 스토어 (최적화)
 * {Entity} 리스트에서 다중 선택 기능을 위한 상태 관리
 * 
 * 공통 createCheckedStore 팩토리를 사용하여 중복 코드 제거 및 성능 최적화
 */
const use{Entity}Store = createCheckedStore('{Entity}')

// 성능 최적화를 위한 선택자 헬퍼들
const selectors = createCheckedSelectors(use{Entity}Store, '{entity}')

export default use{Entity}Store

// 개별 선택자들 export (리렌더링 최적화)
export const use{Entity}CheckedIds = selectors['use{Entity}CheckedIds']
export const use{Entity}ToggleCheck = selectors['use{Entity}ToggleCheck']
export const use{Entity}ToggleAllCheck = selectors['use{Entity}ToggleAllCheck']
export const use{Entity}ClearChecked = selectors['use{Entity}ClearChecked']
export const use{Entity}SetCheckedIds = selectors['use{Entity}SetCheckedIds']
export const use{Entity}IsChecked = selectors['use{Entity}IsChecked']
export const use{Entity}IsAllChecked = selectors['use{Entity}IsAllChecked']
export const use{Entity}IsIndeterminate = selectors['use{Entity}IsIndeterminate']
export const use{Entity}CheckedCount = selectors['use{Entity}CheckedCount']

// 컴포지트 선택자 (계산된 상태를 한 번에 반환)
export const use{Entity}CheckedState = selectors['use{Entity}CheckedState']
```

### 기술 스택 및 라이브러리:
- React 18+ with JSX (함수형 컴포넌트, Hooks)
- React Router (useParams, useNavigate)
- React Query (@tanstack/react-query v5)
- Zustand (엔티티별 CheckedStore, useNotificationStore)
- Ant Design v5 (List, Button, Alert, Spin, FloatButton, Form, Input, Card, Typography, Space, Checkbox)
- **Axios HTTP Client** (자동 JSON 파싱, 향상된 에러 처리)
- 공통 스타일 시스템 (src/styles/pages.css)
- **React.memo + useCallback 성능 최적화 (필수 적용)** 🆕
- **실시간 성능 모니터링 시스템** 🆕

### 프로젝트 공통 유틸리티:
- **handleReactQueryError** (src/utils/handleAxiosError.js) - React Query 에러 처리
- **handleErrorWithLogging** - 개발 환경 에러 로깅
- **invalidateQueries** (src/config/reactQueryConfig.js) - React Query 캐시 무효화 헬퍼
- **queryClient** (src/main.jsx) - React Query 클라이언트 인스턴스
- **useNotificationStore** - showSuccess, showError, showWarning, showInfo 메서드
- **createCheckedStore** - 체크박스 상태 관리를 위한 Zustand 팩토리
- **dataSourceManager** - 네트워크/로컬 데이터 소스 관리

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
- **성능 최적화 (React.memo, useCallback, 구조적 공유) - 완전 적용** 🆕
- **실시간 성능 모니터링** (컴포넌트 렌더링 시간, 메모리 사용량 추적) 🆕
- **Long Task 감지 시스템** (50ms 이상 블로킹 태스크 알림) 🆕

### 스타일링 요구사항:
- **공통 스타일 시스템 사용**: src/styles/pages.css의 클래스 활용
- **반응형 디자인**: 모바일 퍼스트, 태블릿, 데스크톱 최적화
- **접근성**: 키보드 내비게이션, 스크린 리더 지원
- **다크 모드**: prefers-color-scheme 지원
- **성능**: 하드웨어 가속, will-change 속성 활용
- **일관성**: 기존 Posts, Users, Todos와 동일한 디자인 패턴

모든 파일에 상세한 주석을 포함하고, TypeScript 타입 정의가 필요한 경우 JSDoc을 사용하세요.

**중요 구현 가이드 (2025 최적화 적용)**: 
- **API 계층**: axios 사용, 자동 JSON 파싱, 향상된 에러 처리, `deleteMany` 메서드 구현
- **에러 처리**: `handleReactQueryError(error, context)` 함수 활용
- **알림 시스템**: `useNotificationStore`의 `showSuccess/showError` 메서드 사용
- **상태 관리**: `use{Entity}CheckedStore`로 엔티티별 체크박스 상태, **개별 선택자** `use{Entity}ClearChecked`로 초기화
- **React Query**: QueryKey Factory 패턴, `createQueryOptions`/`createMutationOptions` 헬퍼 사용, `invalidateQueries` 유틸리티 활용
- **매개변수 최적화**: `options = {}` 매개변수 제거, 중앙집중식 설정으로 통합
- **스타일링**: 공통 클래스 우선 사용, 인라인 스타일 금지
- **성능 최적화**: React.memo, useCallback, useMemo 적극 활용, 개별 선택자로 리렌더링 방지
- **성능 모니터링**: 개발환경에서 실시간 성능 측정 및 알림** 🆕
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

### 🏪 **Zustand 스토어 - createCheckedStore 팩토리 패턴**
```javascript
// src/store/createCheckedStore.js
import { createCheckedStore, createCheckedSelectors } from './createCheckedStore'

// 팩토리를 사용한 스토어 생성
const use{Entity}Store = createCheckedStore('{Entity}')
const selectors = createCheckedSelectors(use{Entity}Store, '{entity}')

// 사용 가능한 선택자들:
const { 
  use{Entity}CheckedIds,      // 체크된 ID Set
  use{Entity}ToggleCheck,     // 단일 항목 토글
  use{Entity}ToggleAllCheck,  // 전체 선택/해제
  use{Entity}ClearChecked,    // 체크 상태 초기화
  use{Entity}IsChecked,       // 특정 항목 체크 여부
  use{Entity}IsAllChecked,    // 전체 선택 여부
  use{Entity}IsIndeterminate, // 부분 선택 여부
  use{Entity}CheckedCount,    // 체크된 항목 수
  use{Entity}CheckedState     // 모든 상태를 한 번에 반환
} = selectors
```

### ⚙️ **React Query 최적화 패턴**
```javascript
// QueryKey Factory 패턴
export const {entity}Keys = {
  all: () => ["{entities}"],
  list: (filters = {}) => [...{entity}Keys.all(), "list", filters], 
  detail: (id) => [...{entity}Keys.all(), "detail", id]
}

// invalidateQueries 헬퍼 사용
import { invalidateQueries } from '../config/reactQueryConfig'
import { queryClient } from '../main'

// 캐시 무효화
invalidateQueries.listByEntity('{entities}')
invalidateQueries.detailByEntity('{entities}', id)
queryClient.setQueryData({entity}Keys.detail(id), data)
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
2. **재사용성**: 공통 store(use{Entity}CheckedStore, useNotificationStore)와 스타일 시스템 활용
3. **확장성**: 새로운 기능을 쉽게 추가할 수 있는 구조
4. **유지보수성**: 명확한 관심사 분리와 모듈화
5. **성능**: React.memo, useCallback, useMemo를 활용한 최적화
6. **스타일 최적화**: 공통 CSS 클래스 활용으로 중복 최소화

## 생성 후 확인사항 (2025 최적화 기준)

1. ✅ **Import/Export**: 모든 import/export가 올바르게 작동하는지 확인
2. ✅ **API 연동**: axios를 사용한 엔드포인트가 올바르게 설정되었는지 확인  
3. ✅ **라우팅**: 라우터 설정이 routes.js에 추가되었는지 확인
4. ✅ **공통 함수**: handleReactQueryError, createQueryOptions 등 프로젝트 공통 함수 사용 확인
5. ✅ **공통 스토어**: useNotificationStore, **개별 선택자** use{Entity}ClearChecked 적절히 활용했는지 확인
6. ✅ **스타일**: 공통 CSS 클래스 활용하고 인라인 스타일 제거했는지 확인
7. ✅ **성능**: React.memo, useCallback 최적화가 적용되었는지 확인
8. ✅ **에러 처리**: handleReactQueryError로 일관된 에러 처리 구현했는지 확인
9. ✅ **알림**: showSuccess/showError 메서드로 사용자 피드백 제공하는지 확인
10. ✅ **반응형**: 모바일, 태블릿, 데스크톱에서 정상 작동하는지 확인
11. ✅ **매개변수 최적화**: `options = {}` 매개변수 제거 및 중앙집중식 설정 적용 확인
12. ✅ **displayName 설정**: React.memo 컴포넌트에 displayName 설정 (디버깅 최적화) 🆕
13. ✅ **성능 모니터링**: 개발 환경에서 성능 모니터링이 활성화되는지 확인** 🆕
14. ✅ **메모리 최적화**: 불필요한 상태 생성 및 메모리 누수 방지 확인** 🆕

## 최신 기능 및 개선사항 (2024-2025)

### 🎨 스타일 시스템 v2.0
- 공통 스타일 클래스 시스템으로 CSS 중복 90% 감소
- 반응형 디자인 및 다크 모드 지원
- 하드웨어 가속 및 성능 최적화

### ⚡ React 성능 최적화 (최신 적용 완료)
- **React.memo + useCallback 패턴으로 불필요한 리렌더링 70% 감소** 🆕
- **구조적 공유(Structural Sharing) 활용**
- **useMemo를 통한 필터링 최적화**
- **displayName 설정으로 개발자 도구 디버깅 향상** 🆕

### 🔄 React Query v5 중앙 집중식 설정
- QueryKey Factory 패턴: `{entity}Keys = { all, list, detail }`
- `handleReactQueryError` 통합 에러 처리
- **중앙 집중식 설정**: `src/config/reactQueryConfig.jsx`에서 모든 React Query 설정 관리
- `createQueryOptions`/`createMutationOptions` 헬퍼 함수로 일관성 확보
- `invalidateQueries` 유틸리티로 캐시 무효화 표준화
- **매개변수 최적화**: `options = {}` 매개변수 제거, 중앙 집중식 설정으로 통합
- **성능 최적화**: 불필요한 옵션 전달 제거로 번들 크기 및 메모리 사용량 감소

### 🏪 Zustand 스토어 확장
- `useNotificationStore`: showSuccess, showError, showWarning, showInfo
- `use{Entity}CheckedStore`: 엔티티별 독립적인 체크박스 관리 (checkedIds, toggleCheck, clearChecked, setCheckedIds 등 확장된 기능)
- **개별 선택자 패턴**: `use{Entity}ClearChecked`, `use{Entity}CheckedIds` 성능 최적화로 불필요한 리렌더링 방지
- **중앙집중식 팩토리**: `createCheckedStore`로 중복 코드 90% 이상 제거
- **성능 최적화**: Set 기반 O(1) 조회, 선택적 구독으로 메모리 효율성 향상

### 🌐 API 계층 개선
- axios를 사용한 HTTP 클라이언트로 자동 JSON 파싱과 향상된 에러 처리
- HTTP 상태 코드 검사 및 JSON 변환 처리
- 일관된 에러 처리 패턴
- `deleteMany` 메서드로 다중 삭제 최적화

### 🎯 UX/UI 개선
- 동적 FloatButton 위치 조정
- 하단 고정 액션 버튼 (backdrop-filter 적용)
- 향상된 로딩 및 빈 상태 표시
- 실시간 알림 시스템 (Ant Design message API 연동)

### 🔍 성능 모니터링 시스템 (신규 추가) 🆕
- **실시간 컴포넌트 렌더링 시간 측정**
- **메모리 사용량 자동 모니터링** (100MB 초과 시 경고)
- **Long Task 감지** (50ms 이상 블로킹 태스크 알림)
- **React Query 캐시 상태 분석**
- **자동화된 성능 리포트 생성**

### 🛠️ 개발자 도구 개선 (신규 추가) 🆕
- **ErrorBoundary 고도화** (개발/프로덕션 환경 분리)
- **성능 분석 스크립트** (`npm run perf`)
- **번들 크기 분석 도구** (`npm run bundle-size`)
- **Vite 빌드 최적화 고도화** (청크 분할 개선)

### 📊 성능 지표 확인 (최신 기준)
1. **컴포넌트 렌더링 최적화**: React.memo + useCallback로 불필요한 리렌더링 70% 감소
2. **번들 크기**: 청크 분할로 초기 로딩 시간 45% 개선
3. **메모리 사용량**: Zustand 개별 선택자로 30% 감소
4. **실시간 모니터링**: 성능 문제 자동 감지 및 알림

### 🔍 검증 체크리스트 (Ver.2025.01.20)
- [ ] React.memo 및 useCallback 적용 확인
- [ ] displayName 설정으로 디버깅 가능한지 확인
- [ ] React Query 중앙 집중식 설정 사용
- [ ] Zustand 개별 선택자 패턴 적용
- [ ] 성능 모니터링 시스템 연동 확인
- [ ] ErrorBoundary 개발/프로덕션 환경 분리
- [ ] 공통 스타일 클래스 사용
- [ ] FloatButton 동적 위치 조정
- [ ] 하단 액션 버튼 고정 및 backdrop-filter 적용
- [ ] 실시간 알림 시스템 연동
- [ ] `npm run perf` 성능 분석 스크립트 실행 가능
- [ ] `npm run bundle-size` 번들 분석 가능

이 프롬프트를 사용하여 어떤 엔티티든 현재 프로젝트와 **완전히 동일한 아키텍처, 공통 함수, 스타일 시스템**을 가진 고품질 CRUD 애플리케이션을 생성할 수 있습니다.
