/**
 * React Query 중앙 집중식 설정 파일 (v5 최적화)
 * React Query Rewind 지원 포함
 * 
 * 주요 기능:
 * - 쿼리와 뮤테이션에 대한 공통 설정 중앙화
 * - 개발/프로덕션 환경별 차별화된 설정 제공
 * - 성능 최적화된 기본값 제공 (staleTime, gcTime, retry 등)
 * - 에러 처리 및 재시도 전략 표준화
 * - 캐시 무효화 헬퍼 함수 제공
 * - React Query Rewind 디버깅 지원
 */

import React from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

// ======================================
// 쿼리 기본 설정 (성능 최적화 + Rewind 지원)
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
  staleTime: process.env.NODE_ENV === 'development' ? 30 * 1000 : 5 * 60 * 1000, // 개발: 30초, 프로덕션: 5분
  gcTime: 10 * 60 * 1000,          // 10분간 비활성 데이터를 메모리에 보관
  retry: process.env.NODE_ENV === 'development' ? 1 : 3, // 개발: 1번, 프로덕션: 3번 재시도
  retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000), // 지수 백오프 (최대 30초)
  refetchOnWindowFocus: process.env.NODE_ENV === 'development', // 개발 환경에서는 포커스 시 재요청 활성화 (Rewind 디버깅)
  refetchOnMount: true,           // 컴포넌트 마운트 시 재요청 활성화
  refetchOnReconnect: true,       // 네트워크 재연결 시 재요청 활성화
  networkMode: 'online',           // 온라인일 때만 쿼리 실행
  structuralSharing: true,         // 구조적 공유를 통한 메모리 최적화
}

// ======================================
// 헬퍼 함수들 (설정 생성 및 유틸리티)
// ======================================

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

// QueryClient 인스턴스 생성 (최적화 + Rewind 지원)
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
      // 뮤테이션 실패 시 기본 동작
      useErrorBoundary: false,
      retry: 2,
      networkMode: 'online',
    },
  },
  
  // 쿼리 캐시 설정
  queryCache: undefined, // 기본 캐시 사용
  mutationCache: undefined, // 기본 뮤테이션 캐시 사용
});

// 개발 환경에서 React Query Rewind를 위한 전역 객체 노출
if (process.env.NODE_ENV === 'development') {
  window.__REACT_QUERY_CLIENT__ = queryClient;
}

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
