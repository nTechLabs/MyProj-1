import { StrictMode, Component } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { ConfigProvider } from 'antd'
import koKR from 'antd/locale/ko_KR'
import './index.css'
import './styles/common.css'
import './styles/pages.css'
import App from './App.jsx'

// React Query 클라이언트 생성 (최적화)
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5분
      gcTime: 10 * 60 * 1000, // 10분 (cacheTime 대신 gcTime)
      retry: 3,
      refetchOnWindowFocus: false,
      structuralSharing: true, // 메모리 최적화
    },
    mutations: {
      retry: 1,
      throwOnError: false, // 에러 핸들링 최적화
    },
  },
})

// 성능 최적화를 위한 ErrorBoundary
class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true }
  }

  componentDidCatch(error, errorInfo) {
    console.error('React Error Boundary:', error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ 
          padding: '50px', 
          textAlign: 'center',
          fontSize: '18px',
          color: '#666' 
        }}>
          <h2>앗! 오류가 발생했습니다.</h2>
          <p>페이지를 새로고침해 주세요.</p>
          <button onClick={() => window.location.reload()}>
            새로고침
          </button>
        </div>
      )
    }

    return this.props.children
  }
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <ConfigProvider 
            locale={koKR}
            theme={{
              token: {
                // 성능 최적화를 위한 커스텀 테마 설정
                colorPrimary: '#1890ff',
                borderRadius: 6,
                wireframe: false, // 성능 향상
              },
              components: {
                // 컴포넌트별 최적화 설정
                Button: {
                  primaryShadow: '0 2px 0 rgba(5, 145, 255, 0.1)',
                },
                Input: {
                  activeShadow: '0 0 0 2px rgba(24, 144, 255, 0.2)',
                },
              },
            }}
          >
            <App />
            {/* 개발 환경에서만 React Query Devtools 표시 */}
            {process.env.NODE_ENV === 'development' && (
              <ReactQueryDevtools 
                initialIsOpen={false} 
                position="bottom-right"
              />
            )}
          </ConfigProvider>
        </BrowserRouter>
      </QueryClientProvider>
    </ErrorBoundary>
  </StrictMode>,
)
