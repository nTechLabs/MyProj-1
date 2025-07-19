/**
 * 최적화된 에러 처리 유틸리티
 * React Query와 fetch API에서 사용하는 에러 처리 함수
 */

/**
 * 기본 에러 처리 함수 (React Query용 - 문자열 반환)
 * @param {Error} error - 에러 객체
 * @returns {string} 사용자 친화적인 에러 메시지
 */
export const handleAxiosError = (error) => {
  if (error.response) {
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
      case 429:
        return '요청이 너무 많습니다. 잠시 후 다시 시도해주세요.'
      case 500:
        return '서버 내부 오류가 발생했습니다.'
      case 502:
        return '게이트웨이 오류입니다. 잠시 후 다시 시도해주세요.'
      case 503:
        return '서비스를 일시적으로 사용할 수 없습니다.'
      default:
        return data?.message || `서버 오류 (${status})`
    }
  } else if (error.request) {
    return '서버에 연결할 수 없습니다. 네트워크를 확인해주세요.'
  } else {
    return error.message || '알 수 없는 오류가 발생했습니다.'
  }
}

/**
 * React Query에서 사용하기 위한 컨텍스트가 포함된 에러 처리 함수
 * @param {Error} error - 에러 객체
 * @param {string} context - 에러 발생 컨텍스트 (예: '사용자 목록 조회', '할일 추가')
 * @returns {string} 컨텍스트가 포함된 사용자 친화적인 에러 메시지
 */
export const handleReactQueryError = (error, context = '') => {
  const baseMessage = handleAxiosError(error)
  return context ? `${context} 중 오류가 발생했습니다: ${baseMessage}` : baseMessage
}

/**
 * 개발 환경에서 에러 로깅과 함께 처리하는 함수
 * @param {Error} error - 에러 객체
 * @param {string} operation - 작업명
 * @returns {string} 에러 메시지
 */
export const handleErrorWithLogging = (error, operation = '요청') => {
  if (process.env.NODE_ENV === 'development') {
    console.error(`[${operation}] Error:`, error)
  }
  return handleAxiosError(error)
}
