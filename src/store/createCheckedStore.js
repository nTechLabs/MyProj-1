import { create } from 'zustand'
import { subscribeWithSelector } from 'zustand/middleware'

/**
 * 체크박스 상태 관리를 위한 공통 스토어 팩토리
 * 엔티티별로 독립적인 체크 상태를 관리하는 Zustand 스토어를 생성
 * 
 * @param {string} entityName - 엔티티명 (디버깅용)
 * @returns {Function} - Zustand 스토어 훅
 */
export const createCheckedStore = (entityName = 'Entity') => {
  // 메인 스토어 생성
  const useCheckedStore = create(
    subscribeWithSelector(
      (set, get) => ({
        // 체크된 항목들의 ID Set (O(1) 조회 성능)
        checkedIds: new Set(),
        
        // 단일 항목 체크/언체크 토글
        toggleCheck: (id) => {
          set((state) => {
            const newCheckedIds = new Set(state.checkedIds)
            if (newCheckedIds.has(id)) {
              newCheckedIds.delete(id)
            } else {
              newCheckedIds.add(id)
            }
            return { checkedIds: newCheckedIds }
          })
        },
        
        // 전체 선택/해제
        toggleAllCheck: (allIds) => {
          set((state) => {
            const allIdsArray = Array.isArray(allIds) ? allIds : []
            const currentChecked = state.checkedIds
            const isAllChecked = allIdsArray.length > 0 && 
              allIdsArray.every(id => currentChecked.has(id))
            
            if (isAllChecked) {
              // 전체 해제 - 현재 리스트의 모든 항목만 제거
              const newCheckedIds = new Set(currentChecked)
              allIdsArray.forEach(id => newCheckedIds.delete(id))
              return { checkedIds: newCheckedIds }
            } else {
              // 전체 선택 - 현재 리스트의 모든 항목 추가
              const newCheckedIds = new Set(currentChecked)
              allIdsArray.forEach(id => newCheckedIds.add(id))
              return { checkedIds: newCheckedIds }
            }
          })
        },
        
        // 체크된 항목들 초기화
        clearChecked: () => set({ checkedIds: new Set() }),
        
        // 특정 항목들을 체크 상태로 설정
        setCheckedIds: (ids) => {
          const idsArray = Array.isArray(ids) ? ids : []
          set({ checkedIds: new Set(idsArray) })
        },
        
        // 선택자 헬퍼 함수들 (컴퓨티드 속성)
        isChecked: (id) => get().checkedIds.has(id),
        
        isAllChecked: (allIds) => {
          const { checkedIds } = get()
          const allIdsArray = Array.isArray(allIds) ? allIds : []
          return allIdsArray.length > 0 && allIdsArray.every(id => checkedIds.has(id))
        },
        
        isIndeterminate: (allIds) => {
          const { checkedIds } = get()
          const allIdsArray = Array.isArray(allIds) ? allIds : []
          const checkedCount = allIdsArray.filter(id => checkedIds.has(id)).length
          return checkedCount > 0 && checkedCount < allIdsArray.length
        },
        
        getCheckedCount: () => get().checkedIds.size,
        
        getCheckedIds: () => Array.from(get().checkedIds),
        
        // 체크된 항목들이 특정 배열에 모두 포함되어 있는지 확인
        areAllCheckedInList: (allIds) => {
          const { checkedIds } = get()
          const allIdsArray = Array.isArray(allIds) ? allIds : []
          return Array.from(checkedIds).every(id => allIdsArray.includes(id))
        }
      })
    )
  )

  // 개발 환경에서 디버깅을 위한 store 이름 설정
  if (process.env.NODE_ENV === 'development') {
    useCheckedStore.displayName = `${entityName}CheckedStore`
  }

  return useCheckedStore
}

/**
 * 완전한 체크 스토어를 생성하는 헬퍼 함수
 * @param {string} entityName - 엔티티명 (PascalCase)
 * @returns {Function} - Zustand 스토어 훅
 */
export const createEntityCheckedStore = (entityName) => {
  return createCheckedStore(entityName)
}

/**
 * 체크 스토어를 위한 선택자 헬퍼 함수들을 생성
 * @param {Function} useStore - Zustand 스토어 훅
 * @param {string} entityName - 엔티티명 (소문자)
 * @returns {Object} - 선택자 함수들의 객체
 */
export const createCheckedSelectors = (useStore, entityName) => {
  const capitalizedEntity = entityName.charAt(0).toUpperCase() + entityName.slice(1)
  
  return {
    [`use${capitalizedEntity}CheckedIds`]: () => useStore(state => state.checkedIds),
    [`use${capitalizedEntity}ToggleCheck`]: () => useStore(state => state.toggleCheck),
    [`use${capitalizedEntity}ToggleAllCheck`]: () => useStore(state => state.toggleAllCheck),
    [`use${capitalizedEntity}ClearChecked`]: () => useStore(state => state.clearChecked),
    [`use${capitalizedEntity}SetCheckedIds`]: () => useStore(state => state.setCheckedIds),
    [`use${capitalizedEntity}IsChecked`]: () => useStore(state => state.isChecked),
    [`use${capitalizedEntity}IsAllChecked`]: () => useStore(state => state.isAllChecked),
    [`use${capitalizedEntity}IsIndeterminate`]: () => useStore(state => state.isIndeterminate),
    [`use${capitalizedEntity}CheckedCount`]: () => useStore(state => state.getCheckedCount()),
    
    // 컴포지트 선택자 (계산된 상태를 한 번에 반환)
    [`use${capitalizedEntity}CheckedState`]: (allIds = []) => useStore(state => ({
      checkedIds: state.checkedIds,
      checkedIdsArray: Array.from(state.checkedIds),
      isAllChecked: state.isAllChecked(allIds),
      isIndeterminate: state.isIndeterminate(allIds),
      checkedCount: allIds.filter(id => state.checkedIds.has(id)).length,
      totalCount: allIds.length,
      hasChecked: state.checkedIds.size > 0,
      isEmpty: state.checkedIds.size === 0
    }))
  }
}

export default createCheckedStore
