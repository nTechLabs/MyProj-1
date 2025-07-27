import { createCheckedStore, createCheckedSelectors } from './createCheckedStore'

/**
 * Todos 체크된 항목들을 관리하는 Zustand 스토어 (최적화)
 * Todos 리스트에서 다중 선택 기능을 위한 상태 관리
 * 
 * 공통 createCheckedStore 팩토리를 사용하여 중복 코드 제거 및 성능 최적화
 */
const useTodosStore = createCheckedStore('Todos')

// 성능 최적화를 위한 선택자 헬퍼들
const selectors = createCheckedSelectors(useTodosStore, 'todos')

export default useTodosStore

// 개별 선택자들 export (리렌더링 최적화)
export const useTodosCheckedIds = selectors['useTodosCheckedIds']
export const useTodosToggleCheck = selectors['useTodosToggleCheck']
export const useTodosToggleAllCheck = selectors['useTodosToggleAllCheck']
export const useTodosClearChecked = selectors['useTodosClearChecked']
export const useTodosSetCheckedIds = selectors['useTodosSetCheckedIds']
export const useTodosIsChecked = selectors['useTodosIsChecked']
export const useTodosIsAllChecked = selectors['useTodosIsAllChecked']
export const useTodosIsIndeterminate = selectors['useTodosIsIndeterminate']
export const useTodosCheckedCount = selectors['useTodosCheckedCount']

// 컴포지트 선택자 (계산된 상태를 한 번에 반환)
export const useTodosCheckedState = selectors['useTodosCheckedState']
