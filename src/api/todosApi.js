
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
    if (isNetworkEnabled()) {
      const response = await axios.get(TODOS_API_URL)
      return response.data
    } else {
      return await loadLocalData('todos')
    }
  },

  // 특정 할일 조회
  getById: async (id) => {
    if (isNetworkEnabled()) {
      const response = await axios.get(`${TODOS_API_URL}/${id}`)
      return response.data
    } else {
      return await findLocalDataById('todos', id)
    }
  },

  // 새 할일 추가
  create: async (todoData) => {
    if (isNetworkEnabled()) {
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
    if (isNetworkEnabled()) {
      const response = await axios.put(`${TODOS_API_URL}/${id}`, todoData)
      return response.data
    } else {
      const existingTodo = await findLocalDataById('todos', id)
      const updatedTodo = { ...existingTodo, ...todoData }
      console.log('✏️ [Local Mode] Updated todo:', updatedTodo)
      return updatedTodo
    }
  },

  // 할일 삭제
  remove: async (id) => {
    if (isNetworkEnabled()) {
      const response = await axios.delete(`${TODOS_API_URL}/${id}`)
      return response.data
    } else {
      console.log('🗑️ [Local Mode] Deleted todo with id:', id)
      return { success: true, id }
    }
  },

  // 여러 할일 삭제 (실제 API에서는 지원하지 않으므로 개별 삭제)
  deleteMultiple: async (ids) => {
    if (isNetworkEnabled()) {
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
    } else {
      console.log('🗑️ [Local Mode] Bulk deleted todos with ids:', ids)
      return ids.map(id => ({ id, success: true }))
    }
  }
}
