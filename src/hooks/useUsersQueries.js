import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { usersApi } from '../api/usersApi'
import { handleReactQueryError } from '../utils/handleAxiosError'
import { createQueryOptions, createMutationOptions, invalidateQueries } from '../config/reactQueryConfig'
import useNotificationStore from '../store/useNotificationStore'
import { useUsersClearChecked } from '../store/useUsersCheckedStore'

/**
 * Users QueryKey Factory Pattern (최적화)
 */
export const usersKeys = {
  all: () => ["users"],
  list: (filters = {}) => [...usersKeys.all(), "list", filters],
  detail: (id) => [...usersKeys.all(), "detail", id],
}

/**
 * Users 목록 조회 훅 (최적화)
 */
export const useUsersQuery = () => {
  const { showError } = useNotificationStore()

  return useQuery({
    queryKey: usersKeys.list(),
    queryFn: usersApi.getAll,
    ...createQueryOptions({
      onError: (error) => {
        showError(handleReactQueryError(error, '사용자 목록 조회'))
      }
    })
  })
}

/**
 * 특정 User 조회 훅 (최적화)
 */
export const useUserQuery = (id) => {
  const { showError } = useNotificationStore()

  return useQuery({
    queryKey: usersKeys.detail(id),
    queryFn: () => usersApi.getById(id),
    enabled: !!id && id !== 'new',
    ...createQueryOptions({
      onError: (error) => {
        showError(handleReactQueryError(error, '사용자 정보 조회'))
      }
    })
  })
}

/**
 * 다중 Users 삭제 뮤테이션 훅 (최적화)
 */
export const useDeleteUsersMutation = () => {
  const queryClient = useQueryClient()
  const { showSuccess, showError } = useNotificationStore()
  const clearChecked = useUsersClearChecked()

  return useMutation({
    mutationFn: usersApi.deleteMultiple,
    ...createMutationOptions({
      onSuccess: (results) => {
        const successCount = results.filter(result => result.success).length
        const failCount = results.length - successCount
        
        if (successCount > 0) {
          showSuccess(`${successCount}개의 사용자가 삭제되었습니다.`)
          invalidateQueries.listByEntity('users')
          clearChecked()
        }
        
        if (failCount > 0) {
          showError(`${failCount}개의 사용자 삭제에 실패했습니다.`)
        }
      },
      onError: (error) => {
        showError(handleReactQueryError(error, '사용자 삭제'))
      }
    })
  })
}

/**
 * User 추가 뮤테이션 훅 (최적화)
 */
export const useAddUserMutation = () => {
  const queryClient = useQueryClient()
  const { showSuccess, showError } = useNotificationStore()

  return useMutation({
    mutationFn: usersApi.create,
    ...createMutationOptions({
      onSuccess: (data) => {
        showSuccess('새 사용자가 추가되었습니다.')
        invalidateQueries.listByEntity('users')
        queryClient.setQueryData(usersKeys.detail(data.id), data)
      },
      onError: (error) => {
        showError(handleReactQueryError(error, '사용자 추가'))
      }
    })
  })
}

/**
 * User 수정 뮤테이션 훅 (최적화)
 */
export const useUpdateUserMutation = () => {
  const queryClient = useQueryClient()
  const { showSuccess, showError } = useNotificationStore()

  return useMutation({
    mutationFn: ({ id, data }) => usersApi.update(id, data),
    ...createMutationOptions({
      onSuccess: (data, variables) => {
        showSuccess('사용자 정보가 수정되었습니다.')
        invalidateQueries.listByEntity('users')
        invalidateQueries.detailByEntity('users', variables.id)
        queryClient.setQueryData(usersKeys.detail(variables.id), data)
      },
      onError: (error) => {
        showError(handleReactQueryError(error, '사용자 정보 수정'))
      }
    })
  })
}
