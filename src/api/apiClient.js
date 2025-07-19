/**
 * 최적화된 API 클라이언트
 * fetch API를 기반으로 한 공통 HTTP 클라이언트
 */

import { handleAxiosError } from '../utils/handleAxiosError'

// 기본 설정
const DEFAULT_CONFIG = {
  timeout: 10000, // 10초 타임아웃
  headers: {
    'Content-Type': 'application/json',
  }
}

// AbortController를 이용한 요청 취소 관리
const requestMap = new Map()

/**
 * 타임아웃을 지원하는 fetch wrapper
 * @param {string} url 
 * @param {object} options 
 * @param {number} timeout 
 * @returns {Promise}
 */
const fetchWithTimeout = async (url, options = {}, timeout = DEFAULT_CONFIG.timeout) => {
  const controller = new AbortController()
  const requestId = `${options.method || 'GET'}_${url}_${Date.now()}`
  
  // 요청 등록 (중복 요청 방지용)
  requestMap.set(requestId, controller)
  
  // 타임아웃 설정
  const timeoutId = setTimeout(() => {
    controller.abort()
    requestMap.delete(requestId)
  }, timeout)
  
  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
      headers: {
        ...DEFAULT_CONFIG.headers,
        ...options.headers,
      }
    })
    
    clearTimeout(timeoutId)
    requestMap.delete(requestId)
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`)
    }
    
    return response
  } catch (error) {
    clearTimeout(timeoutId)
    requestMap.delete(requestId)
    throw error
  }
}

/**
 * 최적화된 API 클라이언트
 */
export const apiClient = {
  /**
   * GET 요청
   */
  get: async (url, options = {}) => {
    try {
      const response = await fetchWithTimeout(url, {
        method: 'GET',
        ...options
      })
      return await response.json()
    } catch (error) {
      throw new Error(handleAxiosError(error, 'GET 요청'))
    }
  },
  
  /**
   * POST 요청
   */
  post: async (url, data, options = {}) => {
    try {
      const response = await fetchWithTimeout(url, {
        method: 'POST',
        body: data ? JSON.stringify(data) : undefined,
        ...options
      })
      return await response.json()
    } catch (error) {
      throw new Error(handleAxiosError(error, 'POST 요청'))
    }
  },
  
  /**
   * PUT 요청
   */
  put: async (url, data, options = {}) => {
    try {
      const response = await fetchWithTimeout(url, {
        method: 'PUT',
        body: data ? JSON.stringify(data) : undefined,
        ...options
      })
      return await response.json()
    } catch (error) {
      throw new Error(handleAxiosError(error, 'PUT 요청'))
    }
  },
  
  /**
   * DELETE 요청
   */
  delete: async (url, options = {}) => {
    try {
      const response = await fetchWithTimeout(url, {
        method: 'DELETE',
        ...options
      })
      
      // DELETE 요청의 경우 빈 응답일 수 있음
      const text = await response.text()
      return text ? JSON.parse(text) : {}
    } catch (error) {
      throw new Error(handleAxiosError(error, 'DELETE 요청'))
    }
  },
  
  /**
   * 진행 중인 모든 요청 취소
   */
  cancelAllRequests: () => {
    requestMap.forEach((controller) => {
      controller.abort()
    })
    requestMap.clear()
  },
  
  /**
   * 특정 패턴의 요청 취소
   */
  cancelRequestsByPattern: (pattern) => {
    requestMap.forEach((controller, requestId) => {
      if (requestId.includes(pattern)) {
        controller.abort()
        requestMap.delete(requestId)
      }
    })
  }
}

/**
 * Request/Response 인터셉터 (필요시 확장 가능)
 */
export const interceptors = {
  request: {
    use: (callback) => {
      // 요청 전 처리 로직
      // 현재는 fetch 기반이므로 간단한 구현
      console.log('Request interceptor registered')
    }
  },
  
  response: {
    use: (successCallback, errorCallback) => {
      // 응답 후 처리 로직
      // 현재는 fetch 기반이므로 간단한 구현
      console.log('Response interceptor registered')
    }
  }
}

// 요청 중복 제거를 위한 캐시 (같은 요청이 동시에 여러 번 발생하는 것을 방지)
const requestCache = new Map()

/**
 * 중복 요청 방지가 적용된 GET 요청
 */
export const getCached = async (url, options = {}) => {
  const cacheKey = `GET_${url}_${JSON.stringify(options)}`
  
  // 이미 진행 중인 동일한 요청이 있다면 해당 Promise 반환
  if (requestCache.has(cacheKey)) {
    return requestCache.get(cacheKey)
  }
  
  // 새로운 요청 시작
  const requestPromise = apiClient.get(url, options)
  requestCache.set(cacheKey, requestPromise)
  
  try {
    const result = await requestPromise
    requestCache.delete(cacheKey)
    return result
  } catch (error) {
    requestCache.delete(cacheKey)
    throw error
  }
}

export default apiClient
