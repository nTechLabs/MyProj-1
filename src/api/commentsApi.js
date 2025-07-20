/**
 * Comments API - JSONPlaceholder를 사용한 댓글 데이터 관리
 * @description Comments 엔티티에 대한 CRUD 작업을 위한 API 함수들
 */

import axios from 'axios'
import { COMMENTS_API_URL } from './apis'
import { isNetworkEnabled, loadLocalData, findLocalDataById } from '../utils/dataSourceManager'

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
    if (isNetworkEnabled('comments')) {
      const response = await axios.get(COMMENTS_API_URL)
      return response.data
    } else {
      return await loadLocalData('comments')
    }
  },

  /**
   * 특정 ID의 댓글을 조회합니다
   * @param {string|number} id - 댓글 ID
   * @returns {Promise<Object>} 댓글 객체
   */
  getById: async (id) => {
    if (isNetworkEnabled('comments')) {
      const response = await axios.get(`${COMMENTS_API_URL}/${id}`)
      return response.data
    } else {
      return await findLocalDataById('comments', id)
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
  },

  /**
   * 댓글을 수정합니다
   * @param {string|number} id - 댓글 ID
   * @param {Object} data - 수정할 댓글 데이터
   * @returns {Promise<Object>} 수정된 댓글 객체
   */
  update: async (id, data) => {
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
  },

  /**
   * 댓글을 삭제합니다
   * @param {string|number} id - 삭제할 댓글 ID
   * @returns {Promise<Object>} 삭제 결과
   */
  delete: async (id) => {
    if (isNetworkEnabled('comments')) {
      const response = await axios.delete(`${COMMENTS_API_URL}/${id}`)
      return response.data
    } else {
      // 로컬 모드에서의 가상 삭제 응답 반환
      console.log('🗑️ [Local Mode] Deleted comment with id:', id)
      return { success: true, id }
    }
  },

  /**
   * 여러 댓글을 일괄 삭제합니다
   * @param {Array<string|number>} ids - 삭제할 댓글 ID 배열
   * @returns {Promise<Array>} 삭제된 ID 배열
   */
  deleteMany: async (ids) => {
    if (isNetworkEnabled('comments')) {
      const results = await Promise.all(
        ids.map(id => commentsApi.delete(id))
      )
      return ids // 삭제된 ID 배열 반환
    } else {
      // 로컬 모드에서의 가상 일괄 삭제 응답 반환
      console.log('🗑️ [Local Mode] Bulk deleted comments with ids:', ids)
      return ids
    }
  }
}
