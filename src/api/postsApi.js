/**
 * Posts API - JSONPlaceholder를 사용한 게시글 데이터 관리
 * @description Posts 엔티티에 대한 CRUD 작업을 위한 API 함수들
 */

import axios from 'axios'
import { POSTS_API_URL } from './apis'
import { isNetworkEnabled, loadLocalData, findLocalDataById } from '../utils/dataSourceManager'

/**
 * Posts API 관련 함수들
 */
export const postsApi = {
  // 모든 게시글 조회
  getAll: async () => {
    if (isNetworkEnabled('posts')) {
      const response = await axios.get(POSTS_API_URL)
      return response.data
    } else {
      return await loadLocalData('posts')
    }
  },

  // 특정 게시글 조회
  getById: async (id) => {
    if (isNetworkEnabled('posts')) {
      const response = await axios.get(`${POSTS_API_URL}/${id}`)
      return response.data
    } else {
      return await findLocalDataById('posts', id)
    }
  },

  // 새 게시글 추가
  create: async (postData) => {
    if (isNetworkEnabled('posts')) {
      const response = await axios.post(POSTS_API_URL, postData)
      return response.data
    } else {
      const newPost = {
        id: Date.now(),
        ...postData
      }
      console.log('📝 [Local Mode] Created post:', newPost)
      return newPost
    }
  },

  // 게시글 수정
  update: async (id, postData) => {
    if (isNetworkEnabled('posts')) {
      const response = await axios.put(`${POSTS_API_URL}/${id}`, postData)
      return response.data
    } else {
      const existingPost = await findLocalDataById('posts', id)
      const updatedPost = { ...existingPost, ...postData }
      console.log('✏️ [Local Mode] Updated post:', updatedPost)
      return updatedPost
    }
  },

  // 게시글 삭제
  remove: async (id) => {
    if (isNetworkEnabled('posts')) {
      const response = await axios.delete(`${POSTS_API_URL}/${id}`)
      return response.data
    } else {
      console.log('🗑️ [Local Mode] Deleted post with id:', id)
      return { success: true, id }
    }
  },

  // 다중 게시글 삭제
  deleteMany: async (ids) => {
    if (isNetworkEnabled('posts')) {
      const deletePromises = ids.map(id => postsApi.remove(id))
      await Promise.all(deletePromises)
      return ids
    } else {
      console.log('🗑️ [Local Mode] Bulk deleted posts with ids:', ids)
      return ids
    }
  }
}
