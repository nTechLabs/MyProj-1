import { createCheckedStore, createCheckedSelectors } from './createCheckedStore'

/**
 * Users 체크된 항목들을 관리하는 Zustand 스토어 (최적화)
 * Users 리스트에서 다중 선택 기능을 위한 상태 관리
 * 
 * 공통 createCheckedStore 팩토리를 사용하여 중복 코드 제거 및 성능 최적화
 */
const useUsersCheckedStore = createCheckedStore('Users')

// 성능 최적화를 위한 선택자 헬퍼들
const selectors = createCheckedSelectors(useUsersCheckedStore, 'users')

export default useUsersCheckedStore

// 개별 선택자들 export (리렌더링 최적화)
export const useUsersCheckedIds = selectors['useUsersCheckedIds']
export const useUsersToggleCheck = selectors['useUsersToggleCheck']
export const useUsersToggleAllCheck = selectors['useUsersToggleAllCheck']
export const useUsersClearChecked = selectors['useUsersClearChecked']
export const useUsersSetCheckedIds = selectors['useUsersSetCheckedIds']
export const useUsersIsChecked = selectors['useUsersIsChecked']
export const useUsersIsAllChecked = selectors['useUsersIsAllChecked']
export const useUsersIsIndeterminate = selectors['useUsersIsIndeterminate']
export const useUsersCheckedCount = selectors['useUsersCheckedCount']

// 컴포지트 선택자 (계산된 상태를 한 번에 반환)
export const useUsersCheckedState = selectors['useUsersCheckedState']
