/**
 * Axios 에러 처리 유틸리티
 * 모든 Axios 요청에서 공통으로 사용할 수 있는 에러 처리 함수를 제공합니다.
 */

/**
 * Axios 에러를 처리하는 공통 함수
 * @param {Error} error - Axios에서 발생한 에러 객체
 * @param {string} operation - 수행하려던 작업명 (기본값: '요청')
 * @throws {Error} - 처리된 에러 메시지와 함께 에러를 throw
 */
export const handleAxiosError = (error, operation = '요청') => {
  if (error.response) {
    // 서버가 응답했지만 에러 상태 코드 (4xx, 5xx)
    const status = error.response.status;
    const message = error.response.data?.message || error.response.statusText;
    throw new Error(`${operation} 실패: ${status} - ${message}`);
  } else if (error.request) {
    // 요청이 전송되었지만 응답을 받지 못함 (네트워크 오류, 타임아웃 등)
    throw new Error('서버에 연결할 수 없습니다. 네트워크 연결을 확인해주세요.');
  } else {
    // 요청 설정 중 오류 발생 (구성 오류, 잘못된 URL 등)
    throw new Error(`${operation} 중 오류가 발생했습니다: ${error.message}`);
  }
};

/**
 * HTTP 상태 코드별 특화된 에러 메시지를 제공하는 함수
 * @param {Error} error - Axios에서 발생한 에러 객체
 * @param {string} operation - 수행하려던 작업명
 * @throws {Error} - 상태 코드에 맞는 구체적인 에러 메시지와 함께 에러를 throw
 */
export const handleAxiosErrorWithStatus = (error, operation = '요청') => {
  if (error.response) {
    const status = error.response.status;
    const message = error.response.data?.message || error.response.statusText;
    
    switch (status) {
      case 400:
        throw new Error(`${operation} 실패: 잘못된 요청입니다. - ${message}`);
      case 401:
        throw new Error(`${operation} 실패: 인증이 필요합니다. 로그인을 확인해주세요.`);
      case 403:
        throw new Error(`${operation} 실패: 권한이 없습니다. 접근 권한을 확인해주세요.`);
      case 404:
        throw new Error(`${operation} 실패: 요청한 리소스를 찾을 수 없습니다.`);
      case 409:
        throw new Error(`${operation} 실패: 데이터 충돌이 발생했습니다. - ${message}`);
      case 422:
        throw new Error(`${operation} 실패: 입력 데이터가 유효하지 않습니다. - ${message}`);
      case 429:
        throw new Error(`${operation} 실패: 요청이 너무 많습니다. 잠시 후 다시 시도해주세요.`);
      case 500:
        throw new Error(`${operation} 실패: 서버 내부 오류가 발생했습니다.`);
      case 502:
        throw new Error(`${operation} 실패: 게이트웨이 오류입니다. 잠시 후 다시 시도해주세요.`);
      case 503:
        throw new Error(`${operation} 실패: 서비스를 일시적으로 사용할 수 없습니다.`);
      default:
        throw new Error(`${operation} 실패: ${status} - ${message}`);
    }
  } else if (error.request) {
    throw new Error('서버에 연결할 수 없습니다. 네트워크 연결을 확인해주세요.');
  } else {
    throw new Error(`${operation} 중 오류가 발생했습니다: ${error.message}`);
  }
};

/**
 * 에러 로깅과 함께 처리하는 함수
 * @param {Error} error - Axios에서 발생한 에러 객체
 * @param {string} operation - 수행하려던 작업명
 * @param {boolean} enableLogging - 콘솔 로깅 활성화 여부 (기본값: true)
 * @throws {Error} - 처리된 에러 메시지와 함께 에러를 throw
 */
export const handleAxiosErrorWithLogging = (error, operation = '요청', enableLogging = true) => {
  if (enableLogging) {
    console.error(`[${operation}] Axios Error:`, error);
  }
  
  return handleAxiosError(error, operation);
};
