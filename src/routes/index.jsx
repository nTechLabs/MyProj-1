/**
 * 애플리케이션 라우팅 설정 컴포넌트
 * 
 * React Router를 사용한 SPA 라우팅 시스템
 * 코드 스플리팅(Code Splitting)을 통한 성능 최적화 적용
 * 
 * 주요 최적화 기법:
 * - Lazy Loading: 페이지별로 번들을 분할하여 초기 로딩 시간 단축
 * - Suspense: 비동기 컴포넌트 로딩 중 폴백 UI 제공
 * - 사용자 경험 향상을 위한 로딩 스피너 및 메시지
 * 
 * 라우팅 구조:
 * - 홈페이지: /
 * - 엔티티별 CRUD 페이지: /{entity}, /{entity}/{entity}/:id
 * - 카운터 데모 페이지: /counter
 * 
 * 성능 이점:
 * - 초기 번들 크기 감소 (필요한 페이지만 로드)
 * - 페이지별 독립적인 캐싱
 * - 더 빠른 네트워크 전송
 */

import { Routes, Route } from 'react-router-dom'
import { Suspense, lazy } from 'react'
import { Spin } from 'antd'

// ======================================
// 페이지 컴포넌트들 - Lazy Loading 최적화
// ======================================
/**
 * React.lazy()를 사용한 동적 import
 * 각 페이지는 별도의 청크로 분할되어 필요할 때만 로드됨
 * 
 * 이점:
 * - 초기 페이지 로드 속도 향상
 * - 메모리 사용량 최적화
 * - 네트워크 트래픽 감소
 */

// 홈페이지 - 메인 랜딩 페이지
const HomePage = lazy(() => import('../pages'))

// Users 엔티티 - 사용자 관리
const UsersPage = lazy(() => import('../pages/users'))
const UsersDetail = lazy(() => import('../pages/users/UsersDetail'))

// Todos 엔티티 - 할일 관리 
const TodosPage = lazy(() => import('../pages/todos'))
const TodosDetail = lazy(() => import('../pages/todos/TodosDetail'))

// Posts 엔티티 - 게시글 관리
const PostsPage = lazy(() => import('../pages/Posts'))
const PostsDetail = lazy(() => import('../pages/Posts/PostsDetail'))

// Comments 엔티티 - 댓글 관리
const CommentsPage = lazy(() => import('../pages/comments'))
const CommentsDetail = lazy(() => import('../pages/comments/CommentsDetail'))

// Photos 엔티티 - 사진 관리
const PhotosPage = lazy(() => import('../pages/photos'))
const PhotosDetail = lazy(() => import('../pages/photos/PhotosDetail'))

// Counter 데모 페이지 - Zustand 상태 관리 예제
const CounterPage = lazy(() => import('../pages/counter'))

// ======================================
// 로딩 폴백 컴포넌트 (사용자 경험 최적화)
// ======================================

/**
 * 페이지 로딩 중 표시되는 폴백 컴포넌트
 * 
 * 디자인 특징:
 * - 화면 중앙 정렬로 시각적 균형 제공
 * - 큰 스피너와 설명 텍스트로 명확한 로딩 상태 표시
 * - Ant Design 스피너 사용으로 일관된 디자인
 * - 적절한 간격(gap: 16px)으로 요소들 분리
 * 
 * 성능 고려사항:
 * - 빠른 페이지에서는 스피너가 깜빡일 수 있으므로 최소 표시 시간 고려
 * - 메모리 효율성을 위해 인라인 스타일 사용
 */
const PageSuspenseFallback = () => (
  <div style={{ 
    display: 'flex', 
    justifyContent: 'center', 
    alignItems: 'center', 
    height: '50vh',        // 화면 높이의 50%로 중앙 배치
    flexDirection: 'column',
    gap: '16px'           // 스피너와 텍스트 사이 간격
  }}>
    <Spin size="large" />
    <span style={{ 
      color: '#666',       // 부드러운 회색으로 덜 강조
      fontSize: '14px'     // 적절한 크기의 안내 텍스트
    }}>
      페이지를 불러오는 중...
    </span>
  </div>
)

// ======================================
// 메인 라우팅 컴포넌트
// ======================================

/**
 * 애플리케이션의 모든 라우팅을 관리하는 메인 컴포넌트
 * 
 * 라우팅 패턴:
 * - RESTful URL 구조 채택 (/{entity}/{entity}/:id)
 * - 일관된 네이밍 컨벤션 적용
 * - 계층적 라우팅 구조로 직관적인 URL
 * 
 * Suspense 래핑:
 * - 모든 lazy 컴포넌트에 대해 통합 로딩 처리
 * - 에러 바운더리와 함께 사용시 더욱 안정적
 * 
 * @returns {JSX.Element} 라우팅이 설정된 애플리케이션 구조
 */
const AppRoutes = () => {
  return (
    <Suspense fallback={<PageSuspenseFallback />}>
      <Routes>
        {/* 홈페이지 - 메인 대시보드 */}
        <Route path="/" element={<HomePage />} />
        
        {/* Users 엔티티 라우트 */}
        <Route path="/users" element={<UsersPage />} />
        <Route path="/users/user/:id" element={<UsersDetail />} />
        
        {/* Posts 엔티티 라우트 */}
        <Route path="/posts" element={<PostsPage />} />
        <Route path="/posts/post/:id" element={<PostsDetail />} />
        
        {/* Todos 엔티티 라우트 */}
        <Route path="/todos" element={<TodosPage />} />
        <Route path="/todos/todo/:id" element={<TodosDetail />} />
        
        {/* Comments 엔티티 라우트 */}
        <Route path="/comments" element={<CommentsPage />} />
        <Route path="/comments/comment/:id" element={<CommentsDetail />} />
        
        {/* Photos 엔티티 라우트 */}
        <Route path="/photos" element={<PhotosPage />} />
        <Route path="/photos/photo/:id" element={<PhotosDetail />} />
        
        {/* 데모 페이지 - Zustand 카운터 예제 */}
        <Route path="/counter" element={<CounterPage />} />
      </Routes>
    </Suspense>
  )
}

export default AppRoutes
