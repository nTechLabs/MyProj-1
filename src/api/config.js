/**
 * Axios 에러를 처리하는 헬퍼 함수
 * @param {Error} error - Axios 에러 객체
 * @returns {string} 사용자에게 표시할 에러 메시지
 */
export const handleAxiosError = (error) => {
  if (error.response) {
    // 서버에서 응답은 받았지만 에러 상태코드인 경우
    const { status, data } = error.response
    
    switch (status) {
      case 400:
        return data?.message || '잘못된 요청입니다.'
      case 401:
        return '인증이 필요합니다.'
      case 403:
        return '접근 권한이 없습니다.'
      case 404:
        return '요청한 리소스를 찾을 수 없습니다.'
      case 409:
        return '이미 존재하는 데이터입니다.'
      case 422:
        return data?.message || '입력 데이터가 올바르지 않습니다.'
      case 500:
        return '서버 내부 오류가 발생했습니다.'
      default:
        return data?.message || `서버 오류 (${status})`
    }
  } else if (error.request) {
    // 요청은 보냈지만 응답을 받지 못한 경우
    return '서버에 연결할 수 없습니다. 네트워크를 확인해주세요.'
  } else {
    // 요청을 보내기 전에 에러가 발생한 경우
    return error.message || '알 수 없는 오류가 발생했습니다.'
  }
}

/**
 * React Query용 쿼리 옵션 생성 헬퍼
 * @param {Object} options - 추가 옵션들
 * @returns {Object} React Query 쿼리 옵션
 */
export const createQueryOptions = (options = {}) => ({
  staleTime: 5 * 60 * 1000, // 5분
  gcTime: 10 * 60 * 1000, // 10분 (구 cacheTime)
  retry: 3,
  retryDelay: attemptIndex => Math.min(1000 * 2 ** attemptIndex, 30000),
  refetchOnWindowFocus: false,
  ...options
})

/**
 * React Query용 뮤테이션 옵션 생성 헬퍼
 * @param {Object} options - 추가 옵션들
 * @returns {Object} React Query 뮤테이션 옵션
 */
export const createMutationOptions = (options = {}) => ({
  retry: 1,
  retryDelay: 1000,
  ...options
})
