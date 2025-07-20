
/**
 * Users API - JSONPlaceholder를 사용한 사용자 데이터 관리
 * @description Users 엔티티에 대한 CRUD 작업을 위한 API 함수들
 */

import axios from 'axios'
import { USERS_API_URL } from './apis'

/**
 * Users API 관련 함수들
 */
export const usersApi = {
  // 모든 사용자 조회
  getAll: async () => {
    const response = await axios.get(USERS_API_URL)
    return response.data
  },

  // 특정 사용자 조회
  getById: async (id) => {
    const response = await axios.get(`${USERS_API_URL}/${id}`)
    return response.data
  },

  // 새 사용자 추가
  create: async (userData) => {
    const response = await axios.post(USERS_API_URL, userData)
    return response.data
  },

  // 사용자 수정
  update: async (id, userData) => {
    const response = await axios.put(`${USERS_API_URL}/${id}`, userData)
    return response.data
  },

  // 사용자 삭제
  remove: async (id) => {
    const response = await axios.delete(`${USERS_API_URL}/${id}`)
    return response.data
  },

  // 여러 사용자 삭제 (실제 API에서는 지원하지 않으므로 개별 삭제)
  deleteMultiple: async (ids) => {
    const deletePromises = ids.map(async id => {
      try {
        await axios.delete(`${USERS_API_URL}/${id}`)
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
