/**
 * Comments API - JSONPlaceholder를 사용한 댓글 데이터 관리
 * @description Comments 엔티티에 대한 CRUD 작업을 위한 API 함수들
 */

import axios from 'axios'
import { COMMENTS_API_URL } from './apis'
import { isNetworkEnabled, loadLocalData, findLocalDataById } from '../utils/dataSourceManager'
import { handleAxiosError } from '../utils/handleAxiosError'

/**
 * Comments API 객체
 * @namespace commentsApi
 */
export const commentsApi = {
  /**
   * 모든 댓글 목록을 조회합니다
   * @returns {Promise<Array>} 댓글 목록
   */
  getAll: async () => {
    try {
      if (isNetworkEnabled('comments')) {
        const response = await axios.get(COMMENTS_API_URL)
        return response.data
      } else {
        return await loadLocalData('comments')
      }
    } catch (error) {
      console.error('❌ Failed to fetch comments:', error.message)
      throw new Error(handleAxiosError(error))
    }
  },

  /**
   * 특정 ID의 댓글을 조회합니다
   * @param {string|number} id - 댓글 ID
   * @returns {Promise<Object>} 댓글 객체
   */
  getById: async (id) => {
    try {
      if (!id) {
        throw new Error('Comment ID is required')
      }
      
      if (isNetworkEnabled('comments')) {
        const response = await axios.get(`${COMMENTS_API_URL}/${id}`)
        return response.data
      } else {
        return await findLocalDataById('comments', id)
      }
    } catch (error) {
      console.error(`❌ Failed to fetch comment ${id}:`, error.message)
      throw new Error(handleAxiosError(error))
    }
  },

  /**
   * 새 댓글을 생성합니다
   * @param {Object} data - 댓글 데이터
   * @param {number} data.postId - 게시물 ID
   * @param {string} data.name - 댓글 제목
   * @param {string} data.email - 댓글 작성자 이메일
   * @param {string} data.body - 댓글 내용
   * @returns {Promise<Object>} 생성된 댓글 객체
   */
  create: async (data) => {
    try {
      if (!data || !data.postId || !data.body) {
        throw new Error('Required fields (postId, body) are missing')
      }
      
      if (isNetworkEnabled('comments')) {
        const response = await axios.post(COMMENTS_API_URL, data)
        return response.data
      } else {
        // 로컬 모드에서의 가상 응답 반환
        const newComment = {
          id: Date.now(), // 임시 ID
          ...data
        }
        console.log('💬 [Local Mode] Created comment:', newComment)
        return newComment
      }
    } catch (error) {
      console.error('❌ Failed to create comment:', error.message)
      throw new Error(handleAxiosError(error))
    }
  },

  /**
   * 댓글을 수정합니다
   * @param {string|number} id - 댓글 ID
   * @param {Object} data - 수정할 댓글 데이터
   * @returns {Promise<Object>} 수정된 댓글 객체
   */
  update: async (id, data) => {
    try {
      if (!id) {
        throw new Error('Comment ID is required for update')
      }
      if (!data || Object.keys(data).length === 0) {
        throw new Error('Update data is required')
      }
      
      if (isNetworkEnabled('comments')) {
        const response = await axios.put(`${COMMENTS_API_URL}/${id}`, data)
        return response.data
      } else {
        // 로컬 모드에서의 기존 데이터와 병합한 가상 응답 반환
        const existingComment = await findLocalDataById('comments', id)
        const updatedComment = { ...existingComment, ...data }
        console.log('✏️ [Local Mode] Updated comment:', updatedComment)
        return updatedComment
      }
    } catch (error) {
      console.error(`❌ Failed to update comment ${id}:`, error.message)
      throw new Error(handleAxiosError(error))
    }
  },

  /**
   * 댓글을 삭제합니다 (단일 또는 다중 삭제 지원)
   * @param {string|number|Array<string|number>} idOrIds - 삭제할 댓글 ID 또는 ID 배열
   * @returns {Promise<Object|Array>} 삭제 결과 (단일: {success: true, id}, 다중: 삭제된 ID 배열)
   */
  delete: async (idOrIds) => {
    try {
      // 입력값 검증
      if (!idOrIds) {
        throw new Error('ID is required for deletion')
      }

      const isArray = Array.isArray(idOrIds)
      const ids = isArray ? idOrIds : [idOrIds]
      
      // 빈 배열 체크
      if (ids.length === 0) {
        throw new Error('At least one ID is required for deletion')
      }

      if (isNetworkEnabled('comments')) {
        if (isArray) {
          // 다중 삭제
          const results = await Promise.allSettled(
            ids.map(async (id) => {
              try {
                const response = await axios.delete(`${COMMENTS_API_URL}/${id}`)
                return { success: true, id, data: response.data }
              } catch (error) {
                console.error(`❌ Failed to delete comment ${id}:`, error.message)
                return { success: false, id, error: error.message }
              }
            })
          )
          
          const successfulIds = results
            .filter(result => result.status === 'fulfilled' && result.value.success)
            .map(result => result.value.id)
          
          const failedIds = results
            .filter(result => result.status === 'rejected' || !result.value.success)
            .map(result => result.status === 'fulfilled' ? result.value.id : 'unknown')
          
          if (failedIds.length > 0) {
            console.warn('⚠️ Some comments failed to delete:', failedIds)
          }
          
          return successfulIds
        } else {
          // 단일 삭제
          const response = await axios.delete(`${COMMENTS_API_URL}/${idOrIds}`)
          return { success: true, id: idOrIds, data: response.data }
        }
      } else {
        // 로컬 모드
        if (isArray) {
          console.log('🗑️ [Local Mode] Bulk deleted comments with ids:', ids)
          return ids
        } else {
          console.log('🗑️ [Local Mode] Deleted comment with id:', idOrIds)
          return { success: true, id: idOrIds }
        }
      }
    } catch (error) {
      console.error('❌ Delete operation failed:', error.message)
      throw error
    }
  }
}
