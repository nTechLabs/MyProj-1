/**
 * 네비게이션 상태 관리 Zustand Store
 * 
 * 주요 기능:
 * - 현재 페이지 정보 관리 (경로, 제목, 인덱스)
 * - 이전/다음 페이지 네비게이션 기능
 * - 페이지 목록과 순서 관리
 * 
 * 페이지 구조:
 * - 메인 페이지들과 상세 페이지들을 구분하여 관리
 * - 각 페이지마다 고유한 title과 path 정보 보유
 */

import { create } from 'zustand'

// 애플리케이션의 모든 페이지 정의
const PAGES = [
  { path: '/', title: '홈페이지', displayTitle: '홈' },
  { path: '/users', title: '사용자 목록', displayTitle: '사용자' },
  { path: '/posts', title: '게시글 목록', displayTitle: '게시글' },
  { path: '/todos', title: '할일 목록', displayTitle: '할일' },
  { path: '/comments', title: '댓글 목록', displayTitle: '댓글' },
  { path: '/photos', title: '사진 목록', displayTitle: '사진' },
  { path: '/counter', title: '카운터 데모', displayTitle: '카운터' }
]

/**
 * 네비게이션 상태 관리 Store
 */
const useNavigationStore = create((set, get) => ({
  // 현재 페이지 정보
  currentPath: '/',
  currentPageIndex: 0,
  
  // 페이지 목록
  pages: PAGES,
  
  /**
   * 현재 페이지 정보 가져오기
   * @returns {Object} 현재 페이지 객체
   */
  getCurrentPage: () => {
    const { currentPageIndex, pages } = get()
    return pages[currentPageIndex] || pages[0]
  },
  
  /**
   * 경로로 페이지 설정
   * @param {string} path - 설정할 페이지 경로
   */
  setCurrentPath: (path) => {
    const { pages } = get()
    
    // 상세 페이지 경로인 경우 메인 페이지로 매핑
    let mappedPath = path
    if (path.includes('/user/')) mappedPath = '/users'
    else if (path.includes('/post/')) mappedPath = '/posts'
    else if (path.includes('/todo/')) mappedPath = '/todos'
    else if (path.includes('/comment/')) mappedPath = '/comments'
    else if (path.includes('/photo/')) mappedPath = '/photos'
    
    const pageIndex = pages.findIndex(page => page.path === mappedPath)
    
    set({
      currentPath: path,
      currentPageIndex: pageIndex >= 0 ? pageIndex : 0
    })
  },
  
  /**
   * 이전 페이지로 이동
   * @returns {string} 이전 페이지 경로
   */
  goToPreviousPage: () => {
    const { currentPageIndex, pages } = get()
    const newIndex = currentPageIndex > 0 ? currentPageIndex - 1 : pages.length - 1
    
    set({
      currentPageIndex: newIndex,
      currentPath: pages[newIndex].path
    })
    
    return pages[newIndex].path
  },
  
  /**
   * 다음 페이지로 이동
   * @returns {string} 다음 페이지 경로
   */
  goToNextPage: () => {
    const { currentPageIndex, pages } = get()
    const newIndex = currentPageIndex < pages.length - 1 ? currentPageIndex + 1 : 0
    
    set({
      currentPageIndex: newIndex,
      currentPath: pages[newIndex].path
    })
    
    return pages[newIndex].path
  },
  
  /**
   * 특정 인덱스의 페이지로 이동
   * @param {number} index - 이동할 페이지 인덱스
   * @returns {string} 해당 페이지 경로
   */
  goToPageByIndex: (index) => {
    const { pages } = get()
    if (index >= 0 && index < pages.length) {
      set({
        currentPageIndex: index,
        currentPath: pages[index].path
      })
      return pages[index].path
    }
    return get().currentPath
  },
  
  /**
   * 이전 페이지가 있는지 확인
   * @returns {boolean}
   */
  hasPreviousPage: () => {
    const { currentPageIndex } = get()
    return currentPageIndex > 0
  },
  
  /**
   * 다음 페이지가 있는지 확인
   * @returns {boolean}
   */
  hasNextPage: () => {
    const { currentPageIndex, pages } = get()
    return currentPageIndex < pages.length - 1
  }
}))

export default useNavigationStore
