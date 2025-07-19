import { create } from 'zustand'

// 페이지 네비게이션 스토어
const useNavigationStore = create((set) => ({
  currentPage: 'home',
  setCurrentPage: (page) => set({ currentPage: page }),
  goHome: () => set({ currentPage: 'home' }),
  goToUsers: () => set({ currentPage: 'users' }),
}))

export default useNavigationStore
