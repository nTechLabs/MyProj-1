/**
 * Photos API - JSONPlaceholder를 사용한 사진 데이터 관리
 * @description Photos 엔티티에 대한 CRUD 작업을 위한 API 함수들
 */

import axios from 'axios'
import { PHOTOS_API_URL } from './apis'
import { isNetworkEnabled, loadLocalData, findLocalDataById } from '../utils/dataSourceManager'
import { handleAxiosError } from '../utils/handleAxiosError'

/**
 * Photos API 관련 함수들
 */
export const photosApi = {
  // 모든 사진 조회
  getAll: async () => {
    try {
      if (isNetworkEnabled('photos')) {
        const response = await axios.get(PHOTOS_API_URL)
        return response.data
      } else {
        return await loadLocalData('photos')
      }
    } catch (error) {
      console.error('❌ Failed to fetch photos:', error.message)
      throw new Error(handleAxiosError(error))
    }
  },

  // 특정 사진 조회
  getById: async (id) => {
    try {
      if (!id) {
        throw new Error('Photo ID is required')
      }
      
      if (isNetworkEnabled('photos')) {
        const response = await axios.get(`${PHOTOS_API_URL}/${id}`)
        return response.data
      } else {
        return await findLocalDataById('photos', id)
      }
    } catch (error) {
      console.error(`❌ Failed to fetch photo ${id}:`, error.message)
      throw new Error(handleAxiosError(error))
    }
  },

  // 새 사진 추가
  create: async (photoData) => {
    try {
      if (!photoData || !photoData.title) {
        throw new Error('Photo data with title is required')
      }
      
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
    } catch (error) {
      console.error('❌ Failed to create photo:', error.message)
      throw new Error(handleAxiosError(error))
    }
  },

  // 사진 수정
  update: async (id, photoData) => {
    try {
      if (!id) {
        throw new Error('Photo ID is required for update')
      }
      if (!photoData || Object.keys(photoData).length === 0) {
        throw new Error('Update data is required')
      }
      
      if (isNetworkEnabled('photos')) {
        const response = await axios.put(`${PHOTOS_API_URL}/${id}`, photoData)
        return response.data
      } else {
        const existingPhoto = await findLocalDataById('photos', id)
        const updatedPhoto = { ...existingPhoto, ...photoData }
        console.log('✏️ [Local Mode] Updated photo:', updatedPhoto)
        return updatedPhoto
      }
    } catch (error) {
      console.error(`❌ Failed to update photo ${id}:`, error.message)
      throw new Error(handleAxiosError(error))
    }
  },

  // 사진 삭제 (단일 또는 다중 삭제 지원)
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

      if (isNetworkEnabled('photos')) {
        if (isArray) {
          // 다중 삭제
          const results = await Promise.allSettled(
            ids.map(async (id) => {
              try {
                const response = await axios.delete(`${PHOTOS_API_URL}/${id}`)
                return { success: true, id, data: response.data }
              } catch (error) {
                console.error(`❌ Failed to delete photo ${id}:`, error.message)
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
            console.warn('⚠️ Some photos failed to delete:', failedIds)
          }
          
          return successfulIds
        } else {
          // 단일 삭제
          const response = await axios.delete(`${PHOTOS_API_URL}/${idOrIds}`)
          return { success: true, id: idOrIds, data: response.data }
        }
      } else {
        // 로컬 모드
        if (isArray) {
          console.log('🗑️ [Local Mode] Bulk deleted photos with ids:', ids)
          return ids
        } else {
          console.log('🗑️ [Local Mode] Deleted photo with id:', idOrIds)
          return { success: true, id: idOrIds }
        }
      }
    } catch (error) {
      console.error('❌ Delete operation failed:', error.message)
      throw error
    }
  }
}
