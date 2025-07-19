import { create } from 'zustand'
import { subscribeWithSelector } from 'zustand/middleware'

/**
 * Users 체크된 항목들을 관리하는 Zustand 스토어 (최적화)
 * Users 리스트에서 다중 선택 기능을 위한 상태 관리
 */
const useUsersCheckedStore = create(
  subscribeWithSelector(
    (set, get) => ({
      // 체크된 항목들의 ID 배열
      checkedIds: [],
      
      // 단일 항목 체크/언체크 토글 (최적화)
      toggleCheck: (id) => {
        set((state) => {
          const isChecked = state.checkedIds.includes(id)
          
          if (isChecked) {
            return { 
              checkedIds: state.checkedIds.filter(checkedId => checkedId !== id) 
            }
          } else {
            return { 
              checkedIds: [...state.checkedIds, id] 
            }
          }
        })
      },
      
      // 전체 선택/해제 (최적화)
      toggleAllCheck: (allIds) => {
        set((state) => {
          const isAllChecked = allIds.length > 0 && 
            allIds.every(id => state.checkedIds.includes(id))
          
          return {
            checkedIds: isAllChecked ? [] : allIds
          }
        })
      },
      
      // 체크된 항목들 초기화
      clearChecked: () => set({ checkedIds: [] }),
      
      // 특정 항목들을 체크 상태로 설정
      setCheckedIds: (ids) => set({ checkedIds: Array.isArray(ids) ? ids : [] }),
      
      // 특정 항목이 체크되었는지 확인 (컴퓨티드 함수)
      isChecked: (id) => {
        const { checkedIds } = get()
        return checkedIds.includes(id)
      },
      
      // 전체 선택 여부 확인 (컴퓨티드 함수)
      isAllChecked: (allIds) => {
        const { checkedIds } = get()
        return allIds.length > 0 && allIds.every(id => checkedIds.includes(id))
      },
      
      // 일부 선택 여부 확인 - indeterminate 상태 (컴퓨티드 함수)
      isIndeterminate: (allIds) => {
        const { checkedIds } = get()
        return checkedIds.length > 0 && checkedIds.length < allIds.length
      },
      
      // 체크된 항목 개수 반환
      getCheckedCount: () => {
        const { checkedIds } = get()
        return checkedIds.length
      },
      
      // 체크된 항목들이 특정 배열에 모두 포함되어 있는지 확인
      areAllCheckedInList: (allIds) => {
        const { checkedIds } = get()
        return checkedIds.every(id => allIds.includes(id))
      }
    })
  )
)

// 개발 환경에서 디버깅을 위한 store 이름 설정
if (process.env.NODE_ENV === 'development') {
  useUsersCheckedStore.displayName = 'UsersCheckedStore'
}

export default useUsersCheckedStore

// 스토어 선택자 헬퍼 (리렌더링 최적화)
export const useUsersCheckedIds = () => useUsersCheckedStore(state => state.checkedIds)
export const useUsersToggleCheck = () => useUsersCheckedStore(state => state.toggleCheck)
export const useUsersToggleAllCheck = () => useUsersCheckedStore(state => state.toggleAllCheck)
export const useUsersClearChecked = () => useUsersCheckedStore(state => state.clearChecked)
export const useUsersIsChecked = () => useUsersCheckedStore(state => state.isChecked)
export const useUsersIsAllChecked = () => useUsersCheckedStore(state => state.isAllChecked)
export const useUsersIsIndeterminate = () => useUsersCheckedStore(state => state.isIndeterminate)
export const useUsersCheckedCount = () => useUsersCheckedStore(state => state.getCheckedCount())
