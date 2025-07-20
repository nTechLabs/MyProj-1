/**
 * React Query 중앙 집중식 설정 파일 (v5 최적화)
 * 
 * 주요 기능:
 * - 쿼리와 뮤테이션에 대한 공통 설정 중앙화
 * - 개발/프로덕션 환경별 차별화된 설정 제공
 * - 성능 최적화된 기본값 제공 (staleTime, gcTime, retry 등)
 * - 에러 처리 및 재시도 전략 표준화
 * - 캐시 무효화 헬퍼 함수 제공
 */

import React from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

// ======================================
// 쿼리 기본 설정 (성능 최적화)
// ======================================
/**
 * React Query 쿼리에 대한 최적화된 기본 설정
 * 
 * staleTime: 데이터를 "신선한" 것으로 간주하는 시간
 * - 이 시간 동안은 네트워크 요청을 하지 않음
 * - 5분으로 설정하여 불필요한 API 호출 최소화
 * 
 * gcTime: 가비지 컬렉션 시간 (이전 cacheTime)
 * - 비활성 상태의 데이터를 메모리에 보관하는 시간
 * - 10분으로 설정하여 페이지 재방문 시 빠른 응답 제공
 * 
 * retry: 실패한 요청에 대한 재시도 횟수
 * - 네트워크 불안정성을 고려한 3번 재시도
 * 
 * retryDelay: 재시도 간격 (지수 백오프)
 * - 서버 부하를 고려한 점진적 재시도 간격 증가
 */
export const QUERY_CONFIG = {
  staleTime: 5 * 60 * 1000,        // 5분간 캐시 데이터를 신선한 것으로 간주
  gcTime: 10 * 60 * 1000,          // 10분간 비활성 데이터를 메모리에 보관
  retry: 3,                        // 실패 시 최대 3번 재시도
  retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000), // 지수 백오프 (최대 30초)
  refetchOnWindowFocus: false,     // 윈도우 포커스 시 재요청 비활성화 (성능 최적화)
  refetchOnMount: true,           // 컴포넌트 마운트 시 재요청 활성화
  refetchOnReconnect: true,       // 네트워크 재연결 시 재요청 활성화
  networkMode: 'online',           // 온라인일 때만 쿼리 실행
  structuralSharing: true,         // 구조적 공유를 통한 메모리 최적화
}

// ======================================
// 뮤테이션 기본 설정 (성능 최적화)
// ======================================
/**
 * React Query 뮤테이션에 대한 최적화된 기본 설정
 * 
 * 뮤테이션은 쿼리와 달리 사용자 액션에 의해 발생하므로
 * 더 적극적인 재시도와 빠른 피드백을 제공
 */
export const MUTATION_CONFIG = {
  retry: 2,                        // 실패 시 2번 재시도 (쿼리보다 적게)
  retryDelay: 1500,               // 재시도 간격 1.5초 (고정 간격)
  networkMode: 'online',           // 온라인일 때만 뮤테이션 실행
  throwOnError: false,            // 에러 발생 시 throw하지 않음 (onError 핸들러 사용)
}

// ======================================
// 헬퍼 함수들 (설정 생성 및 유틸리티)
// ======================================

/**
 * 공통 쿼리 옵션을 생성하는 헬퍼 함수
 * 기본 설정에 추가 옵션을 병합하여 반환
 * 
 * @param {Object} additionalOptions - 추가로 적용할 옵션들
 * @returns {Object} 최종 쿼리 옵션 객체
 */
export const createQueryOptions = (additionalOptions = {}) => ({
  staleTime: QUERY_CONFIG.staleTime,
  gcTime: QUERY_CONFIG.gcTime,
  retry: QUERY_CONFIG.retry,
  retryDelay: QUERY_CONFIG.retryDelay,
  refetchOnWindowFocus: QUERY_CONFIG.refetchOnWindowFocus,
  refetchOnReconnect: QUERY_CONFIG.refetchOnReconnect,
  refetchOnMount: QUERY_CONFIG.refetchOnMount,
  networkMode: QUERY_CONFIG.networkMode,
  structuralSharing: QUERY_CONFIG.structuralSharing,
  ...additionalOptions, // 추가 옵션으로 기본값 오버라이드 가능
});

/**
 * 공통 뮤테이션 옵션을 생성하는 헬퍼 함수
 * 기본 설정에 추가 옵션을 병합하여 반환
 * 
 * @param {Object} additionalOptions - 추가로 적용할 옵션들
 * @returns {Object} 최종 뮤테이션 옵션 객체
 */
export const createMutationOptions = (additionalOptions = {}) => ({
  retry: MUTATION_CONFIG.retry,
  retryDelay: MUTATION_CONFIG.retryDelay,
  networkMode: MUTATION_CONFIG.networkMode,
  throwOnError: MUTATION_CONFIG.throwOnError,
  ...additionalOptions, // 추가 옵션으로 기본값 오버라이드 가능
});

// 환경별 설정 함수
export const getQueryConfig = (environment = 'production') => {
  const baseConfig = { ...QUERY_CONFIG };
  
  if (environment === 'development') {
    return {
      ...baseConfig,
      staleTime: 30 * 1000,        // 개발 환경에서는 30초로 단축
      refetchOnWindowFocus: true,   // 개발 시에는 포커스 시 재요청 활성화
    };
  }
  
  return baseConfig;
};

export const getMutationConfig = (environment = 'production') => {
  const baseConfig = { ...MUTATION_CONFIG };
  
  if (environment === 'development') {
    return {
      ...baseConfig,
      retry: 1,                    // 개발 환경에서는 재시도 1번으로 단축
    };
  }
  
  return baseConfig;
};

// QueryClient 인스턴스 생성 (최적화)
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      ...QUERY_CONFIG,
      // 쿼리가 실패했을 때의 기본 동작 설정
      suspense: false,
      useErrorBoundary: false,
      // 백그라운드 업데이트 최적화
      refetchInterval: false,
      refetchIntervalInBackground: false,
    },
    mutations: {
      ...MUTATION_CONFIG,
      // 뮤테이션 실패 시 기본 동작
      useErrorBoundary: false,
    },
  },
  
  // 쿼리 캐시 설정
  queryCache: undefined, // 기본 캐시 사용
  mutationCache: undefined, // 기본 뮤테이션 캐시 사용
});

// ReactQueryProvider 컴포넌트 (성능 최적화)
export const ReactQueryProvider = ({ children }) => (
  <QueryClientProvider client={queryClient}>
    {children}
  </QueryClientProvider>
);

// 쿼리 키 팩토리를 위한 유틸리티
export const createQueryKeyFactory = (entity) => ({
  all: () => [entity],
  list: (filters = {}) => [entity, "list", filters],
  detail: (id) => [entity, "detail", id],
  infinite: (filters = {}) => [entity, "infinite", filters],
});

// 캐시 무효화 헬퍼
export const invalidateQueries = {
  // 특정 엔티티의 모든 쿼리 무효화
  allByEntity: (entity) => {
    queryClient.invalidateQueries({ queryKey: [entity] });
  },
  
  // 특정 엔티티의 리스트 쿼리만 무효화
  listByEntity: (entity) => {
    queryClient.invalidateQueries({ queryKey: [entity, "list"] });
  },
  
  // 특정 엔티티의 디테일 쿼리만 무효화
  detailByEntity: (entity, id) => {
    queryClient.invalidateQueries({ queryKey: [entity, "detail", id] });
  }
};

export default queryClient;
