/**
 * Comments API - JSONPlaceholder를 사용한 댓글 데이터 관리
 * @description Comments 엔티티에 대한 CRUD 작업을 위한 API 함수들
 */

const API_URL = 'https://jsonplaceholder.typicode.com/comments'

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
    const response = await fetch(API_URL)
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    return response.json()
  },

  /**
   * 특정 ID의 댓글을 조회합니다
   * @param {string|number} id - 댓글 ID
   * @returns {Promise<Object>} 댓글 객체
   */
  getById: async (id) => {
    const response = await fetch(`${API_URL}/${id}`)
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    return response.json()
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
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json' 
      },
      body: JSON.stringify(data)
    })
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    return response.json()
  },

  /**
   * 댓글을 수정합니다
   * @param {string|number} id - 댓글 ID
   * @param {Object} data - 수정할 댓글 데이터
   * @returns {Promise<Object>} 수정된 댓글 객체
   */
  update: async (id, data) => {
    const response = await fetch(`${API_URL}/${id}`, {
      method: 'PUT',
      headers: { 
        'Content-Type': 'application/json' 
      },
      body: JSON.stringify(data)
    })
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    return response.json()
  },

  /**
   * 댓글을 삭제합니다
   * @param {string|number} id - 삭제할 댓글 ID
   * @returns {Promise<Object>} 삭제 결과
   */
  delete: async (id) => {
    const response = await fetch(`${API_URL}/${id}`, {
      method: 'DELETE'
    })
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    return response.json()
  }
}
