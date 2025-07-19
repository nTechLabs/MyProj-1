import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { usersApi } from '../api/usersApi'
import { handleAxiosError } from '../utils/handleAxiosError'
import { createQueryOptions, createMutationOptions } from '../config/reactQueryConfig'
import useNotificationStore from '../store/useNotificationStore'
import useCheckedStore from '../store/useCheckedStore'

/**
 * Users QueryKey Factory Pattern
 * 일관된 쿼리 키 관리를 위한 팩토리 함수들
 */
export const usersKeys = {
  all: ['users'],
  lists: () => [...usersKeys.all, 'list'],
  list: (filters) => [...usersKeys.lists(), filters],
  details: () => [...usersKeys.all, 'detail'],
  detail: (id) => [...usersKeys.details(), id],
}

/**
 * Users 목록을 조회하는 React Query 훅
 * @param {Object} options - React Query 옵션들
 */
export const useUsersQuery = (options = {}) => {
  const { showError } = useNotificationStore()

  return useQuery({
    queryKey: usersKeys.lists(),
    queryFn: usersApi.getAll,
    ...createQueryOptions({
      onError: (error) => {
        const errorMessage = handleAxiosError(error)
        showError(`사용자 목록을 불러오는데 실패했습니다: ${errorMessage}`)
      },
      ...options
    })
  })
}

/**
 * 특정 User를 조회하는 React Query 훅
 * @param {string|number} id - User ID
 * @param {Object} options - React Query 옵션들
 */
export const useUserQuery = (id, options = {}) => {
  const { showError } = useNotificationStore()

  return useQuery({
    queryKey: usersKeys.detail(id),
    queryFn: () => usersApi.getById(id),
    enabled: !!id && id !== 'new', // id가 있고 'new'가 아닐 때만 실행
    ...createQueryOptions({
      onError: (error) => {
        const errorMessage = handleAxiosError(error)
        showError(`사용자 정보를 불러오는데 실패했습니다: ${errorMessage}`)
      },
      ...options
    })
  })
}

/**
 * 여러 Users를 삭제하는 React Query 뮤테이션 훅
 */
export const useDeleteUsersMutation = () => {
  const queryClient = useQueryClient()
  const { showSuccess, showError } = useNotificationStore()
  const { clearChecked } = useCheckedStore()

  return useMutation({
    mutationFn: usersApi.deleteMultiple,
    ...createMutationOptions({
      onSuccess: (results) => {
        const successCount = results.filter(result => result.success).length
        const failCount = results.length - successCount
        
        if (successCount > 0) {
          showSuccess(`${successCount}개의 사용자가 삭제되었습니다.`)
          
          // 쿼리 캐시 무효화
          queryClient.invalidateQueries({ queryKey: usersKeys.lists() })
          
          // 선택된 항목들 초기화
          clearChecked()
        }
        
        if (failCount > 0) {
          showError(`${failCount}개의 사용자 삭제에 실패했습니다.`)
        }
      },
      onError: (error) => {
        const errorMessage = handleAxiosError(error)
        showError(`사용자 삭제에 실패했습니다: ${errorMessage}`)
      }
    })
  })
}

/**
 * 새 User를 추가하는 React Query 뮤테이션 훅
 */
export const useAddUserMutation = () => {
  const queryClient = useQueryClient()
  const { showSuccess, showError } = useNotificationStore()

  return useMutation({
    mutationFn: usersApi.create,
    ...createMutationOptions({
      onSuccess: (data) => {
        showSuccess('새 사용자가 추가되었습니다.')
        
        // 쿼리 캐시 무효화
        queryClient.invalidateQueries({ queryKey: usersKeys.lists() })
        
        // 새로 생성된 사용자를 캐시에 추가
        queryClient.setQueryData(usersKeys.detail(data.id), data)
      },
      onError: (error) => {
        const errorMessage = handleAxiosError(error)
        showError(`사용자 추가에 실패했습니다: ${errorMessage}`)
      }
    })
  })
}

/**
 * User를 수정하는 React Query 뮤테이션 훅
 */
export const useUpdateUserMutation = () => {
  const queryClient = useQueryClient()
  const { showSuccess, showError } = useNotificationStore()

  return useMutation({
    mutationFn: ({ id, data }) => usersApi.update(id, data),
    ...createMutationOptions({
      onSuccess: (data, variables) => {
        showSuccess('사용자 정보가 수정되었습니다.')
        
        // 관련 쿼리들 무효화
        queryClient.invalidateQueries({ queryKey: usersKeys.lists() })
        queryClient.invalidateQueries({ queryKey: usersKeys.detail(variables.id) })
        
        // 수정된 사용자를 캐시에 업데이트
        queryClient.setQueryData(usersKeys.detail(variables.id), data)
      },
      onError: (error) => {
        const errorMessage = handleAxiosError(error)
        showError(`사용자 정보 수정에 실패했습니다: ${errorMessage}`)
      }
    })
  })
}
