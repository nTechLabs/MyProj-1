/**
 * 애플리케이션 진입점 (Entry Point)
 * React 애플리케이션의 초기 설정 및 전역 Provider 구성
 * 
 * 주요 기능:
 * - React Query 클라이언트 설정 및 최적화
 * - Ant Design 한국어 로케일 설정
 * - 성능 모니터링 시스템 초기화
 * - 전역 에러 바운더리 설정
 * - 개발/프로덕션 환경별 최적화 적용
 */

import { StrictMode, Component } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { ConfigProvider } from 'antd'
import koKR from 'antd/locale/ko_KR'

// 전역 스타일 파일들 (순서 중요)
import './index.css'        // 기본 리셋 스타일
import './styles/common.css' // 공통 유틸리티 클래스
import './styles/pages.css'  // 페이지별 공통 스타일

import App from './App.jsx'
import { initPerformanceMonitoring, measurePageLoad } from './utils/performanceUtils.js'
import { logDataSourceInfo } from './utils/dataSourceManager.js'

// ======================================
// 성능 모니터링 초기화 (개발 환경 전용)
// ======================================
// 개발 환경에서만 성능 측정 도구를 활성화하여
// 프로덕션 성능에 영향을 주지 않음
if (process.env.NODE_ENV === 'development') {
  initPerformanceMonitoring() // 실시간 성능 모니터링 시작
  measurePageLoad()           // 페이지 로드 시간 측정
  logDataSourceInfo()         // 데이터 소스 설정 정보 출력
}

// ======================================
// React Query 클라이언트 설정 (최적화 완료)
// ======================================
/**
 * React Query 클라이언트 인스턴스 생성
 * 서버 상태 관리와 캐싱을 위한 중앙 집중식 설정
 * 
 * 최적화 포인트:
 * - staleTime: 5분간 캐시 데이터를 신선한 것으로 간주
 * - gcTime: 10분간 메모리에 캐시 보관 (이전 cacheTime)
 * - structuralSharing: 객체 참조 최적화로 불필요한 리렌더링 방지
 * - refetchOnWindowFocus: 윈도우 포커스 시 재요청 비활성화로 성능 향상
 */
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5분간 데이터를 신선한 것으로 간주
      gcTime: 10 * 60 * 1000,   // 10분간 가비지 컬렉션 방지 (메모리 보관)
      retry: 3,                  // 실패 시 최대 3번 재시도
      refetchOnWindowFocus: false, // 윈도우 포커스 시 자동 재요청 비활성화
      structuralSharing: true,   // 객체 구조 공유로 메모리 최적화
    },
    mutations: {
      retry: 1,                  // 뮤테이션 실패 시 1번만 재시도
      throwOnError: false,       // 에러를 컴포넌트로 전파하지 않고 내부에서 처리
    },
  },
})

// ======================================
// 전역 에러 바운더리 (Error Boundary)
// ======================================
/**
 * React 에러 바운더리 컴포넌트
 * 애플리케이션 전체의 JavaScript 에러를 포착하여 앱 크래시 방지
 * 
 * 기능:
 * - 컴포넌트 트리의 하위 컴포넌트에서 발생하는 에러 포착
 * - 개발 환경에서 상세한 에러 정보 콘솔 출력
 * - 프로덕션 환경에서 사용자 친화적인 에러 메시지 표시
 * - 성능 최적화를 위한 에러 로깅 시스템
 */
class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    // 에러 상태 초기화
    this.state = { 
      hasError: false,     // 에러 발생 여부
      errorInfo: null      // 에러 상세 정보
    }
  }

  /**
   * 에러 발생 시 상태 업데이트를 위한 정적 메서드
   * @param {Error} error - 발생한 에러 객체
   * @returns {Object} 새로운 state 객체
   */
  static getDerivedStateFromError(error) {
    return { hasError: true }
  }

  /**
   * 에러 정보를 포착하고 로깅하는 생명주기 메서드
   * @param {Error} error - 발생한 에러 객체
   * @param {Object} errorInfo - 에러 발생 위치 정보 (componentStack 포함)
   */
  componentDidCatch(error, errorInfo) {
    // 개발 환경에서 상세한 에러 로깅
    if (process.env.NODE_ENV === 'development') {
      console.error('🚨 [ErrorBoundary] React Error Caught:', error)
      console.error('📍 [ErrorBoundary] Component Stack:', errorInfo.componentStack)
    }
    
    // 에러 정보를 state에 저장
    this.setState({ errorInfo })
    
    // 프로덕션 환경에서는 에러 리포팅 서비스로 전송 가능
    // 예: Sentry, LogRocket 등
    
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
                initialIsOpen={true} 
                position="bottom-right"
              />
            )}
          </ConfigProvider>
        </BrowserRouter>
      </QueryClientProvider>
    </ErrorBoundary>
  </StrictMode>,
)
