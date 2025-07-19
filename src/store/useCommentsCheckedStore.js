import { createCheckedStore, createCheckedSelectors } from './createCheckedStore'

/**
 * Comments 체크된 항목들을 관리하는 Zustand 스토어 (최적화)
 * Comments 리스트에서 다중 선택 기능을 위한 상태 관리
 * 
 * 공통 createCheckedStore 팩토리를 사용하여 중복 코드 제거 및 성능 최적화
 */
const useCommentsCheckedStore = createCheckedStore('Comments')

// 성능 최적화를 위한 선택자 헬퍼들
const selectors = createCheckedSelectors(useCommentsCheckedStore, 'comments')

export default useCommentsCheckedStore

// 개별 선택자들 export (리렌더링 최적화)
export const useCommentsCheckedIds = selectors.useCommentsCheckedIds
export const useCommentsToggleCheck = selectors.useCommentsToggleCheck
export const useCommentsToggleAllCheck = selectors.useCommentsToggleAllCheck
export const useCommentsClearChecked = selectors.useCommentsClearChecked
export const useCommentsSetCheckedIds = selectors.useCommentsSetCheckedIds
export const useCommentsIsChecked = selectors.useCommentsIsChecked
export const useCommentsIsAllChecked = selectors.useCommentsIsAllChecked
export const useCommentsIsIndeterminate = selectors.useCommentsIsIndeterminate
export const useCommentsCheckedCount = selectors.useCommentsCheckedCount

// 컴포지트 선택자 (계산된 상태를 한 번에 반환)
export const useCommentsCheckedState = selectors.useCommentsCheckedState
