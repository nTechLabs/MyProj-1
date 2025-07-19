
import { POSTS_API_URL } from './apis'

/**
 * Posts API 관련 함수들
 */
export const postsApi = {
  // 모든 게시글 조회
  getAll: async () => {
    const response = await fetch(POSTS_API_URL)
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    return response.json()
  },

  // 특정 게시글 조회
  getById: async (id) => {
    const response = await fetch(`${POSTS_API_URL}/${id}`)
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    return response.json()
  },

  // 새 게시글 추가
  create: async (postData) => {
    const response = await fetch(POSTS_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(postData)
    })
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    return response.json()
  },

  // 게시글 수정
  update: async (id, postData) => {
    const response = await fetch(`${POSTS_API_URL}/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(postData)
    })
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    return response.json()
  },

  // 게시글 삭제
  delete: async (id) => {
    const response = await fetch(`${POSTS_API_URL}/${id}`, {
      method: 'DELETE'
    })
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    return response.json()
  },

  // 다중 게시글 삭제
  deleteMany: async (ids) => {
    const deletePromises = ids.map(id => postsApi.delete(id))
    await Promise.all(deletePromises)
    return ids
  }
}
