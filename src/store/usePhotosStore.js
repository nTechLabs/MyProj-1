import { createCheckedStore, createCheckedSelectors } from './createCheckedStore'

/**
 * Photos 체크된 항목들을 관리하는 Zustand 스토어 (최적화)
 * Photos 리스트에서 다중 선택 기능을 위한 상태 관리
 * 
 * 공통 createCheckedStore 팩토리를 사용하여 중복 코드 제거 및 성능 최적화
 */
const usePhotosStore = createCheckedStore('Photos')

// 성능 최적화를 위한 선택자 헬퍼들
const selectors = createCheckedSelectors(usePhotosStore, 'photos')

export default usePhotosStore

// 개별 선택자들 export (리렌더링 최적화)
export const usePhotosCheckedIds = selectors.usePhotosCheckedIds
export const usePhotosToggleCheck = selectors.usePhotosToggleCheck
export const usePhotosToggleAllCheck = selectors.usePhotosToggleAllCheck
export const usePhotosClearChecked = selectors.usePhotosClearChecked
export const usePhotosSetCheckedIds = selectors.usePhotosSetCheckedIds
export const usePhotosIsChecked = selectors.usePhotosIsChecked
export const usePhotosIsAllChecked = selectors.usePhotosIsAllChecked
export const usePhotosIsIndeterminate = selectors.usePhotosIsIndeterminate
export const usePhotosCheckedCount = selectors.usePhotosCheckedCount

// 컴포지트 선택자 (계산된 상태를 한 번에 반환)
export const usePhotosCheckedState = selectors.usePhotosCheckedState
