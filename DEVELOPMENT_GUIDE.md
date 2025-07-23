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

// 쿼리 키 정의
export const TASKS_QUERY_KEYS = {
  all: ['tasks'],
  lists: () => [...TASKS_QUERY_KEYS.all, 'list'],
  list: (filters) => [...TASKS_QUERY_KEYS.lists(), { filters }],
  details: () => [...TASKS_QUERY_KEYS.all, 'detail'],
  detail: (id) => [...TASKS_QUERY_KEYS.details(), id],
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
