
/**
 * Posts API - JSONPlaceholder를 사용한 게시글 데이터 관리
 * @description Posts 엔티티에 대한 CRUD 작업을 위한 API 함수들
 */

import axios from 'axios'
import { POSTS_API_URL } from './apis'

/**
 * Posts API 관련 함수들
 */
export const postsApi = {
  // 모든 게시글 조회
  getAll: async () => {
    const response = await axios.get(POSTS_API_URL)
    return response.data
  },

  // 특정 게시글 조회
  getById: async (id) => {
    const response = await axios.get(`${POSTS_API_URL}/${id}`)
    return response.data
  },

  // 새 게시글 추가
  create: async (postData) => {
    const response = await axios.post(POSTS_API_URL, postData)
    return response.data
  },

  // 게시글 수정
  update: async (id, postData) => {
    const response = await axios.put(`${POSTS_API_URL}/${id}`, postData)
    return response.data
  },

  // 게시글 삭제
  remove: async (id) => {
    const response = await axios.delete(`${POSTS_API_URL}/${id}`)
    return response.data
  },

  // 다중 게시글 삭제
  deleteMany: async (ids) => {
    const deletePromises = ids.map(id => postsApi.remove(id))
    await Promise.all(deletePromises)
    return ids
  }
}
