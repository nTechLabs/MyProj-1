
/**
 * Users API - JSONPlaceholder를 사용한 사용자 데이터 관리
 * @description Users 엔티티에 대한 CRUD 작업을 위한 API 함수들
 */

import axios from 'axios'
import { USERS_API_URL } from './apis'
import { isNetworkEnabled, loadLocalData, findLocalDataById } from '../utils/dataSourceManager'

/**
 * Users API 관련 함수들
 */
export const usersApi = {
  // 모든 사용자 조회
  getAll: async () => {
    if (isNetworkEnabled('users')) {
      const response = await axios.get(USERS_API_URL)
      return response.data
    } else {
      return await loadLocalData('users')
    }
  },

  // 특정 사용자 조회
  getById: async (id) => {
    if (isNetworkEnabled('users')) {
      const response = await axios.get(`${USERS_API_URL}/${id}`)
      return response.data
    } else {
      return await findLocalDataById('users', id)
    }
  },

  // 새 사용자 추가
  create: async (userData) => {
    if (isNetworkEnabled('users')) {
      const response = await axios.post(USERS_API_URL, userData)
      return response.data
    } else {
      const newUser = {
        id: Date.now(),
        ...userData
      }
      console.log('👤 [Local Mode] Created user:', newUser)
      return newUser
    }
  },

  // 사용자 수정
  update: async (id, userData) => {
    if (isNetworkEnabled('users')) {
      const response = await axios.put(`${USERS_API_URL}/${id}`, userData)
      return response.data
    } else {
      const existingUser = await findLocalDataById('users', id)
      const updatedUser = { ...existingUser, ...userData }
      console.log('✏️ [Local Mode] Updated user:', updatedUser)
      return updatedUser
    }
  },

  // 사용자 삭제 (단일 또는 다중)
  delete: async (ids) => {
    // 단일 ID를 배열로 변환하여 통일된 처리
    const idsArray = Array.isArray(ids) ? ids : [ids]
    
    if (isNetworkEnabled('users')) {
      try {
        const deletePromises = idsArray.map(async id => {
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
        
        const results = await Promise.all(deletePromises)
        
        // 단일 삭제인 경우 단일 결과 반환, 다중 삭제인 경우 배열 반환
        if (!Array.isArray(ids)) {
          return results[0]
        }
        return results
      } catch (error) {
        console.error('❌ [Network Mode] Failed to delete users:', error)
        throw error
      }
    } else {
      if (!Array.isArray(ids)) {
        console.log('🗑️ [Local Mode] Deleted user with id:', ids)
        return { success: true, id: ids }
      } else {
        console.log('🗑️ [Local Mode] Bulk deleted users with ids:', idsArray)
        return idsArray.map(id => ({ id, success: true }))
      }
    }
  }
}
