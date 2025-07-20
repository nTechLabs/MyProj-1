
/**
 * Todos API - JSONPlaceholder를 사용한 할일 데이터 관리
 * @description Todos 엔티티에 대한 CRUD 작업을 위한 API 함수들
 */

import axios from 'axios'
import { TODOS_API_URL } from './apis'

/**
 * Todos API 관련 함수들
 */
export const todosApi = {
  // 모든 할일 조회
  getAll: async () => {
    const response = await axios.get(TODOS_API_URL)
    return response.data
  },

  // 특정 할일 조회
  getById: async (id) => {
    const response = await axios.get(`${TODOS_API_URL}/${id}`)
    return response.data
  },

  // 새 할일 추가
  create: async (todoData) => {
    const response = await axios.post(TODOS_API_URL, todoData)
    return response.data
  },

  // 할일 수정
  update: async (id, todoData) => {
    const response = await axios.put(`${TODOS_API_URL}/${id}`, todoData)
    return response.data
  },

  // 할일 삭제
  remove: async (id) => {
    const response = await axios.delete(`${TODOS_API_URL}/${id}`)
    return response.data
  },

  // 여러 할일 삭제 (실제 API에서는 지원하지 않으므로 개별 삭제)
  deleteMultiple: async (ids) => {
    const deletePromises = ids.map(async id => {
      try {
        await axios.delete(`${TODOS_API_URL}/${id}`)
        return { id, success: true }
      } catch (error) {
        return { 
          id, 
          success: false, 
          error: error.response?.statusText || error.message 
        }
      }
    })
    
    return Promise.all(deletePromises)
  }
}
