# React Query + Zustand 기반 CRUD 애플리케이션 생성 프롬프트

이 프롬프트를 사용하여 Users 디렉토리와 동일한 패턴으로 완전한 CRUD 애플리케이션을 생성할 수 있습니다.

## 사용법

아래 프롬프트를 복사하여 사용하고, `{https://jsonplaceholder.typicode.com}`과 `{users}`을 실제 값으로 교체하세요. 디렉토리명은 엔티티명과 동일하게 자동으로 설정됩니다.

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
   - 체크박스를 이용한 개별 선택 기능
   - 선택된 항목들 삭제 기능 (useMutation 사용)
   - FloatButton으로 새 항목 추가 버튼 (PlusOutlined 아이콘)
   - 삭제 버튼은 리스트 하단에 고정 배치
   - 로딩, 에러 상태 처리
   - useCheckedStore, useNotificationStore 사용

3. **src/pages/{ENTITY_NAME}/{ENTITY_NAME}Item.jsx**
   - 개별 항목을 표시하는 컴포넌트
   - 체크박스와 항목 내용으로 구성
   - 항목 클릭 시 상세 페이지로 이동
   - List.Item.Meta를 사용한 정보 표시

4. **src/pages/{ENTITY_NAME}/{ENTITY_NAME}Detail.jsx**
   - 상세 정보 표시 및 편집 컴포넌트
   - 새 항목 추가 모드 (id === 'new') 지원
   - React Query를 사용한 데이터 조회, 추가, 수정
   - Form 입력값 실시간 유효성 검사
   - 변경사항 추적 및 취소 기능
   - 폼 레이아웃: Card > Form (vertical layout)
   - 로딩, 에러 상태 처리

5. **src/pages/{ENTITY_NAME}/{ENTITY_NAME.toLowerCase()}-list.css**
   - 스크롤바 숨김 처리 (.{ENTITY_NAME.toLowerCase()}list-scroll-hide)
   - 리스트 아이템 스타일링
   - 상세 페이지 반응형 스타일
   - 삭제 버튼 고정 위치 스타일

6. **src/hooks/use{ENTITY_NAME}Queries.js**
   - React Query 커스텀 훅 모음
   - QueryKey Factory 패턴 사용
   - use{ENTITY_NAME}sQuery: 목록 조회
   - use{ENTITY_NAME}Query: 단일 항목 조회
   - useDelete{ENTITY_NAME}sMutation: 다중 삭제
   - useAdd{ENTITY_NAME}Mutation: 추가
   - useUpdate{ENTITY_NAME}Mutation: 수정
   - handleAxiosError를 사용한 에러 처리
   - createQueryOptions, createMutationOptions 사용

### 기술 스택 및 라이브러리:
- React 18+ with JSX
- React Router (useParams, useNavigate)
- React Query (@tanstack/react-query)
- Zustand (useCheckedStore, useNotificationStore)
- Ant Design (List, Button, Alert, Spin, FloatButton, Form, Input, Card, Typography, Space, Checkbox, message)
- Axios for API calls

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
- 실시간 검색 및 필터링
- 체크박스 다중 선택
- 일괄 삭제
- 인라인 편집
- 폼 유효성 검사
- 로딩 및 에러 상태 처리
- 반응형 디자인
- 무한 스크롤 (옵션)

### 스타일링 요구사항:
- 모바일 퍼스트 반응형 디자인
- 스크롤바 숨김 처리
- 부드러운 스크롤 애니메이션
- 고정 버튼 레이아웃
- Ant Design 테마 적용

모든 파일에 상세한 주석을 포함하고, TypeScript 타입 정의가 필요한 경우 JSDoc을 사용하세요.
```

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

## 추가 요구사항

생성된 파일들은 기존 Users 디렉토리와 동일한 아키텍처와 패턴을 따라야 합니다:

1. **일관성**: 파일 구조, 네이밍 컨벤션, 코드 스타일이 Users와 일치
2. **재사용성**: 공통 store와 config 파일들을 활용
3. **확장성**: 새로운 기능을 쉽게 추가할 수 있는 구조
4. **유지보수성**: 명확한 관심사 분리와 모듈화

## 생성 후 확인사항

1. 모든 import/export가 올바르게 작동하는지 확인
2. API 엔드포인트가 올바르게 설정되었는지 확인
3. 라우터 설정이 추가되었는지 확인
4. CSS 클래스명이 겹치지 않는지 확인
5. 에러 처리가 적절히 구현되었는지 확인

이 프롬프트를 사용하여 어떤 엔티티든 Users와 동일한 품질의 CRUD 애플리케이션을 생성할 수 있습니다.
