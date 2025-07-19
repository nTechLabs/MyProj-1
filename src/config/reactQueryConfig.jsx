import React from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

/**
 * React Query 설정 파일 (최적화)
 * 쿼리와 뮤테이션에 대한 공통 설정을 관리합니다.
 */

// Query 설정 (최적화)
export const QUERY_CONFIG = {
  staleTime: 5 * 60 * 1000,        // 5분간 캐시 유지
  gcTime: 10 * 60 * 1000,          // 10분간 캐시 보관 (cacheTime 대신 gcTime 사용)
  retry: 3,                        // 실패 시 3번 재시도
  retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000), // 지수 백오프
  refetchOnWindowFocus: false,     // 윈도우 포커스 시 재요청 비활성화 (성능 최적화)
  refetchOnReconnect: true,        // 네트워크 재연결 시 재요청
  refetchOnMount: true,            // 마운트 시 재요청
  networkMode: 'online',           // 온라인일 때만 쿼리 실행
  structuralSharing: true,         // 구조적 공유를 통한 메모리 최적화
}

// Mutation 설정 (최적화)
export const MUTATION_CONFIG = {
  retry: 2,                        // 실패 시 2번 재시도
  retryDelay: 1500,               // 재시도 간격 1.5초
  networkMode: 'online',           // 온라인일 때만 mutation 실행
  throwOnError: false,            // 에러 발생 시 throw하지 않음 (onError 핸들러 사용)
}

// 공통 쿼리 옵션을 생성하는 헬퍼 함수
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
  ...additionalOptions,
});

// 공통 뮤테이션 옵션을 생성하는 헬퍼 함수
export const createMutationOptions = (additionalOptions = {}) => ({
  retry: MUTATION_CONFIG.retry,
  retryDelay: MUTATION_CONFIG.retryDelay,
  networkMode: MUTATION_CONFIG.networkMode,
  throwOnError: MUTATION_CONFIG.throwOnError,
  ...additionalOptions,
});

// 환경별 설정 (개발/운영 환경에 따라 다른 설정 가능)
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
