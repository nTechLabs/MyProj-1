import React from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

/**
 * React Query 설정 파일
 * 쿼리와 뮤테이션에 대한 공통 설정을 관리합니다.
 */

// Query 설정
export const QUERY_CONFIG = {
  staleTime: 5 * 60 * 1000,        // 5분간 캐시 유지
  gcTime: 10 * 60 * 1000,          // 10분간 캐시 보관
  retry: 3,                        // 실패 시 3번 재시도
  retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000), // 지수 백오프
  refetchOnWindowFocus: false,     // 윈도우 포커스 시 재요청 비활성화
  refetchOnReconnect: true,        // 네트워크 재연결 시 재요청
  refetchOnMount: true,            // 마운트 시 재요청
  networkMode: 'online',           // 온라인일 때만 쿼리 실행
};

// Mutation 설정
export const MUTATION_CONFIG = {
  retry: 2,                        // 실패 시 2번 재시도
  retryDelay: 1500,               // 재시도 간격 1.5초
  networkMode: 'online',           // 온라인일 때만 mutation 실행
};

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
  ...additionalOptions,
});

// 공통 뮤테이션 옵션을 생성하는 헬퍼 함수
export const createMutationOptions = (additionalOptions = {}) => ({
  retry: MUTATION_CONFIG.retry,
  retryDelay: MUTATION_CONFIG.retryDelay,
  networkMode: MUTATION_CONFIG.networkMode,
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

// QueryClient 인스턴스 생성
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: QUERY_CONFIG,
    mutations: MUTATION_CONFIG,
  },
});

// ReactQueryProvider 컴포넌트
export const ReactQueryProvider = ({ children }) => (
  <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
);
