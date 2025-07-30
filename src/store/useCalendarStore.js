import { createCheckedStore, createCheckedSelectors } from './createCheckedStore'

/**
 * Calendar 체크된 항목들을 관리하는 Zustand 스토어 (최적화)
 * Calendar 리스트에서 다중 선택 기능을 위한 상태 관리
 * 
 * 공통 createCheckedStore 팩토리를 사용하여 중복 코드 제거 및 성능 최적화
 */
const useCalendarStore = createCheckedStore('Calendar')

// 성능 최적화를 위한 선택자 헬퍼들
const selectors = createCheckedSelectors(useCalendarStore, 'calendar')

export default useCalendarStore

// 개별 선택자들 export (리렌더링 최적화)
export const useCalendarCheckedIds = selectors['useCalendarCheckedIds']
export const useCalendarToggleCheck = selectors['useCalendarToggleCheck']
export const useCalendarToggleAllCheck = selectors['useCalendarToggleAllCheck']
export const useCalendarClearChecked = selectors['useCalendarClearChecked']
export const useCalendarSetCheckedIds = selectors['useCalendarSetCheckedIds']
export const useCalendarIsChecked = selectors['useCalendarIsChecked']
export const useCalendarIsAllChecked = selectors['useCalendarIsAllChecked']
export const useCalendarIsIndeterminate = selectors['useCalendarIsIndeterminate']
export const useCalendarCheckedCount = selectors['useCalendarCheckedCount']

// 컴포지트 선택자 (계산된 상태를 한 번에 반환)
export const useCalendarCheckedState = selectors['useCalendarCheckedState']
