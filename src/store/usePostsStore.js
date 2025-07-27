import { createCheckedStore, createCheckedSelectors } from './createCheckedStore'

/**
 * Posts 체크된 항목들을 관리하는 Zustand 스토어 (최적화)
 * Posts 리스트에서 다중 선택 기능을 위한 상태 관리
 * 
 * 공통 createCheckedStore 팩토리를 사용하여 중복 코드 제거 및 성능 최적화
 */
const usePostsStore = createCheckedStore('Posts')

// 성능 최적화를 위한 개별 선택자들 생성
const selectors = createCheckedSelectors(usePostsStore, 'posts')

export default usePostsStore

// 실제 사용되는 선택자들만 export (리렌더링 최적화)
export const usePostsClearChecked = selectors.usePostsClearChecked

// 향후 필요시 사용할 수 있는 선택자들 (현재 미사용)
// export const usePostsCheckedIds = selectors.usePostsCheckedIds
// export const usePostsToggleCheck = selectors.usePostsToggleCheck
// export const usePostsToggleAllCheck = selectors.usePostsToggleAllCheck
// export const usePostsSetCheckedIds = selectors.usePostsSetCheckedIds
// export const usePostsIsChecked = selectors.usePostsIsChecked
// export const usePostsIsAllChecked = selectors.usePostsIsAllChecked
// export const usePostsIsIndeterminate = selectors.usePostsIsIndeterminate
// export const usePostsCheckedCount = selectors.usePostsCheckedCount
// export const usePostsCheckedState = selectors.usePostsCheckedState
