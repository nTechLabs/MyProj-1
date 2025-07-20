/**
 * Photos API - JSONPlaceholder를 사용한 사진 데이터 관리
 * @description Photos 엔티티에 대한 CRUD 작업을 위한 API 함수들
 */

import axios from 'axios'
import { PHOTOS_API_URL } from './apis'
import { isNetworkEnabled, loadLocalData, findLocalDataById } from '../utils/dataSourceManager'

/**
 * Photos API 관련 함수들
 */
export const photosApi = {
  // 모든 사진 조회
  getAll: async () => {
    if (isNetworkEnabled('photos')) {
      const response = await axios.get(PHOTOS_API_URL)
      return response.data
    } else {
      return await loadLocalData('photos')
    }
  },

  // 특정 사진 조회
  getById: async (id) => {
    if (isNetworkEnabled('photos')) {
      const response = await axios.get(`${PHOTOS_API_URL}/${id}`)
      return response.data
    } else {
      return await findLocalDataById('photos', id)
    }
  },

  // 새 사진 추가
  create: async (photoData) => {
    if (isNetworkEnabled('photos')) {
      const response = await axios.post(PHOTOS_API_URL, photoData)
      return response.data
    } else {
      const newPhoto = {
        id: Date.now(),
        ...photoData
      }
      console.log('📸 [Local Mode] Created photo:', newPhoto)
      return newPhoto
    }
  },

  // 사진 수정
  update: async (id, photoData) => {
    if (isNetworkEnabled('photos')) {
      const response = await axios.put(`${PHOTOS_API_URL}/${id}`, photoData)
      return response.data
    } else {
      const existingPhoto = await findLocalDataById('photos', id)
      const updatedPhoto = { ...existingPhoto, ...photoData }
      console.log('✏️ [Local Mode] Updated photo:', updatedPhoto)
      return updatedPhoto
    }
  },

  // 사진 삭제
  remove: async (id) => {
    if (isNetworkEnabled('photos')) {
      const response = await axios.delete(`${PHOTOS_API_URL}/${id}`)
      return response.data
    } else {
      console.log('🗑️ [Local Mode] Deleted photo with id:', id)
      return { success: true, id }
    }
  },

  // 다중 사진 삭제
  deleteMany: async (ids) => {
    if (isNetworkEnabled('photos')) {
      const results = await Promise.all(
        ids.map(id => photosApi.remove(id))
      )
      return ids // 삭제된 ID 배열 반환
    } else {
      console.log('🗑️ [Local Mode] Bulk deleted photos with ids:', ids)
      return ids
    }
  }
}
