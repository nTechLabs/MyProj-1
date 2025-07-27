import { create } from 'zustand'
import { devtools, subscribeWithSelector } from 'zustand/middleware'

/**
 * Comments 체크된 항목들 및 필터를 관리하는 Zustand 스토어
 * Comments 리스트에서 다중 선택 기능과 필터 상태를 위한 상태 관리
 */
const useCommentsStore = create(
  devtools(
    subscribeWithSelector(
      (set, get) => ({
        // 체크 관련 상태들
        checkedIds: new Set(),
        
        // 체크 관련 액션들
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
        
        toggleAllCheck: (allIds, isChecked) => {
          set((state) => {
            const allIdsArray = Array.isArray(allIds) ? allIds : []
            if (isChecked) {
              // 전체 선택 - 현재 리스트의 모든 항목 추가
              const newCheckedIds = new Set(state.checkedIds)
              allIdsArray.forEach(id => newCheckedIds.add(id))
              return { checkedIds: newCheckedIds }
            } else {
              // 전체 해제 - 현재 리스트의 모든 항목만 제거
              const newCheckedIds = new Set(state.checkedIds)
              allIdsArray.forEach(id => newCheckedIds.delete(id))
              return { checkedIds: newCheckedIds }
            }
          })
        },
        
        clearChecked: () => set({ checkedIds: new Set() }),
        
        setCheckedIds: (ids) => {
          const idsArray = Array.isArray(ids) ? ids : []
          set({ checkedIds: new Set(idsArray) })
        },
        
        // 체크 상태 조회 헬퍼들
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
        
        // 필터 관련 상태들
        searchTerm: '',
        filterTypes: [], // 다중 필터 선택을 위한 배열
        
        // 필터 액션들
        setSearchTerm: (term) => set({ searchTerm: term }),
        setFilterTypes: (types) => set({ filterTypes: types }),
        clearFilters: () => set({ 
          searchTerm: '', 
          filterTypes: [] 
        }),
        addFilterType: (type) => set((state) => ({
          filterTypes: state.filterTypes.includes(type) 
            ? state.filterTypes 
            : [...state.filterTypes, type]
        })),
        removeFilterType: (type) => set((state) => ({
          filterTypes: state.filterTypes.filter(t => t !== type)
        })),
        toggleFilterType: (type) => set((state) => ({
          filterTypes: state.filterTypes.includes(type)
            ? state.filterTypes.filter(t => t !== type)
            : [...state.filterTypes, type]
        }))
      })
    ),
    {
      name: 'Comments-store', // DevTools에서 표시될 스토어 이름
    }
  )
)

export default useCommentsStore
