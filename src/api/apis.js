/**
 * API 엔드포인트 중앙 관리
 * 모든 API URL을 한 곳에서 관리하여 유지보수성을 높입니다.
 */

// Base API URL
const BASE_API_URL = 'https://jsonplaceholder.typicode.com'

/**
 * API 엔드포인트 목록
 */
export const API_ENDPOINTS = {
  // Comments API
  COMMENTS: `${BASE_API_URL}/comments`,
  
  // Photos API
  PHOTOS: `${BASE_API_URL}/photos`,
  
  // Posts API
  POSTS: `${BASE_API_URL}/posts`,
  
  // Todos API
  TODOS: `${BASE_API_URL}/todos`,
  
  // Users API
  USERS: `${BASE_API_URL}/users`,
  
  // Albums API (향후 확장용)
  ALBUMS: `${BASE_API_URL}/albums`,
}

// 하위 호환성을 위한 개별 상수 export (기존 코드와의 호환성 유지)
export const COMMENTS_API_URL = API_ENDPOINTS.COMMENTS
export const PHOTOS_API_URL = API_ENDPOINTS.PHOTOS
export const POSTS_API_URL = API_ENDPOINTS.POSTS
export const TODOS_API_URL = API_ENDPOINTS.TODOS
export const USERS_API_URL = API_ENDPOINTS.USERS
