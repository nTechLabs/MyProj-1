import { Routes, Route } from 'react-router-dom'
import HomePage from '../pages'
import UsersPage from '../pages/users/UsersPage'
import UsersDetail from '../pages/users/UsersDetail'
import TodosPage from '../pages/Todos/TodosPage'
import TodosDetail from '../pages/Todos/TodosDetail'
import CounterPage from '../pages/counter/CounterPage'

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
    <Routes>
      <Route path={ROUTES.HOME} element={<HomePage />} />
      <Route path={ROUTES.USERS} element={<UsersPage />} />
      <Route path={ROUTES.USER_DETAIL} element={<UsersDetail />} />
      <Route path={ROUTES.TODOS} element={<TodosPage />} />
      <Route path={ROUTES.TODO_DETAIL} element={<TodosDetail />} />
      <Route path={ROUTES.COUNTER} element={<CounterPage />} />
    </Routes>
  )
}

export default AppRoutes
