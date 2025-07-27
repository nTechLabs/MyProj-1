
/**
 * Todos API - JSONPlaceholder를 사용한 할일 데이터 관리
 * @description Todos 엔티티에 대한 CRUD 작업을 위한 API 함수들
 */

import axios from 'axios'
import { TODOS_API_URL } from './apis'
import { isNetworkEnabled, loadLocalData, findLocalDataById } from '../utils/dataSourceManager'

/**
 * Todos API 관련 함수들
 */
export const todosApi = {
  // 모든 할일 조회
  getAll: async () => {
    if (isNetworkEnabled('todos')) {
      const response = await axios.get(TODOS_API_URL)
      return response.data
    } else {
      return await loadLocalData('todos')
    }
  },

  // 특정 할일 조회
  getById: async (id) => {
    if (isNetworkEnabled('todos')) {
      const response = await axios.get(`${TODOS_API_URL}/${id}`)
      return response.data
    } else {
      return await findLocalDataById('todos', id)
    }
  },

  // 새 할일 추가
  create: async (todoData) => {
    if (isNetworkEnabled('todos')) {
      const response = await axios.post(TODOS_API_URL, todoData)
      return response.data
    } else {
      const newTodo = {
        id: Date.now(),
        ...todoData
      }
      console.log('✅ [Local Mode] Created todo:', newTodo)
      return newTodo
    }
  },

  // 할일 수정
  update: async (id, todoData) => {
    if (isNetworkEnabled('todos')) {
      const response = await axios.put(`${TODOS_API_URL}/${id}`, todoData)
      return response.data
    } else {
      const existingTodo = await findLocalDataById('todos', id)
      const updatedTodo = { ...existingTodo, ...todoData }
      console.log('✏️ [Local Mode] Updated todo:', updatedTodo)
      return updatedTodo
    }
  },

  // 할일 삭제 (단일 또는 다중)
  delete: async (ids) => {
    // 단일 ID를 배열로 변환하여 통일된 처리
    const idsArray = Array.isArray(ids) ? ids : [ids]
    
    if (isNetworkEnabled('todos')) {
      try {
        const deletePromises = idsArray.map(async id => {
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
        
        const results = await Promise.all(deletePromises)
        
        // 단일 삭제인 경우 단일 결과 반환, 다중 삭제인 경우 배열 반환
        if (!Array.isArray(ids)) {
          return results[0]
        }
        return results
      } catch (error) {
        console.error('❌ [Network Mode] Failed to delete todos:', error)
        throw error
      }
    } else {
      if (!Array.isArray(ids)) {
        console.log('🗑️ [Local Mode] Deleted todo with id:', ids)
        return { success: true, id: ids }
      } else {
        console.log('🗑️ [Local Mode] Bulk deleted todos with ids:', idsArray)
        return idsArray.map(id => ({ id, success: true }))
      }
    }
  }
}
