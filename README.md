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
│   ├── useCommentsStore.js
│   ├── usePhotosStore.js
│   ├── useTodosStore.js
│   └── usePostsStore.js
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

# 새로운 기능 추가 개발 가이드 (2025년 7월 현행화)

이 가이드는 프로젝트에 새로운 엔티티(예: Tasks, Categories, Projects 등)를 추가할 때 따라야 할 체계적인 개발 순서를 제공합니다.

**현재 기술 스택 버전:**
- React 19.1.0 + Vite 7.0.4
- React Query (TanStack) 5.83.0
- Ant Design 5.26.5
- Zustand 5.0.6
- React Router 7.7.0
- Axios 1.10.0

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

#### 3.2 Zustand 스토어 생성 (팩토리 패턴 활용)
```bash
# src/store/ 디렉토리에 상태 관리 파일 생성
src/store/useTasksStore.js
```

**현행화된 구조 (createCheckedStore 팩토리 활용):**
```javascript
import { createCheckedStore } from './createCheckedStore'

/**
 * Tasks 체크박스 상태 관리 스토어
 * createCheckedStore 팩토리를 사용하여 일관된 체크 로직 제공
 */
const useTasksStore = createCheckedStore('Tasks')

export default useTasksStore

// 사용 가능한 메서드들:
// - checkedIds: Set - 체크된 태스크 ID들
// - isChecked(id): boolean - 특정 태스크 체크 여부
// - toggleCheck(id): void - 단일 태스크 체크 토글
// - toggleAll(ids[]): void - 전체 태스크 체크/언체크
// - clearAll(): void - 모든 체크 해제
// - getCheckedCount(): number - 체크된 항목 수
// - getCheckedList(): Array - 체크된 ID 배열
```

**추가 상태가 필요한 경우 (확장 패턴):**
```javascript
import { create } from 'zustand'
import { devtools, subscribeWithSelector } from 'zustand/middleware'
import { createCheckedStore } from './createCheckedStore'

// 기본 체크 스토어
const useTasksCheckedStore = createCheckedStore('Tasks')

// 추가 상태를 위한 확장 스토어
const useTasksExtendedStore = create(
  devtools(
    subscribeWithSelector(
      (set, get) => ({
        // 추가 상태들
        selectedPriority: 'all',
        sortBy: 'dueDate',
        viewMode: 'list', // 'list' | 'grid' | 'kanban'
        
        // 액션 함수들
        setSelectedPriority: (priority) => set({ selectedPriority: priority }),
        setSortBy: (sortBy) => set({ sortBy }),
        setViewMode: (mode) => set({ viewMode: mode }),
        
        // 필터링된 태스크 가져오기
        getFilteredTasks: (tasks) => {
          const { selectedPriority, sortBy } = get()
          // 필터링 로직 구현
          return tasks
            .filter(task => selectedPriority === 'all' || task.priority === selectedPriority)
            .sort((a, b) => {
              // 정렬 로직
              if (sortBy === 'dueDate') return new Date(a.dueDate) - new Date(b.dueDate)
              if (sortBy === 'priority') return a.priority.localeCompare(b.priority)
              return a.title.localeCompare(b.title)
            })
        }
      }),
      { name: 'tasks-extended-store' }
    )
  )
)

export { useTasksCheckedStore, useTasksExtendedStore }
```

### 4단계: UI 컴포넌트 레이어 구성

#### 4.1 페이지 디렉토리 생성
```bash
# src/pages/ 디렉토리에 새로운 엔티티 폴더 생성
mkdir src/pages/tasks
```

#### 4.2 기본 컴포넌트 파일들 생성
```bash
# 필수 페이지 컴포넌트들 (현행화된 명명 규칙)
src/pages/tasks/index.jsx           # 메인 페이지 (export default)
src/pages/tasks/TasksList.jsx       # 목록 컴포넌트
src/pages/tasks/TasksItem.jsx       # 개별 아이템 컴포넌트  
src/pages/tasks/TasksDetail.jsx     # 상세 페이지
src/pages/tasks/tasks.css           # 스타일 파일 (통합)
```

#### 4.3 컴포넌트 기본 구조 (React 19 + 최신 패턴)

**index.jsx** (메인 페이지):
```javascript
import React from 'react'
import { Layout, Typography, Card, Space, Button, Statistic } from 'antd'
import { PlusOutlined, FilterOutlined } from '@ant-design/icons'
import TasksList from './TasksList'
import useTasksStore from '../../store/useTasksStore'
import './tasks.css'

const { Content } = Layout
const { Title } = Typography

const TasksPage = () => {
  const { getCheckedCount, clearAll } = useTasksStore()
  const checkedCount = getCheckedCount()

  return (
    <Layout style={{ minHeight: '100vh', backgroundColor: '#f5f5f5' }}>
      <Content style={{ padding: '24px' }}>
        <Card>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
            <Title level={2} style={{ margin: 0 }}>태스크 관리</Title>
            <Space>
              <Statistic 
                title="선택된 항목" 
                value={checkedCount} 
                suffix="개"
                style={{ minWidth: '80px' }}
              />
              <Button 
                type="primary" 
                icon={<PlusOutlined />}
                onClick={() => {/* 새 태스크 추가 모달 */}}
              >
                새 태스크
              </Button>
              <Button 
                icon={<FilterOutlined />}
                onClick={() => {/* 필터 모달 */}}
              >
                필터
              </Button>
              {checkedCount > 0 && (
                <Button danger onClick={clearAll}>
                  선택 해제
                </Button>
              )}
            </Space>
          </div>
          <TasksList />
        </Card>
      </Content>
    </Layout>
  )
}

export default TasksPage
```

**TasksList.jsx** (목록 컴포넌트 - React 19 최적화):
```javascript
import React, { useMemo } from 'react'
import { List, Spin, Alert, Empty, Pagination, Button } from 'antd'
import { useTasks } from '../../hooks/useTasksQueries'
import { useTasksExtendedStore } from '../../store/useTasksStore'
import TasksItem from './TasksItem'

const TasksList = () => {
  const { data: tasks, isLoading, error, refetch } = useTasks()
  const { getFilteredTasks, viewMode } = useTasksExtendedStore()
  
  // React 19 - useMemo로 필터링 최적화
  const filteredTasks = useMemo(() => {
    return tasks ? getFilteredTasks(tasks) : []
  }, [tasks, getFilteredTasks])

  if (isLoading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', padding: '48px' }}>
        <Spin size="large" tip="태스크를 불러오는 중..." />
      </div>
    )
  }
  
  if (error) {
    return (
      <Alert 
        message="데이터 로딩 실패" 
        description="태스크 데이터를 불러오는 중 오류가 발생했습니다."
        type="error" 
        showIcon
        action={
          <Button size="small" onClick={refetch}>
            다시 시도
          </Button>
        }
      />
    )
  }

  if (!filteredTasks.length) {
    return (
      <Empty 
        description="등록된 태스크가 없습니다"
        image={Empty.PRESENTED_IMAGE_SIMPLE}
      />
    )
  }

  return (
    <>
      <List
        className={`tasks-list tasks-list--${viewMode}`}
        dataSource={filteredTasks}
        renderItem={(task) => (
          <TasksItem key={task.id} task={task} />
        )}
        pagination={{
          pageSize: 10,
          showSizeChanger: true,
          showQuickJumper: true,
          showTotal: (total, range) => 
            `${range[0]}-${range[1]} / 총 ${total}개`,
        }}
      />
    </>
  )
}

export default TasksList
```

**TasksItem.jsx** (개별 아이템 - Ant Design 5.26 최신 컴포넌트):
```javascript
import React from 'react'
import { List, Checkbox, Button, Tag, Space, Typography, Tooltip } from 'antd'
import { Link } from 'react-router-dom'
import { 
  EyeOutlined, 
  EditOutlined, 
  DeleteOutlined,
  CalendarOutlined,
  UserOutlined 
} from '@ant-design/icons'
import useTasksStore from '../../store/useTasksStore'

const { Text, Paragraph } = Typography

const TasksItem = ({ task }) => {
  const { isChecked, toggleCheck } = useTasksStore()
  
  const priorityColors = {
    high: '#ff4d4f',
    medium: '#faad14', 
    low: '#52c41a'
  }

  const statusColors = {
    completed: 'success',
    'in-progress': 'processing',
    pending: 'warning',
    cancelled: 'error'
  }

  return (
    <List.Item
      className={`tasks-item tasks-item--${task.priority}`}
      actions={[
        <Tooltip title="상세보기" key="view">
          <Link to={`/tasks/task/${task.id}`}>
            <Button type="text" icon={<EyeOutlined />} size="small" />
          </Link>
        </Tooltip>,
        <Tooltip title="수정" key="edit">
          <Button type="text" icon={<EditOutlined />} size="small" />
        </Tooltip>,
        <Tooltip title="삭제" key="delete">
          <Button type="text" danger icon={<DeleteOutlined />} size="small" />
        </Tooltip>
      ]}
    >
      <List.Item.Meta
        avatar={
          <Checkbox
            checked={isChecked(task.id)}
            onChange={() => toggleCheck(task.id)}
          />
        }
        title={
          <Space>
            <Text strong={!task.completed} delete={task.completed}>
              {task.title}
            </Text>
            <Tag 
              color={priorityColors[task.priority]}
              style={{ marginLeft: 'auto' }}
            >
              {task.priority.toUpperCase()}
            </Tag>
          </Space>
        }
        description={
          <div>
            <Paragraph 
              ellipsis={{ rows: 2, expandable: false }}
              style={{ marginBottom: '8px' }}
            >
              {task.description}
            </Paragraph>
            <Space size="small" wrap>
              <Tag color={statusColors[task.status]} icon={<UserOutlined />}>
                {task.status}
              </Tag>
              {task.dueDate && (
                <Tag icon={<CalendarOutlined />}>
                  {new Date(task.dueDate).toLocaleDateString('ko-KR')}
                </Tag>
              )}
              {task.assignee && (
                <Tag>담당자: {task.assignee}</Tag>
              )}
            </Space>
          </div>
        }
      />
    </List.Item>
  )
}

export default TasksItem
```

**TasksDetail.jsx** (상세 페이지 - React Router 7.7 + 현대적 패턴):
```javascript
import React from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { 
  Layout, 
  Card, 
  Button, 
  Descriptions, 
  Tag, 
  Spin, 
  Alert,
  Space,
  Popconfirm,
  message,
  Progress,
  Avatar,
  Divider
} from 'antd'
import { 
  ArrowLeftOutlined,
  EditOutlined,
  DeleteOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined
} from '@ant-design/icons'
import { useTask, useUpdateTask, useDeleteTask } from '../../hooks/useTasksQueries'

const { Content } = Layout

const TasksDetail = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { data: task, isLoading, error } = useTask(id)
  const updateTaskMutation = useUpdateTask()
  const deleteTaskMutation = useDeleteTask()

  const handleStatusToggle = async () => {
    try {
      await updateTaskMutation.mutateAsync({
        id: task.id,
        ...task,
        completed: !task.completed,
      })
      message.success(`태스크가 ${!task.completed ? '완료' : '미완료'}로 변경되었습니다.`)
    } catch (error) {
      message.error('상태 변경에 실패했습니다.')
    }
  }

  const handleDelete = async () => {
    try {
      await deleteTaskMutation.mutateAsync(task.id)
      message.success('태스크가 삭제되었습니다.')
      navigate('/tasks')
    } catch (error) {
      message.error('삭제에 실패했습니다.')
    }
  }

  if (isLoading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', padding: '48px' }}>
        <Spin size="large" tip="태스크 정보를 불러오는 중..." />
      </div>
    )
  }
  
  if (error) {
    return (
      <Alert 
        message="데이터 로딩 실패" 
        description="태스크 정보를 불러올 수 없습니다."
        type="error" 
        showIcon
        action={
          <Link to="/tasks">
            <Button>목록으로 돌아가기</Button>
          </Link>
        }
      />
    )
  }

  if (!task) {
    return (
      <Alert 
        message="태스크를 찾을 수 없습니다" 
        type="warning" 
        showIcon
        action={
          <Link to="/tasks">
            <Button>목록으로 돌아가기</Button>
          </Link>
        }
      />
    )
  }

  const priorityColors = {
    high: { color: '#ff4d4f', text: '높음' },
    medium: { color: '#faad14', text: '보통' },
    low: { color: '#52c41a', text: '낮음' }
  }

  const statusConfig = {
    completed: { color: 'success', icon: <CheckCircleOutlined />, text: '완료' },
    'in-progress': { color: 'processing', icon: <ClockCircleOutlined />, text: '진행중' },
    pending: { color: 'warning', icon: <ClockCircleOutlined />, text: '대기중' },
    cancelled: { color: 'error', text: '취소됨' }
  }

  const currentStatus = statusConfig[task.status] || statusConfig.pending
  const currentPriority = priorityColors[task.priority] || priorityColors.medium

  return (
    <Layout style={{ minHeight: '100vh', backgroundColor: '#f5f5f5' }}>
      <Content style={{ padding: '24px' }}>
        <Card
          title={
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <Space>
                <Link to="/tasks">
                  <Button icon={<ArrowLeftOutlined />} type="text">
                    목록으로
                  </Button>
                </Link>
                <Divider type="vertical" />
                <span>태스크 상세 정보</span>
              </Space>
              <Space>
                <Button
                  type={task.completed ? 'default' : 'primary'}
                  icon={<CheckCircleOutlined />}
                  onClick={handleStatusToggle}
                  loading={updateTaskMutation.isPending}
                >
                  {task.completed ? '미완료로 변경' : '완료로 변경'}
                </Button>
                <Button icon={<EditOutlined />}>
                  수정
                </Button>
                <Popconfirm
                  title="태스크 삭제"
                  description="정말로 이 태스크를 삭제하시겠습니까?"
                  onConfirm={handleDelete}
                  okText="삭제"
                  cancelText="취소"
                  okButtonProps={{ danger: true }}
                >
                  <Button 
                    danger 
                    icon={<DeleteOutlined />}
                    loading={deleteTaskMutation.isPending}
                  >
                    삭제
                  </Button>
                </Popconfirm>
              </Space>
            </div>
          }
        >
          <Descriptions column={1} bordered size="middle">
            <Descriptions.Item label="제목">
              <Space>
                <span style={{ fontSize: '16px', fontWeight: 'bold' }}>
                  {task.title}
                </span>
                {task.completed && <Tag color="success">완료됨</Tag>}
              </Space>
            </Descriptions.Item>
            
            <Descriptions.Item label="설명">
              <div style={{ whiteSpace: 'pre-wrap', lineHeight: '1.6' }}>
                {task.description || '설명이 없습니다.'}
              </div>
            </Descriptions.Item>
            
            <Descriptions.Item label="상태">
              <Tag color={currentStatus.color} icon={currentStatus.icon}>
                {currentStatus.text}
              </Tag>
            </Descriptions.Item>
            
            <Descriptions.Item label="우선순위">
              <Tag color={currentPriority.color}>
                {currentPriority.text}
              </Tag>
            </Descriptions.Item>
            
            <Descriptions.Item label="진행률">
              <Progress 
                percent={task.completed ? 100 : (task.progress || 0)} 
                status={task.completed ? 'success' : 'active'}
                showInfo={true}
              />
            </Descriptions.Item>
            
            {task.assignee && (
              <Descriptions.Item label="담당자">
                <Space>
                  <Avatar size="small">{task.assignee[0]}</Avatar>
                  {task.assignee}
                </Space>
              </Descriptions.Item>
            )}
            
            {task.dueDate && (
              <Descriptions.Item label="마감일">
                <Space>
                  <span>{new Date(task.dueDate).toLocaleDateString('ko-KR')}</span>
                  {new Date(task.dueDate) < new Date() && !task.completed && (
                    <Tag color="error">기한 초과</Tag>
                  )}
                </Space>
              </Descriptions.Item>
            )}
            
            <Descriptions.Item label="생성일">
              {task.createdAt ? new Date(task.createdAt).toLocaleString('ko-KR') : '정보 없음'}
            </Descriptions.Item>
            
            {task.updatedAt && (
              <Descriptions.Item label="수정일">
                {new Date(task.updatedAt).toLocaleString('ko-KR')}
              </Descriptions.Item>
            )}
          </Descriptions>
        </Card>
      </Content>
    </Layout>
  )
}

export default TasksDetail
```

### 5단계: 라우팅 설정 (React Router 7.7)

#### 5.1 라우트 추가
```javascript
// src/routes/index.jsx에 새로운 라우트 추가

// Lazy import 추가 (React 19 + Vite 7 최적화)
const TasksPage = lazy(() => import('../pages/tasks'))
const TasksDetail = lazy(() => import('../pages/tasks/TasksDetail'))

// Routes 컴포넌트 내부에 라우트 추가
<Route path="/tasks" element={<TasksPage />} />
<Route path="/tasks/task/:id" element={<TasksDetail />} />
```

### 6단계: 네비게이션 메뉴 연결

#### 6.1 메인 네비게이션에 링크 추가
```javascript
// App.jsx 또는 네비게이션 컴포넌트에 Tasks 메뉴 추가
import { TasksOutlined } from '@ant-design/icons'

const navigationItems = [
  // ... 기존 메뉴들
  {
    key: 'tasks',
    icon: <TasksOutlined />,
    label: <Link to="/tasks">태스크</Link>,
  },
]
```

### 7단계: 스타일링 (Ant Design 5.26 + CSS-in-JS)

#### 7.1 현행화된 CSS 파일 작성
```css
/* src/pages/tasks/tasks.css */

/* 2025년 현행화된 스타일 - CSS Grid + Flexbox 조합 */
.tasks-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
}

.tasks-list {
  /* React 19 + Vite 7 성능 최적화 */
  contain: layout style paint;
  will-change: transform;
}

.tasks-list--grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 16px;
}

.tasks-list--kanban {
  display: flex;
  gap: 24px;
  overflow-x: auto;
  padding-bottom: 16px;
}

.tasks-item {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  border-radius: 8px;
  border: 1px solid #f0f0f0;
  background: #fff;
}

.tasks-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
  border-color: #d9d9d9;
}

/* 우선순위별 시각적 구분 (좌측 보더) */
.tasks-item--high {
  border-left: 4px solid #ff4d4f;
}

.tasks-item--medium {
  border-left: 4px solid #faad14;
}

.tasks-item--low {
  border-left: 4px solid #52c41a;
}

/* 완료된 태스크 스타일 */
.tasks-item--completed {
  opacity: 0.7;
  background-color: #f6f8fa;
}

.tasks-item--completed .ant-list-item-meta-title {
  text-decoration: line-through;
  color: #8c8c8c;
}

/* 모바일 반응형 (Ant Design 5.26 브레이크포인트) */
@media (max-width: 576px) {
  .tasks-list--grid {
    grid-template-columns: 1fr;
  }
  
  .tasks-list--kanban {
    flex-direction: column;
  }
}

/* 다크 모드 지원 (Ant Design 5.26) */
@media (prefers-color-scheme: dark) {
  .tasks-page {
    background: linear-gradient(135deg, #1f1f1f 0%, #2d2d2d 100%);
  }
  
  .tasks-item {
    background: #262626;
    border-color: #434343;
  }
  
  .tasks-item:hover {
    background: #303030;
    border-color: #595959;
  }
}

/* 접근성 개선 */
@media (prefers-reduced-motion: reduce) {
  .tasks-item {
    transition: none;
  }
  
  .tasks-item:hover {
    transform: none;
  }
}

/* 고해상도 디스플레이 최적화 */
@media (-webkit-min-device-pixel-ratio: 2), (min-resolution: 2dppx) {
  .tasks-item {
    border-width: 0.5px;
  }
}
```

## 🔍 개발 완료 후 체크리스트 (2025년 현행화)

### 필수 검증 항목
- [ ] **환경 설정**
  - [ ] 환경 변수 설정 확인 (.env)
  - [ ] API 엔드포인트 등록 확인
  - [ ] 로컬 데이터 파일 생성 확인
  
- [ ] **데이터 레이어**
  - [ ] API 함수 구현 완료 (CRUD + 에러 처리)
  - [ ] React Query 훅 구현 완료 (v5.83 최신 패턴)
  - [ ] Zustand 스토어 구현 완료 (createCheckedStore 팩토리 활용)
  
- [ ] **UI 레이어**
  - [ ] 페이지 컴포넌트 구현 완료 (React 19 패턴)
  - [ ] 라우팅 설정 완료 (React Router 7.7)
  - [ ] 스타일링 적용 완료 (Ant Design 5.26 + 반응형)

### 기능 테스트
- [ ] **기본 기능**
  - [ ] 목록 페이지 정상 로딩
  - [ ] 상세 페이지 정상 로딩
  - [ ] CRUD 기능 정상 동작
  - [ ] 체크박스 상태 관리 동작
  
- [ ] **데이터 소스**
  - [ ] 네트워크/로컬 데이터 소스 전환 동작
  - [ ] 에러 처리 및 재시도 기능 확인
  - [ ] 로딩 상태 및 빈 상태 UI 확인
  
- [ ] **사용자 경험**
  - [ ] 반응형 디자인 확인 (모바일/태블릿/데스크톱)
  - [ ] 다크 모드 지원 확인
  - [ ] 접근성 기본 요구사항 충족

### 성능 최적화 확인
- [ ] **React 19 최적화**
  - [ ] Lazy loading 적용 확인
  - [ ] useMemo/useCallback 적절한 사용
  - [ ] 불필요한 리렌더링 방지 확인
  
- [ ] **React Query 최적화**
  - [ ] 쿼리 키 팩토리 패턴 적용
  - [ ] 캐싱 전략 적절히 구성
  - [ ] Optimistic Updates 적용 (해당시)
  
- [ ] **번들 최적화**
  - [ ] 이미지 최적화 (해당시)
  - [ ] 번들 크기 체크: `npm run perf` 실행
  - [ ] Code splitting 효과 확인

### 코드 품질 확인
- [ ] **린팅 및 포맷팅**
  - [ ] ESLint 규칙 준수: `npm run lint`
  - [ ] TypeScript 타입 검사 (해당시): `npm run type-check`
  
- [ ] **테스트 (권장)**
  - [ ] 단위 테스트 작성 고려
  - [ ] 통합 테스트 작성 고려
  - [ ] E2E 테스트 시나리오 검토

## 📚 참고 자료 및 개발 도구 (2025년 현행화)

### 기존 구현 예제 (베스트 프랙티스 참조)
- **Users**: 가장 완성도 높은 구현 참조 (페이지네이션, 검색, 필터링)
- **Photos**: 이미지 처리 및 그리드 레이아웃 참조
- **Todos**: 체크박스 상태 관리 및 완료/미완료 토글 참조
- **Posts**: 기본적인 CRUD 및 관계형 데이터 참조
- **Comments**: 연관 데이터 처리 및 중첩 구조 참조

### 현행 개발 도구 및 스크립트
```bash
# 개발 서버 실행
npm run dev

# 성능 및 번들 분석
npm run perf                 # 성능 체크 스크립트
npm run build:analyze        # 번들 분석 모드 빌드
npm run bundle-size          # 번들 크기 확인

# 코드 품질 관리
npm run lint                 # ESLint 검사
npm run type-check           # TypeScript 타입 검사 (해당시)

# 빌드 및 배포
npm run build                # 프로덕션 빌드
npm run preview              # 빌드 결과 미리보기
npm run clean                # 빌드 폴더 정리
```

### 디버깅 및 모니터링 도구
- **React Query Devtools**: 쿼리 상태 디버깅 및 캐시 관리
  - 개발 모드에서 자동 활성화
  - 브라우저에서 React Query 탭 확인
  
- **Zustand Devtools**: 상태 변화 추적 및 시간 여행 디버깅
  - Redux DevTools Extension 사용
  - 각 스토어별 독립적인 디버깅 가능
  
- **Vite DevTools**: 빠른 HMR 및 개발 서버 모니터링
  - 터미널에서 개발 서버 로그 확인
  - 브라우저 네트워크 탭에서 HMR 동작 확인

### 최신 기술 스택 공식 문서
- **React 19**: https://react.dev/
  - Concurrent Features, Automatic Batching 등 최신 기능
  - 새로운 Hook API 및 성능 최적화 가이드
  
- **React Query v5**: https://tanstack.com/query/latest
  - Query Key Factory 패턴
  - Optimistic Updates 및 Mutation 최적화
  
- **Ant Design 5.26**: https://ant.design/
  - 최신 컴포넌트 API 및 테마 시스템
  - 접근성 및 다국어 지원 가이드
  
- **Zustand 5.0**: https://zustand-demo.pmnd.rs/
  - 미들웨어 활용 패턴
  - TypeScript 완벽 지원 가이드
  
- **Vite 7.0**: https://vitejs.dev/
  - 최신 빌드 최적화 기법
  - 플러그인 생태계 활용법

### 추가 개발 리소스
- **성능 최적화**: `/scripts/performance-check.js` 스크립트 참고
- **환경 설정**: `/src/utils/dataSourceManager.js` 환경별 설정 관리
- **에러 처리**: `/src/utils/handleAxiosError.js` 통합 에러 핸들링
- **타입 정의**: TypeScript 도입 시 기존 JSDoc 활용 가능

---

## 🎯 2025년 개발 트렌드 반영사항

### 현행화된 주요 특징
1. **React 19 Concurrent Features** - 자동 배칭 및 성능 최적화
2. **TanStack Query v5** - 최신 쿼리 패턴 및 캐싱 전략
3. **Ant Design 5.26** - 최신 디자인 시스템 및 접근성
4. **Vite 7.0** - 차세대 빌드 도구 및 HMR 최적화
5. **Modern CSS** - Grid, Flexbox, CSS-in-JS 조합 활용
6. **접근성 강화** - WCAG 2.1 가이드라인 준수
7. **다크 모드** - 자동 테마 전환 지원
8. **모바일 퍼스트** - 반응형 디자인 우선 고려

이 가이드를 따라 체계적으로 개발하면 프로젝트의 일관성을 유지하면서 최신 기술 트렌드를 반영한 고품질 기능을 안정적으로 추가할 수 있습니다.
