import { create } from 'zustand'

/**
 * 체크된 항목들을 관리하는 Zustand 스토어
 * 리스트에서 다중 선택 기능을 위한 상태 관리
 */
const useCheckedStore = create((set, get) => ({
  // 체크된 항목들의 ID 배열
  checkedIds: [],
  
  // 단일 항목 체크/언체크 토글
  toggleCheck: (id) => {
    const { checkedIds } = get()
    const isChecked = checkedIds.includes(id)
    
    if (isChecked) {
      set({ checkedIds: checkedIds.filter(checkedId => checkedId !== id) })
    } else {
      set({ checkedIds: [...checkedIds, id] })
    }
  },
  
  // 전체 선택/해제
  toggleAllCheck: (allIds) => {
    const { checkedIds } = get()
    const isAllChecked = allIds.length > 0 && allIds.every(id => checkedIds.includes(id))
    
    if (isAllChecked) {
      set({ checkedIds: [] })
    } else {
      set({ checkedIds: allIds })
    }
  },
  
  // 체크된 항목들 초기화
  clearChecked: () => set({ checkedIds: [] }),
  
  // 특정 항목이 체크되었는지 확인
  isChecked: (id) => {
    const { checkedIds } = get()
    return checkedIds.includes(id)
  },
  
  // 전체 선택 여부 확인
  isAllChecked: (allIds) => {
    const { checkedIds } = get()
    return allIds.length > 0 && allIds.every(id => checkedIds.includes(id))
  },
  
  // 일부 선택 여부 확인 (indeterminate 상태)
  isIndeterminate: (allIds) => {
    const { checkedIds } = get()
    return checkedIds.length > 0 && checkedIds.length < allIds.length
  }
}))

export default useCheckedStore
