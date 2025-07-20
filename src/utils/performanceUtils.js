/**
 * 성능 최적화 및 모니터링 유틸리티
 * 
 * React 애플리케이션의 성능을 실시간으로 측정하고 분석하는 도구 모음
 * 개발 환경에서 성능 병목지점을 발견하고 최적화 포인트를 제공
 * 
 * 주요 기능:
 * - 컴포넌트별 렌더링 시간 측정
 * - 메모리 사용량 추적
 * - Long Task 감지 (50ms 이상 블로킹 작업)
 * - React Query 캐시 상태 분석
 * - 자동화된 성능 리포트 생성
 * - 페이지 로드 성능 측정
 * 
 * 사용법:
 * - 개발 환경에서만 자동 활성화
 * - 컴포넌트에서 measureRenderTime() 사용
 * - main.jsx에서 initPerformanceMonitoring() 호출
 */

// ======================================
// 컴포넌트 렌더링 성능 측정
// ======================================

/**
 * React 컴포넌트의 렌더링 시간을 측정하는 함수
 * Performance API를 사용하여 정확한 시간 측정
 * 
 * 사용법:
 * ```javascript
 * const timer = measureRenderTime('MyComponent')
 * timer.start()
 * // ... 컴포넌트 렌더링 로직
 * const duration = timer.end() // 밀리초 단위 렌더링 시간 반환
 * ```
 * 
 * @param {string} componentName - 측정할 컴포넌트 이름
 * @returns {Object} start, end 메서드를 포함한 타이머 객체
 */
export const measureRenderTime = (componentName) => {
  return {
    /**
     * 렌더링 시간 측정 시작
     * Performance Mark API를 사용하여 시작점 기록
     */
    start: () => performance.mark(`${componentName}-start`),
    
    /**
     * 렌더링 시간 측정 종료 및 결과 반환
     * 시작점과 종료점 사이의 duration 계산
     * 
     * @returns {number} 렌더링에 소요된 시간 (밀리초)
     */
    end: () => {
      // 종료 지점 마크
      performance.mark(`${componentName}-end`)
      
      // 시작점과 종료점 사이의 시간 측정
      performance.measure(
        `${componentName}-render`,
        `${componentName}-start`,
        `${componentName}-end`
      )
      
      // 측정 결과 가져오기
      const measure = performance.getEntriesByName(`${componentName}-render`)[0]
      
      // 개발 환경에서만 콘솔 출력
      if (process.env.NODE_ENV === 'development') {
        const duration = measure.duration.toFixed(2)
        console.log(`🔍 [Performance] ${componentName} rendered in ${duration}ms`)
        
        // 50ms 이상 걸린 렌더링에 대해 경고
        if (measure.duration > 50) {
          console.warn(`⚠️  [Performance Warning] ${componentName} took ${duration}ms to render (>50ms)`)
        }
      }
      
      return measure.duration
    }
  }
}

// ======================================
// 메모리 사용량 측정
// ======================================

/**
 * 브라우저의 메모리 사용량을 측정하는 함수
 * Chrome 기반 브라우저에서만 지원 (performance.memory API)
 * 
 * 측정 항목:
 * - usedJSHeapSize: 현재 사용 중인 JavaScript 힙 메모리
 * - totalJSHeapSize: 전체 할당된 JavaScript 힙 메모리
 * - jsHeapSizeLimit: JavaScript 힙 메모리 한계
 * 
 * @returns {Object|null} 메모리 사용량 정보 (MB 단위) 또는 null (지원되지 않는 브라우저)
 */
export const measureMemoryUsage = () => {
  // Chrome 기반 브라우저에서만 performance.memory API 지원
  if ('memory' in performance) {
    const memory = performance.memory
    const memoryInfo = {
      usedJSHeapSize: (memory.usedJSHeapSize / 1048576).toFixed(2), // MB 단위 변환
      totalJSHeapSize: (memory.totalJSHeapSize / 1048576).toFixed(2), // MB 단위 변환
      jsHeapSizeLimit: (memory.jsHeapSizeLimit / 1048576).toFixed(2) // MB 단위 변환
    }
    
    // 메모리 사용량이 100MB를 초과할 경우 경고
    if (memory.usedJSHeapSize / 1048576 > 100) {
      console.warn(`⚠️  [Memory Warning] High memory usage: ${memoryInfo.usedJSHeapSize}MB`)
    }
    
    return memoryInfo
  }
  
  return null // 지원되지 않는 브라우저
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
