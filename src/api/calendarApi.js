import axios from 'axios'
import { isNetworkEnabled, loadLocalData, findLocalDataById } from '../utils/dataSourceManager'

// API URL 설정
const API_URL = 'https://jsonplaceholder.typicode.com/events'

/**
 * Calendar API 함수들
 * axios 기반 HTTP 클라이언트 사용
 * dataSourceManager를 통한 네트워크/로컬 데이터 자동 전환
 */
export const calendarApi = {
  /**
   * 모든 캘린더 일정 조회
   * @returns {Promise<Array>} 캘린더 일정 배열
   */
  getAll: async () => {
    if (isNetworkEnabled('calendars')) {
      try {
        const response = await axios.get(API_URL)
        return response.data
      } catch (error) {
        console.warn('네트워크 요청 실패, 로컬 데이터로 전환:', error.message)
        return await loadLocalData('calendars')
      }
    } else {
      return await loadLocalData('calendars')
    }
  },

  /**
   * 특정 캘린더 일정 조회
   * @param {string|number} id - 캘린더 일정 ID
   * @returns {Promise<Object>} 캘린더 일정 객체
   */
  getById: async (id) => {
    if (isNetworkEnabled('calendars')) {
      try {
        const response = await axios.get(`${API_URL}/${id}`)
        return response.data
      } catch (error) {
        console.warn('네트워크 요청 실패, 로컬 데이터로 전환:', error.message)
        return await findLocalDataById('calendars', id)
      }
    } else {
      return await findLocalDataById('calendars', id)
    }
  },

  /**
   * 새 캘린더 일정 생성
   * @param {Object} data - 생성할 캘린더 일정 데이터
   * @returns {Promise<Object>} 생성된 캘린더 일정 객체
   */
  create: async (data) => {
    if (isNetworkEnabled('calendars')) {
      try {
        const response = await axios.post(API_URL, {
          ...data,
          id: Date.now(), // 임시 ID 생성
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        })
        return response.data
      } catch (error) {
        console.warn('네트워크 요청 실패, 로컬 모드로 전환:', error.message)
        const newCalendar = {
          id: Date.now(),
          ...data,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }
        console.log('📅 [Local Mode] Created calendar:', newCalendar)
        return newCalendar
      }
    } else {
      const newCalendar = {
        id: Date.now(),
        ...data,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
      console.log('📅 [Local Mode] Created calendar:', newCalendar)
      return newCalendar
    }
  },

  /**
   * 캘린더 일정 수정
   * @param {string|number} id - 수정할 캘린더 일정 ID
   * @param {Object} data - 수정할 데이터
   * @returns {Promise<Object>} 수정된 캘린더 일정 객체
   */
  update: async (id, data) => {
    if (isNetworkEnabled('calendars')) {
      try {
        const response = await axios.put(`${API_URL}/${id}`, {
          ...data,
          id,
          updatedAt: new Date().toISOString()
        })
        return response.data
      } catch (error) {
        console.warn('네트워크 요청 실패, 로컬 모드로 전환:', error.message)
        const updatedCalendar = {
          id,
          ...data,
          updatedAt: new Date().toISOString()
        }
        console.log('✏️ [Local Mode] Updated calendar:', updatedCalendar)
        return updatedCalendar
      }
    } else {
      const updatedCalendar = {
        id,
        ...data,
        updatedAt: new Date().toISOString()
      }
      console.log('✏️ [Local Mode] Updated calendar:', updatedCalendar)
      return updatedCalendar
    }
  },

  /**
   * 캘린더 일정 삭제 (단일 또는 다중)
   * @param {string|number|Array} ids - 삭제할 캘린더 일정 ID(들)
   * @returns {Promise<Array>} 삭제 결과 배열
   */
  delete: async (ids) => {
    const idsArray = Array.isArray(ids) ? ids : [ids]
    
    if (isNetworkEnabled('calendars')) {
      const results = await Promise.allSettled(
        idsArray.map(async (id) => {
          try {
            await axios.delete(`${API_URL}/${id}`)
            return { id, success: true }
          } catch (error) {
            console.error(`캘린더 일정 ${id} 삭제 실패:`, error.message)
            return { id, success: false, error: error.message }
          }
        })
      )
      
      return results.map(result => 
        result.status === 'fulfilled' 
          ? result.value 
          : { id: null, success: false, error: result.reason?.message || '알 수 없는 오류' }
      )
    } else {
      console.log('🗑️ [Local Mode] Deleted calendars:', idsArray)
      return idsArray.map(id => ({ id, success: true }))
    }
  },

  /**
   * 날짜 범위별 캘린더 일정 조회
   * @param {string} startDate - 시작 날짜 (YYYY-MM-DD)
   * @param {string} endDate - 종료 날짜 (YYYY-MM-DD)
   * @returns {Promise<Array>} 해당 기간의 캘린더 일정 배열
   */
  getByDateRange: async (startDate, endDate) => {
    try {
      const allCalendars = await calendarApi.getAll()
      
      return allCalendars.filter(calendar => {
        const calendarDate = new Date(calendar.date).toISOString().split('T')[0]
        return calendarDate >= startDate && calendarDate <= endDate
      })
    } catch (error) {
      console.error('날짜 범위별 캘린더 조회 실패:', error)
      throw error
    }
  },

  /**
   * 특정 타입의 캘린더 일정 조회
   * @param {string} type - 캘린더 일정 타입 (meeting, task, personal, event, reminder)
   * @returns {Promise<Array>} 해당 타입의 캘린더 일정 배열
   */
  getByType: async (type) => {
    try {
      const allCalendars = await calendarApi.getAll()
      return allCalendars.filter(calendar => calendar.type === type)
    } catch (error) {
      console.error('타입별 캘린더 조회 실패:', error)
      throw error
    }
  }
}
