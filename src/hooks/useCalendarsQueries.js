import { useQuery, useMutation } from '@tanstack/react-query'
import { calendarApi } from '../api/calendarApi'
import { handleReactQueryError } from '../utils/handleAxiosError'
import { invalidateQueries } from '../config/reactQueryConfig'
import { queryClient } from '../main'
import useNotificationStore from '../store/useNotificationStore'
import { useCalendarClearChecked } from '../store/useCalendarStore'

/**
 * Calendar React Query 커스텀 훅 모음
 * QueryKey Factory 패턴과 최적화된 캐시 관리
 */

// QueryKey Factory 패턴
export const calendarKeys = {
  all: () => ["calendars"],
  list: (filters = {}) => [...calendarKeys.all(), "list", filters],
  detail: (id) => [...calendarKeys.all(), "detail", id],
  byDateRange: (startDate, endDate) => [...calendarKeys.all(), "dateRange", startDate, endDate],
  byType: (type) => [...calendarKeys.all(), "type", type],
}

/**
 * 캘린더 목록 조회 훅
 * @returns {QueryResult} React Query 결과 객체
 */
export const useCalendarsQuery = () => {
  const { showError } = useNotificationStore()
  
  return useQuery({
    queryKey: calendarKeys.list(),
    queryFn: calendarApi.getAll,
    staleTime: 5 * 60 * 1000, // 5분
    cacheTime: 10 * 60 * 1000, // 10분
    onError: (error) => {
      showError(handleReactQueryError(error, '캘린더 목록 조회'))
    }
  })
}

/**
 * 단일 캘린더 일정 조회 훅
 * @param {string|number} id - 캘린더 일정 ID
 * @returns {QueryResult} React Query 결과 객체
 */
export const useCalendarQuery = (id) => {
  const { showError } = useNotificationStore()
  
  return useQuery({
    queryKey: calendarKeys.detail(id),
    queryFn: () => calendarApi.getById(id),
    enabled: !!id && id !== 'new',
    staleTime: 5 * 60 * 1000, // 5분
    cacheTime: 10 * 60 * 1000, // 10분
    onError: (error) => {
      showError(handleReactQueryError(error, '캘린더 일정 조회'))
    }
  })
}

/**
 * 날짜 범위별 캘린더 일정 조회 훅
 * @param {string} startDate - 시작 날짜
 * @param {string} endDate - 종료 날짜
 * @returns {QueryResult} React Query 결과 객체
 */
export const useCalendarsByDateRangeQuery = (startDate, endDate) => {
  const { showError } = useNotificationStore()
  
  return useQuery({
    queryKey: calendarKeys.byDateRange(startDate, endDate),
    queryFn: () => calendarApi.getByDateRange(startDate, endDate),
    enabled: !!startDate && !!endDate,
    staleTime: 2 * 60 * 1000, // 2분
    cacheTime: 5 * 60 * 1000, // 5분
    onError: (error) => {
      showError(handleReactQueryError(error, '날짜별 캘린더 조회'))
    }
  })
}

/**
 * 타입별 캘린더 일정 조회 훅
 * @param {string} type - 캘린더 일정 타입
 * @returns {QueryResult} React Query 결과 객체
 */
export const useCalendarsByTypeQuery = (type) => {
  const { showError } = useNotificationStore()
  
  return useQuery({
    queryKey: calendarKeys.byType(type),
    queryFn: () => calendarApi.getByType(type),
    enabled: !!type,
    staleTime: 5 * 60 * 1000, // 5분
    cacheTime: 10 * 60 * 1000, // 10분
    onError: (error) => {
      showError(handleReactQueryError(error, '타입별 캘린더 조회'))
    }
  })
}

/**
 * 캘린더 일정 추가 뮤테이션 훅
 * @returns {MutationResult} React Query 뮤테이션 결과 객체
 */
export const useAddCalendarMutation = () => {
  const { showSuccess, showError } = useNotificationStore()
  
  return useMutation({
    mutationFn: calendarApi.create,
    onSuccess: (data) => {
      showSuccess('새 일정이 추가되었습니다.')
      
      // 캐시 무효화 및 업데이트
      invalidateQueries.listByEntity('calendars')
      queryClient.setQueryData(calendarKeys.detail(data.id), data)
      
      // 관련된 쿼리들도 무효화
      queryClient.invalidateQueries({ queryKey: calendarKeys.all() })
    },
    onError: (error) => {
      showError(handleReactQueryError(error, '캘린더 일정 추가'))
    }
  })
}

/**
 * 캘린더 일정 수정 뮤테이션 훅
 * @returns {MutationResult} React Query 뮤테이션 결과 객체
 */
export const useUpdateCalendarMutation = () => {
  const { showSuccess, showError } = useNotificationStore()
  
  return useMutation({
    mutationFn: ({ id, data }) => calendarApi.update(id, data),
    onSuccess: (data, variables) => {
      showSuccess('일정이 성공적으로 수정되었습니다.')
      
      // 캐시 업데이트
      invalidateQueries.listByEntity('calendars')
      invalidateQueries.detailByEntity('calendars', variables.id)
      queryClient.setQueryData(calendarKeys.detail(variables.id), data)
      
      // 관련된 쿼리들도 무효화
      queryClient.invalidateQueries({ queryKey: calendarKeys.all() })
    },
    onError: (error) => {
      showError(handleReactQueryError(error, '캘린더 일정 수정'))
    }
  })
}

/**
 * 캘린더 일정 다중 삭제 뮤테이션 훅
 * @returns {MutationResult} React Query 뮤테이션 결과 객체
 */
export const useDeleteCalendarsMutation = () => {
  const { showSuccess, showError } = useNotificationStore()
  const clearChecked = useCalendarClearChecked()
  
  return useMutation({
    mutationFn: calendarApi.delete,
    onSuccess: (results) => {
      const successCount = results.filter(result => result.success).length
      const failCount = results.length - successCount
      
      if (successCount > 0) {
        showSuccess(`${successCount}개의 일정이 삭제되었습니다.`)
        
        // 캐시 무효화
        invalidateQueries.listByEntity('calendars')
        clearChecked()
        
        // 모든 관련 쿼리 무효화
        queryClient.invalidateQueries({ queryKey: calendarKeys.all() })
      }
      
      if (failCount > 0) {
        showError(`${failCount}개의 일정 삭제에 실패했습니다.`)
      }
    },
    onError: (error) => {
      showError(handleReactQueryError(error, '캘린더 일정 삭제'))
    }
  })
}

/**
 * 단일 캘린더 일정 삭제 뮤테이션 훅
 * @returns {MutationResult} React Query 뮤테이션 결과 객체
 */
export const useDeleteCalendarMutation = () => {
  const { showSuccess, showError } = useNotificationStore()
  
  return useMutation({
    mutationFn: (id) => calendarApi.delete(id),
    onSuccess: (results, id) => {
      const result = results[0] 
      
      if (result?.success) {
        showSuccess('일정이 삭제되었습니다.')
        
        // 캐시에서 제거
        queryClient.removeQueries({ queryKey: calendarKeys.detail(id) })
        invalidateQueries.listByEntity('calendars')
        
        // 모든 관련 쿼리 무효화
        queryClient.invalidateQueries({ queryKey: calendarKeys.all() })
      } else {
        showError('일정 삭제에 실패했습니다.')
      }
    },
    onError: (error) => {
      showError(handleReactQueryError(error, '캘린더 일정 삭제'))
    }
  })
}
