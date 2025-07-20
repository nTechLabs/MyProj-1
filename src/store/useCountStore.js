/**
 * 카운터 상태 관리 스토어 (Zustand)
 * 
 * 간단한 카운터 기능을 위한 클라이언트 상태 관리 예제
 * Zustand의 기본 사용법을 보여주는 데모 스토어
 * 
 * 주요 기능:
 * - increment: 카운트 값을 1 증가
 * - decrement: 카운트 값을 1 감소
 * - reset: 카운트 값을 0으로 초기화
 * 
 * Zustand 장점:
 * - Redux에 비해 보일러플레이트 코드 최소화
 * - TypeScript 지원 우수
 * - 미들웨어 없이도 간단한 상태 관리 가능
 * - React 외부에서도 사용 가능
 * - 번들 크기 작음 (2.5KB)
 * 
 * 사용법:
 * ```javascript
 * const { count, increment, decrement, reset } = useCountStore()
 * ```
 */

import { create } from 'zustand'

/**
 * 카운터 스토어 생성
 * 
 * @param {function} set - 상태 업데이트 함수
 * @returns {Object} 카운터 상태와 액션 함수들
 */
const useCountStore = create((set) => ({
  // ======================================
  // 상태 정의
  // ======================================
  
  /** @type {number} 현재 카운트 값 */
  count: 0,

  // ======================================
  // 액션 함수들
  // ======================================
  
  /**
   * 카운트 값을 1 증가시키는 함수
   * 이전 상태를 기반으로 새로운 상태를 계산
   */
  increment: () => set((state) => ({ 
    count: state.count + 1 
  })),

  /**
   * 카운트 값을 1 감소시키는 함수
   * 이전 상태를 기반으로 새로운 상태를 계산
   */
  decrement: () => set((state) => ({ 
    count: state.count - 1 
  })),

  /**
   * 카운트 값을 초기값(0)으로 리셋하는 함수
   * 직접 새로운 상태 객체를 전달
   */
  reset: () => set({ count: 0 }),
}))

export default useCountStore
