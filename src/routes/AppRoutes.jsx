import { Routes, Route } from 'react-router-dom'
import { Suspense, lazy } from 'react'
import { Spin } from 'antd'

// 페이지 컴포넌트들을 Lazy Loading으로 최적화
const HomePage = lazy(() => import('../pages'))
const UsersPage = lazy(() => import('../pages/users/UsersPage'))
const UsersDetail = lazy(() => import('../pages/users/UsersDetail'))
const TodosPage = lazy(() => import('../pages/Todos/TodosPage'))
const TodosDetail = lazy(() => import('../pages/Todos/TodosDetail'))
const CounterPage = lazy(() => import('../pages/counter/CounterPage'))

// 로딩 컴포넌트
const PageSuspenseFallback = () => (
  <div style={{ 
    display: 'flex', 
    justifyContent: 'center', 
    alignItems: 'center', 
    height: '50vh',
    flexDirection: 'column',
    gap: '16px'
  }}>
    <Spin size="large" />
    <span style={{ color: '#666', fontSize: '14px' }}>페이지를 불러오는 중...</span>
  </div>
)

// 라우트 경로 상수들
export const ROUTES = {
  HOME: '/',
  USERS: '/users',
  USER_DETAIL: '/users/user/:id',
  USER_NEW: '/users/user/new',
  TODOS: '/todos',
  TODO_DETAIL: '/todos/todo/:id',
  TODO_NEW: '/todos/todo/new',
  COUNTER: '/counter',
}

// 라우트 정보 객체들
export const routeConfig = [
  {
    path: ROUTES.HOME,
    name: 'Home',
    title: '홈',
  },
  {
    path: ROUTES.USERS,
    name: 'Users',
    title: '사용자',
  },
  {
    path: ROUTES.TODOS,
    name: 'Todos',
    title: '할일',
  },
  {
    path: ROUTES.COUNTER,
    name: 'Counter',
    title: '카운터',
  },
]

const AppRoutes = () => {
  return (
    <Suspense fallback={<PageSuspenseFallback />}>
      <Routes>
        <Route path={ROUTES.HOME} element={<HomePage />} />
        <Route path={ROUTES.USERS} element={<UsersPage />} />
        <Route path={ROUTES.USER_DETAIL} element={<UsersDetail />} />
        <Route path={ROUTES.TODOS} element={<TodosPage />} />
        <Route path={ROUTES.TODO_DETAIL} element={<TodosDetail />} />
        <Route path={ROUTES.COUNTER} element={<CounterPage />} />
      </Routes>
    </Suspense>
  )
}

export default AppRoutes
