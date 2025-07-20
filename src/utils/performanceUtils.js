/**
 * 성능 최적화 유틸리티
 * React 컴포넌트 및 애플리케이션 성능 측정 도구
 */

// 컴포넌트 렌더링 성능 측정
export const measureRenderTime = (componentName) => {
  return {
    start: () => performance.mark(`${componentName}-start`),
    end: () => {
      performance.mark(`${componentName}-end`)
      performance.measure(
        `${componentName}-render`,
        `${componentName}-start`,
        `${componentName}-end`
      )
      
      const measure = performance.getEntriesByName(`${componentName}-render`)[0]
      if (process.env.NODE_ENV === 'development') {
        console.log(`🔍 [Performance] ${componentName} rendered in ${measure.duration.toFixed(2)}ms`)
      }
      return measure.duration
    }
  }
}

// 메모리 사용량 측정 (브라우저 지원 시)
export const measureMemoryUsage = () => {
  if ('memory' in performance) {
    const memory = performance.memory
    return {
      usedJSHeapSize: (memory.usedJSHeapSize / 1048576).toFixed(2), // MB
      totalJSHeapSize: (memory.totalJSHeapSize / 1048576).toFixed(2), // MB
      jsHeapSizeLimit: (memory.jsHeapSizeLimit / 1048576).toFixed(2) // MB
    }
  }
  return null
}

// 번들 크기 분석 (개발 환경용)
export const logBundleInfo = () => {
  if (process.env.NODE_ENV === 'development') {
    // React DevTools 확장 프로그램과 호환
    if (window.__REACT_DEVTOOLS_GLOBAL_HOOK__) {
      console.log('📦 [Bundle] React DevTools detected - use Profiler for detailed analysis')
    }
    
    // 메모리 정보 출력
    const memory = measureMemoryUsage()
    if (memory) {
      console.log(`🧠 [Memory] Used: ${memory.usedJSHeapSize}MB / Total: ${memory.totalJSHeapSize}MB`)
    }
  }
}

// Long Task 감지 (메인 스레드 블로킹 감지)
export const detectLongTasks = () => {
  if ('PerformanceObserver' in window) {
    const observer = new PerformanceObserver((entryList) => {
      const entries = entryList.getEntries()
      entries.forEach((entry) => {
        if (entry.duration > 50) { // 50ms 이상의 태스크 감지
          console.warn(`⚠️ [Long Task] ${entry.duration.toFixed(2)}ms task detected at ${entry.startTime.toFixed(2)}ms`)
        }
      })
    })
    
    try {
      observer.observe({ entryTypes: ['longtask'] })
    } catch (e) {
      // longtask API를 지원하지 않는 브라우저
      console.log('Long Task API not supported in this browser')
    }
  }
}

// 리렌더링 추적을 위한 HOC
export const withRenderTracker = (WrappedComponent, componentName) => {
  return function TrackedComponent(props) {
    const renderCounter = React.useRef(0)
    
    React.useEffect(() => {
      renderCounter.current += 1
      if (process.env.NODE_ENV === 'development') {
        console.log(`🔄 [Render] ${componentName} rendered ${renderCounter.current} times`)
      }
    })
    
    return React.createElement(WrappedComponent, props)
  }
}

// React Query 캐시 크기 모니터링
export const monitorQueryCache = (queryClient) => {
  if (process.env.NODE_ENV === 'development') {
    const cache = queryClient.getQueryCache()
    const queries = cache.getAll()
    
    console.group('📊 [React Query Cache]')
    console.log(`Total queries: ${queries.length}`)
    console.log(`Active queries: ${queries.filter(q => q.state.fetchStatus === 'fetching').length}`)
    console.log(`Cached queries: ${queries.filter(q => q.state.status === 'success').length}`)
    console.log(`Error queries: ${queries.filter(q => q.state.status === 'error').length}`)
    console.groupEnd()
  }
}

// 컴포넌트 최적화 상태 검증
export const validateOptimization = (component) => {
  if (process.env.NODE_ENV === 'development') {
    const issues = []
    
    // React.memo 사용 여부 확인
    if (!component.$$typeof || component.$$typeof.toString() !== 'Symbol(react.memo)') {
      issues.push('Consider using React.memo for this component')
    }
    
    if (issues.length > 0) {
      console.group(`🔧 [Optimization] Suggestions for ${component.displayName || component.name}`)
      issues.forEach(issue => console.warn(issue))
      console.groupEnd()
    }
  }
}

// 앱 초기화 시 성능 모니터링 시작
export const initPerformanceMonitoring = () => {
  if (process.env.NODE_ENV === 'development') {
    // 개발 환경에서만 성능 모니터링 활성화
    detectLongTasks()
    logBundleInfo()
    
    // 5초마다 메모리 사용량 체크
    setInterval(() => {
      const memory = measureMemoryUsage()
      if (memory && parseFloat(memory.usedJSHeapSize) > 100) { // 100MB 초과 시 경고
        console.warn(`⚠️ [Memory Warning] High memory usage: ${memory.usedJSHeapSize}MB`)
      }
    }, 5000)
  }
}

// 페이지 로드 성능 측정
export const measurePageLoad = () => {
  window.addEventListener('load', () => {
    const navigation = performance.getEntriesByType('navigation')[0]
    const paint = performance.getEntriesByType('paint')
    
    console.group('📈 [Page Performance]')
    console.log(`DOM Content Loaded: ${navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart}ms`)
    console.log(`Page Load Complete: ${navigation.loadEventEnd - navigation.loadEventStart}ms`)
    
    paint.forEach(entry => {
      console.log(`${entry.name}: ${entry.startTime.toFixed(2)}ms`)
    })
    console.groupEnd()
  })
}
