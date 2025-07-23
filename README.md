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
yarn install
# 또는 단축 명령어
yarn
```

### 2. 환경 변수 설정
프로젝트 루트에 `.env` 파일을 생성하고 다음과 같이 설정하세요:

```bash
# Environment Configuration
# 각 API별 네트워크 사용 여부 설정
# true: 실제 API 서버에서 데이터 가져오기 (JSONPlaceholder)
# false: 로컬 JSON 파일에서 데이터 가져오기 (/src/apidata/*.json)

# 개별 API 설정
VITE_USE_NETWORK_USERS=true
VITE_USE_NETWORK_COMMENTS=true
VITE_USE_NETWORK_PHOTOS=true
VITE_USE_NETWORK_TODOS=true
VITE_USE_NETWORK_POSTS=true
```

#### 데이터 소스 옵션:
이 프로젝트는 **API별 개별 데이터 소스 설정**을 지원합니다:

- **네트워크 모드 (`VITE_USE_NETWORK_[API]=true`)**: JSONPlaceholder API에서 실시간 데이터를 가져옵니다
- **로컬 모드 (`VITE_USE_NETWORK_[API]=false`)**: `/src/apidata/` 디렉토리의 JSON 파일에서 데이터를 가져옵니다

**지원되는 API 타입:**
- `USERS` - 사용자 데이터
- `COMMENTS` - 댓글 데이터  
- `PHOTOS` - 사진 데이터
- `TODOS` - 할일 데이터
- `POSTS` - 게시글 데이터

각 API는 독립적으로 네트워크/로컬 모드를 설정할 수 있어 개발 및 테스트 시 유연성을 제공합니다.

### 3. 개발 서버 실행
```bash
yarn dev
```

### 4. 빌드
```bash
yarn build
```

### 5. 빌드된 프로젝트 미리보기
```bash
yarn preview
```

## 📁 프로젝트 구조

```
src/
├── api/           # API 관련 함수들 (Axios 기반)
│   ├── apis.js    # 공통 API 설정
│   ├── usersApi.js
│   ├── commentsApi.js
│   ├── photosApi.js
│   ├── todosApi.js
│   └── postsApi.js
├── apidata/       # 로컬 JSON 데이터 파일들
│   ├── users_data.json
│   ├── comments_data.json
│   ├── photos_data.json
│   ├── todos_data.json
│   └── posts_data.json
├── components/    # 재사용 가능한 React 컴포넌트들
├── config/        # 설정 파일들
│   └── reactQueryConfig.jsx
├── hooks/         # 커스텀 훅들 (React Query 포함)
│   ├── useUsersQueries.js
│   ├── useCommentsQueries.js
│   ├── usePhotosQueries.js
│   ├── useTodosQueries.js
│   └── usePostsQueries.js
├── pages/         # 페이지 컴포넌트들
│   ├── index.jsx  # 홈페이지
│   ├── users/     # 사용자 관련 페이지
│   ├── comments/  # 댓글 관련 페이지
│   ├── photos/    # 사진 관련 페이지
│   ├── Posts/     # 게시글 관련 페이지
│   ├── todos/     # 할일 관련 페이지
│   └── counter/   # 카운터 데모 페이지
├── routes/        # 라우팅 설정
│   └── index.jsx  # 메인 라우터 (기존 AppRoutes.jsx)
├── store/         # Zustand 스토어들
│   ├── useCountStore.js
│   ├── useNotificationStore.js
│   ├── useUsersCheckedStore.js
│   ├── useCommentsCheckedStore.js
│   ├── usePhotosCheckedStore.js
│   ├── useTodosCheckedStore.js
│   └── usePostsCheckedStore.js
├── styles/        # CSS 스타일 파일들
│   ├── common.css
│   └── pages.css
├── utils/         # 유틸리티 함수들
│   ├── dataSourceManager.js    # 데이터 소스 관리
│   ├── handleAxiosError.js     # 에러 처리
│   └── performanceUtils.js     # 성능 최적화
├── App.jsx        # 메인 앱 컴포넌트
└── main.jsx       # 앱 진입점
```

## 🔧 주요 기능

### 데이터 소스 관리 시스템
- **API별 독립적인 데이터 소스 설정**: 각 API(Users, Comments, Photos, Todos, Posts)별로 네트워크/로컬 모드 선택 가능
- **동적 데이터 로딩**: 환경 변수에 따라 실시간으로 JSONPlaceholder API 또는 로컬 JSON 파일 사용
- **개발용 로깅**: 현재 데이터 소스 설정을 콘솔에서 확인 가능

### React Query (TanStack Query v5)
- **서버 상태 관리 및 캐싱**: 자동 캐싱과 백그라운드 업데이트
- **API별 커스텀 훅**: useUsersQueries, useCommentsQueries 등 각 엔티티별 특화된 훅
- **에러 처리 및 로딩 상태**: 통합된 에러 처리와 로딩 상태 관리
- **React Query Devtools**: 쿼리 상태 실시간 디버깅

### Zustand 상태 관리
- **엔티티별 체크박스 상태**: 각 리스트 페이지의 체크박스 상태 관리
- **카운터 데모**: 간단한 카운터로 Zustand 사용법 시연
- **알림 시스템**: 전역 알림 상태 관리
- **경량화**: Redux 대비 98% 작은 번들 크기

### 성능 최적화
- **Code Splitting**: React.lazy()와 Suspense를 이용한 페이지별 번들 분할
- **Lazy Loading**: 필요시에만 컴포넌트 로드하여 초기 로딩 시간 단축
- **성능 모니터링**: performanceUtils.js를 통한 성능 측정 도구

### UI/UX
- **Ant Design v5**: 180+ 기업급 컴포넌트 라이브러리
- **반응형 디자인**: 모바일부터 데스크톱까지 완벽 지원
- **한국어 로케일**: 완전한 한국어 지원
- **일관된 스타일링**: 공통 CSS와 페이지별 CSS 분리

### 라우팅 시스템
- **React Router v7**: 최신 버전의 선언적 라우팅
- **RESTful URL 구조**: 직관적인 /{entity}/{entity}/:id 패턴
- **중첩 라우팅**: 엔티티별 상세 페이지 지원

## 🛠 개발 도구

- **React Query Devtools** - 쿼리 상태 디버깅 및 캐시 관리
- **Vite HMR** - 빠른 핫 리로드 및 개발 서버
- **ESLint** - 코드 품질 관리 및 스타일 가이드
- **Performance Check Script** - 번들 크기 및 성능 모니터링

## 📝 주요 페이지 및 기능

### 데이터 관리 페이지들
1. **Users 페이지** (`/users`) - 사용자 목록 및 상세 정보
   - 무한 스크롤링, 검색 필터링
   - 개별 사용자 상세 페이지 (`/users/user/:id`)

2. **Posts 페이지** (`/posts`) - 게시글 관리
   - 게시글 목록, 작성자별 필터링
   - 게시글 상세 보기 (`/posts/post/:id`)

3. **Comments 페이지** (`/comments`) - 댓글 시스템
   - 댓글 목록, 게시글별 연결
   - 댓글 상세 보기 (`/comments/comment/:id`)

4. **Todos 페이지** (`/todos`) - 할일 관리
   - 완료/미완료 상태 관리
   - 할일 상세 보기 (`/todos/todo/:id`)

5. **Photos 페이지** (`/photos`) - 이미지 갤러리
   - 그리드 레이아웃, 이미지 최적화
   - 사진 상세 보기 (`/photos/photo/:id`)

### 데모 페이지
6. **Counter 페이지** (`/counter`) - Zustand 상태 관리 예제
   - 증가/감소 카운터
   - 로컬 스토리지 연동

### 개발자 도구
- **콘솔 로깅**: 앱 시작시 현재 데이터 소스 설정 출력
- **성능 체크**: `yarn performance-check` 스크립트 제공

---

# 새로운 기능 추가 개발 가이드

이 가이드는 프로젝트에 새로운 엔티티(예: Tasks, Categories, Projects 등)를 추가할 때 따라야 할 체계적인 개발 순서를 제공합니다.

## 📋 개발 순서 체크리스트

### 1단계: 환경 설정 및 기본 구조 준비

#### 1.1 환경 변수 설정 (.env)
```bash
# .env 파일에 새로운 API 설정 추가
VITE_USE_NETWORK_TASKS=true
```

#### 1.2 API 엔드포인트 등록
```javascript
// src/api/apis.js에 새로운 엔드포인트 추가
export const API_ENDPOINTS = {
  // ... 기존 엔드포인트들
  TASKS: `${BASE_API_URL}/tasks`,
}
```

### 2단계: 데이터 레이어 구성

#### 2.1 로컬 데이터 파일 생성
```bash
# src/apidata/ 디렉토리에 JSON 파일 생성
src/apidata/tasks_data.json
```

예시 구조:
```json
[
  {
    "id": 1,
    "title": "샘플 태스크",
    "description": "태스크 설명",
    "completed": false,
    "userId": 1,
    "priority": "high",
    "dueDate": "2024-12-31"
  }
]
```

#### 2.2 API 함수 생성
```bash
# src/api/ 디렉토리에 API 함수 파일 생성
src/api/tasksApi.js
```

기본 구조:
```javascript
import axios from 'axios'
import { API_ENDPOINTS } from './apis'
import { handleAxiosError } from '../utils/handleAxiosError'

// GET: 모든 태스크 조회
export const fetchTasks = async () => {
  // 구현 내용
}

// GET: 특정 태스크 조회
export const fetchTaskById = async (id) => {
  // 구현 내용
}

// POST: 새 태스크 생성
export const createTask = async (taskData) => {
  // 구현 내용
}

// PUT: 태스크 업데이트
export const updateTask = async (id, taskData) => {
  // 구현 내용
}

// DELETE: 태스크 삭제
export const deleteTask = async (id) => {
  // 구현 내용
}
```

### 3단계: 상태 관리 레이어 구성

#### 3.1 React Query 훅 생성
```bash
# src/hooks/ 디렉토리에 쿼리 훅 파일 생성
src/hooks/useTasksQueries.js
```

기본 구조:
```javascript
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import * as tasksApi from '../api/tasksApi'

/**
 * Tasks QueryKey Factory Pattern (최적화)
 */
export const tasksKeys = {
  all: () => ["tasks"],
  list: (filters = {}) => [...tasksKeys.all(), "list", filters],
  detail: (id) => [...tasksKeys.all(), "detail", id],
}

// 훅 함수들 구현
export const useTasks = () => { /* 구현 */ }
export const useTask = (id) => { /* 구현 */ }
export const useCreateTask = () => { /* 구현 */ }
export const useUpdateTask = () => { /* 구현 */ }
export const useDeleteTask = () => { /* 구현 */ }
```

#### 3.2 Zustand 스토어 생성
```bash
# src/store/ 디렉토리에 상태 관리 파일 생성
src/store/useTasksCheckedStore.js
```

기본 구조:
```javascript
import { create } from 'zustand'
import { devtools } from 'zustand/middleware'

const useTasksCheckedStore = create(
  devtools(
    (set, get) => ({
      // 체크된 태스크 ID들
      checkedTaskIds: [],
      
      // 액션 함수들
      toggleTaskCheck: (taskId) => { /* 구현 */ },
      toggleAllTasks: (taskIds) => { /* 구현 */ },
      clearCheckedTasks: () => { /* 구현 */ },
      isTaskChecked: (taskId) => { /* 구현 */ },
      getCheckedCount: () => { /* 구현 */ },
    }),
    { name: 'tasks-checked-store' }
  )
)

export default useTasksCheckedStore
```

### 4단계: UI 컴포넌트 레이어 구성

#### 4.1 페이지 디렉토리 생성
```bash
# src/pages/ 디렉토리에 새로운 엔티티 폴더 생성
mkdir src/pages/tasks
```

#### 4.2 기본 컴포넌트 파일들 생성
```bash
# 필수 페이지 컴포넌트들
src/pages/tasks/TasksPage.jsx       # 목록 페이지
src/pages/tasks/TasksList.jsx       # 목록 컴포넌트
src/pages/tasks/TasksItem.jsx       # 개별 아이템 컴포넌트
src/pages/tasks/TasksDetail.jsx     # 상세 페이지
src/pages/tasks/tasks-list.css      # 스타일 파일
```

#### 4.3 컴포넌트 기본 구조

**TasksPage.jsx** (메인 페이지):
```javascript
import React from 'react'
import { Layout, Typography, Card } from 'antd'
import TasksList from './TasksList'
import './tasks-list.css'

const { Content } = Layout
const { Title } = Typography

const TasksPage = () => {
  return (
    <Layout style={{ minHeight: '100vh', backgroundColor: '#f5f5f5' }}>
      <Content style={{ padding: '24px' }}>
        <Card>
          <Title level={2}>태스크 관리</Title>
          <TasksList />
        </Card>
      </Content>
    </Layout>
  )
}

export default TasksPage
```

**TasksList.jsx** (목록 컴포넌트):
```javascript
import React from 'react'
import { List, Spin, Alert } from 'antd'
import { useTasks } from '../../hooks/useTasksQueries'
import TasksItem from './TasksItem'

const TasksList = () => {
  const { data: tasks, isLoading, error } = useTasks()

  if (isLoading) return <Spin size="large" />
  if (error) return <Alert message="데이터 로딩 중 오류가 발생했습니다." type="error" />

  return (
    <List
      dataSource={tasks}
      renderItem={(task) => (
        <TasksItem key={task.id} task={task} />
      )}
    />
  )
}

export default TasksList
```

**TasksItem.jsx** (개별 아이템):
```javascript
import React from 'react'
import { List, Checkbox, Button, Tag } from 'antd'
import { Link } from 'react-router-dom'
import useTasksCheckedStore from '../../store/useTasksCheckedStore'

const TasksItem = ({ task }) => {
  const { isTaskChecked, toggleTaskCheck } = useTasksCheckedStore()

  return (
    <List.Item
      actions={[
        <Link key="detail" to={`/tasks/task/${task.id}`}>
          <Button type="link">상세보기</Button>
        </Link>
      ]}
    >
      <List.Item.Meta
        avatar={
          <Checkbox
            checked={isTaskChecked(task.id)}
            onChange={() => toggleTaskCheck(task.id)}
          />
        }
        title={task.title}
        description={task.description}
      />
      <Tag color={task.completed ? 'green' : 'orange'}>
        {task.completed ? '완료' : '진행중'}
      </Tag>
    </List.Item>
  )
}

export default TasksItem
```

**TasksDetail.jsx** (상세 페이지):
```javascript
import React from 'react'
import { useParams, Link } from 'react-router-dom'
import { Layout, Card, Button, Descriptions, Tag, Spin, Alert } from 'antd'
import { ArrowLeftOutlined } from '@ant-design/icons'
import { useTask } from '../../hooks/useTasksQueries'

const { Content } = Layout

const TasksDetail = () => {
  const { id } = useParams()
  const { data: task, isLoading, error } = useTask(id)

  if (isLoading) return <Spin size="large" />
  if (error) return <Alert message="데이터 로딩 중 오류가 발생했습니다." type="error" />

  return (
    <Layout style={{ minHeight: '100vh', backgroundColor: '#f5f5f5' }}>
      <Content style={{ padding: '24px' }}>
        <Card
          title={
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <Link to="/tasks">
                <Button icon={<ArrowLeftOutlined />} type="link">
                  목록으로
                </Button>
              </Link>
              <span>태스크 상세 정보</span>
            </div>
          }
        >
          <Descriptions column={1} bordered>
            <Descriptions.Item label="제목">{task.title}</Descriptions.Item>
            <Descriptions.Item label="설명">{task.description}</Descriptions.Item>
            <Descriptions.Item label="상태">
              <Tag color={task.completed ? 'green' : 'orange'}>
                {task.completed ? '완료' : '진행중'}
              </Tag>
            </Descriptions.Item>
            <Descriptions.Item label="우선순위">{task.priority}</Descriptions.Item>
            <Descriptions.Item label="마감일">{task.dueDate}</Descriptions.Item>
          </Descriptions>
        </Card>
      </Content>
    </Layout>
  )
}

export default TasksDetail
```

### 5단계: 라우팅 설정

#### 5.1 라우트 추가
```javascript
// src/routes/index.jsx에 새로운 라우트 추가

// Lazy import 추가
const TasksPage = lazy(() => import('../pages/tasks/TasksPage'))
const TasksDetail = lazy(() => import('../pages/tasks/TasksDetail'))

// Routes 컴포넌트 내부에 라우트 추가
<Route path="/tasks" element={<TasksPage />} />
<Route path="/tasks/task/:id" element={<TasksDetail />} />
```

### 6단계: 네비게이션 메뉴 연결

#### 6.1 메인 네비게이션에 링크 추가
```javascript
// 메인 네비게이션 컴포넌트에 Tasks 메뉴 추가
// (보통 App.jsx나 별도의 Navigation 컴포넌트에 위치)
```

### 7단계: 스타일링

#### 7.1 CSS 파일 작성
```css
/* src/pages/tasks/tasks-list.css */

.tasks-page {
  min-height: 100vh;
  background-color: #f5f5f5;
}

.tasks-list-item {
  transition: all 0.3s ease;
}

.tasks-list-item:hover {
  background-color: #f9f9f9;
}

.task-status-tag {
  margin-left: auto;
}

.task-priority-high {
  border-left: 4px solid #ff4d4f;
}

.task-priority-medium {
  border-left: 4px solid #faad14;
}

.task-priority-low {
  border-left: 4px solid #52c41a;
}
```

## 🔍 개발 완료 후 체크리스트

### 필수 검증 항목
- [ ] 환경 변수 설정 확인 (.env)
- [ ] API 엔드포인트 등록 확인
- [ ] 로컬 데이터 파일 생성 확인
- [ ] API 함수 구현 완료
- [ ] React Query 훅 구현 완료
- [ ] Zustand 스토어 구현 완료
- [ ] 페이지 컴포넌트 구현 완료
- [ ] 라우팅 설정 완료
- [ ] 스타일링 적용 완료

### 기능 테스트
- [ ] 목록 페이지 정상 로딩
- [ ] 상세 페이지 정상 로딩
- [ ] 체크박스 상태 관리 동작
- [ ] 네트워크/로컬 데이터 소스 전환 동작
- [ ] 에러 처리 확인
- [ ] 로딩 상태 확인
- [ ] 반응형 디자인 확인

### 성능 최적화 확인
- [ ] Lazy loading 적용 확인
- [ ] React Query 캐싱 동작 확인
- [ ] 불필요한 리렌더링 방지 확인
- [ ] 이미지 최적화 (해당시)

## 📚 참고 자료

### 기존 구현 예제
- **Users**: 가장 완성도 높은 구현 참조
- **Photos**: 이미지 처리 관련 참조
- **Todos**: 체크박스 상태 관리 참조
- **Posts**: 기본적인 CRUD 참조
- **Comments**: 연관 데이터 처리 참조

### 개발 도구
- **React Query Devtools**: 쿼리 상태 디버깅
- **Zustand Devtools**: 상태 변화 추적
- **Performance Check**: `yarn performance-check` 스크립트 실행

이 가이드를 따라 체계적으로 개발하면 프로젝트의 일관성을 유지하면서 새로운 기능을 안정적으로 추가할 수 있습니다.
