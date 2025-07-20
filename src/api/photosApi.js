/**
 * Photos API - JSONPlaceholder를 사용한 사진 데이터 관리
 * @description Photos 엔티티에 대한 CRUD 작업을 위한 API 함수들
 */

import axios from 'axios'
import { PHOTOS_API_URL } from './apis'

/**
 * Photos API 관련 함수들
 */
export const photosApi = {
  // 모든 사진 조회
  getAll: async () => {
    const response = await axios.get(PHOTOS_API_URL)
    return response.data
  },

  // 특정 사진 조회
  getById: async (id) => {
    const response = await axios.get(`${PHOTOS_API_URL}/${id}`)
    return response.data
  },

  // 새 사진 추가
  create: async (photoData) => {
    const response = await axios.post(PHOTOS_API_URL, photoData)
    return response.data
  },

  // 사진 수정
  update: async (id, photoData) => {
    const response = await axios.put(`${PHOTOS_API_URL}/${id}`, photoData)
    return response.data
  },

  // 사진 삭제
  remove: async (id) => {
    const response = await axios.delete(`${PHOTOS_API_URL}/${id}`)
    return response.data
  },

  // 다중 사진 삭제
  deleteMany: async (ids) => {
    const results = await Promise.all(
      ids.map(id => photosApi.remove(id))
    )
    return ids // 삭제된 ID 배열 반환
  }
}
