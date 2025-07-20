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
import { initPerformanceMonitoring, measurePageLoad } from './utils/performanceUtils.js'

// 성능 모니터링 초기화 (개발 환경)
if (process.env.NODE_ENV === 'development') {
  initPerformanceMonitoring()
  measurePageLoad()
}

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

// 성능 최적화를 위한 ErrorBoundary (개선)
class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, errorInfo: null }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true }
  }

  componentDidCatch(error, errorInfo) {
    // 에러 로깅 최적화
    console.error('React Error Boundary:', error, errorInfo)
    
    // 프로덕션에서는 에러 리포팅 서비스에 전송
    if (process.env.NODE_ENV === 'production') {
      // 실제 환경에서는 Sentry, LogRocket 등의 서비스 사용
      // reportErrorToService(error, errorInfo)
    }
    
    this.setState({ errorInfo })
  }

  handleRetry = () => {
    this.setState({ hasError: false, errorInfo: null })
    window.location.reload()
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ 
          padding: '50px', 
          textAlign: 'center',
          fontSize: '18px',
          color: '#666',
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center'
        }}>
          <h2 style={{ color: '#ff4d4f', marginBottom: '20px' }}>
            앗! 오류가 발생했습니다. 🚫
          </h2>
          <p style={{ marginBottom: '20px' }}>
            잠시 후 다시 시도해 주세요.
          </p>
          {process.env.NODE_ENV === 'development' && this.state.errorInfo && (
            <details style={{ 
              marginBottom: '20px', 
              textAlign: 'left', 
              background: '#f5f5f5', 
              padding: '10px',
              borderRadius: '4px',
              maxWidth: '600px'
            }}>
              <summary>개발자 정보</summary>
              <pre style={{ fontSize: '12px', color: '#333' }}>
                {this.state.errorInfo.componentStack}
              </pre>
            </details>
          )}
          <button 
            onClick={this.handleRetry}
            style={{
              padding: '12px 24px',
              fontSize: '16px',
              backgroundColor: '#1890ff',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer'
            }}
          >
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
