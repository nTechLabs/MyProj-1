import { Routes, Route } from 'react-router-dom'
import { Suspense, lazy } from 'react'
import { Spin } from 'antd'

// 페이지 컴포넌트들을 Lazy Loading으로 최적화
const HomePage = lazy(() => import('../pages'))
const UsersPage = lazy(() => import('../pages/users/UsersPage'))
const UsersDetail = lazy(() => import('../pages/users/UsersDetail'))
const TodosPage = lazy(() => import('../pages/Todos/TodosPage'))
const TodosDetail = lazy(() => import('../pages/Todos/TodosDetail'))
const PostsPage = lazy(() => import('../pages/Posts/PostsPage'))
const PostsDetail = lazy(() => import('../pages/Posts/PostsDetail'))
const CommentsPage = lazy(() => import('../pages/comments/CommentsPage'))
const CommentsDetail = lazy(() => import('../pages/comments/CommentsDetail'))
const PhotosPage = lazy(() => import('../pages/photos/PhotosPage'))
const PhotosDetail = lazy(() => import('../pages/photos/PhotosDetail'))
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

const AppRoutes = () => {
  return (
    <Suspense fallback={<PageSuspenseFallback />}>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/users" element={<UsersPage />} />
        <Route path="/users/user/:id" element={<UsersDetail />} />
        <Route path="/posts" element={<PostsPage />} />
        <Route path="/posts/post/:id" element={<PostsDetail />} />
        <Route path="/todos" element={<TodosPage />} />
        <Route path="/todos/todo/:id" element={<TodosDetail />} />
        <Route path="/comments" element={<CommentsPage />} />
        <Route path="/comments/comment/:id" element={<CommentsDetail />} />
        <Route path="/photos" element={<PhotosPage />} />
        <Route path="/photos/photo/:id" element={<PhotosDetail />} />
        <Route path="/counter" element={<CounterPage />} />
      </Routes>
    </Suspense>
  )
}

export default AppRoutes
